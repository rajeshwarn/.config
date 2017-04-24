function load_event_user_handlers() {


  //                   >>HEADER ACTIONS<<                   //


  $(document).on("change","div.account_settings-left div.filter-container li", function () {

    document.getElementById('tags_container').classList.remove('hidden');
    document.getElementById('sub-header').classList.remove('hidden');
    document.getElementById('tags_container').style.display = 'block';
    
    document.getElementById('alert_nomore').classList.add("hidden");
    offset = 0;
    page = 1;
    f_page = false;
    prev_viewed_elements = 0;
    searchCategory = true;

    scrolling.toTop();

    var check_filter = this.querySelector('input').getAttribute('id').replace( 'check_', 'tag_');
    var category = this.querySelector('input').getAttribute('name');
    var checked_filter = '';



    if (this.querySelector('input').checked) 
    {
      checked_filter = true;
      var filter_by = this.querySelector('label.check');
      var text = filter_by.innerText || filter_by.textContent;
      var filter_id = filter_by.querySelector('label input').getAttribute('data-filter-id');
      var filter_tag = filter_list_generator(text,filter_id,category);
      document.getElementById('filter_tags').insertAdjacentHTML('beforeend', filter_tag);
      if (searchPiktab) 
      {
        var searchTerm = (document.getElementById("search-field").value != '') ? document.getElementById("search-field").value : false;
        searchInPiktab(searchTerm);
      }
      else
      {
        searchCateg();
      }
      _gaq.push(['_trackEvent', 'active_filtering', category, check_filter]);
    }
    else
    {
      checked_filter = false;
      var child = document.getElementById(check_filter);
      child.parentNode.removeChild(child);
      if (searchPiktab) 
      {
        var searchTerm = (document.getElementById("search-field").value != '') ? document.getElementById("search-field").value : false;
        searchInPiktab(searchTerm);
      }
      else
      {
        searchCateg();
      }
      subheader_remove();
    }
  });
  $(document).on("click",'li#filter_tags li.tag button.tag-remove',function(){
    offset = 0;
    page = 1;
    f_page = false;
    prev_viewed_elements = 0;

    document.getElementById('alert_nomore').classList.add("hidden");
    if (this.classList.contains('close_search')) 
    {
      document.getElementById("search-field").value = "";
      searchPiktab = false;
      search_piktab_done = false;
      this.parentNode.parentNode.removeChild(this.parentNode);
    }
    else
    {


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
      var child = this.parentNode;
      var class_child = child.getAttribute('id').replace('tag_', 'check_');
      document.getElementById(class_child).checked = false;
      child.parentNode.removeChild(child);
    }
    if (searchPiktab) 
    {
      var searchTerm = (document.getElementById("search-field").value != '') ? document.getElementById("search-field").value : false;
      searchInPiktab(searchTerm);
    }
    else
    {
      searchCateg();
    }
    subheader_remove();
  });
  $(document).on("click", "#WhereToSearch li span.search", function(e) {
    var active = $(this).parents().children(".popover-btn").children("i");
    searchTo = $(this).children("i").attr("class");
    active = active.attr("class", searchTo);
    $(this).parents().removeClass("active");
    $("#search-field").focus();
  });
  $(document).on("click", "#trigger-search", function(e) {

    search_submit();

    e.preventDefault();
  });
  $(document).on("click", "#WhereToSearch", function() {
    if (this.querySelector('span.dot')) 
    {
      this.querySelector('span.dot').classList.add('hidden');
    }
    localStorage.check_search = true;
    var resource = document.querySelector('#WhereToSearch i').className;
    searchEngine(resource);
  });
  $(document).on("submit", "#search", function(e) {
    external_call = false;
    search_submit();
    e.preventDefault();
  });
  $('.logout').on("click", function() {
    gr.auth.logout();
  });
  $(document).on("click", ".singout", function(e) {
    e.preventDefault();
    signOut();
    $(this).removeClass("singout").html("Sign In");
  });
  $(window).on("keyup", function(e) {
    var isTitleVisible = !document.getElementById('category_tag').classList.contains('hidden');
    if (e.keyCode === 27 && isTitleVisible) close_searchP();
  });
  $(".more").on("click", function() {
    window.chrome.tabs.update({
      "url": "chrome://apps/"
    });
  });
  $(".close_search").on("click", close_searchP);
  $(document).on("click", ".app-container", function() {
    var app_id = $(this).attr("data-app-id");
    chrome.management.launchApp(app_id);
  });
  $(document).on("click", "main article.article_box li.category", function() {
    document.getElementById('alert_nomore').classList.add("hidden");

    if (page > 1 && searchCategory === true) 
    {
      $('html, body').stop().animate({scrollTop: 0}), 500
    } 
    else 
    {
      offset = 0;
      page = 1;
      checked_filter = '';
      term = this.childNodes[2].nodeValue;
      term = term.replace(/\s+/g, '');
      if (term === "uikit") term = "ui kit";
      var category_id = '';
      switch (term) 
      {
        case "vector":
        filter_element = "Vector";
        category_id = "101";
        break;
        case "icons":
        filter_element = "Icons";
        category_id = "102";
        break;
        case "video":
        filter_element = "Video";
        category_id = "103";
        break;
        case "photo":
        filter_element = "Photo";
        category_id = "104";
        break;
        case "texture":
        filter_element = "Texture";
        category_id = "105";
        break;
        case "mockup":
        filter_element = "Mockup";
        category_id = "106";
        break;
        case "font":
        filter_element = "Font";
        category_id = "107";
        break;
        case "sketch":
        filter_element = "Sketch";
        category_id = "108";
        break;
        case "psd":
        filter_element = "Psd";
        category_id = "109";
        break;
        case "ui kit":
        filter_element = "Ui Kit";
        category_id = "110";
        break;
        case "tutorial":
        filter_element = "Tutorial";
        category_id = "111";
        break;
        case "other":
        filter_element = "Other";
        category_id = "112";
        break;
        default:

        break;
      }

      document.getElementById('tags_container').classList.remove('hidden');
      document.getElementById('sub-header').classList.remove('hidden');
      document.getElementById('tags_container').style.display = 'block';
      var check_filter = document.getElementById('check_'+filter_element.replace(/\s/g, '_').toLowerCase()+'');
      var searchTerm = (document.getElementById("search-field").value != '') ? document.getElementById("search-field").value : false;
      if (!document.getElementById('tag_'+filter_element.replace(/\s/g, '_').toLowerCase()+''))
      {
        _gaq.push(['_trackEvent', 'active_filtering', 'tags', check_filter.getAttribute('id')]);
        check_filter.checked = true;
        checked_filter = true;
        var filter_tag = filter_list_generator(filter_element, category_id, "tags");
        document.getElementById('filter_tags').insertAdjacentHTML('beforeend', filter_tag);        
        if (searchPiktab) 
        {
          searchInPiktab(searchTerm);
        }
        else
        {
          searchCateg();
        }
      }
      else
      {
        checked_filter = false;
        var child = document.getElementById(check_filter);
        if (searchPiktab) 
        {
          searchInPiktab(searchTerm);
        }
        else
        {
          searchCateg();
        }
        subheader_remove();
      }
      term = category_id;
    }
    scrolling.toTop();
  });
  $(document).on("click", "li#tag_remove", function() {
    search_piktab_done = false;
    searchPiktab = false;
    external_call = false;
    page = 1;
    f_page = false;
    prev_viewed_elements = 0;
    offset = 0;

    $(".showcase").hide();

    document.getElementById('filter_tags').innerHTML = '';
    var check_box_filter = document.querySelectorAll('div.filter-container ul li input');
    check_box_filter.forEach(function(e) {
      e.checked = false;
    });

    searchCateg();
    subheader_remove();
    close_searchP();
    document.getElementById('alert_nomore').classList.add("hidden");

    $(".showcase").fadeIn();
  });
  $(document).on("click", "div.menu ul li label[for=menu-sources]" , function() {
    if (this.querySelector('.dot')) 
    {
      document.querySelector('span.dot').classList.add("hidden");
      this.querySelector('.dot').classList.add("hidden");

      var old_sources = localStorage.all_sources_id.split(",");
      sources_obj.forEach(function(e) {
        if (e.active === "1") 
        {
          if (old_sources.indexOf(e.id) === -1) 
          {
            localStorage.all_sources_id += "," + e.id;
          }
        }
      });

    }
  });
  $("#restart_piktab").on("click", function (e) {
    e.preventDefault();
    if (localStorage.reloadtry > 5) 
    {
      document.querySelector("#restart_piktab").parentNode.parentNode.classList.add("hidden");
      document.querySelector("#danger_conection").classList.remove("hidden");
      localStorage.reloadtry = 0;

    }
    else
    {
      localStorage.reloadtry ++;
    }
    getSources();
    load_piktab();
  });


  //                    >>SETINGS ACTIONS<<                   //


  $('div.menu ul li').on("click",aside_active);
  $(document).on("click","label[for=menu-settings]",function() {
    if (document.querySelector('div.menu ul li label[for=menu-settings] span.dot')) 
    {
      document.querySelector('div.menu ul li label[for=menu-settings] span.dot').classList.add('hidden');
      document.querySelector('#btn-settings span.dot').classList.add('hidden');
    }
    localStorage.show_settings = true;
  });
  $('#most-visited').on('change', function() {
    if (this.parentNode.querySelector('span.dot')) 
    {
      this.parentNode.querySelector('span.dot').classList.add('hidden');
    }
    most_visited_granted_permissions();
  });
  $('#piktab-view').on("change",function(){
    var piktab_view = this.checked;
    if (piktab_view) {
      localStorage.piktab_view = true;
    } else {
      localStorage.piktab_view = false;
    }
  });
  $('#homepage').on("change",function() {
    var homepage = this.checked;
    if (!homepage) 
    {
      localStorage.homepage = false;
      _gaq.push(['_trackEvent', 'homepage', 'Piktab', 'false']);
    }
    else
    {
      document.getElementById("homepage").checked = true;
      localStorage.homepage = true;
      _gaq.push(['_trackEvent', 'homepage', 'Piktab', 'true']);
    }
  });
  $(document).on("change", "div.group div.content label.checkbox-right", function() {
    check_siblings(this);
  });
  $('.apply_button').on("click", function() {
    search_piktab_done = false;
    searchPiktab = false;
    external_call = false;
    page = 1;
    f_page = false;
    prev_viewed_elements = 0;
    offset = 0;
    localStorage.last_update_time = 0;
    if (apply_button[0].disabled) 
    {
      check_siblings();

    }
    if (apply_button[1].disabled) 
    {
      check_siblings();
    }


    document.getElementById("alert_nomore").classList.add("hidden");
    var sources_object = getSources();
    if (!localStorage.lastquery_sources_id ||  !localStorage.lastquery_type_id) 
    {
      $("main .article_box").remove();
      $loader.hide();
      document.getElementsByClassName("warning")[0].classList.remove("hidden");
    }
    else 
    {
      document.getElementsByClassName("warning")[0].classList.add("hidden");
      get_elements(true);      
    }
    apply_button[0].disabled = true;
    apply_button[1].disabled = true;

    filter_constructor();
    var warning_rem = document.querySelectorAll('.rem_changes');
    warning_rem.forEach(function(e) {e.classList.add('hidden');});
  });
  $('.select_button').on("click", function() {
    var where = document.querySelector('div.menu ul li.active label').getAttribute('for');
    if(where === 'menu-sources')
    {
      var sources_input = document.querySelectorAll('div.sources label.checkbox-right input');
      for (var i = sources_input.length - 1; i >= 0; i--) 
      {
        sources_input[i].checked = true;
      } 
      apply_button[0].disabled = false;
    }
    else
    {
      var tag_input = document.querySelectorAll('div.tags label.checkbox-right input');
      for (var i = tag_input.length - 1; i >= 0; i--) 
      {
        tag_input[i].checked = true;
      } 
      apply_button[1].disabled = false;
    }
  });
  $('.unselect_button').on("click", function() {
    apply_button[0].disabled = true;
    apply_button[1].disabled = true;
    var where = document.querySelector('div.menu ul li.active label').getAttribute('for');
    if(where === 'menu-sources')
    {
      var sources_input = document.querySelectorAll('div.sources label.checkbox-right input');
      for (var i = sources_input.length - 1; i >= 0; i--) {
        sources_input[i].checked = false;
      } 
    }
    else
    {
      var tag_input = document.querySelectorAll('div.tags label.checkbox-right input');
      for (var i = tag_input.length - 1; i >= 0; i--) {
        tag_input[i].checked = false;
      } 
    }
  });
  $(document).on("change", 'input[name="default-external-search"]', function(e) {
    if (this.getAttribute('value') === "piktab") 
    {
      localStorage.defaultSearch = "internal";
    }
    else
    {
      localStorage.defaultSearch = "external";
    }

    localStorage.defaultExternalSearch = document.getElementById('default-search-external').parentNode.querySelector('i').className = "icon-"+this.getAttribute('value');
    document.querySelector('#WhereToSearch span.popover-btn.search-btn i').className = "icon-"+this.getAttribute('value');

    searchEngine(localStorage.defaultExternalSearch);
  });
  $(document).on("click", "#default-search label", function() {

    default_search(this.className);
    external_search = false;

    localStorage.defaultSearch = "internal";
  });
  $(document).on("click",'div.menu ul #menu-account',function() {
    var href_login = 'https://profile.piktab.com/me';
    window.location.href = href_login;
  });
  $(document).on("click",'button.question_faq', function () {
    this.parentNode.querySelector('div.text').classList.toggle("hidden");
  });
  $(document).on("click", "p.copyright label[for=menu-unistall]", function() {
    if (document.querySelector('.menu .active').classList) 
    {
      document.querySelector('.menu .active').classList.remove('active');
    }
  });
  $(document).on("change", 'div.settings-submenu-content label.label-switch input[type="checkbox"]', function () {
    this.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('.rem_changes').classList.remove('hidden')
  })


  //                    >>ELEMENTS ACTIONS<<                   //


  $(document).on("mousedown click", ".track-event, .video__play", onclickHandler);

  $(document).on("mousedown click", ".author a", function(e) {
    if (e.type == "click") 
    {
      e.preventDefault();
      return false; 
    }
    if (e.which !== 3) 
    {
      window.open(this.href);
      source = this.getAttribute('data-source');
      type = this.getAttribute('data-type');
      _gaq.push(['_trackEvent', 'click', source, type]);
    }
  });
  $(document).on("click", ".btn-facebook", function(e) {
    e.preventDefault();
    
    window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
    if (this.parentNode.parentNode.parentNode.parentNode.dataset.id) 
    {
      _gaq.push(['_trackEvent','share', 'facebook', this.parentNode.parentNode.parentNode.parentNode.dataset.id]);
    }
    else
    {
      _gaq.push(['_trackEvent','share', 'facebook', 'piktab']);

    }

    return false;
  });
  $(document).on("click", ".btn-google", function(e) {
    e.preventDefault();
    
    window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
    if (this.parentNode.parentNode.parentNode.parentNode.dataset.id) 
    {
      _gaq.push(['_trackEvent','share', 'google', this.parentNode.parentNode.parentNode.parentNode.dataset.id]);
    }
    else
    {
      _gaq.push(['_trackEvent','share', 'google', 'piktab']);

    }

    return false;
  });
  $(document).on("click", ".btn-twitter", function(e) {
    e.preventDefault();
    
    window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
    if (this.parentNode.parentNode.parentNode.parentNode.dataset.id) 
    {
      _gaq.push(['_trackEvent','share', 'twitter', this.parentNode.parentNode.parentNode.parentNode.dataset.id]);
    }
    else
    {
      _gaq.push(['_trackEvent','share', 'twitter', 'piktab']);
    }

    return false;
  });
  $(document).on("click", ".btn-pinterest", function(e) {
    e.preventDefault();
    window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
    if (this.parentNode.parentNode.parentNode.parentNode.dataset.id) 
    {
      _gaq.push(['_trackEvent','share', 'pinterest', this.parentNode.parentNode.parentNode.parentNode.dataset.id]);
    }
    else
    {
      _gaq.push(['_trackEvent','share', 'pinterest', 'piktab']);

    }

    return false;
  });

  
  //                    >>COLLECTIONS ACTIONS<<                   //


  $(document).on('click', '.showcase__description', function(e) {
    if (e.target.classList.contains('title-edit')) 
    {
     var input = this.parentNode.getElementsByClassName('title-edit')[0];
     this.parentNode.parentNode.querySelector('.icons-number').classList.add("hidden")
     input.disabled = false;

     input.focus();
     input.select();
   }
 });
  $(document).on('click', '.btn-title-edit', function() {
    var input = this.parentNode.getElementsByClassName('title-edit')[0];
    this.parentNode.parentNode.querySelector('.icons-number').classList.add("hidden")
    input.disabled = false;

    input.focus();
    input.select();
  });
  $(document).on('focusout', '.title-edit', function() {
    this.disabled = true;
    var new_name = this.value;
    var id_col = this.parentNode.parentNode.parentNode.dataset.id;
    this.parentNode.parentNode.querySelector('.icons-number').classList.remove("hidden");
    if (this.getAttribute('value') !== new_name) 
    {
      gr.request.patch('bookmarks', {'id' : id_col, 'name': new_name, 'type': 3});      
      changes_col = true;
    }
  });
  $(document).on("click",".collection_box .view_collection", function(e){
    document.getElementById('alert_noelements_in_collection').classList.add('hidden');
    document.getElementById('in_collection_search').value = '';
    var collection = this.parentNode.parentNode.parentNode;
    active_collection_id = collection.dataset.id;
    active_collection_name = collection.querySelector('input.title-edit').value;
    go_to_collection(active_collection_name,active_collection_id);
    if (changes_col)
    {
      get_collections(gr.auth.me.id);
      changes_col = false;
    }
  });
  $(document).on("click","#back_collections, #breadcrumbs_collections li",function(){
    if (this.getAttribute('id') === 'back_collections' && !this.parentNode.parentNode.parentNode.parentNode.parentNode.dataset.idActive) 
    {
      document.querySelector('div.header-right label.modal-close').click();
    }
    document.getElementById('alert_noelements_in_collection').classList.add('hidden');

    if (this.innerHTML === "Collections") 
    {
      if (changes_col)
      {        
        collections_gen(collections);
        changes_col = false;
      }
      else
      {
        collections_gen(collections);
      }
      back_to_collections();
    }
    else if(this.dataset.idCollection)
    {
      if (document.querySelector('#modal_collections').dataset.idActive !== this.dataset.idCollection) 
      {
        go_to_collection(active_collection_name,active_collection_id);
        active_collection_name = '';
        active_collection_id = '';
      }
    }
    else
    {
      var where_is = document.querySelectorAll('ul#breadcrumbs_collections li');

      if (where_is.length === 3) 
      {
        go_to_collection(active_collection_name,active_collection_id);
      }
      else if(where_is.length === 2)
      {
        if (changes_col)
        {
          get_collections(gr.auth.me.id);
          collections_gen(collections);
          changes_col = false;
        }
        else
        {
          collections_gen(collections);
        }
        back_to_collections();
      }
    }
  });
  $(document).on("click",".collection-add", function(){
    var element_to_add = this.parentNode.parentNode.parentNode;
    var element_box = element_to_add.outerHTML;

    var element_id = element_to_add.dataset.id;

    var in_collection = [];

    var remove_template = document.getElementById('remove_from_col').innerHTML;
    var remove_template = Handlebars.compile(remove_template);

    document.getElementById("add_collections_container").innerHTML = element_box;
    document.querySelector("#add_collections_container article").classList.add("nohover");
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

      if (element_to_add.classList.contains('in-collection')) 
      {
        for (var i in collections)
        {
          collections[i].items.forEach(function(e) {

            if (element_id === e.content) 
            {
              document.getElementById('text_in_collection').classList.remove("hidden");
              var el = document.querySelector('div#collections_holder div.collection_selector[data-id="'+e.bookmark+'"]');
              el.collection_name = el.querySelector('p').innerHTML;
              el.classList.add('hidden');
              el.bookmark = e.bookmark;
              el.div = remove_template(el);
              document.getElementById('in_collections_holder').insertAdjacentHTML("beforeend", el.div);
            }
          });
        }
      }
      temp_col_html = document.getElementById("collections_holder").innerHTML;
    }
    else
    {
      var to_hide = document.querySelector('div.modal-collections-add div.collections-add-inner');
      var div_not_logged = document.getElementById('not_logged').innerHTML;
      if (!to_hide.querySelector('div.add-settings').classList.contains('hidden')) 
      {
        to_hide.querySelector('div.add-settings').innerHTML = div_not_logged;
        document.getElementById('sign_not_logged').setAttribute('href', document.getElementById('btn-account').getAttribute('href'));
        document.getElementById('sign_not_logged_alert').setAttribute('href', document.getElementById('btn-account').getAttribute('href'));
      }
    }
  });
  $(document).on("click","button.submit-remove-col",function(e) {
    e.stopPropagation();
    var this_article = this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
    var id_el = this_article.dataset.id;
    gr.request.delete('bookmarks', {'id': id_el, 'type': 3});
    $(this_article).fadeOut();
  });
  $(document).on("click",".icon-collections",function(){
    if (changes_col)
    {
      get_collections(gr.auth.me.id);
      changes_col = false;
    }
  });
  $(document).on("click", ".add_to_collection",function(){
    var to_be_added = document.querySelector(".photo-holder .showcase article").dataset.id;
    var to_be_added_typeid = document.querySelector(".photo-holder article").dataset.typeid;
    to_be_added_typeid = parseInt(to_be_added_typeid.split(",")[0],10) + 100;
    _gaq.push(['_trackEvent','add_to_collection', to_be_added, to_be_added_typeid.toString()]);
    var collection_name = this.parentNode.querySelector("p").innerHTML;
    var collection_id = this.dataset.id;
    var name_pik = document.querySelector(".photo-holder .showcase article .prev_resource_title").innerHTML;
    if (to_be_added.split("_")[0] === "00") 
    {
      var element = document.querySelector('article[data-id="'+to_be_added+'"]')
      external_to_collection(element,to_be_added_typeid,collection_id);
    }
    else
    {
      gr.request.patch('bookmarks/add', {'bookmark_id' : collection_id, 'content_id': to_be_added, 'content_type': to_be_added_typeid});
    }
    document.querySelector('article[data-id="'+ to_be_added +'"]').classList.add("in-collection");
    document.querySelector("#collections_holder").innerHTML = "<div class='alert success'><p>"+ name_pik +"</p><p>Added to: "+collection_name+"</p></div>";
    done_collection_gen = false;
    changes_col = true;
    setTimeout(function(){
      document.body.classList.remove('unscrollable');
      document.getElementById('modal-collections-add').checked = false;
      collections_add_reset();
      if (changes_col)
      {
        get_collections(gr.auth.me.id);
        changes_col = false;
      }
      document.getElementById("collections_holder").innerHTML = add_collection(collections);
    },1500);
  });
  $(document).on("keyup","#input_search_collection",search_collections);
  $(document).on("click",".delete-el", function() {
    this.parentNode.querySelector('div.confirm-delete').style.display = 'block';
  });
  $(document).on("click","button.submit-remove , div#in_collections_holder button.remove_from_col",remove_from_collection);
  $(document).on("click","button.cancel-remove",function (e) {
    e.stopPropagation();
    this.parentNode.parentNode.parentNode.classList.remove("active")
    // if (document.querySelector('#modal_collections').dataset.idActive)  
    // {
      // this.parentNode.parentNode.parentNode.querySelector('div.confirm-delete').style.display = 'none';
    // }
  });
  $(document).on("click",".move_to_collection",move_to_collection);
  $(document).on("change","#modal-collections-add", function(e) {

    if (changes_col)
    {
      get_collections(gr.auth.me.id);
      done_collection_gen = false;
      collections_gen(collections);
      changes_col = false;
    }
    if (!document.getElementById('modal-collections-add').checked) 
    {
      collections_add_reset();
    }
  });
  $(document).on("change","#modal-collections",function() {
    if (changes_col)
    {
      get_collections(gr.auth.me.id);
      changes_col = false;
    }
    else
    {
      collections_gen(collections);
    }
  });
  $(document).on("submit","#search_collection_form",function(e) {
    e.preventDefault();

    document.getElementById('alert_noelements_in_collection').classList.add('hidden');

    if (document.getElementById('in_collection_search').value) 
    {
      if (!document.querySelector('#modal_collections').dataset.idActive || document.querySelector('#modal_collections').dataset.idActive === "0")
      {
        search_into_collections(document.getElementById('in_collection_search').value,collections_item);
      }
      else
      {
        document.getElementById('collections_container').innerHTML = ''

        search_into_collections(document.getElementById('in_collection_search').value,collection_item);
      }
      // document.getElementById("back_collections").disabled = false;
    }
  });


  //                    >>VIEW ACTIONS<<                   //


  $(document).on("click", '.install', function() {
    if (this.className.indexOf('login_landing') === -1) 
    {
      position = this.getAttribute('data-position');
      _gaq.push(['_trackEvent', 'landing', 'install', position]);
      chrome.webstore.install();
    }
  });
  $(window).on("scroll", scrolling.onChange);
  $(document).on("click", '#goTop', scrolling.toTop);
  $("#tutorial_button").on("click", function() {
    document.getElementById("tutorial").classList.add("visible");
  });
  $(document).on("click", "a#unistall_extension", function() {
    window.chrome.management.uninstallSelf({
      showConfirmDialog: true
    }, function() {});
  });
  $(document).on("click", "button#piktab-lite", function() {
    var homepage = localStorage.homepage;
    if (homepage === "true") 
    {
      localStorage.homepage = false;
      _gaq.push(['_trackEvent', 'homepage', 'Piktab', 'false']);
      document.getElementById("homepage").checked = false;
      document.getElementById('text_little').classList.add('hidden');
      document.getElementById('lite_version').innerHTML = "<div class='alert success'><p>Thank you! you can enjoy Piktab by clicking its toolbar icon</p></div>";
    } 
    else
    {
      document.getElementById('lite_version').innerHTML = "<div class='alert success'><p>You are already using our lite version</p></div>";
    }
  });
  $(document).on("change","#toggle-settings, [id^='menu-']",function() {
    document.getElementById('text_little').classList.remove('hidden');
    document.getElementById('lite_version').innerHTML = '';
  });
  $(document).on("click",".mv_on_view", function () {
    if (this.className.indexOf('enable') > -1) 
    {
      localStorage.most_visited_checked = true;
      most_visited_granted_permissions();
    }
    else
    {
      localStorage.most_visited_checked = true;
      document.getElementById("sub-header").classList.add("hidden");
      document.getElementById("mostVisited_div").parentNode.classList.add("hidden");
    }
  });


  //                    >>VALUATION ACTIONS<<                   //


  $(document).on("click","#open_panel",function() {
    var parent = this.parent('#form_valuation');
    var left = parseInt(parent.style.left);
    if (isNaN(left)) {
      parent.style.left = "-200px";
      this.querySelector('#button_panel').innerHTML = "+";
    } else {
      parent.style.left = "";
      this.querySelector('#button_panel').innerHTML = "-";
    }
  });
  $("#form_valuation").submit(function(e) {
    e.preventDefault();
    var id = document.querySelector("#id_last_valuation");
    var comment = document.querySelector("#valuation_text");

    if (comment.value.trim().length) {
      gr.request.post('valuations/send_user_comment_piktab', {
        id: id.value,
        comment: comment.value
      });
    }

    document.querySelector("#valuation_comment_panel").style.display = "none";
    document.querySelector("#valuation_congrat").style.display = "block";

    setTimeout(function() {
      close_valuation();
    }, 3000);
  });
  $(".valuation_response").click(function(e) {
    var N = navigator.appName,
    UA = navigator.userAgent,
    temp,
    browser = [],
    browserVersion = UA.match(/(opera|chrome|safari|firefox|msie|maxthon|lunascape)\/?\s*(\.?\d+(\.\d+)*)/i);
    if (browserVersion && (temp = UA.match(/version\/([\.\d]+)/i)) !== null) browserVersion[2] = temp[1];
    browser["name"] = browserVersion[1];
    browser["version"] = browserVersion[2];

    gr.request.post('valuations/send_valuation_piktab', {
      value: this.dataset.value,
      question: 0,
      browser: browser['name'],
      browser_version: browser['version'],
      language: LANGUAGE_SHORT,
    });
  });
  $("#no_thanks").click(close_valuation);
}