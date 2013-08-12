/**
* @version		$Id: modal.js 5263 2006-10-02 01:25:24Z webImagery $
* @copyright	Copyright (C) 2005 - 2010 Open Source Matters. All rights reserved.
* @license		GNU/GPL, see LICENSE.php
* Joomla! is free software. This version may have been modified pursuant
* to the GNU General Public License, and as distributed it includes or
* is derivative of works licensed under the GNU General Public License or
* other free or open source software licenses.
* See COPYRIGHT.php for copyright notices and details.
*/

/**
 * JCombobox javascript behavior
 *
 * Used for transforming <input type="text" ... /> tags into combobox dropdowns with appropriate <noscript> tag following
 * for dropdown list information
 *
 * @package		Joomla
 * @since		1.5
 * @version     1.0
 */
var JComboboxParam = function() { this.constructor.apply(this, arguments);}
JComboboxParam.prototype = {

	constructor: function()
	{
		var agt = navigator.userAgent.toLowerCase();
		this.is_ie = (agt.indexOf("msie") != -1);
		this.is_opera = (agt.indexOf("opera") != -1);
		this.is_safari = (agt.indexOf("safari") != -1);
		this.is_ie7 = (agt.indexOf("msie 7") != -1);

		var boxes = document.getElements('.combobox');
		for ( var i=0; i < boxes.length; i++) {
			if (boxes[i].tagName == 'SELECT') {
				this.initialize(boxes[i]);
			}
		}
	},

	initialize: function(element)
	{

	
		var textbox = null;
		
		var name = element.name;
		if (this.is_ie)
		{
			try
			{
			   textbox = document.createElement( "<input name='"+name+"'>" );
			} 
			catch(e){}
		}
		if(!textbox)
		{
			textbox = document.createElement('input');
			textbox.setAttribute('name',name);
		}
		textbox.setAttribute('type',"text");
		textbox.setAttribute('id',element.id);
		element.setAttribute('id','combobox-'+element.id+ '-select');
	
		element.inputbox = textbox.id;
		element.onchange = function(){ var input = document.getElementById(this.inputbox); input.value = this.options[this.selectedIndex].value; }
		
		element.parentNode.insertBefore(textbox, element.nextSibling);

		var coords = { x: element.offsetWidth, y: 0 };
		
		var widthOffset = 20;
		var heightOffset = 4;
		
		
		// Set text field properties based on the select box
		textbox.style.position = 'relative';
		textbox.style.top = coords.y + 'px';
		textbox.style.right = coords.x + 'px';
		textbox.style.width = element.offsetWidth - widthOffset + 'px';
		textbox.style.height = element.offsetHeight - heightOffset + 'px';
		textbox.style.zIndex = 0;
		
		
		
		url = '../plugins/editors/jckeditor/fields/combo.php?field=' + element.name.replace(/(\[|\]|params)/ig,'');
		
		var a = new Ajax(url, {
			method: 'get',
			onComplete: function( response ) {
				textbox.value = response;
			}
		}).request();
        

	}

}

document.combobox = null
Window.onDomReady(function(){
  var combobox = new JComboboxParam()
  document.combobox = combobox
});
