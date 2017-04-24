var searchEngineObjects = {
  freepik: {
    formAction: "http://www.freepik.com/index.php",
    autocomplete: "off",
    placeholder: "Search in Freepik",
    inputName: "k",
    inputTemplate: "<input type='hidden' class='itemplate' id='goto' name='goto' value='2'><input class='itemplate' type='hidden' size='30' id='searchform' value='1'>"},
    flaticon: {
      formAction: "http://www.flaticon.com/search",
      autocomplete: "off",
      placeholder: "Search in Flaticon",
      inputName: "word"
    },
    google: {
      formAction: "http://www.google.com/search",
      autocomplete: "on",
      placeholder: "Search in Google",
      inputName: "q"
    },
    graphicburger: {
      formAction: "http://graphicburger.com/",
      autocomplete: "off",
      placeholder: "Search in Graphicburger",
      inputName: "s"
    },
    pixabay: {
      formAction: "https://pixabay.com/en/photos/",
      autocomplete: "off",
      placeholder: "Search in Pixabay",
      inputName: "q"
    },
    pexels: {
      formAction: "https://www.pexels.com",
      autocomplete: "off",
      placeholder: "Search in Pexels",
      inputName: "s"
    },
    vecteezy: {
      formAction: "http://www.vecteezy.com/free-vector",
      autocomplete: "off",
      placeholder: "Search in Vecteezy",
      inputName: "search",
      inputTemplate: "<input id='from' class='itemplate' name='from' type='hidden' value='mainsite'><input id='internal_search' class='itemplate' name='internal_search' type='hidden' value='true'>"
    },
    iconfinder: {
      formAction: "https://www.iconfinder.com/search",
      autocomplete: "off",
      placeholder: "Search in Iconfinder",
      inputName: "q"
    },
    freebiesbug: {
      formAction: "http://freebiesbug.com/",
      autocomplete: "off",
      placeholder: "Search in Freebiesbug",
      inputName: "s"
    },
    thehungryjpeg: {
      formAction: "https://thehungryjpeg.com/search.php",
      autocomplete: "off",
      placeholder: "Search in Thehungryjpeg",
      inputName: "term"
    },
    piktab: {
      formAction: "",
      autocomplete: "off",
      placeholder: "Search in Piktab",
      inputName: "name"
    },
    iconstore: {
      formAction: "https://iconstore.co",
      autocomplete: "off",
      placeholder: "Search in Iconstore ",
      inputName: "s"
    }
  };
  var templateNewCollection = 
  '<article class="article_box add_new_collection" id="add_new_collection">' +
  '<div class="showcase__content content">' +
  '<p>ADD NEW COLLECTION</p>' +
  '<i>+</i>' +
  '<form class="create-collection" id="create_collection_2" action="" method="post" novalidate>'+
  '<input type="text" name="collection-name" placeholder="Name your new collection" class="collection-name" id="collection-name_2" required/>'+
  '<button class="btn" type="submit" id="create_collection_2">Create</button>'+
  '</form>'+
  '</div>' +
  '</article>';

  var formulario = '<form id="form_valuation" class="form_valuation_cl bg-light-gray">\
  <div id="open_panel" class="open_panel_cl bg-light-gray">\
  <span id="button_panel">+</span>\
  </div>\
  <div id="valuation_panel" class="valuation_panel_cl">\
  <span class="fllft">What do you think about Piktab?</span>\
  <input id="valuation_question_id" type="hidden" value="1">\
  <br>\
  <div id="calification_panel">\
  <a id="val_check_1" class="valuation_response flaticon-sad btn-small btn-pill" data-value="1" title="piktab is awful!"></a>\
  <a id="val_check_0" class="valuation_response flaticon-neutral btn-small btn-pill" data-value="0" title="piktab is a good service!"></a>\
  <a id="val_check_2" class="valuation_response flaticon-happy btn-small btn-pill" data-value="2" title="piktab rocks!"></a>\
  </div>\
  \
  </div>\
  <div id="valuation_comment_panel" class="valuation_panel_cl" style="display: none;">\
  <div id="valuation_panel_txt" class="valuation_panel_cl">\
  <textarea id="valuation_text" cols="40" rows="3" class="valuation_text_cl" placeholder="Thank you very much! Would you improve something?" maxlength="255"></textarea>\
  \
  <input type="hidden" id="id_last_valuation" value="">\
  <div class="cmd_clear">\
  <a href="https://chrome.google.com/webstore/detail/piktab/nkhjnpgcnmdpeikbeegmibjcfjpamjnp/reviews" target="_blank">Rate us here!</a>\
  <input type="submit" value="Send" class="bton_valuation_cl">\
  <a href="#" class="text-link" id="no_thanks">No thanks</a>\
  </div>\
  <div id="valuation_message" class="valuation_message_cl" style="display:none">* Write us a comment</div>\
  </div>\
  </div>\
  <div id="valuation_congrat" class="valuation_congrat_cl" style="display:none;">\
  <span>Thank you so much for helping us!</span>\
  </div>\
  </form>';

  var most_visited_template = '<div class="enable-most-visited">\
  <button class="mv_on_view enable">Enable</button>\
  <button class="mv_on_view dismiss">Dismiss</button>\
  </div><li>\
  <a><img src="http://www.google.com/s2/favicons?domain=http://www.piktab.com/" style="display: block;"></a>\
  </li>\
  <li>\
  <a><img src="https://logo.clearbit.com/chrome.google.com" style="display: block;"></a>\
  </li>\
  <li>\
  <a><img src="https://logo.clearbit.com/spotify.com" style="display: block;"></a></li>\
  <li>\
  <a><img src="https://logo.clearbit.com/chrome.google.com" style="display: block;"></a>\
  </li>\
  <li>\
  <a><img src="https://logo.clearbit.com/freepik.com" style="display: block;"></a>\
  </li>\
  <li>\
  <a><img src="https://logo.clearbit.com/mail.google.com" style="display: block;"></a>\
  </li>\
  <li>\
  <a><img src="https://logo.clearbit.com/analytics.google.com" style="display: block;"></a>\
  </li>\
  ';

  var most_example = '<li><a><img src="https://logo.clearbit.com/chrome.google.com" style="display: block;"></a></li><li><a><img src="https://logo.clearbit.com/amazon.com" style="display: block;"></a></li><li><a><img src="https://logo.clearbit.com/facebook.com" style="display: block;"></a></li><li><a><img src="https://logo.clearbit.com/freepik.com" style="display: block;"></a></li><li><a><img src="http://www.google.com/s2/favicons?domain=http://piktab.com/" style="display: block;"></a></li><li><a><img src="https://logo.clearbit.com/flaticon.com" style="display: block;"></a></li><li><a><img src="https://logo.clearbit.com/pinterest.com" style="display: block;"></a></li>';
  var scrolled = false;
  // var adjadcentCollection = false;
  var request_done = false
  var page = 1, f_page = false, loading = false;
  var limit_pp = 0;
  var offset = 0;
  var external_call = false;
  var formSelection = [];

  var data_error = false;

  var today_el;

  var sources_obj = {};
  var sources_filter = [];
  var tags_filter = [];
  // -- -- --  se quita para poder utilizar  APP_URL var webSite = "http://www.piktab.com/";
  var collections_sources = [];

  var collections_tags = [];

  var collections_item = [];

  var collection_item = [];

  (function() {

    var articles_width = 320;
    //  preguntar a partir de que tamaños varia el width de los articles
    limit_pp = Math.round((window.innerWidth / articles_width)) * Math.round((window.innerHeight / articles_width)) + 1;
  })();

  var prev_viewed_elements = 0;
  
  var temp_col_html = '';
  var apply_button = document.querySelectorAll('button.apply_button');
  
  var type_file_input = document.querySelectorAll('div.tags label.checkbox-right input');

  var data_sources_input = document.querySelectorAll('div.sources label.checkbox-right input');

  var search_into_col = false;

  var active_collection_id = '';

  var active_collection_name = '';
  
  var searchAutoComplete = '';

  var searchPiktab = false;

  var search_piktab_done = false;

  var autocomplete_el = false;

  var searchCategory = false;

  var done_collection_gen = false;

  var changes_col = false;

  var searchTo = "icon-google";

  var external_search = false;

  var collections = {};

  var term;

  var DEVEL = false;

  var graphics_arr = [];
  var photos_arr = [];
  var videos_arr = [];
  var tutorials_arr = [];

  var $loader = $(".loader");

  var first_load = true;

  var elements_data = '';

  var collections_data = '';

  var collections_obj = '';

  var search_collection = '';

  var googleUser = {};

  var force_update_elements = false;

  var where_document = document.URL.split("/")[0];

  var isChromeExt = where_document === 'chrome-extension:';

  if (isChromeExt) {
    var ACCOUNTS_BASE_URL = 'https://profile.piktab.com/';
    var ACCOUNTS_API_KEY = btoa('chrome-extension://' + chrome.runtime.id);
    var FACEBOOK_APP_ID = '273936626274517';
    var GOOGLE_CLIENT_ID = '704741680839-bhf7ob7b4cno13766lf1chq9s909e8d6.apps.googleusercontent.com';
    var GOOGLE_API_KEY = 'AIzaSyBEWLCJGM57YzNk1R8BUyh1njbWDiIRRQI';
    var LANGUAGE = 'english';
    var LANGUAGE_SHORT = 'en';
    var RE_CAPTCHA_API_KEY = '6LdrxggTAAAAAEsVEMxap24sSkGS1nI3SsOigFyF';    
  }
  APP_URL = (DEVEL) ? 'http://www.piktab.com/' : 'http://www.piktab.com/';

  PROFILE_URL = (DEVEL) ? 'https://profile.piktab.com/' : 'https://profile.piktab.com/';