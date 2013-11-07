<?php
/**
* @version 1.4.0
* @package RSFirewall! 1.4.0
* @copyright (C) 2009-2013 www.rsjoomla.com
* @license GPL, http://www.gnu.org/licenses/gpl-2.0.html
*/

defined('_JEXEC') or die('Restricted access');

abstract class RSFirewallSnapshot
{
	public static function create($user) {
		$db 	= JFactory::getDbo();
		$query 	= $db->getQuery(true);
		$query->select('*')
			  ->from('#__user_usergroup_map')
			  ->where($db->quoteName('user_id').'='.(int) $user->id);
		$db->setQuery($query);
		
		$snapshot = (object) array(
			'adjacent' 	=> array(
				// #__user_usergroup_map
				'user_usergroup_map' => $db->loadObjectList()
			),
			// #__users
			'user_id' 	=> $user->id,
			'name' 		=> $user->name,
			'username' 	=> $user->username,
			'email' 	=> $user->email,
			'password' 	=> $user->password,
			'block' 	=> $user->block,
			'sendEmail' => $user->sendEmail,
			'params' 	=> $user->params
		);
		
		return base64_encode(serialize($snapshot));
	}
	
	public static function get($type) {
		$db 	= JFactory::getDbo();
		$query	= $db->getQuery(true);
		$query->select('*')
			  ->from('#__rsfirewall_snapshots')
			  ->where($db->quoteName('type').'='.$db->quote($type));
		$db->setQuery($query);
		$results = $db->loadObjectList('user_id');
		
		$return = array();
		if (!empty($results)) {
			foreach ($results as $result)
				$return[$result->user_id] = unserialize(base64_decode($result->snapshot));
		}
		
		return $return;
	}
	
	public static function check($current, $snapshot) {
		foreach ($snapshot as $key => $value) {
			if ($key == 'user_id') continue;
			if ($key == 'adjacent') continue;
			if ($current->$key != $value)
				return false;
		}
		
		return true;
	}
	
	public static function replace($snapshot) {
		$db 	= JFactory::getDbo();
		$query 	= $db->getQuery(true);
		
		$query->select('id')
			  ->from('#__users')
			  ->where($db->quoteName('id').'='.$db->quote($snapshot->user_id));
		$db->setQuery($query);
		if ($db->loadResult()) {
			// update
			$query->clear();
			$query->update('#__users')
				  ->where($db->quoteName('id').'='.$db->quote($snapshot->user_id));
		} else {
			// insert
			$query->clear();
			$query->insert('#__users');
		}
		
		$query->set($db->quoteName('name').'='.$db->quote($snapshot->name))
			  ->set($db->quoteName('username').'='.$db->quote($snapshot->username))
			  ->set($db->quoteName('email').'='.$db->quote($snapshot->email))
			  ->set($db->quoteName('password').'='.$db->quote($snapshot->password))
			  ->set($db->quoteName('block').'='.$db->quote($snapshot->block))
			  ->set($db->quoteName('sendEmail').'='.$db->quote($snapshot->sendEmail))
			  ->set($db->quoteName('params').'='.$db->quote($snapshot->params));
		$db->setQuery($query);
		$db->execute();
		
		// adjacent
		if (!empty($snapshot->adjacent)) {
			foreach ($snapshot->adjacent as $adjacent_table => $values) {
				foreach ($values as $value) {
					if (!is_object($value)) {
						continue;
					}
					$query = $db->getQuery(true);
					$query->insert('#__'.$adjacent_table)
						  ->columns(array_keys(get_object_vars($value)))
						  ->values(array_values(get_object_vars($value)));
					
					$db->setQuery($query);
					$db->execute();
				}
			}
		}
	}
}