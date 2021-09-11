// Modules to control application life and create native browser window
const {app, BrowserWindow,screen , dialog , session , systemPreferences} = require('electron')
const electron = require('electron')
const si = require('systeminformation');
const path = require('path')
const ipcRenderer=require('electron').ipcRenderer;
const url = require('url')

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

  const permission = systemPreferences.askForMediaAccess("camera");
  console.log("Aaaaaa",permission);

  mainWindow.webContents.session.setPermissionRequestHandler((webCont, perm, callback, details) => {
    console.log('ChromePermissionRequest %s %O', perm, details);
    callback(true);
  });
}

app.on('ready', function(events,contents) {

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
            title: "Seems like you have been using Virtually",
            buttons: ['Dismiss'],
            type: 'warning',
            message: "Seems like you have been using Virtually",
            icon: path.join(__dirname, 'images/fav.png')

            });
        }else if (displayCount.length  == 1) {
          mainWindow.show();
        }else{
          mainWindow.hide();
          dialog.showMessageBox(window, {
            title: "We don't allow external monitors",
            buttons: ['Dismiss'],
            type: 'warning',
            message: "We don't allow external monitors",
            icon: path.join(__dirname, 'images/fav.png')

            });

        } 
      });
    
  }, 2000);

     
  electron.screen.on('display-added',()=>{
    displayCount = electron.screen.getAllDisplays();
    if (displayCount.length  == 1) {
      mainWindow.show();
    }else{
      mainWindow.hide();
      dialog.showMessageBox(window, {
        title: "We don't allow external monitors",
        buttons: ['Dismiss'],
        type: 'warning',
        message: "We don't allow external monitors",
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
        title: "We don't allow external monitors",
        buttons: ['Dismiss'],
        type: 'warning',
        message: "We don't allow external monitors",
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

app.on('close', function () {
  if (process.platform === 'darwin') {
    var forceQuit = false;
    app.on('before-quit', function() {
      forceQuit = true;
    });
    mainWindow.on('close', function(event) {
      if (!forceQuit) {
        event.preventDefault();
      }
    });
  }
});

app.on('before-quit',()=>{
})







//********************************Deep Link */

let deeplinkingUrl

// Force Single Instance Application
const gotTheLock = app.requestSingleInstanceLock()
if (gotTheLock) {
  app.on('second-instance', (e, argv) => {

    // Protocol handler for win32
    // argv: An array of the second instance’s (command line / deep linked) arguments
    if (process.platform == 'win32') {
      // Keep only command line / deep linked arguments
      deeplinkingUrl = argv.slice(1)
    }

    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
} else {
  app.quit()
  return
}

// Protocol handler for win32
if (process.platform == 'win32') {
  // Keep only command line / deep linked arguments
  deeplinkingUrl = process.argv.slice(1)
}

if (!app.isDefaultProtocolClient('moura')) {
  // Define custom protocol handler. Deep linking works on packaged versions of the application!
  app.setAsDefaultProtocolClient('moura')
}

app.on('will-finish-launching', function() {
  // Protocol handler for osx
  app.on('open-url', function(event, url) {
    event.preventDefault()
    deeplinkingUrl = url
  })
})