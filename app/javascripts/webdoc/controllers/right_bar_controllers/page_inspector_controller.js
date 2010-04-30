/**
 * @author julien
 */

(function(jQuery, undefined){

var inspector,
    cssEditor,
    cssEditorFieldset,
    externalPageControls,
    backgroundControls,
    backgroundImageControls,
    backgroundImageControlsEnabled,
    supportedImageExtensions = ["jpg","jpeg","png","gif"],
    page;

WebDoc.PageInspectorController = jQuery.klass(WebDoc.RightBarInspectorController, {
  PAGE_INSPECTOR_BUTTON_SELECTOR: "a[href='#page-inspector']",

  initialize: function() { 
    inspector = jQuery('#page-inspector');
    form = inspector.find('.content>form');
    
    cssEditorFieldset = jQuery("#page_css_editor");
    cssEditor = cssEditorFieldset.find('textarea.code');
    externalPageControls = jQuery('.externalPage-related');
    backgroundControls = jQuery('.background-related');
    backgroundImageControls = jQuery("input[name='page_background_image_tileX'], .page_background_image_align, input[name='page_background_image_tileY']");
    
    form
    .bind('submit', function(e){
      e.preventDefault();
    });
    
    cssEditor.bind("blur", this._applyPageCss);
    jQuery("#external_page_url").bind("blur", this._updateExternalPageUrl.pBind(this));
    
    var handler = {
      page_title:                   this._changePageTitle,
      page_height:                  this._changePageHeight,
      page_width:                   this._changePageWidth,
      page_background_color:        this._changePageBackgroundColor,
      page_background_image:        this._checkValidBackgroundImage.pBind(this),
      page_background_repeat:       this._setBgRepeat.pBind(this),
      page_background_image_align:  this._changePageBackgroundPosition.pBind(this)
    };
    
    inspector
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
    //jQuery('#image_send_form').submit(this._uploadBackgroundImage.pBind(this));
    jQuery('.page-navigation-link').click(this.performAction.pBind(this));
    jQuery('.page-remove-background-image').click(this._removeBackgroundImage.pBind(this));
    WebDoc.application.boardController.addCurrentPageListener(this);
    WebDoc.application.pageEditor.currentPage.addListener(this); 
    
    this._uploadControl = jQuery("#upload-container");
    this._setupFlashUpload();
    this.currentPageChanged();
    this.domNode = inspector;
    
    var footHeight = this.domNode.find('.foot>div').height();
    this.domNode
    .css({bottom: footHeight})
    .hide();
  },

  _setupFlashUpload: function() {
    // Setting up SWFUpload (but at this point it'll be still "hidden", and it'll get loaded once I'll make it visible)
    this._uploadControl.swfupload({
      upload_url: "/images",
      file_post_name: "image[file]",
      file_size_limit: "2048",
      file_types: "*."+supportedImageExtensions.join(";*."), // "*.jpg;*.jpeg;*.png;*.gif"
      file_types_description: "Web Image Files",
      //file_upload_limit: "1",
      flash_url: "/swfupload/swfupload.swf",
      //button_image_url: '/images/libraries/upload_button.png',
      button_text : '<span class="blueText">Choose image</span>', 
      button_text_style : ".blueText { font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; font-size:14pt; color: #0000FF; text-decoration: underline; }", 
      button_action : SWFUpload.BUTTON_ACTION.SELECT_FILE,
      button_cursor : SWFUpload.CURSOR.HAND, 
      button_width: 200,
      button_height: 21,
      button_placeholder: $('#upload_images_button')[0],
      button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
      debug: false
    })
    
    .bind('swfuploadLoaded', function(event){
      ddd("swfupload loaded");
      this.uploadButtonFlash = this._uploadControl.find('object');
    }.pBind(this))
    
    .bind('fileQueued', function(event, file){
      ddd("file queued: "+file.name);
      
      this._uploadControl.swfupload('startUpload');
    }.pBind(this))
    
    .bind('fileQueueError', function(event, file, errorCode, message){
      ddd("file queued error: "+message);
    }.pBind(this))
    
    .bind('fileDialogStart', function(event){
      ddd("File dialog start");
    }.pBind(this))
    
    .bind('fileDialogComplete', function(event, numFilesSelected, numFilesQueued){
      ddd("File dialog complete. Files selected: "+numFilesSelected);
    }.pBind(this))
    
    .bind('uploadStart', function(event, file){
      ddd("Upload start: "+file.name);
      // adding post params
      var sessionKeyName = WebDoc.authData.sessionKeyName;
      var postParams = {
        "authenticity_token": WebDoc.authData.authToken
      };
      postParams[sessionKeyName] = WebDoc.authData.cookiesSessionKeyName;
      postParams["image[uuid]"] = new MTools.UUID().id;
      $.swfupload.getInstance(this._uploadControl).setPostParams(postParams);
    }.pBind(this))
    
    .bind('uploadSuccess', function(event, file, serverData){
      ddd("Upload success: "+file.name);
      ddd("server data", serverData);
      this._displayBackgroundImage(serverData);
    }.pBind(this))
    
    .bind('uploadComplete', function(event, file){
      // pay attention: this is always fired (after uploadError or uploadSuccess)
      ddd("Upload complete: "+file.name);
    
    }.pBind(this))
    
    .bind('uploadError', function(event, file, errorCode, message){
      ddd("Upload error: "+message+" (err "+errorCode+")");
    }.pBind(this));
  },
  
  
  buttonSelector: function() {
    return this.PAGE_INSPECTOR_BUTTON_SELECTOR;  
  },
  
  performAction: function(e) {
    e.preventDefault();
    clickedButton = jQuery(e.target);
    try {
      WebDoc.application.pageEditor[clickedButton.attr("href")].apply(WebDoc.application.pageEditor, [e]);
    }
    catch(ex) {
      ddd("unknown toolbar action: " + clickedButton.attr("href"));
      ddt();
    }    
  },

  currentPageChanged: function() {
    ddd('currentPageChanged');   
    page = WebDoc.application.pageEditor.currentPage;  
    jQuery("#external_page_url")[0].value = page.data.data.externalPageUrl; 
    this._updatePageRelatedFields();
    this._checkEnableBackgroundControls();
   },

  _updatePageRelatedFields: function() {
    cssEditor.val( jQuery.toJSON(page.data.data.css) ); 
    jQuery("#page_title").val( page.data.title == "undefined" ? "enter a title" : page.data.title );
    jQuery("#page_height")[0].value = page.data.data.css.height; 
    jQuery("#page_width")[0].value = page.data.data.css.width; 
    if(page.data.data.externalPageUrl) {
      cssEditorFieldset.hide();
      externalPageControls.show();
      backgroundControls.hide();
    }
    else { 
      cssEditorFieldset.show();
      externalPageControls.hide();
      backgroundControls.show();
      jQuery("#page_background_color")[0].value = page.data.data.css.backgroundColor;
      jQuery("#page_background_image")[0].value = page.data.data.css.backgroundImage;
      this._setBgRepeatFromValue( page.data.data.css.backgroundRepeat ); 
      this._setBackroundPosition(page.data.data.css.backgroundPosition);
      if(page.hasBackgroundImage()) {
        jQuery('#background_image').attr('src', page.getBackgroundImagePath());
        jQuery('#background_image_preview').show();
      }
      else {
         jQuery('#background_image_preview').hide();
      }
    }
  },

  _checkEnableBackgroundControls: function() {
    try {
      WebDoc.InspectorFieldsValidator.validateBackgroundUrl(jQuery("#page_background_image")[0].value);
      this._setBackgroundControlsMode(true);
    }
    catch(exc) {
      this._setBackgroundControlsMode(false);
    }
  },

  _setBackgroundControlsMode: function(enabled) {
    if(!enabled) {
      backgroundImageControls
      .attr('disabled', 'disabled')
      .siblings('label')
      .addClass('disabled');
      jQuery('#background_image').hide();
    }
    else {
      backgroundImageControls
      .removeAttr('disabled')
      .siblings('label')
      .removeClass('disabled');
      jQuery('#background_image').show();
    }
  },
  
  _changePageTitle: function( value ) { page.setTitle( value ); },
  _changePageHeight: function( value ) { page.setHeight( value ); },
  _changePageWidth: function( value ) { page.setWidth( value ); },
  _changePageBackgroundColor: function( value ) { page.setBackgroundColor( value ); },

  _changePageBackgroundImage: function(url) {
    ddd('[pageInspectorController] _changePageBackgroundImage');
    page.setBackgroundImage( url === "" ? url : "url('"+url+"')" ) ;
  },

  _changePageBackgroundImageFromThumb: function() {
    var backGroundImageSrc = jQuery('#background_image').data('url');
    page.setBackgroundImage('url(' + backGroundImageSrc + ')'); 
    //WebDoc.application.pageEditor.loadPage(page, true);
  },

  _changePageBackgroundRepeatMode: function(e) {
    ddd('[Page Inspector Controller] _changePageBackgroundRepeatMode');
    page.setBackgroundRepeatMode(this._getBgRepeatValue());
  },

  _changePageBackgroundPosition: function(e) {
    page.setBackgroundPosition(this._getBackgroundPosition());
  },
  
  _removeBackgroundImage: function(e) {
    e.preventDefault();
    page.removeBackgroundImage();
  },

  _checkValidBackgroundImage: function(value) {
    if (value = "") {
      page.removeBackgroundImage();
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
  
  
  _uploadBackgroundImage: function(e) {
    // return false to prevent normal browser submit and page navigation 
    e.preventDefault();
    e.stopPropagation();
    var options = {  
      success:       this._displayBackgroundImage.pBind(this), 
      type:          "POST",
      iframeSrc: "/image_upload.html",
      error: function(response, errorType, exc) { ddd("error", response,errorType, exc );}
    };
    try{
      // submit the form
      jQuery(e.target).ajaxSubmit(options);
    }
    catch(exc) {
      ddd('_uploadBackgroundImage: encountered exception: name: '+exc.name + ' , message: '+exc.message);
    } 
    return false;
  },

  _displayBackgroundImage: function(responseText, statusText) {
    // Put thumbnail url in the page data so that it can be re-used later
    responseText = $.evalJSON(responseText);
    var thumbUrl = responseText.image.properties.thumb_url;
    jQuery('#background_image').attr('src', thumbUrl).data('url', responseText.image.properties.url);
    this._changePageBackgroundImageFromThumb();
    this._changePageBackgroundRepeatMode();
    this._changePageBackgroundPosition();
    this._setBackgroundControlsMode(true);
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
        this._applyBackgroundToPage( page, backgroundColor, backgroundImage );
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
      page.setExternalPageUrl(jQuery("#external_page_url").val());
      //WebDoc.application.pageEditor.loadPage(page, true);
    }
    catch(exc) {
      jQuery("#external_page_url")[0].value = page.data.data.externalPageUrl;
    }
  },
  
  _applyPageCss: function(e) {
    e.preventDefault();
    var editor = WebDoc.application.pageEditor;
    if (jQuery.toJSON(editor.currentPage.data.data.css) != cssEditor.val() ) {
      var newCss = null;
      
      try {
        eval("newCss=" + cssEditor.val() );
      }
      catch(ex) {
        ddd("Invalid css");
        cssEditor.val( jQuery.toJSON(editor.currentPage.data.data.css) );
      }
      if (newCss) {
        WebDoc.application.pageEditor.currentPage.applyCss(newCss);
        //WebDoc.application.pageEditor.loadPage(WebDoc.application.pageEditor.currentPage, true);
      }
    }
  },

  objectChanged: function(page) {
    ddd('page-inspector_controller: objectChanged: must update fields');
    var page = WebDoc.application.pageEditor.currentPage;
    this._updatePageRelatedFields();
  },
  
  // Background repeat ------------------------------------------------
  
  _bgRepeatState: { x: true, y: true },
  
  _setBgRepeat: function( value, bool ){
    this._bgRepeatState[value] = !!bool;
    page.setBackgroundRepeatMode( this._getBgRepeatValue() );
  },
  
  _getBgRepeatValue: function() {
    var state = this._bgRepeatState;
    
    return ( state.x && state.y ) ? 'repeat' :
           ( state.x ) ? 'repeat-x' :
           ( state.y ) ? 'repeat-y' : 
           'no-repeat';
  },
  
  _setBgRepeatFromValue: function( cssValue ){
    var x = false, y = false;
    
    switch(cssValue) {
      case "repeat":
      case "none":
        x = true, y = true;
        break;
      case "repeat-x":
        x = true;
        break;
      case "repeat-y":
        y = true;
        break;
    }
    
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
  }
});


})(jQuery);