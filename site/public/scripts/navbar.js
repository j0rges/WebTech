{/* <script src="https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js"></script> */}
Cookies.set("sessioncookie", "true", {expires:1});

var myCookie = Cookies.get("sessioncookie");

var element = document.getElementById("account");

if(myCookie){
  element.innerHTML = "Username";
}