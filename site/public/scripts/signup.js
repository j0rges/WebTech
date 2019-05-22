"use strict";

function sendUser() {
  console.log("In function sendUser");
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("signupform").innerHTML = this.responseText;
    }
  };
  var url = "/post/signup";
  request.open("POST", url);
  request.send();
}