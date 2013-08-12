<?php

/**
 * @version		$Id: install.php 9764 2007-12-30 07:48:11Z ircmaxell $
 * @package		Joomla
 * @subpackage	Menus
 * @copyright	Copyright (C) 2005 - 2008 Open Source Matters. All rights reserved.
 * @license		GNU/GPL, see LICENSE.php
 * Joomla! is free software. This version may have been modified pursuant to the
 * GNU General Public License, and as distributed it includes or is derivative
 * of works licensed under the GNU General Public License or other free or open
 * source software licenses. See COPYRIGHT.php for copyright notices and
 * details.
 */

// Check to ensure this file is included in Joomla!
defined('_JEXEC') or die();

jimport( 'joomla.application.component.model' );
//jimport( 'joomla.installer.installer' );
jimport('joomla.installer.helper');



/**
 * Extension Manager Install Model
 *
 * @package		Joomla
 * @subpackage	Installer
 * @since		1.5
 */
class ImportModelImport extends JModel
{
	/** @var object JTable object */
	var $_table = null;

	/** @var object JTable object */
	var $_url = null;

	/**
	 * Overridden constructor
	 * @access	protected
	 */
	
	function __construct()
	{
		parent::__construct();

	}
	

	function import()
	{
		$mainframe =& JFactory::getApplication();

		$this->setState('action', 'install');

		switch(JRequest::getWord('installtype'))
		{
			case 'folder':
				$package = $this->_getPackageFromFolder();
				return false;
				break;

			case 'upload':
				$package = $this->_getPackageFromUpload();
				return false;
				break;


			default:
				$this->setState('message', 'No Install Type Found');
				return false;
				break;
		}

		// Was the package unpacked?
		if (!$package) {
			$this->setState('message', 'Unable to find install package');
			return false;
		}

		return false;
	}

		/**
	 * Works out an installation package from a HTTP upload
	 *
	 * @return package definition or false on failure
	 */
	protected function _getPackageFromUpload()
	{
		//$msg = 'This feature has been disabled. Please upgrade to the full version to use this facility.';
		//JError::raise(E_NOTICE, '101', $msg);
	}

	/**
	 * Install an extension from a directory
	 *
	 * @static
	 * @return boolean True on success
	 * @since 1.0
	 */
	protected function _getPackageFromFolder()
	{
		//$msg = 'This feature has been disabled. Please upgrade to the full version to use this facility.';
		//JError::raise(E_NOTICE, '101', $msg);
	}
	
}