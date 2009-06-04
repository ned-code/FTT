// check that mnemis FW has bveen loadad
if (!com.mnemis || !com.mnemis.core)
{
	alert("mnemis FW has not been loaded");
}

com.mnemis.core.Provide("com/mnemis/wb/model/WBPage.js");

com.mnemis.core.Import("com/mnemis/wb/model/WBItem.js")

if (!com.mnemis.wb.model) { com.mnemis.wb.model = {}};

com.mnemis.wb.model.WBPage = function(pageBodyElement)
{
	this.drawing = { polygon: [], polyline: []};
	this.objects = [];
	this.documentRootNode = pageBodyElement;
	var documentContent = $(this.documentRootNode).find("#ub_page_objects > *");
	var that = this;
	documentContent.each(function(i)
		{
			that.objects.push(new com.mnemis.wb.model.WBItem(this));
		}
	);

    documentDrawing = $(this.documentRootNode).find("#ub_page_drawing").children().children();
    documentDrawing.each(function()
        {
            var polygonObject = {
                points: $(this).attr("points"),
                domNode: this
            };
            that.drawing.polygon.push(polygonObject);
        }
    );
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