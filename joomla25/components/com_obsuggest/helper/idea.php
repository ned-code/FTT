<?php
/**
 * @version		$Id: idea.php 209 2011-03-24 09:18:43Z phonglq $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

require_once(JPATH_COMPONENT.DS."helper".DS."dbase.php");
final class Idea {
	function __construct() {		
	}
	public static function cutString($str, $len = 100)
	{
		$strLen = strlen($str);
		$count=0;
		for($i=0;$i<$strLen;$i++)
		{
			if(substr($str,$i,1)==' ')
			{
				$count++;
			}
			if($count==$len)
			{
				return array('overflow'=>1, 'string'=>substr($str, 0, $i)."...");
			}
		}
		return array('string'=>$str);
	}
	public static function getComments($idea_id)
	{
		
		$db=&JFactory::getDBO();
		$query = "SELECT COUNT(*) FROM #__foobla_uv_comment WHERE idea_id='".$idea_id."'";
		$db->setQuery($query);
		$rs = $db->loadResult();
		return $rs;
	}
	public static function getListVotes(){
		$query = "
			SELECT *
			FROM `#__foobla_uv_votes_value`
			WHERE `published` = 1
			ORDER BY `vote_value` ASC
		;";
		return DBase::getObjectList($query);
	}
	
	public static function getAllIdea() {
		$query = "
			SELECT *
			FROM `#__foobla_uv_idea`
			ORDER BY `id` DESC
		;";
		return DBase::getObjectList($query);
	}
	public static function getIdeaById($_id = 0) {
		$query ="
			SELECT *
			FROM `#__foobla_uv_idea`
			WHERE `id` = $_id
		;";
		return DBase::getObject($query);
	}
	public static function deleteIdeaById($_id = null) {
		if ($_id == null) return;
		$query = "
			DELETE FROM `#__foobla_uv_idea`
			WHERE `id` = $_id
		;";
		return DBase::querySQL($query);
	}	
	public static function getUserVoteIdeaById($_idea_id = null,$_user_id = null) {
		$query = "
			SELECT * 
			FROM `#__foobla_uv_vote`
			WHERE `user_id` = $_user_id
				AND `idea_id` = $_idea_id
		;";
		return DBase::getObject($query);
	}
}
?>
