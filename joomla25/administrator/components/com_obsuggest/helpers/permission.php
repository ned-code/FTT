<?php
/**
 * @version		$Id: permission.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

require_once(JPATH_COMPONENT.DS."helpers".DS."dbase.php");
final class Permission {
	function __construct() {		
	}
	
	public static function getPermissionById($_gid) {

//		$version = new JVersion();
//		$sversion = $version->getShortVersion();
//		if( substr( $sversion, 0, 3 ) == '1.6' ) {
//			$uvpermission = JTable::getInstance('uvpermission');
//			$uvpermission->load($_gid);
//			if( !$uvpermission->group_id ) {
//				$uvpermission->group_id = $_gid;
//			}
//			return $uvpermission;
//		} else {
			$query = "
				SELECT *
				FROM `#__foobla_uv_permission`
				WHERE `group_id` = $_gid;";
			$res = DBase::getObJect($query);
			if( !$res ) {
				$res = new stdClass();
				$res->group_id = $_gid;
				$res->new_idea_a = null;
				$res->new_idea_o = null;
				$res->edit_idea_a = null;
				$res->edit_idea_o = null;
				$res->delete_idea_a = null;
				$res->delete_idea_o = null;
				$res->change_status_a = null;
				$res->change_status_o = null;
				$res->vote_idea_a = null;
				$res->vote_idea_o = null;
				$res->response_idea_a = null;
				$res->response_idea_o = null;
				$res->new_comment_a = null;
				$res->new_comment_o = null;
				$res->edit_comment_a = null;
				$res->edit_comment_o = null;
				$res->delete_comment_a = null;
				$res->delete_comment_o = null;
			}
			return $res;
//			return DBase::getObject($query);
//		}
	}
}
?>

