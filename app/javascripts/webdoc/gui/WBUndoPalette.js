/**
 * Uniboard page palette widget
**/
if (com.mnemis.core.Provide("com/mnemis/wb/gui/WBUndoPalette.js"))
{
    com.mnemis.wb.gui.WBUndoPalette = $.inherit(
    {
        __constructor: function()

        {
            this.domNode = $(
                "<div id='wb-undopalette' class='wb-floatingpalette' style='height:60px; width:120px'>" +
                this.getButtonHtml(0, "undo", "undo.png") +
                this.getButtonHtml(1, "redo", "redo.png") +
                "</div>").get(0);


            var domNodeWrapper = $(this.domNode);
            domNodeWrapper.draggable();
            domNodeWrapper.find("#undo").bind('click', this, this.undo);
            domNodeWrapper.find("#redo").bind('click', this, this.redo);
        },
        getButtonHtml: function(id, name, icon)
        {
            return "<div id='" + name + "' class='wb-undopalette-button wb-tool-" + id + "'>" +
            "<img src='/static/resources/toolbar/" + icon + "' alt='" + name + "' style='vertical-align:middle'/>"+
            "</div>" ;
        },

        undo: function()
        {
            WB.application.undoManager.undo();
        },

        redo: function()
        {
            WB.application.undoManager.redo();
        }
    });
    

}
