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
 * file: TxtImport.php
 *
 **** class 
     TxtImport 
	 
 **** functions
     __construct();
	 getUserType();
	 saveInUserGroupMap
	 saveInGroup();
	 saveUsers();
	 sendEmail();
	 getIDUserType();
	 saveInGroupsAroMap();
	 updateUser();
	 generatePassword();
	 processText();
 */

// No direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

/**
 * TxtImport class
 */
class TxtImport{
     /**
	 * @access	public
	 * @return	void
	 */
	function __construct(){		
	}
	
	//return all users type
	function getUserType(){	
	    $db =& JFactory::getDBO();		
		$sql = "SELECT DISTINCT title
				FROM #__usergroups";
		$db->setQuery($sql);
		$result = array();
		if(intval(JVERSION) >= 3){
			$result = $db->loadColumn();
		}
		else{
			$result = $db->loadResultArray();
		}
		
		return $result;
	}
	
	//save datas in datrabase
	function saveInUserGroupMap($user_id, $gid){		
		$db =& JFactory::getDBO();
		$sql = "";
		if(isset($gid) && is_array($gid) && count($gid)>0){
			foreach($gid as $key=>$value){
				$sql  = "insert into #__user_usergroup_map(`user_id`, `group_id` ) values (";
				$sql .= $user_id.", ".$value.")";
				$db->setQuery($sql);
				$db->query();
			}
		}
	}
	
	//get usertype's id
	function getIDUserType($usertype){
	    $id = "";
	    $db =& JFactory::getDBO();		
		$sql = "SELECT id
				FROM #__usergroups
				WHERE title = '".$usertype."' limit 1";
		$db->setQuery($sql);
		$id .= $db->loadResult();
		return $id;
	}
		
