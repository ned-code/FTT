<?php
/**
* @version 1.4.0
* @package RSFirewall! 1.4.0
* @copyright (C) 2009-2013 www.rsjoomla.com
* @license GPL, http://www.gnu.org/licenses/gpl-2.0.html
*/

defined('_JEXEC') or die('Restricted access');

class RSFirewallViewLogs extends JViewLegacy
{
	protected $items;
	protected $pagination;
	protected $state;
	protected $levels;
	protected $filterbar;
	protected $sidebar;
	protected $isJ30;
	
	function display( $tpl = null ) {
		$user = JFactory::getUser();
		if (!$user->authorise('logs.view', 'com_rsfirewall')) {
			$app = JFactory::getApplication();
			$app->enqueueMessage(JText::_('JERROR_ALERTNOAUTHOR'), 'error');
			$app->redirect(JRoute::_('index.php?option=com_rsfirewall', false));
		}
		
		$this->addToolBar();
		
		$this->isJ30		= $this->get('isJ30');
		
		$this->items 		= $this->get('Items');
		$this->pagination 	= $this->get('Pagination');
		$this->state 		= $this->get('State');
		$this->levels		= $this->get('Levels');
		
		$this->filterbar	= $this->get('FilterBar');		
		$this->sidebar 		= $this->get('SideBar');
		
		parent::display($tpl);
	}
	
	protected function addToolBar() {
		// set title
		JToolBarHelper::title('RSFirewall!', 'rsfirewall');
		
		require_once JPATH_COMPONENT.'/helpers/toolbar.php';
		RSFirewallToolbarHelper::addToolbar('logs');
		
		JToolBarHelper::deleteList('COM_RSFIREWALL_CONFIRM_DELETE', 'logs.delete');
		JToolBarHelper::divider();
		JToolBarHelper::custom('logs.truncate', 'delete', 'delete', JText::_('COM_RSFIREWALL_EMPTY_LOG'), false, false);
	}
	
	protected function showDate($date) {
		return JHTML::_('date', $date, 'Y-m-d H:i:s');
	}
}