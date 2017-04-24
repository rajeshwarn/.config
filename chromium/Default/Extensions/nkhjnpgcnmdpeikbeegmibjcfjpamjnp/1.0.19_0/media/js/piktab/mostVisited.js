function most_visited() {
  if (!localStorage.most_visited) {
    localStorage.most_visited = false;
    return;
  }

  if (localStorage.getItem("most_visited") === "true") {
    if (chrome.topSites) 
    { 
      chrome.topSites.get(buildPopupDom);
      document.getElementById("most-visited").checked = true;
    }
  }
  else 
  {
    document.getElementById("most-visited").checked = false;
    document.getElementById('mostVisited_div_holder').style.display = 'none';
    document.getElementById('mostVisited_div_holder').classList.add("hidden");
    document.getElementById('sub-header').classList.add("hidden");

  }
}

function most_visited_granted_permissions() {
  var most_visited_checked = document.getElementById('most-visited').checked;
  if (localStorage.most_visited === "false" || !localStorage.most_visited) 
  {
    chrome.permissions.request({
      permissions: ['topSites']
    }, function(granted) {
      if (granted) {
        document.getElementById('sub-header').classList.remove("hidden");
        document.getElementById('mostVisited_div_holder').style.display = 'block';
        document.getElementById('mostVisited_div_holder').classList.remove("hidden");
        document.getElementById("most-visited").checked = true;
        localStorage.most_visited = true;
        most_visited();
      } else {
        document.getElementById("most-visited").checked = false;
        localStorage.most_visited = false;
      }
    });
  }
  else
  {            
    if (most_visited_checked) {
      document.getElementById('sub-header').classList.remove("hidden");
      document.getElementById('mostVisited_div_holder').style.display = 'block';
      document.getElementById('mostVisited_div_holder').classList.remove("hidden");
      document.getElementById("most-visited").checked = true;
      localStorage.most_visited = true;
      most_visited()
    } else {
      document.getElementById('sub-header').classList.add("hidden");
      document.getElementById('mostVisited_div_holder').style.display = 'none';
      document.getElementById('mostVisited_div_holder').classList.add("hidden");
      localStorage.most_visited = false;
      var mostVisited_div = document.getElementById("mostVisited_div");
      while (mostVisited_div.firstChild){
        mostVisited_div.removeChild(mostVisited_div.firstChild);
      }
    }
  }
}

function buildPopupDom(mostVisitedURLs) {
  if (navigator.onLine) 
  {
    document.getElementById('mostVisited_div').innerHTML = ''
    var n = Math.min(mostVisitedURLs.length, 7);
    for (var i = 0; i < n; i++) {
      draw_image_provider(mostVisitedURLs[i].url,  mostVisitedURLs[i].title);
    }
    document.getElementById('mostVisited_div_holder').classList.remove("hidden");
    document.getElementById('sub-header').classList.remove("hidden");
  }
}

function draw_image_provider(imgUrl, imgTitle){      
  var popupDiv = document.getElementById('mostVisited_div');
  var li = popupDiv.appendChild(document.createElement('li'));
  var a = li.appendChild(document.createElement('a'));
  var img = a.appendChild(document.createElement('img'));
  var tooltip = a.appendChild(document.createElement('div'));
  var tooltip__content = tooltip.appendChild(document.createElement('div'));

  a.classList.add("tooltip");
  //tooltip__container tooltip__container--bottom tooltip__container--pre
  tooltip.classList.add("tooltip__container");
  tooltip.classList.add("tooltip__container--bottom");
  tooltip.classList.add("tooltip__container--pre");
  tooltip__content.classList.add("tooltip__content");


  img.style.display = 'none';
  a.href = imgUrl;

  var cleanUrl = imgUrl.replace('http://', '').replace('https://', '').replace('www.', '').split(/[/?#]/)[0];
  tooltip__content.innerHTML = cleanUrl;
  if (cleanUrl == 'localhost')
  {
    img.src = 'chrome://favicon/' + imgUrl;
  } else
  {
    try
    {

     img.src = 'https://logo.clearbit.com/' + cleanUrl;
     img.onerror = function(){
      this.src = 'http://www.google.com/s2/favicons?domain=' + imgUrl;
    }.bind(img, imgUrl);     
  } catch (exc){
    img.src = 'http://www.google.com/s2/favicons?domain=' + imgUrl;
  }
}
img.onload = function(){
  img.style.display = 'block';
}
}
function item_icon(icons)
{
  var icons_128 = icons.filter(function(icon){
    return (icon.size === 128);
  })[0].url;
  return icons_128;
}


chrome.management.getAll(function(items) {

  var app_html = '', template = $('#app_template').html(), template = Handlebars.compile(template);

  for (var i = 0; i < items.length; i++) {
    var item = items[i];  

    if (["legacy_packaged_app", "hosted_app", "packaged_app"].indexOf(item.type) != -1) 
    {
      item.icon = item_icon(item.icons);
      app_html += template(item);
    }
  }
  document.getElementById("chrome_apps").innerHTML = app_html;
});