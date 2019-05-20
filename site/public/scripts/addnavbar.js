"use strict";

addEventListener('load',addNavBar);

function addNavBar() {
  var adrr = "/navbar.html"
  function callback(t){
    var navbar = document.createElement("nav");
    navbar.innerHTML = t;
    document.body.parentNode.insertBefore(navbar,document.body);
  }
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
