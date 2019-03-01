"use strict"

addEventListener('load',loadPosts);



function loadPosts(){
  // substitute for getting the actual data from the server/database.
  var postData = ["Jorge S-C ","Go to el retiro","madrid is great!"];
  // Get the template from the server.
  var req = new XMLHttpRequest();
  req.onreadystatechange = receive;
  req.open("Get","resulttemplate.html",true);
  req.send();
  function receive(){
    if (this.readyState != XMLHttpRequest.DONE) return;
    var template = this.responseText;
    appendSearchResult(postData, template);
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
  document.querySelector("#results-area").appendChild(result);
}
