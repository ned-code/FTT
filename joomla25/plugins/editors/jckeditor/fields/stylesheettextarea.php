<?php
/**
 * @package     Joomla.Platform
 * @subpackage  Form
 *
 * @copyright   Copyright (C) 2005 - 2011 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE
 */

defined('JPATH_PLATFORM') or die;

jimport('joomla.form.helper');
JFormHelper::loadFieldClass('textarea');


/**
 * Form Field class for the Joomla Platform.
 * Supports a multi line area for entry of plain text
 *
 * @package     Joomla.Platform
 * @subpackage  Form
 * @since       11.1
 *
 */
class JFormFieldStylesheetTextarea extends JFormFieldTextarea 
{
	/**
	 * The form field type.
	 *
	 * @var    string
	 * @since  11.1
	 */
	protected $type = 'Stylesheettextarea';

	/**
	 * Method to get the textarea field input markup.
	 * Use the rows and columns attributes to specify the dimensions of the area.
	 *
	 * @return  string  The field input markup.
	 * @since   11.1
	 */
	 
	protected function getInput()
	{
		// Initialize some field attributes.
		static $identifier; 
		
		if(!isset($identifier))
		{
			JHTML::_('behavior.modal');		
			$identifier = 0;
		}
		$identifier++; 

		// Initialize JavaScript field attributes.
		$button	= 
		'<br clear="left"/><input style="float:none;margin-left:150px;" type="button" id="modal'.$identifier.'" href="../plugins/editors/jckeditor/fields/modals/typography.php" rel="{handler: \'iframe\' , size: {x:640, y:480}}" value="Expand View"/>
<script type="text/javascript">
window.addEvent(\'domready\', function()
{
	var dialog = document.getElementById("modal'.$identifier.'");
	dialog.addEvent("click",function()
	{
		SqueezeBox.fromElement(dialog,	{ parse: \'rel\'});
	});	
	
}); 
</script>';
        $textarea = parent::getInput();
	
		return 	str_replace('<textarea ','<textarea style="overflow:auto" ',$textarea) . $button;
	}
}	