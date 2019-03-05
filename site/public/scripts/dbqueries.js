"use strict"
var sqlite = require("sqlite");
var db;

async function logPosts() {
  try {
    db = await sqlite.open("./db.sqlite");
    var as = GetPostsWithDestinationAndUsernames();
    console.log(as); // Access
  } catch (e) { console.log(e); }
}

async function GetPostsWithDestinationAndUsernames(){
  return await db.all("select * from posts " +
                        "join destinations using (locationID) " +
                        "join profiles using (username)");
}

async function GetPostsByDestination(_destination){
  db = await sqlite.open("./db.sqlite");
  // await db.all("select profiles.name from posts " +
  //                       "join destinations using (locationID) " +
  //                       "join profiles using (username)"); //+
  //                       //"where destination.location =" + _destination);
  let sql = "select profiles.name username from posts " +
                        "join destinations using (locationID) " +
                        "join profiles using (username)";

  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      console.log(row.username);
    });
    //return row.username;
  });
}
