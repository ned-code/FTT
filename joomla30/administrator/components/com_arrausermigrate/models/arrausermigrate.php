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
 * file: arrausermigrate.php
 *
 **** class 
     ArrausermigrateModelArrausermigrate 
	 
 **** functions
     __construct()
     getUsersCount();
	 getNoTypeCount();
     getActualVersion();
	 getLatestVersion();
	 isCurlInstalled
     getUserType();
	 getExitJomsocial();
	 getGroupCategory();
	 getGroups();
	 getUsers();
	 getBlockUsers();
	 getUnblockUsers();
	 getJomSocialUsers();
     
 */

// No direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport( 'joomla.application.component.model' );
jimport( 'joomla.filesystem.file' );
/**
 * ArrausermigrateModelArrausermigrate Model
 */
class ArrausermigrateModelArrausermigrate extends JModelLegacy{	

	function __construct() {	  
		parent::__construct();
	}
	 
	// method return a number af all users 
	function getUsersCount(){
        $db =& JFactory::getDBO();
		$sql = "select count(*) from #__user_usergroup_map ";
		$db->setQuery($sql);
		$content = $db->loadResult(); 		
		return $content;
	}
	
	//select number of rows where is not user type
	function getNoTypeCount(){
        $db =& JFactory::getDBO();		
		$sql = "select count(*) from #__user_usergroup_map where user_id <> '' and group_id = ''";
		$db->setQuery($sql);
		$content = $db->loadResult(); 
		
		return $content;
	}
		
	// method return actual version from xml config
	function getActualVersion(){   
		$path = JPath::clean(JPath::clean(JPATH_SITE).DS."administrator".DS."components".DS."com_arrausermigrate".DS."install.xml");
		$version = "";
		$content = JFile::read($path);
		preg_match("/<version>(.*)<\/version>/msU", $content, $matches);
		if(isset($matches) && isset($matches["1"])){
			$version = $matches["1"];
		}
		return $version;
	}
	
	// method return tha last version from www.joomlarra.com site
	function getLatestVersion(){		
		$version = "";
		if($this->isCurlInstalled() == true){
			$data = 'http://www.joomlarra.com/downloads/arraimport3.0/latest_version.txt';					
			$ch = @curl_init($data);
			@curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			@curl_setopt($ch, CURLOPT_TIMEOUT, 10); 							
			
			$version = @curl_exec($ch);
			$patern = "/([0-9])(\.[0-9])(\.[0-9])/";		
			if(preg_match($patern, $version)){
				return trim($version);
			}
			else{
				return "ERROR";
			}
		}
		else{
			return "ERROR";
		}	
	}
	
	function isCurlInstalled() {
	    $array = get_loaded_extensions();
		if(in_array("curl", $array)){
			return true;
		}
		else{
			return false;
		}
	}
	
	// return all types by users
	function getUserType(){
	    $db =& JFactory::getDBO();		
		$sql = "SELECT DISTINCT g.title as usertype
		        FROM #__users u, #__usergroups g, #__user_usergroup_map ugm
                WHERE u.id=ugm.user_id and ugm.group_id=g.id";
		$db->setQuery($sql);
		$result = $db->loadAssocList();

		return $result;
	}
	
	function getExitJomsocial(){		
		$db =& JFactory::getDBO();		
		$sql = "SELECT count(*)
		        FROM #__extensions
                WHERE element='com_community'";
		$db->setQuery($sql);
		$result = $db->loadResult();
		if($result=="0"){
			return false;
		}
		else{
			return true;
		}
	}		
	
	function getGroupCategory(){
		$db =& JFactory::getDBO();		
		$sql = "SELECT gc.name, count(g.id) as total from #__community_groups_category gc LEFT OUTER JOIN #__community_groups g on gc.id=g.categoryid group by gc.id";
		$db->setQuery($sql);
		$result = $db->loadAssocList();
		return $result;
	}
	
	function getGroups(){
		$db =& JFactory::getDBO();		
		$sql = "SELECT g.published, g.name, g.membercount, gc.name as cat_name from #__community_groups g, #__community_groups_category gc where gc.id=g.categoryid";
		$db->setQuery($sql);
		$result = $db->loadAssocList();
		return $result;
	}
	
	function getUsers(){
		$db =& JFactory::getDBO();		
		$sql = "SELECT sum(membercount) from #__community_groups";
		$db->setQuery($sql);
		$result = $db->loadResult();
		return $result;
	}
	
	function getBlockUsers(){
		$db =& JFactory::getDBO();
		$sql = "SELECT u.block, count(u.id) as total from #__community_users cu  LEFT OUTER JOIN #__users u on u.id=cu.userid where u.block=1 group by u.block";
		$db->setQuery($sql);
		$result = $db->loadAssocList();
		return $result;
	}
	
	function getUnblockUsers(){
		$db =& JFactory::getDBO();
		$sql = "SELECT u.block, count(u.id) as total from #__community_users cu  LEFT OUTER JOIN #__users u on u.id=cu.userid where u.block=0 group by u.block";
		$db->setQuery($sql);
		$result = $db->loadAssocList();
		return $result;
	}
	
	function getJomSocialUsers(){
		$db =& JFactory::getDBO();
		$sql = "SELECT count(*) from #__community_users cu, #__users u where u.id=cu.userid";
		$db->setQuery($sql);
		$result = $db->loadResult();
		return $result;
	}	
	
}