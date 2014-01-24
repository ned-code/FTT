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
require_once (JPATH_COMPONENT_ADMINISTRATOR.DS.'helpers'.DS.'SqlExport.php');
require_once (JPATH_COMPONENT_ADMINISTRATOR.DS.'helpers'.DS.'TxtImport.php');

/**
 * ArrausermigrateModelUtf Model
 *
 */
class ArrausermigrateModelUtf extends JModelLegacy{
	/**
	 * Constructor that retrieves the ID from the request
	 *
	 * @access	public
	 * @return	void
	 */
	function __construct(){		
		parent::__construct();
	}
		
	// return all types by users
	function getUserType(){
	    $db =& JFactory::getDBO();		
		$sql = "SELECT DISTINCT g.title as usertype
		        FROM #__users u, #__usergroups g, #__user_usergroup_map ugm
                WHERE u.id=ugm.user_id and ugm.group_id=g.id";
		$db->setQuery($sql);
		$result = $db->loadAssocList();

		return $result;
	}		
			 	
	//set settings for export(checked user type for export and file type)
	function getExport(){
		$task = JRequest::getVar("task", "");
		if($task != ""){
			$userType = array();
			$column = array();		
			$top_column_checkbox = JRequest::getVar("top_column_checkbox","","post","array");
			if(isset($top_column_checkbox)){
				$user_type_checkbox = JRequest::getVar("user_type_checkbox","EMPTY","post","array");			
				if(!in_array("EMPTY", $user_type_checkbox)){
					$userType = JRequest::getVar("user_type_checkbox","","post","array");
					if(isset($userType["No user type"])){
						$userType["No user type"] = "";		
					}		
				}
				else{
					$userType = "";
				}
				$column = JRequest::getVar("top_column_checkbox","","post","array"); 								
				$order = JRequest::getVar("ordering", "0", "post", "string");
				$mode_order = JRequest::getVar("mode_order", "0", "asc", "string");		
				$file_type = "csv";
				//set method for export
				$method = $file_type."Export";
				$result = $this->$method($userType , $column, $order, $mode_order);				
				return $result;
			}
		}
		else{
			return "";
		}	
	}
	
