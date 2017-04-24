cjModules.define(function(){"use strict";return function(e,n){function t(e){return{id:e,label:E[e]}}function a(e,n){return cjBasics.urls.create("https://www.google.com/search",{authuser:g.account.authuser,q:e,tbm:"all"===n?null:n,hl:g.lang})}function s(e,n){return cjBasics.urls.create("https://www.google.com/search",{bm_contentscript:"search",bm_mobile:"1",bm_embed:cjBasics.isFirefox?null:"1",igu:cjBasics.isFirefox?"1":null,authuser:g.account.authuser,q:e,tbm:"all"===n?null:n,fg:"1",gws_rd:"cr",hl:g.lang})}function c(n,t){p.searchmenu.hide(),n&&n.length>0?(h.style.display="",b.style.display="none",bmBasics.toggleLoading("on",e),h.src=s(n,t)):(b.style.display="",h.style.display="none",h.src="")}function i(e,n){bmBasics.openTab(a(e,n))}function r(e){return cjBasics.ajax({dataType:"JSON",url:cjBasics.urls.create("https://www.google.com/complete/search",{client:"serp",authuser:g.account.authuser,xhr:"t",q:e,ds:_[m.selected],hl:g.lang})})}function l(e){var n=Date.now();r(e).then(function(e){if(!(j>n)){j=n,f.textContent="";var t=e[1];if(t.length>0){for(var a=0;a<t.length;a++){var s,c=t[a],i=c[0],r=c[3];r&&r.b&&r.c?(i+="– "+r.b,s=r.c):s=i.split("<b>").join("").split("</b>").join("");var l=cjMaterial.createElement("item");l.dataset.value=s,l.innerHTML=i,f.appendChild(l)}p.searchmenu.show()}else p.searchmenu.hide()}})}function o(){return bmElements.createElement("pageheader",{color:"#4285f4",pageId:"search",includeSearchMenu:!0,searchboxProperties:{onInput:l,onClear:function(){p.searchmenu.hide()},onSubmit:function(e){c(e,m.selected)},onSubmitAlt:function(e){i(e,m.selected)}}})}function d(){var e=cjMaterial.createElement("appbar",{color:"#4285f4",secondary:!0});m=cjMaterial.createElement("tabs",{fill:!0,items:w,onActiveClick:function(e){i(p.searchbox.value,e)},onChange:function(e){c(p.searchbox.value,e)},selected:"all"});var n=bmElements.createElement("dropdown",{onChange:function(e){var t=n.querySelector("[data-id='"+e+"']"),a=m.querySelector(":scope > :nth-child(4)"),s=a.dataset.id;t.dataset.id=s,t.textContent=E[s],a.dataset.id=e,a.textContent=E[e],m.selected=e,c(p.searchbox.value,e),n.classList.remove("on")},items:x}),t=document.createElement("div");t.className="cj-md-tabs__item dropdown-button",t.addEventListener("click",function(e){n.classList.add("on"),e.stopPropagation()}),document.body.addEventListener("click",function(){n.classList.remove("on")}),n.addEventListener("click",function(e){e.stopPropagation()});var a=document.createTextNode(cjExtensions.i18n("cj_i18n_00047","More"));return t.appendChild(a),t.appendChild(n),m.appendChild(t),e.appendChild(m),e}function u(){p=o(),e.appendChild(p),f=cjMaterial.createElement("list"),f.classList.add("bm-ele-autocomplete"),f.addEventListener("click",function(e){var n=e.target.dataset.value;p.searchbox.value=n,p.searchmenu.hide(),c(n,m.selected)}),p.searchmenu.appendChild(f);var n=d();e.appendChild(n);var t=cjMaterial.createElement("container",{shadow:!0});b=cjMaterial.createElement("emptystate",{color:"#4285f4",iconName:"__mdi:search",subLabel:cjExtensions.i18n("cj_i18n_00046","Please enter a search query")}),t.appendChild(b),h=bmElements.createElement("iframe",{noLoading:!0}),h.setAttribute("style","display: none;"),h.iframeElement.addEventListener("load",function(){bmBasics.toggleLoading("off",e)}),t.appendChild(h),e.appendChild(t),v(p.searchbox.select),window.addEventListener("message",function(e){var n=e.data.searchOpenUrl;n&&bmBasics.openTab(n)})}var h,p,m,b,f,v=n.onPageDisplay,j=0,E={all:cjExtensions.i18n("cj_i18n_00083","All"),isch:cjExtensions.i18n("cj_i18n_00017","Images"),bks:cjExtensions.i18n("cj_i18n_00019","Books"),shop:cjExtensions.i18n("cj_i18n_00015","Shopping"),vid:cjExtensions.i18n("cj_i18n_00014","Videos"),nws:cjExtensions.i18n("cj_i18n_00018","News"),pts:cjExtensions.i18n("cj_i18n_00016","Patents")},_={isch:"i",bks:"bo",shop:"sh",vid:"yt",nws:"n"};n.setOpenInNewHandler(function(){var e,n=h.src;if(n.startsWith("https://")){var t=new URL(n);e=t.origin+t.pathname;var a=t.search.replace("?","").split("&").filter(function(e){return!e.startsWith("bm_")}).join("&");a.length>2&&(e+="?"+a);var s=t.hash;s.startsWith("#")&&(s=s.replace("#","")),s.length>1&&(e+="#"+s)}else{var c=m.selected;e=cjBasics.urls.create("https://www.google.com/search",{authuser:g.account.authuser,tbm:"all"===c?null:c,fg:"1",gws_rd:"cr",hl:g.lang})}bmBasics.openTab(e)});var w=["all","isch","bks"].map(t),x=["shop","vid","nws","pts"].map(t);u()}});