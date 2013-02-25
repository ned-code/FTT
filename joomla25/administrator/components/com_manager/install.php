<?php
// No direct access to this file
defined('_JEXEC') or die('Restricted access');
// set time limit 5 min.
set_time_limit(300);

/**
 * Script file of JMB Manager component
 */
class com_managerInstallerScript
{
	/**
	 * method to install the component
	 *
	 * @return void
	 */
	function install($parent) 
	{
		
		$manifest = $parent->get("manifest");
		$parent = $parent->getParent();
		$source = $parent->getPath("source");
		
		$installer = new JInstaller();
		
		/*
		// Install plugins
		foreach($manifest->plugins->plugin as $plugin) {
			$attributes = $plugin->attributes();
			$plg = $source . DS . $attributes['folder'].DS.$attributes['plugin'];
			$installer->install($plg);
		}
		*/
		
		// Install modules
		foreach($manifest->modules->module as $module) {
			$attributes = $module->attributes();
			$mod = $source . DS . $attributes['folder'].DS.$attributes['module'];
			$installer->install($mod);
		}
		
		/*
		$db = JFactory::getDbo();
		$tableExtensions = $db->nameQuote("#__extensions");
		$columnElement   = $db->nameQuote("element");
		$columnType      = $db->nameQuote("type");
		$columnEnabled   = $db->nameQuote("enabled");
            
		
		// Enable plugins
		$db->setQuery(
			"UPDATE 
				$tableExtensions
			SET
				$columnEnabled=1
			WHERE
				$columnElement='jmbplugin'
			AND
				$columnType='plugin'"
		);
            
		$db->query();
		*/
		
		// $parent is the class calling this method
		$parent->setRedirectURL('index.php?option=com_manager');	

	}

	/**
	 * method to uninstall the component
	 *
	 * @return void
	 */
	function uninstall($parent) 
	{
		// $parent is the class calling this method
		echo '<p>JMB Manager uninstall</p>';
	}
}
