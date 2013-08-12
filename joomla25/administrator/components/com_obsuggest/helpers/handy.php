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

require_once(JPATH_COMPONENT.DS."helpers".DS."dbase.php");
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
		if ($_user_id == 0) $user->username = JText::_("anonymous");
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
	public static function getStatusById($_id = 0) {
		$query = "
			SELECT *
			FROM `#__foobla_uv_status`
			WHERE `id` = $_id
		;";
		return DBase::getObject($query);
	}
	public function getParentStatus() {
		$query = "
			SELECT *
			FROM `#__foobla_uv_status`
			WHERE `parent_id` = -1				
		;";
		return DBase::getObjectList($query);
	}
	public static function getUserById($_id = 0) {
		$query = "
			SELECT *
			FROM `#__users`
			WHERE `id` = $_id
		;";
		return DBase::getObject($query);
	}
	public static function getInput($_post = null ,$_prefix = '') {
		$input = null;
		
		foreach ($_post as $p_key => $p_value) {
			if (strpos($p_key,$_prefix) !== false) {
				$i_key = substr($p_key,strlen($_prefix));
				$input[$i_key] = $p_value;		
			}
		}
		return $input;
	}
	public static function countCommentByIdeaId($_id) {
		$query = "
			SELECT COUNT(`id`) as sum
			FROM `#__foobla_uv_comment`
			WHERE `idea_id` = $_id
		;";
		$rs = DBase::getObject($query);
		return $rs->sum;
	}
	
	public static function writeOutput($_output) {
		foreach ($_output as $key => $value) {
			echo "[$key]";
			echo "=>";
			var_dump($value);
			echo "<br/>";
		}
	}
}
?>

