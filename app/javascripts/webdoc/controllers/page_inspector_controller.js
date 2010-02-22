/**
 * @author julien
 */

(function($, undefined){

var cssEditor,
    cssEditorFieldset,
    externalPageControls,
    backgroundControls,
    backgroundImageControls,
    backgroundImageControlsEnabled,
    page;

WebDoc.PageInspectorController = $.klass({
  
  initialize: function() {
    
    cssEditorFieldset = $("#page_css_editor");
    cssEditor = cssEditorFieldset.find('textarea.code');
    externalPageControls = $('.externalPage-related');
    backgroundControls = $('.background-related');
    backgroundImageControls = $('#page_background_image_tileX_checkbox, #page_background_image_align_hor_left_radio, #page_background_image_align_hor_center_radio, #page_background_image_align_hor_right_radio, #page_background_image_tileY_checkbox, #page_background_image_align_vert_top_radio, #page_background_image_align_vert_middle_radio, #page_background_image_align_vert_bottom_radio');

    cssEditor.bind("blur", this._applyPageCss);
    $("#external_page_url").bind("blur", this._updateExternalPageUrl.pBind(this));
    $("#page_title_textbox").bind("change", this._changePageTitle);
    $("#page_height_textbox").bind("change", this._changePageHeight);
    $("#page_width_textbox").bind("change", this._changePageWidth);
    $("#page_background_color_textbox").bind("change", this._changePageBackgroundColor);
    $("#page_background_image_textbox").bind("change", this._checkValidBackgroundImage.pBind(this));
    $("#page_background_image_tileX_checkbox").bind("change", this._changePageBackgroundRepeatMode.pBind(this));
    $("#page_background_image_tileY_checkbox").bind("change", this._changePageBackgroundRepeatMode.pBind(this));
    $("#page_background_image_align_hor_left_radio").bind("change", this._changePageBackgroundPosition.pBind(this));
    $("#page_background_image_align_hor_center_radio").bind("change", this._changePageBackgroundPosition.pBind(this));
    $("#page_background_image_align_hor_right_radio").bind("change", this._changePageBackgroundPosition.pBind(this));
    $("#page_background_image_align_vert_top_radio").bind("change", this._changePageBackgroundPosition.pBind(this));
    $("#page_background_image_align_vert_middle_radio").bind("change", this._changePageBackgroundPosition.pBind(this));
    $("#page_background_image_align_vert_bottom_radio").bind("change", this._changePageBackgroundPosition.pBind(this));
    $("#page_background_image_apply_all_button").bind("click", this._applyBackgroundToAllPages.pBind(this));
    $('#image_send_form').submit(this._uploadBackgroundImage.pBind(this));
    $('.page-navigation-link').click(this.performAction.pBind(this));
    $('.page-remove-background-image').click(this._removeBackgroundImage.pBind(this));
    WebDoc.application.boardController.addCurrentPageListener(this);
    WebDoc.application.pageEditor.currentPage.addListener(this); 
    
    this.currentPageChanged();
    this.domNode = $('#page_inspector');
  },

  performAction: function(e) {
    e.preventDefault();
    clickedButton = $(e.target);
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
    $("#external_page_url")[0].value = page.data.data.externalPageUrl; 
    this._updatePageRelatedFields();
    this._checkEnableBackgroundControls();
   },

  _updatePageRelatedFields: function() {
    cssEditor.val( $.toJSON(page.data.data.css) ); 
    $("#page_title_textbox").val( page.data.title == "undefined" ? "enter a title" : page.data.title );
    $("#page_height_textbox")[0].value = page.data.data.css.height; 
    $("#page_width_textbox")[0].value = page.data.data.css.width; 
    if(page.data.data.externalPageUrl) {
      cssEditorFieldset.hide();
      externalPageControls.show();
      backgroundControls.hide();
    }
    else { 
      cssEditorFieldset.show();
      externalPageControls.hide();
      backgroundControls.show();
      $("#page_background_color_textbox")[0].value = page.data.data.css.backgroundColor;
      $("#page_background_image_textbox")[0].value = page.data.data.css.backgroundImage;
      this._setBackgroundRepeatMode(page.data.data.css.backgroundRepeat); 
      this._setBackroundPosition(page.data.data.css.backgroundPosition);
      if(page.hasBackgroundImage()) {
        $('#background_image').attr('src', page.getBackgroundImagePath()).css("width", "100px").css("height", "100px");
        $('#background_image_preview').show();
      }
      else {
         $('#background_image_preview').hide();
      }
    }
  },

  _checkEnableBackgroundControls: function() {
    try {
      WebDoc.InspectorFieldsValidator.validateBackgroundUrl($("#page_background_image_textbox")[0].value);
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
      $('#background_image').hide();
    }
    else {
      backgroundImageControls
      .removeAttr('disabled')
      .siblings('label')
      .removeClass('disabled');
      $('#background_image').show();
    }
  },
  
  _changePageTitle: function(e) {
    e.preventDefault();
    page.setTitle($("#page_title_textbox").val());   
  },

  _changePageHeight: function(e) {
    e.preventDefault();
    try {
      page.setHeight($("#page_height_textbox").val());   
    }
    catch(exc) {
      $("#page_height_textbox")[0].value = page.data.data.css.height;
    }   
  },

  _changePageWidth: function(e) {
    e.preventDefault();
    try {
      page.setWidth($("#page_width_textbox").val()); 
    }
    catch(exc) {
      $("#page_width_textbox")[0].value = page.data.data.css.width;
    }
  },

  _changePageBackgroundColor: function(e) {
    e.preventDefault();
    try {
      page.setBackgroundColor($("#page_background_color_textbox").val()); 
    }
    catch(exc) {
      $("#page_background_color_textbox")[0].value = page.data.data.css.backgroundColor;
    }
  },

  _changePageBackgroundImage: function() {
    try {
      page.setBackgroundImage($("#page_background_image_textbox").val()); 
      WebDoc.application.pageEditor.loadPage(page);
    }
    catch(exc) {
      $("#page_background_image_textbox")[0].value = page.data.data.css.backgroundImage;
    } 
  },

  _changePageBackgroundImageFromThumb: function() {
    var backGroundImageSrc = $('#background_image').data('url');
    page.setBackgroundImage('url(' + backGroundImageSrc + ')'); 
    WebDoc.application.pageEditor.loadPage(page);
  },

  _changePageBackgroundRepeatMode: function(e) {
    if(e) { e.preventDefault(); }
    try {
      page.setBackgroundRepeatMode(this._getBackgroundRepeatMode());
      WebDoc.application.pageEditor.loadPage(page); 
     }
    catch(exc) {
      this._setBackgroundRepeatMode(page.data.data.css.background-repeat);
    } 
  },

  _changePageBackgroundPosition: function(e) {
    if(e) {e.preventDefault(); }
    try {
      page.setBackgroundPosition(this._getBackgroundPosition());
      WebDoc.application.pageEditor.loadPage(page); 
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
    WebDoc.application.pageEditor.loadPage(WebDoc.application.pageEditor.currentPage);
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

  _uploadBackgroundImage: function(e) {
    var options = {  
      success:       this._displayBackgroundImage.pBind(this), 
      type:          "POST",
      dataType:      "json"
    };
    try{
      // submit the form
      $(e.target).ajaxSubmit(options);
    }
    catch(exc) {
      ddd('_uploadBackgroundImage: encountered exception: name: '+exc.name + ' , message: '+exc.message);
    } 
    // return false to prevent normal browser submit and page navigation 
    e.preventDefault();
    return false;
  },

  _displayBackgroundImage: function(responseText, statusText) {
    // Put thumbnail url in the page data so that it can be re-used later
    var thumbUrl = responseText.image.properties.thumb_url;
    $('#background_image').attr('src', thumbUrl).data('url', responseText.image.properties.url);
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
    WebDoc.application.pageEditor.loadPage(WebDoc.application.pageEditor.currentPage);
  },

  _applyBackgroundToPage: function(targetPage) {
    targetPage.setBackgroundColor($("#page_background_color_textbox").val()); 
    var imageFieldValue = $("#page_background_image_textbox").val();     
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
      page.setExternalPageUrl($("#external_page_url").val());
      WebDoc.application.pageEditor.loadPage(page);
    }
    catch(exc) {
      $("#external_page_url")[0].value = page.data.data.externalPageUrl;
    }
  },
  
  _applyPageCss: function(e) {
    e.preventDefault();
    var editor = WebDoc.application.pageEditor;
    if ($.toJSON(editor.currentPage.data.data.css) != cssEditor.val() ) {
      var newCss = null;
      
      try {
        eval("newCss=" + cssEditor.val() );
      }
      catch(ex) {
        ddd("Invalid css");
        cssEditor.val( $.toJSON(editor.currentPage.data.data.css) );
      }
      if (newCss) {
        WebDoc.application.pageEditor.currentPage.applyCss(newCss);
        WebDoc.application.pageEditor.loadPage(WebDoc.application.pageEditor.currentPage);
      }
    }
  },

  objectChanged: function(page) {
    ddd('page_inspector_controller: objectChanged: must update fields');
    var page = WebDoc.application.pageEditor.currentPage;
    this._updatePageRelatedFields();
  },

  _getBackgroundRepeatMode: function() {
    if($('#page_background_image_tileX_checkbox:checked').val() !== undefined && $('#page_background_image_tileY_checkbox:checked').val() !== undefined) {
      return "none";
    }
    else if($('#page_background_image_tileX_checkbox:checked').val() !== undefined) {
      return "repeat-x";
    }
    else if($('#page_background_image_tileY_checkbox:checked').val() !== undefined) {
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
    return $('input[name=xPos]:checked').val();
  },

  _getBackgroundVerticalPosition: function() {
    return $('input[name=yPos]:checked').val();
  },

  _setBackgroundRepeatMode: function(mode) {
    switch(mode) {
      case "none":
        $('#page_background_image_tileX_checkbox').attr('checked', true);
        $('#page_background_image_tileY_checkbox').attr('checked', true);
        break;
      case "repeat-x":
        $('#page_background_image_tileX_checkbox').attr('checked', true);
        $('#page_background_image_tileY_checkbox').attr('checked', false);
        break;
      case "repeat-y":
        $('#page_background_image_tileX_checkbox').attr('checked', false);
        $('#page_background_image_tileY_checkbox').attr('checked', true);
        break;
      case "no-repeat":
        $('#page_background_image_tileX_checkbox').attr('checked', false);
        $('#page_background_image_tileY_checkbox').attr('checked', false);
        break;
      case undefined:
      default:
        $('#page_background_image_tileX_checkbox').attr('checked', false);
        $('#page_background_image_tileY_checkbox').attr('checked', false);
    }
  },

  _setBackroundPosition: function(position) {
    // Default, everything centered
    $('#page_background_image_align_hor_center_radio').attr('checked', true);
    $('#page_background_image_align_vert_middle_radio').attr('checked', true);
    if(position !== undefined) {
      // Horizontal align
      if(position.indexOf('left') >= 0) {
        $('#page_background_image_align_hor_left_radio').attr('checked', true);
      }
      else if(position.indexOf('center') >= 0) {
        $('#page_background_image_align_hor_center_radio').attr('checked', true);
      }
      else if(position.indexOf('right') >= 0) {
        $('#page_background_image_align_hor_right_radio').attr('checked', true);
      }
      else {
        $('#page_background_image_align_hor_center_radi').attr('checked', true);
      }
      // Vertical align
      if(position.indexOf('top') >= 0) {
        $('#page_background_image_align_vert_top_radio').attr('checked', true);
      }
      else if(position.indexOf('bottom') >= 0) {
        $('#page_background_image_align_vert_bottom_radio').attr('checked', true);
      }
      else if(position.indexOf('middle') >= 0) {
        $('#page_background_image_align_vert_middle_radio').attr('checked', true);
      }
      else {
        $('#page_background_image_align_vert_middle_radio').attr('checked', true);
      }
    }
  }
});


})(jQuery);