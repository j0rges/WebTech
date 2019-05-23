"use strict";

function poststart() {
  //Should also put this for when submit is clicked. But checking that some
  //image has actually been selected.
  const b = document.querySelector("#loadButton"); //where is loadButton id?
  b.addEventListener("click",sendImage);

  //send all info and if there is an image send it with them otherwise
  //send an empty slot to the image attribute.
}

function sendImage(){
  //var reader = new FileReader();
  var file = document.getElementById('imageload').files[0];
  if(!file) console.log("error no file chosen");
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
