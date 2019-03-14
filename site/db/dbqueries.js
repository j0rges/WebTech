"use strict"
const sqlite = require("sqlite");
var db;

/*
patata();

async function patata(){
  try {
    await openDB("./db/db.sqlite");
    //var posts = await GetPostsByDestination("Athens");
    await newUser("EmilyC","Emily Clarke");
    let posts = await db.all("SELECT * FROM profiles");
    console.log(posts);
  } catch (e) {
    console.log(e);
  }
  await closeDB();
}*/


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

// add a new user to the profiles table.
async function newUser(username,name) {
  try {
    await db.run("INSERT into profiles values (?,?)",[username,name]);
  } catch (e) {console.log(e);}
}

module.exports = {
  openDB : openDB,
  closeDB : closeDB,
  GetPostsByDestination : GetPostsByDestination
};
