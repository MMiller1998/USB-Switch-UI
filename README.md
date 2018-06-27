# USB Switch UI

**Clone and run for a quick way to see Electron in action.**

This is a minimal Electron application based on the [Quick Start Guide](https://electronjs.org/docs/tutorial/quick-start) within the Electron documentation.

**Use this app along with the [Electron API Demos](https://electronjs.org/#get-started) app for API code examples to help you get started.**

A basic Electron application needs just these files:

- `package.json` - Points to the app's main file and lists its details and dependencies.
- `main.js` - Starts the app and creates a browser window to render HTML. This is the app's **main process**.
- `index.html` - A web page to render. This is the app's **renderer process**.

You can learn more about each of these components within the [Quick Start Guide](https://electronjs.org/docs/tutorial/quick-start).

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:


```bash
# Clone this repository
git clone https://github.com/MMiller1998/USB-Switch-UI.git
# Go into the repository
cd USB-Switch-UI
# Install dependencies
npm install
# Run the app
npm start
```

Note: If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.

## Packing app for Windows

OPTIONAL: create a `build` directory in the root of your project and save icons for your app. They should be in `.png`(OSX), `.icns`(Linux), and `.ico`(Windows) format. The app will use the default electron icon if none are specified.

Add electron-builder to your devDependencies by running:
```bash
npm install electron-builder --save-dev
```

Add `"pack": "build --dir"` and `"dist": "build"` to the `"scripts"` section of your `package.json`. Create a new `"build"`section in `package.json` and create desired fields. Consult the [electron builder wiki](https://www.electron.build/) to see all the ways you can customize your build. For packaging the app on Windows, create
```json
"win": {
  "target": "NSIS",
  "icon": "build/icon.ico"
}
```

Run `npm run dist` to start the build process. The executable should appear in the `dist` folder in the root directory.

Example of `package.json`:
```json
{
  "name": "switchUI",
  "version": "1.0.6",
  "description": "A minimal Electron application to turn on and off switch ports",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "pack": "build --dir",
    "dist": "build"
  },
  "repository": "https://github.com/MMiller1998/pyUI.git",
  "keywords": [
    "switch",
    "UI",
    "switchUI"
  ],
  "author": "Jacob Chapman, Joshua Park",
  "license": "CC0-1.0",
  "devDependencies": {
    "electron": "^2.0.0",
    "electron-builder": "^20.15.1",
    "electron-packager": "^12.1.0"
  },
  "dependencies": {
    "electron-prompt": "^0.5.0",
    "ipc": "0.0.1",
    "menu": "^0.2.5",
    "remote": "^0.2.6"
  },
  "build": {
    "appId": "switchUI",
    "productName": "switchUI",
    "win": {
      "target": "NSIS"
    },
    "extraResources": ["./data/*config.txt"]
  }
}
```

## Resources

- [electronjs.org/docs](https://electronjs.org/docs) - all of Electron's documentation
- [electronjs.org/community#boilerplates](https://electronjs.org/community#boilerplates) - sample starter apps created by the community
- [electron/electron-quick-start](https://github.com/electron/electron-quick-start) - a very basic starter Electron app
- [electron/simple-samples](https://github.com/electron/simple-samples) - small applications with ideas for taking them further
- [electron/electron-api-demos](https://github.com/electron/electron-api-demos) - an Electron app that teaches you how to use Electron
- [hokein/electron-sample-apps](https://github.com/hokein/electron-sample-apps) - small demo apps for the various Electron APIs
- [electron-builder wiki](https://www.electron.build/)

## License

[CC0 1.0 (Public Domain)](LICENSE.md)
