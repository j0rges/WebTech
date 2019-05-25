Cookies.set("ieat", "true", {expires:1});

var myCookie = Cookies.get("ieat");

var title = document.querySelector("h1");

if(myCookie){
  console.log("cookie!")
}

function changeNavbar() {
  // Change the navigation bar
  getTemplate("../navbar.html",c);
  function c(template){
    var resultArea = document.querySelector("#results-area");
    resultArea.innerHTML= template;
    document.querySelector("#postLocation").value = pageDestination;
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