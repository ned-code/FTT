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
 * file: utf.php
 *
 **** class 
     ArrausermigrateModelUtf
	 
 **** functions
     __construct();	 
 */

// No direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.application.component.model');
jimport('joomla.filesystem.file');

/**
 * ArrausermigrateModelUtf Model
 *
 */
class ArrausermigrateModelUserprofile extends JModelLegacy{
	/**
	 * Constructor that retrieves the ID from the request
	 *
	 * @access	public
	 * @return	void
	 */
	function __construct(){		
		parent::__construct();
	}
	
	function recreatefields(){
		$db = JFactory::getDBO();
		$sql = "select * from #__arra_users_profile";
		$db->setQuery($sql);
		$db->query();
		$fields = $db->loadAssocList();
		
		$file_profile_path = JPATH_SITE.DS."plugins".DS."user".DS."profile".DS."profiles".DS."profile.xml";
		$file_content = JFile::read($file_profile_path);
		
		if(isset($fields) && is_array($fields) && count($fields) > 0){
			foreach($fields as $key=>$field){
				if(strpos($file_content, 'id="'.$field["field_id"].'"') === FALSE){
					JRequest::setVar("number_columns", "1");
					JRequest::setVar("recreate", "1");
					JRequest::setVar("field_name_1", $field["name"]);
					JRequest::setVar("field_type_1", $field["type"]);
					JRequest::setVar("field_id_1", $field["field_id"]);
					JRequest::setVar("field_description_1", $field["description"]);
					JRequest::setVar("field_filter_1", $field["filter"]);
					JRequest::setVar("field_label_1", $field["label"]);
					JRequest::setVar("field_message_1", $field["message"]);
					JRequest::setVar("field_cols_1", $field["cols"]);
					JRequest::setVar("field_rows_1", $field["rows"]);
					JRequest::setVar("field_option_1", $field["option"]);
					JRequest::setVar("field_size_1", $field["size"]);
					if(!$this->saveFields()){
						return false;
					}
				}
			}
		}
		return true;
	}
	
