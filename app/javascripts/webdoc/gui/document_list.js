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
      this._getCurrentUserRolesDocuments();
      this.repaint();
  },
  
  refreshNewDocument: function(section, index, document) {
      
      // TODO: This has to work when the Today list doesn't exist yet
      // Not sure why we do this at all, since as soon as you create a page
      // you are directed to a new window...
      
      // var sectionToUpdate = $(this.domNode.find("h3").get(section));
      // 
      // var previousElement = sectionToUpdate;
      // if (index > 0) 
      // {
      //     previousElement = $(sectionToUpdate.nextAll().get(index - 1));
      // }
      // 
      // var documentItemNode = this._buildDocumentItemNode( document );
      // 
      // previousElement.after(documentItemNode);
  },
  
  removeDocument: function(id) {
      $("#" + id).remove();
  },
  
  changeShareStatus: function(document) {
    $('#'+document.uuid()+ '> .document-actions').children().eq(3).replaceWith(this._buildShareValue(document));
  },
  
  repaint: function() {
      var sectionIndex,
          sectionCount = this.datasource.nbSections(),
          sectionTitle,
          sectionList,
          documentIndex,
          documentCount,
          document,
          documentNode,
          documentTitleNode;
  
      this.domNode
      .empty();
      
      // iterate on all sections
      for ( sectionIndex = 0; sectionIndex < sectionCount; sectionIndex++ ) 
      {
        documentCount = this.datasource.nbDocuments( sectionIndex );
        
        // Are there any documents in this section?
        if ( documentCount > 0 ) {
          
          // Then create the list
          sectionTitle = $('<h3/>').html( this.datasource.section( sectionIndex ) );
          sectionList = $('<ul/>', {
            "class": "vertical document-index index"
          });
          
          for ( documentIndex = 0; documentIndex < documentCount; documentIndex++ )
          {
              document = this.datasource.document( sectionIndex, documentIndex );
              documentNode = this._buildDocumentItemNode( document );
              sectionList.append( documentNode );
          }
          
          // And add it to the DOM
          this.domNode
          .append(
            sectionTitle
          ).append(
            sectionList
          );
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
  
  _getCurrentUserRolesDocuments: function() {
    $.ajax({
      url: "/roles/documents",
      type: 'GET',
      dataType: 'json',              
      success: function(data, textStatus) {
        this.currentUserDocumentsEditor = data.editor;
        this.currentUserDocumentsReader = data.reader;
      }.pBind(this)
    });
  },
  
  _buildDocumentItemNode: function( document ){
      var documentNode = $("<li/>", {
            "class": "document-item clear"
          }),
          documentTitle = $("<a/>", {
            "class": "document-title wb-document-edit",
            "id": document.uuid(),
            "href": "#"+document.uuid(),
            "title": "Open this document",
            html: document.title()
          });
      
      documentNode.append( documentTitle );
      
      if ( this._hasAuthenticatedUserEditorRights( document.data.id ) ) {
        documentNode.append( this._buildDocumentActionsNode( document ) );
      }
      
      return documentNode;
  },
  
  _buildDocumentActionsNode: function(document) {
    var documentActionsNode = $("<ul/>", {
          "class": "document-actions index"
        }),
        deleteItemNode = $("<li/>"),
        deleteNode = $("<a/>", {
          "class": "wb-document-delete delete-button button",
          href: "",
          title: "delete",
          html: "delete"
        }),
        infoItemNode = $("<li/>"),
        infoNode = $("<a/>", {
          "class": "wb-document-info sec-action info-button button",
          href: "",
          title: "info",
          html: "info"
        }),
        collaborateItemNode = $("<li/>"),
        collaborateNode = $("<a/>", {
          "class": "wb-document-collaborate sec-action collaborate-button button",
          href: "",
          title: "invite co-editors",
          html: "invite co-editors"
        }),
        shareItemNode = $("<li/>"),
        shareNode = ( document.isShared() ) ?
          $("<a/>", {
            "class": "wb-document-unshare sec-action unshare-button button",
            href: "#unshare",
            title: "unshare",
            html: "unshare"
          }) :     
          $("<a/>", {
            "class": "wb-document-share sec-action share-button button",
            href: "#share",
            title: "share",
            html: "share"
          })
        ;
    
    // Construct DOM tree and return it
    return documentActionsNode.append(
      infoItemNode.html(
        infoNode
      )
    ).append(
      deleteItemNode.html(
        deleteNode
      )
    ).append(
      collaborateItemNode.html(
        collaborateNode
      )
    ).append(
      shareItemNode.html(
        shareNode
      )
    );
  },
  
  _buildShareValue: function(document) {
    var shareAction = "";
    shareAction = document.data.is_public ?  "unshare" : "share" ;
    return $('<a>').addClass("wb-document-" + shareAction + " sec-action").attr("href", "").attr("title", shareAction).html(shareAction);
  },
  
  _createDomNode: function(id) {
      return $("<div>").attr('id', id).addClass("wb-document-list");
  },
  
  _hasAuthenticatedUserEditorRights: function(documentId) {
     for (var i = 0; i< this.currentUserDocumentsEditor.length; i++) {
       if (this.currentUserDocumentsEditor[i] == documentId) { return true; }
     }
     return false;
   }
});

