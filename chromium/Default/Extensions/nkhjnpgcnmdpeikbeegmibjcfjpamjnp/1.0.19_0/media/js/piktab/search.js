function search_init() {

  if (localStorage.defaultExternalSearch) 
  {
    document.getElementById('default-search-external').parentNode.querySelector('i').className = localStorage.defaultExternalSearch;
    // document.querySelector('#WhereToSearch span.popover-btn.search-btn i').className = localStorage.defaultExternalSearch;
    document.querySelector('div.settings-group div.search span.'+localStorage.defaultExternalSearch+'').parentNode.querySelector('input').checked = true;
    // searchEngine(localStorage.defaultExternalSearch);
  }
  else
  {
    localStorage.defaultExternalSearch = 'icon-google';
    document.getElementById('default-search-external').parentNode.querySelector('i').className = localStorage.defaultExternalSearch;
    // document.querySelector('#WhereToSearch span.popover-btn.search-btn i').className = localStorage.defaultExternalSearch;
    document.querySelector('div.settings-group div.search span.icon-google').parentNode.querySelector('input').checked = true;
  }
  if (localStorage.defaultSearch) 
  {
    if (localStorage.defaultSearch === 'external') 
    {
      document.getElementById('default-search-external').checked = true;
      document.querySelector("#WhereToSearch span.search-btn").classList.add('search-default');
      document.querySelector('#WhereToSearch span.popover-btn.search-btn i').className = localStorage.defaultExternalSearch;
      searchEngine(localStorage.defaultExternalSearch);
    }
    else
    {
      document.getElementById('default-search-internal').checked = true;
      // document.querySelector("#search div.content span.search-btn.search-internal").classList.add('search-default');
      document.querySelector('div.settings-group div.search span.icon-piktab').parentNode.querySelector('input').checked = true;

      document.getElementById('search-field').placeholder = "Search in Piktab";
      searchEngine("icon-piktab");
    }
  }
  else
  {
    localStorage.defaultSearch = 'internal';
    document.getElementById('default-search-internal').checked = true;
    document.querySelector("#WhereToSearch span.search-btn").classList.add('search-default');
  }
}

function default_search(search_to) {
  if (search_to === "icon-piktab") 
  {
    localStorage.defaultSearch = "internal";
    document.querySelector("#WhereToSearch span.search-btn").classList.remove('search-default');
    document.querySelector('#WhereToSearch span.popover-btn.search-btn i').className = "icon-piktab";
    // document.querySelector("#search div.content span.search-btn.search-internal").classList.add('search-default');
    document.getElementById('search-field').placeholder = "Search in Piktab";
  }
  else
  {
    localStorage.defaultSearch = "external";
    document.querySelector("#WhereToSearch span.search-btn").classList.add('search-default');
    document.querySelector('#WhereToSearch span.popover-btn.search-btn i').className = localStorage.defaultExternalSearch;
    // document.querySelector("#search div.content span.search-btn.search-internal").classList.remove('search-default');
    searchEngine(localStorage.defaultExternalSearch);
  }
}

function search_collections(value) {
  var val_search = document.getElementById("input_search_collection").value.toLowerCase();
  var match_found = false;
  var collections_match = [];
  if (val_search != '') 
  {
    for(var index in collections) { 
      if (collections.hasOwnProperty(index)) {
        var collection = collections[index];
        var collection_lower = collection.name.toLowerCase();

      }
      if (collection_lower.indexOf(val_search) > -1) 
      {
        match_found = true;
        collections_match.push(collection);
      }
    }
    if (!match_found) 
    {
      if (document.querySelector("#collections_holder p").innerHTML === "Nothing found") return;
      document.getElementById("collections_holder").innerHTML = "<div class='alert warning'><p>Nothing found</p></div>";
    }
    else
    {
      document.getElementById("collections_holder").innerHTML = add_collection(collections_match);
    }
  }
  else
  {
    collections_match = [];
    document.getElementById("collections_holder").innerHTML = temp_col_html;
  }
}

function search_into_collections(value,col_items) {
  page = 1;
  data = value;
  sources_selected = collections_sources.join();
  type_selected = collections_tags.join();
  document.getElementById("modal_collections").dataset.idActive = 0;
  $.ajax({
    type: "GET",
    url: APP_URL + "home/searchElement",
    data: {
      data: data,
      page: page,
      where: "collections",
      collections_item: col_items,
      sources: sources_selected,
      type: type_selected
    },
    success: function(el) {
      document.getElementById('alert_noelements_in_collection').classList.add('hidden');
      data = JSON.parse(el)
      if (data !== null) 
      {
        var html = article_handle(data.data);

        document.getElementById('collections_container').innerHTML = html;
        add_settings_to_el_collection();
      }
      else
      {
        document.getElementById('alert_noelements_in_collection').classList.remove('hidden');
      }
      if (!document.getElementById('search_el_li')) 
      {
        breadcrumbs_collections.insertAdjacentHTML("beforeend", "<li id='search_el_li'>Search</li>");
      }
    },
    error: function() {
      console.log("no se ha enviado la petición");
    }
  });
}

