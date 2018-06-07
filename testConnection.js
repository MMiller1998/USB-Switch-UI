function testConnection(){
  var httpConnection = new XMLHttpRequest();
  var file = "http://10.10.1.229";
  httpConnection.open('HEAD', file , true);
  httpConnection.send();

  httpConnection.addEventListener("readystatechange", processRequest, false);

  function processRequest(e)
  {
    if(httpConnection.readyState == 4)
    {
      if(httpConnection.status >= 200 && httpConnection.status < 304)
      {
        console.log("Connection exists!");
      }
      else
      {
        console.log("Connection doesn't exist! Please check the connection to the Switch. The app will automatically close now.  ");
        //window.close();
      }
    }

  }
}

testConnection();
