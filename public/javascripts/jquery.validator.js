// jquery.validator.js
// 
// 0.6
// 
// Stephen Band
// 
// Strongly inspired by jquery.validate.js (Jörn Zaefferer) - some regex is borrowed
// from there. I chose not to use that plugin to avoid bloat (I'm not saying that
// jquery.validate is bloated: it's one of the best jQuery plugins out there, but
// instead of hacking through 1200 lines of code I chose to make a plug that does
// exactly what we need it to do).
// 
// Validation rules can be added to the rules object like this:
//
// jQuery.fn.validator.rules[ruleName] = {
//		test: function(field, value) - the validation logic, returning true (pass) or false (fail)
// }
//
// Define error messages in html by giving the field the data-error-ruleName attribute:
//
// <input data-error-ruleName="Custom error message" />
//
// Display error messages in whatever DOMNode you like, by defining options.errorNode

(function(jQuery, undefined){
	var options = {
				errorClass: "error",
				errorNode: jQuery('<label/>', { 'class': 'error-message' }),
				errorWrapSelector: "p, fieldset, div"
			},
			
			debug = (window.console && window.console.log),
			
			// Regex
			regex = {
				//url:			/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
				url:      /^(http\:\/\/)?[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,6}/, //(/\S*)?/, //  /^http\:/
				email:		/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
				number:		/^(\d+\.?\d+?)$/
			},
			
			// html5 input types
			types = {
				// type url reports type text in FF3.6
				url: {
					test: function( value ) { return regex.url.test(value); },
					error: 'This doesn\'t look like a valid url to me'
				},
				email: {
					test: function( value ) { return regex.email.test(value); },
					error: 'Enter a valid email'
				},
				number: {
					test: function( value ) { return regex.number.test(value); },
					error: 'That\'s not a number.'
				}
				//datetime: {},
				//date: {},
				//month: {},
				//week: {},
				//time: {},
				//'datetime-local': {},
				//range: {},
				//tel: {},
				//search: {},
				//color: {},
			},
			
			rules = {
				type: {
					test: function( field, value ){
						var type = field.attr("type");
						
						return ( !value || !type || !types[type] || types[type].test(value) ) ||
							types[type].error ;
					}
				},
				required: {
					test: function( field, value ) {
						var required = field.attr("required");
						
						return ( !required || !!value ) ||
							'This is required';
					}
				},
				minlength: {
					test: function( field, value ) {
						var minlength = field.attr("minlength");
						
						return ( !value || !minlength || value.length >= minlength ) ||
							'Not long enough. At least '+minlength+' characters' ;
					}
				},
				maxlength: {
					test: function( field, value ) {
						var maxlength = field.attr("maxlength"),
								number = parseInt( maxlength );
						
						// Be careful, if there is no value maxlength is implicitly there
						// whether it's in the html or not, and sometimes it's -1
						return ( !value || !maxlength || number === -1 || value.length <= number ) ||
							'Too long. '+maxlength+' characters at most.' ;
					}
				}
			};
	
	// Here's the meat and potatoes
	function handle(node, options){
		var field = jQuery(node),
				value = jQuery.trim( field.val() ),
				data = field.data('validate'),
				rule, response;
		
		for (rule in rules) {
			response = rules[rule].test( field, value );
			
			// If the response is true, it passed this test
			if ( response === true ) {
				
				// Remove the error message
				if ( data ) {
					if ( data[rule] === false ) {
						data[rule] = true;
						data.errorNode.remove();
					}
				}
			}
			else {
				// If the fail callback returns true, override the
				// failure, and don't do any more tests. Just pass
				// it.
				if ( options.fail && options.fail.call(node, value, response) === true ) {
					
					// In case the fail callback modified the value,
					// get it again
					value = field.val();
					
					// Remove the error message
					if ( data ) {
						if ( data[rule] === false ) {
							data[rule] = true;
							data.errorNode.remove();
						}
					}
					
					break;
				}
				// Otherwise, it's the end of the road for this one
				else {
					if (!data) {
						data = {
							errorNode: options.errorNode
								.clone()
								.attr("for", field.attr("id") || "" )
						};
						field.data('validate', data);
					}
					
					data.errorNode
					.html( field.attr('data-error-'+rule) || response );
					
					data[rule] = false;
					
					field
					.after( data.errorNode )
					.closest( options.errorWrapSelector )
					.addClass( options.errorClass );
					
					return false;
				}
			};
		}
		
		// If we survived that loop, we passed validation
		
		// Remove error class
		field
		.closest( '.' + options.errorClass )
		.removeClass( options.errorClass );
		
		// Fire callback with input as context and arguments
		// value(string), checked(boolean)
		if ( options.pass ) {
			options.pass.call( node, value, field.attr('checked') );
		}
		
		return true;
	};
	
	jQuery.fn.validator = function(options){
		var o = jQuery.extend({}, jQuery.fn.validator.options, options);
		
		return this
		.bind('submit', { options: o }, function(e){
			var form = $(this),
					data = form.data('validator'),
					rule, validator, fields;
			
			if (!data) {
				data = {
					attempt: 0
				};
				form.data('validator', data);
			}
			
			fields = form
			.find( 'input, textarea' )
			.each( function(i){
				if ( !handle(this, o) ) { e.preventDefault(); }
			});
				
			// Dont go on to delegate events when it has already been done
			// or when there's no fields to validate
			if ( data.attempt || fields.length === 0 ) { return; }
				
			form
			.delegate( 'input, textarea', 'change', function(){ handle(this, o); } );
			
			data.attempt++;
		});
	};
	
	// Call .validate() on each of a forms inputs
	// and textareas, and call pass if everything
	// passed and fail if at least one thing failed
	function handleForm( node, options ){
		var failCount = 0;
		
		jQuery(node)
		.find("input, textarea")
		.validate({
		  pass: function( value ){
		  	if (debug) { console.log( value + ' - PASS' ); }
		  },
		  fail: function( value ){
		  	if (debug) { console.log( value + ' - FAIL' ); }
		  	failCount++;
		  }
		});
		
		if (failCount && options.fail) {
		  options.fail.call(this);
		}
		else if (options.pass) {
		  options.pass.call(this);
		}
	}
	
	jQuery.fn.validate = function(o){
		var options = jQuery.extend({}, jQuery.fn.validator.options, o);
		
		return this.each(function(i){
			var tagName = this.nodeName.toLowerCase();
			
			if (tagName === 'form') {
				handleForm(this, options);
			}
			else if (tagName === 'input' || tagName === 'textarea') {
				handle(this, options);
			}
		});
	};
	
	jQuery.fn.validator.regex = regex;
	jQuery.fn.validator.options = options;
	jQuery.fn.validator.rules = rules;
	
})(jQuery);



