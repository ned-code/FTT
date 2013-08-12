<?php
/**
 * @version		$Id: dbase.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

final class DBase {
	public function __construct() {
	}
	static public function getObject($query = null) {
		$db = &JFactory::getDBO();
		$db->setQuery($query);
		return $db->loadObject();
	}
	
	static public function getObjectResult($query = null) {
		$db = &JFactory::getDBO();
		$db->setQuery($query);
		return $db->loadResult();
	}
	
	static public function getObjectList($query = null) {
		$db = &JFactory::getDBO();
		$db->setQuery($query);
		return $db->loadObjectList();
	}
	
	static public function getObjectListPageNav($query = null,$limitstart ,$limit) {
		$db = &JFactory::getDBO();
		$db->setQuery($query,$limitstart,$limit);
		return $db->loadObjectList();
	}
	
	static public function querySQL($query = null) {
		$db = &JFactory::getDBO();
		$db->setQuery($query);
		$db->query();
	}
	
	
	
	
}
?>