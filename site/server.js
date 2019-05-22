// Run a node.js web server for local development of a static web site.
// Start with "node server.js" and put pages in a "public" sub-folder.
// Visit the site at the address printed on the console.

// The server is configured to be platform independent.  URLs are made lower
// case, so the server is case insensitive even on Linux, and paths containing
// upper case letters are banned so that the file system is treated as case
// sensitive even on Windows.  All .html files are delivered as
// application/xhtml+xml for instant feedback on XHTML errors.  To improve the
// server, either add content negotiation (so old browsers can be tested) or
// switch to text/html and do validity checking another way (e.g. with vnu.jar).

// Choose a port, e.g. change the port to the default 80, if there are no
// privilege issues and port number 80 isn't already in use. Choose verbose to
// list banned files (with upper case letters) on startup.

let port = 8080;
let verbose = true;

// Load the library modules, and define the global constants.
// See http://en.wikipedia.org/wiki/List_of_HTTP_status_codes.
// Start the server:
const joi = require("joi"); //for validating request body
const { parseMultipart } = require("./multipart.js");
let http = require("http");
let fs = require("fs");
const { parse } = require('querystring');

// Include database functionality
let database = require("./db/dbqueries")
let OK = 200, NotFound = 404, BadType = 415, Error = 500, InvalidRequest = 400, SeeOther = 303;
let types, banned;

start();

// Start the http service. Accept only requests from localhost, for security.
async function start() {
    if (! checkSite()) return;
    types = defineTypes();
    banned = [];
    banUpperCase("./public/", "");
    let service = http.createServer(handle);
    service.listen(port, "localhost");
    let address = "http://localhost";
    if (port != 80) address = address + ":" + port;
    console.log("Server running at", address);
    // Start the database
    try {
      await database.openDB("./db/db.sqlite");
    } catch (e) {
      console.log(e);
    }
}

// Check that the site folder and index page exist.
function checkSite() {
    let path = "./public";
    let ok = fs.existsSync(path);
    if (ok) path = "./public/index.html";
    if (ok) ok = fs.existsSync(path);
    if (! ok) console.log("Can't find", path);
    return ok;
}

// Serve a request by delivering a file.
async function handle(request, response) {
  let url = request.url.toLowerCase();
  console.log(url);

  // Manipulate url to extract the keyWord
  let splitUrl = url.split('?')[0];
  let arraySplit = splitUrl.split('/');
  let keyWord = arraySplit[arraySplit.length -1];

  try{
    switch (request.method.toLowerCase()) {
      case "post":
        contentType = request.headers["content-type"].split(";")[0];

        if (contentType == 'application/x-www-form-urlencoded') {
          let promisedBody = new Promise(getBody);
          let body = await promisedBody;
          function getBody(resolve,reject){
            let body = '';
            request.on('data', add);
            function add(chunk) {body += chunk.toString();}
            request.on('end', endStuff);
            function endStuff(){
              body = parse(body);
              resolve(body);
            }
          }
          console.log(body);
          newPost(body);
          response.writeHead(SeeOther,
                             {location: '/search/?search=' + body.location})
          response.end();
        }
        else if (contentType == 'multipart/form-data'){
          handleMultipart(request, response);
        }
        else if (contentType == 'application/json'){
          console.log("signup functionality");
          // Check if url is ending like "/signup"
          if (arraySplit[arraySplit.length - 1] == "signup"){
            let promisedBody = new Promise(getBody);
            let body = await promisedBody;
            function getBody(resolve,reject){
              let body = '';
              request.on('data', add);
              function add(chunk) {body += chunk.toString();}
              request.on('end', endStuff);
              function endStuff(){
                body = JSON.parse(body);
                resolve(body);
              }
            }
            
            // Check if res has the correct format eg email, password and username in the object.

            const schema = {
              username: joi.string().required(),
              email: joi.string().email().required(),
              password: joi.string().min(5).required()
            }
            var result = joi.validate(body, schema);
            if (result.error){
              response.end(result.error.details[0].message);
              return;
            }
            
            console.log(body.username, body.password, body.email);
            userinfo = await database.insertUser(body.username, body.email, body.password);
            console.log(userinfo);
            response.end('user successfully created');
          }
        }
        else {
          console.log(request.headers);
          fail(response, BadType, "Content type not supported");
        }
        break;

      case "get":
        // Make a dicision about what kind of url in coming in
        if(keyWord == 'data'){
          await handleDataRequest(request, response);
        }
        else {
          handleFileRequest(request, response, splitUrl);
        }
        break;

      case "put":
        console.log(url);
        let body = '';
        request.on('data', add);
        function add(chunk) {body += chunk.toString();}
        request.on('end', endStuff);
        function endStuff(){o
          fs.writeFile("newimage.jpg", body, function (err) {
            if (err) throw err;
            console.log('Saved!');
          });
          response.end('ok');
        }
        break;

      default:
        fail(response, BadType, "Request method not supported by the server.");
    }
  } catch (e) {
    console.log(e);
    fail(response, Error, "Couldn't solve the request.")
  }
}

