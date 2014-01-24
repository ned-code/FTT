<?php
/**
 * ARRA User Export Import component for Joomla! 1.6
 * @version 1.6.0
 * @author ARRA (joomlarra@gmail.com)
 * @link http://www.joomlarra.com
 * @Copyright (C) 2010 - 2011 joomlarra.com. All Rights Reserved.
 * @license GNU General Public License version 2, see LICENSE.txt or http://www.gnu.org/licenses/gpl-2.0.html
 * PHP code files are distributed under the GPL license. All icons, images, and JavaScript code are NOT GPL (unless specified), and are released under the joomlarra Proprietary License, http://www.joomlarra.com/licenses.html
 *
 * file: language.php
 *
 **** class 
     ArrausermigrateModelStatistics 
	 
 **** functions
     __construct();    
 */

// No direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.application.component.model');

/**
 * ArrausermigrateModelStatistics
 */
class ArrausermigrateModelStatistics extends JModelLegacy{
	/**
	 * Constructor that retrieves the ID from the request
	 * @access	public
	 * @return	void
	 */
	function __construct(){		
		parent::__construct();
	}

	function getAllTypes(){
		$db =& JFactory::getDBO();		
		$query = $db->getQuery(true);
		$query->clear();		
		$query->select('id, title');
		$query->from('#__usergroups');
		$db->setQuery($query);		
		$db->query();
		$result = $db->loadAssocList();	
		return $result;
	}
	
	function getExistingTypes(){
		$db =& JFactory::getDBO();		
		$query = $db->getQuery(true);
		$query->clear();		
		$query->select('distinct(title), id');
		$query->from('#__usergroups ug, #__user_usergroup_map ugm');
		$query->where('ug.id = ugm.group_id');
		$db->setQuery($query);		
		$db->query();
		$result = $db->loadAssocList();
		return $result;
	}
	
	function getAllUsers(){
		$db =& JFactory::getDBO();		
		$query = $db->getQuery(true);
		$query->clear();		
		$query->select('count(*)');
		$query->from('#__users');
		$db->setQuery($query);		
		$db->query();
		$result = $db->loadResult();
		return $result;
	}
	
	function getAllUsersMapped(){
		$db =& JFactory::getDBO();		
		$query = $db->getQuery(true);
		$query->clear();		
		$query->select('count(*)');
		$query->from('#__user_usergroup_map');
		$db->setQuery($query);		
		$db->query();
		$result = $db->loadResult();
		return $result;
	}
	
	function countUsers(){
		$db =& JFactory::getDBO();		
		$query = $db->getQuery(true);
		$query->clear();		
		$query->select('g.title, count(*) as total');
		$query->from('#__users u, #__user_usergroup_map ugm, #__usergroups g');
		$query->where("u.id=ugm.user_id and ugm.group_id=g.id");
		$query->group("g.title");
		$db->setQuery($query);		
		$db->query();
		$result = $db->loadAssocList();
		return $result;		
	}
}