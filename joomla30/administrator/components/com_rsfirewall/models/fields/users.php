<?php
/**
* @version 1.4.0
* @package RSFirewall! 1.4.0
* @copyright (C) 2009-2013 www.rsjoomla.com
* @license GPL, http://www.gnu.org/licenses/gpl-2.0.html
*/

defined('JPATH_PLATFORM') or die;

JFormHelper::loadFieldClass('rscheckboxes');

class JFormFieldUsers extends JFormFieldRSCheckboxes
{
	protected $type = 'Users';
	
	protected function getOptions() {
		
		require_once JPATH_ADMINISTRATOR.'/components/com_rsfirewall/helpers/users.php';
		
		// Initialize variables.
		$options = array();
		
		$users = RSFirewallUsersHelper::getAdminUsers();
		
		foreach ($users as $user) {
			$tmp = JHtml::_('select.option', $user->id, $user->username);

			// Add the option object to the result set.
			$options[] = $tmp;
		}

		reset($options);
		
		return $options;
	}
}
