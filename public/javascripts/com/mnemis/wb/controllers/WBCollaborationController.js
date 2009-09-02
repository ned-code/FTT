/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

if (com.mnemis.core.Provide("com/mnemis/wb/controllers/WBCollaborationController.js"))
{

    com.mnemis.wb.controllers.WBCollaborationController = $.inherit(
    {
        __constructor: function(page)

        {
            this.page = page;
            if (Orbited)
            {
                // init Stomp
                this.stomp = new STOMPClient();
                this.stomp.onopen = this.onopen;
                this.stomp.onclose = this.onclose;
                this.stomp.onerror = this.onerror;
                this.stomp.onerrorframe = this.onerrorframe;
                this.stomp.onconnectedframe = this.onconnectedframe;
                this.stomp.onmessageframe = this.onmessageframe;
                this.stomp.connect(document.domain, 61613, 'UNIQUE_ID_PER_CLIENT', '');
            }
        },
        disconnect : function()
        {
            if (Orbited)
            {
                this.stomp.disconnect();
            }
        },

        clear : function(page)
        {
            console.log("send clear to server");
            var data = {
                uuid : page.uuid()
            };
            this.sendRequest(data, 'clear');
        },

        addItem : function(item)
        {
            console.log("send add to server");
            this.moveItem(item);
        },

        removeItem : function(item)
        {
            console.log("send remove to server");
            var itemData = item.getData();
            var data = {
                uuid : itemData.uuid,
                tag : itemData.tag
            };
            this.sendRequest(data, 'remove');
        },

        moveItem : function(item)
        {
            console.log("send move to server");
            var data = item.getData();
            this.sendRequest(data, 'overwrite');
        },

        sendRequest : function(data, action)
        {
            $.ajax({
                url: "/documents/" + WB.application.viewer.currentDocument + "/pages/" + WB.application.viewer.currentPageId + "/update",
                global: false,
                type: "POST",
                data: ({
                    ubChannel : this.page.uuid(),
                    ubData : $.toJSON(data),
                    ubAction : action,
                    ubApplicationId : WB.application.viewer.applicationUuid
                }),
                dataType: "html",
                success: function(msg){
                    console.log("success " +msg);
                },
                error: function(msg)
                {
                    console.log("error " +msg);
                }
            });
        },

        onopen : function() {
        },

        onclose : function(code) {
            console.log("connection closed: " + code);
        },

        onerror : function(error) {
            console.log("connection error: " + error);
        },

        onerrorframe : function(frame) {
            console.log("onerrorframe: " + frame.body);
        },
        onconnectedframe : function() {
            console.log("Connected to collaboration server");
            WB.application.boardController.collaborationController.stomp.subscribe(WB.application.boardController.collaborationController.page.uuid() , {
                exchange:''
            });
        },

        onmessageframe : function(frame) {
            console.log("recieve message" + frame.body);
            var message = $.evalJSON(frame.body);
            if (message.ubApplicationId != WB.application.viewer.applicationUuid)
            {
                if (message.action == 'overwrite')
                {
                    WB.application.boardController.collaborationController.page.createOrUpdateItem(message.ubData);
                }
                else if (message.action == 'remove')
                {
                    WB.application.boardController.collaborationController.page.removeItem(message.ubData);
                }
                else if (message.action == 'clear')
                {
                    WB.application.boardController.collaborationController.page._clear();
                }
            }
        }
    });
}