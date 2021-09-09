// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extensiong
const {app, BrowserWindow,ipcMain,ipcRenderer } = require('electron')
const { desktopCapturer, contextBridge } = require("electron");
const { readFileSync } = require("fs");
const { join } = require("path");

// ipcRenderer.addEventListener('captureUserImage', function(ev)  {
    navigator.getMedia = ( navigator.getUserMedia || // use the proper vendor prefix
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia);
    
    navigator.getMedia({video: true}, function() {
      // webcam is available


      console.log("web cam ok");
    }, function() {
      // webcam is not available
    
      let errorCallback = (error) => {
        console.log(`There was an error connecting to the video stream: ${error.message}`);
      };
    
      window.navigator.webkitGetUserMedia({video: true}, (localMediaStream) => {
        
      }, errorCallback);
    });
// })






// window.addEventListener('DOMContentLoaded', () => {
//   const replaceText = (selector, text) => {
//     const element = document.getElementById(selector)
//     if (element) element.innerText = text
//   }

//   for (const type of ['chrome', 'node', 'electron']) {
//     replaceText(`${type}-version`, process.versions[type])
//   }
// })


// inject renderer.js into the web page
window.addEventListener("DOMContentLoaded", () => {
  const rendererScript = document.createElement("script");
  rendererScript.text = readFileSync(join(__dirname, "renderer.js"), "utf8");
  document.body.appendChild(rendererScript);
});

contextBridge.exposeInMainWorld("myCustomGetDisplayMedia", async () => {
  const sources = await desktopCapturer.getSources({
    types: ["window", "screen"],
  });

  // you should create some kind of UI to prompt the user
  // to select the correct source like Google Chrome does
  const selectedSource = sources[0]; // this is just for testing purposes

  return selectedSource;
});