<?php
/**
* @version 1.4.0
* @package RSFirewall! 1.4.0
* @copyright (C) 2009-2013 www.rsjoomla.com
* @license GPL, http://www.gnu.org/licenses/gpl-2.0.html
*/

defined('_JEXEC') or die('Restricted access');

class RSFirewallUsersHelper
{
	protected static $groups = null;
	protected static $users = null;
	
	public static function getAdminGroups() {
		if (!is_array(self::$groups)) {
			$db 	= JFactory::getDbo();
			$query 	= $db->getQuery(true);
			$query->select($db->quoteName('id'))
				  ->from($db->quoteName('#__usergroups'));
			$db->setQuery($query);
			$groups = $db->loadColumn();
			
			self::$groups = array();
			foreach ($groups as $group_id) {
				if (JAccess::checkGroup($group_id, 'core.login.admin'))
					self::$groups[] = $group_id;
				elseif (JAccess::checkGroup($group_id, 'core.admin'))
					self::$groups[] = $group_id;
			}
			
			self::$groups = array_unique(self::$groups);
		}
		
		return self::$groups;
	}
	
	public static function getAdminUsers() {
		if (!is_array(self::$users)) {
			self::$users = array();
			
			if ($groups	= self::getAdminGroups()) {
				$db 	= JFactory::getDbo();
				$query 	= $db->getQuery(true);
				$query->select('u.*')
					  ->from('#__user_usergroup_map m')
					  ->join('right', '#__users u ON (u.id=m.user_id)')
					  ->where('m.group_id IN ('.implode(',', $groups).')')
					  ->order('u.username ASC')
					  ->group('u.id');
				$db->setQuery($query);
				self::$users = $db->loadObjectList();
			}
		}
		
		return self::$users;
	}
}