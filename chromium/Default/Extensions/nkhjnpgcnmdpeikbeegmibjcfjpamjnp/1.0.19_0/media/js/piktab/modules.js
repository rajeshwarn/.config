//                   >>DATA SET<<                   //


function user_preferences_set(serv_data) {
  if (!serv_data) return;
  var data_ar = [];
  $.each(serv_data, function(index, value) {
    if (value.id) 
    {
      var id = parseInt(value.id)
      data_ar.push(id);
    }
    else
    {
      data_ar.push(value+100);
    }
  }); 
  data_ar = data_ar.join();
  return data_ar;
}


//                   >>HTML GEN<<                   //


function settings_gen(s_array) {
  var sources_div = '';
  var Handle_sources = $('#sources_template').html();
  var Handle_templateSources = Handlebars.compile(Handle_sources);
  var sources_active = [];
  s_array.forEach(function (source){
    if (source.active === "1") 
    { 
      source.types = source.types.split(",");
      source.types = typeid_to_type(source.types);
      sources_div += Handle_templateSources(source);
      sources_active.push(source);
    }
    if (source.active === "3") 
    {
      force_update_elements = true;
    }
  });
  sources_obj = sources_active;
  document.getElementById('sources-el').innerHTML = sources_div;
  userSelection();
  filter_constructor();
  count_sources();
}

function success_ajax(articles) {
  $loader.hide();
  if(typeof articles !== "object") articles = JSON.parse(articles);
  
  if (articles == null) 
  {
    if (page == 1) 
    {
      $("main .article_box").remove();
      document.getElementById("alert_nomore").classList.add("hidden");
      document.getElementById("alert_noelements").classList.remove("hidden");
      loading = true;
      return;
    } 
    else 
    {
      if (searchPiktab) 
      {
        document.getElementById("alert_nomore").classList.remove("hidden");
      }
      $loader.hide();
    }
    $loader.hide();
    return;
  } 
  else 
  {
    document.getElementById("alert_noelements").classList.add("hidden");
  }
  var elementBox = '';
  var type_list = '';
  if (searchPiktab) 
  {    
    if (!f_page && articles.ext_page) f_page = 1;
    if (f_page) f_page++;

    term = articles.term;
    var text = articles.total + " items found";
    $loader.hide();
    articles = articles.data;
  }
  var html = article_handle(articles);

  if (page == 1)
  {
    document.getElementById('element_container').innerHTML = html;
    if (changes_col)
    {
      get_collections(gr.auth.me.id);
      changes_col = false;
    }
    else
    {
      if (collections) 
      {
        draw_bookmarks(collections);
      }
    }
  }
  else
  {
    if (!html) return;
    document.getElementById('element_container').insertAdjacentHTML('beforeend', html);
    if (changes_col)
    {
      get_collections(gr.auth.me.id);
      changes_col = false;
    }
    else
    {

      if (gr.auth.me.status)
      {
        if (collections) 
        {
          draw_bookmarks(collections);
        }
      }
    }
  }
  $(".page-number").text(page);
  loading = false;

  if(document.querySelectorAll("article").length < limit_pp) 
  {
    page++;
    if (searchPiktab) 
    {
      searchInPiktab(term);
    }
    // else
    // {
    //   // loadElements(false, document.querySelectorAll("article").length);
    // }
  }
  if(document.querySelectorAll("article").length < limit_pp)
  {
    page++;
    loadElements(false, document.querySelectorAll("article").length);
    if (!html) return;
  }
}

