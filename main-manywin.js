// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')

let child,child2;
function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    backgroundColor: '#2e2c29'
  })
  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  const winParentPosition = mainWindow.getPosition();
  child = new BrowserWindow({ 
    parent: mainWindow,
    width: 100,
    height: 100,
    movable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  child2 = new BrowserWindow({ 
    parent: mainWindow,
    width: 100,
    height: 100,
    movable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  child.loadFile('image.html')
  child.setPosition(winParentPosition[0], winParentPosition[1]);

  child2.loadFile('image.html')
  child2.setPosition(winParentPosition[0] + 100, winParentPosition[1]+100);
  // child.hide()
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

ipcMain.on('file-check-exists', (event, arg) => {
  console.log(9999)
  child.show()
  child2.show()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
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
