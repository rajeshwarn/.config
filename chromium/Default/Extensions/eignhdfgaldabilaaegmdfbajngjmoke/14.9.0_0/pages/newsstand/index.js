cjModules.define(function(){"use strict";return function(e,n){function a(e,n){var a=e||"",t=n||{};return t.authuser=g.account.authuser,t.hl=g.lang,cjBasics.urls.create(j+a,t)}function t(e){return cjBasics.ajax({url:a("api/"+e)}).then(function(e){var n=JSON.parse(e.replace(")]}',",""));return n.data.items||[]})}function i(e){var n=cjMaterial.createElement("griditem");n.addEventListener("click",function(){var n="publications/";"TOPIC"===e.kind&&(n="topics/");var t=a(n+e.id);bmBasics.openTab(t)});var t=document.createElement("div");t.className="newsstanditem__thumbnail";var i;i="PUBLICATION/NEWS/FEED"===e.kind?a("media/icon.rss.gray.360x360.png"):e.icon&&e.icon.image.url,i&&(t.style.backgroundImage='url("'+i+'")'),"TOPIC"===e.kind&&(t.style.backgroundColor=e.theme.background),n.appendChild(t);var r=document.createElement("div");r.className="cj-md-grid__item__bottom",n.appendChild(r);var c=document.createElement("div");c.className="cj-md-grid__item__textcontainer",r.appendChild(c);var l=document.createElement("div");return l.textContent=e.title,c.appendChild(l),n}function r(e){if(0===e.length)return cjMaterial.createElement("emptystate",{color:C,label:cjExtensions.i18n("cj_i18n_00135","No library items found"),iconName:"__mdi:news"});for(var n=document.createDocumentFragment(),a=0;a<e.length;a++){var t=i(e[a]);n.appendChild(t)}return n}function c(){bmBasics.toggleLoading("on",e),b.textContent="";var n=cjMaterial.createElement("gridcontainer");b.appendChild(n);var a="";g.cache.get("bm__cache__newsstand__library").then(function(e){if(Array.isArray(e)){a=JSON.stringify(e);var t=r(e);n.appendChild(t)}}),t("library/subscriptions").then(function(t){if(bmBasics.toggleLoading("off",e),JSON.stringify(t)!==a){n.textContent="",g.cache.set("bm__cache__newsstand__library",t);var i=r(t);n.appendChild(i)}})}function l(e){var n=cjMaterial.createElement("griditem");n.addEventListener("click",function(){var n="publications/";"TOPIC"===e.kind&&(n="topics/");var t=a(n+e.id);bmBasics.openTab(t)});var t=document.createElement("div");t.className="newsstanditem__thumbnail newsstanditem__thumbnail--tall",t.style.backgroundImage='url("'+e.image.url+'")',"TOPIC"===e.kind&&(t.style.backgroundColor=e.theme.background),n.appendChild(t);var i=document.createElement("div");i.className="cj-md-grid__item__bottom",n.appendChild(i);var r=document.createElement("div");r.className="cj-md-grid__item__textcontainer",i.appendChild(r);var c=document.createElement("div");c.textContent=e.magazineTitle.title,r.appendChild(c);var l=document.createElement("div");return l.className="cj-md-secondarytext",l.textContent=e.title,r.appendChild(l),n}function o(e){if(0===e.length)return cjMaterial.createElement("emptystate",{color:C,label:cjExtensions.i18n("cj_i18n_00130","No magazines items found"),iconName:"__mdi:auto_stories"});for(var n=document.createDocumentFragment(),a=0;a<e.length;a++){var t=l(e[a]);n.appendChild(t)}return n}function s(){bmBasics.toggleLoading("on",e),b.textContent="";var n=cjMaterial.createElement("gridcontainer");b.appendChild(n);var a="";g.cache.get("bm__cache__newsstand__magazines").then(function(e){if(Array.isArray(e)){a=JSON.stringify(e);var t=o(e);n.appendChild(t)}}),t("library/magazines").then(function(t){if(bmBasics.toggleLoading("off",e),JSON.stringify(t)!==a){n.textContent="",g.cache.set("bm__cache__newsstand__magazines",t);var i=o(t);n.appendChild(i)}})}function d(e){var n=a("search",{"for":e});bmBasics.openTab(n)}function m(){"library"===E?c():s()}function u(){var e=cjMaterial.createElement("appbar",{color:"#fff",secondary:!0,light:!0}),n=cjMaterial.createElement("iconbutton",{iconName:"__mdi:menu",onClick:function(){h.open()}});return e.appendChild(n),f=cjMaterial.createElement("title",{label:y[E].label}),e.appendChild(f),e}function p(){var e=cjMaterial.createElement("drawer",{color:C}),n=bmElements.createElement("servicelogo",{labelPrefix:"google_logo Play ",label:cjExtensions.i18n("cj_i18n_00136","Newsstand"),color:C});e.appendChild(n);var a=bmElements.createElement("drawertabs",{items:y,onChange:function(e,n){n.external?bmBasics.openTab(n.newTabUrl):(E=e,f.textContent=y[E].label,m())},selected:"library"});return e.appendChild(a),e}function _(){var a=bmElements.createElement("pageheader",{color:"#fff",light:!0,pageId:"newsstand",searchboxProperties:{onSubmit:d,submitInNewTab:!0}});e.appendChild(a),v(a.searchbox.select);var t=u();e.appendChild(t),b=cjMaterial.createElement("container",{scrollable:!0,shadow:!0}),e.appendChild(b),m(),h=p(),e.appendChild(h),n.setOpenInNewHandler(function(){var e=y[E].newTabUrl;bmBasics.openTab(e)})}var b,h,f,v=n.onPageDisplay,C="#9c27b0",E="library",j="https://newsstand.google.com/",y={library:{label:cjExtensions.i18n("cj_i18n_00131","Library"),iconName:"__mdi:view_module",newTabUrl:a("my/library")},magazines:{label:cjExtensions.i18n("cj_i18n_00132","Magazines"),iconName:"__mdi:auto_stories",newTabUrl:a("my/magazines")},bookmarks:{label:cjExtensions.i18n("cj_i18n_00133","Read later"),iconName:"__mdi:bookmark",newTabUrl:a("my/bookmarks"),external:!0},shop:{label:cjExtensions.i18n("cj_i18n_00134","Shop"),iconName:"__mdi:shop",newTabUrl:"https://play.google.com/store/newsstand?authuser="+g.account.authuser,external:!0}};_()}});