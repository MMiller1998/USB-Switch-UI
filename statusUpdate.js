var str1 = "";
var str2 = "";



for(var i = 0; i<4; i++)
{
var xhr = new XMLHttpRequest();
var http1 = "http://10.10.1.229/8080/42"; 
xhr.open('GET', http1, false);
str1 = xhr.responseText;
str2 = str1; 
str1 = " "; 
xhr.send();
console.log(str2);
}

//should print out the html from all four updated pages, doesn't print after the for loop is done though. 
console.log(str2);