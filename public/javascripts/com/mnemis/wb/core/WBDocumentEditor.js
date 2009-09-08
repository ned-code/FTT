/**
 * WBEditor is the main function of the application. It define UB namespace.
**/
if (com.mnemis.core.Provide("com/mnemis/wb/core/WBDocumentEditor.js"))
{
    // import Webbyboard namespace in WB
    var WB = com.mnemis.wb;

    com.mnemis.core.Import("com/mnemis/core/UndoManager.js");
    com.mnemis.core.Import("com/mnemis/core/ServerManager.js");
    com.mnemis.core.Import("com/mnemis/core/UUID.js");
    com.mnemis.core.Import("com/mnemis/wb/model/WBDocument.js");
    com.mnemis.core.Import("com/mnemis/wb/gui/WBDocumentList.js");
    com.mnemis.core.Import("com/mnemis/wb/core/WBDocumentDateFilter.js");

    // application singleton.
    WB.application = {};

    com.mnemis.wb.core.WBDocumentEditor = $.inherit({

        documents: [],
        documentList: null,
        filter: undefined,
        __constructor: function()
        {
            WB.application.documentEditor = this;
            WB.application.serverManager = new com.mnemis.core.ServerManager();
            WB.application.undoManager = new com.mnemis.core.UndoManager();
        },

        start: function()
        {
             console.log("Start Document editor");
             var that = this;
             $("#wb-create-document-button").bind("click", this.createDocument);
             $(".wb-document-edit").live("click", this.editDocument);
             $(".wb-document-rename").live("click", this.renameDocument);
             $(".wb-document-delete").live("click", this.deleteDocument);

             this.filter = new WB.core.WBDocumentDateFilter();
             this.documentList = new WB.gui.WBDocumentList("wb-document-list", this.filter);
             $("#wb-document-list-container").append(this.documentList.domNode.get(0));
             this.loadDocuments();

             // create new document dialog
             $("#wb-new-document-dialog").dialog(
                {
                    bgiframe: true,
                    autoOpen: false,
                    height: 300,
                    modal: true,
                    buttons: {
                            Save: function() {
                                    $(this).dialog('close');
                                    var newDoc = new WB.model.WBDocument();
                                    newDoc.setTitle($("#wb-new-document-name").val());
                                    WB.application.serverManager.newObject("/documents", newDoc, function(persitedDoc)
                                    {
                                        that.documents.push(persitedDoc);
                                        that.filter.addDocument(persitedDoc);
                                    });
                            },
                            Cancel: function() {
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
                    buttons: {
                            Save: function() {
                                    console.log("edit doc with title " + $("#wb-edit-document-name").val());
                                    $(this).dialog('close');
                                    that.editedDocument.setTitle($("#wb-edit-document-name").val());
                                    WB.application.serverManager.updateObject("/documents/" + that.editedDocument.uuid(), that.editedDocument, function(persitedDoc)
                                    {
                                      that.filter.refreshDocument(that.editedDocument);
                                    });
                            },
                            Cancel: function() {
                                    $(this).dialog('close');
                            }
                    }
                });
        },

        editDocument: function()
        {
            var documentToEdit = $(this).parent().attr("id");
            window.open("/documents/" + documentToEdit);
        },
        
        createDocument: function()
        {
            $("#wb-new-document-name").val(new Date().toLocaleDateString());
            $("#wb-new-document-creationDate").val(new Date());
            $("#wb-new-document-dialog").dialog('open');
        },

        renameDocument: function()
        {
            var that = WB.application.documentEditor;
            var documentIdToRename = $(this).parent().attr("id");
            that.editedDocument = that.documentWithId(documentIdToRename);
            var previousName = that.editedDocument.title();
            $("#wb-edit-document-name").val(previousName);
            $("#wb-edit-document-creationDate").val(that.editedDocument.creationDate());
            $("#wb-edit-document-dialog").dialog('open');
        },

        deleteDocument: function()
        {
            var that = WB.application.documentEditor;
            var documentIdToDelete = $(this).parent().attr("id");
            that.editedDocument = that.documentWithId(documentIdToDelete);
            WB.application.serverManager.deleteObject("/documents/" + that.editedDocument.uuid(), that.editedDocument, function(persitedDoc)
            {
                that.filter.removeDocument(that.editedDocument);
            }, "json");
        },

        loadDocuments: function()
        {
            WB.application.serverManager.getObjects("/documents", WB.model.WBDocument, function(data){
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
}