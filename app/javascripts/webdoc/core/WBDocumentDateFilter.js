/**
 * WBEditor is the main function of the application. It define UB namespace.
**/
if (com.mnemis.core.Provide("com/mnemis/wb/core/WBDocumentDateFilter.js"))
{
    com.mnemis.wb.core.WBDocumentDateFilter = $.inherit({

        todayDocuments: [],
        previousDocuments: [],
        __constructor: function()
        {
        },

        setDocuments: function(documents)
        {
            this.todayDocuments = [];
            this.previousDocuments = [];
            for (var i = documents.length-1; i >= 0; i--)
            {
                var aDocument = documents[i];
                this.addDocument(aDocument);
            }
        },

        refreshDocument: function(modifiedDocument)
        {
            var previousIndex = this.removeDocument(modifiedDocument);
            this.addDocument(modifiedDocument, previousIndex);
        },
        
        addDocument: function(newDocument, previousIndex)
        {
            var documentDate = newDocument.creationDate();
            var currentDate = new Date();
            var section = 0;
            if (currentDate.getUTCDate() == documentDate.getUTCDate() &&
                currentDate.getUTCMonth() == documentDate.getUTCMonth() &&
                currentDate.getUTCFullYear() == documentDate.getUTCFullYear())
            {
                var index = previousIndex;
                if (!index)
                {
                    index = 0;
                }
                this.todayDocuments.splice(index, 0, newDocument);
            }
            else
            {
                section = 1;
                var index = previousIndex;
                if (!index)
                {
                    index = 0;
                }                
                this.previousDocuments.splice(index, 0, newDocument);
            }

            // notify
            this.view.refreshNewDocument(section, index, newDocument);
        },

        removeDocument: function(document)
        {
            // remove document from correct array
            var index = $.inArray(document, this.todayDocuments);
            if (index > -1)
            {
                this.todayDocuments.splice(index, 1);
            }
            else
            {
                index = $.inArray(document, this.previousDocuments);
                if (index > -1)
                {
                    this.previousDocuments.splice(index, 1);
                }
            }
            if (index > -1)
                this.view.removeDocument(document.uuid());

            return index;
        },
        
        // document list datasource
        nbSections: function()
        {
            return 2;
        },

        section: function(index)
        {
            return index? "Earlier this month" : "Today";
        },

        nbDocuments: function(sectionIndex)
        {
            return sectionIndex? this.previousDocuments.length : this.todayDocuments.length;
        },

        document: function(sectionIndex, index)
        {
            return sectionIndex? this.previousDocuments[index] : this.todayDocuments[index];
        }
        
    });
}