// Modules to control application life and create native browser window
const electron = require('electron');
const {app, BrowserWindow} = require('electron');
const mainIpc = require('electron').ipcMain;
const fs = require('fs');
const dialog = require('electron').dialog;

// Button name config file
const configFile = `${process.resourcesPath}/data/config.txt`;
// const configFile = 'data/config.txt';
const defaultConfigFile = 'data/default_config.txt'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let renameWindow;

// Flag that checks if main window has been closed
var appClose = false;

// Keeps track of button names
var btnNames = [];

function mainLoop () {
  // Create the browser windows
  mainWindow = new BrowserWindow({
    width: 350, 
    height: 500,
    resizable: false,
    fullscreen: false
  })
  renameWindow = new BrowserWindow({
    width: 275,
    height: 350,
    show: false,
    autoHideMenuBar: true,
    minimizable: false,
    fullscreen: false,
    resizable: false,
    parent: mainWindow
  })

  // Loads button name configurations
  btnNames = loadConfig();
  console.log("btnNames: " + btnNames)
  console.log("btnNames is array: " + Array.isArray(btnNames));
  console.log("btnNames length: " + btnNames.length);

  // Closes main window and shuts down app.
  mainWindow.on('close', (event) => {
    fs.writeFile(configFile, btnNames, (err) => {
      if (err) {
        throw err;
      }
      console.log("Configurations saved to " + configFile);
    });

    mainWindow = null;
    appClose = true;
    renameWindow.close();
  })

  renameWindow.on('close', (event) => {
    if (appClose) 
    {
      // renameWindow is set to null and closed as default, app will
      // shut down as normal.
      renameWindow = null;
      console.log("Shut down");
    }
    else
    {
      // renameWindow will be hidden and can be shown again by clicking
      // the menu option.
      event.preventDefault();
      renameWindow.hide();
      console.log("Closed rename menu");
    }
  })

  // Load html files of mainWindow and renameWindow
  mainWindow.loadFile('index.html');
  renameWindow.loadFile('rename-menu.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  // renameWindow.webContents.openDevTools()

  // ipc events
  mainIpc.on('show-rename-menu', (event, arg) => {
    console.log("Rename menu opened");
    mainWindow.webContents.send('rename-menu-init', btnNames);
    renameWindow.show();
  })

  mainIpc.on('btn-init', (event, arg) => {
    console.log("Initializing button names");
    event.sender.send('btn-init-reply', btnNames);
  })

  mainIpc.on('quit-app', () => {
    mainWindow.close();
  })

  mainIpc.on('activate-all', () => {
    console.log("Activate all");
    mainWindow.webContents.send('ports-on');
  })

  mainIpc.on('deactivate-all', () => {
    console.log("Deactivate all");
    mainWindow.webContents.send('ports-off');
  })

  mainIpc.on('btn-rename', (event, arg) => {
    console.log("Button renamed");
    btnNames = arg;
    mainWindow.webContents.send('btn-updated', btnNames);
    console.log("Update sent to main window");
  })

  mainIpc.on('main-window-btns', (event, arg) => {
    console.log("Names initialized");

    if (btnNames.length == 0) {
      console.log("btnNames set to default names");
      btnNames = arg;
    }

    renameWindow.webContents.send('rename-menu-init', btnNames);
  })

  mainIpc.on('close-rename-menu', () => {
    renameWindow.close();
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
    app.quit();
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    mainLoop();
  }
})

// Read button name configuration
function loadConfig() {
  console.log("Loading configurations");

  try {
    var configString = fs.readFileSync(configFile).toString();
    var configArray = configString.split(",");
    console.log("Load complete");

    return configArray;
  } catch (err) {
    var fileNotFoundMsg = err.message + "\nUsing default button names"
    dialog.showMessageBox({ message: fileNotFoundMsg});

    return [];
  }
  
}
