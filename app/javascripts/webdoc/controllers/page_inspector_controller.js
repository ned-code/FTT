/**
 * @author julien
 */

(function($, undefined){

var cssEditor,
    cssEditorFieldset,
    externalPageControls,
    backgroundImageControls;

WebDoc.PageInspectorController = $.klass({
  initialize: function() {
    
    cssEditorFieldset = $("#page_css_editor");
    cssEditor = cssEditorFieldset.find('textarea.code');
    externalPageControls = $('#allow_annotation_checkbox, #external_page_url');
    backgroundImageControls = $('#page_background_image_tileX_checkbox, #page_background_image_align_hor_left_radio, #page_background_image_align_hor_center_radio, #page_background_image_align_hor_right_radio, #page_background_image_tileY_checkbox, #page_background_image_align_vert_top_radio, #page_background_image_align_vert_middle_radio, #page_background_image_align_vert_bottom_radio');

    cssEditor.bind("blur", this.applyPageCss);
    $("#external_page_checkbox").bind("change", this.changeExternalMode.pBind(this));
    $("#allow_annotation_checkbox").bind("change", this.changeAllowAnnotation.pBind(this)); 
    $("#external_page_url").bind("blur", this.updateExternalPageUrl.pBind(this));
    $("#page_title_textbox").bind("change", this.changePageTitle.pBind(this));
    $("#page_title_textbox").bind("change", this.changePageTitle.pBind(this));
    $("#page_height_textbox").bind("change", this.changePageHeight.pBind(this));
    $("#page_width_textbox").bind("change", this.changePageWidth.pBind(this));
    $("#page_background_color_textbox").bind("change", this.changePageBackgroundColor.pBind(this));
    $("#browse_background_image_button").bind("click", this.browseForImages);
    // $("#page_background_image_textbox").bind("change", this.changePageBackgroundImage.pBind(this));
    // $("#page_background_image_tileX_checkbox").bind("change", this.changePageBackgroundRepeatMode.pBind(this));
    // $("#page_background_image_repeat_hor_radio").bind("change", this.changePageBackgroundRepeatMode.pBind(this));
    // $("#page_background_image_repeat_vert_radio").bind("change", this.changePageBackgroundRepeatMode.pBind(this));
    $("#page_background_image_apply_current_button").bind("click", this.applyBackgroundToCurrentPage.pBind(this));
    $("#page_background_image_apply_all_button").bind("click", this.applyBackgroundToAllPages.pBind(this));
    $("#page_background_upload_button").bind("click", this.uploadImageAndSetAsBackground.pBind(this));
    WebDoc.application.boardController.addCurrentPageListener(this);
    WebDoc.application.pageEditor.currentPage.addListener(this); 
    this.currentPageChanged();
  },
  
  currentPageChanged: function() {
    ddd('currentPageChanged');
    var page = WebDoc.application.pageEditor.currentPage;     
    $("#external_page_checkbox").attr("checked", page.data.data.externalPage?true:false);
    $("#allow_annotation_checkbox").attr("checked", page.data.data.allowAnnotation?true:false);    
    $("#external_page_url").get(0).value = page.data.data.externalPageUrl; 
    this.updatePageRelatedFields(page);
    this.updateExternalMode(page); 
   },
  
  updateExternalMode: function(page) {
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

  updatePageRelatedFields: function(page) {
    cssEditor.val( $.toJSON(page.data.data.css) ); 
    //$("#page_title_textbox").val( page.data.title == "undefined" ? "enter a title" : page.data.title );
    $("#page_height_textbox")[0].value = page.data.data.css.height; 
    $("#page_width_textbox")[0].value = page.data.data.css.width; 
    $("#page_background_color_textbox")[0].value = page.data.data.css.backgroundColor;
    $("#page_background_image_textbox")[0].value = page.data.data.css.backgroundImage;
    if($("#page_background_image_textbox")[0].value == 'undefined') {
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
      this.setBackgroundRepeatMode(page.data.data.css.backgroundRepeat);
      this.setBackroungPosition(page.data.data.css.backgroundPosition);
    }
  },
  
  changePageTitle: function(e) {
    e.preventDefault();
    var page = WebDoc.application.pageEditor.currentPage;
    page.setTitle($("#page_title_textbox").val());   
  },

  changePageHeight: function(e) {
    e.preventDefault();
    var page = WebDoc.application.pageEditor.currentPage;
    try {
      page.setHeight($("#page_height_textbox").val());   
    }
    catch(exc) {
      $("#page_height_textbox").get(0).value = page.data.data.css.height;
    }   
  },

  changePageWidth: function(e) {
    e.preventDefault();
    var page = WebDoc.application.pageEditor.currentPage;
    try {
      page.setWidth($("#page_width_textbox").val()); 
    }
    catch(exc) {
      $("#page_width_textbox").get(0).value = page.data.data.css.width;
    }
  },

  changePageBackgroundColor: function(e) {
    e.preventDefault();
    var page = WebDoc.application.pageEditor.currentPage;
    try {
      page.setBackgroundColor($("#page_background_color_textbox").val());        
    }
    catch(exc) {
      $("#page_background_color_textbox").get(0).value = page.data.data.css.backgroundColor;
    }
  },

  browseForImages: function(e) {
    e.preventDefault();
    alert('must open browser');
  },

  changePageBackgroundImage: function(e) {
    e.preventDefault();
    var page = WebDoc.application.pageEditor.currentPage;
    try {
      page.setBackgroundImage($("#page_background_image_textbox").val()); 
      WebDoc.application.pageEditor.loadPage(WebDoc.application.pageEditor.currentPage);       
    }
    catch(exc) {
      $("#page_background_image_textbox").get(0).value = page.data.data.css.backgroundImage;
    }
  },

  changePageBackgroundRepeatMode: function(e) {
    e.preventDefault();
    var page = WebDoc.application.pageEditor.currentPage;
    try {
      page.setBackgroundRepeatMode(this.getBackgroundRepeatMode()); 
      WebDoc.application.pageEditor.loadPage(WebDoc.application.pageEditor.currentPage);       
    }
    catch(exc) {
      this.setBackgroundRepeatMode(page.data.data.css.background-repeat);
    }
  },

  applyBackgroundToCurrentPage: function(e) {
    e.preventDefault();
    var page = WebDoc.application.pageEditor.currentPage;
    this.applyBackgroundToPage(page);
    WebDoc.application.pageEditor.loadPage(WebDoc.application.pageEditor.currentPage);
  },

  applyBackgroundToAllPages: function(e) {
    for(var i = 0; i < WebDoc.application.pageEditor.currentDocument.pages.length; i++) {
      ddd('apply to page:'+WebDoc.application.pageEditor.currentDocument.pages[i].data.title);
      this.applyBackgroundToPage(WebDoc.application.pageEditor.currentDocument.pages[i]);
    }
    WebDoc.application.pageEditor.loadPage(WebDoc.application.pageEditor.currentPage);
  },

  applyBackgroundToPage: function(page) {
    try {
      page.setBackgroundImageAndRepeatMode($("#page_background_image_textbox").val(), this.getBackgroundRepeatMode(), this.getBackgroundPosition()); 
    }
    catch(exc) {
      $("#page_background_image_textbox").get(0).value = page.data.data.css.backgroundImage;
      this.setBackgroundRepeatMode(page.data.data.css.backgroundRepeat);
      this.setBackroungPosition(page.data.data.css.backgroundPosition);
    }
  },

  uploadImageAndSetAsBackground: function(e) {
    e.preventDefault();
    var imagePath = $("#page_background_file").val();
    ddd('must upload file:'+imagePath);
    var ajaxParams = { type: "Medias::Image", file: imagePath };
    $.ajax({
      type: "POST",
      url: "/medias",
      data: (ajaxParams),
      dataType: "json",
      success: function(data) {
        ddd('Success:'+data);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        ddd("error " + textStatus + " " + errorThrown);
        ddd(XMLHttpRequest);
      }
    });
  },

  changeAllowAnnotation: function(e) {
    e.preventDefault();
    var page = WebDoc.application.pageEditor.currentPage;
    page.setAllowAnnotation($("#allow_annotation_checkbox").attr("checked"));
    page.save(function() {
      WebDoc.application.pageEditor.loadPage(page);
    });     
  },
  
  updateExternalPageUrl: function() {
    var page = WebDoc.application.pageEditor.currentPage;    
    page.data.data.externalPageUrl = $("#external_page_url").get(0).value;
    if (page.data.data.allowAnnotation) {
      delete page.data.data.css.width;
      delete page.data.data.css.height;
    }
    page.save(function() {
      WebDoc.application.pageEditor.loadPage(page);
    });
  },
  
  applyPageCss: function(e) {
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
  
  changeExternalMode: function(e) {
    e.preventDefault();
    var page = WebDoc.application.pageEditor.currentPage;
    page.setExternalPageMode($("#external_page_checkbox").attr("checked"));
    page.save(function() {
      this.updateExternalMode(page);  
    }.pBind(this));     
  },

  objectChanged: function(page) {
    ddd('page_inspector_controller: objectChanged: must update fields');
    var page = WebDoc.application.pageEditor.currentPage;
    this.updatePageRelatedFields(page);
  },

  getBackgroundRepeatMode: function() {
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

  getBackgroundPosition: function() {
    return this.getBackgroundHorizontalPosition() + " " + this.getBackgroundVerticalPosition();
  },

  getBackgroundHorizontalPosition: function() {
    return $('input[name=xPos]:checked').val();
  },

  getBackgroundVerticalPosition: function() {
    return $('input[name=yPos]:checked').val();
  },

  setBackgroundRepeatMode: function(mode) {
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

  setBackroungPosition: function(position) {
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
	    else if(position.indexOf('center') >= 0) {
	      $('#page_background_image_align_vert_middle_radio').attr('checked', true);
	    }
	    else {
	      $('#page_background_image_align_vert_middle_radio').attr('checked', true);
	    }
    }
  }
});


})(jQuery);