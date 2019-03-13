"use strict"

addEventListener('load',script1start);

var postTemplate;

function script1start(){
  initButton();
  loadPosts("Madrid",true);
}

function initButton() {
  const b = document.querySelector("#myButton");
  b.addEventListener("click",c);
  function c(){
    appendSearchResult(["Jorge S-C ","Go to el retiro","madrid is great!"],postTemplate)
  }
}

function loadPosts(destination, getTemplate = false){
  // Substitute for getting the actual data from the server/database.
  var postData = ["Jorge S-C ","Go to el retiro","madrid is great!"];

  // Send request for the first 10 posts of that destination.
  var dataRequest = new XMLHttpRequest();
  dataRequest.onreadystatechange = deal;
  dataRequest.open("Get","searchresults?destination="+destination,true);
  dataRequest.send();
  function deal(){
    if (this.readyState != XMLHttpRequest.DONE) return;
    postData = this.responseText;
    console.log(postData);
  }
  if(getTemplate || postTemplate == null) {
    // Get the template from the server.
    var req = new XMLHttpRequest();
    req.onreadystatechange = receive;
    req.open("Get","resulttemplate.html",true);
    req.send();
    function receive(){
      if (this.readyState != XMLHttpRequest.DONE) return;
      postTemplate = this.responseText;
      appendSearchResult(postData, postTemplate);
    }
  }
  else{
    appendSearchResult(postData, postTemplate);
  }

}

// Given the data and the template append the corresponding post to the
// search result area.
function appendSearchResult(postData, template){
  // Create the section and give it the appropiate class.
  var result = document.createElement("section");
  result.setAttribute("class", "search-result")
  // put the template inside.
  result.innerHTML = template;
  // Load the post into the template.
  var ids = ["#username","#title","#content-text"];
  for(var i = 0; i < ids.length; i++){
    var element = result.querySelector(ids[i]);
    element.innerHTML = postData[i];
  }
  var resultArea = document.querySelector("#results-area");
  resultArea.appendChild(result);
  var newresult = result.cloneNode(true);
  newresult.querySelector("#username").innerHTML = "not Jorge! ";
  resultArea.appendChild(newresult);
}
