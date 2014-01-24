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
 * file: import.php
 *
 **** class 
     ArrausermigrateModelImport 
	 
 **** functions
     __construct();
	 import();
	 sql_zipImport();
	 collback();
	 saveOldSuperAdministrator();
	 existSuperAdmin();
	 existRowUsers();
	 existRowGroups();	 
	 csv_txtImport();
	 emailExist();	 
	 userExist();	 
	 getUserType();		 
	 mkfile();
	 backUp();
 */

// No direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.application.component.model');
require_once (JPATH_ADMINISTRATOR.DS.'components'.DS.'com_arrausermigrate'.DS.'helpers'.DS.'TxtImport.php');
require_once (JPATH_ADMINISTRATOR.DS.'components'.DS.'com_arrausermigrate'.DS.'helpers'.DS.'SqlExport.php');

/**
 * ArrausermigrateModelImport Model
 */
class ArrausermigrateModelImport extends JModelLegacy{
	/**
	 * @access	public
	 * @return	void
	 */
	function __construct(){		
		parent::__construct();
	}
	
	//set method for import end validate uploaded file
	function import(){
		//save in database all settings
		$separator = JRequest::getVar("separator",",","post","string");
		$overwrite_usertype = JRequest::getVar("same_user_option_radio_usertype","","post","string");
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
		$email_template = JRequest::getVar("email_template", "", "post", "string", JREQUEST_ALLOWHTML);
		$separator = JRequest::getVar("separator", ",", "post", "string");
		
		$db =& JFactory::getDBO();
		$sql = "select c.params from #__extensions c where c.element='com_arrausermigrate'";
	    $db->setQuery($sql);
	    $content = $db->loadResult();
		
		$all_array = array();		
		if($content != NULL && strlen(trim($content))>0 && trim($content) != "{}"){
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
		
		$file = JRequest::getVar('sqlzip_file_upload', NULL, 'files', 'array');
		if($file['name'] != ""){
			$file = JRequest::getVar('sqlzip_file_upload', NULL, 'files', 'array');
		}
		else{
			$file = JRequest::getVar('csvtxt_file_upload', NULL, 'files', 'array');
		}
		
		$fileNameOnClientPc = $file['name'];
		$fileNameOnServer = $file['tmp_name'];		 
		 
		$message = "";
		$data = "";		
			    
	    if (strlen($fileNameOnClientPc) == 0){
			$message = "ERROR+".JText::_('ARRA_ERROR_NO_FILE_TO_UPLOAD');
		}
		elseif(strlen($fileNameOnServer) == 0){
			$message = "ERROR+".JText::_('ARRA_ERROR_UPLOADING_FILE');
		}
		else{
			$data = file_get_contents($fileNameOnServer);			
			if($data === false){
				$message = "ERROR+".JText::_('ARRA_ERROR_READING_UPLOADED_FILE'); 
			}
			elseif(strlen($data) == 0){
				$message = "ERROR+".JText::_('ARRA_ERROR_FILE_EMPTY');
			}
			else{
				$extension_array = array();
				if($fileNameOnClientPc != ""){
					$extension_array = explode(".", $fileNameOnClientPc);
				}
				
				$length = count($extension_array);
				$extension = $extension_array[$length-1];			
				$function = "";			    
				
				if($extension == "txt" || $extension == "csv"){
					$function .= "csv_txtImport";
					$data = file_get_contents($fileNameOnServer);
				}
				elseif($extension == "sql" || $extension == "zip"){
					$function .= "sql_zipImport";										
					if($extension == "zip"){
						if (($temp = zip_open($fileNameOnServer))) {
							while ($entry = zip_read($temp)){
								if (preg_match('/.sql$/',zip_entry_name($entry))){ 
									$data = zip_entry_read($entry, zip_entry_filesize($entry));
								}   
							}
							zip_close($temp);
						}
					}
					elseif($extension == "sql"){
						$data = file_get_contents($fileNameOnServer);
					}	
				}
				// apel functions for import
				$message = $this->$function($data, $fileNameOnServer);
			}
		}
		return $message;		
	}
	
	//save data from sql file
	function sql_zipImport($data_file, $fileNameOnServer){
		$db =& JFactory::getDBO();
		$data = "";
		$tables = array("usergroups", "users", "user_usergroup_map", "user_profiles");
		
		//save existing dates and then delete to import another dates.
		foreach($tables as $num=>$table){
			$sql= "DESCRIBE #__".$table;
			$db->setQuery($sql);
			$result = $db->loadAssocList();
			$array_all_columns = array();
			foreach($result as $key=>$value){
				$array_all_columns[] = $value['Field'];
			}
			
			$data .= $table."\n";
			$data .= implode(",", $array_all_columns)."\n";		
			
			$sql = "select * from #__".$table;
			$db->setQuery($sql);
			$result = $db->loadAssocList();
			foreach($result as $key_row=>$value_row){
				$current_row = ""; 
				foreach($array_all_columns as $key_column=>$value_column){
					$col_val = $value_row[$value_column];
					$col_val = str_replace("\n", "", $col_val);
					$current_row .= $col_val.",";
				}
				$temp = substr($current_row, 0, strlen($current_row)-1);
				$data .= $temp."\n";
			}
			$data .= "#####";
		}
	
		if($data != ""){
			foreach($tables as $num=>$table){
				$sql = "delete from #__".$table;
				$db->setQuery($sql);
				$db->query();
			}
		}	
		//return all create operations
		preg_match_all('/CREATE(.*);/msU',$data_file, $create);
		//return all insert operations
		preg_match_all('/INSERT(.*)\);/msU',$data_file, $insert);        		
		
		if(isset($create) && count($create)!=0){
			foreach($create["0"] as $key=>$value){							    			   
				$db->setQuery($value);				
				if(!$db->query()){
					return "ERROR+".JText::_('ARRA_ERROR_TO_CREATE');
				}
			}
		}
		
		if(isset($insert) && count($insert)!=0){		  
			foreach($tables as $num=>$table){
				$sql = "delete from #__".$table;
				$db->setQuery($sql);
				$db->query();
			}			
			foreach($insert["0"] as $key=>$value){								
				$db->setQuery($value);
				if(!$db->query()){
					$this->collback($data);
					return "ERROR+".JText::_('ARRA_ERROR_TO_INSERT');
				}
			}
			
			$this->saveOldSuperAdministrator($data);
			return "OK+".JText::_('ARRA_UPLOADED_FILE');
		}		
	}
	
	function collback($data){
		$db =& JFactory::getDBO();
		//insert old datas
		$all_tables = explode("#####", $data);
		$aray_new_user_id = array();
		$array_new_value_aro = array();
		
		foreach($all_tables as $k=>$group_datas){
			if($group_datas != ""){
				$rows = explode("\n", $group_datas);
				$table = trim($rows["0"]);
				$table_columns = $rows["1"];
				for($i=2; $i<=count($rows)-1; $i++){													
					if($table=="usergroups"){
						$cells = explode(",", $rows[$i]);												
						if(trim($cells["0"]) != ""){
							$sql = "insert into #__usergroups values(".$cells["0"].",".$cells["1"].", '".$cells["2"]."', ".$cells["3"].", '".$cells["4"]."')";
							$db->setQuery($sql);
							$db->query();
						}
					}
					if($table=="users"){
						$cells = explode(",", $rows[$i]);												
						if(trim($cells["0"]) != ""){
							$new_id = $this->existRowUsers($cells["0"], $table);						
							$sql = "insert into #__users values(".$cells["0"].", '".$cells["1"]."', '".$cells["2"]."', '".$cells["3"]."', '".$cells["4"]."', '".$cells["5"]."', ".$cells["6"].", ".$cells["7"].", '".$cells["8"]."', '".$cells["9"]."', '".$cells["10"]."', '".$cells["11"]."')";
							$db->setQuery($sql);
							$db->query();
						}
						
					}					
					if($table=="user_usergroup_map"){																				
						$cells = explode(",", $rows[$i]);
						if(trim($cells["0"]) != ""){
							$sql = "insert into #__user_usergroup_map values(".$cells["0"].", ".$cells["1"].")";
							$db->setQuery($sql);
							$db->query();
						}			
					}
					if($table=="user_profiles"){																				
						$cells = explode(",", $rows[$i]);
						if(trim($cells["0"]) != ""){
							$sql = "insert into #__user_profiles values(".$cells["0"].", '".$cells["1"]."', '".$cells["2"]."', ".$cells["3"].")";
							$db->setQuery($sql);
							$db->query();
						}			
					}//if						
				}//for
			}//if				
		}//foreach
	}
	
	function saveOldSuperAdministrator($data){
		$db =& JFactory::getDBO();
		//insert old datas
		$all_tables = explode("#####", $data);
		$aray_new_user_id = array();
		$array_new_value_aro = array();
		$id_user_to_delete = array();
		$value_to_delete = array();
		
		foreach($all_tables as $k=>$group_datas){
			if($group_datas != ""){
				$rows = explode("\n", $group_datas);
				$table = trim($rows["0"]);
				$table_columns = $rows["1"];
				for($i=2; $i<=count($rows)-1; $i++){								
					if($table=="usergroups"){
						$cells = explode(",", $rows[$i]);
						if($this->existRowGroups($cells["0"], "title", $cells["2"], $table) == false){
							$sql = "insert into #__usergroups values(".$cells["0"].",".$cells["1"].", '".$cells["2"]."', ".$cells["3"].", '".$cells["4"]."')";
							$db->setQuery($sql);
							$db->query();
						}
					}
					if($table=="users"){
						$cells = explode(",", $rows[$i]);
						
						if($this->existSuperAdmin($cells["2"],$cells["3"]) == false){					
							$new_id = $this->existRowUsers($cells["0"], $table);
							if($new_id == -1){
								if(trim($cells["1"]) != ""){
									$sql = "insert into #__users values(".$cells["0"].", '".$cells["1"]."', '".$cells["2"]."', '".$cells["3"]."', '".$cells["4"]."', '".$cells[5]."', ".$cells[6].", ".$cells[7].", '".$cells[8]."', '".$cells[9]."', '".$cells[10]."', '".$cells[11]."')";
									$db->setQuery($sql);
									$db->query();
								}
							}
							else{
								if(trim($cells["1"]) != ""){
									$sql = "insert into #__users values(".$new_id.", '".$cells["1"]."', '".$cells["2"]."', '".$cells["3"]."', '".$cells["4"]."', '".$cells[5]."', ".$cells[6].", ".$cells[7].", '".$cells[8]."', '".$cells[9]."', '".$cells[10]."', '".$cells[11]."')";								
									$db->setQuery($sql);
									$db->query();
									$temp = $cells["0"].",".$new_id;
									$aray_new_user_id[] = $temp;
								}
							}
						}
						else{
							$id_user_to_delete[] = $cells["0"];
						}	
					}					
					if($table=="user_usergroup_map"){					
						$cells = explode(",", $rows[$i]);
						if(count($value_to_delete) == 0 || !in_array($cells["2"], $value_to_delete)){
							if(count($array_new_value_aro)>0){
								foreach($array_new_value_aro as $key2=>$exist_new){
									$temp = explode(",", $exist_new);
									$old_id = $temp["0"];
									$new_id = $temp["1"];							
									$rows[$i] = str_replace(",".$old_id, ",".$new_id, $rows[$i]);														
									$cells = explode(",", $rows[$i]);								
									$sql = "insert into #__user_usergroup_map values(".$cells["0"].", ".$cells["1"].")";
									$db->setQuery($sql);
									$db->query();
								}
							}
							else{			
								/*$sql = "insert into #__user_usergroup_map values(".$cells["0"].", ".$cells["1"].")";
								$db->setQuery($sql);
								$db->query();*/
							}
						}	
					}//if
					if($table=="user_profiles"){
						$cells = explode(",", $rows[$i]);
						if($this->existProfile($cells["0"], "user_id", $cells["1"], "profile_key", $table) == false){
							if($cells["0"] != ""){
								$sql = "insert into #__user_profiles values(".$cells["0"].", '".$cells["1"]."', '".$cells["2"]."', ".$cells["3"].")";
								$db->setQuery($sql);
								$db->query();
							}
						}
					}						
				}//for
			}//if				
		}//foreach
	}
	
	function existSuperAdmin($username, $email){
		$db =& JFactory::getDBO();		
		$sql = "select id from #__users where username='".addslashes(trim($username))."' and email='".addslashes(trim($email))."'";
		$db->setQuery($sql);
		$result = $db->loadResult();
		if($result != NULL){
			return true;
		}
		else{
			return false;
		}
	}
	
	function existProfile($id, $col_id, $profile, $col_profile, $table){
		$db =& JFactory::getDBO();		
		$sql = "select count(*) from #__".$table." where user_id=".intval($id)." and profile_key='".addslashes($profile)."'";
		$db->setQuery($sql);
		$result = $db->loadResult();
		if($result > 0){
			return true;
		}
		else{
			return false;
		}
	}
	
	function existRowUsers($id, $table){
		$db =& JFactory::getDBO();
		$sql = "select count(*) from #__".$table." where id=".intval($id);
		$db->setQuery($sql);
		$result = $db->loadResult();
		if($result == NULL && $result == 0){
			return -1;
		}
		else{
			$sql = "select max(id) from #__".$table;
			$db->setQuery($sql);
			$result = $db->loadResult();
			return $result+1;
		}
	}
	
	function existRowGroups($id, $column_to_check, $value, $table){
		$db =& JFactory::getDBO();		
		$sql = "select count(*) from #__".$table." where id='".$id."' and ".$column_to_check."='".$value."'";
		$db->setQuery($sql);
		$result = $db->loadResult();
		if($table=="usergroups"){
			if($result == NULL && $result == 0){
				return false;
			}
			else{
				return true;
			}
		}	
	}	
	
	//save data from txt file
	function csv_txtImport($data, $fileNameOnServer){
		$txtImport = new TxtImport();
		//evidence for header line and body lines
		$i = "header";
		$columns_imported = array();
		$all_user_type = $txtImport->getUserType(); 
		$separator = JRequest::getVar("separator", ",", "post", "string");
		$group_map_aro_id = "";	
		$users_existent = array();
		$empty_columns = array();
		$fields_details = array();
		
		// return all collumns from database to validate imported coolumns
		$db =& JFactory::getDBO();
		$sql= "DESCRIBE #__users ";
		$db->setQuery($sql);
		$result = $db->loadAssocList();
		$array_all_columns = array();
		foreach($result as $key=>$value){
			 $array_all_columns[] = trim($value['Field']);
		}
		$array_all_columns[] = "usertype";
		$array_all_columns[] = "profile.aboutme";
		$array_all_columns[] = "profile.dob";
		$array_all_columns[] = "profile.favoritebook";
		$array_all_columns[] = "profile.phone";
		$array_all_columns[] = "profile.website";
		$array_all_columns[] = "profile.country";
		$array_all_columns[] = "profile.postal_code";
		$array_all_columns[] = "profile.region";
		$array_all_columns[] = "profile.address2";
		$array_all_columns[] = "profile.city";
		$array_all_columns[] = "profile.address1";
		
		$sql = "select distinct(name) from #__arra_users_profile";
		$db->setQuery($sql);
		$db->query();
		$profile_collumns = $db->loadAssocList();
		
		if(isset($profile_collumns) && $profile_collumns != NULL && is_array($profile_collumns) && count($profile_collumns) > 0){
			foreach($profile_collumns as $profile_key=>$profile_value){
				 $array_all_columns[] = "profile.".$profile_value["name"];
			}
		}
		
		$fp = fopen($fileNameOnServer, 'r');
		$ok = false;
		while(!feof($fp)){				
			$temp_row = fgets($fp);										
			if(strpos($temp_row, "*****") >= 0 && strpos($temp_row, "*****") !== FALSE){
				$ok = true;
			}
			if($ok === true){				
				$temp = explode("=>", trim($temp_row));				
				$temp["0"] = str_replace('"', "", $temp["0"]);
				if(isset($temp["1"])){				 
					$fields_details[$temp["0"]] = $temp["1"];
				}
			}			
			$temp_row = "";
			@$cursor ++;
		}
		fclose($fp);
	    $fp = fopen($fileNameOnServer, 'r');
		while(!feof($fp)){  	    
			$temp_row = trim(fgets($fp));//line by line			
			//if we have a blank line
			if(strlen(trim($temp_row))==0 || ((strpos($temp_row, ",,") == 0 && strpos($temp_row, ",,") !== FALSE) && $i != "header")){
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
						
		    //if is first line(header line)
		    if($i == "header"){
				//convert from UTF-8 to ANSI
			    $temp_row = $temp_row;
			    if(strpos(trim($temp_row), $separator) == false){
					return "ERROR+".JText::_('ARRA_ERROR_UNKNOWN_SEPARATOR');
				}				
				
				$columns_imported = explode($separator, trim($temp_row));
				//$columns_imported["0"] = "name"; //if on start of file exist a strange character
								
				$unknown_fields = array();
				
				if(count($array_all_columns)!=0){
					foreach($columns_imported as $key=>$value){
						if(!in_array(trim($value), $array_all_columns)){
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
				$default_password = JRequest::getVar("default_password", "", "string");
				$generate_password = JRequest::getVar("generate_password_radio", "1", "string");
				
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
				$row = explode($separator, utf8_encode($temp_row));
								
				//if user is not in database(imported new user)
				$user_id_from_database = $this->userExist($columns_imported, $row);
				if($user_id_from_database == -1){				
					$email = "";				
					//if email isn't already in databse
					if(in_array("email", $columns_imported)){ 
						$temp = array_keys($columns_imported, "email");
						$position = $temp["0"];
						$email = trim($row[$position]);
					}					
					if($this->emailExist($email) == false){
						//verify if is imported usertype
						if(in_array("usertype", $columns_imported)){							
							$temp = array_keys($columns_imported, "usertype");
							$position = $temp["0"];
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
								$position = $temp["0"];
								if(trim($row[$position]) == "Super Administrator"){
									$row[$position] = "Super Users";
									$usertype = "Super Users";
									$gid = array();
									$gid[] = "8";
								}
							}
						}
						//insert row in _users table
						$value = $txtImport->saveUsers($columns_imported, $row, $usertype, $fields_details, $gid);
						
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
					$update_message = $txtImport->updateUser($columns_imported, $row, $user_id_from_database, $all_user_type, $fields_details);
					if($update_message == "empty_column"){
						$empty_columns[] = $temp_row;
					}
				}	
				$temp = "";//reset line
			}//else
        }//while
		fclose($fp);
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
		$sql = "select id from #__users where email = '".addslashes(trim($email))."' limit 1";		
		$db->setQuery($sql);
		$result=$db->loadResult();
		if($result != NULL){
			return true;
		}
		else{
		    return false;
		}
	}
	
	//function for search if user is defined in database and then update dates
	function userExist($columns_imported, $row){	
		$db =& JFactory::getDBO();
		$username = "";
		$id = -1;		  
		if(in_array("username", $columns_imported)){
			$temp = array_keys($columns_imported, "username");
			$position = $temp["0"];
			$username = trim($row[$position]);
		}		 		  		
		$sql = "SELECT id
		      FROM #__users
              WHERE username = '".addslashes(trim($username))."'";
		$db->setQuery($sql);
		$id = $db->loadResult();
		if($id == NULL){
			return -1;
		}
		else{
			return $id;
		}	 
	}
	
	//return all user types from database
	function getUserType(){
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
		
	//create a nuw file if not exist
	function mkfile($filename,$mode) { 
        if(!file_exists($filename)) { 
			$handle = fopen($filename,'w+'); 
			fclose($handle);
			chmod($filename,$mode); 
        } 
    } 	
		
	function backUp(){
		$config = new JConfig();		
		$sql_export = new SqlExport();		
		
		$data  = "";
		$data .= $sql_export->getFileHeader($config);
		$data .= $sql_export->getUsergroups($config);
		$data .= $sql_export->getUsers($config);
		$data .= $sql_export->getUserUsergroupMap($config); 
		$data .= $sql_export->getUserProfile($config);
		
		$sql_file_name = $config->db."_usersBK.zip";		
		$path = JPATH_SITE .DS."administrator".DS."components".DS."com_arrausermigrate".DS."files".DS. $sql_file_name;	
		//if file not exist then create a new file
		if(!is_file($path)){	  
			$this->mkfile(JPATH_SITE .DS."administrator".DS."components".DS."com_arrausermigrate".DS."files".DS. $sql_file_name, 0777);
		}		
		$zip = new ZipArchive;
		$res = $zip->open($path, ZipArchive::OVERWRITE);
		if ($res === TRUE) {
			$zip->addFromString($config->db."_usersBK.sql", $data);
			$zip->close();
		}		
	}	
}

?>