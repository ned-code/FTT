<?php

// Check to ensure this file is within the rest of the framework
defined('JPATH_BASE') or die();

jimport('joomla.installer.installer');

/**
 * Joomla base installer class
 *
 * @author		Louis Landry <louis.landry@joomla.org>
 * @package		Joomla.Framework
 * @subpackage	Installer
 * @since		1.5
 */
class JCKRestorer extends JInstaller
{


	/**
	 * Returns a reference to the global Installer object, only creating it
	 * if it doesn't already exist.
	 *
	 * @static
	 * @return	object	An installer object
	 * @since 1.5
	 */
	public static function &getInstance()
	{
		static $instance;

		if (!isset ($instance)) {
			$instance = new JCKRestorer();
		}
		return $instance;
	}

	/**
	 * Set an installer adapter by name
	 *
	 * @access	public
	 * @param	string	$name		Adapter name
	 * @param	object	$adapter	Installer adapter object
	 * @return	boolean True if successful
	 * @since	1.5
	 */
	public function setAdapter($name, &$adapter = null,$options = array())
	{
		// Check if valid extension type
		if( $name == 'plugin' || $name == 'language' || $name == 'skin' || $name== 'backup'){
			if (!is_object($adapter))
			{			
				// Try to load the adapter object
				require_once(dirname(__FILE__).DS. '..'.DS.'restorers'.DS.strtolower($name).'.php');
				$class = 'JCKRestorer'.ucfirst($name);
				if (!class_exists($class)) {
					return false;
				}
				$adapter = new $class($this);
				$adapter->parent =& $this;
			}
			$this->_adapters[$name] = $adapter;
			return true;
		}else{
			$this->abort(JText::_('Incorrect version!'));
		}
	}
		
}