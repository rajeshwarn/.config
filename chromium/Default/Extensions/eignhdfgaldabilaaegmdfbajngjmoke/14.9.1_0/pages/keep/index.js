cjModules.define(function(){"use strict";return function(e,t){function n(t){if(s===!1){var n=bmElements.createElement("fulldialog",{serviceLogo:{label:cjExtensions.i18n("cj_i18n_00422","Keep")},iconName:"keep",message:t.message,actionLabel:t.actionLabel,action:t.action});e.appendChild(n)}}function a(){n({message:cjExtensions.i18n("cj_i18n_00378","You need to grand additional permissions for this page to function correctly"),actionLabel:cjExtensions.i18n("cj_i18n_00224","Give permission"),action:function(){g.auth.requestPermission(i)}})}function o(){var n=bmElements.createElement("pageheader",{pageId:"keep",light:!0,floating:!0});e.appendChild(n);var o=g.auth.getAccessToken(i);o["catch"](a),g.auth.getAccessToken(i).then(function(){var a=bmElements.createElement("iframe",{src:cjBasics.urls.create("/pages/keep/keep.html",{bm_toolbar_button_count:bmBasics.getMainToolbarButtonCount(),userId:g.account.userid,key:g.key,hl:g.lang,email:g.account.email,authuser:g.account.authuser,clientId:g.clientId})});a.iframeElement.addEventListener("load",function(){o.then(function(e){a.sendMessage({requestId:"keep-api-token",value:e})})}),t.setOpenInNewHandler(function(){a.sendMessage({method:"keepOpenInNew"})}),e.appendChild(a),window.addEventListener("message",function(e){var t=e.data.keepDarkMode;(t===!1||t===!0)&&n.classList.toggle("cj-md--dark",t)})},a)}var i=["https://www.googleapis.com/auth/memento","https://www.googleapis.com/auth/client_channel","https://www.googleapis.com/auth/drive","https://www.googleapis.com/auth/plus.peopleapi.readwrite","https://www.googleapis.com/auth/reminders","https://www.googleapis.com/auth/offers.lmp"],s=!1;o()}});