	//save row in _users table
	function saveUsers($columns_imported, $row, $usertype, $fields_details, $gid){
		$sql = "";
		$position = "";
		$db =& JFactory::getDBO();
		//name and username is for last select, for return id.
		$id = "";
		$username = "";
		$name = "";
		$password = "";
		$email = "";		
		
		if($columns_imported["0"] == "id"){
			$sql .= "insert into #__users(`id`, `name`, `username`, `email`, `password`, `block`, `sendEmail`, `registerDate`, `lastvisitDate`, `activation`, `params`) values (";
		}
		else{
			$sql .= "insert into #__users(`name`, `username`, `email`, `password`, `block`, `sendEmail`, `registerDate`, `lastvisitDate`, `activation`, `params`) values (";
		}
		
		if(in_array("id", $columns_imported)){
			$temp = array_keys($columns_imported, "id");
			$position = $temp["0"];
			$sql .= "".intval(trim($row[$position])).", ";
			$id = trim($row[$position]);
			unset($columns_imported[$position]);
		}
		
		if(in_array("name", $columns_imported)){
			$temp = array_keys($columns_imported, "name");
			$position = $temp[0];
			$sql .= "'".addslashes(trim($row[$position]))."', ";
			$name .= trim($row[$position]);
			unset($columns_imported[$position]);
		}
		
		if(in_array("username", $columns_imported)){
			$temp = array_keys($columns_imported, "username");
			$position = $temp[0];			
			$sql .= "'".addslashes(trim($row[$position]))."', ";
			$username .= trim($row[$position]);
			unset($columns_imported[$position]);
		}
		
		if(in_array("email", $columns_imported)){
			$temp = array_keys($columns_imported, "email");
			$position = $temp[0];
			$sql .= "'".addslashes(trim($row[$position]))."', ";
			$email .= trim($row[$position]);
			unset($columns_imported[$position]);
		}
		
		if(in_array("password", $columns_imported)){
			$temp = array_keys($columns_imported, "password");
			$position = $temp[0];
			$encripted_password = JRequest::getVar("encripted_password_radio","1","string");
			
			if($encripted_password != 0){
			    if(trim($row[$position]) == ""){
				    $default_password = JRequest::getVar("default_password","","string");				   
					$sql .= "'".$this->encriptPassword(trim($default_password))."', ";
				}
				else{	
					$sql .= "'".$this->encriptPassword(trim($row[$position]))."', ";
				}	
			}
			else{
				if(trim($row[$position]) == ""){
				    $default_password = JRequest::getVar("default_password","","string");
					if($default_password != ""){			   
						$sql .= "'".trim($default_password)."', ";
					}
					else{
						$password_gen = $this->generatePassword();
						$sql .= "'".$this->encriptPassword(trim($password_gen))."', ";
					}	
				}
				else{	
					$sql .= "'".trim($row[$position])."', ";			
				}
			}
			if(trim($row[$position]) == ""){
				$default_password = JRequest::getVar("default_password","","string");
				if($default_password != ""){			   
					$password .= trim($default_password);
				}
				else{
					$password_gen = $this->generatePassword();
					$password .= trim($password_gen);
				}	
			}
			else{	
				$password .= trim($row[$position]);			
			}
			unset($columns_imported[$position]);
		}
		else{
			$default_password = JRequest::getVar("default_password","","string");
			$generate_password = JRequest::getVar("generate_password_radio","1","string");
			$encripted_password = JRequest::getVar("encripted_password_radio","1","string");
			 //if generate new password
			if($default_password != ""){
				if($encripted_password != 0){
					$sql .= "'".$this->encriptPassword(trim($default_password))."', ";
				}
				else{
					$sql .= "'".trim($default_password)."', ";
				}	
				$password .= trim($default_password);			 
			}
			else{
				if($generate_password != 1){
					$password .= $this->generatePassword();
					if($encripted_password != 0){
						$sql .= "'".$this->encriptPassword(trim($password))."', ";
					}
					else{
					 	$sql .= "'".trim($password)."', ";
					}
				}
			}			 
		}
		
		if(in_array("block", $columns_imported)){
			$temp = array_keys($columns_imported, "block");
			$position = $temp[0];
			if(trim($row[$position]) != ""){
				$sql .= trim($row[$position]).", ";
			}
			else{
				$sql .= "0".", ";
			}
			unset($columns_imported[$position]);
		}
		else{
			$sql .= "0".", ";
		}
		
		if(in_array("sendEmail", $columns_imported)){
			$temp = array_keys($columns_imported, "sendEmail");
			$position = $temp[0];
			if(trim($row[$position]) != ""){
				$sql .= trim($row[$position]).", ";
			}
			else{
				$sql .= "0".", ";
			}
			unset($columns_imported[$position]);
		}
		else{
			$sql .= "0".", ";
		}				
		
		if(in_array("registerDate", $columns_imported)){
			$temp = array_keys($columns_imported, "registerDate");
			$position = $temp[0];
			$temp_date = strtotime($row[$position]);
			$row[$position] = date("Y-m-d G:i:s", $temp_date);
			if(trim($row[$position]) != ""){
				$sql .= "'".trim($row[$position])."', ";
			}
			else{
				$date = date("Y-m-d G:i:s");
				$sql .= "'".$date."', ";
			}
			unset($columns_imported[$position]);
		}
		else{
			$date = date("Y-m-d G:i:s");
			$sql .= "'".$date."', ";
		}
		
		if(in_array("lastvisitDate", $columns_imported)){
			$temp = array_keys($columns_imported, "lastvisitDate");
			$position = $temp[0];
			$temp_date = strtotime($row[$position]);
			$row[$position] = date("Y-m-d G:i:s", $temp_date);
			if(trim($row[$position]) != ""){
				$sql .= "'".trim($row[$position])."', ";
			}
			else{
				$sql .= "'0000-00-00 00:00:00', ";
			}
			unset($columns_imported[$position]);
		}
		else{
			$sql .= "'0000-00-00 00:00:00', ";
		}
		
		if(in_array("activation", $columns_imported)){
			$temp = array_keys($columns_imported, "activation");
			$position = $temp[0];
			if(strlen($row[$position]) == 0){
				$sql .= "'', ";
			}
			else{
				$sql .= "'".trim($row[$position])."', ";
			}	
			unset($columns_imported[$position]); 
		}
		else{
			$sql .= "'', ";
		}
		
		if(in_array("params", $columns_imported)){
			$temp = array_keys($columns_imported, "params");
			$position = $temp[0];	
			if(strlen($row[$position]) == 0){
				$sql .= "''" . ", ";
			}
			else{
				$sql .= "'".str_replace("***", "\r\n", trim($row[$position]))."', ";
			}		 
			unset($columns_imported[$position]);
		}
		else{
			$sql .= "'', ";
		}
		
		$sql = substr($sql, 0, strlen($sql)-2);
		$sql .= ")";
		
		$db->setQuery($sql);
		if($db->query()){
			$sql = "SELECT `id` ".
					"FROM #__users ".
					"WHERE `name` = '".addslashes(trim($name))."' and `username` = '".addslashes(trim($username))."' ".
					"LIMIT 1";
			$db->setQuery($sql);
			$id = $db->loadResult();
			
			// start save new user in contacts component
			$add_in_contacts = JRequest::getVar("add_in_contacts", "0");
			if($add_in_contacts == 1){
				$current_user = JFactory::getUser();
				$current_user_id = $current_user->id;
				$category = JRequest::getVar("default_contacts_category", "");
				$autopublish = JRequest::getVar("autopublish", "0");
				$sql = "insert into #__contact_details (`name`, `alias`, `email_to`, `published`, `user_id`, `catid`, `access`, `language`, `created`, `created_by`) values ('".addslashes(trim($name))."', '".addslashes(JFilterOutput::stringURLSafe(trim($name)))."', '".addslashes(trim($email))."', '".intval($autopublish)."', '".intval($id)."', '".intval($category)."', '1', '*', '".date("Y-m-d H:i:s")."', '".intval($current_user_id)."')";
				$db->setQuery($sql);
				$db->query();
			}
			// stop save new user in contacts component
			
			//if is set to send email to new users
			if(JRequest::getVar("send_email_to_import","1","string") != "1" && JRequest::getVar("encripted_password_radio","1","string") == "1"){	 
				if(isset($gid) && is_array($gid) && count($gid) > 0){
					$sql = "select `title` from #__usergroups where `id` in (0, ".implode(", ", $gid).")";
					$db->setQuery($sql);
					$db->query();
					$result = array();
					if(intval(JVERSION) >= 3){
						$result = $db->loadColumn();
					}
					else{
						$result = $db->loadResultArray();
					}
					
					if(isset($result) && count($result) > 0){
						$usertype = implode(", ", $result);
					}
				}
				$this->sendEmail($name, $username, $email, $password, $usertype);
			}			
		}
		
		if(count($columns_imported) > 0){
			$default_fields_joomla = $this->getDefaultJoomlaFields();
			foreach($columns_imported as $key=>$value){
				if($value != "usertype"){
					$sql  = "insert into #__user_profiles (`user_id`, `profile_key`, `profile_value`) values (";
					$sql .= $id.", '".$value."', "."'".addslashes(trim($row[$key]))."'";
					$sql .= ")";
					$db->setQuery($sql);
					if($db->query()){
						if(!in_array($value, $default_fields_joomla)){
							$field_details = json_decode($fields_details[$value], true);
							$field_details = $field_details["0"];
							$name = addslashes(trim($field_details->name));
							$type = addslashes(trim($field_details->type));
							$field_id = addslashes(trim($field_details->field_id));
							$description = addslashes(trim($field_details->description));
							$filter = addslashes(trim($field_details->filter));
							$label = addslashes(trim($field_details->label));
							$message = addslashes(trim($field_details->message));
							$cols = trim($field_details->cols) != "" ? trim($field_details->cols) : "0";
							$rows = trim($field_details->rows) != "" ? trim($field_details->rows) : "0";
							$option = addslashes(trim($field_details->option)) != "" ? addslashes(trim($field_details->option)) : "";
							$size = trim($field_details->size) != "" ? trim($field_details->size) : "0";
							if(trim($field_id) != "" && !$this->existFieldProfile($field_id)){
								$sql = "insert into #__arra_users_profile(`name`, `type`, `field_id`, `description`, `filter`, `label`, `message`, `cols`, `rows`, `option`, `size`) values ('".$name."', '".$type."', '".$field_id."', '".$description."', '".$filter."', '".$label."', '".$message."', ".$cols.", ".$rows.", '".$option."', ".$size.")";
								$db->setQuery($sql);
								$db->query();
							}
						}
					}
				}
			}			
		}		
		return $id;
	}
	
