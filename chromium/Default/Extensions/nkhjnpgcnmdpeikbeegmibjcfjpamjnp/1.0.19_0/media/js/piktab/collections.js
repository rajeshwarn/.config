function move_to_collection() {
  var this_article = this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
  var this_article_id = this_article.dataset.id;
  var actual_collection = document.getElementById("modal_collections").dataset.idActive;
  var future_collection = this.dataset.id;
  var to_be_move_typeid = this_article.dataset.typeid;
  to_be_move_typeid = to_be_move_typeid.split(",");
  to_be_move_typeid = to_be_move_typeid[0];
  to_be_move_typeid = parseInt(to_be_move_typeid);
  to_be_move_typeid = to_be_move_typeid + 100;
  gr.request.patch('bookmarks/add', {'bookmark_id' : future_collection, 'content_id': this_article_id, 'content_type': to_be_move_typeid});
  gr.request.patch('bookmarks/del', {'bookmark_id' : actual_collection, 'content_id': this_article_id, 'content_type': to_be_move_typeid});
  changes_col = true;
  $(this_article).fadeOut();
}

function remove_from_collection() {
  if (this.classList.contains("remove_from_col"))
  {
    var this_article = this.parentNode.parentNode.parentNode.parentNode.querySelector('article');
    var this_article_id = this_article.dataset.id;
    var actual_collection = this.dataset.id;
    var to_be_remove_typeid = this_article.dataset.typeid;
  }
  else
  {
    var this_article = this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
    var this_article_id = this_article.dataset.id;
    var actual_collection = document.getElementById("modal_collections").dataset.idActive;
    var to_be_remove_typeid = this_article.dataset.typeid;    
  }

  to_be_remove_typeid = to_be_remove_typeid.split(",");
  to_be_remove_typeid = to_be_remove_typeid[0];
  to_be_remove_typeid = parseInt(to_be_remove_typeid);
  to_be_remove_typeid = to_be_remove_typeid + 100;
  gr.request.patch('bookmarks/del', {'bookmark_id' : actual_collection, 'content_id': this_article_id, 'content_type': to_be_remove_typeid});
  changes_col = true;

  if (this.dataset.id) 
  {
    $(this.parentNode.parentNode).fadeOut();
    var el = document.querySelector('div#collections_holder div.collection_selector[data-id="'+actual_collection+'"]');
    el.classList.remove('hidden');
  }
  else
  {    
    $(this_article).fadeOut();
  }
}

function add_settings_to_el_collection() {
  done_collection_gen = false;
  var collection_el = document.querySelectorAll('div.modal-collections div.modal-content div.showcase div#collections_container article label.collection-add');
  var settings_el = document.getElementById("popover-settings-el").innerHTML;
  var actual_collection = document.getElementById("modal_collections").dataset.idActive;
  var collections_ext = $.extend([], collections);
  collections_ext.name_this = active_collection_name;
  collections_ext.splice(actual_collection,1);
  settings_el = Handlebars.compile(settings_el);
  settings_el = settings_el(collections_ext);
  collection_el.forEach(function(el){
    el.parentNode.insertAdjacentHTML('afterbegin', settings_el);
    el.parentNode.removeChild(el);
  });
}

function collection_created(data) {
  var collection_template = "";
  var add_collection_template = document.getElementById("add_collection_template").innerHTML;

  add_collection_template = Handlebars.compile(add_collection_template);
  collection_template += add_collection_template(data.collection);

  document.getElementById("collections_holder").insertAdjacentHTML('afterbegin', collection_template);

  var html_collection = '';
  if (document.getElementById('add_new_collection')) 
  {
    var templateCollection = $('#collection_template').html();

    templateCollection = Handlebars.compile(templateCollection);
    html_collection += templateCollection(data.collection);
    document.getElementById('add_new_collection').insertAdjacentHTML("afterend", html_collection);
  }
  else
  {
    var templateCollection = $('#create_in_template').html();
    templateCollection = Handlebars.compile(templateCollection);
    html_collection += templateCollection(data.collection);
    var elements_in = document.querySelectorAll('#collections_container article');
    elements_in.forEach(function (el) {
      el.querySelector('.create-in-element').insertAdjacentHTML("afterend", html_collection)
    })
  }
  get_collections(gr.auth.me.id);
}

