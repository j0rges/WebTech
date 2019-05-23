"use strict";

function sendUser() {
  console.log("In function sendUser");
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200){
         //Change page to succesfully signed up
         console.log(this.responseText());
        //  this.responseText()
      }
      else {
        //Get response
        console.log(this.responseText());
      }
    }
  };
  var user = {
    "username": document.getElementById(username),
    "email": document.getElementById(email),
    "password": document.getElementById(password)
  }
  // Convert to json format
  //user = JSON.parse(user);
  console.log(user);
  var url = "/signup";
  request.open("POST", url, true);
  request.send(user);
}


