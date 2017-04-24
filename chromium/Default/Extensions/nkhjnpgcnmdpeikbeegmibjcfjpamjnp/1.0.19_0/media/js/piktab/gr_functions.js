function get_collections() {
  gr.request.get('bookmarks/collections', {'type': 3});
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function() {});
}

function attachSignin(element) {
  auth2.attachClickHandler(element, {},
    function(googleUser) {
      var profile = auth2.currentUser.get().getBasicProfile();
      $("#btn-account").html("Sign Out").addClass("singout");
      $("#modal-account").prop("checked", false);
    },
    function(error) {
      alert(JSON.stringify(error, undefined, 2));
    });
}

function login_callback(data) {
  redirect('chrome-extension://' + chrome.runtime.id + '/home.html');
}

function logged_in_callback(data) {
  if (request_done) return;
  if (data.status) {
    request_done = true;
    $('#btn-account.login').hide();
    $('.user-menu').show().find('.avatar').show().attr('src', gr.auth.me.avatar);
    $('.collections').show();
    $('.account_settings').show();
    if (!localStorage.user_id) localStorage.user_id = data.id;
    if (localStorage.user_id !== data.id)
    {
      get_collections();
      localStorage.user_id = data.id;
    }
  }
  else 
  {
    $('section.landing').fadeIn('fast','linear');
    if (typeof(chrome) != "undefined" && typeof(chrome.runtime.id) != "undefined")
      $('#btn-account.login a').attr('href', ACCOUNTS_BASE_URL + chrome.runtime.id);
    else
      $('#btn-account.login a').attr('href', ACCOUNTS_BASE_URL);
    $('img.avatar').hide();
    $('#btn-account.login').show();
    $('label.collections').hide();
      localStorage.user_id = '';

  }
}

