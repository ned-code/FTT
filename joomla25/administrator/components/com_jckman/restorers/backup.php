<?php
 
 /*
 * Modified for use as the J plugin installer
 * AW
 */


// Check to ensure this file is within the rest of the framework
defined('JPATH_BASE') or die();

define('JCKPATH_COMPONENT', JPATH_ADMINISTRATOR.'/components/com_jckman');


/**
 * Backup restorer
 *
 * @package		Joomla.Framework
 * @subpackage	Installer
 * @since		1.5
 * Renamed JInstallerPlugin to JCKRestorerPlugin
 */
  
  
 
class JCKRestorerBackup extends JObject
{
	/**
	 * Constructor
	 *
	 * @access	protected
	 * @param	object	$parent	Parent object [JInstaller instance]
	 * @return	void
	 * @since	1.5
	 */
	 	 
	
	function __construct(&$parent)
	{
		$this->parent =& $parent;
	}
	
	/**
	 * Custom install method
	 *
	 * @access	public
	 * @return	boolean	True on success
	 * @since	1.5
	 * Minor alteration - see below
	 */
	function install()
	{
		return true;
	}

	/**
	 * Custom rollback method
	 * 	- Roll back the plugin item
	 *
	 * @access	public
	 * @param	array	$arg	Installation step to rollback
	 * @return	boolean	True on success
	 * @since	1.5
	 * Minor changes to the db query
	 */
	function _rollback_plugin($arg)
	{
		return true;
	}
}