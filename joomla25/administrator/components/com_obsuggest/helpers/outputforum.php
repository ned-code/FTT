<?php
/**
 * @version		$Id: outputforum.php 204 2011-03-24 03:17:46Z phonglq $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

require_once(JPATH_COMPONENT.DS."helpers".DS."dbase.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."handy.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."comment.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."idea.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."forum.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."permission.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."theme.php");
require_once(JPATH_COMPONENT.DS."classes".DS."class.output.php");
require_once(JPATH_COMPONENT.DS."classes".DS."class.schematableidea.php");
require_once(JPATH_COMPONENT.DS."classes".DS."class.schematableforum.php");

class OutputForum extends Output {
	public $ideas = null;
	public $status = null;
	public $numIdea = 0;
	public $numComment = 0;	
	public $forums = null;
	public $forum = null;
	public $id = 0;
	public $numVote = 0;
	public $limitpoint = 0;
		
	function __construct($_forum_id = 0) {
		parent::__construct();	
		$this->setId($_forum_id);	
		$this->setForum();
		$this->setIdeas();
		$this->setStatus();
		$this->setNumIdea();		
		$this->setNumVote();
		$this->setNumComment();		
	}
	public function setForums(){
		$rs = Forum::getAllForum();
		if ($rs == NULL) {
			$this->forums = new SchemaTableForum();
		} else {
			$this->forums = $rs;
		}
	}
	public function setId($_forum_id) {
		$this->id = $_forum_id;
	}
	public function setIdeas() {
		$rs = Idea::getAllIdeaByForumId($this->id);
		$this->ideas = $rs;		
	}
	public function setStatus() {
		$this->status = Handy::getStatus();
	}
	public function setNumIdea() {
		$this->numIdea = Idea::countIdeaByForumId($this->id);
	}	
	public function setForum(){
		$rs = Forum::getForumById($this->id);
		if ($rs == NULL) {
			$this->forum = new SchemaTableForum();
		} else {
			$this->forum = $rs;
		}
	}
	public function setNumComment() {
		$this->numComment = Comment::countCommentByForumId($this->id);
	}
	public function setNumVote() {
		$query = "
			SELECT SUM(`votes`) as sum
			FROM `#__foobla_uv_idea`
			WHERE `forum_id` = $this->id
		;";
		$re = DBase::getObject($query);
		if ($re == NULL) return 0;
		$this->numVote = $re->sum;
	}
}
?>
