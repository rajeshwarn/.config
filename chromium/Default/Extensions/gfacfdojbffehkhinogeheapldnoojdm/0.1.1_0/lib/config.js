var config = {};

config.UI = {
  "url": "data/panel/index.html",
  get size () {
    var _size = app.storage.read("size");
    if (_size) return _size;
    else {
      var tmp = {"width": 1030, "height": 650};
      config.UI.size = tmp;
      return tmp;
    }
  },
  set size (o) {if (o) app.storage.write("size", o, function () {})},
  set openInTab (val) {app.storage.write("openintab", val, function () {})},
  set alwaysOnTop (val) {app.storage.write("alwaysOnTop", val, function () {})},
  get openInTab () {return (app.storage.read("openintab") + '') === "true" ? true : false},
  get alwaysOnTop () {return (app.storage.read("alwaysOnTop") + '') === "true" ? true : false}
};

config.welcome = {
  "timeout": 3000,
  get version () {return app.storage.read("version")},
  "url": "http://mybrowseraddon.com/spotify-web.html",
  set open (val) {app.storage.write("support", val, function () {})},
  set version (val) {app.storage.write("version", val, function () {})},
  get open () {return (app.storage.read("support") + '') === "false" ? false : true}
};