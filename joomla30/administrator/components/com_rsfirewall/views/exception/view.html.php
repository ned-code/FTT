<?php
/**
* @version 1.4.0
* @package RSFirewall! 1.4.0
* @copyright (C) 2009-2013 www.rsjoomla.com
* @license GPL, http://www.gnu.org/licenses/gpl-2.0.html
*/

defined('_JEXEC') or die('Restricted access');

class RSFirewallViewException extends JViewLegacy
{
	protected $form;
	protected $item;
	protected $field;
	protected $ip;
	
	public function display($tpl = null) {
		$user = JFactory::getUser();
		if (!$user->authorise('exceptions.manage', 'com_rsfirewall')) {
			$app = JFactory::getApplication();
			$app->enqueueMessage(JText::_('JERROR_ALERTNOAUTHOR'), 'error');
			$app->redirect(JRoute::_('index.php?option=com_rsfirewall', false));
		}
	
		$this->addToolBar();
		
		$this->form	= $this->get('Form');
		$this->item	= $this->get('Item');
		$this->ip	= $this->get('IP');
		
		$this->field = $this->get('RSFieldset');
		
		parent::display($tpl);
	}
	
	protected function addToolBar() {
		// set title
		JToolBarHelper::title('RSFirewall!', 'rsfirewall');
		
		require_once JPATH_COMPONENT.'/helpers/toolbar.php';
		RSFirewallToolbarHelper::addToolbar('exceptions');
		
		$layout = $this->getLayout();
		switch ($layout) {
			case 'edit':
				JToolBarHelper::apply('exception.apply');
				JToolBarHelper::save('exception.save');
				JToolBarHelper::save2new('exception.save2new');
				JToolBarHelper::save2copy('exception.save2copy');
				JToolBarHelper::cancel('exception.cancel');
			break;
			
			case 'bulk':
				JToolBarHelper::save('exception.bulksave');
				JToolBarHelper::cancel('exception.cancel');
			break;
		}
	}
}