	function existFieldProfile($field_id){
		$db =& JFactory::getDBO();
		$sql = "select count(*) from #__arra_users_profile where field_id = '".$field_id."'";
		$db->setQuery($sql);
		$db->query();
		$result = $db->loadResult();
		if($result == "0"){
			return false;
		}
		return true;
	}
	
	function getDefaultJoomlaFields(){
		$fields = array("profile.aboutme", "profile.address1", "profile.address2", "profile.city", "profile.country", "profile.dob", "profile.favoritebook", "profile.phone", "profile.postal_code", "profile.region", "profile.tos", "profile.website");
		return $fields;
	}
	
	function rebuildGroups($parent_id = 0, $left = 0){
		// get the database object
		$db = JFactory::getDBO();
		// get all children of this node
		$db->setQuery(
			'SELECT id FROM #__usergroups' .
			' WHERE parent_id='. (int)$parent_id .
			' ORDER BY parent_id, title'
		);
		$children = $db->loadColumn();
		// the right value of this node is the left value + 1
		$right = $left + 1;
		// execute this function recursively over all children
		for ($i=0,$n=count($children); $i < $n; $i++){
			// $right is the current right value, which is incremented on recursion return
			$right = $this->rebuildGroups($children[$i], $right);
			// if there is an update failure, return false to break out of the recursion
			if ($right === false) {
				return false;
			}
		}
		// we've got the left value, and now that we've processed
		// the children of this node we also know the right value
		$db->setQuery(
			'UPDATE #__usergroups' .
			' SET lft='. (int)$left .', rgt='. (int)$right .
			' WHERE id='. (int)$parent_id
		);
		// if there is an update failure, return false to break out of the recursion
		if (!$db->query()) {
			return false;
		}
		// return the right value of this node + 1
		return $right + 1;
	}
	
