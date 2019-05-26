"use strict"
const sqlite = require("sqlite");
var db;

async function openDB(path) {
  db = await sqlite.open(path);
}

async function closeDB() {
  await db.close();
}

// This will query all the posts and log them.
async function logPosts() {
  try {
    let as = await db.all("SELECT * FROM posts JOIN destinations USING (locationID)");
    console.log(as); // Access
  } catch (e) { console.log(e); }
}

// Returns all the posts with a given destination.
async function GetPostsByDestination(destination){
  let r;
  try{
    let sql = "SELECT * FROM posts JOIN destinations using (locationID) WHERE location = ?";
    r = await db.all(sql,[destination]);
  }catch (e) { console.log(e); }

  return r;
}

// Add a new user to the profiles table.
async function insertUser(username, email, password) {
  return await db.run("INSERT into users values (?,?,?)", [username, email, password]);
}

async function getUser(email) {
  return await db.all("SELECT * FROM users WHERE email=?", email);
}

async function insertPost(body){
  try {
    let place = body.location;
    place = place[0].toUpperCase() + place.substring(1);
    let locationID = await db.get("SELECT locationID FROM destinations WHERE location = ?",place);
    if (locationID == undefined) {
      let ans = await db.run("insert into destinations (location) values (?)",place);
      locationID = ans.lastID;
    }
    else {
      locationID = locationID.locationID;
    }
    await db.run("insert into posts (locationID,username,title,text,imagePath) values (?,?,?,?,?)",locationID,body.username,body.title,body.content);
  } catch (e) {
    console.log(e);
  }
  //let stmt = db.prepare("insert into posts values (locationID=?,username=?,title=?,text=?,imagePath=?)");
  //assume the location is madrid for now.
  //await stmt.run(3,body.username,body.title,body.content);
  //stmt.finalize();

}

module.exports = {
  openDB : openDB,
  closeDB : closeDB,
  GetPostsByDestination : GetPostsByDestination,
  insertPost : insertPost,
  insertUser : insertUser,
  getUser : getUser
};
