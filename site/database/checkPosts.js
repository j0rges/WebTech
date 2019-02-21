var sqlite = require("sqlite");
var db;
logPosts();

async function logPosts() {
  try {
    db = await sqlite.open("./db.sqlite");
    var as = await db.all("select * from posts " +
                          "join destinations using (locationID) " +
                          "join profiles using (username)");
    console.log(as);
  } catch (e) { console.log(e); }
}
