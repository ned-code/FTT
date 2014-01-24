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
     ArrausermigrateViewDelete
	 
 **** functions
     display();
 */

// No direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport( 'joomla.application.component.view' );

/**
 * ArrausermigrateViewDelete View
 *
 */
class ArrausermigrateViewDelete extends JViewLegacy{
	 
	var $users1 = "";
	var $users = ""; 
	 
	function display($tpl = null){		
		// make ToolBarHelper with name of component.
		JToolBarHelper::title(JText::_('ARRA_USER_EXPORT'), 'generic.png');
		JToolBarHelper::custom('delete', 'joomlarra_delete.png', 'joomlarra_delete.png', 'Delete Users', false, false);
		JToolBarHelper::cancel('cancel', 'Cancel');		  		
		
		$this->users1 = $this->get("AllUsers");
		$this->users = $this->get("AllUsersMapped");
						
		parent::display($tpl);
	}
	
	function getUserType(){
		$all_types = $this->get("AllTypes");
		$existing_types = $this->get("ExistingTypes");
		$return = $this->createCheckBox($all_types, $existing_types);
		return $return;
	}
	
	function createCheckBox($all_types, $existing_types){
		$columns = 4;
		$rows = 0;
		$k = 0;
		$existing_types_temp = array();
		
		if(is_array($all_types) && is_array($existing_types)){
			$rows = ceil((count($all_types) + count($existing_types))/$columns);
			foreach($existing_types as $key=>$values){
				$existing_types_temp[$values["id"]] = $values["title"];
			}
			$existing_types	= $existing_types_temp;		
		}
				
		$return  = "";
		$return .= '<table width="100%">';
		for($i=0; $i<$rows; $i++){
			$return .= '<tr>';
			for($j=0; $j<$columns; $j++){				
				if(isset($existing_types[$k]) || isset($all_types[$k])){
					$return .= '<td style="line-height:20px;" class="td_class_statistics">';
					if(isset($all_types[$k]) && in_array($all_types[$k]["title"], $existing_types)){
						$return .= '<input type="checkbox" id="usertype" name="usertype['.$all_types[$k]["id"].']" value="'.$all_types[$k]["id"].'" />'.$all_types[$k]["title"];						
					}
					else{
						$return .= "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;".$all_types[$k]["title"];														
					}
					$return .= '</td>';
					$k ++;
				}					
			}
			$return .= '</tr>';
		}
		$return .= '</table>';
		return $return;
	}
	
	function getRegisterDate(){
		$return  = "";
		$return .= "<table>";		
		$return .= 		"<tr>";
		$return .= 			"<td class=\"td_class_statistics\">";
		$return .= 				JText::_("ARRA_FROM").": ";
		$return .= 			"</td>";
		$return .= 			"<td class=\"td_class_statistics\">";
		$return .= 				JHTML::_('calendar', '', 'start_register_date', 'start_register_date', '%Y-%m-%d', array('size'=>'25',  'maxlength'=>'19'));
		$return .= 			"</td>";
		$return .= 			"<td class=\"td_class_statistics\">";
		$return .= 				JText::_("ARRA_TO").": ";
		$return .= 			"</td>";
		$return .= 			"<td class=\"td_class_statistics\">";
		$return .= 				JHTML::_('calendar', '', 'end_register_date', 'end_register_date', '%Y-%m-%d', array('size'=>'25',  'maxlength'=>'19'));
		$return .= 			"</td>";
		$return .= 		"</tr>";
		$return .= "</table>";
		return $return;
	}
	
