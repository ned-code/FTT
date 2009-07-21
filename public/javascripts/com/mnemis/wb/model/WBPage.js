
com.mnemis.core.Provide("com/mnemis/wb/model/WBPage.js");

com.mnemis.core.Import("com/mnemis/wb/model/WBItem.js")

if (!com.mnemis.wb.model) { com.mnemis.wb.model = {}};

com.mnemis.wb.model.WBPage = function(pageBodyElement) {
    this.drawing = { polygon: [], polyline: [] };
    this.objects = [];
    this.documentRootNode = pageBodyElement;
    var documentContent = $(this.documentRootNode).find("#ub_page_objects > *");
    var that = this;
    documentContent.each(function(i) {
        that.objects.push(new com.mnemis.wb.model.WBItem(this));
    });

    if (jQuery.browser.msie) {
        var documentDrawing = $(this.documentRootNode).find("#ub_page_drawing").children().get(0);
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
com.mnemis.wb.model.WBPage.prototype.uuid = function()
{
    return "page1";
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