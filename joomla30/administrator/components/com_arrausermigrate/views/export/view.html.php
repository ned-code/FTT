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
     ArrausermigrateViewExport 
	 
 **** functions
     display();
     userType();
	 firstColumnExport();
	 secondColumnExport1();
	 secondColumnExport2();
	 AdditionalColumns();	 
     fileType();
	 tableFileType();	 
	 generateCheckbox();
	 setSeparators();
	 setOrdering();
	 setEmailTo();	 
 */

// No direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport( 'joomla.application.component.view' );
JHTML::_( 'behavior.modal' );
/**
 * ArrausermigrateViewExport View
 *
 */
class ArrausermigrateViewExport extends JViewLegacy{
	/**
	 * display method 
	 * @return void
	 **/
	function display($tpl = null){						
		
		// make ToolBarHelper with name of component.
		JToolBarHelper::custom('export_button', 'export.png', 'export.png', 'Export', false, false);
		JToolBarHelper::title(   JText::_( 'ARRA_USER_EXPORT' ), 'generic.png' );
		
		JToolBarHelper::cancel ('cancel', 'Cancel');
		
		//user type
		$user_type = $this->userType();		
		$this->assignRef('user_type', $user_type);
		
		//name, username, email
		$columns_export = $this->firstColumnExport();		
		$this->assignRef('first_columns_export', $columns_export);
		
		//user type, password, blocked
		$second_columns_export1 = $this->secondColumnExport1();		
		$this->assignRef('second_columns_export1', $second_columns_export1);
		
		//data registered, lsat visit, activation
		$second_columns_export2 = $this->secondColumnExport2();		
		$this->assignRef('second_columns_export2', $second_columns_export2);
		
		//user_profile_fields
		$user_profile_fields = $this->userProfileFields();
		$this->assignRef('user_profile_fields', $user_profile_fields);
		
		//csv and txt file
		$file_type = $this->fileType();		
		$this->assignRef('file_type', $file_type);
		
		//sql and zip file
		$table_file_type = $this->tableFileType();		
		$this->assignRef('table_file_type', $table_file_type);
		
		//combo separator
		$separators = $this->setSeparators();		
		$this->assignRef('separators', $separators);
		
		$ordering = $this->setOrdering();		
		$this->assignRef('ordering', $ordering);
		
		//setting email
		$email_to = $this->setEmailTo();		
		$this->assignRef('email_to', $email_to);
	    
		parent::display($tpl);
	}
	
	function video($tpl = null){
		$id = JRequest::getVar("id", "0");
		$this->assignRef('id', $id);
        parent::display($tpl);
    }				
		
	// make check boxes with users type
	function userType(){	
	    $array_user_type = $this->get('UserType');
		$users_array = array();
		foreach($array_user_type as $key=>$value){
			if($value["usertype"]=="deprecated"){
				$value["usertype"] = "Super Users";
			}
		    $users_array[] = $value["usertype"];
		}
		// add no user type to the end
		$users_array[] = JText::_("ARRA_NO_USER_TYPE");
		
		$columns = $this->generateCheckbox("checkbox", "bottom_columns_for_export", "header_colum", "td_class", "user_type_checkbox", $users_array, $users_array,"","all_user_type");		
		return $columns;	  
	}
	
	// make check boxes with columns by exporting default columns
	function firstColumnExport(){
	    $columns_value = array("name", "username", "email");
		$columns_name = array("Name", "Username", "Email");
		$columns = $this->generateCheckbox("checkbox", "top_columns_for_export", "header_colum", "td_class", "top_column_checkbox", $columns_value, $columns_name, "checked=\"yes\"");
		return $columns;
	}
	
	// make check boxes with columns by choose columns
	function secondColumnExport1(){
	    $columns_value = array("password", "usertype", "block", "params");
		$columns_name = array("Password", "User Type", "Blocked", "Params");
		$columns = $this->generateCheckbox("checkbox", "bottom_columns_for_export", "header_colum", "td_class", "top_column_checkbox", $columns_value, $columns_name);
		return $columns;
	}
	
