uninstall_completed();

var unins_feedback = new _form(document.getElementById('uninstall_form'), {
    insertError: 'before'
});

unins_feedback.callback = function() {
    uninstall_send();
}

function uninstall_send() {
    var radio_buton = document.getElementsByName('uninstall_reason');
    var data = {};
    data['contact-subject'] = "uninstall"

    for (var i = 0, length = radio_buton.length; i < length; i++) {
        if (radio_buton[i].checked) {
            data.uninstall_reason = radio_buton[i].value;
            break;
        }
    }

    if (document.getElementById('uninstall-email').value) 
    {
        data['contact-email'] = document.getElementById('uninstall-email').value;
    }

    if (document.getElementById('uninstall-message').value) 
    {
        data['contact-message'] = document.getElementById('uninstall-message').value;
    }
    if (grecaptcha.getResponse()) 
    {
        data['g-recaptcha-response'] = grecaptcha.getResponse();
        $.ajax({
            type: "POST",
            url: APP_URL + "plugin_feedback/sendFeedback",
            data: {
                data: data
            },
            success: function() {
                $("div.alert").addClass("hidden");
                $("#uninstall_form").addClass("hidden");
                $(".contact_form_text").addClass("hidden");
                $("div.alert").removeClass("error").removeClass("hidden").text("Message sent. Thank you!");
                setTimeout(function() {
                  grecaptcha.reset();
                  $("#uninstall_form").removeClass("hidden");
                  $(".contact_form_text").removeClass("hidden");
                  $("div.alert").addClass("hidden");
                  document.getElementById('uninstall_form').reset();
              }, 4000);
            },
            error: function() {
                console.log("error");
            }
        });
    }
    else
    { 
        $("div.alert").removeClass("hidden").addClass("error").text("You must to check ReCAPTCHA");
        grecaptcha.reset();
    }
}


function _form(element, settings) {
    var validation = this;
    var forms = Array.isArray(element) ? element : [element];
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
            // temp

            var response = new Array();

            [].forEach.call(form.validate, function(field) {                
                var required = field.required;
                if(required) {
                    var valid = form.fieldValidation(field);

                    if(!valid) form.showMessage(field); else form.hideMessage(field);

                    response.push(valid);
                }
            });

            var radio_buton = document.getElementsByName('uninstall_reason');
            var unchecked = 0;
            for (var i = 0, length = radio_buton.length; i < length; i++) 
            {
                if (!radio_buton[i].checked){
                    unchecked++;
                }
            }
            if (unchecked === radio_buton.length) 
            {
                response.push(false);
                document.querySelector('label span.uninstall_reason_label').classList.add('show');
            }
            else
            {
                document.querySelector('label span.uninstall_reason_label').classList.remove('show');
            }

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
function uninstall_completed() {
    _gaq.push(['_trackEvent', 'UninstallSelf', 'uninstall_complete']);

}