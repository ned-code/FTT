<?php
define( '_JEXEC', 1 );
define('JPATH_BASE', substr(substr(dirname(__FILE__), 0, strpos(dirname(__FILE__), "administra")),0,-1));
if (!isset($_SERVER["HTTP_REFERER"])) exit("Direct access not allowed.");
$mosConfig_absolute_path =substr(JPATH_BASE, 0, strpos(JPATH_BASE, "/administra")); 
define( 'DS', DIRECTORY_SEPARATOR );

require_once ( JPATH_BASE .DS.'includes'.DS.'defines.php' );
require_once ( JPATH_BASE .DS.'includes'.DS.'framework.php' );

if(intval(JVERSION) < 3){
	require_once ( JPATH_BASE .DS.'libraries'.DS.'joomla'.DS.'methods.php');
}

require_once ( JPATH_BASE .DS.'configuration.php' );

if(intval(JVERSION) < 3){
	require_once ( JPATH_BASE .DS.'libraries'.DS.'joomla'.DS.'base'.DS.'object.php');
}

require_once ( JPATH_BASE .DS.'libraries'.DS.'joomla'.DS.'database'.DS.'database.php');

if(intval(JVERSION) >= 3){
	require_once ( JPATH_BASE .DS.'libraries'.DS.'legacy'.DS.'database'.DS.'mysql.php');
}
else{
	require_once ( JPATH_BASE .DS.'libraries'.DS.'joomla'.DS.'database'.DS.'database'.DS.'mysql.php');
}

require_once ( JPATH_BASE .DS.'libraries'.DS.'joomla'.DS.'filesystem'.DS.'folder.php');

$config = new JConfig();
$options = array ("host" => $config->host, "user" => $config->user, "password" => $config->password, "database" => $config->db, "prefix" => $config->dbprefix);

class ArraDatabase extends JDatabaseMySQL{
	public function __construct($options){
		parent::__construct($options);
	}
}

$database = new ArraDatabase($options);

$task = JRequest::getVar("task", "", "get", "string");
switch($task){
	case "all_active_users" : getActiveUsers(); 
			break;
	case "at_least_one_visit" : getAtLeastOneVisit(); 
			break;
	case "truncate_tables" : truncateAllTables(); 
			break;
	case "save_settings_email_export" : saveEmailExportSettings();
			break;
}

function saveEmailExportSettings(){
	global $database;
	
	$subject_template = JRequest::getVar("subject_template","","get","string");
	$from_email = JRequest::getVar("from_email","","get","string");
	$from_name = JRequest::getVar("from_name","","get","string");
	$sitename = JRequest::getVar("sitename","","get","string");
	$email_template = JRequest::getVar("email_template","","get","string");
	
	$sql = "select c.params from #__extensions c where c.element='com_arrausermigrate'";
	$database->setQuery($sql);
	$content = $database->loadResult();
	$total_array = array();
	
	if($content != NULL && trim($content) != ""){
		$total_array = json_decode($content, true);
	}
	
	$total_array["JoomlaExport"] =  "subject_template=".$subject_template.";\n".
										"from_email=".$from_email.";\n".				 
										"from_name=".$from_name.";\n".
										"sitename=".$sitename.";\n".
										"email_template=".$email_template.";";
										
	$sql = "update #__extensions c set params='".addslashes(json_encode($total_array))."' where c.element='com_arrausermigrate'";		  
	$database->setQuery($sql);
	if($database->query()){
	echo "1"."Email template successfully saved.";
	}
	else{
	echo "2"."Settings can't saved";
	}		 	
}

function getActiveUsers(){
    global $database;		
	$sql = "select count(*) from #__users where (UNIX_TIMESTAMP(registerDate)<=UNIX_TIMESTAMP(NOW()) and lastvisitDate <> '0000-00-00 00:00:00')";
	$database->setQuery($sql);
	$content = $database->loadResult();	
	
	echo $content;	
}

