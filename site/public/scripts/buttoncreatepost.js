"use strict";

function initButton() {
  const b = document.querySelector("#newPostButton");
  b.addEventListener("click",newPost);
}

function newPost() {
  // Change the results for the new post form.
  getTemplate("../search/postform.html",c);
  function c(template){
    var resultArea = document.querySelector("#results-area");
    resultArea.innerHTML= template;
  }
}

function getTemplate(adrr,callback) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = receive;
    req.open("Get",adrr,true);
    req.send();
    var template;
    function receive(){
      if (this.readyState != XMLHttpRequest.DONE) return;
      template = this.responseText;
      callback(template);
    }
  }