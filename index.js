// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const si = require('systeminformation');
const path = require('path')
const ipcRenderer=require('electron').ipcRenderer;
let REDIRECT_URL = 'http://www.mourastudent.apptimus.lk'

function createWindow (isFile) {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // devTools: false,
      nodeIntegration: true
    },
    autoHideMenuBar: true,
    title:"Moura Education"
    // fullscreen:true,
    // resizable: false,
  })
  mainWindow.removeMenu()
  // and load the index.html of the app.
  if (isFile) {
    mainWindow.loadFile(REDIRECT_URL)
  }else{
    mainWindow.loadURL(REDIRECT_URL)
  }
  mainWindow.setContentProtection(true)
  mainWindow.setIcon('./images/fav.png')

  mainWindow.webContents.session.setPermissionCheckHandler(async (webContents, permission, details) => {
    console.log("permission",permission);
    return true
  })
  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  mainWindow.webContents.session.setPermissionRequestHandler((webCont, perm, callback, details) => {
    console.log('ChromePermissionRequest %s %O', perm, details);
    callback(true);
  });

  // webview.addEventListener('permissionrequest', function(e) {
  //   if (e.permission === 'media') {
  //     e.request.allow();
  //   }
  // });



}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  si.getAllData()
  .then(data => {
      console.log("system",data.system.virtual);
      if (data.system.virtual) {
        REDIRECT_URL = "virtual-box.html"
        createWindow(true)
      }else if(data.graphics.displays.length > 1){
        REDIRECT_URL = "virtual-box.html"
        createWindow(true)
      }else{
        createWindow(false)
      }
    })
  .catch(error => console.error(error));

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})





// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
