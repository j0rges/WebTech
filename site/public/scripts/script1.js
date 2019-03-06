"use strict"

addEventListener('load',loadPosts);

function loadPosts(){
  // Substitute for getting the actual data from the server/database.
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
  var resultArea = document.querySelector("#results-area");
  resultArea.appendChild(result);
  var newresult = result.cloneNode(true);
  newresult.querySelector("#username").innerHTML = "not Jorge! ";
  resultArea.appendChild(newresult);
}

/*

<script>
  var destination = 'Madrid';

  var username = GetPostsByDestination(destination);
  // var title = 'Go to El Retiro';
  // var content = 'El Retiro is a beautiful place to spend an afternoon.\
  // This park has a lot of activities to explore. You can rent a boat to go\
  // in the lake there, have a walk around the extensive grounds or visit the\
  // free art exhibition which can be found inside the impressive Casa de Cristal.'
  document.getElementById("destination").innerHTML = destination;
  document.getElementById("username").innerHTML = username;
  document.getElementById("title").innerHTML = title;
  document.getElementById("content").innerHTML = content;
</script>

*/
