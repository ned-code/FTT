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
define('JPATH_BASE', implode(DS, $base_url_array));

require_once ( JPATH_BASE .DS.'includes'.DS.'defines.php' );
require_once ( JPATH_BASE .DS.'includes'.DS.'framework.php' );

$mainframe =& JFactory::getApplication('site');
$mainframe->initialise();

require_once(JPATH_BASE.DS.'components'.DS.'com_manager'.DS.'php'.DS.'host.php');

$modulename = JRequest::getVar('module');
$classname = JRequest::getVar('class');
$method = JRequest::getVar('method');
$arguments = JRequest::getVar('args');

$host = new Host('Joomla');

echo $host->ajax->callMethod($modulename, $classname, $method, $arguments);

exit;
?>
