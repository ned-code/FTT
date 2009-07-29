
com.mnemis.core.Provide("com/mnemis/wb/model/WBPage.js");

com.mnemis.core.Import("com/mnemis/wb/model/WBItem.js")

if (!com.mnemis.wb.model) { com.mnemis.wb.model = {}};

com.mnemis.wb.model.WBPage = function(pageBodyElement, pageId) {

    // Page can be created from json. In this case pageBodyElement is an Object.
    // Or it can be created from an existing DOM node and in this case pageBodyElement is a DOMElement.
    if (pageBodyElement.constructor == Object)
    {
           this.pageId = pageBodyElement.uuid;
           this.domNode = $('<div id="ub_board" style="position: absolute; top: 0px; left: 0px;z-index:-2000000">' +
                                    '  <div id="ub_page_drawing" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%">' +
                                    '     <div style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; z-index: 1999999"/>' +
                                    '  </div>' +
                                    '  <div id="ub_page_objects" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%">' +
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
}

com.mnemis.wb.model.WBPage.prototype.uuid = function()
{
    return this.pageId;
}

com.mnemis.wb.model.WBPage.prototype.createOrUpdateItem = function(itemData)
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
        });
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
}

com.mnemis.wb.model.WBPage.prototype.createItem = function(itemData)
{
    var newItem = new com.mnemis.wb.model.WBItem(itemData);
    this.objects.push(newItem);
    this.domNode.find("#ub_page_objects").append(newItem.domNode);
}

com.mnemis.wb.model.WBPage.prototype.findObjectWithUuid = function(pUuid)
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
}

com.mnemis.wb.model.WBPage.prototype.findObjectAtPoint = function(point)
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
}

com.mnemis.wb.model.WBPage.prototype.drawingModel = function()
{
    return this.drawing;
}