	function saveInGroup($usertype=""){		
	      $parent_id = "1";
		  $gid = "";
		  $db =& JFactory::getDBO();
		  //insert in database new user group
		  if($usertype != ""){
				$sql = "insert into #__usergroups(`parent_id`, `lft`, `rgt`, `title`)
						values(".$parent_id.", 0, 0, '".trim(addslashes($usertype))."')";
		  }		  		 		  
		  $db->setQuery($sql);
		  if($db->query()){
		  		//rebuild groups
				$this->rebuildGroups(1);	
				//id selected will be gid in _users table
				$sql = "SELECT id
						FROM #__usergroups
						WHERE title = '".trim(addslashes($usertype))."' limit 1";						  
				$db->setQuery($sql);
				$gid .= $db->loadResult();
		  }
		  else{
		     echo "ERROR: saveInGroup";
		  }
		  return $gid;
	}
	
	function sendEmail($name, $username, $email, $password, $usertype){
		$recipient = array();
		$recipient[] = $email;
		$from = JRequest::getVar("from_email", "", "string");
		$fromname = JRequest::getVar("from_name", "", "string");
		$sitename = JRequest::getVar("sitename", "", "string");
		$subject_mambot = JRequest::getVar("subject_template", "", "string");
		$body_mambot = JRequest::getVar("email_template", "", "post", "string", JREQUEST_ALLOWHTML);
		
		$subject_procesed = $this->processText($subject_mambot, $name, $username, $password, $usertype, $email, $from, $fromname, $sitename); 
		$body_procesed = $this->processText($body_mambot, $name, $username, $password, $usertype, $email, $from, $fromname, $sitename);
		$body_procesed = nl2br($body_procesed);
		
		$mode = true;
		if(intval(JVERSION) >= 3){
			JFactory::getMailer()->sendMail($from, $fromname, $recipient, $subject_procesed, $body_procesed, $mode);
		}
		else{
			JUtility::sendMail($from, $fromname, $recipient, $subject_procesed, $body_procesed, $mode);
		}
	}
	
