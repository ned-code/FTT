// jquery.validator.js
// 
// Stephen Band
// 
// Strongly inspired by jquery.validate.js (Jörn Zaefferer), indeed, regex is borrowed
// from there. Why did I choose not to use that plugin, then? To avoid bloat. Now, I'm
// not claiming that jquery.validate is un-neccessarily bloated: it's one of the best
// jQuery plugins out there. But it failed my first test (responding to the attribute
// required="required"), and instead of hacking through 1146 lines of code I chose to
// make a plug that does exactly what we need it to do. And no more.
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


(function(jQuery, undefined){
	var options = {
				errorClass: "error",
				errorMessageClass: "error-message",
				errorWrapSelector: "p, fieldset, div"
			},
			rules = {
				required: {
					selector: "input[required='required']",
					test: function(field){
						// Must have some value
						return !!( field.val() || field.text() );
					},
					error: 'This is required'
				},
			  email: {
					selector: "input[type='email'], input[name='user[email]']",
					test: function(field){
			  		// Must look like an email address
						// http://docs.jquery.com/Plugins/Validation/Methods/email
						// by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
						var value = field.val();
						return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);
			  	},
			  	error: 'Not a valid email'
				},
				url: {
					selector: "input[type='url']",
					test: function(field) {
						// Must look like a url
						// http://docs.jquery.com/Plugins/Validation/Methods/url
						// contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
						var value = field.val();
						return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
					},
					error: 'This doesn\'t look like a url'
				},
				minlength: {
					selector: "input[minlength]",
					test: function(field) {
						// Must be at least minlength characters
						var value = jQuery.trim( field.val() ),
								minlength = field.attr("minlength");
						rules.minlength.error = 'Should be min 6 characters';
						return !value || value.length >= minlength;
					},
					error: 'Not long enough'
				},
				maxlength: {
					selector: "input[maxlength]",
					test: function(field) {
						// Must be at least 6 characters
						var value = jQuery.trim( field.val() ),
								maxlength = field.attr("maxlength");
						return value.length <= maxlength;
					},
					error: 'Too long'
				}
			},
			errorNode = jQuery('<label/>', { 'class': options.errorMessageClass });
	
	// Here is the meat and potatoes
	function handle(e){
		var field = $(this),
				o = e.data.options,
				rule = arguments[1] || e.data.rule,
				data = field.data('validate');
		
		if ( rules[rule].test(field) ) {
			// Remove the error message
			if ( data ) {
				if ( data[rule] && data[rule].flag === false ) {
					data[rule].flag = true;
					data[rule].errorNode.remove();
				}
				
				// and if flags are still set let that be the end of it
				for (var key in data) {
					if ( data[key].flag === false ) {
						return;
					}
				}
				
				// otherwise remove error class
				field
				.closest( '.' + o.errorClass )
				.removeClass(o.errorClass);
			}
			
			// This field validated, so run along, now
			return;
		}
		
		e.preventDefault();
		
		if (!data) {
			data = {};
			field.data('validate', data);
		}
		
		// If flags are already set, then some other error got their first
		// Lets not confuse people by giving them loads of errors at once
		for (var key in data) {
		  if ( data[key].flag === false ) {
		  	return;
		  }
		}
		
		if (!data[rule]) {
			data[rule] = {
				errorNode: errorNode
					.clone()
					.attr("for", field.attr("id") )
					.html(
						field.attr('data-error-'+rule) || rules[rule].error
					)
			};
		}
		
		data[rule].flag = false;
		
		field
		.after( data[rule].errorNode )
		.closest( options.errorWrapSelector )
		.addClass( options.errorClass );
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
			
			for (rule in rules) {
				validator = rules[rule];
				
				fields = form
				.find( validator.selector )
				.each( function(){ handle.call(this, e, rule); } );
				
				// Dont go on to delegate events when it has already been done
				// or when there's no fields to validate for this rule
				if ( data.attempt || fields.length === 0 ) { continue; }
				
				form
				.delegate( validator.selector, 'blur', { options: o, rule: rule }, handle );
			}
			
			data.attempt++;
		});
	};
	
	jQuery.fn.validator.options = options;
	jQuery.fn.validator.rules = rules;
})(jQuery);