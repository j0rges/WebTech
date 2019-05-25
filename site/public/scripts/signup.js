Cookies.set("ieat", "true", {expires:1});

var myCookie = Cookies.get("ieat");

var element = document.getElementById("title");

if(myCookie){
  element.innerHTML = "Cookies!"
}