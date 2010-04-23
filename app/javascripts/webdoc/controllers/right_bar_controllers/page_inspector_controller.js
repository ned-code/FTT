/**
 * @author julien
 */

(function(jQuery, undefined){

var cssEditor,
    cssEditorFieldset,
    externalPageControls,
    backgroundControls,
    backgroundImageControls,
    backgroundImageControlsEnabled,
    supportedImagesExtensions = ["jpg","jpeg","png","gif"],
    page;

WebDoc.PageInspectorController = jQuery.klass(WebDoc.RightBarInspectorController, {
  PAGE_INSPECTOR_BUTTON_SELECTOR: "a[href='#page-inspector']",

  initialize: function() { 
    cssEditorFieldset = jQuery("#page_css_editor");
    cssEditor = cssEditorFieldset.find('textarea.code');
    externalPageControls = jQuery('.externalPage-related');
    backgroundControls = jQuery('.background-related');
    backgroundImageControls = jQuery('#page_background_image_tileX_checkbox, #page_background_image_align_hor_left_radio, #page_background_image_align_hor_center_radio, #page_background_image_align_hor_right_radio, #page_background_image_tileY_checkbox, #page_background_image_align_vert_top_radio, #page_background_image_align_vert_middle_radio, #page_background_image_align_vert_bottom_radio');

    cssEditor.bind("blur", this._applyPageCss);
    jQuery("#external_page_url").bind("blur", this._updateExternalPageUrl.pBind(this));
    jQuery("#page_title_textbox").bind("change", this._changePageTitle);
    jQuery("#page_height_textbox").bind("change", this._changePageHeight);
    jQuery("#page_width_textbox").bind("change", this._changePageWidth);
    jQuery("#page_background_color_textbox").bind("change", this._changePageBackgroundColor);
    jQuery("#page_background_image_textbox").bind("change", this._checkValidBackgroundImage.pBind(this));
    jQuery("#page_background_image_tileX_checkbox").bind("change", this._changePageBackgroundRepeatMode.pBind(this));
    jQuery("#page_background_image_tileY_checkbox").bind("change", this._changePageBackgroundRepeatMode.pBind(this));
    jQuery("#page_background_image_align_hor_left_radio").bind("change", this._changePageBackgroundPosition.pBind(this));
    jQuery("#page_background_image_align_hor_center_radio").bind("change", this._changePageBackgroundPosition.pBind(this));
    jQuery("#page_background_image_align_hor_right_radio").bind("change", this._changePageBackgroundPosition.pBind(this));
    jQuery("#page_background_image_align_vert_top_radio").bind("change", this._changePageBackgroundPosition.pBind(this));
    jQuery("#page_background_image_align_vert_middle_radio").bind("change", this._changePageBackgroundPosition.pBind(this));
    jQuery("#page_background_image_align_vert_bottom_radio").bind("change", this._changePageBackgroundPosition.pBind(this));
    jQuery("#page_background_image_apply_all_button").bind("click", this._applyBackgroundToAllPages.pBind(this));
    //jQuery('#image_send_form').submit(this._uploadBackgroundImage.pBind(this));
    jQuery('.page-navigation-link').click(this.performAction.pBind(this));
    jQuery('.page-remove-background-image').click(this._removeBackgroundImage.pBind(this));
    WebDoc.application.boardController.addCurrentPageListener(this);
    WebDoc.application.pageEditor.currentPage.addListener(this); 
    
    this._uploadControl = jQuery("#upload-container");
    this._setupFlashUpload();
    this.currentPageChanged();
    this.domNode = jQuery('#page-inspector');
    
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
      file_types: "*."+supportedImagesExtensions.join(";*."), // "*.jpg;*.jpeg;*.png;*.gif"
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
    jQuery("#page_title_textbox").val( page.data.title == "undefined" ? "enter a title" : page.data.title );
    jQuery("#page_height_textbox")[0].value = page.data.data.css.height; 
    jQuery("#page_width_textbox")[0].value = page.data.data.css.width; 
    if(page.data.data.externalPageUrl) {
      cssEditorFieldset.hide();
      externalPageControls.show();
      backgroundControls.hide();
    }
    else { 
      cssEditorFieldset.show();
      externalPageControls.hide();
      backgroundControls.show();
      jQuery("#page_background_color_textbox")[0].value = page.data.data.css.backgroundColor;
      jQuery("#page_background_image_textbox")[0].value = page.data.data.css.backgroundImage;
      this._setBackgroundRepeatMode(page.data.data.css.backgroundRepeat); 
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
      WebDoc.InspectorFieldsValidator.validateBackgroundUrl(jQuery("#page_background_image_textbox")[0].value);
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
  
  _changePageTitle: function(e) {
    e.preventDefault();
    page.setTitle(jQuery("#page_title_textbox").val());   
  },

  _changePageHeight: function(e) {
    e.preventDefault();
    try {
      page.setHeight(jQuery("#page_height_textbox").val());   
    }
    catch(exc) {
      jQuery("#page_height_textbox")[0].value = page.data.data.css.height;
    }   
  },

  _changePageWidth: function(e) {
    e.preventDefault();
    try {
      page.setWidth(jQuery("#page_width_textbox").val()); 
    }
    catch(exc) {
      jQuery("#page_width_textbox")[0].value = page.data.data.css.width;
    }
  },

  _changePageBackgroundColor: function(e) {
    e.preventDefault();
    try {
      page.setBackgroundColor(jQuery("#page_background_color_textbox").val()); 
    }
    catch(exc) {
      jQuery("#page_background_color_textbox")[0].value = page.data.data.css.backgroundColor;
    }
  },

  _changePageBackgroundImage: function() {
    ddd('[pageInspectorController] _changePageBackgroundImage');
    try {
      page.setBackgroundImage(jQuery("#page_background_image_textbox").val()); 
      WebDoc.application.pageEditor.loadPage(page, true);
    }
    catch(exc) {
      jQuery("#page_background_image_textbox")[0].value = page.data.data.css.backgroundImage;
    } 
  },

  _changePageBackgroundImageFromThumb: function() {
    var backGroundImageSrc = jQuery('#background_image').data('url');
    page.setBackgroundImage('url(' + backGroundImageSrc + ')'); 
    WebDoc.application.pageEditor.loadPage(page, true);
  },

  _changePageBackgroundRepeatMode: function(e) {
    if(e) { e.preventDefault(); }
    try {
      page.setBackgroundRepeatMode(this._getBackgroundRepeatMode());
      WebDoc.application.pageEditor.loadPage(page, true); 
     }
    catch(exc) {
      this._setBackgroundRepeatMode(page.data.data.css.background-repeat);
    } 
  },

  _changePageBackgroundPosition: function(e) {
    if(e) {e.preventDefault(); }
    try {
      page.setBackgroundPosition(this._getBackgroundPosition());
      WebDoc.application.pageEditor.loadPage(page, true); 
     }
    catch(exc) {
      this._setBackroundPosition(page.data.data.css.backgroundPosition);
    } 
  },
  
  _removeBackgroundImage: function(e) {
    e.preventDefault();
    this._cancelImageBackground();
  },
  
  _cancelImageBackground: function() {
    page.removeBackgroundImage();
    WebDoc.application.pageEditor.loadPage(WebDoc.application.pageEditor.currentPage, true);
  },

  _checkValidBackgroundImage: function(e) {
    if(e) { e.preventDefault(); }
    try {
      WebDoc.InspectorFieldsValidator.validateBackgroundUrl(e.target.value);
      this._changePageBackgroundImage();
      this._changePageBackgroundRepeatMode(e);
      this._changePageBackgroundPosition(e);
      this._setBackgroundControlsMode(true);
    }
    catch(exc) {
      if(e.target.value === "") {
        this._cancelImageBackground();
        this._setBackgroundControlsMode(false);
      }
      else {
        e.target.value = page.data.data.css.backgroundImage;
      }
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
    e.preventDefault();
    for(var i = 0; i < WebDoc.application.pageEditor.currentDocument.pages.length; i++) {
      this._applyBackgroundToPage(WebDoc.application.pageEditor.currentDocument.pages[i]);
    }
    var inspectorBeforeReload = WebDoc.application.rightBarController.getSelectedInspector();
    WebDoc.application.pageEditor.loadPage(WebDoc.application.pageEditor.currentPage, true);
    WebDoc.application.rightBarController.selectInspector(inspectorBeforeReload);
  },

  _applyBackgroundToPage: function(targetPage) {
    targetPage.setBackgroundColor(jQuery("#page_background_color_textbox").val()); 
    var imageFieldValue = jQuery("#page_background_image_textbox").val();     
    if(imageFieldValue == "" || imageFieldValue == "undefined") {
      targetPage.removeBackgroundImage();
    }
    else {
      targetPage.setBackgroundImage(imageFieldValue);
      targetPage.setBackgroundRepeatMode(this._getBackgroundRepeatMode());
      targetPage.setBackgroundPosition(this._getBackgroundPosition());
    }
  },
  
  _updateExternalPageUrl: function() {  
    try {
      page.setExternalPageUrl(jQuery("#external_page_url").val());
      WebDoc.application.pageEditor.loadPage(page, true);
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
        WebDoc.application.pageEditor.loadPage(WebDoc.application.pageEditor.currentPage, true);
      }
    }
  },

  objectChanged: function(page) {
    ddd('page-inspector_controller: objectChanged: must update fields');
    var page = WebDoc.application.pageEditor.currentPage;
    this._updatePageRelatedFields();
  },

  _getBackgroundRepeatMode: function() {
    if(jQuery('#page_background_image_tileX_checkbox:checked').val() !== undefined && jQuery('#page_background_image_tileY_checkbox:checked').val() !== undefined) {
      return "none";
    }
    else if(jQuery('#page_background_image_tileX_checkbox:checked').val() !== undefined) {
      return "repeat-x";
    }
    else if(jQuery('#page_background_image_tileY_checkbox:checked').val() !== undefined) {
      return "repeat-y";
    }
    else {
      return "no-repeat";
    }
  },

  _getBackgroundPosition: function() {
    return this._getBackgroundHorizontalPosition() + " " + this._getBackgroundVerticalPosition();
  },

  _getBackgroundHorizontalPosition: function() {
    return jQuery('input[name=xPos]:checked').val();
  },

  _getBackgroundVerticalPosition: function() {
    return jQuery('input[name=yPos]:checked').val();
  },

  _setBackgroundRepeatMode: function(mode) {
    switch(mode) {
      case "none":
        jQuery('#page_background_image_tileX_checkbox').attr('checked', true);
        jQuery('#page_background_image_tileY_checkbox').attr('checked', true);
        break;
      case "repeat-x":
        jQuery('#page_background_image_tileX_checkbox').attr('checked', true);
        jQuery('#page_background_image_tileY_checkbox').attr('checked', false);
        break;
      case "repeat-y":
        jQuery('#page_background_image_tileX_checkbox').attr('checked', false);
        jQuery('#page_background_image_tileY_checkbox').attr('checked', true);
        break;
      case "no-repeat":
        jQuery('#page_background_image_tileX_checkbox').attr('checked', false);
        jQuery('#page_background_image_tileY_checkbox').attr('checked', false);
        break;
      case undefined:
      default:
        jQuery('#page_background_image_tileX_checkbox').attr('checked', false);
        jQuery('#page_background_image_tileY_checkbox').attr('checked', false);
    }
  },

  _setBackroundPosition: function(position) {
    // Default, everything centered
    jQuery('#page_background_image_align_hor_center_radio').attr('checked', true);
    jQuery('#page_background_image_align_vert_middle_radio').attr('checked', true);
    if(position !== undefined) {
      // Horizontal align
      if(position.indexOf('left') >= 0) {
        jQuery('#page_background_image_align_hor_left_radio').attr('checked', true);
      }
      else if(position.indexOf('center') >= 0) {
        jQuery('#page_background_image_align_hor_center_radio').attr('checked', true);
      }
      else if(position.indexOf('right') >= 0) {
        jQuery('#page_background_image_align_hor_right_radio').attr('checked', true);
      }
      else {
        jQuery('#page_background_image_align_hor_center_radi').attr('checked', true);
      }
      // Vertical align
      if(position.indexOf('top') >= 0) {
        jQuery('#page_background_image_align_vert_top_radio').attr('checked', true);
      }
      else if(position.indexOf('bottom') >= 0) {
        jQuery('#page_background_image_align_vert_bottom_radio').attr('checked', true);
      }
      else if(position.indexOf('middle') >= 0) {
        jQuery('#page_background_image_align_vert_middle_radio').attr('checked', true);
      }
      else {
        jQuery('#page_background_image_align_vert_middle_radio').attr('checked', true);
      }
    }
  }
});


})(jQuery);