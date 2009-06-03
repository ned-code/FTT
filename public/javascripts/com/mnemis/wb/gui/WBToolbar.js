/**
 * Uniboard tool bar widget
**/
// check that mnemis FW has bveen loadad
if (!com.mnemis || !com.mnemis.core)
{
	alert("mnemis FW has not been loaded");
}

com.mnemis.core.Provide("com/mnemis/wb/gui/WBToolbar.js");

if (!com.mnemis.wb.gui) { com.mnemis.wb.gui = {}};


com.mnemis.wb.gui.WBToolbar = function()
{
	this.domNode = $(
				    "<div id='toolbar' style='position: fixed; top: 0px; left: 0px; width: 100%; height: 42px; background-color: gray; z-index: 65000'>" +
				    	"<a id='undo' class='toolbatButton' dojoAttachEvent='onclick: undo'>" +
				    		"<img src='/static/resources/toolbar/undo.png'/>"+
				    	"</a>" +
				    	"<a id='redo' class='toolbarButton' dojoAttachEvent='onclick: redo'>" +
				    		"<img src='/static/resources/toolbar/redo.png'/>"+
				    	"</a>" +						   
					"</div>").get(0);
	
	$(this.domNode).find("#undo").bind('click', this.undo);
	$(this.domNode).find("#redo").bind('click', this.redo);
}	
	 	
com.mnemis.wb.gui.WBToolbar.prototype.undo = function(e)
{
	if (WB.application.undoManager)
	{
		WB.application.undoManager.undo();
		e.preventDefault();
	}
};
	 
com.mnemis.wb.gui.WBToolbar.prototype.redo = function(e)
{
	if (WB.application.undoManager)
	{
		WB.application.undoManager.redo();
		e.preventDefault();
	}
};
