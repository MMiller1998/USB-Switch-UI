// Modules to control application life and create native browser window
const electron = require('electron')
const {app, BrowserWindow} = require('electron')
const mainIpc = require('electron').ipcMain

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let renameWindow

// Flag that checks if main window has been closed
var appClose = false

// Keeps track of button names
var btnNames = [];

function mainLoop () {

  // Create the browser windows
  mainWindow = new BrowserWindow({
    width: 350, 
    height: 500,
    // resizable: false,
    fullscreen: false
  })
  renameWindow = new BrowserWindow({
    width: 275,
    height: 325,
    show: false,
    autoHideMenuBar: true,
    minimizable: false,
    fullscreen: false,
    // resizable: false,
    parent: mainWindow
  })

  // Closes main window and shuts down app.
  mainWindow.on('close', (event) => {
    mainWindow = null
    appClose = true
    renameWindow.close()
  })

  renameWindow.on('close', (event) => {
    if (appClose) 
    {
      // renameWindow is set to null and closed as default, app will
      // shut down as normal.
      renameWindow = null
      console.log("Shut down")
    }
    else
    {
      // renameWindow will be hidden and can be shown again by clicking
      // the menu option.
      event.preventDefault()
      renameWindow.hide()
      console.log("Closed rename menu")
    }
  })

  // Load html files of mainWindow and renameWindow
  mainWindow.loadFile('index.html')
  renameWindow.loadFile('rename-menu.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
  renameWindow.webContents.openDevTools()

  // ipc events
  mainIpc.on('show-rename-menu', (event, arg) => {
    console.log("Rename menu opened")
    event.sender.send('rename-menu-init', btnNames);
    renameWindow.show()
  })

  mainIpc.on('quit-app', () => {
    mainWindow.close()
  })

  mainIpc.on('activate-all', () => {
    console.log("Activate all")
    
  })

  mainIpc.on('deactivate-all', () => {
    console.log("Deactivate all")
  })

  mainIpc.on('btn-rename', (event, arg) => {
    console.log("Button renamed")
    btnNames = arg
    // console.log("Main window:\n" ,btnNames)
    mainWindow.webContents.send('btn-updated', btnNames);
    console.log("Update sent to main window")
  })

  mainIpc.on('main-window-btns', (event, arg) => {
    console.log("Names initialized")
    btnNames = arg
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', mainLoop)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    mainLoop()
  }
})
