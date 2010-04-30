/**
 * WBEditor is the main function of the application. It define UB namespace.
 **/

// application singleton.
WebDoc.application = {};

(function($, undefined){

var infoDialogNode,
    infoDialogHeaderNode,
    infoDialogTitleNode,
    infoDialogDescriptionNode,
    infoDialogCategoryNode,
    infoDialogWidthNode,
    infoDialogHeightNode,
    infoDialogSubmitNode;

WebDoc.DocumentEditor = $.klass(MTools.Application,
{
    initialize: function($super)
    {
        $super();
        
        this.documentListContainerNode = $("#wb-document-list-container");
        
        this.documents = [];
        this.documentList = null;
        this.filter = undefined;
        this.currentListingPageId = 1;
        this._creatingDoc = false;
        this._currentUserDocumentsEditor = [];
        this._currentUserDocumentsReader = [];        
        WebDoc.application.documentEditor = this;
        WebDoc.application.undoManager = new MTools.UndoManager();
        WebDoc.application.accessController = new WebDoc.DocumentCollaborationController();
        WebDoc.application.categoriesManager = new WebDoc.DocumentCategoriesManager();
        WebDoc.application.categoriesManager.getAllCategories(function(categories){
          $.each(categories, function(i, webDocCategory) {
            infoDialogCategoryNode.append($('<option>').attr("value", webDocCategory.data.id).html(webDocCategory.data.name));
          });
        }.pBind(this));
        
        WebDoc.application.shareController = new WebDoc.DocumentShareController();
        
        infoDialogNode = $("#wb-new-form");
        infoDialogHeaderNode = $("#new-document-dialog-header");
        infoDialogTitleNode = $("#wb-new-document-name");
        infoDialogDescriptionNode = $("#wb-new-document-description");
        infoDialogCategoryNode = $("#wb-new-document-category");
        infoDialogWidthNode = $("#wb-new-document-size-custom-width");
        infoDialogHeightNode = $("#wb-new-document-size-custom-height");
        infoDialogSubmitNode = infoDialogNode.find("input[type='submit']");
    },
    
    start: function()
    {
        ddd("Start Document editor");
        var that = this;
        $("#wb-create-document-button").bind("click", this.createDocument.pBind(this));
        this.documentListContainerNode
        .addClass( 'loading' )
        .delegate( ".wb-document-info", 'click', this.renameDocument )
        .delegate( ".wb-document-delete", 'click', this.deleteDocument )
        .delegate( ".wb-document-collaborate", 'click', this.changeDocumentAccess )
        .delegate( ".wb-document-share", 'click', this.shareDocument )
        .delegate( ".wb-document-unshare", 'click', this.unshareDocument );
        
        $('body')
        .delegate( "a[href='#filter-by-date']", 'click', { filter: null }, this.filterByDate.pBind(this) )
        .delegate( "a[href='#filter-author']",  'click', { filter: 'creator' }, this.loadDocumentsWithFilter.pBind(this) )
        .delegate( "a[href='#filter-editable']",'click', { filter: 'editor' }, this.loadDocumentsWithFilter.pBind(this) )
        .delegate( "a[href='#filter-shared']",  'click', { filter: 'reader' }, this.loadDocumentsWithFilter.pBind(this) )
        .delegate( "a[href='#filter-public']",  'click', { filter: 'public' }, this.filterByPublic.pBind(this) );
        
        infoDialogWidthNode.bind("keypress", this.validateInteger);
        infoDialogHeightNode.bind("keypress", this.validateInteger);
        
        $("#wb-edit-document-size-custom-width").bind("keypress", this.validateInteger);
        $("#wb-edit-document-size-custom-height").bind("keypress", this.validateInteger);
        
        this.filter = new WebDoc.DocumentDateFilter();
        
        this.documentList = new WebDoc.DocumentList("wb-document-list", this.filter);
        this.documentListContainerNode
        .append( this.documentList.domNode );
        this._getCurrentUserRolesDocuments();
        infoDialogNode
        .remove()
        .css({ display: '' });
    },
    
    filterByDate: function(e){
      $('body').removeClass("state-public");
      $('.state-filter-subtab').removeClass("current");
      this.loadDocumentsWithFilter(e);
      e.preventDefault();
    },
    
    filterByPublic: function(e){
      $('body').addClass("state-public");
      this.loadDocumentsWithFilter(e);
      e.preventDefault();
    },
    
    createDocument: function(e) {
        var that = this;
        
        infoDialogHeaderNode.html("Create new webdoc");
        infoDialogTitleNode.val("Untitled webdoc");
        infoDialogDescriptionNode.val("");
        infoDialogSubmitNode.val("Create");
        
        infoDialogNode.find("#wb-new-document-size-classic")[0].checked = true;
        
        infoDialogNode.pop({
            attachTo: $( e.currentTarget ),
            initCallback: function(){
                var node = $(this);
                
                node
                .bind('submit', function() {
                    if (!that._creatingDoc) {
                      node.addClass('loading');
                      
                      var newDoc = new WebDoc.Document(),
                          documentSizeChoice = $("input[name='wb-new-document-size']:checked", this).val();
                      
                      newDoc.setTitle( infoDialogTitleNode.val(), true );
                      newDoc.setDescription( infoDialogDescriptionNode.val(), true);
                      newDoc.setCategory( infoDialogCategoryNode.val(), true);
                      
                      newDoc.setSize( that.getSizeFromChoice( documentSizeChoice, infoDialogWidthNode.val(), infoDialogHeightNode.val() ), true);
                      that._creatingDoc = true;
                      newDoc.save(function(newObject, status) {
                        if (status == "OK") 
                        {
                          node
                          .removeClass('loading')
                          .trigger('close');
                          
                          that.documents.push(newDoc);
                          that.filter.addDocument(newDoc);
                          document.location = "/documents/" + newDoc.uuid() + "?edit=true#1";
                        }
                        that._creatingDoc = false;                        
                      });
                    }
                  return false;
                })
                .find("input[type='text']")
                .eq(0)
                .focus()
                .select();
            }
        });
    },
    
    renameDocument: function(e) {
        var that = WebDoc.application.documentEditor,
            data = $(this).closest('.document-item').data("webdoc"),
            documentIdToRename = data && data.id,
            editedDocument = that.documentWithId(documentIdToRename),
            previousName = editedDocument.title(),
            previousDescription = editedDocument.description(),
            previousCategory = editedDocument.category();
        
        that.editedDocument = editedDocument;
        
        infoDialogHeaderNode.html("Edit webdoc info");
        infoDialogTitleNode.val( previousName );
        infoDialogDescriptionNode.val( previousDescription );
        infoDialogCategoryNode.val( previousCategory );
        infoDialogWidthNode.val("");
        infoDialogHeightNode.val("");
        infoDialogSubmitNode.val("Update");
        
        // Get current document size
        
        //if(that.editedDocument.data.size) {
        //  if(that.editedDocument.data.size.width === "620" && that.editedDocument.data.size.height === "480") {
        //    // iPhone
        //    $("#wb-edit-document-size-iPhone")[0].checked = true;
        //  }
        //  else if(that.editedDocument.data.size.width === "800" && that.editedDocument.data.size.height === "600") {
        //    // Classic
        //    $("#wb-edit-document-size-classic")[0].checked = true;
        //  }
        //  else if(that.editedDocument.data.size.width === "1024" && that.editedDocument.data.size.height === "768") {
        //    // iPad
        //    $("#wb-edit-document-size-iPad")[0].checked = true;
        //  }
        //  else {
        //    // custom
        //    $("#wb-edit-document-size-custom")[0].checked = true;
        //    infoDialogWidthNode.val(that.editedDocument.data.size.width);
        //    infoDialogHeightNode.val(that.editedDocument.data.size.height);
        //  }
        //}
        //else {
        //  // Classic
        //  $("#wb-edit-document-size-classic")[0].checked = true;
        //}
        
        infoDialogNode.pop({
            attachTo: $( e.currentTarget ),
            initCallback: function(){
                var node = $(this);
                
                node
                .bind('submit', function() {
                    node.addClass('loading');
                    
                    ddd("edit doc with title " + $("#wb-edit-document-name").val());
                    $(this).dialog('close');
                    that.editedDocument.setTitle( infoDialogTitleNode.val(), true );
                    that.editedDocument.setDescription( infoDialogDescriptionNode.val(), true );
                    that.editedDocument.setCategory( infoDialogCategoryNode.val(), true );
                    //var documentSizeChoice = $("input[@name='wb-edit-document-size']:checked", $('#wb-edit-form')).val();
                    //that.editedDocument.setSize(that.getSizeFromChoice(documentSizeChoice, infoDialogWidthNode.val(), infoDialogHeightNode.val()), true);
                    
                    that.editedDocument.save(function(persitedDoc){
                        node
                        .removeClass('loading')
                        .trigger({type: 'close'});
                        
                        that.filter.refreshDocument(persitedDoc);
                    });
                    
                    return false;
                })
                .find("input[type='text']")
                .eq(0)
                .focus()
                .select();
            }
        });
        
        e.preventDefault();
    },
    
    changeDocumentAccess: function(e) {
      ddd("change acess");
      var data = $(this).data("webdoc"),
          documentToEdit = data && data.id;
      
      WebDoc.application.accessController.showAccess( e, WebDoc.application.documentEditor.documentWithId(documentToEdit) );
      e.preventDefault();
    },
    
    shareDocument: function(e) {
      ddd("must publish document"); 
      var data = $(this).data('webdoc'),
          documentIdToPublish = data && data.id,
          document = WebDoc.application.documentEditor.documentWithId(documentIdToPublish);
      
      WebDoc.application.shareController.showShare(e, document);            
      
      e.preventDefault();
    },
    
    unshareDocument: function(e) {
      ddd("must unshare document"); 
      var data = $(this).data('webdoc'),
          documentIdToPublish = data && data.id,
          document = WebDoc.application.documentEditor.documentWithId(documentIdToPublish);
      
      WebDoc.application.shareController.showShare(e, document);  
      
      e.preventDefault();
    },
    
    deleteDocument: function(e) {
      var that = WebDoc.application.documentEditor,
          data = $(this).data("webdoc"),
          documentIdToDelete = data && data.id;
      
      that.editedDocument = that.documentWithId(documentIdToDelete);
      
      var choice = confirm("Are you sure you want to delete the webdoc:\n\n" + that.editedDocument.title());
      
      if (choice) {
        that.editedDocument.destroy( function(persitedDoc){
          that.filter.removeDocument( that.editedDocument );
        });
      }
      
      e.preventDefault();
    },
        
    incrementPageId: function(pageIncrement) {
      this.currentListingPageId += pageIncrement;
      if (this.currentListingPageId < 1) { this.currentListingPageId = 1; }
    },
    
    loadDocumentsFromTab: function(e) {
      
    },
    
    loadDocumentsWithFilter: function(e) {
        var node = $( e.currentTarget );
        
        this.documentFilter = e.data.filter;
        
        if ( node.hasClass("state-filter-tab") ) {
          this._updateCurrentTab( node );
        }
        else {
          this._updateCurrentSubTab( node );
        }
        
        this.currentListingPageId = 1;
        this.loadDocuments(0);
    },
    
    loadDocuments: function(pageIncrement) {
      ddd('[document_editor] loadDocuments');
      this.currentListingPageId += pageIncrement;
      if (this.currentListingPageId < 1) { this.currentListingPageId = 1; }
      
      MTools.ServerManager.getRecords(WebDoc.Document, null, function(data) {
        this.documents = data.documents;
        this.refreshDocumentList(data.pagination);
      }.pBind(this), this.createAjaxParams());
    },
    
    createAjaxParams: function() {
      return (this.documentFilter !== null)? { ajaxParams: { document_filter: this.documentFilter, page: this.currentListingPageId }} :  { ajaxParams: { page:this.currentListingPageId }};
    },
    
    refreshDocumentList: function(pagination)
    {
        ddd('[document_editor] refreshDocumentList');
        this.filter.setDocuments(this.documents);
        this.documentList.repaint();
        this.documentList.repaintPagination(pagination);
        this.documentListContainerNode.removeClass( 'loading' );
    },
        
    documentWithId: function(id)
    {
        for (var i = 0; i < this.documents.length; i++) 
        {
            aDocument = this.documents[i];
            if (aDocument.uuid() == id) 
            {
                return aDocument;
            }
        }
        return null;
    },

    _updateCurrentTab: function( node ) {
      ddd('[document_editor] _updateCurrentTab');
      
      if ( !this.tabs ) { this.tabs = jQuery(".state-filter-tab"); }
      this.tabs.removeClass('current');
      node.addClass('current');
    },
    
    _updateCurrentSubTab: function( node ) {
      ddd('[document_editor] _updateCurrentTab');
      
      if ( !this.subtabs ) { this.subtabs = jQuery(".state-filter-subtab"); }
      this.subtabs.removeClass('current');
      node.addClass('current');
    },
    
    validateInteger: function(evt) {
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
        return false;
      }
      return true;
    },
    
    getSizeFromChoice: function(choice, customFieldWidth, customFieldHeight) {
      switch(choice){
        case "custom":
          return { width: customFieldWidth, height: customFieldHeight};
        case "iPhone":
          return { width: "620", height: "480"};
        case "iPad":
          return { width: "1024", height: "768"};
        case "classic":
        default:
          return { width: "800", height: "600"};
      }
    },
    
    currentUserDocumentsEditor: function() {
      return this._currentUserDocumentsEditor;
    },
    
    currentUserDocumentsReader: function() {
      return this._currentUserDocumentsReader;
    },
    
    _getCurrentUserRolesDocuments: function() {
      $.ajax({
        url: "/roles/documents",
        type: 'GET',
        dataType: 'json',              
        success: function(data, textStatus) {
          if (data.editor) {
            this._currentUserDocumentsEditor = data.editor;
          }
          if (data.reader) {
            this._currentUserDocumentsReader = data.reader;
          }
          // Default selection, documents owned by me
          $("#wb-document-filter-owned-by-me").click();
        }.pBind(this)
      });
    }    
});

})(jQuery);