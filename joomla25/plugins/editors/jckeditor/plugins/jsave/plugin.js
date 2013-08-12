/*
Copyright (c) 2003-2010, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileSave plugin.
 */

(function()
{
	
	var win = CKEDITOR.document.getWindow();
	
	
	function getElementByClassName(cl) 
	{
		
		var retnode = [],
		myclass = new RegExp('\\b'+cl+'\\b'),
		doc = CKEDITOR.document.$;
		var elem = doc.getElementsByTagName('*');
		
		for (var i = 0; i < elem.length; i++) 
		{
			var classes = elem[i].className;
			if (myclass.test(classes))
			{
				retnode.push(elem[i]);
				break;
			}
		}
		return new CKEDITOR.dom.nodeList(retnode).getItem(0);
	}
	
	
		
	
	
	var buttons = ['toolbar-apply','toolbar-save','save','formelm-buttons']; 
	

	for(var i = 0 ; i < buttons.length;i++)
	{
		var button = buttons[i],
			element = CKEDITOR.document.getById(button) || getElementByClassName(button);
			action = '',
			child = null;
			
		if(element)
		{
		
			if(element.getChildCount())
			{
				
				var children =  element.getChildren();
				for (var i = 0; i < children.count();i++)
				{
					child = children.getItem(i);
					if(child.type != CKEDITOR.NODE_TEXT && (child.getName() == 'a' || 'button')  )
					{
					
						action = child.getAttribute('onclick');
						if (action && action.toString().match(/submitbutton\('(.*)'\)/))
						{
							action = RegExp.$1;
						}
						break;
					}
				
				}
			}
		 	break;
		}
		button = '';
	}
	
	
	var saveCmd =
	{
		modes : { wysiwyg:1, source:1 },

		exec : function( editor )
		{
			if ( win.$.submitbutton)
				win.$.submitbutton(action);
			else if (Joomla && Joomla.submitbutton)
				Joomla.submitbutton(action);
		}
	};

	var commandName = 'save';

	// Register a plugin named "save".
	CKEDITOR.plugins.add( 'jsave',
	{
		init : function( editor )
		{
			var command = editor.addCommand( commandName, saveCmd );
			command.modes = { wysiwyg : !!( win.$.submitbutton ||  Joomla &&  Joomla.submitbutton) };

			if(button)
			{
				editor.ui.addButton( 'Save',
					{
						label : editor.lang.save,
						command : commandName
					});
			}
		}
	});
})();
