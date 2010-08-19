/**
 * @author julien / stephen
 */

WebDoc.PropertiesInspectorController = $.klass({
  initialize: function( selector, showBgColors ) {
    ddd('[Properties Inspector Controller] initialize on', selector);
    var domNode = jQuery(selector);
    this.domNode = domNode;
    
    domNode
    .delegate("input", 'change', jQuery.proxy( this, 'changeProperty' ))
    .delegate("a[href=#property]", 'click', jQuery.proxy( this, 'clickProperty' ))
    .delegate("#property-fit-to-screen", 'click', jQuery.proxy( this, 'updatePropertiesWithFitToScreen' ))
    .delegate("a[href=#theme_class]", 'click', jQuery.proxy( this, 'changeClass' ))
    .delegate("a[href=#remove_background]", 'click', jQuery.proxy( this, 'removeBackground' ))
    .delegate("a[href=#remove_font]", 'click', jQuery.proxy( this, 'removeFont' ))
    .delegate("a[href=#remove_border]", 'click', jQuery.proxy( this, 'removeBorder' ));
    
    this.fieldSelectors = {
      top:              "#property_top",
      left:             "#property_left",
      width:            "#property_width",
      height:           "#property_height",
      rotation:         "#property_rotation",
      
      color:            "#property_color",
      backgroundColor:  "#property_background_color",
      padding:          "#property_padding",
      borderRadius:     "#property_border_radius",
      overflow:         "#property_overflow_hidden, #property_overflow_auto, #property_overflow_visible",
      opacity:          "#property_opacity, #property_opacity_readout",
    
    	fontSize:					"#property_font_size",
    	fontWeight:				"#property_font_weight",
    	fontStyle:				"#property_font_style",
    	fontFamily:				"#property_font_family",
    	textAlign:				"#property_text_align_left, #property_text_align_center, #property_text_align_right",
    	textDecoration:		"#property_text_decoration",
    	textShadow:				"#property_text_shadow",
    	letterSpacing:		"#property_letter_spacing",
    	wordSpacing:			"#property_word_spacing"
    };
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
    
    item.setClass( className, 'background', true );
  },
  
  removeBackground: function(e){
    e.preventDefault();
    var selectionLength = WebDoc.application.boardController.selection().length;
    for( var i = 0; i < selectionLength; i++){
      WebDoc.application.boardController.selection()[i].item.removeBackground();
    }
    $("a[href=#remove_background]").hide();
  },
  
  removeBorder: function(e){
    e.preventDefault();
    var selectionLength = WebDoc.application.boardController.selection().length;
    for( var i = 0; i < selectionLength; i++){
      WebDoc.application.boardController.selection()[i].item.removeBorder();
    }
    $(this.domNode).find('#property_border_radius').val('');
    $("a[href=#remove_border]").hide();
  },
  
  removeFont: function(e){
    e.preventDefault();
    var selectionLength = WebDoc.application.boardController.selection().length;
    for( var i = 0; i < selectionLength; i++){
      WebDoc.application.boardController.selection()[i].item.removeFont();
    }
    $("a[href=#remove_font]").hide();
  },
  
  refresh: function() {
    var selectedItem = WebDoc.application.boardController.selection()[0],
    		css, key, field, value;
    
    if ( selectedItem ) {
      if(selectedItem.item.hasBorder()){
        $("a[href=#remove_border]").show();
      }else{
        $("a[href=#remove_border]").hide();
      }
      
      if(selectedItem.item.hasBackground()){
        $("a[href=#remove_background]").show();
      }
      else
      {
        $("a[href=#remove_background]").hide();
      }
      
      if(selectedItem.item.hasFontFace()){
        $("a[href=#remove_font]").show();
      }
      else
      {
        $("a[href=#remove_font]").hide();
      }
      
      css = selectedItem.css();
      
      for ( key in this.fieldSelectors ) {
        field = jQuery( this.fieldSelectors[key] );
        
        // If this field has a property translator then it
        // processes the CSS and is responsible for updating the field...
        if ( this.properties[key] && this.properties[key].output ) {
          this.properties[key].output( field, css );
        }
        // Otherwise we display the css value directly...
        else if ( css[key] ) {
          field.val( css[key] );
        }
        // Don't know what this is for?
        else if(key === 'backgroundColor'){
           field.val( selectedItem.item.getStylePropertyByScopeAndPropertyName('background', 'background-color'));
        }
        else if(key === 'borderRadius'){
          field.val( selectedItem.item.getStylePropertyByScopeAndPropertyName('border', 'border-radius'));
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
  
  clickProperty: function(e){
    var link = jQuery( e.currentTarget ),
    		property = link.attr('data-property'),
    		item, cssObj, l;
    
    ddd('[clickProperty] property:', property, 'link:', e.currentTarget);
    
    if ( typeof property === 'undefined' ) { return; }
    
    e.preventDefault();
    
    item = WebDoc.application.boardController.selection()[0].item;
    cssObj = {};
    property = property.split(' ');
    l = property.length;
    
    // Loop over properties listed in data-property, getting
    // their css values from the style of this link
    while(l--){
    	cssObj[ property[l] ] = link.css( property[l] );
    }
    
    item.changeCss( cssObj );
    this.refresh();
  },
  
  changeProperty: function(e){
    var self = this,
        field = jQuery(e.target),
        property = field.attr('data-property');
    
    if ( typeof property === 'undefined' ) { return; }
    // TODO: convert property to camelCase if it isn't already
    
    ddd('[propertiesInspector] changeProperty property:', property);
    
    field.validate({
      pass: function( value ){ 
        var item = WebDoc.application.boardController.selection()[0].item,
            cssObj;
        
        // If this field has a property translator then it
        // processes the value and gives us some CSS...
        if ( self.properties[property] && self.properties[property].input ) {
          cssObj = self.properties[property].input( field, value );
          item.changeCss( cssObj );
        }
        // Otherwise we use the value directly
        else {
          if(property === 'backgroundColor'){
            property = 'background-color:' + value +';';
            item.setStyle(property, 'background');
          }
          else if(property == 'borderRadius'){
            item.setStyleBorderRadius(value);
          }
          // This method of keeping aspect ratio can lead to rounding errors...
          // needs to be improved - don't we keep the aspect ratio on the item's
          // controller? It should be calculated and stored at the time when
          // the aspect ratio checkbox is clicked.
          else if(property == 'height' && item.data.data.preserve_aspect_ratio === "true") {
            var aspectRatio = item.width("px") / item.height("px");
            cssObj = {};
            cssObj['height'] = Math.round(parseFloat(value))+'px';
            cssObj['width']  = Math.round(parseFloat(value)*aspectRatio)+'px';
            item.changeCss( cssObj );
          }
          else if(property == 'width' && item.data.data.preserve_aspect_ratio === "true") {
            var aspectRatio = item.height("px") / item.width("px");
            cssObj = {};
            cssObj['height'] = Math.round(parseFloat(value)*aspectRatio)+'px';
            cssObj['width']  = Math.round(parseFloat(value))+'px';
            item.changeCss( cssObj );
          }
          else{
            cssObj = {};
            cssObj[property] = value;
            item.changeCss( cssObj );
          }
        }
        self.refresh();
      },
      fail: function( value, message ){
      	ddd('[propertiesInspector] changeProperty failed validation:', message );
      }
    });
  },
  
  // Property translators convert field input strings to
  // css (the 'input' methods) and css to field displays
  // (the 'output' methods)
  properties: {
    fontSize: {
    	input: function( field, value ){
    		ddd('[properties] fontSize value:', value);
    		return { fontSize: value+'em' };
    	},
    	output: function( field, css ){
    		field.val( parseFloat( css.fontSize ) );
    	}
    },
    fontWeight: {
    	input: function( field, value ){
    		return { fontWeight: field.attr('checked') ? value : '' };
    	},
    	output: function( field, css ){
    		field.attr( 'checked', !!css.fontWeight );
    	}
    },
    fontStyle: {
    	input: function( field, value ){
    		return { fontStyle: field.attr('checked') ? value : '' };
    	},
    	output: function( field, css ){
    		field.attr( 'checked', !!css.fontStyle );
    	}
    },
    textDecoration: {
    	input: function( field, value ){
    		return { textDecoration: field.attr('checked') ? value : '' };
    	},
    	output: function( field, css ){
    		field.attr( 'checked', !!css.textDecoration );
    	}
    },
    textAlign: {
      output: function( field, css ){
        field
        .filter( "[value="+ css.textAlign +"]" )
        .attr('checked', 'checked');
      }
    },
    letterSpacing: {
    	input: function( field, value ){
    		return { letterSpacing: value+'em' };
    	},
    	output: function( field, css ){
    		field.val( parseFloat( css.letterSpacing ) );
    	}
    },
    wordSpacing: {
    	input: function( field, value ){
    		return { wordSpacing: value+'em' };
    	},
    	output: function( field, css ){
    		field.val( parseFloat( css.wordSpacing ) );
    	}
    },
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
      input: function( field, value ){
        return { transform: (value === '') ? value : 'rotate('+value+')' };
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
      input: function( field, value ){
        return { backgroundImage: (value === '') ? value : 'url('+value+')' };
      },
      output: function( field, css ){
        field.val( /^url\((.+)\)/.exec( css.backgroundImage )[1] );
      }
    }
  },

  updatePropertiesWithFitToScreen: function(e) {
    var item = WebDoc.application.boardController.selection()[0].item,
        size = null,
        position = null,
        currentPageWidth = WebDoc.application.pageEditor.currentPage.width("px"),
        currentPageHeight = WebDoc.application.pageEditor.currentPage.height("px");

    if(item.data.media_type == WebDoc.ITEM_TYPE_IMAGE && item.data.data.preserve_aspect_ratio === "true") {
      var aspectRatio = item.width("px") / item.height("px");
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
      size = { width: currentPageWidth+"px", height: currentPageHeight+"px" };
      position = { left: '0px', top: '0px' };
    }
    item.changeCss(jQuery.extend({ transform: '' }, size, position));
    e.preventDefault();
  }
});

WebDoc.ImagePropertiesInspectorController = $.klass(WebDoc.PropertiesInspectorController, {
  initialize: function($super, selector) {
    $super("#image-property-inspector");
  },
  _makeThemeBackgrounds: function() {
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
  },
  _makeThemeBackgrounds: function() {
  }  
});

WebDoc.IFramePropertiesInspectorController = $.klass(WebDoc.PropertiesInspectorController, {
  initialize: function($super, selector) {
    $super("#iframe-property-inspector");
  },
  _makeThemeBackgrounds: function() {
  } 
});

WebDoc.HtmlPropertiesInspectorController = $.klass(WebDoc.PropertiesInspectorController, {
  initialize: function($super, selector) {
    $super("#html-property-inspector");
  }
});

