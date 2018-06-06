const remote = require('electron').remote
const Menu = remote.Menu

const menuTemplate = [
    {
      label: 'Electron',
      submenu: [
          {
              label: 'About ...',
              click: () => {
                  console.log("About Clicked");
              }
          }, {
            type: 'separator'
          }, {
              label: 'Quit',
              click: () => {
                  app.quit();
              }
          }
      ]
    }
  ]

const menu = Menu.buildFromTemplate(menuTemplate)
Menu.setApplicationMenu(menu)