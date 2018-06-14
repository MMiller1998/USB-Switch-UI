/*
Connects to the network switch, closes app if connection cannot be made
*/

// Returns true on successful connection, returns false on failure
function testConnection() {
    console.log("Testing connection");

    var docBody = document.body;
    var modal = document.getElementById('connectionModal');

    var httpConnection = new XMLHttpRequest();
    var file = "http://10.10.1.229";
    httpConnection.open('HEAD', file , true);
    httpConnection.send();

    httpConnection.addEventListener("readystatechange", processRequest, false);

    function processRequest(e) {
        if (httpConnection.readyState == 4) {

            if (httpConnection.status >= 200 && httpConnection.status < 304) {  
                docBody.removeChild(modal);   
                console.log("Connection exists!");
            } else {
                docBody.removeChild(modal);
                alert("Cannot connect to switch. Please check the connection and try again. The app will automatically close now.");
                window.close();
            }
        }
    }
}
