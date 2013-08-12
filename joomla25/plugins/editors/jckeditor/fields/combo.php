<?php
/**
 * JRefactored
 * 
 * @author Andrew Williams <andrew@webxsolution.com>
 * @copyright Copyright (c) 2011, WebxSolution Ltd
 * @license Commercial
 * Webxsolution Ltd believes that Joomla has a flaw in the way new pages are created.
 * It is long winded having to go to different application to add new details
 * to pages and products.  The interfaces are always different and there is no
 * way of controlling the layouts.  This application aims to address these problems
 * making the learning curve of Joomla shorter.
*/

define('DS',DIRECTORY_SEPARATOR);

$dir = explode(DS,dirname(__FILE__));
array_splice($dir,-4);
$base_folder = implode(DS,$dir);
$base_path = '';
$user = '';

define( '_JEXEC', 1 );
define('JPATH_BASE',$base_folder);

require_once ( JPATH_BASE .DS.'includes'.DS.'defines.php' );

/* Load in the configuation file */
require_once( JPATH_CONFIGURATION	.DS.'configuration.php' );

/*load loader class */
require_once(JPATH_LIBRARIES .DS.'loader.php' );

require_once ( JPATH_BASE .DS.'includes'.DS.'defines.php' );

/*load joomla loader class */
require_once(JPATH_LIBRARIES .DS.'loader.php' );



require_once(JPATH_LIBRARIES .DS.'joomla'.DS .'methods.php' );

jimport('joomla.base.object');
jimport('joomla.filter.filterinput');
jimport('joomla.factory');
jimport('joomla.error.error');
jimport('joomla.environment.uri');
jimport('joomla.environment.request');
jimport('joomla.language.language');
jimport('joomla.user.user');
jimport('joomla.html.parameter');
jimport('joomla.plugin.helper');
jimport('joomla.application.component.model');
jimport('joomla.database.table');

//lets set DB configuration
$config = new JConfig();
// Get the global configuration object
$registry =& JFactory::getConfig();
// Load the configuration values into the registry
$registry->loadObject($config);


$field = JRequest::getVar( 'field', '' );

$mainframe = JFactory::getApplication('site');

$plugin = JPluginHelper::getPlugin('editors','jckeditor');

$params = new JParameter($plugin->params);

echo $params->get($field,'');