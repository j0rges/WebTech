var sqlite = require("sqlite");
var db;
create();

async function create() {
    try {
        db = await sqlite.open("./db.sqlite");
        await db.run("pragma foreign_keys = on");

        await db.run("create table destinations (locationID primary key, location)");
        await db.run("create table profiles (username primary key, name)");
        await db.run("create table posts (postID, locationID, username, title, text, imagePath," +
                     "foreign key(locationID) references destinations(locationID), " +
                     "foreign key(username) references profiles(username))");

        await db.run("insert into destinations  values (1,'Athens')");
        await db.run("insert into destinations values (2,'Bristol')");
        await db.run("insert into destinations values (3,'Madrid')");

        await db.run("insert into profiles values ('KonstantinaPs','Konstantina Psoma')");
        await db.run("insert into profiles values ('JorgeSc','Jorge Sanchez-Cano')");

        await db.run("insert into posts values (1,1,'KonstantinaPs','Summer in Athens','Really hot at summer time but really beautiful as well.','')");
        await db.run("insert into posts values (2,3,'JorgeSc','An afternoon in Madrid','I recommend going to the Retiro to have a nice afternoon outside.', '../public/images/alev-takil.png')");
    } catch (e) { console.log(e); }
}