	//made a csv file
	function csvExport($userType, $column, $order="", $mode_order=""){	  	   
		$data = "";
        $all_groups = $this->getAllGroups();
		$where = " where 1=1 ";
		$header = "";
		$separator = JRequest::getVar("separator", ",", "post", "string");
		$split_name = JRequest::getVar("split_name", "no", "post", "string");
		$export_name = false; //if is true separate each name from result in first name and last name  	
		//set file header
        foreach($column as $key=>$value){
			//if is in columns for export name and if split the name
			if($value=="name" && $split_name != "no"){
				$header .= JText::_("ARRA_FIRST_NAME") . $separator . JText::_("ARRA_LAST_NAME") . $separator;
				$export_name = true;
			}
			else{
				if($value == "id"){
					$header = $value.$separator.$header;
				}
				else{
					$header .= $value . $separator;
				}
			}	 
        }
		
		$tables1 = "#__users ju";
		$tables2 = "";
		
		//remove last separator
		$header = substr($header, 0, strlen($header)-1);
		
		//complet criteria for select from database		
		if(is_array($userType)){
			$tables1 .= ", #__user_usergroup_map ugm, #__usergroups ug";
			$where .= " and ugm.group_id=ug.id and ugm.group_id in (select id from #__usergroups where title in (";
			foreach($userType as $key=>$value){
				$where .= "'" . $value . "',"; 
			}			
			$var = substr($where, 0, strlen($where)-1);
			$where = $var . ")) and ju.id=ugm.user_id";			
		}
		else{
			$where .= "";
		}		
		
		$db =& JFactory::getDBO();
		
	  	$columns = array();
		$profile_collumns = array();	
		$select_id = FALSE;  	
	  
		foreach($column as $key=>$value){
			if($value=="id" ||$value=="name" || $value=="username" || $value=="email" || $value=="password" || $value=="block" || $value=="registerDate" || $value=="lastvisitDate" || $value=="params" || $value=="activation"){
				if($value == "id"){
					$select_id = TRUE;
				}
				
				$columns[] = "ju.".$value;
				unset($column[$key]);
			}
			elseif($value=="usertype"){
				$where .= " and ju.id=ugm.user_id ";
				$columns[] = "GROUP_CONCAT(DISTINCT CAST(ugm.group_id as CHAR)) usertype_id";
				$tables2 = ", #__usergroups ug, #__user_usergroup_map ugm";
				$tables1 = "#__users ju";
				unset($column[$key]);
			}
			else{
				$profile_collumns[] = $value;
				unset($column[$key]);
			}
		}
		
		if(count($profile_collumns) > 0){
			$tables1 = "#__users ju LEFT JOIN #__user_profiles up ON ju.id=up.user_id";
			if(is_array($userType)){
				$tables1 .= ", #__user_usergroup_map ugm, #__usergroups ug";
				$tables2 = "";
				
			}
			$columns[] = "GROUP_CONCAT(CAST(up.profile_value as CHAR)) profile_values";
		}
		
		$ordering = "";		
		if($order != "" && $order != "0"){
			if($mode_order != ""){
				$ordering = " order by ".$order." ".$mode_order;
			}
			else{
				$ordering = " order by ".$order." asc";
			}	 
		}
					
		$sql = "SELECT ju.id, ".implode(",", $columns).
		        " FROM ".$tables1.$tables2." ".$where." group by ju.id ".$ordering;		
		$db->setQuery($sql);
		
		//die($sql);
		
		$result = $db->loadAssocList();
		
        $remove_header = JRequest::getVar("remove_header", "");		
		if($remove_header == ""){
			$data .= $header . "\n";
		}

		$exist = false;
		$row = array();
		if(is_array($result)){
			//for each row			
			foreach($result as $key=>$value){
				$next = true;
			    // for each column of row
				foreach($value as $key2=>$value2){
				    //if is in columns for export name and if split the name
					if($key2 == "id"){
						if(!$select_id){
							continue;
						}
					}
					if($export_name == true && $split_name != "no" && $next == true){
						$first_name = "";
						$last_name = "";
						$temp_array = explode(" ", $value2);						
						//if we can split name in first name and last name
						if(count($temp_array)>2){
							$last_name .= $temp_array[count($temp_array)-1];
							for($i=0; $i<count($temp_array)-1; $i++){
								$first_name .= $temp_array[$i] . " ";
							}
							$row[] = trim($first_name).$separator.trim($last_name);
						}
						elseif(count($temp_array)==2){
							$first_name = $temp_array[0];
							$last_name = $temp_array[1];
							$row[] = trim($first_name).$separator.trim($last_name);
						}
						else{
							$first_name .= $temp_array[0];
							$row[] = trim($first_name).$separator;
						}
						$next = false;
					}
					else{
						if($key2 == "usertype_id"){
							$row[] = $this->getGroupList($all_groups, trim($value2));
						}
						elseif($key2 == "params"){
							$params = str_replace("\r\n", "***", trim($value2));
							$row[] = $params;
						}
						elseif($key2 == "profile_values"){
							if(count($profile_collumns) > 0){
								$sql = "select profile_key, profile_value from #__user_profiles where user_id=".intval($value["id"])." and profile_key in ('".implode("', '", $profile_collumns)."')";
								$db->setQuery($sql);
								$db->query();
								$result_profile = $db->loadAssocList("profile_key");
								$profile_temp_array = array();
								if(isset($result_profile)){
									foreach($profile_collumns as $prof_key_temp=>$prof_value_temp){
										if(isset($result_profile[$prof_value_temp])){
											$value_from_database = json_decode($result_profile[$prof_value_temp]["profile_value"], true);
											if(is_array($value_from_database)){
												$value_from_database = json_encode($value_from_database);
											}
											$profile_temp_array[] = $value_from_database;
										}
										else{
											$profile_temp_array[] = '';
										}
									}
									$row[] = trim(implode($separator, $profile_temp_array));
								}	
							}
						}						
						else{
							$row[] = trim($value2);
						}
					}					
				}				
				//set true for next row
				$next = true;
				//remove last coma
				$temp = implode($separator, $row);
				//start new row				
				$data .= $temp."\n";					
				$row = "";			
			}			
		}		
		
		$data .= "\n*****";
		foreach($profile_collumns as $key=>$value){	
			$value = str_replace("profile.", "", $value);		
			$sql = "select * from #__arra_users_profile where name='".$value."'";
			$db->setQuery($sql);
			$db->query();
			$result = json_encode($db->loadAssocList());
			if(isset($result) && $result != NULL && $result != "[]"){
				$data .= "\n"."profile.".$value."=>".$result;
			}
		}
		
		return $data;	 
	}			
	
