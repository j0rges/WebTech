"use strict"

addEventListener('load',start);
start(){
  loadPost(["Jorge S-C ","Go to el retiro","madrid is great!"]);
}

function changeUsername(username){
  var element = document.getElementById("username");
  element.innerHTML = username;
}

/*
function loadPost(postData){
  var ids = ["username","title","content-text"];
  var element;
  for(var i = 0; i < ids.length; i++){
    var element = document.getElementById(ids[i]);
    element.innerHTML = postData[i];
  }
}
*/

function appendSearchResult(postData){
  // Create the section and
  var result = document.createElement("section");
  result.setAttribute("class","search-result")
}
