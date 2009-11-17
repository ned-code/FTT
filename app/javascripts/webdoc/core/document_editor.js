/**
 * WBEditor is the main function of the application. It define UB namespace.
 **/
//= require <mtools/undo_manager>
//= require <mtools/server_manager>
//= require <mtools/uuid>

//= require <webdoc/model/document>
//= require <webdoc/utils/document_date_filter>
//= require <webdoc/gui/document_list>
//= require <webdoc/controllers/document_access_controller>


// application singleton.
WebDoc.application = {};

WebDoc.DocumentEditor = $.klass(
{
    initialize: function()
    {
        this.documents = [];
        this.documentList = null;
        this.filter = undefined;
        WebDoc.application.documentEditor = this;
        WebDoc.application.undoManager = new MTools.UndoManager();
        WebDoc.application.accessController = new WebDoc.DocumentAccessController();
    },
    
    start: function()
    {
        ddd("Start Document editor");
        var that = this;
        $("#wb-create-document-button").bind("click", this.createDocument);
        $(".wb-document-edit").live("click", this.editDocument);
        $(".wb-document-rename").live("click", this.renameDocument);
        $(".wb-document-delete").live("click", this.deleteDocument);
        $(".wb-document-access").live("click", this.changeDocumentAccess);        
        
        this.filter = new WebDoc.DocumentDateFilter();
        this.documentList = new WebDoc.DocumentList("wb-document-list", this.filter);
        $("#wb-document-list-container").append(this.documentList.domNode.get(0));
        this.loadDocuments();
        
        // create new document dialog
        $("#wb-new-document-dialog").dialog(
        {
            bgiframe: true,
            autoOpen: false,
            height: 300,
            modal: true,
            buttons: 
            {
                Save: function()
                {
                    $(this).dialog('close');
                    var newDoc = new WebDoc.Document();
                    newDoc.setTitle($("#wb-new-document-name").val());
                    newDoc.save(function(newObject, status)
                    {
          						if (status == "OK") 
          						{
          							that.documents.push(newDoc);
          							that.filter.addDocument(newDoc);
          						}
                    });
                },
                Cancel: function()
                {
                    $(this).dialog('close');
                }
            }
        });
        
        // create edit document dialog
        $("#wb-edit-document-dialog").dialog(
        {
            bgiframe: true,
            autoOpen: false,
            height: 300,
            modal: true,
            buttons: 
            {
                Save: function()
                {
                    ddd("edit doc with title " + $("#wb-edit-document-name").val());
                    $(this).dialog('close');
                    that.editedDocument.setTitle($("#wb-edit-document-name").val());
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
      window.open("/documents/" + documentToEdit + "#1");
    },
    
    createDocument: function()
    {
        $("#wb-new-document-name").val(new Date().toLocaleDateString());
        $("#wb-new-document-creationDate").val(new Date());
        $("#wb-new-document-dialog").dialog('open');
    },
    
    renameDocument: function(e)
    {
        e.preventDefault();
        var that = WebDoc.application.documentEditor;
        var documentIdToRename = $(this).parent().parent().attr("id");
        that.editedDocument = that.documentWithId(documentIdToRename);
        var previousName = that.editedDocument.title();
        $("#wb-edit-document-name").val(previousName);
        $("#wb-edit-document-creationDate").val(that.editedDocument.creationDate());
        $("#wb-edit-document-dialog").dialog('open');
    },
    
    changeDocumentAccess: function(e)
    {
      e.preventDefault();
      ddd("change acess");
      var documentToEdit = $(this).parent().parent().attr("id");            
      WebDoc.application.accessController.showAccess(WebDoc.application.documentEditor.documentWithId(documentToEdit));      
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
    
    loadDocuments: function()
    {
        MTools.ServerManager.getObjects("/documents.json", WebDoc.Document, function(data)
        {
            this.documents = data;
            this.refreshDocumentList();
        }, this);
    },
    
    refreshDocumentList: function()
    {
        this.filter.setDocuments(this.documents);
        this.documentList.repaint();
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
    }
});