	// make check boxes with columns by choose columns
	function secondColumnExport2(){
	    $columns_value = array("registerDate", "lastvisitDate", "activation", "id");
		$columns_name = array("Register Date", "Last Visit Date", "Activation", "User ID");
		$columns = $this->generateCheckbox("checkbox", "bottom_columns_for_export", "header_colum", "td_class", "top_column_checkbox", $columns_value, $columns_name);
		return $columns;
	}		
	
	function userProfileFields(){
		$user_profile_fields = $this->get("UserProfileFields");
	    $columns_value = array();
		$columns_name = array();
		if(isset($user_profile_fields) && is_array($user_profile_fields) && count($user_profile_fields)>0){
			foreach($user_profile_fields as $key=>$value){
				$element = $value["profile_key"];
				$element = str_replace("profile.", "", $element);
				$element = str_replace("_", " ", $element);
				$element = ucwords($element);
				
				$columns_value[] = $value["profile_key"];
				$columns_name[] = $element;
			}
		}
		if(count($columns_value)>0 && count($columns_name)>0){
			$columns = $this->generateCheckboxProfile("checkbox", "bottom_columns_for_export", "header_colum", "td_class", "top_column_checkbox", $columns_value, $columns_name);
			return $columns;	
		}		
		else{
			return "";
		}
	}
	
	//make radio button for file export	
	function fileType(){		
		$columns_value = array("csv", "txt", "html");
		$columns_name = array("CSV", "TXT", "HTML");
		$columns = $this->generateCheckbox("radio", "bottom_columns_for_export", "header_colum", "td_class", "radio_type_export", $columns_value, $columns_name);
		return $columns;
	}
	
	//make radio button for sql or zip export	
	function tableFileType(){		
		$columns_value = array("sql", "zip");
		$columns_name = array("SQL", "ZIP");
		$columns = $this->generateCheckbox("radio", "bottom_columns_for_export", "header_colum", "td_class", "radio_type_export", $columns_value, $columns_name);
		return $columns;
	}	
	
	//generate automat checkbox and radio buttons
	function generateCheckbox($type, $class, $header_column_class, $td_class, $element_name, $columns_value, $columns_name, $checked="", $all_user_type=""){
	     $columns = "";
		 $header = false;
		 $br = "";
		 
		 $columns .= "<table class=\"" . $class . "\">"; 			
		 		 
		 for($j=0; $j<count($columns_name); $j++){			   
				$name = "";
				$javascript = "";
				if($type == "checkbox"){
					$name = $element_name . "[" . $columns_value[$j] . "] ";
					$br = "<br/>";
			   }
			   elseif($type == "radio"){
					if($columns_value[$j] == "csv" || $columns_value[$j]=="txt" || $columns_value[$j]=="html"){
						//set csv default
						if($columns_value[$j] == "csv"){
							$checked = " CHECKED ";
						}
						else{
							$checked = "";
						}
						$javascript = " onclick=\"javascript:showSeparator();\" ";
					}
					elseif($columns_value[$j] == "sql" || $columns_value[$j]=="zip"){
						$javascript = " onclick=\"javascript:hideSeparator();\" ";
					}					
					$name = $element_name;
					 
			   }
			   $columns .= "<tr>";
					//if is not csv, txt, sql, zip and is not for user type do background and tool tip
					if($columns_value[$j] != "html" && $columns_value[$j] != "csv" && $columns_value[$j]!="txt" && $columns_value[$j] != "sql" && $columns_value[$j]!="zip" && $all_user_type==""){
						$columns .= "<td class=\"" . $td_class . "\">";
						$tool_tip = 	"ARRA_TOOLTIP_" . str_replace(" ", "_", strtoupper($columns_name[$j])) . "_EXPORT";					
						$columns .= 	"<span class=\"editlinktip hasTip\" title=\"" . $columns_name[$j] . "::" . JText::_($tool_tip). "\" >";
						$columns .= 		$columns_name[$j];
						$columns .= 	"</span>";						
					    $columns .= "</td>";
					}
					else{
					    if (class_exists('ZipArchive')){
    						$columns .= "<td class=\"" . $td_class . "_2\">";
							$columns .= 	$columns_name[$j];
							$columns .= "</td>";
						}
						else{
						    if($columns_name[$j] != "ZIP"){
								$columns .= "<td class=\"" . $td_class . "_2\">";
								$columns .= 	$columns_name[$j];
								$columns .= "</td>";
							}
						}
					}
					if (class_exists('ZipArchive')){				
						$columns .= "<td>";  
						$columns .= 	"<input type=\"" . $type . "\" name=\"" . $name . "\" id=\"".$columns_value[$j]."\"  value=\"" .  $columns_value[$j] . "\"" . $checked . $javascript . ">" . $br;						
						$columns .= "</td>";
						if($columns_value[$j] == "csv" || $columns_value[$j]=="txt" || $columns_value[$j] == "sql" || $columns_value[$j]=="zip" || $columns_value[$j]=="html"){
							$columns .= "<td class=\"td_export_definitions_2\">";
							$columns .= 	JText::_("ARRA_TOOLTIP_TEXT_" . str_replace(" ","_" , strtoupper($columns_name[$j])) );
							$columns .= "</td>";
					   }   
						$columns .= "</tr>";
					}
					else{
						if($columns_name[$j] != "ZIP"){
							$columns .= "<td>";  
							$columns .= 	"<input type=\"" . $type . "\" name=\"" . $name . "\" id=\"".$columns_value[$j]."\"  value=\"" .  $columns_value[$j] . "\"" . $checked . $javascript . ">" . $br;						
							$columns .= "</td>";
							if($columns_value[$j] == "csv" || $columns_value[$j]=="txt" || $columns_value[$j] == "sql" || $columns_value[$j]=="html"){
								$columns .= "<td class=\"td_export_definitions_2\">";
								$columns .= 	JText::_("ARRA_TOOLTIP_TEXT_" . str_replace(" ","_" , strtoupper($columns_name[$j])) );
								$columns .= "</td>";
					   		}   
							$columns .= "</tr>";
						}
					}						 
		  }	 
		  		  	 	
		$columns .= "</table>";		 
		return $columns;
	}
	