	function processText($text, $name, $username, $password, $usertype, $email, $from, $fromname, $sitename){		 
		if(preg_match("/{name}/", $text) ){
			$text = str_replace("{name}", $name, $text);
		}
		if(preg_match("/{username}/", $text) ){
			$text = str_replace("{username}", $username, $text);
		}
		if(preg_match("/{email}/", $text) ){
			$text = str_replace("{email}", $email, $text);
		}
		if(preg_match("/{password}/", $text) ){
			$text = str_replace("{password}", $password, $text);
		}
		if(preg_match("/{usertype}/", $text) ){
			$text = str_replace("{usertype}", $usertype, $text);
		}
		if(preg_match("/{from_name}/", $text) ){
			$text = str_replace("{from_name}", $fromname, $text);
		}
		if(preg_match("/{sitename}/", $text) ){
			$text = str_replace("{sitename}", $sitename, $text);
		}
		if(preg_match("/{from_email}/", $text) ){
			$text = str_replace("{from_email}", $from, $text);
		}
		return $text;
	}
	
	function updateUser($columns_imported, $row, $user_id_from_database, $all_user_type, $fields_details){								        
			$db =& JFactory::getDBO();
			$changes_array = array();
			$aro_id = ""; 
			$group_id = "";
			$change_all = JRequest::getVar("same_user_option_checkbox","no","string");
		    $sql = "";
		    $sql .= "update #__users set ";
			$change_usertype_or_gid = false; // if change usertype then doesn't change gid and viceversa			
			$email = "";
			$username = "";
			$password = "";
			$error_row = false;
			$gid = "";
			$usertype_list = "";		
			
			if(in_array("password", $columns_imported)){
				$position = "";
				$encripted_password = JRequest::getVar("encripted_password_radio","1","string");
				//not change all, but if $change_password is checked then change the password
				if($change_all == "no"){
					$change_password = JRequest::getVar("same_user_option_radio_password","1","string");
					//if change password
					if(isset($change_password) && $change_password == 0){
						$temp = array_keys($columns_imported, "password");
						$position = $temp[0];						  
						if($encripted_password != 0){
						    if(trim($row[$position]) != ""){
								$changes_array[] = " password='".$this->encriptPassword(trim($row[$position]))."' ";
								$password = trim($row[$position]);
							}
							else{
								$error_row = true;
							}
						}
						else{
							if(trim($row[$position]) != ""){
								$changes_array[] = " password='".trim($row[$position])."' ";
								$password = trim($row[$position]);
							}
							else{
							   $error_row = true;
							}
						}					  
					}					 
				}
				else{
					$temp = array_keys($columns_imported, "password");
					$position = $temp[0];
					if($encripted_password != 0){
						if(trim($row[$position]) != ""){
							$changes_array[] = " password='".$this->encriptPassword(trim($row[$position]))."' ";
							$password = trim($row[$position]);
						}
						else{
							$error_row = true;
						}
					}
					else{
						if(trim($row[$position]) != ""){
							$changes_array[] = " password='".trim($row[$position])."' ";
							$password = trim($row[$position]);
						}
						else{
						   $error_row = true;
						}
					}
				}
				unset($columns_imported[$position]);				 	 			 
			}			
			
			if(in_array("name", $columns_imported)){
				$position = "";
				if($change_all != "no"){					
					$temp = array_keys($columns_imported, "name");
					$position = $temp[0];				
					if(trim($row[$position]) != ""){
						$changes_array[] = " name='".addslashes(trim($row[$position]))."' ";
						$password = trim($row[$position]);
					}
					else{
					   $error_row = true;
					}
				}
				unset($columns_imported[$position]);					 	 			 
			}
			
			if(in_array("usertype", $columns_imported)){
				$db =& JFactory::getDBO();				 				  
				$position = "";
				//not change all, but if $change_password is checked then change the password
				if($change_all == "no"){
					$change_usertype = JRequest::getVar("same_user_option_radio_usertype","1","string");
					//if change password
					if(isset($change_usertype) && $change_usertype == 0){
						$temp = array_keys($columns_imported, "usertype");							
						$position = $temp[0];							
						$usertype_list = trim($row[$position]);											  
					}													
				}
				else{
					$temp = array_keys($columns_imported, "usertype");							
					$position = $temp[0];							
					$usertype_list = trim($row[$position]);
				}
				unset($columns_imported[$position]);		 			 
			}
			
			if(in_array("block", $columns_imported)){
				$position = "";
				if($change_all == "no"){
					$change_block = JRequest::getVar("same_user_option_radio_block","1","string");
					//if change password
					if(isset($change_block) && $change_block == 0){
						$temp = array_keys($columns_imported, "block");
						$position = $temp[0];
						if(trim($row[$position]) != ""){
							$changes_array[] = " block=".trim($row[$position])." ";
						}
						else{
							$error_row = true;
						}	
					}
				}
				else{
					$temp = array_keys($columns_imported, "block");
					$position = $temp[0];
					if(trim($row[$position]) != ""){
						$changes_array[] = " block=".trim($row[$position])." ";
					}
					else{
						$error_row = true;
					}	
				}
				unset($columns_imported[$position]);				 
			}
			
			if(in_array("email", $columns_imported)){
				$position = "";
				if($change_all == "no"){
					$change_email = JRequest::getVar("same_user_option_radio_email","1","string");
					if(isset($change_email) && $change_email == 0){
						$temp = array_keys($columns_imported, "email");
						$position = $temp[0];
						if(trim($row[$position]) != ""){
							$changes_array[] = " email='".addslashes(trim($row[$position]))."' ";
						}
						else{
							$error_row = true;
						}
					}
				}
				else{
					$temp = array_keys($columns_imported, "email");
					$position = $temp[0];
					if(trim($row[$position]) != ""){
						$changes_array[] = " email='".addslashes(trim($row[$position]))."' ";
					}
					else{
						$error_row = true;
					}	
				}
				unset($columns_imported[$position]);			 
			}
			
			if(in_array("sendEmail", $columns_imported)){
				$position = "";
				if($change_all != "no"){
					$temp = array_keys($columns_imported, "sendEmail");
					$position = $temp[0];
					if(trim($row[$position]) != ""){
						$changes_array[] = " sendEmail=".trim($row[$position])." ";
					}
					else{
						$error_row = true;
					}
				}
				unset($columns_imported[$position]);	  
			}
						
			if(in_array("registerDate", $columns_imported)){
				$position = "";
				if($change_all != "no"){
					$temp = array_keys($columns_imported, "registerDate");
					$position = $temp[0];
					if(trim($row[$position]) != ""){
						$changes_array[] = " registerDate='".trim($row[$position])."' ";
					}
					else{
						$error_row = true;
					}	
				}
				unset($columns_imported[$position]);	  
			}
			
			if(in_array("lastvisitDate", $columns_imported)){
				$position = "";
				if($change_all != "no"){
					$temp = array_keys($columns_imported, "lastvisitDate");
					$position = $temp[0];
					$temp_date = strtotime($row[$position]);
					$row[$position] = date("Y-m-d G:i:s", $temp_date);
					if(trim($row[$position]) != ""){
						$changes_array[] = " lastvisitDate='".trim($row[$position])."' ";
					}
					else{
						$error_row = true;
					}	
				}
				unset($columns_imported[$position]);	  
			}
			
			if(in_array("activation", $columns_imported)){
				$position = "";
				if($change_all != "no"){
					$temp = array_keys($columns_imported, "activation");
					$position = $temp[0];
					$changes_array[] = " activation='".trim($row[$position])."' ";
				}
				unset($columns_imported[$position]);	  
			}
						
			if(in_array("params", $columns_imported)){
				$position = "";
				if($change_all == "no"){
					$change_params = JRequest::getVar("same_user_option_radio_params","1","string");
					if(isset($change_params) && $change_params == 0){
						$temp = array_keys($columns_imported, "params");
						$position = $temp[0];
						if(trim($row[$position]) != ""){
							$changes_array[] = " params='".addslashes(str_replace("***", "\r\n", trim($row[$position])))."' ";
						}
						else{
							$error_row = true;
						}
					}
				}
				else{
					$temp = array_keys($columns_imported, "params");
					$position = $temp[0];
					if(trim($row[$position]) != ""){
						$changes_array[] = " params='".addslashes(str_replace("***", "\r\n", trim($row[$position])))."' ";
					}
					else{
						$error_row = true;
					}	
				}
				unset($columns_imported[$position]);				 
			}
								
			//make update
			if(is_array($changes_array) && !empty($changes_array)){				
				if($error_row==false){
					$changes = implode(",", $changes_array);
					$sql .= $changes. "where id=".$user_id_from_database;					
					$db->setQuery($sql);
					if($db->query() && trim($usertype_list) != ""){
						$this->updateUsertype($user_id_from_database, $usertype_list, $all_user_type);
					}
				}	
			}
			elseif(trim($usertype_list) != ""){
				$this->updateUsertype($user_id_from_database, $usertype_list, $all_user_type);
			}			
			
			if(count($columns_imported) > 0){
				foreach($columns_imported as $key=>$value){
					if(trim($value) != "username"){
						if($this->existProfileValue($user_id_from_database, $value)){
							$sql = "update #__user_profiles set profile_value='".addslashes(trim($row[$key]))."' where user_id=".intval($user_id_from_database)." and profile_key='".trim($value)."'";
						}
						else{
							$sql = "insert into #__user_profiles (`user_id`, `profile_key`, `profile_value`, `ordering`) values (".intval($user_id_from_database).", '".addslashes(trim($value))."', '".addslashes(trim($row[$key]))."', 0)";
						}
						$db->setQuery($sql);
						$db->query();
					}
				}
			}
			
			if($error_row==true){
				return "empty_column";
			}
			else{
				return "column_ok";
			}
	}//end function
	