	function saveFields(){		
		$db =& JFactory::getDBO();
		$file_profile_path = JPATH_SITE.DS."plugins".DS."user".DS."profile".DS."profiles".DS."profile.xml";
		$file_profile_plugin = JPATH_SITE.DS."plugins".DS."user".DS."profile".DS."profile.xml";
		$file_user_profile_content = JFile::read($file_profile_path);
		$file_profile_plugin_content = JFile::read($file_profile_plugin);		
		$rows_number = JRequest::getVar("number_columns", "0");
		$recreate = JRequest::setVar("recreate", "0");
		
		$total_text_user_profile = "";
		$total_text_plugin_profile = "";
		$total_text_plugin_profile2 = "";
		
		$existing_fields = array();
		$return_array = array();
		
		if($rows_number != "0"){
			for($i=1; $i<=$rows_number; $i++){
				$name = strtolower(JRequest::getVar("field_name_".$i, ""));
				$name = str_replace(" ", "", $name);
				$type = JRequest::getVar("field_type_".$i, "");
				$id = strtolower(JRequest::getVar("field_id_".$i, ""));
				$id = str_replace(" ", "", $id);
				$id = str_replace("-", "_", $id);
				$id = str_replace("*", "", $id);
				$id = str_replace("/", "", $id);
				$id = str_replace("\\", "", $id);
				$id = str_replace("'", "", $id);
				$id = str_replace('"', "", $id);
				$id = str_replace("`", "", $id);
				$description = JRequest::getVar("field_description_".$i, "");
				$filter = JRequest::getVar("field_filter_".$i, "");
				$label = JRequest::getVar("field_label_".$i, "");
				$message = JRequest::getVar("field_message_".$i, "");
				$cols = JRequest::getVar("field_cols_".$i, "") == "" ? "0" : JRequest::getVar("field_cols_".$i, "");
				$rows = JRequest::getVar("field_rows_".$i, "") == "" ? "0" : JRequest::getVar("field_rows_".$i, "");
				$option = JRequest::getVar("field_option_".$i, "") == "" ? "" : JRequest::getVar("field_option_".$i, "");
				$size = JRequest::getVar("field_size_".$i, "") == "" ? "0" : JRequest::getVar("field_size_".$i, "");
				$temp_user_text = "";
				$temp_plugin_text = "";
				$temp_plugin_text2 = "";
				
				if(strpos($file_user_profile_content, 'name="'.trim($name).'"') === FALSE || strpos($file_user_profile_content, 'id="'.trim($id).'"') === FALSE){
					if(trim($option) != ""){
						$temp_user_text = "";
						$temp_user_text .= "\n\t\t\t<field"."\n\t\t\t\t";
						$temp_user_text .= 	' name="'.trim($name).'"'."\n\t\t\t\t";
						$temp_user_text .= 	' type="'.trim($type).'"'."\n\t\t\t\t";
						$temp_user_text .= 	' description="'.trim($description).'"'."\n\t\t\t\t";
						$temp_user_text .= 	' label="'.trim($label).'"'."\n\t\t\t\t";
						$temp_user_text .= 	' id="'.trim($id).'"'."\n\t\t\t\t";
						$temp_user_text .= 	' message="'.trim($message).'"'."\n\t\t\t\t";
						if(trim($cols) != ""){
							$temp_user_text .= 	' cols="'.trim($cols).'"'."\n\t\t\t\t";
						}
						if(trim($rows) != ""){
							$temp_user_text .= 	' rows="'.trim($rows).'"'."\n\t\t\t\t";
						}
						if(trim($filter) != "0" && $type != "checkboxes"){
							$temp_user_text .= 	' filter="'.trim($filter).'"'."\n\t\t\t\t";
						}
						if(trim($size) != ""){
							$temp_user_text .= 	' size="'.trim($size).'"'."\n\t\t\t\t";
						}
						$temp_user_text .= ">\n";
						
						$options_rows = explode("\n", trim($option));
						foreach($options_rows as $key=>$value){
							$options = explode("-", $value);
							$temp_user_text .= "\t"."\t"."\t"."\t".'<option value="'.trim($options["0"]).'">'.trim($options["1"]).'</option>'."\n";
						}					
						$temp_user_text .= "\t"."\t"."\t".'</field>';											
					}
					else{
						$temp_user_text = "";
						$temp_user_text .= "\n\t\t\t<field"."\n\t\t\t\t";
						$temp_user_text .= 	' name="'.trim($name).'"'."\n\t\t\t\t";
						$temp_user_text .= 	' type="'.trim($type).'"'."\n\t\t\t\t";
						$temp_user_text .= 	' description="'.trim($description).'"'."\n\t\t\t\t";
						$temp_user_text .= 	' label="'.trim($label).'"'."\n\t\t\t\t";
						$temp_user_text .= 	' id="'.trim($id).'"'."\n\t\t\t\t";
						$temp_user_text .= 	' message="'.trim($message).'"'."\n\t\t\t\t";
						if(trim($cols) != ""){
							$temp_user_text .= 	' cols="'.trim($cols).'"'."\n\t\t\t\t";
						}
						if(trim($rows) != ""){
							$temp_user_text .= 	' rows="'.trim($rows).'"'."\n\t\t\t\t";
						}
						if(trim($filter) != "0" && $type != "checkboxes"){
							$temp_user_text .= 	' filter="'.trim($filter).'"'."\n\t\t\t\t";
						}
						if(trim($size) != ""){
							$temp_user_text .= 	' size="'.trim($size).'"'."\n\t\t\t\t";
						}
						$temp_user_text .= "/>";
					}
					
					$total_text_user_profile .= "\n".$temp_user_text;
					
					if(strpos($file_user_profile_content, '"register-require_'.trim($name).'"') === FALSE){
						$temp_plugin_text  = "\t"."\t"."\t"."\t".'<field'." ";
						$temp_plugin_text .= 	'name="profile-require_'.trim($name).'"'."\n\t\t\t\t\t";
						$temp_plugin_text .= 	'type="list"'."\n\t\t\t\t\t";
						$temp_plugin_text .= 	'label="'.trim($label).'"'."\n\t\t\t\t\t";
						$temp_plugin_text .= 	'description="'.trim($description).'"'."\n";
						$temp_plugin_text .= "\t"."\t"."\t"."\t".'>'."\n\t\t\t\t\t";
						$temp_plugin_text .= '<option value="2">JOPTION_REQUIRED</option>'."\n\t\t\t\t\t";
						$temp_plugin_text .= '<option value="1">JOPTION_OPTIONAL</option>'."\n\t\t\t\t\t";
						$temp_plugin_text .= '<option value="0">JDISABLED</option>'."\n";
						$temp_plugin_text .= "\t"."\t"."\t"."\t".'</field>';
						$total_text_plugin_profile .= "\n".$temp_plugin_text;
						
						$temp_plugin_text2  = "\t"."\t"."\t"."\t".'<field'." ";
						$temp_plugin_text2 .= 	'name="register-require_'.trim($name).'"'."\n\t\t\t\t\t";
						$temp_plugin_text2 .= 	'type="list"'."\n\t\t\t\t\t";
						$temp_plugin_text2 .= 	'label="'.trim($label).'"'."\n\t\t\t\t\t";
						$temp_plugin_text2 .= 	'description="'.trim($description).'"'."\n";
						$temp_plugin_text2 .= "\t"."\t"."\t"."\t".'>'."\n\t\t\t\t\t";
						$temp_plugin_text2 .= '<option value="2">JOPTION_REQUIRED</option>'."\n\t\t\t\t\t";
						$temp_plugin_text2 .= '<option value="1">JOPTION_OPTIONAL</option>'."\n\t\t\t\t\t";
						$temp_plugin_text2 .= '<option value="0">JDISABLED</option>'."\n";
						$temp_plugin_text2 .= "\t"."\t"."\t"."\t".'</field>';
						$total_text_plugin_profile2 .= "\n".$temp_plugin_text2;
					}
					
					if($recreate == 0){
						$sql = "insert into #__arra_users_profile(`name`, `type`, `field_id`, `description`, `filter`, `label`, `message`, `cols`, `rows`, `option`, `size`) values ('".addslashes(trim($name))."', '".trim($type)."', '".trim($id)."', '".addslashes(trim($description))."', '".trim($filter)."', '".addslashes(trim($label))."', '".addslashes(trim($message))."', ".trim($cols).", ".trim($rows).", '".addslashes(trim($option))."', ".trim($size).")";					
						$db->setQuery($sql);
						if(!$db->query()){
							die($sql);
						}
					}
				}
				else{
					$existing_fields[] = trim($label);
				}
				$temp_user_text = "";
				$temp_plugin_text = "";									
			}//for
			
			$return_array["exist_fields"] = $existing_fields;
			
			//write new fields in files
			$file_user_profile_content = str_replace("</fieldset>", $total_text_user_profile."\n\t\t"."</fieldset>", $file_user_profile_content);
			$file_profile_plugin_content = str_replace("</fieldset>", $total_text_plugin_profile."\n\t\t\t"."</fieldset>", $file_profile_plugin_content);
			$file_profile_plugin_content = str_replace('<field name="spacer1" type="spacer"', $total_text_plugin_profile2."\n\n\t\t\t\t".'<field name="spacer1" type="spacer"', $file_profile_plugin_content);
			
			if(! JFile::write($file_profile_path, $file_user_profile_content)){
				$return_array["message"] = FALSE;
				break;
			}
			else{
				$return_array["message"] = TRUE;
			}
			
			if(! JFile::write($file_profile_plugin, $file_profile_plugin_content)){
				$return_array["message"] = FALSE;
				break;
			}
			else{
				$return_array["message"] = TRUE;
			}
		}//if
		return $return_array;		
	}
	
