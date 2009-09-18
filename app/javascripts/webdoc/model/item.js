
//= require <mtools/record>

WebDoc.Item = $.klass(MTools.Record, 
{
    initialize: function($super, json)
    {
        $super(json);
        if (json) 
        {
            this.domNode = $("<" + this.data.tag + "/>");
            this.domNode.css(
            {
                position: "absolute"
            })
            for (var key in this.data) 
            {
                if (key == 'css') 
                    this.domNode.css(this.data.css);
                else 
                    if (key == 'uuid') 
                        // just ignore uuid
                        ;
                    else 
                        if (key == 'ubItemType') 
                            this.itemType = this.data[key];
                        else 
                            if (key == 'innerHtml') 
                                this.domNode.html(this.data[key]);
                            else 
                                if (key != 'tag') 
                                {
                                    this.domNode.attr(key, this.data[key]);
                                }
            }
            // internal size and position are top, left width and height as float. Because in the css those values are string with px unit
            // and we need float values to marix transform.
            this.recomputeInternalSizeAndPosition();
        }
    },
    
    refresh: function($super, json)
    {
		$super(json);
        console.log("update item");
        this.recomputeInternalSizeAndPosition();
        this.domNode.animate(this.data.css); 
    },
    
    setPoints: function(points)
    {
        this.data.points = points;
        WebDoc.application.boardController.drawingController.mRenderer.updatePolyline(this.domNode.get(0), 
        {
            points: points
        });
        if (WebDoc.application.boardController.currentPage && WebDoc.application.boardController.currentPage.pageRecord) 
        {
            WebDoc.application.boardController.currentPage.pageRecord.createOrUpdateItem(this.getData());
        }
    },
    
    recomputeInternalSizeAndPosition: function()
    {
        this.position = 
        {
            top: parseFloat(this.data.css.top.replace("px", "")),
            left: parseFloat(this.data.css.left.replace("px", ""))
        };
        this.size = 
        {
            width: parseFloat(this.data.css.width.replace("px", "")),
            height: parseFloat(this.data.css.height.replace("px", ""))
        };
    },
    
    type: function()
    {
        if (this.data.ubItemType) 
            return this.data.ubItemType;
        if (this.domNode.get(0).tagName == "object" && (this.domNode.attr("type") == "text/html" || this.domNode.attr("type") == "application/x-shockwave-flash")) 
        {
            return "widget";
        }
        else 
            if (this.domNode.get(0).tagName == "polyline" || this.domNode.get(0).tagName == "polygon") 
            {
                return "drawing";
            }
            else 
            {
                return "objet";
            }
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
        this.data.css.left = this.position.left + "px";
        this.data.css.top = this.position.top + "px";
        this.domNode.animate(this.data.css, 'fast');
        if (WebDoc.application.boardController.currentPage && WebDoc.application.boardController.currentPage.pageRecord) 
        {
            WebDoc.application.boardController.currentPage.pageRecord.createOrUpdateItem(this.getData());
        }
    },
    
    endOfMove: function()
    {
        if (WebDoc.application.boardController.collaborationController) 
        {
            console.log("Item delegate to collaboration controller");
            WebDoc.application.boardController.collaborationController.moveItem(this);
        }
        if (WebDoc.application.boardController.currentPage && WebDoc.application.boardController.currentPage.pageRecord) 
        {
            WebDoc.application.boardController.currentPage.pageRecord.createOrUpdateItem(this.getData());
        }
    },
    
    shift: function(x, y)
    {
        if (this.type() != "widget") 
        {
            this.position.left = this.position.left + x;
            this.position.top = this.position.top + y;
            this.data.css.left = this.position.left + "px";
            this.data.css.top = this.position.top + "px";
            this.domNode.css(this.data.css);
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
