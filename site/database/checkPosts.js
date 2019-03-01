"use strict"
var sqlite = require("sqlite");
var db;
logPosts();

async function logPosts() {
  try {
    db = await sqlite.open("./db.sqlite");
    var as = GetPostsWithDestinationAndUsernames();
    console.log(as); // Access them by console.log(as[0].username);
  } catch (e) { console.log(e); }
}
