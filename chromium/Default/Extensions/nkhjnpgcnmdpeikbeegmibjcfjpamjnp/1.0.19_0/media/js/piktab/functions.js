/**
* Public variables
*/
var _el = {
    caption: '.caption',
    dataPopover: '.popover-btn',
    dataPopoverClose: '.popover-close',
    overlay: '.overlay',
    showcase: '.showcase article',
    scrollable: '.scrollable',
    toggle: 'label[for^="toggle-"], label[for^="modal-"]',
    unscrollable: '.unscrollable',
    settings: 'label[for="toggle-settings"]',
    settingsMenu: '[for^="menu-"], [for*="menu-"]'
};

var media = {
    xs: 480,
    sm: 770,
    md: 992,
    lg: 1200,
    xl: 1400
}

var speed = 150;

var storage     = window.localStorage;
var scroll      = new _scrollable();
var dataPopover = new _popover();
var caption     = new _caption();

/**
* Settings
**/
$(document).on('click', _el.settingsMenu, function() {
    if(!document.body.classList.contains('settings-submenu-active')) {
        document.body.classList.add('settings-submenu-active');
    }
});

$(document).on('click', _el.settings, function() {
    if(document.getElementById(this.getAttribute('for')).checked) {
        document.body.classList.remove('settings-submenu-active');
    }
});

/**
* Form validation
**/
// var search = new _form(document.getElementById('search'), {
//     insertError: 'before'
// });

search.callback = function() {
    $("main .article_box").remove();

    buscador_handler(document.getElementById('search-field').value);
}

var feedback_ex = new _form(document.getElementById('form_contact'), {
    insertError: 'before'
});


var create_collection = new _form(document.getElementById('create_collection'), {
    insertError: 'before'
});

var search_collection = new _form(document.getElementById('search_collection'), {
    insertError: 'before'
});

var feedback = new _form(document.getElementById('form_contact_browser'), {
    insertError: 'before'
});

feedback.callback = function() {
    feedbackSend('form_contact_browser');
}
create_collection.callback = function() {
    create_new_collection();
}
search_collection.callback = function() {
    search_collections();
}
feedback_ex.callback = function() {
    feedbackSend('form_contact');
}

var touch = (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));

$(function() {
    /**
    * Popover
    */
    $(document).on('contextmenu', _el.dataPopover + '[data-click="right"]', function(e) {return false});
    $(document).on('mousedown', _el.dataPopover, dataPopover.click);
    $(document).on('click', _el.dataPopoverClose, dataPopover.close);

    window.addEventListener('resize', dataPopover.resize, false);


    /**
    * Caption
    */
    if(touch) $(_el.caption).on('click', caption.click);

    /**
    * Close on click outside
    */
    $(window).on('mouseup', function(e) {
        if(!e.target.parents('.popover-wrapper') && $(_el.dataPopover + '.active').length > 0) dataPopover.removeClass();        
        if(!e.target.parents(_el.caption)) caption.removeClass();
        if(e.target.classList.contains('modal-wrapper')) {
            var modal = document.querySelector('input[id^="modal-"]:checked');

            modal.checked = false;
            $(modal).trigger('change');

            document.body.classList.remove('unscrollable');
        }
    });

    $(window).on('keyup', function(e) {
        if(e.keyCode == 27) {
            if($(_el.dataPopover + '.active').length > 0) dataPopover.removeClass();        
        }
    });    

    /**
    * Touch devices
    */
    document.body.classList.add(touch ? 'touch' : 'notouch');

    /**
    * Prevent scroll propagation
    */
    if(touch) {
        $(document).on('touchstart', _el.scrollable, scroll.onStart);
        $(document).on('touchmove', _el.scrollable, scroll.onMove);
    } else {
        $(document).on('DOMMouseScroll mousewheel', _el.scrollable, scroll.onWheel);
    };

    /**
    * Toggle
    */
    $(document).on('click', _el.toggle, function(e) {
        var isToggleBtn = this.classList.contains('toggle-btn');
        var toggleOpen = document.querySelector('input[id^="toggle-"]:checked');
        var isModalBtn = this.getAttribute('for').indexOf('modal-') >= 0;        
        var modalOpen = document.querySelector('input[id^="modal-"]:checked');

        if(document.body.dataset.active == this.getAttribute('for')) {
            document.body.dataset.active = ''; 
            document.body.classList.remove('unscrollable');
        }

        if(isToggleBtn && !toggleOpen || isModalBtn && !modalOpen) document.body.dataset.active = this.getAttribute('for');

        if(!document.getElementById(this.getAttribute('for')).checked) document.body.classList.add('unscrollable');        
    })
});

