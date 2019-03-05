"use strict"

addEventListener('load',initButton);

function initButton() {
  const b = document.querySelector("#myButton");
  b.addEventListener("click",loadPosts);
}
