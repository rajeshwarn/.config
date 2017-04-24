function load_piktab(reload) {
  if (!localStorage.last_update_time) localStorage.last_update_time = '0';
  if (!localStorage.lastquery_sources_id || !localStorage.lastquery_type_id) 
  {
    loading = true;
    $.ajax({
      url:  APP_URL + "api/data",
      data: {
        last_update_time: localStorage.last_update_time,
        limit_pp: limit_pp,
        user: localStorage.user_id
      },
      dataType: 'json',
      success:function(data){
        if (reload) location.reload();

        check_ajax_resp(data, true);


        settings_gen(data.sources);
        collections_gen(data.previews);
        bookmarks_get_collections(data.previews, true);
        if (!localStorage.lastquery_sources_id || !localStorage.lastquery_type_id) 
        {
          localStorage.lastquery_sources_id = user_preferences_set(data.sources);        
          localStorage.lastquery_type_id = user_preferences_set(data.types);
        }
        if (localStorage.last_update_time === data.last_update) 
        {
          success_ajax(elements_lib.queryAll("elements", {sort: [["possition", "ASC"]], limit: limit_pp, start: offset}));
          
        }
        else
        {
          if (elements_lib.tableExists("elements")) 
          {
            elements_lib.truncate("elements");
            elements_lib.commit();
          }
          if (data.error === "error") 
          {
            data_error = true
          }
          if (!data_error) 
          {
            set_lsdb_items(data.elements);
          }
          else
          {
            success_ajax(data.elements);
          }
          localStorage.last_update_time = data.last_update
        }
        localStorage.reloadtry = 0;
      },
      error: function(error) {
        reload_piktab();
      }
    });
  }
  else
  {
    data_type = localStorage.lastquery_type_id;
    data_sources = localStorage.lastquery_sources_id;
    loading = true;
    $.ajax({
      url: APP_URL + "api/data",
      data: {
        type: data_type,
        page: page,
        data_sources_id: data_sources,
        user: localStorage.user_id,
        last_update_time: localStorage.last_update_time
      },
      success:function(data){
        if (reload) location.reload();
        data = JSON.parse(data);

        check_ajax_resp(data, false);


        settings_gen(data.sources);
        if (data.previews) 
        {
          collections_gen(data.previews);
        }
        else
        {
          get_collections();
        }
        bookmarks_get_collections(data.previews, true);

        if (data.error === "error") 
        {
          data_error = true
        }
        if (elements_lib) 
        {
          if (data_error) 
          {
            success_ajax(data.elements);
          }
          else
          {
            if (elements_lib.queryAll("elements").length === 0) 
            {
              set_lsdb_items(data.elements);
            }
            else
            {
              if (localStorage.last_update_time === data.last_update) 
              {
                success_ajax(elements_lib.queryAll("elements", {sort: [["possition", "ASC"]], limit: limit_pp, start: offset}));
              }
              else
              {
                if (elements_lib.tableExists("elements")) 
                {
                  elements_lib.truncate("elements");
                  elements_lib.commit();
                }
                set_lsdb_items(data.elements);
                localStorage.last_update_time = data.last_update
              }
            }

          }

        }
        else
        {
          success_ajax(data.elements);
        }
        localStorage.reloadtry = 0;
      },
      error: function(error) {
        reload_piktab();
      }
    });
  }
}

function previews_gen(coll, gen) {
  var request;
  $.ajax({
    type: "POST",
    url: APP_URL + "api/data",
    data: {
      data: coll
    },success: function (e) {
      request = JSON.parse(e);
      if (gen) 
      {
        draw_bookmarks(request);
        collections_gen(request)
      }
      collections = request;
      document.getElementById("collections_holder").innerHTML = add_collection(request);
    },
    error: function() {
      console.log("Error, please try again later"); 
    }
  });
}

function sources_types() {
  $.ajax({
    url:  APP_URL + "plugin_sources/sourceTypes",
    dataType: 'json',
    success:function(sources){
     if (sources['graphics'].length > 0) graphics_arr = sources['graphics'].split();
     if (sources['photos'].length > 0) photos_arr = sources['photos'].split();
     if (sources['videos'].length > 0) videos_arr = sources['videos'].split();
     if (sources['tutorials'].length > 0) tutorials_arr = sources['tutorials'].split();
   }
 });
}