	//create a nuw file if not exist
	function mkfile($filename,$mode) { 
        if(!file_exists($filename)) { 
			$handle = fopen($filename,'w+'); 
			fclose($handle);
			chmod($filename,$mode); 
        } 
    } 

	//send mail to setings list
	function sendMail($data, $file_name, $list_emails){
	        $config = new JConfig();
			$recipient = array();
			$ok = false;
			$file_path = "";
			
			//if is not make directory then create	  
			if(!is_dir(JPATH_SITE .DS."administrator".DS."components".DS."com_arrausermigrate".DS."files")){
				mkdir(JPATH_SITE .DS."administrator".DS."components".DS."com_arrausermigrate".DS."files", 0777); 
			}
			//if file name exist, then set pathe for write in this file		 
			if(isset($file_name)){		
				$file_path = JPATH_SITE .DS."administrator".DS."components".DS."com_arrausermigrate".DS."files".DS. $file_name;
			}
				
			if(isset($data) && isset($file_name)){
				$g = fopen ($file_path, "w");
			}	
			if(fwrite ($g, $data)){
				$ok = true;
				fclose($g);
			}		    
			//if exist a list with emails
			if(isset($list_emails) && strlen($list_emails)>0){
			    $recipient = explode(',', $list_emails);
			}
			
			//verify if is set subject and body email
			$settings_saved = false;  
			$config = new JConfig();  	  
			$db =& JFactory::getDBO();
			$sql= "select params from #__extensions where name='option=com_arrausermigrate'";
			$db->setQuery($sql);
			$all_result = $db->loadResult();
			$result = "";	  
			
			if(strlen($all_result) != 0){
				$all_array = json_decode($all_result, true);			
				if(isset($all_array["JoomlaExport"]) && strlen(trim($all_array["JoomlaExport"]))>0){
					$result = $all_array["JoomlaExport"];			
				   $settings_saved = true;  
				}
				else{
				   $settings_saved = false;  
				}		
			}
			
			$from = "";
			$fromname = "";
			$subject = "";
			$body = "";
			
			if($settings_saved == false){
			   $from = $config->mailfrom;
			   $fromname = $config->fromname;						
			   $subject = "Users export from ".$config->sitename;
			   $body = "You will find attached the file with the users exported.";
			}
			else{
			   $from = $this->checked("from_email",$result);
			   $fromname = $this->checked("from_name",$result);
			   $subject = $this->checked("subject_template",$result);
			   $body = $this->checked("email_template",$result);
			}
			
			$mode = false;
			$attachment = $file_path; 
			
			$subject = nl2br($subject);
			
			if(intval(JVERSION) >= 3){
				JFactory::getMailer()->sendMail($from, $fromname, $recipient, $subject, $body, $mode, NULL, NULL, $attachment);
			}
			else{
				JUtility::sendMail($from, $fromname, $recipient, $subject, $body, $mode, NULL, NULL, $attachment);
			}
			
			//delete saved file from files folder
			if(is_file($file_path)){		
				unlink($file_path);				
			}		
	}
	
	function checked($element_name, $result){
	    $rows = explode(";", $result);
		foreach($rows as $key=>$value){
		     $value=explode("=", $value);
			 if($element_name == trim($value[0])){
			     return trim($value[1]);
			 }
		} 
	}
	
	function getAdditionalColumns(){
		$db =& JFactory::getDBO();
		$sql = "DESCRIBE #__users ";
		$db->setQuery($sql);
		$result = $db->loadAssocList();		
		$array_all_columns = array();
		 	 	 	 	 	 	 	 	 	 	
		foreach($result as $key=>$value){
			 if($value['Field'] != "id" && $value['Field'] != "name" && $value['Field'] != "username" && $value['Field'] != "email" && $value['Field'] != "password" && $value['Field'] != "usertype" && $value['Field'] != "block" && $value['Field'] != "sendEmail" && $value['Field'] != "registerDate" && $value['Field'] != "lastvisitDate" && $value['Field'] != "activation" && $value['Field'] != "params"){
				$array_all_columns[] = $value['Field'];
			 }	
		}
		return $array_all_columns;	
	}
	