function getAtLeastOneVisit(){
    global $database;		
	$sql = "select count(*) from #__users where (UNIX_TIMESTAMP(registerDate)<=UNIX_TIMESTAMP(NOW()) and lastvisitDate <> '0000-00-00 00:00:00')";
	$database->setQuery($sql);
	$content = $database->loadResult();	
	
	echo $content;
}

function truncateAllTables(){
    global $database;
	global $config; 
	
	$message_ok = "";
	$message_not_ok = "";
	$array_ok = array();
	$array_not_ok = array();	
	
	$id_super_administrator = "";
	$id_public_backend = "";
	$id_user = array();
	
	$sql = "select id from #__usergroups where title = 'Super Users'";
	$database->setQuery($sql);		
	$id_super_administrator .= $database->loadResult();
	
	$sql = "select id from #__usergroups where title in ('Public', 'Registered')";
	$database->setQuery($sql);		
	$id_public_backend_array1 = $database->loadAssocList();
 	$id_public_backend_array2 = array();
		
	foreach($id_public_backend_array1 as $key=>$value){
		$id_public_backend2[] = $value["id"];
	}
	$id_public_backend .= implode(",", $id_public_backend2);
	
	if($id_super_administrator != "" && $id_public_backend != ""){
		$sql = "select id from #__users u, #__user_usergroup_map ugm where ugm.user_id=u.id and ugm.group_id=".$id_super_administrator;
		$database->setQuery($sql);		
		$id_user_array = $database->loadAssocList();
		if(isset($id_user_array) && count($id_user_array)>0){
			foreach($id_user_array as $key=>$value){
				$id_user[] = $value['id'];
			}
		}
	}
	else{
	    echo "ERROR-" . $message_not_ok . " could not be deleted.";
		return;
	}
	
	if($id_super_administrator != "" && $id_public_backend != ""){	
		$sql1 = "delete from #__user_usergroup_map where group_id <> '".$id_super_administrator."'";
		$sql2 = "delete from #__users where id not in (". implode(",", $id_user). ")";
		$sql3 = "delete from #__usergroups where id not in (".$id_super_administrator.", ".$id_public_backend.")";
		$sql4 = "delete from #__user_profiles where user_id not in (". implode(",", $id_user). ")";
	}
	else{
		echo "ERROR-" . $message_not_ok . " could not be deleted.";
		return;
	}	
	
	$database->setQuery($sql1);
	if($database->query()){
	   $array_ok[] = $config->dbprefix . "user_usergroup_map";
	}
	else{
	   $array_not_ok[] = $config->dbprefix . "user_usergroup_map";
	}
	
	$database->setQuery($sql2);
	if($database->query()){
	   $array_ok[] = $config->dbprefix . "users";
	}
	else{
	   $array_not_ok[] = $config->dbprefix . "users";
	}
	
	$database->setQuery($sql3);
	if($database->query()){
	   $array_ok[] = $config->dbprefix . "usergroups";
	}
	else{
	   $array_not_ok[] = $config->dbprefix . "usergroups";
	}
	
	$database->setQuery($sql4);
	if($database->query()){
	   $array_ok[] = $config->dbprefix . "user_profiles";
	}
	else{
	   $array_not_ok[] = $config->dbprefix . "user_profiles";
	}
	
	if(is_array($array_ok) && count($array_ok)!=0){
	   $message_ok = implode(", ", $array_ok);
	}
	if(is_array($array_not_ok) && count($array_not_ok)!=0){   
	   $array_not_ok = implode(", ", $array_not_ok);
	}
	
	if($message_ok != ""){
	   $message_ok = "Following tables: " . $message_ok . " are empty!";
	}
	
	if($message_not_ok != ""){
	   $message_not_ok = "ERROR-" . $message_not_ok . " could not be deleted.";
	}
	
	echo $message_ok . "<br/>" . $message_not_ok;
}
	
?>	