function article_handle(elements) {

  if (!elements) return false;

  var template = '';
  var resource = document.getElementById("elements_template").innerHTML;
  var templateElement = Handlebars.compile(resource);
  var video_array = ["6","9","14","15","16","17","18","21","22","23"];
  var video_youtube = ["14","15","16","17","18","21","22","23"];
  elements.forEach(function(article) {
    if (article.type) {    
      if (article.id_type) 
      {
        article.type_id = (Array.isArray(article.id_type)) ? article.id_type.join() : article.id_type;
      }
      if(!Array.isArray(article.type)) article.type = article.type.split(",");
      article.isVideo = (video_array.indexOf(article.id_source) !== -1);
      if (video_youtube.indexOf(article.id_source) !== -1) 
      {
        article.url_ifvideo = article.url.replace("watch?v=","embed/")
      }
      article.isIcon = (article.id_source == 2 || article.id_source == 8 || article.id_source == 10 )
      if (article.source == 'flaticon') {
        article.styleClass = 'center';
      }
      if (isRetina()) {
        if (article.mini.split("/")[2] === "api.thumbr.io") {
          article.mini = article.mini + "&dpr=2";
        }
      }

      article.name = article.source.replace("_", " ");
      img = new Image();
      img.src = article.mini;

      img.onload = function(){
      }
      img.onerror = function(){
        var img_not_loaded = document.querySelector('article .showcase__image a[style="background-image: url('+this.getAttribute('src')+');"]')
        var article_to_remove = img_not_loaded.parentNode.parentNode.parentNode;
        article_to_remove.parentNode.removeChild(article_to_remove);
      }
      template += templateElement(article);
    }
  });
  return template;
}

function alter_order() {
  var today_total = today_el;
  elements_lib.update("elements", function(row) {
    return true;
  },
  function (el) {
    if (el.possition >= today_total-5) 
    {
      el.possition = today_total - el.possition + 1;
    }
    else
    {
      el.possition+=5;
    }
    return el;
  }
  );
  elements_lib.commit();
}

function loadMore(offset) {
  if (document.querySelectorAll('li#filter_tags li').length !== 0) searchCategory = true;
  if (loading == true) {
    return false;
  }
  if (searchPiktab) 
  {
    var searchTerm = (document.getElementById("search-field").value != '') ? document.getElementById("search-field").value : false;

    searchInPiktab(searchTerm);
  } 
  else if (searchCategory) 
  {
    searchCateg();
  } 
  else 
  {
    offset = document.querySelectorAll('article').length;
    if (document.querySelectorAll('article').length < today_el) 
    {
      success_ajax(elements_lib.queryAll("elements", {sort: [["possition", "ASC"]], limit: limit_pp, start: offset}))
    }
    else
    {
      loadElements(false, offset);
    }
  }
}

function filter_list_generator(filter_element,filter_id,category) {
  if (gr.auth.me.status) 
  {

    if (changes_col)
    {
      get_collections(gr.auth.me.id);
      changes_col = false;
    }
    else
    {
      collections_gen(collections);
    }
  }

  var clas_element = filter_element.trim().replace(/\s/g, '_').toLowerCase();

  var html_list_filter = '';

  var element_type = filter_element.toLowerCase().trim();

  if (category === "sources") 
  {
    html_list_filter = '<li class="tag" id="tag_'+clas_element+'" data-filter-id="'+filter_id+'" data-category="'+category+'"><span class="type-source">'+filter_element+'</span><button class="tag-remove nohover"></button></li>';
  }
  else if (category === "search") 
  {
    html_list_filter = '<li class="tag" id="search-term" data-filter-id="'+filter_id+'" data-category="'+category+'"><span class="type-source">'+filter_element+'</span><button class="tag-remove close_search nohover"></button></li>';
  }
  else
  {
    html_list_filter = '<li class="tag" id="tag_'+clas_element+'" data-filter-id="'+filter_id+'" data-category="'+category+'"><span class="tag-title type-tag"><svg class="type-'+element_type+'"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="media/img/icons/sprite.svg#icon-square"></use></svg>'+filter_element+'</span><button class="tag-remove nohover"></button></li>';
  }
  return html_list_filter;
}

function filter_constructor() {
  filter_init("tags-el");
  filter_init("sources-el");
}