	function existProfileValue($user_id, $key){
		$db =& JFactory::getDBO();
		$sql = "select count(*) from #__user_profiles where user_id=".intval($user_id)." and profile_key='".trim($key)."'";
		$db->setQuery($sql);
		$db->query();
		$result = $db->loadResult();
		if($result == "0"){
			return false;
		}
		return true;
	}
	
	//generate a string that will be the password
	function generatePassword(){
		$chars_array = array("A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z");
		$format_array = array("strtolower", "strtoupper");
		$password = "";
		//generate 6 charaters
		for($i=0; $i<3; $i++){
			$format = $format_array[rand(0,1)];
			$password .= rand(0,9);			 
			$password .= $format($chars_array[rand(0, 25)]);
		}
		return $password;		 
	}
	
	function updateUsertype($user_id, $usertype_list, $all_user_type){
		//saveInGroup($usertype)
		$db =& JFactory::getDBO();
		$user_type_array = explode("*", $usertype_list);
		$for_select = array();
		foreach($user_type_array as $key=>$value){
			if(trim($value) != ""){
				$for_select[] = "'".addslashes(trim($value))."'";
			}
		}
		$sql = "select id, title from #__usergroups where title in (".implode(",", $for_select).")";
		$db->setQuery($sql);
		$db->query();		
		$user_list_id = $db->loadAssocList("title");
		$sql = "delete from #__user_usergroup_map where user_id=".$user_id;
		$db->setQuery($sql);
		$db->query();
		foreach($user_type_array as $key=>$value){
			if(in_array($value, $all_user_type)){
				$sql = "insert into #__user_usergroup_map(`user_id`, `group_id`) values (".$user_id.", ".$user_list_id[$value]["id"].")";
			}
			else{
				$usertype_id = $this->saveInGroup($value);
				$sql = "insert into #__user_usergroup_map(`user_id`, `group_id`) values (".$user_id.", ".$usertype_id.")";
			}
			$db->setQuery($sql);
			$db->query();
		}
	}
	
	function encriptPassword($password){
		$salt = "";
		for($i=0; $i<=32; $i++) {
			$d = rand(1,30)%2;
		  	$salt .= $d ? chr(rand(65,90)) : chr(rand(48,57));
	   	}		
		$hashed = md5($password.$salt);
		$encrypted = $hashed.':'.$salt;
		return $encrypted;
	}
	
}//end class

?>