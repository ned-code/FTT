/**
 * WBEditor is the main function of the application. It define UB namespace.
 **/
//= require <mtools/application>
//= require <mtools/undo_manager>
//= require <mtools/server_manager>
//= require <mtools/uuid>

//= require <webdoc/model/document>
//= require <webdoc/model/category>
//= require <webdoc/utils/document_date_filter>
//= require <webdoc/gui/document_list>
//= require <webdoc/controllers/document_access_controller>
//= require <webdoc/controllers/document_categories_controller>
//= require <webdoc/controllers/document_share_controller>

// application singleton.
WebDoc.application = {};

(function($, undefined){

var newDocNameField,
    newDocDescriptionField,
    newDocCategoryField,
    newDocCustomSizeWidthField,
    newDocCustomSizeHeightField,
    editDocCustomSizeWidthField,
    editDocCustomSizeHeightField,
    editDocCategoryField;

WebDoc.DocumentEditor = $.klass(MTools.Application,
{
    initialize: function($super)
    {
        $super();
        this.documents = [];
        this.documentList = null;
        this.filter = undefined;
        this.currentListingPageId = 1;
        WebDoc.application.documentEditor = this;
        WebDoc.application.undoManager = new MTools.UndoManager();
        WebDoc.application.accessController = new WebDoc.DocumentCollaborationController();
        WebDoc.application.categoriesController = new WebDoc.DocumentCategoriesController();
        WebDoc.application.shareController = new WebDoc.DocumentShareController();
        WebDoc.application.categoriesController.addListener(this);
        newDocNameField = $("#wb-new-document-name");
        newDocDescriptionField = $("#wb-new-document-description");
        newDocCategoryField = $("#wb-new-document-category");
        newDocCustomSizeWidthField = $("#wb-new-document-size-custom-width");
        newDocCustomSizeHeightField = $("#wb-new-document-size-custom-height");
        editDocCustomSizeWidthField = $("#wb-edit-document-size-custom-width");
        editDocCustomSizeHeightField = $("#wb-edit-document-size-custom-height");
        editDocCategoryField = $("#wb-edit-document-category");
    },
    
    start: function()
    {
        ddd("Start Document editor");
        var that = this;
        $("#wb-create-document-button").bind("click", this.createDocument.pBind(this));
        $(".wb-document-edit").live("click", this.editDocument);
        $(".wb-document-info").live("click", this.renameDocument);
        $(".wb-document-delete").live("click", this.deleteDocument);
        $(".wb-document-collaborate").live("click", this.changeDocumentAccess);
        $(".wb-document-share").live("click", this.shareDocument); 
        $(".wb-document-unshare").live("click", this.unshareDocument); 
        $("#wb-document-filter-date").bind("click", {document_filter: null}, this.loadDocumentsWithFilter.pBind(this));
        $("#wb-document-filter-owned-by-me").bind("click", {document_filter: 'creator'}, this.loadDocumentsWithFilter.pBind(this));
        $("#wb-document-filter-editor-rights").bind("click", {document_filter: 'editor'}, this.loadDocumentsWithFilter.pBind(this));
        $("#wb-document-filter-shared-with-me").bind("click", {document_filter: 'reader'}, this.loadDocumentsWithFilter.pBind(this));
        $("#wb-document-filter-public").bind("click", {document_filter: 'public'}, this.loadDocumentsWithFilter.pBind(this));
        newDocCustomSizeWidthField.bind("keypress", this.validateInteger);
        newDocCustomSizeHeightField.bind("keypress", this.validateInteger);
        $("#wb-edit-document-size-custom-width").bind("keypress", this.validateInteger);
        $("#wb-edit-document-size-custom-height").bind("keypress", this.validateInteger);
        
        this.filter = new WebDoc.DocumentDateFilter();
        this.documentList = new WebDoc.DocumentList("wb-document-list", this.filter);
        $("#wb-document-list-container").append(this.documentList.domNode.get(0));
        
        // Default selection, documents owned by me
        this.loadDocumentsWithFilter({document_filter: 'creator'});
        
        //this.newDocumentDialog = $("#wb-new-document-dialog");
        this.newDocumentDialog = $("#wb-new-form");
        this.newDocumentDialog
        .remove()
        .css({ display: '' });
        
        // create new document dialog
        //$("#wb-new-document-dialog").dialog(
        //{
        //    bgiframe: true,
        //    autoOpen: false,
        //    width: 450,
        //    height: 350,
        //    modal: true,
        //    buttons: 
        //    {
        //        Save: function()
        //        {
        //            $(this).dialog('close');
        //            
        //            var newDoc = new WebDoc.Document();
        //            newDoc.setTitle(newDocNameField.val(), true);
        //            newDoc.setDescription(newDocDescriptionField.val(), true);
        //            newDoc.setCategory(newDocCategoryField.val(), true)
        //            var documentSizeChoice = $("input[@name='wb-new-document-size']:checked", $('#wb-new-form')).val();
        //            newDoc.setSize(that.getSizeFromChoice(documentSizeChoice, newDocCustomSizeWidthField.val(), newDocCustomSizeHeightField.val()), true);
        //            newDoc.save(function(newObject, status)
        //            {
        //              if (status == "OK") 
        //              {
        //                that.documents.push(newDoc);
        //                that.filter.addDocument(newDoc);
        //                document.location = "/documents/" + newDoc.uuid() + "#1";
        //              }
        //            });
        //        },
        //        Cancel: function()
        //        {
        //            $(this).dialog('close');
        //        }
        //    }
        //});
        
        // create edit document dialog
        $("#wb-edit-document-dialog").dialog(
        {
            bgiframe: true,
            autoOpen: false,
            width: 450,
            height: 350,
            modal: true,
            buttons: 
            {
                Save: function()
                {
                    ddd("edit doc with title " + $("#wb-edit-document-name").val());
                    $(this).dialog('close');
                    that.editedDocument.setTitle($("#wb-edit-document-name").val(), true);
                    that.editedDocument.setDescription($("#wb-edit-document-description").val(), true);
                    that.editedDocument.setCategory(editDocCategoryField.val(), true);
                    var documentSizeChoice = $("input[@name='wb-edit-document-size']:checked", $('#wb-edit-form')).val();
                    that.editedDocument.setSize(that.getSizeFromChoice(documentSizeChoice, editDocCustomSizeWidthField.val(), editDocCustomSizeHeightField.val()), true);
                    that.editedDocument.save(function(persitedDoc)
                    {
                        that.filter.refreshDocument(persitedDoc);
                    });                    
                },
                Cancel: function()
                {
                    $(this).dialog('close');
                }
            }
        });
    },
    
    editDocument: function(e)
    {
      e.preventDefault();
      var documentToEdit = $(this).parent().parent().attr("id");
      document.location = "/documents/" + documentToEdit + "#1";
    },
    
    createDocument: function(e)
    {
        var that = this;
        
        newDocNameField.val("My webdoc");
        newDocDescriptionField.val("");
        this.newDocumentDialog.find("#wb-new-document-size-classic")[0].checked = true;
        
        // this.newDocumentDialog.dialog('open');
        this.newDocumentDialog.pop({
            attachTo: $( e.currentTarget ),
            initCallback: function(){
                var node = $(this);
                
                node
                .bind('submit', function() {
                    node.addClass('loading');
                    
                    var newDoc = new WebDoc.Document();
                    newDoc.setTitle(newDocNameField.val(), true);
                    newDoc.setDescription(newDocDescriptionField.val(), true);
                    newDoc.setCategory(newDocCategoryField.val(), true);

                    var documentSizeChoice = $("input[name='wb-new-document-size']:checked", this).val();
                    newDoc.setSize(that.getSizeFromChoice(documentSizeChoice, newDocCustomSizeWidthField.val(), newDocCustomSizeHeightField.val()), true);
                    newDoc.save(function(newObject, status) {
                      if (status == "OK") 
                      {
                        node
                        .removeClass('loading')
                        .trigger('close');
                        
                        that.documents.push(newDoc);
                        that.filter.addDocument(newDoc);
                        document.location = "/documents/" + newDoc.uuid() + "#1";
                      }
                    });
                    
                    return false;
                })
                .find("input[type='text']")
                .eq(0)
                .focus()
                .select();
            }
        });
    },
    
    renameDocument: function(e)
    {
        e.preventDefault();
        var that = WebDoc.application.documentEditor;
        var documentIdToRename = $(this).parent().parent().attr("id");
        that.editedDocument = that.documentWithId(documentIdToRename);
        var previousName = that.editedDocument.title();
        $("#wb-edit-document-name").val(previousName);
        $("#wb-edit-document-description").val(that.editedDocument.description());
        
        editDocCategoryField.val(that.editedDocument.category());
        editDocCustomSizeWidthField.val("");
        editDocCustomSizeHeightField.val("");
        if(that.editedDocument.data.size) {
          if(that.editedDocument.data.size.width === "620" && that.editedDocument.data.size.height === "480") {
            // iPhone
            $("#wb-edit-document-size-iPhone")[0].checked = true;
          }
          else if(that.editedDocument.data.size.width === "800" && that.editedDocument.data.size.height === "600") {
            // Classic
            $("#wb-edit-document-size-classic")[0].checked = true;
          }
          else if(that.editedDocument.data.size.width === "1024" && that.editedDocument.data.size.height === "768") {
            // iPad
            $("#wb-edit-document-size-iPad")[0].checked = true;
          }
          else {
            // custom
            $("#wb-edit-document-size-custom")[0].checked = true;
            editDocCustomSizeWidthField.val(that.editedDocument.data.size.width);
            editDocCustomSizeHeightField.val(that.editedDocument.data.size.height);
          }
        }
        else {
          // Classic
          $("#wb-edit-document-size-classic")[0].checked = true;
        }
        $("#wb-edit-document-dialog").dialog('open');
    },
    
    changeDocumentAccess: function(e)
    {
      e.preventDefault();
      ddd("change acess");
      var documentToEdit = $(this).parent().parent().attr("id");            
      WebDoc.application.accessController.showAccess(WebDoc.application.documentEditor.documentWithId(documentToEdit));      
    },
    
    shareDocument: function(e)
    {
      e.preventDefault();
      ddd("must publish document"); 
      var documentIdToPublish = $(this).parent().parent().attr("id");
      var document = WebDoc.application.documentEditor.documentWithId(documentIdToPublish);
      WebDoc.application.shareController.showShare(document);            
    },
    
    unshareDocument: function(e)
    {
      e.preventDefault();
      ddd("must unshare document"); 
      var documentIdToPublish = $(this).parent().parent().attr("id");
      var document = WebDoc.application.documentEditor.documentWithId(documentIdToPublish);
      WebDoc.application.shareController.showShare(document);  
    },
    
    deleteDocument: function(e)
    {
      e.preventDefault();
      var that = WebDoc.application.documentEditor;
      var documentIdToDelete = $(this).parent().parent().attr("id");
      that.editedDocument = that.documentWithId(documentIdToDelete);
      var choice = confirm("Are you sure you want to delete document " + that.editedDocument.title());
      if (choice) {
        that.editedDocument.destroy(function(persitedDoc)
        {
            that.filter.removeDocument(that.editedDocument);
        });
      }
    },
        
    incrementPageId: function(pageIncrement) {
      this.currentListingPageId += pageIncrement;
      if (this.currentListingPageId < 1) { this.currentListingPageId = 1; }
    },

    loadDocumentsWithFilter: function(event)
    {
        if(event && event.data){
           this.documentFilter = event.data.document_filter;
        }
        else{
           this.documentFilter = event.document_filter;
        }
        this.currentListingPageId = 1;
        this.updateCurrentFilterSelection(event);
        this.loadDocuments(0);
    },
    
    loadDocuments: function(pageIncrement) {
      this.currentListingPageId += pageIncrement;
      if (this.currentListingPageId < 1) { this.currentListingPageId = 1; }
      
      MTools.ServerManager.getRecords(WebDoc.Document, null, function(data)
      {
        this.documents = data.documents;
        this.refreshDocumentList(data.pagination);
      }.pBind(this), this.createAjaxParams());
    },
    
    createAjaxParams: function() {
      return (this.documentFilter !== null)? { ajaxParams: { document_filter: this.documentFilter, page: this.currentListingPageId }} :  { ajaxParams: { page:this.currentListingPageId }};
    },
    
    refreshDocumentList: function(pagination)
    {
        this.filter.setDocuments(this.documents);
        this.documentList.repaint();
        this.documentList.repaintPagination(pagination);
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

    updateCurrentFilterSelection: function(event)
    {
      if(event && event.currentTarget){
        $(".state-tabs").removeClass('active');
        $(event.currentTarget).addClass('active');
      }
    },
    
    // Will be notified by the categories controller once its content is loaded
    categoriesLoaded: function()
    {
      var categories = WebDoc.application.categoriesController.documentCategories;
      $.each(categories, function(i, webDocCategory) {
        newDocCategoryField.append($('<option>').attr("value", webDocCategory.data.id).html(webDocCategory.data.name));
        editDocCategoryField.append($('<option>').attr("value", webDocCategory.data.id).html(webDocCategory.data.name));
      });
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
    }
});

})(jQuery);