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
$options = array ("host" => $config->host,"user" => $config->user,"password" => $config->password,"database" => $config->db,"prefix" => $config->dbprefix);

class ArraDatabase extends JDatabaseMySQL{
	public function __construct($options){
		parent::__construct($options);
	}
}

$database = new ArraDatabase($options);

$task = JRequest::getVar("task", "", "get", "string");
switch($task){
     case "statistics" : statistics(); 
	                     break;							   						   
}

function statistics(){
	global $database;
	
	$usertype = JRequest::getVar("usertype", "");
	
	if($usertype != "" && strlen($usertype)>1){
		$usertype = substr($usertype, 0, -1);
		$usertype = str_replace("|", ",", $usertype);
	}
	
	$block = JRequest::getVar("block", "");		
	$visited = JRequest::getVar("visited", "");
	$start_date = JRequest::getVar("start_date", "");
	$end_date = JRequest::getVar("end_date", "");
	$start_register_date = JRequest::getVar("start_register_date", "");
	$end_register_date = JRequest::getVar("end_register_date", "");
	$send_email = JRequest::getVar("send_email", "");
	$activated = JRequest::getVar("activated", "");
	
	$where = " u.id=ugm.user_id ";
	
	if($usertype != ""){
		$where .= " and ugm.group_id in(".$usertype.")";
	}
	else{
		$where .= " and ugm.group_id in(-1)";
	}
	
	if($block != "" && $block != "-1"){
		$where .= " and u.block=".$block;
	}
	
	if($send_email != "" && $send_email != "-1"){
		$where .= " and u.sendEmail=".$send_email;
	}
	
	if($activated != "" && $activated != "-1"){
		if($activated == "0"){
			$where .= " and u.activation = ''";
		}
		else{
			$where .= " and u.activation <> ''";
		}
	}
	
	if($visited != "" && $visited != "-1"){
		if($visited == "0"){
			$where .= " and u.lastvisitDate <> '0000-00-00 00:00:00'";
		}
		else{
			$where .= " and u.lastvisitDate = '0000-00-00 00:00:00'";
		}				
	}
	else{
		if($start_date == "" && $end_date == ""){
		}
		else{
			if($start_date != "" && $end_date == ""){
				$where .= " and u.lastvisitDate >= '".$start_date."'";
			}
			elseif($start_date == "" && $end_date != ""){
				$where .= " and u.lastvisitDate <= '".$end_date."'";
			}
			elseif($start_date != "" && $end_date != ""){
				$where .= " and u.lastvisitDate >= '".$start_date."' and u.lastvisitDate <= '".$end_date."'";
			}
		}
	}
	
	if($start_register_date == "" && $end_register_date == ""){
	}
	else{
		if($start_register_date != "" && $end_register_date == ""){
			$where .= " and u.registerDate >= '".$start_register_date."'";
		}
		elseif($start_register_date == "" && $end_register_date != ""){
			$where .= " and u.registerDate <= '".$end_register_date."'";
		}
		elseif($start_register_date != "" && $end_register_date != ""){
			$where .= " and u.registerDate >= '".$start_register_date."' and u.registerDate <= '".$end_register_date."'";
		}
	}
	
	$sql = "select u.id from #__users u, #__user_usergroup_map ugm where ".$where." group by u.id";
	$database->setQuery($sql);
	$database->query();
	$result = $database->loadAssocList();
	echo count($result);
	exit;
}

?>	