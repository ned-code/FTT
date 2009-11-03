/**
 * @author julien
 */

WebDoc.PageInspectorController = $.klass({
  initialize: function() {
    $("#page_css_editor").bind("blur", this.applyPageCss);  
    $("#external_page_checkbox").bind("change", this.changeExternalMode.pBind(this));
    $("#allow_annotation_checkbox").bind("change", this.changeAllowAnnotation.pBind(this)); 
    $("#external_page_url").bind("blur", this.updateExternalPageUrl.pBind(this));    
    WebDoc.application.boardController.addCurrentPageListener(this);
  },
  
  currentPageChanged: function() {
    var page = WebDoc.application.pageEditor.currentPage;    
    $("#page_css_editor").get(0).value = $.toJSON(page.data.data.css);   
    $("#external_page_checkbox").attr("checked", page.data.data.externalPage?true:false);
    $("#allow_annotation_checkbox").attr("checked", page.data.data.allowAnnotation?true:false);    
    $("#external_page_url").get(0).value = page.data.data.externalPageUrl;  
    this.updateExternalMode(page); 
   },
  
  updateExternalMode: function(page) {
    ddd("update external page");
    if (page.data.data.externalPage) {
      $("#page_css_editor").css("display", "none");
      $("#external_page_panel").css("display", "");  
    } else {
      $("#page_css_editor").css("display", "");
      $("#external_page_panel").css("display", "none");
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
    delete page.data.data.css.width;
    delete page.data.data.css.height;
    page.save(function() {
      WebDoc.application.pageEditor.loadPage(page);
    });
  },
  
  applyPageCss: function(e) {
    e.preventDefault();
    var editor = WebDoc.application.pageEditor;
    if ($.toJSON(editor.currentPage.data.data.css) != $("#page_css_editor").get(0).value) {
      var newCss = null;
      try {
        eval("newCss=" + $("#page_css_editor").get(0).value);
      }
      catch(ex) {
        ddd("Invalid css");
        $("#page_css_editor").get(0).value = $.toJSON(editor.currentPage.data.data.css);
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
  }
});
