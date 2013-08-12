<?php

error_reporting(E_ERROR);

define('DS',DIRECTORY_SEPARATOR);

define('CKEDITOR_INCLUDES_DIR','jckeditor/includes');

//Get root folder
$dir = explode(DS,dirname(__FILE__));
array_splice($dir,-3);
$base_folder = implode(DS,$dir);
$base_path = '';
$user = '';

define( '_JEXEC', 1 );
define('JPATH_BASE',$base_folder);
//Needed for 1.6
define('JDEBUG',false);

require_once ( JPATH_BASE .DS.'includes'.DS.'defines.php' );

/* Load in the configuation file */
require_once( JPATH_CONFIGURATION	.DS.'configuration.php' );

define('JPATH_PLATFORM',JPATH_LIBRARIES);

/*load loader class */
require_once(JPATH_LIBRARIES .DS.'loader.php' );

defined('_JREQUEST_NO_CLEAN',1);

if(file_exists(JPATH_LIBRARIES.'/import.php'))
	require_once JPATH_LIBRARIES.'/import.php';
elseif(file_exists(JPATH_LIBRARIES.'/joomla/import.php'))
	require_once JPATH_LIBRARIES.'/joomla/import.php';	

// Botstrap the CMS libraries.
if(file_exists(JPATH_LIBRARIES.'/cms.php'))
	require_once JPATH_LIBRARIES.'/cms.php';
	
	
if (!class_exists('JVersion')) {
	if(file_exists(JPATH_ROOT.'/includes/version.php'))
		require JPATH_ROOT.'/includes/version.php';
}		

jimport('joomla.filter.filterinput');
jimport('joomla.environment.uri');
jimport('joomla.environment.request');
jimport('joomla.environment.response');
jimport('joomla.language.language');
jimport('joomla.user.user');
jimport('joomla.application.component.model');
jimport('joomla.database.table');
jimport('joomla.html.parameter');
jimport('joomla.plugin.helper');
jimport('joomla.event.dispatcher');
jimport( 'joomla.utilities.arrayhelper' );	
jimport('joomla.log.log');
jimport('joomla.application.component.helper');

/* load JCK loader class*/
require_once (CKEDITOR_INCLUDES_DIR . '/loader.php');

//lets set DB configuration
$config = new JConfig();
// Get the global configuration object
$registry = JFactory::getConfig();
// Load the configuration values into the registry
$registry->loadObject($config);

//set session
jckimport('ckeditor.user.user');
$session = JCKUser::getSession();

// system events trigger events
jckimport('ckeditor.plugins.helper');

//load CK System plugins
JCKPluginsHelper::storePlugins('default');

$dispatcher = JDispatcher::getInstance();

$plugin = JPluginHelper::getPlugin('editors','jckeditor');
$params = new JParameter($plugin->params);

//import System plugin first
JCKPluginsHelper::importPlugin('default');

$dispatcher->trigger('intialize',array(&$params));

$plugin->params = $params->toString();