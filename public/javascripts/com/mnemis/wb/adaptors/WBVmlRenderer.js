/**
 * Uniboard board controller
**/
com.mnemis.core.Provide("com/mnemis/wb/adaptors/WBVmlRenderer.js");


com.mnemis.wb.adaptors.WBVmlRenderer = function(initialDrawing)
{        	
    // TODO set this as class attribute
    this.vmlNS = "VML"; //could be "urn:schemas-microsoft-com:vml"
    document.namespaces.add('vml', 'urn:schemas-microsoft-com:vml');
    var styleSheet = (document.styleSheets.length > 0) ? document.styleSheets[0] : document.createStyleSheet();
    styleSheet.addRule('vml\\:*', 'behavior:url(#default#VML)');
    
}

com.mnemis.wb.adaptors.WBVmlRenderer.prototype.createSurface = function(width, height) {

    var surface = document.createElement("vml:group");

    //    surface.setAttribute("xmlns", "urn:schemas-microsoft-com:vml");
    if (!width) {
        width = "100%";
    }
    if (!height) {
        height = "100%";
    }
    var coordSize = width * 1000 + "," + height * 1000;

    //    surface.setAttribute("style", "position: absolute; top:0x; left:0px; width:" + width + "; height:" + height);
    var obj = $(surface);
    obj.css("position", "absolute");
    obj.css("top", 0);
    obj.css("left", 0);
    obj.css("width", width);
    obj.css("height", height);
    surface.setAttribute("coordsize", coordSize);
    surface.setAttribute("coordorigin", "0,0");

    return surface;
}

com.mnemis.wb.adaptors.WBVmlRenderer.prototype.clearSurface = function(surface)
 {
    var test = 0;

    while (surface.firstChild) {
        var element = surface.firstChild;
        surface.removeChild(element);
    }
}

com.mnemis.wb.adaptors.WBVmlRenderer.prototype.createPolyline = function(id)
{
	var result = document.createElementNS(this.vmlNS, "polyline");
	result.setAttribute("style", "z-index:2000");
	result.setAttribute("fill", "none");
	result.setAttribute("stroke", "red");
	result.setAttribute("stroke-width", 5);
	if (id)
	{
		result.setAttribute("id", id);
	}
	return result;	 	        	
}

com.mnemis.wb.adaptors.WBVmlRenderer.prototype.updatePolyline = function(line, properties) {
    if (properties.points) {
        var reg = new RegExp("[ ,]+", "g");
        var values = properties.points.split(reg);
        var points = "";
        for (var i = 0; i < values.length; i++) 
        {
            points += values[i] * 1000 + ",";
        }
        line.setAttribute("points", points);
    }
    if (properties.id) {
        line.setAttribute("id", properties.id);
    }
    if (properties.color) {
        // TODO change width
    }
    if (properties.width) {
        // TODO change width
    }
}

com.mnemis.wb.adaptors.WBVmlRenderer.prototype.createPolygon = function(id) {
    var result = document.createElement("vml:polyline");
    result.setAttribute("style", "z-index:2000");
    result.setAttribute("fillcolor", "red");
    result.setAttribute("stroked", "False");
//    result.setAttribute("stroke-width", 5);
    if (id) {
        result.setAttribute("id", id);
    }
    return result;
}

com.mnemis.wb.adaptors.WBVmlRenderer.prototype.updatePolygon = function(line, properties) {
    if (properties.points) {
        line.setAttribute("points", properties.points);
    }
    if (properties.id) {
        line.setAttribute("id", properties.id);
    }
    if (properties.color) {
        line.setAttribute("fillcolor", properties.color);
    }
    if (properties.width) {
        // TODO change width
    }
    if (properties.opacity < 1) {

        line.setAttribute("stroked", "True");
        line.setAttribute("strokecolor", properties.color);

        var alpha = properties.opacity;
        if (alpha >= 0.2 && alpha < 0.6) {
            alpha /= 12;
        }
        else if (alpha < 0.8) {
            alpha /= 5;
        }
        else if (alpha < 1.0) {
            alpha /= 2;
        }

        var stroke = document.createElement("vml:stroke");
        stroke.setAttribute("opacity", alpha)
        
        var fill = document.createElement("vml:fill");
        fill.setAttribute("opacity", properties.opacity)
        line.appendChild(stroke);
        line.appendChild(fill);
    }

}      
