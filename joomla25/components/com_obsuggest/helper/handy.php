<?php
/**
 * @version		$Id: handy.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

require_once(JPATH_COMPONENT.DS."helper".DS."dbase.php");
final class Handy {
	function __construct() {
	}
	
	public static function getDateTime() {
		return date("Y-m-d H:i:s");
	}
	
	public static function getUser($_user_id = 0) {		
		$query = "
			SELECT *
			FROM `#__users`
			WHERE `id` = $_user_id
		;";
		$user = DBase::getObject($query); 
		if ($_user_id == 0) $user->username = "anonymous";
		return $user;
	}
	public static function getStatus() {
		$query = "
			SELECT *
			FROM `#__foobla_uv_status`
			ORDER BY `id` ASC						
		;";		
		return DBase::getObjectList($query);
	}
}
?>
