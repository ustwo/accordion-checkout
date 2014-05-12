(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("application", function(exports, require, module) {
// Application bootstrapper.
Application = {
    initialize: function() {
        
        var HomeView = require('views/home_view')
          , RegisterView = require('views/register_view')
          , Router   = require('lib/router')
        
        this.homeView = new HomeView()
        this.registerView = new RegisterView()
        this.router   = new Router()
        
        if (typeof Object.freeze === 'function') Object.freeze(this)
        
    }
}

module.exports = Application

});

;require.register("initialize", function(exports, require, module) {
var initializers = {};

initializers['completed'] = function () {
	$('.button.return').on('click', function (e) {
		e.preventDefault();
		$('body').addClass('confirmed');
		window.hideNetworkWallet();
		return false;
	});

	$('.edit-card').on('click', function (e) {
		e.preventDefault();
		window.goToPage('register', 'link-to-card');
		return false;
	});

	$('.edit-address').on('click', function (e) {
		e.preventDefault();
		window.goToPage('register', 'add-shipping-details');
		return false;
	});
};

initializers['register'] = function () {
	showNetworkWallet();

	function updatePasswordValidation(value, strict) {
		var validated = {};

		validated.hasDigit = /[0-9]+/.test(value);
		validated.hasLetter = /[A-z]+/.test(value);
		validated.hasSpaces = /\s+/.test(value);
		validated.sameAsEmail = (value === $('#email').val());
		validated.isLengthOk = /.{8,20}/.test(value);

		console.log(validated);

		var $info = $('.password-info');


		$('.no-spaces', $info).removeClass('ok ko').addClass(function() {
			return !validated.hasSpaces? 'ok' : 'ko';
		});

		$('.different-from-email', $info).removeClass('ok ko').addClass(function() {
			return !validated.sameAsEmail? 'ok' : 'ko';
		});

		$('.characters-length', $info).removeClass('ok ko').addClass(function() {
			return validated.isLengthOk? 'ok' : 'ko';
		});

		$('.letter-number', $info).removeClass('ok ko').addClass(function() {
			return (validated.hasDigit && validated.hasLetter)? 'ok' : 'ko';
		});
	};

	$('#create-password').on('keyup', function () {
		var value = $(this).val();
		updatePasswordValidation(value);
	});

	$('#create-password').on('focus', function () {
		$('.password-info').addClass('validating');
	});

	$('#create-password').on('blur', function () {
		$('.password-info').removeClass('validating');
	});


	var currentCardName = "";
	$('.step.link-to-card .card-number').validateCreditCard(function (result) {
		var el = $('fieldset.credit-card-container')
		if (result.card_type) {
			currentCardName = result.card_type.name;
			el.addClass(currentCardName);
		} else {
			el.removeClass(currentCardName);
		}
	});

	$('.step.link-to-card .expiry-date').on('keyup', function (e) {
		var $this = $(this);
		console.log( e.which);
		if ($this.val().length == 2 && e.which !== 46 && e.which !== 8) {
			$this.val($this.val() + ' / ');
		}
	});

	$('.security-code-info').on('click', function (e) {
		e.preventDefault();
		$('body').toggleClass('security-info');
		return false;
	});

	$('.security-info-modal .close').on('click', function (e) {
		e.preventDefault();
		$('body').removeClass('security-info');
		return false;
	});

	var countries = ['Afghanistan', 'Åland Islands', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antarctica', 'Antigua And Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bonaire, Sint Eustatius and Saba', 'Bosnia and Herzegovina', 'Botswana', 'Bouvet Island', 'Brazil', 'British Indian Ocean Territory', 'Brunei Darussalam', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China', 'Christmas Island', 'Cocos (Keeling) Islands', 'Colombia', 'Comoros', 'Congo', 'Congo, the Democratic Republic of the', 'Cook Islands', 'Costa Rica', 'Côte d\'Ivoire', 'Croatia', 'Cuba', 'Curaçao', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Falkland Islands (Malvinas)', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Guiana', 'French Polynesia', 'French Southern Territories', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Heard Island and McDonald Islands', 'Holy See (Vatican City State)', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran, Islamic Republic of', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea, Democratic People\'s Republic of', 'Korea, Republic of', 'Kuwait', 'Kyrgyzstan', 'Lao People\'s Democratic Republic', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libyan Arab Jamahiriya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macao', 'Macedonia, The Former Yugoslav Republic Of', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Micronesia, Federated States of', 'Moldova, Republic of', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norfolk Island', 'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestinian Territory, Occupied', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Réunion', 'Romania', 'Russian Federation', 'Rwanda', 'Saint Barthélemy', 'Saint Helena', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Martin (French Part)', 'Saint Pierre and Miquelon', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Sint Maarten (Dutch Part)', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Georgia and the South Sandwich Islands', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Svalbard and Jan Mayen', 'Swaziland', 'Sweden', 'Switzerland', 'Syrian Arab Republic', 'Taiwan, Province of China', 'Tajikistan', 'Tanzania, United Republic of', 'Thailand', 'Timor-Leste', 'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'United States Minor Outlying Islands', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Venezuela', 'Vietnam', 'Virgin Islands, British', 'Virgin Islands, U.S.', 'Wallis and Futuna', 'Western Sahara', 'Yemen', 'Zambia', 'Zimbabwe'];

	$('.country').autocomplete({
		source: countries,
		minLength: 2,
		select: function (event, ui) {
			var $step = $(this).parents('.step');
			$step.removeClass('uk other-country');

			if (ui.item.value === "United Kingdom") {
				$step.addClass('uk');
			} else {
				$step.addClass('other-country');	
			}
		}
	});

	$('.postcode-search').on('click', function () {
		var $step = $(this).parents('.step');
		$('.address-1', $step).val('Flat 5, 28 Hertford Road');
		$('.address-2', $step).val('');
		$('.city', $step).val('London');
		$('.state', $step).val('London');
		$('.postcode', $step).val('N1 5OT');

		stepController.step3.validate();
		stepController.step4.validate();

		$step.removeClass('uk').addClass('other-country');
	});

	function updateShippingAddress() {
		var $step = $('.step.add-shipping-details');
		var useBillingAddress = $("input[name=use-billing-address]").is(':checked');
		if (!useBillingAddress) {
			$step.removeClass('disabled');
			$('input', $step).val('').removeAttr('disabled');
		} else {
			$step.addClass('disabled');
			var $billingInputs = $(".step.add-billing-details input"); 
			$billingInputs.each(function() {
				var $this = $(this);
				var name = $this.attr('id');
				var value = $this.val();
				$('#' + name, $step).val(value).attr("disabled", "disabled");
			});
		}

		stepController.step4.validate();
	};

	$("input[name=use-billing-address]").on('click', function () {
		updateShippingAddress();
	});

	var stepController = {
		currentStep: null
	};

	stepController.step1 = new ANW.UI.Step($('.step.new-account'));
	stepController.step2 = new ANW.UI.Step($('.step.link-to-card'));
	stepController.step3 = new ANW.UI.Step($('.step.add-billing-details'));
	stepController.step4 = new ANW.UI.Step($('.step.add-shipping-details'));

	var onActivate = function onActivate (step) {
		stepController.currentStep = step;
	}

	stepController.step1.options.onActivate = onActivate;
	stepController.step2.options.onActivate = onActivate;
	stepController.step3.options.onActivate = onActivate;
	stepController.step4.options.onActivate = onActivate;

	stepController.step1.options.onConfirm = function () { stepController.step2.activate(); };
	stepController.step2.options.onConfirm = function () { stepController.step3.activate(); };
	stepController.step3.options.onConfirm = function () {
		updateShippingAddress();
		stepController.step4.activate();
	};
	stepController.step4.options.onConfirm = function () { window.goToPage('safekey')};

	stepController.step1.options.onBack = function () { window.goToPage('home'); };
	stepController.step2.options.onBack = function () { stepController.step1.activate(); };
	stepController.step3.options.onBack = function () { stepController.step2.activate(); };
	stepController.step4.options.onBack = function () {	stepController.step3.activate(); };

	var onClickEdit = function onClickEdit(step) {
		stepController.currentStep.deactivate();
		setTimeout(function () {
			step.activate();
		}, 640);
	}

	stepController.step1.options.onClickEdit = onClickEdit;
	stepController.step2.options.onClickEdit = onClickEdit;
	stepController.step3.options.onClickEdit = onClickEdit;
	stepController.step4.options.onClickEdit = onClickEdit;


};

initializers['home'] = function () {
	function updatePinContainer() {
		var $pinContainer = $('.ui-pin');
		var $pins = $('div', $pinContainer);

		var w = $pinContainer.width() - 30;
		var pinW = Math.round(w/4);
		var lastPinW = pinW + (w - pinW*4);
		$pins.width(pinW);
		$pins.eq(3).width(lastPinW);
	}	

	$(window).resize(function () {
		updatePinContainer();
	});

	var pin = new ANW.UI.Pin($('.ui-pin'));

	updatePinContainer();

	var swipe = Swipe(document.getElementById('carousel'), {
		//auto: 4000,
		continuous: true,
		callback: function(i) {
			$('.carousel-navigation li').removeClass('active')
			.eq(i).addClass('active');
		}
	});

	$('.trigger').on('click', function () {
		showNetworkWallet();
	});

	$('.register').on('click', function (e) {
		e.preventDefault();
		window.goToPage('register');
		return false;
	});
};

initializers['safekey'] = function () {
	var timeout = setTimeout(function () {
		window.goToPage('completed');
		clearTimeout(timeout);
	}, 4000);

	var opts = {
	  lines: 12, // The number of lines to draw
	  length: 6, // The length of each line
	  width: 3, // The line thickness
	  radius: 7, // The radius of the inner circle
	  corners: 1, // Corner roundness (0..1)
	  rotate: 0, // The rotation offset
	  direction: 1, // 1: clockwise, -1: counterclockwise
	  color: '#000', // #rgb or #rrggbb or array of colors
	  speed: 1, // Rounds per second
	  trail: 60, // Afterglow percentage
	  shadow: false, // Whether to render a shadow
	  hwaccel: false, // Whether to use hardware acceleration
	  className: 'spinner', // The CSS class to assign to the spinner
	  zIndex: 2e9, // The z-index (defaults to 2000000000)
	  top: 'auto', // Top position relative to parent in px
	  left: 'auto' // Left position relative to parent in px
	};
	var target = document.getElementById('spinner');
	var spinner = new Spinner(opts).spin(target);
}


require('jQueryCreditCardValidator');

window.ANW = {
	UI: {
		Pin: require('views/anw.ui.pin'),
		Step: require('views/anw.ui.step')
	}
};

window.showNetworkWallet = function showNetworkWallet() {
	$('body > .overlay').show();
	setTimeout(function () {
		$('body').addClass('triggered');
	}, 0);
}

window.hideNetworkWallet = function hideNetworkWallet() {
	$('body').removeClass('triggered');
	setTimeout(function () {
		$('body > .overlay').hide();
	}, 640);
}

window.templates = {};
window.goToPage = function goToPage(page, step) {
	if (!window.templates[page]) {
		var template = require('./views/templates/' + page);
		var $content = $(template());
	} else {
		$content = window.templates[page];
	}

	var container = $('body .container');

	if (window.currentPage) {
		container.addClass('transition');
		window.templates[window.currentPage] = container.contents().clone();
	}

	setTimeout(function () {
		$(window).scrollTop(0);

		if (step) {
			$('.step.active', $content).removeClass('active');
			$('.step.' + step, $content).addClass('active');
		}

		container.html($content);
		$('body').removeClass(window.currentPage).addClass(page);
		window.currentPage = page;
		setTimeout(function () {
			initializers[page]();
			container.removeClass('transition');
		},0)
	}, 320);
}

function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

$(function() {
	var url = location.href;
	if (url.substr(-1) == '/') {
		url = url.substr(0, url.length - 1);
	}
	var parts = url.split('/');
	var currentPart = parts.pop();
	var templatePart = 'home';
	if ( currentPart === 'register') {
		templatePart = 'register';
	} else if (currentPart === 'completed') {
		templatePart = 'completed';
	}
	window.goToPage(templatePart);
});

$(function () {
	FastClick.attach(document.body);

	$('.container .header .back').on('click', function (e) {
		e.preventDefault();
		hideNetworkWallet();
		return false;
	});
})

});

;require.register("jQueryCreditCardValidator", function(exports, require, module) {
// Generated by CoffeeScript 1.4.0

/*
jQuery Credit Card Validator

Copyright 2012 Pawel Decowski

This work is licensed under the Creative Commons Attribution-ShareAlike 3.0
Unported License. To view a copy of this license, visit:

http://creativecommons.org/licenses/by-sa/3.0/

or send a letter to:

Creative Commons, 444 Castro Street, Suite 900,
Mountain View, California, 94041, USA.
*/


(function() {
  var $,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  $ = jQuery;

  $.fn.validateCreditCard = function(callback, options) {
    var card, card_type, card_types, get_card_type, is_valid_length, is_valid_luhn, normalize, validate, validate_number, _i, _len, _ref, _ref1;
    card_types = [
      {
        name: 'amex',
        pattern: /^3[47]/,
        valid_length: [15]
      }, {
        name: 'diners_club_carte_blanche',
        pattern: /^30[0-5]/,
        valid_length: [14]
      }, {
        name: 'diners_club_international',
        pattern: /^36/,
        valid_length: [14]
      }, {
        name: 'jcb',
        pattern: /^35(2[89]|[3-8][0-9])/,
        valid_length: [16]
      }, {
        name: 'laser',
        pattern: /^(6304|670[69]|6771)/,
        valid_length: [16, 17, 18, 19]
      }, {
        name: 'visa_electron',
        pattern: /^(4026|417500|4508|4844|491(3|7))/,
        valid_length: [16]
      }, {
        name: 'visa',
        pattern: /^4/,
        valid_length: [16]
      }, {
        name: 'mastercard',
        pattern: /^5[1-5]/,
        valid_length: [16]
      }, {
        name: 'maestro',
        pattern: /^(5018|5020|5038|6304|6759|676[1-3])/,
        valid_length: [12, 13, 14, 15, 16, 17, 18, 19]
      }, {
        name: 'discover',
        pattern: /^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)/,
        valid_length: [16]
      }
    ];
    if (options == null) {
      options = {};
    }
    if ((_ref = options.accept) == null) {
      options.accept = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = card_types.length; _i < _len; _i++) {
          card = card_types[_i];
          _results.push(card.name);
        }
        return _results;
      })();
    }
    _ref1 = options.accept;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      card_type = _ref1[_i];
      if (__indexOf.call((function() {
        var _j, _len1, _results;
        _results = [];
        for (_j = 0, _len1 = card_types.length; _j < _len1; _j++) {
          card = card_types[_j];
          _results.push(card.name);
        }
        return _results;
      })(), card_type) < 0) {
        throw "Credit card type '" + card_type + "' is not supported";
      }
    }
    get_card_type = function(number) {
      var _j, _len1, _ref2;
      _ref2 = (function() {
        var _k, _len1, _ref2, _results;
        _results = [];
        for (_k = 0, _len1 = card_types.length; _k < _len1; _k++) {
          card = card_types[_k];
          if (_ref2 = card.name, __indexOf.call(options.accept, _ref2) >= 0) {
            _results.push(card);
          }
        }
        return _results;
      })();
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        card_type = _ref2[_j];
        if (number.match(card_type.pattern)) {
          return card_type;
        }
      }
      return null;
    };
    is_valid_luhn = function(number) {
      var digit, n, sum, _j, _len1, _ref2;
      sum = 0;
      _ref2 = number.split('').reverse();
      for (n = _j = 0, _len1 = _ref2.length; _j < _len1; n = ++_j) {
        digit = _ref2[n];
        digit = +digit;
        if (n % 2) {
          digit *= 2;
          if (digit < 10) {
            sum += digit;
          } else {
            sum += digit - 9;
          }
        } else {
          sum += digit;
        }
      }
      return sum % 10 === 0;
    };
    is_valid_length = function(number, card_type) {
      var _ref2;
      return _ref2 = number.length, __indexOf.call(card_type.valid_length, _ref2) >= 0;
    };
    validate_number = function(number) {
      var length_valid, luhn_valid;
      card_type = get_card_type(number);
      luhn_valid = false;
      length_valid = false;
      if (card_type != null) {
        luhn_valid = is_valid_luhn(number);
        length_valid = is_valid_length(number, card_type);
      }
      return callback({
        card_type: card_type,
        luhn_valid: luhn_valid,
        length_valid: length_valid
      });
    };
    validate = function() {
      var number;
      number = normalize($(this).val());
      return validate_number(number);
    };
    normalize = function(number) {
      return number.replace(/[ -]/g, '');
    };
    this.bind('input', function() {
      $(this).unbind('keyup');
      return validate.call(this);
    });
    this.bind('keyup', function() {
      return validate.call(this);
    });
    if (this.length !== 0) {
      validate.call(this);
    }
    return this;
  };

}).call(this);

});

