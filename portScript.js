function turnPortOn(portNum){
  var switchConnect = new XMLHttpRequest();
  var addie = "http://10.10.1.229"
  if(portNum <= 5){
    var y = (portNum * 2) - 1;
    var urlExtension = "/8080/0" + y.toString();
  }
  else{
    var y = (portNum * 2) - 1;
    var urlExtension = "/8080/" + y.toString();
  }
  switchConnect.open('GET', addie + urlExtension, true);
  switchConnect.send();

  console.log("Switch " + portNum + " turned on")
}


function turnPortOff(portNum){
  var switchConnect = new XMLHttpRequest();
  var addie = "http://10.10.1.229"
  if(portNum <= 5){
  var y = (portNum * 2) - 2;
  var urlExtension = "/8080/0" + y.toString();
  }
  else{
  var y = (portNum * 2) - 2;
  var urlExtension = "/8080/" + y.toString();
  }
  switchConnect.open('GET', addie + urlExtension, true);
  switchConnect.send();

  console.log("Switch " + portNum + " turned off")
}

function portInteract(id){
  var button = document.getElementById(id);
  console.log(button.innerText + " clicked")
  if(button.value == OFF)
  {
    turnPortOn(button.id);
    btnClick(button.id);
    button.value = ON;
  }
  else {
    {
      turnPortOff(button.id);
      btnClick(button.id);
      button.value = OFF;
    }
  }
}

function activateAll() {
  var buttons = document.body.getElementsByClassName('btn');

  for (var button of buttons) {
    turnPortOn(button.id);
    button.value = ON;
    button.style.backgroundColor = 'green';
  }

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

function deactivateAll() {
  var buttons = document.body.getElementsByClassName('btn');

  for (var button of buttons) {
    turnPortOff(button.id);
    button.value = OFF;
    button.style.backgroundColor = 'red';
  }

  var allOff = false;
  for (var button of buttons) {
    if (button.value == OFF) {
      allOff = true;
    } else {
      allOff = false;
      break;
    }
  }
  console.log(allOff)
}