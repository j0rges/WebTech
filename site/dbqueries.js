"use strict"
var sqlite = require("sqlite");
var db;

/*
async function patata(){
  try {
    await opendb("./db.sqlite");
    var posts = await GetPostsByDestination("Madrid");
    console.log(posts);
  } catch (e) {
    console.log(e);
  }
  await closeDB();
}
*/

async function openDB(path) {
  db = await sqlite.open(path);
}

async function closeDB() {
  await db.close();
}

async function logPosts() {
  try {
    let as = await GetPostsWithDestinationAndUsernames();
    console.log(as); // Access
  } catch (e) { console.log(e); }
}

async function GetPostsWithDestinationAndUsernames(){
  return await db.all("select * from posts " +
                        "join destinations using (locationID) " +
                        "join profiles using (username)");
}

async function GetPostsByDestination(destination){
  let r;
  try{

    let sql = "SELECT * FROM posts JOIN destinations using (locationID) WHERE location = ?";
    r = await db.all(sql,[destination]);

  }catch (e) { console.log(e); }

  return r;
}

module.exports = {
  openDB : openDB,
  closeDB : closeDB,
  GetPostsByDestination : GetPostsByDestination
};
