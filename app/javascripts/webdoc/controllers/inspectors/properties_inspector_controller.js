/**
 * @author julien / stephen
 */

WebDoc.PropertiesInspectorController = $.klass({
  initialize: function( selector ) {
    var domNode = this.domNode = $(selector);
    
    jQuery('#item_inspector')
    .delegate("input", 'change', jQuery.proxy( this, 'changeProperty' ))
    .delegate("#property-fit-to-screen", 'click', jQuery.proxy( this, 'updatePropertiesWithFitToScreen' ))
    .delegate("a[href=#theme_class]", 'click', jQuery.proxy( this, 'changeClass' ));
    
    WebDoc.application.boardController.themeNode
    .bind( 'load', jQuery.proxy( this, '_makeThemeBackgrounds' ) );
    
    this.fields = {
      top:              jQuery("#property_top"),
      //right:            jQuery("#property_right"),
      //bottom:           jQuery("#property_bottom"),
      left:             jQuery("#property_left"),
      width:            jQuery("#property_width"),
      height:           jQuery("#property_height"),
      rotation:         jQuery("#property_rotation"),
      
      color:            jQuery("#property_color"),
      backgroundColor:  jQuery("#property_background_color"),
      padding:          jQuery("#property_padding"),
      borderRadius:     jQuery("#property_border_radius"),
      scroll:           jQuery("#property_scroll"),
      overflow:         jQuery("#property_overflow_hidden, #property_overflow_auto, #property_overflow_visible"),
      opacity:          jQuery("#property_opacity, #property_opacity_readout")
    };
    
    this._themeBgColorsNode = jQuery('<ul/>', {'class': "ui-block spaceless icons-only thumbs backgrounds_index index"}).css('clear', 'both');
    this._themeBgState = false;
  },
  
  _makeThemeBackgrounds: function() {
    ddd('[PageInspectorController] _makeThemeBackgrounds');
    
    var themeColors = new WebDoc.ClassList( 'theme_background_', 'backgroundImage backgroundColor' ),
        previousThemeClass = WebDoc.application.boardController.previousThemeClass,
        currentThemeClass = WebDoc.application.boardController.currentThemeClass,
        html = '',
        state = this._themeBgState,
        className;
    
    for ( className in themeColors.getClasses() ) {
      html += '<li><a href="#theme_class" data-theme-class="'+className+'" class="'+className+'" title="Theme background"></a></li>';
    }
    
    if (previousThemeClass) {
      this._themeBgColorsNode.removeClass( previousThemeClass );
    }
    
    this._themeBgColorsNode.addClass( currentThemeClass );
    
    if ( html === '' ) {
      if (state) {
        this._themeBgColorsNode.remove();
        this._themeBgState = false;
      }
    }
    else {
      this._themeBgColorsNode.html( html );
      if (!state) {
        this._themeBgColorsNode.prependTo( this.domNode );
        this._themeBgState = true;
      }
    }
  },
  
  changeClass: function(e){
    var self = this,
        link = jQuery( e.target ),
        className = link.attr('data-theme-class'),
        item = WebDoc.application.boardController.selection()[0].item;
    
    e.preventDefault();
    
    item.changeThemeBgClass( className );
  },
  
  refresh: function() {
    var selectedItem = WebDoc.application.boardController.selection()[0];
    
    if ( selectedItem ) {
      var css = selectedItem.css(),
          fields = this.fields,
          key, field, value;
      
      for ( key in fields ) {
        field = fields[key];
        
        // If this field has a property translator then it
        // processes the CSS and is responsible for updating the field...
        if ( this.properties[key] && this.properties[key].output ) {
          this.properties[key].output( field, css );
        }
        // Otherwise we display the css value directly...
        else if ( css[key] ) {
          field.val( css[key] );
        }
        // when the css value is inherited put it in the placeholder
        else {
          value = selectedItem.itemDomNode.css( key );
          field.attr( "placeholder", value );
        }
      }
    }
  },
  
  updateSroll: function(event) {
    ddd("update scroll");
     var item = WebDoc.application.boardController.selection()[0].item;
      if (item) {        
        var newOverflow = { overflow: this.scrollNode.attr("checked")?"auto":"hidden"};
        $.extend(item.data.data.css, newOverflow);
        WebDoc.application.boardController.selection()[0].itemDomNode.css("overflow", newOverflow.overflow);
        item.save();
      }
  },
  
  changeProperty: function(e){
    var self = this,
        field = jQuery(e.target);
    
    ddd('[propertiesInspector] changeProperty ', e.target);
    
    field.validate({
      pass: function( value ){ 
        var item = WebDoc.application.boardController.selection()[0].item,
            property = field.attr('data-property'),
            cssObj;
        
        if ( typeof property === 'undefined' ) { return; }
        // TODO: convert property to camelCase if it isn't already
        
        // If this field has a property translator then it
        // processes the value and gives us some CSS...
        if ( self.properties[property] && self.properties[property].input ) {
          cssObj = self.properties[property].input( value );
        }
        // Otherwise we use the value directly
        else {
          cssObj = {};
          cssObj[property] = value;
        }
        
        item.changeCss( cssObj );
      },
      fail: function( value, error ){
        var type = field.attr('data-type') || field.attr('type');
        
        // If we can autocomplete the value, override the validation failure
        if ( self.autocompleters[type] ) {
          return self.autocompleters[type]( field, value );
        }
        
        return false;
      }
    });
  },
  
  // Property translators convert field input strings to
  // css (the 'input' methods) and css to field displays
  // (the 'output' methods)
  properties: {
    overflow: {
      output: function( field, css ){
        field
        .filter( "[value="+ css.overflow +"]" )
        .attr('checked', 'checked');
      }
    },
    opacity: {
      output: function( field, css ){
        var value = parseFloat(css.opacity).toFixed(2) || 1;
        field.filter('input').val( value );
        field.filter('.readout').html( value );
      }
    },
    rotation: {
      input: function( value ){
        return {
          transform: (value === '') ? value : 'rotate('+value+')'
        };
      },
      output: function( field, css ){
        var transform = css.transform,
            value = /^rotate\((.+)\)/.exec( transform );
        
        if ( transform && value ) {
          field.val( value[1] );
        }
        else {
          field.attr( "placeholder", "none" );
        }
      }
    },
    backgroundImage: {
      input: function( value ){
        return {
          backgroundImage: (value === '') ? value : 'url('+value+')'
        };
      },
      output: function( field, css ){
        field.val( /^url\((.+)\)/.exec( css.backgroundImage )[1] );
      }
    }
  },
  
  // Autocompleters try to correct fields that have
  // failed validation, and if successful, they force
  // a validation pass
  autocompleters: {
    cssvalue: function( field, value ){
      if ( jQuery.regex.integer.test( value ) ){
        field.val( value+'px' );
        return true;
      }
    },
    cssangle: function( field, value ){
      if ( jQuery.regex.integer.test( value ) ){
        field.val( value+'deg' );
        return true;
      }
    }
  },
  
  updateItem: function(){
    var item = WebDoc.application.boardController.selection()[0].item,
        css = item.data.data.css;
    
    item.changeCssProperty(  );
  },
  
  updateProperties: function(e) {
    ddd("updateProperties", e);
    
    var that = this,
        field = jQuery(e.currentTarget),
        item = WebDoc.application.boardController.selection()[0].item,
        css = item.data.data.css;
    
    field.validate({
      pass: function(value) {
  
//        switch( this ){
//          case that.leftNode[0]:
//          case that.topNode[0]:
//            var previousPosition = {
//	            top: css.top,
//	            left: css.left
//	          };
//	          var newPosition = {
//	            top: (this === that.topNode[0])? that.topNode.val() : css.top,
//	            left: (this === that.leftNode[0])? that.leftNode.val() : css.left
//	          };
//	          if (newPosition.left != previousPosition.left || newPosition.top != previousPosition.top) {
//	            WebDoc.application.undoManager.registerUndo(function() {
//	              WebDoc.ItemView._restorePosition(item, previousPosition);
//	            }.pBind(that));
//	            item.moveTo(newPosition);
//	            item.save();
//	          }
//		    		break;
//            
//		    	case that.widthNode[0]:
//		    	case that.heightNode[0]:
//		    		var previousSize = {
//	            width: css.width,
//	            height: css.height
//	          }; 
//	          var newSize = {
//              width: (this === that.widthNode[0])? that.widthNode.val() : css.width,
//              height: (this === that.heightNode[0])? that.heightNode.val() : css.height              
//	          };
//	          if (newSize.width != previousSize.width || newSize.height != previousSize.height) {
//	            WebDoc.application.undoManager.registerUndo(function() {
//	              WebDoc.ItemView.restoreSize(item, previousSize);
//	            }.pBind(that));
//	            item.resizeTo(newSize);
//	            item.save();
//	          }
//		        break;
//		      
//		    	case that.opacityNode[0]:
//		    		var previousOpacity = item.data.data.css.opacity || 1;
//		    		var newOpacity = parseFloat( that.opacityNode.val(), 10 ).toFixed(2);
//		    		ddd('[Properties] Opacity new: '+newOpacity+' previous: '+previousOpacity);
//		    		if(newOpacity != previousOpacity){
//		    			WebDoc.application.undoManager.registerUndo(function(){
//		    				that.restoreOpacity(item, previousOpacity);
//		    			}.pBind(that));
//		    			item.setOpacity(newOpacity);
//		    			that.opacityReadoutNode.html( newOpacity );
//		    			item.save();
//		    		}
//		    		break;
//		    }
        that.refresh();
        
      },
      fail: function(error) {
        
      }
    })
  },

  restoreOpacity: function(item, opacity){
      ddd("restore opacity "+opacity);
      var previousOpacity=item.data.data.css.opacity;
      item.setOpacity(opacity);
      WebDoc.application.undoManager.registerUndo(function(){
          this.restoreOpacity(item, previousOpacity);
      }.pBind(this));
      item.save();
  },

  updatePropertiesWithFitToScreen: function(e) {
    var item = WebDoc.application.boardController.selection()[0].item;
    var size = null;
    var position = null;
    if(item.data.media_type == WebDoc.ITEM_TYPE_IMAGE && item.data.data.preserve_aspect_ratio === "true") {
      var aspectRatio = item.width("px") / item.height("px");
      var currentPageHeight = WebDoc.application.pageEditor.currentPage.height("px");
      var currentPageWidth = WebDoc.application.pageEditor.currentPage.width("px");
      if(currentPageHeight*aspectRatio < currentPageWidth) {
        size = { width: currentPageHeight*aspectRatio, height: currentPageHeight };
      }
      else {
        size = { width: currentPageWidth, height: currentPageWidth/aspectRatio };
      }
      var boardCenterPoint = WebDoc.application.boardController.getBoardCenterPoint();
      position = { left: boardCenterPoint.x-(size.width/2), top: boardCenterPoint.y-(size.height/2) };
    }
    else {
      size = { width: '100%', height: '100%' };
      position = { left: 0, top: 0 };
    }
    item.changeCss(jQuery.extend({ transform: '' }, size, position));
    e.preventDefault();
  }
});


