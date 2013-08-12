<?php
/**
 * @version		$Id: default.php 191 2011-03-22 07:47:33Z phonglq $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.application.component.model');
require_once(JPATH_COMPONENT.DS."helper".DS."dbase.php");
require_once(JPATH_COMPONENT.DS."helper".DS."handy.php");
require_once(JPATH_COMPONENT.DS."helper".DS."permission.php");
require_once(JPATH_COMPONENT.DS."helper".DS."forum.php");
require_once(JPATH_COMPONENT.DS."helper".DS."config.php");

class ModelDefault extends JModel {
	private $user;
	private $page = 0;
	private $output = null;
	private $forum_id = null;
	private $gconfigs = null;
	
	function __construct() {
		parent::__construct();
		$this->setUser();	
	}
	
	public function setPage($_page = 0) {
		$this->page = $_page;
	}	
	public function setForumId($_forum_id = null) {
		$this->forum_id = $_forum_id;
	}
	public function getForumId(){ 
		return $this->forum_id;
	}
	public function setUser() {
		$this->user = &JFactory::getUser();
	}
	public function getPage() {
		return $this->page;
	}
	public function getStatus() {
		return Handy::getStatus();
	}
	
	public function getOutput() {
		global $obIsJ15;
		$user = &JFactory::getUser();
		if( !$obIsJ15 ) {
			$permission = Permission::getPermissionById($user->groups); 
		} else {
			$permission = Permission::getPermissionById($user->gid);
		}
//		$permission = Permission::getPermissionById($user->gid);
		$forum = Forum::getForumById($this->forum_id);
		$config = Config::getConfig();

		$temp = new Output();
		$temp->addProperty('forum',$forum);
		$temp->addProperty('permission',$permission);
		$temp->addProperty('config',$config);

		return $temp->getOutput();
	}

	public function getGConfig() {
		if( !$this->gconfigs ) {
			$db 	= &JFactory::getDbo();
			$query 	= "SELECT * FROM `#__foobla_uv_gconfig`";
			$db->setQuery( $query );
			$this->gconfigs = $db -> loadObjectList('key');
		}
		return $this->gconfigs;
	}
}
?>