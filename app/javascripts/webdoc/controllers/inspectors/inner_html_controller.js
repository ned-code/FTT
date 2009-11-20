/**
 * @author Julien Bachmann
 */
WebDoc.InnerHtmlController = $.klass({
  initialize: function() {
    $("#selected_item_html_editor").bind("blur", this.applyInnerHtml);
    $("#no_iframe").bind("change", this.updateNoIframe.pBind(this));
  },
  
  refresh: function() {
    if (WebDoc.application.boardController.selection.length) {
      $("#selected_item_html_editor").attr("disabled", "");
      var item = WebDoc.application.boardController.selection[0].item;
      var html = item.data.data.innerHTML;
      if (html) {
        $("#selected_item_html_editor").get(0).value = html;
      }
      else {
        $("#selected_item_html_editor").get(0).value = "";
      }
      var noIframe = false;
      if (item.data.data.properties) {
        noIframe = item.property("noIframe");
      }      
      $("#no_iframe").attr("checked", noIframe);
      $("#no_iframe").attr("disabled", "");
    }
    else {
      $("#selected_item_html_editor").get(0).value = "";
      $("#selected_item_html_editor").attr("disabled", "true");
      $("#no_iframe").attr("checked", false);
      $("#no_iframe").attr("disabled", "true");
    }
  },
  
  updateNoIframe: function(event) {
    ddd("update no iframe");
    var item = WebDoc.application.boardController.selection[0].item;
    if (item) {
      ddd("update item", item);
      item.setProperty("noIframe", $("#no_iframe").attr("checked"));
      item.setInnerHtml(item.data.data.innerHTML, true);
      item.save();
    }
  },
  
  applyInnerHtml: function(e) {
    e.preventDefault();
    var html = $("#selected_item_html_editor").get(0).value;
    if (html) {
      if (WebDoc.application.boardController.selection.length > 0) {
        WebDoc.application.boardController.selection[0].item.setInnerHtml(html);
      }
    }
  }
});
