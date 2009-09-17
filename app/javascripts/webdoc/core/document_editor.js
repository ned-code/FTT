/**
 * WBEditor is the main function of the application. It define UB namespace.
 **/

//= require <MTools/undo_manager>
//= require <MTools/server_manager>
//= require <MTools/uuid>

//= require <WebDoc/model/document>
//= require <WebDoc/utils/document_date_filter>
//= require <WebDoc/gui/document_list>


// application singleton.
WebDoc.application = {};

WebDoc.DocumentEditor = $.klass(
{
    documents: [],
    documentList: null,
    filter: undefined,
    initialize: function()
    {
        WebDoc.application.documentEditor = this;
        WebDoc.application.serverManager = new MTools.ServerManager();
        WebDoc.application.undoManager = new MTools.UndoManager();
    },
    
    start: function()
    {
        console.log("Start Document editor");
        var that = this;
        $("#wb-create-document-button").bind("click", this.createDocument);
        $(".wb-document-edit").live("click", this.editDocument);
        $(".wb-document-rename").live("click", this.renameDocument);
        $(".wb-document-delete").live("click", this.deleteDocument);
        
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
                    WebDoc.application.serverManager.newObject("/documents", newDoc, function(persitedDoc)
                    {
                        that.documents.push(persitedDoc);
                        that.filter.addDocument(persitedDoc);
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
                    console.log("edit doc with title " + $("#wb-edit-document-name").val());
                    $(this).dialog('close');
                    that.editedDocument.setTitle($("#wb-edit-document-name").val());
                    WebDoc.application.serverManager.updateObject("/documents/" + that.editedDocument.uuid(), that.editedDocument, function(persitedDoc)
                    {
                        that.filter.refreshDocument(that.editedDocument);
                    });
                },
                Cancel: function()
                {
                    $(this).dialog('close');
                }
            }
        });
    },
    
    editDocument: function()
    {
        var documentToEdit = $(this).parent().attr("id");
        window.open("/documents/" + documentToEdit + "#1");
    },
    
    createDocument: function()
    {
        $("#wb-new-document-name").val(new Date().toLocaleDateString());
        $("#wb-new-document-creationDate").val(new Date());
        $("#wb-new-document-dialog").dialog('open');
    },
    
    renameDocument: function()
    {
        var that = WebDoc.application.documentEditor;
        var documentIdToRename = $(this).parent().attr("id");
        that.editedDocument = that.documentWithId(documentIdToRename);
        var previousName = that.editedDocument.title();
        $("#wb-edit-document-name").val(previousName);
        $("#wb-edit-document-creationDate").val(that.editedDocument.creationDate());
        $("#wb-edit-document-dialog").dialog('open');
    },
    
    deleteDocument: function()
    {
        var that = WebDoc.application.documentEditor;
        var documentIdToDelete = $(this).parent().attr("id");
        that.editedDocument = that.documentWithId(documentIdToDelete);
        WebDoc.application.serverManager.deleteObject("/documents/" + that.editedDocument.uuid(), that.editedDocument, function(persitedDoc)
        {
            that.filter.removeDocument(that.editedDocument);
        }, "json");
    },
    
    loadDocuments: function()
    {
        WebDoc.application.serverManager.getObjects("/documents", WebDoc.Document, function(data)
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
