!function e(t, n, r) {
    function o(a, s) {
        if (!n[a]) {
            if (!t[a]) {
                var c = "function" == typeof require && require;
                if (!s && c) return c(a, !0);
                if (i) return i(a, !0);
                var l = new Error("Cannot find module '" + a + "'");
                throw l.code = "MODULE_NOT_FOUND", l;
            }
            var u = n[a] = {
                exports: {}
            };
            t[a][0].call(u.exports, function(e) {
                var n = t[a][1][e];
                return o(n ? n : e);
            }, u, u.exports, e, t, n, r);
        }
        return n[a].exports;
    }
    for (var i = "function" == typeof require && require, a = 0; a < r.length; a++) o(r[a]);
    return o;
}({
    1: [ function(e, t, n) {
        "use strict";
        function r(e, t, n) {
            return arguments.length < 2 ? i(e) : void o(e, t, n);
        }
        function o(e, t) {
            var n = arguments.length <= 2 || void 0 === arguments[2] ? {} : arguments[2], r = s(e) + "=" + s(t);
            null == t && (n.maxage = -1), n.maxage && (n.expires = new Date(+new Date() + n.maxage)), 
            n.path && (r += "; path=" + n.path), n.domain && (r += "; domain=" + n.domain), 
            n.expires && (r += "; expires=" + n.expires.toUTCString()), n.secure && (r += "; secure"), 
            document.cookie = r;
        }
        function i(e) {
            var t = a(document.cookie);
            return e ? t[e] : t;
        }
        function a(e) {
            var t = {}, n = e.split(/ *; */);
            if (!n[0]) return t;
            for (var r = n, o = Array.isArray(r), i = 0, r = o ? r : r[Symbol.iterator](); ;) {
                var a;
                if (o) {
                    if (i >= r.length) break;
                    a = r[i++];
                } else {
                    if (i = r.next(), i.done) break;
                    a = i.value;
                }
                var s = a;
                s = s.split("="), t[c(s[0])] = c(s[1]);
            }
            return t;
        }
        function s(e) {
            try {
                return encodeURIComponent(e);
            } catch (t) {
                return null;
            }
        }
        function c(e) {
            try {
                return decodeURIComponent(e);
            } catch (t) {
                return null;
            }
        }
        n.__esModule = !0, n["default"] = r;
    }, {} ],
    2: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return {
                type: "success",
                value: e
            };
        }
        function o(e) {
            return {
                type: "failure",
                error: e
            };
        }
        function i(e) {
            return e.then(r, o);
        }
        function a(e, t, n) {
            var r = n();
            return e > 0 ? r["catch"](function(r) {
                return new Promise(function(e, n) {
                    return setTimeout(e, t);
                }).then(function(r) {
                    return a(e - 1, t, n);
                });
            }) : r;
        }
        var s = this && this.__extends || function() {
            var e = Object.setPrototypeOf || {
                __proto__: []
            } instanceof Array && function(e, t) {
                e.__proto__ = t;
            } || function(e, t) {
                for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
            };
            return function(t, n) {
                function r() {
                    this.constructor = t;
                }
                e(t, n), t.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype, 
                new r());
            };
        }();
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var c = e("@grammarly-npm/cookie"), l = e("./util"), u = "gnar_containerId", d = "gnar_containerId_test", f = 12, p = function() {
            return new Date().setFullYear(new Date().getFullYear() + 10);
        }, m = function() {
            return new Date().setMinutes(new Date().getMinutes() + 10);
        }, h = /^\.\w+\.\w+/, g = function() {
            function e(e, t, n, r, o, i, a) {
                void 0 === t && (t = []), void 0 === o && (o = 3e5), void 0 === i && (i = 0), void 0 === a && (a = function() {
                    return Date.now();
                }), this.primaryStorage = e, this.secondaryStorages = t, this._logger = n, this._metric = r, 
                this._cacheSuccessTimeoutMillis = o, this._cacheFailureTimeoutMillis = i, this._getTime = a, 
                this._allStorages = [ e ].concat(t);
            }
            return e.prototype._expireCache = function(e) {
                0 === e ? this._cacheExpireTimestamp = 0 : e > 0 && (this._cacheExpireTimestamp = this._getTime() + e);
            }, e.prototype.getContainerId = function() {
                var e = this;
                if (void 0 !== this._cache && (void 0 === this._cacheExpireTimestamp || this._getTime() < this._cacheExpireTimestamp)) return this._cache;
                var t = this._metric.getTimer("doGetContainerId.timer").start(), n = this._doGetContainerId();
                return this._cache = n, this._cacheExpireTimestamp = void 0, n.then(function(t) {
                    return e._expireCache(e._cacheSuccessTimeoutMillis);
                }, function(t) {
                    return e._expireCache(e._cacheFailureTimeoutMillis);
                }), n.then(function(n) {
                    t.stop(), e._metric.getCounter("doGetContainerId.success").increment();
                }, function(n) {
                    t.stop(), e._metric.getCounter("doGetContainerId.failure").increment(), e._logger.warn("doGetContainerId.failed", n);
                }), n;
            }, e._generateContainerId = function() {
                return l.alphanumeric(f);
            }, e.prototype._doGetContainerId = function() {
                var t = this, n = Promise.all(this._allStorages.map(function(e) {
                    return i(e.safeGetContainerId());
                }));
                return n.then(function(n) {
                    var o = n[0];
                    if ("failure" === o.type) return Promise.reject("getting containerId from primary storage " + ("'" + t.primaryStorage.name + "' has failed: " + o.error));
                    var a, s = n.find(function(e) {
                        return "success" === e.type && void 0 !== e.value;
                    }), c = "success" === o.type && void 0 === o.value && void 0 !== s, l = !1;
                    void 0 === s ? (a = e._generateContainerId(), l = !0) : a = s.value;
                    var u = n.map(function(e, n) {
                        return "success" === e.type && e.value !== a ? i(t._allStorages[n].safeSetContainerId(a)) : Promise.resolve(r(void 0));
                    }), d = Promise.all(u).then(function(e) {
                        if (c || l) {
                            var t = e[0];
                            if ("success" !== t.type) return Promise.reject("setting containerId to primary storage has failed: " + t.error);
                        }
                        return Promise.resolve(a);
                    });
                    return d.then(function(e) {
                        c ? t._metric.getCounter("recovered").increment() : l && t._metric.getCounter("generated").increment();
                    }), d;
                });
            }, e;
        }();
        n.ContainerIdManager = g;
        var b = function() {
            function e(e) {
                this.name = e;
            }
            return e.prototype.safeSetContainerId = function(e) {
                var t = this;
                return this.ensureAvailable().then(function() {
                    return t.setContainerId(e);
                });
            }, e.prototype.safeGetContainerId = function() {
                var e = this;
                return this.ensureAvailable().then(function() {
                    return e.getContainerId();
                }).then(function(e) {
                    return "" === e ? void 0 : e;
                });
            }, e;
        }();
        n.BaseStorage = b;
        var v = function(e) {
            function t(t, n) {
                var r = e.call(this, "chromeCookie") || this;
                if (r._url = t, r._domain = n, !h.test(n)) throw new Error('Incorrect cookie domain provided.\n        Use top-level domain, starting from "."');
                return r;
            }
            return s(t, e), t.prototype._hasRuntimeError = function() {
                return window.chrome && window.chrome.runtime && window.chrome.runtime.lastError;
            }, t.prototype.ensureAvailable = function() {
                var e = this;
                return a(2, 1e3, function() {
                    return new Promise(function(t, n) {
                        var r = l.alphanumeric(10);
                        try {
                            window.chrome.cookies.set({
                                name: r,
                                value: r,
                                url: e._url,
                                domain: e._domain,
                                expirationDate: m() / 1e3
                            }, function(o) {
                                var i = e._hasRuntimeError();
                                !o && i && n("chrome.cookie.set failed with an error: " + i.message), o && o.value === r ? t() : n(new Error("ChromeCookieStorage is unavailable.\n              Availability test failed.\n              Tried to set " + r + ", the result is " + (o ? o.value : o) + "."));
                            });
                        } catch (o) {
                            n(o);
                        }
                    });
                });
            }, t.prototype.getContainerId = function() {
                var e = this;
                return new Promise(function(t, n) {
                    try {
                        window.chrome.cookies.get({
                            url: e._url,
                            name: u
                        }, function(r) {
                            var o = e._hasRuntimeError();
                            !r && o && n("chrome.cookie.get failed with an error: " + o.message), t(r ? r.value : void 0);
                        });
                    } catch (r) {
                        n(r);
                    }
                });
            }, t.prototype.setContainerId = function(e) {
                var t = this;
                return new Promise(function(n, r) {
                    try {
                        window.chrome.cookies.set({
                            name: u,
                            value: e,
                            url: t._url,
                            domain: t._domain,
                            expirationDate: p() / 1e3
                        }, function(o) {
                            var i = t._hasRuntimeError();
                            !o && i && r("chrome.cookie.set failed with an error: " + i.message), o && o.value === e || r(new Error("setContainerId failed.\n            Tried to set " + e + ", the result is " + (o ? o.value : o) + ".")), 
                            n();
                        });
                    } catch (o) {
                        r(o);
                    }
                });
            }, t;
        }(b);
        n.ChromeCookieStorage = v;
        var _ = function(e) {
            function t(t, n) {
                var r = e.call(this, "webExtensionsCookie") || this;
                if (r._url = t, r._domain = n, !h.test(n)) throw new Error('Incorrect cookie domain provided.\n        Use top-level domain, starting from "."');
                return r;
            }
            return s(t, e), t.prototype.ensureAvailable = function() {
                var e = this;
                return a(2, 1e3, function() {
                    return new Promise(function(t, n) {
                        var r = l.alphanumeric(10);
                        window.browser.cookies.set({
                            name: r,
                            value: r,
                            url: e._url,
                            domain: e._domain,
                            expirationDate: m() / 1e3
                        }).then(function() {
                            window.browser.cookies.get({
                                url: e._url,
                                name: r
                            }).then(function(e) {
                                e && e.value === r ? t() : n(new Error("WebExtensionsCookieStorage is unavailable.\n              Availability test failed.\n              Tried to set " + r + ", the result is " + (e ? e.value : e) + "."));
                            })["catch"](function(e) {
                                n("browser.cookies.get failed with an error: " + e.message);
                            });
                        })["catch"](function(e) {
                            n("browser.cookies.set failed with an error: " + e.message);
                        });
                    });
                });
            }, t.prototype.getContainerId = function() {
                var e = this;
                return new Promise(function(t, n) {
                    window.browser.cookies.get({
                        url: e._url,
                        name: u
                    }).then(function(e) {
                        t(e ? e.value : void 0);
                    })["catch"](function(e) {
                        n("browser.cookies.get failed with an error: " + e.message);
                    });
                });
            }, t.prototype.setContainerId = function(e) {
                var t = this;
                return new Promise(function(n, r) {
                    window.browser.cookies.set({
                        name: u,
                        value: e,
                        url: t._url,
                        domain: t._domain,
                        expirationDate: p() / 1e3
                    }).then(function(t) {
                        t && t.value === e || r(new Error("setContainerId failed.\n          Tried to set " + e + ", the result is " + (t ? t.value : t) + ".")), 
                        n();
                    })["catch"](function(e) {
                        r("browser.cookies.set failed with an error: " + e.message);
                    });
                });
            }, t;
        }(b);
        n.WebExtensionsCookieStorage = _;
        var y = function(e) {
            function t() {
                return e.call(this, "localStorage") || this;
            }
            return s(t, e), t.prototype.ensureAvailable = function() {
                var e = l.alphanumeric(10);
                return new Promise(function(t, n) {
                    localStorage.setItem(d, e), localStorage.getItem(d) !== e ? n(new Error("LocalStorage is unavailable.\n          Availability test failed.\n          Tried to set " + e + ", the result is " + localStorage.getItem(d) + ".")) : t(), 
                    localStorage.removeItem(d);
                });
            }, t.prototype.getContainerId = function() {
                var e = localStorage.getItem(u);
                return new Promise(function(t, n) {
                    return t(null === e ? void 0 : e);
                });
            }, t.prototype.setContainerId = function(e) {
                return new Promise(function(t, n) {
                    localStorage.setItem(u, e), t();
                });
            }, t;
        }(b);
        n.LocalStorage = y;
        var w = function(e) {
            function t(t) {
                var n = e.call(this, "cookie") || this;
                if (n._domain = t, !h.test(t)) throw new Error('Incorrect cookie domain provided.\n        Use top-level domain, starting from "."');
                return n;
            }
            return s(t, e), t.prototype._getCookieOptions = function() {
                return {
                    path: "/",
                    domain: this._domain,
                    expires: new Date(p())
                };
            }, t.prototype.ensureAvailable = function() {
                var e = l.alphanumeric(10);
                return new Promise(function(t, n) {
                    c["default"](e, e), c["default"](e) !== e ? n(new Error("CookieStorage is unavailable.\n          Availability test failed.\n          Tried to set " + e + ", the result is " + c["default"](e) + ".")) : t(), 
                    c["default"](e, null);
                });
            }, t.prototype.getContainerId = function() {
                return new Promise(function(e, t) {
                    return e(c["default"](u));
                });
            }, t.prototype.setContainerId = function(e) {
                var t = this;
                return new Promise(function(n, r) {
                    c["default"](u, e, t._getCookieOptions()), n();
                });
            }, t;
        }(b);
        n.CookieStorage = w;
        var k = function(e) {
            function t(t, n) {
                var r = e.call(this, "backend") || this;
                return r._fetch = t, r._url = n, r._keyName = u, r._testKeyName = d, r._baseUrl = n + "/cookies", 
                r;
            }
            return s(t, e), t.prototype.ensureAvailable = function() {
                var e = this, t = l.alphanumeric(10), n = (m() - Date.now()) / 1e3, r = this._baseUrl + "?name=" + this._testKeyName, o = r + "&value=" + t + "&maxAge=" + n;
                return this._doSend(o, "post").then(function(e) {
                    if (!e.ok) throw new Error("BackendStorage is unavailable.\n          Availability test failed.\n          Tried to set " + t + ". Request failed.\n        ");
                }).then(function() {
                    return e._doSend(r, "get").then(function(n) {
                        if (n.ok) return n.json().then(function(n) {
                            if (n.value !== t) throw new Error("BackendStorage is unavailable.\n                Availability test failed.\n                Tried to get " + e._testKeyName + " from server.\n                Got " + n.value + " instead of " + t + ".");
                        });
                        throw new Error("BackendStorage is unavailable.\n            Availability test failed.\n            Tried to get " + e._testKeyName + " from server. Request failed.");
                    });
                });
            }, t.prototype._doSend = function(e, t) {
                return this._fetch(e, {
                    credentials: "include",
                    method: t
                });
            }, t.prototype.getContainerId = function() {
                var e = this._baseUrl + "?name=" + this._keyName;
                return this._doSend(e, "get").then(function(e) {
                    return e.json();
                }).then(function(e) {
                    return e.value;
                });
            }, t.prototype.setContainerId = function(e) {
                var t = (p() - Date.now()) / 1e3, n = this._baseUrl + "?name=" + this._keyName + "&value=" + e + "&maxAge=" + t;
                return this._doSend(n, "post").then(function() {});
            }, t;
        }(b);
        n.BackendStorage = k;
        var E = function(e) {
            function t(t) {
                void 0 === t && (t = void 0);
                var n = e.call(this, "memory") || this;
                return n._value = t, n;
            }
            return s(t, e), t.prototype.ensureAvailable = function() {
                return Promise.resolve();
            }, t.prototype.getContainerId = function() {
                return Promise.resolve(this._value);
            }, t.prototype.setContainerId = function(e) {
                return this._value = e, Promise.resolve();
            }, t;
        }(b);
        n.MemoryStorage = E;
    }, {
        "./util": 4,
        "@grammarly-npm/cookie": 1
    } ],
    3: [ function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var r = e("./util"), o = e("./container_id_manager");
        n.ContainerIdManager = o.ContainerIdManager, n.BaseStorage = o.BaseStorage, n.MemoryStorage = o.MemoryStorage, 
        n.LocalStorage = o.LocalStorage, n.CookieStorage = o.CookieStorage, n.ChromeCookieStorage = o.ChromeCookieStorage, 
        n.WebExtensionsCookieStorage = o.WebExtensionsCookieStorage, n.BackendStorage = o.BackendStorage;
        var i = [ "eventName", "client", "clientVersion", "userId", "isTest", "containerId", "instanceId", "batchId" ], a = "gnar_nextPingTimestamp", s = function() {
            function e(e, t, n, o, i, a, s, c) {
                void 0 === c && (c = !1), this._client = t, this._clientVersion = n, this._fetch = o, 
                this._containerIdManager = i, this._logger = a, this._metric = s, this._storePingTimestamp = c, 
                this._batchId = 0, this._instanceId = r.alphanumeric(8), this._isReady = !1, this._queue = [], 
                this._eventsUrl = e + "/events", this._pingMaybe();
            }
            return e.prototype.track = function(e, t) {
                if (void 0 === t && (t = {}), 0 === e.indexOf(this._client + "/")) throw new Error("Event name " + e + " should not start with '" + this._client + "/'");
                Object.keys(t).forEach(function(e) {
                    if (i.indexOf(e) !== -1) throw new Error("Event data should not contain '" + e + "' prop.");
                }), this._isReady ? ("ping" !== e && this._pingMaybe(), this._send(e, t)) : this._enqueue(e, t);
            }, e.prototype.setUser = function(e, t) {
                if (null === e || "" === e) throw new Error("Invalid userId: " + e);
                var n = this._userId && this._userId !== e && !(/^-/.test(e) && /^-/.test(this._userId));
                this._isTest = t, this._userId = e, n && this._pingMaybe(!0), this._isReady || (this._execQueue(), 
                this._isReady = !0);
            }, e.prototype.getContainerId = function() {
                return this._containerIdManager.getContainerId();
            }, e.prototype._setNextPingTimestamp = function() {
                var e = r.getNextPingDate();
                if (this._nextPingTimestamp = e, this._storePingTimestamp) try {
                    localStorage.setItem(a, e.toString());
                } catch (t) {
                    this._metric.getCounter("nextPingDate.write.failure").increment(), this._logger.warn("nextPingDate.write.failed", t);
                }
            }, e.prototype._getNextPingTimestamp = function() {
                var e = this._nextPingTimestamp;
                if (void 0 !== e || !this._storePingTimestamp) return e;
                try {
                    var t = localStorage.getItem(a);
                    e = null === t ? void 0 : parseInt(t, 10);
                } catch (n) {
                    e = void 0, this._metric.getCounter("nextPingDate.read.failure").increment(), this._logger.warn("nextPingDate.read.failed", n);
                }
                return e;
            }, e.prototype._shouldPing = function(e) {
                if (e) return !0;
                var t = this._getNextPingTimestamp();
                return void 0 === t || t < Date.now();
            }, e.prototype._pingMaybe = function(e) {
                if (void 0 === e && (e = !1), this._shouldPing(e)) {
                    this._setNextPingTimestamp();
                    var t = {
                        referrer: document.referrer,
                        url: document.location.href,
                        userAgent: navigator.userAgent,
                        navigatorAppName: navigator.appName,
                        navigatorAppCodeName: navigator.appCodeName,
                        navigatorAppVersion: navigator.appVersion,
                        navigatorVendor: navigator.vendor,
                        screenWidth: screen.width,
                        screenHeight: screen.height
                    };
                    this.track("ping", t);
                }
            }, e.prototype.pingMaybe = function() {
                this._pingMaybe();
            }, e.prototype._enqueue = function(e, t) {
                this._queue.push([ e, t ]);
            }, e.prototype._execQueue = function() {
                var e = this;
                this._queue.forEach(function(t) {
                    var n = t[0], r = t[1];
                    return e._send(n, r);
                }), this._queue = [];
            }, e.prototype._send = function(e, t) {
                var n = this, r = this._batchId++;
                this.getContainerId().then(function(o) {
                    var i = {
                        eventName: n._client + "/" + e,
                        client: n._client,
                        clientVersion: n._clientVersion,
                        userId: n._userId,
                        isTest: n._isTest,
                        containerId: o,
                        instanceId: n._instanceId,
                        batchId: r
                    };
                    return n._doSend(i, t);
                })["catch"](function(e) {
                    n._metric.getCounter("send.failure").increment(), n._logger.warn("send.failed", e);
                });
            }, e.prototype._doSend = function(e, t) {
                return this._fetch(this._eventsUrl, {
                    mode: "cors",
                    credentials: "include",
                    method: "post",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        events: [ Object.assign(e, t) ]
                    })
                });
            }, e;
        }();
        n.GnarClientImpl = s;
        var c = function() {
            function e() {
                this.history = [];
            }
            return e.prototype.track = function(e, t) {
                void 0 === t && (t = {}), this.history.push({
                    eventName: e,
                    props: t
                });
            }, e.prototype.pingMaybe = function() {}, e.prototype.setUser = function(e, t) {}, 
            e.prototype.getContainerId = function() {
                return Promise.resolve("dummy_container_id");
            }, e;
        }();
        n.MemoryGnarClient = c;
        var l = function() {
            function e() {}
            return e.prototype.track = function(e, t) {
                void 0 === t && (t = {});
                var n = "trackingGnar";
                try {
                    var r = JSON.parse(localStorage.getItem(n)) || [];
                    r.push({
                        eventName: e,
                        props: t
                    }), localStorage.setItem(n, JSON.stringify(r));
                } catch (o) {}
            }, e.prototype.pingMaybe = function() {}, e.prototype.setUser = function(e, t) {}, 
            e.prototype.getContainerId = function() {
                return Promise.resolve("dummy_container_id");
            }, e;
        }();
        n.LocalStorageGnarClient = l;
    }, {
        "./container_id_manager": 2,
        "./util": 4
    } ],
    4: [ function(e, t, n) {
        "use strict";
        function r(e, t) {
            if (void 0 === t && (t = ""), e <= 0) return t;
            var n = Math.floor(Math.random() * (i.length - 1));
            return r(e - 1, t + i.charAt(n));
        }
        function o() {
            var e = new Date();
            return e.getHours() > 2 && e.setDate(e.getDate() + 1), e.setHours(3), e.setMinutes(Math.floor(60 * Math.random())), 
            e.getTime();
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        n.alphanumeric = r, n.getNextPingDate = o;
    }, {} ],
    5: [ function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var r = e("./ring_buffer"), o = function() {
            function e(e, t, n, o) {
                var i = this;
                this._eventsSink = n, this._crashLogger = o, this._crashLogged = !1, this.sink = function(e) {
                    i._buffer.push(e), i._eventsSink(e), i._trigger(e) && i._sendCrashLog(e);
                }, this._buffer = new r.RingBuffer(e, (!0)), this._trigger = "function" == typeof t ? t : function(e) {
                    return e.level >= t;
                };
            }
            return e.prototype._sendCrashLog = function(e) {
                if (!this._crashLogged || this._buffer.size > this._buffer.capacity / 2) {
                    var t = void 0;
                    try {
                        t = JSON.stringify(this._buffer, void 0, "");
                    } catch (n) {
                        t = n;
                    }
                    this._crashLogger.log(e.level, "CrashLog", {
                        events: t,
                        first: !this._crashLogged
                    }), this._crashLogged = !0, this._buffer.clear();
                }
            }, e;
        }();
        n.CrashLogWrapper = o;
    }, {
        "./ring_buffer": 9
    } ],
    6: [ function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var r = e("./log4ts");
        n.Logging = r;
        var o = e("./log4ts_impl");
        n.LoggingImpl = o;
        var i = e("./timeseries");
        n.TimeSeries = i;
        var a = e("./timeseries_impl");
        n.TimeSeriesImpl = a;
        var s = e("./utils");
        n.EventProps = s.EventProps;
        var c;
        !function(e) {
            var t = function() {
                function e() {}
                return Object.defineProperty(e, "root", {
                    get: function() {
                        return o.LoggingConfig.getRootLogger();
                    },
                    enumerable: !0,
                    configurable: !0
                }), e.getLogger = function(t, n) {
                    return e.root.getLogger(t, n);
                }, e;
            }();
            e.Logging = t;
            var n = function() {
                function e() {}
                return Object.defineProperty(e, "root", {
                    get: function() {
                        return a.MetricsConfig.getRootMetric();
                    },
                    enumerable: !0,
                    configurable: !0
                }), e;
            }();
            e.TimeSeries = n;
        }(c = n.Monitoring || (n.Monitoring = {}));
    }, {
        "./log4ts": 7,
        "./log4ts_impl": 8,
        "./timeseries": 10,
        "./timeseries_impl": 11,
        "./utils": 12
    } ],
    7: [ function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var r;
        !function(e) {
            e[e.TRACE = 0] = "TRACE", e[e.DEBUG = 1] = "DEBUG", e[e.INFO = 2] = "INFO", e[e.WARN = 3] = "WARN", 
            e[e.ERROR = 4] = "ERROR", e[e.FATAL = 5] = "FATAL", e[e.OFF = 6] = "OFF";
        }(r = n.LogLevel || (n.LogLevel = {})), function(e) {
            function t(t) {
                switch (t) {
                  case "TRACE":
                    return e.TRACE;

                  case "DEBUG":
                    return e.DEBUG;

                  case "INFO":
                    return e.INFO;

                  case "WARN":
                    return e.WARN;

                  case "ERROR":
                    return e.ERROR;

                  case "FATAL":
                    return e.FATAL;

                  case "OFF":
                    return e.OFF;

                  default:
                    ;
                    throw new TypeError("Unrecognized log level string '" + t + "'");
                }
            }
            e.fromString = t;
        }(r = n.LogLevel || (n.LogLevel = {}));
    }, {} ],
    8: [ function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var r = e("tslib"), o = e("./utils"), i = e("./log4ts"), a = e("./utils"), s = e("./crash_logger"), c = e("./ring_buffer"), l = function() {
            function e(e) {
                this.parent = e, this.context = void 0;
            }
            return e.prototype.get = function() {
                var e = this.parent && this.parent.get(), t = this.context;
                return e || t ? Object.assign({}, e, t) : void 0;
            }, e.prototype.add = function(e) {
                this.context = Object.assign({}, this.context, e);
            }, e.prototype.remove = function(e) {
                var t = this;
                this.context && e.forEach(function(e) {
                    e in t.context && delete t.context[e];
                });
            }, e.prototype.clear = function() {
                this.context = void 0;
            }, e;
        }();
        n.TreeContext = l;
        var u = function() {
            function e(e, t, n) {
                this.name = e, this.level = t, this.context = n, o.validateName(e);
            }
            return e.prototype.isEnabled = function(e) {
                return e >= this.level;
            }, e.prototype.handler = function(e, t) {
                var n = this;
                return {
                    trace: function(r) {
                        throw n.trace(e, r, t), r;
                    },
                    debug: function(r) {
                        throw n.debug(e, r, t), r;
                    },
                    info: function(r) {
                        throw n.info(e, r, t), r;
                    },
                    warn: function(r) {
                        throw n.warn(e, r, t), r;
                    },
                    error: function(r) {
                        throw n.error(e, r, t), r;
                    },
                    fatal: function(r) {
                        throw n.fatal(e, r, t), r;
                    }
                };
            }, e.prototype.trace = function(e, t, n) {
                this.log(i.LogLevel.TRACE, e, t, n);
            }, e.prototype.debug = function(e, t, n) {
                this.log(i.LogLevel.DEBUG, e, t, n);
            }, e.prototype.info = function(e, t, n) {
                this.log(i.LogLevel.INFO, e, t, n);
            }, e.prototype.warn = function(e, t, n) {
                this.log(i.LogLevel.WARN, e, t, n);
            }, e.prototype.error = function(e, t, n) {
                this.log(i.LogLevel.ERROR, e, t, n);
            }, e.prototype.fatal = function(e, t, n) {
                this.log(i.LogLevel.FATAL, e, t, n);
            }, e.prototype.log = function(e, t, n, r) {
                this.isEnabled(e) && (n && r || a.ErrorLike.isErrorLike(n) ? this.logImpl(e, t, n, r) : this.logImpl(e, t, void 0, r || n));
            }, e;
        }();
        n.AbstractLogger = u;
        var d = function() {
            function e(e, t, n, r, o, i, a) {
                this.level = e, this.message = t, this.logger = n, this.timestamp = r, this.exception = o, 
                this.extra = i, this.context = a;
            }
            return e;
        }();
        n.LogEvent = d;
        var f = function(e) {
            function t(t, n, r, o) {
                var i = e.call(this, t, n, o || new l()) || this;
                return i.appender = r, i;
            }
            return r.__extends(t, e), t.prototype.getLogger = function(e, n) {
                return new t(this.name + "." + e, n || this.level, this.appender, new l(this.context));
            }, t.prototype.logImpl = function(e, t, n, r) {
                var o = new d(e, t, this.name, Date.now(), n, r, this.context.get());
                try {
                    this.appender(o);
                } catch (n) {
                    console.error("Failed processing log event", n);
                    try {
                        p.printToConsole(o);
                    } catch (i) {
                        console.error("No luck. Can't print the event", i);
                    }
                }
            }, t;
        }(u);
        n.SimpleLogger = f;
        var p = function(e) {
            function t(n, r, o) {
                return e.call(this, n, r, t.printToConsole, o) || this;
            }
            return r.__extends(t, e), t.printToConsole = function(e) {
                var t = console.log;
                t = e.level <= i.LogLevel.TRACE ? console.trace || console.log : e.level <= i.LogLevel.DEBUG ? console.debug || console.log : e.level <= i.LogLevel.INFO ? console.log : e.level <= i.LogLevel.WARN ? console.warn : console.error, 
                t.apply(console, [ "[" + e.logger + "]: " + i.LogLevel[e.level] + " : " + e.message, e.exception, e.extra ].filter(function(e) {
                    return !!e;
                }));
            }, t;
        }(f);
        n.ConsoleLogger = p;
        var m = function() {
            function e() {}
            return e.createRootLogger = function(t, n, r, o, a) {
                void 0 === a && (a = !1);
                var c = function(t) {
                    t.level >= n && (a && p.printToConsole(t), r.append(t)["catch"](e._onError));
                }, u = new l(), d = c;
                if (o) {
                    var m = new f(t + ".crashLogs", i.LogLevel.TRACE, function(t) {
                        o.append(t)["catch"](e._onError);
                    }, new l(u)), h = new s.CrashLogWrapper(500, i.LogLevel.ERROR, c, m);
                    d = h.sink;
                }
                return new f(t, n, d, u);
            }, e;
        }();
        m._onError = function(e) {
            return p.printToConsole(new d(i.LogLevel.WARN, "Error while logging message to the server.", "Fallback", 0, (void 0), e));
        }, n.DefaultLogAppender = m;
        var h = function() {
            function e(e) {
                var t = this;
                this.event = e, this.promise = new Promise(function(e, n) {
                    t.resolve = e;
                }).then(function() {});
            }
            return e;
        }(), g = 300, b = 1e4, v = function() {
            function e(e, t, n) {
                void 0 === t && (t = g), void 0 === n && (n = b), this._sink = e, this._retryInterval = n, 
                this._currentItem = null, this._skippedCounter = null, this._buffer = new c.RingBuffer(t, (!1));
            }
            return e.prototype.append = function(e) {
                if (this._buffer.isFull) return this._incSkippedCounter(), Promise.reject(new Error("Outgoing message buffer is full"));
                var t = new h(e);
                return this._buffer.push(t), this._doAppend(), t.promise;
            }, e.prototype._incSkippedCounter = function() {
                this._skippedCounter || (this._skippedCounter = new d(i.LogLevel.WARN, "Messages was skipped due to buffer overflow", "log4ts_impl.LogQueue", Date.now(), (void 0), {
                    count: 0
                })), this._skippedCounter.extra.count++;
            }, e.prototype._doAppend = function() {
                var e = this;
                if (!this._buffer.isEmpty && !this._currentItem) {
                    var t = this._buffer.first, n = this._sink.append(t.event);
                    this._currentItem = t, n.then(function() {
                        t.resolve();
                        var n = e._buffer.pop();
                        if (n !== t && n === e._currentItem) throw new Error("Illegal state");
                        e._currentItem = null, e._skippedCounter && (e.append(e._skippedCounter), e._skippedCounter = null), 
                        e._doAppend();
                    })["catch"](function(n) {
                        e._retryAppend(t);
                    });
                }
            }, e.prototype._retryAppend = function(e) {
                var t = this;
                setTimeout(function() {
                    var n = e.event.extra || {};
                    n.appendRetries || (n = e.event.extra = Object.assign({
                        appendRetries: 1
                    }, n)), ++n.appendRetries, t._currentItem = null, t._doAppend();
                }, this._retryInterval);
            }, e;
        }();
        n.LogQueue = v;
        var _ = function() {
            function e() {}
            return e.prototype.append = function(e) {
                return Promise.resolve();
            }, e;
        }();
        n.DummyFelogClient = _;
        var y = function() {
            function e(e, t, n, r) {
                this._appName = e, this._appVersion = t, this._env = n, this._fetch = r;
            }
            return e.prototype.append = function(e) {
                return this._fetch(this._prepareData(e));
            }, e.prototype._toObject = function(e) {
                return void 0 === e || null === e || e instanceof Object && !Array.isArray(e) ? e : {
                    extra: e
                };
            }, e.prototype._parseException = function(e) {
                if (e) {
                    var t = this._toObject(e), n = t.name, o = void 0 === n ? "UnknownError" : n, i = t.message, a = void 0 === i ? "Unknown error message" : i, s = t.stack, c = r.__rest(t, [ "name", "message", "stack" ]);
                    return {
                        exceptionPart: {
                            exception: {
                                name: o,
                                message: a,
                                stack: s
                            }
                        },
                        exceptionDetailsPart: Object.keys(c).length > 0 ? {
                            exceptionDetails: c
                        } : {}
                    };
                }
                return {
                    exceptionPart: {},
                    exceptionDetailsPart: {}
                };
            }, e.prototype._prepareData = function(e) {
                var t = e.context ? {
                    context: e.context
                } : {}, n = this._parseException(e.exception), r = n.exceptionPart, o = n.exceptionDetailsPart, a = JSON.stringify(Object.assign({}, o, this._toObject(e.extra))), s = Object.assign({
                    message: e.message,
                    logger: e.logger,
                    level: i.LogLevel[e.level],
                    application: this._appName,
                    version: this._appVersion,
                    env: this._env
                }, t, r, "{}" !== a && {
                    details: a
                });
                return JSON.stringify(s, null, "");
            }, e;
        }();
        n.FelogClientBase = y;
        var w = function(e) {
            function t(t, n, r, o, i) {
                return e.call(this, n, r, o, function(e) {
                    return i(t, {
                        method: "POST",
                        cache: "no-cache",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: e
                    }).then(function() {});
                }) || this;
            }
            return r.__extends(t, e), t;
        }(y);
        n.PostFelogClient = w;
        var k = function(e) {
            function t(t, n, r, o, i) {
                var a = this, s = t + "/log?json=";
                return a = e.call(this, n, r, o, function(e) {
                    return i(s + encodeURIComponent(e), {
                        mode: "no-cors",
                        method: "get",
                        cache: "no-cache"
                    }).then(function() {});
                }) || this;
            }
            return r.__extends(t, e), t;
        }(y);
        n.GetFelogClient = k;
        var E = function() {
            function e() {}
            return e.getRootLogger = function() {
                return e._rootLogger || (e._rootLogger = e._createDefaultRootLogger(), e._rootLogger.warn("Using DEFAULT root logger")), 
                e._rootLogger;
            }, e.configure = function(t) {
                e._rootLogger = t, e._rootLogger.debug("ROOT logger changed", t);
            }, e._createDefaultRootLogger = function() {
                return new p("DEFAULT", i.LogLevel.DEBUG);
            }, e;
        }();
        n.LoggingConfig = E;
    }, {
        "./crash_logger": 5,
        "./log4ts": 7,
        "./ring_buffer": 9,
        "./utils": 12,
        tslib: "tslib"
    } ],
    9: [ function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var r = function() {
            function e(e, t) {
                if (void 0 === t && (t = !1), this.capacity = e, this.allowOverflow = t, this._start = 0, 
                this._end = 0, this._isFull = !1, this.toJSON = this.toArray, e <= 0) throw new Error("Invalid capacity " + e);
                this._buffer = new Array(e);
            }
            return Object.defineProperty(e.prototype, "size", {
                get: function() {
                    return this._isFull ? this._buffer.length : (this._end - this._start + this._buffer.length) % this._buffer.length;
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(e.prototype, "isEmpty", {
                get: function() {
                    return 0 === this.size;
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(e.prototype, "isFull", {
                get: function() {
                    return this._isFull;
                },
                enumerable: !0,
                configurable: !0
            }), e.prototype.push = function(e) {
                if (this.isFull) {
                    if (!this.allowOverflow) throw new Error("Buffer is full");
                    ++this._start, this._start === this.capacity && (this._start = 0);
                }
                this._buffer[this._end++] = e, this._end === this.capacity && (this._end = 0), this._start === this._end && (this._isFull = !0);
            }, e.prototype.pop = function() {
                if (!this.isEmpty) {
                    var e = this._buffer[this._start];
                    return this._buffer[this._start] = void 0, this._start++, this._start === this.capacity && (this._start = 0), 
                    this._isFull = !1, e;
                }
            }, Object.defineProperty(e.prototype, "first", {
                get: function() {
                    return this.isEmpty ? void 0 : this._buffer[this._start];
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(e.prototype, "last", {
                get: function() {
                    return this.isEmpty ? void 0 : this._buffer[0 === this._end ? this.capacity - 1 : this._end - 1];
                },
                enumerable: !0,
                configurable: !0
            }), e.prototype.clear = function() {
                this._buffer = new Array(this.capacity), this._start = this._end = 0, this._isFull = !1;
            }, e.prototype.toArray = function() {
                var e;
                if (this.isEmpty) e = new Array(0); else if (this._start < this._end) e = this._buffer.slice(this._start, this._end); else {
                    e = new Array(this.size);
                    for (var t = 0, n = this._start; n < this.capacity; ++n, ++t) e[t] = this._buffer[n];
                    for (var n = 0; n < this._end; ++n, ++t) e[t] = this._buffer[n];
                }
                return e;
            }, e;
        }();
        n.RingBuffer = r;
    }, {} ],
    10: [ function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
    }, {} ],
    11: [ function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var r = e("tslib"), o = e("./utils"), i = function() {
            function e(e, t, n) {
                this.name = e, this.timersSink = t, this.countersSink = n, o.validateName(e);
            }
            return e.prototype.getMetric = function(e) {
                return this._createChild(e);
            }, e.prototype.getTimer = function(e) {
                return this._createChild(e);
            }, e.prototype.getCounter = function(e) {
                return this._createChild(e);
            }, Object.defineProperty(e.prototype, "parent", {
                get: function() {
                    var t = this.name.lastIndexOf("."), n = this.name.substring(0, t === -1 ? 0 : t);
                    return "" === n ? void 0 : new e(n, this.timersSink, this.countersSink);
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(e.prototype, "root", {
                get: function() {
                    var t = this.name.indexOf("."), n = this.name.substring(0, t === -1 ? 0 : t);
                    return "" === n ? this : new e(n, this.timersSink, this.countersSink);
                },
                enumerable: !0,
                configurable: !0
            }), e.prototype._createName = function(e) {
                return this.name + "." + e;
            }, e.prototype.start = function() {
                var e = Date.now(), t = this;
                return {
                    stop: function() {
                        t.recordTime(Date.now() - e);
                    }
                };
            }, e.prototype.recordTime = function(e) {
                this.timersSink(this.name, e);
            }, e.prototype.timing = function(e) {
                var t = this.start();
                try {
                    return e();
                } finally {
                    try {
                        t.stop();
                    } catch (n) {}
                }
            }, e.prototype.increment = function(e) {
                void 0 === e && (e = 1), this.countersSink(this.name, e);
            }, e.prototype.decrement = function(e) {
                void 0 === e && (e = 1), this.increment(-e);
            }, e.prototype._createChild = function(t) {
                return new e(this._createName(t), this.timersSink, this.countersSink);
            }, e;
        }();
        n.AbstractMetricsStorage = i;
        var a = function(e) {
            function t(t) {
                return e.call(this, "MP", function(e, n) {
                    return t("TIMER: " + e + " = " + n);
                }, function(e, n) {
                    return t("COUNTER: " + e + " = " + n);
                }) || this;
            }
            return r.__extends(t, e), t;
        }(i);
        n.MetricsPrinter = a;
        var s = 7500, c = 3, l = function(e) {
            function t(t, n, r, o) {
                void 0 === o && (o = s);
                var i = e.call(this, t, function(e, t) {
                    return i._reportTimer(e, t);
                }, function(e, t) {
                    return i._reportCounter(e, t);
                }) || this;
                return i._fetch = r, i._sendTimeout = o, i._countersBuffer = {}, i._timersBuffer = new Array(), 
                i._sendTimer = void 0, i._sendData = function() {
                    var e = [ i._timersBuffer.join("&"), Object.keys(i._countersBuffer).map(function(e) {
                        return e + "=" + i._countersBuffer[e];
                    }).join("&") ].filter(function(e) {
                        return e.length;
                    }).join("&"), t = i._baseUrl + e;
                    i._timersBuffer.length = 0, i._countersBuffer = {}, i._sendTimer = void 0;
                    var n = 0, r = function() {
                        i._fetch(t, {
                            mode: "no-cors",
                            cache: "no-cache"
                        })["catch"](function(e) {
                            n++ < c ? setTimeout(r, 5e3 * n) : console.error("Cannot send timesereies data", e, t);
                        });
                    };
                    r();
                }, i._baseUrl = n + "/ts?", i;
            }
            return r.__extends(t, e), t.createRoot = function(e, n, r) {
                return new t(e, n, r);
            }, t.prototype._reportTimer = function(e, t) {
                this._timersBuffer.push("t." + e + "=" + t), this._startSending();
            }, t.prototype._reportCounter = function(e, t) {
                var n = "c." + e;
                this._countersBuffer[n] = (this._countersBuffer[n] || 0) + t, this._startSending();
            }, t.prototype._startSending = function() {
                this._sendTimer || (this._sendTimer = setTimeout(this._sendData, this._sendTimeout));
            }, t;
        }(i);
        n.MetricsStorage = l;
        var u = function() {
            function e() {}
            return e.getRootMetric = function() {
                return e._metricsRoot || (console.warn("[WARNING] Using default timeseries implementation."), 
                e._metricsRoot = new a(console.log)), e._metricsRoot;
            }, e.configure = function(t) {
                e._metricsRoot = t;
            }, e;
        }();
        n.MetricsConfig = u;
    }, {
        "./utils": 12,
        tslib: "tslib"
    } ],
    12: [ function(e, t, n) {
        "use strict";
        function r(e) {
            if ("" === e) throw new Error("Empty name");
            if (!a.test(e)) throw new Error("Invalid name: " + e + ". Should be hierarchical dot separated string and may contain only word characters)");
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var o;
        !function(e) {
            function t(e) {
                var t = e;
                return t && (void 0 !== t.message && void 0 !== t.name || void 0 !== t.stack);
            }
            e.isErrorLike = t;
        }(o = n.ErrorLike || (n.ErrorLike = {}));
        var i;
        !function(e) {
            function t(e) {
                return n(e, [ e ], o.isErrorLike(e));
            }
            function n(e, t, r) {
                if (!e) return {};
                var i = {}, a = r ? Object.getOwnPropertyNames : Object.keys;
                return a(e).forEach(function(r) {
                    var a = e[r];
                    if (null === a || void 0 === a || "number" == typeof a || "string" == typeof a || "boolean" == typeof a) i[r] = a; else if ("object" == typeof a) if (a instanceof Boolean || a instanceof Number || a instanceof String || a instanceof Date || a instanceof RegExp) i[r] = a.toString(); else if (t.indexOf(a) === -1) {
                        t.push(a);
                        var s = n(a, t, o.isErrorLike(a));
                        Object.keys(s).length > 0 && (i[r] = s);
                    }
                }), i;
            }
            e.fromAny = t;
        }(i = n.EventProps || (n.EventProps = {}));
        var a = /^(?!\.[\w])[\w.]*\w$/;
        n.validateName = r;
    }, {} ],
    13: [ function(e, t, n) {
        !function() {
            function e(e, t) {
                var r = n(e, t);
                return void 0 == r.from ? {
                    s: -1,
                    delta: 0
                } : {
                    s: r.from,
                    delta: r.newFragment.length - r.oldFragment.length
                };
            }
            function n(e, t) {
                if (e === t) return {};
                var n = e.length, a = t.length;
                if (i("oldLength: " + n + ". newLength: " + a), a > n) {
                    if (t.substr(0, n) === e) return i("some characters was added to the end"), {
                        from: n,
                        to: n,
                        oldFragment: "",
                        newFragment: t.substr(n)
                    };
                    if (t.substr(a - n) === e) return i("some characters was added to the start"), {
                        from: 0,
                        to: 0,
                        oldFragment: "",
                        newFragment: t.substr(0, a - n)
                    };
                }
                if (a < n) {
                    if (e.substr(n - a) === t) return i("some characters was removed from the end"), 
                    {
                        from: 0,
                        to: n - a,
                        oldFragment: e.substr(0, n - a),
                        newFragment: ""
                    };
                    if (e.substr(0, a) === t) return i("some characters was removed from the start"), 
                    {
                        from: a,
                        to: n,
                        oldFragment: e.substr(a),
                        newFragment: ""
                    };
                }
                var s = a < n ? a : n, c = r(e, t, s), l = o(e, t, n, a, s);
                return i("front: " + c), i("back: " + l), c + l > n && (l -= c + l - n), c + l > a && (l -= c + l - a), 
                {
                    from: c,
                    to: n - l,
                    oldFragment: e.substr(c, n - l - c),
                    newFragment: t.substr(c, a - l - c)
                };
            }
            function r(e, t, n) {
                for (var r = 0; e[r] === t[r] && r < n; ) r += 1;
                return r;
            }
            function o(e, t, n, r, o) {
                for (var i = 0; e[n - i - 1] === t[r - i - 1] && o - i >= 0; ) i += 1;
                return i;
            }
            function i() {}
            "undefined" == typeof t && (window.diffPos = e, window.textdiff = n);
            try {
                t.exports = {
                    diffPos: e,
                    textdiff: n
                };
            } catch (a) {}
        }();
    }, {} ],
    14: [ function(e, t, n) {
        try {
            t.exports = e("./lib/textdiff");
        } catch (r) {}
    }, {
        "./lib/textdiff": 13
    } ],
    15: [ function(e, t, n) {
        t.exports = {
            "default": e("core-js/library/fn/array/from"),
            __esModule: !0
        };
    }, {
        "core-js/library/fn/array/from": 43
    } ],
    16: [ function(e, t, n) {
        t.exports = {
            "default": e("core-js/library/fn/get-iterator"),
            __esModule: !0
        };
    }, {
        "core-js/library/fn/get-iterator": 44
    } ],
    17: [ function(e, t, n) {
        t.exports = {
            "default": e("core-js/library/fn/is-iterable"),
            __esModule: !0
        };
    }, {
        "core-js/library/fn/is-iterable": 45
    } ],
    18: [ function(e, t, n) {
        t.exports = {
            "default": e("core-js/library/fn/json/stringify"),
            __esModule: !0
        };
    }, {
        "core-js/library/fn/json/stringify": 46
    } ],
    19: [ function(e, t, n) {
        t.exports = {
            "default": e("core-js/library/fn/map"),
            __esModule: !0
        };
    }, {
        "core-js/library/fn/map": 47
    } ],
    20: [ function(e, t, n) {
        t.exports = {
            "default": e("core-js/library/fn/object/assign"),
            __esModule: !0
        };
    }, {
        "core-js/library/fn/object/assign": 48
    } ],
    21: [ function(e, t, n) {
        t.exports = {
            "default": e("core-js/library/fn/object/create"),
            __esModule: !0
        };
    }, {
        "core-js/library/fn/object/create": 49
    } ],
    22: [ function(e, t, n) {
        t.exports = {
            "default": e("core-js/library/fn/object/define-property"),
            __esModule: !0
        };
    }, {
        "core-js/library/fn/object/define-property": 50
    } ],
    23: [ function(e, t, n) {
        t.exports = {
            "default": e("core-js/library/fn/object/get-own-property-symbols"),
            __esModule: !0
        };
    }, {
        "core-js/library/fn/object/get-own-property-symbols": 51
    } ],
    24: [ function(e, t, n) {
        t.exports = {
            "default": e("core-js/library/fn/object/get-prototype-of"),
            __esModule: !0
        };
    }, {
        "core-js/library/fn/object/get-prototype-of": 52
    } ],
    25: [ function(e, t, n) {
        t.exports = {
            "default": e("core-js/library/fn/object/keys"),
            __esModule: !0
        };
    }, {
        "core-js/library/fn/object/keys": 53
    } ],
    26: [ function(e, t, n) {
        t.exports = {
            "default": e("core-js/library/fn/object/set-prototype-of"),
            __esModule: !0
        };
    }, {
        "core-js/library/fn/object/set-prototype-of": 54
    } ],
    27: [ function(e, t, n) {
        t.exports = {
            "default": e("core-js/library/fn/object/values"),
            __esModule: !0
        };
    }, {
        "core-js/library/fn/object/values": 55
    } ],
    28: [ function(e, t, n) {
        t.exports = {
            "default": e("core-js/library/fn/promise"),
            __esModule: !0
        };
    }, {
        "core-js/library/fn/promise": 56
    } ],
    29: [ function(e, t, n) {
        t.exports = {
            "default": e("core-js/library/fn/symbol"),
            __esModule: !0
        };
    }, {
        "core-js/library/fn/symbol": 57
    } ],
    30: [ function(e, t, n) {
        t.exports = {
            "default": e("core-js/library/fn/symbol/iterator"),
            __esModule: !0
        };
    }, {
        "core-js/library/fn/symbol/iterator": 58
    } ],
    31: [ function(e, t, n) {
        "use strict";
        n.__esModule = !0, n["default"] = function(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
        };
    }, {} ],
    32: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        n.__esModule = !0;
        var o = e("../core-js/object/define-property"), i = r(o);
        n["default"] = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), 
                    (0, i["default"])(e, r.key, r);
                }
            }
            return function(t, n, r) {
                return n && e(t.prototype, n), r && e(t, r), t;
            };
        }();
    }, {
        "../core-js/object/define-property": 22
    } ],
    33: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        n.__esModule = !0;
        var o = e("../core-js/object/define-property"), i = r(o);
        n["default"] = function(e, t, n) {
            return t in e ? (0, i["default"])(e, t, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = n, e;
        };
    }, {
        "../core-js/object/define-property": 22
    } ],
    34: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        n.__esModule = !0;
        var o = e("../core-js/object/assign"), i = r(o);
        n["default"] = i["default"] || function(e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
            }
            return e;
        };
    }, {
        "../core-js/object/assign": 20
    } ],
    35: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        n.__esModule = !0;
        var o = e("../core-js/object/set-prototype-of"), i = r(o), a = e("../core-js/object/create"), s = r(a), c = e("../helpers/typeof"), l = r(c);
        n["default"] = function(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + ("undefined" == typeof t ? "undefined" : (0, 
            l["default"])(t)));
            e.prototype = (0, s["default"])(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (i["default"] ? (0, i["default"])(e, t) : e.__proto__ = t);
        };
    }, {
        "../core-js/object/create": 21,
        "../core-js/object/set-prototype-of": 26,
        "../helpers/typeof": 39
    } ],
    36: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        n.__esModule = !0;
        var o = e("../helpers/typeof"), i = r(o);
        n["default"] = function(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" !== ("undefined" == typeof t ? "undefined" : (0, i["default"])(t)) && "function" != typeof t ? e : t;
        };
    }, {
        "../helpers/typeof": 39
    } ],
    37: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        n.__esModule = !0;
        var o = e("../core-js/is-iterable"), i = r(o), a = e("../core-js/get-iterator"), s = r(a);
        n["default"] = function() {
            function e(e, t) {
                var n = [], r = !0, o = !1, i = void 0;
                try {
                    for (var a, c = (0, s["default"])(e); !(r = (a = c.next()).done) && (n.push(a.value), 
                    !t || n.length !== t); r = !0) ;
                } catch (l) {
                    o = !0, i = l;
                } finally {
                    try {
                        !r && c["return"] && c["return"]();
                    } finally {
                        if (o) throw i;
                    }
                }
                return n;
            }
            return function(t, n) {
                if (Array.isArray(t)) return t;
                if ((0, i["default"])(Object(t))) return e(t, n);
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            };
        }();
    }, {
        "../core-js/get-iterator": 16,
        "../core-js/is-iterable": 17
    } ],
    38: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        n.__esModule = !0;
        var o = e("../core-js/array/from"), i = r(o);
        n["default"] = function(e) {
            if (Array.isArray(e)) {
                for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t];
                return n;
            }
            return (0, i["default"])(e);
        };
    }, {
        "../core-js/array/from": 15
    } ],
    39: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        n.__esModule = !0;
        var o = e("../core-js/symbol/iterator"), i = r(o), a = e("../core-js/symbol"), s = r(a), c = "function" == typeof s["default"] && "symbol" == typeof i["default"] ? function(e) {
            return typeof e;
        } : function(e) {
            return e && "function" == typeof s["default"] && e.constructor === s["default"] && e !== s["default"].prototype ? "symbol" : typeof e;
        };
        n["default"] = "function" == typeof s["default"] && "symbol" === c(i["default"]) ? function(e) {
            return "undefined" == typeof e ? "undefined" : c(e);
        } : function(e) {
            return e && "function" == typeof s["default"] && e.constructor === s["default"] && e !== s["default"].prototype ? "symbol" : "undefined" == typeof e ? "undefined" : c(e);
        };
    }, {
        "../core-js/symbol": 29,
        "../core-js/symbol/iterator": 30
    } ],
    40: [ function(e, t, n) {
        (function(n) {
            var r = "object" == typeof n ? n : "object" == typeof window ? window : "object" == typeof self ? self : this, o = r.regeneratorRuntime && Object.getOwnPropertyNames(r).indexOf("regeneratorRuntime") >= 0, i = o && r.regeneratorRuntime;
            if (r.regeneratorRuntime = void 0, t.exports = e("./runtime"), o) r.regeneratorRuntime = i; else try {
                delete r.regeneratorRuntime;
            } catch (a) {
                r.regeneratorRuntime = void 0;
            }
        }).call(this, "undefined" != typeof window ? window : {});
    }, {
        "./runtime": 41
    } ],
    41: [ function(e, t, n) {
        (function(e, n) {
            !function(n) {
                "use strict";
                function r(e, t, n, r) {
                    var o = t && t.prototype instanceof i ? t : i, a = Object.create(o.prototype), s = new m(r || []);
                    return a._invoke = u(e, n, s), a;
                }
                function o(e, t, n) {
                    try {
                        return {
                            type: "normal",
                            arg: e.call(t, n)
                        };
                    } catch (r) {
                        return {
                            type: "throw",
                            arg: r
                        };
                    }
                }
                function i() {}
                function a() {}
                function s() {}
                function c(e) {
                    [ "next", "throw", "return" ].forEach(function(t) {
                        e[t] = function(e) {
                            return this._invoke(t, e);
                        };
                    });
                }
                function l(t) {
                    function n(e, r, i, a) {
                        var s = o(t[e], t, r);
                        if ("throw" !== s.type) {
                            var c = s.arg, l = c.value;
                            return l && "object" == typeof l && _.call(l, "__await") ? Promise.resolve(l.__await).then(function(e) {
                                n("next", e, i, a);
                            }, function(e) {
                                n("throw", e, i, a);
                            }) : Promise.resolve(l).then(function(e) {
                                c.value = e, i(c);
                            }, a);
                        }
                        a(s.arg);
                    }
                    function r(e, t) {
                        function r() {
                            return new Promise(function(r, o) {
                                n(e, t, r, o);
                            });
                        }
                        return i = i ? i.then(r, r) : r();
                    }
                    "object" == typeof e && e.domain && (n = e.domain.bind(n));
                    var i;
                    this._invoke = r;
                }
                function u(e, t, n) {
                    var r = x;
                    return function(i, a) {
                        if (r === S) throw new Error("Generator is already running");
                        if (r === T) {
                            if ("throw" === i) throw a;
                            return g();
                        }
                        for (n.method = i, n.arg = a; ;) {
                            var s = n.delegate;
                            if (s) {
                                var c = d(s, n);
                                if (c) {
                                    if (c === L) continue;
                                    return c;
                                }
                            }
                            if ("next" === n.method) n.sent = n._sent = n.arg; else if ("throw" === n.method) {
                                if (r === x) throw r = T, n.arg;
                                n.dispatchException(n.arg);
                            } else "return" === n.method && n.abrupt("return", n.arg);
                            r = S;
                            var l = o(e, t, n);
                            if ("normal" === l.type) {
                                if (r = n.done ? T : j, l.arg === L) continue;
                                return {
                                    value: l.arg,
                                    done: n.done
                                };
                            }
                            "throw" === l.type && (r = T, n.method = "throw", n.arg = l.arg);
                        }
                    };
                }
                function d(e, t) {
                    var n = e.iterator[t.method];
                    if (n === b) {
                        if (t.delegate = null, "throw" === t.method) {
                            if (e.iterator["return"] && (t.method = "return", t.arg = b, d(e, t), "throw" === t.method)) return L;
                            t.method = "throw", t.arg = new TypeError("The iterator does not provide a 'throw' method");
                        }
                        return L;
                    }
                    var r = o(n, e.iterator, t.arg);
                    if ("throw" === r.type) return t.method = "throw", t.arg = r.arg, t.delegate = null, 
                    L;
                    var i = r.arg;
                    return i ? i.done ? (t[e.resultName] = i.value, t.next = e.nextLoc, "return" !== t.method && (t.method = "next", 
                    t.arg = b), t.delegate = null, L) : i : (t.method = "throw", t.arg = new TypeError("iterator result is not an object"), 
                    t.delegate = null, L);
                }
                function f(e) {
                    var t = {
                        tryLoc: e[0]
                    };
                    1 in e && (t.catchLoc = e[1]), 2 in e && (t.finallyLoc = e[2], t.afterLoc = e[3]), 
                    this.tryEntries.push(t);
                }
                function p(e) {
                    var t = e.completion || {};
                    t.type = "normal", delete t.arg, e.completion = t;
                }
                function m(e) {
                    this.tryEntries = [ {
                        tryLoc: "root"
                    } ], e.forEach(f, this), this.reset(!0);
                }
                function h(e) {
                    if (e) {
                        var t = e[w];
                        if (t) return t.call(e);
                        if ("function" == typeof e.next) return e;
                        if (!isNaN(e.length)) {
                            var n = -1, r = function o() {
                                for (;++n < e.length; ) if (_.call(e, n)) return o.value = e[n], o.done = !1, o;
                                return o.value = b, o.done = !0, o;
                            };
                            return r.next = r;
                        }
                    }
                    return {
                        next: g
                    };
                }
                function g() {
                    return {
                        value: b,
                        done: !0
                    };
                }
                var b, v = Object.prototype, _ = v.hasOwnProperty, y = "function" == typeof Symbol ? Symbol : {}, w = y.iterator || "@@iterator", k = y.toStringTag || "@@toStringTag", E = "object" == typeof t, C = n.regeneratorRuntime;
                if (C) return void (E && (t.exports = C));
                C = n.regeneratorRuntime = E ? t.exports : {}, C.wrap = r;
                var x = "suspendedStart", j = "suspendedYield", S = "executing", T = "completed", L = {}, N = {};
                N[w] = function() {
                    return this;
                };
                var P = Object.getPrototypeOf, A = P && P(P(h([])));
                A && A !== v && _.call(A, w) && (N = A);
                var I = s.prototype = i.prototype = Object.create(N);
                a.prototype = I.constructor = s, s.constructor = a, s[k] = a.displayName = "GeneratorFunction", 
                C.isGeneratorFunction = function(e) {
                    var t = "function" == typeof e && e.constructor;
                    return !!t && (t === a || "GeneratorFunction" === (t.displayName || t.name));
                }, C.mark = function(e) {
                    return Object.setPrototypeOf ? Object.setPrototypeOf(e, s) : (e.__proto__ = s, k in e || (e[k] = "GeneratorFunction")), 
                    e.prototype = Object.create(I), e;
                }, C.awrap = function(e) {
                    return {
                        __await: e
                    };
                }, c(l.prototype), C.AsyncIterator = l, C.async = function(e, t, n, o) {
                    var i = new l(r(e, t, n, o));
                    return C.isGeneratorFunction(t) ? i : i.next().then(function(e) {
                        return e.done ? e.value : i.next();
                    });
                }, c(I), I[k] = "Generator", I.toString = function() {
                    return "[object Generator]";
                }, C.keys = function(e) {
                    var t = [];
                    for (var n in e) t.push(n);
                    return t.reverse(), function r() {
                        for (;t.length; ) {
                            var n = t.pop();
                            if (n in e) return r.value = n, r.done = !1, r;
                        }
                        return r.done = !0, r;
                    };
                }, C.values = h, m.prototype = {
                    constructor: m,
                    reset: function(e) {
                        if (this.prev = 0, this.next = 0, this.sent = this._sent = b, this.done = !1, this.delegate = null, 
                        this.method = "next", this.arg = b, this.tryEntries.forEach(p), !e) for (var t in this) "t" === t.charAt(0) && _.call(this, t) && !isNaN(+t.slice(1)) && (this[t] = b);
                    },
                    stop: function() {
                        this.done = !0;
                        var e = this.tryEntries[0], t = e.completion;
                        if ("throw" === t.type) throw t.arg;
                        return this.rval;
                    },
                    dispatchException: function(e) {
                        function t(t, r) {
                            return i.type = "throw", i.arg = e, n.next = t, r && (n.method = "next", n.arg = b), 
                            !!r;
                        }
                        if (this.done) throw e;
                        for (var n = this, r = this.tryEntries.length - 1; r >= 0; --r) {
                            var o = this.tryEntries[r], i = o.completion;
                            if ("root" === o.tryLoc) return t("end");
                            if (o.tryLoc <= this.prev) {
                                var a = _.call(o, "catchLoc"), s = _.call(o, "finallyLoc");
                                if (a && s) {
                                    if (this.prev < o.catchLoc) return t(o.catchLoc, !0);
                                    if (this.prev < o.finallyLoc) return t(o.finallyLoc);
                                } else if (a) {
                                    if (this.prev < o.catchLoc) return t(o.catchLoc, !0);
                                } else {
                                    if (!s) throw new Error("try statement without catch or finally");
                                    if (this.prev < o.finallyLoc) return t(o.finallyLoc);
                                }
                            }
                        }
                    },
                    abrupt: function(e, t) {
                        for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                            var r = this.tryEntries[n];
                            if (r.tryLoc <= this.prev && _.call(r, "finallyLoc") && this.prev < r.finallyLoc) {
                                var o = r;
                                break;
                            }
                        }
                        o && ("break" === e || "continue" === e) && o.tryLoc <= t && t <= o.finallyLoc && (o = null);
                        var i = o ? o.completion : {};
                        return i.type = e, i.arg = t, o ? (this.method = "next", this.next = o.finallyLoc, 
                        L) : this.complete(i);
                    },
                    complete: function(e, t) {
                        if ("throw" === e.type) throw e.arg;
                        return "break" === e.type || "continue" === e.type ? this.next = e.arg : "return" === e.type ? (this.rval = this.arg = e.arg, 
                        this.method = "return", this.next = "end") : "normal" === e.type && t && (this.next = t), 
                        L;
                    },
                    finish: function(e) {
                        for (var t = this.tryEntries.length - 1; t >= 0; --t) {
                            var n = this.tryEntries[t];
                            if (n.finallyLoc === e) return this.complete(n.completion, n.afterLoc), p(n), L;
                        }
                    },
                    "catch": function(e) {
                        for (var t = this.tryEntries.length - 1; t >= 0; --t) {
                            var n = this.tryEntries[t];
                            if (n.tryLoc === e) {
                                var r = n.completion;
                                if ("throw" === r.type) {
                                    var o = r.arg;
                                    p(n);
                                }
                                return o;
                            }
                        }
                        throw new Error("illegal catch attempt");
                    },
                    delegateYield: function(e, t, n) {
                        return this.delegate = {
                            iterator: h(e),
                            resultName: t,
                            nextLoc: n
                        }, "next" === this.method && (this.arg = b), L;
                    }
                };
            }("object" == typeof n ? n : "object" == typeof window ? window : "object" == typeof self ? self : this);
        }).call(this, e("_process"), "undefined" != typeof window ? window : {});
    }, {
        _process: 160
    } ],
    42: [ function(e, t, n) {
        t.exports = e("regenerator-runtime");
    }, {
        "regenerator-runtime": 40
    } ],
    43: [ function(e, t, n) {
        e("../../modules/es6.string.iterator"), e("../../modules/es6.array.from"), t.exports = e("../../modules/_core").Array.from;
    }, {
        "../../modules/_core": 73,
        "../../modules/es6.array.from": 142,
        "../../modules/es6.string.iterator": 153
    } ],
    44: [ function(e, t, n) {
        e("../modules/web.dom.iterable"), e("../modules/es6.string.iterator"), t.exports = e("../modules/core.get-iterator");
    }, {
        "../modules/core.get-iterator": 140,
        "../modules/es6.string.iterator": 153,
        "../modules/web.dom.iterable": 159
    } ],
    45: [ function(e, t, n) {
        e("../modules/web.dom.iterable"), e("../modules/es6.string.iterator"), t.exports = e("../modules/core.is-iterable");
    }, {
        "../modules/core.is-iterable": 141,
        "../modules/es6.string.iterator": 153,
        "../modules/web.dom.iterable": 159
    } ],
    46: [ function(e, t, n) {
        var r = e("../../modules/_core"), o = r.JSON || (r.JSON = {
            stringify: JSON.stringify
        });
        t.exports = function(e) {
            return o.stringify.apply(o, arguments);
        };
    }, {
        "../../modules/_core": 73
    } ],
    47: [ function(e, t, n) {
        e("../modules/es6.object.to-string"), e("../modules/es6.string.iterator"), e("../modules/web.dom.iterable"), 
        e("../modules/es6.map"), e("../modules/es7.map.to-json"), t.exports = e("../modules/_core").Map;
    }, {
        "../modules/_core": 73,
        "../modules/es6.map": 144,
        "../modules/es6.object.to-string": 151,
        "../modules/es6.string.iterator": 153,
        "../modules/es7.map.to-json": 155,
        "../modules/web.dom.iterable": 159
    } ],
    48: [ function(e, t, n) {
        e("../../modules/es6.object.assign"), t.exports = e("../../modules/_core").Object.assign;
    }, {
        "../../modules/_core": 73,
        "../../modules/es6.object.assign": 145
    } ],
    49: [ function(e, t, n) {
        e("../../modules/es6.object.create");
        var r = e("../../modules/_core").Object;
        t.exports = function(e, t) {
            return r.create(e, t);
        };
    }, {
        "../../modules/_core": 73,
        "../../modules/es6.object.create": 146
    } ],
    50: [ function(e, t, n) {
        e("../../modules/es6.object.define-property");
        var r = e("../../modules/_core").Object;
        t.exports = function(e, t, n) {
            return r.defineProperty(e, t, n);
        };
    }, {
        "../../modules/_core": 73,
        "../../modules/es6.object.define-property": 147
    } ],
    51: [ function(e, t, n) {
        e("../../modules/es6.symbol"), t.exports = e("../../modules/_core").Object.getOwnPropertySymbols;
    }, {
        "../../modules/_core": 73,
        "../../modules/es6.symbol": 154
    } ],
    52: [ function(e, t, n) {
        e("../../modules/es6.object.get-prototype-of"), t.exports = e("../../modules/_core").Object.getPrototypeOf;
    }, {
        "../../modules/_core": 73,
        "../../modules/es6.object.get-prototype-of": 148
    } ],
    53: [ function(e, t, n) {
        e("../../modules/es6.object.keys"), t.exports = e("../../modules/_core").Object.keys;
    }, {
        "../../modules/_core": 73,
        "../../modules/es6.object.keys": 149
    } ],
    54: [ function(e, t, n) {
        e("../../modules/es6.object.set-prototype-of"), t.exports = e("../../modules/_core").Object.setPrototypeOf;
    }, {
        "../../modules/_core": 73,
        "../../modules/es6.object.set-prototype-of": 150
    } ],
    55: [ function(e, t, n) {
        e("../../modules/es7.object.values"), t.exports = e("../../modules/_core").Object.values;
    }, {
        "../../modules/_core": 73,
        "../../modules/es7.object.values": 156
    } ],
    56: [ function(e, t, n) {
        e("../modules/es6.object.to-string"), e("../modules/es6.string.iterator"), e("../modules/web.dom.iterable"), 
        e("../modules/es6.promise"), t.exports = e("../modules/_core").Promise;
    }, {
        "../modules/_core": 73,
        "../modules/es6.object.to-string": 151,
        "../modules/es6.promise": 152,
        "../modules/es6.string.iterator": 153,
        "../modules/web.dom.iterable": 159
    } ],
    57: [ function(e, t, n) {
        e("../../modules/es6.symbol"), e("../../modules/es6.object.to-string"), e("../../modules/es7.symbol.async-iterator"), 
        e("../../modules/es7.symbol.observable"), t.exports = e("../../modules/_core").Symbol;
    }, {
        "../../modules/_core": 73,
        "../../modules/es6.object.to-string": 151,
        "../../modules/es6.symbol": 154,
        "../../modules/es7.symbol.async-iterator": 157,
        "../../modules/es7.symbol.observable": 158
    } ],
    58: [ function(e, t, n) {
        e("../../modules/es6.string.iterator"), e("../../modules/web.dom.iterable"), t.exports = e("../../modules/_wks-ext").f("iterator");
    }, {
        "../../modules/_wks-ext": 137,
        "../../modules/es6.string.iterator": 153,
        "../../modules/web.dom.iterable": 159
    } ],
    59: [ function(e, t, n) {
        t.exports = function(e) {
            if ("function" != typeof e) throw TypeError(e + " is not a function!");
            return e;
        };
    }, {} ],
    60: [ function(e, t, n) {
        t.exports = function() {};
    }, {} ],
    61: [ function(e, t, n) {
        t.exports = function(e, t, n, r) {
            if (!(e instanceof t) || void 0 !== r && r in e) throw TypeError(n + ": incorrect invocation!");
            return e;
        };
    }, {} ],
    62: [ function(e, t, n) {
        var r = e("./_is-object");
        t.exports = function(e) {
            if (!r(e)) throw TypeError(e + " is not an object!");
            return e;
        };
    }, {
        "./_is-object": 93
    } ],
    63: [ function(e, t, n) {
        var r = e("./_for-of");
        t.exports = function(e, t) {
            var n = [];
            return r(e, !1, n.push, n, t), n;
        };
    }, {
        "./_for-of": 83
    } ],
    64: [ function(e, t, n) {
        var r = e("./_to-iobject"), o = e("./_to-length"), i = e("./_to-index");
        t.exports = function(e) {
            return function(t, n, a) {
                var s, c = r(t), l = o(c.length), u = i(a, l);
                if (e && n != n) {
                    for (;l > u; ) if (s = c[u++], s != s) return !0;
                } else for (;l > u; u++) if ((e || u in c) && c[u] === n) return e || u || 0;
                return !e && -1;
            };
        };
    }, {
        "./_to-index": 129,
        "./_to-iobject": 131,
        "./_to-length": 132
    } ],
    65: [ function(e, t, n) {
        var r = e("./_ctx"), o = e("./_iobject"), i = e("./_to-object"), a = e("./_to-length"), s = e("./_array-species-create");
        t.exports = function(e, t) {
            var n = 1 == e, c = 2 == e, l = 3 == e, u = 4 == e, d = 6 == e, f = 5 == e || d, p = t || s;
            return function(t, s, m) {
                for (var h, g, b = i(t), v = o(b), _ = r(s, m, 3), y = a(v.length), w = 0, k = n ? p(t, y) : c ? p(t, 0) : void 0; y > w; w++) if ((f || w in v) && (h = v[w], 
                g = _(h, w, b), e)) if (n) k[w] = g; else if (g) switch (e) {
                  case 3:
                    return !0;

                  case 5:
                    return h;

                  case 6:
                    return w;

                  case 2:
                    k.push(h);
                } else if (u) return !1;
                return d ? -1 : l || u ? u : k;
            };
        };
    }, {
        "./_array-species-create": 67,
        "./_ctx": 75,
        "./_iobject": 90,
        "./_to-length": 132,
        "./_to-object": 133
    } ],
    66: [ function(e, t, n) {
        var r = e("./_is-object"), o = e("./_is-array"), i = e("./_wks")("species");
        t.exports = function(e) {
            var t;
            return o(e) && (t = e.constructor, "function" != typeof t || t !== Array && !o(t.prototype) || (t = void 0), 
            r(t) && (t = t[i], null === t && (t = void 0))), void 0 === t ? Array : t;
        };
    }, {
        "./_is-array": 92,
        "./_is-object": 93,
        "./_wks": 138
    } ],
    67: [ function(e, t, n) {
        var r = e("./_array-species-constructor");
        t.exports = function(e, t) {
            return new (r(e))(t);
        };
    }, {
        "./_array-species-constructor": 66
    } ],
    68: [ function(e, t, n) {
        var r = e("./_cof"), o = e("./_wks")("toStringTag"), i = "Arguments" == r(function() {
            return arguments;
        }()), a = function(e, t) {
            try {
                return e[t];
            } catch (n) {}
        };
        t.exports = function(e) {
            var t, n, s;
            return void 0 === e ? "Undefined" : null === e ? "Null" : "string" == typeof (n = a(t = Object(e), o)) ? n : i ? r(t) : "Object" == (s = r(t)) && "function" == typeof t.callee ? "Arguments" : s;
        };
    }, {
        "./_cof": 69,
        "./_wks": 138
    } ],
    69: [ function(e, t, n) {
        var r = {}.toString;
        t.exports = function(e) {
            return r.call(e).slice(8, -1);
        };
    }, {} ],
    70: [ function(e, t, n) {
        "use strict";
        var r = e("./_object-dp").f, o = e("./_object-create"), i = e("./_redefine-all"), a = e("./_ctx"), s = e("./_an-instance"), c = e("./_defined"), l = e("./_for-of"), u = e("./_iter-define"), d = e("./_iter-step"), f = e("./_set-species"), p = e("./_descriptors"), m = e("./_meta").fastKey, h = p ? "_s" : "size", g = function(e, t) {
            var n, r = m(t);
            if ("F" !== r) return e._i[r];
            for (n = e._f; n; n = n.n) if (n.k == t) return n;
        };
        t.exports = {
            getConstructor: function(e, t, n, u) {
                var d = e(function(e, r) {
                    s(e, d, t, "_i"), e._i = o(null), e._f = void 0, e._l = void 0, e[h] = 0, void 0 != r && l(r, n, e[u], e);
                });
                return i(d.prototype, {
                    clear: function() {
                        for (var e = this, t = e._i, n = e._f; n; n = n.n) n.r = !0, n.p && (n.p = n.p.n = void 0), 
                        delete t[n.i];
                        e._f = e._l = void 0, e[h] = 0;
                    },
                    "delete": function(e) {
                        var t = this, n = g(t, e);
                        if (n) {
                            var r = n.n, o = n.p;
                            delete t._i[n.i], n.r = !0, o && (o.n = r), r && (r.p = o), t._f == n && (t._f = r), 
                            t._l == n && (t._l = o), t[h]--;
                        }
                        return !!n;
                    },
                    forEach: function(e) {
                        s(this, d, "forEach");
                        for (var t, n = a(e, arguments.length > 1 ? arguments[1] : void 0, 3); t = t ? t.n : this._f; ) for (n(t.v, t.k, this); t && t.r; ) t = t.p;
                    },
                    has: function(e) {
                        return !!g(this, e);
                    }
                }), p && r(d.prototype, "size", {
                    get: function() {
                        return c(this[h]);
                    }
                }), d;
            },
            def: function(e, t, n) {
                var r, o, i = g(e, t);
                return i ? i.v = n : (e._l = i = {
                    i: o = m(t, !0),
                    k: t,
                    v: n,
                    p: r = e._l,
                    n: void 0,
                    r: !1
                }, e._f || (e._f = i), r && (r.n = i), e[h]++, "F" !== o && (e._i[o] = i)), e;
            },
            getEntry: g,
            setStrong: function(e, t, n) {
                u(e, t, function(e, t) {
                    this._t = e, this._k = t, this._l = void 0;
                }, function() {
                    for (var e = this, t = e._k, n = e._l; n && n.r; ) n = n.p;
                    return e._t && (e._l = n = n ? n.n : e._t._f) ? "keys" == t ? d(0, n.k) : "values" == t ? d(0, n.v) : d(0, [ n.k, n.v ]) : (e._t = void 0, 
                    d(1));
                }, n ? "entries" : "values", !n, !0), f(t);
            }
        };
    }, {
        "./_an-instance": 61,
        "./_ctx": 75,
        "./_defined": 76,
        "./_descriptors": 77,
        "./_for-of": 83,
        "./_iter-define": 96,
        "./_iter-step": 98,
        "./_meta": 102,
        "./_object-create": 105,
        "./_object-dp": 106,
        "./_redefine-all": 119,
        "./_set-species": 122
    } ],
    71: [ function(e, t, n) {
        var r = e("./_classof"), o = e("./_array-from-iterable");
        t.exports = function(e) {
            return function() {
                if (r(this) != e) throw TypeError(e + "#toJSON isn't generic");
                return o(this);
            };
        };
    }, {
        "./_array-from-iterable": 63,
        "./_classof": 68
    } ],
    72: [ function(e, t, n) {
        "use strict";
        var r = e("./_global"), o = e("./_export"), i = e("./_meta"), a = e("./_fails"), s = e("./_hide"), c = e("./_redefine-all"), l = e("./_for-of"), u = e("./_an-instance"), d = e("./_is-object"), f = e("./_set-to-string-tag"), p = e("./_object-dp").f, m = e("./_array-methods")(0), h = e("./_descriptors");
        t.exports = function(e, t, n, g, b, v) {
            var _ = r[e], y = _, w = b ? "set" : "add", k = y && y.prototype, E = {};
            return h && "function" == typeof y && (v || k.forEach && !a(function() {
                new y().entries().next();
            })) ? (y = t(function(t, n) {
                u(t, y, e, "_c"), t._c = new _(), void 0 != n && l(n, b, t[w], t);
            }), m("add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON".split(","), function(e) {
                var t = "add" == e || "set" == e;
                e in k && (!v || "clear" != e) && s(y.prototype, e, function(n, r) {
                    if (u(this, y, e), !t && v && !d(n)) return "get" == e && void 0;
                    var o = this._c[e](0 === n ? 0 : n, r);
                    return t ? this : o;
                });
            }), "size" in k && p(y.prototype, "size", {
                get: function() {
                    return this._c.size;
                }
            })) : (y = g.getConstructor(t, e, b, w), c(y.prototype, n), i.NEED = !0), f(y, e), 
            E[e] = y, o(o.G + o.W + o.F, E), v || g.setStrong(y, e, b), y;
        };
    }, {
        "./_an-instance": 61,
        "./_array-methods": 65,
        "./_descriptors": 77,
        "./_export": 81,
        "./_fails": 82,
        "./_for-of": 83,
        "./_global": 84,
        "./_hide": 86,
        "./_is-object": 93,
        "./_meta": 102,
        "./_object-dp": 106,
        "./_redefine-all": 119,
        "./_set-to-string-tag": 123
    } ],
    73: [ function(e, t, n) {
        var r = t.exports = {
            version: "2.4.0"
        };
        "number" == typeof __e && (__e = r);
    }, {} ],
    74: [ function(e, t, n) {
        "use strict";
        var r = e("./_object-dp"), o = e("./_property-desc");
        t.exports = function(e, t, n) {
            t in e ? r.f(e, t, o(0, n)) : e[t] = n;
        };
    }, {
        "./_object-dp": 106,
        "./_property-desc": 118
    } ],
    75: [ function(e, t, n) {
        var r = e("./_a-function");
        t.exports = function(e, t, n) {
            if (r(e), void 0 === t) return e;
            switch (n) {
              case 1:
                return function(n) {
                    return e.call(t, n);
                };

              case 2:
                return function(n, r) {
                    return e.call(t, n, r);
                };

              case 3:
                return function(n, r, o) {
                    return e.call(t, n, r, o);
                };
            }
            return function() {
                return e.apply(t, arguments);
            };
        };
    }, {
        "./_a-function": 59
    } ],
    76: [ function(e, t, n) {
        t.exports = function(e) {
            if (void 0 == e) throw TypeError("Can't call method on  " + e);
            return e;
        };
    }, {} ],
    77: [ function(e, t, n) {
        t.exports = !e("./_fails")(function() {
            return 7 != Object.defineProperty({}, "a", {
                get: function() {
                    return 7;
                }
            }).a;
        });
    }, {
        "./_fails": 82
    } ],
    78: [ function(e, t, n) {
        var r = e("./_is-object"), o = e("./_global").document, i = r(o) && r(o.createElement);
        t.exports = function(e) {
            return i ? o.createElement(e) : {};
        };
    }, {
        "./_global": 84,
        "./_is-object": 93
    } ],
    79: [ function(e, t, n) {
        t.exports = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");
    }, {} ],
    80: [ function(e, t, n) {
        var r = e("./_object-keys"), o = e("./_object-gops"), i = e("./_object-pie");
        t.exports = function(e) {
            var t = r(e), n = o.f;
            if (n) for (var a, s = n(e), c = i.f, l = 0; s.length > l; ) c.call(e, a = s[l++]) && t.push(a);
            return t;
        };
    }, {
        "./_object-gops": 111,
        "./_object-keys": 114,
        "./_object-pie": 115
    } ],
    81: [ function(e, t, n) {
        var r = e("./_global"), o = e("./_core"), i = e("./_ctx"), a = e("./_hide"), s = "prototype", c = function(e, t, n) {
            var l, u, d, f = e & c.F, p = e & c.G, m = e & c.S, h = e & c.P, g = e & c.B, b = e & c.W, v = p ? o : o[t] || (o[t] = {}), _ = v[s], y = p ? r : m ? r[t] : (r[t] || {})[s];
            p && (n = t);
            for (l in n) u = !f && y && void 0 !== y[l], u && l in v || (d = u ? y[l] : n[l], 
            v[l] = p && "function" != typeof y[l] ? n[l] : g && u ? i(d, r) : b && y[l] == d ? function(e) {
                var t = function(t, n, r) {
                    if (this instanceof e) {
                        switch (arguments.length) {
                          case 0:
                            return new e();

                          case 1:
                            return new e(t);

                          case 2:
                            return new e(t, n);
                        }
                        return new e(t, n, r);
                    }
                    return e.apply(this, arguments);
                };
                return t[s] = e[s], t;
            }(d) : h && "function" == typeof d ? i(Function.call, d) : d, h && ((v.virtual || (v.virtual = {}))[l] = d, 
            e & c.R && _ && !_[l] && a(_, l, d)));
        };
        c.F = 1, c.G = 2, c.S = 4, c.P = 8, c.B = 16, c.W = 32, c.U = 64, c.R = 128, t.exports = c;
    }, {
        "./_core": 73,
        "./_ctx": 75,
        "./_global": 84,
        "./_hide": 86
    } ],
    82: [ function(e, t, n) {
        t.exports = function(e) {
            try {
                return !!e();
            } catch (t) {
                return !0;
            }
        };
    }, {} ],
    83: [ function(e, t, n) {
        var r = e("./_ctx"), o = e("./_iter-call"), i = e("./_is-array-iter"), a = e("./_an-object"), s = e("./_to-length"), c = e("./core.get-iterator-method"), l = {}, u = {}, n = t.exports = function(e, t, n, d, f) {
            var p, m, h, g, b = f ? function() {
                return e;
            } : c(e), v = r(n, d, t ? 2 : 1), _ = 0;
            if ("function" != typeof b) throw TypeError(e + " is not iterable!");
            if (i(b)) {
                for (p = s(e.length); p > _; _++) if (g = t ? v(a(m = e[_])[0], m[1]) : v(e[_]), 
                g === l || g === u) return g;
            } else for (h = b.call(e); !(m = h.next()).done; ) if (g = o(h, v, m.value, t), 
            g === l || g === u) return g;
        };
        n.BREAK = l, n.RETURN = u;
    }, {
        "./_an-object": 62,
        "./_ctx": 75,
        "./_is-array-iter": 91,
        "./_iter-call": 94,
        "./_to-length": 132,
        "./core.get-iterator-method": 139
    } ],
    84: [ function(e, t, n) {
        var r = t.exports = "undefined" != typeof window && window.Math == Math ? window : "undefined" != typeof self && self.Math == Math ? self : Function("return this")();
        "number" == typeof __g && (__g = r);
    }, {} ],
    85: [ function(e, t, n) {
        var r = {}.hasOwnProperty;
        t.exports = function(e, t) {
            return r.call(e, t);
        };
    }, {} ],
    86: [ function(e, t, n) {
        var r = e("./_object-dp"), o = e("./_property-desc");
        t.exports = e("./_descriptors") ? function(e, t, n) {
            return r.f(e, t, o(1, n));
        } : function(e, t, n) {
            return e[t] = n, e;
        };
    }, {
        "./_descriptors": 77,
        "./_object-dp": 106,
        "./_property-desc": 118
    } ],
    87: [ function(e, t, n) {
        t.exports = e("./_global").document && document.documentElement;
    }, {
        "./_global": 84
    } ],
    88: [ function(e, t, n) {
        t.exports = !e("./_descriptors") && !e("./_fails")(function() {
            return 7 != Object.defineProperty(e("./_dom-create")("div"), "a", {
                get: function() {
                    return 7;
                }
            }).a;
        });
    }, {
        "./_descriptors": 77,
        "./_dom-create": 78,
        "./_fails": 82
    } ],
    89: [ function(e, t, n) {
        t.exports = function(e, t, n) {
            var r = void 0 === n;
            switch (t.length) {
              case 0:
                return r ? e() : e.call(n);

              case 1:
                return r ? e(t[0]) : e.call(n, t[0]);

              case 2:
                return r ? e(t[0], t[1]) : e.call(n, t[0], t[1]);

              case 3:
                return r ? e(t[0], t[1], t[2]) : e.call(n, t[0], t[1], t[2]);

              case 4:
                return r ? e(t[0], t[1], t[2], t[3]) : e.call(n, t[0], t[1], t[2], t[3]);
            }
            return e.apply(n, t);
        };
    }, {} ],
    90: [ function(e, t, n) {
        var r = e("./_cof");
        t.exports = Object("z").propertyIsEnumerable(0) ? Object : function(e) {
            return "String" == r(e) ? e.split("") : Object(e);
        };
    }, {
        "./_cof": 69
    } ],
    91: [ function(e, t, n) {
        var r = e("./_iterators"), o = e("./_wks")("iterator"), i = Array.prototype;
        t.exports = function(e) {
            return void 0 !== e && (r.Array === e || i[o] === e);
        };
    }, {
        "./_iterators": 99,
        "./_wks": 138
    } ],
    92: [ function(e, t, n) {
        var r = e("./_cof");
        t.exports = Array.isArray || function(e) {
            return "Array" == r(e);
        };
    }, {
        "./_cof": 69
    } ],
    93: [ function(e, t, n) {
        t.exports = function(e) {
            return "object" == typeof e ? null !== e : "function" == typeof e;
        };
    }, {} ],
    94: [ function(e, t, n) {
        var r = e("./_an-object");
        t.exports = function(e, t, n, o) {
            try {
                return o ? t(r(n)[0], n[1]) : t(n);
            } catch (i) {
                var a = e["return"];
                throw void 0 !== a && r(a.call(e)), i;
            }
        };
    }, {
        "./_an-object": 62
    } ],
    95: [ function(e, t, n) {
        "use strict";
        var r = e("./_object-create"), o = e("./_property-desc"), i = e("./_set-to-string-tag"), a = {};
        e("./_hide")(a, e("./_wks")("iterator"), function() {
            return this;
        }), t.exports = function(e, t, n) {
            e.prototype = r(a, {
                next: o(1, n)
            }), i(e, t + " Iterator");
        };
    }, {
        "./_hide": 86,
        "./_object-create": 105,
        "./_property-desc": 118,
        "./_set-to-string-tag": 123,
        "./_wks": 138
    } ],
    96: [ function(e, t, n) {
        "use strict";
        var r = e("./_library"), o = e("./_export"), i = e("./_redefine"), a = e("./_hide"), s = e("./_has"), c = e("./_iterators"), l = e("./_iter-create"), u = e("./_set-to-string-tag"), d = e("./_object-gpo"), f = e("./_wks")("iterator"), p = !([].keys && "next" in [].keys()), m = "@@iterator", h = "keys", g = "values", b = function() {
            return this;
        };
        t.exports = function(e, t, n, v, _, y, w) {
            l(n, t, v);
            var k, E, C, x = function(e) {
                if (!p && e in L) return L[e];
                switch (e) {
                  case h:
                    return function() {
                        return new n(this, e);
                    };

                  case g:
                    return function() {
                        return new n(this, e);
                    };
                }
                return function() {
                    return new n(this, e);
                };
            }, j = t + " Iterator", S = _ == g, T = !1, L = e.prototype, N = L[f] || L[m] || _ && L[_], P = N || x(_), A = _ ? S ? x("entries") : P : void 0, I = "Array" == t ? L.entries || N : N;
            if (I && (C = d(I.call(new e())), C !== Object.prototype && (u(C, j, !0), r || s(C, f) || a(C, f, b))), 
            S && N && N.name !== g && (T = !0, P = function() {
                return N.call(this);
            }), r && !w || !p && !T && L[f] || a(L, f, P), c[t] = P, c[j] = b, _) if (k = {
                values: S ? P : x(g),
                keys: y ? P : x(h),
                entries: A
            }, w) for (E in k) E in L || i(L, E, k[E]); else o(o.P + o.F * (p || T), t, k);
            return k;
        };
    }, {
        "./_export": 81,
        "./_has": 85,
        "./_hide": 86,
        "./_iter-create": 95,
        "./_iterators": 99,
        "./_library": 101,
        "./_object-gpo": 112,
        "./_redefine": 120,
        "./_set-to-string-tag": 123,
        "./_wks": 138
    } ],
    97: [ function(e, t, n) {
        var r = e("./_wks")("iterator"), o = !1;
        try {
            var i = [ 7 ][r]();
            i["return"] = function() {
                o = !0;
            }, Array.from(i, function() {
                throw 2;
            });
        } catch (a) {}
        t.exports = function(e, t) {
            if (!t && !o) return !1;
            var n = !1;
            try {
                var i = [ 7 ], a = i[r]();
                a.next = function() {
                    return {
                        done: n = !0
                    };
                }, i[r] = function() {
                    return a;
                }, e(i);
            } catch (s) {}
            return n;
        };
    }, {
        "./_wks": 138
    } ],
    98: [ function(e, t, n) {
        t.exports = function(e, t) {
            return {
                value: t,
                done: !!e
            };
        };
    }, {} ],
    99: [ function(e, t, n) {
        t.exports = {};
    }, {} ],
    100: [ function(e, t, n) {
        var r = e("./_object-keys"), o = e("./_to-iobject");
        t.exports = function(e, t) {
            for (var n, i = o(e), a = r(i), s = a.length, c = 0; s > c; ) if (i[n = a[c++]] === t) return n;
        };
    }, {
        "./_object-keys": 114,
        "./_to-iobject": 131
    } ],
    101: [ function(e, t, n) {
        t.exports = !0;
    }, {} ],
    102: [ function(e, t, n) {
        var r = e("./_uid")("meta"), o = e("./_is-object"), i = e("./_has"), a = e("./_object-dp").f, s = 0, c = Object.isExtensible || function() {
            return !0;
        }, l = !e("./_fails")(function() {
            return c(Object.preventExtensions({}));
        }), u = function(e) {
            a(e, r, {
                value: {
                    i: "O" + ++s,
                    w: {}
                }
            });
        }, d = function(e, t) {
            if (!o(e)) return "symbol" == typeof e ? e : ("string" == typeof e ? "S" : "P") + e;
            if (!i(e, r)) {
                if (!c(e)) return "F";
                if (!t) return "E";
                u(e);
            }
            return e[r].i;
        }, f = function(e, t) {
            if (!i(e, r)) {
                if (!c(e)) return !0;
                if (!t) return !1;
                u(e);
            }
            return e[r].w;
        }, p = function(e) {
            return l && m.NEED && c(e) && !i(e, r) && u(e), e;
        }, m = t.exports = {
            KEY: r,
            NEED: !1,
            fastKey: d,
            getWeak: f,
            onFreeze: p
        };
    }, {
        "./_fails": 82,
        "./_has": 85,
        "./_is-object": 93,
        "./_object-dp": 106,
        "./_uid": 135
    } ],
    103: [ function(e, t, n) {
        var r = e("./_global"), o = e("./_task").set, i = r.MutationObserver || r.WebKitMutationObserver, a = r.process, s = r.Promise, c = "process" == e("./_cof")(a);
        t.exports = function() {
            var e, t, n, l = function() {
                var r, o;
                for (c && (r = a.domain) && r.exit(); e; ) {
                    o = e.fn, e = e.next;
                    try {
                        o();
                    } catch (i) {
                        throw e ? n() : t = void 0, i;
                    }
                }
                t = void 0, r && r.enter();
            };
            if (c) n = function() {
                a.nextTick(l);
            }; else if (i) {
                var u = !0, d = document.createTextNode("");
                new i(l).observe(d, {
                    characterData: !0
                }), n = function() {
                    d.data = u = !u;
                };
            } else if (s && s.resolve) {
                var f = s.resolve();
                n = function() {
                    f.then(l);
                };
            } else n = function() {
                o.call(r, l);
            };
            return function(r) {
                var o = {
                    fn: r,
                    next: void 0
                };
                t && (t.next = o), e || (e = o, n()), t = o;
            };
        };
    }, {
        "./_cof": 69,
        "./_global": 84,
        "./_task": 128
    } ],
    104: [ function(e, t, n) {
        "use strict";
        var r = e("./_object-keys"), o = e("./_object-gops"), i = e("./_object-pie"), a = e("./_to-object"), s = e("./_iobject"), c = Object.assign;
        t.exports = !c || e("./_fails")(function() {
            var e = {}, t = {}, n = Symbol(), r = "abcdefghijklmnopqrst";
            return e[n] = 7, r.split("").forEach(function(e) {
                t[e] = e;
            }), 7 != c({}, e)[n] || Object.keys(c({}, t)).join("") != r;
        }) ? function(e, t) {
            for (var n = a(e), c = arguments.length, l = 1, u = o.f, d = i.f; c > l; ) for (var f, p = s(arguments[l++]), m = u ? r(p).concat(u(p)) : r(p), h = m.length, g = 0; h > g; ) d.call(p, f = m[g++]) && (n[f] = p[f]);
            return n;
        } : c;
    }, {
        "./_fails": 82,
        "./_iobject": 90,
        "./_object-gops": 111,
        "./_object-keys": 114,
        "./_object-pie": 115,
        "./_to-object": 133
    } ],
    105: [ function(e, t, n) {
        var r = e("./_an-object"), o = e("./_object-dps"), i = e("./_enum-bug-keys"), a = e("./_shared-key")("IE_PROTO"), s = function() {}, c = "prototype", l = function() {
            var t, n = e("./_dom-create")("iframe"), r = i.length, o = "<", a = ">";
            for (n.style.display = "none", e("./_html").appendChild(n), n.src = "javascript:", 
            t = n.contentWindow.document, t.open(), t.write(o + "script" + a + "document.F=Object" + o + "/script" + a), 
            t.close(), l = t.F; r--; ) delete l[c][i[r]];
            return l();
        };
        t.exports = Object.create || function(e, t) {
            var n;
            return null !== e ? (s[c] = r(e), n = new s(), s[c] = null, n[a] = e) : n = l(), 
            void 0 === t ? n : o(n, t);
        };
    }, {
        "./_an-object": 62,
        "./_dom-create": 78,
        "./_enum-bug-keys": 79,
        "./_html": 87,
        "./_object-dps": 107,
        "./_shared-key": 124
    } ],
    106: [ function(e, t, n) {
        var r = e("./_an-object"), o = e("./_ie8-dom-define"), i = e("./_to-primitive"), a = Object.defineProperty;
        n.f = e("./_descriptors") ? Object.defineProperty : function(e, t, n) {
            if (r(e), t = i(t, !0), r(n), o) try {
                return a(e, t, n);
            } catch (s) {}
            if ("get" in n || "set" in n) throw TypeError("Accessors not supported!");
            return "value" in n && (e[t] = n.value), e;
        };
    }, {
        "./_an-object": 62,
        "./_descriptors": 77,
        "./_ie8-dom-define": 88,
        "./_to-primitive": 134
    } ],
    107: [ function(e, t, n) {
        var r = e("./_object-dp"), o = e("./_an-object"), i = e("./_object-keys");
        t.exports = e("./_descriptors") ? Object.defineProperties : function(e, t) {
            o(e);
            for (var n, a = i(t), s = a.length, c = 0; s > c; ) r.f(e, n = a[c++], t[n]);
            return e;
        };
    }, {
        "./_an-object": 62,
        "./_descriptors": 77,
        "./_object-dp": 106,
        "./_object-keys": 114
    } ],
    108: [ function(e, t, n) {
        var r = e("./_object-pie"), o = e("./_property-desc"), i = e("./_to-iobject"), a = e("./_to-primitive"), s = e("./_has"), c = e("./_ie8-dom-define"), l = Object.getOwnPropertyDescriptor;
        n.f = e("./_descriptors") ? l : function(e, t) {
            if (e = i(e), t = a(t, !0), c) try {
                return l(e, t);
            } catch (n) {}
            if (s(e, t)) return o(!r.f.call(e, t), e[t]);
        };
    }, {
        "./_descriptors": 77,
        "./_has": 85,
        "./_ie8-dom-define": 88,
        "./_object-pie": 115,
        "./_property-desc": 118,
        "./_to-iobject": 131,
        "./_to-primitive": 134
    } ],
    109: [ function(e, t, n) {
        var r = e("./_to-iobject"), o = e("./_object-gopn").f, i = {}.toString, a = "object" == typeof window && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [], s = function(e) {
            try {
                return o(e);
            } catch (t) {
                return a.slice();
            }
        };
        t.exports.f = function(e) {
            return a && "[object Window]" == i.call(e) ? s(e) : o(r(e));
        };
    }, {
        "./_object-gopn": 110,
        "./_to-iobject": 131
    } ],
    110: [ function(e, t, n) {
        var r = e("./_object-keys-internal"), o = e("./_enum-bug-keys").concat("length", "prototype");
        n.f = Object.getOwnPropertyNames || function(e) {
            return r(e, o);
        };
    }, {
        "./_enum-bug-keys": 79,
        "./_object-keys-internal": 113
    } ],
    111: [ function(e, t, n) {
        n.f = Object.getOwnPropertySymbols;
    }, {} ],
    112: [ function(e, t, n) {
        var r = e("./_has"), o = e("./_to-object"), i = e("./_shared-key")("IE_PROTO"), a = Object.prototype;
        t.exports = Object.getPrototypeOf || function(e) {
            return e = o(e), r(e, i) ? e[i] : "function" == typeof e.constructor && e instanceof e.constructor ? e.constructor.prototype : e instanceof Object ? a : null;
        };
    }, {
        "./_has": 85,
        "./_shared-key": 124,
        "./_to-object": 133
    } ],
    113: [ function(e, t, n) {
        var r = e("./_has"), o = e("./_to-iobject"), i = e("./_array-includes")(!1), a = e("./_shared-key")("IE_PROTO");
        t.exports = function(e, t) {
            var n, s = o(e), c = 0, l = [];
            for (n in s) n != a && r(s, n) && l.push(n);
            for (;t.length > c; ) r(s, n = t[c++]) && (~i(l, n) || l.push(n));
            return l;
        };
    }, {
        "./_array-includes": 64,
        "./_has": 85,
        "./_shared-key": 124,
        "./_to-iobject": 131
    } ],
    114: [ function(e, t, n) {
        var r = e("./_object-keys-internal"), o = e("./_enum-bug-keys");
        t.exports = Object.keys || function(e) {
            return r(e, o);
        };
    }, {
        "./_enum-bug-keys": 79,
        "./_object-keys-internal": 113
    } ],
    115: [ function(e, t, n) {
        n.f = {}.propertyIsEnumerable;
    }, {} ],
    116: [ function(e, t, n) {
        var r = e("./_export"), o = e("./_core"), i = e("./_fails");
        t.exports = function(e, t) {
            var n = (o.Object || {})[e] || Object[e], a = {};
            a[e] = t(n), r(r.S + r.F * i(function() {
                n(1);
            }), "Object", a);
        };
    }, {
        "./_core": 73,
        "./_export": 81,
        "./_fails": 82
    } ],
    117: [ function(e, t, n) {
        var r = e("./_object-keys"), o = e("./_to-iobject"), i = e("./_object-pie").f;
        t.exports = function(e) {
            return function(t) {
                for (var n, a = o(t), s = r(a), c = s.length, l = 0, u = []; c > l; ) i.call(a, n = s[l++]) && u.push(e ? [ n, a[n] ] : a[n]);
                return u;
            };
        };
    }, {
        "./_object-keys": 114,
        "./_object-pie": 115,
        "./_to-iobject": 131
    } ],
    118: [ function(e, t, n) {
        t.exports = function(e, t) {
            return {
                enumerable: !(1 & e),
                configurable: !(2 & e),
                writable: !(4 & e),
                value: t
            };
        };
    }, {} ],
    119: [ function(e, t, n) {
        var r = e("./_hide");
        t.exports = function(e, t, n) {
            for (var o in t) n && e[o] ? e[o] = t[o] : r(e, o, t[o]);
            return e;
        };
    }, {
        "./_hide": 86
    } ],
    120: [ function(e, t, n) {
        t.exports = e("./_hide");
    }, {
        "./_hide": 86
    } ],
    121: [ function(e, t, n) {
        var r = e("./_is-object"), o = e("./_an-object"), i = function(e, t) {
            if (o(e), !r(t) && null !== t) throw TypeError(t + ": can't set as prototype!");
        };
        t.exports = {
            set: Object.setPrototypeOf || ("__proto__" in {} ? function(t, n, r) {
                try {
                    r = e("./_ctx")(Function.call, e("./_object-gopd").f(Object.prototype, "__proto__").set, 2), 
                    r(t, []), n = !(t instanceof Array);
                } catch (o) {
                    n = !0;
                }
                return function(e, t) {
                    return i(e, t), n ? e.__proto__ = t : r(e, t), e;
                };
            }({}, !1) : void 0),
            check: i
        };
    }, {
        "./_an-object": 62,
        "./_ctx": 75,
        "./_is-object": 93,
        "./_object-gopd": 108
    } ],
    122: [ function(e, t, n) {
        "use strict";
        var r = e("./_global"), o = e("./_core"), i = e("./_object-dp"), a = e("./_descriptors"), s = e("./_wks")("species");
        t.exports = function(e) {
            var t = "function" == typeof o[e] ? o[e] : r[e];
            a && t && !t[s] && i.f(t, s, {
                configurable: !0,
                get: function() {
                    return this;
                }
            });
        };
    }, {
        "./_core": 73,
        "./_descriptors": 77,
        "./_global": 84,
        "./_object-dp": 106,
        "./_wks": 138
    } ],
    123: [ function(e, t, n) {
        var r = e("./_object-dp").f, o = e("./_has"), i = e("./_wks")("toStringTag");
        t.exports = function(e, t, n) {
            e && !o(e = n ? e : e.prototype, i) && r(e, i, {
                configurable: !0,
                value: t
            });
        };
    }, {
        "./_has": 85,
        "./_object-dp": 106,
        "./_wks": 138
    } ],
    124: [ function(e, t, n) {
        var r = e("./_shared")("keys"), o = e("./_uid");
        t.exports = function(e) {
            return r[e] || (r[e] = o(e));
        };
    }, {
        "./_shared": 125,
        "./_uid": 135
    } ],
    125: [ function(e, t, n) {
        var r = e("./_global"), o = "__core-js_shared__", i = r[o] || (r[o] = {});
        t.exports = function(e) {
            return i[e] || (i[e] = {});
        };
    }, {
        "./_global": 84
    } ],
    126: [ function(e, t, n) {
        var r = e("./_an-object"), o = e("./_a-function"), i = e("./_wks")("species");
        t.exports = function(e, t) {
            var n, a = r(e).constructor;
            return void 0 === a || void 0 == (n = r(a)[i]) ? t : o(n);
        };
    }, {
        "./_a-function": 59,
        "./_an-object": 62,
        "./_wks": 138
    } ],
    127: [ function(e, t, n) {
        var r = e("./_to-integer"), o = e("./_defined");
        t.exports = function(e) {
            return function(t, n) {
                var i, a, s = String(o(t)), c = r(n), l = s.length;
                return c < 0 || c >= l ? e ? "" : void 0 : (i = s.charCodeAt(c), i < 55296 || i > 56319 || c + 1 === l || (a = s.charCodeAt(c + 1)) < 56320 || a > 57343 ? e ? s.charAt(c) : i : e ? s.slice(c, c + 2) : (i - 55296 << 10) + (a - 56320) + 65536);
            };
        };
    }, {
        "./_defined": 76,
        "./_to-integer": 130
    } ],
    128: [ function(e, t, n) {
        var r, o, i, a = e("./_ctx"), s = e("./_invoke"), c = e("./_html"), l = e("./_dom-create"), u = e("./_global"), d = u.process, f = u.setImmediate, p = u.clearImmediate, m = u.MessageChannel, h = 0, g = {}, b = "onreadystatechange", v = function() {
            var e = +this;
            if (g.hasOwnProperty(e)) {
                var t = g[e];
                delete g[e], t();
            }
        }, _ = function(e) {
            v.call(e.data);
        };
        f && p || (f = function(e) {
            for (var t = [], n = 1; arguments.length > n; ) t.push(arguments[n++]);
            return g[++h] = function() {
                s("function" == typeof e ? e : Function(e), t);
            }, r(h), h;
        }, p = function(e) {
            delete g[e];
        }, "process" == e("./_cof")(d) ? r = function(e) {
            d.nextTick(a(v, e, 1));
        } : m ? (o = new m(), i = o.port2, o.port1.onmessage = _, r = a(i.postMessage, i, 1)) : u.addEventListener && "function" == typeof postMessage && !u.importScripts ? (r = function(e) {
            u.postMessage(e + "", "*");
        }, u.addEventListener("message", _, !1)) : r = b in l("script") ? function(e) {
            c.appendChild(l("script"))[b] = function() {
                c.removeChild(this), v.call(e);
            };
        } : function(e) {
            setTimeout(a(v, e, 1), 0);
        }), t.exports = {
            set: f,
            clear: p
        };
    }, {
        "./_cof": 69,
        "./_ctx": 75,
        "./_dom-create": 78,
        "./_global": 84,
        "./_html": 87,
        "./_invoke": 89
    } ],
    129: [ function(e, t, n) {
        var r = e("./_to-integer"), o = Math.max, i = Math.min;
        t.exports = function(e, t) {
            return e = r(e), e < 0 ? o(e + t, 0) : i(e, t);
        };
    }, {
        "./_to-integer": 130
    } ],
    130: [ function(e, t, n) {
        var r = Math.ceil, o = Math.floor;
        t.exports = function(e) {
            return isNaN(e = +e) ? 0 : (e > 0 ? o : r)(e);
        };
    }, {} ],
    131: [ function(e, t, n) {
        var r = e("./_iobject"), o = e("./_defined");
        t.exports = function(e) {
            return r(o(e));
        };
    }, {
        "./_defined": 76,
        "./_iobject": 90
    } ],
    132: [ function(e, t, n) {
        var r = e("./_to-integer"), o = Math.min;
        t.exports = function(e) {
            return e > 0 ? o(r(e), 9007199254740991) : 0;
        };
    }, {
        "./_to-integer": 130
    } ],
    133: [ function(e, t, n) {
        var r = e("./_defined");
        t.exports = function(e) {
            return Object(r(e));
        };
    }, {
        "./_defined": 76
    } ],
    134: [ function(e, t, n) {
        var r = e("./_is-object");
        t.exports = function(e, t) {
            if (!r(e)) return e;
            var n, o;
            if (t && "function" == typeof (n = e.toString) && !r(o = n.call(e))) return o;
            if ("function" == typeof (n = e.valueOf) && !r(o = n.call(e))) return o;
            if (!t && "function" == typeof (n = e.toString) && !r(o = n.call(e))) return o;
            throw TypeError("Can't convert object to primitive value");
        };
    }, {
        "./_is-object": 93
    } ],
    135: [ function(e, t, n) {
        var r = 0, o = Math.random();
        t.exports = function(e) {
            return "Symbol(".concat(void 0 === e ? "" : e, ")_", (++r + o).toString(36));
        };
    }, {} ],
    136: [ function(e, t, n) {
        var r = e("./_global"), o = e("./_core"), i = e("./_library"), a = e("./_wks-ext"), s = e("./_object-dp").f;
        t.exports = function(e) {
            var t = o.Symbol || (o.Symbol = i ? {} : r.Symbol || {});
            "_" == e.charAt(0) || e in t || s(t, e, {
                value: a.f(e)
            });
        };
    }, {
        "./_core": 73,
        "./_global": 84,
        "./_library": 101,
        "./_object-dp": 106,
        "./_wks-ext": 137
    } ],
    137: [ function(e, t, n) {
        n.f = e("./_wks");
    }, {
        "./_wks": 138
    } ],
    138: [ function(e, t, n) {
        var r = e("./_shared")("wks"), o = e("./_uid"), i = e("./_global").Symbol, a = "function" == typeof i, s = t.exports = function(e) {
            return r[e] || (r[e] = a && i[e] || (a ? i : o)("Symbol." + e));
        };
        s.store = r;
    }, {
        "./_global": 84,
        "./_shared": 125,
        "./_uid": 135
    } ],
    139: [ function(e, t, n) {
        var r = e("./_classof"), o = e("./_wks")("iterator"), i = e("./_iterators");
        t.exports = e("./_core").getIteratorMethod = function(e) {
            if (void 0 != e) return e[o] || e["@@iterator"] || i[r(e)];
        };
    }, {
        "./_classof": 68,
        "./_core": 73,
        "./_iterators": 99,
        "./_wks": 138
    } ],
    140: [ function(e, t, n) {
        var r = e("./_an-object"), o = e("./core.get-iterator-method");
        t.exports = e("./_core").getIterator = function(e) {
            var t = o(e);
            if ("function" != typeof t) throw TypeError(e + " is not iterable!");
            return r(t.call(e));
        };
    }, {
        "./_an-object": 62,
        "./_core": 73,
        "./core.get-iterator-method": 139
    } ],
    141: [ function(e, t, n) {
        var r = e("./_classof"), o = e("./_wks")("iterator"), i = e("./_iterators");
        t.exports = e("./_core").isIterable = function(e) {
            var t = Object(e);
            return void 0 !== t[o] || "@@iterator" in t || i.hasOwnProperty(r(t));
        };
    }, {
        "./_classof": 68,
        "./_core": 73,
        "./_iterators": 99,
        "./_wks": 138
    } ],
    142: [ function(e, t, n) {
        "use strict";
        var r = e("./_ctx"), o = e("./_export"), i = e("./_to-object"), a = e("./_iter-call"), s = e("./_is-array-iter"), c = e("./_to-length"), l = e("./_create-property"), u = e("./core.get-iterator-method");
        o(o.S + o.F * !e("./_iter-detect")(function(e) {
            Array.from(e);
        }), "Array", {
            from: function(e) {
                var t, n, o, d, f = i(e), p = "function" == typeof this ? this : Array, m = arguments.length, h = m > 1 ? arguments[1] : void 0, g = void 0 !== h, b = 0, v = u(f);
                if (g && (h = r(h, m > 2 ? arguments[2] : void 0, 2)), void 0 == v || p == Array && s(v)) for (t = c(f.length), 
                n = new p(t); t > b; b++) l(n, b, g ? h(f[b], b) : f[b]); else for (d = v.call(f), 
                n = new p(); !(o = d.next()).done; b++) l(n, b, g ? a(d, h, [ o.value, b ], !0) : o.value);
                return n.length = b, n;
            }
        });
    }, {
        "./_create-property": 74,
        "./_ctx": 75,
        "./_export": 81,
        "./_is-array-iter": 91,
        "./_iter-call": 94,
        "./_iter-detect": 97,
        "./_to-length": 132,
        "./_to-object": 133,
        "./core.get-iterator-method": 139
    } ],
    143: [ function(e, t, n) {
        "use strict";
        var r = e("./_add-to-unscopables"), o = e("./_iter-step"), i = e("./_iterators"), a = e("./_to-iobject");
        t.exports = e("./_iter-define")(Array, "Array", function(e, t) {
            this._t = a(e), this._i = 0, this._k = t;
        }, function() {
            var e = this._t, t = this._k, n = this._i++;
            return !e || n >= e.length ? (this._t = void 0, o(1)) : "keys" == t ? o(0, n) : "values" == t ? o(0, e[n]) : o(0, [ n, e[n] ]);
        }, "values"), i.Arguments = i.Array, r("keys"), r("values"), r("entries");
    }, {
        "./_add-to-unscopables": 60,
        "./_iter-define": 96,
        "./_iter-step": 98,
        "./_iterators": 99,
        "./_to-iobject": 131
    } ],
    144: [ function(e, t, n) {
        "use strict";
        var r = e("./_collection-strong");
        t.exports = e("./_collection")("Map", function(e) {
            return function() {
                return e(this, arguments.length > 0 ? arguments[0] : void 0);
            };
        }, {
            get: function(e) {
                var t = r.getEntry(this, e);
                return t && t.v;
            },
            set: function(e, t) {
                return r.def(this, 0 === e ? 0 : e, t);
            }
        }, r, !0);
    }, {
        "./_collection": 72,
        "./_collection-strong": 70
    } ],
    145: [ function(e, t, n) {
        var r = e("./_export");
        r(r.S + r.F, "Object", {
            assign: e("./_object-assign")
        });
    }, {
        "./_export": 81,
        "./_object-assign": 104
    } ],
    146: [ function(e, t, n) {
        var r = e("./_export");
        r(r.S, "Object", {
            create: e("./_object-create")
        });
    }, {
        "./_export": 81,
        "./_object-create": 105
    } ],
    147: [ function(e, t, n) {
        var r = e("./_export");
        r(r.S + r.F * !e("./_descriptors"), "Object", {
            defineProperty: e("./_object-dp").f
        });
    }, {
        "./_descriptors": 77,
        "./_export": 81,
        "./_object-dp": 106
    } ],
    148: [ function(e, t, n) {
        var r = e("./_to-object"), o = e("./_object-gpo");
        e("./_object-sap")("getPrototypeOf", function() {
            return function(e) {
                return o(r(e));
            };
        });
    }, {
        "./_object-gpo": 112,
        "./_object-sap": 116,
        "./_to-object": 133
    } ],
    149: [ function(e, t, n) {
        var r = e("./_to-object"), o = e("./_object-keys");
        e("./_object-sap")("keys", function() {
            return function(e) {
                return o(r(e));
            };
        });
    }, {
        "./_object-keys": 114,
        "./_object-sap": 116,
        "./_to-object": 133
    } ],
    150: [ function(e, t, n) {
        var r = e("./_export");
        r(r.S, "Object", {
            setPrototypeOf: e("./_set-proto").set
        });
    }, {
        "./_export": 81,
        "./_set-proto": 121
    } ],
    151: [ function(e, t, n) {}, {} ],
    152: [ function(e, t, n) {
        "use strict";
        var r, o, i, a = e("./_library"), s = e("./_global"), c = e("./_ctx"), l = e("./_classof"), u = e("./_export"), d = e("./_is-object"), f = e("./_a-function"), p = e("./_an-instance"), m = e("./_for-of"), h = e("./_species-constructor"), g = e("./_task").set, b = e("./_microtask")(), v = "Promise", _ = s.TypeError, y = s.process, w = s[v], y = s.process, k = "process" == l(y), E = function() {}, C = !!function() {
            try {
                var t = w.resolve(1), n = (t.constructor = {})[e("./_wks")("species")] = function(e) {
                    e(E, E);
                };
                return (k || "function" == typeof PromiseRejectionEvent) && t.then(E) instanceof n;
            } catch (r) {}
        }(), x = function(e, t) {
            return e === t || e === w && t === i;
        }, j = function(e) {
            var t;
            return !(!d(e) || "function" != typeof (t = e.then)) && t;
        }, S = function(e) {
            return x(w, e) ? new T(e) : new o(e);
        }, T = o = function(e) {
            var t, n;
            this.promise = new e(function(e, r) {
                if (void 0 !== t || void 0 !== n) throw _("Bad Promise constructor");
                t = e, n = r;
            }), this.resolve = f(t), this.reject = f(n);
        }, L = function(e) {
            try {
                e();
            } catch (t) {
                return {
                    error: t
                };
            }
        }, N = function(e, t) {
            if (!e._n) {
                e._n = !0;
                var n = e._c;
                b(function() {
                    for (var r = e._v, o = 1 == e._s, i = 0, a = function(t) {
                        var n, i, a = o ? t.ok : t.fail, s = t.resolve, c = t.reject, l = t.domain;
                        try {
                            a ? (o || (2 == e._h && I(e), e._h = 1), a === !0 ? n = r : (l && l.enter(), n = a(r), 
                            l && l.exit()), n === t.promise ? c(_("Promise-chain cycle")) : (i = j(n)) ? i.call(n, s, c) : s(n)) : c(r);
                        } catch (u) {
                            c(u);
                        }
                    }; n.length > i; ) a(n[i++]);
                    e._c = [], e._n = !1, t && !e._h && P(e);
                });
            }
        }, P = function(e) {
            g.call(s, function() {
                var t, n, r, o = e._v;
                if (A(e) && (t = L(function() {
                    k ? y.emit("unhandledRejection", o, e) : (n = s.onunhandledrejection) ? n({
                        promise: e,
                        reason: o
                    }) : (r = s.console) && r.error && r.error("Unhandled promise rejection", o);
                }), e._h = k || A(e) ? 2 : 1), e._a = void 0, t) throw t.error;
            });
        }, A = function(e) {
            if (1 == e._h) return !1;
            for (var t, n = e._a || e._c, r = 0; n.length > r; ) if (t = n[r++], t.fail || !A(t.promise)) return !1;
            return !0;
        }, I = function(e) {
            g.call(s, function() {
                var t;
                k ? y.emit("rejectionHandled", e) : (t = s.onrejectionhandled) && t({
                    promise: e,
                    reason: e._v
                });
            });
        }, M = function(e) {
            var t = this;
            t._d || (t._d = !0, t = t._w || t, t._v = e, t._s = 2, t._a || (t._a = t._c.slice()), 
            N(t, !0));
        }, O = function(e) {
            var t, n = this;
            if (!n._d) {
                n._d = !0, n = n._w || n;
                try {
                    if (n === e) throw _("Promise can't be resolved itself");
                    (t = j(e)) ? b(function() {
                        var r = {
                            _w: n,
                            _d: !1
                        };
                        try {
                            t.call(e, c(O, r, 1), c(M, r, 1));
                        } catch (o) {
                            M.call(r, o);
                        }
                    }) : (n._v = e, n._s = 1, N(n, !1));
                } catch (r) {
                    M.call({
                        _w: n,
                        _d: !1
                    }, r);
                }
            }
        };
        C || (w = function(e) {
            p(this, w, v, "_h"), f(e), r.call(this);
            try {
                e(c(O, this, 1), c(M, this, 1));
            } catch (t) {
                M.call(this, t);
            }
        }, r = function(e) {
            this._c = [], this._a = void 0, this._s = 0, this._d = !1, this._v = void 0, this._h = 0, 
            this._n = !1;
        }, r.prototype = e("./_redefine-all")(w.prototype, {
            then: function(e, t) {
                var n = S(h(this, w));
                return n.ok = "function" != typeof e || e, n.fail = "function" == typeof t && t, 
                n.domain = k ? y.domain : void 0, this._c.push(n), this._a && this._a.push(n), this._s && N(this, !1), 
                n.promise;
            },
            "catch": function(e) {
                return this.then(void 0, e);
            }
        }), T = function() {
            var e = new r();
            this.promise = e, this.resolve = c(O, e, 1), this.reject = c(M, e, 1);
        }), u(u.G + u.W + u.F * !C, {
            Promise: w
        }), e("./_set-to-string-tag")(w, v), e("./_set-species")(v), i = e("./_core")[v], 
        u(u.S + u.F * !C, v, {
            reject: function(e) {
                var t = S(this), n = t.reject;
                return n(e), t.promise;
            }
        }), u(u.S + u.F * (a || !C), v, {
            resolve: function(e) {
                if (e instanceof w && x(e.constructor, this)) return e;
                var t = S(this), n = t.resolve;
                return n(e), t.promise;
            }
        }), u(u.S + u.F * !(C && e("./_iter-detect")(function(e) {
            w.all(e)["catch"](E);
        })), v, {
            all: function(e) {
                var t = this, n = S(t), r = n.resolve, o = n.reject, i = L(function() {
                    var n = [], i = 0, a = 1;
                    m(e, !1, function(e) {
                        var s = i++, c = !1;
                        n.push(void 0), a++, t.resolve(e).then(function(e) {
                            c || (c = !0, n[s] = e, --a || r(n));
                        }, o);
                    }), --a || r(n);
                });
                return i && o(i.error), n.promise;
            },
            race: function(e) {
                var t = this, n = S(t), r = n.reject, o = L(function() {
                    m(e, !1, function(e) {
                        t.resolve(e).then(n.resolve, r);
                    });
                });
                return o && r(o.error), n.promise;
            }
        });
    }, {
        "./_a-function": 59,
        "./_an-instance": 61,
        "./_classof": 68,
        "./_core": 73,
        "./_ctx": 75,
        "./_export": 81,
        "./_for-of": 83,
        "./_global": 84,
        "./_is-object": 93,
        "./_iter-detect": 97,
        "./_library": 101,
        "./_microtask": 103,
        "./_redefine-all": 119,
        "./_set-species": 122,
        "./_set-to-string-tag": 123,
        "./_species-constructor": 126,
        "./_task": 128,
        "./_wks": 138
    } ],
    153: [ function(e, t, n) {
        "use strict";
        var r = e("./_string-at")(!0);
        e("./_iter-define")(String, "String", function(e) {
            this._t = String(e), this._i = 0;
        }, function() {
            var e, t = this._t, n = this._i;
            return n >= t.length ? {
                value: void 0,
                done: !0
            } : (e = r(t, n), this._i += e.length, {
                value: e,
                done: !1
            });
        });
    }, {
        "./_iter-define": 96,
        "./_string-at": 127
    } ],
    154: [ function(e, t, n) {
        "use strict";
        var r = e("./_global"), o = e("./_has"), i = e("./_descriptors"), a = e("./_export"), s = e("./_redefine"), c = e("./_meta").KEY, l = e("./_fails"), u = e("./_shared"), d = e("./_set-to-string-tag"), f = e("./_uid"), p = e("./_wks"), m = e("./_wks-ext"), h = e("./_wks-define"), g = e("./_keyof"), b = e("./_enum-keys"), v = e("./_is-array"), _ = e("./_an-object"), y = e("./_to-iobject"), w = e("./_to-primitive"), k = e("./_property-desc"), E = e("./_object-create"), C = e("./_object-gopn-ext"), x = e("./_object-gopd"), j = e("./_object-dp"), S = e("./_object-keys"), T = x.f, L = j.f, N = C.f, P = r.Symbol, A = r.JSON, I = A && A.stringify, M = "prototype", O = p("_hidden"), R = p("toPrimitive"), D = {}.propertyIsEnumerable, F = u("symbol-registry"), B = u("symbols"), W = u("op-symbols"), U = Object[M], G = "function" == typeof P, z = r.QObject, V = !z || !z[M] || !z[M].findChild, H = i && l(function() {
            return 7 != E(L({}, "a", {
                get: function() {
                    return L(this, "a", {
                        value: 7
                    }).a;
                }
            })).a;
        }) ? function(e, t, n) {
            var r = T(U, t);
            r && delete U[t], L(e, t, n), r && e !== U && L(U, t, r);
        } : L, q = function(e) {
            var t = B[e] = E(P[M]);
            return t._k = e, t;
        }, Y = G && "symbol" == typeof P.iterator ? function(e) {
            return "symbol" == typeof e;
        } : function(e) {
            return e instanceof P;
        }, K = function(e, t, n) {
            return e === U && K(W, t, n), _(e), t = w(t, !0), _(n), o(B, t) ? (n.enumerable ? (o(e, O) && e[O][t] && (e[O][t] = !1), 
            n = E(n, {
                enumerable: k(0, !1)
            })) : (o(e, O) || L(e, O, k(1, {})), e[O][t] = !0), H(e, t, n)) : L(e, t, n);
        }, X = function(e, t) {
            _(e);
            for (var n, r = b(t = y(t)), o = 0, i = r.length; i > o; ) K(e, n = r[o++], t[n]);
            return e;
        }, Q = function(e, t) {
            return void 0 === t ? E(e) : X(E(e), t);
        }, J = function(e) {
            var t = D.call(this, e = w(e, !0));
            return !(this === U && o(B, e) && !o(W, e)) && (!(t || !o(this, e) || !o(B, e) || o(this, O) && this[O][e]) || t);
        }, $ = function(e, t) {
            if (e = y(e), t = w(t, !0), e !== U || !o(B, t) || o(W, t)) {
                var n = T(e, t);
                return !n || !o(B, t) || o(e, O) && e[O][t] || (n.enumerable = !0), n;
            }
        }, Z = function(e) {
            for (var t, n = N(y(e)), r = [], i = 0; n.length > i; ) o(B, t = n[i++]) || t == O || t == c || r.push(t);
            return r;
        }, ee = function(e) {
            for (var t, n = e === U, r = N(n ? W : y(e)), i = [], a = 0; r.length > a; ) !o(B, t = r[a++]) || n && !o(U, t) || i.push(B[t]);
            return i;
        };
        G || (P = function() {
            if (this instanceof P) throw TypeError("Symbol is not a constructor!");
            var e = f(arguments.length > 0 ? arguments[0] : void 0), t = function(n) {
                this === U && t.call(W, n), o(this, O) && o(this[O], e) && (this[O][e] = !1), H(this, e, k(1, n));
            };
            return i && V && H(U, e, {
                configurable: !0,
                set: t
            }), q(e);
        }, s(P[M], "toString", function() {
            return this._k;
        }), x.f = $, j.f = K, e("./_object-gopn").f = C.f = Z, e("./_object-pie").f = J, 
        e("./_object-gops").f = ee, i && !e("./_library") && s(U, "propertyIsEnumerable", J, !0), 
        m.f = function(e) {
            return q(p(e));
        }), a(a.G + a.W + a.F * !G, {
            Symbol: P
        });
        for (var te = "hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","), ne = 0; te.length > ne; ) p(te[ne++]);
        for (var te = S(p.store), ne = 0; te.length > ne; ) h(te[ne++]);
        a(a.S + a.F * !G, "Symbol", {
            "for": function(e) {
                return o(F, e += "") ? F[e] : F[e] = P(e);
            },
            keyFor: function(e) {
                if (Y(e)) return g(F, e);
                throw TypeError(e + " is not a symbol!");
            },
            useSetter: function() {
                V = !0;
            },
            useSimple: function() {
                V = !1;
            }
        }), a(a.S + a.F * !G, "Object", {
            create: Q,
            defineProperty: K,
            defineProperties: X,
            getOwnPropertyDescriptor: $,
            getOwnPropertyNames: Z,
            getOwnPropertySymbols: ee
        }), A && a(a.S + a.F * (!G || l(function() {
            var e = P();
            return "[null]" != I([ e ]) || "{}" != I({
                a: e
            }) || "{}" != I(Object(e));
        })), "JSON", {
            stringify: function(e) {
                if (void 0 !== e && !Y(e)) {
                    for (var t, n, r = [ e ], o = 1; arguments.length > o; ) r.push(arguments[o++]);
                    return t = r[1], "function" == typeof t && (n = t), !n && v(t) || (t = function(e, t) {
                        if (n && (t = n.call(this, e, t)), !Y(t)) return t;
                    }), r[1] = t, I.apply(A, r);
                }
            }
        }), P[M][R] || e("./_hide")(P[M], R, P[M].valueOf), d(P, "Symbol"), d(Math, "Math", !0), 
        d(r.JSON, "JSON", !0);
    }, {
        "./_an-object": 62,
        "./_descriptors": 77,
        "./_enum-keys": 80,
        "./_export": 81,
        "./_fails": 82,
        "./_global": 84,
        "./_has": 85,
        "./_hide": 86,
        "./_is-array": 92,
        "./_keyof": 100,
        "./_library": 101,
        "./_meta": 102,
        "./_object-create": 105,
        "./_object-dp": 106,
        "./_object-gopd": 108,
        "./_object-gopn": 110,
        "./_object-gopn-ext": 109,
        "./_object-gops": 111,
        "./_object-keys": 114,
        "./_object-pie": 115,
        "./_property-desc": 118,
        "./_redefine": 120,
        "./_set-to-string-tag": 123,
        "./_shared": 125,
        "./_to-iobject": 131,
        "./_to-primitive": 134,
        "./_uid": 135,
        "./_wks": 138,
        "./_wks-define": 136,
        "./_wks-ext": 137
    } ],
    155: [ function(e, t, n) {
        var r = e("./_export");
        r(r.P + r.R, "Map", {
            toJSON: e("./_collection-to-json")("Map")
        });
    }, {
        "./_collection-to-json": 71,
        "./_export": 81
    } ],
    156: [ function(e, t, n) {
        var r = e("./_export"), o = e("./_object-to-array")(!1);
        r(r.S, "Object", {
            values: function(e) {
                return o(e);
            }
        });
    }, {
        "./_export": 81,
        "./_object-to-array": 117
    } ],
    157: [ function(e, t, n) {
        e("./_wks-define")("asyncIterator");
    }, {
        "./_wks-define": 136
    } ],
    158: [ function(e, t, n) {
        e("./_wks-define")("observable");
    }, {
        "./_wks-define": 136
    } ],
    159: [ function(e, t, n) {
        e("./es6.array.iterator");
        for (var r = e("./_global"), o = e("./_hide"), i = e("./_iterators"), a = e("./_wks")("toStringTag"), s = [ "NodeList", "DOMTokenList", "MediaList", "StyleSheetList", "CSSRuleList" ], c = 0; c < 5; c++) {
            var l = s[c], u = r[l], d = u && u.prototype;
            d && !d[a] && o(d, a, l), i[l] = i.Array;
        }
    }, {
        "./_global": 84,
        "./_hide": 86,
        "./_iterators": 99,
        "./_wks": 138,
        "./es6.array.iterator": 143
    } ],
    160: [ function(e, t, n) {
        function r() {
            throw new Error("setTimeout has not been defined");
        }
        function o() {
            throw new Error("clearTimeout has not been defined");
        }
        function i(e) {
            if (d === setTimeout) return setTimeout(e, 0);
            if ((d === r || !d) && setTimeout) return d = setTimeout, setTimeout(e, 0);
            try {
                return d(e, 0);
            } catch (t) {
                try {
                    return d.call(null, e, 0);
                } catch (t) {
                    return d.call(this, e, 0);
                }
            }
        }
        function a(e) {
            if (f === clearTimeout) return clearTimeout(e);
            if ((f === o || !f) && clearTimeout) return f = clearTimeout, clearTimeout(e);
            try {
                return f(e);
            } catch (t) {
                try {
                    return f.call(null, e);
                } catch (t) {
                    return f.call(this, e);
                }
            }
        }
        function s() {
            g && m && (g = !1, m.length ? h = m.concat(h) : b = -1, h.length && c());
        }
        function c() {
            if (!g) {
                var e = i(s);
                g = !0;
                for (var t = h.length; t; ) {
                    for (m = h, h = []; ++b < t; ) m && m[b].run();
                    b = -1, t = h.length;
                }
                m = null, g = !1, a(e);
            }
        }
        function l(e, t) {
            this.fun = e, this.array = t;
        }
        function u() {}
        var d, f, p = t.exports = {};
        !function() {
            try {
                d = "function" == typeof setTimeout ? setTimeout : r;
            } catch (e) {
                d = r;
            }
            try {
                f = "function" == typeof clearTimeout ? clearTimeout : o;
            } catch (e) {
                f = o;
            }
        }();
        var m, h = [], g = !1, b = -1;
        p.nextTick = function(e) {
            var t = new Array(arguments.length - 1);
            if (arguments.length > 1) for (var n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
            h.push(new l(e, t)), 1 !== h.length || g || i(c);
        }, l.prototype.run = function() {
            this.fun.apply(null, this.array);
        }, p.title = "browser", p.browser = !0, p.env = {}, p.argv = [], p.version = "", 
        p.versions = {}, p.on = u, p.addListener = u, p.once = u, p.off = u, p.removeListener = u, 
        p.removeAllListeners = u, p.emit = u, p.binding = function(e) {
            throw new Error("process.binding is not supported");
        }, p.cwd = function() {
            return "/";
        }, p.chdir = function(e) {
            throw new Error("process.chdir is not supported");
        }, p.umask = function() {
            return 0;
        };
    }, {} ],
    161: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o() {
            return new C();
        }
        function i(e, t) {
            chrome.runtime.lastError ? t(chrome.runtime.lastError) : e();
        }
        var a = e("babel-runtime/core-js/object/assign"), s = r(a), c = e("babel-runtime/core-js/promise"), l = r(c), u = e("babel-runtime/helpers/classCallCheck"), d = r(u), f = e("babel-runtime/helpers/createClass"), p = r(f), m = e("babel-runtime/core-js/object/get-own-property-symbols"), h = r(m), g = function(e, t) {
            var n = {};
            for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
            if (null != e && "function" == typeof h["default"]) for (var o = 0, r = (0, h["default"])(e); o < r.length; o++) t.indexOf(r[o]) < 0 && (n[r[o]] = e[r[o]]);
            return n;
        };
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var b = e("./web-extensions"), v = e("./message/bg"), _ = e("./message/content"), y = e("./tabs/chrome"), w = e("lib/util");
        n.getApi = o;
        var k = function() {
            function e(t) {
                (0, d["default"])(this, e), this.port = chrome.runtime.connect({
                    name: t
                });
            }
            return (0, p["default"])(e, [ {
                key: "onMessage",
                value: function(e) {
                    this.port.onMessage.addListener(e);
                }
            }, {
                key: "onDisconnect",
                value: function(e) {
                    this.port.onDisconnect.addListener(e);
                }
            }, {
                key: "postMessage",
                value: function(e) {
                    this.port.postMessage(e);
                }
            } ]), e;
        }(), E = function() {
            function e(t) {
                (0, d["default"])(this, e), this._port = t, this.sender = {};
                var n = t.sender, r = t.name;
                this.name = r, n && (this.sender.url = n.url, n.tab && n.tab.url && n.tab.id && (this.sender.tab = {
                    url: n.tab.url,
                    id: n.tab.id,
                    active: n.tab.active
                }));
            }
            return (0, p["default"])(e, [ {
                key: "onMessage",
                value: function(e) {
                    this._port.onMessage.addListener(e);
                }
            }, {
                key: "onDisconnect",
                value: function(e) {
                    this._port.onDisconnect.addListener(e);
                }
            }, {
                key: "postMessage",
                value: function(e) {
                    this._port.postMessage(e);
                }
            } ]), e;
        }(), C = function x() {
            (0, d["default"])(this, x), this.tabs = new y.ChromeTabsApiImpl(), this.notification = {
                kind: "web-extension",
                create: function(e) {
                    return new l["default"](function(t, n) {
                        var r = e.onClicked, o = e.onButtonClicked, i = g(e, [ "onClicked", "onButtonClicked" ]), a = chrome.notifications, c = chrome.runtime, l = w.guid();
                        a.create(l, (0, s["default"])({
                            type: "basic"
                        }, i), function() {
                            c.lastError && n(c.lastError), void 0 !== r && a.onClicked.addListener(r), void 0 !== o && a.onButtonClicked.addListener(o), 
                            t(l);
                        });
                    });
                },
                clear: function(e) {
                    return new l["default"](function(t, n) {
                        var r = chrome.runtime;
                        chrome.notifications.clear(e, function(e) {
                            r.lastError && n(r.lastError), t(e);
                        });
                    });
                }
            }, this.cookies = {
                kind: "web-extension",
                get: function(e) {
                    return new l["default"](function(t, n) {
                        return chrome.cookies.get(e, function(e) {
                            return i(function() {
                                return t(e);
                            }, n);
                        });
                    });
                },
                getAll: function(e) {
                    return new l["default"](function(t, n) {
                        return chrome.cookies.getAll(e, function(e) {
                            return i(function() {
                                return t(e);
                            }, n);
                        });
                    });
                },
                set: function(e) {
                    return new l["default"](function(t, n) {
                        return chrome.cookies.set(e, function(e) {
                            return i(function() {
                                return t(e);
                            }, n);
                        });
                    });
                },
                watch: function(e, t) {
                    chrome.cookies.onChanged.addListener(function(n) {
                        var r = n.cookie, o = n.cause;
                        !r || !r.name || e.path && e.path !== r.path || e.name !== r.name || e.domain && r.domain.indexOf(e.domain) === -1 || ("explicit" === o && t(r), 
                        "expired_overwrite" === o && t());
                    });
                }
            }, this.preferences = b.preferencesApi, this.button = {
                kind: "web-extension",
                setBadge: function(e) {
                    chrome.browserAction.setBadgeText({
                        text: e
                    });
                },
                setIconByName: function(e) {
                    var t = "./src/icon/icon", n = e ? "-" + e : "";
                    chrome.browserAction.setIcon({
                        path: {
                            "16": t + "16" + n + ".png",
                            "32": t + "32" + n + ".png"
                        }
                    });
                },
                setBadgeBackgroundColor: function(e) {
                    chrome.browserAction.setBadgeBackgroundColor({
                        color: e
                    });
                }
            }, this.message = w.isBg() ? new v.GenericBackgroundMessageApiImpl(function(e) {
                return chrome.runtime.onConnect.addListener(function(t) {
                    return e(new E(t));
                });
            }, this.tabs.getActiveTab, this.tabs.getAllTabs) : new _.GenericContentScriptMessageApiImpl(function(e) {
                return new k(e);
            });
        };
    }, {
        "./message/bg": 164,
        "./message/content": 165,
        "./tabs/chrome": 171,
        "./web-extensions": 174,
        "babel-runtime/core-js/object/assign": 20,
        "babel-runtime/core-js/object/get-own-property-symbols": 23,
        "babel-runtime/core-js/promise": 28,
        "babel-runtime/helpers/classCallCheck": 31,
        "babel-runtime/helpers/createClass": 32,
        "lib/util": 288
    } ],
    162: [ function(e, t, n) {
        "use strict";
        function r(e) {
            for (var t in e) n.hasOwnProperty(t) || (n[t] = e[t]);
        }
        function o() {
            window.extensionApi || (a.isWE() ? a.isBg() ? c.bgPreload() : c.hacksForCompatibility() : a.isSafari() && a.isSafariSettingsPopup() && l.hacksForSettingsPopupCompatibility()), 
            i();
        }
        function i() {
            if (a.isChrome()) window.extensionApi = window.extensionApi || s.getApi(); else if (a.isFF()) window.extensionApi = window.extensionApi || c.getApi(); else {
                if (!a.isSafari()) throw new Error("unsupported browser api");
                window.extensionApi = window.extensionApi || l.getApi();
            }
            return window.extensionApi;
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var a = e("lib/util"), s = e("./chrome"), c = e("./web-extensions"), l = e("./safari");
        r(e("./interface")), n.initApi = o, n.getApi = i;
    }, {
        "./chrome": 161,
        "./interface": 163,
        "./safari": 170,
        "./web-extensions": 174,
        "lib/util": 288
    } ],
    163: [ function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.ports = {
            bridge: "bridge",
            background: "message:to-priv",
            broadcast: "message:to-non-priv"
        };
    }, {} ],
    164: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o() {
            var e = 4;
            if (!(chrome.extension && chrome.tabs && chrome.runtime && chrome.runtime.onConnect)) {
                var t = window.localStorage.getItem("bgInitFail") || "0", n = parseInt(t, 10);
                n > e ? console.error("too many bgInitFail", n) : (window.localStorage.setItem("bgInitFail", (n + 1).toString()), 
                document.location.reload());
            }
        }
        function i(e) {
            if (!e) return !1;
            var t = /^moz-extension:\/\/.*\/src\/popup.html$/, n = new RegExp(chrome.runtime.id + "/src/popup.html");
            return n.test(e) || t.test(e);
        }
        var a = e("babel-runtime/helpers/classCallCheck"), s = r(a), c = e("babel-runtime/helpers/createClass"), l = r(c);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var u = e("./helpers"), d = e("lib/util"), f = e("../interface");
        n.SETTINGS_TAB_ID = "popup", n.bgPreload = o;
        var p = function() {
            function e(t, r, o) {
                var a = this;
                (0, s["default"])(this, e), this._getActiveTab = r, this._getAllTabs = o, this.kind = "background-message-api", 
                this._callbacks = {}, this._tabPorts = {
                    popup: []
                }, this._messageHelper = new u.MessageHelperImpl(), this._sendMessageToPorts = function(e, t) {
                    var n = a._tabPorts[e];
                    n && n.forEach(function(e) {
                        return e.postMessage(t);
                    });
                }, this.toFocused = function(e, t) {
                    a._getActiveTab().then(function(n) {
                        var r = n.id, o = n.url;
                        if (r) return i(o) ? console.warn("toFocussed not allowed for popup when it open like regular tab", e, t) : void a._sendMessageToPorts(r.toString(), {
                            type: e,
                            content: t,
                            callid: d.guid()
                        });
                    });
                }, this.broadcast = function(e, t) {
                    if (t) {
                        var r = function(n) {
                            var r = n.id, o = n.url;
                            r && o && o.indexOf("chrome-extension:") === -1 && a._sendMessageToPorts(r.toString(), {
                                type: e,
                                callid: d.guid(),
                                content: t
                            });
                        };
                        a._getAllTabs().then(function(e) {
                            return e.forEach(r);
                        }), a._tabPorts.popup && a._tabPorts.popup.length && a._getActiveTab().then(function(e) {
                            var t = e.url, o = e.active;
                            r({
                                id: n.SETTINGS_TAB_ID,
                                url: t,
                                active: o
                            });
                        });
                    }
                }, this._initPortListener = function(e) {
                    if (e.name === f.ports.bridge) e.onMessage(function(e) {
                        "message.toFocussed" === e.method && a.toFocused(e.params && e.params.type, e.params && e.params.content);
                    }); else if (e.name === f.ports.broadcast) e.onMessage(function(e) {
                        return a.broadcast(e.type, e.content);
                    }); else if (e.name === f.ports.background) {
                        var t = e.sender;
                        if (t) {
                            if (t.tab) {
                                var r = t.tab, o = r.id, s = r.url;
                                if (o) {
                                    var c = a._tabPorts[o];
                                    void 0 === c && (c = a._tabPorts[o] = []), c.push(e);
                                }
                                s && 0 === s.indexOf("http") && a._messageHelper.fire("tab-connected", {
                                    tab: o,
                                    url: s
                                }), e.onDisconnect(function() {
                                    if (o) {
                                        var t = a._tabPorts[o];
                                        t && t.splice(t.indexOf(e), 1);
                                    }
                                });
                            }
                            if (t.url && i(t.url)) {
                                var l = n.SETTINGS_TAB_ID;
                                a._tabPorts[l] = a._tabPorts[l] || [], a._tabPorts[l].push(e), e.onDisconnect(function() {
                                    var t = a._tabPorts[l];
                                    t.splice(t.indexOf(e), 1);
                                });
                            }
                        }
                        e.onMessage(function(r) {
                            var o = function(n) {
                                var r = n.callid, o = n.content, i = n.type;
                                a._callbacks[r] && (a._callbacks[r](o), delete a._callbacks[r]);
                                var s = function(t) {
                                    return e.postMessage({
                                        content: t,
                                        callid: r
                                    });
                                };
                                a._messageHelper.fire(i, o, s, t && t.tab ? t.tab.id : -1);
                            };
                            "tab-connected" === r.type ? a._getActiveTab().then(function(e) {
                                var t = e.url;
                                r.content = {
                                    tab: n.SETTINGS_TAB_ID,
                                    url: t
                                }, o(r);
                            }) : o(r);
                        });
                    }
                }, t(this._initPortListener);
            }
            return (0, l["default"])(e, [ {
                key: "sendTo",
                value: function(e, t, n, r, o) {
                    var i = this._tabPorts[e];
                    if (!i || !i.length) return void (o && o({
                        message: "no ports on specified tabId"
                    }));
                    var a = {
                        type: t,
                        content: n
                    };
                    r && "function" == typeof r && (a.callid = d.guid(), this._callbacks[a.callid] = r), 
                    i.forEach(function(e) {
                        return e.postMessage(a);
                    });
                }
            }, {
                key: "listen",
                value: function(e, t) {
                    this._messageHelper.listen(e, t);
                }
            } ]), e;
        }();
        n.GenericBackgroundMessageApiImpl = p;
    }, {
        "../interface": 163,
        "./helpers": 166,
        "babel-runtime/helpers/classCallCheck": 31,
        "babel-runtime/helpers/createClass": 32,
        "lib/util": 288
    } ],
    165: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o() {
            window.addEventListener("update-window-size-gr", function(e) {
                function t() {
                    document.body.appendChild(n), setTimeout(function() {
                        n.parentNode && n.parentNode.removeChild(n);
                    }, 10);
                }
                var n = document.createElement("div");
                if (n.style.height = "1px", e.detail && e.detail.force) {
                    var r = setInterval(t, 100);
                    setTimeout(function() {
                        return clearInterval(r);
                    }, 405);
                }
            }, !1), window.addEventListener("close-popup-gr", function() {
                window.navigator.userAgent.indexOf("Firefox") !== -1 && window.close();
            }, !1);
        }
        var i = e("babel-runtime/helpers/classCallCheck"), a = r(i), s = e("babel-runtime/helpers/createClass"), c = r(s);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var l = e("./helpers"), u = e("lib/util"), d = e("../interface"), f = function() {
            function e(t) {
                var n = this;
                (0, a["default"])(this, e), this.kind = "content-script-message-api", this._callbacks = {}, 
                this._messageHelper = new l.MessageHelperImpl(), this._proxyPortsStorage = {}, this.broadcastBackground = function() {
                    for (var e = arguments.length, t = Array(e), r = 0; r < e; r++) t[r] = arguments[r];
                    return n._emit(n.backgroundPort, "bg").apply(null, t);
                }, this.broadcast = function() {
                    for (var e = arguments.length, t = Array(e), r = 0; r < e; r++) t[r] = arguments[r];
                    return n._emit(n.broadcastPort, "tabs").apply(null, t);
                }, this._onPortMessage = function(e) {
                    console.log("[Messaging] extension api", "portMessage", e);
                }, this._checkHealth = function() {
                    function e() {
                        document.removeEventListener("grammarly:pong", s), i && (clearTimeout(i), i = null), 
                        o && (clearInterval(o), o = null);
                    }
                    var t = 500, r = 5e3, o = null, i = null, a = function() {
                        return document.dispatchEvent(new CustomEvent("grammarly:ping"));
                    }, s = function() {
                        e();
                    }, c = function() {
                        [ n.port, n.backgroundPort, n.broadcastPort ].forEach(function(e) {
                            e && e.removeMessageListeners && e.removeMessageListeners();
                        }), n.port = n.backgroundPort = n.broadcastPort = null, e(), document.addEventListener("grammarly:proxyports", n._onGrammarlyResetAfterTimeout), 
                        document.dispatchEvent(new CustomEvent("grammarly:offline"));
                    };
                    return function() {
                        e(), document.addEventListener("grammarly:pong", s), o = window.setInterval(a, t), 
                        i = window.setTimeout(c, r);
                    };
                }(), this._onGrammarlyResetAfterTimeout = function() {
                    document.removeEventListener("grammarly:proxyports", n._onGrammarlyResetAfterTimeout), 
                    n.port = n._initProxyPort(d.ports.bridge, n._onPortMessage, n._checkHealth, !0), 
                    n.backgroundPort = n._initProxyPort(d.ports.background, n._onBgPortMessage, n._checkHealth), 
                    n.broadcastPort = n._initProxyPort(d.ports.broadcast, null, n._checkHealth);
                }, this._onBgPortMessage = function(e) {
                    var t = e.callid, r = e.content, o = e.type;
                    n._callbacks[t] ? (n._callbacks[t](r), delete n._callbacks[t]) : n._messageHelper.fire(o, r, function(e) {
                        if (!n.backgroundPort) throw new Error("fail reply to bg page - connection lost");
                        n.backgroundPort.postMessage({
                            content: e,
                            callid: t
                        });
                    });
                }, this._initProxyPort = function(e, t, r) {
                    var o = arguments.length > 3 && void 0 !== arguments[3] && arguments[3], i = n._proxyPort(e);
                    return o && n._checkHealth(), t && i.onMessage(t), r && i.onDisconnect(r), i;
                }, this._emit = function(e, t) {
                    return function(r, o, i, a) {
                        var s = u.guid();
                        i && "function" == typeof i && (n._callbacks[s] = i);
                        try {
                            if (!e) throw new Error("lost connection to " + t + " port");
                            e.postMessage({
                                type: r,
                                callid: s,
                                content: o
                            });
                        } catch (c) {
                            if (!a) throw c;
                            a(c);
                        }
                    };
                }, this._proxyPort = function(e) {
                    n._proxyPortsStorage[e] = {};
                    var t = function(t, r) {
                        var o = r.detail;
                        if (o.name === e) {
                            var i = n._proxyPortsStorage[e][t];
                            i && i(o.msg);
                        }
                    }, r = function(e) {
                        return t("success", e);
                    }, o = function(e) {
                        return t("error", e);
                    };
                    return document.addEventListener("grammarly:message", r), document.addEventListener("grammarly:error", o), 
                    {
                        postMessage: function() {
                            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, n = {
                                data: t,
                                name: e
                            };
                            return document.dispatchEvent(new CustomEvent("grammarly:action", {
                                detail: n
                            }));
                        },
                        onMessage: function(t) {
                            n._proxyPortsStorage[e].success = t;
                        },
                        onDisconnect: function(t) {
                            n._proxyPortsStorage[e].error = t;
                        },
                        removeMessageListeners: function() {
                            document.removeEventListener("grammarly:message", r), document.removeEventListener("grammarly:error", o);
                        }
                    };
                }, this.port = t(d.ports.bridge), this.port.onMessage(this._onPortMessage), this.port.onDisconnect(function() {
                    n.port = null, n.port = n._initProxyPort(d.ports.bridge, n._onPortMessage, n._checkHealth, !0);
                }), this.backgroundPort = t(d.ports.background), this.backgroundPort.onMessage(this._onBgPortMessage), 
                this.backgroundPort.onDisconnect(function() {
                    n.backgroundPort = null, n.backgroundPort = n._initProxyPort(d.ports.background, n._onBgPortMessage, n._checkHealth);
                }), this.broadcastPort = t(d.ports.broadcast), this.broadcastPort.onDisconnect(function() {
                    n.broadcastPort = null, n.broadcastPort = n._initProxyPort(d.ports.broadcast, null, n._checkHealth);
                });
            }
            return (0, c["default"])(e, [ {
                key: "listen",
                value: function(e, t) {
                    this._messageHelper.listen(e, t);
                }
            }, {
                key: "toFocused",
                value: function(e, t) {
                    if (!this.port) throw new Error("lost connection to bg page");
                    this.port.postMessage({
                        method: "message.toFocussed",
                        params: {
                            type: e,
                            content: t
                        }
                    });
                }
            } ]), e;
        }();
        n.GenericContentScriptMessageApiImpl = f, n.hacksForCompatibility = o;
    }, {
        "../interface": 163,
        "./helpers": 166,
        "babel-runtime/helpers/classCallCheck": 31,
        "babel-runtime/helpers/createClass": 32,
        "lib/util": 288
    } ],
    166: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o() {
            return safari.application.activeBrowserWindow && safari.application.activeBrowserWindow.activeTab;
        }
        function i() {
            var e = o();
            return e && e.url || "http://newtab";
        }
        function a() {
            function e(e, t, o) {
                var i = n[e];
                i ? i.forEach(function(e) {
                    return e(t, o);
                }) : (r[e] || (r[e] = []), r[e].push({
                    data: t,
                    callback: o
                }));
            }
            function t(e, t) {
                n[e] || (n[e] = []), n[e].push(t), r[e] && r[e].forEach(function(e) {
                    return t(e.data, e.callback);
                });
            }
            var n = {}, r = {};
            return {
                emit: e,
                on: t
            };
        }
        var s = e("babel-runtime/core-js/get-iterator"), c = r(s), l = e("babel-runtime/helpers/classCallCheck"), u = r(l);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var d = e("lib/config"), f = function() {}, p = function m() {
            var e = this;
            (0, u["default"])(this, m), this._listeners = {}, this._queue = {}, this.fire = function(t, n) {
                var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : f, o = arguments[3], i = e._listeners[t] || [];
                i.length ? i.forEach(function(e) {
                    return e(n, r, o);
                }) : (e._queue[t] = e._queue[t] || [], e._queue[t].push({
                    content: n,
                    callback: r,
                    sender: o
                }));
            }, this.unlisten = function(t, n) {
                var r = e._listeners[t] || [], o = r.indexOf(n);
                o !== -1 && (1 === r.length ? delete e._listeners[t] : r.splice(o, 1));
            }, this.listenOnce = function(t, n) {
                var r = function o(r, i, a) {
                    e.unlisten(t, o), n && n(r, i, a);
                };
                e.listen(t, r);
            }, this.listen = function(t, n) {
                e._listeners[t] = e._listeners[t] || [], e._listeners[t].indexOf(n) === -1 && e._listeners[t].push(n);
                var r = e._queue[t] || [];
                if (r.length) {
                    var o = !0, i = !1, a = void 0;
                    try {
                        for (var s, l = (0, c["default"])(r); !(o = (s = l.next()).done); o = !0) {
                            var u = s.value;
                            try {
                                n(u.content, u.callback, u.sender);
                            } catch (d) {
                                console.error("exception during proccesing buffered messages", d);
                            }
                        }
                    } catch (f) {
                        i = !0, a = f;
                    } finally {
                        try {
                            !o && l["return"] && l["return"]();
                        } finally {
                            if (i) throw a;
                        }
                    }
                    delete e._queue[t];
                }
            };
        };
        n.MessageHelperImpl = p, n.safariBridgeId = "forge-bridge" + d.getUuid(), n.getSafariActiveTab = o, 
        n.getSafariActiveTabUrl = i, n.emitter = a;
    }, {
        "babel-runtime/core-js/get-iterator": 16,
        "babel-runtime/helpers/classCallCheck": 31,
        "lib/config": 203
    } ],
    167: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        var o = e("babel-runtime/helpers/classCallCheck"), i = r(o), a = e("babel-runtime/helpers/createClass"), s = r(a);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var c = e("./helpers"), l = e("lib/util"), u = function() {
            function e() {
                var t = this;
                (0, i["default"])(this, e), this.kind = "background-message-api", this._messageHelper = new c.MessageHelperImpl(), 
                this._bridgeId = c.safariBridgeId, this.listen = function(e, n) {
                    "tab-connected" === e ? window.__bgEmitter.on(e, function(e, t) {
                        n({
                            tab: "popup",
                            url: c.getSafariActiveTabUrl()
                        }, t);
                    }) : window.__bgEmitter.on(e, n), t._messageHelper.listen("broadcast-background", function(r, o, i) {
                        if (null === e || e === r.type) {
                            var a = r.content;
                            "tab-connected" === r.type && (a = {
                                tab: i,
                                url: i.url
                            }), n(a, function(e) {
                                r.id && t._sendToTab(i, r.id, e);
                            }, i);
                        }
                    });
                }, this.broadcast = function(e, n) {
                    t._sendToTabs("broadcast", {
                        type: e,
                        content: n,
                        id: l.guid()
                    });
                }, this.toFocused = function(e, n) {
                    t._sendToTab(c.getSafariActiveTab(), "broadcast", {
                        type: e,
                        content: n,
                        callid: l.guid()
                    });
                }, this._sendToTab = function(e, n, r) {
                    if ("popup" === e) return t._emitToPopup(r.type, r.content);
                    if ("string" != typeof e) {
                        if (!e || !e.page) throw Error("Cannot sentTo to malformed tab " + e);
                        e.page.dispatchMessage(t._bridgeId, {
                            method: "message",
                            event: n,
                            data: r
                        });
                    }
                }, console.info("Initialize API for BG"), safari.application.addEventListener("message", function(e) {
                    return t._onMessage(e);
                }, !1), window.__bgEmitter = window.__bgEmitter || c.emitter();
            }
            return (0, s["default"])(e, [ {
                key: "_onMessage",
                value: function(e) {
                    if (e.name === this._bridgeId) {
                        var t = e.message, n = e.target;
                        if ("message" === t.method) {
                            var r = t.params, o = r.event, i = r.data;
                            if ("broadcast" === o) return this._sendToTabs("broadcast", i);
                            if ("toFocussed" === o) return this._sendToTab(c.getSafariActiveTab(), "broadcast", i);
                            this._messageHelper.fire(o, i, void 0, n);
                        }
                    }
                }
            }, {
                key: "sendTo",
                value: function(e, t, n, r) {
                    var o = l.guid();
                    this._messageHelper.listenOnce(o, r), this._sendToTab(e, "broadcast", {
                        type: t,
                        content: n,
                        id: o
                    });
                }
            }, {
                key: "_emitToPopup",
                value: function(e, t, n) {
                    try {
                        safari.extension.popovers[0].contentWindow.__popupEmitter.emit(e, t, n);
                    } catch (r) {
                        console.info("emit popup error", r);
                    }
                }
            }, {
                key: "_sendToTabs",
                value: function(e, t) {
                    var n = this;
                    safari.application.browserWindows.forEach(function(r) {
                        r.tabs.forEach(function(r) {
                            return n._sendToTab(r, e, t);
                        });
                    }), this._emitToPopup(t.type, t.content);
                }
            } ]), e;
        }();
        n.SafariBackgroundMessageImpl = u;
    }, {
        "./helpers": 166,
        "babel-runtime/helpers/classCallCheck": 31,
        "babel-runtime/helpers/createClass": 32,
        "lib/util": 288
    } ],
    168: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        var o = e("babel-runtime/helpers/classCallCheck"), i = r(o), a = e("babel-runtime/helpers/createClass"), s = r(a);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var c = e("./helpers"), l = e("lib/util"), u = function() {
            function e() {
                var t = this;
                (0, i["default"])(this, e), this.kind = "content-script-message-api", this._bridgeId = c.safariBridgeId, 
                this._messageHelper = new c.MessageHelperImpl(), this._tabInit = function() {
                    document.removeEventListener("visibilitychange", t._tabInit), t.broadcastBackground("tab-connected");
                }, this.broadcastBackground = function(e, n, r) {
                    return t._sendToBackground("broadcast-background", e, n, r);
                }, this.broadcast = function(e, n) {
                    return t._sendToBackground("broadcast", e, n);
                }, this.toFocused = function(e, n) {
                    t._sendToBackground("toFocussed", e, n);
                }, this._dispatchMessage = function(e, n) {
                    safari.self.tab && safari.self.tab.dispatchMessage(t._bridgeId, {
                        callid: l.guid(),
                        method: "message",
                        params: {
                            event: e,
                            data: n
                        }
                    });
                }, this._sendToBackground = function(e, n, r, o) {
                    var i = l.guid();
                    if (o) {
                        var a = function s(n) {
                            o && o(n), t._messageHelper.unlisten(e, s);
                        };
                        t._messageHelper.listen(i, a);
                    }
                    t._dispatchMessage(e, {
                        type: n,
                        content: r,
                        id: i
                    });
                }, this._onMessage = function(e) {
                    if (e.name === t._bridgeId) {
                        var n = e.message;
                        "message" === n.method && t._messageHelper.fire(n.event, n.data);
                    }
                }, window.top === window && (window.safari && window.safari.self && window.safari.self.addEventListener("message", this._onMessage, !1), 
                document.hidden ? document.addEventListener("visibilitychange", this._tabInit) : "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", this._tabInit, !1) : this._tabInit());
            }
            return (0, s["default"])(e, [ {
                key: "listen",
                value: function(e, t) {
                    var n = this;
                    this._messageHelper.listen("broadcast", function(r) {
                        null !== e && e !== r.type || t(r.content, function(e) {
                            r.id && n._dispatchMessage(r.id, e);
                        });
                    });
                }
            } ]), e;
        }();
        n.SafariContentScriptMessageImpl = u;
    }, {
        "./helpers": 166,
        "babel-runtime/helpers/classCallCheck": 31,
        "babel-runtime/helpers/createClass": 32,
        "lib/util": 288
    } ],
    169: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        var o = e("babel-runtime/helpers/classCallCheck"), i = r(o), a = e("babel-runtime/helpers/createClass"), s = r(a);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var c = e("./helpers"), l = e("lib/util"), u = function() {
            function e() {
                var t = this;
                (0, i["default"])(this, e), this.kind = "content-script-message-api", this._bridgeId = c.safariBridgeId, 
                this._bgEmitter = window.safari.extension.globalPage.contentWindow.__bgEmitter, 
                this._popupEmitter = window.__popupEmitter = window.__popupEmitter || c.emitter(), 
                this.listen = function(e, n) {
                    t._popupEmitter.on(e, n);
                }, this.broadcastBackground = function(e, n, r) {
                    t._bgEmitter && t._bgEmitter.emit(e, n, r);
                }, this.broadcast = function(e, n) {
                    t._sendToTabs("broadcast", {
                        type: e,
                        content: n,
                        id: l.guid()
                    });
                }, this.toFocused = function(e, n) {
                    t._sendToTab(c.getSafariActiveTab(), "broadcast", {
                        type: e,
                        content: n,
                        callid: l.guid()
                    });
                }, this._sendToTab = function(e, n, r) {
                    if ("popup" === e) return t._emitToPopup(r.type, r.content);
                    if (!e || !e.page) throw Error("Cannot sentTo to malformed tab " + e);
                    e.page.dispatchMessage(t._bridgeId, {
                        method: "message",
                        event: n,
                        data: r
                    });
                }, console.info("Initialize API for Popup");
            }
            return (0, s["default"])(e, [ {
                key: "_emitToPopup",
                value: function(e, t, n) {
                    try {
                        safari.extension.popovers[0].contentWindow.__popupEmitter.emit(e, t, n);
                    } catch (r) {
                        console.info("emit popup error", r);
                    }
                }
            }, {
                key: "_sendToTabs",
                value: function(e, t) {
                    var n = this;
                    safari.application.browserWindows.forEach(function(r) {
                        r.tabs.forEach(function(r) {
                            return n._sendToTab(r, e, t);
                        });
                    }), this._emitToPopup(t.type, t.content);
                }
            } ]), e;
        }();
        n.SafariPopupMessageImpl = u;
    }, {
        "./helpers": 166,
        "babel-runtime/helpers/classCallCheck": 31,
        "babel-runtime/helpers/createClass": 32,
        "lib/util": 288
    } ],
    170: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o() {
            return new m();
        }
        var i = e("babel-runtime/core-js/promise"), a = r(i), s = e("babel-runtime/helpers/classCallCheck"), c = r(s);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var l = e("./message/safari-content"), u = e("./message/safari-bg"), d = e("./message/safari-popup"), f = e("./tabs/safari"), p = e("lib/util");
        n.getApi = o, n.hacksForSettingsPopupCompatibility = function() {
            safari.application.addEventListener("popover", function(e) {
                var t = safari.extension.popovers[0];
                t && (safari.self.height = safari.self.width = 0, document.dispatchEvent(new CustomEvent("popup-open")));
            }, !0), window.addEventListener("update-window-size-gr", function(e) {
                var t = document.body;
                safari.self.height = t.clientHeight, safari.self.width = t.clientWidth - 1;
            }, !1), window.addEventListener("close-popup-gr", function(e) {
                return safari.self.hide();
            }, !1);
        };
        var m = function h() {
            (0, c["default"])(this, h), this.tabs = new f.SafariTabsImpl(), this.notification = {
                kind: "fallback",
                create: function(e) {
                    return new a["default"](function(t, n) {
                        var r = e.title, o = e.message, i = e.onClicked, a = function() {
                            var e = new Notification(r, {
                                body: o
                            });
                            void 0 !== i && (e.onclick = function() {
                                return i();
                            }), t();
                        };
                        Notification && "granted" !== Notification.permission ? Notification.requestPermission(function(e) {
                            "granted" !== e ? n(new Error("Notification permission denied")) : a();
                        }) : a();
                    });
                }
            }, this.cookies = {
                kind: "fallback",
                get: function() {
                    return a["default"].resolve(null);
                },
                getAll: function() {
                    return a["default"].resolve([]);
                },
                set: function() {
                    return a["default"].resolve(null);
                },
                watch: function() {}
            }, this.preferences = {
                get: function(e) {
                    return decodeURIComponent(safari.extension.settings[e]);
                },
                set: function(e, t) {
                    safari.extension.settings[e] = encodeURIComponent(t);
                },
                getAll: function() {
                    return safari.extension.settings;
                },
                remove: function(e) {
                    delete safari.extension.settings[e];
                },
                removeAll: function() {
                    safari.extension.settings.clear();
                }
            }, this.button = {
                kind: "fallback",
                setBadge: function(e) {
                    var t = safari.extension.toolbarItems;
                    t.forEach(function(t) {
                        return t.badge = e;
                    });
                },
                setIconByName: function(e) {
                    var t = void 0, n = safari.extension.toolbarItems, r = n[0].image.split("."), o = r.pop(), i = e ? "-" + e : "";
                    if (t !== i) {
                        var a = r.join(".");
                        t && (a = a.split(t)[0]), i && (a = a.split(i)[0]), t = i, n.forEach(function(e) {
                            return e.image = "" + r + i + "." + o;
                        });
                    }
                }
            }, this.message = p.isBg() ? new u.SafariBackgroundMessageImpl() : p.isSafariSettingsPopup() ? new d.SafariPopupMessageImpl() : new l.SafariContentScriptMessageImpl();
        };
    }, {
        "./message/safari-bg": 167,
        "./message/safari-content": 168,
        "./message/safari-popup": 169,
        "./tabs/safari": 172,
        "babel-runtime/core-js/promise": 28,
        "babel-runtime/helpers/classCallCheck": 31,
        "lib/util": 288
    } ],
    171: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o(e, t) {
            chrome.runtime.lastError ? t(chrome.runtime.lastError) : e();
        }
        var i = e("babel-runtime/core-js/promise"), a = r(i), s = e("babel-runtime/helpers/classCallCheck"), c = r(s), l = e("babel-runtime/helpers/createClass"), u = r(l);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var d = function() {
            function e() {
                (0, c["default"])(this, e), this.kind = "web-extension";
            }
            return (0, u["default"])(e, [ {
                key: "open",
                value: function(e, t) {
                    return new a["default"](function(n, r) {
                        chrome.tabs.create({
                            url: e,
                            active: t
                        }, function(e) {
                            o(function() {
                                return n(e);
                            }, r);
                        });
                    });
                }
            }, {
                key: "updateCurrent",
                value: function(e) {
                    return new a["default"](function(t, n) {
                        chrome.tabs.update({
                            url: e
                        }, function(e) {
                            o(function() {
                                return t(e);
                            }, n);
                        });
                    });
                }
            }, {
                key: "getActiveTab",
                value: function() {
                    return new a["default"](function(e, t) {
                        var n = chrome.tabs;
                        n.query({
                            active: !0,
                            lastFocusedWindow: !0
                        }, function(r) {
                            o(function() {
                                return r && r.length ? e(r[0]) : n.query({
                                    active: !0
                                }, function(n) {
                                    o(function() {
                                        return e(n[0]);
                                    }, t);
                                });
                            }, t);
                        });
                    });
                }
            }, {
                key: "getAllTabs",
                value: function() {
                    return new a["default"](function(e, t) {
                        return chrome.tabs.query({}, function(n) {
                            return o(function() {
                                return e(n);
                            }, t);
                        });
                    });
                }
            }, {
                key: "getActiveTabUrl",
                value: function() {
                    var e = this;
                    return new a["default"](function(t, n) {
                        return e.getActiveTab().then(function(e) {
                            return o(function() {
                                return t(e.url);
                            }, n);
                        });
                    });
                }
            }, {
                key: "onActiveTabChange",
                value: function(e, t) {
                    var n = this, r = function(n) {
                        o(function() {
                            n && e(n);
                        }, t);
                    };
                    chrome.tabs.onActivated.addListener(function(e) {
                        return chrome.tabs.get(e.tabId, function(e) {
                            return r(e);
                        });
                    }), chrome.tabs.onUpdated.addListener(function(e, t) {
                        n.getActiveTab().then(function(n) {
                            n.id === e && (t.url || t.favIconUrl || "complete" === t.status) && chrome.tabs.get(e, function(e) {
                                return r(e);
                            });
                        });
                    }), chrome.windows.onFocusChanged.addListener(function(e) {
                        return chrome.tabs.query({
                            active: !0,
                            windowId: e,
                            lastFocusedWindow: !0
                        }, function(e) {
                            return r(e[0]);
                        });
                    }), this.getActiveTab().then(function(e) {
                        return r(e);
                    });
                }
            }, {
                key: "reload",
                value: function(e) {
                    return new a["default"](function(t, n) {
                        var r = function() {
                            return o(function() {
                                return t();
                            }, n);
                        };
                        e ? chrome.tabs.reload(e, {}, r) : chrome.tabs.reload(r);
                    });
                }
            } ]), e;
        }();
        n.ChromeTabsApiImpl = d;
    }, {
        "babel-runtime/core-js/promise": 28,
        "babel-runtime/helpers/classCallCheck": 31,
        "babel-runtime/helpers/createClass": 32
    } ],
    172: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o(e, t) {
            var n = p.getRandomIntInclusive(1, 1e5);
            return {
                active: t || !1,
                url: e.url,
                title: e.title,
                id: n
            };
        }
        function i() {
            return safari.application.activeBrowserWindow && safari.application.activeBrowserWindow.activeTab;
        }
        function a(e, t) {
            var n = function r(n) {
                e.removeEventListener("navigate", r), t(n);
            };
            e.addEventListener("navigate", n, !1);
        }
        var s = e("babel-runtime/core-js/promise"), c = r(s), l = e("babel-runtime/helpers/classCallCheck"), u = r(l), d = e("babel-runtime/helpers/createClass"), f = r(d);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var p = e("lib/util"), m = function() {
            function e() {
                (0, u["default"])(this, e), this.kind = "safari";
            }
            return (0, f["default"])(e, [ {
                key: "open",
                value: function(e, t) {
                    return new c["default"](function(n, r) {
                        var s = i();
                        if (s) {
                            var c = safari.application.activeBrowserWindow.openTab();
                            t ? (a(c, function(e) {
                                return n(o(c, !0));
                            }), c.url = e, s.activate()) : (c.url = e, n(o(c, !1)));
                        } else r("Active tab does not exist");
                    });
                }
            }, {
                key: "getActiveTab",
                value: function() {
                    var e = i();
                    return e ? c["default"].resolve(o(e, !0)) : c["default"].reject("Active tab does not exist");
                }
            }, {
                key: "updateCurrent",
                value: function(e) {
                    return new c["default"](function(t, n) {
                        var r = i();
                        return r ? (a(r, function(e) {
                            return t(o(r, !0));
                        }), void (r.url = e)) : n("Active tab does not exist");
                    });
                }
            }, {
                key: "getAllTabs",
                value: function() {
                    return new c["default"](function(e, t) {
                        var n = safari.application.browserWindows, r = n.reduce(function(e, t) {
                            return e.concat(t.tabs);
                        }, []).map(function(e) {
                            return o(e);
                        });
                        e(r);
                    });
                }
            }, {
                key: "getActiveTabUrl",
                value: function() {
                    return new c["default"](function(e, t) {
                        var n = i();
                        return n ? void e(n && n.url || "http://newtab") : t("Active tab does not exist");
                    });
                }
            }, {
                key: "onActiveTabChange",
                value: function(e) {
                    var t = i(), n = function() {
                        t = i(), e(o(t, !0));
                    };
                    setInterval(function() {
                        var e = i();
                        e && t !== e && n();
                    }, 1e3), safari.application.addEventListener("activate", n, !0), safari.application.addEventListener("navigate", n, !0), 
                    n();
                }
            } ]), e;
        }();
        n.SafariTabsImpl = m;
    }, {
        "babel-runtime/core-js/promise": 28,
        "babel-runtime/helpers/classCallCheck": 31,
        "babel-runtime/helpers/createClass": 32,
        "lib/util": 288
    } ],
    173: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        var o = e("babel-runtime/core-js/promise"), i = r(o), a = e("babel-runtime/helpers/classCallCheck"), s = r(a), c = e("babel-runtime/helpers/createClass"), l = r(c);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var u = function() {
            function e() {
                (0, s["default"])(this, e), this.kind = "web-extension", this.getActiveTab = function() {
                    return new i["default"](function(e, t) {
                        return browser.tabs.query({
                            active: !0,
                            lastFocusedWindow: !0
                        }).then(function(n) {
                            n && n.length ? e(n[0]) : browser.tabs.query({
                                active: !0
                            }).then(function(t) {
                                return e(t[0]);
                            }, t);
                        }, t);
                    });
                };
            }
            return (0, l["default"])(e, [ {
                key: "open",
                value: function(e, t) {
                    return browser.tabs.create({
                        url: e,
                        active: t
                    });
                }
            }, {
                key: "updateCurrent",
                value: function(e) {
                    return browser.tabs.update({
                        url: e
                    });
                }
            }, {
                key: "getAllTabs",
                value: function() {
                    return browser.tabs.query({});
                }
            }, {
                key: "getActiveTabUrl",
                value: function() {
                    return new i["default"](function(e, t) {
                        browser.tabs.query({
                            active: !0
                        }).then(function(t) {
                            e(t[0].url);
                        }, t);
                    });
                }
            }, {
                key: "onActiveTabChange",
                value: function(e, t) {
                    var n = this;
                    browser.tabs.onActivated.addListener(function(n) {
                        return browser.tabs.get(n.tabId).then(function(t) {
                            return e(t);
                        }, t);
                    }), browser.tabs.onUpdated.addListener(function(r, o) {
                        n.getActiveTab().then(function(n) {
                            n.id === r && (o.url || o.favIconUrl || "complete" === o.status) && browser.tabs.get(r).then(e, t);
                        });
                    }), browser.windows.onFocusChanged.addListener(function(n) {
                        return browser.tabs.query({
                            active: !0,
                            windowId: n,
                            lastFocusedWindow: !0
                        }).then(function(t) {
                            return e(t[0]);
                        }, t);
                    }), this.getActiveTab().then(e, t);
                }
            }, {
                key: "reload",
                value: function(e) {
                    return e ? browser.tabs.reload(e, {}) : browser.tabs.reload();
                }
            } ]), e;
        }();
        n.WebExtensionTabsApiImpl = u;
    }, {
        "babel-runtime/core-js/promise": 28,
        "babel-runtime/helpers/classCallCheck": 31,
        "babel-runtime/helpers/createClass": 32
    } ],
    174: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o() {
            return new k();
        }
        var i = e("babel-runtime/core-js/object/assign"), a = r(i), s = e("babel-runtime/helpers/classCallCheck"), c = r(s), l = e("babel-runtime/helpers/createClass"), u = r(l), d = e("babel-runtime/core-js/object/get-own-property-symbols"), f = r(d), p = function(e, t) {
            var n = {};
            for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
            if (null != e && "function" == typeof f["default"]) for (var o = 0, r = (0, f["default"])(e); o < r.length; o++) t.indexOf(r[o]) < 0 && (n[r[o]] = e[r[o]]);
            return n;
        };
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var m = e("./message/bg"), h = e("./message/content"), g = e("./tabs/web-extensions"), b = e("lib/util"), v = e("./message/content");
        n.hacksForCompatibility = v.hacksForCompatibility;
        var _ = e("./message/bg");
        n.bgPreload = _.bgPreload, n.getApi = o, n.preferencesApi = {
            get: function(e) {
                return window.localStorage.getItem(e);
            },
            set: function(e, t) {
                window.localStorage.setItem(e, t);
            },
            getAll: function() {
                var e = {};
                for (var t in window.localStorage) e[t] = window.localStorage.getItem(t);
                return e;
            },
            remove: function(e) {
                window.localStorage.removeItem(e);
            },
            removeAll: function() {
                window.localStorage.clear();
            }
        };
        var y = function() {
            function e(t) {
                (0, c["default"])(this, e);
                try {
                    this.port = browser.runtime.connect({
                        name: t
                    });
                } catch (n) {
                    this.onMessage = function() {}, this.onDisconnect = function() {}, this.postMessage = function() {};
                }
            }
            return (0, u["default"])(e, [ {
                key: "onMessage",
                value: function(e) {
                    this.port.onMessage.addListener(e);
                }
            }, {
                key: "onDisconnect",
                value: function(e) {
                    this.port.onDisconnect.addListener(e);
                }
            }, {
                key: "postMessage",
                value: function(e) {
                    this.port.postMessage(e);
                }
            } ]), e;
        }(), w = function() {
            function e(t) {
                (0, c["default"])(this, e), this._port = t, this.sender = {};
                var n = t.sender, r = t.name;
                this.name = r, n && (this.sender.url = n.url, n.tab && n.tab.url && n.tab.id && (this.sender.tab = {
                    url: n.tab.url,
                    id: n.tab.id,
                    active: n.tab.active
                }));
            }
            return (0, u["default"])(e, [ {
                key: "onMessage",
                value: function(e) {
                    this._port.onMessage.addListener(e);
                }
            }, {
                key: "onDisconnect",
                value: function(e) {
                    this._port.onDisconnect.addListener(e);
                }
            }, {
                key: "postMessage",
                value: function(e) {
                    this._port.postMessage(e);
                }
            } ]), e;
        }(), k = function E() {
            (0, c["default"])(this, E), this.tabs = new g.WebExtensionTabsApiImpl(), this.notification = {
                kind: "web-extension",
                create: function(e) {
                    var t = e.onClicked, n = e.onButtonClicked, r = p(e, [ "onClicked", "onButtonClicked" ]), o = browser.notifications, i = b.guid(), s = o.create(i, (0, 
                    a["default"])({
                        type: "basic"
                    }, r));
                    return void 0 !== t && o.onClicked.addListener(t), void 0 !== n && o.onButtonClicked.addListener(n), 
                    s;
                },
                clear: function(e) {
                    return browser.notifications.clear(e);
                }
            }, this.cookies = {
                kind: "web-extension",
                get: function(e) {
                    return browser.cookies.get(e);
                },
                getAll: function(e) {
                    return browser.cookies.getAll(e);
                },
                set: function(e) {
                    return browser.cookies.set(e);
                },
                watch: function(e, t) {
                    browser.cookies.onChanged.addListener(function(n) {
                        var r = n.cookie, o = n.cause;
                        !r || !r.name || e.path && e.path !== r.path || e.name !== r.name || e.domain && r.domain.indexOf(e.domain) === -1 || ("explicit" === o && t(r), 
                        "expired_overwrite" === o && t());
                    });
                }
            }, this.preferences = n.preferencesApi, this.button = {
                kind: "web-extension",
                setBadge: function(e) {
                    browser.browserAction.setBadgeText({
                        text: e
                    });
                },
                setIconByName: function(e) {
                    var t = "./src/icon/icon", n = e ? "-" + e : "";
                    browser.browserAction.setIcon({
                        path: {
                            "19": t + "19" + n + ".png",
                            "38": t + "38" + n + ".png"
                        }
                    });
                },
                setBadgeBackgroundColor: function(e) {
                    browser.browserAction.setBadgeBackgroundColor({
                        color: e
                    });
                }
            }, this.message = b.isBg() ? new m.GenericBackgroundMessageApiImpl(function(e) {
                return browser.runtime.onConnect.addListener(function(t) {
                    return e(new w(t));
                });
            }, this.tabs.getActiveTab, this.tabs.getAllTabs) : new h.GenericContentScriptMessageApiImpl(function(e) {
                return new y(e);
            });
        };
    }, {
        "./message/bg": 164,
        "./message/content": 165,
        "./tabs/web-extensions": 173,
        "babel-runtime/core-js/object/assign": 20,
        "babel-runtime/core-js/object/get-own-property-symbols": 23,
        "babel-runtime/helpers/classCallCheck": 31,
        "babel-runtime/helpers/createClass": 32,
        "lib/util": 288
    } ],
    175: [ function(e, t, n) {
        (function(t) {
            "use strict";
            function r() {
                return "about:" === document.location.protocol ? s.failover.success("index_load") : (document.body.dataset.grCSLoaded = !0, 
                s.failover.startAppLoadTimer(), void e("./lib/app"));
            }
            if (Object.defineProperty(n, "__esModule", {
                value: !0
            }), t.env.CI) {
                var o = e("./lib/console"), i = o.setSeleniumCompatibility;
                i();
            }
            var a = e("./extension-api");
            a.initApi();
            var s = e("./lib/failover"), c = e("./lib/client-script");
            c.injectClientScriptIfNeeded(), s.failover.startPageLoadTimer(), "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", r, !1) : r();
        }).call(this, e("_process"));
    }, {
        "./extension-api": 162,
        "./lib/app": 176,
        "./lib/client-script": 197,
        "./lib/console": 204,
        "./lib/failover": 238,
        _process: 160
    } ],
    176: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o() {
            var e = {
                connection: {
                    networkOffline: !window.navigator.onLine,
                    online: !1,
                    bgNotConnected: !0,
                    cookiesDisabled: navigator.cookieEnabled === !1
                },
                user: {
                    anonymous: !0,
                    premium: !1,
                    settings: {}
                },
                page: {
                    enabled: !0,
                    enabledDefs: !1,
                    domain: L
                }
            };
            i(e);
        }
        function i(e) {
            if (e.page.domain !== L) return void k.logger.differentStateDomain(e.page.domain);
            var t = navigator.cookieEnabled === !1;
            e.connection.cookiesDisabled !== t && R.updateConnection({
                cookiesDisabled: t
            });
            var n = x.timers.stop(T);
            n && !e.connection.bgNotConnected && k.logger.restoredBgConnection(n), M && (clearTimeout(M), 
            M = null), I || s(e.page.domain, e.connection), e.page.enabled ? a(e) : f(), I || w.failover.success("app_load"), 
            I = !0;
        }
        function a(e) {
            return u(e.page, e.user), P ? P.updateState(e) : void (P = v.Buttons((0, m["default"])({}, e, {
                app: N,
                document: document,
                actions: R
            })));
        }
        function s(e, t) {
            var n = t.bgNotConnected;
            c(e), b.isSafari() && d();
            var r = _.pageStyles(document);
            r.customizeElements(), r.addDomainClass(), w.failover.success("index_load"), n && (x.timers.start(T), 
            k.logger.initWithoutBgConnection());
        }
        function c(e) {
            e.includes(j.GRAMMARLY_DOMAIN) && y.External();
        }
        function l() {
            h.disableConsoleLog();
        }
        function u(e) {
            var t = e.enabledDefs, n = e.cardInspection, r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
            t && !A ? A = C.Dictionary({
                doc: document,
                cardInspection: n
            }, r) : (A && A.clear(), A = null);
        }
        function d() {
            function e() {
                var n = window.getComputedStyle(t), r = n.getPropertyValue("opacity");
                "0.5" !== r ? f() : setTimeout(e, 200);
            }
            var t = document.createElement("div");
            document.body.appendChild(t), t.classList.add("grammarly-disable-indicator"), setTimeout(e, 1e3);
        }
        function f() {
            P && (P.clear(), P = null);
        }
        var p = e("babel-runtime/core-js/object/assign"), m = r(p);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var h = e("./console"), g = e("./state"), b = e("./util"), v = e("./buttons"), _ = e("./sites"), y = e("./external"), w = e("./failover"), k = e("./tracking"), E = e("./location"), C = e("./dictionary"), x = e("./timers"), j = e("lib/config"), S = 3e4, T = "init_without_bg_connection", L = E.getDomain(null, null), N = {}, P = void 0, A = void 0, I = void 0, M = setTimeout(o, S), O = g.createAndObserve(i), R = O.actions;
        l(), n.update = i;
    }, {
        "./buttons": 185,
        "./console": 204,
        "./dictionary": 206,
        "./external": 237,
        "./failover": 238,
        "./location": 257,
        "./sites": 266,
        "./state": 271,
        "./test-api": 275,
        "./timers": 276,
        "./tracking": 282,
        "./util": 288,
        "babel-runtime/core-js/object/assign": 20,
        "lib/config": 203
    } ],
    177: [ function(e, t, n) {
        "use strict";
        function r(e) {
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.benchmark = r;
    }, {} ],
    178: [ function(e, t, n) {
        "use strict";
        function r(e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : f;
            return m.get({
                name: e,
                url: t
            });
        }
        function o(e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : f;
            return m.set({
                name: e,
                url: t
            });
        }
        function i(e, t) {
            m.watch(e, t);
        }
        function a() {
            return r("grauth").then(function(e) {
                return e ? e.value : null;
            });
        }
        function s(e) {
            var t = {
                domain: l.GRAMMARLY_DOMAIN,
                name: "grauth",
                url: f,
                path: d
            };
            i(t, e);
        }
        function c() {
            var e = {
                domain: l.GRAMMARLY_DOMAIN,
                path: d
            };
            return m.getAll(e);
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var l = e("lib/config"), u = e("../../../js/extension-api"), d = "/", f = "https://" + l.GRAMMARLY_DOMAIN + d, p = u.getApi(), m = p.cookies;
        n.getCookie = r, n.setCookie = o, n.watch = i, n.getToken = a, n.watchToken = s, 
        n.getAllGrammarlyCookies = c;
    }, {
        "../../../js/extension-api": 162,
        "lib/config": 203
    } ],
    179: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        var o = e("babel-runtime/core-js/object/assign"), i = r(o);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var a = e("./user/actions"), s = e("./settings/actions"), c = e("./connection/actions");
        n.pureActions = (0, i["default"])({}, a, c, s);
    }, {
        "./connection/actions": 180,
        "./settings/actions": 181,
        "./user/actions": 182,
        "babel-runtime/core-js/object/assign": 20
    } ],
    180: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return {
                type: n.t.UPDATE_CONNECTION,
                data: e
            };
        }
        function o(e) {
            return {
                type: n.t.ONLINE_STATE,
                online: e
            };
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.t = {
            UPDATE_CONNECTION: "connection/UPDATE_CONNECTION",
            ONLINE_STATE: "connection/ONLINE_STATE"
        }, n.updateConnection = r, n.onlineConnection = o;
    }, {} ],
    181: [ function(e, t, n) {
        "use strict";
        function r(e, t) {
            return {
                type: n.t.SET_DAPI_PROP,
                propKey: e,
                data: t
            };
        }
        function o(e) {
            return {
                type: n.t.CHANGE_WEAK_DIALECT,
                data: e
            };
        }
        function i(e) {
            return {
                type: n.t.CHANGE_STRONG_DIALECT,
                data: e
            };
        }
        function a(e) {
            return {
                type: n.t.SETTINGS_INITIAL,
                data: e
            };
        }
        function s(e) {
            return {
                type: n.t.TOGGLE_DEFS,
                enabledDefs: e
            };
        }
        function c(e, t) {
            return {
                type: n.t.TOGGLE_SITE,
                domain: t,
                enabled: e
            };
        }
        function l(e, t) {
            return {
                type: n.t.TOGGLE_FIELD,
                domain: t,
                data: e
            };
        }
        function u() {
            return {
                type: n.t.SEEN_NEWS
            };
        }
        function d() {
            return {
                type: n.t.SHOW_ONBOARDING
            };
        }
        function f() {
            return {
                type: n.t.SEEN_ONBOARDING
            };
        }
        function p(e) {
            return {
                type: n.t.SHOW_NEWS,
                showNews: e
            };
        }
        function m() {
            return {
                type: n.t.SEEN_REFERRALS
            };
        }
        function h() {
            return {
                type: n.t.CLICK_REFERRALS
            };
        }
        function g(e) {
            return {
                type: n.t.TOGGLE_POPUP,
                isPopupDisabled: e
            };
        }
        function b(e) {
            return {
                type: n.t.SAVE_ANONYMOUS_PROPERTIES,
                props: e
            };
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.t = {
            SETTINGS_INITIAL: "settings/SETTINGS_INITIAL",
            TOGGLE_DEFS: "settings/TOGGLE_DEFS",
            TOGGLE_SITE: "settings/TOGGLE_SITE",
            TOGGLE_FIELD: "settings/TOGGLE_FIELD",
            TOGGLE_POPUP: "settings/TOGGLE_POPUP",
            SHOW_NEWS: "settings/SHOW_NEWS",
            SEEN_NEWS: "settings/SEEN_NEWS",
            SEEN_REFERRALS: "settings/SEEN_REFERRALS",
            CLICK_REFERRALS: "settings/CLICK_REFERRALS",
            SHOW_ONBOARDING: "settings/SHOW_ONBOARDING",
            SEEN_ONBOARDING: "settings/SEEN_ONBOARDING",
            SET_DAPI_PROP: "settings/SET_DAPI_PROP",
            CHANGE_WEAK_DIALECT: "settings/CHANGE_WEAK_DIALECT",
            CHANGE_STRONG_DIALECT: "settings/CHANGE_STRONG_DIALECT",
            SAVE_ANONYMOUS_PROPERTIES: "settings/SAVE_ANONYMOUS_PROPERTIES"
        }, n.DAPI_ACTIONS = [ n.t.CHANGE_WEAK_DIALECT, n.t.CHANGE_STRONG_DIALECT ], n.CACHED_ACTIONS = [ n.t.TOGGLE_DEFS, n.t.TOGGLE_SITE, n.t.TOGGLE_FIELD, n.t.SEEN_NEWS, n.t.SEEN_REFERRALS, n.t.CLICK_REFERRALS, n.t.SHOW_ONBOARDING, n.t.SEEN_ONBOARDING ], 
        n.setDapiProp = r, n.changeWeakDialect = o, n.changeStrongDialect = i, n.initialSettings = a, 
        n.toggleDefs = s, n.toggleSite = c, n.toggleField = l, n.seenNews = u, n.showOnboarding = d, 
        n.seenOnboarding = f, n.showNews = p, n.seenReferrals = m, n.clickReferrals = h, 
        n.togglePopup = g, n.saveAnonymousProps = b;
    }, {} ],
    182: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return {
                type: n.t.SET_USER,
                data: e
            };
        }
        function o(e) {
            return {
                type: n.t.SET_SETTINGS,
                data: e
            };
        }
        function i(e) {
            return {
                type: n.t.SESSION_INVALIDATE,
                reason: e
            };
        }
        function a() {
            return {
                type: n.t.INC_FIXED
            };
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.t = {
            SET_USER: "user/SET_USER",
            SET_SETTINGS: "user/SET_SETTINGS",
            SESSION_INVALIDATE: "user/SESSION_INVALIDATE",
            INC_FIXED: "user/INC_FIXED"
        }, n.setUser = r, n.setSettings = o, n.sessionInvalidate = i, n.incFixed = a;
    }, {} ],
    183: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        var o = e("babel-runtime/core-js/json/stringify"), i = r(o), a = e("babel-runtime/core-js/object/keys"), s = r(a), c = e("babel-runtime/helpers/typeof"), l = r(c), u = e("babel-runtime/regenerator"), d = r(u), f = e("babel-runtime/helpers/defineProperty"), p = r(f), m = e("babel-runtime/core-js/object/assign"), h = r(m), g = e("babel-runtime/core-js/promise"), b = r(g), v = function(e, t, n, r) {
            return new (n || (n = b["default"]))(function(o, i) {
                function a(e) {
                    try {
                        c(r.next(e));
                    } catch (t) {
                        i(t);
                    }
                }
                function s(e) {
                    try {
                        c(r["throw"](e));
                    } catch (t) {
                        i(t);
                    }
                }
                function c(e) {
                    e.done ? o(e.value) : new n(function(t) {
                        t(e.value);
                    }).then(a, s);
                }
                c((r = r.apply(e, t || [])).next());
            });
        };
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var _, y = e("extension-api"), w = e("lib/newConfig"), k = y.getApi(), E = k.preferences, C = function(e) {
            return new b["default"](function(t, n) {
                try {
                    var r = E.get(e);
                    t("undefined" === r ? void 0 : r && JSON.parse(r));
                } catch (o) {
                    o && o.toString().includes("SyntaxError") ? (E.remove(e), n("Prop:" + e + " has corrupted value, cleanup")) : n(o);
                }
            });
        };
        !function(e) {
            function t(e) {
                return v(this, void 0, void 0, d["default"].mark(function t() {
                    var n, r, o, i, a;
                    return d["default"].wrap(function(t) {
                        for (;;) switch (t.prev = t.next) {
                          case 0:
                            if (n = Array.isArray(e), r = void 0, t.prev = 2, !n) {
                                t.next = 11;
                                break;
                            }
                            return e = e, t.next = 7, b["default"].all(e.map(C));

                          case 7:
                            o = t.sent, r = e.reduce(function(e, t, n) {
                                return (0, h["default"])(e, (0, p["default"])({}, t, o[n]));
                            }, {}), t.next = 30;
                            break;

                          case 11:
                            if (e = e, i = "version", e !== i || !w.isFF()) {
                                t.next = 27;
                                break;
                            }
                            return t.next = 16, browser.storage.local.get(i);

                          case 16:
                            if (a = t.sent, !a.hasOwnProperty(i)) {
                                t.next = 21;
                                break;
                            }
                            t.t0 = a[i] && JSON.parse(a[i]), t.next = 24;
                            break;

                          case 21:
                            return t.next = 23, C(e);

                          case 23:
                            t.t0 = t.sent;

                          case 24:
                            r = t.t0, t.next = 30;
                            break;

                          case 27:
                            return t.next = 29, C(e);

                          case 29:
                            r = t.sent;

                          case 30:
                            t.next = 36;
                            break;

                          case 32:
                            t.prev = 32, t.t1 = t["catch"](2), n && (r = {}), console.warn("prefs get error:", t.t1);

                          case 36:
                            return t.abrupt("return", r);

                          case 37:
                          case "end":
                            return t.stop();
                        }
                    }, t, this, [ [ 2, 32 ] ]);
                }));
            }
            function n(e, t) {
                return v(this, void 0, void 0, d["default"].mark(function n() {
                    var r;
                    return d["default"].wrap(function(n) {
                        for (;;) switch (n.prev = n.next) {
                          case 0:
                            if (null === e || "object" !== ("undefined" == typeof e ? "undefined" : (0, l["default"])(e))) {
                                n.next = 4;
                                break;
                            }
                            (0, s["default"])(e).forEach(function(t) {
                                return _.set(t, e[t]);
                            }), n.next = 18;
                            break;

                          case 4:
                            if (n.prev = 4, t = void 0 === t ? "undefined" : (0, i["default"])(t), r = "version", 
                            e !== r || !w.isFF()) {
                                n.next = 12;
                                break;
                            }
                            return n.next = 10, browser.storage.local.set((0, p["default"])({}, r, t));

                          case 10:
                            n.next = 13;
                            break;

                          case 12:
                            E.set(e, t);

                          case 13:
                            n.next = 18;
                            break;

                          case 15:
                            n.prev = 15, n.t0 = n["catch"](4), console.warn("prefs set error", n.t0);

                          case 18:
                          case "end":
                            return n.stop();
                        }
                    }, n, this, [ [ 4, 15 ] ]);
                }));
            }
            function r() {
                return v(this, void 0, void 0, d["default"].mark(function e() {
                    return d["default"].wrap(function(e) {
                        for (;;) switch (e.prev = e.next) {
                          case 0:
                            return e.abrupt("return", new b["default"](function(e, t) {
                                try {
                                    var n = E.getAll();
                                    for (var r in n) if ("undefined" === n[r]) n[r] = void 0; else try {
                                        var o = n[r];
                                        n[r] = o && JSON.parse(o);
                                    } catch (i) {}
                                    e(n);
                                } catch (i) {
                                    t(i);
                                }
                            }));

                          case 1:
                          case "end":
                            return e.stop();
                        }
                    }, e, this);
                }));
            }
            function o(e) {
                try {
                    E.remove(e);
                } catch (t) {
                    console.warn("prefs remove error", t);
                }
            }
            function a() {
                try {
                    E.removeAll();
                } catch (e) {
                    console.warn("prefs clearAll error", e);
                }
            }
            e.get = t, e.set = n, e.all = r, e.remove = o, e.clearAll = a;
        }(_ = n.prefs || (n.prefs = {}));
    }, {
        "babel-runtime/core-js/json/stringify": 18,
        "babel-runtime/core-js/object/assign": 20,
        "babel-runtime/core-js/object/keys": 25,
        "babel-runtime/core-js/promise": 28,
        "babel-runtime/helpers/defineProperty": 33,
        "babel-runtime/helpers/typeof": 39,
        "babel-runtime/regenerator": 42,
        "extension-api": 162,
        "lib/newConfig": 259
    } ],
    184: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o(e, t, n) {
            return f.isFocused(n) || e === n || f.isParent(e, n) || e === t || f.isParent(e, t);
        }
        function i(e) {
            return 0 === e.className.indexOf("gr-") || f.resolveEl(e, x.textarea_btn) || f.resolveEl(e, "gr__tooltip");
        }
        function a(e) {
            var t = v.guid(), n = e;
            f.setGRAttributes(n, t), n.setAttribute("gramm-ifr", "true");
            var r = n.contentDocument;
            return f.addIframeCss(r), f.setGRAttributes(r.body, t), n.style.height = n.style.height || getComputedStyle(n).height, 
            r.body;
        }
        function s(e, t) {
            function n() {
                te = de.createElement("grammarly-btn"), ne = d.findDOMNode(I()), r(), se = new _.Pos({
                    btnEl: ne,
                    fieldEl: $,
                    custom: he,
                    sourceEl: Ne,
                    isTextarea: "textarea" === Z,
                    initCondition: Ie
                }), se.on("update", L), se.on("change-state", N), Oe = y.BtnPath({
                    editorEl: $,
                    btnEl: ne,
                    padding: 15
                }), ce = w.Menu({
                    el: ne,
                    editor: le,
                    posSourceEl: fe && $,
                    enabled: Ie,
                    referral: je,
                    referralWasClicked: Se,
                    onReferralClick: ee.clickReferrals,
                    user: Ee,
                    btn: Ge,
                    app: K,
                    onboardingPopup: ie
                }), re = b.ErrorTooltip({
                    el: ne,
                    win: window
                }), ce.bind(), ce.on("change-state", function(e) {
                    ge = e, A();
                }), f.listen(ne, "click", S, !1), t.on("hover", M), f.listen(pe, "focus", s, !1), 
                f.listen(pe, "blur", T, !1), f.isFocused(pe) && (M({
                    target: pe
                }), s()), Te.fieldParentCustomStyle && (De = f.setCustomCss($.parentNode, Te.fieldParentCustomStyle($))), 
                J.online || Ge.offline();
            }
            function r() {
                var e = {
                    "z-index": (parseInt(f.css($, "z-index"), 10) || 1) + 1
                }, t = Te.btnCustomContainer && Te.btnCustomContainer($);
                if (t) {
                    he = !0, Ne = t;
                    var n = Te.btnCustomStyles && Te.btnCustomStyles(!0, $);
                    n && (0, l["default"])(e, n);
                }
                f.insertAfter(te, Ne), L(e);
            }
            function s() {
                if (ke = !0, ae = !0, ve = !0, t.off("hover", M), !Ie) return void H();
                if (!we) {
                    we = !0;
                    try {
                        le = m.CreateEditor({
                            app: K,
                            doc: de,
                            connection: J,
                            page: Q,
                            user: X,
                            type: Z,
                            field: $,
                            actions: ee
                        }), oe = g.InfinityChecker(le.reset, Ge.offline), c("on"), le.run(), ce.updateEditor(le), 
                        se.set("minimize", !Ae), se.set("editor", le);
                    } catch (e) {
                        console.error(e), Ge.offline();
                    }
                    H();
                    var n = X.experiments && X.experiments.onboarding, r = !Ge.getState().offline && Q.showOnboarding && n && se.max;
                    r && (ie = new C.Popup({
                        doc: de,
                        el: ne,
                        editor: le,
                        user: X
                    }), ee.seenOnboarding(), ce.setOnboarding(ie));
                }
            }
            function c() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "on";
                le[e]("finish", j), le[e]("rendered", H), le[e]("sending", F), le[e]("show-dialog", W);
            }
            function j() {
                W(), H();
            }
            function S() {
                le && le.isOffline() && re.fastShow();
            }
            function T(e) {
                be && f.isFocused(pe) && M(e);
            }
            function L(e) {
                (0, l["default"])(ue, e), A();
            }
            function N() {
                _e = !q(), ye = !0, h.fire("button-change-state", _e), ce && ce.hide();
            }
            function P(e) {
                Ae || (pe.focus(), f.hasClass(e.target, x.status) && ce.show(!0));
            }
            function A() {
                te || n(), I();
            }
            function I() {
                return d.render(u.createElement(E.ButtonComponent, {
                    state: Y(),
                    inlineStyle: ue,
                    onViewClick: function(e) {
                        return P(e);
                    }
                }), te);
            }
            function M(e) {
                if (!f.isFocused(pe) && ae) {
                    if (Oe.within(e)) return void R();
                    ae = !1;
                }
                if (e.target !== pe) return D();
                if (o(e.target, ne, pe)) ae = !0, R(); else {
                    if (i(e.target)) return;
                    D();
                }
            }
            function O() {
                be = !0, ve = !0, "0" === ne.style.opacity && (ne.style.opacity = "1"), H();
            }
            function R() {
                be || (Ie ? O() : Re = setTimeout(O, 150));
            }
            function D() {
                if (be) {
                    if (clearTimeout(Re), ce.isOpened()) return void (ne.style.opacity = "0");
                    be = !1, ve = !1, H();
                }
            }
            function F() {
                Ae || (clearTimeout(Me), B());
            }
            function B() {
                clearTimeout(Me), le && !le.getText().trim() || Pe || (Pe = !0, oe && oe.start(), 
                be || M({
                    target: pe
                }), H());
            }
            function W() {
                clearTimeout(Me), oe && oe.finish(), Me = setTimeout(U, 200);
            }
            function U() {
                Pe = !1, H();
            }
            function G() {
                le && (oe && oe.finish(), we = !1, le.remove(), c("off"));
            }
            function z() {
                G(), se && se.remove(), ce && ce.remove(), ce && ce.unbind(), ie && ie.remove(), 
                f.unlisten(ne, "click", S, !1), t.off("hover", M), f.unlisten(pe, "focus", s, !1), 
                f.unlisten(pe, "blur", T, !1), re.remove(), De && De(), te.parentNode && te.parentNode.removeChild(te);
            }
            function V(e) {
                var t = e.user, n = e.connection, r = e.page;
                Ce = t.anonymous, xe = t.premium, je = t.referral, Se = r.referralWasClicked, Ee = t, 
                Fe(n.online), le && le.updateState({
                    user: t,
                    connection: n,
                    page: r
                }), H();
            }
            function H() {
                var e = le && le.errorData() || {};
                e.enabled = Ie, e.checking = Pe, e.anonymous = Ce, e.premium = xe, e.referral = je, 
                e.referralWasClicked = Se, e.user = Ee, e.fieldWasFocused = ke, ce && ce.update(e), 
                se && se.set("show", ve), A();
            }
            function q() {
                return se.max;
            }
            function Y() {
                var e = le && le.errorData() || {};
                return {
                    offline: Ae,
                    checking: Pe,
                    enabled: Ie,
                    anonymous: Ce,
                    premium: xe,
                    experiments: Ee.experiments,
                    show: ve,
                    visible: be,
                    wasMinimized: ye,
                    minimized: _e,
                    hovered: ge,
                    isFieldEmpty: me,
                    isFieldHovered: ae,
                    fieldWasFocused: ke,
                    isEditorInited: we,
                    referralWasClicked: Se,
                    errors: e
                };
            }
            var K = e.app, X = e.user, Q = e.page, J = e.connection, $ = e.field, Z = e.type, ee = e.actions, te = void 0, ne = void 0, re = void 0, oe = void 0, ie = void 0, ae = void 0, se = void 0, ce = void 0, le = void 0, ue = {
                visibility: "hidden"
            }, de = $.ownerDocument, fe = "iframe" === Z, pe = fe ? a($) : $, me = 0 === ($.value || $.textContent || "").trim().length, he = !1, ge = !1, be = !1, ve = !1, _e = !1, ye = !1, we = !1, ke = !1, Ee = X, Ce = X.anonymous, xe = X.premium, je = X.referral, Se = Q.referralWasClicked, Te = p.pageStyles(de).getFixesForCurrentDomain(), Le = k.State(Q.disabledFields, ee.toggleField), Ne = $, Pe = !1, Ae = !J.online, Ie = !0, Me = void 0, Oe = void 0, Re = void 0, De = void 0, Fe = function(e) {
                Ae !== !e && (Ae = !e, se && se.set("minimize", e), H(), le && le[Ae ? "offline" : "online"](), 
                Ie && re[Ae ? "enable" : "disable"]());
            }, Be = function(e) {
                if (Ie !== e) {
                    var t = e && !Ie, n = v.isSafari() && t;
                    Ie = e, Le.changeFieldState($, Ne, !e), se && se.set("maximize", e), e ? (ce.hide(), 
                    s()) : G(), H(), n && (ne.style.display = "none", v.asyncCall(function() {
                        return ne.style.display = "";
                    }));
                }
            }, We = function() {
                Ie = !Le.isFieldDisabled($), _e = !Ie, Ie || Be(!1), A();
            }, Ue = function() {
                return ne;
            }, Ge = {
                online: function() {
                    return Fe(!0);
                },
                offline: function() {
                    return Fe(!1);
                },
                enable: function() {
                    return Be(!0);
                },
                disable: function() {
                    return Be(!1);
                },
                remove: z,
                getEl: Ue,
                getState: Y,
                updateState: V,
                getPosState: q,
                onViewClick: P,
                onChangeState: N,
                show: R,
                hide: D,
                checking: F,
                cancelChecking: W
            };
            return We(), Ge;
        }
        var c = e("babel-runtime/core-js/object/assign"), l = r(c);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var u = e("react"), d = e("react-dom"), f = e("../dom"), p = e("../sites"), m = e("../editor"), h = e("../tracking"), g = e("../infinity-checker"), b = e("../elements/error-tooltip"), v = e("../util"), _ = e("./pos"), y = e("./path"), w = e("./menu"), k = e("./state"), E = e("./view"), C = e("../elements/onboarding/popup"), x = {
            textarea_btn: "_e725ae-textarea_btn",
            status: "_e725ae-status",
            field_hovered: "_e725ae-field_hovered",
            btn_text: "_e725ae-btn_text",
            not_focused: "_e725ae-not_focused",
            errors_100: "_e725ae-errors_100",
            anonymous: "_e725ae-anonymous",
            show: "_e725ae-show",
            errors: "_e725ae-errors",
            checking: "_e725ae-checking",
            has_errors: "_e725ae-has_errors",
            disabled: "_e725ae-disabled",
            transform_wrap: "_e725ae-transform_wrap",
            offline: "_e725ae-offline",
            plus_only: "_e725ae-plus_only",
            minimized: "_e725ae-minimized",
            hovered: "_e725ae-hovered",
            minimize_transition: "_e725ae-minimize_transition"
        };
        n.Button = s;
    }, {
        "../dom": 207,
        "../editor": 209,
        "../elements/error-tooltip": 213,
        "../elements/onboarding/popup": 223,
        "../infinity-checker": 244,
        "../sites": 266,
        "../tracking": 282,
        "../util": 288,
        "./menu": 187,
        "./path": 190,
        "./pos": 192,
        "./state": 195,
        "./view": 196,
        "babel-runtime/core-js/object/assign": 20,
        react: "react",
        "react-dom": "react-dom"
    } ],
    185: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o(e) {
            function t(e) {
                function t(e, t) {
                    w.set(e, u.Button({
                        field: e,
                        app: m,
                        user: E,
                        page: C,
                        connection: x,
                        type: t,
                        actions: _
                    }, y));
                }
                p(e), e.textareas.forEach(function(e) {
                    return t(e, "textarea");
                }), e.contenteditables.forEach(function(e) {
                    return t(e, "contenteditable");
                }), e.iframes.forEach(function(e) {
                    return t(e, "iframe");
                }), e.htmlghosts.forEach(function(e) {
                    return t(e, "htmlghost");
                });
            }
            function n(e) {
                console.log("remove", e), w.get(e) && w.get(e).remove(), w["delete"](e);
            }
            function r() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "on";
                y[e]("add", t), y[e]("remove", n);
            }
            function o(e) {
                E = e.user, x = e.connection, C = e.page, i(e.connection.bgNotConnected), m.elements && m.elements.updateState(e), 
                w.forEach(function(t) {
                    return t.updateState(e);
                });
            }
            function i(e) {
                if (e && k) c.timers.start(d), s.logger.lostBgPageConnection(); else if (!e && !k) {
                    var t = c.timers.stop(d);
                    s.logger.restoreBgPageConnection(t);
                }
                k = !e;
            }
            function f() {
                r("off"), w.forEach(function(e) {
                    return e.remove();
                }), w.clear(), w = null, m.elements && m.elements.clear(), m.elements = null, y.reset(), 
                y.stop(), y = null;
            }
            function p(e) {
                try {
                    console.log("add", e);
                } catch (t) {
                    console.log("fields added");
                }
            }
            var m = e.app, h = e.doc, g = e.connection, b = e.user, v = e.page, _ = e.actions, y = l.PageFields({
                doc: h,
                page: v
            }), w = new a["default"](), k = !0, E = b, C = v, x = g;
            return i(g.bgNotConnected), r("on"), t(y.get()), {
                add: t,
                updateState: o,
                remove: n,
                clear: f
            };
        }
        var i = e("babel-runtime/core-js/map"), a = r(i);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var s = e("../tracking"), c = e("../timers"), l = e("../page-fields"), u = e("./button"), d = "life_without_bg_connection";
        n.Buttons = o;
    }, {
        "../page-fields": 261,
        "../timers": 276,
        "../tracking": 282,
        "./button": 184,
        "babel-runtime/core-js/map": 19
    } ],
    186: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        var o = e("babel-runtime/helpers/defineProperty"), i = r(o), a = e("babel-runtime/core-js/object/get-prototype-of"), s = r(a), c = e("babel-runtime/helpers/classCallCheck"), l = r(c), u = e("babel-runtime/helpers/createClass"), d = r(u), f = e("babel-runtime/helpers/possibleConstructorReturn"), p = r(f), m = e("babel-runtime/helpers/inherits"), h = r(m);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var g = e("react"), b = e("react-dom"), v = e("../../dom"), _ = {
            hoverMenu: "_970ef1-hoverMenu",
            opened: "_970ef1-opened",
            btn: "_970ef1-btn",
            line: "_970ef1-line",
            panel: "_970ef1-panel",
            premium: "_970ef1-premium",
            btn_premium: "_970ef1-btn_premium",
            btn_grammarly: "_970ef1-btn_grammarly",
            anonymous: "_970ef1-anonymous",
            panelText: "_970ef1-panelText",
            critical: "_970ef1-critical",
            disabled: "_970ef1-disabled",
            referralArea: "_970ef1-referralArea",
            btn_disable: "_970ef1-btn_disable",
            initial: "_970ef1-initial",
            checking: "_970ef1-checking",
            counter: "_970ef1-counter",
            counter100: "_970ef1-counter100",
            buttonArea: "_970ef1-buttonArea",
            referralText: "_970ef1-referralText",
            tooltip: "_970ef1-tooltip",
            tooltip_grammarly: "_970ef1-tooltip_grammarly",
            tooltip_premium: "_970ef1-tooltip_premium",
            tooltip_disable: "_970ef1-tooltip_disable",
            plus: "_970ef1-plus",
            tooltip_referral: "_970ef1-tooltip_referral",
            referral: "_970ef1-referral",
            tooltip_visible: "_970ef1-tooltip_visible",
            tooltip_hidden: "_970ef1-tooltip_hidden"
        }, y = function(e) {
            function t() {
                (0, l["default"])(this, t);
                var e = (0, p["default"])(this, (t.__proto__ || (0, s["default"])(t)).call(this));
                return e.onMouseEnterHandler = e.onMouseEnterHandler.bind(e), e.onMouseLeaveHandler = e.onMouseLeaveHandler.bind(e), 
                e.onMouseClick = e.onMouseClick.bind(e), e;
            }
            return (0, h["default"])(t, e), (0, d["default"])(t, [ {
                key: "onMouseEnterHandler",
                value: function() {
                    var e = this, t = this.props.data.type.includes("referral"), n = t ? 150 : 1350;
                    this.tooltipTimeout = setTimeout(function() {
                        e.props.data.onTooltip({
                            active: !0,
                            el: b.findDOMNode(e),
                            text: e.props.data.text,
                            cls: t ? "referral" : e.props.data.type
                        });
                    }, n);
                }
            }, {
                key: "onMouseLeaveHandler",
                value: function() {
                    clearTimeout(this.tooltipTimeout), this.props.data.onTooltip({
                        active: !1,
                        text: this.props.data.text,
                        cls: this.props.data.type
                    });
                }
            }, {
                key: "onMouseClick",
                value: function(e) {
                    this.props.data.click && this.props.data.click(e), "disable" == this.props.data.type && this.onMouseLeaveHandler();
                }
            }, {
                key: "isShowInviteFriends",
                value: function(e) {
                    return !e.referralWasClicked;
                }
            }, {
                key: "render",
                value: function() {
                    var e, t = this.props.data, n = v.cs((e = {}, (0, i["default"])(e, _.btn, !0), (0, 
                    i["default"])(e, _["btn_" + t.type], !0), (0, i["default"])(e, _.counter, t.count > 0), 
                    (0, i["default"])(e, _.counter100, t.count > 99), e));
                    return g.createElement("div", {
                        className: _.buttonArea
                    }, t.type.includes("referral") ? g.createElement("div", {
                        className: _.referralArea,
                        onClick: this.onMouseClick,
                        onMouseEnter: this.onMouseEnterHandler,
                        onMouseLeave: this.onMouseLeaveHandler,
                        "data-action": t.actionType,
                        tabIndex: "-1"
                    }, g.createElement("div", {
                        className: n
                    }), this.isShowInviteFriends(t) && g.createElement("span", {
                        className: _.referralText
                    }, "Invite Friends")) : g.createElement("div", {
                        className: n,
                        onClick: this.onMouseClick,
                        onMouseEnter: this.onMouseEnterHandler,
                        onMouseLeave: this.onMouseLeaveHandler,
                        "data-action": t.actionType,
                        tabIndex: "-1"
                    }, t.count > 0 ? t.count : null));
                }
            } ]), t;
        }(g.Component);
        n.MenuBtn = y;
    }, {
        "../../dom": 207,
        "babel-runtime/core-js/object/get-prototype-of": 24,
        "babel-runtime/helpers/classCallCheck": 31,
        "babel-runtime/helpers/createClass": 32,
        "babel-runtime/helpers/defineProperty": 33,
        "babel-runtime/helpers/inherits": 35,
        "babel-runtime/helpers/possibleConstructorReturn": 36,
        react: "react",
        "react-dom": "react-dom"
    } ],
    187: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o(e) {
            function t(e) {
                function t() {
                    M.showDialog({
                        caller: "button_hover"
                    }), y.fire("correct-btn-clicked"), v.timers.start("open_editor");
                }
                function n() {
                    y.fire("hook-clicked", "button_hover"), r();
                }
                function r() {
                    var e = f.getUpgradeUrlFromMatches({
                        baseUrl: h.URLS.upgrade,
                        returnUrl: "",
                        appType: "popup",
                        matches: M.getMatches()
                    });
                    e = g.addParamsToUpgradeURL(e, D.anonymous === !0 ? "signupHook" : "upHook", D.anonymous === !0 ? "extensionPremiumCta" : "buttonHover"), 
                    b.emitBackground("open-url", e);
                }
                if (!M.isOffline()) {
                    var o = e.target;
                    p.hasClass(o, k.btn_premium) ? W.premium ? t() : n() : p.hasClass(o, k.btn_grammarly) && t(), 
                    setTimeout(P, 200);
                }
            }
            function n() {
                R(), y.fire("referral-clicked", "gButton"), b.emitBackground("open-url", h.URLS.referral), 
                P();
            }
            function r() {
                y.fire("referral-shown", "gButton");
            }
            function o() {
                W.enabled ? (W.enabled = !1, O.disable(), P()) : (O.enable(), W.enabled = !0), y.fire("btn-disable-in-field", W.enabled), 
                x();
            }
            function i(e) {
                W = e, D = e.user, x();
            }
            function s(e) {
                M = e;
            }
            function C(e) {
                var t = m.getAbsRect(I), n = {}, r = !O.getPosState() && W.enabled, o = t.top, i = t.left;
                return e && (i -= e.clientWidth, o -= e.clientHeight / 2), o += r ? $ : Q, i -= r ? J : X, 
                !r && B.menuPosLeft && (i = B.menuPosLeft(M, i, W)), (0, c["default"])(n, (0, a["default"])({}, V, "translate(" + i + "px, " + o + "px)")), 
                n;
            }
            function x() {
                var e = j(W, C(), z);
                return K = u.findDOMNode(e), j(W, C(K), G);
            }
            function j(e, r, i) {
                return u.render(l.createElement(_.HoverMenuView, {
                    style: r,
                    click: t,
                    disableClick: o,
                    referralClick: n,
                    state: e,
                    opened: q
                }), i);
            }
            function S() {
                p.listen(U.documentElement, "mousemove", L), M && M.on("iframe-mousemove", L);
            }
            function T(e) {
                q && !e || (p.unlisten(U.documentElement, "mousemove", L), M && M.off("iframe-mousemove", L));
            }
            function L(e) {
                var t = p.resolveEl(e.target, E.textarea_btn);
                if (t && t != I) return P();
                if (p.hasClass(I, E.offline)) return P();
                var n = p.resolveEl(e.target, k.hoverMenu);
                return t || n == H ? e.target.classList.contains(E.btn_text) ? P() : void N() : P();
            }
            function N(e) {
                F && F.isActive || (Y && !W.offline && W.fieldWasFocused || e) && (q || (q = !0, 
                Z.emit("change-state", !0), x(), W.referral && r()));
            }
            function P() {
                q && (q = !1, Z.emit("change-state", !1), x());
            }
            function A() {
                T(), G.parentNode && G.parentNode.removeChild(G), z.parentNode && z.parentNode.removeChild(z);
            }
            var I = e.el, M = e.editor, O = e.btn, R = e.onReferralClick, D = e.user, F = e.onboardingPopup, B = w.pageStyles(U).getFixesForCurrentDomain(), W = {
                critical: 0,
                plus: 0,
                offline: !1,
                referral: e.referral,
                referralWasClicked: e.referralWasClicked,
                enabled: e.enabled,
                initial: e.initial,
                checking: e.checking,
                fieldWasFocused: e.fieldWasFocused
            }, U = I.ownerDocument, G = U.createElement("div"), z = U.createElement("div"), V = p.transformProp(U), H = u.findDOMNode(x()), q = !1, Y = !0, K = void 0, X = -26, Q = 11, J = -13, $ = 2;
            p.addClass(G, "gr-top-z-index"), p.addClass(G, "gr-top-zero"), G.setAttribute("tabindex", -1), 
            z.style.cssText = "visibility: hidden;top: -9999px;position: absolute;opacity: 0", 
            U.documentElement.insertBefore(G, U.body), U.documentElement.insertBefore(z, U.body);
            var Z = d({
                show: N,
                hide: P,
                bind: S,
                unbind: T,
                remove: A,
                render: x,
                menuEl: H,
                update: i,
                onclick: t,
                updateEditor: s,
                isOpened: function() {
                    return q;
                },
                isEnabled: function() {
                    return Y;
                },
                disable: function() {
                    return Y = !1;
                },
                enable: function() {
                    return Y = !0;
                },
                getState: function() {
                    return W;
                },
                setOnboarding: function(e) {
                    return F = e;
                }
            });
            return Z;
        }
        var i = e("babel-runtime/helpers/defineProperty"), a = r(i), s = e("babel-runtime/core-js/object/assign"), c = r(s);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var l = e("react"), u = e("react-dom"), d = e("emitter"), f = e("grammarly-editor"), p = e("../../dom"), m = e("../../position"), h = e("../../config"), g = e("lib/url"), b = e("../../message"), v = e("../../timers"), _ = e("./view"), y = e("../../tracking"), w = e("../../sites"), k = {
            hoverMenu: "_970ef1-hoverMenu",
            opened: "_970ef1-opened",
            btn: "_970ef1-btn",
            line: "_970ef1-line",
            panel: "_970ef1-panel",
            premium: "_970ef1-premium",
            btn_premium: "_970ef1-btn_premium",
            btn_grammarly: "_970ef1-btn_grammarly",
            anonymous: "_970ef1-anonymous",
            panelText: "_970ef1-panelText",
            critical: "_970ef1-critical",
            disabled: "_970ef1-disabled",
            referralArea: "_970ef1-referralArea",
            btn_disable: "_970ef1-btn_disable",
            initial: "_970ef1-initial",
            checking: "_970ef1-checking",
            counter: "_970ef1-counter",
            counter100: "_970ef1-counter100",
            buttonArea: "_970ef1-buttonArea",
            referralText: "_970ef1-referralText",
            tooltip: "_970ef1-tooltip",
            tooltip_grammarly: "_970ef1-tooltip_grammarly",
            tooltip_premium: "_970ef1-tooltip_premium",
            tooltip_disable: "_970ef1-tooltip_disable",
            plus: "_970ef1-plus",
            tooltip_referral: "_970ef1-tooltip_referral",
            referral: "_970ef1-referral",
            tooltip_visible: "_970ef1-tooltip_visible",
            tooltip_hidden: "_970ef1-tooltip_hidden"
        }, E = {
            textarea_btn: "_e725ae-textarea_btn",
            status: "_e725ae-status",
            field_hovered: "_e725ae-field_hovered",
            btn_text: "_e725ae-btn_text",
            not_focused: "_e725ae-not_focused",
            errors_100: "_e725ae-errors_100",
            anonymous: "_e725ae-anonymous",
            show: "_e725ae-show",
            errors: "_e725ae-errors",
            checking: "_e725ae-checking",
            has_errors: "_e725ae-has_errors",
            disabled: "_e725ae-disabled",
            transform_wrap: "_e725ae-transform_wrap",
            offline: "_e725ae-offline",
            plus_only: "_e725ae-plus_only",
            minimized: "_e725ae-minimized",
            hovered: "_e725ae-hovered",
            minimize_transition: "_e725ae-minimize_transition"
        };
        n.Menu = o;
    }, {
        "../../config": 203,
        "../../dom": 207,
        "../../message": 258,
        "../../position": 262,
        "../../sites": 266,
        "../../timers": 276,
        "../../tracking": 282,
        "./view": 189,
        "babel-runtime/core-js/object/assign": 20,
        "babel-runtime/helpers/defineProperty": 33,
        emitter: "emitter",
        "grammarly-editor": "grammarly-editor",
        "lib/url": 287,
        react: "react",
        "react-dom": "react-dom"
    } ],
    188: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        var o = e("babel-runtime/helpers/defineProperty"), i = r(o), a = e("babel-runtime/core-js/object/get-prototype-of"), s = r(a), c = e("babel-runtime/helpers/classCallCheck"), l = r(c), u = e("babel-runtime/helpers/createClass"), d = r(u), f = e("babel-runtime/helpers/possibleConstructorReturn"), p = r(f), m = e("babel-runtime/helpers/inherits"), h = r(m);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var g = e("react"), b = e("../../dom"), v = {
            hoverMenu: "_970ef1-hoverMenu",
            opened: "_970ef1-opened",
            btn: "_970ef1-btn",
            line: "_970ef1-line",
            panel: "_970ef1-panel",
            premium: "_970ef1-premium",
            btn_premium: "_970ef1-btn_premium",
            btn_grammarly: "_970ef1-btn_grammarly",
            anonymous: "_970ef1-anonymous",
            panelText: "_970ef1-panelText",
            critical: "_970ef1-critical",
            disabled: "_970ef1-disabled",
            referralArea: "_970ef1-referralArea",
            btn_disable: "_970ef1-btn_disable",
            initial: "_970ef1-initial",
            checking: "_970ef1-checking",
            counter: "_970ef1-counter",
            counter100: "_970ef1-counter100",
            buttonArea: "_970ef1-buttonArea",
            referralText: "_970ef1-referralText",
            tooltip: "_970ef1-tooltip",
            tooltip_grammarly: "_970ef1-tooltip_grammarly",
            tooltip_premium: "_970ef1-tooltip_premium",
            tooltip_disable: "_970ef1-tooltip_disable",
            plus: "_970ef1-plus",
            tooltip_referral: "_970ef1-tooltip_referral",
            referral: "_970ef1-referral",
            tooltip_visible: "_970ef1-tooltip_visible",
            tooltip_hidden: "_970ef1-tooltip_hidden"
        }, _ = function(e) {
            function t() {
                return (0, l["default"])(this, t), (0, p["default"])(this, (t.__proto__ || (0, s["default"])(t)).apply(this, arguments));
            }
            return (0, h["default"])(t, e), (0, d["default"])(t, [ {
                key: "render",
                value: function() {
                    var e, t = this.props.data || {}, n = this.props.measure, r = b.cs((e = {}, (0, 
                    i["default"])(e, v.tooltip, !0), (0, i["default"])(e, v.tooltip_visible, t.active && !n), 
                    (0, i["default"])(e, v.tooltip_hidden, !t.active && !n), (0, i["default"])(e, v["tooltip_" + t.cls], !0), 
                    e)), o = void 0;
                    return t.active && !n && (o = {
                        right: 0
                    }), g.createElement("div", {
                        style: o,
                        className: r,
                        ref: "tooltip",
                        dangerouslySetInnerHTML: {
                            __html: t.text
                        }
                    });
                }
            } ]), t;
        }(g.Component);
        n.Tooltip = _;
    }, {
        "../../dom": 207,
        "babel-runtime/core-js/object/get-prototype-of": 24,
        "babel-runtime/helpers/classCallCheck": 31,
        "babel-runtime/helpers/createClass": 32,
        "babel-runtime/helpers/defineProperty": 33,
        "babel-runtime/helpers/inherits": 35,
        "babel-runtime/helpers/possibleConstructorReturn": 36,
        react: "react"
    } ],
    189: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        var o = e("babel-runtime/helpers/defineProperty"), i = r(o), a = e("babel-runtime/core-js/object/get-prototype-of"), s = r(a), c = e("babel-runtime/helpers/classCallCheck"), l = r(c), u = e("babel-runtime/helpers/createClass"), d = r(u), f = e("babel-runtime/helpers/possibleConstructorReturn"), p = r(f), m = e("babel-runtime/helpers/inherits"), h = r(m);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var g = e("react"), b = e("react-dom"), v = e("./action"), _ = e("./tooltip"), y = e("../../dom"), w = {
            hoverMenu: "_970ef1-hoverMenu",
            opened: "_970ef1-opened",
            btn: "_970ef1-btn",
            line: "_970ef1-line",
            panel: "_970ef1-panel",
            premium: "_970ef1-premium",
            btn_premium: "_970ef1-btn_premium",
            btn_grammarly: "_970ef1-btn_grammarly",
            anonymous: "_970ef1-anonymous",
            panelText: "_970ef1-panelText",
            critical: "_970ef1-critical",
            disabled: "_970ef1-disabled",
            referralArea: "_970ef1-referralArea",
            btn_disable: "_970ef1-btn_disable",
            initial: "_970ef1-initial",
            checking: "_970ef1-checking",
            counter: "_970ef1-counter",
            counter100: "_970ef1-counter100",
            buttonArea: "_970ef1-buttonArea",
            referralText: "_970ef1-referralText",
            tooltip: "_970ef1-tooltip",
            tooltip_grammarly: "_970ef1-tooltip_grammarly",
            tooltip_premium: "_970ef1-tooltip_premium",
            tooltip_disable: "_970ef1-tooltip_disable",
            plus: "_970ef1-plus",
            tooltip_referral: "_970ef1-tooltip_referral",
            referral: "_970ef1-referral",
            tooltip_visible: "_970ef1-tooltip_visible",
            tooltip_hidden: "_970ef1-tooltip_hidden"
        }, k = function(e) {
            function t() {
                (0, l["default"])(this, t);
                var e = (0, p["default"])(this, (t.__proto__ || (0, s["default"])(t)).apply(this, arguments));
                return e.state = {
                    tooltip: {
                        active: !1,
                        text: "",
                        cls: ""
                    }
                }, e.onTooltip = function(t) {
                    var n = b.render(g.createElement(_.Tooltip, {
                        data: t,
                        measure: !0
                    }), e.tooltipMeasure);
                    setTimeout(function() {
                        t.width = b.findDOMNode(n).clientWidth, e.setState({
                            tooltip: t
                        });
                    }, 10);
                }, e;
            }
            return (0, h["default"])(t, e), (0, d["default"])(t, [ {
                key: "componentDidMount",
                value: function() {
                    this.tooltipMeasure = document.createElement("div"), this.tooltipMeasure.style.cssText = "visibility: hidden;top: -9999px;position: absolute;opacity: 0", 
                    document.documentElement.appendChild(this.tooltipMeasure);
                }
            }, {
                key: "componentWillUnmount",
                value: function() {
                    document.documentElement.removeChild(this.tooltipMeasure);
                }
            }, {
                key: "getTooltipText",
                value: function(e) {
                    return e.enabled ? "Disable in this text field" : "Enable Grammarly here";
                }
            }, {
                key: "render",
                value: function() {
                    var e, t = this.props, n = t.state, r = n.critical, o = n.plus, a = y.cs((e = {}, 
                    (0, i["default"])(e, w.hoverMenu, !0), (0, i["default"])(e, w.initial, n.initial), 
                    (0, i["default"])(e, w.premium, n.premium), (0, i["default"])(e, w.anonymous, n.anonymous), 
                    (0, i["default"])(e, w.checking, n.checking), (0, i["default"])(e, w.disabled, 0 == n.enabled), 
                    (0, i["default"])(e, w.critical, r), (0, i["default"])(e, w.plus, o), (0, i["default"])(e, w.opened, t.opened), 
                    e)), s = n.anonymous ? "Log in to enable personalized<br/>checks and other features" : "Edit in Grammarly", c = n.premium ? "See advanced corrections" : "Upgrade to make advanced corrections", l = this.getTooltipText(n);
                    return g.createElement("div", {
                        className: a,
                        style: t.style
                    }, g.createElement("div", {
                        className: w.panel
                    }, g.createElement(_.Tooltip, {
                        data: this.state.tooltip
                    }), g.createElement(v.MenuBtn, {
                        data: {
                            type: "disable",
                            size: "small",
                            text: l,
                            click: t.disableClick,
                            onTooltip: this.onTooltip
                        }
                    }), g.createElement("div", {
                        className: w.line
                    }), o ? g.createElement(v.MenuBtn, {
                        data: {
                            type: "premium",
                            size: "small",
                            text: c,
                            count: o,
                            click: t.click,
                            onTooltip: this.onTooltip
                        }
                    }) : null, g.createElement(v.MenuBtn, {
                        data: {
                            type: "grammarly",
                            actionType: "editor",
                            size: "small",
                            text: s,
                            click: t.click,
                            count: r,
                            onTooltip: this.onTooltip
                        }
                    })));
                }
            } ]), t;
        }(g.Component);
        n.HoverMenuView = k;
    }, {
        "../../dom": 207,
        "./action": 186,
        "./tooltip": 188,
        "babel-runtime/core-js/object/get-prototype-of": 24,
        "babel-runtime/helpers/classCallCheck": 31,
        "babel-runtime/helpers/createClass": 32,
        "babel-runtime/helpers/defineProperty": 33,
        "babel-runtime/helpers/inherits": 35,
        "babel-runtime/helpers/possibleConstructorReturn": 36,
        react: "react",
        "react-dom": "react-dom"
    } ],
    190: [ function(e, t, n) {
        "use strict";
        function r(e) {
            function t(e, t) {
                return t.left >= e.left && t.top >= e.top ? "se" : t.left >= e.left && t.top <= e.top ? "ne" : t.left <= e.left && t.top <= e.top ? "nw" : t.left <= e.left && t.top >= e.top ? "sw" : void 0;
            }
            function n(e, t, n, r) {
                var o = r.left + r.width + s, i = r.left - s, a = r.top + r.height + s, c = r.top - s, l = n.left - s, u = n.left + n.width + s, d = n.top - s, f = n.top + n.height + s, p = u > o ? u : o;
                return "se" === e && t.x >= l && t.x <= p && t.y >= d && t.y <= a || ("ne" === e && t.x >= l && t.x <= p && t.y >= c && t.y <= f || ("nw" === e && t.x >= i && t.x <= u && t.y >= c && t.y <= f || "sw" === e && t.x >= i && t.x <= u && t.y >= d && t.y <= a));
            }
            function r(e) {
                var t = e.getBoundingClientRect();
                return {
                    height: t.height,
                    width: t.width,
                    top: t.top,
                    left: t.left
                };
            }
            function o(e) {
                var o = r(i), s = r(a), c = t(o, s);
                return n(c, e, o, s);
            }
            var i = e.editorEl, a = e.btnEl, s = e.padding, c = {
                within: o
            };
            return c;
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.BtnPath = r;
    }, {} ],
    191: [ function(e, t, n) {
        "use strict";
        function r(e) {
            function t(e) {
                return e.ghostarea ? e.ghostarea.gh.clone.firstChild : c;
            }
            function n(e) {
                var n = d(t(e)), r = e && e.getText().trim().length;
                if (n && r > 0) return p = r, "minimize";
                var o = p - r > l, i = !p || o || 0 == r;
                return i && "maximize";
            }
            function r(e, t) {
                if (t && e != t) return t;
            }
            function a(e, t) {
                var o = e.minimize, i = e.maximize, a = e.editor, s = t ? "maximize" : "minimize";
                if (o || i) {
                    var l = f.forceMinimize && f.forceMinimize(c);
                    if (l || o && !i) return r(s, "minimize");
                    if (!a || !o && i) return r(s, "maximize");
                    var u = n(a);
                    return r(s, u);
                }
            }
            var s = e.btnEl, c = e.fieldEl, l = 200, u = s.ownerDocument, d = i.Intersect({
                btnEl: s
            }), f = o.pageStyles(u).getFixesForCurrentDomain(), p = void 0;
            return {
                get: a
            };
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var o = e("lib/sites"), i = e("./intersect");
        n.Condition = r;
    }, {
        "./intersect": 193,
        "lib/sites": 266
    } ],
    192: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        var o = e("babel-runtime/helpers/toConsumableArray"), i = r(o), a = e("babel-runtime/core-js/object/assign"), s = r(a), c = e("babel-runtime/helpers/classCallCheck"), l = r(c), u = e("babel-runtime/helpers/createClass"), d = r(u);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var f = e("lodash"), p = e("emitter"), m = e("lib/window-events"), h = e("lib/util"), g = e("lib/dom"), b = e("./position"), v = e("./condition"), _ = function() {
            function e(t) {
                var n = this, r = t.btnEl, o = t.fieldEl, i = t.sourceEl, a = t.custom, c = t.isTextarea, u = t.initCondition;
                (0, l["default"])(this, e), this.state = {
                    minimize: !1,
                    maximize: !0,
                    editor: null,
                    show: !1
                }, this.max = !0, this.windowEvents = [ {
                    paste: function() {
                        return n.debouncedUpdate();
                    },
                    resize: function() {
                        return n.update();
                    },
                    keyup: function() {
                        g.isFocused(n.fieldEl) && n.debouncedUpdate();
                    }
                }, !0 ], this.checkResize = function() {
                    try {
                        n.position && n.position.resize() && n.debouncedUpdate();
                    } catch (e) {
                        console.error(e), h.cancelInterval(n.checkResize);
                    }
                }, this.debouncedUpdate = f.debounce(function() {
                    return n.update();
                }, 50), this.update = function() {
                    if (n.state.show && n.position && (n.emit("update", {
                        visibility: "hidden"
                    }), n.emit("update", n.position.get(n.max)), n.state.editor)) {
                        var e = n.condition.get(n.state, n.max);
                        "undefined" != typeof e && (n.max = "maximize" == e, n.emit("change-state"), n.update());
                    }
                }, this.remove = function() {
                    n.listeners("off"), n.condition = null, n.position && n.position.remove(), n.position = null;
                }, this.max = u, this.state.minimize = !u, this.state.maximize = u, (0, s["default"])(this, p({
                    fieldEl: o
                })), this.position = b.Position({
                    btnEl: r,
                    sourceEl: i,
                    custom: a,
                    isTextarea: c
                }), this.condition = v.Condition({
                    btnEl: r,
                    fieldEl: o,
                    custom: a
                }), this.listeners();
            }
            return (0, d["default"])(e, [ {
                key: "set",
                value: function(e, t) {
                    this.state[e] = t, this.update();
                }
            }, {
                key: "listeners",
                value: function() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "on";
                    m[e].apply(m, (0, i["default"])(this.windowEvents));
                    var t = "on" == e ? g.on : g.off;
                    t.call(this.fieldEl, "scroll", this.debouncedUpdate);
                    var n = "on" == e ? h.interval : h.cancelInterval;
                    n(this.checkResize, 200);
                }
            } ]), e;
        }();
        n.Pos = _;
    }, {
        "./condition": 191,
        "./position": 194,
        "babel-runtime/core-js/object/assign": 20,
        "babel-runtime/helpers/classCallCheck": 31,
        "babel-runtime/helpers/createClass": 32,
        "babel-runtime/helpers/toConsumableArray": 38,
        emitter: "emitter",
        "lib/dom": 207,
        "lib/util": 288,
        "lib/window-events": 289,
        lodash: "lodash"
    } ],
    193: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o(e) {
            function t(e, t, n) {
                var r = document.createElement("div");
                r.className = t, r.style.top = e.top + "px", r.style.left = e.left + "px", r.style.height = e.height + "px", 
                r.style.width = e.width + "px", r.style.position = "absolute", r.style.border = "1px dashed red", 
                r.style.zIndex = "1000000", r.style.pointerEvents = "none", n && (r.style.borderColor = n), 
                document.body.appendChild(r);
            }
            function n(e, t) {
                return e.left + e.width > t.left && (e.bottom > t.top && e.bottom < t.bottom || e.top < t.bottom && e.top > t.top);
            }
            function r(e, r) {
                var o = document.body.scrollTop;
                return i && (0, a["default"])(document.querySelectorAll(".gr-evade")).forEach(function(e) {
                    return e.parentElement.removeChild(e);
                }), e.map(function(e) {
                    return {
                        top: e.top + o,
                        bottom: e.bottom + o,
                        left: e.left,
                        width: e.width,
                        height: e.height
                    };
                }).some(function(e) {
                    return i && t(e, "gr-evade"), n(e, r);
                });
            }
            var o = e.btnEl, i = !1, s = 2;
            return function(e) {
                var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, n = o.getBoundingClientRect();
                if (n) {
                    n = {
                        top: n.top + document.body.scrollTop - s + t,
                        bottom: n.bottom + document.body.scrollTop + s + t,
                        left: n.left - s + t,
                        width: n.width,
                        height: n.height
                    };
                    var i = document.createRange();
                    i.selectNodeContents(e);
                    var c = e.clientWidth, l = (0, a["default"])(i.getClientRects()).filter(function(e) {
                        var t = e.width;
                        return t < c;
                    });
                    return r(l, n);
                }
            };
        }
        var i = e("babel-runtime/core-js/array/from"), a = r(i);
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.Intersect = o;
    }, {
        "babel-runtime/core-js/array/from": 15
    } ],
    194: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o(e) {
            function t() {
                var e = f.getPos(m), t = e.x != j.x || e.y != j.y;
                if (x.clientWidth != m.clientWidth || x.clientHeight != m.clientHeight || t) return j = e, 
                !0;
            }
            function n() {
                if (!L) {
                    x = (0, u["default"])({
                        offsetHeight: m.offsetHeight,
                        clientWidth: m.clientWidth,
                        clientHeight: m.clientHeight
                    }, p.compStyle(m, "border-bottom-width", "border-right-width", "resize", "padding-top", "padding-bottom", "overflowX", "overflow", "padding-right"), f.getAbsRect(m)), 
                    x.resize = [ "both", "horizontal", "vertical" ].includes(x.resize);
                    var e = f.getAbsRect(l), t = e.left, n = e.top;
                    x.left += S - t, x.top += T - n, v || "scroll" == x.overflowX || "scroll" == x.overflow || (x.height = Math.max(parseInt(x.height), x.offsetHeight));
                }
            }
            function r(e) {
                if (e) return 0;
                var t = parseInt(x["padding-right"]);
                return t > 0 ? -t / 2 + 2 : -5;
            }
            function o(e, t) {
                var n = e ? w : k;
                return e ? t ? (n - x.height) / 2 : -8 : 0;
            }
            function i() {
                var e = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0], t = {
                    visibility: ""
                };
                if (g) return (0, u["default"])(t, N.btnCustomStyles ? N.btnCustomStyles(e, m) : {});
                n();
                var i = !e && x.resize ? -10 : 0, s = x.clientHeight < _, l = o(e, s) + r(e), d = e || s ? 0 : -7, f = e ? w : k, p = N.btnDiff && N.btnDiff(m, e) || [ 0, 0 ], h = (0, 
                c["default"])(p, 2), b = h[0], v = h[1], y = x.left + x.width - parseInt(x["border-right-width"]) - f + l + b, E = x.top + x.height - parseInt(x["border-bottom-width"]) - f + l + d + v + i;
                return y == S && E == T ? t : ((0, u["default"])(t, (0, a["default"])({}, C, "translate(" + y + "px, " + E + "px)")), 
                L = !0, S = y, T = E, t);
            }
            function s() {
                p.off.call(l, y, P);
            }
            var l = e.btnEl, m = e.sourceEl, h = e.custom, g = void 0 !== h && h, b = e.isTextarea, v = void 0 !== b && b, _ = 25, y = p.transitionEndEventName(), w = 22, k = 8, E = l.ownerDocument, C = p.transformProp(E), x = void 0, j = f.getPos(m), S = 0, T = 0, L = !1, N = d.pageStyles(E).getFixesForCurrentDomain(), P = function() {
                L = !1, n();
            };
            return p.on.call(l, y, P), n(), {
                get: i,
                resize: t,
                remove: s
            };
        }
        var i = e("babel-runtime/helpers/defineProperty"), a = r(i), s = e("babel-runtime/helpers/slicedToArray"), c = r(s), l = e("babel-runtime/core-js/object/assign"), u = r(l);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var d = e("lib/sites"), f = e("lib/position"), p = e("lib/dom");
        n.Position = o;
    }, {
        "babel-runtime/core-js/object/assign": 20,
        "babel-runtime/helpers/defineProperty": 33,
        "babel-runtime/helpers/slicedToArray": 37,
        "lib/dom": 207,
        "lib/position": 262,
        "lib/sites": 266
    } ],
    195: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o() {
            function e(e, n) {
                var r = s.pageStyles(e.ownerDocument).getFixesForCurrentDomain(), o = r.fieldStateForDomain && r.fieldStateForDomain(e);
                if (o) return o;
                var i = n && "IFRAME" === n.tagName, a = i ? n : e, c = [ a.getAttribute("id") || "", a.getAttribute("name") || "" ].filter(Boolean);
                return c.length || c.push(t(a)), i && c.push(n.ownerDocument.location.host || ""), 
                c.join(":");
            }
            function t(e, t) {
                return e && e.id && !t ? '//*[@id="' + e.id + '"]' : n(e);
            }
            function n(e) {
                for (var t = []; e && 1 === e.nodeType; e = e.parentNode) {
                    for (var n = 0, r = e.previousSibling; r; r = r.previousSibling) r.nodeType !== Node.DOCUMENT_TYPE_NODE && r.nodeName === e.nodeName && ++n;
                    var o = e.nodeName.toLowerCase(), i = n ? "[" + (n + 1) + "]" : "";
                    t.splice(0, 0, o + i);
                }
                return t.length ? "/" + t.join("/") : null;
            }
            function r(t, n) {
                var r = e(t, n);
                return i[r];
            }
            function o(t, n, r) {
                var o = e(t, n);
                i[o] !== r && c((0, a["default"])({}, o, r));
            }
            var i = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, c = arguments[1];
            return {
                getSelector: e,
                isFieldDisabled: r,
                changeFieldState: o
            };
        }
        var i = e("babel-runtime/helpers/defineProperty"), a = r(i);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var s = e("../sites");
        n.State = o;
    }, {
        "../sites": 266,
        "babel-runtime/helpers/defineProperty": 33
    } ],
    196: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        var o = e("babel-runtime/helpers/defineProperty"), i = r(o), a = e("babel-runtime/core-js/object/get-prototype-of"), s = r(a), c = e("babel-runtime/helpers/classCallCheck"), l = r(c), u = e("babel-runtime/helpers/createClass"), d = r(u), f = e("babel-runtime/helpers/possibleConstructorReturn"), p = r(f), m = e("babel-runtime/helpers/inherits"), h = r(m);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var g = e("lodash"), b = e("react"), v = e("../dom"), _ = e("../util"), y = {
            textarea_btn: "_e725ae-textarea_btn",
            status: "_e725ae-status",
            field_hovered: "_e725ae-field_hovered",
            btn_text: "_e725ae-btn_text",
            not_focused: "_e725ae-not_focused",
            errors_100: "_e725ae-errors_100",
            anonymous: "_e725ae-anonymous",
            show: "_e725ae-show",
            errors: "_e725ae-errors",
            checking: "_e725ae-checking",
            has_errors: "_e725ae-has_errors",
            disabled: "_e725ae-disabled",
            transform_wrap: "_e725ae-transform_wrap",
            offline: "_e725ae-offline",
            plus_only: "_e725ae-plus_only",
            minimized: "_e725ae-minimized",
            hovered: "_e725ae-hovered",
            minimize_transition: "_e725ae-minimize_transition"
        }, w = function(e) {
            function t() {
                return (0, l["default"])(this, t), (0, p["default"])(this, (t.__proto__ || (0, s["default"])(t)).apply(this, arguments));
            }
            return (0, h["default"])(t, e), (0, d["default"])(t, [ {
                key: "render",
                value: function() {
                    var e, t = this, n = this.props.state, r = n.anonymous, o = n.premium, a = n.errors.critical, s = a > 0 && !n.checking, c = !n.enabled, l = n.offline, u = g([ y.textarea_btn ]).push(v.cs((e = {}, 
                    (0, i["default"])(e, y.show, n.show), (0, i["default"])(e, y.minimized, n.minimized), 
                    (0, i["default"])(e, y.minimize_transition, n.wasMinimized), (0, i["default"])(e, y.errors, s), 
                    (0, i["default"])(e, y.has_errors, a > 0), (0, i["default"])(e, y.errors_100, a > 99), 
                    (0, i["default"])(e, y.offline, l), (0, i["default"])(e, y.checking, n.checking && !l && !c), 
                    (0, i["default"])(e, y.disabled, c), (0, i["default"])(e, y.plus_only, o && !s && n.errors.plus > 0), 
                    (0, i["default"])(e, y.anonymous, r), (0, i["default"])(e, y.hovered, n.hovered), 
                    (0, i["default"])(e, y.field_hovered, n.isFieldHovered), (0, i["default"])(e, y.not_focused, !n.fieldWasFocused), 
                    e))).join(" "), d = v.camelizeAttrs(this.props.inlineStyle), f = s && a ? a : " ", p = "Found " + a + " " + _.declension(a, [ "error", "errors" ]) + " in text";
                    return a || (p = "Protected by Grammarly"), b.createElement("div", {
                        onClick: function(e) {
                            return t.props.onViewClick(e);
                        },
                        style: d,
                        className: u
                    }, b.createElement("div", {
                        className: y.transform_wrap
                    }, b.createElement("div", {
                        title: p,
                        className: y.status
                    }, f)));
                }
            } ]), t;
        }(b.Component);
        n.ButtonComponent = w;
    }, {
        "../dom": 207,
        "../util": 288,
        "babel-runtime/core-js/object/get-prototype-of": 24,
        "babel-runtime/helpers/classCallCheck": 31,
        "babel-runtime/helpers/createClass": 32,
        "babel-runtime/helpers/defineProperty": 33,
        "babel-runtime/helpers/inherits": 35,
        "babel-runtime/helpers/possibleConstructorReturn": 36,
        lodash: "lodash",
        react: "react"
    } ],
    197: [ function(e, t, n) {
        "use strict";
        function r() {
            return a.isFacebookSite() ? s.facebookRewriteFunction : a.isJiraSite() ? c.jiraRewriteFunction : a.isBlackboardSite() ? l.blackboardRewriteFunction : null;
        }
        function o() {
            var e = r();
            e && i(document, e, []);
        }
        function i(e, t, n) {
            var r = e.createElement("script");
            n = n || [];
            var o = t.toString(), i = n.join(",");
            r.innerHTML = "(function(){(" + o + ")(" + i + ") })()", e.documentElement.appendChild(r);
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var a = e("lib/location"), s = e("./scripts/facebook"), c = e("./scripts/jira"), l = e("./scripts/blackboard");
        n.getClientScriptFunction = r, n.injectClientScriptIfNeeded = o, n.addScript = i;
    }, {
        "./scripts/blackboard": 199,
        "./scripts/facebook": 200,
        "./scripts/jira": 202,
        "lib/location": 257
    } ],
    198: [ function(e, t, n) {
        "use strict";
        function r(e) {
            if ("TEXTAREA" !== e.tagName) try {
                var t = e.ownerDocument, n = o.sanitize(e.getAttribute("data-gramm_id")), r = "document.querySelector(\"[data-gramm_id='" + n + "']\")";
                i.addScript(t, a.rewriteInnerHTML, [ r ]);
            } catch (s) {
                console.log("error rewrite " + s);
            }
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var o = e("dompurify"), i = e("./index"), a = e("./scripts/inner-html");
        n.rewriteInnerHTML = r;
    }, {
        "./index": 197,
        "./scripts/inner-html": 201,
        dompurify: "dompurify"
    } ],
    199: [ function(e, t, n) {
        "use strict";
        function r() {
            function e(e, t) {
                var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 10;
                if (e) {
                    for (;e && e !== document.body && !t(e) && n > 0; ) e = e.parentElement, n--;
                    return e && t(e);
                }
            }
            function t(t) {
                return e(t, function(e) {
                    return e.classList && e.classList.contains("editor-element");
                });
            }
            function n(e) {
                return "function" == typeof e.matches && e.matches("grammarly-card, grammarly-card *, .gr-top-zero, .gr-top-zero *");
            }
            function r(e, t) {
                var n = t && t.getAttribute("data-action");
                "editor" !== n && "login" !== n && e.focus();
            }
            function o(e) {
                var o = e.target, s = e.relatedTarget || e.explicitOriginalTarget || document.elementFromPoint(i, a);
                s && o && t(o) && n(s) && (e.stopImmediatePropagation(), r(o, s));
            }
            var i = 0, a = 0;
            document.addEventListener("blur", o, !0), document.addEventListener("DOMContentLoaded", function() {
                document.addEventListener("mousemove", function(e) {
                    i = e.clientX, a = e.clientY;
                }, !0);
            });
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.blackboardRewriteFunction = r;
    }, {} ],
    200: [ function(e, t, n) {
        "use strict";
        function r() {
            function e(e) {
                var t = {
                    target: document.activeElement,
                    _inherits_from_prototype: !0,
                    defaultPrevented: !1,
                    preventDefault: function() {}
                };
                for (var n in e) t[n] = e[n];
                return t;
            }
            function t(e, t) {
                var r = n[e];
                r && r.forEach(function(e) {
                    e(t);
                });
            }
            var n = {};
            document.addEventListener("document-paste-activeElement-gr", function(n) {
                t("paste", e({
                    clipboardData: {
                        getData: function() {
                            return n.detail || "";
                        },
                        items: [ "text/plain" ]
                    }
                }));
            }), document.addEventListener("document-mousedown-mouseup-activeElement-gr", function() {
                t("mousedown", e({
                    type: "mousedown"
                })), t("mouseup", e({
                    type: "mouseup"
                }));
            }), document.addEventListener("document-backspace-activeElement-gr", function() {
                t("keydown", e({
                    keyCode: 8,
                    which: 8,
                    charCode: 0,
                    type: "keydown"
                }));
            });
            var r = document.addEventListener.bind(document);
            document.addEventListener = function(e, t, o) {
                var i = n[e] || [];
                i.push(t), n[e] = i, r(e, t, o);
            };
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.facebookRewriteFunction = r;
    }, {} ],
    201: [ function(e, t, n) {
        "use strict";
        function r(e) {
            function t(e) {
                if (e.parentNode) if (e.childNodes.length > 1) {
                    for (var t = document.createDocumentFragment(); e.childNodes.length > 0; ) t.appendChild(e.childNodes[0]);
                    e.parentNode.replaceChild(t, e);
                } else e.firstChild ? e.parentNode.replaceChild(e.firstChild, e) : e.parentNode.removeChild(e);
            }
            function n(e) {
                if (e) try {
                    for (var n = e.querySelectorAll(".gr_"), r = n.length, o = 0; o < r; o++) t(n[o]);
                } catch (i) {}
            }
            function r(e) {
                try {
                    Object.defineProperty(e, "innerHTML", {
                        get: function() {
                            try {
                                var t = e.ownerDocument.createRange();
                                t.selectNodeContents(e);
                                var r = t.cloneContents(), o = document.createElement("div");
                                return o.appendChild(r), n(o), o.innerHTML;
                            } catch (i) {
                                return "";
                            }
                        },
                        set: function(t) {
                            try {
                                var n = e.ownerDocument.createRange();
                                n.selectNodeContents(e), n.deleteContents();
                                var r = n.createContextualFragment(t);
                                e.appendChild(r);
                            } catch (o) {}
                        }
                    });
                } catch (t) {}
            }
            if (e) {
                var o = e.cloneNode;
                e.cloneNode = function(t) {
                    var i = o.call(e, t);
                    if (e.classList.contains("mceContentBody")) i.innerHTML = e.innerHTML, n(i); else try {
                        r(i);
                    } catch (a) {}
                    return i;
                }, r(e);
            }
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.rewriteInnerHTML = r;
    }, {} ],
    202: [ function(e, t, n) {
        "use strict";
        function r() {
            function e(e) {
                var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, n = document.createEvent("CustomEvent");
                n.initCustomEvent(e + "-gr", !0, !0, t), document.dispatchEvent(n);
            }
            function t(e, t) {
                var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 10;
                if (e) {
                    for (;e && e !== document.body && !t(e) && n > 0; ) e = e.parentElement, n--;
                    return e && t(e);
                }
            }
            function n(e) {
                return t(e, function(e) {
                    return e.classList && (e.classList.contains("inline-edit-fields") || e.classList.contains("editable-field"));
                });
            }
            function r(e) {
                return "function" == typeof e.matches && e.matches("grammarly-card, grammarly-card *,.gr-top-zero, .gr-top-zero *,[class*=-onboardingPopup], [class*=-onboardingPopup] *,[class*=-onboardingDialog], [class*=-onboardingDialog] *");
            }
            function o(e, t) {
                var n = t && t.getAttribute("data-action");
                "editor" !== n && "login" !== n && e.focus();
            }
            function i(e) {
                var t = e.target, i = e.relatedTarget || e.explicitOriginalTarget || document.elementFromPoint(a, s);
                i && t && n(t) && r(i) && (e.stopImmediatePropagation(), o(t, i));
            }
            var a = 0, s = 0;
            document.addEventListener("blur", i, !0), document.addEventListener("DOMContentLoaded", function() {
                function t() {
                    return "jira" === document.body.id && document.body.getAttribute("data-version") || document.querySelector("input[type=hidden][title=JiraVersion]");
                }
                t() ? (e("jira-inline-support", {
                    activated: !0
                }), document.addEventListener("mousemove", function(e) {
                    a = e.clientX, s = e.clientY;
                }, !0)) : (e("jira-inline-support", {
                    activated: !1
                }), document.removeEventListener("blur", i, !0));
            });
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.jiraRewriteFunction = r;
    }, {} ],
    203: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
            (0, l["default"])(d.URLS, e);
        }
        function i(e, t, n) {
            var r = p[e][n] || [];
            return r && t && t.some(function(e) {
                return r.includes(e);
            });
        }
        var a = e("babel-runtime/helpers/toConsumableArray"), s = r(a), c = e("babel-runtime/core-js/object/assign"), l = r(c);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var u = e("spark-md5"), d = e("./newConfig"), f = e("./newConfig");
        n.isTestsMode = f.isTestsMode, n.getVersion = f.getVersion, n.getUpdateTime = f.getUpdateTime, 
        n.getUuid = f.getUuid, n.ENV = f.ENV, n.MIXPANEL = f.MIXPANEL, n.STATSC = f.STATSC, 
        n.GRAMMARLY_DOMAIN = f.GRAMMARLY_DOMAIN, n.DAPI = f.DAPI, n.URLS = f.URLS, n.appName = f.appName, 
        n.gnarAppName = f.gnarAppName, n.FELOG = {
            key: "b37252e300204b00ad697fe1d3b979e1",
            project: "15",
            pingTimeout: 6e5
        }, n.GNAR = {
            url: "https://gnar.grammarly.com",
            domain: ".grammarly.com"
        }, n.updateUrls = o, n.news = [ "The G logo gets out of the way when you're typing", "Switch between American and British English", "Quickly disable checking in certain types of text fields", "A fully redesigned and improved interface" ], 
        n.newsId = n.news.length && u.hash(n.news.join("\n")), n.userFields = [ "id", "email", "firstName", "anonymous", "type", "subscriptionFree", "experiments", "isTest", "premium", "settings", "registrationDate", "mimic", "groups", "extensionInstallDate", "fixed_errors", "referral" ], 
        n.userFields.push("token"), n.FEATURES = {
            EXAMPLE_FEATURE: "example_feature"
        };
        var p = {
            example_feature: {
                Free: [],
                Premium: []
            }
        };
        n.isFeatureDisabled = i, n.nextVerClass = "gr_ver_2", n.grammarlyAttrs = [ "data-gramm_editor", "data-gramm", "data-gramm_id", "gramm_editor" ], 
        n.restrictedAttrs = [].concat((0, s["default"])(n.grammarlyAttrs), [ "readonly", "pm-container", "data-synchrony", [ "class", "redactor-editor" ], [ "class", "redactor_box" ], [ "aria-label", "Search Facebook" ] ]), 
        n.restrictedParentAttrs = "[data-reactid]", n.externalEvents = [ "changed-user", "changed-plan", "changed-dialect", "cleanup", "editor-fix" ], 
        n.development = "127.0.0.1:3117" === document.location.host;
    }, {
        "./newConfig": 259,
        "babel-runtime/core-js/object/assign": 20,
        "babel-runtime/helpers/toConsumableArray": 38,
        "spark-md5": "spark-md5"
    } ],
    204: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o() {
            var e = {
                log: f._f
            };
            m.forEach(function(t) {
                e[t] = g[t];
            }), h.console = e;
        }
        function i() {
            p.on("bg-log", function(e) {
                var t;
                (t = console)[e.method].apply(t, [ "BG LOG" ].concat((0, d["default"])(e.args)));
            });
        }
        function a() {
            i();
            var e = {};
            m.concat("log").forEach(function(t) {
                e[t] = function() {
                    for (var e = arguments.length, n = Array(e), r = 0; r < e; r++) n[r] = arguments[r];
                    try {
                        b.push({
                            method: t,
                            args: n
                        }), g[t]((0, l["default"])(n));
                    } catch (o) {}
                };
            }), h.console = e;
        }
        function s() {
            var e = b.concat();
            return b.length = 0, e;
        }
        var c = e("babel-runtime/core-js/json/stringify"), l = r(c), u = e("babel-runtime/helpers/toConsumableArray"), d = r(u);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var f = e("./util"), p = e("./message"), m = [ "info", "warn", "error", "time", "timeEnd", "debug" ], h = window, g = console;
        n.disableConsoleLog = o;
        var b = [];
        n.setSeleniumCompatibility = a, n.flushLog = s;
    }, {
        "./message": 258,
        "./util": 288,
        "babel-runtime/core-js/json/stringify": 18,
        "babel-runtime/helpers/toConsumableArray": 38
    } ],
    205: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o() {
            function e(e) {
                x.innerHTML = p.sanitize(e);
                var t = x.querySelector("span.qualifier");
                return t ? (t.innerHTML = t.innerHTML.replace("(", "").replace(")", ""), t.className = v.qualifier, 
                x.innerHTML) : e;
            }
            function t(e) {
                return e.replace(/&lt;(sup|sub)&gt;(.*?)&lt;(\/sup|\/sub)&gt;/, "<$1>$2<$3>").replace(/&amp;(?=\w{1,8};)/, "&");
            }
            function r(n, r) {
                var i = {
                    ownerDocument: k,
                    getBoundingClientRect: function() {
                        return r.pos;
                    },
                    getClientRects: function() {
                        return [ r.pos ];
                    }
                };
                if (N = n, N.defs && N.defs.length) {
                    var a = l.getAbsRect(i);
                    N.title = r.el.toString(), N.defs = N.defs.splice(0, 3).map(e).map(t), T = o(!1), 
                    L = f.findDOMNode(T.component), P = l.posToRect(L, a), o();
                } else S.enable(), S.show({
                    posEl: r.el,
                    text: "No definition found"
                });
                m.on(A, !0), h.timers.start(j);
            }
            function o() {
                var e = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
                return s.renderReactWithParent(d.createElement(n.DictionaryCard, {
                    pos: P,
                    data: N,
                    visible: e,
                    className: C
                }), k.documentElement, j, "grammarly-card");
            }
            function i() {
                T && T.remove(), m.off(A, !0), I.emit("hide"), S.disable(), S.hide(), T = null;
            }
            function b(e) {
                27 == c.keyCode(e) && i();
            }
            function _(e) {
                "dictionary-card" !== document.body.className && (s.inEl(e.target, L) || i());
            }
            var y = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, w = y.doc, k = void 0 === w ? document : w, E = y.domCls, C = void 0 === E ? "" : E, x = (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, 
            k.createElement("div")), j = (0, a["default"])("DictionaryCard"), S = g.Tooltip({
                cls: s.cs("gr-notfound-tooltip", v.gr__tooltip_empty),
                enabled: !1,
                doc: k
            }), T = void 0, L = void 0, N = void 0, P = void 0, A = {
                click: _,
                keydown: b,
                scroll: i,
                resize: i
            }, I = u({
                show: r,
                hide: i,
                unescapeSuperscript: t
            });
            return I;
        }
        var i = e("babel-runtime/core-js/symbol"), a = r(i);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var s = e("./dom"), c = e("./util"), l = e("./position"), u = e("emitter"), d = e("react"), f = e("react-dom"), p = e("dompurify"), m = e("./window-events"), h = e("./timers"), g = e("./elements/tooltip"), b = e("./inline-cards/icons"), v = {
            container: "_c4f153-container",
            flip: "_c4f153-flip",
            flipSyn: "_c4f153-flipSyn",
            card: "_c4f153-card",
            bigTitle: "_c4f153-bigTitle",
            unknownWordTitle: "_c4f153-unknownWordTitle",
            btnDictLabelWithIcon: "_c4f153-btnDictLabelWithIcon",
            explanation: "_c4f153-explanation",
            replacement: "_c4f153-replacement",
            maxWidthReached: "_c4f153-maxWidthReached",
            item: "_c4f153-item",
            logoIcon: "_c4f153-logoIcon",
            ignoreIcon: "_c4f153-ignoreIcon",
            undoIcon: "_c4f153-undoIcon",
            dictionaryIcon: "_c4f153-dictionaryIcon",
            wikiIcon: "_c4f153-wikiIcon",
            footer: "_c4f153-footer",
            footerButton: "_c4f153-footerButton",
            btnIgnore: "_c4f153-btnIgnore",
            icon: "_c4f153-icon",
            btnLogo: "_c4f153-btnLogo",
            btnPersonalize: "_c4f153-btnPersonalize",
            personalizeMessage: "_c4f153-personalizeMessage",
            attn: "_c4f153-attn",
            cardAddedToDict: "_c4f153-cardAddedToDict",
            addedToDictTitle: "_c4f153-addedToDictTitle",
            dictionaryDescription: "_c4f153-dictionaryDescription",
            undo: "_c4f153-undo",
            dictLink: "_c4f153-dictLink",
            dictionaryAddedIcon: "_c4f153-dictionaryAddedIcon",
            synTitle: "_c4f153-synTitle",
            synList: "_c4f153-synList",
            synListSingle: "_c4f153-synListSingle",
            synListTitle: "_c4f153-synListTitle",
            synListNumber: "_c4f153-synListNumber",
            synSubitems: "_c4f153-synSubitems",
            synItem: "_c4f153-synItem",
            dict: "_c4f153-dict",
            dictContent: "_c4f153-dictContent",
            dictItemCounter: "_c4f153-dictItemCounter",
            dictItem: "_c4f153-dictItem",
            qualifier: "_c4f153-qualifier",
            dictFooterItem: "_c4f153-dictFooterItem",
            wiki: "_c4f153-wiki",
            gr__tooltip_empty: "gr__tooltip_empty",
            gr__tooltip: "gr__tooltip",
            "gr-notfound-tooltip": "gr-notfound-tooltip",
            "gr__tooltip-content": "gr__tooltip-content",
            "gr__tooltip-logo": "gr__tooltip-logo",
            gr__flipped: "gr__flipped"
        };
        n.DictionaryCard = d.createClass({
            displayName: "DictionaryCard",
            getDefaultProps: function() {
                return {
                    pos: {
                        rect: {
                            top: 0,
                            left: 0,
                            width: 0
                        },
                        sourceRect: {
                            width: 0
                        },
                        delta: {
                            right: 0
                        },
                        className: "",
                        visible: !1
                    }
                };
            },
            render: function() {
                var e = {}, t = this.props.pos;
                e.top = t.rect.top, e.left = t.rect.left, e.visibility = this.props.visible ? "" : "hidden";
                var n = this.props.data;
                return d.createElement("div", {
                    className: v.container,
                    style: e
                }, d.createElement("div", {
                    tabIndex: "-1",
                    className: s.cs(v.card, v.dict, t.rect.flip && v.flip)
                }, d.createElement("div", {
                    className: v.dictContent
                }, n.defs.map(function(e, t) {
                    var r = e.replace(/^([:,]\s)/, "");
                    return r = r[0].toUpperCase() + r.substring(1, r.length), d.createElement("div", {
                        key: t,
                        className: s.cs(1 == n.defs.length ? v.dictSingle : v.dictItem)
                    }, n.defs.length > 1 && d.createElement("span", {
                        className: v.dictItemCounter
                    }, t + 1, ". "), d.createElement("span", {
                        dangerouslySetInnerHTML: {
                            __html: p.sanitize(r)
                        }
                    }));
                })), d.createElement("div", {
                    className: v.footer
                }, d.createElement("div", {
                    className: s.cs(v.item, v.wiki)
                }, n.url && "wiki" === n.origin && d.createElement("a", {
                    href: encodeURI(n.url),
                    target: "_blank"
                }, d.createElement(b.WikiIcon, {
                    className: s.cs(v.icon, v.wikiIcon)
                }), " More on Wikipedia")), d.createElement("div", {
                    className: s.cs(v.item, v.dictFooterItem)
                }, d.createElement(b.LogoIcon, {
                    className: s.cs(v.icon, v.logoIcon)
                }), " Definitions by Grammarly"))));
            }
        }), o.component = n.DictionaryCard, n.Card = o;
    }, {
        "./dom": 207,
        "./elements/tooltip": 236,
        "./inline-cards/icons": 245,
        "./position": 262,
        "./timers": 276,
        "./util": 288,
        "./window-events": 289,
        "babel-runtime/core-js/symbol": 29,
        dompurify: "dompurify",
        emitter: "emitter",
        react: "react",
        "react-dom": "react-dom"
    } ],
    206: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o(e, t) {
            function n() {
                l.release(), l = null, u = null, s = null;
            }
            function r(e) {
                return d(this, void 0, void 0, a["default"].mark(function t() {
                    var n, r, l;
                    return a["default"].wrap(function(t) {
                        for (;;) switch (t.prev = t.next) {
                          case 0:
                            if (n = e.el.startContainer ? e.el.startContainer.parentNode : e.el, r = g.matchesSelector(n, ".gr-grammar-card, .gr-grammar-card *, .gr-dictionary-card, .gr-dictionary-card *"), 
                            !r || i) {
                                t.next = 3;
                                break;
                            }
                            return t.abrupt("return");

                          case 3:
                            return y = "gr-selection-anim-dict " + b.nextVerClass, _.selectionAnimator.animate(e.el, o, y), 
                            s = e, l = {}, t.prev = 7, t.next = 10, m.fetch(b.URLS.dictionary, {
                                data: (0, c["default"])({}, e.data)
                            });

                          case 10:
                            if (l = t.sent, s == e) {
                                t.next = 13;
                                break;
                            }
                            return t.abrupt("return");

                          case 13:
                            t.next = 18;
                            break;

                          case 15:
                            t.prev = 15, t.t0 = t["catch"](7), p.logger.fetchDefinitionsFail();

                          case 18:
                            _.selectionAnimator.complete(), u.show(l, e), r && _.selectionAnimator.remove();

                          case 21:
                          case "end":
                            return t.stop();
                        }
                    }, t, this, [ [ 7, 15 ] ]);
                }));
            }
            var o = e.doc, i = e.cardInspection, s = void 0, l = h.Selection(o), u = v.Card({
                doc: o
            }, t), y = void 0;
            return l.on("select", r), l.on("unselect", _.selectionAnimator.remove), u.on("hide", _.selectionAnimator.remove), 
            f({
                clear: n
            });
        }
        var i = e("babel-runtime/regenerator"), a = r(i), s = e("babel-runtime/core-js/object/assign"), c = r(s), l = e("babel-runtime/core-js/promise"), u = r(l), d = function(e, t, n, r) {
            return new (n || (n = u["default"]))(function(o, i) {
                function a(e) {
                    try {
                        c(r.next(e));
                    } catch (t) {
                        i(t);
                    }
                }
                function s(e) {
                    try {
                        c(r["throw"](e));
                    } catch (t) {
                        i(t);
                    }
                }
                function c(e) {
                    e.done ? o(e.value) : new n(function(t) {
                        t(e.value);
                    }).then(a, s);
                }
                c((r = r.apply(e, t || [])).next());
            });
        };
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var f = e("emitter"), p = e("./tracking"), m = e("./request"), h = e("./selection"), g = e("./dom"), b = e("./config"), v = e("./dictionary-card"), _ = e("./selection-animator");
        n.Dictionary = o;
    }, {
        "./config": 203,
        "./dictionary-card": 205,
        "./dom": 207,
        "./request": 263,
        "./selection": 265,
        "./selection-animator": 264,
        "./tracking": 282,
        "babel-runtime/core-js/object/assign": 20,
        "babel-runtime/core-js/promise": 28,
        "babel-runtime/regenerator": 42,
        emitter: "emitter"
    } ],
    207: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o(e, t) {
            var n = (t || document).createElement("div");
            return n.innerHTML = e.trim(), n.firstElementChild;
        }
        function i(e, t, n) {
            var r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "div", o = t[n] || {};
            t[n] = o, o.el || (o.el = t.ownerDocument.createElement(r), t.appendChild(o.el));
            var i = le.render(e, o.el);
            return o.remove || (o.remove = function() {
                delete t[n], t.removeChild(o.el), le.unmountComponentAtNode(o.el);
            }), {
                component: i,
                remove: o.remove,
                el: o.el
            };
        }
        function a(e, t) {
            for (var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1e3, r = 0; e.parentNode && r < n; ) {
                if ("string" != typeof t && t == e) return !0;
                if (e.id == t || e == t) return !0;
                e = e.parentNode;
            }
            return !1;
        }
        function s(e, t) {
            return !(!e || void 0 == e.className) && e.classList.contains(t);
        }
        function c(e, t) {
            if (e && e.classList) return e.classList.remove(t);
        }
        function l(e, t) {
            if (e) {
                if (t.indexOf(" ") == -1) return e.classList.add(t);
                t = t.split(" ");
                for (var n = 0; n < t.length; n++) e.classList.add(t[n]);
            }
        }
        function u(e, t, n) {
            t ? l(e, n) : c(e, n);
        }
        function d(e, t) {
            for (;e = e.parentNode; ) if (m(e, t)) return e;
            return !1;
        }
        function f(e) {
            for (;e = e.parentNode; ) if (p(e)) return e;
            return !1;
        }
        function p(e) {
            return "true" == e.contentEditable || "plaintext-only" == e.contentEditable;
        }
        function m(e, t) {
            return !!e && (e.matches ? e.matches(t) : e.matchesSelector ? e.matchesSelector(t) : e.webkitMatchesSelector ? e.webkitMatchesSelector(t) : e.mozMatchesSelector ? e.mozMatchesSelector(t) : window.$ && window.$.is ? window.$(e).is(t) : void 0);
        }
        function h(e) {
            return document.activeElement && "IFRAME" == document.activeElement.tagName ? e === e.ownerDocument.activeElement : document.activeElement && "BODY" == document.activeElement.tagName ? e === document.activeElement : e === document.activeElement;
        }
        function g(e, t, n, r) {
            var o = arguments.length > 4 && void 0 !== arguments[4] && arguments[4];
            if (e) {
                if (ce.isObject(t)) return ce.each(t, function(t, n) {
                    g(e, n, t, r);
                });
                var i = r ? "removeEventListener" : "addEventListener", a = e[de] || [];
                return e[de] = a, r ? e[de] = a.filter(function(e) {
                    return !(e.event == t && e.cb == n);
                }) : a.push({
                    event: t,
                    cb: n
                }), e[i](t, n, o), {
                    el: e,
                    event: t,
                    cb: n,
                    bubble: o
                };
            }
        }
        function b(e, t, n, r) {
            return !t && e[de] ? e[de].each(function(t) {
                return b(e, t.event, t.cb, t.bubble);
            }) : void g(e, t, n, !0, r);
        }
        function v() {
            for (var e = this, t = arguments.length, n = Array(t), r = 0; r < t; r++) n[r] = arguments[r];
            return this.addEventListener.apply(this, n), {
                off: function() {
                    return _.apply(e, n);
                }
            };
        }
        function _() {
            this.removeEventListener.apply(this, arguments);
        }
        function y(e, t) {
            var n = this, r = function o(r) {
                t(r), _.call(n, e, o);
            };
            v.call(this, e, r);
        }
        function w(e, t) {
            var n = document.createEvent("CustomEvent");
            n.initCustomEvent(e, !0, !0, t), this.dispatchEvent(n);
        }
        function k(e) {
            var t = getComputedStyle(e, null), n = "none" != t.getPropertyValue("display") && "hidden" != t.getPropertyValue("visibility") && e.clientHeight > 0;
            return n;
        }
        function E() {
            for (var e = arguments.length, t = Array(e), n = 0; n < e; n++) t[n] = arguments[n];
            return t.reduce(function(e, t) {
                return e.concat(ce.isObject(t) ? (0, se["default"])(t).filter(function(e) {
                    return t[e];
                }) : t);
            }, []).filter(function(e) {
                return Boolean(e);
            }).join(" ");
        }
        function C(e, t) {
            return "number" != typeof t || fe[S(e)] ? t : t + "px";
        }
        function x(e) {
            return e.replace(/-+(.)?/g, function(e, t) {
                return t ? t.toUpperCase() : "";
            });
        }
        function j(e) {
            return ce.transform(e, function(e, t, n) {
                return e[x(n)] = t;
            });
        }
        function S(e) {
            return e.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase();
        }
        function T(e, t, n) {
            if (arguments.length < 3) {
                var r = e;
                if (!r) return;
                var o = getComputedStyle(r, "");
                if ("string" == typeof t) return r.style[x(t)] || o.getPropertyValue(t);
                if (ce.isArray(t)) {
                    var i = {};
                    return ce.each(t, function(e, t) {
                        i[x(e)] = r.style[x(e)] || o.getPropertyValue(e);
                    }), i;
                }
            }
            var a = "";
            if (ce.isString(t)) n || 0 === n ? a = S(t) + ":" + C(t, n) : e.style.removeProperty(S(t)); else for (var s in t) t[s] || 0 === t[s] ? a += S(s) + ":" + C(s, t[s]) + ";" : e.style.removeProperty(S(s));
            return e.style.cssText += ";" + a;
        }
        function L(e, t) {
            if (t && e) {
                var n = T(e, (0, se["default"])(t));
                return T(e, t), function() {
                    return T(e, n);
                };
            }
        }
        function N(e, t) {
            for (;e = e.parentNode; ) if (e.tagName == t) return e;
            return !1;
        }
        function P(e, t, n) {
            for (;e = e.parentNode; ) if (e.dataset && e.dataset[t] && e.dataset[t] == n) return e;
        }
        function A(e, t) {
            return s(e, t) ? e : I(e, t);
        }
        function I(e, t) {
            for (;e = e.parentNode; ) if (s(e, t)) return e;
            return !1;
        }
        function M(e, t) {
            if (!e) return !1;
            for (;e.parentNode; ) {
                if (s(e, t)) return e;
                e = e.parentNode;
            }
            return !1;
        }
        function O() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1;
            return e ? O.call(this.parentNode, --e) : this;
        }
        function R(e, t) {
            if (!e) return !1;
            for (;e.parentNode; ) {
                if (t == e.parentNode) return e;
                e = e.parentNode;
            }
            return !1;
        }
        function D(e, t) {
            var n = t.parentNode;
            n.lastChild == t ? n.appendChild(e) : n.insertBefore(e, t.nextSibling);
        }
        function F(e, t) {
            t.parentNode.insertBefore(e, t);
        }
        function B(e, t) {
            for (t = t || document; e; ) {
                if (e == t) return !0;
                e = e.parentNode;
            }
            return !1;
        }
        function W(e) {
            var t = void 0, n = void 0, r = void 0, o = {
                ctrl: !1,
                meta: !1,
                shift: !1,
                alt: !1
            };
            e = ce.extend(o, e);
            try {
                t = e.el.ownerDocument.createEvent("KeyEvents"), n = e.el.ownerDocument.defaultView, 
                r = ue.keyCode(e), t.initKeyEvent(e.type, !0, !0, n, e.ctrl, e.alt, e.shift, e.meta, r, r);
            } catch (i) {
                t = e.el.ownerDocument.createEvent("UIEvents"), t.initUIEvent(e.name, !0, !0, window, 1), 
                t.keyCode = r, t.which = r, t.charCode = r, t.ctrlKey = e.ctrl, t.altKey = e.alt, 
                t.shiftKey = e.shift, t.metaKey = e.metaKey;
            }
            e.el.dispatchEvent(t);
        }
        function U(e) {
            return "undefined" != typeof e.hidden ? e.hidden : "undefined" != typeof e.mozHidden ? e.mozHidden : "undefined" != typeof e.webkitHidden ? e.webkitHidden : "undefined" != typeof e.msHidden && e.msHidden;
        }
        function G(e) {
            return "undefined" != typeof e.hidden ? "visibilitychange" : "undefined" != typeof e.mozHidden ? "mozvisibilitychange" : "undefined" != typeof e.webkitHidden ? "webkitvisibilitychange" : "undefined" != typeof e.msHidden && "msvisibilitychange";
        }
        function z() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : document;
            return "undefined" != typeof e.body.style.transform ? "transform" : "undefined" != typeof e.body.style.WebkitTransform ? "WebkitTransform" : "undefined" != typeof e.body.style.MozTransform ? "MozTransform" : void 0;
        }
        function V(e) {
            if (e) {
                var t = e.ownerDocument;
                if (t) {
                    var n = t.defaultView || window;
                    if (n) {
                        var r = n.getComputedStyle(e, null);
                        if (r) {
                            for (var o = arguments.length, i = Array(o > 1 ? o - 1 : 0), a = 1; a < o; a++) i[a - 1] = arguments[a];
                            return 1 == i.length ? r.getPropertyValue(i[0]) : i.reduce(function(e, t) {
                                return (0, ie["default"])({}, e, (0, re["default"])({}, t, r.getPropertyValue(t)));
                            }, {});
                        }
                    }
                }
            }
        }
        function H(e) {
            return e.split(" ").map(function(e) {
                return "." != e[0] ? "." + e : e;
            }).join("").trim();
        }
        function q(e) {
            for (var t = arguments.length, n = Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++) n[r - 1] = arguments[r];
            if (n.length > 0) {
                var o = [];
                return o.push(q(e)), n.forEach(function(e) {
                    return o.push(q(e));
                }), o.join(", ");
            }
            return e = e.split(", ").map(function(e) {
                return "." != e[0] ? "." + e : e;
            }).join(", ").trim(), e + ", " + e + " *";
        }
        function Y(e, t) {
            if (t == e) return !0;
            if (!e.children) return !1;
            for (var n = 0; n < e.children.length; n++) if (Y(e.children[n], t)) return !0;
            return !1;
        }
        function K(e, t) {
            var n = function(n) {
                n.map(function(n) {
                    if (0 != n.removedNodes.length) for (var o = n.removedNodes, i = o.length, a = 0; a < i; a++) {
                        var s = o[a];
                        (s.contains && s.contains(e) || Y(s, e)) && (r.disconnect(), t());
                    }
                });
            }, r = new MutationObserver(n);
            r.observe(e.ownerDocument.body, {
                childList: !0,
                subtree: !0
            });
        }
        function X() {
            var e = void 0, t = document.createElement("fakeelement"), n = {
                animation: "animationend",
                MozAnimation: "animationend",
                WebkitAnimation: "webkitAnimationEnd"
            };
            for (e in n) if (void 0 != t.style[e]) return n[e];
        }
        function Q() {
            var e = void 0, t = document.createElement("fakeelement"), n = {
                transition: "transitionend",
                MozTransition: "transitionend",
                WebkitTransition: "webkitTransitionEnd"
            };
            for (e in n) if (n.hasOwnProperty(e) && void 0 !== t.style[e]) return n[e];
        }
        function J(e) {
            if ("undefined" != typeof GR_INLINE_STYLES) {
                var t = e.createElement("style");
                t.innerHTML = GR_INLINE_STYLES;
                try {
                    e.querySelector("head").appendChild(t);
                } catch (n) {
                    console.log("can't append style", n);
                }
            }
        }
        function $(e, t) {
            e.setAttribute("data-gramm_id", t), e.setAttribute("data-gramm", !0);
        }
        function Z(e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, n = document.createEvent("CustomEvent");
            n.initCustomEvent(e + "-gr", !0, !0, t), document.dispatchEvent(n);
        }
        function ee(e, t) {
            var n = e.getSelection();
            n.removeAllRanges(), n.addRange(t);
        }
        function te(e, t) {
            var n = e.createRange();
            n.setStart(t.anchorNode, t.anchorOffset), n.setEnd(t.focusNode, t.focusOffset), 
            ee(e, n);
        }
        var ne = e("babel-runtime/helpers/defineProperty"), re = r(ne), oe = e("babel-runtime/core-js/object/assign"), ie = r(oe), ae = e("babel-runtime/core-js/object/keys"), se = r(ae);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var ce = e("lodash"), le = e("react-dom"), ue = e("./util");
        n.createEl = o, n.renderReactWithParent = i, n.inEl = a, n.hasClass = s, n.removeClass = c, 
        n.addClass = l, n.toggleClass = u, n.getParentBySel = d, n.parentIsContentEditable = f, 
        n.isContentEditable = p, n.matchesSelector = m, n.isFocused = h;
        var de = ue.guid();
        n.listen = g, n.unlisten = b, n.on = v, n.off = _, n.once = y, n.emit = w, n.isVisible = k, 
        n.cs = E, n.maybeAddPx = C, n.camelize = x, n.camelizeAttrs = j, n.dasherize = S;
        var fe = {
            "column-count": 1,
            columns: 1,
            "font-weight": 1,
            "line-height": 1,
            opacity: 1,
            "z-index": 1,
            zoom: 1
        };
        n.css = T, n.setCustomCss = L, n.getParentByTag = N, n.getParentByData = P, n.resolveEl = A, 
        n.getParent = I, n.parentHasClass = M, n.getParentByDepth = O, n.isParent = R, n.insertAfter = D, 
        n.insertBefore = F, n.elementInDocument = B, n.runKeyEvent = W, n.docHidden = U, 
        n.visibilityEvent = G, n.transformProp = z, n.compStyle = V, n.classSelector = H, 
        n.selectorAll = q, n.nodeInTree = Y, n.watchNodeRemove = K, n.whichAnimationEndEvent = X, 
        n.transitionEndEventName = Q, n.addIframeCss = J, n.setGRAttributes = $, n.emitDomEvent = Z, 
        n.addRange = ee, n.setDomRange = te;
    }, {
        "./util": 288,
        "babel-runtime/core-js/object/assign": 20,
        "babel-runtime/core-js/object/keys": 25,
        "babel-runtime/helpers/defineProperty": 33,
        lodash: "lodash",
        "react-dom": "react-dom"
    } ],
    208: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o(e) {
            function t() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "on";
                v[e]("beforeunload", J), f[e]("editor-set-state", I, onerror), f[e]("dialog-closed", M), 
                f[e]("focus-editor", O), f[e]("after-refresh-dialog", F), de[e]("track", k.track), 
                de[e]("fix", re), de[e]("serviceState", A), de[e]("addedSynonym", L), de[e]("afterReplace", i), 
                de.dom[e]("badCursorPositionRetryFail", m.logger.cursorJump), de.dom[e]("badCursorPosition", m.logger.badCursorPosition), 
                de[e]("iframe-mousemove", N), o(!0);
                var t = "on" == e ? y.listen : y.unlisten;
                t(be, y.visibilityEvent(be), V), t(be, "grammarly:reset", P), pe && t(be.documentElement, "mousemove", s), 
                Z.card && (Z.card[e]("show", x), Z.card[e]("hide", j), Z.card[e]("toeditor", S), 
                Z.card[e]("addtodict", T));
            }
            function n() {
                d.timers.start($ + "run"), t("on"), ve(), b.rewriteInnerHTML(fe), de.getText() && de.emit("sending"), 
                Q(ne.enabledDefs), he && B();
            }
            function r(e) {
                var t = e.user, n = e.page;
                ae = n.dialectStrong || n.dialectWeak, o(), se = t.anonymous, Q(n.enabledDefs);
            }
            function o(e) {
                ae || ce ? ce && (ae || e) && de.off("finished", E) : (ce = !0, de.on("finished", E));
            }
            function i(e) {
                Array.isArray(ne.afterReplaceEvents) && ne.afterReplaceEvents.forEach(function(e) {
                    return y.emit.call(fe, e);
                });
                try {
                    var t = document.createEvent("HTMLEvents");
                    t.initEvent("input", !1, !0), de.el.dispatchEvent(t);
                } catch (t) {}
                return e && e.remove();
            }
            function s(e) {
                de.emit("iframe-mousemove", e);
            }
            function E(e) {
                var t = e.dialect;
                t && "undefined" !== t && (oe(t), ae = t, o());
            }
            function C(e) {
                e && de.setState(e), de.api.ws.reconnect();
            }
            function x(e) {
                var t = de.matches.byId(e);
                t && (de.emit("context"), t.editorId = de.id, t.select(), Z.card.setData(t));
            }
            function j() {
                D();
            }
            function S(e) {
                e == de.id && (de.showDialog({
                    caller: "card"
                }), d.timers.start("open_editor"));
            }
            function T(e) {
                e.match.editorId == de.id && (se ? (e.hide(), de.showDialog({
                    caller: "card"
                })) : e.match.addToDict());
            }
            function L(e) {
                e.editorId = de.id, Z.card.showSynonyms(e);
            }
            function N(e) {
                Z.card.setOuterIframe(ge);
            }
            function P() {
                console.log("reseting capi session..."), C();
            }
            function A(e) {
                if ("capi" == e.type) return e.available ? void (he && U()) : B("Error checking is temporarily unavailable");
            }
            function I(e) {
                e.editorId == de.id && (de.setState(e), _e && (_e = !1, J()));
            }
            function M(e) {
                e == de.id && (D(), de.isHtmlGhost || R());
            }
            function O(e) {
                e == de.id && R();
            }
            function R() {
                de.srcEl.focus();
            }
            function D() {
                de.selectedMatch && (Z.card.removeLoading(de.selectedMatch.getEl()), de.selectedMatch.deselect());
            }
            function F(e) {
                e.editorId == de.id && C(e);
            }
            function B() {
                he = !0, de.clearData(), de.api.close(), de.render();
            }
            function W() {
                return he;
            }
            function U() {
                he = !1, C();
            }
            function G() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, t = e.caller, n = {
                    data: de.getState(),
                    caller: t
                };
                Z.dialog.preActivate(), de.emit("show-dialog"), y.emitDomEvent("show-dialog"), f.emitFocusedTab("show-dialog", n);
            }
            function z() {
                var e = fe.ownerDocument.createRange();
                e.selectNodeContents(fe);
                var t = e.cloneContents(), n = document.createElement("div");
                n.appendChild(t);
                for (var r = n.querySelectorAll("img"), o = r.length, i = 0; i < o; i++) r[i].src = r[i].src;
                return n.innerHTML;
            }
            function V() {
                return y.docHidden(be) ? Y() : void K();
            }
            function H(e) {
                return he ? [] : e.filter(function(e) {
                    return e.free && !e.hidden;
                });
            }
            function q(e) {
                return !!y.matchesSelector(e, ".b-card.Synonyms .btn-close") || !y.matchesSelector(e, ".b-card.Synonyms, .b-card.Synonyms *");
            }
            function Y() {}
            function K() {}
            function X() {
                var e = de.getMatches();
                return {
                    critical: e.filter(function(e) {
                        return e.free && e.inDom;
                    }).length,
                    plus: e.filter(function(e) {
                        return !e.free;
                    }).length
                };
            }
            function Q(e) {
                de.enabledSynonyms != e && (de.enabledSynonyms = e, de.synonyms[e ? "fieldEnable" : "disable"]());
            }
            function J(e) {
                if (!me || e) {
                    me = !0;
                    var n = de.dom.getCleanHtml && de.dom.getCleanHtml();
                    if (n && (de.el.innerHTML = n), t("off"), de.exit(), console.log("exit"), fe.removeAttribute && _.restrictedAttrs.forEach(fe.removeAttribute.bind(fe)), 
                    pe && _.restrictedAttrs.forEach(de.srcEl.removeAttribute.bind(de.srcEl)), fe.setAttribute("spellcheck", !0), 
                    h.isHtmlGhostSite()) {
                        var r = fe.parentElement && fe.parentElement.parentElement;
                        r && r.removeAttribute("spellcheck");
                    }
                    de.emit("exit");
                }
            }
            var $ = (e.el || e.srcEl).getAttribute("gramm_id") || p.guid(), Z = e.app, ee = e.user, te = e.actions, ne = e.page, re = te.incFixed, oe = te.changeWeakDialect, ie = e.editorType.htmlghost, ae = ne.dialectStrong || ne.dialectWeak, se = ee.anonymous, ce = void 0;
            (0, c["default"])(e, {
                capiUrl: _.URLS.capi,
                createWs: u.Socket,
                docid: $,
                textareaWrapSelector: '[gramm_id="' + $ + '"]',
                animatorContainer: e.el.ownerDocument.documentElement,
                getAnimatorElPos: g.getAbsRect,
                updateTextareaHeight: p._f,
                dialect: ae,
                exposeRawMatch: !0,
                canRemoveSynonym: q,
                filter: H,
                getContainerId: function() {
                    return f.promiseBackground("get-containerIdOrUndefined").then(function(e) {
                        return e ? e : a["default"].reject();
                    });
                }
            });
            var le = p.getBrowser(), ue = "other" === le ? "extension" : "extension_" + le;
            (0, c["default"])(l.Capi, {
                CLIENT_NAME: ue,
                clientVersion: _.getVersion(),
                extDomain: ne.domain
            }), ie && (e.dom = w.HtmlGhostDom), l.MatchPositions = function() {
                return {
                    generateMatchPositions: p._f
                };
            }, e.matchPrefix = _.nextVerClass;
            var de = l(e), fe = de.el, pe = e.posSourceEl && "IFRAME" == e.posSourceEl.tagName, me = !1, he = !e.connection.online, ge = e.srcEl || fe, be = fe.ownerDocument, ve = de.run, _e = !1;
            (0, c["default"])(de, {
                id: $,
                srcEl: ge,
                camouflage: p._f,
                isHtmlGhost: ie,
                run: n,
                errorData: X,
                showDialog: G,
                isOffline: W,
                offline: B,
                online: U,
                updateState: r,
                outerIframe: e.outerIframe,
                cleanupText: p._f,
                activate: p._f,
                toggleBtn: p._f,
                remove: J,
                reset: C
            });
            var ye = de.getMatchClass;
            return de.getMatchClass = function(e, t) {
                var n = ye(e, t);
                return n += " gr_inline_cards", n += e.renderedOnce || p.isSafari() ? " gr_disable_anim_appear" : " gr_run_anim", 
                e.renderedOnce = !0, n;
            }, de.dom.changeSelection = p._f, de.matches.fromReplaced = de.matches.fromReplace = de.matches.byId, 
            de.current = de.getFiltered, de.started = !1, de.el.setAttribute("data-gramm_editor", !0), 
            de.getHtml && (de.getHtml = z), de;
        }
        var i = e("babel-runtime/core-js/promise"), a = r(i), s = e("babel-runtime/core-js/object/assign"), c = r(s);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var l = e("grammarly-editor"), u = e("../socket"), d = e("../timers"), f = e("../message"), p = e("../util"), m = e("../tracking"), h = (e("../benchmark"), 
        e("lib/ghost/html-ghost-locator")), g = e("../position"), b = e("../client-script/inner-html"), v = e("../window-events"), _ = e("../config"), y = e("../dom"), w = e("../ghost/html-ghost"), k = e("./track");
        n.Editor = o;
    }, {
        "../benchmark": 177,
        "../client-script/inner-html": 198,
        "../config": 203,
        "../dom": 207,
        "../ghost/html-ghost": 243,
        "../message": 258,
        "../position": 262,
        "../socket": 269,
        "../timers": 276,
        "../tracking": 282,
        "../util": 288,
        "../window-events": 289,
        "./track": 210,
        "babel-runtime/core-js/object/assign": 20,
        "babel-runtime/core-js/promise": 28,
        "grammarly-editor": "grammarly-editor",
        "lib/ghost/html-ghost-locator": 242
    } ],
    209: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o(e) {
            var t, n = e.app, r = e.doc, o = e.type, i = e.field, c = e.connection, l = e.page, u = e.user, f = e.actions;
            return n.elements = n.elements || p.initElements({
                app: n,
                doc: r,
                user: u,
                actions: f
            }), "iframe" == o ? s(n, i, c, l, u, f) : a(n, i, (t = {}, (0, d["default"])(t, o, !0), 
            (0, d["default"])(t, "value", o), t), c, l, u, f);
        }
        function i(e, t) {
            if (m.setGRAttributes(e, t), e.setAttribute("spellcheck", !1), h.isHtmlGhostSite()) {
                var n = e.parentElement && e.parentElement.parentElement;
                n && n.setAttribute("spellcheck", !1);
            }
        }
        function a(e, t, n, r, o, a, s) {
            function c(t) {
                var c = t.el, l = t.id;
                return i(c, l), g.Editor({
                    id: l,
                    el: c,
                    app: e,
                    connection: r,
                    page: o,
                    user: a,
                    actions: s,
                    editorType: n
                });
            }
            var u = {
                el: t,
                id: f.guid()
            };
            return "contenteditable" == n.value ? c((0, l["default"])({}, u)) : b.GhostArea((0, 
            l["default"])({}, u, {
                createEditor: c
            }));
        }
        function s(e, t, n, r, o, a) {
            var s = f.guid(), c = t.contentDocument, l = c.body;
            return i(t, s), t.setAttribute("gramm-ifr", !0), m.addIframeCss(c), i(l, s), t.style.height = t.style.height || getComputedStyle(t).height, 
            g.Editor({
                el: l,
                app: e,
                connection: n,
                page: r,
                user: o,
                actions: a,
                srcEl: t,
                posSourceEl: t,
                editorType: {
                    contenteditable: !0,
                    value: "contenteditable"
                }
            });
        }
        var c = e("babel-runtime/core-js/object/assign"), l = r(c), u = e("babel-runtime/helpers/defineProperty"), d = r(u);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var f = e("../util"), p = e("../elements"), m = e("../dom"), h = e("lib/ghost/html-ghost-locator"), g = e("./editor"), b = e("../ghost/ghostarea");
        n.CreateEditor = o;
    }, {
        "../dom": 207,
        "../elements": 216,
        "../ghost/ghostarea": 241,
        "../util": 288,
        "./editor": 208,
        "babel-runtime/core-js/object/assign": 20,
        "babel-runtime/helpers/defineProperty": 33,
        "lib/ghost/html-ghost-locator": 242
    } ],
    210: [ function(e, t, n) {
        "use strict";
        function r(e) {
            var t = (e.type, e.key), n = (e.value, e.data);
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.track = r;
    }, {} ],
    211: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o(e, t) {
            if (e) {
                if (!e.length) return e;
                if (1 == e.length || !t) return e[0];
                var n = t.pageX || t.clientX, r = t.pageY || t.clientY, o = void 0;
                return e.forEach(function(e) {
                    var t = e.top, i = e.left, a = e.width, s = e.height;
                    r >= t && r <= t + s && n >= i && n <= i + a && (o = e);
                }), o || e[0];
            }
        }
        var i = e("babel-runtime/core-js/symbol"), a = r(i), s = e("babel-runtime/core-js/object/get-prototype-of"), c = r(s), l = e("babel-runtime/helpers/classCallCheck"), u = r(l), d = e("babel-runtime/helpers/createClass"), f = r(d), p = e("babel-runtime/helpers/possibleConstructorReturn"), m = r(p), h = e("babel-runtime/helpers/inherits"), g = r(h);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var b = e("react"), v = e("react-dom"), _ = e("emitter"), y = e("../timers"), w = e("../util"), k = e("../window-events"), E = e("../tracking"), C = e("../position"), x = e("../dom"), j = e("./hint"), S = e("./tooltip"), T = e("../inline-cards"), L = {
            container: "_c4f153-container",
            flip: "_c4f153-flip",
            flipSyn: "_c4f153-flipSyn",
            card: "_c4f153-card",
            bigTitle: "_c4f153-bigTitle",
            unknownWordTitle: "_c4f153-unknownWordTitle",
            btnDictLabelWithIcon: "_c4f153-btnDictLabelWithIcon",
            explanation: "_c4f153-explanation",
            replacement: "_c4f153-replacement",
            maxWidthReached: "_c4f153-maxWidthReached",
            item: "_c4f153-item",
            logoIcon: "_c4f153-logoIcon",
            ignoreIcon: "_c4f153-ignoreIcon",
            undoIcon: "_c4f153-undoIcon",
            dictionaryIcon: "_c4f153-dictionaryIcon",
            wikiIcon: "_c4f153-wikiIcon",
            footer: "_c4f153-footer",
            footerButton: "_c4f153-footerButton",
            btnIgnore: "_c4f153-btnIgnore",
            icon: "_c4f153-icon",
            btnLogo: "_c4f153-btnLogo",
            btnPersonalize: "_c4f153-btnPersonalize",
            personalizeMessage: "_c4f153-personalizeMessage",
            attn: "_c4f153-attn",
            cardAddedToDict: "_c4f153-cardAddedToDict",
            addedToDictTitle: "_c4f153-addedToDictTitle",
            dictionaryDescription: "_c4f153-dictionaryDescription",
            undo: "_c4f153-undo",
            dictLink: "_c4f153-dictLink",
            dictionaryAddedIcon: "_c4f153-dictionaryAddedIcon",
            synTitle: "_c4f153-synTitle",
            synList: "_c4f153-synList",
            synListSingle: "_c4f153-synListSingle",
            synListTitle: "_c4f153-synListTitle",
            synListNumber: "_c4f153-synListNumber",
            synSubitems: "_c4f153-synSubitems",
            synItem: "_c4f153-synItem",
            dict: "_c4f153-dict",
            dictContent: "_c4f153-dictContent",
            dictItemCounter: "_c4f153-dictItemCounter",
            dictItem: "_c4f153-dictItem",
            qualifier: "_c4f153-qualifier",
            dictFooterItem: "_c4f153-dictFooterItem",
            wiki: "_c4f153-wiki",
            gr__tooltip_empty: "gr__tooltip_empty",
            gr__tooltip: "gr__tooltip",
            "gr-notfound-tooltip": "gr-notfound-tooltip",
            "gr__tooltip-content": "gr__tooltip-content",
            "gr__tooltip-logo": "gr__tooltip-logo",
            gr__flipped: "gr__flipped"
        }, N = {}, P = function(e) {
            function t() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, n = e.doc, r = void 0 === n ? document : n, o = e.domCls, i = void 0 === o ? "" : o, s = e.experiments, l = void 0 === s ? {} : s, d = e.isAnonymous, f = void 0 !== d && d;
                (0, u["default"])(this, t);
                var p = (0, m["default"])(this, (t.__proto__ || (0, c["default"])(t)).call(this));
                return p.show = function(e, t) {
                    return p.emit("show", e.id), p.updatePos(e, t), y.timers.start(N.id), p;
                }, p.hide = function() {
                    if (N.hint.visible) {
                        N.container.el.style.display = "none", p.setState({
                            animate: !1,
                            visible: !1,
                            match: {}
                        }), N.notfound.disable(), N.notfound.hide(), p.emit("hide", p.match), p.removeLoading(N.hint.currentEl);
                        y.timers.stop(N.id);
                        return p.match = null, N.container.el.style.display = "", p;
                    }
                }, p.animHide = function() {
                    return p.setState({
                        animate: !0
                    }), x.once.call(N.el, x.whichAnimationEndEvent(), p.hide), p;
                }, p.openEditor = function() {
                    p.removeLoading(N.hint.currentEl), p.emit("toeditor", p.match.editorId), p.hide();
                }, p.animateReplacement = function(e, t, n) {
                    p.emit("animateReplacement", {
                        matchId: e,
                        replacement: t,
                        visibleReplacement: n
                    });
                }, p.addToDict = function() {
                    p.setState({
                        addedToDict: !0
                    }), p.emit("addtodict", {
                        match: p.match,
                        hide: p.hide,
                        animHide: p.animHide
                    });
                }, p.inTarget = function(e) {
                    var t = e.target, n = e.clientX, r = e.clientY, o = e.detail, i = N.hint.currentEl, a = (x.parentHasClass(t, N.cls) || x.hasClass(t, N.cls)) && !x.hasClass(i, "g-selection-anim"), s = p.elementsFromPoint(n, r).some(function(e) {
                        return x.hasClass(e, N.cls);
                    });
                    return !(!s || !N.hint.visible || 1 != o) || (a ? i && i != t ? (N.hint.fastHide(), 
                    void p.removeLoading(i)) : (p.addLoading(t), !0) : void (!N.hint.visible && i && p.removeLoading(i)));
                }, p.addLoading = function(e) {
                    return !x.hasClass(e, N.pCls) && x.addClass(e, N.pCls);
                }, p.removeLoading = function(e) {
                    x.hasClass(e, N.pCls) && x.removeClass(e, N.pCls), x.hasClass(e, "g-selection-anim") && e.parentNode && e.parentNode.removeChild(e);
                }, p.showSynonyms = function(e) {
                    return e.animEl && 0 != e.animEl.getClientRects().length ? (N.hint.currentEl && p.hide(), 
                    N.hint.currentEl = e.animEl, 0 == e.synonyms.meanings.length ? (N.notfound.enable(), 
                    N.notfound.show({
                        posEl: e.animEl,
                        text: "No synonyms found",
                        outerIframe: N.iframe
                    })) : (p.setData(e), p.updatePos(e.animEl), p.setState({
                        visible: !0
                    })), N.hint.setVisible(!0), y.timers.start(N.id), p) : p;
                }, p.setOuterIframe = function(e) {
                    var t = e.contentDocument;
                    !e || t && e == N.iframe || (N.iframe = e, N.hint.setDocs(N.doc, t));
                }, p.experiments = l, p.isAnonymous = f, N = {
                    id: (0, a["default"])("GrammarCard"),
                    notfound: S.Tooltip({
                        cls: x.cs("gr-notfound-tooltip", L.gr__tooltip_empty),
                        enabled: !1,
                        doc: r
                    }),
                    windowEvents: {
                        keydown: p.hide,
                        scroll: p.hide,
                        resize: p.hide
                    },
                    doc: r,
                    domCls: i,
                    cls: "gr_",
                    pCls: "gr-progress"
                }, N.container = p.render(N), N.el = v.findDOMNode(N.container.component), N.hint = new j.Hint({
                    doc: N.doc,
                    hint: N.el,
                    hideDelay: 500,
                    inTarget: p.inTarget,
                    cls: N.cls,
                    delay: 400,
                    onshow: p.show,
                    onhide: p.hide
                }).bind(), p.hint = N.hint, k.on(N.windowEvents, !0), p;
            }
            return (0, g["default"])(t, e), (0, f["default"])(t, [ {
                key: "updateState",
                value: function(e) {
                    var t = e.experiments, n = void 0 === t ? {} : t, r = e.anonymous, o = void 0 !== r && r;
                    this.experiments = n, this.isAnonymous = o;
                }
            }, {
                key: "elementsFromPoint",
                value: function(e, t) {
                    return e && t ? N.doc.elementsFromPoint ? N.doc.elementsFromPoint(e, t) : [ N.doc.elementFromPoint(e, t) ] : [];
                }
            }, {
                key: "setState",
                value: function(e) {
                    N.container.component.setState(e);
                }
            }, {
                key: "setData",
                value: function(e) {
                    return e ? (this.setState({
                        match: e,
                        visible: !0,
                        addedToDict: !1
                    }), this.match = e, this) : this;
                }
            }, {
                key: "updatePos",
                value: function(e, t) {
                    if (null == e.parentNode) {
                        if (!e.id) return this.hide();
                        var n = N.doc.querySelector(".gr_" + e.id);
                        if (!n) return this.hide();
                        N.hint.currentEl = e = n;
                    }
                    var r = C.getAbsRect(e, N.iframe, !0), i = C.posToRect(N.el, o(r, t));
                    i.rect.flip && (i.rect.top = i.rect.top + N.el.clientHeight), i.width = N.el.clientWidth, 
                    i.height = N.el.clientHeight, E.call("gnar.track", "cardOpened", {
                        direction: i.rect.flip ? "top" : "bottom",
                        pixelsToBottom: Math.round(i.height + i.delta.bottom),
                        cardHeight: i.height,
                        ratio: 1 + Math.round(10 * i.delta.bottom / i.height) / 10
                    }), this.setState({
                        pos: i
                    });
                }
            }, {
                key: "render",
                value: function() {
                    var e = this, t = {
                        className: N.domCls,
                        isAnonymous: function() {
                            return e.isAnonymous;
                        },
                        hide: this.hide,
                        animHide: this.animHide,
                        openEditor: this.openEditor,
                        animateReplacement: this.animateReplacement,
                        addToDict: this.addToDict
                    };
                    return x.renderReactWithParent(b.createElement(T.PositionedCard, t), N.doc.documentElement, N.id, "grammarly-card");
                }
            }, {
                key: "remove",
                value: function() {
                    N.hint.unbind(), k.off(N.windowEvents, !0), N.container.remove();
                }
            } ]), t;
        }(w.createClass(_));
        n.Card = P;
    }, {
        "../dom": 207,
        "../inline-cards": 246,
        "../position": 262,
        "../timers": 276,
        "../tracking": 282,
        "../util": 288,
        "../window-events": 289,
        "./hint": 214,
        "./tooltip": 236,
        "babel-runtime/core-js/object/get-prototype-of": 24,
        "babel-runtime/core-js/symbol": 29,
        "babel-runtime/helpers/classCallCheck": 31,
        "babel-runtime/helpers/createClass": 32,
        "babel-runtime/helpers/inherits": 35,
        "babel-runtime/helpers/possibleConstructorReturn": 36,
        emitter: "emitter",
        react: "react",
        "react-dom": "react-dom"
    } ],
    212: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o(e) {
            function t(e) {
                var t = W.anonymous === !1 && e.anonymous === !1 && W.premium !== e.premium;
                W = e, J && J.updateUser(e), t && B.refresh();
            }
            function n(e) {
                var t = "off" === e;
                j.toggleClass(F.body, t, "gr-disable-scroll"), j.toggleClass(F.documentElement, t, "gr-disable-scroll");
            }
            function r() {
                Q && !W.anonymous && f();
            }
            function o(e) {
                return new y.OnboardingDialog({
                    doc: F,
                    user: e,
                    saveAnonymousProps: V
                });
            }
            function i(e) {
                return new _.SigninDialog({
                    doc: F,
                    user: e
                });
            }
            function a(e) {
                n("off"), $ = o(W), $.one("hide", function() {
                    n("on"), k.emitFocusedTab("focus-editor", e);
                });
            }
            function s(e, t) {
                n("off"), J = i(t), J.one("hide", function() {
                    n("on"), k.emitFocusedTab("focus-editor", Q.editorId), C.logger.signinClose(E.timers.stop(H));
                }), C.logger.signinOpen(), C.fire("login-attempt", e);
            }
            function c() {
                X = !0, Y = F.querySelector(L), Y || (Y = b.findDOMNode(j.renderReactWithParent(g.createElement(A, null), F.documentElement, w.guid()).component)), 
                K = Y.querySelector(N("back"));
            }
            function l() {
                var e = {
                    "mail.google.com": "Gmail",
                    "facebook.com": "Facebook",
                    "twitter.com": "Twitter"
                }, t = x.getDomain();
                return "Back to " + (e[t] || document.title);
            }
            function u(e) {
                e.stopPropagation(), O();
            }
            function d() {
                k.emitFocusedTab("dialog-closed", Q.editorId);
            }
            function f() {
                if (q) {
                    B.el.style.background = "";
                    var e = ee;
                    return ee = function(t) {
                        ee = e, B.refresh(), k.emitFocusedTab("after-refresh-dialog", t);
                    }, void O();
                }
                B.refresh();
            }
            function p(e) {
                k.emitBackground("iframe-mode", {
                    iframeMode: e,
                    id: Q.socketId
                });
            }
            function m() {
                W.anonymous || B.activate();
            }
            function v(e) {
                var t = e.data, n = e.caller, r = e.isOnboarding, o = e.editorId;
                return E.timers.start(H), Q = t, r ? a(o) : W.anonymous ? s(n, W) : (B.activate(), 
                void S(t));
            }
            function S(e) {
                X || c(), Y.style.opacity = "0", j.addClass(Y, "gr-_show");
                var t = h.extend({
                    favicon: x.getFavicon(),
                    page: l()
                }, e);
                B.send(t), p(!0), setTimeout(function() {
                    return Y.style.opacity = "1";
                }, 100), n("off"), j.listen(F.body, "keydown", D, !1), j.listen(K, "click", u, !1), 
                j.listen(Y, "click", u, !1), q = !0;
            }
            function P(e) {
                var t = e.action;
                "edit" === t && ee(e), "close" === t && O(), "initialized" === t && (M(e), setTimeout(function() {
                    return B.el.style.background = "transparent";
                }, 300)), "socket" === t && k.emitBackground("socket-client", e), "setSettings" === t && G(e.data), 
                "tracking" === t && e.method && C.call(e.method, e.param, e.props), "popup-editor-fix" === t && z(), 
                "open-url" === t && (C.fire("hook-clicked", e.placement), k.emitBackground("open-url", e.url));
            }
            function I(e, t) {
                Q && e.socketId === Q.socketId && (t("ok"), e.action = "socket", B.send(e));
            }
            function M(e) {
                var t = "Premium" === e.userType ? "freemium-plus" : "freemium";
                F.documentElement.setAttribute("data-type", t);
            }
            function O() {
                q && (q = !1, n("on"), Y.style.opacity = "0", j.removeClass(Y, "gr-_show"), j.removeClass(Y, T), 
                j.unlisten(F.body, "keydown", D, !1), j.unlisten(K, "click", u, !1), j.unlisten(Y, "click", u, !1), 
                B.send({
                    action: "hide"
                }), p(!1), d());
            }
            function R() {
                window === window.top && (k.off("show-dialog", v), k.off("hide-dialog", O), k.off("reset", r), 
                k.off("socket-server-iframe", I)), B.deactivate(), B.off("message", P), Y.parentNode && Y.parentNode.removeChild(Y);
            }
            function D(e) {
                if (w.keyCode(e) === w.ESC_KEY && q) return e.stopPropagation(), e.preventDefault(), 
                O();
            }
            var F = e.doc, B = e.iframe, W = e.user, U = e.actions, G = U.updateSettings, z = U.incFixed, V = U.saveAnonymousProps, H = "Dialog", q = !1, Y = void 0, K = void 0, X = void 0, Q = void 0, J = void 0, $ = void 0, Z = {
                show: v,
                hide: O,
                updateState: t,
                preActivate: m,
                render: c,
                getSignin: i,
                remove: R,
                refresh: f
            };
            B.on("message", P), window === window.top && (k.on("show-dialog", v), k.on("hide-dialog", O), 
            k.on("reset", r), k.on("socket-server-iframe", I));
            var ee = function(e) {
                k.emitFocusedTab("editor-set-state", e);
            };
            return Z;
        }
        var i = e("babel-runtime/core-js/object/get-prototype-of"), a = r(i), s = e("babel-runtime/helpers/classCallCheck"), c = r(s), l = e("babel-runtime/helpers/createClass"), u = r(l), d = e("babel-runtime/helpers/possibleConstructorReturn"), f = r(d), p = e("babel-runtime/helpers/inherits"), m = r(p);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var h = e("lodash"), g = e("react"), b = e("react-dom"), v = e("./iframe"), _ = e("./signin-dialog"), y = e("./onboarding-dialog"), w = e("../util"), k = e("../message"), E = e("../timers"), C = e("../tracking"), x = e("../location"), j = e("../dom"), S = "gr_-editor", T = "gr-iframe-first-load", L = "." + S, N = function(e) {
            return "." + S + "_" + e;
        }, P = function(e) {
            return S + "_" + e;
        }, A = function(e) {
            function t() {
                return (0, c["default"])(this, t), (0, f["default"])(this, (t.__proto__ || (0, a["default"])(t)).apply(this, arguments));
            }
            return (0, m["default"])(t, e), (0, u["default"])(t, [ {
                key: "render",
                value: function() {
                    var e = S + " " + T;
                    return g.createElement("div", {
                        className: e,
                        style: {
                            display: "none"
                        }
                    }, g.createElement("div", {
                        className: P("back")
                    }), g.createElement(v.IframeComponent, null));
                }
            } ]), t;
        }(g.Component);
        n.DialogComponent = A, n.Dialog = o;
    }, {
        "../dom": 207,
        "../location": 257,
        "../message": 258,
        "../timers": 276,
        "../tracking": 282,
        "../util": 288,
        "./iframe": 215,
        "./onboarding-dialog": 217,
        "./signin-dialog": 227,
        "babel-runtime/core-js/object/get-prototype-of": 24,
        "babel-runtime/helpers/classCallCheck": 31,
        "babel-runtime/helpers/createClass": 32,
        "babel-runtime/helpers/inherits": 35,
        "babel-runtime/helpers/possibleConstructorReturn": 36,
        lodash: "lodash",
        react: "react",
        "react-dom": "react-dom"
    } ],
    213: [ function(e, t, n) {
        "use strict";
        function r(e) {
            function t(e) {
                i.hasClass(e.target, "fr-reload-tab") && (a.logger.tabReloadClick(), setTimeout(function() {
                    return window.location.reload(!0);
                }, 200));
            }
            var n = e.el, r = e.win, s = e.outerIframe, c = o.Tooltip({
                posEl: n,
                html: "<span class='fr-tooltip-title'>Cannot connect to Grammarly.</span> Please <span class='fr-reload-tab'>reload</span> the browser tab and check your internet connection. <span class='fr-dialog-br'></span>Don't lose your work! Copy any unsaved text before you reload the tab.",
                doc: n.ownerDocument,
                cls: "fr-btn-offline-tooltip",
                outerIframe: s,
                enabled: !1
            });
            i.listen(r, "click", t);
            var l = c.remove;
            return c.remove = function() {
                l(), i.unlisten(r, "click", t);
            }, c;
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var o = e("./tooltip"), i = e("../dom"), a = e("../tracking");
        n.ErrorTooltip = r;
    }, {
        "../dom": 207,
        "../tracking": 282,
        "./tooltip": 236
    } ],
    214: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        var o = e("babel-runtime/helpers/classCallCheck"), i = r(o);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var a = e("lodash"), s = e("../util"), c = e("../dom"), l = {
            hideDelay: 10,
            onshow: s._f,
            onhide: s._f,
            onmousemove: s._f,
            onInnerMouseMove: s._f,
            inTarget: function(e) {
                var t = e.target, n = c.parentHasClass(t, this.cls) || c.hasClass(t, this.cls);
                if (n) return !this.currentEl || this.currentEl == t || void this.fastHide();
            }
        }, u = function d(e) {
            var t = this;
            (0, i["default"])(this, d), a.extend(this, l, e, {
                bind: function(e) {
                    var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : t.doc;
                    return t.doc2 && t.doc2 != n && t.bind(e, t.doc2), c.listen(n.body, "resize", t.fastHide, e), 
                    c.listen(n, {
                        gramMouse: t.mousemove,
                        mousemove: t.mousemove,
                        scroll: t.fastHide
                    }, s._f, e), c.listen(n, "click", t.click, e, !0), c.listen(t.hint, "mousemove", t.innerMouseMove, e), 
                    t;
                },
                setDocs: function(e, n) {
                    t.unbind(), a.extend(t, {
                        doc: e,
                        doc2: n
                    }), t.bind();
                },
                unbind: function(e) {
                    return t.bind(!0, e);
                },
                fastHide: function() {
                    t.onhide(), t.cancelTimeout("show").cancelTimeout("hide"), t.visible = !1, t.currentEl = null;
                },
                innerMouseMove: function(e) {
                    t.onInnerMouseMove(e), e.preventDefault(), e.stopPropagation(), t.cancelTimeout("hide");
                },
                click: function(e) {
                    return !t.elInHint(e.target) && !t.inTarget(e) && t.fastHide();
                },
                elInHint: function(e) {
                    return e && (c.inEl(e, t.hint) || e == t.hint);
                },
                mousemove: function(e) {
                    var n = e.target;
                    if ("IFRAME" != n.tagName) {
                        if (e.detail && e.detail.el && (n = e.detail.el, e = {
                            target: n,
                            clientX: e.detail.e.clientX,
                            clientY: e.detail.e.clientY
                        }), s.isSafari() && "mousemove" == e.type) {
                            if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return t.mouseMoveCoordinates = e.x + "-" + e.y;
                            if (t.mouseMoveCoordinates == e.x + "-" + e.y) return;
                        }
                        if (t.elInHint(n)) return t.onmousemove(e, !0), void t.cancelTimeout("show").cancelTimeout("hide");
                        if (!t.inTarget(e)) return t.onmousemove(e, !1), void (t.visible ? t.hide() : t.cancelTimeout("show"));
                        t.onmousemove(e, !0), t.visible || (t.show(e, n).cancelTimeout("hide"), t.currentEl = n);
                    }
                },
                show: function(e, n) {
                    return t.showTimeout ? t : (t.cancelTimeout("hide"), t.showTimeout = setTimeout(function() {
                        this.cancelTimeout("show"), (this.elInHint(n) || this.inTarget(e)) && (this.visible = !0, 
                        this.onshow(n, {
                            pageX: e.pageX,
                            pageY: e.pageY,
                            clientX: e.clientX,
                            clientY: e.clientY
                        }));
                    }.bind(t), t.delay), t);
                },
                hide: function() {
                    return t.hideTimeout ? t : (t.hideTimeout = setTimeout(function() {
                        this.onhide(), this.visible = !1, this.currentEl = null;
                    }.bind(t), t.hideDelay), t);
                },
                cancelTimeout: function(e) {
                    var n = e + "Timeout";
                    return t[n] ? (clearTimeout(t[n]), t[n] = null, t) : t;
                },
                setVisible: function(e) {
                    t.visible = e, t.cancelTimeout("hide");
                }
            });
        };
        n.Hint = u;
    }, {
        "../dom": 207,
        "../util": 288,
        "babel-runtime/helpers/classCallCheck": 31,
        lodash: "lodash"
    } ],
    215: [ function(e, t, n) {
        "use strict";
        function r(e) {
            function t(e) {
                v = e;
            }
            function r() {
                function e() {
                    (_ || (_ = b.querySelector(n.selector), E.el = _, _)) && (u.listen(window.top, "message", m, !1), 
                    _.srcdoc || o(t), u.addClass(_, "gr-freemium-ifr"), y = !0, E.activated = y);
                }
                var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : s._f;
                y || e();
            }
            function o() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : s._f, t = window.GR_INLINE_POPUP || "";
                _.setAttribute("srcdoc", t), u.once.call(_, "load", function() {
                    try {
                        window.ACTIVATE_GR_POPUP && window.ACTIVATE_GR_POPUP(_.contentWindow, _.contentDocument, a), 
                        e();
                    } catch (t) {
                        console.error("Cannot activate popup", t), l.logger.popupLoadError(t && t.message, t && t.name);
                    }
                });
            }
            function d() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : s._f;
                _ ? g() : r(e);
            }
            function f(e, t) {
                return k || t ? void p(e) : w.push(e);
            }
            function p(e) {
                e.grammarly = !0;
                try {
                    _.contentWindow.postMessage(e, "*");
                } catch (t) {
                    console.error("iframe send error", t);
                }
            }
            function m(e) {
                var t = e.data;
                e.origin;
                if (t && t.grammarly) {
                    var n = t.action;
                    if ("user" === n) return g();
                    if (k = !0, "initialized" === n && w) {
                        c.timers.stop("open_editor");
                        w.forEach(function(e) {
                            return E.send(e);
                        });
                    }
                    c.timers.stop("open_editor");
                    "accepted" === n && (w = []), E.emit("message", t);
                }
            }
            function h() {
                u.unlisten(window.top, "message", m, !1);
            }
            function g() {
                p({
                    action: "user",
                    user: v
                });
            }
            var b = e.doc, v = e.user, _ = void 0, y = void 0, w = [], k = !1, E = i({
                activate: r,
                refresh: d,
                send: f,
                selector: n.selector,
                baseCls: n.baseCls,
                updateState: t,
                deactivate: h
            });
            return E;
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var o = e("react"), i = e("emitter"), a = e("dompurify"), s = e("../util"), c = e("../timers"), l = e("../tracking"), u = e("../dom");
        n.baseCls = "gr_-ifr", n.selector = "." + n.baseCls, n.IframeComponent = function() {
            return o.createElement("iframe", {
                className: n.baseCls + " gr-_dialog-content"
            });
        }, n.iFrame = r;
    }, {
        "../dom": 207,
        "../timers": 276,
        "../tracking": 282,
        "../util": 288,
        dompurify: "dompurify",
        emitter: "emitter",
        react: "react"
    } ],
    216: [ function(e, t, n) {
        "use strict";
        function r(e) {
            function t(e) {
                var t = e.user;
                r.card && r.card.updateState(t), r.iframe && r.iframe.updateState(t), r.dialog && r.dialog.updateState(t);
            }
            function n() {
                r.iframe && r.iframe.deactivate(), r.dialog && r.dialog.remove(), r.card && r.card.remove(), 
                r.iframe = null, r.dialog = null, r.card = null;
            }
            var r = e.app, s = e.doc, c = void 0 === s ? document : s, l = e.user, u = e.actions, d = r.iframe = o.iFrame({
                doc: c,
                user: l
            });
            return r.dialog = i.Dialog({
                doc: c,
                iframe: d,
                user: l,
                actions: u
            }), r.dialog.render(), r.card = new a.Card({
                doc: c,
                experiments: l.experiments,
                isAnonymous: l.anonymous
            }), {
                clear: n,
                updateState: t
            };
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var o = e("./iframe"), i = e("./dialog"), a = e("./card");
        n.initElements = r;
    }, {
        "./card": 211,
        "./dialog": 212,
        "./iframe": 215
    } ],
    217: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        var o = e("babel-runtime/core-js/object/get-prototype-of"), i = r(o), a = e("babel-runtime/helpers/classCallCheck"), s = r(a), c = e("babel-runtime/helpers/createClass"), l = r(c), u = e("babel-runtime/helpers/possibleConstructorReturn"), d = r(u), f = e("babel-runtime/helpers/inherits"), p = r(f);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var m = e("react"), h = e("react-dom"), g = e("lib/util"), b = e("lib/dom"), v = e("./onboarding-dialog"), _ = e("emitter"), y = function(e) {
            function t(e) {
                var n = e.doc, r = e.container, o = e.user, a = e.saveAnonymousProps;
                (0, s["default"])(this, t);
                var c = (0, d["default"])(this, (t.__proto__ || (0, i["default"])(t)).call(this));
                return c.updateUser = function(e) {
                    c.user = e, c.render();
                }, c.onKey = function(e) {
                    g.keyCode(e) === g.ESC_KEY && c.dialogComponent && c.dialogComponent.onClose();
                }, c.onClose = function() {
                    c.emit("hide"), c.remove();
                }, c.doc = n, c.user = o, c.saveAnonymousProps = a, r && (c.container = r), c.render(), 
                c;
            }
            return (0, p["default"])(t, e), (0, l["default"])(t, [ {
                key: "checkContainer",
                value: function() {
                    this.container || (this.container = this.doc.createElement("onboarding_dialog"), 
                    this.doc.documentElement.appendChild(this.container), b.listen(this.doc.defaultView, "keydown", this.onKey, !1));
                }
            }, {
                key: "render",
                value: function() {
                    var e = this.user;
                    this.checkContainer(), this.dialogComponent = h.render(m.createElement(v.OnboardingDialogComponent, {
                        username: e && e.firstName || "",
                        saveAnonymousProps: this.saveAnonymousProps,
                        onClose: this.onClose
                    }), this.container);
                }
            }, {
                key: "remove",
                value: function() {
                    b.unlisten(this.doc.defaultView, "keydown", this.onKey, !1), this.container && h.unmountComponentAtNode(this.container), 
                    this.container.parentNode && this.container.parentNode.removeChild(this.container);
                }
            } ]), t;
        }(g.createClass(_));
        n.OnboardingDialog = y;
    }, {
        "./onboarding-dialog": 218,
        "babel-runtime/core-js/object/get-prototype-of": 24,
        "babel-runtime/helpers/classCallCheck": 31,
        "babel-runtime/helpers/createClass": 32,
        "babel-runtime/helpers/inherits": 35,
        "babel-runtime/helpers/possibleConstructorReturn": 36,
        emitter: "emitter",
        "lib/dom": 207,
        "lib/util": 288,
        react: "react",
        "react-dom": "react-dom"
    } ],
    218: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        var o = e("babel-runtime/helpers/defineProperty"), i = r(o), a = e("babel-runtime/core-js/object/get-prototype-of"), s = r(a), c = e("babel-runtime/helpers/classCallCheck"), l = r(c), u = e("babel-runtime/helpers/createClass"), d = r(u), f = e("babel-runtime/helpers/possibleConstructorReturn"), p = r(f), m = e("babel-runtime/helpers/inherits"), h = r(m);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var g = e("react"), b = e("react-dom"), v = e("lib/util"), _ = e("lib/dom"), y = e("../onboarding"), w = e("lib/tracking"), k = {
            onboardingDialog: "_9375ba-onboardingDialog",
            viewContainer: "_9375ba-viewContainer",
            view: "_9375ba-view",
            windows: "_9375ba-windows",
            footer: "_9375ba-footer",
            hide: "_9375ba-hide",
            content: "_9375ba-content",
            btnClose: "_9375ba-btnClose"
        }, E = function(e) {
            function t() {
                (0, l["default"])(this, t);
                var e = (0, p["default"])(this, (t.__proto__ || (0, s["default"])(t)).apply(this, arguments));
                return e.state = {
                    hide: !1
                }, e.onClose = function(t) {
                    t && t.stopPropagation(), e.setState({
                        hide: !0
                    });
                    var n = b.findDOMNode(e.refs["onboarding-dialog-el"]), r = e.refs.onboarding;
                    void 0 !== r && r.state.stepIndex === r.steps.length - 1 && w.fire("onboardingTutorialLetsWrite-button-click"), 
                    n && n.addEventListener("animationend", function() {
                        return e.props.onClose();
                    });
                }, e;
            }
            return (0, h["default"])(t, e), (0, d["default"])(t, [ {
                key: "render",
                value: function() {
                    var e, t = _.cs((e = {}, (0, i["default"])(e, k.onboardingDialog, !0), (0, i["default"])(e, k.hide, this.state.hide), 
                    (0, i["default"])(e, k.windows, v.isWindows()), e));
                    return g.createElement("div", {
                        ref: "onboarding-dialog-el",
                        className: t
                    }, g.createElement("div", {
                        className: k.content
                    }, g.createElement("div", {
                        className: k.viewContainer
                    }, g.createElement(y.Onboarding, {
                        ref: "onboarding",
                        onClose: this.onClose,
                        saveAnonymousProps: this.props.saveAnonymousProps
                    }))), g.createElement("div", {
                        className: k.btnClose,
                        onClick: this.onClose
                    }));
                }
            } ]), t;
        }(g.Component);
        n.OnboardingDialogComponent = E;
    }, {
        "../onboarding": 220,
        "babel-runtime/core-js/object/get-prototype-of": 24,
        "babel-runtime/helpers/classCallCheck": 31,
        "babel-runtime/helpers/createClass": 32,
        "babel-runtime/helpers/defineProperty": 33,
        "babel-runtime/helpers/inherits": 35,
        "babel-runtime/helpers/possibleConstructorReturn": 36,
        "lib/dom": 207,
        "lib/tracking": 282,
        "lib/util": 288,
        react: "react",
        "react-dom": "react-dom"
    } ],
    219: [ function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var r = e("react"), o = {
            start: "_2333f7-start",
            info: "_2333f7-info",
            finish: "_2333f7-finish",
            startVideo: "_2333f7-startVideo",
            infoVideo: "_2333f7-infoVideo",
            finishVideo: "_2333f7-finishVideo",
            step: "_2333f7-step",
            content: "_2333f7-content",
            title: "_2333f7-title",
            text: "_2333f7-text",
            button: "_2333f7-button",
            inactive: "_2333f7-inactive",
            link: "_2333f7-link",
            personalize: "_2333f7-personalize",
            registration: "_2333f7-registration",
            progress: "_2333f7-progress",
            bar: "_2333f7-bar",
            progressValue: "_2333f7-progressValue",
            barValue: "_2333f7-barValue",
            grid: "_2333f7-grid",
            item: "_2333f7-item",
            name: "_2333f7-name",
            description: "_2333f7-description",
            footer: "_2333f7-footer",
            skipSettings: "_2333f7-skipSettings",
            slider: "_2333f7-slider",
            sliderItem: "_2333f7-sliderItem",
            sliderActive: "_2333f7-sliderActive"
        };
        n.FinishStep = function(e) {
            var t = (e.nextStep, e.onClose);
            return r.createElement("div", {
                className: o.step
            }, r.createElement("div", {
                className: o.content
            }, r.createElement("div", {
                className: o.title
            }, "You’re fully protected!"), r.createElement("div", {
                className: o.text
            }, "Now, whenever you see the green Grammarly logo, it means that Grammarly has not found any mistakes. Happy writing!"), r.createElement("button", {
                className: o.button,
                onClick: function() {
                    return t();
                }
            }, "let's write")));
        };
    }, {
        react: "react"
    } ],
    220: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        var o = e("babel-runtime/core-js/object/get-prototype-of"), i = r(o), a = e("babel-runtime/helpers/classCallCheck"), s = r(a), c = e("babel-runtime/helpers/createClass"), l = r(c), u = e("babel-runtime/helpers/possibleConstructorReturn"), d = r(u), f = e("babel-runtime/helpers/inherits"), p = r(f);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var m = e("react"), h = e("./start"), g = e("./info"), b = e("./finish"), v = e("./personalize"), _ = e("./registration"), y = e("lib/tracking"), w = {
            start: "_2333f7-start",
            info: "_2333f7-info",
            finish: "_2333f7-finish",
            startVideo: "_2333f7-startVideo",
            infoVideo: "_2333f7-infoVideo",
            finishVideo: "_2333f7-finishVideo",
            step: "_2333f7-step",
            content: "_2333f7-content",
            title: "_2333f7-title",
            text: "_2333f7-text",
            button: "_2333f7-button",
            inactive: "_2333f7-inactive",
            link: "_2333f7-link",
            personalize: "_2333f7-personalize",
            registration: "_2333f7-registration",
            progress: "_2333f7-progress",
            bar: "_2333f7-bar",
            progressValue: "_2333f7-progressValue",
            barValue: "_2333f7-barValue",
            grid: "_2333f7-grid",
            item: "_2333f7-item",
            name: "_2333f7-name",
            description: "_2333f7-description",
            footer: "_2333f7-footer",
            skipSettings: "_2333f7-skipSettings",
            slider: "_2333f7-slider",
            sliderItem: "_2333f7-sliderItem",
            sliderActive: "_2333f7-sliderActive"
        }, k = function(e) {
            function t() {
                (0, s["default"])(this, t);
                var e = (0, d["default"])(this, (t.__proto__ || (0, i["default"])(t)).call(this));
                return e.transforms = [ "0", "18px", "36px", "36px", "54px" ], e.classes = [ "start", "info", "personolize", "registration", "finish" ], 
                e.nextStep = function() {
                    e.setState({
                        stepIndex: e.state.stepIndex + 1
                    });
                }, e.lastStep = function() {
                    e.setState({
                        stepIndex: e.steps.length - 1
                    });
                }, e.state = {
                    stepIndex: 0
                }, e;
            }
            return (0, p["default"])(t, e), (0, l["default"])(t, [ {
                key: "componentWillMount",
                value: function() {
                    this.steps = [ m.createElement(h.StartStep, {
                        nextStep: this.nextStep
                    }), m.createElement(g.InfoStep, {
                        nextStep: this.nextStep,
                        lastStep: this.lastStep
                    }), m.createElement(v.PersonalizeStep, {
                        nextStep: this.nextStep,
                        lastStep: this.lastStep,
                        saveAnonymousProps: this.props.saveAnonymousProps
                    }), m.createElement(_.RegistrationStep, {
                        nextStep: this.nextStep,
                        lastStep: this.lastStep
                    }), m.createElement(b.FinishStep, {
                        nextStep: this.nextStep,
                        onClose: this.props.onClose
                    }) ];
                }
            }, {
                key: "componentDidMount",
                value: function() {
                    y.fire("onboardingTutorial-popup-show");
                }
            }, {
                key: "render",
                value: function() {
                    var e = {
                        transform: "translateX(" + this.transforms[this.state.stepIndex] + ")"
                    }, t = w[this.classes[this.state.stepIndex]];
                    return m.createElement("div", {
                        className: t
                    }, m.createElement("video", {
                        className: w.startVideo,
                        autoPlay: !0,
                        loop: !0,
                        preload: "auto",
                        onLoadedData: function() {
                            return y.logger.onboardingVideoLoaded();
                        }
                    }, m.createElement("source", {
                        src: "https://s3.amazonaws.com/features-team-extension/onboarding/1cards.mp4",
                        type: "video/mp4"
                    })), m.createElement("video", {
                        className: w.infoVideo,
                        autoPlay: !0,
                        loop: !0,
                        preload: "auto"
                    }, m.createElement("source", {
                        src: "https://s3.amazonaws.com/features-team-extension/onboarding/2personalization.mp4",
                        type: "video/mp4"
                    })), m.createElement("video", {
                        className: w.finishVideo,
                        autoPlay: !0,
                        loop: !0,
                        preload: "auto"
                    }, m.createElement("source", {
                        src: "https://s3.amazonaws.com/features-team-extension/onboarding/3gbutton.mp4",
                        type: "video/mp4"
                    })), this.steps[this.state.stepIndex] || null, m.createElement("div", {
                        className: w.slider
                    }, m.createElement("div", {
                        className: w.sliderActive,
                        style: e
                    }), m.createElement("div", {
                        className: w.sliderItem
                    }), m.createElement("div", {
                        className: w.sliderItem
                    }), m.createElement("div", {
                        className: w.sliderItem
                    }), m.createElement("div", {
                        className: w.sliderItem
                    })));
                }
            } ]), t;
        }(m.Component);
        n.Onboarding = k;
    }, {
        "./finish": 219,
        "./info": 221,
        "./personalize": 222,
        "./registration": 224,
        "./start": 226,
        "babel-runtime/core-js/object/get-prototype-of": 24,
        "babel-runtime/helpers/classCallCheck": 31,
        "babel-runtime/helpers/createClass": 32,
        "babel-runtime/helpers/inherits": 35,
        "babel-runtime/helpers/possibleConstructorReturn": 36,
        "lib/tracking": 282,
        react: "react"
    } ],
    221: [ function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var r = e("react"), o = {
            start: "_2333f7-start",
            info: "_2333f7-info",
            finish: "_2333f7-finish",
            startVideo: "_2333f7-startVideo",
            infoVideo: "_2333f7-infoVideo",
            finishVideo: "_2333f7-finishVideo",
            step: "_2333f7-step",
            content: "_2333f7-content",
            title: "_2333f7-title",
            text: "_2333f7-text",
            button: "_2333f7-button",
            inactive: "_2333f7-inactive",
            link: "_2333f7-link",
            personalize: "_2333f7-personalize",
            registration: "_2333f7-registration",
            progress: "_2333f7-progress",
            bar: "_2333f7-bar",
            progressValue: "_2333f7-progressValue",
            barValue: "_2333f7-barValue",
            grid: "_2333f7-grid",
            item: "_2333f7-item",
            name: "_2333f7-name",
            description: "_2333f7-description",
            footer: "_2333f7-footer",
            skipSettings: "_2333f7-skipSettings",
            slider: "_2333f7-slider",
            sliderItem: "_2333f7-sliderItem",
            sliderActive: "_2333f7-sliderActive"
        }, i = e("lib/tracking");
        n.InfoStep = function(e) {
            var t = e.nextStep, n = e.lastStep;
            return r.createElement("div", {
                className: o.step
            }, r.createElement("div", {
                className: o.content
            }, r.createElement("div", {
                className: o.title
            }, "Personalize Grammarly ", r.createElement("br", null), " for More Relevant Checking"), r.createElement("div", {
                className: o.text
            }, "Write more effectively by letting Grammarly", r.createElement("br", null), " know a little bit about your preferences."), r.createElement("button", {
                className: o.button,
                onClick: function() {
                    t(), i.fire("onboardingTutorialPersonalize-button-click");
                }
            }, "personalize"), r.createElement("button", {
                className: o.link,
                onClick: function() {
                    return n();
                }
            }, "skip")));
        };
    }, {
        "lib/tracking": 282,
        react: "react"
    } ],
    222: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        var o = e("babel-runtime/core-js/object/keys"), i = r(o), a = e("babel-runtime/helpers/defineProperty"), s = r(a), c = e("babel-runtime/core-js/object/assign"), l = r(c), u = e("babel-runtime/core-js/object/get-prototype-of"), d = r(u), f = e("babel-runtime/helpers/classCallCheck"), p = r(f), m = e("babel-runtime/helpers/createClass"), h = r(m), g = e("babel-runtime/helpers/possibleConstructorReturn"), b = r(g), v = e("babel-runtime/helpers/inherits"), _ = r(v);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var y = e("react"), w = e("./select"), k = e("lib/dom"), E = e("lib/tracking"), C = {
            start: "_2333f7-start",
            info: "_2333f7-info",
            finish: "_2333f7-finish",
            startVideo: "_2333f7-startVideo",
            infoVideo: "_2333f7-infoVideo",
            finishVideo: "_2333f7-finishVideo",
            step: "_2333f7-step",
            content: "_2333f7-content",
            title: "_2333f7-title",
            text: "_2333f7-text",
            button: "_2333f7-button",
            inactive: "_2333f7-inactive",
            link: "_2333f7-link",
            personalize: "_2333f7-personalize",
            registration: "_2333f7-registration",
            progress: "_2333f7-progress",
            bar: "_2333f7-bar",
            progressValue: "_2333f7-progressValue",
            barValue: "_2333f7-barValue",
            grid: "_2333f7-grid",
            item: "_2333f7-item",
            name: "_2333f7-name",
            description: "_2333f7-description",
            footer: "_2333f7-footer",
            skipSettings: "_2333f7-skipSettings",
            slider: "_2333f7-slider",
            sliderItem: "_2333f7-sliderItem",
            sliderActive: "_2333f7-sliderActive"
        }, x = [ {
            val: "work",
            title: "WORK"
        }, {
            val: "school",
            title: "SCHOOL"
        }, {
            val: "otherProjects",
            title: "OTHER PROJECTS"
        } ], j = [ {
            val: "american",
            title: "AMERICAN ENGLISH"
        }, {
            val: "british",
            title: "BRITISH ENGLISH"
        } ], S = [ {
            val: "english",
            title: "ENGLISH"
        }, {
            val: "notEnglish",
            title: "NOT ENGLISH"
        } ], T = [ {
            val: "beginner",
            title: "BEGINNER"
        }, {
            val: "intermediate",
            title: "INTERMEDIATE"
        }, {
            val: "advanced",
            title: "ADVANCED"
        } ], L = function(e) {
            function t() {
                (0, p["default"])(this, t);
                var e = (0, b["default"])(this, (t.__proto__ || (0, d["default"])(t)).call(this));
                return e.change = function(t, n) {
                    e.setState({
                        isSaveActive: !0,
                        values: (0, l["default"])(e.state.values, (0, s["default"])({}, t, n))
                    });
                }, e.onSaveClick = function() {
                    var t = e.state, n = t.isSaveActive, r = t.values;
                    if (n !== !1) {
                        var o = (0, i["default"])(r).reduce(function(e, t) {
                            return r[t] !== w.DEFAULT_SELECT_VALUE && (e[t] = r[t]), e;
                        }, {});
                        e.props.saveAnonymousProps(o), e.props.nextStep(), E.fire("onboardingTutorialSave-button-click");
                    }
                }, e.state = {
                    values: {
                        writingType: w.DEFAULT_SELECT_VALUE,
                        dialectStrong: w.DEFAULT_SELECT_VALUE,
                        primaryLanguage: w.DEFAULT_SELECT_VALUE,
                        grammarSkills: w.DEFAULT_SELECT_VALUE
                    },
                    isSaveActive: !1
                }, e;
            }
            return (0, _["default"])(t, e), (0, h["default"])(t, [ {
                key: "getProgressInPercents",
                value: function() {
                    var e = this, t = (0, i["default"])(this.state.values), n = t.filter(function(t) {
                        return e.state.values[t] !== w.DEFAULT_SELECT_VALUE;
                    }).length;
                    return Math.round(n / t.length * 100);
                }
            }, {
                key: "render",
                value: function() {
                    var e = this, t = this.getProgressInPercents(), n = {
                        transform: "scaleX(" + t / 100 + ")"
                    };
                    return y.createElement("div", {
                        className: k.cs(C.step, C.personalize)
                    }, y.createElement("div", {
                        className: C.content
                    }, y.createElement("div", {
                        className: C.title
                    }, "Personalize"), y.createElement("div", {
                        className: C.progress
                    }, "Your preferences are ", y.createElement("span", {
                        className: C.progressValue
                    }, t, "%"), " custom", y.createElement("div", {
                        className: C.bar
                    }, y.createElement("div", {
                        className: C.barValue,
                        style: n
                    }))), y.createElement("div", {
                        className: C.grid
                    }, y.createElement("div", {
                        className: C.item
                    }, y.createElement("div", {
                        className: C.name
                    }, "Most of my writing is for"), y.createElement(w.Select, {
                        id: "writingType",
                        options: x,
                        value: this.state.values.writingType,
                        onChange: this.change
                    }), y.createElement("div", {
                        className: C.description
                    }, "Our algorithms will show corrections relevant to your writing style")), y.createElement("div", {
                        className: C.item
                    }, y.createElement("div", {
                        className: C.name
                    }, "I prefer to write in"), y.createElement(w.Select, {
                        id: "dialectStrong",
                        options: j,
                        value: this.state.values.dialectStrong,
                        onChange: this.change
                    }), y.createElement("div", {
                        className: C.description
                    }, "Select which dialectical conventions we should follow")), y.createElement("div", {
                        className: C.item
                    }, y.createElement("div", {
                        className: C.name
                    }, "My primary language is"), y.createElement(w.Select, {
                        id: "primaryLanguage",
                        options: S,
                        value: this.state.values.primaryLanguage,
                        onChange: this.change
                    }), y.createElement("div", {
                        className: C.description
                    }, "This setting helps us understand your needs better")), y.createElement("div", {
                        className: C.item
                    }, y.createElement("div", {
                        className: C.name
                    }, "My grammar skills are"), y.createElement(w.Select, {
                        id: "grammarSkills",
                        options: T,
                        value: this.state.values.grammarSkills,
                        onChange: this.change
                    }), y.createElement("div", {
                        className: C.description
                    }, "Our algorithms will show corrections relevant to your writing level")))), y.createElement("footer", {
                        className: C.footer
                    }, y.createElement("button", {
                        className: k.cs(C.button, !this.state.isSaveActive && C.inactive),
                        onClick: function() {
                            return e.onSaveClick();
                        }
                    }, "save"), y.createElement("button", {
                        className: C.link,
                        onClick: function() {
                            return e.props.lastStep();
                        }
                    }, "later")));
                }
            } ]), t;
        }(y.Component);
        n.PersonalizeStep = L;
    }, {
        "./select": 225,
        "babel-runtime/core-js/object/assign": 20,
        "babel-runtime/core-js/object/get-prototype-of": 24,
        "babel-runtime/core-js/object/keys": 25,
        "babel-runtime/helpers/classCallCheck": 31,
        "babel-runtime/helpers/createClass": 32,
        "babel-runtime/helpers/defineProperty": 33,
        "babel-runtime/helpers/inherits": 35,
        "babel-runtime/helpers/possibleConstructorReturn": 36,
        "lib/dom": 207,
        "lib/tracking": 282,
        react: "react"
    } ],
    223: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        var o = e("babel-runtime/helpers/defineProperty"), i = r(o), a = e("babel-runtime/core-js/object/assign"), s = r(a), c = e("babel-runtime/core-js/object/get-prototype-of"), l = r(c), u = e("babel-runtime/helpers/classCallCheck"), d = r(u), f = e("babel-runtime/helpers/createClass"), p = r(f), m = e("babel-runtime/helpers/possibleConstructorReturn"), h = r(m), g = e("babel-runtime/helpers/inherits"), b = r(g);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var v = e("react"), _ = e("react-dom"), y = e("lib/position"), w = e("lib/dom"), k = e("lib/message"), E = e("../../signin/button"), C = e("lib/tracking"), x = {
            onboardingPopup: "_dc5843-onboardingPopup",
            text: "_dc5843-text",
            title: "_dc5843-title",
            link: "_dc5843-link",
            popupFooter: "_dc5843-popupFooter",
            isFliped: "_dc5843-isFliped"
        }, j = 170, S = 329, T = 162, L = 35, N = function(e) {
            function t() {
                (0, d["default"])(this, t);
                var e = (0, h["default"])(this, (t.__proto__ || (0, l["default"])(t)).call(this));
                return e.cancel = function() {
                    e.props.remove(), C.fire("onboarding-popup-cancel");
                }, e.state = {
                    styles: {}
                }, e;
            }
            return (0, b["default"])(t, e), (0, p["default"])(t, [ {
                key: "componentDidMount",
                value: function() {
                    var e = this, t = _.findDOMNode(this.refs.onboardingPopup);
                    this._requestAnimationFrame = requestAnimationFrame(function() {
                        if (t.style.opacity = "1", t.style.transform) {
                            var e = t.style.transform.split(" ");
                            e[2] = "scale(1)", t.style.transform = e.join(" ");
                        }
                    }), this.setState(function() {
                        return {
                            styles: e.props.styles
                        };
                    });
                }
            }, {
                key: "componentWillUnmount",
                value: function() {
                    cancelAnimationFrame(this._requestAnimationFrame);
                }
            }, {
                key: "render",
                value: function() {
                    var e = this;
                    return v.createElement("div", {
                        ref: "onboardingPopup",
                        className: x.onboardingPopup,
                        style: this.state.styles
                    }, v.createElement("p", {
                        className: x.title
                    }, "Grammarly is Now Active"), v.createElement("p", {
                        className: x.text
                    }, "Want to see how it works?"), v.createElement(E.Button, {
                        onClick: function() {
                            return e.props.openDialog();
                        },
                        cls: "onboarding",
                        styles: {
                            width: "180px"
                        },
                        text: "take a quick tour"
                    }), v.createElement("button", {
                        className: x.link,
                        onClick: this.cancel
                    }, "No, thanks"), v.createElement("div", {
                        className: w.cs(x.popupFooter, this.props.isFliped && x.isFliped)
                    }, "▲"));
                }
            } ]), t;
        }(v.Component), P = function() {
            function e(t) {
                var n = this, r = t.doc, o = t.el, a = t.editor, c = t.user;
                (0, d["default"])(this, e), this.getStyles = function(e) {
                    var t = y.getAbsRect(n.el, null, !1), r = t.top, o = t.left, a = w.transformProp(n.doc), c = o - S, l = n.isFliped ? r + L : r - T, u = e ? "scale(.7)" : "scale(1)";
                    return (0, s["default"])({}, (0, i["default"])({}, a, "translate(" + c + "px, " + l + "px) " + u));
                }, this.windowResize = function() {
                    var e = n.getStyles();
                    n.component.setState(function() {
                        return {
                            styles: e
                        };
                    });
                }, this.doc = r, this.editorId = a.id, this.editor = a, this.el = o, this.user = c, 
                this.isActive = !0, this.isFliped = o.getBoundingClientRect().top < j, this.showTimeout = setTimeout(function() {
                    return n._show();
                }, 700);
            }
            return (0, p["default"])(e, [ {
                key: "openDialog",
                value: function() {
                    this.remove(), k.emitFocusedTab("show-dialog", {
                        data: {},
                        editorId: this.editorId,
                        user: this.user,
                        isOnboarding: !0
                    });
                }
            }, {
                key: "remove",
                value: function() {
                    w.unlisten(window, "resize", this.getStyles, !1), clearTimeout(this.showTimeout), 
                    this.container && _.unmountComponentAtNode(this.container), this.container && this.container.parentNode && this.container.parentNode.removeChild(this.container), 
                    this.isActive = !1;
                }
            }, {
                key: "_checkContainer",
                value: function() {
                    this.container || (this.container = this.doc.createElement("onboarding-popup"), 
                    this.doc.documentElement.appendChild(this.container));
                }
            }, {
                key: "_show",
                value: function() {
                    var e = this;
                    this._checkContainer();
                    var t = this.getStyles(!0), n = v.createElement(N, {
                        isFliped: this.isFliped,
                        styles: t,
                        remove: function() {
                            return e.remove();
                        },
                        openDialog: function() {
                            return e.openDialog();
                        }
                    });
                    this.component = _.render(n, this.container), w.listen(window, "resize", this.windowResize, !1), 
                    C.fire("onboarding-popup-show");
                }
            } ]), e;
        }();
        n.Popup = P;
    }, {
        "../../signin/button": 229,
        "babel-runtime/core-js/object/assign": 20,
        "babel-runtime/core-js/object/get-prototype-of": 24,
        "babel-runtime/helpers/classCallCheck": 31,
        "babel-runtime/helpers/createClass": 32,
        "babel-runtime/helpers/defineProperty": 33,
        "babel-runtime/helpers/inherits": 35,
        "babel-runtime/helpers/possibleConstructorReturn": 36,
        "lib/dom": 207,
        "lib/message": 258,
        "lib/position": 262,
        "lib/tracking": 282,
        react: "react",
        "react-dom": "react-dom"
    } ],
    224: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        var o = e("babel-runtime/core-js/object/get-prototype-of"), i = r(o), a = e("babel-runtime/helpers/classCallCheck"), s = r(a), c = e("babel-runtime/helpers/createClass"), l = r(c), u = e("babel-runtime/helpers/possibleConstructorReturn"), d = r(u), f = e("babel-runtime/helpers/inherits"), p = r(f);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var m = e("react"), h = e("../signin/form"), g = e("lib/dom"), b = {
            start: "_2333f7-start",
            info: "_2333f7-info",
            finish: "_2333f7-finish",
            startVideo: "_2333f7-startVideo",
            infoVideo: "_2333f7-infoVideo",
            finishVideo: "_2333f7-finishVideo",
            step: "_2333f7-step",
            content: "_2333f7-content",
            title: "_2333f7-title",
            text: "_2333f7-text",
            button: "_2333f7-button",
            inactive: "_2333f7-inactive",
            link: "_2333f7-link",
            personalize: "_2333f7-personalize",
            registration: "_2333f7-registration",
            progress: "_2333f7-progress",
            bar: "_2333f7-bar",
            progressValue: "_2333f7-progressValue",
            barValue: "_2333f7-barValue",
            grid: "_2333f7-grid",
            item: "_2333f7-item",
            name: "_2333f7-name",
            description: "_2333f7-description",
            footer: "_2333f7-footer",
            skipSettings: "_2333f7-skipSettings",
            slider: "_2333f7-slider",
            sliderItem: "_2333f7-sliderItem",
            sliderActive: "_2333f7-sliderActive"
        }, v = function(e) {
            function t() {
                return (0, s["default"])(this, t), (0, d["default"])(this, (t.__proto__ || (0, i["default"])(t)).apply(this, arguments));
            }
            return (0, p["default"])(t, e), (0, l["default"])(t, [ {
                key: "render",
                value: function() {
                    var e = this;
                    return m.createElement("div", {
                        className: g.cs(b.step, b.registration)
                    }, m.createElement(h.Form, {
                        ref: "login",
                        showOnboardingVersion: !0,
                        username: "",
                        onSuccess: function() {
                            return e.props.lastStep();
                        }
                    }), m.createElement("button", {
                        className: g.cs(b.link, b.skipSettings),
                        onClick: function() {
                            return e.props.lastStep();
                        }
                    }, "Don’t save my settings"));
                }
            } ]), t;
        }(m.Component);
        n.RegistrationStep = v;
    }, {
        "../signin/form": 232,
        "babel-runtime/core-js/object/get-prototype-of": 24,
        "babel-runtime/helpers/classCallCheck": 31,
        "babel-runtime/helpers/createClass": 32,
        "babel-runtime/helpers/inherits": 35,
        "babel-runtime/helpers/possibleConstructorReturn": 36,
        "lib/dom": 207,
        react: "react"
    } ],
    225: [ function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var r = e("react"), o = {
            selectWrap: "_ca9ab0-selectWrap",
            select: "_ca9ab0-select"
        };
        n.DEFAULT_SELECT_VALUE = "", n.Select = function(e) {
            var t = e.id, i = e.value, a = e.options, s = e.onChange;
            return r.createElement("div", {
                className: o.selectWrap
            }, r.createElement("select", {
                className: o.select,
                onChange: function(e) {
                    var n = e.target;
                    return s(t, n.value);
                },
                value: i,
                style: {
                    color: i === n.DEFAULT_SELECT_VALUE ? "#9399A7" : "#00B281"
                }
            }, i === n.DEFAULT_SELECT_VALUE && r.createElement("option", {
                key: t + "_default}",
                value: n.DEFAULT_SELECT_VALUE
            }, "SELECT"), a.map(function(e) {
                var n = e.val, o = e.title;
                return r.createElement("option", {
                    key: t + "_" + n,
                    value: n
                }, o);
            })));
        };
    }, {
        react: "react"
    } ],
    226: [ function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var r = e("react"), o = {
            start: "_2333f7-start",
            info: "_2333f7-info",
            finish: "_2333f7-finish",
            startVideo: "_2333f7-startVideo",
            infoVideo: "_2333f7-infoVideo",
            finishVideo: "_2333f7-finishVideo",
            step: "_2333f7-step",
            content: "_2333f7-content",
            title: "_2333f7-title",
            text: "_2333f7-text",
            button: "_2333f7-button",
            inactive: "_2333f7-inactive",
            link: "_2333f7-link",
            personalize: "_2333f7-personalize",
            registration: "_2333f7-registration",
            progress: "_2333f7-progress",
            bar: "_2333f7-bar",
            progressValue: "_2333f7-progressValue",
            barValue: "_2333f7-barValue",
            grid: "_2333f7-grid",
            item: "_2333f7-item",
            name: "_2333f7-name",
            description: "_2333f7-description",
            footer: "_2333f7-footer",
            skipSettings: "_2333f7-skipSettings",
            slider: "_2333f7-slider",
            sliderItem: "_2333f7-sliderItem",
            sliderActive: "_2333f7-sliderActive"
        }, i = e("lib/tracking");
        n.StartStep = function(e) {
            var t = e.nextStep;
            return r.createElement("div", {
                className: o.step
            }, r.createElement("div", {
                className: o.content
            }, r.createElement("div", {
                className: o.title
            }, "Defeat Tricky Mistakes", r.createElement("br", null), " With One Click"), r.createElement("div", {
                className: o.text
            }, "Simply hover your mouse over underlined words and click once on your preferred correction."), r.createElement("button", {
                className: o.button,
                onClick: function() {
                    t(), i.fire("onboardingTutorialNext-button-click");
                }
            }, "next")));
        };
    }, {
        "lib/tracking": 282,
        react: "react"
    } ],
    227: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        var o = e("babel-runtime/core-js/object/get-prototype-of"), i = r(o), a = e("babel-runtime/helpers/classCallCheck"), s = r(a), c = e("babel-runtime/helpers/createClass"), l = r(c), u = e("babel-runtime/helpers/possibleConstructorReturn"), d = r(u), f = e("babel-runtime/helpers/inherits"), p = r(f);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var m = e("react"), h = e("react-dom"), g = e("lib/util"), b = e("lib/dom"), v = e("./signin-dialog"), _ = e("emitter"), y = function(e) {
            function t(e) {
                var n = e.doc, r = e.container, o = e.user;
                (0, s["default"])(this, t);
                var a = (0, d["default"])(this, (t.__proto__ || (0, i["default"])(t)).call(this));
                return a.updateUser = function(e) {
                    a.user = e, a.render();
                }, a.onKey = function(e) {
                    a.dialogComponent && a.dialogComponent.refs && a.dialogComponent.refs.form.onKey(e);
                }, a.onClose = function() {
                    a.emit("hide"), a.remove();
                }, a.doc = n, a.user = o, r && (a.container = r), a.render(), a;
            }
            return (0, p["default"])(t, e), (0, l["default"])(t, [ {
                key: "checkContainer",
                value: function() {
                    this.container || (this.container = this.doc.createElement("signin_dialog"), this.doc.documentElement.appendChild(this.container), 
                    b.listen(this.doc.defaultView, "keydown", this.onKey, !1));
                }
            }, {
                key: "render",
                value: function() {
                    var e = this.user;
                    this.checkContainer(), this.dialogComponent = h.render(m.createElement(v.SigninDialogComponent, {
                        username: e && e.firstName || "",
                        onClose: this.onClose
                    }), this.container);
                }
            }, {
                key: "remove",
                value: function() {
                    b.unlisten(this.doc.defaultView, "keydown", this.onKey, !1), this.container && h.unmountComponentAtNode(this.container), 
                    this.container.parentNode && this.container.parentNode.removeChild(this.container);
                }
            } ]), t;
        }(g.createClass(_));
        n.SigninDialog = y;
    }, {
        "./signin-dialog": 228,
        "babel-runtime/core-js/object/get-prototype-of": 24,
        "babel-runtime/helpers/classCallCheck": 31,
        "babel-runtime/helpers/createClass": 32,
        "babel-runtime/helpers/inherits": 35,
        "babel-runtime/helpers/possibleConstructorReturn": 36,
        emitter: "emitter",
        "lib/dom": 207,
        "lib/util": 288,
        react: "react",
        "react-dom": "react-dom"
    } ],
    228: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        var o = e("babel-runtime/core-js/object/get-prototype-of"), i = r(o), a = e("babel-runtime/helpers/classCallCheck"), s = r(a), c = e("babel-runtime/helpers/createClass"), l = r(c), u = e("babel-runtime/helpers/possibleConstructorReturn"), d = r(u), f = e("babel-runtime/helpers/inherits"), p = r(f);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var m = e("react"), h = e("react-dom"), g = e("lib/util"), b = e("lib/dom"), v = e("../signin/form"), _ = {
            signinDialog: "_4c65eb-signinDialog",
            viewContainer: "_4c65eb-viewContainer",
            view: "_4c65eb-view",
            windows: "_4c65eb-windows",
            footer: "_4c65eb-footer",
            content: "_4c65eb-content",
            btnClose: "_4c65eb-btnClose"
        }, y = function(e) {
            function t() {
                (0, s["default"])(this, t);
                var e = (0, d["default"])(this, (t.__proto__ || (0, i["default"])(t)).apply(this, arguments));
                return e.onClick = function(t) {
                    b.matchesSelector(t.target, "." + _.content + ", ." + _.content + " *") || e.onClose(t);
                }, e.onClose = function(t) {
                    t && t.stopPropagation();
                    var n = h.findDOMNode(e.refs["signin-dialog-el"]), r = h.findDOMNode(e.refs["signin-content"]);
                    r && n && (r.style.opacity = "0", n.style.opacity = "0"), e._closeTimeout = setTimeout(function() {
                        return e.props.onClose();
                    }, 500);
                }, e;
            }
            return (0, p["default"])(t, e), (0, l["default"])(t, [ {
                key: "componentDidMount",
                value: function() {
                    var e = h.findDOMNode(this.refs["signin-dialog-el"]), t = h.findDOMNode(this.refs["signin-content"]);
                    this._requestAnimationFrame = requestAnimationFrame(function() {
                        t.style.opacity = "0", e.style.opacity = "0", requestAnimationFrame(function() {
                            e.style.opacity = "1", t.style.opacity = "1";
                        });
                    });
                }
            }, {
                key: "componentWillUnmount",
                value: function() {
                    clearTimeout(this._closeTimeout), cancelAnimationFrame(this._requestAnimationFrame);
                }
            }, {
                key: "render",
                value: function() {
                    var e = b.cs(_.signinDialog, g.isWindows() && _.windows), t = {
                        opacity: 0
                    }, n = {
                        opacity: 0
                    };
                    return m.createElement("div", {
                        ref: "signin-dialog-el",
                        onClick: this.onClick,
                        className: e,
                        style: t
                    }, m.createElement("div", {
                        ref: "signin-content",
                        className: _.content,
                        style: n
                    }, m.createElement("div", {
                        className: _.viewContainer
                    }, m.createElement(v.Form, {
                        ref: "form",
                        username: this.props.username,
                        onClose: this.onClose
                    }))), m.createElement("div", {
                        className: _.btnClose,
                        onClick: this.onClose
                    }));
                }
            } ]), t;
        }(m.Component);
        n.SigninDialogComponent = y;
    }, {
        "../signin/form": 232,
        "babel-runtime/core-js/object/get-prototype-of": 24,
        "babel-runtime/helpers/classCallCheck": 31,
        "babel-runtime/helpers/createClass": 32,
        "babel-runtime/helpers/inherits": 35,
        "babel-runtime/helpers/possibleConstructorReturn": 36,
        "lib/dom": 207,
        "lib/util": 288,
        react: "react",
        "react-dom": "react-dom"
    } ],
    229: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        var o = e("babel-runtime/helpers/defineProperty"), i = r(o), a = e("babel-runtime/core-js/object/get-prototype-of"), s = r(a), c = e("babel-runtime/helpers/classCallCheck"), l = r(c), u = e("babel-runtime/helpers/createClass"), d = r(u), f = e("babel-runtime/helpers/possibleConstructorReturn"), p = r(f), m = e("babel-runtime/helpers/inherits"), h = r(m);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var g = e("react"), b = e("lib/dom"), v = {
            buttonContainer: "_9a2bae-buttonContainer",
            buttonSpinner: "_9a2bae-buttonSpinner",
            button: "_9a2bae-button",
            loading: "_9a2bae-loading",
            onboarding: "_9a2bae-onboarding"
        }, _ = 290, y = function(e) {
            var t = e.className;
            return g.createElement("div", {
                className: "gr_-spinner " + t
            }, g.createElement("div", {
                className: "gr_-bounce1"
            }), g.createElement("div", {
                className: "gr_-bounce2"
            }), g.createElement("div", {
                className: "gr_-bounce3"
            }));
        }, w = function(e) {
            function t() {
                (0, l["default"])(this, t);
                var e = (0, p["default"])(this, (t.__proto__ || (0, s["default"])(t)).apply(this, arguments));
                return e.onClick = function(t) {
                    t.preventDefault(), e.props.loading || e.props.onClick(t);
                }, e;
            }
            return (0, h["default"])(t, e), (0, d["default"])(t, [ {
                key: "render",
                value: function() {
                    var e, t = this.props, n = t.loading, r = t.cls, o = n ? "" : this.props.text, a = this.props.styles || {
                        width: _
                    }, s = b.cs((e = {}, (0, i["default"])(e, v.buttonContainer, !0), (0, i["default"])(e, v[r], void 0 !== r), 
                    (0, i["default"])(e, v.loading, n), e));
                    return g.createElement("div", {
                        className: s,
                        style: a
                    }, n && g.createElement(y, {
                        className: v.buttonSpinner
                    }), g.createElement("button", {
                        type: "button",
                        style: a,
                        className: v.button,
                        onClick: this.onClick
                    }, o));
                }
            } ]), t;
        }(g.Component);
        n.Button = w;
    }, {
        "babel-runtime/core-js/object/get-prototype-of": 24,
        "babel-runtime/helpers/classCallCheck": 31,
        "babel-runtime/helpers/createClass": 32,
        "babel-runtime/helpers/defineProperty": 33,
        "babel-runtime/helpers/inherits": 35,
        "babel-runtime/helpers/possibleConstructorReturn": 36,
        "lib/dom": 207,
        react: "react"
    } ],
    230: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        var o = e("babel-runtime/helpers/extends"), i = r(o), a = e("babel-runtime/core-js/object/get-prototype-of"), s = r(a), c = e("babel-runtime/helpers/classCallCheck"), l = r(c), u = e("babel-runtime/helpers/createClass"), d = r(u), f = e("babel-runtime/helpers/possibleConstructorReturn"), p = r(f), m = e("babel-runtime/helpers/inherits"), h = r(m);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var g = e("react"), b = e("./input"), v = {
            inputs: "_194465-inputs",
            hidden: "_194465-hidden"
        }, _ = [ {
            label: "Name",
            name: "name",
            type: "text"
        }, {
            label: "Email",
            name: "email",
            type: "text"
        }, {
            label: "Password",
            name: "password",
            type: "password"
        } ], y = function(e) {
            function t() {
                return (0, l["default"])(this, t), (0, p["default"])(this, (t.__proto__ || (0, s["default"])(t)).apply(this, arguments));
            }
            return (0, h["default"])(t, e), (0, d["default"])(t, [ {
                key: "setFocus",
                value: function() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this.props.fields[0], t = this.refs[e].refs.input;
                    if (t.focus(), t.value) {
                        var n = t.value.length;
                        t.setSelectionRange(n, n);
                    }
                }
            }, {
                key: "render",
                value: function() {
                    var e = this;
                    return g.createElement("fieldset", {
                        className: v.inputs
                    }, g.createElement("input", {
                        className: v.hidden,
                        type: "text",
                        name: "fakeusernameremembered"
                    }), g.createElement("input", {
                        className: v.hidden,
                        type: "password",
                        name: "fakepasswordremembered"
                    }), _.filter(function(t) {
                        var n = t.name;
                        return e.props.fields.indexOf(n) > -1;
                    }).map(function(t, n) {
                        return g.createElement(b.Input, (0, i["default"])({}, t, {
                            ref: t.name,
                            onSet: e.props.onSet(t.name),
                            value: e.props.formData[t.name],
                            validation: e.props.validation[t.name],
                            onValidate: e.props.onValidate(t.name),
                            forceValidation: e.props.forceValidation,
                            key: n
                        }));
                    }));
                }
            } ]), t;
        }(g.Component);
        n.Fieldset = y;
    }, {
        "./input": 233,
        "babel-runtime/core-js/object/get-prototype-of": 24,
        "babel-runtime/helpers/classCallCheck": 31,
        "babel-runtime/helpers/createClass": 32,
        "babel-runtime/helpers/extends": 34,
        "babel-runtime/helpers/inherits": 35,
        "babel-runtime/helpers/possibleConstructorReturn": 36,
        react: "react"
    } ],
    231: [ function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var r = e("react"), o = e("lib/config"), i = {
            footer: "_4ea68c-footer"
        };
        n.Footer = function() {
            return r.createElement("div", {
                className: i.footer
            }, "By signing up, you agree to our ", r.createElement("a", {
                tabIndex: -1,
                target: "__blank",
                href: o.URLS.terms
            }, "Terms and Conditions"), " and ", r.createElement("a", {
                tabIndex: -1,
                target: "__blank",
                href: o.URLS.policy
            }, "Privacy Policy"), ".  You also agree to receive product-related emails from Grammarly, which you can unsubscribe from at any time.");
        };
    }, {
        "lib/config": 203,
        react: "react"
    } ],
    232: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        var o = e("babel-runtime/helpers/extends"), i = r(o), a = e("babel-runtime/regenerator"), s = r(a), c = e("babel-runtime/helpers/defineProperty"), l = r(c), u = e("babel-runtime/core-js/object/get-prototype-of"), d = r(u), f = e("babel-runtime/helpers/classCallCheck"), p = r(f), m = e("babel-runtime/helpers/createClass"), h = r(m), g = e("babel-runtime/helpers/possibleConstructorReturn"), b = r(g), v = e("babel-runtime/helpers/inherits"), _ = r(v), y = e("babel-runtime/core-js/object/assign"), w = r(y), k = e("babel-runtime/core-js/object/keys"), E = r(k), C = e("babel-runtime/core-js/promise"), x = r(C), j = function(e, t, n, r) {
            return new (n || (n = x["default"]))(function(o, i) {
                function a(e) {
                    try {
                        c(r.next(e));
                    } catch (t) {
                        i(t);
                    }
                }
                function s(e) {
                    try {
                        c(r["throw"](e));
                    } catch (t) {
                        i(t);
                    }
                }
                function c(e) {
                    e.done ? o(e.value) : new n(function(t) {
                        t(e.value);
                    }).then(a, s);
                }
                c((r = r.apply(e, t || [])).next());
            });
        };
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var S = e("react"), T = e("./button"), L = e("./footer"), N = e("../signin/fieldset"), P = e("lib/dom"), A = e("lib/tracking"), I = e("lib/util"), M = e("./welcome"), O = e("./login-success"), R = e("lib/message"), D = e("lib/config"), F = e("lib/url"), B = {
            form: "_2a5207-form",
            login: "_2a5207-login",
            register: "_2a5207-register",
            loginSuccess: "_2a5207-loginSuccess",
            welcome: "_2a5207-welcome",
            title: "_2a5207-title",
            subTitle: "_2a5207-subTitle",
            wrapper: "_2a5207-wrapper",
            personalizedTitle: "_2a5207-personalizedTitle",
            titleContainer: "_2a5207-titleContainer",
            personalizedTitleSub: "_2a5207-personalizedTitleSub",
            hidden: "_2a5207-hidden",
            validation: "_2a5207-validation",
            fakefield: "_2a5207-fakefield",
            navigation: "_2a5207-navigation",
            loading: "_2a5207-loading",
            navigationItem: "_2a5207-navigationItem",
            loginNav: "_2a5207-loginNav",
            toLogin: "_2a5207-toLogin",
            forgotLink: "_2a5207-forgotLink",
            onboardingVersion: "_2a5207-onboardingVersion",
            freeLabel: "_2a5207-freeLabel"
        };
        n.validationMessages = {
            fail: "Something went wrong. Please try again later.",
            invalidUser: "Invalid email address/password combination.",
            required: "Required",
            shortPassword: "Use 6 characters or more",
            incorrectEmail: "Incorrect",
            emailExists: 'Already in use. Do you need to <a data-view="login">Log in</a>?'
        }, n.validate = function(e, t) {
            var r = (0, E["default"])(e).reduce(function(r, o) {
                var i = e[o];
                return i && "" !== i ? ("password" === o && "register" === t && i.length < 6 && (r[o] = n.validationMessages.shortPassword), 
                "email" !== o || I.isValidEmail(i) || (r[o] = n.validationMessages.incorrectEmail), 
                r) : (r[o] = n.validationMessages.required, r);
            }, {});
            return r._valid = 0 === (0, E["default"])(r).length, r;
        }, n.extendWithServerValidation = function(e, t) {
            if (!t.error) return (0, w["default"])({}, e, {
                _valid: !0
            });
            var r = void 0, o = void 0;
            return "Conflict" === t.error ? o = n.validationMessages.emailExists : r = "Unauthorized" === t.error ? n.validationMessages.invalidUser : n.validationMessages.fail, 
            (0, w["default"])({}, e, {
                error: r,
                email: o,
                _valid: !1
            });
        }, n.getResetPassLink = function(e) {
            return D.URLS.resetPassword + (e ? "?email=" + encodeURIComponent(e) : "");
        };
        var W = function(e) {
            function t() {
                (0, p["default"])(this, t);
                var e = (0, b["default"])(this, (t.__proto__ || (0, d["default"])(t)).call(this));
                return e.forceValidation = !1, e.onClick = function(t) {
                    "login" === t.target.dataset.view && e.changeView("login");
                }, e.changeView = function(t) {
                    var n = e.state.data;
                    "login" !== t && "register" !== t || (n.password = ""), e.setState((0, w["default"])({}, e.state, {
                        view: t,
                        data: n,
                        validation: {
                            _valid: !0
                        }
                    })), e.forceValidation = !1;
                }, e.onValidate = function(t) {
                    return function(r) {
                        var o = e.state, i = o.validation, a = o.view;
                        i[t] = n.validate((0, l["default"])({}, t, r), a)[t], delete i.error, e.setState((0, 
                        w["default"])({}, e.state, {
                            validation: i
                        }));
                    };
                }, e.onSet = function(t) {
                    return function(n) {
                        var r = e.state.data;
                        r[t] = n, e.setState((0, w["default"])({}, e.state, {
                            data: r
                        }));
                    };
                }, e.getFormData = function(t) {
                    var n = (0, w["default"])({}, e.state.data);
                    return t && n.hasOwnProperty(t) && delete n[t], n;
                }, e.onKey = function(t) {
                    if (I.keyCode(t) === I.ESC_KEY && e.props.onClose && e.props.onClose(), I.keyCode(t) === I.ENTER_KEY) {
                        var n = t.target;
                        if ("A" === n.tagName) return;
                        e.onSubmit();
                    }
                }, e.onGoPremium = function() {
                    A.fire("upgrade-after-register"), R.emitBackground("open-url", F.getUpgradeURL("upHook", "anonPopupCard"));
                }, e.onSubmit = function() {
                    if (!e.state.loading) {
                        var t = e.state.view;
                        "login" === t && e.onAuth("signin", e.getFormData("name")), "register" === t && e.onAuth("signup", e.getFormData());
                    }
                }, e.focusForm = function(t, n) {
                    "start" === t && e.setFocus("login" === n ? "email" : "name"), "end" === t && e.refs.end.focus();
                }, e.state = {
                    view: "register",
                    validation: {
                        _valid: !0
                    },
                    loading: !1,
                    data: {
                        name: "",
                        email: "",
                        password: ""
                    }
                }, e;
            }
            return (0, _["default"])(t, e), (0, h["default"])(t, [ {
                key: "componentDidMount",
                value: function() {
                    var e = this, t = "login" === this.state.view ? "email" : "name";
                    setTimeout(function() {
                        e.setFocus(t);
                    }, 350);
                }
            }, {
                key: "componentDidUpdate",
                value: function(e, t) {
                    var n = this.state.view;
                    if (("login" === n || "register" === n) && t.view !== n) {
                        var r = "login" === n ? "email" : "name";
                        this.setFocus(r);
                    }
                }
            }, {
                key: "onAuth",
                value: function(e, t) {
                    return j(this, void 0, void 0, s["default"].mark(function r() {
                        var o, i, a;
                        return s["default"].wrap(function(r) {
                            for (;;) switch (r.prev = r.next) {
                              case 0:
                                if (o = n.validate(t, this.state.view), this.forceValidation = !0, !o._valid) {
                                    r.next = 18;
                                    break;
                                }
                                return this.setState((0, w["default"])({}, this.state, {
                                    loading: !0
                                })), i = void 0, r.prev = 5, r.next = 8, R.promiseBackground(e, t);

                              case 8:
                                i = r.sent, r.next = 15;
                                break;

                              case 11:
                                r.prev = 11, r.t0 = r["catch"](5), r.t0.message && r.t0.message.includes("rejected by timeout") && A.logger.loginNoBgPageConnection(r.t0.message), 
                                i = {
                                    error: !0
                                };

                              case 15:
                                o = n.extendWithServerValidation(o, i), r.next = 20;
                                break;

                              case 18:
                                return this.setState((0, w["default"])({}, this.state, {
                                    validation: o,
                                    loading: !1
                                })), r.abrupt("return");

                              case 20:
                                if (!o._valid) {
                                    r.next = 23;
                                    break;
                                }
                                return a = "signup" === e ? "welcome" : "loginSuccess", r.abrupt("return", this.props.onSuccess ? this.props.onSuccess() : this.changeView(a));

                              case 23:
                                this.setState((0, w["default"])({}, this.state, {
                                    validation: o,
                                    loading: !1
                                }));

                              case 24:
                              case "end":
                                return r.stop();
                            }
                        }, r, this, [ [ 5, 11 ] ]);
                    }));
                }
            }, {
                key: "setFocus",
                value: function(e) {
                    this.refs.fieldset.setFocus(e);
                }
            }, {
                key: "loginView",
                value: function() {
                    var e = this, t = [ "email", "password" ];
                    return S.createElement("div", {
                        className: B.wrapper
                    }, this.state.validation.error && S.createElement("div", {
                        className: B.validation
                    }, this.state.validation.error), S.createElement("input", {
                        className: B.fakefield,
                        type: "text",
                        name: "fakeformstart",
                        onFocus: function() {
                            return e.focusForm("end");
                        }
                    }), S.createElement(N.Fieldset, (0, i["default"])({
                        forceValidation: this.forceValidation,
                        validation: this.state.validation,
                        onValidate: this.onValidate,
                        onSet: this.onSet,
                        ref: "fieldset",
                        formData: this.state.data,
                        fields: t
                    }, this.props)), S.createElement("div", {
                        className: B.loginNav
                    }, S.createElement(T.Button, {
                        loading: this.state.loading,
                        onClick: this.onSubmit,
                        styles: {
                            width: 120
                        },
                        text: "Log In"
                    }), S.createElement("a", {
                        target: "__blank",
                        href: n.getResetPassLink(this.state.data.email),
                        ref: "end",
                        className: P.cs(B.navigationItem, B.forgotLink)
                    }, "Forgot password?")), S.createElement("input", {
                        className: B.fakefield,
                        type: "text",
                        name: "fakeformend",
                        onFocus: function() {
                            return e.focusForm("start", "login");
                        }
                    }));
                }
            }, {
                key: "registerView",
                value: function() {
                    var e = this, t = [ "name", "email", "password" ];
                    return S.createElement("div", {
                        className: B.wrapper
                    }, S.createElement("input", {
                        className: B.fakefield,
                        type: "text",
                        name: "fakeformstart",
                        onFocus: function() {
                            return e.focusForm("end");
                        }
                    }), S.createElement("div", {
                        className: B.navigation
                    }, "Already have an account? ", S.createElement("span", {
                        tabIndex: 0,
                        ref: "end",
                        onClick: function() {
                            return e.changeView("login");
                        },
                        className: B.navigationItem
                    }, "Log In")), S.createElement(N.Fieldset, (0, i["default"])({
                        ref: "fieldset",
                        forceValidation: this.forceValidation,
                        validation: this.state.validation,
                        onValidate: this.onValidate,
                        onSet: this.onSet,
                        formData: this.state.data,
                        fields: t
                    }, this.props)), S.createElement(T.Button, {
                        loading: this.state.loading,
                        onClick: this.onSubmit,
                        text: "personalize grammarly"
                    }), S.createElement(L.Footer, null), S.createElement("input", {
                        className: B.fakefield,
                        type: "text",
                        name: "fakeformend",
                        onFocus: function() {
                            return e.focusForm("start", "register");
                        }
                    }));
                }
            }, {
                key: "render",
                value: function() {
                    var e = this, t = "login" === this.state.view, n = P.cs(B.form, this.state.loading && B.loading, B[this.state.view], this.props.showOnboardingVersion && B.onboardingVersion);
                    if ("welcome" === this.state.view) return S.createElement(M.Welcome, {
                        isShow: !0,
                        onClose: function() {
                            return e.props.onClose && e.props.onClose();
                        },
                        onGoPremium: function() {
                            return e.onGoPremium();
                        }
                    });
                    if ("loginSuccess" === this.state.view) return S.createElement(O.LoginSuccess, {
                        username: this.props.username,
                        onClose: function() {
                            return e.props.onClose && e.props.onClose();
                        }
                    });
                    var r = t ? this.props.showOnboardingVersion ? S.createElement("div", null, S.createElement("div", {
                        className: B.title
                    }, "Member Login"), S.createElement("div", {
                        className: B.subTitle
                    }, "to save your personalization settings")) : S.createElement("div", null, S.createElement("div", {
                        className: B.title
                    }, "Grammarly Member Login")) : this.props.showOnboardingVersion ? S.createElement("div", null, S.createElement("div", {
                        className: B.title
                    }, "Create an account"), S.createElement("div", {
                        className: B.subTitle
                    }, "to save your personalization settings"), S.createElement("div", {
                        className: B.freeLabel
                    }, "It’s free")) : S.createElement("div", {
                        className: B.personalizedTitle
                    }, "Personalize Grammarly", S.createElement("div", {
                        className: B.personalizedTitleSub
                    }, "to your writing needs"));
                    return S.createElement("form", {
                        className: n,
                        onClick: this.onClick
                    }, S.createElement("div", {
                        className: B.titleContainer
                    }, r), t ? this.loginView() : this.registerView(), t && S.createElement("div", {
                        className: B.toLogin
                    }, "New to Grammarly?", S.createElement("span", {
                        tabIndex: 0,
                        onClick: function() {
                            return e.changeView("register");
                        },
                        className: B.navigationItem
                    }, "Create a free account")));
                }
            } ]), t;
        }(S.Component);
        n.Form = W;
    }, {
        "../signin/fieldset": 230,
        "./button": 229,
        "./footer": 231,
        "./login-success": 234,
        "./welcome": 235,
        "babel-runtime/core-js/object/assign": 20,
        "babel-runtime/core-js/object/get-prototype-of": 24,
        "babel-runtime/core-js/object/keys": 25,
        "babel-runtime/core-js/promise": 28,
        "babel-runtime/helpers/classCallCheck": 31,
        "babel-runtime/helpers/createClass": 32,
        "babel-runtime/helpers/defineProperty": 33,
        "babel-runtime/helpers/extends": 34,
        "babel-runtime/helpers/inherits": 35,
        "babel-runtime/helpers/possibleConstructorReturn": 36,
        "babel-runtime/regenerator": 42,
        "lib/config": 203,
        "lib/dom": 207,
        "lib/message": 258,
        "lib/tracking": 282,
        "lib/url": 287,
        "lib/util": 288,
        react: "react"
    } ],
    233: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        var o = e("babel-runtime/core-js/object/get-prototype-of"), i = r(o), a = e("babel-runtime/helpers/classCallCheck"), s = r(a), c = e("babel-runtime/helpers/createClass"), l = r(c), u = e("babel-runtime/helpers/possibleConstructorReturn"), d = r(u), f = e("babel-runtime/helpers/inherits"), p = r(f);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var m = e("react"), h = e("lib/util"), g = e("lib/util"), b = e("lib/dom"), v = {
            input: "_d80b1b-input",
            label: "_d80b1b-label",
            windows: "_d80b1b-windows",
            inputElement: "_d80b1b-inputElement",
            validation: "_d80b1b-validation"
        }, _ = function(e) {
            function t() {
                (0, s["default"])(this, t);
                var e = (0, d["default"])(this, (t.__proto__ || (0, i["default"])(t)).apply(this, arguments));
                return e.id = h.guid(), e.state = {
                    cancelValidation: !0,
                    dirty: !1
                }, e.onBlur = function() {
                    e.setState({
                        cancelValidation: !1
                    }), e.props.onValidate(e.value);
                }, e.onChange = function() {
                    e.setState({
                        cancelValidation: !0,
                        dirty: !0
                    }), e.props.onSet(e.value);
                }, e;
            }
            return (0, p["default"])(t, e), (0, l["default"])(t, [ {
                key: "getValidation",
                value: function() {
                    return (this.props.validation && !this.state.cancelValidation && this.state.dirty || this.props.forceValidation) && m.createElement("div", {
                        className: v.validation,
                        dangerouslySetInnerHTML: {
                            __html: this.props.validation
                        }
                    });
                }
            }, {
                key: "render",
                value: function() {
                    var e = this.props, t = e.name, n = e.type, r = e.label, o = e.value, i = {
                        name: t,
                        type: n,
                        value: o,
                        id: this.id,
                        ref: "input",
                        required: !0,
                        spellCheck: !1,
                        onBlur: this.onBlur,
                        onChange: this.onChange,
                        className: v.inputElement
                    };
                    return m.createElement("div", {
                        className: b.cs(v.input, g.isWindows() && v.windows)
                    }, this.getValidation(), m.createElement("input", i), m.createElement("label", {
                        htmlFor: this.id,
                        className: v.label
                    }, r));
                }
            }, {
                key: "value",
                get: function() {
                    return this.refs.input.value;
                }
            } ]), t;
        }(m.Component);
        n.Input = _;
    }, {
        "babel-runtime/core-js/object/get-prototype-of": 24,
        "babel-runtime/helpers/classCallCheck": 31,
        "babel-runtime/helpers/createClass": 32,
        "babel-runtime/helpers/inherits": 35,
        "babel-runtime/helpers/possibleConstructorReturn": 36,
        "lib/dom": 207,
        "lib/util": 288,
        react: "react"
    } ],
    234: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        var o = e("babel-runtime/core-js/object/get-prototype-of"), i = r(o), a = e("babel-runtime/helpers/classCallCheck"), s = r(a), c = e("babel-runtime/helpers/createClass"), l = r(c), u = e("babel-runtime/helpers/possibleConstructorReturn"), d = r(u), f = e("babel-runtime/helpers/inherits"), p = r(f);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var m = e("react"), h = {
            loginSuccess: "_5f9912-loginSuccess",
            windows: "_5f9912-windows",
            name: "_5f9912-name",
            label: "_5f9912-label"
        }, g = function(e) {
            function t() {
                return (0, s["default"])(this, t), (0, d["default"])(this, (t.__proto__ || (0, i["default"])(t)).apply(this, arguments));
            }
            return (0, p["default"])(t, e), (0, l["default"])(t, [ {
                key: "componentDidMount",
                value: function() {
                    this.props.onClose && setTimeout(this.props.onClose, 1500);
                }
            }, {
                key: "render",
                value: function() {
                    return m.createElement("div", {
                        className: h.loginSuccess
                    }, this.props.username ? m.createElement("div", {
                        className: h.label
                    }, "Welcome back, ", m.createElement("span", {
                        className: h.name
                    }, this.props.username), "!") : m.createElement("div", {
                        className: h.label
                    }, "Welcome back!"));
                }
            } ]), t;
        }(m.Component);
        n.LoginSuccess = g;
    }, {
        "babel-runtime/core-js/object/get-prototype-of": 24,
        "babel-runtime/helpers/classCallCheck": 31,
        "babel-runtime/helpers/createClass": 32,
        "babel-runtime/helpers/inherits": 35,
        "babel-runtime/helpers/possibleConstructorReturn": 36,
        react: "react"
    } ],
    235: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        var o = e("babel-runtime/helpers/defineProperty"), i = r(o);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var a = e("react"), s = {
            welcome: "_66b3a6-welcome",
            windows: "_66b3a6-windows",
            image: "_66b3a6-image",
            content: "_66b3a6-content",
            show: "_66b3a6-show",
            title: "_66b3a6-title",
            text: "_66b3a6-text",
            close: "_66b3a6-close",
            learnMore: "_66b3a6-learnMore",
            goPremium: "_66b3a6-goPremium"
        }, c = e("lib/dom"), l = e("lib/util"), u = e("./button");
        n.Welcome = function(e) {
            var t, n = e.isShow, r = e.onClose, o = e.onGoPremium, d = c.cs((t = {}, (0, i["default"])(t, s.welcome, !0), 
            (0, i["default"])(t, s.show, n), (0, i["default"])(t, s.windows, l.isWindows()), 
            t));
            return a.createElement("div", {
                className: d
            }, a.createElement("div", {
                className: s.image
            }), a.createElement("div", {
                className: s.content
            }, a.createElement("div", {
                className: s.title
            }, "Welcome to Grammarly"), a.createElement("div", {
                className: s.text
            }, "Wave good-bye to the most frequent and pesky ", a.createElement("br", null), "writing mistakes."), a.createElement("div", {
                className: s.goPremium
            }, a.createElement("span", {
                className: s.checks
            }, "Go Premium and get 150+ additional", a.createElement("br", null), " advanced checks."), " ", a.createElement("a", {
                onClick: o,
                className: s.learnMore
            }, "Learn more")), a.createElement("div", {
                className: s.close
            }, a.createElement(u.Button, {
                onClick: r,
                text: "Continue to Your Text"
            }))));
        };
    }, {
        "./button": 229,
        "babel-runtime/helpers/defineProperty": 33,
        "lib/dom": 207,
        "lib/util": 288,
        react: "react"
    } ],
    236: [ function(e, t, n) {
        "use strict";
        function r() {
            function e() {
                p.fastHide();
            }
            function t(e) {
                var t = e.target;
                return s.inEl(t, u.posEl);
            }
            function n() {
                u.posEl && (d.parentNode && d.parentNode.removeChild(d), s.unlisten(u.doc, "scroll", e), 
                s.unlisten(u.moveListenerDoc, "scroll", e));
            }
            function r() {
                m && (m = !1, d.style.opacity = 0, d.style.top = "-9999px", p && p.setVisible(!1), 
                d.className = d.className.replace(u.cls, ""), console.log("hide tooltip"));
            }
            function c() {
                u.cls += " gr-no-transition", l(), setTimeout(function() {
                    u.cls = u.cls.replace(" gr-no-transition", ""), s.removeClass(d, "gr-no-transition");
                }, 100);
            }
            function l() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : u, t = e.posEl, n = void 0 === t ? u.posEl : t, r = e.html, i = void 0 === r ? u.html : r, c = e.text, l = void 0 === c ? u.text : c, g = e.cls, b = void 0 === g ? u.cls : g, v = e.doc, _ = void 0 === v ? u.doc : v, y = e.outerIframe, w = void 0 === y ? u.outerIframe : y;
                if (o.extend(u, {
                    posEl: n,
                    html: i,
                    text: l,
                    cls: b,
                    doc: _,
                    outerIframe: w
                }), h) {
                    m = !0, p && p.setVisible(!0), l && d.setAttribute("data-content", l), i && (f.innerHTML = i), 
                    d.className = "gr__tooltip", b && s.addClass(d, b), s.removeClass(d, "gr__flipped");
                    var k = a.getAbsRect(n, w), E = a.posToRect(d, k), C = E.rect, x = C.top, j = C.left;
                    s.css(d, {
                        top: x,
                        left: j
                    }), E && E.rect && !E.rect.flip && s.addClass(d, "gr__flipped");
                    var S = d.clientWidth, T = d.querySelector(".gr__triangle"), L = k.width / 2;
                    L > S && (L = 0), E.delta.right <= 0 && (L -= E.delta.right), L -= parseInt(getComputedStyle(d, null).getPropertyValue("margin-left")), 
                    T.style.marginLeft = parseInt(L) + "px", d.style.opacity = 1;
                }
            }
            var u = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, d = document.querySelector(".gr__tooltip"), f = void 0, p = void 0, m = void 0, h = void 0 == u.enabled || u.enabled;
            if (d || (d = s.createEl('<span class="gr__tooltip"><span class="gr__tooltip-content"></span><i class="gr__tooltip-logo"></i><span class="gr__triangle"></span></span>'), 
            document.documentElement.appendChild(d)), f = d.querySelector(".gr__tooltip-content"), 
            u.posEl) {
                var g = u.outerIframe && u.outerIframe.contentDocument || u.doc;
                p = new i.Hint({
                    doc: g,
                    doc2: u.doc,
                    hint: d,
                    hideDelay: 500,
                    delay: 0,
                    onshow: l,
                    onhide: r,
                    inTarget: t
                }), s.listen(u.doc, "scroll", e), s.listen(g, "scroll", e), p.bind();
            }
            var b = {
                show: l,
                fastShow: c,
                hide: r,
                remove: n,
                el: d,
                enable: function() {
                    h = !0;
                },
                disable: function() {
                    h = !1;
                },
                isEnabled: function() {
                    return h;
                }
            };
            return b;
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var o = e("lodash"), i = e("./hint"), a = e("../position"), s = e("../dom");
        n.Tooltip = r;
    }, {
        "../dom": 207,
        "../position": 262,
        "./hint": 214,
        lodash: "lodash"
    } ],
    237: [ function(e, t, n) {
        "use strict";
        function r(e) {
            var t = document.createElement("script");
            t.innerHTML = e, document.head.appendChild(t), t.parentNode.removeChild(t);
        }
        function o() {
            c.initContentScript(), r("window.GR_EXTENSION_ID='" + s.getUuid() + "'"), r("\n    window.GR_EXTENSION_SEND = function(key, data) {\n      if (!key) throw new TypeError('cant be called without message')\n      var e = document.createEvent('CustomEvent')\n      e.initCustomEvent('external:' + key, true, true, data)\n      document.dispatchEvent(e)\n    }\n  "), 
            s.externalEvents.map(function(e) {
                return "external:" + e;
            }).forEach(function(e) {
                return i.on.call(document, e, function(t) {
                    var n = t.detail;
                    console.log("external event", e, n), a.emitBackground(e, n);
                });
            });
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var i = e("./dom"), a = e("./message"), s = e("./config"), c = e("./tracking");
        n.External = o;
    }, {
        "./config": 203,
        "./dom": 207,
        "./message": 258,
        "./tracking": 282
    } ],
    238: [ function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var r = e("lib/tracking/felogPixel"), o = e("lib/tracking/telemetry"), i = {}, a = new o.Telemetry(r.sendEventPixel);
        n.failover = function() {
            function e() {
                setTimeout(o, c), i.index_load = !1;
            }
            function t() {
                setTimeout(s, l), i.app_load = !1;
            }
            function n(e) {
                i[e] = !0;
            }
            function r(e, t) {}
            function o() {
                r("index_load", "extension_loading"), i.index_load || a.pageLoadTimeout();
            }
            function s() {
                r("app_load", "extension_app_loading"), i.app_load || a.appLoadTimeout();
            }
            var c = 12e4, l = 12e4, u = {
                startPageLoadTimer: e,
                startAppLoadTimer: t,
                success: n,
                setPageLoadTimeout: function(e) {
                    return c = e;
                },
                setAppLoadTimeout: function(e) {
                    return l = e;
                }
            };
            return u;
        }();
    }, {
        "lib/tracking/felogPixel": 281,
        "lib/tracking/telemetry": 285
    } ],
    239: [ function(e, t, n) {
        "use strict";
        function r(e, t) {
            t.setDomSelection = function(t) {
                var n = o.getNodeByTextPos(e, t.begin), r = o.getNodeByTextPos(e, t.end);
                i.setDomRange(e.ownerDocument, {
                    anchorNode: n.node,
                    anchorOffset: t.begin - n.pos,
                    focusNode: r.node,
                    focusOffset: t.end - r.pos
                });
            }, t.setCursor = function(e) {
                t.cursor = e;
            }, t.fireDomEvent = function(e) {
                a.isFF() && i.emitDomEvent("document-mousedown-mouseup-activeElement");
                var t = " " == e || e.trim() ? "paste" : "backspace";
                i.emitDomEvent("document-" + t + "-activeElement", e);
            }, t.doReplace = function(e, n) {
                t.safeFocus(), t.setDomSelection(e), a.asyncCall(function() {
                    return t.fireDomEvent(n);
                });
            }, t.setTextareaValue = function(n) {
                t.safeFocus(), e.ownerDocument.getSelection().selectAllChildren(e), a.asyncCall(function() {
                    t.fireDomEvent(n.trimRight()), a.asyncCall(t._setCursor, 100);
                }, a.isSafari() ? 100 : 10);
            };
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var o = e("wrap"), i = e("lib/dom"), a = e("lib/util");
        n.extendDom = r;
    }, {
        "lib/dom": 207,
        "lib/util": 288,
        wrap: "wrap"
    } ],
    240: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o(e) {
            function t() {
                E();
            }
            function n(e) {
                var t = N.getBoundingClientRect(), n = x(e.clientX - t.left, e.clientY - t.top, t.left, t.top);
                if (n) {
                    n.e = e, e.stopPropagation();
                    var r = document.createEvent("CustomEvent");
                    r.initCustomEvent("gramMouse", !0, !0, n), A.dispatchEvent(r);
                }
            }
            function r(e) {
                try {
                    z.child.height = N.scrollHeight, D.scrollTop = N.scrollTop, clearTimeout(q), q = setTimeout(r, 100);
                } catch (e) {
                    console.log(e), r = d._f;
                }
            }
            function o(e) {
                return e ? e.split(" ").map(function(e) {
                    return isNaN(parseFloat(e)) && e.indexOf("px") == -1 ? e : Math.floor(parseFloat(e)) + "px";
                }).join(" ") : e;
            }
            function i() {
                var e = {}, t = I.getComputedStyle(N, null);
                if (!t) return e;
                var n = function(e) {
                    return t.getPropertyValue(e);
                }, r = function(e) {
                    var t = {};
                    return e.map(function(e) {
                        t[e] = n(e), "z-index" == e && "auto" == t[e] && N.style.zIndex && (t[e] = N.style.zIndex);
                    }), t;
                };
                e = {
                    parent: r([ "border", "border-radius", "box-sizing", "height", "width", "margin", "padding", "z-index", "border-top-width", "border-right-width", "border-left-width", "border-bottom-width", "border-top-style", "border-right-style", "border-left-style", "border-bottom-style", "padding-top", "padding-left", "padding-bottom", "padding-right", "margin-top", "margin-left", "margin-bottom", "margin-right" ]),
                    child: r([ "font", "font-size", "font-family", "text-align", "line-height", "letter-spacing", "text-shadow" ]),
                    src: r([ "position", "margin-top", "line-height", "font-size", "font-family", "z-index" ])
                };
                var i = e.parent["z-index"];
                if (e.parent["z-index"] = i && "auto" != i ? parseInt(i) - 1 : 0, e.parent.marginTop = o(e.parent.marginTop), 
                e.src.marginTop = o(e.src.marginTop), e.parent.margin = o(e.parent.margin), e.parent.padding = o(e.parent.padding), 
                (e.parent["border-top-width"] || e.parent["border-left-width"]) && (e.parent["border-style"] = "solid"), 
                e.parent.border) {
                    var a = e.parent.border.split(" ");
                    e.parent["border-width"] = a[0], a.length > 1 && (e.parent["border-style"] = a[1]), 
                    delete e.parent.border;
                }
                if (e.parent["border-color"] = "transparent !important", "absolute" == e.src.position || "relative" == e.src.position ? e.parent = u.extend(e.parent, r([ "top", "left" ])) : e.src.position = "relative", 
                H = K.customDefaultBg && K.customDefaultBg(N) || H || n("background"), d.isFF() && !H && (H = [ "background-color", "background-image", "background-repeat", "background-attachment", "background-position" ].map(n).join(" ")), 
                e.parent.background = H, d.isFF()) {
                    var s = parseInt(n("border-right-width")) - parseInt(n("border-left-width")), c = N.offsetWidth - N.clientWidth - s;
                    e.child["padding-right"] = c - 1 + "px";
                }
                return "start" == n("text-align") && (e.child["text-align"] = "ltr" == n("direction") ? "left" : "right"), 
                e;
            }
            function a(e) {
                U = e, v();
            }
            function g(e) {
                var t = {
                    background: "transparent !important",
                    "z-index": e["z-index"] || 1,
                    position: e.position,
                    "line-height": e["line-height"],
                    "font-size": e["font-size"],
                    "-webkit-transition": "none",
                    transition: "none"
                };
                parseInt(e["margin-top"]) > 0 && m.css(N.parentNode, {
                    width: "auto",
                    overflow: "hidden"
                });
                var n = I.devicePixelRatio > 1;
                if (n) {
                    var r = e["font-family"];
                    0 == r.indexOf("Consolas") && (r = r.replace("Consolas,", "Menlo, Monaco, 'Lucida Console', 'Liberation Mono', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', 'Courier New', monospace, serif"), 
                    z.child["font-family"] = r, t["font-family"] = r);
                }
                m.css(N, t);
            }
            function v() {
                var e = i();
                B || (g(e.src), G = N.previousElementSibling && "left" == m.css(N.previousElementSibling, "float"), 
                d.interval(v, 500), W || (W = !0, m.listen(N, Q)), B = !0), z.parent.marginTop = o(z.parent.marginTop), 
                e = u.merge(e, z), e.child.height = N.scrollHeight, K.fieldRestoreInlineStyles && K.fieldRestoreInlineStyles(N, e), 
                K.ghostHeight && (e.child.height = K.ghostHeight(e.child.height));
                var t = u.merge(V, {
                    "data-id": O,
                    "data-gramm_id": O,
                    "data-gramm": "gramm",
                    "data-gramm_editor": !0,
                    dir: N.getAttribute("dir")
                });
                R || (R = A.createElement("grammarly-ghost"), R.setAttribute("spellcheck", !1), 
                m.insertBefore(R, P)), M.matchPrefix && (t.className = M.matchPrefix), K.ghostHeight && (e.parent.height = K.ghostHeight(e.parent.height));
                var n = l.render(c.createElement(b, {
                    style: e,
                    attrs: t,
                    val: U
                }), R);
                D = l.findDOMNode(n), F = D.firstElementChild, D.contentEditable = !0, X.clone = D, 
                X.cloneVal = F, _(), y(), w(), 0 == N.offsetHeight ? S() : T(), X.emit("render");
            }
            function _() {
                if (G) {
                    if (N.getBoundingClientRect().left == D.getBoundingClientRect().left && N.getBoundingClientRect().top == D.getBoundingClientRect().top) return G = !1;
                    var e = N.getBoundingClientRect(), t = N.parentNode.getBoundingClientRect(), n = e.left - t.left, r = e.top - t.top, o = "translate(" + n + "px, " + r + "px)";
                    z.parent["-webkit-transform"] = o, z.parent.transform = o;
                }
            }
            function y() {
                function e(e, r, o) {
                    var i = o ? [ N, D ] : [ t, n ];
                    z.parent[r] = parseInt(parseInt(D.style[r]) + i[0][e] - i[1][e]) + "px";
                }
                var t = p.getAbsRect(N), n = p.getAbsRect(D);
                if (n.left != t.left && e("left", "marginLeft", !1), n.top != t.top && e("top", "marginTop", !1), 
                D.clientWidth == N.clientWidth || d.isFF() ? n.width != t.width && (V.width = t.width) : n.width != t.width ? D.style.width = t.width : e("clientWidth", "width", !0), 
                d.isFF()) {
                    var r = m.css(N.parentNode, [ "margin-left", "margin-top", "position" ]);
                    r && (r.marginLeft || r.marginTop) && "static" == r.position && (N.parentNode.style.position = "relative", 
                    N.parentNode.style.overflow = "");
                }
                n.height != t.height && (z.parent.height = t.height);
            }
            function w() {
                function e(e, t) {
                    return f.isFacebookSite() ? e.nextElementSibling && e.nextElementSibling.childNodes[0] != t : e.nextElementSibling != t;
                }
                var t = function(e) {
                    return A.contains && A.contains(e) || m.elementInDocument(e, A);
                };
                R && t(N) && (!e(R, N) && t(R) || m.insertBefore(R, P));
            }
            function k(e) {
                return D.querySelector(".gr_" + e);
            }
            function E() {
                var e = M.current();
                Y = [];
                for (var t = D.scrollTop, n = function(e) {
                    return {
                        x1: e.left,
                        x2: e.right,
                        y1: e.top + t,
                        y2: e.bottom + t
                    };
                }, r = 0; r < e.length; r++) {
                    var o = e[r], i = k(o.id);
                    if (i) {
                        C(i);
                        var a = p.getPos(i, D), s = {
                            x1: a.x,
                            x2: a.x + i.offsetWidth,
                            y1: a.y,
                            y2: a.y + i.offsetHeight + 5
                        }, c = {
                            match: o,
                            el: i,
                            box: s
                        };
                        Y.push(c);
                        var l = i.textContent.trim().split(" ").length > 1;
                        if (l) {
                            var d = i.getClientRects();
                            d.length < 2 || (c.rects = u.map(d, n));
                        }
                    }
                }
            }
            function C(e) {
                e.setAttribute("style", e.parentNode.getAttribute("style")), !e.classList.contains("gr_disable_anim_appear") && e.addEventListener("animationend", function() {
                    return e.classList.add("gr_disable_anim_appear");
                }), m.css(e, {
                    display: "",
                    padding: "",
                    margin: "",
                    width: ""
                });
            }
            function x(e, t, n, r) {
                for (var o = D.scrollTop, i = 0; i < Y.length; i++) {
                    var a = Y[i], s = a.box;
                    if (e >= s.x1 && e <= s.x2 && t >= s.y1 - o && t <= s.y2 - o) return a;
                    if (a.rects) for (var c = 0; c < a.rects.length; c++) {
                        var l = a.rects[c], u = e + n, d = t + r;
                        if (u >= l.x1 && u <= l.x2 && d >= l.y1 - o && d <= l.y2 - o) return a;
                    }
                }
            }
            function j() {
                clearTimeout(q), d.cancelInterval(v);
            }
            function S() {
                R.style.display = "none", d.isSafari() && (N.style.background = "", N.style.backgroundColor = ""), 
                N.style.background = H, d.cancelInterval(v), setTimeout(function() {
                    return X.emit("render");
                }, 300), B = !1, R.parentNode && R.parentNode.removeChild(R);
            }
            function T() {
                B || (R.style.display = "", R.parentNode || m.insertBefore(R, P), v(), r());
            }
            function L() {
                j(), m.unlisten(N, Q), S();
            }
            var N = e.el, P = f.isFacebookSite() ? N.parentNode : N, A = N.ownerDocument, I = A.defaultView, M = e.editor || {
                current: function() {
                    return [];
                }
            }, O = e.id, R = void 0, D = void 0, F = void 0, B = !1, W = void 0, U = "", G = !1, z = {
                parent: {},
                child: {}
            }, V = {}, H = void 0, q = void 0, Y = [], K = h.pageStyles(A).getFixesForCurrentDomain(), X = s({
                render: v,
                getStyle: i,
                setText: a,
                generateAlertPositions: E,
                remove: L,
                hide: S,
                show: T
            }), Q = {
                mousemove: n,
                mouseenter: t,
                keyup: r,
                scroll: r
            };
            return X;
        }
        var i = e("babel-runtime/helpers/extends"), a = r(i);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var s = e("emitter"), c = e("react"), l = e("react-dom"), u = e("lodash"), d = e("../util"), f = e("lib/location"), p = e("../position"), m = e("../dom"), h = e("../sites");
        n.Ghost = o;
        var g = {
            style: {
                child: {
                    display: "inline-block",
                    "line-height": "initial",
                    color: "transparent",
                    overflow: "hidden",
                    "text-align": "left",
                    "float": "initial",
                    clear: "none",
                    "box-sizing": "border-box",
                    "vertical-align": "baseline",
                    "white-space": "pre-wrap",
                    width: "100%",
                    margin: 0,
                    padding: 0,
                    border: 0
                },
                parent: {
                    position: "absolute",
                    color: "transparent",
                    "border-color": "transparent !important",
                    overflow: "hidden",
                    "white-space": "pre-wrap"
                },
                src: {}
            },
            attrs: {},
            val: ""
        }, b = c.createClass({
            displayName: "GhostComponent",
            getDefaultProps: function() {
                return g;
            },
            render: function() {
                var e = u.merge(g.style, this.props.style), t = this.props.attrs, n = m.camelizeAttrs(e.parent), r = m.camelizeAttrs(e.child), o = this.props.val;
                return c.createElement("div", (0, a["default"])({
                    style: n
                }, t, {
                    gramm: !0
                }), c.createElement("span", {
                    style: r,
                    dangerouslySetInnerHTML: {
                        __html: o
                    }
                }), c.createElement("br", null));
            }
        });
    }, {
        "../dom": 207,
        "../position": 262,
        "../sites": 266,
        "../util": 288,
        "babel-runtime/helpers/extends": 34,
        emitter: "emitter",
        "lib/location": 257,
        lodash: "lodash",
        react: "react",
        "react-dom": "react-dom"
    } ],
    241: [ function(e, t, n) {
        "use strict";
        function r(e) {
            function t() {
                return B = D(U), B.on("exit", j), B.dom.insertGhost = w, F = s.Ghost({
                    id: N,
                    el: S,
                    editor: B
                }), U.gh = F, B.ghostarea = U, B._run = B.run, B.run = n, B;
            }
            function n() {
                r("on"), O = !0, P = d(), B._run(), F.show();
            }
            function r() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "on", t = "on" == e ? o.listen : o.unlisten;
                t(S, "input", p), t(S, "keyup", _), t(S, "keydown", y), t(L, "click", h, null, !0), 
                F[e]("render", b), B[e]("rendered", E), B.isHtmlGhost || (B[e]("beforeReplace", m), 
                B[e]("afterReplace", k));
            }
            function d() {
                return "TEXTAREA" == S.tagName ? S.value : S.parentNode ? u.getText(S) : "";
            }
            function f(e) {
                S.value = e;
            }
            function p() {
                O && (P = d());
            }
            function m() {
                M = S.scrollTop;
            }
            function h(e) {
                if (a.isFacebookSite() && o.matchesSelector(e.target, W)) return v();
            }
            function g() {
                var e = T.createEvent("TextEvent");
                e.initTextEvent ? B.latestCursor.s == B.latestCursor.e && (e.initTextEvent("textInput", !0, !0, null, String.fromCharCode(8203), 1, "en-US"), 
                setTimeout(function() {
                    B.saveCursor(), B.skipInputEvents(), S.dispatchEvent(e), setTimeout(function() {
                        f(d().replace(String.fromCharCode(8203), "")), B.restoreCursor(), B.skipInputEvents(!1);
                    }, 50);
                }, 50)) : (o.runKeyEvent({
                    el: S,
                    type: "keydown"
                }), o.runKeyEvent({
                    el: S,
                    type: "keyup"
                })), S.scrollTop = M, P = d();
            }
            function b() {
                if ((0 == P.length && d().length > 0 || R) && (P = d(), R = !1), O) {
                    P = P.replace(new RegExp(String.fromCharCode(8203), "g"), "");
                    var e = c.diffPos(P, d()), t = 1 != P.indexOf("@") && d().indexOf("@") == -1;
                    e.delta >= 2 && 0 == e.s && (A || I) && !t && v();
                }
            }
            function v() {
                O && (C(), B.clearData());
            }
            function _(e) {
                B.camouflage();
            }
            function y(e) {
                I = 13 == i.keyCode(e);
            }
            function w() {
                return F.render(), {
                    clone: F.clone,
                    cloneVal: F.cloneVal
                };
            }
            function k() {
                setTimeout(g, 50);
            }
            function E() {
                F.generateAlertPositions();
            }
            function C() {
                O && F.hide();
            }
            function x() {
                O = !0, F.show();
            }
            function j() {
                r("off"), B && (B.off("exit", j), B.remove(), B = null), U.emit("exit"), S.removeAttribute("data-gramm"), 
                S.removeAttribute("data-txt_gramm_id"), F && (F.remove(), F = null);
            }
            var S = e.el, T = S.ownerDocument, L = T.defaultView, N = e.id, P = d(), A = !1, I = !1, M = void 0, O = !1, R = void 0, D = e.createEditor, F = void 0, B = void 0;
            S.setAttribute("data-gramm", ""), S.setAttribute("data-txt_gramm_id", N);
            var W = "div[role=navigation] li[role=listitem] *", U = l({
                el: S,
                id: N,
                hideClone: C,
                showClone: x,
                insertGhost: w,
                remove: j,
                run: n
            });
            return t();
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var o = e("../dom"), i = e("../util"), a = e("lib/location"), s = e("./ghost"), c = e("textdiff"), l = e("emitter"), u = e("wrap");
        n.GhostArea = r;
    }, {
        "../dom": 207,
        "../util": 288,
        "./ghost": 240,
        emitter: "emitter",
        "lib/location": 257,
        textdiff: "textdiff",
        wrap: "wrap"
    } ],
    242: [ function(e, t, n) {
        "use strict";
        function r() {
            return a.HTML_GHOST_SITES.includes(s);
        }
        function o() {
            return "[contenteditable]";
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var i = e("lib/location"), a = e("../page-config/defaults"), s = i.getDomain(null, null);
        n.isHtmlGhostSite = r, n.getHtmlGhostSelector = o;
    }, {
        "../page-config/defaults": 260,
        "lib/location": 257
    } ],
    243: [ function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var r = e("under"), o = e("wrap"), i = e("lib/util"), a = e("./facebook-ghost"), s = e("lib/location");
        n.HtmlGhostDom = function(e) {
            var t = e.editor, n = e.el, c = n.ownerDocument, l = r.HtmlDom(e), u = r.TextareaDom(e);
            return u.safeFocus = function() {
                var e = c.body.scrollTop;
                n.focus(), c.body.scrollTop = e;
            }, u.getCursor = function() {
                return l.getCursor();
            }, u.setCursor = function(e) {
                u.cursor = e, u._setCursor();
            }, u._setCursor = function() {
                o.invalidateNode(n), l.setCursor(u.cursor);
            }, u.getText = function() {
                return n.parentNode ? (o.invalidateNode(n), delete n.__getText, o.getText(n)) : "";
            }, u.replace = function(e, n, r) {
                t.inputListener.ignorePaste = !0, u.doReplace(e, n), e.replaced = !r, e.inDom = !r, 
                t.inputListener.ignorePaste = !1;
            }, u.doReplace = function(e, t) {
                var n = u.getText();
                n = n.substring(0, e.s) + t + n.substr(e.e), u.setTextareaValueSync(n), i.asyncCall(u._setCursor);
            }, u.setTextareaValueSync = function(e) {
                n.innerText = e, o.invalidateNode(n), u.safeFocus();
            }, u.setTextareaValue = function(e) {
                u.safeFocus(), i.asyncCall(function() {
                    n.innerText = e, o.invalidateNode(n);
                });
            }, s.isFacebookSite() && a.extendDom(n, u), u;
        };
    }, {
        "./facebook-ghost": 239,
        "lib/location": 257,
        "lib/util": 288,
        under: "under",
        wrap: "wrap"
    } ],
    244: [ function(e, t, n) {
        "use strict";
        function r(e, t) {
            function n() {
                r(), u = setTimeout(m, s), d = setTimeout(m, 1e3 * c[0]), f = setTimeout(m, 1e3 * c[1]), 
                p = setTimeout(m, 1e3 * c[2]);
            }
            function r() {
                l = 0, clearTimeout(u), clearTimeout(d), clearTimeout(f), clearTimeout(p);
            }
            var s = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : i, c = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : [ 30, 60, 120 ], l = 0, u = void 0, d = void 0, f = void 0, p = void 0, m = function h() {
                return l < a ? (s == i && e(), u = setTimeout(h, s), void l++) : (o.logger.infinityCheckResetFail(s), 
                void console.error("Infinity check reset fails, change to the offline state."));
            };
            return {
                start: n,
                finish: r
            };
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var o = e("./tracking"), i = 2e4, a = 3;
        n.InfinityChecker = r;
    }, {
        "./tracking": 282
    } ],
    245: [ function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var r = e("react");
        n.LogoIcon = function(e) {
            var t = e.className;
            return r.createElement("svg", {
                className: t,
                width: "18",
                height: "18",
                viewBox: "0 0 18 18"
            }, r.createElement("g", {
                transform: "translate(-7 -7)",
                fill: "none",
                fillRule: "evenodd"
            }, r.createElement("circle", {
                fill: "#00AE84",
                cx: "16",
                cy: "16",
                r: "9.008"
            }), r.createElement("path", {
                d: "M17.318 17.843c.052.297.335.504.64.504h.963l.56-.074c-.895 1.297-2.438 1.897-4.13 1.638-1.38-.214-2.566-1.14-3.065-2.437-1.134-2.942 1.03-5.75 3.84-5.75 1.468 0 2.75.852 3.49 1.882.193.304.58.385.864.185.267-.185.342-.533.178-.815-1.014-1.578-2.84-2.593-4.906-2.46-2.677.193-4.854 2.37-5.003 5.04-.18 3.103 2.295 5.637 5.382 5.637 1.618 0 3.065-.703 4.056-1.837l-.12.652v.585c0 .304.21.586.508.637.395.074.738-.23.738-.608v-3.52H17.93c-.38.008-.687.35-.612.74z",
                fill: "#FFF"
            })));
        }, n.IgnoreIcon = function(e) {
            var t = e.className;
            return r.createElement("span", {
                className: t,
                dangerouslySetInnerHTML: {
                    __html: '\n            <svg width="32" height="32" viewBox="0 0 32 32">\n              <defs>\n                <path d="M21,12.5 L21,20.1308289 C21,21.7154283 19.6513555,23 17.9996703,23 L14.0003297,23 C12.3432934,23 11,21.7124939 11,20.1308289 L11,12.5 L11,12.5" id="d70af4_ignoreIconUse"></path>\n                <mask data-mask-color="d70af4_ignoreIcon" id="d70af4_ignoreIconMask" x="-1" y="0" width="9.5" height="10.5">\n                  <use data-fix="d70af4_ignoreIcon" xlink:href="#d70af4_ignoreIconUse"/>\n                </mask>\n              </defs>\n              <g stroke="#D2D4DD" fill="none" fill-rule="evenodd">\n                <path d="M9 10.6h14" stroke-width="1.2"/>\n                <g stroke-width="1.2">\n                  <path d="M14.6 14v6M17.4 14v6"/>\n                </g>\n                <use mask="url(#d70af4_ignoreIconMask)" stroke-width="2.4" xlink:href="#d70af4_ignoreIconUse"/>\n                <path d="M18.5 11V9c0-1.1045695-.8982606-2-1.9979131-2h-1.0041738C14.3944962 7 13.5 7.8877296 13.5 9v2" stroke-width="1.2"/>\n              </g>\n            </svg>\n      '
                }
            });
        }, n.DictionaryIcon = function(e) {
            var t = e.className;
            return r.createElement("span", {
                className: t,
                dangerouslySetInnerHTML: {
                    __html: '\n        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n          <defs>\n            <mask id="57da07_dictionaryIconMask" x="0" y="0" width="10" height="15" fill="#fff">\n              <path id="57da07_dictionaryIconUse" d="M11 9h10v15l-4.8857422-4L11 24z"/>\n            </mask>\n          </defs>\n          <use mask="url(#57da07_dictionaryIconMask)" xlink:href="#57da07_dictionaryIconUse" stroke-width="2.4" stroke="#D2D4DD" fill="none"/>\n        </svg>\n      '
                }
            });
        }, n.DictionaryAddedIcon = function(e) {
            var t = e.className;
            return r.createElement("svg", {
                className: t,
                width: "15",
                height: "23",
                viewBox: "0 0 15 23"
            }, r.createElement("path", {
                d: "M14.773 22.573V.39h-14v22.183l7-5.326",
                fill: "#15C49A",
                fillRule: "evenodd"
            }));
        }, n.WikiIcon = function(e) {
            var t = e.className;
            return r.createElement("svg", {
                className: t,
                width: "32",
                height: "32",
                viewBox: "0 0 32 32"
            }, r.createElement("path", {
                d: "M13.633 21l2.198-4.264L17.64 21h.633l3.756-8.643c.21-.485.62-.776 1.057-.842V11H20.05v.515c.402.09.83.24 1.02.666l-2.758 6.363c-.5-1.06-1.01-2.22-1.498-3.375.504-1.07.915-2.064 1.533-3.04.36-.576.948-.59 1.25-.618V11h-3.23v.51c.404 0 1.242.037.868.822l-.936 1.97-.993-2.19c-.155-.342.145-.57.635-.596L15.938 11h-3.633v.51c.433.015 1.043.013 1.268.38.694 1.274 1.158 2.598 1.79 3.898l-1.636 3.06-2.75-6.323c-.31-.713.425-.943.903-1.002L11.874 11H8v.51c.535.178 1.225.974 1.418 1.376 1.447 3.027 2.176 5.057 3.557 8.114h.658z",
                fill: "#D2D4DD",
                fillRule: "evenodd"
            }));
        }, n.UndoIcon = function(e) {
            var t = e.className;
            return r.createElement("svg", {
                className: t,
                width: "32",
                height: "32",
                viewBox: "0 0 32 32"
            }, r.createElement("g", {
                stroke: "#D2D4DD",
                fill: "none",
                fillRule: "evenodd",
                strokeLinecap: "round"
            }, r.createElement("path", {
                d: "M11.518 8.412l-4.26 4.224L11.5 16.88"
            }), r.createElement("path", {
                d: "M16.192 22.236h4.23c2.642 0 4.784-2.147 4.784-4.783 0-2.642-2.15-4.784-4.787-4.784H8.1"
            })));
        };
    }, {
        react: "react"
    } ],
    246: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o(e, t, r, o, i, a) {
            switch (e.kind) {
              case "common":
                return y.createElement(P, {
                    model: e,
                    onIgnore: t,
                    onAddToDictionary: r,
                    onEditor: o,
                    onLogin: i,
                    isAddedToDictionary: a
                });

              case "synonyms":
                return y.createElement(n.CardSynonyms, {
                    model: e,
                    onEditor: o,
                    onLogin: i
                });

              default:
                ;
                return null;
            }
        }
        var i = e("babel-runtime/core-js/object/get-prototype-of"), a = r(i), s = e("babel-runtime/helpers/classCallCheck"), c = r(s), l = e("babel-runtime/helpers/createClass"), u = r(l), d = e("babel-runtime/helpers/possibleConstructorReturn"), f = r(d), p = e("babel-runtime/helpers/inherits"), m = r(p), h = e("babel-runtime/helpers/extends"), g = r(h);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var b = e("lib/config"), v = e("lib/message"), _ = e("lib/inline-cards/model/grammarly_editor_alert"), y = e("react"), w = e("./utils/react"), k = e("../dom"), E = e("../tracking"), C = e("./model/card"), x = e("./replacement"), j = e("./icons"), S = {
            container: "_c4f153-container",
            flip: "_c4f153-flip",
            flipSyn: "_c4f153-flipSyn",
            card: "_c4f153-card",
            bigTitle: "_c4f153-bigTitle",
            unknownWordTitle: "_c4f153-unknownWordTitle",
            btnDictLabelWithIcon: "_c4f153-btnDictLabelWithIcon",
            explanation: "_c4f153-explanation",
            replacement: "_c4f153-replacement",
            maxWidthReached: "_c4f153-maxWidthReached",
            item: "_c4f153-item",
            logoIcon: "_c4f153-logoIcon",
            ignoreIcon: "_c4f153-ignoreIcon",
            undoIcon: "_c4f153-undoIcon",
            dictionaryIcon: "_c4f153-dictionaryIcon",
            wikiIcon: "_c4f153-wikiIcon",
            footer: "_c4f153-footer",
            footerButton: "_c4f153-footerButton",
            btnIgnore: "_c4f153-btnIgnore",
            icon: "_c4f153-icon",
            btnLogo: "_c4f153-btnLogo",
            btnPersonalize: "_c4f153-btnPersonalize",
            personalizeMessage: "_c4f153-personalizeMessage",
            attn: "_c4f153-attn",
            cardAddedToDict: "_c4f153-cardAddedToDict",
            addedToDictTitle: "_c4f153-addedToDictTitle",
            dictionaryDescription: "_c4f153-dictionaryDescription",
            undo: "_c4f153-undo",
            dictLink: "_c4f153-dictLink",
            dictionaryAddedIcon: "_c4f153-dictionaryAddedIcon",
            synTitle: "_c4f153-synTitle",
            synList: "_c4f153-synList",
            synListSingle: "_c4f153-synListSingle",
            synListTitle: "_c4f153-synListTitle",
            synListNumber: "_c4f153-synListNumber",
            synSubitems: "_c4f153-synSubitems",
            synItem: "_c4f153-synItem",
            dict: "_c4f153-dict",
            dictContent: "_c4f153-dictContent",
            dictItemCounter: "_c4f153-dictItemCounter",
            dictItem: "_c4f153-dictItem",
            qualifier: "_c4f153-qualifier",
            dictFooterItem: "_c4f153-dictFooterItem",
            wiki: "_c4f153-wiki",
            gr__tooltip_empty: "gr__tooltip_empty",
            gr__tooltip: "gr__tooltip",
            "gr-notfound-tooltip": "gr-notfound-tooltip",
            "gr__tooltip-content": "gr__tooltip-content",
            "gr__tooltip-logo": "gr__tooltip-logo",
            gr__flipped: "gr__flipped"
        }, T = function(e) {
            var t = e.title, n = e.className;
            return y.createElement("div", (0, g["default"])({
                className: n
            }, w.setInnerHTML(t.toLowerCase(), [ "i", "b" ])));
        }, L = function(e) {
            var t = e.title, n = e.explanation;
            return y.createElement("div", null, y.createElement(T, {
                className: S.bigTitle,
                title: t
            }), y.createElement("div", (0, g["default"])({
                className: S.explanation
            }, w.setInnerHTML(n, [ "i", "b" ]))));
        };
        n.FooterButton = function(e) {
            var t = e.className, n = e.onClick, r = e.children;
            return y.createElement("div", {
                className: k.cs(S.footerButton, t),
                role: "button",
                onClick: function(e) {
                    e.stopPropagation(), n();
                }
            }, r);
        }, n.GrammarlyFooter = function(e) {
            var t = e.isUserAuthenticated, r = e.onEditor, o = e.onLogin;
            return t ? y.createElement(n.FooterButton, {
                className: k.cs(S.item, S.btnLogo),
                onClick: r
            }, y.createElement(j.LogoIcon, {
                className: k.cs(S.icon, S.logoIcon)
            }), " See more in Grammarly") : y.createElement(n.FooterButton, {
                className: k.cs(S.btnPersonalize, S.item),
                onClick: o
            }, y.createElement("div", {
                className: S.personalizeMessage
            }, y.createElement("span", {
                className: S.attn
            }, "ATTN:"), " You’re missing many ", y.createElement("br", null), " key Grammarly features."), y.createElement(j.LogoIcon, {
                className: k.cs(S.icon, S.logoIcon)
            }), " Personalize for free");
        }, n.CardCommonContent = function(e) {
            var t = e.model, r = e.onAddToDictionary, o = e.onIgnore, i = e.onEditor, a = e.onLogin, s = t.getFooterProps();
            return y.createElement("div", {
                className: k.cs(S.card)
            }, t.isTextCard ? !t.isUnknowWord && y.createElement(L, {
                title: t.title,
                explanation: t.explanation
            }) : y.createElement("div", {
                className: S.replacement
            }, y.createElement(x.Replacement, {
                itemClassName: S.item,
                replacement: t.getReplacements()
            })), y.createElement("div", {
                className: S.footer
            }, s.hasAddToDictionary && y.createElement(n.FooterButton, {
                className: k.cs(S.btnDict, S.item),
                onClick: function() {
                    return r();
                }
            }, t.isUnknowWord && y.createElement(T, {
                className: S.unknownWordTitle,
                title: t.title
            }), y.createElement("span", {
                className: k.cs(S.btnDictLabelWithIcon)
            }, y.createElement(j.DictionaryIcon, {
                className: k.cs(S.icon, S.dictionaryIcon)
            }), " Add to dictionary")), y.createElement(n.FooterButton, {
                className: k.cs(S.btnIgnore, S.item),
                onClick: function() {
                    return o();
                }
            }, y.createElement(j.IgnoreIcon, {
                className: k.cs(S.icon, S.ignoreIcon)
            }), " Ignore"), y.createElement(n.GrammarlyFooter, {
                onEditor: i,
                onLogin: a,
                isUserAuthenticated: t.isUserAuthenticated
            })));
        };
        var N = function(e) {
            var t = e.word;
            return y.createElement("div", {
                className: k.cs(S.card, S.cardAddedToDict)
            }, y.createElement("div", {
                className: S.addedToDictTitle
            }, y.createElement(j.DictionaryAddedIcon, {
                className: S.dictionaryAddedIcon
            }), " ", t), y.createElement("div", {
                className: S.dictionaryDescription
            }, "is now in your ", y.createElement("div", {
                onClick: function() {
                    v.emitBackground("open-url", b.URLS.appPersonalDictionary);
                },
                className: S.dictLink
            }, "personal dictionary")));
        }, P = function(e) {
            function t() {
                (0, c["default"])(this, t);
                var e = (0, f["default"])(this, (t.__proto__ || (0, a["default"])(t)).apply(this, arguments));
                return e.state = {
                    isAddedToDictionary: e.props.isAddedToDictionary
                }, e;
            }
            return (0, m["default"])(t, e), (0, u["default"])(t, [ {
                key: "render",
                value: function() {
                    var e = this, t = this.props.model;
                    return this.state.isAddedToDictionary ? y.createElement(N, {
                        word: t.highlightText
                    }) : y.createElement(n.CardCommonContent, {
                        onAddToDictionary: function() {
                            e.setState({
                                isAddedToDictionary: !0
                            }), e.props.onAddToDictionary();
                        },
                        onIgnore: this.props.onIgnore,
                        onEditor: this.props.onEditor,
                        onLogin: this.props.onLogin,
                        model: t
                    });
                }
            } ]), t;
        }(y.Component);
        n.CardCommon = P;
        var A = function(e) {
            var t = e.meanings;
            switch (t.length) {
              case 0:
                return y.createElement("span", null);

              case 1:
                return y.createElement("div", {
                    className: k.cs(S.synList, S.synListSingle)
                }, y.createElement("div", {
                    className: S.synSubitems
                }, y.createElement(x.Replacement, {
                    replacement: t[0].list,
                    itemClassName: S.synItem
                })));

              default:
                return y.createElement("div", {
                    className: S.synList
                }, t.map(function(e, t) {
                    return y.createElement("div", {
                        key: t,
                        className: S.synListItem
                    }, y.createElement("div", {
                        className: S.synListTitle
                    }, y.createElement("span", {
                        className: S.synListNumber
                    }, t + 1, "."), e.title), y.createElement("div", {
                        className: S.synSubitems
                    }, y.createElement(x.Replacement, {
                        replacement: e.list,
                        itemClassName: S.synItem
                    })));
                }));
            }
        };
        n.CardSynonyms = function(e) {
            var t = e.model, r = e.onEditor, o = e.onLogin;
            return y.createElement("div", {
                className: k.cs(S.card, S.synCard)
            }, y.createElement("div", {
                className: S.synTitle
            }, "Synonyms:"), y.createElement(A, {
                meanings: t.meanings
            }), y.createElement("div", {
                className: S.footer
            }, y.createElement(n.GrammarlyFooter, {
                onEditor: r,
                onLogin: o,
                isUserAuthenticated: t.isUserAuthenticated
            })));
        };
        var I = 288, M = function(e) {
            function t() {
                (0, c["default"])(this, t);
                var e = (0, f["default"])(this, (t.__proto__ || (0, a["default"])(t)).apply(this, arguments));
                return e.state = {
                    isMaxWidth: !1
                }, e;
            }
            return (0, m["default"])(t, e), (0, u["default"])(t, [ {
                key: "componentDidMount",
                value: function() {
                    this.el && this.el.firstElementChild && this.el.firstElementChild.clientWidth === I && this.setState({
                        isMaxWidth: !0
                    });
                }
            }, {
                key: "render",
                value: function() {
                    var e = this, t = this.props, n = t.model, r = t.onIgnore, i = t.onAddToDictionary, a = t.onEditor, s = t.onLogin, c = t.isAddedToDictionary;
                    return y.createElement("div", {
                        onClick: function(e) {
                            return e.stopPropagation();
                        },
                        key: n.id,
                        ref: function(t) {
                            return e.el = t;
                        },
                        className: k.cs(this.state.isMaxWidth && S.maxWidthReached)
                    }, o(n, r, i, a, s, c));
                }
            } ]), t;
        }(y.Component);
        n.Card = M;
        var O = function(e) {
            function t() {
                (0, c["default"])(this, t);
                var e = (0, f["default"])(this, (t.__proto__ || (0, a["default"])(t)).apply(this, arguments));
                return e.state = {
                    pos: {
                        rect: {
                            top: 0,
                            left: 0,
                            width: 0,
                            height: 0,
                            flip: !1
                        },
                        sourceRect: {
                            width: 0
                        },
                        delta: {
                            right: 0,
                            left: 0,
                            bottom: 0,
                            top: 0
                        },
                        className: "",
                        visible: !1
                    },
                    addedToDict: !1,
                    match: {},
                    visible: !1
                }, e.handlers = function(t, n, r) {
                    var o = e.state.match, i = e.props;
                    if (e.state.addedToDict) return void E.fire("show-dictionary");
                    if (t) switch (t) {
                      case "replace":
                        i.animateReplacement(o.id, n, r), o.replace(n, !1), i.hide();
                        break;

                      case "ignore":
                        o.ignore(), i.hide();
                        break;

                      case "hide":
                        i.hide();
                        break;

                      case "anim-hide":
                        i.hide();
                        break;

                      case "editor":
                        i.openEditor();
                        break;

                      case "login":
                        i.openEditor();
                        break;

                      case "add":
                        i.addToDict();
                    }
                }, e;
            }
            return (0, m["default"])(t, e), (0, u["default"])(t, [ {
                key: "createCardModel",
                value: function(e, t) {
                    var n = this;
                    switch (e.kind) {
                      case "common":
                        return new C.CommonCardModelImpl(e, function(e, t) {
                            return n.handlers("replace", e, t);
                        }, t);

                      case "synonym":
                        return new C.SynonymsCardModelImpl(e, function(e) {
                            return n.handlers("replace", e);
                        }, t);

                      default:
                        ;
                        return null;
                    }
                }
            }, {
                key: "render",
                value: function() {
                    var e = this, t = this.state, n = t.pos, r = t.match, o = t.visible, i = t.addedToDict, a = n.rect, s = a.flip, c = {
                        top: a.top,
                        left: a.left,
                        visibility: o ? "" : "hidden"
                    };
                    if (!o) return y.createElement("div", null);
                    var l = _.createAlert(r), u = this.createCardModel(l, !this.props.isAnonymous());
                    return y.createElement("div", {
                        style: c,
                        className: k.cs(S.container, s && S.flip, s && "synonyms" === u.kind && S.flipSyn)
                    }, y.createElement(M, {
                        model: u,
                        onIgnore: function() {
                            return e.handlers("ignore");
                        },
                        onAddToDictionary: function() {
                            return e.handlers("add");
                        },
                        isAddedToDictionary: i,
                        onLogin: function() {
                            return e.handlers("login");
                        },
                        onEditor: function() {
                            return e.handlers("editor");
                        }
                    }));
                }
            } ]), t;
        }(y.Component);
        n.PositionedCard = O;
    }, {
        "../dom": 207,
        "../tracking": 282,
        "./icons": 245,
        "./model/card": 249,
        "./replacement": 252,
        "./utils/react": 255,
        "babel-runtime/core-js/object/get-prototype-of": 24,
        "babel-runtime/helpers/classCallCheck": 31,
        "babel-runtime/helpers/createClass": 32,
        "babel-runtime/helpers/extends": 34,
        "babel-runtime/helpers/inherits": 35,
        "babel-runtime/helpers/possibleConstructorReturn": 36,
        "lib/config": 203,
        "lib/inline-cards/model/grammarly_editor_alert": 251,
        "lib/message": 258,
        react: "react"
    } ],
    247: [ function(e, t, n) {
        "use strict";
        function r(e) {
            var t = {
                Spelling: i.contextualSpelling,
                ContextualSpelling: i.contextualSpelling,
                Grammar: i.grammar,
                Style: i.style,
                SentenceStructure: i.sentenceStructure,
                Punctuation: i.punctuation
            };
            if (void 0 === t[e]) throw new TypeError("Unknown alert group " + e);
            return t[e];
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var o = e("./alert_replacement");
        n.createReplacement = o.createReplacement, n.createSimpleReplacement = o.createSimpleReplacement;
        var i;
        !function(e) {
            e[e.contextualSpelling = 0] = "contextualSpelling", e[e.grammar = 1] = "grammar", 
            e[e.sentenceStructure = 2] = "sentenceStructure", e[e.punctuation = 3] = "punctuation", 
            e[e.style = 4] = "style", e[e.plagiarism = 5] = "plagiarism", e[e.synonym = 6] = "synonym";
        }(i = n.AlertGroup || (n.AlertGroup = {})), n.alertGroupFromString = r;
    }, {
        "./alert_replacement": 248
    } ],
    248: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o(e, t) {
            return {
                re: new RegExp("^(" + e + ")(.*)$"),
                createResult: t
            };
        }
        function i(e) {
            function t(e) {
                var t = !0, n = !1, r = void 0;
                try {
                    for (var o, i = (0, l["default"])(u); !(t = (o = i.next()).done); t = !0) {
                        var a = o.value, s = e.match(a.re);
                        if (null !== s) return [ a.createResult(s), s[s.length - 1] ];
                    }
                } catch (c) {
                    n = !0, r = c;
                } finally {
                    try {
                        !t && i["return"] && i["return"]();
                    } finally {
                        if (n) throw r;
                    }
                }
            }
            for (var n = e, r = []; n.length > 0; ) {
                var o = t(n);
                if (void 0 === o) throw new Error("Coudln't parse transform");
                if ("insert" === o[0].type) {
                    var i = r[r.length - 1];
                    i && "delete" === i.type && r.push({
                        type: "arrow"
                    });
                }
                r.push(o[0]), n = o[1];
            }
            return r;
        }
        function a(e, t) {
            return {
                newText: t,
                transform: i(e)
            };
        }
        function s(e) {
            var t = [ {
                type: "insert",
                text: e
            } ];
            return {
                newText: e,
                transform: t
            };
        }
        var c = e("babel-runtime/core-js/get-iterator"), l = r(c);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var u = [ o("(?:\\<span class='gr_grammar_del'\\>([\\S\\s]*?)\\</span\\>)", function(e) {
            return {
                type: "delete",
                text: e[2]
            };
        }), o("(?:\\<span class='gr_grammar_ins'\\>([\\S\\s]*?)\\</span\\>)", function(e) {
            return {
                type: "insert",
                text: e[2]
            };
        }), o("(→)", function(e) {
            return {
                type: "arrow"
            };
        }), o("([^<>→]+)", function(e) {
            return {
                type: "text",
                text: e[1]
            };
        }) ];
        n.parseTransformHtml = i, n.createReplacement = a, n.createSimpleReplacement = s;
    }, {
        "babel-runtime/core-js/get-iterator": 16
    } ],
    249: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        var o = e("babel-runtime/core-js/object/get-prototype-of"), i = r(o), a = e("babel-runtime/helpers/createClass"), s = r(a), c = e("babel-runtime/helpers/possibleConstructorReturn"), l = r(c), u = e("babel-runtime/helpers/inherits"), d = r(u), f = e("babel-runtime/helpers/classCallCheck"), p = r(f);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var m = e("./alert"), h = e("./card_replacement"), g = function _(e, t) {
            (0, p["default"])(this, _), this.isUserAuthenticated = t, this.id = e.id, this.title = e.title, 
            this.explanation = e.explanation, this.details = e.details;
        };
        n.CardModelBaseImpl = g;
        var b = function(e) {
            function t(e, n, r) {
                (0, p["default"])(this, t);
                var o = (0, l["default"])(this, (t.__proto__ || (0, i["default"])(t)).call(this, e, r));
                return o._alert = e, o._replace = n, o.isUserAuthenticated = r, o.kind = "common", 
                o.details = o._alert.details, o.todo = o._alert.todo, o.isUnknowWord = "Unknown" === o._alert.category, 
                o.highlightText = o._alert.highlightText, o.extraProperties = o._alert.extraProperties, 
                o.hasAcknowledgeButton = 0 === o._alert.replacements.length && o._alert.group !== m.AlertGroup.contextualSpelling, 
                o.hasAddToDictionary = !!o._alert.extraProperties.hasAddToDictionary, o.isTextCard = h.isNoReplacement(o._alert.replacements), 
                o.title = o._getTitle(), o;
            }
            return (0, d["default"])(t, e), (0, s["default"])(t, [ {
                key: "_getTitle",
                value: function() {
                    return this.isUnknowWord ? "Unknown word" : "Misspelled" === this._alert.category ? "" : this._alert.extraProperties.isDidYouMean || this.extraProperties.isShowTitle ? "Check word usage" : this._alert.todo;
                }
            }, {
                key: "getFooterProps",
                value: function() {
                    return {
                        hasAcknowledgeButton: this.hasAcknowledgeButton,
                        hasAddToDictionary: this.hasAddToDictionary
                    };
                }
            }, {
                key: "getReplacements",
                value: function() {
                    var e = this._alert.replacements;
                    return h.isNoReplacement(e) ? new h.EmptyReplacement() : new h.CardReplacementList(this.title, e, this._replace);
                }
            } ]), t;
        }(g);
        n.CommonCardModelImpl = b;
        var v = function y(e, t, n) {
            var r = this;
            (0, p["default"])(this, y), this._alert = e, this._replace = t, this.isUserAuthenticated = n, 
            this.kind = "synonyms", this.meanings = this._alert.meanings.map(function(e) {
                return {
                    title: e.title,
                    list: new h.CardReplacementFlatList("", e.replacements, function(e) {
                        return r._replace(e);
                    })
                };
            }), this.isActive = !1, this.isAnyMeanings = Boolean(this.meanings.length), this.id = this._alert.id, 
            this.title = this._alert.title, this.explanation = "", this.details = "";
        };
        n.SynonymsCardModelImpl = v;
    }, {
        "./alert": 247,
        "./card_replacement": 250,
        "babel-runtime/core-js/object/get-prototype-of": 24,
        "babel-runtime/helpers/classCallCheck": 31,
        "babel-runtime/helpers/createClass": 32,
        "babel-runtime/helpers/inherits": 35,
        "babel-runtime/helpers/possibleConstructorReturn": 36
    } ],
    250: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o(e) {
            return !e || 0 === e.length;
        }
        function i(e) {
            return e.slice(e.findIndex(function(e) {
                return "arrow" === e.type;
            }) + 1).filter(function(e) {
                return "delete" !== e.type;
            }).map(function(e) {
                return "insert" === e.type || "text" === e.type ? e.text : "";
            }).join("");
        }
        var a = e("babel-runtime/core-js/object/get-prototype-of"), s = r(a), c = e("babel-runtime/helpers/possibleConstructorReturn"), l = r(c), u = e("babel-runtime/helpers/inherits"), d = r(u), f = e("babel-runtime/helpers/classCallCheck"), p = r(f);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var m;
        !function(e) {
            e[e.single = 0] = "single", e[e.list = 1] = "list", e[e.flatList = 2] = "flatList", 
            e[e.empty = 3] = "empty";
        }(m = n.CardReplacementTemplate || (n.CardReplacementTemplate = {})), n.isNoReplacement = o;
        var h = function _() {
            (0, p["default"])(this, _), this.template = m.empty, this.headerText = "";
        };
        n.EmptyReplacement = h;
        var g = function y(e, t, n) {
            var r = this;
            (0, p["default"])(this, y), this.headerText = e, this._replacement = t, this._onReplace = n, 
            this.transform = this._replacement.transform, this.onReplace = function() {
                return r._onReplace(r._replacement.newText);
            }, this.template = m.single;
        };
        n.CardReplacementSingle = g;
        var b = function w(e, t, n) {
            var r = this;
            (0, p["default"])(this, w), this.headerText = e, this.replacements = t, this._onReplace = n, 
            this.template = m.list, this.getOnReplace = function(e) {
                return function() {
                    r._onReplace(e.newText, i(e.transform));
                };
            };
        };
        n.CardReplacementList = b;
        var v = function(e) {
            function t(e, n, r) {
                (0, p["default"])(this, t);
                var o = (0, l["default"])(this, (t.__proto__ || (0, s["default"])(t)).call(this, e, n, r));
                return o.headerText = e, o.template = m.flatList, o;
            }
            return (0, d["default"])(t, e), t;
        }(b);
        n.CardReplacementFlatList = v;
    }, {
        "babel-runtime/core-js/object/get-prototype-of": 24,
        "babel-runtime/helpers/classCallCheck": 31,
        "babel-runtime/helpers/inherits": 35,
        "babel-runtime/helpers/possibleConstructorReturn": 36
    } ],
    251: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o(e) {
            var t = e.rawMatch;
            return d.invariant("synonym" !== t.action, "Do not use `getBasicAlertFields` for synonyms."), 
            {
                id: t.id.toString(),
                hidden: t.hidden,
                category: t.category,
                isFree: t.free,
                highlightText: t.highlightText,
                range: {
                    start: t.begin,
                    end: t.end
                },
                group: f.alertGroupFromString(t.group)
            };
        }
        function i(e) {
            var t = e.rawMatch, n = Number(t.synonyms.pos), r = t.synonyms.token, o = n + r.length;
            return {
                id: e.id,
                hidden: !1,
                category: t.category,
                isFree: !0,
                highlightText: r,
                range: {
                    start: n,
                    end: o
                },
                group: f.AlertGroup.synonym
            };
        }
        function a(e) {
            var t = "common", n = e.rawMatch, r = n.extra_properties, i = o(e), a = {
                title: n.title,
                details: n.details,
                explanation: n.explanation
            }, s = (0, u["default"])(i, a), c = {
                kind: t,
                todo: n.todo,
                replacements: (n.transforms || []).map(function(e, t) {
                    return f.createReplacement(e, n.replacements[t]);
                }),
                extraProperties: {
                    hasAddToDictionary: !!r.add_to_dict,
                    isDidYouMean: !!r.did_you_mean,
                    isShowTitle: !!r.show_title,
                    isEnchancement: !!r.enhancement,
                    plagiarismUrl: r.url,
                    sentence: r.sentence,
                    priority: r.priority ? parseInt(r.priority, 10) : 0
                }
            };
            return (0, u["default"])(s, c);
        }
        function s(e) {
            var t = "synonym", n = e.rawMatch, r = i(e), o = {
                title: n.synonyms.token,
                details: "",
                explanation: ""
            }, a = (0, u["default"])(r, o), s = {
                kind: t,
                meanings: n.synonyms.meanings.map(function(e) {
                    return {
                        title: e.meaning,
                        replacements: e.synonyms.map(function(e) {
                            return f.createSimpleReplacement(e.derived);
                        })
                    };
                }),
                replacements: (n.replacements || []).map(f.createSimpleReplacement)
            };
            return (0, u["default"])(a, s);
        }
        function c(e) {
            var t = e.rawMatch;
            if (!t.group && "synonyms" === t.action) return s(e);
            var n = f.alertGroupFromString(e.rawMatch.group);
            switch (n) {
              default:
                return a(e);
            }
        }
        var l = e("babel-runtime/core-js/object/assign"), u = r(l);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var d = e("../utils"), f = e("./alert");
        n.createAlert = c;
    }, {
        "../utils": 254,
        "./alert": 247,
        "babel-runtime/core-js/object/assign": 20
    } ],
    252: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o(e) {
            var t = e.filter(function(e) {
                return "insert" === e.type || "delete" === e.type;
            });
            return t.length > 0 ? t[t.length - 1].type + "Replacement" : "";
        }
        function i(e, t) {
            var n = e.slice(t).filter(function(e) {
                return "insert" === e.type;
            });
            return n.length > 0 ? n[0].text : "";
        }
        function a(e, t) {
            var n = e.slice(0, t).filter(function(e) {
                return "delete" === e.type;
            });
            return n.length > 0 ? n[0].text : "";
        }
        function s(e, t) {
            return !!e[t + 1] && "delete" === e[t + 1].type;
        }
        function c(e, t) {
            return !!e[t + 1] && "text" === e[t + 1].type;
        }
        function l(e, t) {
            return !!e[t + 1] && "insert" === e[t + 1].type;
        }
        function u(e) {
            return 0 === e.filter(function(e) {
                return "insert" !== e.type && "text" !== e.type;
            }).length;
        }
        function d(e) {
            return e.slice(e.findIndex(function(e) {
                return "arrow" === e.type;
            }) + 1);
        }
        function f(e, t, n, r, o) {
            return k.createElement("span", {
                className: E.cs(S.insertPart, n && S.insertWithWord, x.isSinglePunctuation(e) && S.insertPunctuation, x.isQuestion(e) && S.insertQuestion, r && S.nextIsWord),
                key: o
            }, x.highlightDiff(t, e));
        }
        function p(e, t, n) {
            return k.createElement("span", {
                className: E.cs(S.deletePart, x.isQuoteWithPunctuation(e) && S.deleteQuoteWithPunctuation, x.isPunctuation(e) && S.deletePunctuation, x.isColonOrSemicolon(e) && S.deleteColonOrSemicolon, x.isComma(e) && S.deleteComma, x.isExclamation(e) && S.deleteExclamation, x.isDash(e) && S.deleteDash, x.isQuestion(e) && S.deleteQuestion, x.isEllipsis(e) && S.deleteEllipsis, x.isQuote(e) && S.deleteQuote, x.isPeriod(e) && S.deletePeriod, x.isParenthesis(e) && S.deleteParenthesis, x.isDoubleComma(e) && S.deleteDoubleComma, x.isAphostrophe(e) && S.deleteAphostrophe, x.isLetter(e) && S.deleteLetter, x.isPunctuationAndLetter(e) && S.deletePunctuationBeforeLetter),
                key: n
            }, x.highlightDiff(t, e));
        }
        function m(e, t, n, r) {
            return k.createElement("span", {
                className: E.cs(S.wordPart, t && S.wordBeforeDelete, n && S.wordBeforeInsert),
                key: r
            }, e);
        }
        function h(e, t, n) {
            return k.createElement("span", {
                key: n,
                className: S[o(e)],
                onClick: j.stopPropagation(t)
            }, d(e).map(function(t, n) {
                switch (t.type) {
                  case "delete":
                    return p(t.text, i(e, n), n);

                  case "insert":
                    return f(t.text, a(e, n), u(e), c(e, n), n);

                  case "text":
                    return m(t.text, s(e, n), l(e, n), n);

                  default:
                    throw new Error("Part " + t + " should not exist");
                }
            }));
        }
        function g(e, t) {
            return k.createElement("div", (0, w["default"])({
                className: S.title,
                onClick: j.stopPropagation(t)
            }, j.setInnerHTML(e)));
        }
        function b(e, t) {
            return k.createElement("div", {
                className: E.cs(S.singleReplacement, t)
            }, k.createElement("div", null, h(e.transform, e.onReplace)));
        }
        function v(e, t, n) {
            return k.createElement("div", {
                className: S.listReplacement
            }, e.replacements.map(function(r, o) {
                return k.createElement("div", {
                    key: o,
                    className: E.cs(S.listItemReplacementWrapper, n, t && S.flattenListItemReplacementWrapper, 0 === o && !e.headerText && S.listItemReplacementNoHeader),
                    onClick: e.getOnReplace(r)
                }, 0 === o && e.headerText && g(e.headerText, e.getOnReplace(r)), k.createElement("span", {
                    className: S.listItemReplacement
                }, h(r.transform, e.getOnReplace(r), o)));
            }));
        }
        function _(e, t) {
            switch (e.template) {
              case C.CardReplacementTemplate.single:
                return b(e, t);

              case C.CardReplacementTemplate.list:
                return v(e, !1, t);

              case C.CardReplacementTemplate.flatList:
                return v(e, !0, t);

              default:
                throw new Error("Replacement template " + C.CardReplacementTemplate[e.template] + " is not supported");
            }
        }
        var y = e("babel-runtime/helpers/extends"), w = r(y);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var k = e("react"), E = e("../../dom"), C = e("../model/card_replacement"), x = e("./utils"), j = e("../utils/react"), S = {
            title: "_abcbcc-title",
            replacement: "_abcbcc-replacement",
            singleReplacement: "_abcbcc-singleReplacement",
            listItemReplacement: "_abcbcc-listItemReplacement",
            sideCommas: "_abcbcc-sideCommas",
            orReplacement: "_abcbcc-orReplacement",
            insertReplacement: "_abcbcc-insertReplacement",
            longReplacement: "_abcbcc-longReplacement",
            didYouMean: "_abcbcc-didYouMean",
            wordPart: "_abcbcc-wordPart",
            wordBeforeInsert: "_abcbcc-wordBeforeInsert",
            insertPart: "_abcbcc-insertPart",
            insertPunctuation: "_abcbcc-insertPunctuation",
            deleteReplacement: "_abcbcc-deleteReplacement",
            deletePart: "_abcbcc-deletePart",
            wordBeforeDelete: "_abcbcc-wordBeforeDelete",
            deletePunctuation: "_abcbcc-deletePunctuation",
            deleteColonOrSemicolon: "_abcbcc-deleteColonOrSemicolon",
            deleteParenthesis: "_abcbcc-deleteParenthesis",
            deleteQuestion: "_abcbcc-deleteQuestion",
            deleteExclamation: "_abcbcc-deleteExclamation",
            deletePeriod: "_abcbcc-deletePeriod",
            deleteQuote: "_abcbcc-deleteQuote",
            deleteDash: "_abcbcc-deleteDash",
            deleteEllipsis: "_abcbcc-deleteEllipsis",
            deleteQuoteWithPunctuation: "_abcbcc-deleteQuoteWithPunctuation",
            deleteApostrophe: "_abcbcc-deleteApostrophe",
            deletePunctuationBeforeLetter: "_abcbcc-deletePunctuationBeforeLetter",
            deleteLetter: "_abcbcc-deleteLetter",
            deleteDoubleComma: "_abcbcc-deleteDoubleComma",
            insertQuestion: "_abcbcc-insertQuestion",
            nextIsWord: "_abcbcc-nextIsWord",
            listReplacement: "_abcbcc-listReplacement",
            arrowPart: "_abcbcc-arrowPart",
            bold: "_abcbcc-bold",
            orSeparator: "_abcbcc-orSeparator",
            didYouMeanLabel: "_abcbcc-didYouMeanLabel",
            listItemReplacementNoHeader: "_abcbcc-listItemReplacementNoHeader",
            listItemReplacementWrapper: "_abcbcc-listItemReplacementWrapper",
            flattenListItemReplacementWrapper: "_abcbcc-flattenListItemReplacementWrapper"
        };
        n.Replacement = function(e) {
            return k.createElement("div", {
                className: E.cs(S.replacement)
            }, _(e.replacement, e.itemClassName));
        };
    }, {
        "../../dom": 207,
        "../model/card_replacement": 250,
        "../utils/react": 255,
        "./utils": 253,
        "babel-runtime/helpers/extends": 34,
        react: "react"
    } ],
    253: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return null !== e && e.replace(/\s/g, "").length < 3 && null !== e.match(E);
        }
        function o(e) {
            return null !== e && e.replace(/\s/g, "").length < 3 && null !== e.match(/[;:]/);
        }
        function i(e) {
            return null !== e && 1 === e.replace(/\s/g, "").length && r(e);
        }
        function a(e) {
            return null !== e && null !== e.match(/["'”][.,;]/);
        }
        function s(e) {
            return '"' === e || "”" === e || "“" === e;
        }
        function c(e) {
            return null !== e && null !== e.match(/,,/);
        }
        function l(e) {
            return null !== e && e.match(/[.,;:!?\\\/…\-—()]\s*[a-z]/i);
        }
        function u(e) {
            return "’" === e;
        }
        function d(e) {
            return "," === e;
        }
        function f(e) {
            return "!" === e;
        }
        function p(e) {
            return "-" === e || "—" === e;
        }
        function m(e) {
            return "?" === e;
        }
        function h(e) {
            return "." === e;
        }
        function g(e) {
            return "…" === e;
        }
        function b(e) {
            return ")" === e || "(" === e;
        }
        function v(e) {
            return null !== e && 1 === e.length && null !== e.match(/[a-z]/i);
        }
        function _(e, t) {
            if (e.length <= 4) return y.createElement("span", null, t);
            var n = w.textdiff(e, t), r = n.from, o = n.to, i = n.oldFragment, a = n.newFragment, s = 1 === a.length && r > 0 && e[r - 1] === a, c = 1 === i.length && 0 === a.length && t[r - 1] === i, l = r, u = a;
            return (s || c) && (l = r - 1), s && (u = a + a), c && (u = i), u.length > 3 ? y.createElement("span", null, t) : y.createElement("span", null, e.substring(0, l), y.createElement("span", {
                className: k.bold
            }, u), e.substring(o));
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var y = e("react"), w = e("@grammarly-npm/textdiff"), k = {
            title: "_abcbcc-title",
            replacement: "_abcbcc-replacement",
            singleReplacement: "_abcbcc-singleReplacement",
            listItemReplacement: "_abcbcc-listItemReplacement",
            sideCommas: "_abcbcc-sideCommas",
            orReplacement: "_abcbcc-orReplacement",
            insertReplacement: "_abcbcc-insertReplacement",
            longReplacement: "_abcbcc-longReplacement",
            didYouMean: "_abcbcc-didYouMean",
            wordPart: "_abcbcc-wordPart",
            wordBeforeInsert: "_abcbcc-wordBeforeInsert",
            insertPart: "_abcbcc-insertPart",
            insertPunctuation: "_abcbcc-insertPunctuation",
            deleteReplacement: "_abcbcc-deleteReplacement",
            deletePart: "_abcbcc-deletePart",
            wordBeforeDelete: "_abcbcc-wordBeforeDelete",
            deletePunctuation: "_abcbcc-deletePunctuation",
            deleteColonOrSemicolon: "_abcbcc-deleteColonOrSemicolon",
            deleteParenthesis: "_abcbcc-deleteParenthesis",
            deleteQuestion: "_abcbcc-deleteQuestion",
            deleteExclamation: "_abcbcc-deleteExclamation",
            deletePeriod: "_abcbcc-deletePeriod",
            deleteQuote: "_abcbcc-deleteQuote",
            deleteDash: "_abcbcc-deleteDash",
            deleteEllipsis: "_abcbcc-deleteEllipsis",
            deleteQuoteWithPunctuation: "_abcbcc-deleteQuoteWithPunctuation",
            deleteApostrophe: "_abcbcc-deleteApostrophe",
            deletePunctuationBeforeLetter: "_abcbcc-deletePunctuationBeforeLetter",
            deleteLetter: "_abcbcc-deleteLetter",
            deleteDoubleComma: "_abcbcc-deleteDoubleComma",
            insertQuestion: "_abcbcc-insertQuestion",
            nextIsWord: "_abcbcc-nextIsWord",
            listReplacement: "_abcbcc-listReplacement",
            arrowPart: "_abcbcc-arrowPart",
            bold: "_abcbcc-bold",
            orSeparator: "_abcbcc-orSeparator",
            didYouMeanLabel: "_abcbcc-didYouMeanLabel",
            listItemReplacementNoHeader: "_abcbcc-listItemReplacementNoHeader",
            listItemReplacementWrapper: "_abcbcc-listItemReplacementWrapper",
            flattenListItemReplacementWrapper: "_abcbcc-flattenListItemReplacementWrapper"
        }, E = /["'”“.,;:!?\\\/…\-—()]/;
        n.isPunctuation = r, n.isColonOrSemicolon = o, n.isSinglePunctuation = i, n.isQuoteWithPunctuation = a, 
        n.isQuote = s, n.isDoubleComma = c, n.isPunctuationAndLetter = l, n.isAphostrophe = u, 
        n.isComma = d, n.isExclamation = f, n.isDash = p, n.isQuestion = m, n.isPeriod = h, 
        n.isEllipsis = g, n.isParenthesis = b, n.isLetter = v, n.highlightDiff = _;
    }, {
        "@grammarly-npm/textdiff": 14,
        react: "react"
    } ],
    254: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o(e, t) {
            if (!e) throw new p(t);
        }
        var i = e("babel-runtime/core-js/object/get-prototype-of"), a = r(i), s = e("babel-runtime/helpers/classCallCheck"), c = r(s), l = e("babel-runtime/helpers/possibleConstructorReturn"), u = r(l), d = e("babel-runtime/helpers/inherits"), f = r(d);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var p = function(e) {
            function t(e) {
                return (0, c["default"])(this, t), (0, u["default"])(this, (t.__proto__ || (0, a["default"])(t)).call(this, "Invariant condition failed: " + (e ? "string" == typeof e ? e : e() : "(unnamed)")));
            }
            return (0, f["default"])(t, e), t;
        }(Error);
        n.InvariantError = p, n.invariant = o;
    }, {
        "babel-runtime/core-js/object/get-prototype-of": 24,
        "babel-runtime/helpers/classCallCheck": 31,
        "babel-runtime/helpers/inherits": 35,
        "babel-runtime/helpers/possibleConstructorReturn": 36
    } ],
    255: [ function(e, t, n) {
        "use strict";
        function r(e, t) {
            return {
                dangerouslySetInnerHTML: {
                    __html: i.sanitize(e, t)
                }
            };
        }
        function o(e) {
            return function(t) {
                t.stopPropagation(), e(t);
            };
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var i = e("./string");
        n.setInnerHTML = r, n.stopPropagation = o;
    }, {
        "./string": 256
    } ],
    256: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e ? e[0].toUpperCase() + e.slice(1) : "";
        }
        function o(e) {
            return e ? e.replace(/(?:^|[-_])(\w)/g, function(e, t) {
                return t ? t.toUpperCase() : "";
            }) : "";
        }
        function i() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "", t = arguments[1];
            return e && "undefined" != typeof window ? t ? l.sanitize(e, {
                ALLOWED_TAGS: t
            }) : l.sanitize(e) : "";
        }
        function a(e, t) {
            var n = e.match(t);
            return n && n[1];
        }
        function s(e) {
            return e.split(/\s+/)[0];
        }
        function c(e, t, n) {
            return 1 === e ? t : n;
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var l = e("dompurify");
        n.nbsp = String.fromCharCode(160), n.capitalize = r, n.camelize = o, n.sanitize = i, 
        n.getFirstMatch = a, n.getFirstWord = s, n.pluralize = c;
    }, {
        dompurify: "dompurify"
    } ],
    257: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o() {
            var e = this, t = v.getApi(), n = t.tabs;
            return new m["default"](function(t) {
                return h(e, void 0, void 0, f["default"].mark(function r() {
                    var e, o;
                    return f["default"].wrap(function(r) {
                        for (;;) switch (r.prev = r.next) {
                          case 0:
                            return e = setTimeout(function() {
                                return n.getActiveTabUrl().then(t);
                            }, 2e3), r.next = 3, n.getActiveTabUrl();

                          case 3:
                            o = r.sent, clearTimeout(e), t(o);

                          case 6:
                          case "end":
                            return r.stop();
                        }
                    }, r, this);
                }));
            });
        }
        function i(e, t) {
            return g.isFunction(e) && (t = e, e = ""), t ? void o().then(function(e) {
                return t(c(e));
            }) : s(e);
        }
        function a(e) {
            return m["default"].race([ o().then(c), g.delay(1e4).then(function() {
                throw new Error("Request to tabs.getCurrentTabUrl rejected by timeout");
            }) ]);
        }
        function s(e) {
            var t = e && e.ownerDocument || document, n = t.location || t.defaultView.location;
            return n ? _(n.hostname) : "";
        }
        function c(e) {
            if (g.isFF() && /^about:/.test(e)) return e;
            var t = document.createElement("a");
            return t.href = e, _(t.hostname);
        }
        function l(e) {
            var t = e && e.ownerDocument || document, n = t.location || t.defaultView.location;
            return n ? n.pathname + n.search : "";
        }
        function u() {
            for (var e = new RegExp("^(?:[a-z]+:)?//", "i"), t = "", n = document.getElementsByTagName("link"), r = 0; r < n.length; r++) {
                var o = n[r], i = '"' + o.getAttribute("rel") + '"', a = /(\"icon )|( icon\")|(\"icon\")|( icon )/i;
                i.search(a) != -1 && (t = o.getAttribute("href"));
            }
            return t || (t = "favicon.ico"), e.test(t) ? t : "/" != t[0] ? "//" + document.location.host + document.location.pathname + t : "//" + document.location.host + t;
        }
        var d = e("babel-runtime/regenerator"), f = r(d), p = e("babel-runtime/core-js/promise"), m = r(p), h = function(e, t, n, r) {
            return new (n || (n = m["default"]))(function(o, i) {
                function a(e) {
                    try {
                        c(r.next(e));
                    } catch (t) {
                        i(t);
                    }
                }
                function s(e) {
                    try {
                        c(r["throw"](e));
                    } catch (t) {
                        i(t);
                    }
                }
                function c(e) {
                    e.done ? o(e.value) : new n(function(t) {
                        t(e.value);
                    }).then(a, s);
                }
                c((r = r.apply(e, t || [])).next());
            });
        };
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var g = e("./util"), b = e("./page-config/defaults"), v = e("extension-api");
        n.currentUrl = o, n.getDomain = i, n.promiseGetDomain = a, n.domainFromUrl = c, 
        n.isFacebookSite = function() {
            return b.FACEBOOK_SITES.includes(i());
        }, n.isJiraSite = function() {
            return /\.atlassian\.net/.test(i());
        }, n.isBlackboardSite = function() {
            return /\.blackboard\.com/.test(i());
        };
        var _ = function(e) {
            return e.replace("www.", "");
        };
        n.getUrl = l, n.getFavicon = u;
    }, {
        "./page-config/defaults": 260,
        "./util": 288,
        "babel-runtime/core-js/promise": 28,
        "babel-runtime/regenerator": 42,
        "extension-api": 162
    } ],
    258: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o(e, t) {
            function n() {
                a(e, n);
                for (var r = arguments.length, o = Array(r), i = 0; i < r; i++) o[i] = arguments[i];
                t.apply(this, o);
            }
            i(e, n);
        }
        function i(e, t) {
            if ("__bgerror" === e) return void E.on("__bgerror", t);
            var r = C[e] = C[e] || [];
            if (r.push(t), 1 === r.length) try {
                k.listen(e, function() {
                    var e = !0, t = !1, n = void 0;
                    try {
                        for (var o, i = (0, h["default"])(r); !(e = (o = i.next()).done); e = !0) {
                            var a = o.value;
                            a.apply(void 0, arguments);
                        }
                    } catch (s) {
                        t = !0, n = s;
                    } finally {
                        try {
                            !e && i["return"] && i["return"]();
                        } finally {
                            if (t) throw n;
                        }
                    }
                });
            } catch (o) {
                n.emitError(o);
            }
        }
        function a(e, t) {
            if ("__bgerror" === e) return void E.off("__bgerror", t);
            var n = C[e];
            if (n) {
                var r = n.indexOf(t);
                r !== -1 && n.splice(r, 1), 0 === n.length && delete C[e];
            }
        }
        function s(e) {
            try {
                switch (k.kind) {
                  case "background-message-api":
                    k.broadcast(e, {});
                    break;

                  default:
                    throw new Error("emitTabs can be used only on background");
                }
            } catch (t) {
                n.emitError(t);
            }
        }
        function c(e, t) {
            var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}, o = arguments[3];
            try {
                if (!e) throw TypeError("emitTo can't be used without destination point");
                switch (k.kind) {
                  case "background-message-api":
                    k.sendTo(e, t, r, o);
                    break;

                  default:
                    throw new Error("emitTo can be used only on background");
                }
            } catch (i) {
                n.emitError(i);
            }
        }
        function l(e, t) {
            try {
                k.toFocused(e, t);
            } catch (r) {
                n.emitError(r);
            }
        }
        function u(e, t, r) {
            try {
                switch (k.kind) {
                  case "content-script-message-api":
                    k.broadcastBackground(e, t, r);
                    break;

                  default:
                    throw new Error("emitBackground can be used only in content script");
                }
            } catch (o) {
                n.emitError(o);
            }
        }
        function d(e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1e4, o = new p["default"](function(r, o) {
                try {
                    switch (k.kind) {
                      case "content-script-message-api":
                        k.broadcastBackground(e, t, r, o);
                        break;

                      default:
                        throw new Error("promiseBackground can be used only on client scripts");
                    }
                } catch (i) {
                    o(i), n.emitError(i);
                }
            });
            return p["default"].race([ o, v.delay(r).then(function() {
                throw new Error("Request to bg page (" + k + ") rejected by timeout");
            }) ]);
        }
        var f = e("babel-runtime/core-js/promise"), p = r(f), m = e("babel-runtime/core-js/get-iterator"), h = r(m);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var g = e("lodash"), b = e("emitter"), v = e("./util"), _ = e("./dom"), y = e("extension-api"), w = y.getApi(), k = w.message, E = b({}), C = {};
        n.emitError = g.throttle(function(e) {
            return E.emit("__bgerror", e);
        }, 1e3), v.isBg() && _.listen(document, "grammarly:offline", function() {
            return n.emitError("proxy dead");
        }, void 0), n.one = o, n.on = i, n.off = a, n.emitTabs = s, n.emitTo = c, n.emitFocusedTab = l, 
        n.emitBackground = u, n.promiseBackground = d;
    }, {
        "./dom": 207,
        "./util": 288,
        "babel-runtime/core-js/get-iterator": 16,
        "babel-runtime/core-js/promise": 28,
        emitter: "emitter",
        "extension-api": 162,
        lodash: "lodash"
    } ],
    259: [ function(e, t, n) {
        "use strict";
        function r() {
            if (s()) {
                var e = void 0;
                try {
                    e = browser;
                } catch (t) {
                    e = {};
                }
                return !!e.runtime;
            }
            return c();
        }
        function o() {
            return !!window.__extensionTestsMode;
        }
        function i() {
            return "20";
        }
        function a() {
            return "87677a2c52b84ad3a151a4a72f5bd3c4";
        }
        function s() {
            return window.navigator.userAgent.indexOf("Firefox") !== -1;
        }
        function c() {
            return !!window.chrome && /google/i.test(navigator.vendor);
        }
        function l() {
            return /^((?!chrome).)*safari/i.test(navigator.userAgent);
        }
        function u() {
            return l() && navigator.userAgent.indexOf("Version/8.0") !== -1;
        }
        function d() {
            return navigator.appVersion.indexOf("Win") !== -1;
        }
        function f() {
            return !!window.IS_BG;
        }
        function p() {
            var e = !1;
            try {
                e = safari.extension.globalPage.contentWindow !== window;
            } catch (t) {}
            return e;
        }
        function m() {
            return !!window.IS_POPUP;
        }
        function h() {
            return f() || m();
        }
        function g() {
            return c() ? "chrome" : s() ? "firefox" : l() ? "safari" : "other";
        }
        function b() {
            var e = "unknown";
            try {
                if (l()) return safari.extension.displayVersion;
                if (c()) {
                    var t = chrome.runtime.getManifest();
                    return t.version;
                }
                if (s()) {
                    var n = browser.runtime.getManifest();
                    return n.version;
                }
                return e;
            } catch (r) {
                return console.error(r), e;
            }
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.isWE = r, n.isTestsMode = o, n.getUpdateTime = i, n.getUuid = a, n.isFF = s, 
        n.isChrome = c, n.isSafari = l, n.isSafari8 = u, n.isWindows = d, n.isBg = f, n.isSafariSettingsPopup = p, 
        n.isPopup = m, n.isBgOrPopup = h, n.getBrowser = g, n.getVersion = b, n.ENV = "prod";
        var v = "c10dd64c87f70ef5563a63c368797e8c";
        n.MIXPANEL = {
            qaKey: "7a5c95b5cba1b225d00cc3ba1c410c78",
            key: v,
            cookie: "mp_" + v + "_mixpanel"
        }, n.STATSC = {
            URL: "https://stats-public.grammarly.io/",
            PREFIX: "grammarly.ui"
        }, n.GRAMMARLY_DOMAIN = "grammarly.com";
        var _ = "https://www." + n.GRAMMARLY_DOMAIN;
        n.DAPI = "https://data." + n.GRAMMARLY_DOMAIN;
        var y = "https://app." + n.GRAMMARLY_DOMAIN, w = "https://auth." + n.GRAMMARLY_DOMAIN + "/v3", k = w + "/user", E = _ + "/after_install_page";
        n.URLS = {
            app: y,
            appPersonalDictionary: y + "/profile/dictionary",
            capi: "wss://capi." + n.GRAMMARLY_DOMAIN + "/freews",
            dapiMimic: n.DAPI + "/api/mimic",
            dapiProps: n.DAPI + "/api/props",
            editorDictionary: y + "/profile/dictionary",
            dictionary: "https://capi." + n.GRAMMARLY_DOMAIN + "/api/defs",
            docs: y + "/docs",
            docsApi: "https://dox." + n.GRAMMARLY_DOMAIN + "/documents",
            authCreatePage: w + "/redirect-anonymous?location=" + E,
            userOrAnonymous: k + "/oranonymous",
            authSignin: w + "/login",
            authSignup: w + "/signup",
            signin: _ + "/signin",
            signup: _ + "/signup",
            resetPassword: _ + "/resetpassword",
            raven: "felog.grammarly.io",
            newFelog: "https://f-log-extension.grammarly.io",
            referral: _ + "/referral?page=extension",
            welcomeC: _ + "/extension-success",
            upgrade: _ + "/upgrade",
            uninstall: _ + "/extension-uninstall",
            terms: _ + "/terms",
            policy: _ + "/privacy-policy",
            pageConfigUrl: "https://d3cv4a9a9wh0bt.cloudfront.net/browserplugin/config.json"
        };
        var C = g().slice(0, 1).toUpperCase() + g().slice(1);
        n.appName = "extension" + C, n.gnarAppName = g() + "Ext";
    }, {} ],
    260: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        var o, i = e("babel-runtime/helpers/defineProperty"), a = r(i), s = e("babel-runtime/helpers/toConsumableArray"), c = r(s);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var l = e("lodash"), u = e("lib/config");
        n.PROTOCOL_VERSION = "1.0", n.SITES_TO_RELOAD = [ "inbox.google.com", "mail.google.com", "yahoo.com", "mail.live.com", "facebook.com", "tumblr.com", "stackoverflow.com", "wordpress.com", "wordpress.org", "blogspot.com" ], 
        n.FACEBOOK_SITES = [ "facebook.com", "messenger.com", "work.fb.com", "business.facebook.com" ], 
        n.HTML_GHOST_SITES = [ "twitter.com" ].concat((0, c["default"])(n.FACEBOOK_SITES)), 
        n.CUSTOM_UNSUPPORTED_MESSAGES = {
            "drive.google.com": {
                title: "Google Drive",
                message: 'We hope to support Google Drive apps<br/> in the future, but for now please use your</br> <a class="openGrammarly" href="' + u.URLS.app + '">Grammarly Editor</a>.'
            },
            "docs.google.com": {
                title: "Google Drive",
                message: 'We hope to support Google Drive apps<br/> in the future, but for now please use your</br> <a class="openGrammarly" href="' + u.URLS.app + '">Grammarly Editor</a>.'
            },
            "chrome.google.com": {
                title: "Web Store"
            }
        };
        var d = 18e5;
        n.PAGE_CONFIG_DEFAULT_INTERVAL = d, n.PAGE_CONFIG_UPDATE_INTERVALS = [ 6e5, n.PAGE_CONFIG_DEFAULT_INTERVAL, 36e5, 108e5, 432e5, 864e5, 31536e6 ], 
        n.OVERRIDE_PAGE_CONFIG = {}, n.PAGE_CONFIG_INTERNAL = (o = {
            version: {
                enabled: !1,
                servicePage: !0
            },
            extensions: {
                enabled: !1,
                servicePage: !0
            },
            settings: {
                enabled: !1,
                servicePage: !0
            },
            "com.safari.grammarlyspellcheckergrammarchecker": {
                enabled: !1,
                matchInclusions: !0,
                servicePage: !0
            }
        }, (0, a["default"])(o, "app." + u.GRAMMARLY_DOMAIN, {
            enabled: !1,
            grammarlyEditor: !0
        }), (0, a["default"])(o, "linkedin.com", {
            pages: {
                "/messaging": {
                    afterReplaceEvents: [ "input" ]
                }
            }
        }), (0, a["default"])(o, "plus.google.com", {
            afterReplaceEvents: [ "keyup" ],
            minFieldHeight: 0,
            minFieldWidth: 0
        }), (0, a["default"])(o, "facebook.com", {
            minFieldHeight: 0
        }), (0, a["default"])(o, "mail.google.com", {
            fields: [ {
                name: "to"
            }, {
                name: "cc"
            }, {
                name: "bcc"
            }, {
                className: "vO"
            } ],
            subframes: !1
        }), (0, a["default"])(o, "drive.google.com", {
            track: !0
        }), (0, a["default"])(o, "docs.google.com", {
            track: !0
        }), (0, a["default"])(o, "app.asana.com", {
            fields: [ {
                className: "task-row-text-input"
            } ]
        }), (0, a["default"])(o, "tumblr.com", {
            fields: [ {
                attr: [ "aria-label", "Post title" ]
            }, {
                attr: [ "aria-label", "Type or paste a URL" ]
            } ]
        }), (0, a["default"])(o, "chrome.google.com", {
            dontShowDisabledBadge: !0
        }), o);
        var f = {
            "hootsuite.com": {
                enabled: !1
            },
            "chrome.google.com": {
                enabled: !1
            },
            "facebook.com": {
                enabled: !0,
                pages: {
                    ".*/notes": {
                        enabled: !1
                    }
                }
            },
            "onedrive.live.com": {
                enabled: !1
            },
            "docs.com": {
                enabled: !1
            },
            "sp.docs.com": {
                enabled: !1
            },
            "docs.google.com": {
                enabled: !1
            },
            "drive.google.com": {
                enabled: !1
            },
            "texteditor.nsspot.net": {
                enabled: !1
            },
            "jsbin.com": {
                enabled: !1
            },
            "jsfiddle.net": {
                enabled: !1
            },
            "quora.com": {
                enabled: !1
            },
            "paper.dropbox.com": {
                enabled: !1
            },
            "mail.live.com": {
                enabled: !1,
                matchInclusions: !0
            },
            "imperavi.com": {
                enabled: !1
            },
            "usecanvas.com": {
                enabled: !1
            }
        };
        n.PAGE_CONFIG = {
            pageConfig: l.merge({}, f, n.PAGE_CONFIG_INTERNAL)
        };
    }, {
        "babel-runtime/helpers/defineProperty": 33,
        "babel-runtime/helpers/toConsumableArray": 38,
        "lib/config": 203,
        lodash: "lodash"
    } ],
    261: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o(e) {
            var t = i(e), n = A.isFacebookSite();
            return !t || n || O.draftjs || (O.draftjs = !0), !t || n;
        }
        function i(e) {
            return e.hasAttribute("contenteditable") && e.querySelector('[data-contents="true"] > [data-editor], [data-block]');
        }
        function a(e) {
            function t() {
                T.on("mousemove", a, !0), Ee = !0, Ce = new MutationObserver(l), Ce.observe(_e.body, {
                    childList: !0,
                    subtree: !0
                }), N.interval(h, se);
            }
            function n(e) {
                var t = e.contentDocument, n = void 0, r = function(e) {
                    ge = e.x, be = e.y;
                    var n = he = t.body;
                    setTimeout(function() {
                        return xe.emit("hover", {
                            target: n,
                            x: ge,
                            y: be
                        });
                    }, 0);
                }, o = function() {
                    n || P.listen(t, "mousemove", r, void 0, void 0), n = !0;
                };
                return o(), {
                    on: o,
                    off: function() {
                        n && P.unlisten(t, "mousemove", r, void 0), n = !1;
                    }
                };
            }
            function r() {
                return [].concat((0, y["default"])(ve)).find(function(e) {
                    return "IFRAME" !== e.tagName && (he === e || P.isParent(he, e));
                });
            }
            function i() {
                var e = r();
                setTimeout(function() {
                    return xe.emit("hover", {
                        target: e,
                        x: ge,
                        y: be
                    });
                }, 0);
            }
            function a(e) {
                ge = e.x, be = e.y, he = e.target, i();
            }
            function s(e) {
                function t(e) {
                    return r.indexOf(e) !== -1 && Boolean(n.push(e));
                }
                var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [], r = E.flatten(E.transform(ve, function(e, t) {
                    return e.push(t);
                }, []));
                if (t(e) || !e.children) return n;
                for (var o = 0; o < e.children.length; o++) s(e.children[o], n);
                return n;
            }
            function l(e) {
                var t, n;
                (t = []).concat.apply(t, (0, y["default"])((n = []).concat.apply(n, (0, y["default"])(e.map(function(e) {
                    var t = e.removedNodes;
                    return [].concat((0, y["default"])((0, v["default"])(t))).map(function(e) {
                        return s(e);
                    });
                }))))).forEach(_);
            }
            function d() {
                Ee && (T.off("mousemove", a, !0), N.cancelInterval(h), Ce.disconnect(), Ee = !1);
            }
            function p() {
                return [].concat((0, y["default"])(ve)).filter(function(e) {
                    return de(e) || !e.offsetHeight;
                });
            }
            function h() {
                p().forEach(_);
                var e = te();
                R(e) || xe.emit("add", e);
            }
            function b() {
                E.each(ve, function(e) {
                    return e.forEach(z);
                }), ve = A(), xe.emit("add", te()), t();
            }
            function _(e) {
                ce.has(e) && (ce.get(e).off(), ce["delete"](e)), [ "textareas", "contenteditables", "iframes", "htmlghosts" ].forEach(function(t) {
                    var n = ve[t].indexOf(e);
                    n !== -1 && ve[t].splice(n, 1);
                }), xe.emit("remove", e);
            }
            function w() {
                return g["default"].wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return e.delegateYield(this.textareas, "t0", 1);

                      case 1:
                        return e.delegateYield(this.contenteditables, "t1", 2);

                      case 2:
                        return e.delegateYield(this.iframes, "t2", 3);

                      case 3:
                        return e.delegateYield(this.htmlghosts, "t3", 4);

                      case 4:
                      case "end":
                        return e.stop();
                    }
                }, ae[0], this);
            }
            function A() {
                return (0, f["default"])({
                    textareas: [],
                    contenteditables: [],
                    iframes: [],
                    htmlghosts: []
                }, m["default"], w);
            }
            function O(e) {
                _e = e, we = _e.location.hostname, ke = new RegExp("://" + we), ye = _e.defaultView, 
                ie && (pe = E.isNumber(ie.minFieldHeight) ? ie.minFieldHeight : pe, me = E.isNumber(ie.minFieldWidth) ? ie.minFieldHeight : me);
            }
            function R(e) {
                return 0 === e.textareas.length && 0 === e.contenteditables.length && 0 === e.iframes.length && 0 === e.htmlghosts.length;
            }
            function D(e) {
                if (!ie) return !0;
                if (ie.enabled === !1) return !1;
                if (!ie.fields && ie.enabled === !0) return !0;
                var t = function(t) {
                    var n = (0, u["default"])(t, 2), r = n[0], o = n[1];
                    return e.getAttribute(r) === o;
                };
                return !ie.fields.some(function(n) {
                    var r = n.name, o = n.id, i = n.className, a = n.attr;
                    return r && r === e.name || o && o === e.id || i && P.hasClass(e, i) || a && Array.isArray(a) && t(a);
                });
            }
            function F() {
                return !_e.location || 0 === _e.location.href.indexOf("about:") || 0 === _e.location.href.indexOf("chrome:") || !_e.body || 0 === _e.body.childNodes.length;
            }
            function B() {
                return "interactive" !== _e.readyState && "complete" !== _e.readyState;
            }
            function W() {
                var e = _e.documentElement.getBoundingClientRect();
                return e.height < fe && ye.innerHeight < fe || e.width < fe;
            }
            function U(e) {
                return e.clientHeight < pe || e.clientWidth < me;
            }
            function G(e, t) {
                var n = x.restrictedAttrs.filter(function(e) {
                    return !t || "readonly" !== e;
                }).some(function(t) {
                    return Array.isArray(t) ? e.hasAttribute(t[0]) && e.getAttribute(t[0]).includes(t[1]) : e.hasAttribute(t);
                });
                return n || "rtl" === e.getAttribute("dir");
            }
            function z(e) {
                if ([].concat((0, y["default"])(x.grammarlyAttrs), [ "spellcheck" ]).forEach(function(t) {
                    return e.removeAttribute(t);
                }), S.isHtmlGhostSite()) {
                    var t = e.parentElement && e.parentElement.parentElement;
                    t && t.removeAttribute("spellcheck");
                }
            }
            function V(e) {
                return P.getParentBySel(e, x.restrictedParentAttrs);
            }
            function H(e, t) {
                return o(e) && !G(e, t) && !U(e) && (P.isVisible(e) && D(e) || P.hasClass(e, "grammDemo"));
            }
            function q(e, t) {
                return [].concat((0, y["default"])((0, v["default"])(_e.querySelectorAll(e)))).filter(function(e) {
                    return H(e, t);
                });
            }
            function Y() {
                return q("textarea", !1);
            }
            function K() {
                return le ? [] : q('[contenteditable]:not([contenteditable="false"]):not([data-reactid])', !0).filter(function(e) {
                    return !V(e);
                });
            }
            function X() {
                return le ? q(S.getHtmlGhostSelector(), !1) : [];
            }
            function Q(e) {
                if (I.href = e.src, (0 !== e.src.indexOf("http") || ke.test(e.src)) && "about:blank" !== e.src && (!e.src || e.src.indexOf("javascript:") !== -1 || I.protocol === document.location.protocol && I.hostname === document.location.hostname && I.port === document.location.port) && !P.hasClass(e, L.baseCls)) {
                    var t = null;
                    try {
                        t = e.contentDocument;
                    } catch (n) {
                        return;
                    }
                    if ((!t || t.body) && t && !G(e, !1) && !G(t.body, !1) && D(e)) {
                        var r = t.querySelector("html") || {
                            hasAttribute: function(e) {
                                return !1;
                            }
                        };
                        if (("on" === t.designMode || t.body.hasAttribute("contenteditable") || "false" === t.body.getAttribute("contenteditable") || r.hasAttribute("contenteditable") || "false" === r.getAttribute("contenteditable")) && !U(e)) return N.isFF() && "on" === t.designMode && (t.designMode = "off", 
                        t.body.setAttribute("contenteditable", "true")), !0;
                    }
                }
            }
            function J() {
                return [].concat((0, y["default"])((0, v["default"])(_e.querySelectorAll("iframe")))).filter(Q);
            }
            function $(e) {
                ve = E.mapValues(ve, function(t, n) {
                    return [].concat(t, e[n]);
                }), ve[m["default"]] = w;
            }
            function Z(e, t) {
                return E.difference(e[t], ve[t]);
            }
            function ee(e, t) {
                var n = Z(e, t);
                return ue.shouldRemove ? n.filter(function(e) {
                    return !ue.shouldRemove(e);
                }) : n;
            }
            function te() {
                var e = ne(), t = (0, f["default"])({
                    textareas: ee(e, "textareas"),
                    contenteditables: ee(e, "contenteditables"),
                    iframes: ee(e, "iframes"),
                    htmlghosts: ee(e, "htmlghosts")
                }, m["default"], w);
                return $(t), t.iframes.forEach(function(e) {
                    return ce.set(e, n(e));
                }), t;
            }
            function ne() {
                var e = A();
                return F() || B() || W() ? e : (0, c["default"])({}, e, {
                    textareas: Y(),
                    contenteditables: K(),
                    iframes: J(),
                    htmlghosts: X()
                });
            }
            var re = e.doc, oe = void 0 === re ? document : re, ie = e.page, ae = [ w ].map(g["default"].mark), se = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : M, ce = new k["default"](), le = S.isHtmlGhostSite(), ue = j.pageStyles(oe).getFixesForCurrentDomain(), de = ue.shouldRemove || N._f, fe = 150, pe = 35, me = 300, he = void 0, ge = void 0, be = void 0, ve = A(), _e = void 0, ye = void 0, we = void 0, ke = void 0, Ee = void 0, Ce = void 0;
            O(oe);
            var xe = C({
                get: te,
                reset: b,
                remove: _,
                stop: d
            }), je = xe.on;
            return xe.on = function(e, n) {
                return Ee || t(), je(e, n), "hover" === e && i(), {
                    un: function() {}
                };
            }, xe;
        }
        var s = e("babel-runtime/core-js/object/assign"), c = r(s), l = e("babel-runtime/helpers/slicedToArray"), u = r(l), d = e("babel-runtime/helpers/defineProperty"), f = r(d), p = e("babel-runtime/core-js/symbol/iterator"), m = r(p), h = e("babel-runtime/regenerator"), g = r(h), b = e("babel-runtime/core-js/array/from"), v = r(b), _ = e("babel-runtime/helpers/toConsumableArray"), y = r(_), w = e("babel-runtime/core-js/map"), k = r(w);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var E = e("lodash"), C = e("emitter"), x = e("./config"), j = e("./sites"), S = e("./ghost/html-ghost-locator"), T = e("./window-events"), L = e("./elements/iframe"), N = e("./util"), P = e("./dom"), A = e("./location"), I = document.createElement("a"), M = 1e3, O = {
            draftjs: !1
        };
        n.PageFields = a;
    }, {
        "./config": 203,
        "./dom": 207,
        "./elements/iframe": 215,
        "./ghost/html-ghost-locator": 242,
        "./location": 257,
        "./sites": 266,
        "./util": 288,
        "./window-events": 289,
        "babel-runtime/core-js/array/from": 15,
        "babel-runtime/core-js/map": 19,
        "babel-runtime/core-js/object/assign": 20,
        "babel-runtime/core-js/symbol/iterator": 30,
        "babel-runtime/helpers/defineProperty": 33,
        "babel-runtime/helpers/slicedToArray": 37,
        "babel-runtime/helpers/toConsumableArray": 38,
        "babel-runtime/regenerator": 42,
        emitter: "emitter",
        lodash: "lodash"
    } ],
    262: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o(e, t, n) {
            var r = {
                top: 0,
                left: 0,
                height: 0,
                width: 0
            };
            if (!e) return r;
            var i = e.ownerDocument, a = i.documentElement, s = e.getClientRects(), c = a.scrollTop || i.body.scrollTop, l = a.scrollLeft || i.body.scrollLeft, u = t && t.contentDocument;
            if (0 == s.length) return r;
            var f = (0, p["default"])(s).map(function(e) {
                return {
                    top: e.top + c,
                    left: e.left + l,
                    height: e.height,
                    width: e.width
                };
            });
            if (u && u.documentElement && u.documentElement == a) {
                var m = o(t);
                f = f.map(function(e) {
                    return (0, d["default"])({}, e, {
                        top: e.top + m.top - c,
                        left: e.left + m.left - l
                    });
                });
            }
            return n && f || f[0];
        }
        function i(e, t, n) {
            var r = e.ownerDocument, o = c(r), i = e.clientWidth, a = e.clientHeight, s = {}, l = {
                top: t.top - r.body.scrollTop - a,
                left: t.left - i,
                bottom: r.body.scrollTop + o.height - t.top - t.height - a,
                right: r.body.scrollLeft + o.width - t.left - i
            };
            return l.bottom < 0 && l.bottom < l.top || n ? (s.top = t.top - a + 3, s.flip = !0) : (s.top = t.top + t.height - 3, 
            s.flip = !1), l.right < 0 ? s.left = o.width - i : s.left = t.left, t.forceCoords && (s.left = t.pageX, 
            s.top = s.flip ? t.pageY - a : t.pageY + 5), {
                rect: s,
                delta: l,
                sourceRect: t
            };
        }
        function a(e, t, n) {
            function r(e, t) {
                c[e] += i[t] / 2 - a[t] / 2, o[e] > c[e] && (c[e] = o[e]), o[e] + o[t] < c[e] + a[t] && (c[e] = o[e] + o[t] - a[t]);
            }
            var o = s(), i = t.getBoundingClientRect(), a = e.getBoundingClientRect(), c = {
                flipY: !1,
                flipX: !1
            }, l = {
                top: i.top - o.top,
                left: i.left - o.left,
                bottom: -i.bottom + o.bottom,
                right: -i.right + o.right
            };
            return n = n || "top:center", n = n.split(":"), c.top = i.top, "center" == n[0] ? r("top", "height") : "top" == n[0] ? l.top > a.height ? c.top -= a.height : (c.top += i.height, 
            c.flipY = !0) : "bottom" == n[0] && (l.bottom > a.height ? c.top += i.height : (c.top -= a.height, 
            c.flipY = !0)), c.left = i.left, "center" == n[1] ? r("left", "width") : "left" == n[1] ? (c.left += i.width - a.width, 
            l.left + i.width < a.width && (c.left = o.left)) : "right" == n[1] && l.right + i.width < a.width && (c.left += i.width + l.right - a.width), 
            c;
        }
        function s() {
            var e = document.createElement("div");
            e.style.cssText = "position: fixed;top: 0;left: 0;bottom: 0;right: 0;", document.documentElement.insertBefore(e, document.documentElement.firstChild);
            var t = e.getBoundingClientRect();
            return document.documentElement.removeChild(e), t;
        }
        function c(e) {
            var t = e.documentElement.clientTop || e.body.clientTop || 0, n = e.documentElement.clientLeft || e.body.clientLeft || 0, r = e.documentElement.scrollLeft || e.body.scrollLeft, o = e.documentElement.scrollTop || e.body.scrollTop, i = e.defaultView.innerHeight, a = e.defaultView.innerWidth;
            return {
                width: a,
                height: i,
                scrollTop: o - t,
                scrollLeft: r - n,
                top: t,
                left: n
            };
        }
        function l(e, t) {
            if (!e || e == t) return {
                x: 0,
                y: 0
            };
            var n = {
                x: e.offsetLeft,
                y: e.offsetTop
            }, r = l(e.offsetParent, t);
            for (var o in r) n[o] += r[o];
            return n;
        }
        var u = e("babel-runtime/core-js/object/assign"), d = r(u), f = e("babel-runtime/core-js/array/from"), p = r(f);
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.getAbsRect = o, n.posToRect = i, n.posToEl = a, n.getPos = l;
    }, {
        "babel-runtime/core-js/array/from": 15,
        "babel-runtime/core-js/object/assign": 20
    } ],
    263: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o(e) {
            if (e.data && (e.query || "post" !== e.method) && (e.url += "?" + s(e.data)), e.data && "post" === e.method && !e.query && !e.body) {
                try {
                    e.body = (0, d["default"])(e.data);
                } catch (t) {
                    e.body = {}, console.warn(t);
                }
                e.headers = e.headers || {}, e.headers["Content-Type"] = e.headers["Content-Type"] || "application/json", 
                delete e.data;
            }
            return e.credentials = "include", e;
        }
        function i(e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
            return t.url = e, o(t), p.isBg() || m.isTestsMode() ? a(t) : h.promiseBackground("fetch", t).then(function(e) {
                if (f.isObject(e) && e.error) throw new Error(e.error);
                return e;
            });
        }
        function a(e) {
            function t(t) {
                return t.ok ? t[e.isText ? "text" : "json"]() : t.text().then(function(e) {
                    throw {
                        name: "RequestError",
                        body: e,
                        statusCode: t.status,
                        message: t.statusText
                    };
                });
            }
            var n = e.url;
            return delete e.url, n ? l["default"].race([ window.fetch(n, e).then(t).then(function(e) {
                if ("string" != typeof e && e && e.error) throw new Error(e.error);
                return e;
            }), p.delay(e.timeout || g).then(function() {
                throw new Error("Fetch request to " + n + " rejected by timeout");
            }) ]) : l["default"].reject(new Error("Url is not defined in fetch request"));
        }
        function s(e) {
            var t = "", n = function(n) {
                if (Array.isArray(e[n])) {
                    if (e[n].length) {
                        var r = e[n].map(function(e) {
                            return n + "=" + e;
                        }).join("&");
                        t += "" + (t.length ? "&" : "") + r;
                    }
                } else t += "" + (t.length ? "&" : "") + n + "=" + encodeURIComponent(e[n]);
            };
            for (var r in e) n(r);
            return t;
        }
        var c = e("babel-runtime/core-js/promise"), l = r(c), u = e("babel-runtime/core-js/json/stringify"), d = r(u);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var f = e("lodash"), p = e("./util"), m = e("./config"), h = e("./message"), g = 1e4;
        p.isBg() && h.on("fetch", function(e, t) {
            return a(e).then(t, function(e) {
                return t({
                    error: e.message
                });
            });
        }), n.transformOptions = o, n.fetch = i, n.paramStr = s;
    }, {
        "./config": 203,
        "./message": 258,
        "./util": 288,
        "babel-runtime/core-js/json/stringify": 18,
        "babel-runtime/core-js/promise": 28,
        lodash: "lodash"
    } ],
    264: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o(e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : document, n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "";
            g = n;
            var r = p.getAbsRect(e);
            y = t, h = {
                top: r.top + r.height + 1,
                left: r.left,
                width: 0,
                height: 2
            }, v = Math.ceil(r.width / 8), b = r.width - v, setTimeout(function() {
                h.width = b, i();
            }, 10), setTimeout(function() {
                s();
            }, 500), i();
        }
        function i() {
            _ = m.renderReactWithParent(f.createElement(k, {
                style: (0, l["default"])({}, h),
                className: g
            }), y.documentElement, w);
        }
        function a() {
            _ && (_.remove(), _ = null);
        }
        function s() {
            h.WebkitTransitionDuration = "0.2s", h.MozTransitionDuration = "0.2s", h.transitionDuration = "0.2s", 
            h.width = b + v, _ && i();
        }
        var c = e("babel-runtime/core-js/object/assign"), l = r(c), u = e("babel-runtime/core-js/symbol"), d = r(u);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var f = e("react"), p = e("./position"), m = e("./dom"), h = void 0, g = void 0, b = 0, v = 0, _ = void 0, y = void 0, w = (0, 
        d["default"])("SelectionAnimator"), k = f.createClass({
            displayName: "AnimationLine",
            render: function() {
                return f.createElement("div", {
                    style: this.props.style,
                    className: "g-selection-anim " + this.props.className
                });
            }
        });
        n.selectionAnimator = {
            animate: o,
            remove: a,
            complete: s
        };
    }, {
        "./dom": 207,
        "./position": 262,
        "babel-runtime/core-js/object/assign": 20,
        "babel-runtime/core-js/symbol": 29,
        react: "react"
    } ],
    265: [ function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var r = e("emitter"), o = e("./config"), i = e("./dom");
        n.Selection = function(e) {
            function t(e) {
                return e.getRangeAt(0).getBoundingClientRect();
            }
            function n(e, t, n) {
                for (var r = e.split(/[.;!?]/g), o = 0, i = 0, a = 0; a < r.length; a++) {
                    if (i = o + r[a].length, t >= o && n <= i) {
                        var s = {
                            t: r[a],
                            s: t - o,
                            e: n - o
                        };
                        return s;
                    }
                    o = i + 1;
                }
            }
            function a(t) {
                var n = t.anchorNode;
                if (!n) return !1;
                var r = o.restrictedAttrs.map(function(e) {
                    return Array.isArray(e) ? "[" + e[0] + '="' + e[1] + '"]' : "[" + e + "]";
                }).join(","), a = t.toString().trim(), s = "TEXTAREA" != n.tagName && "INPUT" != n.tagName, c = !(e.activeElement && "INPUT" == e.activeElement.tagName || e.activeElement && "TEXTAREA" == e.activeElement.tagName), l = !i.isContentEditable(n), u = !i.getParentBySel(n, r) && !i.matchesSelector(n, r), d = !i.getParentBySel(n, "[contenteditable=true],[contenteditable=plaintext-only]") && !i.parentIsContentEditable(n);
                return !!(a && s && c && l && u && d);
            }
            function s(r) {
                var o = r.detail;
                if (2 != o) return void (l && (c.emit("unselect"), l = !1));
                l = !0;
                var i = e.getSelection(), s = a(i);
                if (s) {
                    var u = i.anchorNode.textContent, d = i.toString();
                    if (!d.match(/[0-9_±!@#$%^&*:"|<>?~().,:}{’=']/)) {
                        var f = {
                            t: d,
                            s: 0,
                            e: d.length
                        }, p = i.getRangeAt(0);
                        if (p.ownerDocument = e, i.anchorNode == i.focusNode) {
                            var m = i.anchorOffset, h = m + d.length;
                            f = n(u, m, h);
                        }
                        var g = {
                            data: {
                                v: f.t,
                                s: f.s,
                                e: f.e,
                                w: d
                            },
                            pos: t(i),
                            el: p
                        };
                        c.emit("select", g);
                    }
                }
            }
            i.listen(e, "click", s);
            var c = r({
                release: function() {
                    i.unlisten(e, "click", s);
                },
                isValidSelection: a
            }), l = !1;
            return c;
        };
    }, {
        "./config": 203,
        "./dom": 207,
        emitter: "emitter"
    } ],
    266: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o(e, t) {
            return e.find(function(e) {
                return i(t, e.split(":"));
            });
        }
        function i(e, t) {
            var n = (0, p["default"])(t, 2), r = n[0], o = n[1], i = e.getAttribute(r);
            return Boolean(i && (i === o || i.includes(o) && r + ":" + o));
        }
        function a(e) {
            return e.dataset && e.dataset.testid;
        }
        function s() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : document, t = m.getDomain({
                ownerDocument: e
            }, !1), n = _[t];
            return {
                addDomainClass: function() {
                    e.documentElement.classList.add("gr__" + t.replace(/\./g, "_"));
                },
                customizeElements: function() {
                    n && g(n).each(function(t, n) {
                        return (0, d["default"])(e.querySelectorAll(n)).forEach(function(e) {
                            return g.extend(e.style || {}, t);
                        });
                    });
                },
                getFixesForCurrentDomain: function() {
                    var e = w[t];
                    if (e) return e;
                    var n = (0, l["default"])(w).filter(function(e) {
                        return e.includes("*");
                    }).find(function(e) {
                        return t.indexOf(e.replace("*", "")) > -1;
                    });
                    return n && w[n] || {};
                }
            };
        }
        var c = e("babel-runtime/core-js/object/keys"), l = r(c), u = e("babel-runtime/core-js/array/from"), d = r(u), f = e("babel-runtime/helpers/slicedToArray"), p = r(f);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var m = e("./location"), h = e("./util"), g = e("lodash"), b = e("./client-script"), v = e("./dom"), _ = {
            "translate.google.com": {
                "#gt-clear": {
                    zIndex: "2"
                }
            },
            "linkedin.com": {
                ".mentions-highlighter": {
                    zIndex: "0"
                }
            },
            "us.nakedwines.com": {
                ".postbutton": {
                    display: "inline-block"
                }
            }
        }, y = function() {
            var e = void 0;
            return function() {
                return "undefined" == typeof e && (e = !!document.querySelector("c-wiz")), e;
            };
        }(), w = {
            "twitter.com": {
                btnDiff: function(e) {
                    if ("tweet-box-dm-conversation" === e.id) return [ -25, 1 ];
                    var t = e.parentElement && e.parentElement.parentElement && e.parentElement.parentElement.querySelector(".EmojiPicker");
                    if (null != t && t.offsetHeight > 0) return [ -25, 3 ];
                    if (!(e.clientHeight > 40 || "tweet-box-home-timeline" !== e.id)) return [ -30, 0 ];
                },
                fieldRestoreInlineStyles: function(e, t) {
                    "tweet-box-dm-conversation" === e.id && e.style.zIndex !== t.src["z-index"] && (e.style.zIndex = t.src["z-index"], 
                    e.style.position = t.src.position, e.style.transition = "none", e.style.background = "transparent");
                }
            },
            "linkedin.com": {
                fieldStateForDomain: function(e) {
                    if ("IFRAME" === e.tagName && e.id) return e.id.replace(/\d*\d/, "");
                    var t = [ "class:trans" ];
                    return o(t, e);
                },
                menuPosLeft: function(e, t, n) {
                    return !h.isSafari() || n.enabled ? t : t - 7;
                }
            },
            "*.slack.com": {
                forceMinimize: function(e) {
                    return e.clientHeight > 40;
                },
                btnCustomContainer: function(e) {
                    return e;
                },
                btnCustomStyles: function(e, t) {
                    var n = t.clientHeight < 40 ? 25 : 0;
                    return e ? {
                        right: 10 + n,
                        bottom: 10,
                        left: "auto",
                        top: "auto"
                    } : {
                        right: -10,
                        bottom: -2,
                        left: "auto",
                        top: "auto"
                    };
                },
                customDefaultBg: function(e) {
                    return e.parentNode && e.parentNode.parentNode && e.parentNode.parentNode.classList.contains("offline") ? "rgb(253, 241, 193)" : "rgb(255, 255, 255)";
                }
            },
            "*.zendesk.com": {
                customDefaultBg: function(e) {
                    return e.classList.contains("ember-text-area") && (e.parentNode && e.parentNode.parentNode && e.parentNode.parentNode.parentNode && !e.parentNode.parentNode.parentNode.classList.contains("is-public") ? "#fff6d9" : "#fff") || null;
                }
            },
            "facebook.com": {
                fieldStateForDomain: function(e) {
                    var t = [ "role:textbox", "testid:ufi_comment_composer", "testid:react-composer-root" ], n = function(e, t) {
                        var n = (0, p["default"])(t, 2), r = (n[0], n[1]);
                        return e.dataset && e.dataset.testid === r ? "testid:" + r : !!v.getParentByData(e, "testid", r) && "testid:" + r;
                    };
                    return t.find(function(t) {
                        var r = t.split(":"), o = (0, p["default"])(r, 2), a = o[0], s = o[1];
                        return "testid" === a ? Boolean(n(e, [ a, s ])) : i(e, [ a, s ]);
                    });
                },
                ghostHeight: function(e) {
                    var t = parseInt(e, 10);
                    return t > 0 ? t + 1 + "px" : t + "px";
                },
                menuPosLeft: function(e, t) {
                    return e && e.el.name && "xhpc_message_text" === e.el.name ? Math.ceil(t) : t;
                },
                forceMinimize: function(e) {
                    return "ufi_reply_composer" === a(e);
                },
                btnCustomContainer: function(e) {
                    var t = a(e);
                    if ("ufi_comment_composer" === t || "ufi_reply_composer" === t) return e;
                    if ("status-attachment-mentions-input" === t) {
                        var n = v.getParentByDepth.call(e, 4);
                        return n.parentNode.style.position = "relative", n;
                    }
                    if (e.name && "xhpc_message_text" === e.name) return e.parentNode;
                    var r = v.getParentByData(e, "testid", "react-composer-root");
                    if (r) {
                        var o = v.getParentByDepth.call(e, 3);
                        return o.parentNode.style.position = "relative", o;
                    }
                    return "webMessengerRecentMessages" === e.getAttribute("aria-controls") ? e : void 0;
                },
                btnCustomStyles: function(e, t) {
                    var n = "auto", r = "auto";
                    if ("webMessengerRecentMessages" === t.getAttribute("aria-controls")) return e ? {
                        right: 10,
                        bottom: 10,
                        left: n,
                        top: r
                    } : {
                        right: -5,
                        bottom: 2,
                        left: n,
                        top: r
                    };
                    var o = a(t);
                    if ("ufi_comment_composer" === o) {
                        var i = 15, s = -4, c = -14, l = v.getParentByDepth.call(t, 6).querySelector(".UFICommentAttachmentButtons"), u = e ? 0 : -(l.clientWidth + i), d = e ? s : c;
                        return {
                            right: u,
                            bottom: d,
                            left: n,
                            top: r
                        };
                    }
                    if ("ufi_reply_composer" === o || t.hasAttribute("aria-haspopup") && t.hasAttribute("aria-owns")) {
                        var f = 17, p = -4, m = -8, h = v.getParentByDepth.call(t, 6).querySelector(".UFICommentAttachmentButtons"), g = e ? 0 : -(h.clientWidth + f), b = e ? p : m;
                        return {
                            right: g,
                            bottom: b,
                            left: n,
                            top: r
                        };
                    }
                    var _ = e ? 10 : -8, y = e ? 10 : -5, w = v.getParentByData(t, "testid", "react-composer-root");
                    if (w) {
                        var k = 30, E = -12, C = 6, x = -3, j = w.querySelectorAll('[aria-label="Post a sticker"], [aria-label="Insert an emoji"]').length > 0;
                        j && (_ = e ? k : E, y = e ? C : x);
                    }
                    return {
                        right: _,
                        bottom: y,
                        left: n,
                        top: r
                    };
                }
            },
            "mail.google.com": {
                btnCustomContainer: function(e) {
                    var t = v.getParentByTag(e, "TABLE"), n = t && v.getParentByTag(t, "TABLE"), r = n && n.querySelector('[command="Files"]');
                    return n && r && v.getParentByTag(r, "TABLE");
                },
                btnCustomStyles: function(e) {
                    return e ? {
                        right: 10,
                        top: -30,
                        left: "auto"
                    } : {
                        right: -2,
                        top: -25,
                        left: "auto"
                    };
                },
                shouldRemove: function(e) {
                    var t = v.getParentByTag(e, "TABLE");
                    if (t) {
                        var n = v.getParentByTag(t, "TABLE");
                        if (n) {
                            var r = n.querySelector('[role=toolbar][aria-label="Spell Check"]');
                            return r && r.offsetParent;
                        }
                    }
                }
            },
            "inbox.google.com": {
                btnCustomContainer: function(e) {
                    return e.parentNode;
                },
                btnCustomStyles: function(e) {
                    return e ? {
                        right: 12,
                        top: "auto",
                        left: "auto",
                        bottom: 62
                    } : {
                        right: -5,
                        top: "auto",
                        left: "auto",
                        bottom: 60
                    };
                }
            },
            "medium.com": {
                btnDiff: function(e) {
                    return v.parentHasClass(e, "postArticle--full") ? [ -75, 0, !1 ] : [ 0, 0, !1 ];
                }
            },
            "plus.google.com": {
                forceMinimize: function(e) {
                    return e.clientHeight < 30;
                },
                btnCustomContainer: function(e) {
                    var t = function(e) {
                        return /comment/i.test(e.getAttribute("aria-label") || "");
                    };
                    return y() && t(e) ? e.parentNode : e;
                },
                btnCustomStyles: function(e) {
                    var t = y() ? -12 : -18, n = y() ? -5 : -10;
                    return e ? {
                        right: 10,
                        bottom: 10,
                        left: "auto",
                        top: "auto"
                    } : {
                        right: t,
                        bottom: n,
                        left: "auto",
                        top: "auto"
                    };
                },
                fieldParentCustomStyle: function() {
                    var e = {
                        "padding-bottom": "2px",
                        "overflow-x": "hidden"
                    };
                    return y() ? e : {};
                }
            },
            "app.asana.com": {
                forceMinimize: function(e) {
                    return !!e.classList.contains("task-comments-input") && (!!(e.parentNode && e.parentNode.parentNode && e.parentNode.parentNode.parentNode) && !e.parentNode.parentNode.parentNode.classList.contains("focused"));
                }
            },
            "youtube.com": {
                btnDiff: function(e) {
                    return v.hasClass(e, "comment-simplebox-text") ? [ 15, 15 ] : [ 0, 0 ];
                }
            }
        };
        n.pageStyles = s, function() {
            function e() {
                if (window.randomize) {
                    var e = window.randomize;
                    window.randomize = function(t) {
                        try {
                            if (t.data) {
                                var n = JSON.parse(t.data);
                                n[0] && n[0].parentWindowLocation && e(t);
                            }
                        } catch (r) {}
                    };
                }
            }
            (m.getDomain().indexOf("chase.com") > -1 || m.getDomain().indexOf("chaseonline.com") > -1) && b.addScript(document, [ e ]);
        }();
    }, {
        "./client-script": 197,
        "./dom": 207,
        "./location": 257,
        "./util": 288,
        "babel-runtime/core-js/array/from": 15,
        "babel-runtime/core-js/object/keys": 25,
        "babel-runtime/helpers/slicedToArray": 37,
        lodash: "lodash"
    } ],
    267: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o(e) {
            if ("disconnected" != e) {
                var t = {};
                "string" == typeof e ? t.msg = e : e.error && (t.readyState = e.error.currentTarget && e.error.currentTarget.readyState, 
                t.returnValue = e.error.returnValue), _.logger.socketBgError(), console.error("capi error", e), 
                window.emit || g(window), window.emit("bgerror", e || "when send message to the socket");
            }
        }
        function i(e) {
            function t(t, r, o) {
                if (t) {
                    var a = t.socketId, s = C[a], c = t.method, l = "close" == c;
                    if ((s || !l) && !e.get().authToCapiDegradation) {
                        s || (s = N(t, n, o, e), C[a] = s);
                        var u = t.arg && "start" == t.arg.action;
                        u && (0, f["default"])(t.arg, i), c && ("connect" == c ? e.refreshUser(!0, "onSessionStart").then(function() {
                            return s[c](t.arg);
                        }) : s[c](t.arg), l && n(a));
                    }
                }
            }
            function n(e) {
                C[e] && (C[e].close(), C[e].emit = function(e, t) {}, delete C[e]);
            }
            var r = {};
            window.socketServer = r, v.on("iframe-mode", function(e) {
                console.log("IFRAME MODE", e.id, C), C[e.id].iframeMode(e.iframeMode);
            }, o, !0), v.on("socket-client", t, o, !0), r.sockets = C, r.toString = function() {
                return "[object SocketServer]";
            };
            var i = {};
            return r.wsReconnect = function() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                (0, f["default"])(i, e), (0, u["default"])(C).forEach(function(e) {
                    return e.reconnect();
                });
            }, r;
        }
        function a() {
            var e = x.slice(0);
            return x.length = 0, e;
        }
        var s = e("babel-runtime/regenerator"), c = r(s), l = e("babel-runtime/core-js/object/values"), u = r(l), d = e("babel-runtime/core-js/object/assign"), f = r(d), p = e("babel-runtime/core-js/promise"), m = r(p), h = function(e, t, n, r) {
            return new (n || (n = m["default"]))(function(o, i) {
                function a(e) {
                    try {
                        c(r.next(e));
                    } catch (t) {
                        i(t);
                    }
                }
                function s(e) {
                    try {
                        c(r["throw"](e));
                    } catch (t) {
                        i(t);
                    }
                }
                function c(e) {
                    e.done ? o(e.value) : new n(function(t) {
                        t(e.value);
                    }).then(a, s);
                }
                c((r = r.apply(e, t || [])).next());
            });
        };
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var g = e("emitter"), b = e("websocket"), v = e("lib/message"), _ = e("lib/tracking"), y = e("lib/timers"), w = e("lib/util"), k = e("lib/config"), E = e("lib/bg/cookie"), C = {}, x = [];
        n.SocketServer = i;
        var j = w.getBrowser(), S = "other" === j ? "extension" : "extension_" + j, T = {
            docid: w.guid(),
            client: S,
            protocolVersion: "1.0",
            action: "start",
            id: 0
        }, L = 12e4, N = function(e, t, n, r) {
            function i(e, t) {
                if (M(e, t), "disconnect" == e && O) return void (O = !1);
                var r = setTimeout(d, 5e3), i = P ? "socket-server-iframe" : "socket-server";
                return console.log("from ws", e, N, t, i), t && t.error && "not_authorized" == t.error ? p(S) : void v.emitTo(n, i, {
                    socketId: N,
                    event: e,
                    msg: t,
                    id: w.guid()
                }, function(e) {
                    return e && clearTimeout(r);
                }, o);
            }
            function a() {
                R || (R = !0, s().then(function() {
                    return R = !1;
                }));
            }
            function s() {
                var e = void 0, t = new m["default"](function(t) {
                    return e = t;
                });
                return S.one("connect", e), S.isConnected() ? (S.one("disconnect", function() {
                    return setTimeout(S.connect.bind(null, !0), 0);
                }), O = !0, S.close()) : S.connect(!0), t;
            }
            function l(e) {
                P = e, console.log("USE EXT SOCKET", e);
            }
            function d() {
                console.log("CLOSE SOCKET"), A++, A > 7 && !I && (I = !0), S.close(), S.release(), 
                t();
            }
            function p(e) {
                var t = r.get(), n = t.authToCapiDegradation, o = t.authDegradation, i = t.cookiesDisabled;
                return n ? (_.logger.capiNotAuthorizedLoop(o, i), void console.error("User not authorized... Recovery fail =(")) : (i && (_.logger.socketDisabledCookie(), 
                console.error("User disabled cookies... =(")), console.warn("User not authorized... Try to recover"), 
                r.update({
                    authToCapiDegradation: !0
                }), void g());
            }
            function g() {
                return h(this, void 0, void 0, c["default"].mark(function e() {
                    var t, n;
                    return c["default"].wrap(function(e) {
                        for (;;) switch (e.prev = e.next) {
                          case 0:
                            return (0, u["default"])(C).forEach(function(e) {
                                e.close(), e.release();
                            }), t = "capiConnectionResolver", y.timers.start(t), e.next = 5, new m["default"](function(e) {
                                return j(e);
                            });

                          case 5:
                            n = e.sent, r.update({
                                authToCapiDegradation: !1
                            }), (0, u["default"])(C).forEach(function(e) {
                                return e.reconnect();
                            }), _.logger.socketBgRestored(n);

                          case 9:
                          case "end":
                            return e.stop();
                        }
                    }, e, this);
                }));
            }
            function x(e) {
                var t = e.count, n = e.error;
                return h(this, void 0, void 0, c["default"].mark(function r() {
                    var e;
                    return c["default"].wrap(function(r) {
                        for (;;) switch (r.prev = r.next) {
                          case 0:
                            return e = "exception", r.prev = 1, r.next = 4, E.getToken();

                          case 4:
                            e = r.sent, r.next = 9;
                            break;

                          case 7:
                            r.prev = 7, r.t0 = r["catch"](1);

                          case 9:
                            console.warn("log failed reconnect", t, n), _.logger.socketBgReconnectFail(e, t);

                          case 11:
                          case "end":
                            return r.stop();
                        }
                    }, r, this, [ [ 1, 7 ] ]);
                }));
            }
            function j(e) {
                var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1e4, n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1;
                return h(this, void 0, void 0, c["default"].mark(function o() {
                    var i, a;
                    return c["default"].wrap(function(o) {
                        for (;;) switch (o.prev = o.next) {
                          case 0:
                            return console.warn("Fixer inited, will try to connect in ", t / 1e3, "s., count:", n), 
                            o.next = 3, w.delay(t);

                          case 3:
                            return o.next = 5, r.refreshUser(!1, "recover_after_capi_error");

                          case 5:
                            i = b({
                                url: k.URLS.capi
                            }), a = function() {
                                i.close(), i.release(), i.emit = w._f, i = null;
                            }, i.emit = function(r) {
                                var o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                                return "connect" == r ? i.send(T) : o.action && "start" == o.action ? (a(), console.warn("yay, we fixed capi connection!"), 
                                e(n)) : void ((o.error || "error" == r) && (a(), n % 10 == 0 && x({
                                    count: n,
                                    error: o.error
                                }), console.warn("still on error(", r, o), j(e, Math.min(L, 2 * t), n + 1)));
                            }, i.connect();

                          case 9:
                          case "end":
                            return o.stop();
                        }
                    }, o, this);
                }));
            }
            var S = b(e), N = e.socketId, P = void 0, A = 0, I = !1, M = S.emit, O = !1, R = void 0;
            return (0, f["default"])(S, {
                emit: i,
                reconnect: a,
                iframeMode: l,
                toString: function() {
                    return "[object BackgroundSocket]";
                }
            }), S;
        };
        n.getLog = a;
    }, {
        "babel-runtime/core-js/object/assign": 20,
        "babel-runtime/core-js/object/values": 27,
        "babel-runtime/core-js/promise": 28,
        "babel-runtime/regenerator": 42,
        emitter: "emitter",
        "lib/bg/cookie": 178,
        "lib/config": 203,
        "lib/message": 258,
        "lib/timers": 276,
        "lib/tracking": 282,
        "lib/util": 288,
        websocket: "websocket"
    } ],
    268: [ function(e, t, n) {
        "use strict";
        function r(e) {
            if ("disconnected" != e) {
                var t = {};
                "string" == typeof e ? t.msg = e : e.error && (t.readyState = e.error.currentTarget && e.error.currentTarget.readyState, 
                t.returnValue = e.error.returnValue), u.logger.socketCsError(), console.error("capi error", e), 
                window.emit || a(window), window.emit("bgerror", e || "when send message to the socket");
            }
        }
        function o(e) {
            l.emitError(e);
        }
        function i(e) {
            function t(e, t) {
                var r = {
                    socketId: m,
                    method: e,
                    arg: t,
                    url: h,
                    useStandBy: g
                };
                v || i(), l.emitBackground("socket-client", r, null), "close" == e && n();
            }
            function n() {
                b.off("disconnect", n), l.off("socket-server", f, o), v = !1, d[m] && delete d[m];
            }
            function i() {
                v = !0, l.on("socket-server", f, o);
            }
            function f(e, t) {
                if (e.socketId == m) {
                    var n = e.msg || {};
                    n.action && "error" == n.action.toLowerCase() && u.logger.soketCsErrorMsg(n), t("ok"), 
                    b.emit(e.event, e.msg);
                }
            }
            var p = e.socketId, m = void 0 === p ? s.guid() : p, h = e.url, g = e.useStandBy, b = a({}), v = !1, _ = [ "connect", "send", "close", "reconnect", "release", "wsPlay", "wsPause" ];
            return _.forEach(function(e) {
                return b[e] = t.bind(null, e);
            }), b.one("connect", function() {
                d[m] = d[m] || m, c.timers.start(m);
            }), b.one("disconnect", n), b.on("error", r), b.socketId = m, b.toString = function() {
                return "[object SocketClient]";
            }, b;
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var a = e("emitter"), s = e("lib/util"), c = e("lib/timers"), l = e("lib/message"), u = e("lib/tracking"), d = {};
        n.SocketClient = i;
    }, {
        emitter: "emitter",
        "lib/message": 258,
        "lib/timers": 276,
        "lib/tracking": 282,
        "lib/util": 288
    } ],
    269: [ function(e, t, n) {
        "use strict";
        function r(t) {
            return (o.isTestsMode() && !window.socketServer || window.gr___sandbox) && e("./bg").SocketServer(t), 
            o.isBg() ? e("./bg").SocketServer(t) : e("./cs").SocketClient(t);
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var o = e("lib/util");
        n.Socket = r;
    }, {
        "./bg": 267,
        "./cs": 268,
        "lib/util": 288
    } ],
    270: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return {
                type: n.UPDATE_CONNECTION,
                data: {
                    bgNotConnected: !0,
                    online: !1
                },
                reason: e,
                sync: !1
            };
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.UPDATE_CONNECTION = "connection/UPDATE_CONNECTION", n.bgPageDown = r;
    }, {} ],
    271: [ function(e, t, n) {
        "use strict";
        function r(e) {
            var t = i.createMirrorStore(e, {
                bgPageDown: s.bgPageDown
            }, a.reducer), n = t.store, r = t.actions;
            return o.on("__bgerror", r.bgPageDown), {
                store: n,
                actions: r
            };
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var o = e("lib/message"), i = e("lib/store-mirror"), a = e("./reducer"), s = e("./actions");
        n.createAndObserve = r;
    }, {
        "./actions": 270,
        "./reducer": 272,
        "lib/message": 258,
        "lib/store-mirror": 274
    } ],
    272: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, t = arguments[1], n = t.type, r = t.data;
            switch (n) {
              case s.UPDATE_CONNECTION:
                return (0, a["default"])({}, e, {
                    connection: (0, a["default"])({}, e.connection, r)
                });

              default:
                return e;
            }
        }
        var i = e("babel-runtime/core-js/object/assign"), a = r(i);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var s = e("./actions");
        n.reducer = o;
    }, {
        "./actions": 270,
        "babel-runtime/core-js/object/assign": 20
    } ],
    273: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o(e, t) {
            function n() {
                var n = e.getState();
                d.isEmpty(n) || d.isEqual(r, n) || (r = n, t(n));
            }
            var r = void 0;
            return f.asyncCall(n), e.subscribe(n);
        }
        var i = e("babel-runtime/helpers/defineProperty"), a = r(i), s = e("babel-runtime/core-js/object/assign"), c = r(s), l = e("babel-runtime/core-js/object/keys"), u = r(l);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var d = e("lodash"), f = e("lib/util");
        n.observeStore = o, n.bindActions = function(e, t) {
            return (0, u["default"])(e).filter(function(t) {
                return e[t];
            }).reduce(function(n, r) {
                return (0, c["default"])(n, (0, a["default"])({}, r, function() {
                    var n = e[r].apply(e, arguments), o = "undefined" == typeof n.sync || n.sync;
                    return t((0, c["default"])({}, n, {
                        sync: o
                    }));
                }));
            }, {});
        };
    }, {
        "babel-runtime/core-js/object/assign": 20,
        "babel-runtime/core-js/object/keys": 25,
        "babel-runtime/helpers/defineProperty": 33,
        "lib/util": 288,
        lodash: "lodash"
    } ],
    274: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o(e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, n = arguments[2], r = function() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : h, t = arguments[1], r = (e.page || e.config || {}).domain;
                return t.sync && l.emitBackground("dispatch", (0, a["default"])({}, t, {
                    domain: r
                })), t.type == m ? (0, a["default"])({}, e, t.data) : n ? n(e, t) : e;
            }, o = c.createStore(r, {}, c.applyMiddleware(p)), i = d.bindActions((0, a["default"])({}, u.pureActions, t), o.dispatch);
            return l.on("state", function(e) {
                f.asyncCall(function() {
                    return o.dispatch({
                        type: m,
                        data: e
                    });
                }, 0);
            }), d.observeStore(o, e), {
                store: o,
                actions: i
            };
        }
        var i = e("babel-runtime/core-js/object/assign"), a = r(i);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var s = e("redux-logger"), c = e("redux"), l = e("lib/message"), u = e("lib/bg/features/actions"), d = e("./helpers"), f = e("../util"), p = s["default"]({
            level: "debug",
            collapsed: function() {
                return !0;
            },
            predicate: function() {
                return !1;
            }
        }), m = "store/SYNC", h = {
            page: {},
            connection: {}
        };
        n.createMirrorStore = o;
    }, {
        "../util": 288,
        "./helpers": 273,
        "babel-runtime/core-js/object/assign": 20,
        "lib/bg/features/actions": 179,
        "lib/message": 258,
        redux: "redux",
        "redux-logger": "redux-logger"
    } ],
    275: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o() {
            function e(e) {
                var t = [];
                return (0, c["default"])(e, function(e, n) {
                    if ("object" === ("undefined" == typeof n ? "undefined" : (0, a["default"])(n)) && null !== n) {
                        if (t.indexOf(n) !== -1) return;
                        t.push(n);
                    }
                    return n;
                });
            }
            function t() {
                l.emitDomEvent("console-log", e(d.flushLog()));
            }
            function n() {
                u.emitBackground("bg-reload", {});
            }
            function r() {
                u.emitBackground("reset", {});
            }
            function o() {
                u.emitBackground("get-tracker-log", {}, function(e) {
                    return l.emitDomEvent("tracker-log", e);
                });
            }
            function i() {
                u.emitBackground("get-capi-log", {}, function(e) {
                    return l.emitDomEvent("capi-log", e);
                });
            }
            function s() {
                u.emitBackground("get-extid", {}, function(e) {
                    return l.emitDomEvent("extid", e);
                });
            }
            function f() {
                u.emitBackground("get-localforage", {}, function(e) {
                    return l.emitDomEvent("localforage", e);
                });
            }
            function p(e) {
                u.emitBackground("set-localforage", {
                    key: e.key,
                    value: e.value
                }, function(e) {
                    return l.emitDomEvent("localforage", e);
                });
            }
            function m(e) {
                var t = e.key;
                u.emitBackground("get-pref", {
                    key: t
                }, function(e) {
                    return l.emitDomEvent("pref", {
                        key: t,
                        value: e
                    });
                });
            }
            function h(e) {
                var t = e.key, n = e.value;
                u.emitBackground("set-pref", {
                    key: t,
                    value: n
                });
            }
            l.listen(document, "bg-reload", n), l.listen(document, "reset", r), l.listen(document, "get-extid", s), 
            l.listen(document, "get-capi-log", i), l.listen(document, "get-tracker-log", o), 
            l.listen(document, "get-console-log", t), l.listen(document, "get-localforage", f), 
            l.listen(document, "set-localforage", p), l.listen(document, "get-pref", m), l.listen(document, "set-prefs", h);
        }
        var i = e("babel-runtime/helpers/typeof"), a = r(i), s = e("babel-runtime/core-js/json/stringify"), c = r(s);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var l = e("./dom"), u = e("./message"), d = e("./console");
        n.api = o;
    }, {
        "./console": 204,
        "./dom": 207,
        "./message": 258,
        "babel-runtime/core-js/json/stringify": 18,
        "babel-runtime/helpers/typeof": 39
    } ],
    276: [ function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var r = {};
        n.timers = {
            start: function(e) {
                r[e] = Date.now();
            },
            stop: function(e) {
                var t = this.passed(e);
                return delete r[e], t;
            },
            passed: function(e) {
                return e && r[e] ? Date.now() - r[e] : 0;
            }
        };
    }, {} ],
    277: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o() {
            var e = window.fetch.bind(window), t = y.LoggingImpl.DefaultLogAppender.createRootLogger("gnar", y.Logging.LogLevel.INFO, new y.LoggingImpl.GetFelogClient(m.URLS.newFelog, m.appName, m.getVersion(), m.ENV, e)), n = y.TimeSeriesImpl.MetricsStorage.createRoot("gnar", m.URLS.newFelog, e), r = new _.BackendStorage(e, g.GNAR.url), o = new _.ChromeCookieStorage(g.GNAR.url, g.GNAR.domain), i = new _.WebExtensionsCookieStorage(g.GNAR.url, g.GNAR.domain), a = new _.ContainerIdManager(h.isChrome() ? o : h.isFF() ? i : r, [ new _.CookieStorage(g.GNAR.domain), new _.LocalStorage(), new _.MemoryStorage() ], t.getLogger("containerId"), n.getCounter("containerId"), h.isChrome() ? 1e3 : 5e3);
            return new _.GnarClientImpl(g.GNAR.url, m.gnarAppName, g.getVersion(), e, a, t, n, (!0));
        }
        function i() {
            return d(this, void 0, void 0, c["default"].mark(function e() {
                return c["default"].wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        try {
                            b.tracker().gnar = o();
                        } catch (t) {
                            v.logger.gnarClientInitFail(t && t.message);
                        }

                      case 1:
                      case "end":
                        return e.stop();
                    }
                }, e, this);
            }));
        }
        function a(e) {
            function t(e, t) {
                t && e && (f(e, null), f(e, t, o));
            }
            var n = e.dapi, r = p.getDomain(void 0, void 0), o = {
                path: "/",
                domain: r,
                expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
            };
            t("__fngrprnt__", n);
        }
        var s = e("babel-runtime/regenerator"), c = r(s), l = e("babel-runtime/core-js/promise"), u = r(l), d = function(e, t, n, r) {
            return new (n || (n = u["default"]))(function(o, i) {
                function a(e) {
                    try {
                        c(r.next(e));
                    } catch (t) {
                        i(t);
                    }
                }
                function s(e) {
                    try {
                        c(r["throw"](e));
                    } catch (t) {
                        i(t);
                    }
                }
                function c(e) {
                    e.done ? o(e.value) : new n(function(t) {
                        t(e.value);
                    }).then(a, s);
                }
                c((r = r.apply(e, t || [])).next());
            });
        };
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var f = e("cookie"), p = e("../location"), m = e("../config"), h = e("../util"), g = e("../config"), b = e("./tracker"), v = e("./logger"), _ = e("@grammarly-npm/gnarclientweb"), y = e("@grammarly-npm/telemetry.ts");
        n.init = i, n.processCookiesFromGrammarly = a, n.getContainerIdOrUndefined = function() {
            return d(void 0, void 0, void 0, c["default"].mark(function e() {
                return c["default"].wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return e.prev = 0, e.next = 3, b.tracker().gnar.getContainerId();

                      case 3:
                        return e.abrupt("return", e.sent);

                      case 6:
                        return e.prev = 6, e.t0 = e["catch"](0), e.abrupt("return", void 0);

                      case 9:
                      case "end":
                        return e.stop();
                    }
                }, e, this, [ [ 0, 6 ] ]);
            }));
        };
    }, {
        "../config": 203,
        "../location": 257,
        "../util": 288,
        "./logger": 283,
        "./tracker": 286,
        "@grammarly-npm/gnarclientweb": 3,
        "@grammarly-npm/telemetry.ts": 6,
        "babel-runtime/core-js/promise": 28,
        "babel-runtime/regenerator": 42,
        cookie: "cookie"
    } ],
    278: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o(e) {
            for (var t = arguments.length, n = Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++) n[r - 1] = arguments[r];
            var o = function(t) {
                console.warn("tracking call " + e + " failed, reason: ", t);
            };
            if (h.isBg()) h.asyncCall(function() {
                var t;
                try {
                    switch (a(e, n), e) {
                      case p.CALL_HANDLER_ID:
                        var r = n[0], s = n.slice(1);
                        (t = p.methods)[r].apply(t, (0, u["default"])(s));
                        break;

                      default:
                        i(e, n);
                    }
                } catch (c) {
                    o(c);
                }
            }, 20); else {
                var s = 1e4, c = void 0, l = function() {
                    return clearInterval(c);
                }, d = function(e) {
                    l(), o(e);
                };
                c = window.setTimeout(function() {
                    return d("timeout call through bg page");
                }, s), m.emitBackground("tracking-call", {
                    msg: e,
                    data: n
                }, l);
            }
        }
        function i(e, t) {
            var n = e.split("."), r = n.pop(), o = n.reduce(function(e, t) {
                return t in e ? e[t] : {};
            }, g.tracker());
            return o && r && o[r] ? void o[r].apply(o, (0, u["default"])(t)) : console.error("No method " + e + " in tracker object");
        }
        function a(e, t) {
            console.info(e, t);
        }
        function s() {
            var e = w.slice(0);
            return w.length = 0, e;
        }
        var c = e("babel-runtime/core-js/object/assign"), l = (r(c), e("babel-runtime/helpers/toConsumableArray")), u = r(l), d = e("babel-runtime/core-js/object/keys"), f = r(d);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var p, m = e("../message"), h = e("../util"), g = e("./tracker"), b = e("./felogPixel"), v = e("../config"), _ = e("./felogClient"), y = e("lib/request");
        !function(e) {
            var t, n = h.isBg() ? new _.DefaultFelogClient(v.URLS.newFelog, v.appName, v.getVersion(), v.ENV, y.fetch.bind(window)) : void 0;
            !function(e) {
                function t(e, t, r, o) {
                    if (!n) throw Error("felogClient unavailable");
                    n.sendEvent(e, t, r, o)["catch"](function(n) {
                        return b.sendEventPixel(e, t, r, o);
                    });
                }
                e.sendFelog = t;
            }(t = e.methods || (e.methods = {})), e.CALL_HANDLER_ID = "tracking/RPC";
        }(p || (p = {})), n.callBgPage = (0, f["default"])(p.methods).reduce(function(e, t) {
            return e[t] = function() {
                for (var e = arguments.length, n = Array(e), r = 0; r < e; r++) n[r] = arguments[r];
                return o.apply(void 0, [ p.CALL_HANDLER_ID, t ].concat(n));
            }, e;
        }, {});
        var w = [];
        n.call = o, n.getLog = s;
    }, {
        "../config": 203,
        "../message": 258,
        "../util": 288,
        "./felogClient": 280,
        "./felogPixel": 281,
        "./tracker": 286,
        "babel-runtime/core-js/object/assign": 20,
        "babel-runtime/core-js/object/keys": 25,
        "babel-runtime/helpers/toConsumableArray": 38,
        "lib/request": 263
    } ],
    279: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o(e, t, n, r, o, i, c, l) {
            var u = {
                message: i,
                logger: o,
                level: s.toFelogString(c),
                application: e,
                version: t,
                env: n
            };
            return l && (u.extra = l), r + "/log?json=" + encodeURIComponent((0, a["default"])(u));
        }
        var i = e("babel-runtime/core-js/json/stringify"), a = r(i);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var s;
        !function(e) {
            e[e.INFO = 0] = "INFO", e[e.WARN = 1] = "WARN", e[e.ERROR = 2] = "ERROR";
        }(s = n.LogLevel || (n.LogLevel = {})), function(e) {
            function t(t) {
                switch (t) {
                  case e.INFO:
                    return "INFO";

                  case e.WARN:
                    return "WARN";

                  case e.ERROR:
                    return "ERROR";

                  default:
                    ;
                    throw new TypeError("Unrecognized log level " + t);
                }
            }
            e.toFelogString = t;
        }(s = n.LogLevel || (n.LogLevel = {})), n.felogRequestUrl = o;
    }, {
        "babel-runtime/core-js/json/stringify": 18
    } ],
    280: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        var o = e("babel-runtime/helpers/classCallCheck"), i = r(o), a = e("babel-runtime/helpers/createClass"), s = r(a);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var c = e("@grammarly-npm/telemetry.ts/lib/timeseries_impl"), l = e("./felog"), u = function() {
            function e(t, n, r, o, a) {
                (0, i["default"])(this, e), this._baseUrl = t, this._appName = n, this._appVersion = r, 
                this._env = o, this._fetch = a, this._metrics = c.MetricsStorage.createRoot(this._env + "." + this._appName, this._baseUrl, this._fetch);
            }
            return (0, s["default"])(e, [ {
                key: "sendEvent",
                value: function(e, t, n, r) {
                    return this._fetch(l.felogRequestUrl(this._appName, this._appVersion, this._env, this._baseUrl, e, t, n, r), {
                        mode: "no-cors",
                        method: "get",
                        cache: "no-cache"
                    }).then(function(e) {})["catch"](function(e) {});
                }
            }, {
                key: "sendCounter",
                value: function(e, t) {
                    this._metrics.getCounter(e).increment(t);
                }
            }, {
                key: "sendTimer",
                value: function(e, t) {
                    this._metrics.getTimer(e).recordTime(t);
                }
            } ]), e;
        }();
        n.DefaultFelogClient = u;
    }, {
        "./felog": 279,
        "@grammarly-npm/telemetry.ts/lib/timeseries_impl": 11,
        "babel-runtime/helpers/classCallCheck": 31,
        "babel-runtime/helpers/createClass": 32
    } ],
    281: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o(e, t, n, r) {
            var o = document.createElement("img");
            return o.src = c.felogRequestUrl(s.appName, s.getVersion(), s.ENV, s.URLS.newFelog, e, t, n, r), 
            a["default"].resolve();
        }
        var i = e("babel-runtime/core-js/promise"), a = r(i);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var s = e("../newConfig"), c = e("./felog");
        n.sendEventPixel = o;
    }, {
        "../newConfig": 259,
        "./felog": 279,
        "babel-runtime/core-js/promise": 28
    } ],
    282: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o() {
            var t = e("./bgonly"), n = t.init, r = t.processCookiesFromGrammarly;
            n()["catch"](function(e) {
                return p.logger.bgTrackingInitFail();
            }), h = e("./on").on, u.on("tracking-fire", function(e) {
                var t = e.msg, n = e.data;
                return i.apply(void 0, [ t ].concat((0, c["default"])(n)));
            }), u.on("tracker-init", r), u.on("tracking-call", function(e) {
                var t = e.msg, n = e.data, r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : l._f;
                f.call.apply(f, [ t ].concat((0, c["default"])(n))), r();
            }), i("activity-ping");
        }
        function i(e) {
            for (var t = arguments.length, n = Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++) n[r - 1] = arguments[r];
            if (l.isBg()) {
                if (!h[e]) return console.error("No handler specified for message: " + e);
                l.asyncCall(function() {
                    var t;
                    return (t = h)[e].apply(t, n);
                }, 20);
            } else u.emitBackground("tracking-fire", {
                msg: e,
                data: n
            });
        }
        function a() {
            function t() {
                n++, n > i && clearInterval(o);
                var e = {
                    mpCookie: r(d.MIXPANEL.cookie),
                    gnar: r("gnar_containerId"),
                    dapi: r("__fngrprnt__")
                };
                e.mpCookie && (clearInterval(o), u.emitBackground("tracker-init", e));
            }
            var n = 0, r = e("cookie");
            r["default"] && (r = r["default"]);
            var o = setInterval(t, 500), i = 10;
        }
        var s = e("babel-runtime/helpers/toConsumableArray"), c = r(s);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var l = e("../util"), u = e("../message"), d = e("../config"), f = e("./call"), p = e("./logger");
        n.logger = p.logger;
        var m = e("./call");
        n.call = m.call, n.getLog = m.getLog;
        var h = {};
        n.initBg = o, n.fire = i, n.initContentScript = a;
    }, {
        "../config": 203,
        "../message": 258,
        "../util": 288,
        "./bgonly": 277,
        "./call": 278,
        "./logger": 283,
        "./on": 284,
        "babel-runtime/helpers/toConsumableArray": 38,
        cookie: "cookie"
    } ],
    283: [ function(e, t, n) {
        "use strict";
        function r() {
            window.addEventListener("error", function(e) {
                return n.logger.unhandledBgPageException(e);
            }), window.addEventListener("unhandledrejection", function(e) {
                return n.logger.unhandledBgPageRejection(e);
            });
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var o = e("./call"), i = e("./telemetry"), a = e("../newConfig");
        n.logger = new i.Telemetry(o.callBgPage.sendFelog.bind(o.callBgPage)), a.isBg() && (console.info("Installing unhandled error loggers..."), 
        r());
    }, {
        "../newConfig": 259,
        "./call": 278,
        "./telemetry": 285
    } ],
    284: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        var o, i = e("babel-runtime/helpers/defineProperty"), a = r(i), s = e("babel-runtime/regenerator"), c = r(s), l = e("babel-runtime/helpers/slicedToArray"), u = r(l), d = e("babel-runtime/core-js/promise"), f = r(d), p = function(e, t, n, r) {
            return new (n || (n = f["default"]))(function(o, i) {
                function a(e) {
                    try {
                        c(r.next(e));
                    } catch (t) {
                        i(t);
                    }
                }
                function s(e) {
                    try {
                        c(r["throw"](e));
                    } catch (t) {
                        i(t);
                    }
                }
                function c(e) {
                    e.done ? o(e.value) : new n(function(t) {
                        t(e.value);
                    }).then(a, s);
                }
                c((r = r.apply(e, t || [])).next());
            });
        };
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var m = e("../bg/prefs"), h = e("../util"), g = e("./call"), b = e("./logger");
        n.on = (o = {}, (0, a["default"])(o, "activity-ping", function() {}), (0, a["default"])(o, "daily-ping", function(e, t) {
            return p(this, void 0, void 0, c["default"].mark(function n() {
                var r, o, i, a, s, l;
                return c["default"].wrap(function(n) {
                    for (;;) switch (n.prev = n.next) {
                      case 0:
                        if (e) {
                            n.next = 2;
                            break;
                        }
                        return n.abrupt("return");

                      case 2:
                        return g.call("gnar.pingMaybe"), n.next = 5, m.prefs.get("pingDate");

                      case 5:
                        if (r = n.sent, "string" != typeof r && (r = ""), o = r.split("|"), i = (0, u["default"])(o, 2), 
                        a = i[0], s = i[1], l = t ? "cookiesDisabled" : e, !(a && a > Date.now() && s === l)) {
                            n.next = 11;
                            break;
                        }
                        return n.abrupt("return");

                      case 11:
                        b.logger.dailyPing(), m.prefs.set("pingDate", [ h.getNextPingDate(), l ].join("|"));

                      case 13:
                      case "end":
                        return n.stop();
                    }
                }, n, this);
            }));
        }), (0, a["default"])(o, "app_signin_success", function() {
            g.call("gnar.track", "userLoginForm/accepted");
        }), (0, a["default"])(o, "app_signup_success", function() {
            g.call("gnar.track", "userAccountSignupForm/accepted");
        }), (0, a["default"])(o, "signin-error", function(e) {
            e.errorType = "Server-Side", g.call("gnar.track", "userLoginForm/rejected");
        }), (0, a["default"])(o, "signup-error", function(e) {
            e.errorType = "Server-Side", g.call("gnar.track", "userAccountSignupForm/rejected");
        }), (0, a["default"])(o, "upgrade-after-register", function() {
            return p(this, void 0, void 0, c["default"].mark(function e() {
                return c["default"].wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        g.call("gnar.track", "Account_Type_Selected");

                      case 1:
                      case "end":
                        return e.stop();
                    }
                }, e, this);
            }));
        }), (0, a["default"])(o, "hook-clicked", function(e) {
            g.call("gnar.track", "upgradeHookClicked", {
                placement: e
            }), b.logger.userUpgradeClick(e);
        }), (0, a["default"])(o, "correct-btn-clicked", function() {
            g.call("gnar.track", "gbuttonClicked"), b.logger.gButtonClick();
        }), (0, a["default"])(o, "btn-disable-in-field", function(e) {
            g.call("gnar.track", "checkingInFieldToggled", {
                enabled: e
            }), b.logger.checkingToggledInField(e);
        }), (0, a["default"])(o, "button-change-state", function() {}), (0, a["default"])(o, "login-attempt", function(e) {
            g.call("gnar.track", "signInClicked", {
                placement: e
            });
        }), (0, a["default"])(o, "show-dictionary", function() {
            g.call("gnar.track", "showDictionary");
        }), (0, a["default"])(o, "referral-shown", function(e) {
            g.call("gnar.track", "referral/referralNotificationShown", {
                placement: e
            });
        }), (0, a["default"])(o, "referral-clicked", function(e) {
            g.call("gnar.track", "referral/referralButtonClicked", {
                placement: e
            });
        }), (0, a["default"])(o, "tab-connected", function(e, t, n) {
            var r = t.enabled, o = n.cookiesDisabled;
            this["daily-ping"](e, o), r || b.logger.disabledOnDomain();
        }), (0, a["default"])(o, "session-invalidate", function(e, t, n, r, o) {
            var i = e.id, a = e.anonymous, s = e.isTest;
            i !== t.id && (g.call("gnar.setUser", i, s), this["daily-ping"](i, r)), n && b.logger.sessionInvalidated(n, i !== t.id), 
            t.email && !t.anonymous && a && b.logger.unexpectedAnonymous({
                email: t.email,
                token: t.token,
                grauth: t.grauth,
                tokenEqualsGrauth: t.token === t.grauth,
                cookiesDisabled: r,
                reason: n
            });
        }), (0, a["default"])(o, "set-dapi-prop", function(e, t) {
            "dialectWeak" === e && g.call("gnar.track", "languageWeakPreference", {
                dialect: t
            }), b.logger.dapiPropInitialized(e, t);
        }), (0, a["default"])(o, "change-dialect", function(e) {
            var t = e.language, n = e.dialectWeak, r = {
                language: t
            };
            n && (r.sameAsWeak = t === n), g.call("gnar.track", "languageStrongPreference", r);
        }), (0, a["default"])(o, "change-defs", function(e) {
            g.call("gnar.track", "definitionsToggled", e), b.logger.toggleExtensionDefs(e.enabled);
        }), (0, a["default"])(o, "change-grammar", function(e) {
            g.call("gnar.track", "checkingToggled", e), b.logger.toggleExtension(e.enabled);
        }), (0, a["default"])(o, "popup-open", function() {
            g.call("gnar.track", "browserToolbarButtonClicked");
        }), (0, a["default"])(o, "popup-open-on-unsupported", function() {
            g.call("gnar.track", "browserToolbarButtonClicked/unsupported");
        }), (0, a["default"])(o, "cookie-overflow", function(e, t) {
            b.logger.cookieOverflow(e, t);
        }), (0, a["default"])(o, "premium-popup-show", function() {
            g.call("gnar.track", "upgradeReferralPopupShown");
        }), (0, a["default"])(o, "premium-popup-upgrade-click", function() {
            g.call("gnar.track", "upgradeReferralPremiumBtnClicked");
        }), (0, a["default"])(o, "premium-popup-referral-click", function() {
            g.call("gnar.track", "upgradeReferralInviteBtnClicked");
        }), (0, a["default"])(o, "onboarding-popup-show", function() {
            g.call("gnar.track", "onboarding-popup-show"), b.logger.onboardingPopupShow();
        }), (0, a["default"])(o, "onboarding-popup-cancel", function() {
            g.call("gnar.track", "onboarding-popup-cancel");
        }), (0, a["default"])(o, "onboardingTutorial-popup-show", function() {
            g.call("gnar.track", "onboardingTutorial-popup-show"), b.logger.onboardingTutorialShow();
        }), (0, a["default"])(o, "onboardingTutorialNext-button-click", function() {
            g.call("gnar.track", "onboardingTutorialNext-button-click");
        }), (0, a["default"])(o, "onboardingTutorialPersonalize-button-click", function() {
            g.call("gnar.track", "onboardingTutorialPersonalize-button-click");
        }), (0, a["default"])(o, "onboardingTutorialSave-button-click", function() {
            g.call("gnar.track", "onboardingTutorialSave-button-click");
        }), (0, a["default"])(o, "onboardingTutorialLetsWrite-button-click", function() {
            g.call("gnar.track", "onboardingTutorialLetsWrite-button-click");
        }), o);
    }, {
        "../bg/prefs": 183,
        "../util": 288,
        "./call": 278,
        "./logger": 283,
        "babel-runtime/core-js/promise": 28,
        "babel-runtime/helpers/defineProperty": 33,
        "babel-runtime/helpers/slicedToArray": 37,
        "babel-runtime/regenerator": 42
    } ],
    285: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        var o = e("babel-runtime/core-js/json/stringify"), i = r(o), a = e("babel-runtime/helpers/classCallCheck"), s = r(a), c = e("babel-runtime/helpers/createClass"), l = r(c);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var u = e("./felog"), d = function() {
            function e(t) {
                var n = this;
                (0, s["default"])(this, e), this._sendFelog = t, this.pageLoadTimeout = function() {
                    n._send("cs.connection.failover.pageLoad.timeout", "content script init failed", u.LogLevel.ERROR);
                }, this.appLoadTimeout = function() {
                    n._send("cs.connection.failover.appLoad.timeout", "extension init timed out", u.LogLevel.ERROR);
                }, this.differentStateDomain = function(e) {
                    n._send("cs.state.differentDomain", "received state for different domain", u.LogLevel.INFO, {
                        stateDomain: e
                    });
                }, this.restoredBgConnection = function(e) {
                    n._send("cs.connection.bg.restored", "bg page connection restored", u.LogLevel.INFO, {
                        timeWithoutConnection: e
                    });
                }, this.initWithoutBgConnection = function() {
                    n._send("cs.connection.bg.disconnected", "no connection to bg page", u.LogLevel.INFO);
                }, this.fetchDefinitionsFail = function() {
                    n._send("cs.connection.api.definition.failed", "definitions fetch failed", u.LogLevel.WARN);
                }, this.infinityCheckResetFail = function(e) {
                    n._send("cs.connection.infiniteCheck.failed", "infinite check reset failed", u.LogLevel.ERROR, {
                        delay: e
                    });
                }, this.tooLongPageConfigInit = function(e) {
                    n._send("cs.pageConfig.init.exceeded", "page config init timeout", u.LogLevel.WARN, {
                        initTime: e
                    });
                }, this.tooLongUserUpdateTime = function(e) {
                    n._send("bg.state.user.update.exceeded", "user state update took too long", u.LogLevel.WARN, {
                        updateTime: e
                    });
                }, this.lostBgPageConnection = function() {
                    n._send("cs.gbutton.bgСonnection.lost", "gbutton connection to bg page lost", u.LogLevel.INFO);
                }, this.restoreBgPageConnection = function(e) {
                    n._send("cs.gbutton.bgСonnection.restored", "gbutton connection to bg page restored", u.LogLevel.INFO, {
                        time: e
                    });
                }, this.badCursorPosition = function() {
                    n._send("cs.editor.badCursorPosition", "incorrect cursor position in grammarly-editor", u.LogLevel.INFO);
                }, this.cursorJump = function() {
                    n._send("cs.editor.cursorJump", "cursor jump detected", u.LogLevel.WARN);
                }, this.signinOpen = function() {
                    n._send("cs.signin.open", "sign in dialog opened", u.LogLevel.INFO);
                }, this.signinClose = function(e) {
                    n._send("cs.signin.close", "sign in dialog closed", u.LogLevel.INFO, {
                        openTime: e
                    });
                }, this.tabReloadClick = function() {
                    n._send("cs.gbutton.reload.click", "gbutton reload clicked", u.LogLevel.WARN);
                }, this.popupLoadError = function(e, t) {
                    n._send("cs.popup.load.error", "could not open pop-up editor", u.LogLevel.ERROR, {
                        message: e,
                        name: t
                    });
                }, this.loginNoBgPageConnection = function(e) {
                    n._send("debug.cs.connection.signin.bg.timeout", "can not connect to bg page on login", u.LogLevel.INFO, {
                        message: e
                    });
                }, this.pageConfigCDNError = function(e) {
                    n._send("cs.pageConfig.cdn.error", "could not read page config", u.LogLevel.ERROR, {
                        message: e
                    });
                }, this.pageConfigLocalStorageError = function(e, t) {
                    n._send("cs.pageConfig.localStorage.error", "could not read page config from localStorage", u.LogLevel.INFO, {
                        message: e,
                        name: t
                    });
                }, this.pageConfigUpdated = function(e, t) {
                    n._send("cs.pageConfig.updated", "page config updated", u.LogLevel.INFO, {
                        oldVersion: e,
                        newVersion: t
                    });
                }, this.settingsPopupTimeout = function() {
                    n._send("settings.popup.init.timeout", "settings popup open timeout", u.LogLevel.WARN);
                }, this.settingsUsupportedShow = function(e) {
                    n._send("settings.popup.state.unsupported.show", "page unsupported message shown", u.LogLevel.INFO, {
                        popupType: e
                    });
                }, this.settingsPopupToggled = function(e) {
                    n._send("settings.popup.experiment.toggle", "settings popup disabled/enabled for experiment on /personalize page", u.LogLevel.INFO, {
                        isPopupDisabled: e
                    });
                }, this.socketBgError = function() {
                    n._send("bg.socket.error", "bg page socket error", u.LogLevel.WARN);
                }, this.capiNotAuthorizedLoop = function(e, t) {
                    n._send("debug.socket.notAuthorizedLoop", "could not authenticate on capi and auth", u.LogLevel.INFO, {
                        authDegradation: e,
                        cookiesDisabled: t
                    });
                }, this.socketDisabledCookie = function() {
                    n._send("debug.socket.disabledCookies", "disabled cookies after failed authentication", u.LogLevel.INFO);
                }, this.socketBgRestored = function(e) {
                    n._send("debug.bg.socket.restored", "capi session restored", u.LogLevel.INFO, {
                        tryCount: e
                    });
                }, this.socketBgReconnectFail = function(e, t) {
                    n._send("bg.socket.reconnect.fail", "could not restore ws connection", u.LogLevel.WARN, {
                        token: e,
                        tryCount: t
                    });
                }, this.socketCsError = function() {
                    n._send("cs.socket.error", "content script socket error", u.LogLevel.WARN);
                }, this.soketCsErrorMsg = function(e) {
                    n._send("cs.socket.errorMsg", "capi error", u.LogLevel.WARN, {
                        message: e
                    });
                }, this.gnarClientInitFail = function(e) {
                    n._send("gnar.bg.tracking.gnar.init.fail", "gnar init failed", u.LogLevel.WARN, {
                        message: e
                    });
                }, this.bgTrackingInitFail = function() {
                    n._send("debug.tracking.init.fail", "bg page tracking library init failed", u.LogLevel.INFO);
                }, this.dailyPing = function() {
                    n._send("debug.dailyPing", "daily ping", u.LogLevel.INFO);
                }, this.userUpgradeClick = function(e) {
                    n._send("cs.ui.action.upgradeClick", "upgrade hook clicked", u.LogLevel.INFO, {
                        placement: e
                    });
                }, this.gButtonClick = function() {
                    n._send("cs.ui.gbutton.click", "gbutton clicked", u.LogLevel.INFO);
                }, this.checkingToggledInField = function(e) {
                    n._send("cs.ui.gbutton.toggleInField", "checking toggled in field", u.LogLevel.INFO, {
                        enabled: e
                    });
                }, this.disabledOnDomain = function() {
                    n._send("cs.state.disabledOnDomain", "checking disabled for domain", u.LogLevel.INFO);
                }, this.sessionInvalidated = function(e, t) {
                    n._send("bg.session.invalidated", "user session invalidated", u.LogLevel.INFO, {
                        reason: e,
                        userChanged: t
                    });
                }, this.unexpectedAnonymous = function(e) {
                    n._send("debug.bg.session.unexpectedAnonymous", "user changed to anonymous", u.LogLevel.INFO, e);
                }, this.dapiPropInitialized = function(e, t) {
                    n._send("bg.settings.dapi.prop.init", "save property to the DAPI", u.LogLevel.INFO, {
                        name: e,
                        value: t
                    });
                }, this.getDapiPropError = function(e, t) {
                    n._send("bg.connection.dapi.getProp.error", "could not get dapi property", u.LogLevel.WARN, {
                        property: e,
                        body: t
                    });
                }, this.setDapiPropError = function(e, t) {
                    n._send("bg.connection.dapi.setProp.error", "could not set dapi property", u.LogLevel.WARN, {
                        property: e,
                        body: t
                    });
                }, this.toggleExtensionDefs = function(e) {
                    n._send("bg.settings.definitions.toggle", "definitions toggled for domain", u.LogLevel.INFO, {
                        enabled: e
                    });
                }, this.toggleExtension = function(e) {
                    n._send("bg.settings.extension.toggle", "extension toggled for domain", u.LogLevel.INFO, {
                        enabled: e
                    });
                }, this.cookieOverflow = function(e, t) {
                    n._send("debug.bg.state.cookie.overflow", "cookie is too big", u.LogLevel.INFO, {
                        size: e,
                        biggestCookie: t
                    });
                }, this.externalChangePlan = function() {
                    n._send("bg.api.external.changePlan", "plan changed from editor", u.LogLevel.INFO);
                }, this.externalChangeDialect = function() {
                    n._send("bg.api.external.changeDialect", "dialect changed from editor", u.LogLevel.INFO);
                }, this.externalChangeUser = function() {
                    n._send("bg.api.external.changeUsed", "user changed from editor", u.LogLevel.INFO);
                }, this.externalLogout = function() {
                    n._send("bg.api.external.logout", "user logged out form editor", u.LogLevel.INFO);
                }, this.bgPageStartFail = function(e, t) {
                    n._send("bg.start.fail", "bg page start failed", u.LogLevel.ERROR, {
                        message: e,
                        stack: t
                    });
                }, this.bgPageInitTimeout = function(e) {
                    n._send("bg.state.start.timeout", "bg page init timeout", u.LogLevel.WARN, {
                        initTime: e
                    });
                }, this.bgPageInitFail = function(e) {
                    n._send("bg.state.init.fail", "bg page init failed", u.LogLevel.ERROR, {
                        initAttempts: e
                    });
                }, this.extensionUpdated = function(e, t) {
                    n._send("bg.state.updated", "extension updated", u.LogLevel.INFO, {
                        currentVersion: e,
                        previousVersion: t
                    });
                }, this.extensionUpdateFail = function(e) {
                    n._send("bg.state.update.fail", "extension update failed", u.LogLevel.INFO, {
                        previousVersion: e
                    });
                }, this.cannotGetInstallSource = function() {
                    n._send("bg.getSource.fail", "failed to get extension install source", u.LogLevel.WARN);
                }, this.extensionInstall = function(e) {
                    n._send("bg.state.install", "extension installed", u.LogLevel.INFO, {
                        source: e
                    });
                }, this.chromeForcedToUpdate = function(e) {
                    n._send("bg.chrome.forcedToUpdate", "chrome forced update", u.LogLevel.INFO, {
                        newVersion: e
                    });
                }, this.chromeContentScriptLoadError = function(e, t) {
                    n._send("bg.chrome.cs.load.error", "content script execution error", u.LogLevel.WARN, {
                        message: e,
                        type: t
                    });
                }, this.reloadNotificationShow = function() {
                    n._send("bg.ui.notification.tabsReload.show", "extension reload notification shown", u.LogLevel.WARN);
                }, this.reloadNotificationClick = function() {
                    n._send("bg.ui.notification.tabsReload.click", "reload notification clicked", u.LogLevel.INFO);
                }, this.fetchUserFail = function(e, t, r) {
                    n._send("bg.user.fetch.fail", "failed to update user", u.LogLevel.WARN, {
                        body: t,
                        statusCode: r,
                        reason: e
                    });
                }, this.fetchMimicFail = function(e, t) {
                    n._send("bg.user.mimic.fail", "mimic request failed", u.LogLevel.WARN, {
                        body: e,
                        statusCode: t
                    });
                }, this.fetchCookieFail = function() {
                    n._send("bg.cookie.fail", "could not get grauth from cookie", u.LogLevel.WARN);
                }, this.fetchSettingsFail = function(e, t) {
                    n._send("bg.user.settings.fail", "could not get settings from auth", u.LogLevel.WARN, {
                        body: e,
                        statusCode: t
                    });
                }, this.frequentCookieChanges = function(e) {
                    n._send("debug.cookie.onChange.error", "cookie change too frequent", u.LogLevel.INFO, {
                        canceled: e
                    });
                }, this.initializePropFromDapi = function(e) {
                    n._send("bg.state.dapi.prop.initialize", "set property from dapi", u.LogLevel.INFO, {
                        name: e
                    });
                }, this.onboardingPopupShow = function() {
                    n._send("cs.onboarding.popup.show", "show onboarding popup to user after first time extension install", u.LogLevel.INFO);
                }, this.onboardingTutorialShow = function() {
                    n._send("cs.onboarding.tutorial.show", "opened onboarding dialog after popup", u.LogLevel.INFO);
                }, this.onboardingVideoLoaded = function() {
                    n._send("cs.onboarding.tutorial.video.loaded", "load video data for onboarding tutorial", u.LogLevel.INFO);
                }, this.incognitoInit = function() {
                    n._send("bg.incognito.init", "extension initialized in incognito mode", u.LogLevel.INFO);
                }, this.disabledCookiesInit = function() {
                    n._send("bg.cookie.disabled", "extension initialized with disabled cookies", u.LogLevel.INFO);
                }, this.proxyInit = function() {
                    n._send("proxy.init", "proxy script initialized", u.LogLevel.INFO);
                }, this.proxyPortDisconnected = function(e, t) {
                    n._send("proxy.disconnect", "proxy port disconnected", u.LogLevel.INFO, {
                        port: e,
                        error: t
                    });
                }, this.unhandledBgPageException = function(e) {
                    n._send("bg.unhandledException", "unhandled exception on background page", u.LogLevel.ERROR, {
                        message: e.error ? e.error.message : e.message
                    });
                }, this.unhandledBgPageRejection = function(e) {
                    n._send("bg.unhandledRejection", "unhandled promise rejection on background page", u.LogLevel.ERROR, {
                        message: null != e.reason ? "string" == typeof e.reason ? e.reason : e.reason.message : e.message
                    });
                };
            }
            return (0, l["default"])(e, [ {
                key: "_send",
                value: function(e, t, n, r) {
                    var o = void 0;
                    try {
                        o = (0, i["default"])(r);
                    } catch (a) {
                        o = "Failed to stringify event properties: '" + a + "', '" + (a && a.message) + "'", 
                        console.warn(o, "for " + t + "@" + e);
                    }
                    try {
                        this._sendFelog(e, t, n, null != r ? {
                            json: o
                        } : void 0);
                    } catch (a) {
                        console.warn("Failed to send felog for " + t + "@" + e + ": '" + a + "', '" + (a && a.message) + "'");
                    }
                }
            } ]), e;
        }();
        n.Telemetry = d;
    }, {
        "./felog": 279,
        "babel-runtime/core-js/json/stringify": 18,
        "babel-runtime/helpers/classCallCheck": 31,
        "babel-runtime/helpers/createClass": 32
    } ],
    286: [ function(e, t, n) {
        "use strict";
        function r() {
            return window.tracker = window.tracker || {}, window.tracker;
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.tracker = r;
    }, {} ],
    287: [ function(e, t, n) {
        "use strict";
        function r(e, t) {
            return e + "=" + encodeURIComponent(t);
        }
        function o(e, t) {
            return r("utm_medium", l) + "&" + r("utm_source", e) + "&" + r("utm_campaign", t);
        }
        function i(e, t) {
            return c.URLS.signup + "?" + o(e, t);
        }
        function a(e, t) {
            return c.URLS.upgrade + "?" + o(e, t);
        }
        function s(e, t, n) {
            return e + "&" + o(t, n);
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var c = e("./newConfig"), l = "internal";
        n.getSignUpURL = i, n.getUpgradeURL = a, n.addParamsToUpgradeURL = s;
    }, {
        "./newConfig": 259
    } ],
    288: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o(e) {
            var t = [ "freeeeeeee@grammarly.com", "premiumuser@grammarly.com" ].indexOf(e) !== -1;
            return !t && /^.*@grammarly.com$/.test(e);
        }
        function i() {
            return window.chrome && window.chrome.runtime && window.chrome.runtime.lastError;
        }
        function a(e) {
            return !!(e && e.constructor && e.call && e.apply);
        }
        function s(e, t) {
            function n() {
                function n() {
                    o(), e();
                }
                function o() {
                    var o = setTimeout(n, t);
                    r[e] = o;
                }
                o();
            }
            var r = s.items = s.items || {}, o = r[e];
            if (o || t) return o && !t ? (clearTimeout(o), void delete r[e]) : void n();
        }
        function c(e) {
            s(e);
        }
        function l() {
            return (65536 * (1 + Math.random()) | 0).toString(16).substring(1);
        }
        function u() {
            return l() + l() + "-" + l() + "-" + l() + "-" + l() + "-" + l() + l() + l();
        }
        function d() {}
        function f() {
            return !0;
        }
        function p() {
            X.isWE() && (window.chrome.runtime.reload ? window.chrome.runtime.reload() : window.location.reload());
        }
        function m(e) {
            if (e.location) {
                var t = "mail.google.com" == e.location.host, n = e.querySelector("iframe#js_frame") && e.querySelector("iframe#sound_frame");
                return t || n;
            }
        }
        function h(e) {
            return /^[-!#$%&\'*+\\.\/0-9=?A-Z^_`a-z{|}~]+@[-!#$%&\'*+\\/0-9=?A-Z^_`a-z{|}~]+\.[-!#$%&\'*+\\.\/0-9=?A-Z^_`a-z{|}~]+$/.test(e);
        }
        function g(e) {
            return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        function b(e, t) {
            return t[1 == e ? 0 : 1];
        }
        function v(e) {
            return Y.transform(e, function(e, t) {
                return e[t] = d;
            });
        }
        function _(e, t, n) {
            var r = {}, o = function() {
                var o = "_memoize_" + (t ? t.apply(this, arguments) : arguments[0]);
                return window.hasOwnProperty.call(r, o) ? r[o] : (n && setTimeout(function() {
                    delete r[o];
                }, n), r[o] = e.apply(this, arguments));
            };
            return o;
        }
        function y(e, t) {
            return (0, z["default"])(t).reduce(function(n, r) {
                return (0, U["default"])({}, n, (0, B["default"])({}, r, function() {
                    for (var n = arguments.length, o = Array(n), i = 0; i < n; i++) o[i] = arguments[i];
                    return e.then(function() {
                        return t[r].apply(t, o);
                    });
                }));
            }, {});
        }
        function w(e) {
            return new H["default"](function(t) {
                return e(t);
            });
        }
        function k(e, t) {
            return Math.floor(Math.random() * (t - e + 1)) + e;
        }
        function E(e) {
            return new H["default"](function(t) {
                return setTimeout(t, e);
            });
        }
        function C(e) {
            if (e) {
                var t = new Date(e);
                if ("Invalid Date" !== t.toString()) return J[t.getMonth()] + " " + t.getDate() + ", " + t.getFullYear();
            }
        }
        function x(e) {
            var t = function() {};
            return t.prototype = e(), t;
        }
        function j() {
            function e(e) {
                return e.split(".").map(function(e) {
                    return Number(e) || 0;
                });
            }
            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "", n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "", r = e(t), o = e(n), i = Array(Math.abs(r.length - o.length)).fill(0);
            if (r.length > o.length ? o.push.apply(o, (0, D["default"])(i)) : r.push.apply(r, (0, 
            D["default"])(i)), r.every(function(e, t) {
                return e === o[t];
            })) return 0;
            for (var a = 0, s = r.length; a < s; a++) {
                if (r[a] > o[a]) return 1;
                if (r[a] < o[a]) return -1;
            }
            return -1;
        }
        function S() {
            return q(this, void 0, void 0, O["default"].mark(function e() {
                return O["default"].wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        if (X.isWE()) {
                            e.next = 2;
                            break;
                        }
                        return e.abrupt("return", null);

                      case 2:
                        return e.prev = 2, e.next = 5, H["default"].race([ new H["default"](function(e) {
                            return window.chrome.runtime.sendMessage("ping", e);
                        }), E(1e4).then(function(e) {
                            return "timeouted";
                        }) ]);

                      case 5:
                        return e.abrupt("return", e.sent);

                      case 8:
                        return e.prev = 8, e.t0 = e["catch"](2), e.abrupt("return", "orphaned");

                      case 11:
                      case "end":
                        return e.stop();
                    }
                }, e, this, [ [ 2, 8 ] ]);
            }));
        }
        function T(e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 10;
            setTimeout(e, t);
        }
        function L() {
            function e(e) {
                if (a.length > 0) {
                    var t = a.shift();
                    t(e);
                } else o ? i.push(e) : i[0] = e;
            }
            function t() {
                return i.length ? H["default"].resolve(i.shift()) : new H["default"](function(e) {
                    return a.push(e);
                });
            }
            var n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, r = n.buffered, o = void 0 === r || r, i = [], a = [];
            return {
                take: t,
                put: e
            };
        }
        function N(e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 100;
            if (!e) return NaN;
            var n = K.createHash("superfasthash");
            return parseInt(n.hash(e), 16) % t;
        }
        function P(e) {
            return e.which || e.charCode || e.keyCode || 0;
        }
        function A() {
            var e = new Date();
            return e.getHours() > 2 && e.setDate(e.getDate() + 1), e.setHours(3), e.setMinutes(Math.floor(60 * Math.random())), 
            e.getTime();
        }
        function I(e) {
            return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        }
        var M = e("babel-runtime/regenerator"), O = r(M), R = e("babel-runtime/helpers/toConsumableArray"), D = r(R), F = e("babel-runtime/helpers/defineProperty"), B = r(F), W = e("babel-runtime/core-js/object/assign"), U = r(W), G = e("babel-runtime/core-js/object/keys"), z = r(G), V = e("babel-runtime/core-js/promise"), H = r(V), q = function(e, t, n, r) {
            return new (n || (n = H["default"]))(function(o, i) {
                function a(e) {
                    try {
                        c(r.next(e));
                    } catch (t) {
                        i(t);
                    }
                }
                function s(e) {
                    try {
                        c(r["throw"](e));
                    } catch (t) {
                        i(t);
                    }
                }
                function c(e) {
                    e.done ? o(e.value) : new n(function(t) {
                        t(e.value);
                    }).then(a, s);
                }
                c((r = r.apply(e, t || [])).next());
            });
        };
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var Y = e("lodash"), K = e("non-crypto-hash"), X = e("./newConfig"), Q = e("./newConfig");
        n.isTestsMode = Q.isTestsMode, n.getBrowser = Q.getBrowser, n.isBg = Q.isBg, n.isBgOrPopup = Q.isBgOrPopup, 
        n.isSafariSettingsPopup = Q.isSafariSettingsPopup, n.isChrome = Q.isChrome, n.isFF = Q.isFF, 
        n.isPopup = Q.isPopup, n.isSafari = Q.isSafari, n.isSafari8 = Q.isSafari8, n.isWE = Q.isWE, 
        n.isWindows = Q.isWindows, n.isGrammarlyEmail = o, n.chromeBgError = i, n.isFunction = a, 
        n.interval = s, function(e) {
            e.items = {};
        }(s = n.interval || (n.interval = {})), n.cancelInterval = c, n.guid = u, n._f = d, 
        n._F = f, n.bgPageReload = p, n.isGmail = m, n.isValidEmail = h, n.formatNumber = g, 
        n.declension = b, n.stub = v, n.memoize = _, n.syncWait = y, n.promisify = w, n.getRandomIntInclusive = k, 
        n.delay = E;
        var J = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
        n.formatDate = C, n.createClass = x, n.versionComparator = j, n.isBgAlive = S, n.asyncCall = T, 
        n.createChannel = L, n.normalizedHashCode = N, n.keyCode = P, n.SECOND = 1e3, n.MINUTE = 60 * n.SECOND, 
        n.HOUR = 60 * n.MINUTE, n.DAY = 24 * n.HOUR, n.ESC_KEY = 27, n.ENTER_KEY = 13, n.pastDays = function(e) {
            return Math.round(Math.abs(+new Date() - +new Date(e)) / n.DAY);
        }, n.getNextPingDate = A, n.escapeRegExp = I;
    }, {
        "./newConfig": 259,
        "babel-runtime/core-js/object/assign": 20,
        "babel-runtime/core-js/object/keys": 25,
        "babel-runtime/core-js/promise": 28,
        "babel-runtime/helpers/defineProperty": 33,
        "babel-runtime/helpers/toConsumableArray": 38,
        "babel-runtime/regenerator": 42,
        lodash: "lodash",
        "non-crypto-hash": "non-crypto-hash"
    } ],
    289: [ function(e, t, n) {
        "use strict";
        function r(e) {
            return e && e.__esModule ? e : {
                "default": e
            };
        }
        function o(e, t, n, r) {
            var o = r ? t + "_forced" : t, i = {
                listeners: []
            }, a = function(e) {
                var t = i.listeners.indexOf(n);
                t > -1 && i.listeners.splice(t, 1);
            };
            if ("on" != e && "once" != e || (i = b[o] || (b[o] = {
                domEventListener: function(t) {
                    g.emit(o, t), "once" == e && a(n);
                },
                listeners: []
            }), i.domEventListener.__wrapFunc = i.domEventListener.__wrapFunc || function(e) {
                i.domEventListener((0, p["default"])({
                    originalEvent: e,
                    preventDefault: h._f,
                    stopPropagation: h._f
                }, e.detail));
            }, 0 == i.listeners.length && (window.addEventListener(t, i.domEventListener, r), 
            window.addEventListener(t + "-gr", i.domEventListener.__wrapFunc, r)), i.listeners.push(n)), 
            "un" == e) {
                var s = b[o];
                if (!s) return;
                a(n), 0 == s.listeners.length && (window.removeEventListener(t, s.domEventListener, r), 
                window.removeEventListener(t + "-gr", s.domEventListener.__wrapFunc, r));
            }
            g[e](o, n);
        }
        function i(e) {
            return function(t, n, r) {
                if ("object" == ("undefined" == typeof t ? "undefined" : (0, d["default"])(t))) {
                    var i = !0, a = !1, c = void 0;
                    try {
                        for (var u, f = (0, l["default"])((0, s["default"])(t)); !(i = (u = f.next()).done); i = !0) {
                            var p = u.value;
                            o(e, p, t[p], n);
                        }
                    } catch (m) {
                        a = !0, c = m;
                    } finally {
                        try {
                            !i && f["return"] && f["return"]();
                        } finally {
                            if (a) throw c;
                        }
                    }
                } else o(e, t, n, r);
            };
        }
        var a = e("babel-runtime/core-js/object/keys"), s = r(a), c = e("babel-runtime/core-js/get-iterator"), l = r(c), u = e("babel-runtime/helpers/typeof"), d = r(u), f = e("babel-runtime/core-js/object/assign"), p = r(f);
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var m = e("emitter"), h = e("./util"), g = m({}), b = {};
        n.on = i("on"), n.off = i("un"), n.once = i("one");
    }, {
        "./util": 288,
        "babel-runtime/core-js/get-iterator": 16,
        "babel-runtime/core-js/object/assign": 20,
        "babel-runtime/core-js/object/keys": 25,
        "babel-runtime/helpers/typeof": 39,
        emitter: "emitter"
    } ]
}, {}, [ 175 ]);