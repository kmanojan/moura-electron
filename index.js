// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const si = require('systeminformation');
const path = require('path')
let REDIRECT_URL = 'http://www.mourastudent.apptimus.lk'



function createWindow (isFile) {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  if (isFile) {
    mainWindow.loadFile(REDIRECT_URL)
  }else{
    mainWindow.loadURL(REDIRECT_URL)
  }
  mainWindow.setContentProtection(true)
  mainWindow.maximize()
  mainWindow.resizable(false)
  mainWindow.titleBarStyle(hidden)
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
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
