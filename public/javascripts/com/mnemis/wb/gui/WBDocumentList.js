/**
 *
**/
if(com.mnemis.core.Provide("com/mnemis/wb/gui/WBDocumentList.js"))
{
    com.mnemis.wb.gui.WBDocumentList = $.inherit(
    {
        domNode: null,
        datasource: null,
        id: null,
        __constructor: function(id, datasource)
        {
            this.id = id;
            this.domNode = this.createDomNode(id);
            this.datasource = datasource;
            this.datasource.view = this;
            this.repaint();
        },

        createDomNode: function(id)
        {
            return $(
                "<div id='" + id + "' class='wb-document-list'/>");
        },

        refreshNewDocument: function(section, index, document)
        {
            var sectionToUpdate = $(this.domNode.find("h3").get(section));
            var previousElement = sectionToUpdate
            if (index > 0)
            {
                previousElement = $(sectionToUpdate.nextAll().get(index -1))
            }
            previousElement.after($("<div id='" + document.uuid() + "' class='wb-document-item'>\
                                                        <div class='wb-document-title'>" + document.title() + "</div>\
                                                        <button class='wb-document-edit ui-button ui-state-default ui-corner-all' href='/documents/" + document.uuid() + "'>edit</button>\
                                                        <button class='wb-document-rename ui-button ui-state-default ui-corner-all'>rename</button>\
                                                        <button class='wb-document-delete ui-button ui-state-default ui-corner-all'>delete</button>\
                                                      </div>").get(0));
        },

        removeDocument: function(id)
        {
            $("#" + id).remove();
        },

        repaint: function()
        {
            this.domNode.empty();
            // iterate on all sections
            for (var section= 0; section < this.datasource.nbSections(); section++)
            {
                this.domNode.append($("<h3>" + this.datasource.section(section) + "</h3>").get(0));
                for (var i= 0; i < this.datasource.nbDocuments(section); i++)
                {
                    var document = this.datasource.document(section, i);
                    this.domNode.append($("<div id='" + document.uuid() + "' class='wb-document-item'>\
                                                        <div class='wb-document-title'>" + document.title() + "</div>\
                                                        <button class='wb-document-edit ui-button ui-state-default ui-corner-all'>edit</button>\
                                                        <button class='wb-document-rename ui-button ui-state-default ui-corner-all'>rename</button>\
                                                        <button class='wb-document-delete ui-button ui-state-default ui-corner-all'>delete</button>\
                                                      </div>").get(0));
                }
            }                        
        }
    });
}
