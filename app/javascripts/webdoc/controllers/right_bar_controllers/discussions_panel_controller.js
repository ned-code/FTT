  /**
 * @author noe
 */

WebDoc.DiscussionsPanelController = jQuery.klass(WebDoc.RightBarInspectorController, {

  DISCUSSIONS_BUTTON_SELECTOR: "a[href='#discussions-panel']",

  initialize: function() {
      this.domNode = jQuery('#discussions-panel');
      this.currentDocument = WebDoc.application.pageEditor.currentDocument;
      this.creator = WebDoc.application.pageEditor.getCreator();
      
      

  }

  // buttonSelector: function() {
  //   return this.DISCUSSIONS_BUTTON_SELECTOR;
  // }

});