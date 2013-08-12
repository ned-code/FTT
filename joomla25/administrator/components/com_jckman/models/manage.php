<?php
/**
 * @version		$Id: manage.php 20267 2011-01-11 03:44:44Z eddieajau $
 * @package		Joomla.Administrator
 * @subpackage	com_installer
 * @copyright	Copyright (C) 2005 - 2011 Open Source Matters, Inc. All rights reserved.
 * @license		GNU General Public License version 2 or later; see LICENSE.txt
 */


// No direct access.
defined('_JEXEC') or die;

// Import library dependencies
require_once dirname(__FILE__) . '/extension.php';

/**
 * Installer Manage Model
 *
 * @package		Joomla.Administrator
 * @subpackage	com_installer
 * @since		1.5
 */
class InstallerModelManage extends JModel
{
	/**
	 * Constructor.
	 *
	 * @param	array	An optional associative array of configuration settings.
	 * @see		JController
	 * @since	1.6
	 */
	public function __construct($config = array())
	{

		parent::__construct($config);
	}

	/**
	 * Remove (uninstall) an extension
	 *
	 * @param	array	An array of identifiers
	 * @return	boolean	True on success
	 * @since	1.5
	 */
	function remove($eid = array())
	{
		// Initialise variables.
		$user = JFactory::getUser();
		if ($user->authorise('core.delete', 'com_installer')) {

			// Initialise variables.
			$failed = array();

			/*
			* Ensure eid is an array of extension ids in the form id => client_id
			* TODO: If it isn't an array do we want to set an error and fail?
			*/
			if (!is_array($eid)) {
				$eid = array($eid => 0);
			}

					// Get a database connector
			$db = JFactory::getDBO();

			// Get an installer object for the extension type
			//jimport('joomla.installer.installer');
			//$installer = JInstaller::getInstance();
			require_once( JPATH_COMPONENT .DS.'helpers'.DS.'installer.php' );
			$view = JRequest::getVar('view',false);
			$installer = & JCKInstaller::getInstance();
			
			//$row = JTable::getInstance('extension');
			$view = JRequest::getVar('view',false);
			
		
			// Uninstall the chosen extensions
		
			foreach($eid as $id => $clientid) {
				$id = trim($id);
				if ($view) {
					$result = $installer->uninstall($view, $id);

					// Build an array of extensions that failed to uninstall
					if ($result === false) {
						$failed[] = $id;
					}
				}
				else {
					$failed[] = $id;
				}
			}

			$langstring = 'COM_INSTALLER_TYPE_TYPE_'. strtoupper($row->type);
			$rowtype = JText::_($langstring);
			if(strpos($rowtype, $langstring) !== false) {
				$rowtype = $row->type;
			}

			if (count($failed)) {

				// There was an error in uninstalling the package
				$msg = JText::sprintf('COM_INSTALLER_UNINSTALL_ERROR', $rowtype);
				$result = false;
			} else {

				// Package uninstalled sucessfully
				$msg = JText::sprintf('COM_INSTALLER_UNINSTALL_SUCCESS', $rowtype);
				$result = true;
			}
			$app = JFactory::getApplication();
			$app->enqueueMessage($msg);
			$this->setState('action', 'remove');
			$this->setState('name', $installer->get('name'));
			$app->setUserState('com_installer.message', $installer->message);
			$app->setUserState('com_installer.extension_message', $installer->get('extension_message'));
			return $result;
		} else {
			$result = false;
			JError::raiseWarning(403, JText::_('JERROR_CORE_DELETE_NOT_PERMITTED'));
		}
	}
	
}
