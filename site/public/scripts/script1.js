"use strict";

addEventListener('load',script1start);

var postTemplate;
var pageDestination;

function script1start(){
  initButton();
  getTemplate("resulttemplate.html",c);
  function c(result) {
    postTemplate = result;
    startPosts();
  }
}

function initButton() {
  const b = document.querySelector("#newPostButton");
  b.addEventListener("click",newPost);
  function c(){
    //appendSearchResult(["Jorge S-C ","Go to el retiro","madrid is great!"],postTemplate)
  }
}

function newPost() {
  // Change the results for the new post form.
  getTemplate("/search/postform.html",c);
  function c(template){
    var resultArea = document.querySelector("#results-area");
    resultArea.innerHTML= template;
    document.querySelector("#postLocation").value = pageDestination;
  }
}

function loadPosts(destination){
  // Substitute for getting the actual data from the server/database.
  var postData;
  // Send request for the first 10 posts of that destination.
  var dataRequest = new XMLHttpRequest();
  dataRequest.onreadystatechange = deal;
  dataRequest.open("Get","data?destination="+destination,true);
  dataRequest.send();
  function deal(){
    if (this.readyState != XMLHttpRequest.DONE) return;
    postData = JSON.parse(this.responseText)[0];
    if (postData != undefined){
      appendSearchResult(postData,postTemplate);
    }
    else {
      var apologisingText = document.createElement("p");
      apologisingText.innerHTML = 'Oops! No posts about this destination.. Want to write one?';
      var resultArea = document.querySelector("#results-area");
      resultArea.appendChild(apologisingText);
    }
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
  // Put the template inside.
  result.innerHTML = template;
  // Load the post into the template.
  var tags = ["#username","#title","#content-text"];
  var ids = ["username","title","text"];
  for(var i = 0; i < ids.length; i++){
    var element = result.querySelector(tags[i]);
    element.innerHTML = postData[ids[i]] + ' ';
  }
  //Check if the post has an image. If it doesn't then remove the image element.
  var imageTag = "#image";
  var imageId = "imagePath";
  var imageElem = result.querySelector(imageTag);
  if (postData[imageId] == ''){
    imageElem.style.display = 'none';
  }else {
    imageElem.setAttribute("src","postData[imageId]");
  }
  var resultArea = document.querySelector("#results-area");
  resultArea.appendChild(result);
}

function startPosts() {
    var url = window.location.href;
    var q = url.indexOf("?");
    if (q < 0) return reportNone();
    var query = url.substring(q + 1);
    var defs = query.split("&");
    for (var i=0; i<defs.length; i++) {
        defs[i] = defs[i].split("=");
    }
    pageDestination = defs[0][1];
    setTitleDestination(pageDestination);
    loadPosts(defs[0][1]);
}

function setTitleDestination(destination){
  var location = document.querySelector("#destination");
  location.innerHTML = destination;
}
