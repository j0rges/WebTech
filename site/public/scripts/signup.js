"use strict";

function sendUser() {
  console.log("In function sendUser");
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200){
         //Change page to succesfully signed up
         this.responseText
      }
      else {
        //Get response
      }
    }
  };
  var bodysend = {
    username: document.getElementById(),
    email: ,
    password: 
  }
  // Convert to json format
  var url = "/post/signup";
  request.open("POST", url);
  //request.send(body);
}


