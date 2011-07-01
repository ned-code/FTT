<?php 
require_once JPATH_ROOT.'/configuration.php';
$config = new JConfig;

$dbtype= $config->dbtype;  
$mysql_server= $config->host;  
$mysql_user= $config->user;  
$mysql_pass= $config->password;  
$mysql_db= $config->db;  
$dbprefix= $config->dbprefix;   
$TBLPREFIX= $config->dbprefix.'mb_';  
?>