;require.register("lib/router", function(exports, require, module) {
var application = require('application')

module.exports = Backbone.Router.extend({
    routes: {
        'register/': 'register',
        'anw/prototype/register/': 'register',
        '*page': 'home'
    },
    
    home: function() {
        $('body').html(application.homeView.render().el)
    },
    
    register: function() {
        $('body').html(application.registerView.render().el)
    }
})

});

;require.register("lib/view_helper", function(exports, require, module) {
// Put handlebars.js helpers here

});

;require.register("models/collection", function(exports, require, module) {
// Base class for all collections
module.exports = Backbone.Collection.extend({
    
})

});

;require.register("models/model", function(exports, require, module) {
// Base class for all models
module.exports = Backbone.Model.extend({
    
})

});

;require.register("views/anw.ui.pin", function(exports, require, module) {
var defaultOptions=  {
	onComplete: function () {}
}

function Pin($el, options) {
	this.$el = $el;
	this.options = $.extend(true, {}, defaultOptions, options);

	this.init();
}

Pin.prototype.init = function init() {
	var self = this;
	this.update();

	$('.pwd-pin', this.$el).on('keyup focus', function () {
		var $this = $(this);
		var len = $this.val().length;

		var pins = $('.pin', self.$el).removeClass('focus filled');
		pins.eq(len).addClass('focus');
		pins.slice(0, len).addClass('filled');

		if (len === 4) {
			$this.blur();
			self.options.onComplete();
		}
	}).on('blur', function () {
		$('.pin', self.$el).removeClass('focus')
	});


	$(window).resize(function () {
		self.update();
	});
};

Pin.prototype.update = function update() {
	var $pins = $('> div', this.$el);

	var w = this.$el.width() - 30;
	var pinW = Math.round(w/4);
	var lastPinW = pinW + (w - pinW*4);
	$pins.width(pinW);
	$pins.eq(3).width(lastPinW);

	console.log(w, pinW, lastPinW);
}

module.exports = Pin;
});

