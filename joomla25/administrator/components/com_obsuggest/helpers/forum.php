<?php
/**
 * @version		$Id: forum.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

require_once(JPATH_COMPONENT.DS."helpers".DS."dbase.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."idea.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."handy.php");

final class Forum {
	function __construct() {
	}
	
	public static function getAllForum() {
		$query = "
			SELECT *
			FROM `#__foobla_uv_forum`
			ORDER BY `id` ASC 
		;";
		return DBase::getObjectList($query);		
	}
	public static function getForumById($_id = null){
		$query = "
			SELECT * 
			FROM `#__foobla_uv_forum`
			WHERE `id` = $_id
		;";		
		return DBase::getObject($query);
	}
	
	public static function delete($_forum_id = null) {
		$query = "
			SELECT * FROM `#__foobla_uv_forum`
			WHERE `id` = $_forum_id
			AND `default` = 0
		";
		$rs = DBase::getObject($query);
		if(!$rs)
			return ;		
		Idea::deleteIdeaByForumId($_forum_id);
		$query = "
			DELETE FROM `#__foobla_uv_forum`
			WHERE `id` = $_forum_id 
				AND `default` = 0
		;";
		DBase::querySQL($query);
	}
	public static function getTabForumById($_forum_id = '0') {
		if( $_forum_id ) {
			$query = "
				SELECT *
				FROM `#__foobla_uv_tab`
				WHERE `forum_id` = $_forum_id
			;";
			$tab =  DBase::getObjectList($query);
		} else {
			$tab = array();
		}
		$status = Handy::getStatus();		
		$rs = null;
		foreach ($status as $stt) {
			if ($stt->parent_id != -1) {
				$temp = new stdClass();
				 
				$temp->id = $stt->id;
				$temp->title = $stt->title;
				$temp->published = 0;
				if ($tab !== NULL) {
					foreach ($tab as $t) {
						if ($t->status_id == $stt->id) {
							$temp->published = 1;
							break;
						}
					}
				}
				$rs[] = $temp;
			}
		}
		return $rs;
	}
	
	public static function getDistinctDay($_forum_id) {
		$query ="
			SELECT Distinct `createdate`
			FROM `#__foobla_uv_idea`
			WHERE `forum_id` = $_forum_id
		;";
		
		$days = DBase::getObjectList($query);
		
		if ($days == NULL) return;
		
		$distinct_day = null;
		foreach ($days as $day) {
			$d = substr($day->createdate,0,strpos($day->createdate," "));			
			$ok = 1;			
			if ($distinct_day != NULL) {				
				foreach ($distinct_day as $key => $value) {
					if ($d === $value->day) {
						$ok = 0;
						break;				
					}
				}
			} 
			
			if ($ok == 1) {
				$statistic = new stdClass();
				$statistic->day = $d;				
				$distinct_day[] = $statistic;
			}
		}
		
		return $distinct_day;
	}
	
	public static function getStatisticIdea($_forum_id) {
		$distinct_day = Forum::getDistinctDay($_forum_id);
		
		if ($distinct_day == NULL) return null;
		
		$i = 0;
		$max_idea = 0;
		$min_idea = null;
		foreach ($distinct_day as $statistic) {
			$query = "
				SELECT COUNT(`id`) as idea
				FROM `#__foobla_uv_idea`
				WHERE `forum_id` = $_forum_id
					AND `createdate` LIKE '%$statistic->day%'
			;";
			
			$rs = DBase::getObject($query);
			$statistic->idea = $rs->idea;
			$statistic->order = $i;
			
			if ($rs->idea > $max_idea) $max_idea = $rs->idea;
			if ($min_idea == NULL) $min_idea = $rs->idea;
			if ($min_idea > $rs->idea) $min_idea = $rs->idea;
			$i++;
		}
		
		foreach ($distinct_day as $statistic) {
			if ($max_idea > 0) {
				$statistic->idea = ($statistic->idea/$max_idea) * 100;
			}
		}
		$f = new stdClass();
		$f->chart_idea = $distinct_day;
		$f->max_idea = $max_idea;
		$f->min_idea = $min_idea;
		return $f;
	}
	
	public static function getStatisticVote($_forum_id) {
		$distinct_day = Forum::getDistinctDay($_forum_id);
		
		if ($distinct_day == NULL) return null;
		
		/*
		 * get all idea in one day
		 */
		$i = 0;
		$max_vote = 0;
		$min_vote = null;
		foreach ($distinct_day as $statistic) {
			$query = "
				SELECT SUM(`votes`) as vote
				FROM `#__foobla_uv_idea`
				WHERE `forum_id` = $_forum_id
					AND `createdate` LIKE '%$statistic->day%'
			;";
			
			$rs = DBase::getObject($query);
			$statistic->vote = $rs->vote;
			$statistic->order = $i;
			
			if ($rs->vote > $max_vote) $max_vote = $rs->vote;
			if ($min_vote == NULL) $min_vote = $rs->vote;
			if ($min_vote > $rs->vote) $min_vote = $rs->vote;
			$i++;
		}
		
		foreach ($distinct_day as $statistic) {
			if ($max_vote > 0) {
				$statistic->vote = ($statistic->vote/$max_vote) * 100;
			}
		}
		
		$f = new stdClass();
		$f->chart = $distinct_day;
		$f->max_vote = $max_vote; 
		$f->min_vote = $min_vote;
		return $f;
		
	}
	
	public static function getStatisticComment($_forum_id) {
		$query ="
			SELECT Distinct `createdate`
			FROM `#__foobla_uv_comment`
			WHERE `forum_id` = $_forum_id
		;";
		
		$days = DBase::getObjectList($query);
		
		if ($days == NULL) return;
		
		$distinct_day = null;
		foreach ($days as $day) {
			$d = substr($day->createdate,0,strpos($day->createdate," "));			
			$ok = 1;			
			if ($distinct_day != NULL) {				
				foreach ($distinct_day as $key => $value) {
					if ($d === $value->day) {
						$ok = 0;
						break;				
					}
				}
			} 
			
			if ($ok == 1) {
				$statistic = new stdClass();
				$statistic->day = $d;				
				$distinct_day[] = $statistic;
			}
		}		
		
		if ($distinct_day == NULL) return null;
		
		/*
		 * get all idea in one day
		 */
		$i = 0;
		$max_comment = 0;
		$min_comment = null;
		foreach ($distinct_day as $statistic) {
			$query = "
				SELECT COUNT(`id`) as comment
				FROM `#__foobla_uv_comment`
				WHERE `forum_id` = $_forum_id
					AND `createdate` LIKE '%$statistic->day%'
			;";
			
			$rs = DBase::getObject($query);			
			
			$statistic->comment = $rs->comment;						
			$statistic->order = $i;
			
			if ($rs->comment > $max_comment) $max_comment = $rs->comment;
			if ($min_comment == NULL) $min_comment = $rs->comment;
			if ($min_comment > $rs->comment) $min_comment = $rs->comment;
			$i++;
		}
		
		foreach ($distinct_day as $statistic) {
			if ($max_comment > 0) {
				$statistic->comment = ($statistic->comment/$max_comment) * 100;
			}
		}
		
		$f = new stdClass();
		$f->chart_comment = $distinct_day;
		$f->max_comment = $max_comment; 
		$f->min_comment = $min_comment;
		return $f;		
	}
	
	public static function getStatisticForumById($_forum_id) {
		/*
		 * get distinct createday at idea table of all idea in a forum  
		 */
		

		$f = new stdClass();
		
		$vote = Forum::getStatisticVote($_forum_id);
		
		if ($vote == NUll) {
			$f->chart = NULL;
			$f->max_vote = 0;
			$f->min_vote = 0;
			
		} else {
			$f->chart = $vote->chart;
			$f->max_vote = $vote->max_vote;
			$f->min_vote = $vote->min_vote;
		}
				
		$idea = Forum::getStatisticIdea($_forum_id);
			
		if ($idea == NUll) {
			$f->chart_idea = NULL;
			$f->max_idea = 0;
			$f->min_idea = 0;
			
		} else {
			$f->chart_idea = $idea->chart_idea;
			$f->max_idea = $idea->max_idea;
			$f->min_idea = $idea->min_idea;
		}
		
		$comment = Forum::getStatisticComment($_forum_id);
			
		if ($comment == NUll) {
			$f->chart_comment = NULL;
			$f->max_comment = 0;
			$f->min_comment = 0;
			
		} else {
			$f->chart_comment = $comment->chart_comment;
			$f->max_comment = $comment->max_comment;
			$f->min_comment = $comment->min_comment;
		}
		
		return $f;
	}
	
}
?>

