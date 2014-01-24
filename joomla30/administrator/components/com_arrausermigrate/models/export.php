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
 * file: export.php
 *
 **** class 
     ArrausermigrateModelExport 
	 
 **** functions
     __construct();
	 getUserType();	 
	 export();	 	 
	 setExportType();
	 csv_txtExport();
	 htmlExport();
	 sqlExport();
	 mkfile();	 
	 zipExport();
	 sendSqlMail();	 
	 sendMail();	 	
	 checked();
	 getAdditionalColumns();
 */

// No direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.application.component.model');
require_once (JPATH_COMPONENT_ADMINISTRATOR.DS.'helpers'.DS.'SqlExport.php');

/**
 * ArrausermigrateModelExport Model
 *
 */
class ArrausermigrateModelExport extends JModelLegacy{
	
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
	function export(){			
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
			
			$column_profile = array();
			foreach($column as $key=>$value){				
				if(strpos($key, "profile") !== FALSE){
					unset($column[$key]);
					$column_profile[$value] = $value;
				}
			}			
			$column = array_merge($column, $column_profile);					
			$this->setExportType($userType, $column);
		}  				  
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
	
	//set type file for export
	function setExportType($userType, $column){	
	    $file_type = ""; 
		$radio_type_export = JRequest::getVar("radio_type_export", "", "post", "string");
		$order = JRequest::getVar("ordering", "0", "post", "string");
		$mode_order = JRequest::getVar("mode_order", "0", "asc", "string");
		$method = "";
	    if(isset($radio_type_export)){
			$file_type = JRequest::getVar("radio_type_export", "", "post", "string");
			$method = $file_type;
		}
		else{
			// csv file is default
			$file_type = "csv";
			$method = "csv";
		}
		//set method for export
		if($method == "csv" || $method == "txt"){
			$method = "csv_txt";
		}
		$method .= "Export";
        $this->$method($userType , $column, $order, $mode_order, $file_type);	
	}		
	
	//made a csv file
	function csv_txtExport($userType, $column, $order="", $mode_order="", $file_type){				
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
		
		$config = new JConfig();
		$csv_filename = $config->db."_users.".$file_type; 
		$size_in_bytes=strlen($data);
		header("Content-Type: application/x-msdownload");
		//header("Content-Length:" . $size_in_bytes);
		header("Content-Disposition: attachment; filename=".$csv_filename);
		header("Pragma: no-cache");
		header("Expires: 0");
		echo utf8_decode($data);	
		
		//send emails
		$list_emails = JRequest::getVar("text_emails", "", "post", "string");
		$email_to_super_admin = JRequest::getVar("email_to_super_admin", "no", "post", "string");		
		//if is set an enails list
		if($list_emails != ""){		
			$this->sendMail($data, $csv_filename, $list_emails);
		}
		//send email to Super Administrator users type
		if($email_to_super_admin != "no"){
			$db =& JFactory::getDBO();
			$sql = "select u.email from #__users u, #__user_usergroup_map ugm where ugm.user_id=u.id and ugm.group_id=8";			
			$db->setQuery($sql);
			$result = $db->loadAssocList();
			$emails = "";
			foreach($result as $key=>$value){
				$emails .= $value['email'] . ",";
			}
			$emails = substr($emails, 0, strlen($emails)-1);
		    $this->sendMail($data, $csv_filename, $emails);
		}   
			
		exit();	 
	}		
	
