<?php
/**
 * ARRA User Export Import component for Joomla! 1.6
 * @version 1.6.0
 * @author ARRA (joomlarra@gmail.com)
 * @link http://www.joomlarra.com
 * @Copyright (C) 2010 - 2011 joomlarra.com. All Rights Reserved.
 * @license GNU General Public License version 2, see LICENSE.txt or http://www.gnu.org/licenses/gpl-2.0.html
 * PHP code files are distributed under the GPL license. All icons, images, and JavaScript code are NOT GPL (unless specified), and are released under the joomlarra Proprietary License, http://www.joomlarra.com/licenses.html
 *
 * file: view.html.php
 *
 **** class 
     ArrausermigrateViewUtf 
	 
 **** functions
     display();
 */

// No direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport( 'joomla.application.component.view' );
JHTML::_( 'behavior.modal' );
/**
 * ArrausermigrateViewUtf View
 *
 */
class ArrausermigrateViewUserprofile extends JViewLegacy{
	/**
	 * display method 
	 * @return void
	 **/
	function display($tpl = null){		
		// make ToolBarHelper with name of component.		
		JToolBarHelper::title(JText::_( 'ARRA_USER_EXPORT' ), 'generic.png' );
		JToolBarHelper::apply();
		JToolBarHelper::save();
		JToolBarHelper::cancel('cancel', 'Cancel');
		$this->fields = $this->get("Fields");	
		parent::display($tpl);
	}
	
	function getFieldType($i){
		$return  = '';
		$return .= '<select name="field_type_'.$i.'" id="field_type_'.$i.'" style="float:none !important;" onchange="javascript:changeType('.$i.', this.value);">';		
		$return .= 		'<option value="text">text</option>';
		$return .= 		'<option value="tel">phone</option>';
		$return .= 		'<option value="url">website</option>';
		$return .= 		'<option value="textarea">textarea</option>';
		$return .= 		'<option value="radio">radio</option>';
		$return .= 		'<option value="calendar">calendar</option>';
		$return .= 		'<option value="list">dropdown</option>';
		$return .= 		'<option value="checkboxes">checkboxes</option>';
		$return .= '</select>';
		return $return;
	}
	
	function getFieldFilter($i){
		$return  = '';
		$return .= '<select name="field_filter_'.$i.'" id="field_filter_'.$i.'" style="float:none !important;">';
		$return .= 		'<option value="string">string</option>';
		$return .= 		'<option value="safehtml">safehtml</option>';
		$return .= 		'<option value="array">array</option>';
		$return .= '</select>';
		return $return;
	}
	
	function getFields(){
		$return = '<select name="fields" id="fields" onchange="javascript:createFilter(this.value)">';
		$fields = $this->get("AllFields");
		$joomla_fields = $this->get("AllJoomlaFields");
		$return .= '<option value="0">'.JText::_("ARRA_SELECT_ORDER").'</option>';
		
		if(isset($joomla_fields) && count($joomla_fields) > 0){
			foreach($joomla_fields as $field_id=>$field_label){
				$return .= '<option value="'.$field_id.'">'.$field_label.'</option>';
			}
		}
		
		if(isset($fields) && count($fields) > 0){
			foreach($fields as $key=>$field){
				$return .= '<option value="'.$field["id"].'">'.$field["label"].'</option>';
			}
		}
		$return .= '</select>';
		return $return;
	}
}

?>