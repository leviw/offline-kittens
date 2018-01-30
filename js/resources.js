'use strict';

async function asyncLoadImage(img, url) {
    let response = await fetch(url);
    let imgData = await response.blob();
    img.src = URL.createObjectURL(imgData);
}

function log(message) {
    const console = document.querySelector("#console");
    let wrapper = document.createElement("div");
    wrapper.appendChild(document.createTextNode(message));
    console.appendChild(wrapper);
}