	//make a html file
	function htmlExport($userType, $column, $order="", $mode_order=""){
	    $split_name = JRequest::getVar("split_name", "no", "post", "string"); 
		$header = "";
		$where = " where #__users.id=ugm.user_id and ugm.group_id=ug.id ";   
		$data  = "";
		$export_name = "";
		$data .= 	"<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n".
					"<html xmlns=\"http://www.w3.org/1999/xhtml\">\n".
					"<head>".
					"<meta http-equiv=\"Content-Type\" content=\"text/html; charset=iso-8859-1\" />\n".
					"<title>User Export</title>\n".
					"<style>\n".
					"table {\n".
						"border-collapse: collapse;\n".
						"border: 1px solid #333333;\n".
						"margin: auto;".
						"font-family: Arial, Helvetica, sans-serif;".
					"}".
					"tr {\n".
						"text-align: left;\n".
					"}\n".
					"tr.one {\n".
						"background-color:#E2E2E2;\n".
					"}\n".
					"tr.two {\n".
						"background-color:#BAC5DA;\n".
					"}\n".
					"td {\n".
						"text-align: left;\n".
					"}\n".
					"th {\n".
						"text-align: left;\n".
						"background-color:#ADADCC;\n".
					"}\n".
					"</style>\n".
					"<script type='text/javascript'>
					window.onload=initAll;
					function initAll(){
						var trs = document.getElementsByTagName('TR');
						for(var i=0;i<trs.length;i++){
							var current = trs[i];
							current.onmouseover = changeBGK;
							current.onmouseout = setOriginalBG;
						}
					}
					function changeBGK(){
						this.style.backgroundColor = '#FFFFFF';
					}
					function setOriginalBG(){
						if(this.className == 'one') {
							this.style.backgroundColor = '#E2E2E2';
						} else if (this.className == 'two') {
							this.style.backgroundColor = '#BAC5DA';
						}
					}
					</script>\n".
					"</head>\n".				
					"<body>\n".
					"<table border=\"1\" cellpadding=\"5\" cellpadding=\"5\">\n";
		$data .= "<tr class='headers'>\n";			
		foreach($column as $key=>$value){
			//if is in columns for export name and if split the name
			if($value=="name" && $split_name != "no"){
				$header .= "<th>".JText::_("ARRA_FIRST_NAME")."</th>"."<th>".JText::_("ARRA_LAST_NAME")."</th>";
				$export_name = true;
			}
			else{
				$header .= "<th>".$value."</th>";
			}	 
        }
		$data .= $header."</tr>";
		
		if(is_array($userType)){
			$where .= " and ugm.group_id in (select id from #__usergroups where title in (";
			foreach($userType as $key=>$value){
				$where .= "'" . $value . "',"; 
			}			
			$var = substr($where, 0, strlen($where)-1);
			$where = $var . "))";			
		}
		else{
			$where .= "";
		}
		$db =& JFactory::getDBO();
        $columns = implode(",", $column);
		
		$ordering = "";
		if($order != "" && $order != "0"){
			if($mode_order != ""){
				$ordering = " order by ".$order." ".$mode_order;
			}
			else{
				$ordering = " order by ".$order." asc";
			}	 
		}	
		
		if(strpos($columns, "usertype") !== false){
			$columns = str_replace("usertype", "ug.title as usertype", $columns);
		}
			
		$sql = "SELECT " . $columns .
		        " FROM #__users, #__usergroups ug, #__user_usergroup_map ugm " . $where . $ordering;
		die("1");   
		$db->setQuery($sql);
		$result = $db->loadAssocList();
		//set table body
		$exist = false;
		$row = "";
		$par_row = true;
		if(is_array($result)){
			//for each row
			foreach($result as $key=>$value){
				$next = true;
				if($par_row == true){
				    $row .= "<tr class=\"one\">";
					$par_row = false;
				}
				else{
					$row .= "<tr class=\"two\">";
					$par_row = true;
				}	
			    // for each column of row		    
				foreach($value as $key2=>$value2){				   
					//if is in columns for export name and if split the name
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
							$row .= "<td>".trim($first_name)."</td><td>".trim($last_name)."</td>";								
						}
						elseif(count($temp_array)==2){
							$first_name = $temp_array[0];
							$last_name = $temp_array[1];
						    $row .= "<td>".trim($first_name)."</td><td>".trim($last_name)."</td>";								
						}
						else{
							$first_name .= $temp_array[0];
							$row .= "<td>".trim($first_name)."</td><td></td>";								
						}
						$next = false;
					}
					else{
					    $row .= "<td>".trim($value2)."</td>";
					}										
				}
				$row .= "</tr>\n";
				//set true for next row
				$next = true;				
				//start new row
				$data .= $row;					
				$row = "";
			} 					
		}
		$data .= "</table>".
                 "</body>".
                 "</html>";
		
		$config = new JConfig();
		$html_filename = $config->db."_users.html";		
		$size_in_bytes=strlen($data);
		header("Content-Type: application/x-msdownload");
		//header("Content-Length:" . $size_in_bytes);
		header("Content-Disposition: attachment; filename=".$html_filename);
		header("Pragma: no-cache");
		header("Expires: 0");
		echo utf8_decode($data);	
		
		//send emails
		$list_emails = JRequest::getVar("text_emails", "", "post", "string");
		$email_to_super_admin = JRequest::getVar("email_to_super_admin", "no", "post", "string");		
		//if is set an enails list
		if($list_emails != ""){
			$this->sendMail($data, $html_filename, $list_emails);
		}
		//send email to Super Administrator users type
		if($email_to_super_admin != "no"){
			$db =& JFactory::getDBO();
			$sql = "select u.email from #__users u, #__user_usergroup_map ugm where ugm.user_id=u.id and ugm.group_id=8";
			$db->setQuery($sql);
			$result = $db->loadAssocList();
			$emails = "";
			foreach($result as $key=>$value){
				$emails .= $value['email'] . ",";
			}
			$emails = substr($emails, 0, strlen($emails)-1);
		    $this->sendMail($data, $html_filename, $emails);
		}   
			
		exit();	
	}	
	
	// make a sql file
	function sqlExport($userType, $column, $order=""){
		$config = new JConfig();		
		$sql_export = new SqlExport();
		
		$data  = "";
		//return header of exported file 
		$data .= $sql_export->getFileHeader($config);
		$data .= $sql_export->getUsergroups($config);
		$data .= $sql_export->getUsers($config);
		$data .= $sql_export->getUserUsergroupMap($config); 
		$data .= $sql_export->getUserProfile($config); 
		
		$csv_filename = $config->db."_users.sql";
		$size_in_bytes=strlen($data);
		header("Content-Type: application/x-msdownload");
		//header("Content-Length:" . $size_in_bytes);
		header("Content-Disposition: attachment; filename=".$csv_filename);
		header("Pragma: no-cache");
		header("Expires: 0");
		echo utf8_decode($data);
		 
		//send mails		
		$list_emails = JRequest::getVar("text_emails", "", "post", "string");
		$email_to_super_admin = JRequest::getVar("email_to_super_admin", "no", "post", "string");	
		//if is set an enails list 
		if($list_emails != ""){
			$this->sendMail($data, $csv_filename, $list_emails);
		}
		//send email to Super Administrator users type
		if($email_to_super_admin != "no"){
			$db =& JFactory::getDBO();
			$sql = "select u.email from #__users u, #__user_usergroup_map ugm where ugm.user_id=u.id and ugm.group_id=8";
			$db->setQuery($sql);
			$result = $db->loadAssocList();
			$emails = "";
			foreach($result as $key=>$value){
				$emails .= $value['email'] . ",";
			}
			$emails = substr($emails, 0, strlen($emails)-1);
		    $this->sendMail($data, $csv_filename, $emails);
		}
		 	 	
		 exit();
	}	
	
	//create a nuw file if not exist
	function mkfile($filename,$mode) { 
        if(!file_exists($filename)) { 
			$handle = fopen($filename,'w+'); 
			fclose($handle);
			chmod($filename,$mode); 
        } 
    } 

	
	//make a zip file for export
	function zipExport(){
		$config = new JConfig();		
		$sql_export = new SqlExport();		
		
		$data  = "";
		$data .= $sql_export->getFileHeader($config);
		$data .= $sql_export->getUsergroups($config);
		$data .= $sql_export->getUsers($config);
		$data .= $sql_export->getUserUsergroupMap($config); 
		$data .= $sql_export->getUserProfile($config);
		
		$sql_file_name = $config->db."_users.zip";		
		$path = JPATH_SITE .DS."administrator".DS."components".DS."com_arrausermigrate".DS."files".DS. $sql_file_name;	
		//if file not exist then create a new file
		if(!is_file($path)){
			$this->mkfile($path, 0777);
		}		
		$zip = new ZipArchive;
		$res = $zip->open($path, ZipArchive::OVERWRITE);
		if ($res === TRUE || $res != "" || $res != NULL){
			$zip->addFromString($config->db."_users.sql", utf8_decode($data));
			$zip->close();
		}
		
		//send mails		
		$list_emails = JRequest::getVar("text_emails", "", "post", "string");
		$email_to_super_admin = JRequest::getVar("email_to_super_admin", "no", "post", "string");	
		//if is set an enails list 
		if($list_emails != ""){
			$this->sendSqlMail($data, $path, $list_emails);
		}
		//send email to Super Administrator users type
		if($email_to_super_admin != "no"){
		    $db =& JFactory::getDBO();
			$sql = "select u.email from #__users u, #__user_usergroup_map ugm where ugm.user_id=u.id and ugm.group_id=8";
			$db->setQuery($sql);
			$result = $db->loadAssocList();
			$emails = "";
			foreach($result as $key=>$value){
			     $emails .= $value['email'] . ",";
			}
			$emails = substr($emails, 0, strlen($emails)-1);
		    $this->sendSqlMail($data, $path, $emails);
		}		 	 	
	}		
	
	//send mail with zip file
	function sendSqlMail($data, $file_path, $list_emails){
	        $config = new JConfig();
			$recipient = array();
			$ok = false;
								    
			//if exist a list with emails
			if(isset($list_emails) && strlen($list_emails)>0){
			    $recipient = explode(',', $list_emails);
			}
			
			//verify if is set subject and body email
			$settings_saved = false;  
			$config = new JConfig();  	  
			$db =& JFactory::getDBO();
			$sql= "select params from #__extensions where name='com_arrausermigrate'";
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
			$sql= "select params from #__extensions where name='com_arrausermigrate'";
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
	
	function getAllGroups(){
		$db =& JFactory::getDBO();
		$sql = "select title, id from #__usergroups";
		$db->setQuery($sql);
		$db->query();
		$result = $db->loadAssocList("id");
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
}

?>