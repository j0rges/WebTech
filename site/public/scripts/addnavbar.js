"use strict";

addEventListener('load',addNavBar);

var script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js";
document.head.appendChild(script);

function addNavBar() {
  var adrr = "/navbar.html"
  function callback(t){
    var navbar = document.createElement("nav");
    navbar.innerHTML = t;
    document.body.parentNode.insertBefore(navbar,document.body);
    var myCookie = Cookies.get("username");
    console.log(myCookie);
    var element = document.getElementById("account");

    if(myCookie){
      element.innerHTML = myCookie;
    }
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
