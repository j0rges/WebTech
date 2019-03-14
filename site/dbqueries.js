"use strict"
let sqlite = require("sqlite");
var db;

patata();

async function patata(){
  try {
    await openDB("./db.sqlite");
    var posts = await GetPostsByDestination("Athens");
    console.log(posts);
  } catch (e) {
    console.log(e);
  }
  await closeDB();
}


async function openDB(path) {
  db = await sqlite.open(path);
}

async function closeDB() {
  await db.close();
}

async function logPosts() {
  try {
    let as = await db.all("SELECT * FROM posts JOIN destinations USING (locationID)");
    console.log(as); // Access
  } catch (e) { console.log(e); }
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
