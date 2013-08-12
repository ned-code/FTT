<?php

error_reporting(E_ERROR);

define( '_JEXEC', 1 );

define( 'DS', DIRECTORY_SEPARATOR );
//get root folder
$dir = explode(DS,dirname(__FILE__));

array_splice($dir,-4);

$base_folder = implode(DS,$dir);

define('JPATH_BASE', $base_folder);



require_once ( JPATH_BASE .DS.'includes'.DS.'defines.php' );
require_once ( JPATH_BASE .DS.'includes'.DS.'framework.php' );

$mainframe =& JFactory::getApplication('administrator');

jimport('joomla.plugin.helper');
$plugins = JPluginHelper::getPlugin('system');
 //wipe them out
 foreach($plugins as $plugin)
 {
	$plugin->type = 'notToBeUsed'; //change type from system
 }
$mainframe->initialise();


//Get JVersion
if(file_exists(JPATH_BASE .DS.'includes'.DS.'version.php'))
	require_once ( JPATH_BASE .DS.'includes'.DS.'version.php' );
else
	jimport('joomla.version');
	
$JVersion = new JVersion();

$isJ1_5 = !version_compare( $JVersion->getShortVersion(), '1.6', 'gt' );

$mainframe->route();

/**
 * DISPATCH THE APPLICATION
 *
 * NOTE :
 */
 

jimport('joomla.application.component.controller');
$component_path = dirname(__FILE__);
require_once($component_path .DS.'controller.php');
if($isJ1_5)
{ 
	define('JLEGACY_CMS',$isJ1_5);
	$controller = new InstallController(array('base_path'=>$component_path));
}
else
{
	$controller = JController::getInstance('Install',array('base_path'=>$component_path));
}
 

$task = JRequest::getCmd('task','');
ob_start();
$controller->execute($task);
$controller->redirect();
$contents = ob_get_contents();
ob_end_clean();

ob_start();
$document = JFactory::getDocument();
$head = $document->getBuffer('head');


$head = '<html><head>' . $head. '</head>';
echo $head. '<body>'.$contents .'</body></html>';