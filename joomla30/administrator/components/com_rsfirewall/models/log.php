<?php
/**
* @version 1.4.0
* @package RSFirewall! 1.4.0
* @copyright (C) 2009-2013 www.rsjoomla.com
* @license GPL, http://www.gnu.org/licenses/gpl-2.0.html
*/

defined('_JEXEC') or die('Restricted access');

class RSFirewallModelLog extends JModelAdmin
{
	public function getTable($type = 'Logs', $prefix = 'RSFirewallTable', $config = array()) {
		$table = JTable::getInstance($type, $prefix, $config);
		return $table;
	}
	
	public function getForm($data = array(), $loadData = true) {
		$app 	= JFactory::getApplication();
		$input 	= $app->input;
		
		// Get the form.
		$form = $this->loadForm('com_rsfirewall.log', 'log', array('control' => 'jform', 'load_data' => $loadData));
		if (empty($form)) {
			return false;
		}

		return $form;
	}
	
	protected function loadFormData() {
		// Check the session for previously entered form data.
		$app  = JFactory::getApplication();
		$data = $app->getUserState('com_rsfirewall.edit.log.data', array());

		if (empty($data)) {
			$data = $this->getItem();
		}

		return $data;
	}
	
	function truncate() {
		$db = JFactory::getDBO();
		$db->truncateTable('#__rsfirewall_logs');
		
		RSFirewallLogger::getInstance()->add('critical', 'LOG_EMPTIED');
	}
}