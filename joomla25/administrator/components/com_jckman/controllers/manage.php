<?php
/**
 * @version		$Id: manage.php 20196 2011-01-09 02:40:25Z ian $
 * @package		Joomla.Administrator
 * @subpackage	com_installer
 * @copyright	Copyright (C) 2005 - 2011 Open Source Matters, Inc. All rights reserved.
 * @license		GNU General Public License, see LICENSE.php
 */

// No direct access.
defined('_JEXEC') or die;

/**
 * @package		Joomla.Administrator
 * @subpackage	com_installer
 */
class InstallerControllerManage extends JController
{
	/**
	 * Constructor.
	 *
	 * @param	array An optional associative array of configuration settings.
	 * @see		JController
	 * @since	1.6
	 */
	public function __construct($config = array())
	{
		parent::__construct($config);
	}

	/**
	 * Remove an extension (Uninstall).
	 *
	 * @return	void
	 * @since	1.5
	 */
	public function remove()
	{
		// Check for request forgeries
		JRequest::checkToken() or jexit(JText::_('JINVALID_TOKEN'));

		$eid	= JRequest::getVar('eid', array(), '', 'array');
		$model	= $this->getModel('manage');

		JArrayHelper::toInteger($eid, array());
		$result = $model->remove($eid);
		$view = JRequest::getVar('view','');
	
		$this->setRedirect(JRoute::_('index.php?option=com_jckman&view='.$view.'&controller=Install',false));
	}

}