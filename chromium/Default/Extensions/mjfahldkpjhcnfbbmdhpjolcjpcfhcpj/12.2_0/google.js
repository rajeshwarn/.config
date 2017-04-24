// Copyright (c) 2017 - Martin Sermak

var navigation = 0;		// 0 is Off, 1 is On
var position = null;

// read preferences
chrome.runtime.sendMessage({navigation: "ask"}, function(response) { navigation = response.answer; });

// repopulate preferences when changed
chrome.storage.onChanged.addListener(function(changes,namespace)
{
	for (key in changes)
	{
		if (key == 'navigation') navigation = changes[key].newValue;
	}
});

// Show Icons when using Right Click + Mouse Move
function onScreen(dir)
{
	var DIVL = "<div style='display:inline-block; position:fixed; margin:auto auto auto 120px; top:0px; bottom:0px; left:0px; right:0px; "+
		"background:transparent; width:250px; max-width:250px; height:250px; max-height:250px; z-index:999999999; border:0px; zoom:reset; "+
		"font-size:200px; color:transparent; -webkit-text-stroke:30px red; opacity:0.7;'>&#9668;</div>";
	var DIVR = "<div style='display:inline-block; position:fixed; margin:auto 120px auto auto; top:0px; bottom:0px; left:0px; right:0px; "+
		"background:transparent; width:250px; max-width:250px; height:250px; max-height:250px; z-index:999999999; border:0px; zoom:reset; "+
		"font-size:200px; color:transparent; -webkit-text-stroke:30px red; opacity:0.7;'>&#9658;</div>";

	var div = document.getElementById("DVI75");
	if (div) div.parentNode.removeChild(div);
	div = document.createElement("div");
	div.id = "DVI75";
	if (dir == 'left') { div.innerHTML = DIVL; setTimeout(function() { div.parentNode.removeChild(div); window.history.back(); }, 250); }
	if (dir == 'right') { div.innerHTML = DIVR; setTimeout(function() { div.parentNode.removeChild(div); window.history.forward(); }, 250); }
	document.documentElement.appendChild(div);
}

// Add navigation to Chrome using Right Click + Mouse Move
window.addEventListener("contextmenu", function(event)
{
	if (navigation == 1 && position != null) event.preventDefault();
});
window.addEventListener("mouseup", function(event)
{
	if (navigation == 1 && position != null)
	{
		if (position - event.clientX > 30) { onScreen('left'); return false; }
		if (position - event.clientX < -30) { onScreen('right'); return false; }
		position = null;
	}
});
window.addEventListener("mousedown", function(event)
{
	position = null;
	if (navigation == 1 && event.button == 2) position = event.clientX;
});

// Prevent new window on Shift
window.addEventListener("keydown", function(event)
{
	if (event.shiftKey && event.keyCode == 13)
	{
		event.preventDefault();
		document.getElementById("submit").click();
	}
});

// Fix Tab and return Focus back to SEARCH
document.getElementById("submit").addEventListener("blur", function(event)
{
	document.getElementById("search").focus();
});

// Show date/time
setInterval(function() { var tmp = new Date(); document.getElementById("time").innerHTML = tmp.toDateString()+" - "+tmp.toLocaleTimeString(); }, 1000);

// Adjust default Color
chrome.storage.local.get(null,function(items)
{
	for (key in items)
	{
		if (key == 'homepage' && items[key] == chrome.extension.getURL('google.html'))
			chrome.storage.local.set({"homepage":window.location.href.toLowerCase()});
		if (key == 'homepage' && items[key] == chrome.extension.getURL('boogle.html'))
			chrome.storage.local.set({"homepage":window.location.href.toLowerCase()});
	}
});