/**
* On resize
*/
$(window).on('resize', function() {
    clearTimeout(this.resizeTimeout);

    this.resizeTimeout = setTimeout(function() {        
        // dataPopover.resize();      

        this.resizeTimeout = false;
    }, speed * 3); 
});

/**
* Fastclick

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}
------------------------------------------------
/**
* Public methods
*/

// Popover
function _popover() {
    // Private variables
    var popover = this;

    // Public methods
    this.removeClass = function(current) {

        [].forEach.call(document.querySelectorAll(_el.dataPopover), function(element) {
            var condition = typeof current !== 'object' ? true : element.parentNode.classList !== current.parentNode.classList;

            if(condition) {
                element.classList.remove('active');
                element.parentNode.classList.remove('active');

                if(element.getAttribute('data-bodyclass')) {
                    document.body.classList.remove('show-' + element.getAttribute('data-bodyclass'));
                    document.body.classList.remove('unscrollable'); 
                }
                if (element.classList.contains("delete")) 
                {
                    element.parentNode.parentNode.parentNode.classList.remove("show");
                }
            }
        });
    }

    this.click = function(e) {


        if(e.which === 2 || e.which === 1 && this.dataset.click === 'right' || e.which === 3 && this.dataset.click !== 'right') return;

        popover.removeClass(this);

        this.classList.toggle('active');
        this.parentNode.classList.toggle('active');

        if(this.getAttribute('data-bodyclass')) {
            document.body.classList.toggle('unscrollable');
            document.body.classList.toggle('show-' + this.getAttribute('data-bodyclass'));
        }
        if (this.classList.contains("delete"))
        {
            this.parentNode.parentNode.parentNode.classList.add("show");
        }
        e.stopPropagation();
        e.preventDefault();
    };

    this.close = function(e) {
        if(this.classList.contains('popover-close-reset')) {
            [].forEach.call($(this).parents('.active')[0].querySelectorAll('.active'), function(element) {
                element.classList.remove('active');
            });
        }

        $(this).parents('.active').removeClass('active');

        e.preventDefault();
    };
};
// Caption
function _caption() {
    var caption = this;

    this.removeClass = function(current) {
        var currIndex = [].slice.call(document.querySelectorAll(_el.caption)).indexOf(current);

        [].forEach.call(document.querySelectorAll(_el.caption), function(caption, index) {
            if(currIndex !== index) caption.classList.remove('hover');
        });
    }

    this.click = function(e) {
        caption.removeClass(this);

        if(e.target.classList.contains('caption-content')) this.classList.toggle('hover');
    }
}

// Scrollable (Stop scroll propagation)
function _scrollable() {
    // Private variables
    var position = {};

    // Private method
    function getEvent(event) {
        return event.originalEvent.targetTouches[0] ? event.originalEvent.targetTouches[0] : event.originalEvent.changedTouches[0];
    };

    // Public method
    this.onStart = function(e) {
        var touchObject = getEvent(e);

        position.start = {x: touchObject.pageX, y: touchObject.pageY};

        e.stopPropagation();
    };

    this.onMove = function(e) {
        var touchObject = getEvent(e);
        var dist = position.start.y - touchObject.pageY;

        if(this.scrollTop + dist >= this.scrollHeight - this.clientHeight) {
            e.preventDefault();
            e.returnValue = false;
            return false;
        }

        e.stopPropagation();
    };

    this.onWheel = function(e) {
        var up = (e.type == 'DOMMouseScroll' ? e.originalEvent.detail * -40 : e.originalEvent.wheelDelta) > 0,
        h = this.scrollHeight - this.clientHeight,
        c = this.scrollTop / h;

        if ((!up && c === 1) || (up && c === 0) || h === 0) {
            e.preventDefault();
            e.returnValue = false;
            return false;
        }

        e.stopPropagation();
    };
};

