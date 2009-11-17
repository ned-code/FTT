/**
 *
 **/
WebDoc.DocumentList = $.klass(
{
    domNode: null,
    datasource: null,
    id: null,
    initialize: function(id, datasource)
    {
        this.id = id;
        this.domNode = this.createDomNode(id);
        this.datasource = datasource;
        this.datasource.view = this;
        this.repaint();
    },
    
    createDomNode: function(id)
    {
        return $("<div id='" + id + "' class='wb-document-list'/>");
    },
    
    refreshNewDocument: function(section, index, document)
    {
        var sectionToUpdate = $(this.domNode.find("h3").get(section));
        var previousElement = sectionToUpdate
        if (index > 0) 
        {
            previousElement = $(sectionToUpdate.nextAll().get(index - 1))
        }
        previousElement.after($("<div id='" + document.uuid() + "' class='wb-document-item'>\
                                                        <div class='wb-document-title'>" +
        '<a class="wb-document-edit" href="" title="Open this document">' + document.title() + '</a>' +
        "</div>\
                                                        <div class='wb-document-actions'>\
                                                        <a class='wb-document-delete' href='' title='delete'></a>\
                                                        <a class='wb-document-rename sec-action' href='' title='rename'>rename</a>\
                                                        <a class='wb-document-access sec-action' href='' title='share'>share</a>\                                                           
                                                        </div>\
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
        for (var section = 0; section < this.datasource.nbSections(); section++) 
        {
            this.domNode.append($("<h3>" + this.datasource.section(section) + "</h3>").get(0));
            for (var i = 0; i < this.datasource.nbDocuments(section); i++) 
            {
                var document = this.datasource.document(section, i);
                this.domNode.append($("<div id='" + document.uuid() + "' class='wb-document-item'>\
                                                        <div class='wb-document-title'>" +
                '<a class="wb-document-edit" href="" title="Open this document">' + document.title() + '</a>' +
                "</div>\
                                                        <div class='wb-document-actions'>\
                                                        <a class='wb-document-delete' href='' title='delete'></a>\
                                                        <a class='wb-document-rename sec-action' href='' title='rename'>rename</a>\
                                                        <a class='wb-document-access sec-action' href='' title='share'>share</a>\                                                        
                                                        </div>\
                                                      </div>").get(0));
            }
        }
    }
});

