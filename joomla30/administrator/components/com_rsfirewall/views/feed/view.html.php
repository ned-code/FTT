<?php
/**
* @version 1.4.0
* @package RSFirewall! 1.4.0
* @copyright (C) 2009-2013 www.rsjoomla.com
* @license GPL, http://www.gnu.org/licenses/gpl-2.0.html
*/

defined('_JEXEC') or die('Restricted access');

class RSFirewallViewFeed extends JViewLegacy
{
	protected $form;
	protected $item;
	protected $field;
	
	public function display($tpl = null) {
		$user = JFactory::getUser();
		if (!$user->authorise('feeds.manage', 'com_rsfirewall')) {
			$app = JFactory::getApplication();
			$app->enqueueMessage(JText::_('JERROR_ALERTNOAUTHOR'), 'error');
			$app->redirect(JRoute::_('index.php?option=com_rsfirewall', false));
		}
		
		$this->addToolBar();
		
		$this->form	= $this->get('Form');
		$this->item	= $this->get('Item');
		
		$this->field = $this->get('RSFieldset');
		
		parent::display($tpl);
	}
	
	protected function addToolbar() {
		// set title
		JToolBarHelper::title('RSFirewall!', 'rsfirewall');
		
		require_once JPATH_COMPONENT.'/helpers/toolbar.php';
		RSFirewallToolbarHelper::addToolbar('feeds');
		
		JToolBarHelper::apply('feed.apply');
		JToolBarHelper::save('feed.save');
		JToolBarHelper::save2new('feed.save2new');
		JToolBarHelper::save2copy('feed.save2copy');
		JToolBarHelper::cancel('feed.cancel');
	}
}