const {app, BrowserWindow,ipcMain,ipcRenderer } = require('electron')
const { desktopCapturer, contextBridge } = require("electron");
const { readFileSync } = require("fs");
const { join } = require("path");

//**************************************************************************/
//**********************   Get Screen Access  ******************************/
//**************************************************************************/

window.addEventListener("DOMContentLoaded", () => {
  const rendererScript = document.createElement("script");
  rendererScript.text = readFileSync(join(__dirname, "renderer.js"), "utf8");
  document.body.appendChild(rendererScript);
});

contextBridge.exposeInMainWorld("myCustomGetDisplayMedia", async () => {
  const sources = await desktopCapturer.getSources({
    types: ["screen"],
  });

  const selectedSource = sources[0];
  return selectedSource;
});



//**************************************************************************/
//**********************   Camera Access  **********************************/
//**************************************************************************/

ipcRenderer.addEventListener('captureUserImage', function(ev)  {
    navigator.getMedia = ( navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia);
    
    navigator.getMedia({video: true}, function() {
    }, function() {
    
      let errorCallback = (error) => {
        console.log(`There was an error connecting to the video stream: ${error.message}`);
      };
      window.navigator.webkitGetUserMedia({video: true}, (localMediaStream) => {
      }, errorCallback);
    });
})
