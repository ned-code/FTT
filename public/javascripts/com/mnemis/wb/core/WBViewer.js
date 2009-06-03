/**
 * UBEditor is the main function of the application. It define UB namespace.
**/

// check that mnemis FW has bveen loadad
if (!com.mnemis || !com.mnemis.core)
{
	alert("mnemis FW has not been loaded");
}

// create WB namespace and import it in WB
com.mnemis.wb = {};
var WB = com.mnemis.wb;

com.mnemis.core.Provide("com/mnemis/wb/core/WBViewer.js");


com.mnemis.core.Import("com/mnemis/core/UndoManager.js");
com.mnemis.core.Import("com/mnemis/wb/gui/WBToolbar.js");
com.mnemis.core.Import("com/mnemis/wb/gui/WBToolPalette.js");
com.mnemis.core.Import("com/mnemis/wb/controllers/WBBoardController.js");
com.mnemis.core.Import("com/mnemis/wb/controllers/WBDrawingController.js");
com.mnemis.core.Import("com/mnemis/wb/model/WBPage.js");

// create WB application object.
WB.application = {};

// load application
$(function()
	{
		console.log("load WB application");
		var body = $("body").get(0);
        $("<link>").attr({"rel":"stylesheet","type":"text/css","href":"http://localhost:3000/stylesheets/webbyboard.css","media":"screen"}).appendTo(document.getElementsByTagName("head")[0]);
		var currentPage = new com.mnemis.wb.model.WBPage(body);
		WB.application.boardController = new WB.controllers.WBBoardController(currentPage, false);
        WB.application.boardController.currentTool = 7;

		WB.application.toolpalette = new WB.gui.WBToolPalette(0);
		body.appendChild(WB.application.toolpalette.domNode);
		WB.application.toolpalette.refreshGUI();


		WB.application.drawingController = new WB.controllers.WBDrawingController();
		$("#ub_page_drawing").get(0).appendChild(WB.application.drawingController.domNode);
		WB.application.drawingController.setDrawingModel(currentPage.drawingModel());

	}
);
