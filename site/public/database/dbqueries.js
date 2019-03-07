"use strict"
var sqlite = require("sqlite");
var db;

GetPostsByDestination("Madrid");

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

async function GetPostsByDestination(destination){
  try{
    db = await sqlite.open("./db.sqlite");

    let sql = "SELECT * FROM posts JOIN destinations using (locationID) WHERE location = ?";

    let r = await db.all(sql,[destination]);
    console.log(r);

  }catch (e) { console.log(e); }

  db.close();
}
