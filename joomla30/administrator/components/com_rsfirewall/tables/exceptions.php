<?php
/**
* @version 1.4.0
* @package RSFirewall! 1.4.0
* @copyright (C) 2009-2013 www.rsjoomla.com
* @license GPL, http://www.gnu.org/licenses/gpl-2.0.html
*/

defined('_JEXEC') or die('Restricted access');

class RSFirewallTableExceptions extends JTable
{
	/**
	 * Primary Key
	 *
	 * @public int
	 */
	public $id 			= null;
	public $type 		= null;
	public $regex 		= null;
	public $match 		= null;
	public $php 		= null;
	public $sql 		= null;
	public $js 			= null;
	public $uploads 	= null;
	public $reason 		= null;
	public $date 		= null;
	public $published 	= 1;
		
	/**
	 * Constructor
	 *
	 * @param object Database connector object
	 */
	public function __construct(& $db) {
		parent::__construct('#__rsfirewall_exceptions', 'id', $db);
	}
	
	public function store($updateNulls = false) {
		if (!$this->id) {
			$this->date = JFactory::getDate()->toSql();
		}
		
		return parent::store($updateNulls);
	}
}