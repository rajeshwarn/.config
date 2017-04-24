cjModules.define(function(){"use strict";return function(e,a){function t(){return g.cache.get("bm__cache__bookmarks__bookmarks").then(function(e){return e||{bookmarks:[],labels:[]}})}function n(e){var a=new Date(e),t=[a.getFullYear(),a.getMonth(),a.getDate()];return bmBasics.createDate(t)}function o(){var a=cjMaterial.createElement("appbar",{color:"#fbbc05",secondary:!0,light:!0}),t=cjMaterial.createElement("iconbutton",{iconName:"__mdi:menu",onClick:function(){m.open()}});a.appendChild(t),b=cjMaterial.createElement("title",{label:cjExtensions.i18n("cj_i18n_00008","All bookmarks")}),a.appendChild(b);var n=cjMaterial.createElement("fab",{label:cjExtensions.i18n("cj_i18n_00009","Add bookmark"),iconName:"__mdi:add",onClick:function(){bmBasics.openTab("https://www.google.com/bookmarks/mark?op=add&authuser="+g.account.authuser)}});e.appendChild(n);var o=cjMaterial.createElement("button",{label:cjExtensions.i18n("cj_i18n_00010","Manage labels"),onClick:function(){bmBasics.openTab("https://www.google.com/bookmarks/mark?op=editl&authuser="+g.account.authuser)}});return a.appendChild(o),a}function l(e){bmBasics.openTab("https://www.google.com/bookmarks/find?authuser="+g.account.authuser+"&q="+e)}function r(){return cjBasics.ajax({url:"https://www.google.com/bookmarks/lookup?start=0&num=1000000000&authuser="+g.account.authuser}).then(function(e){function a(e){l[e]||(l[e]={label:e,newTabUrl:cjBasics.urls.create("https://www.google.com/bookmarks/lookup",{authuser:g.account.authuser,q:'label:"'+e+'"'})})}var t=e.split('id="search">')[1].split('<div style="text-align: center;"')[0],n=document.createElement("div");n.innerHTML=t;for(var o=n.querySelectorAll('div[id] > span[id*="bkmk_view_"]'),l={_bm_all:{label:cjExtensions.i18n("cj_i18n_00008","All bookmarks"),newTabUrl:"https://www.google.com/bookmarks/?authuser="+g.account.authuser}},r=[],c=0;c<o.length;c++){var s=o[c],i=s.querySelector('[id*="bkmk_info_"]'),u=i?i.textContent:"",m=["_bm_all"];if(i)for(var b=i.querySelectorAll("span > a"),d=0;d<b.length;d++)m.push(b[d].textContent);else m.push("blackMenuForGoogleUnlabeled");m.forEach(a),r.push({url:cjBasics.urls.getParameters(s.querySelector('[id*="bkmk_href_"]').href).q,title:s.querySelector('[id*="bkmk_href_"]').textContent,timestamp:parseFloat(s.querySelector("script").textContent.split("_tsRender(")[1].split(",")[0]),labels:m,labelsText:u})}l.blackMenuForGoogleUnlabeled={label:cjExtensions.i18n("cj_i18n_00369","Unlabeled"),newTabUrl:cjBasics.urls.create("https://www.google.com/bookmarks/lookup",{authuser:g.account.authuser,q:"label:^none"})};var p={bookmarks:r,labels:l};return g.cache.set("bm__cache__bookmarks__bookmarks",p),p})}function c(e){var a=cjMaterial.createElement("item");a.addEventListener("click",function(){bmBasics.openTab(e.url)}),a.bookmarkLabels=e.labels;var t=cjMaterial.createElement("icon",{favicon:e.url});a.appendChild(t);var o=document.createElement("div");o.className="cj-md-item__body";var l=document.createElement("div");l.className="cj-md-item__header",l.textContent=e.title,o.appendChild(l);var r=document.createElement("div");r.className="cj-md-secondarytext";var c=[];if(e.labelsText&&c.push(e.labelsText),e.timestamp){var s=n(e.timestamp);c.push(cjExtensions.i18n("cj_i18n_00007","Added")+": "+s)}return r.textContent=c.join(" - "),o.appendChild(r),a.appendChild(o),a}function s(a,t){var n=a.bookmarks,o=a.labels;if(t||(m.tabs=bmElements.createElement("drawertabs",{items:o,selected:"_bm_all",onChange:function(e){b.textContent=o[e].label;for(var a=u.querySelectorAll(".cj-md-item"),t=0;t<a.length;t++){var n=a[t];n.classList.toggle("off-label",-1===n.bookmarkLabels.indexOf(e))}}}),m.appendChild(m.tabs)),u.textContent="",0===n.length){var l=cjMaterial.createElement("emptystate",{color:"#fbbc05",label:cjExtensions.i18n("cj_i18n_00370","No bookmarks found"),subLabel:cjExtensions.i18n("cj_i18n_00371","To add a bookmark, click the add button at the bottom"),iconName:"__mdi:star"});u.appendChild(l)}else n.forEach(function(e){var a=c(e);u.appendChild(a)});t||bmBasics.toggleLoading("off",e)}function i(){bmBasics.toggleLoading("on",e),m=cjMaterial.createElement("drawer",{color:"#e28f03"});var n=bmElements.createElement("servicelogo",{label:cjExtensions.i18n("cj_i18n_00190","Bookmarks"),color:"#e28f03"});m.appendChild(n);var c=bmElements.createElement("pageheader",{color:"#fbbc05",pageId:"bookmarks",light:!0,searchboxProperties:{onSubmit:l,submitInNewTab:!0}}),i=o(),b=cjMaterial.createElement("container",{scrollable:!0,shadow:!0});u=cjMaterial.createElement("list"),b.appendChild(u),e.appendChild(m),e.appendChild(c),d(c.searchbox.select),e.appendChild(i),e.appendChild(b),t().then(function(e){s(e,!0)}),r().then(s),a.setOpenInNewHandler(function(){var e=null,a=m.tabs.selected;"_bm_all"!==a&&(e="label:"+a),"blackMenuForGoogleUnlabeled"===a&&(e="label:^none");var t=cjBasics.urls.create("https://www.google.com/bookmarks/lookup",{authuser:g.account.authuser,q:e});bmBasics.openTab(t)})}var u,m,b,d=a.onPageDisplay;i()}});