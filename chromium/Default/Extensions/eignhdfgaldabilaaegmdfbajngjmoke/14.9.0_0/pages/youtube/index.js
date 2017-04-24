cjModules.define(function(){"use strict";return function(e,t){function n(e){var t="https://www.youtube.com/";return g.signedIn?cjBasics.urls.create(t+"signin",{pageid:g.account.pageid,authuser:g.account.authuser,next:e}):t+e}function a(e){var t=n(e);bmBasics.openTab(t)}function i(e){var t=document.createElement("iframe");G=t,t.className="video-player-frame",t.setAttribute("allowfullscreen",""),t.setAttribute("webkitallowfullscreen",""),t.setAttribute("mozallowfullscreen","");var n=cjBasics.urls.create("https://www.youtube.com/embed/"+e,{autoplay:1,theme:"light",showinfo:0,html5:1,autohide:0,fs:1,hl:g.lang});return t.src=n,t}function c(e){for(var t=[2,3,4,5,7,8,9],n=[0,0,0,0,0,0,0],a=/^P((\d+Y)?(\d+M)?(\d+W)?(\d+D)?)?(T(\d+H)?(\d+M)?(\d+S)?)?$/.exec(e),i=0;i<t.length;i++){var c=t[i];n[i]=a[c]?Number(a[c].replace(/[A-Za-z]+/g,"")):0}var o=n[4]+24*(n[3]+7*n[2]+30*n[1]+360*n[0]),l=1===n[5].toString().length?"0"+n[5]:n[5],r=1===n[6].toString().length?"0"+n[6]:n[6],s=(0===o?"":o+":")+l+":"+r;return s}function o(e,t,n){var a=["activities","subscriptions","channels","playlistItems"],i=-1!==a.indexOf(e)||n,c={hl:g.lang,key:g.key,maxResults:oe};return"object"==typeof t&&Object.keys(t).forEach(function(e){c[e]=t[e]}),(i?g.request:cjBasics.ajax)({scope:ce,url:cjBasics.urls.create(ie+e,c),dataType:"JSON"})}function l(){Q.textContent="",Y=cjMaterial.createElement("list"),Q.appendChild(Y)}function r(){Q.textContent="";var e=cjMaterial.createElement("emptystate",{color:"#ea4335",iconName:"__mdi:video_youtube",label:cjExtensions.i18n("cj_i18n_00156","No results")});Q.appendChild(e)}function s(e){var t=document.createDocumentFragment(),n=cjMaterial.createElement("card",{withPadding:!0}),a=cjMaterial.createElement("title");n.appendChild(a);var i=document.createElement("div");i.className="video-player-channel",n.appendChild(i),t.appendChild(n);var c=cjMaterial.createElement("card",{withPadding:!0}),o=document.createElement("div");o.className="video-player-published-at",c.appendChild(o);var l=document.createElement("div");return l.className="video-player-description",c.appendChild(l),t.appendChild(c),cjBasics.ajax({url:cjBasics.urls.create("https://www.googleapis.com/youtube/v3/videos",{part:"snippet,statistics",id:e,key:g.key}),dataType:"JSON"}).then(function(e){var t=e.items[0],n=t.snippet;o.textContent="Published on "+new Date(n.publishedAt).toDateString(),a.textContent=n.title,l.textContent=n.description,g.modules.load("ytsubscribe").then(function(){gapi.ytsubscribe.render(i,{channelid:n.channelId,layout:"full",card:1})})}),t}function d(e){var t=cjMaterial.createElement("card"),n=document.createElement("div");return n.className="video-player-comments",t.appendChild(n),g.modules.load("comments").then(function(){gapi.comments.render(n,{href:"http://www.youtube.com/watch?v="+e,query:"http://www.youtube.com/watch?v="+e,search:"?v="+e,first_party_property:"YOUTUBE",bm_contentscript:"youtubecomments",authuser:g.account.authuser,pageId:g.account.pageid,hl:g.lang,width:384,view_type:"FILTERED",gsrc:"1p",youtube_video_acl:"PUBLIC"})}),t}function u(e){var t=q;bmBasics.toggleLoading("on",t),t.textContent="";var n=i(e);n.addEventListener("load",function(){bmBasics.toggleLoading("off",t)}),t.appendChild(n);var a=s(e);t.appendChild(a);var c=d(e);t.appendChild(c),R=e}function m(e){return cjBasics.ajax({dataType:"JSON",url:cjBasics.urls.create("https://www.google.com/complete/search",{client:"serp",authuser:g.account.authuser,xhr:"t",q:e,ds:"yt"})})}function p(e){var t=Date.now();m(e).then(function(e){if(!(J>t)){J=t,ee.textContent="";var n=e[1];if(n.length>0){for(var a=0;a<n.length;a++){var i,c=n[a],o=c[0],l=c[3];l&&l.b&&l.c?(o+="– "+l.b,i=l.c):i=o.split("<b>").join("").split("</b>").join("");var r=cjMaterial.createElement("item");r.dataset.value=i,r.innerHTML=o,ee.appendChild(r)}F.searchmenu.show()}else F.searchmenu.hide()}})}function h(t){var n=cjMaterial.createElement("item",{multiline:!0});n.classList.add("video-item"),n.dataset.videoId=t.videoId,n.addEventListener("click",function(){te.selected="videoPlayer",u(t.videoId),setTimeout(function(){e.classList.add("video-player")})});var i=document.createElement("div");i.className="video-item-image",i.setAttribute("style","background-image: url('"+t.imageUrl+"');"),i.dataset.duration=t.duration,n.appendChild(i);var c=document.createElement("div");c.className="cj-md-item__body";var o=document.createElement("div");o.className="video-item-title cj-md-item__header",o.textContent=t.videoTitle,c.appendChild(o);var l=document.createElement("div");l.className="cj-md-secondarytext",l.textContent=t.channelTitle,c.appendChild(l),n.appendChild(c);var r=cjMaterial.createElement("iconbutton",{iconName:"__mdi:open_in_new",label:cjExtensions.i18n("cj_i18n_00045","Open video in a new tab"),onClick:function(e){a("watch?v="+this.parentNode.dataset.videoId),e.stopPropagation()}});r.classList.add("video-item-openinnew"),n.appendChild(r),Y.appendChild(n)}function v(t,n){0===t.length?(r(),bmBasics.toggleLoading("off",e)):o("videos",{part:"snippet,contentDetails,id",fields:"items(contentDetails/duration,id,snippet/title,snippet/channelTitle,snippet/thumbnails/default/url)",id:t.join(",")},n).then(function(t){var n=t.items,a={};n.forEach(function(e){var t=e.id;a[t]={videoId:t,imageUrl:e.snippet.thumbnails["default"].url,channelTitle:e.snippet.channelTitle,videoTitle:e.snippet.title,duration:c(e.contentDetails.duration)}}),Object.keys(a).forEach(function(e){h(a[e])}),bmBasics.toggleLoading("off",e)})}function f(t,n){K.textContent=cjExtensions.i18n("cj_i18n_00159","Search"),e.classList.add("search"),W=f,n||(l(),le=[]),bmBasics.toggleLoading("on",e);var a={part:"id",fields:"items(id/videoId),nextPageToken",type:"video",order:Z.selected};"object"==typeof t&&Object.keys(t).forEach(function(e){a[e]=t[e]}),o("search",a).then(function(e){z=e.nextPageToken;var t=e.items.map(function(e){return e.id.videoId});le=le.concat(t),v(t)})}function b(t,n){W=b,bmBasics.toggleLoading("on",e),n||(l(),le=[]);var a={part:"id",fields:"items(id),nextPageToken",chart:"mostPopular"};"object"==typeof t&&Object.keys(t).forEach(function(e){a[e]=t[e]}),o("videos",a).then(function(e){z=e.nextPageToken;var t=e.items.map(function(e){return e.id});le=le.concat(t),v(t)})}function j(){var e=V.value;if(0===V.value.length)return null;var t,n,a=e.split(" ");return a.forEach(function(e){-1!==e.indexOf("duration:")&&(t=e.split("duration:")[1],a.splice(a.indexOf(e),1)),-1!==e.indexOf("type:")&&(n=e.split("type:")[1],a.splice(a.indexOf(e),1))}),{q:a.join(" "),videoDuration:t,videoType:n}}function _(){F.searchmenu.hide();var t=j();if(t)f(t);else if(e.classList.remove("search"),U){var n=U.selected;H[n].action(),K.textContent=H[n].label}else K.textContent=cjExtensions.i18n("cj_i18n_00153","Trending"),b();te.selected="searchResults",setTimeout(function(){e.classList.remove("video-player")})}function E(t){var n=cjMaterial.createElement("appbar",{color:"#ea4335",secondary:!0}),a=cjMaterial.createElement("iconbutton",{iconName:"__mdi:arrow_back",onClick:function(){te.selected="searchResults",G.src="about:blank",setTimeout(function(){e.classList.remove("video-player")})}});n.appendChild(a);var i=cjMaterial.createElement("title",{label:cjExtensions.i18n("cj_i18n_00162","Back")});n.appendChild(i);var c=cjMaterial.createElement("iconbutton",{iconName:"__mdi:chevron_left",onClick:function(){var e=R,t=document.querySelector(".video-item[data-video-id='"+e+"']").previousSibling.dataset.videoId;t&&u(t)}});n.appendChild(c);var o=cjMaterial.createElement("iconbutton",{iconName:"__mdi:chevron_right",onClick:function(){var e=R,t=document.querySelector(".video-item[data-video-id='"+e+"']");if(t){var n=t.nextSibling;if(n){var a=n.dataset.videoId;u(a)}}}});n.appendChild(o),t.appendChild(n),q=cjMaterial.createElement("container",{scrollable:!0,shadow:!0}),t.appendChild(q)}function x(){W({pageToken:z},!0)}function y(e){$=cjMaterial.createElement("appbar",{color:"#ea4335",secondary:!0}),$.classList.add("main-toolbar");var t=cjMaterial.createElement("iconbutton",{iconName:"__mdi:menu",onClick:function(){ne.open()}});$.appendChild(t);var n=cjMaterial.createElement("title",{label:cjExtensions.i18n("cj_i18n_00153","Trending")});K=n,$.appendChild(n);var i=cjMaterial.createElement("iconbutton",{iconName:"__mdi:refresh",label:cjExtensions.i18n("cj_i18n_00157","Reload"),onClick:function(){if(U){var e=U.selected;H[e].action(),K.textContent=H[e].label}else K.textContent=cjExtensions.i18n("cj_i18n_00153","Trending"),b()}});$.appendChild(i);var c=cjMaterial.createElement("fab",{label:cjExtensions.i18n("cj_i18n_00158","Upload video"),iconName:"__mdi:file_upload",onClick:function(){a("upload")}});e.appendChild(c),e.appendChild($);var o=cjMaterial.createElement("appbar",{color:"#ea4335",secondary:!0});o.classList.add("search-toolbar");var l=cjMaterial.createElement("iconbutton",{iconName:"__mdi:arrow_back",onClick:function(){V.clear(),_()}});o.appendChild(l);var r=cjMaterial.createElement("title",{label:cjExtensions.i18n("cj_i18n_00159","Search")});o.appendChild(r),Z=cjMaterial.createElement("selectbox",{onChange:_,options:[{value:"date",label:cjExtensions.i18n("cj_i18n_00035","sort by date")},{value:"rating",label:cjExtensions.i18n("cj_i18n_00036","sort by rating")},{selected:!0,value:"relevance",label:cjExtensions.i18n("cj_i18n_00037","sort by relevance")},{value:"title",label:cjExtensions.i18n("cj_i18n_00038","sort by title")},{value:"viewCount",label:cjExtensions.i18n("cj_i18n_00039","sort by views")}]}),o.appendChild(Z),e.appendChild(o),Q=cjMaterial.createElement("container",{scrollable:!0,shadow:!0,onScrollBottom:x}),Y=cjMaterial.createElement("list"),Q.appendChild(Y),e.appendChild(Q)}function C(){return o("subscriptions",{part:"snippet",fields:"items(snippet/resourceId/channelId,snippet/title, snippet/thumbnails/default/url)",mine:!0,maxResults:50}).then(function(e){return e.items.map(function(e){return{channelId:e.snippet.resourceId.channelId,title:e.snippet.title,thumbnail:e.snippet.thumbnails["default"].url}})})}function w(){bmBasics.toggleLoading("on",e),o("channels",{part:"contentDetails",fields:"items(contentDetails/relatedPlaylists/uploads)",mine:!0},!0).then(function(t){function n(t,n){bmBasics.toggleLoading("on",e),n||(l(),le=[]);var i={part:"contentDetails",playlistId:a,fields:"items(contentDetails/videoId),nextPageToken"};"object"==typeof t&&Object.keys(t).forEach(function(e){i[e]=t[e]}),o("playlistItems",i,!0).then(function(e){var t=e.items.map(function(e){return e.contentDetails.videoId});le=le.concat(t),v(t,!0)})}var a=t.items[0].contentDetails.relatedPlaylists.uploads;W=n,n()})}function M(t,n,a){W=function(e,n){M(t,e,n)},bmBasics.toggleLoading("on",e),a||(l(),le=[]);var i={part:"contentDetails",fields:"items(contentDetails),nextPageToken",channelId:t,maxResults:50};"object"==typeof n&&Object.keys(n).forEach(function(e){i[e]=n[e]}),o("activities",i).then(function(e){z=e.nextPageToken;var t=[];e.items.forEach(function(e){var n=e.contentDetails.upload;n&&t.push(n.videoId)}),le=le.concat(t),v(t)})}function T(){C().then(function(e){if(0===e.length)A?A*=3:A=1e3,setTimeout(T,A);else{var t=cjMaterial.createElement("subheader",{label:cjExtensions.i18n("cj_i18n_00154","Subscriptions")});ne.appendChild(t);var a={};e.forEach(function(e){a[e.channelId]={label:e.title,icon:{withShell:!0,url:e.thumbnail.replace("s88",cjBasics.isRetina?"s80":"s40"),size:40},newTabUrl:n("channel/"+e.channelId)}});var i=bmElements.createElement("drawertabs",{items:a,onChange:function(e){K.innerHTML=i.querySelector('.cj-md-item[data-id="'+e+'"]').textContent,M(e),ne.close()}});ne.appendChild(i)}})}function k(){K.textContent=cjExtensions.i18n("cj_i18n_00153","Trending");var e=bmElements.createElement("servicelogo",{labelPrefix:"",label:""});ne.appendChild(e),X&&X.parentNode.removeChild(X),U=bmElements.createElement("drawertabs",{items:H,onChange:function(e){ne.close(),H[e].action(),K.textContent=H[e].label},selected:"trending"}),ne.appendChild(U),b(),T()}function L(){g.auth.requestPermission(ce)}function N(){b(),K.textContent=cjExtensions.i18n("cj_i18n_00153","Trending"),X=cjMaterial.createElement("button",{label:cjExtensions.i18n("cj_i18n_00160","Authorize"),onClick:L}),$.insertBefore(X,K.nextSibling);var e=bmElements.createElement("servicelogo",{labelPrefix:"",label:""});ne.appendChild(e);var t=cjMaterial.createElement("button",{raised:!0,label:cjExtensions.i18n("cj_i18n_00160","Authorize"),onClick:L});ne.appendChild(t)}function I(){g.auth.getAccessToken(ce).then(k,N)}function B(){var e=j();return e?cjBasics.urls.create("results",{q:e.q}):""}function P(){var e=B();a(e)}function S(){var e=document.createElement("div");e.classList.add("bm-p-youtube__filters");var t=document.createElement("div");t.className="cj-md-subheader",t.textContent=cjExtensions.i18n("cj_i18n_00163","Type"),e.appendChild(t);var n=[{value:"episode",label:cjExtensions.i18n("cj_i18n_00043","Episodes")},{value:"movie",label:cjExtensions.i18n("cj_i18n_00044","Movies")}];return n.forEach(function(t){var n=cjMaterial.createElement("item");n.dataset.filter=t.value,n.textContent=t.label,n.addEventListener("click",function(){F.searchmenu.hide();var e=V.value;if(-1!==e.indexOf("type:")){var t=e.split(" ");t.forEach(function(e){-1!==e.indexOf("type:")&&t.splice(t.indexOf(e),1)}),e=t.join(" ")}V.value="type:"+n.dataset.filter+(e?" "+e:""),_()}),e.appendChild(n)}),t=document.createElement("div"),t.className="cj-md-subheader",t.textContent=cjExtensions.i18n("cj_i18n_00164","Duration"),e.appendChild(t),n=[{value:"long",label:cjExtensions.i18n("cj_i18n_00040","Longer than 20 min")},{value:"medium",label:cjExtensions.i18n("cj_i18n_00041","Between 4 and 20 min")},{value:"short",label:cjExtensions.i18n("cj_i18n_00042","Shorter than 4 min")}],n.forEach(function(t){var n=cjMaterial.createElement("item");n.dataset.filter=t.value,n.textContent=t.label,n.addEventListener("click",function(){F.searchmenu.hide();var e=V.value;if(-1!==e.indexOf("duration:")){var t=e.split(" ");t.forEach(function(e){-1!==e.indexOf("duration:")&&t.splice(t.indexOf(e),1)}),e=t.join(" ")}V.value="duration:"+n.dataset.filter+(e?" "+e:""),_()}),e.appendChild(n)}),e}function O(){return te&&"videoPlayer"===te.selected?"watch?v="+R:U&&"myVideos"===U.selected?"my_videos":e.classList.contains("search")?B():""}function D(){t.setOpenInNewHandler(function(){var e=O();a(e)}),F=bmElements.createElement("pageheader",{color:"#ea4335",pageId:"youtube",includeSearchMenu:!0,searchboxProperties:{onClear:function(){F.searchmenu.hide()},onInput:function(e){F.searchmenu.classList.add("hide-filters"),p(e)},onSubmit:_,onSubmitAlt:P}}),e.appendChild(F);var i=cjMaterial.createElement("iconbutton",{iconName:"__mdi:arrow_drop_down",onClick:function(){F.searchmenu.classList.contains("hide-filters")?(F.searchmenu.classList.remove("hide-filters"),F.searchmenu.open()):F.searchmenu.toggle()}});F.searchbox.appendChild(i),ee=cjMaterial.createElement("list"),ee.classList.add("bm-ele-autocomplete"),ee.addEventListener("click",function(e){var t=e.target.dataset.value;F.searchbox.value=t,_(t)}),F.searchmenu.appendChild(ee),V=F.searchbox,ae(V.select);var c=S();F.searchmenu.appendChild(c),H={whatToWatch:{label:cjExtensions.i18n("cj_i18n_00151","What to watch"),action:function(){a("")},iconName:"__mdi:home",external:!0,newTabUrl:n("")},myVideos:{label:cjExtensions.i18n("cj_i18n_00152","My videos"),action:w,iconName:"__mdi:video_library",newTabUrl:n("my_videos")},trending:{label:cjExtensions.i18n("cj_i18n_00153","Trending"),action:b,iconName:"__mdi:whatshot",newTabUrl:n("feed/trending")},mySubscriptions:{label:cjExtensions.i18n("cj_i18n_00154","Subscriptions"),action:function(){a("feed/subscriptions")},iconName:"__mdi:my_subscriptions",external:!0,newTabUrl:n("feed/subscriptions")},history:{label:cjExtensions.i18n("cj_i18n_00155","History"),action:function(){a("feed/history")},iconName:"__mdi:history",external:!0,newTabUrl:n("feed/history")},watchLater:{label:cjExtensions.i18n("cj_i18n_00076","Watch later"),action:function(){a("playlist?list=WL")},iconName:"__mdi:schedule",external:!0,newTabUrl:n("playlist?list=WL")}},bmBasics.toggleLoading("on",e),ne=cjMaterial.createElement("drawer",{color:"#ea4335"}),e.appendChild(ne),te=bmElements.createElement("multiplecontainer",{items:{searchResults:{content:function(){return cjMaterial.createElement("container")},afterLoad:y},videoPlayer:{content:function(){return cjMaterial.createElement("container",{darker:!0})},afterLoad:E}},selected:"searchResults"}),e.appendChild(te),I()}var U,q,A,R,W,z,H,J,F,V,Y,Z,$,G,K,Q,X,ee,te,ne,ae=t.onPageDisplay,ie="https://www.googleapis.com/youtube/v3/",ce=["https://www.googleapis.com/auth/youtube.readonly"],oe=15,le=[];D()}});