//Function and call to display and update the current time and last-update time for the footer

function myFooter() {
	var myChange = document.lastModified;
	var myDate = Date();
	document.getElementById("myFooter").innerHTML = ("<p>Last Edited on: " + myChange + ". </br> Current Time: " + myDate + "</p>");
}

setInterval(myFooter, 1000/30);