!function(){"use strict";function e(e){window.parent.postMessage({blackMenuOpenUrl:e},"*")}var t=new Promise(function(e){window.addEventListener("DOMContentLoaded",function(){e()})});window.addEventListener("message",function(t){var n=t.data,o=n.method;if("translateOpenInNew"===o){var a=document.getElementById("source"),s=document.querySelector(".go-button"),u=new MouseEvent("mousedown"),d=new MouseEvent("mouseup");s.dispatchEvent(u),s.dispatchEvent(d),a.focus();var c="https://translate.google.com/",i=location.href.split("authuser=")[1][0];"0"!==i&&(c+="?authuser="+i),setTimeout(function(){e(c+location.hash)},200)}}),window.addEventListener("message",function(e){t.then(function(){var t=document.getElementById("source");e.data.focus&&t.focus(),e.data.text&&(t.value=e.data.text)})})}();