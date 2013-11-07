<?php
/**
* @version 1.4.0
* @package RSFirewall! 1.4.0
* @copyright (C) 2009-2013 www.rsjoomla.com
* @license GPL, http://www.gnu.org/licenses/gpl-2.0.html
*/

defined('_JEXEC') or die('Restricted access');

class RSFirewallViewCheck extends JViewLegacy
{
	protected $accessFile;
	protected $defaultAccessFile;
	protected $isWindows;
	protected $isPHP54;
	protected $offset;
	protected $sidebar;
	
	public function display($tpl = null) {
		$user = JFactory::getUser();
		if (!$user->authorise('check.run', 'com_rsfirewall')) {
			$app = JFactory::getApplication();
			$app->enqueueMessage(JText::_('JERROR_ALERTNOAUTHOR'), 'error');
			$app->redirect(JRoute::_('index.php?option=com_rsfirewall', false));
		}
		
		$this->addToolBar();
		
		if ($this->get('IsOldIE')) {
			$app = JFactory::getApplication();
			$app->enqueueMessage(JText::_('COM_RSFIREWALL_IE_WARNING_DESC'), 'notice');
		}
		
		// the access file depends on the OS we're in
		$this->accessFile 		 = $this->get('accessFile');
		$this->defaultAccessFile = $this->get('defaultAccessFile');
		
		// on Windows we need to skip a few things
		$this->isWindows = $this->get('isWindows');
		
		// on PHP 5.4 we need to skip safe_mode
		$this->isPHP54	= version_compare(phpversion(), '5.4.0', '>=');
		
		$this->offset = $this->get('Offset');
		
		$this->sidebar = $this->get('SideBar');
		
		parent::display($tpl);
	}
	
	protected function addToolbar() {
		// set title
		JToolBarHelper::title('RSFirewall!', 'rsfirewall');
		
		require_once JPATH_COMPONENT.'/helpers/toolbar.php';
		RSFirewallToolbarHelper::addToolbar('check');
	}
}