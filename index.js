// Modules to control application life and create native browser window
const {app, BrowserWindow,screen , dialog} = require('electron')
const electron = require('electron')
const si = require('systeminformation');
const path = require('path')
const ipcRenderer=require('electron').ipcRenderer;
let REDIRECT_URL = 'http://www.mourastudent.apptimus.lk'
const {desktopCapturer} = require('electron');


let mainWindow="";



function createWindow () {
  // Create the browser window.
 mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // devTools: false,
      nodeIntegration: true
    },
    autoHideMenuBar: true,
    title:"Moura Education"
  })
  mainWindow.removeMenu()
  // and load the index.html of the app.
  mainWindow.loadURL(REDIRECT_URL)
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

app.on('ready',function(events,contents) {

  const window = BrowserWindow.getFocusedWindow();
  let displayCount = electron.screen.getAllDisplays();

  setTimeout(() => {
    displayCount = electron.screen.getAllDisplays();
    si.getAllData()
    .then(data => {
        console.log("system",data.system.virtual);
        if (data.system.virtual) {
          mainWindow.hide();
          dialog.showMessageBox(window, {
            title: "Seems like you have been using Virtualy",
            buttons: ['Dismiss'],
            type: 'warning',
            message: "Seems like you have been using Virtualy",
            icon: path.join(__dirname, 'images/fav.png')

            });
        }else if (displayCount.length  == 1) {
          mainWindow.show();
        }else{
          mainWindow.hide();
          dialog.showMessageBox(window, {
            title: "We don't allow external moniters",
            buttons: ['Dismiss'],
            type: 'warning',
            message: "We don't allow external moniters",
            icon: path.join(__dirname, 'images/fav.png')

            });

        } 
      });
    
  }, 3000);

     


  electron.screen.on('display-added',()=>{
    displayCount = electron.screen.getAllDisplays();
    if (displayCount.length  == 1) {
      mainWindow.show();
    }else{
      mainWindow.hide();
      dialog.showMessageBox(window, {
        title: "We don't allow external moniters",
        buttons: ['Dismiss'],
        type: 'warning',
        message: "We don't allow external moniters",
        icon: path.join(__dirname, 'images/fav.png')

       });

    }    
  })

  electron.screen.on('display-removed',()=>{
    displayCount = electron.screen.getAllDisplays();
    if (displayCount.length  == 1) {
      mainWindow.show();
    }else{
      mainWindow.hide();

      dialog.showMessageBox(window, {
        title: "We don't allow external moniters",
        buttons: ['Dismiss'],
        type: 'warning',
        message: "We don't allow external moniters",
        icon: path.join(__dirname, 'images/fav.png')

       });
    }
  })
})




// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

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
