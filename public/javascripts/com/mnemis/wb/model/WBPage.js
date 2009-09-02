
if (com.mnemis.core.Provide("com/mnemis/wb/model/WBPage.js"))
{
    com.mnemis.core.Import("com/mnemis/wb/model/WBItem.js")

    com.mnemis.wb.model.WBPage = $.inherit(
    {
        __constructor: function(pageBodyElement, pageId)
        {
            // Page can be created from json. In this case pageBodyElement is an Object.
            // Or it can be created from an existing DOM node and in this case pageBodyElement is a DOMElement.
            if (pageBodyElement.constructor == Object)
            {
                this.pageId = pageBodyElement.uuid;
                this.domNode = $('<div id="ub_board" style="position: absolute; top: 0px; left: 0px;z-index:-2000000">' +
                    '  <div id="ub_page_drawing" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%">' +
                    '  </div>' +
                    '  <div id="ub_page_objects" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%"/>' +
                    '  <div id="ub_event_catcher" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; z-index: 1999999"/>' +
                    '</div>');
                this.domNode.css(pageBodyElement.data.css);
                this.drawing = {
                    polygon: [],
                    polyline: []
                };
                this.objects = [];
                var that = this;
                $.each(pageBodyElement.page_objects, function(data)
                {
                    that.createOrUpdateItem(this);
                });
            }
            // page is created from a DOM Node (viewer use status page content)
            else
            {
                this.pageId = pageId;
                this.drawing = {
                    polygon: [],
                    polyline: []
                };
                this.objects = [];
                this.domNode = $(pageBodyElement);
                var documentContent = this.domNode.find("#ub_page_objects > *");
                var that = this;
                documentContent.each(function(i) {
                    that.objects.push(new com.mnemis.wb.model.WBItem(this));
                });

                if (jQuery.browser.msie) {
                    var documentDrawing = this.domNode.find("#ub_page_drawing").children().get(0);
                    var pageUrl = documentDrawing.getAttribute("data");
                    $(documentDrawing).remove();
                    $.get(pageUrl, null, function(data, textStatus) {
                        res = data.match(/<svg(.*\n.*)*<\/svg>/gm);
                        var svgElement = $(res[0]);

                        svgElement.each(function() {
                            if (this.nodeName.toLowerCase() == "polygon") {
                                var polygonObject =
                                {
                                    points: $(this).attr("points"),
                                    color: $(this).attr("fill"),
                                    opacity: $(this).attr("fill-opacity"),
                                    domNode: this
                                };
                                that.drawing.polygon.push(polygonObject);
                            }
                        });
                        WB.application.boardController.updateDrawing();
                    }, "html");
                }
            }
        },
        uuid : function()
        {
            return this.pageId;
        },

        clear : function()
        {
            this._clear();
            if (WB.application.boardController.collaborationController)
            {
                WB.application.boardController.collaborationController.clear(this);
            }
        },

        _clear : function()
        {
            var i = this.drawing.polyline.length -1;
            for (; i >= 0; i--)
            {
                var anObject = this.drawing.polyline[i];
                this.removeItem(anObject.data);
            }
        },

        removeItem : function(itemData)
        {
            if (itemData.tag == 'polyline' || itemData.tag == 'polygon')
            {
                var drawingObject = this.findDrawingWithUuid(itemData.uuid);
                drawingObject.domNode.animate({
                    opacity : 0
                }, 'fast', null, function() {
                    WB.application.boardController.drawingController.domNode.removeChild(this)
                });
                var index =this.drawing.polyline.indexOf(drawingObject);
                this.drawing.polyline.splice(index,1);
            }
            else
            {
                console.log("need implementation");
            }
        },

        createOrUpdateItem : function(itemData)
        {
            if (itemData.tag == 'polyline' || itemData.tag == 'polygon')
            {
                var newLine = WB.application.boardController.drawingController.mRenderer.createPolyline(itemData.uuid);
                $(newLine).css("opacity", 0);
                var newObject = new WB.model.WBItem(newLine);
                newObject.setPoints(itemData.points);
                this.drawing.polyline.push(newObject);
                WB.application.boardController.drawingController.domNode.appendChild(newLine);
                $(newLine).animate({
                    opacity : 1
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

        createItem : function(itemData)
        {
            var newItem = new com.mnemis.wb.model.WBItem(itemData);
            this.objects.push(newItem);
            this.domNode.find("#ub_page_objects").append(newItem.domNode);
        },

        findObjectWithUuid : function(pUuid)
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

        findDrawingWithUuid : function(pUuid)
        {
            var i = 0;
            for (; i < this.drawing.polyline.length; i++)
            {
                var anObject = this.drawing.polyline[i];
                if (anObject.data.uuid == pUuid)
                {
                    return anObject;
                }
            }
            for (; i < this.drawing.polygon.length; i++)
            {
                var anObject = this.drawing.polyline[i];
                if (anObject.data.uuid == pUuid)
                {
                    return anObject;
                }
            }
            return null;
        },

        findObjectAtPoint : function(point)
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

        drawingModel : function()
        {
            return this.drawing;
        }
    });
  
}