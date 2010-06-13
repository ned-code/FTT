/**
 * @author julien / stephen
 */

WebDoc.PropertiesInspectorController = $.klass({
  initialize: function( selector ) {
    var domNode = $(selector);
    this.domNode = domNode;
    domNode.show();
    jQuery(selector)
    .delegate("input", 'change', jQuery.proxy( this, 'changeProperty' ))
    .delegate("#property-fit-to-screen", 'click', jQuery.proxy( this, 'updatePropertiesWithFitToScreen' ))
    .delegate("a[href=#theme_class]", 'click', jQuery.proxy( this, 'changeClass' ));
    
    WebDoc.application.boardController.themeNode
    .bind( 'load', jQuery.proxy( this, '_makeThemeBackgrounds' ) );
    
    this.fields = {
      top:              jQuery(selector + " #property_top"),
      //right:            jQuery("#property_right"),
      //bottom:           jQuery("#property_bottom"),
      left:             jQuery(selector + " #property_left"),
      width:            jQuery(selector + " #property_width"),
      height:           jQuery(selector + " #property_height"),
      rotation:         jQuery(selector + " #property_rotation"),
      
      color:            jQuery(selector + " #property_color"),
      backgroundColor:  jQuery(selector + " #property_background_color"),
      padding:          jQuery(selector + " #property_padding"),
      borderRadius:     jQuery(selector + " #property_border_radius"),
      scroll:           jQuery(selector + " #property_scroll"),
      overflow:         jQuery(selector + " #property_overflow_hidden, " + selector +" #property_overflow_auto, " + selector +" #property_overflow_visible"),
      opacity:          jQuery(selector + " #property_opacity, " + selector +" #property_opacity_readout")
    };
    
    this._themeBgColorsNode = jQuery('<ul/>', {'class': "ui-block spaceless icons-only thumbs backgrounds_index index"}).css('clear', 'both');
    this._themeBgState = false;
  },
  
  inspectorTitle: function() {
    return "properties";  
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
        // when the css value is inherited, clear the field
        // and set its placeholder
        else {
          field.val('');
          value = selectedItem.itemDomNode.css( key );
          field.attr( "placeholder", value );
        }
      }
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
        var value = (css.opacity) ? parseFloat(css.opacity).toFixed(2) : '1.00' ;
        
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
          field.val('');
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

  updatePropertiesWithFitToScreen: function(e) {
    var item = WebDoc.application.boardController.selection()[0].item;
    var size = null;
    var position = null;
    if(item.data.media_type == WebDoc.ITEM_TYPE_IMAGE && item.data.data.preserve_aspect_ratio === "true") {
      var aspectRatio = item.width("px") / item.height("px");
      var currentPageHeight = WebDoc.application.pageEditor.currentPage.height("px");
      var currentPageWidth = WebDoc.application.pageEditor.currentPage.width("px");
      if(currentPageHeight*aspectRatio < currentPageWidth) {
        size = { width: Math.round(currentPageHeight*aspectRatio), height: currentPageHeight};
      }
      else {
        size = { width: currentPageWidth, height: Math.round(currentPageWidth/aspectRatio) };
      }
      var boardCenterPoint = WebDoc.application.boardController.getBoardCenterPoint();
      position = { left: (boardCenterPoint.x-Math.round(size.width/2))+"px", top: (boardCenterPoint.y-Math.round(size.height/2))+"px" };
      size['width'] += "px";
      size['height'] += "px";
    }
    else {
      size = { width: '100%', height: '100%' };
      position = { left: '0px', top: '0px' };
    }
    item.changeCss(jQuery.extend({ transform: '' }, size, position));
    e.preventDefault();
  }
});

WebDoc.ImagePropertiesInspectorController = $.klass(WebDoc.PropertiesInspectorController, {
  initialize: function($super, selector) {
    $super("#image-property-inspector");
  }
});

WebDoc.TextPropertiesInspectorController = $.klass(WebDoc.PropertiesInspectorController, {
  initialize: function($super, selector) {
    $super("#text-property-inspector");
  }
});

WebDoc.WidgetPropertiesInspectorController = $.klass(WebDoc.PropertiesInspectorController, {
  initialize: function($super, selector) {
    $super("#widget-property-inspector");
  }
});

WebDoc.IFramePropertiesInspectorController = $.klass(WebDoc.PropertiesInspectorController, {
  initialize: function($super, selector) {
    $super("#iframe-property-inspector");
  }
});

WebDoc.HtmlPropertiesInspectorController = $.klass(WebDoc.PropertiesInspectorController, {
  initialize: function($super, selector) {
    $super("#html-property-inspector");
  }
});

