<?php
/**
* @version 1.4.0
* @package RSFirewall! 1.4.0
* @copyright (C) 2009-2013 www.rsjoomla.com
* @license GPL, http://www.gnu.org/licenses/gpl-2.0.html
*/

defined('_JEXEC') or die('Restricted access');

class RSFirewallIP {
	public static function get($check_for_proxy=true) {
		static $ip;
		
		if (!$ip) {
			$input = JFactory::getApplication()->input;
			$ip    = $input->server->get('REMOTE_ADDR', '', 'string');
			
			if ($check_for_proxy) {
				$headers = array('HTTP_X_REAL_IP', 'HTTP_TRUE_CLIENT_IP', 'HTTP_X_FWD_IP_ADDR', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'HTTP_VIA', 'HTTP_X_COMING_FROM', 'HTTP_COMING_FROM');
				foreach ($headers as $header) {
					if ($proxy = $input->server->get($header, '', 'string')) {
						// let's see if it's an IPv4
						$parts = explode('.', $proxy);
						if (count($parts) != 4) {
							// not IPv4, continue
							continue;
						}
						
						// is this a private network IP?
						if ($parts[0] == 10) { // 10.0.0.0 - 10.255.255.255
							continue;
						}
						if ($parts[0] == 172 && $parts[1] >= 16 && $parts[1] <= 31) { // 172.16.0.0 - 172.31.255.255
							continue;
						}
						if ($parts[0] == 192 && $parts[1] == 168) { // 192.168.0.0 - 192.168.255.255
							continue;
						}
						
						// looks like IPv4, let's see if we can convert it
						$long = ip2long($proxy);
						if ($long === false) {
							// not IPv4, continue
							continue;
						}
						
						$ip = $proxy;
						break;
					}
				}
			}
		}
		
		return $ip;
	}
}