	function import(){		
		//save in database all settings
		$separator = JRequest::getVar("separator",",","post","string");
		$overwrite_usertype = JRequest::getVar("same_user_option_radio_usertype","");
		$overwrite_password = JRequest::getVar("same_user_option_radio_password","","post","string");
		$overwrite_email = JRequest::getVar("same_user_option_radio_email","","post","string");
		$overwrite_block = JRequest::getVar("same_user_option_radio_block","","post","string");
		$overwrite_params = JRequest::getVar("same_user_option_radio_params","","post","string");
		$password_encripted = JRequest::getVar("encripted_password_radio","","post","string");
		$generate_password = JRequest::getVar("generate_password_radio","","post","string");		
		$subject_template = JRequest::getVar("subject_template","","post","string");
		$from_email = JRequest::getVar("from_email","","post","string");
		$from_name = JRequest::getVar("from_name","","post","string");
		$sitename = JRequest::getVar("sitename","","post","string");
		$email_template = JRequest::getVar("email_template","","post","string");
		$separator = JRequest::getVar("separator", ",", "post", "string");
		
		$db =& JFactory::getDBO();
		$sql = "select c.params from #__extensions c where c.element='com_arrausermigrate'";
	    $db->setQuery($sql);
	    $content = $db->loadResult();
		
		$all_array = array();		
		if($content != NULL && strlen(trim($content))>0){
			$all_array = json_decode($content, true);
		}
		
		$all_array["JoomlaImport"] =   "separator=".$separator."*".
									   "same_user_option_radio_usertype=".$overwrite_usertype."*".
									   "same_user_option_radio_password=".$overwrite_password."*".
									   "same_user_option_radio_email=".$overwrite_email."*".
									   "same_user_option_radio_block=".$overwrite_block."*".
									   "same_user_option_radio_params=".$overwrite_params."*".
									   "encripted_password_radio=".$password_encripted."*".
									   "generate_password_radio=".$generate_password."*".
									   "subject_template=".$subject_template."*".
									   "from_email=".$from_email."*".
									   "from_name=".$from_name."*".
									   "sitename=".$sitename."*".
									   "separator=".addslashes($separator)."*".
									   "email_template=".$email_template."*";									   				   
	    $sql = "update #__extensions c set params='".addslashes(json_encode($all_array))."' where c.element='com_arrausermigrate'";
		$db->setQuery($sql);
	    $db->query();		
		$message = "";
		$data = "";		
		
		$data = JRequest::getVar("file_content", "");
		$message = $this->csv_txtImport($data);
		return $message;		
	}
	
