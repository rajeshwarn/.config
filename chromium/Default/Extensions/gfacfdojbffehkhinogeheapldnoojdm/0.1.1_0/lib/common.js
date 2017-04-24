(function () {
  app.timer.setTimeout(function () {
    var _version = config.welcome.version;
    if (_version !== app.version()) {
      if (app.loadReason === "install" || app.loadReason === "startup") {
        if (config.welcome.open) {
          app.tab.open(config.welcome.url + "?v=" + app.version() + (_version ? "&p=" + _version + "&type=upgrade" : "&type=install"));
        }
        config.welcome.version = app.version();
      }
    }
  }, config.welcome.timeout);
})();

app.UI.receive("popout", function () {
  app.tab.open("https://play.spotify.com/");
});

app.UI.receive("app.storage.write", function (o) {
  app.storage.write(o.id, o.data, function () {});
});

app.UI.receive("storage.init", function () {
  app.UI.send("storage.init", {"GLOBAL": app.storage.GLOBAL});
});

app.UI.receive("storage.update", function () {
  app.UI.send("storage.update", {"GLOBAL": app.storage.GLOBAL});
});

app.UI.receive("support", function (o) {app.tab.open(config.welcome.url)});