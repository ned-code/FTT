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

require_once(JPATH_COMPONENT.DS."helper".DS."dbase.php");
final class Permission {
	function __construct() {		
	}
	
	public static function getPermissionById($_gid = 0) {
		if( is_array( $_gid ) && !count( $_gid ) ) {
			$_gid = 0;
		}
# build null permission
$null_permission = new stdClass();
		$null_permission->new_idea_a 		= 0;
		$null_permission->new_idea_o 		= 0;
		$null_permission->edit_idea_a 		= 0;
		$null_permission->edit_idea_o 		= 0;
		$null_permission->delete_idea_a 	= 0;
		$null_permission->delete_idea_o 	= 0;
		$null_permission->change_status_a 	= 0;
		$null_permission->change_status_o 	= 0;

		$null_permission->vote_idea_a 		= 0;
		$null_permission->vote_idea_o 		= 0;

		$null_permission->response_idea_a 	= 0;
		$null_permission->response_idea_o 	= 0;

		$null_permission->new_comment_a 	= 0;
		$null_permission->new_comment_o 	= 0;

		$null_permission->edit_comment_a 	= 0;
		$null_permission->edit_comment_o 	= 0;
		
		$null_permission->delete_comment_a 	= 0;
		$null_permission->delete_comment_o 	= 0;

# end build null permission
		if( is_array( $_gid ) && count( $_gid ) ) {
			
			$gids 	= array_values( $_gid );
			$gids 	= implode( ',', $gids );
			$query 	= "
				SELECT *
				FROM `#__foobla_uv_permission`
				WHERE `group_id` in ( $gids );";

			$db 	= &JFactory::getDbo();

			$db->setQuery($query);
			$ress 	= $db->loadObjectList();
			if( !$ress ) return $null_permission;

			$res = $ress[0];
			for( $i = 0; $i < count($ress); $i++ ) {
				if( $ress[$i]->new_idea_a ) 	$res->new_idea_a 		= $ress[$i]->new_idea_a;
				if( $ress[$i]->new_idea_o ) 	$res->new_idea_o 		= $ress[$i]->new_idea_o;
				if( $ress[$i]->edit_idea_a ) 	$res->edit_idea_a 		= $ress[$i]->edit_idea_a;
				if( $ress[$i]->edit_idea_o ) 	$res->edit_idea_o 		= $ress[$i]->edit_idea_o;
				if( $ress[$i]->delete_idea_a ) 	$res->delete_idea_a 	= $ress[$i]->delete_idea_a;
				if( $ress[$i]->delete_idea_o ) 	$res->delete_idea_o 	= $ress[$i]->delete_idea_o;
				if( $ress[$i]->change_status_a )$res->change_status_a 	= $ress[$i]->change_status_a;
				if( $ress[$i]->change_status_o )$res->change_status_o 	= $ress[$i]->change_status_o;
				
				if( $ress[$i]->vote_idea_a )$res->vote_idea_a 	= $ress[$i]->vote_idea_a;
				if( $ress[$i]->vote_idea_o )$res->vote_idea_o 	= $ress[$i]->vote_idea_o;
				
				if( $ress[$i]->response_idea_a )$res->response_idea_a 	= $ress[$i]->response_idea_a;
				if( $ress[$i]->response_idea_o )$res->response_idea_o 	= $ress[$i]->response_idea_o;
				
				if( $ress[$i]->new_comment_a )$res->new_comment_a 	= $ress[$i]->new_comment_a;
				if( $ress[$i]->new_comment_o )$res->new_comment_o 	= $ress[$i]->new_comment_o;
				
				if( $ress[$i]->edit_comment_a )$res->edit_comment_a 	= $ress[$i]->edit_comment_a;
				if( $ress[$i]->edit_comment_o )$res->edit_comment_o 	= $ress[$i]->edit_comment_o;
				
				if( $ress[$i]->delete_comment_a )$res->delete_comment_a 	= $ress[$i]->delete_comment_a;
				if( $ress[$i]->delete_comment_o )$res->delete_comment_o 	= $ress[$i]->delete_comment_o;
			}
			return $res;
		} else {
			$query = "
				SELECT *
				FROM `#__foobla_uv_permission`
				WHERE `group_id` = $_gid;";
			$res = DBase::getObject($query);
			
			if(!$res) {
				return $null_permission;
			} 
			
			return $res;
		}

		return $null_permission;
	}
}
?>