/*
Gets the status of the buttons
*/

function initButtonStatus() {
	var str1 = "";
	var str2 = "";

	// Get HTML for all pages
	for (var i = 0; i < 4; i++) {
		var xhr = new XMLHttpRequest();
		var http1 = "http://10.10.1.229/8080/42"; 
		xhr.open('GET', http1, false);
		xhr.send();
		str1 = xhr.responseText;
		str2 += str1; 
		str1 = " ";
	}

	// Parse through HTML response to get IP addresses
	var regex = /10\.10\.1\.229\/8080\/\d{2}/g;
	var ipv4Add = str2.match(regex);
	console.log(ipv4Add);

	// Parses through IP addresses to get extensions and sorts array
	var addrExtensions = [];

	for (var add of ipv4Add) {
		addrExtensions.push(add.substring(17))
	}

	addrExtensions.sort( (a, b) => {
		return a - b;
	})

	console.log(addrExtensions);

	// Get extensions for all of the relays
	var relayExtensions = addrExtensions.slice(0,16);

	console.log(relayExtensions);

	// Check if each relay is ON (0) or OFF (1)
	for (var i = 0; i < relayExtensions.length; i++) {
		relayExtensions[i] = relayExtensions[i] % 2;
	}

	console.log(relayExtensions);

	return relayExtensions;
}