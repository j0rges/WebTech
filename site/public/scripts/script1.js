"use strict"

addEventListener('load',script1start);

var postTemplate;

function script1start(){
  initButton();
  getTemplate("resulttemplate.html",c);
  function c(result) {
    postTemplate = result;
    loadPosts("Madrid");
  }
}

function initButton() {
  const b = document.querySelector("#myButton");
  b.addEventListener("click",c);
  function c(){
    appendSearchResult(["Jorge S-C ","Go to el retiro","madrid is great!"],postTemplate)
  }
}

function loadPosts(destination){
  // Substitute for getting the actual data from the server/database.
  var postData;
  // Send request for the first 10 posts of that destination.
  var dataRequest = new XMLHttpRequest();
  dataRequest.onreadystatechange = deal;
  dataRequest.open("Get","searchresults?destination="+destination,true);
  dataRequest.send();
  function deal(){
    if (this.readyState != XMLHttpRequest.DONE) return;
    postData = JSON.parse(this.responseText)[0];
    appendSearchResult(postData,postTemplate);
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

// Given the data and the template append the corresponding post to the
// search result area.
function appendSearchResult(postData, template){
  // Create the section and give it the appropiate class.
  var result = document.createElement("section");
  result.setAttribute("class", "search-result")
  // put the template inside.
  result.innerHTML = template;
  // Load the post into the template.
  var tags = ["#username","#title","#content-text"];
  var ids = ["username","title","text"];
  for(var i = 0; i < ids.length; i++){
    var element = result.querySelector(tags[i]);
    element.innerHTML = postData[ids[i]] + ' ';
  }
  var resultArea = document.querySelector("#results-area");
  resultArea.appendChild(result);
}
