var APP_URL = 'http://www.piktab.com/';
chrome.runtime.setUninstallURL(APP_URL + 'home/piktabRemoved');
chrome.runtime.onInstalled.addListener(function(OnInstalledReason){
    localStorage.push = true;
    _gaq.push(['_trackEvent', 'installSelf', 'installation_complete', OnInstalledReason.reason]);

    if (OnInstalledReason.reason === "install") 
    { 
        localStorage.homepage = true;
        localStorage.defaultSearch = "internal";

        if (typeof fbq == 'function')
        {
            fbq('track', 'CompleteRegistration');
        }
        chrome.tabs.create({url: "home.html"}); 
    } else {
        localStorage.defaultSearch = "internal";
        localStorage.homepage = true;
    }
});

(function () {
    chrome.browserAction.onClicked.addListener(function (tab) 
    {
        chrome.tabs.create({url: "home.html"});
    });
})();
chrome.tabs.onCreated.addListener(function(tab){
    if (localStorage.homepage === "true") 
    {
        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            var url_active = tabs[0].url;
            var in_piktab = tabs[0].favIconUrl;
            if (url_active === 'chrome://newtab/' && !in_piktab) 
            {
                chrome.tabs.update(tab.id, {url: "home.html"});
            }
        });
    }
});