;require.register("views/anw.ui.step", function(exports, require, module) {
var defaultOptions=  {
	onConfirm: function () {},
	onBack: function () {},
	onClickEdit: function () {},
	onActivate: function () {}
}

function Step($el, options) {
	this.$el = $el;
	this.options = $.extend(true, {}, defaultOptions, options);

	this.init();
};

Step.prototype.init = function init() {
	this.form = $('form', this.$el).parsley({showErrors:false});
	this.btnConfirm = $('.button.confirm', this.$el);
	this.btnBack = $('.button.go-back', this.$el);
	this.btnEdit = $('.edit', this.$el);
	this.bindEvents();
};

Step.prototype.validate = function validate() {
	console.log('validate');
	if (this.form.isValid()) {
		this.$el.addClass('filled');
		this.btnConfirm.removeClass('disabled');
	} else {
		this.$el.removeClass('filled');
		this.btnConfirm.addClass('disabled');
	}
};

Step.prototype.activate = function activate() {
	this.options.onActivate(this);
	this.$el.addClass('active');
};

Step.prototype.deactivate = function deactivate() { this.$el.removeClass('active'); };

Step.prototype.bindEvents = function bindEvents() {
	var self = this;

	$('input', this.$el).on('keyup change', function () {
		setTimeout(function () {
			self.validate();
		}, 100);
	});

	this.btnConfirm.on('click', function () {
		var $this = $(this);
		if (!$this.hasClass('disabled')) {
			self.deactivate();
			setTimeout(function () {
				self.options.onConfirm();
			}, 640)
		}
	});

	this.btnBack.on('click', function () {
		self.deactivate();
		setTimeout(function () {
			self.options.onBack();
		}, 640)
	});

	this.btnEdit.on('click', function () {
		self.options.onClickEdit(self);
	})
};

module.exports = Step;
});

