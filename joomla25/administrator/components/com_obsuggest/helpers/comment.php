<?php
/**
 * @version		$Id: comment.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

require_once(JPATH_COMPONENT.DS."helpers".DS."dbase.php");
final class Comment {
	function __construct() {
	}
	
	public static function getCommentByIdeaId($_idea_id) {
		if ($_idea_id == null) return;
		$query = "
			SELECT * 
			FROM `#__foobla_uv_comment`
			WHERE `idea_id` = $_idea_id
			ORDER BY `id` DESC
		;";
		//echo $query;
		//print_r( DBase::getObjectList($query) );
		return DBase::getObjectList($query);
	}
	//=== phan trang  commnetcountIdeaByForumId
public function getCommentByIdeaIdLimit($_limitstart, $_limit=10,$key = null, $_forum_id = null) {
		$where = 'WHERE 1=1 ';
		if ($_forum_id != NULL) {
			$where .= 'AND `forum_id` =  '.$_forum_id;
		}
		
//		if ($key != NULL) {
//			$where .= " AND `title` LIKE  '%$key%' ";
//		}//FROM `#__foobla_uv_idea`
		if(!$_limitstart) $_limitstart = 0;
		$query = "
			SELECT * 
			FROM `#__foobla_uv_comment`
			".$where." 
			ORDER BY `id` DESC
			LIMIT $_limitstart, $_limit 		
		;";
		return DBase::getObjectList($query);
	}

	/*public static function getCommentByIdeaIdLimit($_idea_id) {
		if ($_idea_id == null) return;
		$query = "
			SELECT * 
			FROM `#__foobla_uv_comment`
			WHERE `idea_id` = $_idea_id
			limit 0,5
			ORDER BY `id` DESC
		;";
		//echo $query;
		//print_r( DBase::getObjectList($query) );
		return DBase::getObjectList($query);
	}*/
	public static function deleteByIdeaId($_idea_id = null) {
		if ($_idea_id == null) return;
		$query = "
			DELETE FROM `#__foobla_uv_comment`
			WHERE `idea_id` = $_idea_id
		;";
		DBase::querySQL($query);
	}
	public static function countCommentByForumId($_forum_id = null) {
		if ($_forum_id == null) return 0;
		
		$query = "
			SELECT COUNT(`id`) as sum
			FROM `#__foobla_uv_comment`
			WHERE `forum_id` = $_forum_id
		;";
				
		$rs = DBase::getObject($query);
		if ($rs == null) return 0;
		return $rs->sum;
	}
}
?>

