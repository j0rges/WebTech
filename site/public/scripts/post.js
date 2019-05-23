"use strict";

addEventListener('load',poststart);

function poststart() {
  //Should also put this for when submit is clicked. But checking that some
  //image has actually been selected.
  const b = document.querySelector("#loadButton");
  b.addEventListener("click",sendImage);
}

function sendImage(){
  //var reader = new FileReader();
  var file = document.getElementById('imageload').files[0];
  var request = new XMLHttpRequest();
  var url = "/put/" + file.name;
  request.open("put",url);
  request.send(file);

  /*reader.onload = function(event){
    console.log("here");
    request.send(event.target.result);
  };
  reader.readAsDataURL(file);*/
}
