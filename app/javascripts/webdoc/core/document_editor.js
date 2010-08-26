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

WebDoc.DocumentEditor = $.klass(WebDoc.Application,
{
  initialize: function($super)
  {
    var categories;
    $super();

    this.documentListContainerNode = $("#wb-document-list-container");

    this.documents = [];
    this.documentList = null;
    this.queryDomNode = $("input#wb-documents-search");
    this.filter = undefined;
    this.currentListingPageId = 1;
    this._creatingDoc = false;
    this._currentUserDocumentsEditor = [];
    this._currentUserDocumentsReader = [];
    
    WebDoc.application.documentEditor = this;
    WebDoc.application.undoManager = new WebDoc.UndoManager();
    WebDoc.application.accessController = new WebDoc.DocumentCollaborationController();
    WebDoc.application.invitationsController = new WebDoc.InvitationsController();
    WebDoc.application.shareController = new WebDoc.DocumentShareController();

    infoDialogNode = $("#create_webdoc_form");
    infoDialogHeaderNode = $("#new-document-dialog-header");
    infoDialogTitleNode = $("#wb-new-document-name");
    infoDialogDescriptionNode = $("#wb-new-document-description");
    infoDialogCategoryNode = $("#wb-new-document-category");
    infoDialogWidthNode = $("#wb-new-document-size-width");
    infoDialogHeightNode = $("#wb-new-document-size-height");
    infoDialogSubmitNode = infoDialogNode.find("input[type='submit']");
    
    this.popupNode= jQuery('#popup');
    this.popupSendInvitationsNode = this.popupNode.find('#popup_invitations');
    this.popupShareNode = this.popupNode.find('#popup_share');
    this.popupCollaborateNode = this.popupNode.find('#popup_collaborate');
    this.popupCreateEditNode = this.popupNode.find('#popup_createeditwebdoc');

    // reset document back url (used to close a document)
    jQuery.cookie('document_back_url', null, { path: '/' });
  },

  start: function() {
    ddd("Start Document editor");
    var that = this;
    WebDoc.Application.initializeSingletons([WebDoc.DocumentCategoriesManager], function() {
      var categories = WebDoc.DocumentCategoriesManager.getInstance().getAllCategories();
      $.each(categories, function(i, webDocCategory) {
        infoDialogCategoryNode.append($('<option>').attr("value", webDocCategory.uuid()).html(webDocCategory.data.name));
      });

      //$("#wb-create-document-button").bind("click", this.createDocument.pBind(this));
      
      //this.createDocument();
      
      this.documentListContainerNode
      .addClass( 'loading' )
      .delegate( ".wb-document-info", 'click', this.renameDocument.pBind(this) )
      .delegate( ".wb-document-delete", 'click', this.deleteDocument )
      .delegate( ".wb-document-collaborate", 'click', this.changeDocumentAccess.pBind(this) )
      .delegate( ".wb-document-share", 'click', this.shareDocument.pBind(this) );

      $('body')
      .delegate( "a[href='#filter-author']",  'click', this.searchDocuments.pBind(this) )
      .delegate( "a[href='#filter-editable']",'click', this.searchDocuments.pBind(this) )
      .delegate( "a[href='#invite_people']",'click', this.showInvitationsForm.pBind(this) )
      .delegate( "a[href='#popup_newwebdoc']",'click', this.createDocument.pBind(this) );

      this.queryDomNode.bind('keypress', function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if(code == 13) {
          this.searchDocuments();
        }
      }.pBind(this));
      
      this.popupNode.delegate("a[href=#close]", 'click', this.closePopup.pBind(this));
      
      this.filter = new WebDoc.DocumentDateFilter();

      this.documentList = new WebDoc.DocumentList("wb-document-list", this.filter);
      this.documentListContainerNode
      .append( this.documentList.domNode );
      this._getCurrentUserRolesDocuments();
      
      //infoDialogNode
      //.remove()
      //.css({ display: '' });
    
    }.pBind(this));
  },

  createDocument: function(e) {
    var that = this,
    		node = infoDialogNode;

    infoDialogHeaderNode.html("Create new webdoc");
    infoDialogTitleNode.val("Untitled webdoc");
    infoDialogDescriptionNode.val("");
    infoDialogWidthNode.val("600px");
    infoDialogHeightNode.val("400px");
    infoDialogSubmitNode.val("Create");

    infoDialogNode.delegate("a.set_size", 'click', this.setSizeByName.pBind(this) );

    //infoDialogNode.pop({
    //  attachTo: $( e.currentTarget ),
    //  initCallback: function(){
    //    var node = $(this);
        node
        .bind('submit', function() {
          if (!that._creatingDoc) {
            node.validate({
              pass: function() {
                //it pass the validation, but we have to look if the height and width value are positive
                if(parseFloat(infoDialogWidthNode.val()) <= 0 || parseFloat(infoDialogHeightNode.val()) <= 0){
                  return false;
                }
                
                node.addClass('loading');
                var newDoc = new WebDoc.Document();
                if (window._gaq) {
                  _gaq.push(['_trackEvent', 'webdoc_create', 'webdoc_create', newDoc.uuid()]);
                } 
                newDoc.setTitle( infoDialogTitleNode.val(), true );
                newDoc.setDescription( infoDialogDescriptionNode.val(), true);
                newDoc.setCategory( infoDialogCategoryNode.val(), true);
		
                newDoc.setSize( { width: infoDialogWidthNode.val(), height: infoDialogHeightNode.val() }, true);
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
		
              },
              fail: function() {}
            });
          }
          return false;
        });
        this.popupCreateEditNode.removeTransitionClass('lb');
    		e.preventDefault();
    //    .find("input[type='text']")
    //    .eq(0)
    //    .focus()
    //    .select();
    //  }
    //});
  },

  renameDocument: function(e) {
  /*	var data = jQuery(e.target).data("webdoc"),
        documentToEdit = data && data.id;
        editedDocument = that.documentWithId(documentIdToRename),
        previousName = editedDocument.title(),
        previousDescription = editedDocument.description(),
        previousCategory = editedDocument.category(),
        previousWidth = editedDocument.size().width,
        previousHeight = editedDocument.size().height;
        */
        
    var that = WebDoc.application.documentEditor,
        data = jQuery(e.target).data("webdoc"),
        documentIdToRename = data && data.id,
        editedDocument = that.documentWithId(documentIdToRename),
        previousName = editedDocument.title(),
        previousDescription = editedDocument.description(),
        previousCategory = editedDocument.category(),
        previousWidth = editedDocument.size().width,
        previousHeight = editedDocument.size().height;

    that.editedDocument = editedDocument;
    
    infoDialogNode.delegate("a.set_size", 'click', that.setSizeByName.pBind(this) );
    
    infoDialogHeaderNode.html("Edit webdoc info");
    infoDialogTitleNode.val( previousName );
    infoDialogDescriptionNode.val( previousDescription );
    infoDialogCategoryNode.val( previousCategory );
    infoDialogWidthNode.val(previousWidth);
    infoDialogHeightNode.val(previousHeight);
    infoDialogSubmitNode.val("Update");

	this.popupCreateEditNode.removeTransitionClass('lb');
    e.preventDefault();
    
   			node = infoDialogNode;
        node
        .bind('submit', function() {
            node.addClass('loading');

            ddd("edit doc with title " + $("#wb-edit-document-name").val());
            
   					infoDialogNode.closest("li").addTransitionClass('lb');
            that.editedDocument.setTitle( infoDialogTitleNode.val(), true );
            that.editedDocument.setDescription( infoDialogDescriptionNode.val(), true );
            that.editedDocument.setCategory( infoDialogCategoryNode.val(), true );
            that.editedDocument.setSize( {width:  infoDialogWidthNode.val(), height: infoDialogHeightNode.val()}, true );
            
            that.editedDocument.save(function(persitedDoc){
                node
                .removeClass('loading')
                .trigger({type: 'close'});

                that.filter.refreshDocument(persitedDoc);
            });

            return false;
        });
    

  },

  changeDocumentAccess: function(e) {
    ddd("change access");
    var data = jQuery(e.target).data("webdoc"),
        documentToEdit = data && data.id;

    WebDoc.application.accessController.showAccess( e, WebDoc.application.documentEditor.documentWithId(documentToEdit) );
    this.popupCollaborateNode.removeTransitionClass('lb');
    e.preventDefault();
  },

  shareDocument: function(e) {
    ddd("must publish document");
    var data = jQuery(e.target).data('webdoc'),
        documentIdToPublish = data && data.id,
        document = WebDoc.application.documentEditor.documentWithId(documentIdToPublish);
    WebDoc.application.shareController.showShare(e, document);
    this.popupShareNode.removeTransitionClass('lb');
    e.preventDefault();
  },

  deleteDocument: function(e) {
    var that = WebDoc.application.documentEditor,
        data = $(this).data("webdoc"),
        documentIdToDelete = data && data.id;

    that.editedDocument = that.documentWithId(documentIdToDelete);

    var choice = confirm("Are you sure you want to delete the webdoc:\n\n" + that.editedDocument.title());

    if (choice) {
      that.filter.removeDocument( that.editedDocument );
      that.editedDocument.destroy( function(persitedDoc){} );
    }

    e.preventDefault();
  },

  incrementPageId: function(pageIncrement) {
    this.currentListingPageId += pageIncrement;
    if (this.currentListingPageId < 1) { this.currentListingPageId = 1; }
  },

  loadDocumentsFromTab: function(e) {

  },

  searchDocuments: function(e) {
    if(e) {
      var node = $( e.currentTarget );
      if ( node.hasClass("state-filter-tab") ) {
        jQuery(".state-filter-tab").removeClass('current');
        node.addClass('current');
      }  
    }

    this.currentListingPageId = 1;
    this.loadDocuments(0);
  },

  loadDocuments: function(pageIncrement) {
    ddd('[document_editor] loadDocuments');
    this.currentListingPageId += pageIncrement;
    if (this.currentListingPageId < 1) { this.currentListingPageId = 1; }

    WebDoc.ServerManager.getRecords(WebDoc.Document, null, function(data) {
      this.documents = data.documents;
      this.refreshDocumentList(data.pagination);
    }.pBind(this), this.createAjaxParams());
  },

  createAjaxParams: function() {
    var tabSelected = $('.state-filter-tab.current');
    return { ajaxParams: { document_filter: tabSelected.attr('data-webdoc-documents-filter-type'), query: this.queryDomNode.val(), page: this.currentListingPageId }};
  },

  refreshDocumentList: function(pagination)
  {
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

  setSizeByName: function(e) {
    var name = e.target.attributes['data-webdoc-size-name'].value;
    ddd('set size for '+name);
    var size = undefined;
    switch(name){
      case "6000x400":
        size = { width: "6000", height: "400"};
        break;
      case "400x6000":
        size = { width: "400", height: "6000"};
        break;
      case "600x400":
      default:
        size = { width: "600", height: "400"};
    }
    var allSizeNode = jQuery(".set_size");
    allSizeNode.each(function() {
    	jQuery(this).removeClass('selected_friend');
    });
    var friendNode = jQuery(e.target);
      friendNode.addClass('selected_friend');

    infoDialogWidthNode.val(size.width+"px");
    infoDialogHeightNode.val(size.height+"px");
     e.preventDefault();
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
  },
  
  showInvitationsForm: function(e){
    e.preventDefault();
    WebDoc.application.invitationsController.init();
    this.popupSendInvitationsNode.removeTransitionClass('lb');
  },
  
  closePopup: function(e){
    var openPopup = this.popupNode.find('li.popup');
    openPopup.addClass('lb');
    e.preventDefault();
  }
});

})(jQuery);