/**
 * Uniboard tool bar widget
**/
if(com.mnemis.core.Provide("com/mnemis/wb/gui/WBToolbar.js"))
{
    com.mnemis.wb.gui.WBToolbar = $.inherit(
    {
        __constructor: function()
        {
            this.domNode = $(
                "<div id='toolbar' style='position: fixed; top: 0px; left: 0px; width: 100%; height: 42px; background-color: gray; z-index: 65000'>" +
                "<a id='undo' class='toolbatButton' dojoAttachEvent='onclick: undo'>" +
                "<img src='/static/resources/toolbar/undo.png'/>"+
                "</a>" +
                "<a id='redo' class='toolbarButton' dojoAttachEvent='onclick: redo'>" +
                "<img src='/static/resources/toolbar/redo.png'/>"+
                "</a>" +
                "</div>").get(0);
	
            $(this.domNode).find("#undo").bind('click', this.undo);
            $(this.domNode).find("#redo").bind('click', this.redo);
        },
        undo: function(e)
        {
            if (WB.application.undoManager)
            {
                WB.application.undoManager.undo();
                e.preventDefault();
            }
        },

        redo: function(e)
        {
            if (WB.application.undoManager)
            {
                WB.application.undoManager.redo();
                e.preventDefault();
            }
        }
    });
}