	function csv_txtImport($data){
		$txtImport = new TxtImport();
		//evidence for header line and body lines
		$i = "header";
		$columns_imported = array();
		$separator = JRequest::getVar("separator", ",", "post", "string");
		$group_map_aro_id = "";	
		$users_existent = array();
		$empty_columns = array();
		$all_user_type = $txtImport->getUserType();
		
		$rows = explode("\n", $data);
		$iterator = 0;
		if(isset($rows) && is_array($rows) && count($rows)>0){					
			while(isset($rows[$iterator]) && trim($rows[$iterator]) != ""){				   	    
				$temp_row = trim($rows[$iterator]);//line by line									
				//if is first line(header line)
				if($i == "header"){	
					//convert from UTF-8 to ANSI
					$temp_row = $temp_row;									
					if(strpos(trim($temp_row), $separator) == false){
						return "ERROR+".JText::_('ARRA_ERROR_UNKNOWN_SEPARATOR');
					}				
				
					$columns_imported = explode($separator, trim($temp_row));								
					$db =& JFactory::getDBO();
					$sql= "DESCRIBE #__users ";
					$db->setQuery($sql);
					$result = $db->loadAssocList();
					$array_all_columns = array();
					foreach($result as $key=>$value){
						 if($value['Field'] != "gid"){
							$array_all_columns[] = $value['Field'];
						 }	
					}
									
					$unknown_fields = array();
					if(count($array_all_columns)!=0){
						foreach($columns_imported as $key=>$value){
							 if(!in_array($value, $array_all_columns)){						    
								$unknown_fields[] = "'".$value."'";
							 }
						}
					}					
					if(isset($unknown_fields) && count($unknown_fields)!=0){
						$error_field_message = implode(",", $unknown_fields);
						return "ERROR+".JText::_('ARRA_ERROR_UNKNOWN_FIELDS').$error_field_message;
					}
									
					if(!in_array("name", $columns_imported) || !in_array("username", $columns_imported) || !in_array("email", $columns_imported)){
						return "ERROR+".JText::_('ARRA_ERROR_NO_NAME_USERNAME_EMAIL');
					}
					$default_password = JRequest::getVar("default_password","","post","string");
					$generate_password = JRequest::getVar("generate_password_radio","1","post","string");			
					if(!in_array("password", $columns_imported) && strlen(trim($default_password)) == 0 && $generate_password==1){
						return "ERROR+".JText::_('ARRA_NO_PASSWORD_DEFAULT_PASSWORD');
					}
					$i = "body";
				}
				//else if is a row(from body content)
				else{
					$user_id_from_database = "-1"; 
					$gid = array();
					$value = "";
					$usertype = ""; 
					$row = explode($separator, $temp_row);		
					//if user is not in database(imported new user)
					$user_id_from_database = $this->userExist($columns_imported, $row);
					if($user_id_from_database == -1){				
						$email = "";				
						//if email isn't already in databse
						if(in_array("email", $columns_imported)){ 
							$temp = array_keys($columns_imported, "email");
							$position = $temp[0];
							$email = trim($row[$position]);
						}					
						if($this->emailExist($email) == false){
							//verify if is imported usertype
							if(in_array("usertype", $columns_imported)){							
								$temp = array_keys($columns_imported, "usertype");
								$position = $temp[0];
								$usertype = trim($row[$position]);	
								//if insert a new usertype
								//check if the user is from more groups
								$user_groups = array();
								if(strpos(trim($row[$position]), "*") !== FALSE){
									$user_groups = explode("*", trim($row[$position]));
								}
								if(count($user_groups) == 0){
									$user_groups[] = trim($row[$position]);
								}
								if(count($user_groups) > 0){
									foreach($user_groups as $group_key=>$group_value){
										if(!in_array(trim($group_value), $all_user_type)){
											//if none set usertype then save default usertype in database
											if(trim($group_value) == ""){
												$usertype = JRequest::getVar("position","Registered","post","string");
												if(trim($usertype) == ""){
													$usertype = "Registered";
												}											
												//if default usertype exist in database
												if(!in_array($usertype, $all_user_type)){
													$gid[] = $txtImport->saveInGroup($usertype);
												}
												else{
													$gid[] = $txtImport->getIDUserType($usertype);
												}									
											}
											else{
												$usertype = trim($group_value);
												$gid[] = $txtImport->saveInGroup($usertype);									
											}
											$all_user_type[] = $usertype;
										}
										//if exist this user type
										else{
											//must be converted to Super User if is Super Admin
											$usertype = trim($group_value);
											$gid[] = $txtImport->getIDUserType($usertype);
										}//if	
									}//foreach								
								}//if																		  		    
							}
							else{							
								//set a new type of usertype
								$usertype = JRequest::getVar("position","Registered","post","string");
								if(trim($usertype) == ""){
									$usertype = "Registered";
								}
								//if default usertype is not in database
								if(!in_array(trim($usertype), $all_user_type)){
									$gid[] = $txtImport->saveInGroup($usertype);
								}
								//else if default type of usertype exist in database
								else{
									$gid[] = $txtImport->getIDUserType($usertype);
								}	  
							}						
							//change Super Administrator to Super Users
							$change_admin_users = JRequest::getVar("super_admin_users", "no");						
							if($change_admin_users == "yes"){
								if(in_array("usertype", $columns_imported)){
									$temp = array_keys($columns_imported, "usertype");
									$position = $temp[0];
									$row[$position] = "Super Users";
									$usertype = "Super Users";
									$gid = array();
									$gid[] = "8";
								}
							}
							//insert row in _users table							
							$value = $txtImport->saveUsers($columns_imported, $row, $usertype);														
							
							if(isset($value) && $value != ""){
								$txtImport->saveInUserGroupMap($value, $gid);
							}						
						}//if email not exist in database
						else{
							$users_existent[] = $temp_row;
						}
					}
					//else, if imported existing user
					else{					
						//make un update to existing user
						$update_message = $txtImport->updateUser($columns_imported, $row, $user_id_from_database, $all_user_type, array());
						if($update_message == "empty_column"){
							$empty_columns[] = $temp_row;
						}
					}	
					$temp = "";//reset line
				}//else
				$iterator ++;	
			}//while
		}//first if	
		
		$message_error1 = "";
		$message_error2 = "";
		if(count($users_existent)>0){
			$_SESSION['link_eror'] = "error";
			$file_path = JPATH_SITE .DS."administrator".DS."components".DS."com_arrausermigrate".DS."files".DS."error_same_email.csv";
			$g = fopen ($file_path, "w");
			$data = implode($separator, $columns_imported)."\n";
			foreach($users_existent as $key=>$value){
				$data .= trim($value)."\n"; 
			}					
			if(fwrite ($g, $data)){
				fclose($g);
			}
			$message_error1 .= "ERROR+".JText::_('ARRA_ERROR_MESSAGE_SAME_EMAIL');							
	    }
		if(count($empty_columns)>0){
			$_SESSION['error_empty_column'] = "error_empty_column";
			$file_path = JPATH_SITE .DS."administrator".DS."components".DS."com_arrausermigrate".DS."files".DS."error_empty_column.csv";
			$g = fopen ($file_path, "w");
			$data = implode($separator, $columns_imported)."\n";
			foreach($empty_columns as $key=>$value){
				$data .= trim($value)."\n"; 
			}					
			if(fwrite ($g, $data)){
				fclose($g);
			}
			$message_error2 .= "ERROR+".JText::_('ARRA_ERROR_MESSAGE_EMPTY_COLUMN');							
	    }
		
		if($message_error1 != "" && $message_error2 == ""){
			return $message_error1;
		}
		elseif($message_error1 == "" && $message_error2 != ""){
			return $message_error2;
		}
		elseif($message_error1 != "" && $message_error2 != ""){
			return $message_error1 . "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" . JText::_('ARRA_ERROR_MESSAGE_EMPTY_COLUMN');
		}
		else{
			return "OK+".JText::_('ARRA_UPLOADED_FILE'); 
		}	
	}
	