function _form(element, settings) {
    var validation = this; 
    // var forms = Array.isArray(element) ? element : [element];
    var forms = element.tagName === 'FORM' ? [element] : element; 
    var form = {};
    var ignore = ['submit', 'reset', 'hidden'];

    var Form = { 
        init: function(element) {
            this.el = element;
            this.validate = element.querySelectorAll('input, select, textarea');

            this.errorMessages(element);
            this.addEventListeners(element);
        },
        addMessage: function(element, type) {
            var span = document.createElement('span');
            var message = options[type] ? options[type] : options.default;

            span.classList.add('error');
            span.classList.add(element.id);
            span.innerHTML = message;

            element[options.insertError](span);

            this.errorMessage = element.querySelectorAll('span.error');
        },   
        errorMessages: function(element) {
            var form = this;

            [].forEach.call(form.validate, function(field) {
                var ignored = ignore.indexOf(field.type) >= 0;
                var required = field.required;

                if(!ignored && required) form.addMessage(field, field.type);
            });
        },
        showMessage: function(element) {
            this.el.querySelector('.error.' + element.id).classList.add('show');
        },
        hideMessage: function(element) {
            this.el.querySelector('.error.' + element.id).classList.remove('show');
        },        
        formValidation: function(element) {
            var form = this;
            var response = new Array();

            [].forEach.call(form.validate, function(field) {                
                var required = field.required;

                if(required) {
                    var valid = form.fieldValidation(field);

                    if(!valid) form.showMessage(field); else form.hideMessage(field);

                    response.push(valid);
                }
            });

            return response.indexOf(false) === -1;
        },
        fieldValidation: function(element) {
            var value = element.value;
            var type = element.type == "url" || element.type == "tel" || element.type == "email" ? element.type : "other";

            var typeArray = new Array(
                "url",
                "tel",
                "email",
                "other"
                );

            var methodArray = new Array(
                isUrlValid(value),
                isPhoneValid(value),
                isEmailValid(value),
                isNotEmpty(value)
                );

            var methodType = typeArray.indexOf(type); 

            return isNotEmpty(value) && methodArray[methodType];
        },
        addEventListeners: function(element) {
            var form = this;

            element.addEventListener('submit', function(e) {
                e.preventDefault();

                var valid = form.formValidation(element);
                if(valid) {
                    if(form.el.classList && form.el.classList.contains('form-noAjax')) {
                        form.el.submit();
                    } else {
                        if(typeof validation.callback === 'function') validation.callback(); else console.info('Set a callback');
                    }
                }
            });
        },
    }

    // Default settings
    var options = {
        email : "Please enter a valid email address.",
        tel : "Please enter a valid phone number.",
        message : "This field is required.",               
        url : "Please enter a valid url.",
        default : "This field is required.",
        insertError: 'before'
    }

    // Extend default settings
    if(settings && typeof settings === 'object') {
        options = extendDefaults(options, settings);
    }

    // Private methods
    function _construct() {
        [].forEach.call(forms, function(element) {            
            form = Object.create(Form);

            form.init(element);
        });
    };

    function isEmailValid(email) {
        var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
        return pattern.test(email);
    };

    function isPhoneValid(phone) {
        var pattern = new RegExp(/^\+?[0-9\(\)-\.\ ]{6,}$/);
        return pattern.test(phone);
    };

    function isUrlValid(url) {
        var pattern = new RegExp(/^http:\/\/|(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/);
        return pattern.test(url); 
    }; 

    function isNotEmpty(value) {            
        return value != "";
    };

    function extendDefaults(source, properties) {
        var property;

        for (property in properties) {
            if (properties.hasOwnProperty(property)) source[property] = properties[property];
        }

        return source;
    }

    //Initialize
    _construct();
}

// Accordion
$('.js-accordion-trigger').bind('click', function(e){
  jQuery(this).parent().find('.submenu').slideToggle('fast');  // apply the toggle to the ul
  jQuery(this).parent().toggleClass('is-expanded');
  e.preventDefault();
});

// Show/hide download layer
$(function() {
    if (!/^chrome-extension:/.test(document.URL)) 
    {

        var overlay = document.getElementById('overlay-download');
        var wrapper = document.getElementById('wrapper');

        var maxPos = wrapper.offsetTop;

        $(window).scroll(function() {
            var scroll_height = document.body.scrollHeight - window.innerHeight;
            var scroll_pos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop; 
            var overlay_opacity = ((scroll_pos - maxPos) / (scroll_height - maxPos)).toFixed(2);
            overlay_opacity = overlay_opacity > .9 ? .9 : overlay_opacity;
            var overlay_gradient = 'linear-gradient(to top, rgba(59,37,81,1), rgba(59,37,81,' + overlay_opacity + '))';

            if(scroll_pos >= maxPos) {
                overlay.style.visibility = 'visible';
                overlay.style.opacity = '1';
                overlay.style.display = 'block';
                overlay.style.backgroundImage = overlay_gradient;
            } else {
                overlay.style.visibility = 'hidden';
                overlay.style.opacity = '0';
                overlay.style.display = 'hidden';

            }

        });
        $(window).trigger('scroll');
    }
});

// Change filters type
function changeFilters(n) {
    $('.filters-btn button').removeClass('active');
    if (n === 'sources') {
        $('#setting_form').removeClass('files');
        $('.filters-btn button:first-child').addClass('active');
        $('.filters-btn button:nth-child(2)').removeClass('active');
    }
    else {
        $('#setting_form').addClass('files');
        $('.filters-btn button:first-child').removeClass('active');
        $('.filters-btn button:nth-child(2)').addClass('active');
    }
}

// Parallax header
$('.landing').mousemove(function(e){
    var width = $(this).width() / 2;
    var height = $(this).height() / 2;
    var amountMovedX = ((width - e.pageX) * -1 / 12);
    var amountMovedY = ((height - e.pageY) * -1 / 12);

    var amountMovedX2 = ((width - e.pageX) / 8);
    var amountMovedY2 = ((height - e.pageY) / 8);

    $('.shapes1').css('marginLeft', amountMovedX);
    $('.shapes1').css('marginTop', amountMovedY);

    $('.shapes2').css('marginLeft', amountMovedX2);
    $('.shapes2').css('marginTop', amountMovedY2);
});

// Close modal with Esc key

document.addEventListener('keyup', function(e) {
    if (e.keyCode == 27) {
        if (document.getElementById('tutorial').classList.contains("visible")) return;
        var modals = document.querySelectorAll('input[name="modal"]');

        if(document.getElementById('modal-collections').checked) {
            if (changes_col) {
                get_collections(gr.auth.me.id);
            }
            back_to_collections();
        }
        else if (document.getElementById('modal-collections-add').checked)
        {
            var modal = document.getElementById('modal-collections-add');
            document.getElementById('modal-collections-add').checked = false;
            collections_add_reset();
        }


        for(var i = 0; i < modals.length; i++) modals[i].checked = false;

            document.body.classList.remove('unscrollable');     
    }
});

// Video
(function video() {
    // Insert html
    var videoHTML = '<div id="video-player" class="video-wrapper unscrollable">';
    videoHTML += '<button class="video-player-close nostyle"></button>';
    videoHTML += '<i class="loader--css"></i>';
    videoHTML += '<div class="video-player-content"></div>';
    videoHTML += '</div>';

    document.getElementById('wrapper').insertAdjacentHTML('beforeend', videoHTML);

    // Event listeners
    $(document).on('click', '.video__play', click);
    $(document).on('click', '#video-player, .video-player-close', close);
    $(window).on('keyup', function(e) {
        if(e.keyCode == 27) 
        {
            close();
        }
    });

    // Methods
    function _player(src, source) {
        var config = 'webkitallowfullscreen mozallowfullscreen allowfullscreen autoplay';
        var player = {
            youtube: function() {
                return '<iframe id="player" src="'+ src +'?autoplay=1" frameborder="0" ' + config + '></iframe>';
            },
            vimeo: function() {                
                return '<iframe id="player" src="' + src + '&autoplay=1" frameborder="0" ' + config + '></iframe>';
            }
        }

        if (typeof player[source] === 'function') {
            document.querySelector('.video-player-content').innerHTML = player[source]();
        } else {
            document.querySelector('.video-player-content').innerHTML = 'Something went wrong, try again later.';
        }


        $('#player').on('load', function() {
            document.body.classList.add('unscrollable');
            document.querySelector('.video-player-content').classList.add('show');
        })
    }

    function _source(href) {
        var sources = ['youtube', 'vimeo'];

        for (var i = 0; i < sources.length; i++) {
            if (href.indexOf(sources[i]) > -1) {
                return sources[i];
            }
        }
    }

    function click(e) {
        var href = this.getAttribute('data-video');
        var source = _source(href);

        if(href, source) {
            _player(href, source);

            document.querySelector('#video-player').classList.add('active');
        };
    };

    function close(e) {
        document.body.classList.remove('unscrollable');
        document.querySelector('#video-player').classList.remove('active');
        document.querySelector('.video-player-content').classList.remove('show');
        document.querySelector('.video-player-content').removeAttribute('style');
        document.querySelector('.video-player-content').innerHTML = '';
    };
})();