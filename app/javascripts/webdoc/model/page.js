
//= require <mtools/record>
//= require <webdoc/model/item>

WebDoc.Page = $.klass(MTools.Record, 
{
    initialize: function($super, json)
    {
        this.domNode = $('<div>').attr(
        {
            id: "board",
            style: "position: absolute; top: 0px; left: 0px;z-index:-2000000"
        });
        this.domNode.append($('<div>').attr(
        {
            id: "page_drawing",
            style: "position: absolute; top: 0px; left: 0px; width: 100%; height: 100%"
        }));
        this.domNode.append($('<div>').attr(
        {
            id: "items",
            style: "position: absolute; top: 0px; left: 0px; width: 100%; height: 100%"
        }));
        this.domNode.append($('<div>').attr(
        {
            id: "event-catcher",
            style: "position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; z-index: 999999"
        }));
        this.drawing = 
        {
            polylines: []
        };
        $super(json);
        if (!json) 
        {
            this.data.created_at = new Date().toISO8601String();
            this.data.uuid = new MTools.UUID().toString();
        }
    },
    
    className: function()
    {
        return "page";
    },
    
    rootUrl: function()
    {
        return "/documents/" + this.data.document_id;
    },
    
    refresh: function($super, json)
    {
        console.log("refresh page");
        $super(json);
		console.log("update dom");
        this.domNode.css(this.data.data.css);
        var that = this;
		if (this.data.items && $.isArray(this.data.items)) 
		{
			$.each(this.data.items, function()
			{
				that.createOrUpdateItem(this.data());
			});
		}
    },
    
    previousPageId: function()
    {
        return null;
    },
    
    nextPageId: function()
    {
        return null;
    },
    
    
    clear: function()
    {
        this._clear();
        if (WebDoc.application.boardController.collaborationController) 
        {
            WebDoc.application.boardController.collaborationController.clear(this);
        }
    },
    
    _clear: function()
    {
        var i = this.drawing.polylines.length - 1;
        for (; i >= 0; i--) 
        {
            var anObject = this.drawing.polylines[i];
            this._removeItem(anObject.data);
        }
    },
    
    _removeItem: function(itemData)
    {
        if (itemData.tag == 'polyline' || itemData.tag == 'polygon') 
        {
            var drawingObject = this.findDrawingWithUuid(itemData.uuid());
            drawingObject.domNode.animate(
            {
                opacity: 0
            }, 'fast', null, function()
            {
                WebDoc.application.boardController.drawingController.domNode.removeChild(this)
            });
            var index = this.drawing.polylines.indexOf(drawingObject);
            this.drawing.polylines.splice(index, 1);
        }
        else 
        {
            console.log("need implementation");
        }
    },
    
    createOrUpdateItem: function(itemData)
    {
        if (itemData.tag == 'polyline' || itemData.tag == 'polygon') 
        {
            var newLine = WebDoc.application.boardController.drawingController.mRenderer.createPolyline(itemData.uuid);
            $(newLine).css("opacity", 0);
            var newObject = new WebDoc.Item(newLine);
            newObject.setPoints(itemData.points);
            this.drawing.polylines.push(newObject);
            WebDoc.application.boardController.drawingController.domNode.appendChild(newLine);
            $(newLine).animate(
            {
                opacity: 1
            }, 'fast');
        }
        else 
        {
            var item = this.findObjectWithUuid(itemData.uuid);
            if (!item) 
            {
                this.createItem(itemData);
            }
            else 
            {
                item.update(itemData);
            }
        }
    },
    
    createItem: function(itemData)
    {
        var newItem = new WebDoc.Item(itemData);
        this.objects.push(newItem);
        this.domNode.find("#page_objects").append(newItem.domNode);
    },
    
    findObjectWithUuid: function(pUuid)
    {
        var i = 0;
        for (; i < this.objects.length; i++) 
        {
            var anObject = this.objects[i];
            if (anObject.uuid == pUuid) 
            {
                return anObject;
            }
        }
        return null;
    },
    
    findDrawingWithUuid: function(pUuid)
    {
        var i = 0;
        for (; i < this.drawing.polylines.length; i++) 
        {
            var anObject = this.drawing.polylines[i];
            if (anObject.data.uuid == pUuid) 
            {
                return anObject;
            }
        }
        for (; i < this.drawing.polygon.length; i++) 
        {
            var anObject = this.drawing.polylines[i];
            if (anObject.data.uuid == pUuid) 
            {
                return anObject;
            }
        }
        return null;
    },
    
    findObjectAtPoint: function(point)
    {
        var i = 0;
        for (; i < this.objects.length; i++) 
        {
            var anObject = this.objects[i];
            if (anObject.coverPoint(point) && !anObject.isBackground) 
            {
                return anObject;
            }
        }
        return null;
    },
    
    drawingModel: function()
    {
        return this.drawing;
    }
});
