// tipsy, facebook style tooltips for jquery
// version 1.0.0a
// (c) 2008-2010 jason frame [jason@onehackoranother.com]
// releated under the MIT license

(function(jQuery) {
    
    function fixTitle(jQueryele) {
        if (jQueryele.attr('title') || typeof(jQueryele.attr('original-title')) != 'string') {
            jQueryele.attr('original-title', jQueryele.attr('title') || '').removeAttr('title');
        }
    }
    
    function Tipsy(element, options) {
        this.jQueryelement = jQuery(element);
        this.options = options;
        this.enabled = true;
        fixTitle(this.jQueryelement);
    }
    
    Tipsy.prototype = {
        show: function() {
            var title = this.getTitle();
            if (title && this.enabled) {
                var jQuerytip = this.tip();
                
                jQuerytip.find('.tipsy-inner')[this.options.html ? 'html' : 'text'](title);
                jQuerytip[0].className = 'tipsy'; // reset classname in case of dynamic gravity
                jQuerytip.remove().css({top: 0, left: 0, visibility: 'hidden', display: 'block'}).appendTo(document.body);
                
                var pos = jQuery.extend({}, this.jQueryelement.parent().offset(), {
                	width: this.jQueryelement[0].parentNode.offsetWidth,
                	height: this.jQueryelement[0].parentNode.offsetHeight
                });
                
                var actualWidth = jQuerytip[0].offsetWidth, actualHeight = jQuerytip[0].offsetHeight;
                var gravity = (typeof this.options.gravity == 'function')
                                ? this.options.gravity.call(this.jQueryelement[0])
                                : this.options.gravity;
                
                var tp;
                if(pos.top == 0) {
                	pos.top = 50;
		}

                switch (gravity.charAt(0)) {
                    case 'n':
                        tp = {top: pos.top + pos.height + this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
                        break;
                    case 's':
                        tp = {top: pos.top - actualHeight - this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
                        break;
                    case 'e':
                        tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth - this.options.offset};
                        break;
                    case 'w':
                        tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width + this.options.offset};
                        break;
                }
                
                if (gravity.length == 2) {
                    if (gravity.charAt(1) == 'w') {
                        tp.left = pos.left + pos.width / 2 - 15;
                    } else {
                        tp.left = pos.left + pos.width / 2 - actualWidth + 15;
                    }
                }
                
                jQuerytip.css(tp).addClass('tipsy-' + gravity);
                
                if (this.options.fade) {
                    jQuerytip.stop().css({opacity: 0, display: 'block', visibility: 'visible'}).animate({opacity: this.options.opacity});
                } else {
                    jQuerytip.css({visibility: 'visible', opacity: this.options.opacity});
                }
            }
        },
        
        hide: function() {
            if (this.options.fade) {
                this.tip().stop().fadeOut(function() { jQuery(this).remove(); });
            } else {
                this.tip().remove();
            }
        },
        
        getTitle: function() {
            var title, jQuerye = this.jQueryelement, o = this.options;
            fixTitle(jQuerye);
            var title, o = this.options;
            if (typeof o.title == 'string') {
                title = jQuerye.attr(o.title == 'title' ? 'original-title' : o.title);
            } else if (typeof o.title == 'function') {
                title = o.title.call(jQuerye[0]);
            }
            title = ('' + title).replace(/(^\s*|\s*jQuery)/, "");
            return title || o.fallback;
        },
        
        getTipsyObj: function() {
        	return this;
        },
        
        tip: function() {
            if (!this.jQuerytip) {
                this.jQuerytip = jQuery('<div class="tipsy"></div>').html('<div class="tipsy-arrow"></div><div class="tipsy-inner"/></div>');
            }
            return this.jQuerytip;
        },
        
        validate: function() {
            if (!this.jQueryelement[0].parentNode) {
                this.hide();
                this.jQueryelement = null;
                this.options = null;
            }
        },
        
        enable: function() { this.enabled = true; },
        disable: function() { this.enabled = false; },
        toggleEnabled: function() { this.enabled = !this.enabled; }
    };
    
    jQuery.fn.tipsy = function(options) {
    	if(this.data('tipsy')){
    		if (options === true) {
    			return this.data('tipsy');
            	} else if (typeof options == 'string') {
            		return this.data('tipsy')[options]();
        	}
    	}  	    
        
        options = jQuery.extend({}, jQuery.fn.tipsy.defaults, options);
       
        function get(ele) {
            var tipsy = jQuery.data(ele, 'tipsy');
            if (!tipsy) {
                tipsy = new Tipsy(ele, jQuery.fn.tipsy.elementOptions(ele, options));
                jQuery.data(ele, 'tipsy', tipsy);
            }
            return tipsy;
        }
        
        function enter() {
            var tipsy = get(this);
            tipsy.hoverState = 'in';
            if (options.delayIn == 0) {
                tipsy.show();
            } else {
                setTimeout(function() { if (tipsy.hoverState == 'in') tipsy.show(); }, options.delayIn);
            }
        };
        
        function leave() {
            var tipsy = get(this);
            tipsy.hoverState = 'out';
            if (options.delayOut == 0) {
                tipsy.hide();
            } else {
                setTimeout(function() { if (tipsy.hoverState == 'out') tipsy.hide(); }, options.delayOut);
            }
        };
        
        if (!options.live) this.each(function() { get(this); });
        
        if (options.trigger != 'manual') {
            var binder   = options.live ? 'live' : 'bind',
                eventIn  = options.trigger == 'hover' ? 'mouseenter' : 'focus',
                eventOut = options.trigger == 'hover' ? 'mouseleave' : 'blur';
            this[binder](eventIn, enter)[binder](eventOut, leave);
        }
        
        return this;
        
    };
    
    jQuery.fn.tipsy.defaults = {
        delayIn: 0,
        delayOut: 0,
        fade: false,
        fallback: '',
        gravity: 'n',
        html: false,
        live: false,
        offset: 0,
        opacity: 0.8,
        title: 'title',
        trigger: 'hover'
    };
    
    // Overwrite this method to provide options on a per-element basis.
    // For example, you could store the gravity in a 'tipsy-gravity' attribute:
    // return jQuery.extend({}, options, {gravity: jQuery(ele).attr('tipsy-gravity') || 'n' });
    // (remember - do not modify 'options' in place!)
    jQuery.fn.tipsy.elementOptions = function(ele, options) {
        return jQuery.metadata ? jQuery.extend({}, options, jQuery(ele).metadata()) : options;
    };
    
    jQuery.fn.tipsy.autoNS = function() {
        return jQuery(this).offset().top > (jQuery(document).scrollTop() + jQuery(window).height() / 2) ? 's' : 'n';
    };
    
    jQuery.fn.tipsy.autoWE = function() {
        return jQuery(this).offset().left > (jQuery(document).scrollLeft() + jQuery(window).width() / 2) ? 'e' : 'w';
    };
    
})(jQuery);