function filter_init(target) {
  var elements = document.getElementById(target).querySelectorAll('div.content');
  var templateList = document.getElementById('filter-list-el').innerHTML;
  var templateList = Handlebars.compile(templateList);
  var template_filter = '';

  var filter = {};
  elements.forEach(function(element) {

    if (element.querySelector('label.label-switch input').checked) 
    {
      filter.filter_type = element.querySelector('label.label-switch input').getAttribute('name');
      filter.fitler_name = element.querySelector('label.label-switch input').dataset.filtername;
      filter.fitler_name = filter.fitler_name.replace('_', ' ');
      filter.fitler_name = filter.fitler_name.replace('-', ' ');
      filter.filter_idst = filter.fitler_name.replace(' ', '_');
      filter.filter_id = '';

      if (filter.filter_type === "sources") 
      {
        filter.filter_id = element.querySelector('label.label-switch input').dataset.sourceid;
        filter.logo = element.querySelector('label.label-switch img.icon').getAttribute('src');
        target = document.querySelector('div.filter-container.sources ul.filter');
      }
      else
      {
        filter.filter_id = element.querySelector('label.label-switch input').dataset.typeid;
        target = document.querySelector('div.filter-container.tags ul.filter');
        filter.logo = filter.fitler_name;
      }


      template_filter += templateList(filter)


    }
  });
  target.innerHTML = template_filter;
}

function subheader_remove() {
  if (document.querySelectorAll('li#filter_tags li.tag').length === 0) 
  {
    searchCategory = false;
    document.getElementById('tags_container').classList.add('hidden');
    document.getElementById('sub-header').classList.add('hidden');
    document.getElementById('tags_container').style.display = 'none';
    if (gr.auth.me.status) 
    {

      if (changes_col)
      {
        get_collections(gr.auth.me.id);
        changes_col = false;
      }
      else
      {
        collections_gen(collections);
      }
    }
  }
}


//                   >>LocalDB GEN<<                   //


function localSorage_db_set(element_lib) {

  if( element_lib.isNew() ) 
  {
    element_lib.createTable("elements", ["possition","base","click","ctr","favicon","icons_per_pack","id","id_source","mini","rating","source","title","type","type_id","url","url_ifvideo","visualizations"]);
    element_lib.commit();
  }
}
function set_lsdb_items(elements_ar) {
  var i = 0;
  elements_ar.forEach(function(e) {
    if (!e.click) e.click = "";
    if (!e.ctr) e.ctr = "";
    if (!e.visualization) e.visualization = "";
    if (!e.icons_per_pack) e.icons_per_pack = "";
    e.possition = i;
    elements_lib.insert("elements", {
      possition: e.possition,
      base: ""+e.base +"",
      click: ""+e.click +"",
      ctr: ""+e.ctr +"",
      favicon: ""+e.favicon +"",
      icons_per_pack: ""+e.icons_per_pack +"",
      id: ""+e.id +"",
      id_source: ""+e.id_source +"",
      mini: ""+e.mini+"",
      rating: ""+e.rating +"",
      source: ""+e.source +"",
      title: ""+e.title +"",
      type: ""+e.type +"",
      type_id: ""+e.type_id +"",
      url: ""+e.url +"",
      url_ifvideo: ""+e.url_ifvideo +"",
      visualization: ""+e.visualization +""
    });
    elements_lib.commit();
    i++;
  });
  loading = false;
  check_el_rot();
  success_ajax(elements_lib.queryAll("elements", {sort: [["possition", "ASC"]], limit: limit_pp, start: offset}));
}


//                   >>HTML GES<<                   //


function check_siblings(element) {
  var sources_inputs = document.querySelectorAll('aside.settings div.settings-submenu div.sources.row input[type=checkbox]');
  var tags_inputs = document.querySelectorAll('aside.settings div.settings-submenu div.tags.row input[type=checkbox]');

  var sources_inputs_values = [];
  var tags_inputs_values = [];

  for (var i = sources_inputs.length - 1; i >= 0; i--) {
    sources_inputs_values.push(sources_inputs[i].checked);
  }

  for (var i = tags_inputs.length - 1; i >= 0; i--) {
    tags_inputs_values.push(tags_inputs[i].checked);
  }

  if (sources_inputs_values.every(function(element) {
    return element == false
  }) || tags_inputs_values.every(function(element) {
    return element == false
  })) {
    apply_button[0].disabled = true;
    apply_button[1].disabled = true;
  } else {
    apply_button[0].disabled = false;
    apply_button[1].disabled = false;
  }
}