	function getLastVisitedDate(){
		$return  = "";
		$return .= "<table>";
		$return .= 		"<tr>";
		$return .= 			"<td style=\"line-height:20px;\" colspan=\"2\" class=\"td_class_statistics\">";
		$return .= 				'<input type="radio" name="visited" value="0">'.JText::_("ARRA_AT_LEAST_ONE_VISIT");
		$return .= 			"</td>";
		$return .= 		"</tr>";
		$return .= 		"<tr>";
		$return .= 			"<td style=\"line-height:20px;\" colspan=\"2\" class=\"td_class_statistics\">";
		$return .= 				'<input type="radio" name="visited" value="1">'.JText::_("ARRA_NO_VISITE");
		$return .= 			"</td>";
		$return .= 		"</tr>";
		$return .= 		"<tr>";
		$return .= 			"<td style=\"line-height:20px;\" colspan=\"2\" class=\"td_class_statistics\">";
		$return .= 				'<input type="radio" name="visited" value="-1">'.JText::_("ARRA_COLUMN_DEFAULT_VAL");
		$return .= 			"</td>";
		$return .= 		"</tr>";
		$return .= 		"<tr>";
		$return .= 			"<td class=\"td_class_statistics\">";
		$return .= 				JText::_("ARRA_FROM").": ";
		$return .= 			"</td>";
		$return .= 			"<td class=\"td_class_statistics\">";
		$return .= 				JHTML::_('calendar', '', 'start_date', 'start_date', '%Y-%m-%d', array('size'=>'25',  'maxlength'=>'19'));
		$return .= 			"</td>";
		$return .= 			"<td class=\"td_class_statistics\">";
		$return .= 				JText::_("ARRA_TO").": ";
		$return .= 			"</td>";
		$return .= 			"<td class=\"td_class_statistics\">";
		$return .= 				JHTML::_('calendar', '', 'end_date', 'end_date', '%Y-%m-%d', array('size'=>'25',  'maxlength'=>'19'));
		$return .= 			"</td>";
		$return .= 		"</tr>";
		$return .= "</table>";
		return $return;
	}
	
	function getActivatedUsers(){
		$return  = "";
		$return .= "<table>";
		$return .= 		"<tr>";
		$return .= 			"<td style=\"line-height:20px;\" class=\"td_class_statistics\">";
		$return .= 				'<input type="radio" name="activated" value="0">'.JText::_("ARRA_ACTIVATED_USER");
		$return .= 			"</td>";
		$return .= 		"</tr>";
		$return .= 		"<tr>";
		$return .= 			"<td style=\"line-height:20px;\" class=\"td_class_statistics\">";
		$return .= 				'<input type="radio" name="activated" value="1">'.JText::_("ARRA_PENDING_ACTIVATION");
		$return .= 			"</td>";
		$return .= 		"</tr>";
		$return .= 		"<tr>";
		$return .= 			"<td style=\"line-height:20px;\" class=\"td_class_statistics\">";
		$return .= 				'<input type="radio" name="activated" value="-1">'.JText::_("ARRA_COLUMN_DEFAULT_VAL");
		$return .= 			"</td>";
		$return .= 		"</tr>";
		$return .= "</table>";
		return $return;
	}
	
	function getBlockUnblock(){
		$return  = "";
		$return .= "<table>";
		$return .= 		"<tr>";
		$return .= 			"<td style=\"line-height:20px;\" class=\"td_class_statistics\">";
		$return .= 				'<input type="radio" name="block" value="1">'.JText::_("ARRA_BLOCK");
		$return .= 			"</td>";
		$return .= 		"</tr>";
		$return .= 		"<tr>";
		$return .= 			"<td style=\"line-height:20px;\" class=\"td_class_statistics\">";
		$return .= 				'<input type="radio" name="block" value="0">'.JText::_("ARRA_UNBLOCK");
		$return .= 			"</td>";
		$return .= 		"</tr>";
		$return .= 		"<tr>";
		$return .= 			"<td style=\"line-height:20px;\" class=\"td_class_statistics\">";
		$return .= 				'<input type="radio" name="block" value="-1">'.JText::_("ARRA_COLUMN_DEFAULT_VAL");
		$return .= 			"</td>";
		$return .= 		"</tr>";
		$return .= "</table>";
		return $return;
	}
	
	function findUsers($search){
		$model =& $this->getModel();
		return $model->findUsers($search);
	}
}
?>