
com.mnemis.core.Provide("com/mnemis/wb/model/WBItem.js");

com.mnemis.wb.model.WBItem = function(rootElement)
{
	this.domNode = rootElement;
	var domWrapper = $(this.domNode);
	this.position = { top:  parseFloat(domWrapper.css("top").replace("px", "")), left: parseFloat(domWrapper.css("left").replace("px", ""))};
	this.size = { width:parseFloat(domWrapper.css("width").replace("px", "")), height: parseFloat(domWrapper.css("height").replace("px", ""))};
	this.uuid = domWrapper.attr("id");
    this.isBackground = domWrapper.attr("ub:background") && (domWrapper.attr("ub:background") == "true");
}

com.mnemis.wb.model.WBItem.prototype.type = function()
{
	if (this.domNode.tagName == "object" && ($(this.domNode).attr("type") == "text/html" || $(this.domNode).attr("type") == "application/x-shockwave-flash"))
	{
 		return "widget";
	}	
	else
	{
		return "objet";
	}
}

com.mnemis.wb.model.WBItem.prototype.select = function()
{
    $(this.domNode).addClass("wb-selected-object");
    if (!$(this.domNode).attr("ub:zIndex"))
    {
        $(this.domNode).attr("ub:zIndex", $(this.domNode).css("zIndex"));
    }
    if (this.type() == "widget")
    {
        $(this.domNode).css("zIndex", 2000000);
        if ($(this.domNode).attr("type") == "application/x-shockwave-flash")
            {
                var player = document.getElementById(this.domNode.id);
                player.sendEvent('PLAY');
            }
    }
    // TODO should not use constant
    this.shift(-15, -15);
    this.size.height += 15;
    this.size.width += 15;
}

com.mnemis.wb.model.WBItem.prototype.unSelect = function()
{
	$(this.domNode).removeClass("wb-selected-object");
    $(this.domNode).css("zIndex", $(this.domNode).attr("ub:zIndex"));
    this.shift(15, 15);
    this.size.height -= 15;
    this.size.width -= 15;
}
		    
com.mnemis.wb.model.WBItem.prototype.moveTo = function(newPosition)
{
	this.position.left = newPosition.left;
	this.position.top = newPosition.top;
	$(this.domNode).css("left", this.position.left);
	$(this.domNode).css("top", this.position.top);
}

com.mnemis.wb.model.WBItem.prototype.shift = function(x, y)
{
	this.position.left = this.position.left + x;
	this.position.top = this.position.top + y;
	$(this.domNode).css("left", this.position.left);
	$(this.domNode).css("top", this.position.top);
}

com.mnemis.wb.model.WBItem.prototype.coverPoint = function(point)
{
        var pointMatrix = $M([[point.x - this.position.left], [point.y - this.position.top],[1]]);
        var mat_str =  $(this.domNode).css("-moz-transform");
        console.log(mat_str)
        var converted_point = {};
        converted_point.x = point.x;
        converted_point.y = point.y;
        if (mat_str && mat_str != "" && mat_str.indexOf("matrix") >= 0)
        {
            var matrixPointsString = mat_str.substr(mat_str.indexOf("(")+1, mat_str.length-(mat_str.indexOf("(")+2));
            var matrixPoints = matrixPointsString.split(", ");
            var matrix = $M([[matrixPoints[0], matrixPoints[2], matrixPoints[4].replace("px", "")],
                [matrixPoints[1], matrixPoints[3], matrixPoints[5].replace("px", "")],
                [0, 0, 1]]);

            var convertedPointMatrix = matrix.inv().x(pointMatrix);

            converted_point.x = convertedPointMatrix.elements[0][0] + this.position.left;
            converted_point.y = convertedPointMatrix.elements[1][0] + this.position.top;
        }
	if (this.position.left < converted_point.x && this.position.left + this.size.width > converted_point.x)
	{
		if (this.position.top < converted_point.y && this.position.top + this.size.height > converted_point.y)
		{
			return true;
		}
	}
	return false;
}