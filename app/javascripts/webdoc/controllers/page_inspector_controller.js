/**
 * @author julien
 */

(function($, undefined){

var cssEditor,
    cssEditorFieldset,
    externalPageControls,
    backgroundImageControls,
    backgroundImageControlsEnabled,
    page;

WebDoc.PageInspectorController = $.klass({
  initialize: function() {
    
    cssEditorFieldset = $("#page_css_editor");
    cssEditor = cssEditorFieldset.find('textarea.code');
    externalPageControls = $('#allow_annotation_checkbox, #external_page_url');
    backgroundImageControls = $('#page_background_image_tileX_checkbox, #page_background_image_align_hor_left_radio, #page_background_image_align_hor_center_radio, #page_background_image_align_hor_right_radio, #page_background_image_tileY_checkbox, #page_background_image_align_vert_top_radio, #page_background_image_align_vert_middle_radio, #page_background_image_align_vert_bottom_radio');

    cssEditor.bind("blur", this._applyPageCss);
    $("#external_page_checkbox").bind("change", this._changeExternalMode.pBind(this));
    $("#allow_annotation_checkbox").bind("change", this._changeAllowAnnotation.pBind(this)); 
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
    $('.page-navigation-link').click(this.performAction.pBind(this));
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
    $("#external_page_checkbox").attr("checked", page.data.data.externalPage?true:false);
    $("#allow_annotation_checkbox").attr("checked", page.data.data.allowAnnotation?true:false);    
    $("#external_page_url")[0].value = page.data.data.externalPageUrl; 
    this._updatePageRelatedFields();
    this._updateExternalMode(); 
    this._checkEnableBackgroundControls();
   },
  
  _updateExternalMode: function() {
    ddd("update external page");
    if (page.data.data.externalPage) {
      cssEditorFieldset.hide();
      externalPageControls
      .removeAttr('disabled')
      .siblings('label')
      .removeClass('disabled');
      
    } else {
      cssEditorFieldset.show();
      externalPageControls
      .attr('disabled', 'disabled')
      .siblings('label')
      .addClass('disabled');
    }
  },

  _updatePageRelatedFields: function() {
    cssEditor.val( $.toJSON(page.data.data.css) ); 
    $("#page_title_textbox").val( page.data.title == "undefined" ? "enter a title" : page.data.title );
    $("#page_height_textbox")[0].value = page.data.data.css.height; 
    $("#page_width_textbox")[0].value = page.data.data.css.width; 
    $("#page_background_color_textbox")[0].value = page.data.data.css.backgroundColor;
    $("#page_background_image_textbox")[0].value = page.data.data.css.backgroundImage;
    this._setBackgroundRepeatMode(page.data.data.css.backgroundRepeat);
	  this._setBackroundPosition(page.data.data.css.backgroundPosition);
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
    }
    else {
      backgroundImageControls
      .removeAttr('disabled')
      .siblings('label')
      .removeClass('disabled');
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

  _changePageBackgroundRepeatMode: function(e) {
    e.preventDefault();
    try {
      page.setBackgroundRepeatMode(this._getBackgroundRepeatMode());
      WebDoc.application.pageEditor.loadPage(page); 
     }
    catch(exc) {
      this._setBackgroundRepeatMode(page.data.data.css.background-repeat);
    } 
  },

  _changePageBackgroundPosition: function(e) {
    e.preventDefault();
    try {
      page.setBackgroundPosition(this._getBackgroundPosition());
      WebDoc.application.pageEditor.loadPage(page); 
     }
    catch(exc) {
      this._setBackroundPosition(page.data.data.css.backgroundPosition);
    } 
  },

  _cancelImageBackground: function() {
    page.removeBackgroundImage();
    WebDoc.application.pageEditor.loadPage(WebDoc.application.pageEditor.currentPage);
  },

  _checkValidBackgroundImage: function(e) {
    e.preventDefault();
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

  _changeAllowAnnotation: function(e) {
    e.preventDefault();
    page.setAllowAnnotation($("#allow_annotation_checkbox").attr("checked"));
    page.save(function() {
      WebDoc.application.pageEditor.loadPage(page);
    });     
  },
  
  _updateExternalPageUrl: function() {  
    page.data.data.externalPageUrl = $("#external_page_url")[0].value;
    if (page.data.data.allowAnnotation) {
      delete page.data.data.css.width;
      delete page.data.data.css.height;
    }
    page.save(function() {
      WebDoc.application.pageEditor.loadPage(page);
    });
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
  
  _changeExternalMode: function(e) {
    e.preventDefault();
    page.setExternalPageMode($("#external_page_checkbox").attr("checked"));
    page.save(function() {
      this._updateExternalMode();  
    }.pBind(this));     
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