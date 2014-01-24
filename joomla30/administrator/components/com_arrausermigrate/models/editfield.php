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
     ArrausermigrateModelEditfield
	 
 **** functions
     __construct();
	 getUserType();
	 getExport();
	 csvExport();
	 mkfile();
	 sendMail();
	 checked();
	 getAdditionalColumns();
	 import();
	 csv_txtImport();
	 emailExist();
	 userExist();
	 getUserType2();	 
 */

// No direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.application.component.model');

/**
 * ArrausermigrateModelUtf Model
 *
 */
class ArrausermigrateModelEditfield extends JModelLegacy{
	/**
	 * Constructor that retrieves the ID from the request
	 *
	 * @access	public
	 * @return	void
	 */
	function __construct(){		
		parent::__construct();
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
					foreach($temp1 as $key1=>$value1){
						if(strpos($value1, "=") !== FALSE){
							$temp2 = explode("=", $value1);
							$temp2["1"] = str_replace('"', "", $temp2["1"]);
							$temp_value[trim($temp2["0"])] = trim($temp2["1"]);							
						}
					}
					$return_array[] = $temp_value;
				}
			}
		}
		else{
			return array();
		}		
		return $return_array;
	}
	
	function getFieldDetails(){
		$db =& JFactory::getDBO();
		$all_fields = $this->getFields();
		$name = JRequest::getVar("name", "");
		if(isset($all_fields) && count($all_fields) > 0){
			$return_array = array();
			foreach($all_fields as $key=>$value){							
				if(isset($value["name"]) && trim($value["name"]) == trim($name)){
					$return_array[] = $all_fields[$key];
					if($return_array["0"]["type"] == "radio" || $return_array["0"]["type"] == "list" || $return_array["0"]["type"] == "checkboxes"){
						$sql = "select `option` from #__arra_users_profile where name='".trim($name)."'";
						$db->setQuery($sql);
						$db->query();
						$options = $db->loadResult();
						$return_array["0"]["option"] = $options;
					}
					return $return_array;
				}
			}
			return array();
		}
		else{
			return array();
		}
	}
	
	function saveFields(){	
		$db =& JFactory::getDBO();
		$name = trim(JRequest::getVar("name", ""));
		$type = trim(JRequest::getVar("field_type", "text"));
		
		$file_profile_path = JPATH_SITE.DS."plugins".DS."user".DS."profile".DS."profiles".DS."profile.xml";
		$file_content = JFile::read($file_profile_path);
		
		$field = array();
		if($type != "radio" && $type != "list" && $type != "checkboxes"){
			preg_match_all('/name="'.$name.'"(.*)\/>/msU', $file_content, $field);
		}
		else{
			preg_match_all('/name="'.$name.'"(.*)<\/field>/msU', $file_content, $field);
		}
		$old_values = "";
		
		if(isset($field) && isset($field["1"]["0"])){
			$old_values = $field["1"]["0"];

			
			$new_values = "\n";
			$field_type = JRequest::getVar("field_type");
			$field_id = JRequest::getVar("field_id");
			$field_description = JRequest::getVar("field_description");
			$field_filter = JRequest::getVar("field_filter");
			$field_label = JRequest::getVar("field_label");
			$field_message = JRequest::getVar("field_message");
			$field_size = JRequest::getVar("field_size");
			$field_cols = JRequest::getVar("field_cols");
			$field_rows = JRequest::getVar("field_rows");
			$field_options = JRequest::getVar("field_options", JREQUEST_ALLOWHTML);
			
			$set = array();
			if(trim($field_type) != ""){
				$new_values .= "\t"."\t"."\t"."\t".'type="'.trim($field_type).'"'."\n";
			}
			if(trim($field_id) != ""){
				$field_id = str_replace(" ", "", $field_id);
				$field_id = str_replace("-", "_", $field_id);
				$field_id = str_replace("*", "", $field_id);
				$field_id = str_replace("/", "", $field_id);
				$field_id = str_replace("\\", "", $field_id);
				$field_id = str_replace("'", "", $field_id);
				$field_id = str_replace('"', "", $field_id);
				$field_id = str_replace("`", "", $field_id);
				$set[] = "`field_id`='".addslashes(trim($field_id))."'";
				$new_values .= "\t"."\t"."\t"."\t".'id="'.trim($field_id).'"'."\n";
			}
			if(trim($field_description) != ""){
				$set[] = "`description`='".addslashes(trim($field_description))."'";
				$new_values .= "\t"."\t"."\t"."\t".'description="'.trim($field_description).'"'."\n";
			}
			if(trim($field_filter) != "" && trim($field_type) != "checkboxes"){
				$set[] = "`filter`='".addslashes(trim($field_filter))."'";
				$new_values .= "\t"."\t"."\t"."\t".'filter="'.trim($field_filter).'"'."\n";
			}
			if(trim($field_label) != ""){
				$set[] = "`label`='".addslashes(trim($field_label))."'";
				$new_values .= "\t"."\t"."\t"."\t".'label="'.trim($field_label).'"'."\n";
			}
			if(trim($field_message) != ""){
				$set[] = "`message`='".addslashes(trim($field_message))."'";
				$new_values .= "\t"."\t"."\t"."\t".'message="'.trim($field_message).'"'."\n";
			}
			if(trim($field_size) != "" && trim($field_size) != "0"){
				$set[] = "`size`='".intval($field_size)."'";
				$new_values .= "\t"."\t"."\t"."\t".'size="'.intval($field_size).'"'."\n";
			}
			if(trim($field_cols) != "" && trim($field_cols) != "0"){
				$set[] = "`cols`='".intval($field_cols)."'";
				$new_values .= "\t"."\t"."\t"."\t".'cols="'.intval($field_cols).'"'."\n";
			}
			if(trim($field_rows) != "" && trim($field_rows) != "0"){
				$set[] = "`rows`='".intval($field_rows)."'";
				$new_values .= "\t"."\t"."\t"."\t".'rows="'.intval($field_rows).'"'."\n";
			}
			if($type == "radio" || $type == "list" || $type == "checkboxes"){
				$new_values .= "\t"."\t"."\t".">"."\n";
				$set[] = "`option`='".$field_options."'";
				$options = explode("\n", trim($field_options));
				if(isset($options) && count($options) > 0){
					foreach($options as $key=>$value){
						if(trim($value) != ""){
							$temp = explode("-", trim($value));
							$new_values .= "\t"."\t"."\t"."\t".'<option value="'.trim($temp["0"]).'">'.trim($temp["1"]).'</option>'."\n";
						}
					}					
				}
			}
			$new_values .= "\t"."\t"."\t";
		}//if field		
		$old_file_content = JFile::read($file_profile_path);		
		$new_file_content = str_replace($old_values, $new_values, $old_file_content);
		if(JFile::write($file_profile_path, $new_file_content)){
			if(isset($set) && count($set) > 0){
				$sql = "";
				if($this->existField($name)){
					$sql = "update #__arra_users_profile set ".implode(", ", $set)." where name = '".trim(addslashes($name))."'";
				}
				else{
					$sql = "insert into #__arra_users_profile(`name`, `type`, `field_id`, `description`, `label`, `message`, `cols`, `rows`, `option`, `size`) values ('".trim(addslashes($name))."', '".trim($field_type)."', '".trim($field_id)."', '".addslashes(trim($field_description))."', '".addslashes(trim($field_label))."', '".addslashes(trim($field_message))."', ".trim($field_cols).", ".trim($field_rows).", '".addslashes(trim($field_options))."', ".trim($field_size).")";
				}
				$db->setQuery($sql);
				if($db->query()){
					return true;
				}
			}
		}
		return false;
	}
	
	function existField($name){
		$db =& JFactory::getDBO();
		$sql = "select count(*) from #__arra_users_profile where name='".trim(addslashes($name))."'";
		$db->setQuery($sql);
		$db->query();
		$result = $db->loadResult();
		if($result > 0 ){
			return true;
		}
		return false;
	}
}

?>