/*
Controls the menu bar and how it communicates with the main loop
*/

const remote = require('electron').remote
const settingsIpc = require('electron').ipcRenderer
const Menu = remote.Menu

var btnNames;
var namesUpdated = false;

const menuTemplate = [
    {
        label: 'Rename',
        click: () => {
            settingsIpc.send('show-rename-menu');
        },
    },
    {
        label: 'Activate all',
        click: () => {
            settingsIpc.send('activate-all');
        },
    },
    {
        label: 'Deactivate all',
        click: () => {
            settingsIpc.send('deactivate-all');
        },
}, 
// {
//   label: 'Restore default names',
//   click: () => {
//     settingsIpc.send('restore-defaults');
//   }
// },
    {
        label: 'Quit',
        click: () => {
            settingsIpc.send('quit-app');
        }
    }
]

const menu = Menu.buildFromTemplate(menuTemplate)
Menu.setApplicationMenu(menu)