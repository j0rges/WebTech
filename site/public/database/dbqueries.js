"use strict"
var sqlite = require("sqlite");
var db;

logPosts();

async function logPosts() {
  try {
    db = await sqlite.open("./db.sqlite");
    var as = await GetPostsWithDestinationAndUsernames();
    console.log(as); // Access
  } catch (e) { console.log(e); }
}

async function GetPostsWithDestinationAndUsernames(){
  return await db.all("select * from posts " +
                        "join destinations using (locationID) " +
                        "join profiles using (username)");
}

async function GetPostsByDestination(_destination){
  try{
    db = await sqlite.open("./db.sqlite");
    // await db.all("select profiles.name from posts " +
    //                       "join destinations using (locationID) " +
    //                       "join profiles using (username)"); //+
    //                       //"where destination.location =" + _destination);
    let sql = "select profiles.name username from posts " +
                          "join destinations using (locationID) " +
                          "join profiles using (username)";

    await db.all(sql, [], results);

    function results(err, rows){
      if (err) {
        throw err;
      }
      rows.forEach(logUsername);
      function logUsername(row){ console.log(row.username);}
      //return row.username;
    }
  }catch (e) { console.log(e); }
}
