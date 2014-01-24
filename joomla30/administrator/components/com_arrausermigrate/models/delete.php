<?php
/**
 * ARRA User Export Import component for Joomla! 1.6
 * @version 1.6.0
 * @author ARRA (joomlarra@gmail.com)
 * @link http://www.joomlarra.com
 * @Copyright (C) 2010 - 2011 joomlarra.com. All Rights Reserved.
 * @license GNU General Public License version 2, see LICENSE.txt or http://www.gnu.org/licenses/gpl-2.0.html
 * PHP code files are distributed under the GPL license. All icons, images, and JavaScript code are NOT GPL (unless specified), and are released under the joomlarra Proprietary License, http://www.joomlarra.com/licenses.html
 *
 * file: language.php
 *
 **** class 
     ArrausermigrateModelDelete 
	 
 **** functions
     __construct();    
 */

// No direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.application.component.model');

/**
 * ArrausermigrateModelDelete
 */
class ArrausermigrateModelDelete extends JModelLegacy{
	/**
	 * Constructor that retrieves the ID from the request
	 * @access	public
	 * @return	void
	 */
	function __construct(){		
		parent::__construct();
	}

	function getAllTypes(){
		$db =& JFactory::getDBO();		
		$query = $db->getQuery(true);
		$query->clear();		
		$query->select('id, title');
		$query->from('#__usergroups');
		$query->where('id <> 8');
		$db->setQuery($query);		
		$db->query();
		$result = $db->loadAssocList();	
		return $result;
	}
	
	function getExistingTypes(){
		$db =& JFactory::getDBO();		
		$query = $db->getQuery(true);
		$query->clear();		
		$query->select('distinct(title), id');
		$query->from('#__usergroups ug, #__user_usergroup_map ugm');
		$query->where('ug.id = ugm.group_id and ug.id <> 8');
		$db->setQuery($query);		
		$db->query();
		$result = $db->loadAssocList();
		return $result;
	}
	
	function getAllUsers(){
		$db =& JFactory::getDBO();		
		$query = $db->getQuery(true);
		$query->clear();		
		$query->select('count(*)');
		$query->from('#__users');
		$db->setQuery($query);		
		$db->query();
		$result = $db->loadResult();
		return $result;
	}
	
	function getAllUsersMapped(){
		$db =& JFactory::getDBO();		
		$query = $db->getQuery(true);
		$query->clear();		
		$query->select('count(*)');
		$query->from('#__user_usergroup_map');
		$db->setQuery($query);		
		$db->query();
		$result = $db->loadResult();
		return $result;
	}
	
	function findUsers($search){
		$db =& JFactory::getDBO();
		$sql = "select u.* from #__users u, #__user_usergroup_map um where (u.name like '%".$search."%' or u.username like '%".$search."%' or u.email like '%".$search."%') and um.group_id <> 8 and um.user_id = u.id group by u.name";
		$db->setQuery($sql);
		$db->query();
		$result = $db->loadAssocList();
		return $result;
	}
	
