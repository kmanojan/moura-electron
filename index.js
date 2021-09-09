// Modules to control application life and create native browser window
const {app, BrowserWindow,screen , dialog , session} = require('electron')
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

  mainWindow.webContents.userAgent = "QVBwdGltdFMgVGTjaC8gQW91cmEgRWR1Y2F0aW9u";
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


app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
