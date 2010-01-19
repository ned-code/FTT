/**
 * @author julien
 */

(function($, undefined){

var cssEditor,
    cssEditorFieldset,
    externalPageControls;

WebDoc.PageInspectorController = $.klass({
  initialize: function() {
    
    cssEditorFieldset = $("#page_css_editor");
    cssEditor = cssEditorFieldset.find('textarea.code');
    externalPageControls = $('#allow_annotation_checkbox, #external_page_url');
    
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
    // $("#page_background_image_fit_page_radio").bind("change", this.changePageBackgroundRepeatMode.pBind(this));
    // $("#page_background_image_repeat_hor_radio").bind("change", this.changePageBackgroundRepeatMode.pBind(this));
    // $("#page_background_image_repeat_vert_radio").bind("change", this.changePageBackgroundRepeatMode.pBind(this));
    $("#page_background_image_apply_current_button").bind("click", this.applyBackgroundToCurrentPage.pBind(this));
    $("#page_background_image_apply_all_button").bind("click", this.applyBackgroundToAllPages.pBind(this));
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
    $("#page_height_textbox").get(0).value = page.data.data.css.height; 
    $("#page_width_textbox").get(0).value = page.data.data.css.width; 
    $("#page_background_color_textbox").get(0).value = page.data.data.css.backgroundColor;
    $("#page_background_image_textbox").get(0).value = page.data.data.css.backgroundImage;
    this.setBackgroundRepeatMode(page.data.data.css.backgroundRepeat);
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
      page.setBackgroundImageAndRepeatMode($("#page_background_image_textbox").val(), this.getBackgroundRepeatMode()); 
    }
    catch(exc) {
      $("#page_background_image_textbox").get(0).value = page.data.data.css.backgroundImage;
      this.setBackgroundRepeatMode(page.data.data.css.background-repeat);
    }
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
    if ($.toJSON(editor.currentPage.data.data.css) != cssEditor.get(0).value) {
      var newCss = null;
      try {
        eval("newCss=" + cssEditor.value() );
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
    return $("input[name=repeatMode]:checked").val();
  },

  setBackgroundRepeatMode: function(mode) {
    switch(mode) {
      case undefined:
      case "none":
        $('#page_background_image_fit_page_radio').attr('checked', true);
        break;
      case "repeat-x":
        $('#page_background_image_repeat_hor_radio').attr('checked', true);
        break;
      case "repeat-y":
        $('#page_background_image_repeat_vert_radio').attr('checked', true);
        break;
      default:
        $('#page_background_image_fit_page_radio').attr('checked', true);
    }
  }
});


})(jQuery);