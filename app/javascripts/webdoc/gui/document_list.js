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
        var previousElement = sectionToUpdate;
        if (index > 0) 
        {
            previousElement = $(sectionToUpdate.nextAll().get(index - 1));
        }
        previousElement.after($("<div id='" + document.uuid() + "' class='wb-document-item'><div class='wb-document-title'>" +
        '<a class="wb-document-edit" href="" title="Open this document">' + document.title() + '</a>' +
        "</div><div class='wb-document-actions'><a class='wb-document-delete' href='' title='delete'></a><a class='wb-document-rename sec-action' href='' title='edit'>edit</a> "+ this.buildShareValue(document) + "</div></div>").get(0));
    },
    
    removeDocument: function(id)
    {
        $("#" + id).remove();
    },
    
    changeShareStatus: function(document) {
      $('#'+document.uuid()+ '> .wb-document-actions').children().eq(3).replaceWith(this.buildShareValue(document));
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
                this.domNode.append($("<div id='" + document.uuid() + "' class='wb-document-item'><div class='wb-document-title'>" +
                '<a class="wb-document-edit" href="" title="Open this document">' + document.title() + '</a>' +
                "</div><div class='wb-document-actions'><a class='wb-document-delete' href='' title='delete'></a><a class='wb-document-rename sec-action' href='' title='info'>info</a><a class='wb-document-access sec-action' href='' title='collaborate'>collaborate</a>" +this.buildShareValue(document) +"</div></div>").get(0));
            }
        }
    },
    
    // Add next / previous page links if necessary, as well as page information
    repaintPagination: function(pagination) {
      // Next/Previous page links
      var hasPagination = pagination.total_pages > 1 ? true : false;
      if (hasPagination) {
        this.paginationWrap = $("<div class='pagination'>");
        $('<span>').html("Page " + pagination.current_page + " of " + pagination.total_pages + " ").appendTo(this.paginationWrap);
        if (pagination.previous_page > 0) {
          this.previousPageLink = $("<a>").attr({ href:"", 'class':"previous_page button" }).html("&larr; Previous");
          this.previousPageLink.click(function(event){
            WebDoc.application.documentEditor.loadDocuments(-1);
            event.preventDefault();
          }.pBind(this)).appendTo(this.paginationWrap);
        }
        if (pagination.next_page > 0) {
          if(pagination.previous_page > 0) { $("<span>").html(' | ').appendTo(this.paginationWrap); }
          this.nextPageLink = $("<a>").attr({ href:"", 'class':"next_page button" }).html("Next &rarr;");
          this.nextPageLink.click(function(event){
            WebDoc.application.documentEditor.loadDocuments(1);
            event.preventDefault();
          }.pBind(this)).appendTo(this.paginationWrap);
        }
        this.domNode.append(this.paginationWrap);
      }
    },
    
    buildShareValue: function(document) {
      if(WebDoc.application.documentEditor.currentUser.id == document.creatorId()) {
        return document.data.public? '<a class="wb-document-unshare sec-action" title="unshare" href="">unshare</a>' : '<a class="wb-document-share sec-action" title="share" href="">share</a>'
      }
      else { return ""; }
    },
});

