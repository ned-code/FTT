/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

//= require <webdoc/model/page>
//= require <webdoc/model/item>

WebDoc.CollaborationController = $.klass(
{
    initialize: function(page)
    
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
    disconnect: function()
    {
        if (Orbited) 
        {
            this.stomp.disconnect();
        }
    },
    
    clear: function(page)
    {
        ddd("send clear to server");
        var data = 
        {
            uuid: page.uuid()
        };
        this.sendRequest(data, 'clear');
    },
    
    addItem: function(item)
    {
        ddd("send add to server");
        this.moveItem(item);
    },
    
    removeItem: function(item)
    {
        ddd("send remove to server");
        var itemData = item.getData();
        var data = 
        {
            uuid: itemData.uuid,
            tag: itemData.tag
        };
        this.sendRequest(data, 'remove');
    },
    
    moveItem: function(item)
    {
        ddd("send move to server");
        var data = item.getData();
        this.sendRequest(data, 'overwrite');
    },
    
    sendRequest: function(data, action)
    {
        $.ajax(
        {
            url: "/documents/" + WebDoc.application.viewer.currentDocument + "/pages/" + WebDoc.application.viewer.currentPageId + "/update",
            global: false,
            type: "POST",
            data: (
            {
                ubChannel: this.page.uuid(),
                ubData: $.toJSON(data),
                ubAction: action,
                ubApplicationId: WebDoc.application.viewer.applicationUuid
            }),
            dataType: "html",
            success: function(msg)
            {
                ddd("success " + msg);
            },
            error: function(msg)
            {
                ddd("error " + msg);
            }
        });
    },
    
    onopen: function()
    {
    },
    
    onclose: function(code)
    {
        ddd("connection closed: " + code);
    },
    
    onerror: function(error)
    {
        ddd("connection error: " + error);
    },
    
    onerrorframe: function(frame)
    {
        ddd("onerrorframe: " + frame.body);
    },
    onconnectedframe: function()
    {
        ddd("Connected to collaboration server");
        WebDoc.application.boardController.collaborationController.stomp.subscribe(WebDoc.application.boardController.collaborationController.page.uuid(), 
        {
            exchange: ''
        });
    },
    
    onmessageframe: function(frame)
    {
        ddd("recieve message" + frame.body);
        var message = $.evalJSON(frame.body);
        if (message.ubApplicationId != WebDoc.application.viewer.applicationUuid) 
        {
            if (message.action == 'overwrite') 
            {
                WebDoc.application.boardController.collaborationController.page.createOrUpdateItem(message.ubData);
            }
            else 
                if (message.action == 'remove') 
                {
                    WebDoc.application.boardController.collaborationController.page._removeItem(message.ubData);
                }
                else 
                    if (message.action == 'clear') 
                    {
                        WebDoc.application.boardController.collaborationController.page._clear();
                    }
        }
    }
});
