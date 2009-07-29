
com.mnemis.core.Provide("com/mnemis/wb/model/WBItem.js");

com.mnemis.wb.model.WBItem = function(rootElement)
{
    // WBItem can ve created from json data or from an existing DOM node.
    // when created from json rootElement is an Object when created from DOM node rootElement is a DOMElement
    if (rootElement.constructor == Object)
    {
        this.data = rootElement;
        this.domNode = $("<"+rootElement.tag+"/>");
        this.domNode.css({
            position: "absolute"
        })
        for (var key in rootElement)
        {
            if (key == 'css') this.domNode.css(rootElement.css);
            else if (key == 'uuid')  this.uuid = rootElement.uuid;
            else if (key == 'ubItemType') this.itemType = rootElement[key];
            else if (key == 'innerHtml') this.domNode.html(rootElement[key]);
            else if (key != 'tag')
            {
                this.domNode.attr(key, rootElement[key]);
            }
        }
        // internal size and position are top, left width and height as float. Because in the css those values are string with px unit
        // and we need float values to marix transform.
        this.recomputeInternalSizeAndPosition();
    }
    // create item from existing DOM node
    else
    {
        this.domNode = $(rootElement);
        this.data = {};
        this.data.uuid = this.domNode.attr("id");
        this.data.tag = this.domNode.get(0).tagName;

        // drawing objects don't have size and position'
        if (this.type != "drawing")
        {
            this.position = {
                top:  parseFloat(this.domNode.css("top").replace("px", "")),
                left: parseFloat(this.domNode.css("left").replace("px", ""))
            };
            this.size = {
                width:parseFloat(this.domNode.css("width").replace("px", "")),
                height: parseFloat(this.domNode.css("height").replace("px", ""))
            };
        }
        else
        {
            this.data.points = this.domNode.attr("points");
        }
    }
}

com.mnemis.wb.model.WBItem.prototype.setPoints = function(points)
{
    this.data.points = points;
    WB.application.boardController.drawingController.mRenderer.updatePolyline(this.domNode,{
        points : points
    });
}

com.mnemis.wb.model.WBItem.prototype.recomputeInternalSizeAndPosition = function()
{
    this.position = {
        top:  parseFloat(this.data.css.top.replace("px", "")),
        left: parseFloat(this.data.css.left.replace("px", ""))
    };
    this.size = {
        width:parseFloat(this.data.css.width.replace("px", "")),
        height: parseFloat(this.data.css.height.replace("px", ""))
    };
}

com.mnemis.wb.model.WBItem.prototype.update = function(itemData)
{
    this.data = itemData;
    this.recomputeInternalSizeAndPosition();
    this.domNode.animate(itemData.css);
}

com.mnemis.wb.model.WBItem.prototype.getData = function()
{
    return this.data;
}

com.mnemis.wb.model.WBItem.prototype.type = function()
{
    if (this.data.ubItemType)
        return this.data.ubItemType;
    if (this.domNode.get(0).tagName == "object" && (this.domNode.attr("type") == "text/html" || this.domNode.attr("type") == "application/x-shockwave-flash"))
    {
        return "widget";
    }
    else if (this.domNode.get(0).tagName == "polyline" || this.domNode.get(0).tagName == "polygon")
    {
        return "drawing";
    }
    else
    {
        return "objet";
    }
}

com.mnemis.wb.model.WBItem.prototype.select = function()
{
    this.domNode.addClass("wb-selected-object");
    if (!this.domNode.attr("ub:zIndex"))
    {
        this.domNode.attr("ub:zIndex", this.domNode.css("zIndex"));
    }
    if (this.type() == "widget")
    {
        this.domNode.css("zIndex", 2000000);
        if (this.domNode.attr("type") == "application/x-shockwave-flash")
        {
            console.log(this.domNode.id);
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
    this.domNode.removeClass("wb-selected-object");
    this.domNode.css("zIndex", this.domNode.attr("ub:zIndex"));
    this.shift(15, 15);
    this.size.height -= 15;
    this.size.width -= 15;
}
		    
com.mnemis.wb.model.WBItem.prototype.moveTo = function(newPosition)
{
    this.position.left = newPosition.left;
    this.position.top = newPosition.top;
    this.data.css.left = this.position.left + "px";
    this.data.css.top = this.position.top + "px";
    this.domNode.animate(this.data.css);
}

com.mnemis.wb.model.WBItem.prototype.endOfMove = function()
{
    if (WB.application.boardController.collaborationController)
    {
        console.log("WBItem delegate to collaboration controller");
        WB.application.boardController.collaborationController.moveItem(this);
    }
}

com.mnemis.wb.model.WBItem.prototype.shift = function(x, y)
{
    this.position.left = this.position.left + x;
    this.position.top = this.position.top + y;
    this.data.css.left = this.position.left + "px";
    this.data.css.top = this.position.top + "px";
    this.domNode.css(this.data.css);
}

com.mnemis.wb.model.WBItem.prototype.coverPoint = function(point)
{
    if (this.type() != 'application/vnd.mnemis-uniboard-drawing')
    {
        var pointMatrix = $M([[point.x - this.position.left], [point.y - this.position.top],[1]]);
        var mat_str =  this.domNode.css("-moz-transform");
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
    }
    return false;
}