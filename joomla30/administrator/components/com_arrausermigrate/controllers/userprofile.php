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
     ArrausermigrateControllerUtf 
	 
 **** functions
     __construct();
	 utf();
	 import();
	 cancel();
 */

// No direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

/**
 * ArrausermigrateControllerUtf Controller
 */
class ArrausermigrateControllerUserprofile extends ArrausermigrateController{
	/**
	 * constructor (registers additional tasks to methods)
	 * @return void
	 */
	function __construct() {	  
		parent::__construct();
		// Register Extra tasks
		$this->registerTask('', 'utf');
		$this->registerTask('save', 'save');
		$this->registerTask('apply', 'apply');
		$this->registerTask('cancel', 'cancel');
		$this->registerTask('userprofile', 'userprofile');
		$this->registerTask('delete_field', 'deleteField');
		$this->registerTask('createfilter', 'createFilter');
		$this->registerTask('search', 'search');
		$this->registerTask('export', 'export');
		$this->registerTask('recreatefields', 'recreatefields');
	}
	
	//set view for export tab
    function userprofile(){
		JRequest::setVar( 'view', 'userprofile' );
		JRequest::setVar( 'layout', 'default'  );		
		$model = $this->getModel('userprofile');		
		parent::display();
	}
	
	function recreatefields(){
		$model =& $this->getModel("Userprofile");
		$return = $model->recreatefields();
		if($return === TRUE){
			$msg = JText::_("ARRA_FIELDS_RECREATED");
			$this->setRedirect("index.php?option=com_arrausermigrate&task=userprofile&controller=userprofile", $msg);
		}
		else{
			$msg = JText::_("ARRA_FIELDS_NOT_RECREATED");
			$this->setRedirect("index.php?option=com_arrausermigrate&task=userprofile&controller=userprofile", $msg, "notice");
		}
	}
	
	function save(){
		$model =& $this->getModel("Userprofile");
		$return = $model->saveFields();
		if($return["message"] === TRUE){
			$msg = JText::_("ARRA_FIELDS_SAVED");
			$this->setRedirect("index.php?option=com_arrausermigrate", $msg);
		}
		else{
			$msg = JText::_("ARRA_FIELDS_NOT_SAVED");
			$this->setRedirect("index.php?option=com_arrausermigrate", $msg, "notice");
		}
	}
	
	function apply(){
		$model =& $this->getModel("Userprofile");
		$return = $model->saveFields();
		
		if($return["message"] === TRUE){
			if(isset($return["exist_fields"]) && count($return["exist_fields"]) > 0){
				$msg = JText::_("ARRA_SAME_FIELDS")."<br/>".implode(", ", $return["exist_fields"]);
				$this->setRedirect("index.php?option=com_arrausermigrate&task=userprofile&controller=userprofile", $msg, "notice");
			}
			else{
				$msg = JText::_("ARRA_FIELDS_SAVED");
				$this->setRedirect("index.php?option=com_arrausermigrate&task=userprofile&controller=userprofile", $msg);
			}	
		}
		else{
			$msg = JText::_("ARRA_FIELDS_NOT_SAVED");
			$this->setRedirect("index.php?option=com_arrausermigrate&task=userprofile&controller=userprofile", $msg, "notice");
		}
	}
	
	function cancel(){
		$msg = JText::_("ARRA_OPERATION_CANCELED");
		$this->setRedirect("index.php?option=com_arrausermigrate", $msg);	
	}
	
	function deleteField(){		
		$model =& $this->getModel("Userprofile");
		$return = $model->deleteFields();
		
		if($return === TRUE){
			$msg = JText::_("ARRA_DELETE_FIELD_SUCCESSFULLY");
			$this->setRedirect("index.php?option=com_arrausermigrate&task=userprofile&controller=userprofile", $msg);				
		}
		else{
			$msg = JText::_("ARRA_DELETE_FIELD_UNSUCCESSFULLY");
			$this->setRedirect("index.php?option=com_arrausermigrate&task=userprofile&controller=userprofile", $msg, "notice");
		}
	}
	
