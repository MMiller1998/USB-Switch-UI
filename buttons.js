const prompt = require('electron-prompt');

const ON = 1;
const OFF = 0;
const BUTTON_CLASS = 'btn';

const settingsFile = require('./settings');

function createIndexBtns() {
    var col1 = document.createElement('div')
    col1.setAttribute("id", "col1")
    col1.setAttribute("class", "col1")

    var col2 = document.createElement('div')
    col2.setAttribute("id", "col2")
    col2.setAttribute("class", "col2")

    document.body.appendChild(col1)
    document.body.appendChild(col2)

    for (let i = 1; i <= 16; i++) 
    {
      let button = document.createElement("button");
      button.setAttribute("id", i);
      button.setAttribute("class", BUTTON_CLASS);
      button.setAttribute("onClick", "portInteract(this.id)");
      button.innerText = "Switch " + i;
      button.setAttribute("value", OFF);
    
      if (i < 9) 
      {
          document.getElementById("col1").appendChild(button);
      }
      else
      {
          document.getElementById("col2").appendChild(button);
      }
    }
}

function createRenameMenuBtns() {
    var col1 = document.createElement('div')
    col1.setAttribute("id", "col1")
    col1.setAttribute("class", "col1")

    var col2 = document.createElement('div')
    col2.setAttribute("id", "col2")
    col2.setAttribute("class", "col2")

    document.body.appendChild(col1)
    document.body.appendChild(col2)

    console.log("Created menu buttons for the first time")
    for (let i = 1; i <= 16; i++) 
    {
      let button = document.createElement("button");
      button.setAttribute("id", i);
      button.setAttribute("class", BUTTON_CLASS);
      button.setAttribute("onClick", "btnRename(this.id)");
      button.innerText = "Switch " + i;
    
      if (i < 9) 
      {
          document.getElementById("col1").appendChild(button);
      }
      else
      {
          document.getElementById("col2").appendChild(button);
      }
    }

    var btnList = document.getElementsByClassName(BUTTON_CLASS)
}

function getBtnNames() {
    let btnNameArray = [];

    let btnArray = document.getElementsByClassName(BUTTON_CLASS)
    
    for (let button of btnArray) {
        btnNameArray.push(button.innerText)
        //console.log("Button name pushed: ", button.innerText)
    }

    return btnNameArray;
}

function btnClick(id){
  let button = document.getElementById(id);

  if(button.value == OFF)
  {
    button.style.backgroundColor = 'green';
    button.value = ON;
  }
  else if (button.value == ON) 
  {
    button.style.backgroundColor = 'red';
    button.value = OFF;
  }
}

function btnRename(id) {
    let button = document.getElementById(id);

    prompt({
        title: "",
        label: "Please enter a new name for the switch",
        value: button.innerText,
        type: 'input'
    })
    .then((input) => {
        if (input == null) 
        {
            console.log("Prompt aborted")
            return;
        }

        button.innerText = input
        var btnNameArray = getBtnNames();

        console.log("Updated button name: " ,button.innerText)

        settingsIpc.send('btn-rename', btnNameArray);
    })
    .catch(console.error)
}

function updateBtns(btnNames) {
    var renameBtns = document.getElementsByClassName(BUTTON_CLASS)

    for (let i = 0; i < 16; i++) {
        renameBtns[i].innerText = btnNames[i]
    }
}