function homepage_handler() {
  if (!localStorage.homepage) {
    localStorage.homepage = true;
    _gaq.push(['_trackEvent', 'homepage', 'Piktab', 'true']);
  }
  else
  {
    if (localStorage.homepage === "false")
    {
      document.getElementById("homepage").checked = false;
    }
  }
}

function aside_active() {
  var sibling = this.parentNode.querySelector('li.active');
  if (sibling) 
  { 
    sibling.classList.remove('active');
  }
  this.classList.add("active");
}

function count_sources() {
  var active = '';
  var data_sources_id = [];
  var sources_cont = document.getElementById('sources-el');
  if (localStorage.all_sources_id) 
  { 
    var old_sources = localStorage.all_sources_id.split(",");
    if (old_sources.length < sources_obj.length)
    {
      sources_obj.forEach(function(e) {
        if (e.active === "1") 
        {
          data_sources_id.push(e.id);
          if (old_sources.indexOf(e.id) === -1) 
          {
            active = true;
            var ele = document.querySelector("[data-filtername='"+e.name+"']");
            ele.parentNode.insertAdjacentHTML('afterbegin', '<span title="New content" class="dot"></span>');
            sources_cont.insertBefore(ele.parentNode.parentNode.parentNode , sources_cont.childNodes[0]);
          }
        }
      });
      if (active) 
      {
        document.getElementById('btn-settings').insertAdjacentHTML('afterbegin', '<span title="New content" class="dot"></span>');
        document.querySelector('div.menu ul li label[for=menu-sources]').insertAdjacentHTML('afterbegin', '<span class="dot"></span>')
      }
    }
  }
  else
  {
    sources_obj.forEach(function(e) {
      if (e.active === "1") 
      {
        data_sources_id.push(e.id);
      }
    });
    localStorage.all_sources_id = data_sources_id.toString();
  }
}


//                   >>Data CHECK<<                   //


function check_el_rot() {
  today_el = elements_lib.rowCount("elements");

  var today = new Date().toJSON().slice(0,10);
  if (!localStorage.today_t) {localStorage.today_t = 1;return;}
  if (!localStorage.last_date === today) {localStorage.today_t = 1;return;}
  localStorage.today_t ++;
  if (localStorage.today_t % 5 == 0) 
  {
    alter_order();
  }
}

function check_mv_counter() {
  if (!localStorage.show_settings) 
  {
    localStorage.show_settings = false;
    document.getElementById('btn-settings').insertAdjacentHTML('afterbegin', '<span title="New content" class="dot"></span>');
    document.querySelector('div.menu ul li label[for=menu-settings]').insertAdjacentHTML('afterbegin', '<span class="dot"></span>');
    document.getElementById('most-visited').parentNode.insertAdjacentHTML('afterbegin', '<span class="dot"></span>');
  }
  else
  {
    if (localStorage.show_settings === "true") return;
    document.getElementById('btn-settings').insertAdjacentHTML('afterbegin', '<span title="New content" class="dot"></span>');
    document.querySelector('div.menu ul li label[for=menu-settings]').insertAdjacentHTML('afterbegin', '<span class="dot"></span>');
    document.getElementById('most-visited').parentNode.insertAdjacentHTML('afterbegin', '<span class="dot"></span>');
  }
}

function check_search() {
  if (!localStorage.check_search) 
  {
    localStorage.check_search = false;
    document.getElementById('WhereToSearch').insertAdjacentHTML('afterbegin', '<span class="dot"></span>');
  }
  else
  {
    if (localStorage.check_search === "true") return;
    document.getElementById('WhereToSearch').insertAdjacentHTML('afterbegin', '<span class="dot"></span>');
  }
}

function check_most_visited() {

  if (localStorage.most_visited === "true" && !localStorage.most_visited_checked) localStorage.most_visited_checked = true;
  if (localStorage.time_valuation > 7 && !localStorage.most_visited_checked) 
  {
    document.getElementById('mostVisited_div_holder').style.display = 'block';
    document.getElementById('mostVisited_div_holder').classList.remove("hidden");
    document.getElementById("sub-header").classList.remove("hidden");
    var most_div = document.getElementById("mostVisited_div");
    most_div.parentNode.classList.remove("hidden");
    most_div.innerHTML = most_visited_template;
  }
}