	function createFilter(){
		$database =& JFactory::getDBO();
		$select = "";
		$field_id = JRequest::getVar("field_id", "0");
		$sql = "select * from #__arra_users_profile where id=".intval($field_id);
		$database->setQuery($sql);
		$database->query();
		$result = $database->loadAssocList();

		if(!isset($result) || count($result) == 0){
			$result = array();
			switch($field_id){
				case 'address1' : $result["0"] = array("type"=>"text");
					break;
				case 'address2' : $result["0"] = array("type"=>"text");
					break;
				case 'city' : $result["0"] = array("type"=>"text");
					break;
				case 'region' : $result["0"] = array("type"=>"text");
					break;
				case 'country' : $result["0"] = array("type"=>"text");
					break;
				case 'postal_code' : $result["0"] = array("type"=>"text");
					break;
				case 'phone' : $result["0"] = array("type"=>"text");
					break;
				case 'website' : $result["0"] = array("type"=>"url");
					break;
				case 'favoritebook' : $result["0"] = array("type"=>"text");
					break;
				case 'aboutme' : $result["0"] = array("type"=>"textarea");
					break;
				case 'dob' : $result["0"] = array("type"=>"calendar");
					break;
			}
		}
		
		if(isset($result) && count($result) > 0){
			if($result["0"]["type"] == "text" || $result["0"]["type"] == "tel" || $result["0"]["type"] == "url" || $result["0"]["type"] == "textarea"){
				$select .= '<select name="filteroptions" id="filteroptions">';
				$select .= 		'<option value="0">'.JText::_("ARRA_USER_COMPLETED_FIELD").'</option>';
				$select .= 		'<option value="1">'.JText::_("ARRA_USER_FIELD_BLANK").'</option>';
				$select .= '</select>';
				$select .= '<input onfocus="if (this.value==\'Keyword...\') this.value=\'\';" onblur="if (this.value==\'\') this.value=\'Keyword...\';" value="Keyword..." type="text" name="keyword" id="keyword">';
			}
			elseif($result["0"]["type"] == "radio" || $result["0"]["type"] == "list" || $result["0"]["type"] == "checkboxes"){
				$select .= '<select name="filteroptions" id="filteroptions">';
				if(isset($result["0"]["option"]) && trim($result["0"]["option"]) != ""){
					$options = explode("\n", trim($result["0"]["option"]));
					foreach($options as $key=>$option){
						$select .= '<option value="'.$option.'">'.$option.'</option>';
					}
				}
				$select .= '</select>';
			}
			elseif($result["0"]["type"] == "calendar"){
				jimport('joomla.html.html');
				JHTML::_('behavior.calendar');
				$select = JHTML::_('calendar', '', 'datefield', 'datefield', "%Y-%m-%d", array('size'=>'25',  'maxlength'=>'19'));
			}
		}
		echo $select;
	}
	
	function getSearchUsers($field_id, $profile_key, $filteroptions, $type){
		$db =& JFactory::getDBO();
		$result = "";
		if($type == "text" || $type == "tel" || $type == "url" || $type == "textarea"){
			$and = "";
			$keyword = JRequest::getVar("keyword", "");
			if(trim($keyword) != "" && trim($keyword) != "Keyword..."){
				$and .= " and up.profile_value like '%".trim($keyword)."%'";
			}
			if($filteroptions == 0){
				$sql = "select u.id, u.name, u.username, u.email, u.registerDate, GROUP_CONCAT(CAST(ug.group_id AS CHAR)) as group_ids, up.profile_key, up.profile_value from #__users u, #__user_profiles up, #__user_usergroup_map ug where u.id=up.user_id and u.id=ug.user_id and up.profile_key='".$profile_key."' and up.profile_value <> '' ".$and." group by u.id";
				$db->setQuery($sql);
				$db->query();
				$result = $db->loadAssocList();
			}
			elseif($filteroptions == 1){
				$sql = "select u.id, u.name, u.username, u.email, u.registerDate, GROUP_CONCAT(CAST(ug.group_id AS CHAR)) as group_ids, up.profile_key, up.profile_value from #__users u, #__user_profiles up, #__user_usergroup_map ug where u.id=up.user_id and u.id=ug.user_id and up.profile_key='".$profile_key."' and up.profile_value = '' ".$and." group by u.id";
				$db->setQuery($sql);
				$db->query();
				$result = $db->loadAssocList();
			}
		}
		elseif($type == "radio" || $type == "list" || $type == "checkboxes"){
			$sql = "select u.id, u.name, u.username, u.email, u.registerDate, GROUP_CONCAT(CAST(ug.group_id AS CHAR)) as group_ids, up.profile_key, up.profile_value from #__users u, #__user_profiles up, #__user_usergroup_map ug where u.id=up.user_id and u.id=ug.user_id and up.profile_key='".$profile_key."' and up.profile_value='".$filteroptions."' group by u.id";
			$db->setQuery($sql);
			$db->query();
			$result = $db->loadAssocList();
		}
		elseif($type == "calendar"){
			$sql = "select u.id, u.name, u.username, u.email, u.registerDate, GROUP_CONCAT(CAST(ug.group_id AS CHAR)) as group_ids, up.profile_key, up.profile_value from #__users u, #__user_profiles up, #__user_usergroup_map ug where u.id=up.user_id and u.id=ug.user_id and up.profile_key='".$profile_key."' and up.profile_value='".$filteroptions."' group by u.id";
			$db->setQuery($sql);
			$db->query();
			$result = $db->loadAssocList();
		}
		return $result;
	}
	
