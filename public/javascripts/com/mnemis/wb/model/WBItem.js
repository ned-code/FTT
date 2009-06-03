// check that mnemis FW has bveen loadad
if (!com.mnemis || !com.mnemis.core)
{
	alert("mnemis FW has not been loaded");
}

com.mnemis.core.Provide("com/mnemis/wb/model/WBItem.js");

if (!com.mnemis.wb.model) { com.mnemis.wb.model = {}};

com.mnemis.wb.model.WBItem = function(rootElement)
{
	this.domNode = rootElement;
	var domWrapper = $(this.domNode);
	this.position = domWrapper.position();

	// in ff 3.5 width and height of object are always 0. In this case we take the value from the style directly
	if (domWrapper.width() == 0)
	{
		console.log(domWrapper.css("width"));
		this.size = { width:domWrapper.css("width").replace("px", ""), height:domWrapper.css("height").replace("px", "")};
	}
	else
	{
		this.size = { width:domWrapper.width(), height:domWrapper.height()};
	}
	this.uuid = domWrapper.attr("id");
}

com.mnemis.wb.model.WBItem.prototype.type = function()
{
	if (this.domNode.tagName == "object")
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
	$(this.domNode).addClass("WBSelected");
    if (!$(this.domNode).attr("ub:zIndex"))
    {
        $(this.domNode).attr("ub:zIndex", $(this.domNode).css("zIndex"));
    }
    $(this.domNode).css("zIndex", 20000);
    // TODO should not use constant
    this.shift(-15, -15);
    this.size.height += 15;
    this.size.width += 15;
}

com.mnemis.wb.model.WBItem.prototype.unSelect = function()
{
	$(this.domNode).removeClass("WBSelected");
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
	if (this.position.left < point.x && this.position.left + this.size.width > point.x)
	{
		if (this.position.top < point.y && this.position.top + this.size.height > point.y)
		{
			return true;
		}
	}
	return false;
}