function check_piktab() {

  if (!localStorage.lastquery_sources_id || !localStorage.lastquery_type_id || !localStorage.last_update_time) 
  {
    // localStorage.clear();
    localStorage.removeItem('lastquery_sources_id');
    localStorage.removeItem('lastquery_type_id');
    localStorage.removeItem('last_update_time');
  }
}

function reload_piktab() {
  setTimeout(function() {
    if (!localStorage.reloadtry) localStorage.reloadtry = 0;
    if (localStorage.reloadtry > 1) 
    {
      document.querySelector("#restart_piktab").parentNode.parentNode.classList.add("hidden");
      document.querySelector("#danger_conection").classList.remove("hidden");
      localStorage.reloadtry = 0;
      $loader.hide();
      return;

    }
    else
    {
      localStorage.reloadtry ++;
    }
    load_piktab(true);
  }, 6000);
}

function check_ajax_resp(data, first_load) {
  var ls_error = false;
  if (!first_load) 
  {
    if (!(localStorage.last_update_time && !isNaN(localStorage.last_update_time))){
      localStorage.last_update_time = 0;
      ls_error = true;
    }
    if (!ls_error) 
    {
      localStorage.lastquery_sources_id.split(",").forEach(function (e) {if (ls_error) return;if (isNaN(e)) {ls_error = true;}});
      localStorage.lastquery_type_id.split(",").forEach(function (e) {if (ls_error) return;if (isNaN(e)) {ls_error = true;}});
    }

    if (ls_error) 
    {
      localStorage.removeItem('lastquery_sources_id');
      localStorage.removeItem('lastquery_type_id');
      localStorage.removeItem('last_update_time');
      console.info("errors in LS");
      document.getElementById("restart_piktab").parentNode.parentNode.classList.remove('hidden');
      $loader.hide();
    }
    if (!data.last_update || !data.sources)
    {
      if (!data.sources) 
      {
        document.getElementById("danger_conection").classList.remove('hidden');
        $loader.hide();
        return;
      }

    }
  }
  else
  {
    if (!data.last_update || !data.sources || !data.elements)
    {
      document.getElementById("danger_conection").classList.remove('hidden');
      $loader.hide();
      localStorage.removeItem('lastquery_sources_id');
      localStorage.removeItem('lastquery_type_id');
      localStorage.removeItem('last_update_time');
      return;
    }
  }

}

//                   >>SCROLL<<                   //


function _scrolling() {
  var scrollTop;
  var oldScrollTop = 0;

  // Private methods
  function infinite() {     if(!loading && document.body.scrollTop >= ((document.body.scrollHeight - window.innerHeight) - 320)) {
   $loader.show();
   if (!offset) offset = document.querySelectorAll('#element_container article').length;
   if(!isChromeExt)
   {
    if(page < 7)
    {
      page++;
      loadMore(offset); 
    }
    else
    {
      $loader.hide();
    }
  } 
  else
  {
    page++;
    loadMore(offset);
    var page_to_ga = page.toString();
    ctr_set(viewed_elements());
    _gaq.push(['_trackEvent', 'load', 'page', page_to_ga]);
  } 
}
}

function toTop() {
  var method = scrollTop > 100 ? 'add' : 'remove';

  document.getElementById('goTop').classList[method]('visible');
}

function header() {
  if(!scrolled && scrollTop != 0) {
    document.body.classList.add('piktab-mode');

    document.body.scrollTop = 0;

    scrolled = true;
  }
}

  // Public method
  this.toTop = function() {
    $('html, body').stop().animate({scrollTop: 0}, 500);
  };

  this.onChange = function() {
    scrollTop = document.body.scrollTop;

    infinite();
    toTop();
    header();
  };
}


//                   >>DATA GEST<<                   //


function isEmpty(obj) {
  for(var key in obj) {
    if(obj.hasOwnProperty(key))
      return false;
  }
  return true;
}

