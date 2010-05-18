/**
 * @author julien
 */

(function(jQuery, undefined){
  
  WebDoc.PageInspectorController = jQuery.klass(WebDoc.RightBarInspectorController, {
    PAGE_INSPECTOR_BUTTON_SELECTOR: "a[href='#page-inspector']",
    SUPPORTED_IMAGE_EXTENSIONS: ["jpg","jpeg","png","gif"],
    
    themeColorsNode: jQuery('<ul/>', {'class': "ui-block spaceless icons-only thumbs backgrounds_index index"}),
    
    initialize: function() { 
      var form;
      
      this.domNode = jQuery('#page-inspector');    
      this._layoutDropDownNode = jQuery('#layout-dropdown');
      this._page = null;
      this._backgroundProperties = jQuery("#background_properties");
      this._externalPageControls = jQuery('.externalPage-related');
      this._backgroundControls = jQuery('.background-related');
      this._backgroundImageControls = jQuery("input[name='page_background_image_tileX'], .page_background_image_align, input[name='page_background_image_tileY']");
      this._bgRepeatState = { x: true, y: true };
      form = this.domNode.find('.content>form');
      
      form
      .bind('submit', function(e){
        e.preventDefault();
      })
      .delegate('.backgrounds_index a', 'click', function(e){
        var link = jQuery( e.target ),
            themeClass = link.attr('data-theme-class');
        
        e.preventDefault();
        
        this._page.setClass( themeClass );
      }.pBind(this));
      
      WebDoc.application.boardController.themeNode.bind( 'load', this.makeThemeBackgrounds.pBind(this) );
      
      jQuery("#external_page_url").bind("blur", this._updateExternalPageUrl.pBind(this));
      
      var handler = {
        page_title:                   this._changePageTitle.pBind(this),
        page_height:                  this._changePageHeight.pBind(this),
        page_width:                   this._changePageWidth.pBind(this),
        page_background_color:        this._changePageBackgroundColor.pBind(this),
        page_background_image:        this._checkValidBackgroundImage.pBind(this),
        page_background_repeat:       this._setBgRepeat.pBind(this),
        page_background_image_align:  this._changePageBackgroundPosition.pBind(this)
      };
      
      this.domNode
      .delegate('input', 'change', function(e){
        var field = jQuery(this),
            property = field.attr('data-property');
        
        e.preventDefault();
        
        field.validate({
          pass: handler[property],
          fail: function(error) {}
        });
      });
      
      jQuery("#page_background_image_apply_all_button").bind("click", this._applyBackgroundToAllPages.pBind(this));
      jQuery('.page-remove-background-image').click(this._removeBackgroundImage.pBind(this));
      this._layoutDropDownNode.change(this._changeLayout.pBind(this));
      WebDoc.application.boardController.addCurrentPageListener(this);
      
      this.currentPageChanged();    
      
      var footHeight = this.domNode.find('.foot>div').height();
      this.domNode
      .css({bottom: footHeight})
      .hide();
    },
  
    // used by inspector controller
    buttonSelector: function() {
      return this.PAGE_INSPECTOR_BUTTON_SELECTOR;  
    },
    
    currentPageChanged: function() {
      ddd('currentPageChanged');
      if (this._page) {
        this._page.removeListener(this);
      }   
      else {
        WebDoc.application.pageEditor.currentPage.document.addListener(this);
      }
      this._page = WebDoc.application.pageEditor.currentPage;
      this._page.addListener(this);
      this._updatePageRelatedFields();
      this._checkEnableBackgroundControls();
     },
    
    
    
    
    
    
    _themeBgState: false, // true when in the DOM
    
    makeThemeBackgrounds: function(){
      ddd('[PageInspectorController] makeThemeBackgrounds');
      
      var themeColors = new WebDoc.ClassList( 'theme_background_', 'backgroundImage backgroundColor' ),
          previousThemeClass = WebDoc.application.boardController.previousThemeClass,
          currentThemeClass = WebDoc.application.boardController.currentThemeClass,
          html = '',
          state = this._themeBgState,
          className;
      
      for ( className in themeColors.getClasses() ) {
        html += '<li><a href="#theme-class" data-theme-class="'+className+'" class="'+className+'" title="Theme background"></a></li>';
      }
      
      if (previousThemeClass) {
        this.themeColorsNode.removeClass( previousThemeClass );
      }
      
      this.themeColorsNode.addClass( currentThemeClass );
      
      if ( html === '' ) {
        if (state) {
          this.themeColorsNode.remove();
          this._themeBgState = false;
        }
      }
      else {
        this.themeColorsNode.html( html );
        if (!state) {
          this.themeColorsNode.insertAfter( this._backgroundProperties.find('legend') );
          this._themeBgState = true;
        }
      }
    },
    
    
    
    
    
    
    _updatePageRelatedFields: function() {
      this._initializingGui = true; 
      jQuery("#page_title").val( this._page.data.title == "undefined" ? "enter a title" : this._page.data.title );
      jQuery("#page_height")[0].value = this._page.data.data.css.height; 
      jQuery("#page_width")[0].value = this._page.data.data.css.width; 
      if(this._page.data.data.externalPageUrl) {
        this._externalPageControls.show();
        this._backgroundControls.hide();
        jQuery("#external_page_url")[0].value = this._page.data.data.externalPageUrl; 
      }
      else { 
        this._externalPageControls.hide();
        this._backgroundControls.show();
        jQuery("#page_background_color")[0].value = this._page.data.data.css.backgroundColor;
        jQuery("#page_background_image")[0].value = this._page.data.data.css.backgroundImage;
        this._setBgRepeatFromValue( this._page.data.data.css.backgroundRepeat ); 
        this._setBackroundPosition(this._page.data.data.css.backgroundPosition);
        if(this._page.hasBackgroundImage()) {
          jQuery('#background_image').attr('src', this._page.getBackgroundImagePath());
          jQuery('#background_image_preview').show();
        }
        else {
           jQuery('#background_image_preview').hide();
        }
        this._updateThemeDropDown();
      }
      this._initializingGui = false;
    },
  
    _updateThemeDropDown: function() {
      this._page.document.getTheme(function(theme) {
        var pageTheme = null;
        if (theme && theme.length) {
          pageTheme = theme[0];
        }
        if (this._currentDropDownTheme !== pageTheme) {
          this._currentDropDownTheme = pageTheme;
          this._layoutDropDownNode.empty();
          for (var i = 0; pageTheme && i < pageTheme.layouts.length; i++) {
            var aLayout = pageTheme.layouts[i];
            this._layoutDropDownNode.append(jQuery('<option/>').id("layout-dd-"+ aLayout.getKind()).val(aLayout.getKind()).text(aLayout.getTitle()).data("layout", aLayout));            
          }
        }
        this._layoutDropDownNode.find('#layout-dd-' + this._page.getLayoutkind()).attr("selected", "true");
      }.pBind(this));               
    },
    
    _checkEnableBackgroundControls: function() {
      try {
  //      WebDoc.InspectorFieldsValidator.validateBackgroundUrl(jQuery("#page_background_image")[0].value);
        this._setBackgroundControlsMode(true);
      }
      catch(exc) {
        this._setBackgroundControlsMode(false);
      }
    },
  
    _setBackgroundControlsMode: function(enabled) {
      if(!enabled) {
        this._backgroundImageControls
        .attr('disabled', 'disabled')
        .siblings('label')
        .addClass('disabled');
        jQuery('#background_image').hide();
      }
      else {
        this._backgroundImageControls
        .removeAttr('disabled')
        .siblings('label')
        .removeClass('disabled');
        jQuery('#background_image').show();
      }
    },
    
    _changePageTitle: function( value ) { this._page.setTitle( value ); },
    _changePageHeight: function( value ) { this._page.setHeight( value ); },
    _changePageWidth: function( value ) { this._page.setWidth( value ); },
    _changePageBackgroundColor: function( value ) { this._page.setBackgroundColor( value ); },
  
    _changePageBackgroundImage: function(url) {
      ddd('[pageInspectorController] _changePageBackgroundImage');
      this._page.setBackgroundImage( url === "" ? url : "url('"+url+"')" ) ;
    },
  
    _changePageBackgroundImageFromThumb: function() {
      var backGroundImageSrc = jQuery('#background_image').data('url');
      this._page.setBackgroundImage('url(' + backGroundImageSrc + ')'); 
    },
  
    _changePageBackgroundRepeatMode: function(e) {
      ddd('[Page Inspector Controller] _changePageBackgroundRepeatMode');
      this._page.setBackgroundRepeatMode(this._getBgRepeatValue());
    },
  
    _changePageBackgroundPosition: function(e) {
      this._page.setBackgroundPosition(this._getBackgroundPosition());
    },
    
    _removeBackgroundImage: function(e) {
      e.preventDefault();
      this._page.removeBackgroundImage();
    },
  
    _checkValidBackgroundImage: function(value) {
      if (value === "") {
        this._page.removeBackgroundImage();
        this._setBackgroundControlsMode(false);
      }
      else {
        this._changePageBackgroundImage(value);
        this._changePageBackgroundRepeatMode(e);
        this._changePageBackgroundPosition(e);
        this._setBackgroundControlsMode(true);
      }
    },
  
    _chooseBackgroundImage: function(e) {
      e.preventDefault();
      ddd("choose b");
      return false;
    },
  
    _applyBackgroundToAllPages: function(e) {
      var valid = true,
          backgroundColor, backgroundImage, page;
      
      e.preventDefault();
      
      jQuery("#page_background_color").validate({
        pass: function(value){ backgroundColor = value; },
        fail: function(error){ valid = false; }
      });
      
      jQuery("#page_background_image").validate({
        pass: function(value){ backgroundImage = value; },
        fail: function(error){ valid = false; }
      });
      
      if (valid) {
        for(var i = 0; i < WebDoc.application.pageEditor.currentDocument.pages.length; i++) {
          page = WebDoc.application.pageEditor.currentDocument.pages[i];
          this._applyBackgroundToPage( this._page, backgroundColor, backgroundImage );
        }
        var inspectorBeforeReload = WebDoc.application.rightBarController.getSelectedInspector();
        WebDoc.application.rightBarController.selectInspector(inspectorBeforeReload);
      }
    },
  
    _applyBackgroundToPage: function(targetPage, backgroundColor, backgroundImage) {
      targetPage.setBackgroundColor( backgroundColor );
      
      if( backgroundImage === "" ) {
        targetPage.removeBackgroundImage();
      }
      else {
        targetPage.setBackgroundImage( backgroundImage );
        targetPage.setBackgroundRepeatMode(this._getBgRepeatValue());
        targetPage.setBackgroundPosition(this._getBackgroundPosition());
      }
    },
    
    _updateExternalPageUrl: function() {  
      try {
        this._page.setExternalPageUrl(jQuery("#external_page_url").val());
      }
      catch(exc) {
        jQuery("#external_page_url")[0].value = this._page.data.data.externalPageUrl;
      }
    },
  
    objectChanged: function(record, options) {
      ddd('page-inspector_controller: objectChanged: must update fields');
      if (record.className() == "page") {
        this._updatePageRelatedFields();
      }
      else if (record._isAttributeModified(options, 'theme')) {
        this._updateThemeDropDown();
      }
    },
    
    // Background repeat ------------------------------------------------  
    
    _setBgRepeat: function( value, bool ){
      this._bgRepeatState[value] = !!bool;
      this._page.setBackgroundRepeatMode( this._getBgRepeatValue() );
    },
    
    _getBgRepeatValue: function() {
      var state = this._bgRepeatState;
      
      return ( state.x && state.y ) ? 'repeat' :
             ( state.x ) ? 'repeat-x' :
             ( state.y ) ? 'repeat-y' : 
             'no-repeat';
    },
    
    _setBgRepeatFromValue: function( cssValue ){
      var x = ( cssValue === "repeat" || cssValue === "none" || cssValue === "repeat-x" ),
          y = ( cssValue === "repeat" || cssValue === "none" || cssValue === "repeat-y" );
      
      this._bgRepeatState.x = x;
      this._bgRepeatState.y = y;
      
      this._setBgRepeatUI();
    },
    
    _setBgRepeatUI: function(){
      var state = this._bgRepeatState;
      
      jQuery("input[name='page-bg-repeat-x']").attr('checked', state.x);
      jQuery("input[name='page-bg-repeat-y']").attr('checked', state.y);
    },
    
    // Background position ----------------------------------------------
    
    // Refactor this lot so that it doesn't rely on the DOM for its state,
    // but instead uses the above object.
    
    _getBackgroundPosition: function() {
      return this._getBackgroundHorizontalPosition() + " " + this._getBackgroundVerticalPosition();
    },
  
    _getBackgroundHorizontalPosition: function() {
      return jQuery('input[name=xPos]:checked').val();
    },
  
    _getBackgroundVerticalPosition: function() {
      return jQuery('input[name=yPos]:checked').val();
    },
  
    _setBackroundPosition: function(position) {
      // Default, everything centered
      jQuery('#page_background_image_align_hor_center').attr('checked', true);
      jQuery('#page_background_image_align_vert_middle').attr('checked', true);
      if(position !== undefined) {
        // Horizontal align
        if(position.indexOf('left') >= 0) {
          jQuery('#page_background_image_align_hor_left').attr('checked', true);
        }
        else if(position.indexOf('center') >= 0) {
          jQuery('#page_background_image_align_hor_center').attr('checked', true);
        }
        else if(position.indexOf('right') >= 0) {
          jQuery('#page_background_image_align_hor_right').attr('checked', true);
        }
        else {
          jQuery('#page_background_image_align_hor_center').attr('checked', true);
        }
        // Vertical align
        if(position.indexOf('top') >= 0) {
          jQuery('#page_background_image_align_vert_top').attr('checked', true);
        }
        else if(position.indexOf('bottom') >= 0) {
          jQuery('#page_background_image_align_vert_bottom').attr('checked', true);
        }
        else if(position.indexOf('middle') >= 0) {
          jQuery('#page_background_image_align_vert_middle').attr('checked', true);
        }
        else {
          jQuery('#page_background_image_align_vert_middle').attr('checked', true);
        }
      }
    },
    
    _changeLayout: function(event) {
      if (!this._initializingGui) {
        ddd("change layout", event);
        WebDoc.application.boardController.currentPageView().setLoading(true);
        try {
          this._page.assignLayout(this._layoutDropDownNode.find('#layout-dd-' + this._layoutDropDownNode.val()).data("layout"), function(pag, status){
            WebDoc.application.boardController.currentPageView().setLoading(false);
          });
        }
        catch(e) {
          WebDoc.application.boardController.currentPageView().setLoading(false);
        }
      }
    }
  });

})(jQuery);