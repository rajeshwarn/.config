
var paragraph = document.getElementById("paragraph");
var slide_pos = 0;

function tutorial() 
{

  if (localStorage.tutorial) 
  {
    return;
  }
  document.getElementById("tutorial").classList.add("visible");

  document.getElementsByTagName("body")[0].classList.add("unscrollable");
  sources_types();
}
function quiz_preferences_modifier(source_preference, tag_preference) 
{
  localStorage.lastquery_type_id = tag_preference.join();
  localStorage.lastquery_sources_id = source_preference.join();
  load_piktab();
}
function set_quiz_preferences() 
{

  var preferences_array = [];
  var tag_array = [];

  document.querySelectorAll('li .quiz_preferences:checked').forEach(function(e) {
    var preference = e.getAttribute('name');



    switch (preference) {
      case "freebies":
      var freebies = graphics_arr;
      preferences_array = preferences_array.concat(freebies);
      tag_array = tag_array.concat(["101","102","105","106","107","108","109","110","112"]);
      break;

      case "images":
      var images = photos_arr;
      preferences_array = preferences_array.concat(images);
      tag_array = tag_array.concat(["104"]);
      break;

      case "videos":
      var videos = videos_arr;
      preferences_array = preferences_array.concat(videos);
      tag_array = tag_array.concat(["103"]);
      break;

      case "tutorials":
      var tutorial = tutorials_arr;
      preferences_array = preferences_array.concat(tutorial);
      tag_array = tag_array.concat(["111"]);
      break;

      default:
      console.log("Quiz not available");
      break;
    }
  });

  quiz_preferences_modifier(preferences_array, tag_array);
}

function tutorial_handlers() 
{
  $(document).on("click", ".close",function(){

    document.getElementsByTagName("body")[0].classList.remove("unscrollable");
    document.getElementById("tutorial").classList.remove("visible");
    localStorage.tutorial = true;

    var quiz_preferences = document.querySelectorAll('.quiz_preferences');
    var user_preferences = [];
    quiz_preferences.forEach(function(e) {
      if (e.checked) 
      {
        user_preferences.push(e.getAttribute('name'));
      }
    });
    set_quiz_preferences();
    _gaq.push(['_trackEvent', 'quiz', 'user_preferences', user_preferences.join()]);




    var quiz_search = document.querySelectorAll('.quiz_search');
    quiz_search.forEach(function(e) {
      if (e.checked) 
      {
        if (e.parentNode.querySelector('i').className === "icon-piktab") 
        {
          localStorage.defaultSearch = "internal";
        }
        else
        {
          localStorage.defaultSearch = "external";
        }
        _gaq.push(['_trackEvent', 'quiz', 'search_preferences', e.parentNode.querySelector('i').className.replace("icon-","")]);
        search_init();
      }
    });
  });

  $(document).on("click",".next",function(e){

    paragraph.children[slide_pos].classList.remove("active");
    slide_pos = parseInt(slide_pos);

    slide_pos++
    document.querySelector('nav .next').outerHTML = '<button class="close">Let\'s go!</button>';
    document.querySelector('nav .close').classList.add('lego');
    document.querySelector('.prev').disabled = false;
    document.querySelectorAll('.steps li')[slide_pos].classList.add("active");
    
    paragraph.children[slide_pos].classList.add("active");
  });

  $(".prev").on("click",function(){
    paragraph.children[slide_pos].classList.remove("active");
    slide_pos = parseInt(slide_pos);

    document.querySelector('nav button.close').outerHTML = '<button class="next">Next</button>';
    if (slide_pos === 1) 
    {
      document.querySelector('.prev').disabled = true;
      document.querySelectorAll('.steps li')[slide_pos].classList.remove("active");
    }
    else if (slide_pos !== 3)
    {
      document.querySelectorAll('.steps li')[slide_pos].classList.remove("active");
    }
    else
    {
    }
    document.querySelector('.next').disabled = false;
    slide_pos--;
    paragraph.children[slide_pos].classList.add("active");

  });


  // QUIZ HANDLERS

  $(".quiz_preferences").on("click", function() {

    if (document.querySelectorAll('li.active .quiz_preferences:checked').length >=1) 
    {
      set_quiz_preferences();
    }
    else
    {
      this.checked = true;
    }

  });
  $(".quiz_search").on("click", function() {
    default_search(this.parentNode.querySelector('i').className);
  });
  $(".quiz_mostvisited").on("click", function() {
    most_visited_granted_permissions();
  });
  $(".quiz_faq").on("click", function() {
    document.getElementById("btn-settings").click();
    document.querySelector('div.menu label[for="menu-faq"]').click();
  });
}