function create_new_collection(in_element) {
  if (in_element) 
  {
    var form = document.querySelector('#collections_container div.active form.create-in-element');
    var collection_name = form.querySelector("input.collection-name").value;
    form.querySelector("input.collection-name").value = "";
  }
  else if (document.querySelector('#modal-collections').checked) 
  {
    var form = document.getElementById('create_collection_2');
    var collection_name = form.querySelector("#collection-name_2").value;
    form.querySelector("#collection-name_2").value = "";
  }
  else
  {
    var form = document.getElementById('create_collection');
    var collection_name = form.querySelector("#collection-name").value;
    form.querySelector("#collection-name").value = "";
  }
  gr.request.post('bookmarks/collections', {'name': collection_name, 'type': 3});
}

function add_collection(collections) {

  var collection_template = "";
  var add_collection_template = document.getElementById("add_collection_template").innerHTML;
  add_collection_template = Handlebars.compile(add_collection_template);
  for(var index in collections) { 
    if (collections.hasOwnProperty(index)) {
      var collection = collections[index];
    }
    if (add_collection_template(collection)) 
    {
      collection_template += add_collection_template(collection);
    }
  }
  return collection_template;
}

function collection_filter(id_array, data_array, filter) {

  var template_list_col = document.getElementById('filter-list-el').innerHTML;
  var template_list_col = Handlebars.compile(template_list_col);
  var template_filter = '';

  if (id_array.length === data_array.length) 
  {
    filter_array = [];
    if (filter === "tags") 
    {
      for (var i = 0; i < id_array.length; i++){
        filter_array[i] = {'filter_id':id_array[i], 'filter_idst':data_array[i], 'fitler_name':data_array[i],'filter_type':'tags' };
        template_filter += template_list_col(filter_array[i]);
      }
      document.querySelector('#filter-tags-col ul.filter').insertAdjacentHTML("beforeend", template_filter);
    }
    else
    {
      for (var i = 0; i < id_array.length; i++){
        filter_array[i] = {'filter_id':id_array[i], 'filter_idst':data_array[i], 'fitler_name':data_array[i],'filter_type':'sources' };
        template_filter += template_list_col(filter_array[i]);
      }
      document.querySelector('#filter-source-col ul.filter').insertAdjacentHTML("beforeend", template_filter);
    }
  }
}

function collections_gen(collections) {
  if (collections) 
  {
    if (!done_collection_gen) 
    {
      var html_collection = '';
      var collections_imgs = [];
      var templateCollection = $('#collection_template').html();
      templateCollection = Handlebars.compile(templateCollection);
      var all_type_col = [];
      var all_source_data_col = [];
      var all_source_id_col = [];


      for(var index in collections) { 
        if (collections.hasOwnProperty(index)) {
          var collection = collections[index];
        }
        var type_id = [];
        var preview_col = [];
        var imgs_collection = [];
        var items_collection = collection.items;
        items_collection.forEach(function (item) {
          imgs_collection.push(item.content);
          type_id.push(item.type);
          if(all_type_col.indexOf(item.type) < 0) all_type_col.push(item.type);
          if(all_source_id_col.indexOf(item.id_source) < 0)
          {
            if (item.id_source) 
            {
              all_source_id_col.push(item.id_source);
            }
          }
          if (item.mini) 
          {
            preview_col.push(item.mini);

          }
          else 
          {
            preview_col.push(item.url);
          }
        });
        preview_col = preview_col.slice(0, 3);

        

        collection.types = typeid_to_type(type_id);
        collection.previews = preview_col;
        collections_imgs.push(collectionPrev(imgs_collection,collection.id));


        if (templateCollection(collection)) 
        {
          html_collection += templateCollection(collection);
        }
      }
      all_source_id_col.forEach(function(e) {
        sources_obj.forEach(function(so) {
          if (e === so.id) 
          {
            all_source_data_col.push(so.name);
          }
        });
      });
      all_type_col_data = typeid_to_type(all_type_col);
      collections_sources = all_source_id_col;
      collections_tags = all_type_col;

      collection_filter(all_type_col, all_type_col_data,"tags");
      collection_filter(all_source_id_col, all_source_data_col,"sources");
      document.getElementById("modal_collections").dataset.idActive = "";
      document.getElementById('collections_container').innerHTML = templateNewCollection+html_collection;

      var create_collection_2 = new _form(document.getElementById('create_collection_2'), {
        insertError: 'before'
      });
      create_collection_2.callback = function() {
        create_new_collection();
      }
      done_collection_gen = true;
      collections_item = [];
      for(var i in collections) {
        collections[i].items.forEach(function(item) {
          collections_item.push(item.content);
        });
      }
      collections_item = collections_item.join();
    }
  }
}

function collections_add_reset() {

  document.querySelectorAll('div#collections_holder div.collection_selector').forEach(function(e) {
    e.classList.remove("hidden");

  });
  document.getElementById('in_collections_holder').innerHTML = '';
  document.getElementById('text_in_collection').classList.add("hidden");
}

