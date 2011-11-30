<?php
define('_JEXEC', 1);
define('DS', DIRECTORY_SEPARATOR);
define("JMB_FACEBOOK_APPID", "184962764872486");
define("JMB_FACEBOOK_SECRET", "6b69574c9ddd50ce2661b3053cd4dc02");
define("JMB_FACEBOOK_URL",  'http://www.familytreetop.com/');
define("JMB_FACEBOOK_COOKIE",  true);

$path = explode(DS, __DIR__);
$base_url_array = array();
foreach($path as $key => $value){
	if($value == 'components') break;
	$base_url_array[] = $value;
}
define('JPATH_ROOT', implode(DS, $base_url_array));
define('JPATH_BASE', JPATH_ROOT);

require_once ( JPATH_ROOT .DS.'includes'.DS.'defines.php' );
require_once ( JPATH_ROOT .DS.'includes'.DS.'framework.php' );

$mainframe =& JFactory::getApplication('site');
$mainframe->initialise();

require_once(JPATH_ROOT.DS.'components'.DS.'com_manager'.DS.'php'.DS.'host.php');

session_start();

$host = new Host('Joomla');
$ajax = new JMBAjax();
$link = $ajax->connect();
echo $ajax->callMethod($host);
$ajax->close($link);
exit;
?>
