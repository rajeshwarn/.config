cjModules.define(function(){"use strict";return function(e){function n(e){var n=document.createElement("p");return n.textContent=e,n}function o(){return document.createElement("br")}function t(e){var n=document.createElement("div"),o=document.createElement("label"),t=document.createElement("input");t.type="checkbox",cjExtensions.settings.get(e.id).then(function(n){t.checked=e.disable?!n:n}),t.addEventListener("click",function(){cjExtensions.settings.set(e.id,e.disable?!t.checked:t.checked),e.callback&&e.callback(t.checked)}),o.appendChild(t);var c=document.createTextNode(e.label);return o.appendChild(c),n.appendChild(o),n}function c(e){var n=cjMaterial.createElement("button",{label:e.label,onClick:function(){bmBasics.openTab(e.url)}});return e.color&&n.setAttribute("style","color: "+e.color+";"),n}if(!bmRuntime.runningInOptionsPage){var i=cjMaterial.createElement("appbar",{light:!0}),l=cjMaterial.createElement("title",{label:cjExtensions.i18n("cj_i18n_00348","Extension Settings")});if(i.appendChild(l),!bmRuntime.portalOnSide){var a=cjMaterial.createElement("iconbutton",{iconName:"__mdi:close",onClick:bmRuntime.changeToPreviousPage});i.appendChild(a)}e.appendChild(i)}var s=cjMaterial.createElement("container",{scrollable:!0,shadow:bmRuntime.runningInOptionsPage?!1:"onScroll"});e.appendChild(s);for(var r=[cjMaterial.createElement("subheader",{label:cjExtensions.i18n("cj_i18n_00404","Select services")}),n(cjExtensions.i18n("cj_i18n_00401","To add pages to the black menu bar, click on 'add' at the bottom of the black menu bar and click or drag the services you want added. If you want to remove services, you can drag/drop them to the left side of the extension.")),cjMaterial.createElement("subheader",{label:cjExtensions.i18n("cj_i18n_00402","Notifications")}),n(cjExtensions.i18n("cj_i18n_00403","To enable or update desktop notifications, select the product and follow the instructions.")),c({label:cjExtensions.i18n("cj_i18n_00416","Gmail"),url:"https://support.google.com/mail/answer/1075549?co=GENIE.Platform=Desktop",color:"#4788F2"}),c({label:cjExtensions.i18n("cj_i18n_00302","Calendar"),url:"https://support.google.com/calendar/answer/37242?co=GENIE.Platform=Desktop",color:"#4788F2"}),c({label:cjExtensions.i18n("cj_i18n_00390","Drive"),url:"https://support.google.com/drive/answer/6318501?co=GENIE.Platform=Desktop",color:"#4788F2"}),c({label:cjExtensions.i18n("cj_i18n_00445","YouTube"),url:"https://support.google.com/youtube/answer/3382248?co=GENIE.Platform=Desktop",color:"#4788F2"}),c({label:cjExtensions.i18n("cj_i18n_00423","Maps"),url:"https://support.google.com/maps/answer/6149565?co=GENIE.Platform=Desktop",color:"#4788F2"}),c({label:cjExtensions.i18n("cj_i18n_00420","Hangouts"),url:"https://support.google.com/hangouts/answer/3111919?co=GENIE.Platform=Desktop",color:"#4788F2"}),c({label:cjExtensions.i18n("cj_i18n_00443","Voice"),url:"https://support.google.com/voice/answer/168521?co=GENIE.Platform=Desktop",color:"#4788F2"}),c({label:cjExtensions.i18n("cj_i18n_00421","Inbox"),url:"https://support.google.com/inbox/answer/6067586?co=GENIE.Platform=Desktop",color:"#4788F2"}),cjMaterial.createElement("subheader",{label:cjExtensions.i18n("cj_i18n_00823","Dense mode")}),t({label:cjExtensions.i18n("cj_i18n_00824","Enable dense mode (experimental)"),id:"dense-mode",callback:function(e){document.documentElement.classList.toggle("is-dense-mode",e)}}),cjMaterial.createElement("subheader",{label:cjExtensions.i18n("cj_i18n_00353","Contribute")}),n(cjExtensions.i18n("cj_i18n_todo","We are in desperate need for community translators. We would highly appreciate it if you could help us out.")),c({label:cjExtensions.i18n("cj_i18n_todo","Help with translations"),url:"https://carlosjeurissen.com/black-menu-for-google/translate",color:"#4788F2"}),n(cjExtensions.i18n("cj_i18n_00359","If you like the extension - and I sincerely hope you do - consider donating. It will help the development process and make it easier for me to improve the extension for everyone.")),c({label:cjExtensions.i18n("cj_i18n_00354","Donate"),url:"https://carlosjeurissen.com/black-menu-for-google/donate",color:"#4788F2"}),cjMaterial.createElement("subheader",{label:cjExtensions.i18n("cj_i18n_00349","Feedback & Support")}),n(cjExtensions.i18n("cj_i18n_00358","If you have any questions, feature requests or bug reports, please let us know!")),c({label:cjExtensions.i18n("cj_i18n_00350","Ask a question"),url:"https://carlosjeurissen.com/black-menu-for-google/contact#question",color:"#4788F2"}),c({label:cjExtensions.i18n("cj_i18n_00351","Report a bug"),url:"https://carlosjeurissen.com/black-menu-for-google/contact#bug_report",color:"#DA453D"}),c({label:cjExtensions.i18n("cj_i18n_00352","Request a feature"),url:"https://carlosjeurissen.com/black-menu-for-google/contact#feature_request",color:"#1E9C5B"}),cjMaterial.createElement("subheader",{label:cjExtensions.i18n("cj_i18n_00355","Privacy")}),n(cjExtensions.i18n("cj_i18n_00360","We take your privacy very serious. In order to improve our services, we collect certain anonymous usage data of the extension. You can easily turn this off using the setting below.")),o(),t({label:cjExtensions.i18n("cj_i18n_00356","Send anonymous usage data of this extension"),id:"disableAnalytics",disable:!0}),o(),c({label:cjExtensions.i18n("cj_i18n_00357","View our privacy policy"),url:"https://carlosjeurissen.com/privacy-policy",color:"#4788F2"})],u=0;u<r.length;u++)s.appendChild(r[u])}});