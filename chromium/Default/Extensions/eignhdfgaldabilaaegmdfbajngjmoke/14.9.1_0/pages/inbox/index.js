cjModules.define(function(){"use strict";return function(e,n){function a(n){for(var a=e.querySelectorAll(".cj-md-appbar"),i=0;i<a.length;i++)a[i].style.backgroundColor=n}function i(e,n){return e.sort===n.sort?e.label<n.label?-1:1:e.sort<n.sort?-1:1}function t(e){w.src=M.split("#")[0]+"#"+e.replace("#","")}function o(e){t("cv/back/"+e),a("#4285f4"),j.selected="iframe"}function r(){t("co"),a("#4285f4"),j.selected="iframe"}function c(e){return g.cache.get("bm__cache__inbox__"+e).then(function(e){return e||""})}function l(e){var n="";return"string"==typeof e&&"inbox"!==e&&(n=e),cjBasics.ajax({url:C+n+"?hl="+g.lang}).then(function(n){var a=document.createElement("div");a.innerHTML=n;try{var i=a.querySelector('[id][jsaction*="empty_space"] > div > div > div > div:last-child[aria-multiselectable] > div').innerHTML;return i=cjBasics.replaceAll(i,'"//',"https://"),g.cache.set("bm__cache__inbox__"+e,i),i}catch(t){return Error("Couldn't fetch inbox data")}})}function s(e){x.innerHTML=e}function _(n){c(n).then(s),l(n).then(s).then(function(){bmBasics.toggleLoading("off",e)})}function m(){var n=cjMaterial.createElement("drawer");bmBasics.toggleLoading("on",n);var t=bmElements.createElement("servicelogo",{label:cjExtensions.i18n("cj_i18n_00421","Inbox"),color:"#4285f4"});return n.appendChild(t),P.then(function(t){if(-1!==t.indexOf('],\\"clusters\\":[')){var o="["+t.split('],\\"clusters\\":[')[1].split('],\\"contacts\\"')[0]+"]";o=cjBasics.replaceAll(o,'\\"','"'),o=JSON.parse(o);var r=[],c=[],l=!1;if(o.forEach(function(e){var n;if(e.b.startsWith("^to_i_tr_")){if(A.push(e),l)return;l=!0,n=k}else{var a=e.b.replace("^","");n=H[a]||{id:a,newTabUrl:B+a,iconName:"__mdi:cj_bigtop_bundle",label:e.c[2],order:0}}0===e.c[7]?r.push(n):c.push(n)}),l===!1){var s;r.forEach(function(e,n){"sv_i"===e.id&&(s=n)}),r.splice(s,0,k)}if(r.length>0&&(r.sort(i),O.push({subHeader:cjExtensions.i18n("cj_i18n_00319","Bundled in the inbox")}),O=O.concat(r)),c.length>0){c.sort(i);var m=O.length-1;O[m].divider=!0,O.push({subHeader:cjExtensions.i18n("cj_i18n_00318","Unbundled")}),O=O.concat(c)}}else O=O.filter(function(e){return e.bigtopOnly!==!0}),D.forEach(function(e){O.push(H[e])});T=bmElements.createElement("drawertabs",{items:O,onChange:function(n,i){v.textContent=i.label,N=i.color||"#898984",a(N),bmBasics.toggleLoading("on",e),_(i.newTabUrl.replace(C,""))},selected:"inbox"}),n.appendChild(T),bmBasics.toggleLoading("off",n)}),n}function d(){var n=cjMaterial.createElement("appbar",{color:"#4285f4",secondary:!0}),a=cjMaterial.createElement("iconbutton",{iconName:"__mdi:menu",onClick:function(){E.open()}});n.appendChild(a),v=cjMaterial.createElement("title",{label:cjExtensions.i18n("cj_i18n_00421","Inbox")}),n.appendChild(v);var i=cjMaterial.createElement("iconbutton",{iconName:"__mdi:refresh",onClick:function(){bmBasics.toggleLoading("on",e),_(T.selected)}});return n.appendChild(i),n}function b(){var e=cjMaterial.createElement("container"),n=d();e.appendChild(n),x=cjMaterial.createElement("container",{scrollable:!0,shadow:!0,darker:!0}),x.classList.add("inbox-container"),e.appendChild(x);var a=cjMaterial.createElement("fab",{label:cjExtensions.i18n("cj_i18n_00317","Compose"),iconName:"__mdi:create",onClick:r});return e.appendChild(a),e}function u(e){if(!e)return null;var n=e.dataset&&e.dataset.actionData;return n&&-1!==n.indexOf("#thread-f:")?n.split("#thread-f:")[1].split('"')[0]:u(e.parentNode)}function p(e){var n=u(e);return null===n?null:cjBasics.convertBase(n,10,16)}function f(e){return e?e.dataset.itemId?"cluster/%23clusters:^smartlabel_"+e.dataset.itemId.split("#clusters:^smartlabel_")[1]:f(e.parentNode):null}function h(){bmBasics.toggleLoading("on",e),window.addEventListener("message",function(e){if(e.data.inboxPageUrl)return void(M=e.data.inboxPageUrl);var n=e.data.inboxPageChange;if(n){var i=n.replace("#","");(i.startsWith("mn")||i.startsWith("tl"))&&(a(N),j.selected="threadlist")}}),y={threadlist:{content:b},iframe:{loadOnInit:!0,content:function(){return w=bmElements.createElement("iframe",{src:M})}}};var i=bmElements.createElement("pageheader",{color:"#4285f4",pageId:"inbox",searchboxProperties:{onSubmit:function(e){var n="https://inbox.google.com/search/"+e+"?authuser="+g.account.authuser;bmBasics.openTab(n)},submitInNewTab:!0}}),t=i.searchbox;E=m(),j=bmElements.createElement("multiplecontainer",{items:y,selected:"threadlist"}),j.pages.threadlist.addEventListener("click",function(n){var a=n.target,i=p(a);if(i)o(i);else{var t=f(a);t&&(bmBasics.toggleLoading("on",e),T.selected=t,_(t))}}),e.appendChild(i),U(t.select),e.appendChild(j),e.appendChild(E),_(),n.setOpenInNewHandler(function(){var e=!1,n=T&&T.selected||"inbox";O.forEach(function(a){a.id===n&&(bmBasics.openTab(a.newTabUrl),e=!0)}),e||bmBasics.openTab(C)})}var j,x,E,v,T,w,N,y,U=n.onPageDisplay,I="https://mail.google.com/mail/u/"+g.account.authuser+"/",C="https://inbox.google.com/u/"+g.account.authuser+"/",B=C+"cluster/%23clusters:^",M=cjBasics.urls.create("https://mail.google.com/mail/mu/mp/",{mui:"bm_mail_inbox",hl:g.lang,bm_id:g.account.authuser+"-"+g.account.userid,authuser:g.account.authuser},"#mn"),P=cjBasics.ajax({url:C+"snoozed?hl="+g.lang}),L=[],S={};!function(){function e(e,n){S[e]={label:n,items:[]},L.push(e)}var n=new Date,a=[cjExtensions.i18n("cj_i18n_00165","January"),cjExtensions.i18n("cj_i18n_00166","February"),cjExtensions.i18n("cj_i18n_00167","March"),cjExtensions.i18n("cj_i18n_00168","April"),cjExtensions.i18n("cj_i18n_00169","May"),cjExtensions.i18n("cj_i18n_00170","June"),cjExtensions.i18n("cj_i18n_00171","July"),cjExtensions.i18n("cj_i18n_00172","August"),cjExtensions.i18n("cj_i18n_00173","September"),cjExtensions.i18n("cj_i18n_00174","October"),cjExtensions.i18n("cj_i18n_00175","November"),cjExtensions.i18n("cj_i18n_00176","December")],i=1e3,t=60*i,o=60*t,r=24*o,c=n.getTime()-n.getHours()*o-n.getMinutes()*t-n.getSeconds()*i-n.getMilliseconds();e(c,"Today");var l=c-864e5;e(l,"Yesterday");var s=l-n.getDay()*r;e(s,"This month");for(var _=n.getMonth()-1,m=new Date(s);_>-1;)m.setMonth(_-1),e(m.getTime(),a[_]),_--;e(0,"Older")}();var O=[{id:"inbox",label:cjExtensions.i18n("cj_i18n_00299","Inbox"),iconName:"__mdi:inbox",newTabUrl:C,color:"#4285f4",colorIcon:!0},{id:"snoozed",label:cjExtensions.i18n("cj_i18n_00300","Snoozed"),iconName:"__mdi:schedule",newTabUrl:C+"snoozed",bigtopOnly:!0,color:"#ef6c00",colorIcon:!0},{id:"done",label:cjExtensions.i18n("cj_i18n_00301","Done"),iconName:"__mdi:bigtop_done",newTabUrl:C+"done",color:"#34a853",divider:!0,colorIcon:!0},{id:"drafts",label:cjExtensions.i18n("cj_i18n_00187","Drafts"),iconName:"__mdi:drafts",newTabUrl:C+"drafts"},{id:"sent",label:cjExtensions.i18n("cj_i18n_00303","Sent"),iconName:"__mdi:send",newTabUrl:C+"sent"},{id:"reminders",label:cjExtensions.i18n("cj_i18n_00304","Reminders"),iconName:"__mdi:reminders_alt",bigtopOnly:!0,newTabUrl:C+"reminders"},{id:"trash",label:cjExtensions.i18n("cj_i18n_00005","Trash"),iconName:"__mdi:delete",newTabUrl:C+"trash"},{id:"spam",label:cjExtensions.i18n("cj_i18n_00306","Spam"),iconName:"__mdi:report",newTabUrl:C+"spam",divider:!0}],k={id:"trips",label:cjExtensions.i18n("cj_i18n_00307","Trips"),iconName:"__mdi:travel",newTabUrl:C+"trips",color:"#9c27b0",sort:1,colorIcon:!0},A=[],D=["smartlabel_travel","smartlabel_receipt","smartlabel_finance","smartlabel_social","smartlabel_pure_notif","smartlabel_group","smartlabel_promo"],H={smartlabel_travel:{id:"smartlabel_travel",label:cjExtensions.i18n("cj_i18n_00308","Travel"),iconName:"travel",newTabUrl:B+"smartlabel_travel",gmailPath:I+"#search/category%3Atravel",color:"#9c27b0",colorIcon:!0,sort:1},sv_i:{id:"sv_i",label:cjExtensions.i18n("cj_i18n_00309","Saved"),iconName:"__mdi:bookmark",newTabUrl:B+"sv_i",color:"#4285f4",colorIcon:!0,sort:2},smartlabel_receipt:{id:"smartlabel_receipt",label:cjExtensions.i18n("cj_i18n_00310","Purchases"),iconName:"__mdi:shopping_cart",newTabUrl:B+"smartlabel_receipt",gmailPath:I+"#search/category%3Apurchases",color:"#795548",colorIcon:!0,sort:3},smartlabel_finance:{id:"smartlabel_finance",label:cjExtensions.i18n("cj_i18n_00311","Finance"),iconName:"__mdi:trending_up",newTabUrl:B+"smartlabel_finance",gmailPath:I+"#search/category%3Afinance",color:"#689f38",colorIcon:!0,sort:4},smartlabel_social:{id:"smartlabel_social",label:cjExtensions.i18n("cj_i18n_00312","Social"),iconName:"__mdi:people",newTabUrl:B+"smartlabel_social",gmailPath:I+"#category/social",color:"#db4437",colorIcon:!0,sort:5},smartlabel_pure_notif:{id:"smartlabel_pure_notif",label:cjExtensions.i18n("cj_i18n_00313","Updates"),iconName:"__mdi:flag",newTabUrl:B+"smartlabel_pure_notif",gmailPath:I+"#category/updates",color:"#ff6839",colorIcon:!0,sort:6},smartlabel_group:{id:"smartlabel_group",label:cjExtensions.i18n("cj_i18n_00182","Forums"),iconName:"__mdi:question_answer",newTabUrl:B+"smartlabel_group",gmailPath:I+"#category/forums",color:"#3f51b5",colorIcon:!0,sort:7},smartlabel_promo:{id:"smartlabel_promo",label:cjExtensions.i18n("cj_i18n_00315","Promos"),iconName:"__mdi:local_offer",newTabUrl:B+"smartlabel_promo",gmailPath:I+"#category/promotions",color:"#00bcd4",colorIcon:!0,sort:8},io_unim:{id:"io_unim",label:cjExtensions.i18n("cj_i18n_00316","Low Priority"),iconName:"__mdi:low_priority",newTabUrl:B+"io_unim",sort:9}};h()}});