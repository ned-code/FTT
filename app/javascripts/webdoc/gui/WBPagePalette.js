/**
 * Uniboard page palette widget
**/
if(com.mnemis.core.Provide("com/mnemis/wb/gui/WBPagePalette.js"))
{
    com.mnemis.wb.gui.WBPagePalette = $.inherit(
    {
        __constructor: function()
        {
            this.domNode = $(
                "<div id='wb-pagepalette' class='wb-floatingpalette' style='height:60px; width:230px'>" +
                this.getButtonHtml(3, "clear", "clearPage.png") +
                this.getButtonHtml(4, "previous", "previousPage.png") +
                this.getButtonHtml(5, "pages", "documents.png") +
                this.getButtonHtml(6, "next", "nextPage.png") +
                "</div>").get(0);


            var domNodeWrapper = $(this.domNode);
            domNodeWrapper.draggable();
            domNodeWrapper.find("#clear").bind('click', this, this.clearPage);
            domNodeWrapper.find("#previous").bind('click', this, this.previousPage);
            domNodeWrapper.find("#pages").bind('click', this, this.pages);
            domNodeWrapper.find("#next").bind('click', this, this.nextPage);
        },
        getButtonHtml : function(id, name, icon)
        {
            return "<div id='" + name + "' class='wb-pagepalette-button wb-tool-" + id + "'>" +
            "<img src='/static/resources/toolbar/" + icon + "' alt='" + name + "' style='vertical-align:middle'/>"+
            "</div>" ;
        },

        clearPage : function()
        {
            WB.application.boardController.currentPage.clear();
        },

        previousPage : function()
        {
            WB.application.viewer.loadPrevioustPage();
        },

        nextPage : function()
        {
            WB.application.viewer.loadNextPage();
        },

        pages : function()
        {
            WB.application.viewer.goToDocumentPage();
        }
    });
}