	function search(){
		$field_id = JRequest::getVar("field_id", "");
		$filteroptions = JRequest::getVar("filteroptions", "");
		$db =& JFactory::getDBO();
		$sql = "select * from #__arra_users_profile where id=".intval($field_id);
		$db->setQuery($sql);
		$db->query();
		$result = $db->loadAssocList();
		$type = "";
		$profile_key = "";
		if(!isset($result["0"]["type"])){
			switch($field_id){
				case 'address1' : $type = "text"; $profile_key = "profile.address1";
					break;
				case 'address2' : $type = "text"; $profile_key = "profile.address2";
					break;
				case 'city' : $type = "text"; $profile_key = "profile.city";
					break;
				case 'region' : $type = "text"; $profile_key = "profile.region";
					break;
				case 'country' : $type = "text"; $profile_key = "profile.country";
					break;
				case 'postal_code' : $type = "text"; $profile_key = "profile.postal_code";
					break;
				case 'phone' : $type = "text"; $profile_key = "profile.phone";
					break;
				case 'website' : $type = "url"; $profile_key = "profile.website";
					break;
				case 'favoritebook' : $type = "text"; $profile_key = "profile.favoritebook";
					break;
				case 'aboutme' : $type = "textarea"; $profile_key = "profile.aboutme";
					break;
				case 'dob' : $type = "calendar"; $profile_key = "profile.dob";
					break;
			}
		}
		else{
			$type = $result["0"]["type"];
			$profile_key = "profile.".$result["0"]["name"];
		}
		$result = $this->getSearchUsers($field_id, $profile_key, $filteroptions, $type);
		$count = intval(count($result));
		if($count > 0){
			echo '<span style="font-size: 14px; color:green; font-weight: bold;">'.JText::_("ARRA_RESULT").': '.$count.' users</span>. <a style="font-size: 14px;" href="#" onclick="document.adminForm.task.value=\'export\'; document.adminForm.submit();">'.JText::_("ARRA_CLICK_HERE").'</a> <span style="font-size: 14px; color:green; font-weight: bold;">'.JText::_("ARRA_TO_EXPORT_RESULT").'</span>';
		}
		else{
			echo "<span style=\"font-size: 14px; color:red; font-weight: bold;\">No Result</span>";
		}
	}
	
	
	function export(){
		$db =& JFactory::getDBO();
		$field_id = JRequest::getVar("fields", "0");
		$sql = "select * from #__arra_users_profile where `field_id`='".trim($field_id)."'";
		$db->setQuery($sql);
		$db->query();
		$result = $db->loadAssocList();
		
		$filteroptions = JRequest::getVar("filteroptions", "0");
		$separator = JRequest::getVar("separator", ",");
		
		$type = "";
		$profile_key = "";
		if(!isset($result["0"]["type"])){
			switch($field_id){
				case 'address1' : $type = "text"; $profile_key = "profile.address1";
					break;
				case 'address2' : $type = "text"; $profile_key = "profile.address2";
					break;
				case 'city' : $type = "text"; $profile_key = "profile.city";
					break;
				case 'region' : $type = "text"; $profile_key = "profile.region";
					break;
				case 'country' : $type = "text"; $profile_key = "profile.country";
					break;
				case 'postal_code' : $type = "text"; $profile_key = "profile.postal_code";
					break;
				case 'phone' : $type = "text"; $profile_key = "profile.phone";
					break;
				case 'website' : $type = "url"; $profile_key = "profile.website";
					break;
				case 'favoritebook' : $type = "text"; $profile_key = "profile.favoritebook";
					break;
				case 'aboutme' : $type = "textarea"; $profile_key = "profile.aboutme";
					break;
				case 'dob' : $type = "calendar"; $profile_key = "profile.dob";
					break;
			}
		}
		else{
			$type = $result["0"]["type"];
			$profile_key = "profile.".$result["0"]["name"];
		}
		
		if($type == "calendar"){
			$filteroptions = JRequest::getVar("datefield", "0");
		}
		
		$data = $this->getSearchUsers($field_id, $profile_key, $filteroptions, $type);
		$content = "";
		$header = array();
		
		if(isset($data) && count($data) > 0){
			$header[] = "name";
			$header[] = "username";
			$header[] = "email";
			$header[] = "registerDate";
			$header[] = "usertype";
			$header[] = $data["0"]["profile_key"];
			$content .= implode($separator, $header)."\n";
			
			foreach($data as $key=>$value){
				$row = array();
				$row[] = $value["name"];
				$row[] = $value["username"];
				$row[] = $value["email"];
				$row[] = $value["registerDate"];
				$sql = "select ug.title from #__usergroups ug, #__users u, #__user_usergroup_map um where u.id=".intval($value["id"])." and u.id=um.user_id and um.group_id=ug.id";
				$db->setQuery($sql);
				$db->query();
				$result = array();
				if(intval(JVERSION) >= 3){
					$result = $db->loadColumn();
				}
				else{
					$result = $db->loadResultArray();
				}
				
				$row[] = implode("*", $result);
				$row[] = $value["profile_value"];
				$content .= implode($separator, $row)."\n";
			}
		}
		$content .= "\n";
		$content .= "*****"."\n";

		$sql = "select * from #__arra_users_profile where `field_id`='".trim($field_id)."'";
		$db->setQuery($sql);
		$db->query();
		$result = json_encode($db->loadAssocList());
		
		if(isset($result) && $result != 'null'){
			$content .= $profile_key."=>".$result;
		}
		
		$config = new JConfig();
		$html_filename = $config->db."_filters.csv";	
		header("Content-Type: application/x-msdownload");
		header("Content-Disposition: attachment; filename=".$html_filename);
		header("Pragma: no-cache");
		header("Expires: 0");
		echo utf8_decode($content);
		exit();
	}
};
?>