function loadElements(retry, offset) {
  loading = true;
  var sources_object;
  if (!localStorage.lastquery_sources_id || !localStorage.lastquery_type_id) {
    $loader.hide();
    document.getElementsByClassName("warning")[0].classList.remove("hidden");
    if (!localStorage.lastquery_type_id && !localStorage.lastquery_sources_id) {
      document.getElementsByClassName("warning")[0].classList.add("hidden");
      sources_object = getSources();
      var data_sources = sources_object.data_sources_id;
      var data_type = sources_object.type_file_id;
    }
  } else {
    sources_object = userSelection();
    data_sources = sources_object.userSelection_sources_id;
    data_type = sources_object.userSelection_type_id;
  }
  $loader.show();
  $.ajax({
    url: APP_URL + "api/data",
    data: {
      type: data_type,
      offset: offset,
      limit_pp: limit_pp,
      user: localStorage.user_id,
      data_sources_id: data_sources,
      last_update_time: localStorage.last_update_time
    },
    success: function(data) {
      success_ajax(data);
    },
    error: function() {
      if (typeof retry === 'undefined')
      {
        setTimeout(loadElements(true), 2000);
      }
    }
  });
}

function onclickHandler(e) {
  if (e.buttons > 0) 
  {
    var article = (this.classList.contains('prev_resource_title')) ? this.parentNode.parentNode.parentNode.parentNode : this.parentNode.parentNode.parentNode;
    var ident = article.getAttribute('data-id');
    var source = article.getAttribute('data-source');
    var type = article.querySelector('.author').getAttribute('data-type');
    var url = article.querySelector('.showcase__description h2 a').getAttribute('href');
    var title = article.querySelector('h2 a').innerHTML;
    _gaq.push(['_trackEvent', 'click', source, type]);
    _gaq.push(['_trackEvent', 'click_data', source, url]);
    var voted = localStorage.getItem("voted_items");
    voted = (voted) ? voted.split(",") : [];
    if (voted.lastIndexOf(ident) === -1) {
      $.ajax({
        type: "POST",
        url: APP_URL + "api/click",
        data: {
          id: ident
        }
      });
      voted.push(ident);
      localStorage.setItem("voted_items", voted.join(","));
    }
  }
}

function get_elements(force_update_elements) {
  loading = true;
  var sources_object;
  if (!localStorage.lastquery_sources_id || !localStorage.lastquery_type_id) 
  {
    $loader.hide();
    document.getElementsByClassName("warning")[0].classList.remove("hidden");
    if (!localStorage.lastquery_type_id && !localStorage.lastquery_sources_id) {
      document.getElementsByClassName("warning")[0].classList.add("hidden");
      sources_object = getSources();
      var data_sources = sources_object.data_sources_id;
      var data_type = sources_object.type_file_id;
    }
  }
  else 
  {
    sources_object = userSelection();
    data_sources = sources_object.userSelection_sources_id;
    data_type = sources_object.userSelection_type_id;
  }
  if (elements_lib.tableExists("elements")) 
  {
    elements_lib.truncate("elements");
    elements_lib.commit();
  }
  $loader.show();
  $.ajax({
    url: APP_URL + "api/data",
    data: {
      page: page,
      limit_pp: limit_pp,
      offset: offset,
      user: localStorage.user_id,
      type: data_type,
      data_sources_id: data_sources,
      last_update_time: localStorage.last_update_time,
    },
    success: function(data) {
      data = JSON.parse(data);
      if (!data.length && !data.elements) 
      {
        loadElements(false, 1);
        return;
      }
      data = data.elements;
      today_el = data.length;
      var i = 1;
      elements_lib.truncate("elements");
      data.forEach(function(e) {
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
      success_ajax(elements_lib.queryAll("elements", {sort: [["possition", "ASC"]], limit: limit_pp, start: offset}));
    }
  });
}

function ctr_set(viewed_elements) {
  // var elements_selector = document.querySelectorAll('#element_container article');
  // var elements_id = [];
  // for (var i = prev_viewed_elements; i < viewed_elements; i++) {
  //   elements_id.push(elements_selector[i].getAttribute('data-id'));
  // }
  // $.ajax({
  //   type: "POST",
  //   url: APP_URL + "api/data",
  //   data: {
  //     elements_id: elements_id
  //   }
  // });
  // prev_viewed_elements = viewed_elements;
}