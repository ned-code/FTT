/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
com.mnemis.core.Provide("com/mnemis/core/gui/FloatingPalette.js");

com.mnemis.core.gui.FloatingPalette = function()
{

}

com.mnemis.core.gui.FloatingPalette.prototype.mouseDown = function(e)
 {
 	var that = e.data;
 	that._moving = true;
 	that._startMousePos = { x:e.clientX, y:e.clientY};
 	that._starPosition = $(that.domNode).position();
    // as position is fixed we must take care about scroll
    that._starPosition.top -= window.scrollY;
    that._starPosition.left -= window.scrollX;
	e.preventDefault();
    e.stopPropagation();
 }

com.mnemis.core.gui.FloatingPalette.prototype.mouseUp = function(e)
 {
 	var that = e.data;
 	that._moving = false;
 	that._startMousePos = null;
 	e.preventDefault();
    e.stopPropagation();
 }

com.mnemis.core.gui.FloatingPalette.prototype.mouseOut = function(e)
 {
//     if (e.target == e.data.domNode)
//     {
//        console.log(e);
//        var that = e.data;
//        that.mouseUp(e);
//     }
 }

com.mnemis.core.gui.FloatingPalette.prototype.mouseMove = function(e)
 {
 	var that = e.data;
 	if (that._moving)
 	{
 		var xDiff = e.clientX - that._startMousePos.x;
 		var yDiff = e.clientY - that._startMousePos.y;
		if (xDiff > 5 || xDiff < -5 || yDiff > 5 || yDiff < -5)
		{
     		var newLeft = that._starPosition.left + xDiff;
     		var newTop = that._starPosition.top + yDiff;
     		if (newLeft < 0)
     			newLeft = 0;
     		if (newTop < 0)
     			newTop = 0;

     		$(that.domNode).css({ left: newLeft + 'px', top: newTop + 'px'});
		}
		e.preventDefault();
        e.stopPropagation();
 	}
 }
