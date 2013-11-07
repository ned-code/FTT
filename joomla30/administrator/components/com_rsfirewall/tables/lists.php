<?php
/**
* @version 1.4.0
* @package RSFirewall! 1.4.0
* @copyright (C) 2009-2013 www.rsjoomla.com
* @license GPL, http://www.gnu.org/licenses/gpl-2.0.html
*/

defined('_JEXEC') or die('Restricted access');

class RSFirewallTableLists extends JTable
{
	/**
	 * Primary Key
	 *
	 * @var int
	 */
	public $id 		= null;
	public $ip 		= null;
	public $type 		= null;
	public $reason 	= null;
	public $date 		= null;
	public $published 	= 1;
		
	/**
	 * Constructor
	 *
	 * @param object Database connector object
	 */
	public function __construct(& $db) {
		parent::__construct('#__rsfirewall_lists', 'id', $db);
	}
	
	public function check() {
		$query = $this->_db->getQuery(true);
		$query->select('id')
			  ->from($this->getTableName())
			  ->where($query->quoteName('ip').'='.$query->quote($this->ip));
		if ($this->id) {
			$query->where($query->quoteName('id').'!='.$query->quote($this->id));
		}
		
		$this->_db->setQuery($query);
		if ($this->_db->loadResult()) {
			$this->setError(JText::sprintf('COM_RSFIREWALL_IP_ALREADY_IN_DB', $this->ip));
			return false;
		}
		if ($this->ip == '*.*.*.*') {
			$this->setError(JText::_('COM_RSFIREWALL_IP_MASK_ERROR'));
			return false;
		}
		
		return true;
	}
	
	public function store($updateNulls = false) {
		if (!$this->id) {
			$this->date = JFactory::getDate()->toSql();
		}
		
		return parent::store($updateNulls);
	}
}