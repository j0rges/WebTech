"use strict";

function poststart() {
  const b = document.querySelector("#loadButton");
  b.addEventListener("click",sendUser);
}

function sendUser(){
  var reader = new FileReader();
  var file = document.getElementById('imageload').files[0];
  if(!file) console.log("error no file chosen");
  var request = new XMLHttpRequest();
  var url = "/put/" + file.name;
  request.open("put",url);

  reader.onload = function(event){
    console.log("here");
    request.send(event.target.result);
  };
  reader.readAsDataURL(file);
}