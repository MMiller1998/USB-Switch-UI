/*
Controls how the buttons are created and the button functions
*/

const prompt = require('electron-prompt');
const windowsIpc = require('electron').ipcRenderer;
const remote = require('electron').remote;
const dialog = remote.dialog;

// Constants
const ON = 0;
const OFF = 1;
const BUTTON_CLASS = 'btn';
const CLOSE_BTN_CLASS = "close-btn";

//const settingsFile = require('./settings');

// Creates the buttons on the main window, called in index.html
function createIndexBtns() {
    var col1 = document.createElement('div');
    col1.setAttribute("id", "col1");
    col1.setAttribute("class", "col1");

    var col2 = document.createElement('div');
    col2.setAttribute("id", "col2");
    col2.setAttribute("class", "col2");

    document.body.appendChild(col1);
    document.body.appendChild(col2);

    // Gets the status of the buttons: ON(0)/OFF(1)
    var relayExtensions = initButtonStatus();

    // Creates a button for each relay
    for (let i = 1; i <= 16; i++) {
        let button = document.createElement("button");
        button.setAttribute("id", i);
        button.setAttribute("class", BUTTON_CLASS);
        button.setAttribute("onClick", "portInteract(this.id)"); // On click funcion defined in portScript.js
        button.innerText = "Switch " + i;
        button.setAttribute("value", relayExtensions[i - 1]);

        // Colors button based on value/status of button
        if (button.value == OFF) {
            button.style.backgroundColor = 'red';
        } else if (button.value == ON) {
            button.style.backgroundColor = 'green';
        }
    
        // Button 1-8 goes on col1, buttons 9-16 goes on col2
        if (i < 9) {
            document.getElementById("col1").appendChild(button);
        } else {
            document.getElementById("col2").appendChild(button);
        }
    }
}

// Creates the buttons on the rename menu window, called in rename-menu.html
function createRenameMenuBtns() {
    var col1 = document.createElement('div');
    col1.setAttribute("id", "col1");
    col1.setAttribute("class", "col1");

    var col2 = document.createElement('div');
    col2.setAttribute("id", "col2");
    col2.setAttribute("class", "col2");

    document.body.appendChild(col1);
    document.body.appendChild(col2);

    console.log("Initialized rename menu buttons")

    // Creates button for reach relay
    for (let i = 1; i <= 16; i++) {
        let button = document.createElement("button");
        button.setAttribute("id", i);
        button.setAttribute("class", BUTTON_CLASS);
        button.setAttribute("onClick", "btnRename(this.id)");
        button.innerText = "Switch " + i;
    
        // Button 1-8 goes on col1, buttons 9-16 goes on col2
        if (i < 9) {
            document.getElementById("col1").appendChild(button);
        } else {
            document.getElementById("col2").appendChild(button);
        }
    }
}

// Gets the names of all the buttons
function getBtnNames() {
    let btnNameArray = [];

    let btnArray = document.getElementsByClassName(BUTTON_CLASS);
    
    for (let button of btnArray) {
        btnNameArray.push(button.innerText);
        //console.log("Button name pushed: ", button.innerText)
    }

    return btnNameArray;
}

// Toggles red/green color of main window buttons
function toggleColor(id){
    let button = document.getElementById(id);

    if (button.value == OFF) {
        button.style.backgroundColor = 'green';
        button.value = ON;
    } else if (button.value == ON) {
        button.style.backgroundColor = 'red';
        button.value = OFF;
    }
}

// On click function for rename menu buttons, used in rename-menu.html
function btnRename(id) {
    let button = document.getElementById(id);

    prompt({
        title: "",
        label: "Please enter a new name for the switch",
        value: button.innerText,
        type: 'input'
    })
    .then((input) => {
        // input == null when prompt is canceled, closed, or has empty text field
        if (input == null) {
            console.log("Prompt aborted");
            return;
        }

        button.innerText = input
        var btnNameArray = getBtnNames();
        console.log(btnNameArray);

        console.log("Updated button name: " ,button.innerText);

        // Sends updated button names to main loop
        windowsIpc.send('btn-rename', btnNameArray);
    })
    .catch(console.error);
}

// Update the button names to match current names, used in index.html
function updateBtns(btnNames) {
    var renameBtns = document.getElementsByClassName(BUTTON_CLASS);

    for (let i = 0; i < 16; i++) {
        renameBtns[i].innerText = btnNames[i];
    }
}

// On click function for the restore default names button, used in rename-menu.html
function restoreDefaultsClick() {
    console.log("Restore default names clicked")

    // Creates a confirmation box
    dialog.showMessageBox(
        remote.getCurrentWindow(),
        {
            type: 'question',
            buttons: ['No', 'Yes'],
            title: 'Confirm',
            message: 'Are you sure you want to restore the default button names?'
        }, (response) => {
            // response == 0 -> No
            // response == 1 -> Yes
            console.log(response);
            
            if (response == 1) {
                windowIpc.send('restore-defaults')
            }
        }
    )
}

// On click function for the close button, used in rename-menu.html
function closeBtnClick() {
    console.log("Rename menu close button clicked");
    windowIpc.send('close-rename-menu');
}