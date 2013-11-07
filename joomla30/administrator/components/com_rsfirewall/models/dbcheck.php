<?php
/**
* @version 1.4.0
* @package RSFirewall! 1.4.0
* @copyright (C) 2009-2013 www.rsjoomla.com
* @license GPL, http://www.gnu.org/licenses/gpl-2.0.html
*/

defined('_JEXEC') or die('Restricted access');

class RSFirewallModelDBCheck extends JModelLegacy
{	
	public function __construct() {
		parent::__construct();
	}
	
	public function getIsSupported() {
		$app = JFactory::getApplication();
		return (strpos($app->getCfg('dbtype'), 'mysql') !== false);
	}
	
	public function getTables() {
		$db = $this->getDbo();
		$db->setQuery("SHOW TABLE STATUS");
		return $db->loadObjectList();
	}
	
	public function optimizeTables() {
		$app 	= JFactory::getApplication();
		$db 	= $this->getDbo();
		$query	= $db->getQuery(true);
		$table 	= $app->input->getVar('table');
		$return = array(
			'optimize' => '',
			'repair' => ''
		);
		
		try {
			// Optimize
			$db->setQuery("OPTIMIZE TABLE ".$db->quoteName($table));
			$result = $db->loadObject();
			$return['optimize'] = $result->Msg_text;
		} catch (Exception $e) {
			$this->setError($e->getMessage());
			return false;
		}
		
		try {
			// Repair
			$db->setQuery("REPAIR TABLE ".$db->quoteName($table));
			$result = $db->loadObject();
			$return['repair'] = $result->Msg_text;
		} catch (Exception $e) {
			return false;
		}
		
		return $return;
	}
	
	public function getSideBar() {
		require_once JPATH_COMPONENT.'/helpers/toolbar.php';
		
		return RSFirewallToolbarHelper::render();
	}
}