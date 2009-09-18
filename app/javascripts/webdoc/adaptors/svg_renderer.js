/**
 * Uniboard board controller
 **/
WebDoc.SvgRenderer = $.klass(
{
    initialize: function(initialDrawing)
    
    {
        // TODO set this as class attribute
        this.svgNS = "http://www.w3.org/2000/svg";
    },
    createSurface: function(width, height)
    {
        var surface = document.createElementNS(this.svgNS, "svg");
        if (!width) 
        {
            width = "100%";
        }
        if (!height) 
        {
            height = "100%";
        }
        surface.setAttribute("style", "position: absolute; top:0x; left:0px; width:" + width + "; height:" + height);
        return surface;
    },
    
    clearSurface: function(surface)
    {
        console.log(surface);
        while (surface.firstChild) 
        {
            var element = surface.firstChild;
            surface.removeChild(element);
        }
    },
    
    createPolyline: function(item)
    {
        var result = document.createElementNS(this.svgNS, "polyline");
		item.data.tag = "polyline";
		
		result.setAttribute("id", item.uuid());
        result.setAttribute("style", "z-index:2000");
		item.data.css = { zIndex: 2000};
        result.setAttribute("fill", "none");
		item.data.stroke = "red";
        result.setAttribute("stroke", "red");
		item.data.strokeWidth = 5;
        result.setAttribute("stroke-width", 5);
        item.domNode = $(result);
        return result;
    },
    
    updatePolyline: function(line, properties)
    {
        if (properties.points) 
        {
            line.setAttribute("points", properties.points);
        }
        if (properties.id) 
        {
            line.setAttribute("id", properties.id);
        }
        if (properties.color) 
        {
            // TODO change color
        }
        if (properties.width) 
        {
            // TODO change width
        }
    }
});