function external_to_collection(article,to_be_added_typeid,collection_id) {
  var element = {};
  element.source = article.getAttribute('data-source');
  element.source_id = document.querySelector('#check_'+element.source+'').dataset.filterId;
  element.type_id = article.getAttribute('data-typeid');
  element.rating = article.getAttribute('data-rating');
  element.url = article.querySelector('div.showcase__image a').getAttribute('href');
  element.img = article.querySelector('div.showcase__image a').getAttribute('style').match(/url\(([^)]+)\)/i)[1];
  element.title = article.querySelector('h2 a').innerText;
  element.collection_id = collection_id;
  var ificons = article.querySelector('span.badge-number');
  if (ificons) 
  {
    element.ificons = ificons.innerHTML.split(" ")[0];
  }
  $.ajax({
    type: "POST",
    url: APP_URL + "api/collections/add",
    data:{
      data: element
    }
  });
}

function bookmarks_item_add_callback(data){
  if (!data.success) {
    document.querySelector("#collections_holder").innerHTML = "<div class='alert warning'><p>An error was encountered while saving; Please try again later</p></div>";
  }
}

function bookmarks_item_del_callback(data){
  if (data.success)
  { 
    document.querySelectorAll('article[data-id="'+ data.content_id +'"]').forEach(function(el) {
      el.classList.remove("in-collection");
    })
    get_collections(gr.auth.me.id);
  }
}

function bookmarks_del_callback(data) {
  return data.success;
}

function bookmarks_get_collections(data, load){

  if (!load) 
  {
    data = data.collections;
    previews_gen(data, true);
  }
  else
  {
    document.querySelector('div#account_settings label.collections').classList.remove("hidden");
    if (data) 
    {
      document.getElementById("collections_holder").innerHTML = add_collection(data);
    }
    collections = data;
  }
}

function draw_bookmarks(collections){
  if (collections) 
  {
    $.each(collections, function(index, value) {
      value.items.forEach(function(e)
      {
        if (document.querySelector('article[data-id="'+ e.content +'"]')) 
        {
          document.querySelector('article[data-id="'+ e.content +'"]').classList.add("in-collection");
        }
      });
    });
  }
}

function back_to_collections() {
  document.getElementById('in_collection_search').value = '';
  document.getElementById("breadcrumbs_collections").innerHTML = "<li>Collections</li>";
  document.getElementById('in_collection_search').placeholder = "Search in your collections";
  // document.getElementById("back_collections").disabled = true;
  document.getElementById('alert_noelements_in_collection').classList.add('hidden');
  changes_col = false;
}

function go_to_collection(this_collection_name,this_collection_id) {
  var breadcrumbs_collections = document.getElementById("breadcrumbs_collections");
  var collection = collections[this_collection_id];
  if(collection === undefined){
    document.getElementById('collections_container').innerHTML = "";
    breadcrumbs_collections.insertAdjacentHTML("beforeend", "<li>"+this_collection_name+"</li>");
    done_collection_gen = false;
  }
  else
  {
    var items = [];
    var temp_id = '';
    collection.items.forEach(function(collection) {
      temp_id = collection.content;
      items.push(temp_id);
    });
    items = items.join(",");
    $.ajax({
      type: "POST",
      url: APP_URL + "api/collections",
      data:{
        data: items
      },
      success: function(elements_col) {
        elements_col = JSON.parse(elements_col)
        collection_item = [];
        if (elements_col) 
        {
          elements_col.forEach(function(el) {
            collection_item.push(el.id);
          });
        }
        collection_item = collection_item.join();
        if (elements_col) 
        {
          var html = article_handle(elements_col);         
        }
        else
        {
          var html = "<h3 class='text-center'>You don't have any items in this collection yet.</h3>";
        }
        if (document.querySelector('#modal_collections').dataset.idActive !== "0")
        {
          breadcrumbs_collections.insertAdjacentHTML("beforeend", "<li data-id-collection="+this_collection_id+">"+this_collection_name+"</li>");
          document.getElementById('in_collection_search').placeholder = "Search in "+this_collection_name;
        }
        else
        {
          var list = document.querySelector('#breadcrumbs_collections'), item = list.lastElementChild;
          list.removeChild(item);
        }
        document.getElementById("modal_collections").dataset.idActive = this_collection_id;
        // document.getElementById("back_collections").disabled = false;
        document.getElementById('collections_container').innerHTML = html;
        add_settings_to_el_collection();

        var create_in_element = true;
        var create_collection = new _form(document.querySelectorAll('.create-in-element'), {
          insertError: 'before'
        });
        create_collection.callback = function() {
          create_new_collection(create_in_element);
        }


      }
    });
  }
}