function typeid_to_type(id_types, singular) {


  var n = {},r=[];

  id_types.forEach(function (type_a) {
    if(type_a !== 'null' && type_a) {
      let type_to_array = type_a.split(',');
      type_to_array.forEach(function (e) {
        r.push(e);
      });
    }
  });

  var seen = {};
  var out = [];
  var len = r.length;
  var j = 0;
  for(var i = 0; i < len; i++) {
    var item = r[i];
    if(seen[item] !== 1) {
      seen[item] = 1;
      out[j++] = item;
    }
  }

  id_types = out;

  var type = [];
  id_types.forEach(function(id_type) {


    if (typeof id_type !== 'string') id_type = id_type.toString();

    // console.log(id_type);
    switch (id_type) {
      case "1":
      case "101":
      case "vector":
      type.push("vector");

      break;
      case "2":
      case "102":
      case "icon":
      case "icons":
      if (singular) 
      {
        type.push("icon");
      }
      else
      {
        type.push("icons");
      }

      break;
      case "3":
      case "103":
      case "video":
      type.push("video");

      break;
      case "4":
      case "104":
      case "photo":
      type.push("photo");

      break;
      case "5":
      case "105":
      case "texture":
      type.push("texture");

      break;
      case "6":
      case "106":
      case "mockup":
      type.push("mockup");

      break;
      case "7":
      case "107":
      case "font":
      type.push("font");

      break;
      case "8":
      case "108":
      case "sketch":
      type.push("sketch");

      break;
      case "9":
      case "109":
      case "psd":
      type.push("psd");

      break;
      case "10":
      case "110":
      case "ui kit":
      type.push("ui kit");

      break;
      case "11":
      case "111":
      case "tutorial":
      type.push("tutorial");

      break;
      case "12":
      case "112":
      case "other":
      type.push("other");

      break;
      case "13":
      case "113":
      case "footage":
      type.push("footage");

      break;
      default:
      console.error("can change to new typeid");
      console.error(id_type);
      break;
    }
  });
  return type;
}

function userSelection() {
  if (localStorage.lastquery_sources_id && localStorage.lastquery_type_id) 
  {
    var type_file_input = document.querySelectorAll('div.tags label.checkbox-right input');
    var data_sources_input = document.querySelectorAll('div.sources label.checkbox-right input');
    var userSelection_sources_id = localStorage.lastquery_sources_id;
    userSelection_sources_id = userSelection_sources_id.split(",");
    var userSelection_type_id = localStorage.lastquery_type_id;
    userSelection_type_id = userSelection_type_id.split(",");

    for (var i = data_sources_input.length - 1; i >= 0; i--) {
      if (userSelection_sources_id.indexOf(data_sources_input[i].dataset.sourceid.toString()) == -1) 
      {
        data_sources_input[i].checked = false;
      }
    }

    for (var i = type_file_input.length - 1; i >= 0; i--) {
      if (userSelection_type_id.indexOf(type_file_input[i].dataset.typeid.toString()) == -1) 
      {
        type_file_input[i].checked = false;
      }
    }
    var userSelection_object = {
      'userSelection_type_id': userSelection_type_id,
      'userSelection_sources_id': userSelection_sources_id
    };
    return userSelection_object;
  }
}

function getSources() {
  var data_sources = [];
  var data_sources_input = document.querySelectorAll('div.sources label.checkbox-right input');
  var data_sources_id = [];
  var type_file = [];
  var type_file_id = [];
  var type_file_input = document.querySelectorAll('div.tags label.checkbox-right input');
  var value = '';

  for (var i = data_sources_input.length - 1; i >= 0; i--) {
    value = data_sources_input[i].checked;
    if (value)
    {
      data_sources_id.push(data_sources_input[i].dataset.sourceid);
    }
  }
  for (var i = type_file_input.length - 1; i >= 0; i--) {
    value = type_file_input[i].checked;
    if (value)
    {
      type_file_id.push(type_file_input[i].dataset.typeid);
    }
  }

  localStorage.lastquery_sources_id = data_sources_id.toString();
  localStorage.lastquery_type_id = type_file_id.toString();
  var data_object = {
    'data_sources_id': data_sources_id,
    'type_file_id': type_file_id
  };

  return data_object;
}

