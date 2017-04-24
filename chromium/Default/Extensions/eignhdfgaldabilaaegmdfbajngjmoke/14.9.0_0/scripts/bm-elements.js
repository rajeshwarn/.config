!function(){"use strict";function e(e){var t=document.createElement("div");t.className="bm-ele-servicelogo";var n="google_logo ";null!==e.labelPrefix&&"undefined"!=typeof e.labelPrefix&&(n=e.labelPrefix);var a;return e.label&&(e.color?(a=document.createElement("span"),a.style.color=e.color,a.textContent=e.label):n+=e.label),t.textContent=n,a&&t.appendChild(a),t}function t(){var e=cjMaterial.createElement("button",{label:"Sign in",raised:!0,onClick:g.accounts.add});return e.classList.add("bm-ele-signin"),e}function n(e){return cjMaterial.createElement("iconbutton",{iconName:"__mdi:open_in_new",label:cjExtensions.i18n("cj_i18n_00084","Open service in new tab"),onClick:function(){var t=bmRuntime.servicePageData[e];if(t.openInNewCallback)t.openInNewCallback();else{var n=t.url.replace("[authuser]",g.account.authuser).replace("[pageid]",g.account.pageid);bmBasics.openTab(n)}}})}function a(e,t){var n=!0,a=bmRuntime.servicePageData[e].body;a&&a.classList.contains("on")&&(n=!1),bmRuntime.changeToPage(e),n&&t.stopPropagation()}function i(){return cjMaterial.createElement("iconbutton",{label:g.account.name+"\n"+("none"===g.account.pageid?g.account.email:"Brand Account"),icon:{size:32,circle:!0,url:g.account.photo+"?sz="+(cjBasics.isRetina?"64":"32")},onClick:function(e){a("account",e)}})}function c(e){var c=document.createDocumentFragment();if(e&&(bmRuntime.portalOnSide||bmRuntime.runningInExtensionPopup)&&(bmRuntime.servicePageData[e].openInNewCallback||bmRuntime.servicePageData[e].url)){var o=n(e);c.appendChild(o)}if(!bmRuntime.portalOnSide&&bmRuntime.servicePageData.portal){var r=cjMaterial.createElement("iconbutton",{iconName:"__mdi:apps",onClick:function(e){a("portal",e)}});c.appendChild(r)}if(!bmRuntime.portalOnSide)if(g.signedIn){if(bmRuntime.servicePageData.notifications){var l=cjMaterial.createElement("iconbutton",{iconName:"__mdi:cj_notifications_circle",onClick:function(e){a("notifications",e)}});c.appendChild(l),g.getNotificationsCount().then(function(e){e&&(l.dataset.count=e)})}var s=i();c.appendChild(s)}else{var d=t();c.appendChild(d)}return c}function o(){var e=document.createElement("div");return e.toggle=function(t){return t===!0?void e.show():t===!1?void e.hide():void e.classList.toggle("on")},e.hide=function(){e.classList.remove("on")},e.show=function(){e.classList.add("on")},e.className="searchbox-menu popup",e}function r(e){return e.label=e.label||e.submitInNewTab?cjExtensions.i18n("cj_i18n_00086","Search in new tab"):cjExtensions.i18n("cj_i18n_00085","Search"),cjMaterial.createElement("searchbox",e)}function l(e){var t=cjMaterial.createElement("appbar",{floating:e.floating,light:e.light,color:e.color});if(e.pageTitle){var n=cjMaterial.createElement("title",{label:e.pageTitle});t.appendChild(n)}e.searchboxProperties&&(t.searchbox=r(e.searchboxProperties),t.appendChild(t.searchbox),e.includeSearchMenu&&(t.searchmenu=o(),t.searchbox.insertBefore(t.searchmenu,t.searchbox.querySelector(".cj-md-button")),document.body.addEventListener("click",function(){t.searchmenu.classList.remove("on")}),t.searchbox.addEventListener("click",function(e){e.stopPropagation()}),t.searchmenu.addEventListener("click",function(e){e.stopPropagation()})));var a=c(e.pageId);return t.appendChild(a),t}function s(t){var n=document.createElement("div");n.className="bm-ele-fulldialog";var a=l({floating:!0,light:!0});n.appendChild(a);var i=cjMaterial.createElement("icon",{serviceName:t.iconName,svgSize:48,size:96});n.appendChild(i);var c=e(t.serviceLogo);n.appendChild(c);var o=document.createElement("div");o.className="bm-ele-fulldialog__message",o.innerHTML=t.message,n.appendChild(o);var r=cjMaterial.createElement("button",{raised:!0,onClick:t.action,label:t.actionLabel});return n.appendChild(r),n}function d(e){var t=document.createElement("div");return t.className="dropdown popup",cjBasics.makeSelector(t,function(t){e.onChange&&e.onChange(t)}),t.open=function(){t.classList.add("on")},t.close=function(){t.classList.remove("on")},t.addEventListener("click",function(e){var n=e.target.dataset.id;n&&(t.selected=n)}),e.items&&e.items.forEach(function(n){var a=cjMaterial.createElement("item");n.onClick&&a.addEventListener("click",function(e){n.onClick(e.target)}),"undefined"!=typeof n.id&&(a.dataset.id=n.id),n.id&&n.id===e.selected&&a.classList.add("selected"),a.textContent=n.label,t.appendChild(a)}),document.body.addEventListener("click",function(){t.close()}),t.addEventListener("click",function(e){e.stopPropagation()}),t}function u(e){function t(){bmBasics.toggleLoading("off",n),c.removeEventListener("load",t)}var n=cjMaterial.createElement("container",{shadow:e.shadow,darker:e.darker}),a=e.src||"about:blank",i=e.hash||a.split("#")[1]||"",c=document.createElement("iframe");return c.src=a,Object.defineProperties(n,{src:{get:function(){return c.src},set:function(e){c.src=e,e.split("#")[1]&&(n.hash=e.split("#")[1])}},hash:{get:function(){return i},set:function(e){var t=n.src.split("#")[0]+"#"+(e?e.replace("#",""):"");c.src=t,i=e}},sendMessage:{value:function(e,t){c.contentWindow.postMessage(e,t||n.src)}},reload:{value:function(){var e=c.src;c.src="about:blank",setTimeout(function(){c.src=e})}},iframeElement:{value:c}}),e.noLoading||(bmBasics.toggleLoading("on",n),c.addEventListener("load",t)),n.src=e.src||"about:blank",n.appendChild(c),n}function m(e){function t(e){var t=n.items[e];if(!t.loaded){t.loaded=!0;var i=t.content?t.content():cjMaterial.createElement("container",{scrollable:!0,shadow:!0});a.addPage(e,i),t.afterLoad&&t.afterLoad(a.pages[e])}}var n=e||{items:{}},a=cjMaterial.createElement("container",{darker:n.darker});if(a.classList.add("multiple-container"),cjBasics.makeSelector(a,function(e){n.onChange&&n.onChange(e),t(e)}),a.pages={},a.addPage=function(e,t){a.pages[e]=t||cjMaterial.createElement("container",{scrollable:!0,shadow:!0}),a.pages[e].dataset.id=e,a.appendChild(a.pages[e]),a.selected||(a.selected=e)},a.loadPage=t,n.items)for(var i in n.items)n.items[i].loadOnInit&&a.loadPage(i);return a.selected=n.selected||Object.keys(n.items)[0],a}function p(e){var t=cjMaterial.createElement("item");if(e.id&&(t.dataset.id=e.id),e.tooltip&&(t.title=e.tooltip),e.icon||e.iconName){var n=e.iconName||e.icon.name||"placeholder",a=cjMaterial.createElement("icon",{serviceName:n});t.appendChild(a)}if(e.label){var i=document.createElement("div");i.className="cj-md-item__body",i.textContent=e.label,t.appendChild(i)}return e.searchUrl&&(t.dataset.search=e.searchUrl),e.linkUrl&&(t.dataset.link=e.linkUrl),t}function f(e){var t=document.createElement("ul");return t.className="bm-ele-shortcutlist",e.items.forEach(function(n){n.svgIcon=e.svgIcon,t.appendChild(p(n))}),e.withBorders&&t.classList.add("bm-ele-shortcutlist--with-borders"),t.addEventListener("click",function(n){var a=n.target;if(a.parentNode===t){var i=Array.prototype.indexOf.call(t.children,a);if(e.items[i].onClick)return void e.items[i].onClick();if(e.onClick)return void e.onClick(a);var c=a.dataset.search&&e.searchbox&&e.searchbox.value,o=c?a.dataset.search.replace("[query]",encodeURIComponent(c)):a.dataset.link;bmBasics.openTab(o)}}),t}function b(e){function t(e){if(e.subHeader)return void a.appendChild(cjMaterial.createElement("subheader",{label:e.subHeader}));var t=cjMaterial.createElement("item",e);if(e.onClick&&t.addEventListener("click",e.onClick),e.id&&(n[e.id]=e,t.dataset.id=e.id),e.color&&(t.style.color=e.color),e.colorIcon&&t.classList.add("cj-md-item--color-icon"),e.newTabUrl){var i=cjMaterial.createElement("iconbutton",{iconName:"__mdi:open_in_new",label:"Open in a new tab",onClick:function(){bmBasics.openTab(e.newTabUrl)}});e.external!==!0&&i.classList.add("open-in-new"),t.appendChild(i)}a.appendChild(t)}var n={},a=cjMaterial.createElement("list");cjBasics.makeSelector(a),a.addEventListener("click",function(t){var i=t.target;if(i.classList.contains("cj-md-item")){var c=a.selected,o=i.dataset.id;o!==c?(a.selected=o,e.onChange(o,n[o])):e.onActiveClick(o,n[o])}});var i=[];return Array.isArray(e.items)?i=e.items:Object.keys(e.items).forEach(function(t){e.items[t].id=t,i.push(e.items[t])}),i.forEach(t),e.selected&&(a.selected=e.selected),a}var v={drawertabs:b,servicelogo:e,searchbox:r,fulldialog:s,dropdown:d,pageheader:l,maintoolbarbuttons:c,shortcutlist:f,multiplecontainer:m,accountbutton:i,iframe:u,signinbutton:t};window.bmElements={createElement:function(e,t){return v[e](t||{})}}}();