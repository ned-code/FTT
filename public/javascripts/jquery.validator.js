// jquery.validator.js
// 
// Stephen Band
// 
// Strongly inspired by jquery.validate.js (Jörn Zaefferer), indeed, regex is borrowed
// from there. Why did I choose not to use that plugin, then? To avoid bloat. Now, I'm
// not claiming that jquery.validate is un-neccessarily bloated: it's one of the best
// jQuery plugins out there. But it failed my first test (responding to the attribute
// required="required"), and instead of hacking through 1146 lines of code I chose to
// make a plug that does exactly what we need it to do.
// 
// Validation rules can be added to the rules object like this:
//
// jQuery.fn.validator.rules[ruleName] = {
//		selector: string 				- selects the field(s) to test against
//		test: function(field){} - the validation logic, returning true (valid) or false (invalid).
//		error: string 					- the error message
// }
//
// You can define error messages in html by giving the field the data- attribute:
//
// <input data-error-ruleName="Custom error message" />
//
// You can display error messages in whatever DOMNode you like, by defining options.errorNode

(function(jQuery, undefined){
	var options = {
				errorClass: "error",
				errorNode: jQuery('<label/>', { 'class': 'error-message' }),
				errorWrapSelector: "p, fieldset, div"
			},
			
			// Regex
			// url and email by Scott Gonzalez: http://projects.scottsplayground.com/iri/
			regex = {
				url:			/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
				email:		/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
				number:		/^(\d+\.?\d+?)$/
			},
			
			// Input types
			types = {
				url: {
					test: function( value ) { return regex.url.test(value); },
					error: 'This doesn\'t look like a valid url to me'
				},
				email: {
					test: function( value ) { return regex.email.test(value); },
			  	error: 'Enter a valid email'
				},
				number: {
					test: function( value ) { return regex.number.test(value) },
			  	error: 'That\'s not a number.'
				},
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
					selector: "input[type]",
					test: function( field, value ){
						var type = field.attr("type");
						
						return ( !value || !type || !types[type] || types[type].test(value) ) ||
							types[type].error ;
					}
				},
				required: {
					selector: "input[required], textarea[required]",
					test: function( field, value ) {
						var required = field.attr("required");
						
						return ( !required || !!value ) ||
							'This is required';
					}
				},
				minlength: {
					selector: "input[minlength]",
					test: function( field, value ) {
						var minlength = field.attr("minlength");
						
						return ( !value || !minlength || value.length >= minlength ) ||
							'Not long enough. At least '+minlength+' characters' ;
					}
				},
				maxlength: {
					selector: "input[maxlength]",
					test: function( field, value ) {
						var maxlength = parseInt( field.attr("maxlength") );
						
						// Be careful, maxlength is implicitly there whether it's
						// in the html or not, and sometimes it's -1
						return ( !value || maxlength === -1 || value.length <= maxlength ) ||
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
			
			if (response === true) {
				// Remove the error message
				if ( data ) {
				  if ( data[rule] && data[rule].flag === false ) {
						data[rule].flag = true;
						data[rule].errorNode.remove();
				  }
				}
			}
			else {
				if (!data) {
				  data = {};
				  field.data('validate', data);
				}
				
				if (!data[rule]) {
				  data[rule] = {
				  	errorNode: options.errorNode
				  		.clone()
				  		.attr("for", field.attr("id") || "" )
				  		.html( field.attr('data-error-'+rule) || response )
				  };
				}
				
				data[rule].flag = false;
				
				field
				.after( data[rule].errorNode )
				.closest( options.errorWrapSelector )
				.addClass( options.errorClass );
				
				if ( options.fail ) { options.fail.call(node, response); }
				
				return false;
			};
		}
		
		// If we survived that loop, we passed validation
		
		// Remove error class
		field
		.closest( '.' + options.errorClass )
		.removeClass( options.errorClass );
		
		// Fire callback
		if ( options.pass ) {
			options.pass.call(node, value);
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
	
	jQuery.fn.validate = function(o){
		var options = jQuery.extend({}, jQuery.fn.validator.options, o);
		
		return this.each(function(i){
			handle(this, options);
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

(function(jQuery, undefined){

	var regex = {
				hexColor: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
				hslColor: /^(?:hsl\()?\s?([0-9]{1,3})\s?,\s?([0-9]{1,3})%\s?,\s?([0-9]{1,3})%\s?\)?$/,
				rgbColor: /^(?:rgb\()?\s?([0-9]{1,3})\s?,\s?([0-9]{1,3})\s?,\s?([0-9]{1,3})\s?\)?$/,
				cssValue: /^(0)$|^(\-?\d+(?:\.\d+)?)\s?(px|%|em|ex|pt|in|cm|mm|pt|pc)$/
			},
			
			// CSS color names
			cssColors = {
			  aqua: true,
			  black: true,
			  blue: true,
			  fuchsia: true,
			  gray: true,
			  green: true,
			  lime: true,
			  maroon: true,
			  navy: true,
			  olive: true,
			  purple: true,
			  red: true,
			  silver: true,
			  teal: true,
			  white: true,
			  yellow: true,
			  transparent: true
			},
			
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
				  	)
				  },
				  error: 'Not a valid CSS color value'
				},
				// Rails doesn't do html5 forms yet. This is a workaround
				email: {
					test: function( value ) { return jQuery.fn.validator.regex.email.test(value); },
			  	error: 'Enter a valid email'
				}
			};
	
	jQuery.fn.validator.rules.dataTypes = {
		selector: "input[data-type]",
		test: function( field, value ){
		  var type = field.attr("data-type");
		  
		  return ( !value || !type || !dataTypes[type] || dataTypes[type].test(value) ) ||
		  	dataTypes[type].error ;
		}
	}

})(jQuery);