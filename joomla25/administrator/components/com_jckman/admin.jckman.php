<?php

// no direct access

defined( '_JEXEC' ) or die( 'Restricted access' );

// Require specific controller
// Controller

//load base classes
require_once (JPATH_COMPONENT.DS.'base'.DS.'loader.php');

//defines CKEDITOR library includes path
define('CKEDITOR_LIBRARY',JPATH_PLUGINS.DS.'editors'.DS.'jckeditor'.DS.'jckeditor'.DS.'includes'.DS.'ckeditor'); 


define('JCK_COMPONENT', JUri::root() . 'administrator/components/com_jckman');

//load  default style sheets
$document = JFactory::getDocument();
$document->addStyleSheet( JCK_COMPONENT . '/css/header.css', 'text/css' );


jckimport('base.controller');

//register all event listeners
JCKRegisterAllEventlisetners();
$mainframe = JFactory::getApplication();

if(is_dir(CKEDITOR_LIBRARY))
{
	require_once('helper.php');
	$controller = JRequest::getWord('controller','cpanel');
	if($controller == 'cpanel')
	{
		
		if(JRequest::getCmd('task','') != 'check')
		{
			$mainframe =& JFactory::getApplication();	
			$mainframe->enqueueMessage("This is a free version of the JCK manger with limited functionality. If you require plugin management features please upgrade to the professional version.","notice");
		}
	}
}	
else
{	
	require_once('helper.php');
	$controller = 'cpanel';
	$mainframe->enqueueMessage("System couldn't detect JoomlaCK Edtior: Please check file permissions or ensure you have installed the editor");
}	
// Require specific controller if requested

jckimport('controllers.' . $controller );

//require_once (JPATH_COMPONENT.DS.'controllers'.DS.$controller.'.php');



if($controller == "Install")
{

	require_once (JPATH_COMPONENT.DS.'controllers'.DS. 'install.php');
 
   $ext = JRequest::getWord('type');
   $subMenus = array(	'Plugins'	=> 'plugin'   						);
	addCustomSubMenus($controller,$ext,$subMenus,'manage','Post');
    
	//load language file,
	
	$lang = JFactory::getLanguage();
	$lang->load('com_installer',JPATH_ADMINISTRATOR);
	
	// Create the controller
	jimport('joomla.client.helper');
	$controller = JController::getInstance('Installer',array(
	'base_path' =>  dirname( __FILE__ )));
	
	//var_dump(JRequest::getWord('task'));
	//var_dump($controller);
	//die();	
	
	
	 if(!is_a($controller,'InstallerController'))
	 {
	 	$mainframe->setUserState('com_installer.redirect_url', 'index.php?option=com_jckman&controller=Install');
	 }
	$controller->execute(JRequest::getCmd( 'task' ));
	$controller->redirect();

}
else 
{
    // main helper class
	jckimport('helper');
	// global include classes
	jckimport('parameter.parameter');
	jckimport('html.html');
	
	$ext = JRequest::getWord('type');
    $subMenus = array(	'Plugin Manager'=> 'list','Installer'=> 'Install','Layout Manager'	=> 'toolbars','Restore Backup' =>'import');
		
	
	addCustomSubMenus($controller,$ext,$subMenus,'');
	jimport( 'joomla.application.component.controller' );
	// Create the controller
	//$classname    = $controller. 'Controller';
	$controller   =  JController::getInstance($controller);//new $classname( );
	$controller->execute(JRequest::getCmd( 'task' ));
	$controller->redirect();
}

function addCustomSubMenus($controller,$type, $subMenus, $task = '',$action = 'Get')
{

	switch($action)
	{
		case 'Post' :
			JSubMenuHelper::addEntry(JText::_( $controller ), '#" onclick="javascript:document.adminForm.view.value=\''.$controller.'\'; document.adminForm.task.value=\'\';Joomla.submitbutton(\'\');', !in_array( $type, $subMenus));
		
			foreach ($subMenus as $name => $extension) 
			{
				JSubMenuHelper::addEntry(JText::_( $name ), '#" onclick="javascript:document.adminForm.view.value=\''.$extension.'\';Joomla.submitbutton(\''. $task.'\');', (			$extension == $type));
			}
		
		break;
		default :
		
			if($type == '')
				$type = $controller;
			foreach ($subMenus as $name => $extension) 
			{
				JSubMenuHelper::addEntry(JText::_( $name ), 'index.php?option=com_jckman&controller='.$extension.'"', ($extension == $type));
			}
	}

 	
}

?>