	function emailExist($email){
        $db =& JFactory::getDBO();
		$sql = "select id from #__users where email = '".$email."' limit 1";		
		$db->setQuery($sql);
		$result=$db->loadResult();
		if($result != NULL){
			return true;
		}
		else{
		    return false;
		}
	}
	
	function userExist($columns_imported, $row){
	      $db =& JFactory::getDBO();
		  $username = "";
		  $id = -1;		  
		  if(in_array("username", $columns_imported)){
			  $temp = array_keys($columns_imported, "username");
			  $position = $temp[0];
			  $username = trim($row[$position]);
		  }		 		  		
		  $sql = "SELECT id
		          FROM #__users
                  WHERE username = '".$username."'";
		  $db->setQuery($sql);
		  $id = $db->loadResult();
		  if($id == NULL){
		     return -1;
		  }
		  else{
		     return $id;
		  }	 
	}
	
	function getUserType2(){
	      $db =& JFactory::getDBO();
		  $sql = "SELECT title FROM #__usergroups ".
				 "WHERE title IN ('Registered') ".
				 "UNION ALL ". 
				 "SELECT title FROM #__usergroups ". 
				 "WHERE (title <> 'Registered')";  
		  $db->setQuery($sql);
		  $result = $db->loadAssocList();
		  return $result; 
	}
	
	function getGroupList($all_groups, $ids){
		$id_array = explode(",", $ids);
		$group_list = array();
		foreach($id_array as $key=>$value){
			$group_list[] = $all_groups[$value]["title"];
		}
		$return  = implode("*", $group_list);
		return $return;
	}
	
	function getAllGroups(){
		$db =& JFactory::getDBO();
		$sql = "select title, id from #__usergroups";
		$db->setQuery($sql);
		$db->query();
		$result = $db->loadAssocList("id");
		return $result;	
	}
	
	function getUserProfileFields(){
		$db =& JFactory::getDBO();
		$sql = "SELECT distinct(concat('profile.', `name`)) as profile_key FROM `#__arra_users_profile`";
		$db->setQuery($sql);
		$db->query();
		$result = $db->loadAssocList();
		$result[]["profile_key"] = "profile.aboutme";
		$result[]["profile_key"] = "profile.dob";
		$result[]["profile_key"] = "profile.favoritebook";
		$result[]["profile_key"] = "profile.phone";
		$result[]["profile_key"] = "profile.website";
		$result[]["profile_key"] = "profile.country";
		$result[]["profile_key"] = "profile.postal_code";
		$result[]["profile_key"] = "profile.region";
		$result[]["profile_key"] = "profile.address2";
		$result[]["profile_key"] = "profile.city";
		$result[]["profile_key"] = "profile.address1";		
		return $result;
	}
}

?>