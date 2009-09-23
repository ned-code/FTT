
//= require <mtools/record>

WebDoc.Item = $.klass(MTools.Record, 
{
    initialize: function($super, json)
    {
        $super(json);
        if (json) 
        {
            this.domNode = $("<" + this.data.data.tag + "/>");
            this.domNode.css(
            {
                position: "absolute"
            })
            for (var key in this.data.data) 
            {
                if (key == 'css') 
                    this.domNode.css(this.data.data.css);
                else 
                    if (key == 'uuid') 
                        // just ignore uuid
                        ;
                    else 
                        if (key == 'ubItemType') 
                            this.itemType = this.data.data[key];
                        else 
                            if (key == 'innerHtml') 
                                this.domNode.html(this.data.data[key]);
                            else 
                                if (key != 'tag') 
                                {
                                    this.domNode.attr(key, this.data.data[key]);
                                }
            }
            // internal size and position are top, left width and height as float. Because in the css those values are string with px unit
            // and we need float values to marix transform.
            this.recomputeInternalSizeAndPosition();
        }
        else 
        {
            this.data.data = {};
        }
    },
    
    className: function()
    {
        return "item";
    },
    
    rootUrl: function()
    {
        return "/documents/" + WebDoc.application.pageEditor.currentDocument.uuid() + "/pages/" + this.data.page_id;
    },
    
    refresh: function($super, json)
    {
        $super(json);
        console.log("update item");
		console.log(json);
        this.recomputeInternalSizeAndPosition();
		if (this.domNode) 
		{
			this.domNode.animate(this.data.data.css);
		}
    },
    
    setPoints: function(points)
    {
        this.data.data.points = points;
        WebDoc.application.boardController.drawingController.mRenderer.updatePolyline(this.domNode.get(0), 
        {
            points: points
        });
    },
    
    recomputeInternalSizeAndPosition: function()
    {
        if (this.data.data.css.top) 
        {
            this.position = 
            {
                top: parseFloat(this.data.data.css.top.replace("px", "")),
                left: parseFloat(this.data.data.css.left.replace("px", ""))
            };
            this.size = 
            {
                width: parseFloat(this.data.data.css.width.replace("px", "")),
                height: parseFloat(this.data.data.css.height.replace("px", ""))
            };
        }
    },
    
    type: function()
    {
        if (this.data.media_type) 
            return this.data.media_type;
		return "object";
    },
    
    select: function()
    {
        this.domNode.addClass("wb-selected-object");
        if (!this.domNode.attr("ub:zIndex")) 
        {
            this.domNode.attr("ub:zIndex", this.domNode.css("zIndex"));
        }
        console.log("type " + this.type());
        if (this.type() == "widget") 
        {
            this.domNode.css(
            {
                zIndex: 2000000
            });
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
    },
    
    unSelect: function()
    {
        this.domNode.removeClass("wb-selected-object");
        console.log("reset zindex");
        this.domNode.css("zIndex", this.domNode.attr("ub:zIndex"));
        this.shift(15, 15);
        this.size.height -= 15;
        this.size.width -= 15;
    },
    
    moveTo: function(newPosition)
    {
        this.position.left = newPosition.left;
        this.position.top = newPosition.top;
        this.data.data.css.left = this.position.left + "px";
        this.data.data.css.top = this.position.top + "px";
        this.domNode.animate(this.data.data.css, 'fast');
    },
    
    shift: function(x, y)
    {
        if (this.type() != "widget") 
        {
            this.position.left = this.position.left + x;
            this.position.top = this.position.top + y;
            this.data.data.css.left = this.position.left + "px";
            this.data.data.css.top = this.position.top + "px";
            this.domNode.css(this.data.data.css);
        }
    },
    
    coverPoint: function(point)
    {
        if (this.type() != 'application/vnd.mnemis-uniboard-drawing') 
        {
            var pointMatrix = $M([[point.x - this.position.left], [point.y - this.position.top], [1]]);
            var mat_str = this.domNode.css("-moz-transform");
            var converted_point = {};
            converted_point.x = point.x;
            converted_point.y = point.y;
            if (mat_str && mat_str != "" && mat_str.indexOf("matrix") >= 0) 
            {
                var matrixPointsString = mat_str.substr(mat_str.indexOf("(") + 1, mat_str.length - (mat_str.indexOf("(") + 2));
                var matrixPoints = matrixPointsString.split(", ");
                var matrix = $M([[matrixPoints[0], matrixPoints[2], matrixPoints[4].replace("px", "")], [matrixPoints[1], matrixPoints[3], matrixPoints[5].replace("px", "")], [0, 0, 1]]);
                
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
});