	function deleteUsers(){
		$group_ids = JRequest::getVar("usertype", array(), "array", "post");
		
		$start_register_date = JRequest::getVar("start_register_date", "");
		$end_register_date = JRequest::getVar("end_register_date", "");
		
		$visited = JRequest::getVar("visited", "");
		$start_date_visited = JRequest::getVar("start_date", "");
		$end_date_visited = JRequest::getVar("end_date", "");
		
		$activated = JRequest::getVar("activated", "");
		
		$block = JRequest::getVar("block", "");
		
		$user_ids = JRequest::getVar("cid", array(), "array", "post");
		
		$username_list = JRequest::getVar("username_list", "");
		
		$db =& JFactory::getDBO();
		$sql = "select id from #__usergroups where title = 'Super Users'";
		$db->setQuery($sql);
		$db->query();
		$super_user_id = $db->loadResult();
		
		$deleted = false;
		
		//delete by user search
		if(is_array($user_ids) && count($user_ids) > 0){
			$sql = "select user_id from #__user_usergroup_map where group_id=".intval($super_user_id);
			$db->setQuery($sql);
			$db->query();
			$all_super_user = $db->loadAssocList("user_id");
			$all_super_user = array_keys($all_super_user);
			$dif = array_diff($user_ids, $all_super_user);
			if(isset($dif) && count($dif) > 0){
				$user_ids = $dif;
			}
			else{
				$user_ids = array("0");
			}
			$sql = "delete from #__users where id in (".implode(",", $user_ids).")";
 
			$db->setQuery($sql);
			if($db->query()){
				$sql = "delete from #__user_usergroup_map where user_id in (".implode(",", $user_ids).")";
				$db->setQuery($sql);
				if(!$db->query()){
					return false;
				}
			}
			else{
				return false;
			}
			$deleted = true;
		}
		//delete by user search
		
		//deleted by user list
		if(trim($username_list) != ""){
			$list_users = explode("\n", $username_list);
			if(isset($list_users) && count($list_users) > 0){
				$sql = "select id from #__users where username in ('";
				$in = array();
				foreach($list_users as $key=>$value){
					$in[] = addslashes(trim($value));
				}
				$sql .= implode("', '", $in);
				$sql .= "')";
				$db->setQuery($sql);
				$db->query();
				$result = $db->loadAssocList("id");
				if(isset($result) && count($result) > 0){
					$result = array_keys($result);
					$sql = "delete from #__users where id in (".implode(",", $result).")";
					$db->setQuery($sql);
					if($db->query()){
						$sql = "delete from #__user_usergroup_map where user_id in (".implode(",", $result).")";
						$db->setQuery($sql);
						if(!$db->query()){
							return false;
						}
					}
					else{
						return false;
					}
					$deleted = true;
				}
			}
		}
		//deleted by user list
		
		$sql = "";
		$and =array();
		//delete by user group selected
		if(isset($group_ids) && is_array($group_ids) && count($group_ids) > 0){
			$sql = "select u.id from #__users u, #__user_usergroup_map um where um.group_id in (".implode(",", $group_ids).") and um.user_id=u.id";
			$and[] = "1=1";
		}
		else{
			$sql = "select u.id from #__users u, #__user_usergroup_map um where um.user_id=u.id";
		}
		//delete by user group selected
		
		//delete by registration date
		if($start_register_date != "" && $end_register_date != ""){
			$start_register_date_int = strtotime($start_register_date);
			$start_register_date = date("Y-m-d H:i:s", $start_register_date_int);
			$end_register_date_int = strtotime($end_register_date);
			$end_register_date = date("Y-m-d H:i:s", $end_register_date_int);			
			$and[] = "u.registerDate >='".$start_register_date."' and u.registerDate <= '".$end_register_date."'";
		}
		//delete by registration date
		
		//delete by last visited date
		if($start_date_visited != "" && $end_date_visited != ""){
			$start_date_visited_int = strtotime($start_date_visited);
			$start_date_visited = date("Y-m-d H:i:s", $start_date_visited_int);
			$end_date_visited_int = strtotime($end_date_visited);
			$end_date_visited = date("Y-m-d H:i:s", $end_date_visited_int);
			$and[] = "u.lastvisitDate >='".$start_date_visited."' and u.lastvisitDate <= '".$end_date_visited."'";
		}
		if($visited != "-1" && $visited != ""){			
			if($visited == "0"){
				$and[] = "u.lastvisitDate <> '0000-00-00 00:00:00'";
			}
			elseif($visited == "1"){
				$and[] = "u.lastvisitDate = '0000-00-00 00:00:00'";
			}			
		}
		//delete by last visited date
		
		//delete by activation
		if($activated != "-1" && $activated != ""){			
			if($activated == "0"){
				$and[] = "u.activation = ''";
			}
			elseif($activated == "1"){
				$and[] = "u.activation <> ''";
			}			
		}
		//delete by activation
		
		//delete by block/unblock
		if($block != "-1" && $block != ""){			
			if($block == "0"){
				$and[] = "u.block = 0";
			}
			elseif($block == "1"){
				$and[] = "u.block = 1";
			}			
		}
		//delete by block/unblock
		
		if(count($and) > 0){
			$sql .= " and ".implode(" and ", $and);
			$sql .= " and um.group_id <> ".intval($super_user_id)." group by u.id";
			$db->setQuery($sql);
			$db->query();
			$result = $db->loadAssocList("id");

			if(isset($result)){
				foreach($result as $key=>$value){
					$sql = "select count(*) from #__user_usergroup_map where user_id=".intval($value["id"]);
					$db->setQuery($sql);
					$db->query();
					$total = $db->loadResult();
					$temp_and = "";
					if(count($group_ids) > 0){
						$temp_and = "and group_id in (".implode(",", $group_ids).")";
					}
					if(intval($total) == 1){ // from one group
						$temp_and = "";
						if(count($group_ids) > 0){
							$temp_and = "and group_id in (".implode(",", $group_ids).")";
						}
						$sql = "delete from #__user_usergroup_map where user_id=".intval($value["id"])." ".$temp_and;
						$db->setQuery($sql);
						if($db->query()){
							$sql = "delete from #__users where id=".intval($value["id"]);
							$db->setQuery($sql);
							$db->query();
						}
						else{
							return false;
						}
					}
					elseif(intval($total) > 1){ // from multiple groups
						$sql = "delete from #__user_usergroup_map where user_id=".intval($value["id"])." ".$temp_and;
						$db->setQuery($sql);
						if(!$db->query()){
							return false;
						}
						//search if deleted all for this user from #__user_usergroup_map, to delete from #__users too
						$sql = "select count(*) from #__user_usergroup_map where user_id=".intval($value["id"]);
						$db->setQuery($sql);
						$db->query();
						$total = $db->loadResult();
						if($total == 0){
							$sql = "delete from #__users where id=".intval($value["id"]);
							$db->setQuery($sql);
							$db->query();
						}
					}
				}
			}
			return true;
		}
		else{
			if($deleted === TRUE){
				return true;
			}
			return false;
		}	
	}
}

?>