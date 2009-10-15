/**
 * @author julien
 */
//= require <webdoc/model/image>
WebDoc.InspectorController = $.klass({
  initialize: function() {
    this.domNode = $("#item_inspector");
    var emptyInspector = $("#empty_inspector").hide();
    var textInspector = $("#palette_text").hide();
    var penInspector = $("#pen_inspector").hide();
    this.inspectors = [emptyInspector, textInspector, penInspector];
    this.selectInspector(0);
  },
  
  selectInspector: function(inspectorId) {
    if (this.currentInspectorId != undefined) {
      this.inspectors[this.currentInspectorId].hide();
    }
    this.inspectors[inspectorId].show();
    this.currentInspectorId = inspectorId;
  }
});

$.extend(WebDoc.InspectorController, {});
