/**
 * @author Julien Bachmann
 */
WebDoc.InnerHtmlController = $.klass({
  initialize: function() {
    this._htmlEditor = $("#selected-item-html-editor"); 
    this._noIframeBox = $("#no_iframe"); 
    this._htmlEditor.bind("blur", this.applyInnerHtml.pBind(this));
    this._noIframeBox.bind("change", this.updateNoIframe.pBind(this));
  },
  
  refresh: function() {
    if (WebDoc.application.boardController.selection().length) {
      this._htmlEditor.attr("disabled", "");
      var item = WebDoc.application.boardController.selection()[0].item;
      var html = item.getInnerHtml();
      if (html) {
        this._htmlEditor.get(0).value = html;
      }
      else {
        this._htmlEditor.get(0).value = "";
      }
      var noIframe = false;
      if (item.data.data.properties) {
        noIframe = item.property("noIframe");
      }      
      this._noIframeBox.attr("checked", noIframe);
      this._noIframeBox.attr("disabled", "");
    }
    else {
      this._htmlEditor.get(0).value = "";
      this._htmlEditor.attr("disabled", "true");
      this._noIframeBox.attr("checked", false);
      this._noIframeBox.attr("disabled", "true");
    }
  },
  
  updateNoIframe: function(event) {
    ddd("update no iframe");
    var item = WebDoc.application.boardController.selection()[0].item;
    if (item) {
      ddd("update item", item);
      item.setProperty("noIframe", this._noIframeBox.attr("checked"));
      item.setInnerHtml(item.data.data.innerHTML, true);
      item.save();
    }
  },
  
  applyInnerHtml: function(e) {
    e.preventDefault();
    var html = this._htmlEditor.get(0).value;
    if (html) {
      if (WebDoc.application.boardController.selection().length > 0) {
        WebDoc.application.boardController.selection()[0].item.setInnerHtml(html);
        this._htmlEditor.get(0).value = WebDoc.application.boardController.selection()[0].item.getInnerHtml();
      }
    }
  }
});
