/**
 * @author david / stephen
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
      this.map = {};
  },
  
  refreshNewDocument: function(section, index, document) {
      // Not sure why we do this at all, since as soon as you create a page
      // you are directed to a new window...
      
      // TODO: This has to work when the Today list doesn't exist yet
      
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
      var obj = this.map[ id ];
      // Remove the documents node from the DOM
      obj.domNode && obj.domNode.remove();
      // ..and from the map
      delete this.map[ id ];
  },
  
  changeShareStatus: function(document) {
    this.map[ document.uuid() ].domNode.find('.share-button, .unshare-button').replaceWith(this._buildShareValue(document));
  },
  
  repaint: function() {
      var sectionIndex,
          sectionCount = this.datasource.nbSections(),
          sectionTitle, sectionList,
          documentIndex, documentCount,
          document, documentNode;
  
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
  

  
  _buildDocumentItemNode: function( document ){
    var id = document.uuid(),
        data = {
          webdoc: {
            id: id
          }
        },
        documentNode = $("<li/>", {
          "class": "document-item clear",
          data: data
        }),
        documentTitle = $("<a/>", {
          "class": "document-title wb-document-edit",
          "href": "#" + id,
          "title": "Open this document",
          data: data,
          html: document.title()
        });
    
    documentNode.append( documentTitle );
    
    if ( this._hasAuthenticatedUserEditorRights( document ) ) {
      documentNode
      .append( this._buildDocumentControlsNode( document, data ) )
      .append( this._buildDocumentActionsNode( document, data ) )
      .append( this._buildDocumentInfoNode( document, data ));
    }
    
    this.map[ id ] = {
      domNode: documentNode
    };
    
    return documentNode;
  },
  
  _buildDocumentInfoNode: function( document, data ){
    var infoNode = $("<a/>", {
          "class": "wb-document-info sec-action info-button button",
          href: "",
          title: "info",
          html: "info",
          data: data
        });
    
    return infoNode;
  },
  
  _buildDocumentControlsNode: function( document, data ) {
    var documentControlsNode = $("<ul/>", {
          "class": "document-controls index"
        }),
        deleteItemNode = $("<li/>"),
        deleteNode = $("<a/>", {
          "class": "wb-document-delete delete-button button",
          href: "",
          title: "delete",
          html: "delete",
          data: data
        });
    
    // Construct DOM tree and return it
    return documentControlsNode.append(
      deleteItemNode.html(
        deleteNode
      )
    );
  },
  
  _buildDocumentActionsNode: function( document, data ) {
    var documentActionsNode = $("<ul/>", {
          "class": "document-actions index"
        }),
        collaborateItemNode = $("<li/>"),
        collaborateNode = $("<a/>", {
          "class": "wb-document-collaborate sec-action collaborate-button button",
          href: "",
          title: "Invite other people to help you edit your webdoc",
          html: "invite co-editors",
          data: data
        }),
        shareItemNode = $("<li/>"),
        shareNode = ( document.isShared() ) ?
          $("<a/>", {
            "class": "wb-document-unshare sec-action unshare-button button",
            href: "#unshare",
            title: "unshare",
            html: "unshare",
            data: data
          }) :     
          $("<a/>", {
            "class": "wb-document-share sec-action share-button button",
            href: "#share",
            title: "Share your webdoc with the world - or just your friends",
            html: "share",
            data: data
          })
        ;
    
    // Construct DOM tree and return it
    return documentActionsNode.append(
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
    return $('<a>').addClass("wb-document-" + shareAction + " sec-action "+shareAction+"-button button").attr("href", "").attr("title", shareAction).html(shareAction);
  },
  
  _createDomNode: function(id) {
      return $("<div>").attr('id', id).addClass("wb-document-list");
  },
  
  _hasAuthenticatedUserEditorRights: function(document) {
    return (jQuery.inArray(document.data.id.toString(), WebDoc.application.documentEditor.currentUserDocumentsEditor()) !== -1);
  }
});

