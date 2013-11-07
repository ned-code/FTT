<?php
/**
* @version 1.4.0
* @package RSFirewall! 1.4.0
* @copyright (C) 2009-2013 www.rsjoomla.com
* @license GPL, http://www.gnu.org/licenses/gpl-2.0.html
*/

defined('_JEXEC') or die('Restricted access');

class RSFirewallModelList extends JModelAdmin
{
	public function getTable($type = 'Lists', $prefix = 'RSFirewallTable', $config = array()) {
		$table = JTable::getInstance($type, $prefix, $config);
		return $table;
	}
	
	public function getForm($data = array(), $loadData = true) {
		$app 	= JFactory::getApplication();
		$input 	= $app->input;
		$type	= $input->get('layout') == 'bulk' ? 'list_bulk' : 'list';
		
		// Get the form.
		$form = $this->loadForm('com_rsfirewall.'.$type, $type, array('control' => 'jform', 'load_data' => $loadData));
		if (empty($form)) {
			return false;
		}

		return $form;
	}
	
	protected function loadFormData() {
		// Check the session for previously entered form data.
		$app  = JFactory::getApplication();
		$data = $app->getUserState('com_rsfirewall.edit.list.data', array());

		if (empty($data)) {
			$data = $this->getItem();
		}

		return $data;
	}
	
	public function getIP() {
		require_once JPATH_ADMINISTRATOR.'/components/com_rsfirewall/helpers/ip.php';
		
		return RSFirewallIP::get();
	}
	
	public function getRSFieldset() {
		require_once JPATH_COMPONENT.'/helpers/adapters/fieldset.php';
		
		$fieldset = new RSFieldset();
		return $fieldset;
	}
}