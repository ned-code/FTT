/**
 * @author david
 **/
WebDoc.DocumentList = $.klass({
    domNode: null,
    datasource: null,
    id: null,
    initialize: function(id, datasource) {
        this.id = id;
        this.domNode = this._createDomNode(id);
        this.datasource = datasource;
        this.datasource.view = this;
        this.repaint();
    },
    
    refreshNewDocument: function(section, index, document) {
        var sectionToUpdate = $(this.domNode.find(".document-index").get(section));
        var previousElement = sectionToUpdate;
        //if (index > 0) 
        //{
            previousElement = $(sectionToUpdate.find('li').get(index - 1));
        //}
        var documentItemNode = $("<li/>").addClass("wb-document-item").attr('id', document.uuid());
        var documentItemTitle = $("<span/>").addClass("document-title");
        
        
        documentItemTitle.append($("<a>").addClass("wb-document-edit").attr("href", "").attr("title", "Open this document").html(document.title()));
        
        
        documentItemNode.append(documentItemTitle);
        
        
        if (document.hasAuthenticatedUserEditorRights()) { documentItemNode.append(this._buildDocumentActionsNode(document)); }
        
        
        previousElement.after(documentItemNode);
    },
    
    removeDocument: function(id) {
        $("#" + id).remove();
    },
    
    changeShareStatus: function(document) {
      $('#'+document.uuid()+ '> .wb-document-actions').children().eq(3).replaceWith(this.buildShareValue(document));
    },
    
    repaint: function() {
        this.domNode.empty();
        // iterate on all sections
        for (var section = 0; section < this.datasource.nbSections(); section++) 
        {
            this.domNode.append( $("<h3>" + this.datasource.section(section) + "</h3>").get(0));
            var list = $("<ul/>", { 'class': 'document-index vertical index' });
            for (var i = 0; i < this.datasource.nbDocuments(section); i++) 
            {
                var document = this.datasource.document(section, i);
                var documentItemNode = $("<li/>").addClass("wb-document-item").attr('id', document.uuid());
                var documentItemTitle = $("<span>").addClass("document-title");
                documentItemTitle.append($("<a>").addClass("wb-document-edit").attr("href", "").attr("title", "Open this document").html(document.title()));
                documentItemNode.append(documentItemTitle);
                if (document.hasAuthenticatedUserEditorRights()) { documentItemNode.append(this._buildDocumentActionsNode(document)); }
                list.append(documentItemNode);
            }
            this.domNode.append(list);
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
    
    _buildDocumentActionsNode: function(document) {
      var documentActionsNode = $("<div>").addClass("wb-document-actions");
      documentActionsNode.append($("<a>").addClass("wb-document-delete").attr("href", "").attr("title", "delete"));
      documentActionsNode.append($("<a>").addClass("wb-document-info sec-action").attr("href", "").attr("title", "info").html("info"));
      documentActionsNode.append($("<a>").addClass("wb-document-collaborate sec-action").attr("href", "").attr("title", "collaborate").html("collaborate"));
      if (document.isShared()) {
        documentActionsNode.append($("<a>").addClass("wb-document-unshare sec-action").attr("href", "").attr("title", "unshare").html("unshare"));     
      }
      else {
        documentActionsNode.append($("<a>").addClass("wb-document-share sec-action").attr("href", "").attr("title", "share").html("share"));        
      }
      return documentActionsNode;
    },
    
    _createDomNode: function(id) {
        return $("<div>").attr('id', id).addClass("wb-document-list");
    }
});