function feedbackSend(id) {
  // if (grecaptcha.getResponse()) 
  // {
    var form = document.getElementById(id);
    var email_input = form[0].querySelector("#contact-email");
    var message_input = form[0].querySelector("#contact-message");
    var subject_select = form[0].querySelector("#contact-subject");

    var form_data = $(form).serializeArray();
    var data = {};

    for (var i in form_data) {
      data[form_data[i].name] = form_data[i].value;
    }
    $.ajax({
      type: "POST",
      url: APP_URL + "plugin_feedback/sendFeedback",
      data: {
        data: data
      },
      success: function() {
        $("div.alert").addClass("hidden");
        $("#form_contact").addClass("hidden");
        $(".contact_form_text").addClass("hidden");
        $("div.alert").removeClass("error").removeClass("hidden").text("Message sent. Thank you!");
        setTimeout(function() {
          /* grecaptcha.reset(); */
          $("#form_contact").removeClass("hidden");
          $(".contact_form_text").removeClass("hidden");
          $("div.alert").addClass("hidden");
          document.getElementById('form_contact').reset();
          document.getElementById('form_contact_browser').reset();
        }, 4000);
      },
      error: function() {
        $(".alert-form").removeClass("hidden").addClass("error").text("An error has occurred, please try again later");
        $("#form_contact").addClass("hidden");
      }
    });
  // }else{ 
  //   $("div.alert").removeClass("hidden").addClass("error").text("You must to check ReCAPTCHA");
  //   grecaptcha.reset();
  // }
}

function isRetina() {
  return ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx), only screen and (min-resolution: 75.6dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min--moz-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2)').matches)) || (window.devicePixelRatio && window.devicePixelRatio >= 2)) && /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
}

function collectionPrev(imgs_collection,collection_id) {

  collections_data = {};
  collections_data.id = collection_id;
  previews = [];
  previews.push(imgs_collection[0], imgs_collection[1], imgs_collection[2],imgs_collection[3]);

  collections_data.imgs = previews;
  return collections_data;
}

function updated_version() {
  if (!localStorage.version) 
  {
    localStorage.clear();
    localStorage.version = 1.02;
  }
  else
  {
    if (localStorage.version === "1.02") 
    {
      console.log("Already up to date");
    }
    else
    {
      console.log("Updating...");
      localStorage.clear();
      localStorage.version = 1.02;
    }
  }
}

function api_search_response(articles) {

  var template = '';
  var resource = document.getElementById("elements_template").innerHTML;
  var templateElement = Handlebars.compile(resource);
  articles.forEach(function(article) {
    template += templateElement(article);
  });
  if (page === 1) 
  {
    document.getElementById('element_container').innerHTML = template;
  }
  else
  {
    document.getElementById('element_container').insertAdjacentHTML('beforeend', template);
  }
  loading = false;
  if (articles.length < 5) $loader.hide();
}

function external_search_trigger(sources,types) {
  loading = true;
  external_call = true;
  types = types.split(",");
  sources = sources.split(",");
  term = document.getElementById("search-field").value;
  search_ext_merg(term, sources, types);
}

/**
* Views elements
*/
function viewed_elements() {
  var elements = document.getElementsByClassName('article_box');
  var elements_width = elements[0].clientWidth;
  var elements_height = elements[0].clientHeight;
  var elements_wrapper = elements[0].parentNode;
  var elements_wrapper_height = window.innerHeight;
  var elements_wrapper_scroll = document.body.scrollTop;
  var elements_in_row = Math.floor(elements_wrapper.clientWidth / elements_width);
  var elements_rows = Math.ceil(elements.length / elements_in_row);
  var elements_rows_height = 0;
  var elements_rows_viewed;

  for (var i = 0; i < elements_rows; i++) {
    elements_rows_height += elements_height;

    if (elements_rows_height < (elements_wrapper_height + elements_wrapper_scroll)) {
      elements_rows_viewed = i + 1;
    } else break;
  }

  return elements_rows_viewed * elements_in_row;
}
