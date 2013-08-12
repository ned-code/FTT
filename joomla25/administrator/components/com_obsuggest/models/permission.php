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

jimport('joomla.application.component.model');
require_once(JPATH_COMPONENT.DS."helpers".DS."dbase.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."handy.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."idea.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."permission.php");

class ModelPermission extends JModel {	
	private $group_id = 0;
	function __construct() {
		parent::__construct();
	}
	
	public function getGroups() {
		global $obIsJ15;
		if( !$obIsJ15 ){
			$query = "SELECT j.`id`, j.`parent_id`, j.`lft`, j.`rgt`, j.`title` `name` FROM `#__usergroups` j";
		} else {
			$query = "
				SELECT DISTINCT `#__core_acl_aro_groups`.`id`,
						`#__core_acl_aro_groups`.`name`
				FROM `#__core_acl_aro_groups`
					INNER JOIN `#__foobla_uv_permission`
				WHERE `#__core_acl_aro_groups`.`id` = `#__foobla_uv_permission`.`group_id` 
				ORDER BY `#__foobla_uv_permission`.`group_id` ASC
			;";
		}
		return DBase::getObjectList($query);
	}
	
	public function getPermissionById() {
		$group_id = $this->group_id;
		return Permission::getPermissionById($this->group_id);
	}
	
	public function setGroupId($_gid) {
		$this->group_id = $_gid;
	}
	
	public function updatePermission($_input) {
		$set = null;
		$keys = array();
		$values = array();
		foreach ($_input as $key => $value) {			
			$set 		.= "`".$key."` = ".$value." ,";
			$keys[] 	= '`'.$key.'`';
			$values[] 	= "'".$value."'";
		}

		$keys_str 	= implode( ',', $keys);
		$values_str = implode( ',', $values );
		$set 		= substr($set, 0, strlen($set)-1);

		$query = "SELECT * FROM `#__foobla_uv_permission` WHERE `group_id`=".$_input['group_id'];
		$res = DBase::getObject($query);
		if($res){
			$query = " 			
				UPDATE `#__foobla_uv_permission`".
				"SET ".$set.
				"WHERE `group_id` = ".$_input['group_id'].";";
			DBase::querySQL($query);
		} else {
			$query = "INSERT INTO `#__foobla_uv_permission` \n($keys_str) \nVALUES($values_str)";
			DBase::querySQL($query);
		}
	}
}
?>