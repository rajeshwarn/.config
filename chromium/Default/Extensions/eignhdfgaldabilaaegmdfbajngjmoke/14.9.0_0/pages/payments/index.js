cjModules.define(function(){"use strict";return function(e,n){var t=bmElements.createElement("pageheader",{pageId:"payments",floating:!0});e.appendChild(t);var a=cjBasics.urls.create("https://payments.google.com/payments/u/"+g.account.authuser+"/home",{bm_contentscript:"payments",bm_embed:"1",bm_toolbar_button_count:bmBasics.getMainToolbarButtonCount(),hl:g.lang},"subscriptionsAndServices"),s=bmElements.createElement("iframe",{src:a,noLoading:!0});e.appendChild(s),n.setOpenInNewHandler(function(){s.sendMessage({method:"paymentsOpenInNew"})})}});