	//generate automat checkbox and radio buttons
	function generateCheckboxProfile($type, $class, $header_column_class, $td_class, $element_name, $columns_value, $columns_name, $checked="", $all_user_type=""){		
		$columns = "";
		$header = false;
		$br = "";
		
		$j=0;
		$columns .= '<table class="'.$class.'" width="100%">';
		
		$collumns_array = array();
		if(isset($columns_value) && count($columns_value) > 0){
			foreach($columns_value as $key=>$value){
				$collumns_array[] = $value;
			}
		}
		
		$columns .= '<tr>';
		$columns .= '	<td colspan="4" class="td_export_definitions">';
		$columns .= 		JText::_("ARRA_CHECK_ALL_FIELDS")."&nbsp;&nbsp;";
		$columns .= '		<input type="checkbox" name="toggle" id="toggle" onclick="javascript:checkAllFields(\''.implode(",", $collumns_array).'\');" />';		
		$columns .= '	</td>';
		$columns .= '</tr>';
		
		while(isset($columns_name[$j])){
			for($i=1; $i<=2; $i++){
				if(isset($columns_name[$j])){
					$name = $element_name."[".$columns_value[$j]."] ";
					$columns .= '<tr>';
					$columns .= 	'<td class="'.$td_class.'">';
					$columns .= 		$columns_name[$j];
					$columns .= 	'</td>';
					$columns .= 	'<td>';
					$columns .= 		'<input type="'.$type.'" name="'.$name.'" id="'.$columns_value[$j].'" value="'.$columns_value[$j].'">';
					$columns .= 	'</td>';
				}
				$j++;
				if(isset($columns_name[$j])){
					$name = $element_name."[".$columns_value[$j]."] ";
					$columns .= 	'<td class="'.$td_class.'">';
					$columns .= 		$columns_name[$j];
					$columns .= 	'</td>';
					$columns .= 	'<td>';
					$columns .= 		'<input type="'.$type.'" name="'.$name.'" id="'.$columns_value[$j].'" value="'.$columns_value[$j].'">';
					$columns .= 	'</td>';
					$columns .= '</tr>';
				}
				$j++;
			}	
		}
		$columns .= '</table>';
		return $columns;
	}
	