function close_searchP() {
  page = 1;

  document.getElementById("category_tag").classList.add("hidden");
  document.getElementById("alert_nomore").classList.add("hidden");
  document.getElementById("search-field").value = "";

  searchPiktab = false;
  searchCategory = false;

  $(".showcase").hide();
  $(".showcase").fadeIn();
}

function search_submit() {
  f_page = false;
  $loader.show();
  external_call = false;
  document.getElementById('alert_nomore').classList.add('hidden');

  document.getElementById('alert_noelements').classList.add('hidden');

  var resource = document.querySelector('#WhereToSearch i').className;

  var form = document.getElementById('search-field');
  if (form.value) 
  {
    if (resource === "icon-piktab")
    {
      page = 1;
      offset = 0;
      scrolling.toTop();
      searchInPiktab(form.value);
    }
    else
    {
      document.getElementById('search-field').parentNode.parentNode.submit();
    }
  }
}

function searchEngine(resource) {
  var project = resource.split("-")[1];
  var searchForm = $("#search");
  var formInput = $("#search-field");

  if (searchEngineObjects[project].hasOwnProperty("inputTemplate")) {
    hiddenInput = searchEngineObjects[project].inputTemplate;
    document.getElementById("search")[0].insertAdjacentHTML("beforeend", hiddenInput);
  }

  searchForm = searchForm.attr("action", searchEngineObjects[project].formAction);
  formInput = formInput.attr("name", searchEngineObjects[project].inputName).attr("placeholder", searchEngineObjects[project].placeholder).attr("autocomplete", searchEngineObjects[project].autocomplete);
  
  document.getElementById("search").classList[resource === 'icon-piktab' ? 'remove' : 'add']("form-noAjax");

  if (searchEngineObjects[project].autocomplete === "on") 
  {
    if (autocomplete_el) 
    {
      searchAutoComplete.destroy();
      autocomplete_el = false;
    }
    searchAutoComplete = new autoComplete({
      selector: '#search-field',
      source: function(term, response) {
        $.ajax({
          url: "https://suggestqueries.google.com/complete/search?client=chrome&q=",
          dataType: "jsonp",
          data: {
            q: term
          },
          success: function(data) {
            response(data[1].splice(0, 5));
          }
        });
        $rootScope = '';
      }
    });
    autocomplete_el = true;
  }
  else if(resource === 'icon-piktab')
  {
    if (autocomplete_el) 
    {
      searchAutoComplete.destroy();
      autocomplete_el = false;
    }
    searchAutoComplete = new autoComplete({
      selector: '#search-field',
      source: function(term, response) {
        $.ajax({
          url: "http://www.flaticon.com/ajax/autocomplete/"+term,
          success: function(data) {
            var arr = [];
            data = JSON.parse(data);
            for(var i in data) {
              arr.push(data[i].tag);
            }
            response(arr.splice(0, 5));
          },
          error: function(data) {
            // console.log(data);
          }
        });
        $rootScope = '';
      }
    });
    autocomplete_el = true;
  }
  else if(resource === 'icon-freepik')
  {
    console.log("autoComplete de freepik");
  }
  else if(resource === 'icon-flaticon')
  {
    if (autocomplete_el) 
    {
      searchAutoComplete.destroy();
      autocomplete_el = false;
    }
    searchAutoComplete = new autoComplete({
      selector: '#search-field',
      source: function(term, response) {
        $.ajax({
          url: "http://www.flaticon.com/ajax/autocomplete/",
          data: {
            term: term
          },
          success: function(data) {
            var arr = [];

            data = JSON.parse(data);

            data.forEach(function(e) {
              arr.push(e.tag);
            });
            response(arr.splice(0, 5));
          },
          error: function(data) {
            console.log(data);
          }
        });
        $rootScope = '';
      }
    });
    autocomplete_el = true;
  }
  else if (searchEngineObjects[project].autocomplete === "off") 
  {
    if (autocomplete_el) 
    {
      searchAutoComplete.destroy();
      autocomplete_el = false;
    }
  }
  if (resource !== "icon-piktab") 
  {
    external_search = true;
    searchPiktab = false;
  }
  else
  {
    external_search = false;
  }
}