// Extend validation with support for extra, non-standard
// types, via the attribute data-type="xxx", eg:
//
// <input data-type="cssvalue" />
//
// Possible values:
//
// cssvalue
// csscolor
// imageurl
// email (workaround for rails)

(function(jQuery, undefined){

	var regex = {
				hexColor: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
				hslColor: /^(?:hsl\()?\s?([0-9]{1,3})\s?,\s?([0-9]{1,3})%\s?,\s?([0-9]{1,3})%\s?\)?$/,
				rgbColor: /^(?:rgb\()?\s?([0-9]{1,3})\s?,\s?([0-9]{1,3})\s?,\s?([0-9]{1,3})\s?\)?$/,
				cssValue: /^(0)$|^(\-?\d+(?:\.\d+)?)\s?(px|%|em|ex|pt|in|cm|mm|pt|pc)$/,
				cssAngle:	/^-?[0-9]+deg$/,
				imgFile:	/(?:\.png|\.gif|\.jpeg|\.jpg)$/
			},
			
			cssColors = {
				transparent: true,
				// CSS3 color names
				aliceblue: true,
				antiquewhite: true,
				aqua: true,
				aquamarine: true,
				azure: true,
				beige: true,
				bisque: true,
				black: true,
				blanchedalmond: true,
				blue: true,
				blueviolet: true,
				brown: true,
				burlywood: true,
				cadetblue: true,
				chartreuse: true,
				chocolate: true,
				coral: true,
				cornflowerblue: true,
				cornsilk: true,
				crimson: true,
				cyan: true,
				darkblue: true,
				darkcyan: true,
				darkgoldenrod: true,
				darkgray: true,
				darkgreen: true,
				darkgrey: true,
				darkkhaki: true,
				darkmagenta: true,
				darkolivegreen: true,
				darkorange: true,
				darkorchid: true,
				darkred: true,
				darksalmon: true,
				darkseagreen: true,
				darkslateblue: true,
				darkslategray: true,
				darkslategrey: true,
				darkturquoise: true,
				darkviolet: true,
				deeppink: true,
				deepskyblue: true,
				dimgray: true,
				dimgrey: true,
				dodgerblue: true,
				firebrick: true,
				floralwhite: true,
				forestgreen: true,
				fuchsia: true,
				gainsboro: true,
				ghostwhite: true,
				gold: true,
				goldenrod: true,
				gray: true,
				green: true,
				greenyellow: true,
				grey: true,
				honeydew: true,
				hotpink: true,
				indianred: true,
				indigo: true,
				ivory: true,
				khaki: true,
				lavender: true,
				lavenderblush: true,
				lawngreen: true,
				lemonchiffon: true,
				lightblue: true,
				lightcoral: true,
				lightcyan: true,
				lightgoldenrodyellow: true,
				lightgray: true,
				lightgreen: true,
				lightgrey: true,
				lightpink: true,
				lightsalmon: true,
				lightseagreen: true,
				lightskyblue: true,
				lightslategray: true,
				lightslategrey: true,
				lightsteelblue: true,
				lightyellow: true,
				lime: true,
				limegreen: true,
				linen: true,
				magenta: true,
				maroon: true,
				mediumaquamarine: true,
				mediumblue: true,
				mediumorchid: true,
				mediumpurple: true,
				mediumseagreen: true,
				mediumslateblue: true,
				mediumspringgreen: true,
				mediumturquoise: true,
				mediumvioletred: true,
				midnightblue: true,
				mintcream: true,
				mistyrose: true,
				moccasin: true,
				navajowhite: true,
				navy: true,
				oldlace: true,
				olive: true,
				olivedrab: true,
				orange: true,
				orangered: true,
				orchid: true,
				palegoldenrod: true,
				palegreen: true,
				paleturquoise: true,
				palevioletred: true,
				papayawhip: true,
				peachpuff: true,
				peru: true,
				pink: true,
				plum: true,
				powderblue: true,
				purple: true,
				red: true,
				rosybrown: true,
				royalblue: true,
				saddlebrown: true,
				salmon: true,
				sandybrown: true,
				seagreen: true,
				seashell: true,
				sienna: true,
				silver: true,
				skyblue: true,
				slateblue: true,
				slategray: true,
				slategrey: true,
				snow: true,
				springgreen: true,
				steelblue: true,
				tan: true,
				teal: true,
				thistle: true,
				tomato: true,
				turquoise: true,
				violet: true,
				wheat: true,
				white: true,
				whitesmoke: true,
				yellow: true,
				yellowgreen: true
			},
			
			urlBlacklist = [
      	'http://nytimes.com'
      ],
			
			
			// Data types
			dataTypes = {
				cssvalue: {
					test: function( value ) {
						return regex.cssValue.test(value);
					},
					error: 'Not a valid CSS value'
				},
				csscolor: {
					test: function( value ) {
						return (
							regex.hexColor.test( value ) ||
							regex.hslColor.test( value ) ||
							regex.rgbColor.test( value ) ||
							cssColors[value]
						);
					},
					error: 'Not a valid CSS color value'
				},
				cssangle: {
					test: function( value ) {
						return regex.cssAngle.test(value);
					},
				  error: 'A valid CSS angle, that isn\'t'
				},
				imageurl: {
					test: function( value ) {
						return (
							jQuery.fn.validator.regex.url.test( value ) ||
							regex.imgFile.test( value )
						);
					}
				},
				// Rails doesn't do html5 forms yet. This is a workaround
				email: {
					test: function( value ) { return jQuery.fn.validator.regex.email.test(value); },
				 	error: 'Enter a valid email'
				},
				
				webdoc_iframe_url: {
				  test: function(value) {
            var pattern_has_protocole = /^(ftp|http|https):\/\/?(\w*)/;
      	    var consolidateSrc = "";
      	    if (jQuery.fn.validator.regex.url.test(value)) {      	      
      	      if (value.match(pattern_has_protocole)) {
                consolidateSrc = value;
              }
              else {
                consolidateSrc = "http://" + value;
              }

        	    if(jQuery.inArray(consolidateSrc, urlBlacklist) == -1){
        	      return true;
        	    }
        	    else {
        	      ddd('Src in blacklist');
        	      return false;
        	    }
      	    }
          },
				  error: 'Url not valid'
				}
			};
	
	jQuery.fn.validator.rules.dataTypes = {
		test: function( field, value ){
			var type = field.attr("data-type");
			
			return ( !value || !type || !dataTypes[type] || dataTypes[type].test(value) ) ||
				dataTypes[type].error ;
		}
	}

})(jQuery);