	//set a check box with separators
	function setSeparators(){
		$combo = "";
		$combo .= "<select name=\"separator\">";
		$combo .= 		"<option value=\",\"> , " .JText::_("ARRA_COMMA") . "</option>";
		$combo .= 		"<option value=\";\"> ; " . JText::_("ARRA_SEMICOLON") . "</option>";
		$combo .= 		"<option value=\"|\"> | " . JText::_("ARRA_VERTICAL_BAR") . "</option>";
		$combo .= 		"<option value=\".\"> . " . JText::_("ARRA_DOT") . "</option>";			 
		$combo .= "</select>";
		return $combo;
	}
	
	function setOrdering(){
		$combo = "";
		$combo .= "<table>";
		$combo .= 	"<tr>";
		$combo .= 	   "<td>";
		$combo .= "<select name=\"ordering\">";
		$combo .= 		"<option value=\"0\">" .JText::_("ARRA_SELECT_ORDER") . "</option>";
		$combo .= 		"<option value=\"name\">" . JText::_("ARRA_ORDER_BY_NAME") . "</option>";
		$combo .= 		"<option value=\"username\">" . JText::_("ARRA_ORDER_BY_USERNAME") . "</option>";
		$combo .= 		"<option value=\"usertype\">" . JText::_("ARRA_ORDER_BY_USERTYPE") . "</option>";
		$combo .= 		"<option value=\"email\">" . JText::_("ARRA_ORDER_BY_EMAIL") . "</option>"."&nbsp;&nbsp;";			 
		$combo .= "</select>";		
		$combo .=     "</td>";
		$combo .=     "<td style=\"line-height:20px;\">";
		$combo .= 			"<input type=\"radio\" name=\"mode_order\" value=\"asc\" checked>";	
		$combo .=           JText::_("ARRA_ORDER_ASC");
		$combo .=     "<td style=\"line-height:20px;\">";
		$combo .= 			"<input type=\"radio\" name=\"mode_order\" value=\"desc\">";
		$combo .=           JText::_("ARRA_ORDER_DESC");
		$combo .=     "</td>";
		$combo .= 	"</tr>";
		$combo .= "</table>";
		return $combo;
	}
	
	//set combo box and text for emails address
	function setEmailTo(){
		$email_to = "";
		$email_to .= "<tr>";
		$email_to .= 	"<td class=\"td_export_definitions\">"; 
		$email_to .= 		"<span class=\"editlinktip hasTip\" title=\"" . JText::_("ARRA_SUPER_ADMIN_EMAIL_CHECK")."::".JText::_("ARRA_TOOLTIP_SUPER_ADMIN_EMAIL_CHECK"). "\" >";
		$email_to .= 			JText::_("ARRA_SUPER_ADMIN_EMAIL_CHECK") . "<input type=\"checkbox\" name=\"email_to_super_admin\">";
		$email_to .= 		"</span>";
		$email_to .= 	"</td>";			
		$email_to .= "</tr>";
		$email_to .= "<tr>";
		$email_to .= 	"<td class=\"td_export_definitions\">";
		$email_to .= 		"<span class=\"editlinktip hasTip\" title=\"" . JText::_("ARRA_EMAIL_TEXT")."::".JText::_("ARRA_TOOLTIP_EMAIL_TEXT"). "\" >";
		$email_to .= 			JText::_("ARRA_EMAIL_TEXT");
		$email_to .= 	"</td>";	
		$email_to .= 	"<td>";
		$email_to .= 		"<input type=\"text\" name=\"text_emails\" size=\"50\">";				    
		$email_to .= 	"</td>";			
		$email_to .= "</tr>";
		$email_to .= "<tr>";
		$email_to .= 	"<td>";
		$email_to .=    	"<div class=\"button2-left\"><div class=\"blank\"><a rel=\"{handler: 'iframe', size: {x: 850, y: 350}}\" class=\"modal\"  href=\"index.php?option=com_arrausermigrate&controller=customemail&task=email_export&tmpl=component\">".JText::_('VIEW_CUSTOM_EMAIL_BUTTON')."</a></div></div>";
		$email_to .= 	"</td>";
		 
		$email_to .= "</tr>";	
		return $email_to;
	}		

}