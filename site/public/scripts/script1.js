"use strict"
function changeUsername(username){
  var element = document.getElementById("username");
  element.innerHTML = username;
}

function loadPost(postData){
  var ids = ["username","title","content-text"];
  //var data = //write querry here.
  var element;
  for(var i = 0; i < ids.length; i++){
    var element = document.getElementById(ids[i]);
    element.innerHTML = postData[i];
  }
}

window.onload = function() {
  loadPost(["Jorge S-C ","Go to el retiro","madrid is great!"]);
}