// Serve a request by delivering data from the database.
async function handleDataRequest(request, response) {

  let url = request.url.toLowerCase();
  let query = getQuery(url);

  // Try to get the data requested
  try {
    let data = "this is my default.";
    if(query[0][0] == "destination"){
      place = query[0][1]
      // Capitalize the first letter of the place.
      place = place[0].toUpperCase() + place.substring(1);
      data = await database.GetPostsByDestination(place);
      //console.log(data);
    }
    deliver(response,types["json"],false,JSON.stringify(data));
  } catch (e) {
    console.log(e);
    fail(response, NotFound, "Couldn't find the data requested.")
  }
}

// Serve a request that requires a file being delivered.
function handleFileRequest(request, response, url){
  if (url.endsWith("/")) url = url + "index.html";
  if (isBanned(url)) return fail(response, NotFound, "URL has been banned");
  let type = findType(url, request);
  if (type == null) return fail(response, BadType, "File type unsupported");
  let file = "./public" + url;
  fs.readFile(file, ready);
  function ready(err, content) { deliver(response, type, err, content); }
}

function handleMultipart(request, response) {

  boundary = request.headers["content-type"].split(";")[1];
  boundary = boundary.split("=")[1]

  let body = '';
  request.on('data', add);
  function add(chunk) {body += chunk.toString();}
  request.on('end', endStuff);
  function endStuff(){
    parts = parseMultipart(body);
    fs.writeFile(parts[2].filename, parts[2].content, function (err) {
      if (err) throw err;
      console.log('Saved!');
    });
    response.end('ok');
  }
}

async function newPost(body) {
  await database.insertPost(body);
}

function getQuery(url) {
  // Split url at ?
  let urlPieces = url.split("?");
  let query = urlPieces[1].split("&");

  for(var i = 0; i < query.length; i++) {
    query[i] = query[i].split("=");
  }
  return query;
}

// Forbid any resources which shouldn't be delivered to the browser.
function isBanned(url) {
    for (let i=0; i<banned.length; i++) {
        let b = banned[i];
        if (url.startsWith(b)) return true;
    }
    return false;
}

// Find the content type to respond with, or undefined.
// Do content negotiation too.
function findType(url, request) {
    let dot = url.lastIndexOf(".");
    let extension = url.substring(dot + 1);
    // Try to push xhtml if the browser accepts it.
    if (extension === "html"){
      let accepted = request.headers.accept.split(",")
      if(accepted.indexOf(types["xhtml"]) > -1){
        return types["xhtml"];
      }
    }
    return types[extension];
}

// Deliver the file that has been read in to the browser.
function deliver(response, type, err, content) {
    if (err) return fail(response, NotFound, "File not found");
    let typeHeader = { "Content-Type": type };
    response.writeHead(OK, typeHeader);
    response.write(content);
    response.end();
}

// Give a minimal failure response to the browser
function fail(response, code, text) {
    let textTypeHeader = { "Content-Type": "text/plain" };
    response.writeHead(code, textTypeHeader);
    response.write(text, "utf8");
    response.end();
}

// Check a folder for files/subfolders with non-lowercase names.  Add them to
// the banned list so they don't get delivered, making the site case sensitive,
// so that it can be moved from Windows to Linux, for example. Synchronous I/O
// is used because this function is only called during startup.  This avoids
// expensive file system operations during normal execution.  A file with a
// non-lowercase name added while the server is running will get delivered, but
// it will be detected and banned when the server is next restarted.
function banUpperCase(root, folder) {
    let folderBit = 1 << 14;
    let names = fs.readdirSync(root + folder);
    for (let i=0; i<names.length; i++) {
        let name = names[i];
        let file = folder + "/" + name;
        if (name != name.toLowerCase()) {
            if (verbose) console.log("Banned:", file);
            banned.push(file.toLowerCase());
        }
        let mode = fs.statSync(root + file).mode;
        if ((mode & folderBit) == 0) continue;
        banUpperCase(root, file);
    }
}

// The most common standard file extensions are supported, and html is
// delivered as "application/xhtml+xml".  Some common non-standard file
// extensions are explicitly excluded.  This table is defined using a function
// rather than just a global variable, because otherwise the table would have
// to appear before calling start().  NOTE: add entries as needed or, for a more
// complete list, install the mime module and adapt the list it provides.
function defineTypes() {
    let types = {
        html : "text/html",
        css  : "text/css",
        js   : "application/javascript",
        mjs  : "application/javascript", // for ES6 modules
        png  : "image/png",
        gif  : "image/gif",    // for images copied unchanged
        jpeg : "image/jpeg",   // for images copied unchanged
        jpg  : "image/jpeg",   // for images copied unchanged
        svg  : "image/svg+xml",
        json : "application/json",
        pdf  : "application/pdf",
        txt  : "text/plain",
        ttf  : "application/x-font-ttf",
        woff : "application/font-woff",
        aac  : "audio/aac",
        mp3  : "audio/mpeg",
        mp4  : "video/mp4",
        webm : "video/webm",
        ico  : "image/x-icon", // just for favicon.ico
        xhtml: "application/xhtml+xml",      // non-standard, use .html
        htm  : undefined,      // non-standard, use .html
        rar  : undefined,      // non-standard, platform dependent, use .zip
        doc  : undefined,      // non-standard, platform dependent, use .pdf
        docx : undefined,      // non-standard, platform dependent, use .pdf
    }
    return types;
}
