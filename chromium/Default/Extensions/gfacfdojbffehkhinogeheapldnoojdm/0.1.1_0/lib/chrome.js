var app = {};

app.timer = window;
app.loadReason = '';
app.onHeadersReceived = function (callback) {};
app.version = function () {return chrome.runtime.getManifest().version};
app.tab = {"open": function (url) {chrome.browser.openTab({"url": url})}};
chrome.runtime.onStartup.addListener(function() {app.loadReason = "startup"});
chrome.runtime.onInstalled.addListener(function (e) {if (e.reason === "install") app.loadReason = "install"});

app.storage = (function () {
  chrome.storage.local.get(null, function (o) {app.storage.GLOBAL = o});
  /*  */
  return {
    "GLOBAL": {},
    "read": function (id) {return app.storage.GLOBAL[id]},
    "write": function (id, data, callback) {
      var _tmp = {};
      _tmp[id] = data;
      app.storage.GLOBAL[id] = data;
      chrome.storage.local.set(_tmp, callback);
    }
  }
})();

app.UI = (function () {
  var r = {}, _UI = null;
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.path === 'ui-to-background') {
      for (var id in r) {
        if (r[id] && (typeof r[id] === "function")) {
          if (request.method === id) r[id](request.data);
        }
      }
    }
  });
  /*  */
  return {
    "receive": function (id, callback) {r[id] = callback},
    "setAlwaysOnTop": function (e) {if (_UI) _UI.setAlwaysOnTop(e)},
    "send": function (id, data) {chrome.runtime.sendMessage({"path": 'background-to-ui', "method": id, "data": data})},
    "create": function () {
      if (_UI) _UI.show();
      else {
        var url = config.UI.url;
        var width = config.UI.size.width;
        var height = config.UI.size.height;
        var alwaysOnTop = config.UI.alwaysOnTop;
        chrome.app.window.create(url, {"alwaysOnTop": alwaysOnTop, "bounds": {"width": width, "height": height}}, function (win) {
          _UI = win;
          _UI.onClosed.addListener(function () {_UI = null});
        });
      }
    }
  }
})();

app.deviceReady = function (callback) {callback(true)};
app.UI.receive("alwaysOnTop", function (e) {app.UI.setAlwaysOnTop(e)});
app.UI.receive("deviceready", function () {app.UI.send("deviceready")});
chrome.app.runtime.onLaunched.addListener(function (e) {if (e.source !== "load_and_launch") app.UI.create()});
chrome.runtime.setUninstallURL(config.welcome.url + "?v=" + app.version() + "&type=uninstall", function () {});