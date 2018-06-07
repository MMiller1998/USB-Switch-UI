function testConnection(){
  var x = new XMLHttpRequest();
  var file = "http://10.10.1.229";
  x.open('HEAD', file , true);
  x.send();

  x.addEventListener("readystatechange", processRequest, false);

  function processRequest(e)
  {
    if(x.readyState == 4)
    {
      if(x.status >= 200 && x.status < 304)
      {
        alert("Connection exists!");
      }
      else
      {
        alert("Connection doesn't exist! Please check the connection to the Switch. The app will automatically close now.  ");
        window.close();
      }
    }

  }
}

testConnection();
