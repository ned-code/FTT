/**
 * Uniboard board controller
**/
if (com.mnemis.core.Provide("com/mnemis/wb/adaptors/WBSvgRenderer.js"))
{
    com.mnemis.wb.adaptors.WBSvgRenderer = $.inherit(
    {
        __constructor: function(initialDrawing)

        {
            // TODO set this as class attribute
            this.svgNS = "http://www.w3.org/2000/svg";
        },
        createSurface : function(width, height)
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

        clearSurface : function(surface)
        {
            console.log(surface);
            while ( surface.firstChild )
            {
                var element =  surface.firstChild;
                surface.removeChild( element );
            }
        },

        createPolyline : function(id)
        {
            var result = document.createElementNS(this.svgNS, "polyline");
            result.setAttribute("style", "z-index:2000");
            result.setAttribute("fill", "none");
            result.setAttribute("stroke", "red");
            result.setAttribute("stroke-width", 5);
            if (id)
            {
                result.setAttribute("id", id);
            }
            return result;
        },

        updatePolyline : function(line, properties)
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

 
}