;require.register("views/home_view", function(exports, require, module) {
var View     = require('./view')
  , template = require('./templates/home')

module.exports = View.extend({
    id: 'home-view',
    template: template
})

});

;require.register("views/register_view", function(exports, require, module) {
var View     = require('./view')
  , template = require('./templates/register')

module.exports = View.extend({
    id: 'register-view',
    template: template
})

});

;require.register("views/templates/completed", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<script>\n\n</script>\n\n<div class=\"header register\">\n	<a href=\"\" class=\"back\"></a>\n	<span class=\"total\">£130.00</span>\n</div>\n\n<div class=\"logo\"></div>\n\n<div class=\"wrapper\">\n\n<div class=\"content page-completed\">\n	<p class=\"thank-you\">Thanks, Rachel.<br />You're ready to pay with Network Wallet.</p>\n	<div class=\"payment-type\">\n		<div class=\"header\"><h2>Payment type:</h2></div>\n		<div class=\"credit-card\"><span>**** **** **** 3456</span></div>\n		<a href=\"\" class=\"edit-card\">Edit</a>\n	</div>\n\n	<div class=\"shipping-to\">\n		<div class=\"header\"><h2>Shipping to:</h2></div>\n		<div class=\"address\">\n			<p>445 Mount End Road<br />Mount Eden<br />Auckland<br />5022</p>\n			<a href=\"\" class=\"edit-address\">Edit</a>\n		</div>		\n	</div>\n\n	<p class=\"you-re-about\">You are about to return to John Lewis to pay £130.00.</p>\n\n	<a href=\"\" class=\"button return\">Confirm and Pay Merchant</a>\n</div>\n\n<div class=\"footer\">\n	<a href=\"\" class=\"terms-of-service\">Terms of Service</a>\n	<a href=\"\" class=\"privacy-statement\">Privacy Statement</a>\n	<a href=\"\" class=\"faq\">FAQ</a>\n	<p>All users of our services to Privacy Statement and agree to bound by Terms of Service. \n	<br />Please review.<br />&copy; 2014 American Express Company.<br />All rights reserved.</p>\n</div>\n\n</div>";
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/home", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<script>\n\n\n\n</script>\n\n<div class=\"header\">\n	<a href=\"\" class=\"back\"></a>\n	<span class=\"total\">£130.00</span>\n</div>\n\n<div class='carousel' id=\"carousel\">\n  <div class='carousel-wrap'>\n    <div class=\"slide slide-1\">\n    	<div><h3>Network Wallet</h3>\n    	<p>A faster way to shop online</p></div>\n    </div>\n    <div class=\"slide slide-2\">\n    	<div><h3>Check out faster.</h3>\n    	<p>Save tie by pre-populating your details - <br />just review and confirm.</p></div>\n    </div>\n    <div class=\"slide slide-3\">\n    	<div><h3>Save your information.</h3>\n    	<p>Store different cards and shipping address when shopping.</p></div>\n    </div>\n    <div class=\"slide slide-4\">\n    	<div><h3>Enjoy peace of mind.</h3>\n    	<p>Your financial and personal information will be secure with American Express.</p></div>\n    </div>\n  </div>\n	<div class=\"carousel-navigation\">\n	    <ul>\n	    <li class=\"active\"></li>\n	    <li></li>\n	    <li></li>\n	    <li></li>\n	    </ul>\n	</div>\n</div>\n\n<div class=\"wrapper\">\n<div class=\"content page-login\">\n	<a href=\"\" class=\"button register\">Register with Network Wallet</a>\n	<div class=\"divider\"><span>or</span></div>\n	<div class=\"form sign-in\">\n		<h2>Sign in</h2>\n		<form action=\"\">\n			<label for=\"email\">Email address</label>\n			<input type=\"text\" class=\"email\" id=\"email\" />\n			<label for=\"pin\">Password</label>\n			<input type=\"text\" class=\"password\" />\n		</form>\n	</div>\n	<div class=\"remember-me-container\">\n		<input type=\"checkbox\" name=\"remember-me\" id=\"remember-me\">\n		<label for=\"remember-me\" class=\"checkbox-style\"></label>\n		<label for=\"remember-me\">Remember me</a></label>		\n	</div>\n	<a href=\"\" class=\"button sign-in\">Sign in</a>\n	<a href=\"#\" class=\"forgot-details\">Forgot your details?</a>\n</div>\n\n<div class=\"footer\">\n	<a href=\"\" class=\"terms-of-service\">Terms of Service</a>\n	<a href=\"\" class=\"privacy-statement\">Privacy Statement</a>\n	<a href=\"\" class=\"faq\">FAQ</a>\n	<p>All users of our services to Privacy Statement and agree to bound by Terms of Service. \n	<br />Please review.<br />&copy; 2014 American Express Company.<br />All rights reserved.</p>\n</div>	\n	\n</div>\n";
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/register", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<script>\n\n</script>\n\n<div class=\"header register\">\n	<a href=\"\" class=\"back\"></a>\n	<span class=\"total\">£130.00</span>\n</div>\n\n<div class=\"logo\"></div>\n\n\n<div class=\"wrapper\">\n\n<div class=\"content page-register\">\n	<div class=\"step new-account active\">\n		<div class=\"step-header\">\n			<div class=\"empty\"><h2>Create new wallet</h2></div>\n			<div class=\"filled\"><h2>r****@gmail.com</h2><span class=\"edit\">Edit</span></div>\n		</div>\n		\n		<div class=\"form register\">\n			<p>Please enter email address and create a password. This will be how you log in to your Network Wallet.</p>\n			<form action=\"\" data-parsley-ui-enabled=\"false\">\n				<fieldset><label for=\"email\">Enter email address</label>\n				<input type=\"email\" class=\"email\" id=\"email\" required></fieldset>\n				<fieldset><label for=\"confirm-email\">Confirm email address</label>\n				<input type=\"email\" class=\"confirm-email\" id=\"confirm-email\" required></fieldset>\n\n				<fieldset>\n					<label for=\"create-password\">Create password</label>\n					<p class=\"password-info\">\n						Your password: <span class=\"validation different-from-email\">must be different than your email address</span>, <span class=\"validation characters-length\">must contain 8 to 20 characters</span>, <span class=\"validation letter-number\">including one letter and number</span>, and <span class=\"validation no-spaces\">not contain any spaces</span>.\n					</p>\n					<input type=\"password\" class=\"create-password\" id=\"create-password\" required>\n				</fieldset>\n				<fieldset>\n					<label for=\"confirm-password\">Confirm password</label>\n					<input type=\"password\" class=\"confirm-password\" id=\"confirm-password\" required>\n				</fieldset>\n\n				<div class=\"privacy-container\">\n					<input type=\"checkbox\" name=\"privacy\" value=\"privacy\"  id=\"privacy\" required>\n					<label for=\"privacy\" class=\"checkbox-style\"></label>\n					<label for=\"privacy\">Check here to confirm your review and acceptiance of our <a>Terms of Use</a></label>	\n				</div>\n				\n				<div class=\"agreement-container\">\n					<input type=\"checkbox\" name=\"agreement\" value=\"agreement\" id=\"agreement\" required>\n					<label for=\"agreement\" class=\"checkbox-style\"></label>\n					<label for=\"agreement\">You signify you gave reviewed and agreed to the <a>American Express User Agreement</a></label>\n				</div>\n				\n				<div class=\"button-container\">\n					<div class=\"button confirm disabled\"><span class=\"long-label\">Next</span><span class=\"short-label\">Next</span></div>\n					<div class=\"button go-back secondary\"><span class=\"long-label\">Back</span><span class=\"short-label\">Back</span></div>		\n				</div>\n\n			</form>\n		</div>\n	</div><div class=\"step link-to-card\">\n		<div class=\"step-header\">\n			<div class=\"empty\"><h2>Add card to wallet</h2></div>\n			<div class=\"filled\"><h2>**** 3456</h2><span class=\"cc-icon\"></span><span class=\"edit\">Edit</span></div>\n		</div>\n		\n		<div class=\"form\">\n			<form>\n			<fieldset><label for=\"card-name\">Name on card</label>\n			<input type=\"text\" class=\"card-name\" id=\"card-name\" placeholder=\"First Last\" required></fieldset>\n			<fieldset class=\"credit-card-container\"><label for=\"card-number\">Card number</label>\n			<input type=\"text\" class=\"card-number\" id=\"card-number\" placeholder=\"Enter digits\" pattern=\"[0-9]*\" maxlength=\"16\" required>\n			<span class=\"cc-icon\"></span>\n			</fieldset>\n			<div class=\"expiry-security-container\">\n				<div class=\"expiry-date-container\">\n				<label for=\"expiry-date\">Expiry date</label>\n				<input type=\"text\" class=\"expiry-date\" id=\"expiry-date\" placeholder=\"MM / DD\" pattern='[0-9]*' required>\n				</div>\n				<div class=\"security-code-container\">\n					<label for=\"security-code\">Security code</label><a href=\"\" tabindex=\"-1\" class=\"security-code-info\"><img src=\"images/tooltip_cards.png\" /></a>\n					\n					<input type=\"text\" class=\"security-code\" id=\"security-code\" placeholder=\"3 or 4 digits\" pattern=\"[0-9]*\"  maxlength=\"4\" required>\n				</div>				\n			</div>\n\n\n\n			<div class=\"button-container\">\n				<div class=\"button confirm disabled\"><span class=\"long-label\">Next</span><span class=\"short-label\">Next</span></div>\n				<div class=\"button go-back secondary\"><span class=\"long-label\">Back</span><span class=\"short-label\">Back</span></div>		\n			</div>\n			</form>\n		</div>\n	</div><div class=\"step add-billing-details\">\n		<div class=\"step-header\">\n			<div class=\"empty\"><h2>Add billing details</h2></div>\n			<div class=\"filled\"><h2>445 Mount Edan Road, Mount Eden, Auckland</h2><span class=\"edit\">Edit</span></div>\n		</div>\n\n		<div class=\"form\">\n			<p>\n				This billing address must be the same as the one on file with the bank that issued your card.\n			</p>\n			<form>\n			<fieldset><label for=\"country\">Country</label>\n			<input type=\"text\" class=\"country\" id=\"country\" required></fieldset>\n\n			<div class=\"address-container\">\n				<fieldset><label for=\"address-1\">Address line 1</label>\n				<input type=\"text\" class=\"address-1\" id=\"address-1\" required></fieldset>\n				<fieldset><label for=\"address-2\">Address line 2 (optional)</label>\n				<input type=\"text\" class=\"address-2\" id=\"address-2\"></fieldset>\n				<fieldset><label for=\"city\">City</label>\n				<input type=\"text\" class=\"city\" id=\"city\" required></fieldset>\n\n				<div class=\"state-postcode-container\">\n					<div class=\"state-container\">\n					<label for=\"state\">State / Region</label>\n					<input type=\"text\" class=\"state\" id=\"state\" required>\n					</div>\n					<div class=\"postcode-container\">\n						<label for=\"postcode\">Postcode</label>\n						<input type=\"text\" class=\"postcode\" id=\"postcode\" required>\n					</div>			\n				</div>\n				\n			</div>\n\n			<div class=\"address-uk-container\">\n				<fieldset><label for=\"postcode-uk\">Post code</label>\n				<input type=\"text\" class=\"postcode-uk\" id=\"postcode-uk\" ></fieldset>\n				<div class=\"button postcode-search\">Look up</div>			\n			</div>\n\n				<div class=\"button-container\">\n					<div class=\"button confirm disabled\"><span class=\"long-label\">Next</span><span class=\"short-label\">Next</span></div>\n					<div class=\"button go-back secondary\"><span class=\"long-label\">Back</span><span class=\"short-label\">Back</span></div>		\n				</div>\n			</form>\n		</div>\n	</div><div class=\"step add-shipping-details\">\n		<div class=\"step-header\">\n			<div class=\"empty\"><h2>Add shipping details</h2></div>\n			<div class=\"filled\"><h2>445 Mount Edan Road, Mount Eden, Auckland</h2><span class=\"edit\">Edit</span></div>\n		</div>\n		<div class=\"form\">\n			<form>\n			<div class=\"use-billing-container\">\n			<input type=\"checkbox\" name=\"use-billing-address\" value=\"use-billing-address\" id=\"use-billing-address\">\n			<label for=\"use-billing-address\" class=\"checkbox-style\"></label>\n			<label for=\"use-billing-address\">Use my billing address</label>\n			</div>\n\n			<fieldset><label for=\"country\">Country</label>\n			<input type=\"text\" class=\"country\" id=\"country\" required></fieldset>\n\n			<div class=\"address-container\">\n				<fieldset><label for=\"address-1\">Address line 1</label>\n				<input type=\"text\" class=\"address-1\" id=\"address-1\" required></fieldset>\n				<fieldset><label for=\"address-2\">Address line 2 (optional)</label>\n				<input type=\"text\" class=\"address-2\" id=\"address-2\"></fieldset>\n				<fieldset><label for=\"city\">City</label>\n				<input type=\"text\" class=\"city\" id=\"city\" required></fieldset>\n\n				<div class=\"state-postcode-container\">\n					<div class=\"state-container\">\n					<label for=\"state\">State / Region</label>\n					<input type=\"text\" class=\"state\" id=\"state\" required>\n					</div>\n					<div class=\"postcode-container\">\n						<label for=\"postcode\">Postcode</label>\n						<input type=\"text\" class=\"postcode\" id=\"postcode\" required>\n					</div>			\n				</div>\n			</div>\n\n			<div class=\"address-uk-container\">\n				<fieldset><label for=\"postcode-uk\">Post code</label>\n				<input type=\"text\" class=\"postcode-uk\" id=\"postcode-uk\" ></fieldset>\n				<div class=\"button postcode-search\">Look up</div>			\n			</div>\n				<div class=\"button-container\">\n					<div class=\"button confirm disabled\"><span class=\"long-label\">Confirm</span><span class=\"short-label\">Confirm</span></div>\n					<div class=\"button go-back secondary\"><span class=\"long-label\">Back</span><span class=\"short-label\">Back</span></div>		\n				</div>\n			</form>\n		</div>\n	</div>\n</div>\n\n<div class=\"footer\">\n	<a href=\"\" class=\"terms-of-service\">Terms of Service</a>\n	<a href=\"\" class=\"privacy-statement\">Privacy Statement</a>\n	<a href=\"\" class=\"faq\">FAQ</a>\n	<p>All users of our services to Privacy Statement and agree to bound by Terms of Service. \n	<br />Please review.<br />&copy; 2014 American Express Company.<br />All rights reserved.</p>\n</div>\n\n</div>";
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/safekey", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<script>\n\n</script>\n\n<div class=\"header register\">\n	<a href=\"\" class=\"back\"></a>\n	<span class=\"total\">£130.00</span>\n</div>\n\n<div class=\"logo\"></div>\n\n<div class=\"content page-safekey\">\n	<div class=\"safekey-logo\"></div>\n	<div class=\"spinner\" id=\"spinner\"></div>\n</div>";
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/view", function(exports, require, module) {
require('lib/view_helper')

// Base class for all views
module.exports = Backbone.View.extend({
    
    initialize: function(){
        this.render = _.bind(this.render, this)
    },
    
    template: function(){},
    getRenderData: function(){
        return {
            baseSrc: '/'
        }
    },
    
    render: function(){
        this.$el.html(this.template(this.getRenderData()))
        this.afterRender()
        return this
    },
    
    afterRender: function(){}
    
})

});

;
//# sourceMappingURL=app.js.map