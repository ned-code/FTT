<?php

// defines database connection data
//Cause browser to reload page every time
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past


// set syatem constants
define( 'DS', DIRECTORY_SEPARATOR );

//get root folder
$rootFolder = explode(DS,dirname(__FILE__));
	
//current level in diretoty structure
$currentfolderlevel = 6;

array_splice($rootFolder,-$currentfolderlevel);

$base_folder = implode(DS,$rootFolder);

define( '_JEXEC', 1 );

define('JPATH_BASE',implode(DS,$rootFolder));

require_once ( JPATH_BASE .DS.'includes'.DS.'defines.php' );
	
/* Load in the configuation file */

//require_once( '../../../../../../../configuration.php' );
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

/* Load Joomla's required classes */

jimport('joomla.filter.filterinput');
jimport('joomla.log.log');
jimport('joomla.database.database');
jimport('joomla.factory');
jimport('joomla.error.error');
jimport('joomla.environment.uri');

//get system parameters

$JConfig = new JConfig();

							
define('DB_DRIVER',$JConfig->dbtype);
define('DB_HOST', $JConfig->host);
define('DB_USER', $JConfig->user );
define('DB_PASSWORD',$JConfig->password);
define('DB_DATABASE', $JConfig->db ); 
define('DB_PREFIX', $JConfig->dbprefix); 
define('DB_OFFLINE', $JConfig->offline);

