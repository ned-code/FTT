/**
 * UBEditor is the main function of the application. It define UB namespace.
**/
com.mnemis.core.Provide("com/mnemis/wb/core/WBViewer.js");
// import Webbyboard namespace in WB
var WB = com.mnemis.wb;

com.mnemis.core.Import("com/mnemis/wb/gui/WBToolPalette.js");
com.mnemis.core.Import("com/mnemis/wb/controllers/WBBoardController.js");


// application singleton.
WB.application = {};

com.mnemis.wb.core.WBViewer = function()
{
    console.log("load WB application");
    var body = $("body").get(0);

    WB.application.boardController = new WB.controllers.WBBoardController(false);

    WB.application.toolpalette = new WB.gui.WBToolPalette(0);
    body.appendChild(WB.application.toolpalette.domNode);
    WB.application.toolpalette.refreshGUI();

}

// load application
$(function()
	{
        console.log("viewer document ready");
	}
);
