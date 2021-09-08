// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extensiong
const {app, BrowserWindow,ipcMain} = require('electron')
const {desktopCapturer} = require('electron');


window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

navigator.getMedia = ( navigator.getUserMedia || // use the proper vendor prefix
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia);

navigator.getMedia({video: true}, function() {
  // webcam is available
}, function() {
  // webcam is not available

  let errorCallback = (error) => {
    console.log(`There was an error connecting to the video stream: ${error.message}`);
  };

  window.navigator.webkitGetUserMedia({video: true}, (localMediaStream) => {
    
  }, errorCallback);
});



