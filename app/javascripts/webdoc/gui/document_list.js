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
  
  refreshDocument: function(document) {
    var documentLine = this.map[ document.uuid() ];
    var newDocumentLine = this._buildDocumentItemNode(document);
    documentLine.domNode.replaceWith(newDocumentLine);
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
          
          // Oh, and we better truncate all the document titles
          $('.document-title').truncate();
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
        editor = this._hasAuthenticatedUserEditorRights( document ),
        data = {
          webdoc: {
            id: id
          }
        },
        documentNode = $("<li/>", {
          "class": "document-item " +( editor && "document-item-editable" )+ " clear card",
          data: data
        }),
        documentThumb = $("<a/>", {
          "class": "document-title wb-document-edit thumb",
          "href": '/documents/'+id,
          "title": "Open '" + $.string().escapeHTML(document.title()) + "'",
          "style": "background-image: url('/images/icon_no_thumb_page_640x480.png');",
          data: data,
          //html: $.string().escapeHTML(document.title())
        });
        documentTitle = $("<a/>", {
          "class": "document-title wb-document-edit card_document_title",
          "href": '/documents/'+id,
          "title": "Open '" + $.string().escapeHTML(document.title()) + "'",
          data: data,
          html: $.string().escapeHTML(document.title())
        });
        
        documentInfos = '<ul class="index horizontal card_stats"><li class="views">'+data.views_count+'</li></ul>';
        
        /* thumb: document.pages.first.thumbnail.url */
      
    documentNode.append( documentThumb );      
    documentNode.append( documentTitle );
        documentNode.append( documentInfos );

    if ( editor ) {
      documentNode
      .append( this._buildDocumentControlsNode( document, data ) )
      .append( this._buildDocumentActionsNode( document, data ) );
    }
    
    this.map[ id ] = {
      domNode: documentNode
    };
    
    return documentNode;
  },
  
  _buildDocumentControlsNode: function( document, data ) {
    var documentControlsNode = $("<ul/>", {
          "class": "document-controls index"
        }),
        deleteItemNode = $("<li/>"),
        deleteNode = $("<a/>", {
          "class": "wb-document-delete delete-button button small red",
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
          "class": "document-actions index horizontal card_buttons"
        }),
        infoItemNode = $("<li/>"),
        infoNode = $("<a/>", {
          "class": "wb-document-info sec-action info-button button small",
          href: "",
          title: "info",
          html: "info",
          data: data
        }),
        collaborateItemNode = $("<li/>"),
        collaborateNode = $("<a/>", {
          "class": "wb-document-collaborate sec-action collaborate-button button small",
          href: "#popup-collaborate",
          title: "Invite other people to help you edit your webdoc",
          html: "invite co-editors",
          data: data
        }),
        shareItemNode = $("<li/>"),
        shareNode = ( document.isShared() ) ?
          $("<a/>", {
            "class": "wb-document-unshare sec-action unshare-button button small",
            href: "#unshare",
            title: "Share your webdoc with the world - or just your friends",
            html: "sharing",
            data: data
          }) :     
          $("<a/>", {
            "class": "wb-document-share sec-action share-button button small",
            href: "#popup-share",
            title: "Share your webdoc with the world - or just your friends",
            html: "sharing",
            data: data
          })
        ;
    
    // Construct DOM tree and return it
    return documentActionsNode
    .html(
      infoItemNode.html(
        infoNode
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
    return $('<a>').addClass("wb-document-" + shareAction + " sec-action "+shareAction+"-button button").attr("href", "").attr("title", shareAction).html(shareAction);
  },
  
  _createDomNode: function(id) {
      var docList = $('<div/>', {'class': 'wb-document-list'});
      return docList;
  },
  
  _hasAuthenticatedUserEditorRights: function(document) {
    return (jQuery.inArray(document.uuid(), WebDoc.application.documentEditor.currentUserDocumentsEditor()) !== -1);
  }
});

