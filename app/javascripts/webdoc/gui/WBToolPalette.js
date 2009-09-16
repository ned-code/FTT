/**
 * Uniboard tool palette widget
**/
if (com.mnemis.core.Provide("com/mnemis/wb/gui/WBToolPalette.js"))
{
    com.mnemis.wb.gui.WBToolPalette = $.inherit(
    {
        __constructor: function(type)

        {
            this.domNode = $(
                "<div id='wb-toolpalette' class='wb-floatingpalette' style='height:" + (type == 1? "430":"220")+ "px'>" +
                (type == 1? this.getButtonHtml(0, "pen", "pen.png") : "") +
                (type == 1?this.getButtonHtml(1, "rubber", "eraser.png") : "") +
                this.getButtonHtml(4, "hand", "hand.png") +
                (type == 1?this.getButtonHtml(2, "marker", "marker.png") : "") +
                (type == 1?this.getButtonHtml(3, "laser", "laser.png") : "") +
                this.getButtonHtml(5, "zoomIn", "zoomIn.png") +
                this.getButtonHtml(6, "zoomOut", "zoomOut.png") +
                this.getButtonHtml(7, "arrow", "arrow.png") +
                "</div>").get(0);


            var domNodeWrapper = $(this.domNode);
            domNodeWrapper.draggable();

            domNodeWrapper.find("#pen").bind('click', this, this.selectPen);
            domNodeWrapper.find("#rubber").bind('click', this, this.selectRubber);
            domNodeWrapper.find("#hand").bind('click', this, this.selectHand);
            domNodeWrapper.find("#marker").bind('click', this, this.selectMarker);
            domNodeWrapper.find("#laser").bind('click', this, this.selectLaser);
            domNodeWrapper.find("#zoomIn").bind('click', this, this.selectZoomIn);
            domNodeWrapper.find("#zoomOut").bind('click', this, this.selectZoomOut);
            domNodeWrapper.find("#arrow").bind('click', this, this.selectArrow);
        },
        selectTool : function(toolId)
        {
            WB.application.boardController.setCurrentTool(toolId);
        },

        selectPen : function(e)
        {
            e.data.selectTool(0);
        },

        selectRubber : function(e)
        {
            e.data.selectTool(1);
        },

        selectMarker : function(e)
        {
            e.data.selectTool(2);
        },

        selectLaser : function(e)
        {
            e.data.selectTool(3);
        },

        selectHand : function(e)
        {
            e.data.selectTool(4);
        },

        selectZoomIn : function(e)
        {
            e.data.selectTool(5);
        },

        selectZoomOut : function(e)
        {
            e.data.selectTool(6);
        },

        selectArrow : function(e)
        {
            e.data.selectTool(7);
        },

        getButtonHtml : function(id, name, icon)
        {
            return "<div id='" + name + "' class='wb-toolpalette-button wb-tool-" + id + "' style='margin: 10%; width: 80%'>" +
            "<img src='/static/resources/stylusPalette/" + icon + "' alt='" + name + "'/>"+
            "</div>" ;
        },

        refreshGUI : function()
        {
            var oldSelection = $(".wb-tool-button-selected");
            if (oldSelection && oldSelection.length)
            {
                $(oldSelection[0]).removeClass("wb-tool-button-selected");
                var iconElement = oldSelection[0].childNodes[0];
                var iconPath = iconElement.src;
                if (iconPath.match(/On.png/))
                {
                    iconElement.src = iconPath.substring(0, iconPath.length - 6) + ".png";
                }
            }

            var classForCurrentTool = ".wb-tool-" + WB.application.boardController.currentTool;
            var toolToSelect = $(classForCurrentTool);
            if (toolToSelect && toolToSelect.length)
            {
                $(toolToSelect[0]).addClass("wb-tool-button-selected");
                iconElement = $(classForCurrentTool)[0].childNodes[0];
                iconPath = iconElement.src;
                iconElement.src = iconPath.substring(0, iconPath.length - 4) + "On.png";
            }
        }
    });
}