function searchInPiktab(data) {
  var term = data;
  loading = true;
  document.getElementById("category_tag").classList.add("hidden");
  searchPiktab = true;

  var sources_selected = '';
  var type_selected = '';
  if (document.querySelectorAll('li.tag').length === 0) 
  {
    sources_selected = localStorage.lastquery_sources_id;
    type_selected = localStorage.lastquery_type_id;
  }
  else
  {
    var active_filter_els = document.querySelectorAll('li#filter_tags li');
    var sources_array = [];
    var type_array = [];

    active_filter_els.forEach(function(el) 
    {
      if (el.dataset.category === "sources") 
      {
        sources_array.push(el.dataset.filterId);
      }
      else
      {
        type_array.push(el.dataset.filterId);
      }
    });

    if (sources_array.length === 0) 
    {
      sources_selected = localStorage.lastquery_sources_id;
    }
    else
    {
      sources_selected = sources_array.toString();
    }
    if (type_array.length === 0) 
    {
      type_selected = localStorage.lastquery_type_id;
    }
    else
    {
      type_selected = type_array.toString();
      if (type_selected === "0") 
      {
        type_selected = localStorage.lastquery_type_id;
      }
    }

  }

  if (external_call) 
  {
    external_search_trigger(sources_selected,type_selected);
    return;
  }
  if (page > 1) 
  {
    offset = document.querySelectorAll('article:not(.hide)').length;
  }
  $.ajax({
    type: "GET",
    url: APP_URL + "home/searchElement",
    data: {
      term: data,
      page: page,
      limit_pp: limit_pp,
      offset: offset,
      ext_page: f_page,
      last_update_time: localStorage.last_update_time,
      sources: sources_selected,
      type: type_selected
    },
    success: function(data) {
      success_ajax(data,sources_selected,type_selected);
      document.getElementById('search-field').blur();
      (data !== "null") ? _gaq.push(['_trackEvent', 'search', term, "results: true"]) : _gaq.push(['_trackEvent', 'search', term, "results: false"]);

      if (!search_piktab_done) 
      {
        document.getElementById('sub-header').classList.remove('hidden');
        document.getElementById('tags_container').classList.remove('hidden');
        document.getElementById('tags_container').style.display = 'block';
        var search_tag = filter_list_generator(term,0,"search");
        document.getElementById('filter_tags').insertAdjacentHTML('beforeend', search_tag);
        search_piktab_done = true;
      }
      else if (document.getElementById('search-term'))
      {
        document.getElementById('search-term').querySelector('span').innerHTML = document.getElementById('search-field').value
      }
    },
    error: function() {

    }
  });
}

function search_handler(data) {
  var WhereToSearch = document.querySelector("#WhereToSearch span i").className;

  if (WhereToSearch == "icon-piktab") {
    page = 1;
    searchInPiktab(data);
  } else {
    document.getElementById("search").submit();
  }
}

function searchCateg() {

  offset = (page === 1) ? 0 : document.querySelectorAll('#element_container article').length;
  loading = true;
  var data_sources_id = localStorage.lastquery_sources_id.split(",");

  var search_field = document.querySelectorAll('li#filter_tags li');

  var data_sources_id = [];
  var category = [];

  search_field.forEach(function (currentValue) {

    var filter_category = currentValue.getAttribute('data-category');

    if (currentValue.getAttribute('data-filter-id') === "0") 
    {
      if (filter_category === "sources")
      {
        data_sources_id.push(localStorage.lastquery_sources_id);
      }
      else
      {
        category.push(localStorage.lastquery_type_id);
      }
    }
    else
    {
      if (filter_category === "sources")
      {
        data_sources_id.push(currentValue.getAttribute('data-filter-id'));
      }
      else
      {
        category.push(currentValue.getAttribute('data-filter-id'));
      }
    }
    
  });

  if (category.length ===0 && data_sources_id.length === 0) 
  {
    success_ajax(elements_lib.queryAll("elements", {sort: [["possition", "ASC"]], limit: limit_pp, start: offset}));
    return;
  }

  if (data_sources_id.length === 0)
  {
    data_sources_id.push(localStorage.lastquery_sources_id);
  }
  if (category.length === 0)
  {
    category.push(localStorage.lastquery_type_id);
  }

  data_sources_id = data_sources_id.join();
  category = category.join();

  data_sources_id = data_sources_id.split(",");
  category = category.split(",");

  $.ajax({
    url: APP_URL + "api/data",
    data: {
      type: category,
      page: page,
      limit_pp: limit_pp,
      offset: offset,
      data_sources_id: data_sources_id,
      active_filtering: true,
      last_update_time: localStorage.last_update_time
    },
    success: function(data) {
      success_ajax(data);
    }
  });
}

function search_ext_merg(term, sources, types) {
  external_call = true;
  $loader.show();
  $.ajax({
    type: "GET",
    url: APP_URL + "home/externalSearch",
    data: {
      term: term,
      sources: sources,
      type: types,
      page: f_page,
      limit_pp: limit_pp,
      offset: offset
    },
    success: function(data) {
      data = JSON.parse(data);
      if (data.length > 0)
      {
        api_search_response(data)
        f_page++;
      }
      else
      {
        external_call = false;
        if (document.querySelectorAll('article').length > 0) 
        {
          document.getElementById('alert_nomore').classList.remove('hidden');
        }
        else
        {
          document.getElementById('alert_noelements').classList.remove('hidden');
        }
        $loader.hide();
      }
    },
    error: function() {

    }
  });
}