/*
Controls button clicks for main window and how it interacts with 
*/

// Sends request to an extension to turn on a relay
function turnPortOn(portNum){
    var switchConnect = new XMLHttpRequest();
    var addie = "http://10.10.1.229";

    if (portNum <= 5) {
        var y = (portNum * 2) - 1;
        var urlExtension = "/8080/0" + y.toString();
    } else {
        var y = (portNum * 2) - 1;
        var urlExtension = "/8080/" + y.toString();
    }

    switchConnect.open('GET', addie + urlExtension, false);
    switchConnect.send();
}

// Sends request to an extransino to turn off a relay
function turnPortOff(portNum){
    var switchConnect = new XMLHttpRequest();
    var addie = "http://10.10.1.229";

    if (portNum <= 5) {
        var y = (portNum * 2) - 2;
        var urlExtension = "/8080/0" + y.toString();
    } else {
        var y = (portNum * 2) - 2;
        var urlExtension = "/8080/" + y.toString();
    }

    switchConnect.open('GET', addie + urlExtension, false);
    switchConnect.send();
}

// On click fuction for main window buttons
function portInteract(id){
    var button = document.getElementById(id);

    if (button.value == OFF) {
        turnPortOn(button.id);
        toggleColor(button.id);
    } else {
        turnPortOff(button.id);
        toggleColor(button.id);
    }
}

// Turns all of the relays on
function activateAll() {
    var buttons = document.body.getElementsByClassName('btn');

    for (var button of buttons) {
        turnPortOn(button.id);
        button.value = ON;
        button.style.backgroundColor = 'green';
    }

    // Checks if all the buttons are turned on, used for debug
    var allOn = false;
    for (var button of buttons) {
        if (button.value == ON) {
        allOn = true;
        } else {
        allOn = false;
        break;
        }
    }
    console.log(allOn)
}

// Turns all of the relays off
function deactivateAll() {
    var buttons = document.body.getElementsByClassName('btn');

    for (var button of buttons) {
        turnPortOff(button.id);
        button.value = OFF;
        button.style.backgroundColor = 'red';
    }

    // Checks if all buttons are turned off, used for debug
    var allOff = false;
    for (var button of buttons) {
        if (button.value == OFF) {
        allOn = true;
        } else {
        allOn = false;
        break;
        }
    }
    console.log(allOff)
}


