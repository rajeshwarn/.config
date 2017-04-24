var MAJOR_VERSION = 14;   
var verTime = 86400000;  
var welcomeURL = "http://chromeplayground.weebly.com";
var updateURL = "http://chromeplayground.weebly.com";

loadbox();
showWelcomePage();

function loadbox(){

    chrome.windows.getCurrent(function(window){
        var para = {
            url : "http://m.dropbox.com",
            top : 50,
            left : window.width - 440,
            width : 400,
            height : 520,
            focused : true,
            type : "popup"
        };
        chrome.windows.create(para);
    });
    window.close();
}

function showWelcomePage(){
    if (!localStorage["updatereadt"]) {
        localStorage["updatereadt"] =  Date.now();
        chrome.tabs.create({url: welcomeURL});
        return;
    }

    if (versionDiff(localStorage["updatereadt"],Date.now()) > MAJOR_VERSION){
        localStorage["updatereadt"] = Date.now();
        chrome.tabs.create({url: updateURL});
    }
}

function versionDiff(first, second) {
    return (second-first)/verTime;
}

