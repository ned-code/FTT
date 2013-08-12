<?php
/**
 * @version		$Id: forum.php 209 2011-03-24 09:18:43Z phonglq $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

require_once(JPATH_COMPONENT.DS."helper".DS."dbase.php");
require_once(JPATH_COMPONENT.DS."helper".DS."idea.php");
require_once(JPATH_COMPONENT.DS."helper".DS."handy.php");

final class Forum {
	function __construct() {
	}
	
	public static function getAllForum() {
		$query = "
			SELECT *
			FROM `#__foobla_uv_forum`
			WHERE `published` = 1
			ORDER BY `id` ASC
		;";
		return DBase::getObjectList($query);		
	}
	
	public static function getIdeaPerPage($forum_id) { 
		$query = "SELECT limit_idea_page FROM `#__foobla_uv_forum` WHERE `id` = ".$forum_id;
		$result = DBase::getObjectResult($query);
		if (!$result or $result <= 0) $result = 10;
		return $result;
	}
	
	
	public static function getForumById($_id = null){
		$query = "
			SELECT * 
			FROM `#__foobla_uv_forum`
			WHERE `id` = $_id
		;";		
		return DBase::getObject($query);
	}
	
	public static function getForumDefault() {
		$query = "
			SELECT * 
			FROM `#__foobla_uv_forum`
			WHERE `default` = 1
		;";		
		return DBase::getObject($query);
	}
	public static function delete($_forum_id = null) {
		Idea::deleteIdeaByForumId($_forum_id);
		$query = "
			DELETE FROM `#__foobla_uv_forum`
			WHERE `id` = $_forum_id
		;";
		DBase::querySQL($query);
	}
	public static function getTabForumById($_forum_id) {
		$query = "SELECT st.id,st.title FROM #__foobla_uv_status AS st".
				 " INNER JOIN #__foobla_uv_tab AS tab".
				 " ON st.id = tab.status_id".
				 " WHERE tab.forum_id = ".$_forum_id;
		//echo $query;
		
		/* $query = "
			SELECT *
			FROM `#__foobla_uv_tab`
			WHERE `forum_id` = $_forum_id
		;";*/
		$tab =  DBase::getObjectList($query);
		/*$status = Handy::getStatus();		
		$rs = null;
		foreach ($status as $stt) {
			if ($stt->parent_id != -1) {
				$temp['id'] = $stt->id;
				$temp['title'] = $stt->title;
				$temp['published'] = 0;
				if ($tab !== NULL) {
					foreach ($tab as $t) {
						if ($t->status_id == $stt->id) {
							$temp['published'] = 1;
							break;
						}
					}
				}
				$rs[] = $temp;
			}
		}*/
		return $tab;
	}
	
	public static function getVotedPoint( $forum_id, $user_id ) {
		$db = &JFactory::getDBO();
		$sql = "SELECT SUM(jv.vote) `votedpoint` 
				FROM #__foobla_uv_forum j 
					LEFT OUTER JOIN #__foobla_uv_idea ji ON ji.forum_id=j.id 
					LEFT OUTER JOIN #__foobla_uv_vote jv ON jv.idea_id=ji.id 
				WHERE jv.user_id = $user_id AND j.id=$forum_id LIMIT 1";
		$db->setQuery( $sql );
		$votedpoint 	= $db->loadResult();
		return $votedpoint;
	}
	
	public static function getRemainingPoint( $forum_id, $user_id ) {
		$limitpoint 	= self::getLimitPoint($forum_id);
		$votedpoint 	= self::getVotedPoint($forum_id, $user_id);
		$remainingpoint = $limitpoint - $votedpoint;
		return $remainingpoint;
	}
	
	public static function getLimitPoint( $forum_id ){
		$db 	= &JFactory::getDBO();
		$sql 	= "SELECT `j`.`limitpoint` FROM `#__foobla_uv_forum` `j` WHERE `j`.`id`=$forum_id LIMIT 1";
		$db->setQuery( $sql );
		$limitpoint = $db->loadResult();

		if( !$limitpoint ) {
			$sql 		= "SELECT `value` FROM `#__foobla_uv_gconfig` WHERE `key`='limitpoint'";
			$db->setQuery( $sql );
			$limitpoint = $db->loadResult();
		}
		return $limitpoint;
	}
	
	public static function getForumByIdeaId( $idea_id ) {
		$db = &JFactory::getDbo();
		$sql = "SELECT DISTINCT j.* 
				FROM #__foobla_uv_forum j, #__foobla_uv_idea ji
				WHERE ji.`forum_id` = j.id and ji.id = 662  LIMIT 1";
		$db -> setQuery($sql);
		$forum = $db->loadObject();
		return $forum;
	}
}
?>
