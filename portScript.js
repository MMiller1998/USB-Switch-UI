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
}

function portInteract(id){
  var button = document.getElementById(id);
  if(button.value == OFF)
  {
    turnPortOn(button.id);
    changeColor(button.id);
    button.value = ON;
  }
  else {
    {
      turnPortOff(button.id);
      changeColor(button.id);
      button.value = OFF;
    }
  }
}