	function getFields(){
		$return_array = array();
		$file_profile_path = JPATH_SITE.DS."plugins".DS."user".DS."profile".DS."profiles".DS."profile.xml";
		$file_content = JFile::read($file_profile_path);
		$file_content = str_replace('<fields name="profile">', "", $file_content);
		$file_content = str_replace('<fieldset name="profile"
			label="PLG_USER_PROFILE_SLIDER_LABEL"
		>', "", $file_content);		
		$file_content = str_replace('</fieldset>', "", $file_content);
		$file_content = str_replace('</fields>', "", $file_content);
		
		preg_match_all('/<field(.*)>/msU',$file_content, $fields);
		
		if(isset($fields) && is_array($fields) && isset($fields["0"]) && count($fields["0"])>0){
			foreach($fields["0"] as $key=>$value){				
				$temp_value = array();
				$temp1 = explode("\n", $value);

				if(isset($temp1) && count($temp1) > 0){					
					$add = "";
					foreach($temp1 as $key1=>$value1){						
						if(trim($value1) == 'name="tos"' || trim($value1) == '<fieldset name="profile"'){
							$add = false;
							break;							
						}
						elseif(strpos($value1, "=") !== FALSE){
							$add = true;
							$temp2 = explode("=", $value1);
							$temp2["1"] = str_replace('"', "", $temp2["1"]);
							$temp_value[trim($temp2["0"])] = trim($temp2["1"]);
						}
					}					
					if($add){
						$return_array[] = $temp_value;
					}
				}
			}
		}
		else{
			return array();
		}
		return $return_array;
	}
	
	function deleteFields(){
		$db =& JFactory::getDBO();
		$file_profile_path = JPATH_SITE.DS."plugins".DS."user".DS."profile".DS."profiles".DS."profile.xml";
		$file_content = JFile::read($file_profile_path);
		$name = JRequest::getVar("for_delete_name", "");
		$type = JRequest::getVar("for_delete_type", "");
		if($type == "radio" || $type == "list" || $type == "checkboxes"){
			preg_match_all('/name="'.$name.'"(.*)<\/field>/msU', $file_content, $field);
			if(isset($field) && count($field) > 0){
				$for_delete = $field["1"]["0"];
				$file_content = str_replace($for_delete, "", $file_content);
				$file_content = str_replace('name="'.$name.'"', ">", $file_content);
				$file_content =  preg_replace('/<field\s\s+><\/field>/', "", $file_content);				
			}			
		}
		else{
			preg_match_all('/name="'.$name.'"(.*)\/>/msU', $file_content, $field);
			
			if(isset($field) && count($field) > 0){
				$for_delete = $field["1"]["0"];
				$file_content = str_replace($for_delete, "", $file_content);
				$file_content = str_replace('name="'.$name.'"', "", $file_content);
				$file_content =  preg_replace('/<field\s\s+\/>/', "", $file_content);
			}						
		}
		
		if(JFile::write($file_profile_path, $file_content)){
			$file_profile_plugin = JPATH_SITE.DS."plugins".DS."user".DS."profile".DS."profile.xml";
			$file_content = JFile::read($file_profile_plugin);
			$file_content = preg_replace('/<field name="register-require_'.$name.'"(.*)<\/field>/msU', "", $file_content);
			$file_content = preg_replace('/<field name="profile-require_'.$name.'"(.*)<\/field>/msU', "", $file_content);
			if(JFile::write($file_profile_plugin, $file_content)){
				$sql = "delete from #__arra_users_profile where name='".addslashes(trim($name))."'";
				$db->setQuery($sql);
				if($db->query()){
					return true;
				}
			}
		}
		return false;
	}
	
	function getAllFields(){
		$db =& JFactory::getDBO();
		$sql = "select * from #__arra_users_profile";
		$db->setQuery($sql);
		$db->query();
		$result = $db->loadAssocList();
		return $result;
	}
	
	function getAllJoomlaFields(){
		$return = array();
		$return["address1"] = "Address 1";
		$return["address2"] = "Address 2";
		$return["city"] = "City";
		$return["region"] = "Region";
		$return["country"] = "Country";
		$return["postal_code"] = "Postal / ZIP Code";
		$return["phone"] = "Phone";
		$return["website"] = "Web site";
		$return["favoritebook"] = "Favourite Book";
		$return["aboutme"] = "About Me";
		$return["dob"] = "Date of Birth";
		return $return;
	}
	
};

?>