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
 * file: SqlExport.php
 *
 **** class 
     SqlExport 
	 
 **** functions
     __construct();	 
	 getFileHeader();
	 getUsergroups();
	 getUsers();
	 getUserUsergroupMap();
 */

// No direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

/**
 * SqlExport class
 */
class SqlExport{
     /**
	 * @access	public
	 * @return	void
	 */
	function __construct(){		    		
	}
	
	//return header export file
	function getFileHeader($config){
		//set curent date to write in export file
		$search_date = date("D M j G:i:s Y");
		$data = "-- phpMyAdmin SQL Dump" . "\n" . 
				"-- version 3.2.0.1" . "\n" . 
				"-- http://www.phpmyadmin.net" . "\n" . 
				"--" . "\n" . 
				"-- Host: " . $config->host . "\n" . 
				"-- Generation Time: " . $search_date . "\n" . 
				"-- Server version: 5.1.36" . "\n" . 
				"-- PHP Version: 5.3.0" . "\n\n" . 
				
				"SET SQL_MODE=\"NO_AUTO_VALUE_ON_ZERO\";" . "\n\n" . 
					
				"--" . "\n" . 
				"-- Database: `" . $config->db . "`" . "\n" . 
				"--";
		return $data;
	}
		
	function getUsergroups($config){
		$db =& JFactory::getDBO();
		$data  = "";
		$data .= "\n-- --------------------------------------------------------" . "\n";
		$data .= "--" . "\n" . 
				"-- Table structure for table `" . "#__" . "usergroups`" . "\n" . 
				"--\n\n"; 
								  
		$data .= "CREATE TABLE IF NOT EXISTS `" . "#__" . "usergroups` (" . "\n" .
				"`id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key'," . "\n" .
				"`parent_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'Adjacency List Reference Id'," . "\n" .				
				"`lft` int(11) NOT NULL DEFAULT '0' COMMENT 'Nested set lft.'," . "\n" .
				"`rgt` int(11) NOT NULL DEFAULT '0' COMMENT 'Nested set rgt.'," . "\n" .
				"`title` varchar(100) NOT NULL DEFAULT ''," . "\n" .
				"PRIMARY KEY (`id`)," . "\n" .
				"UNIQUE KEY `idx_usergroup_title_lookup` (`title`)," . "\n".
				"KEY `idx_usergroup_adjacency_lookup` (`parent_id`)," . "\n".
  				"KEY `idx_usergroup_nested_set_lookup` (`lft`,`rgt`) USING BTREE ". "\n" .
				") ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=13 ;" . "\n\n" .
				
				"--" . "\n" .
				"-- Dumping data for table `" . "#__" . "usergroups`" . "\n" .
				"--" . "\n\n";		  
		
		//select all dates from _core_acl_aro_groups table from database 
		$sql =  "SELECT * " .
				" FROM #__usergroups";
		$db->setQuery($sql);
		$result = $db->loadAssocList();	 
		
		$data .= "INSERT INTO `" . "#__" . "usergroups` (`id`, `parent_id`, `lft`, `rgt`, `title`) VALUES\n";               		
		$i=0;
		$value_max_for_insert = 279;
		$separator = ",";
		if(is_array($result)){	
			// for each user from database make an insert in new databse table	 
			foreach($result as $key=>$value){
				//after 280 rows, reenter insert into...
				if($i == $value_max_for_insert){
					$separator = ";";
					$value_max_for_insert += 279; 
						
					$data .= "(" . $value['id'] . ", " . $value['parent_id'] . ", " . $value['lft'] . ", " . $value['rgt']. ", '" . addslashes($value['title']) . "')" . $separator . "\n";
					
					if(isset($result[$i+1])){	
						$data .= "INSERT INTO `" . "#__" . "usergroups` (`id`, `parent_id`, `lft`, `rgt`, `title`) VALUES\n";
					}	
					$separator = ",";
						
			   }
			   // if is not 280 or more				   	
			   else{     		
				   $data .= "(" . $value['id'] . ", " . $value['parent_id'] . ", " . $value['lft'] . ", " . $value['rgt']. ", '" . addslashes($value['title']) . "')" . $separator . "\n";
			   }
				$i++;		
			 }
		}
		//eliminate last , and replace with ;
		$data = substr($data, 0, strlen($data)-2);
		$data .= ";";		
		return $data;
	}
	
	function getUsers($config){
		$db =& JFactory::getDBO();
		//select all dates from _users table from database 
		$sql = "SELECT * " .
		        " FROM #__users";
		$db->setQuery($sql);
		$result = $db->loadAssocList();			  
		$data  = "";
		$data .= "\n\n-- --------------------------------------------------------";
		  		 
		$data .= "\n\n" . "--" . "\n" . 
				  "-- Table structure for table `" . "#__" . "users`" . "\n" . 
				  "--\n\n";				  		  		   
				  	
		$data .= "CREATE TABLE IF NOT EXISTS `" . "#__" . "users`" . " (" . "\n" . 
					  "  `id` int(11) NOT NULL AUTO_INCREMENT," . "\n" . 
					  "  `name` varchar(255) NOT NULL DEFAULT ''," . "\n" .
					  "  `username` varchar(150) NOT NULL DEFAULT ''," . "\n" .
					  "  `email` varchar(100) NOT NULL DEFAULT ''," . "\n" . 
					  "  `password` varchar(100) NOT NULL DEFAULT ''," . "\n" .
					  "  `block` tinyint(4) NOT NULL DEFAULT '0'," . "\n" . 
					  "  `sendEmail` tinyint(4) DEFAULT '0'," . "\n" . 					  
					  "  `registerDate` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'," . "\n" . 
					  "  `lastvisitDate` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'," . "\n" . 
					  "  `activation` varchar(100) NOT NULL DEFAULT ''," . "\n" . 
					  "  `params` text NOT NULL," . "\n" . 
					  "  PRIMARY KEY (`id`)," . "\n" . 
					  "  KEY `idx_name` (`name`)," . "\n" .
					  "  KEY `username` (`username`)," . "\n" . 
					  "  KEY `email` (`email`)" . "\n" . 
				   ") ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=44 ;" . "\n\n" . 
			
					"--" . "\n" . 
					"-- Dumping data for table `" . "#__" . "users`" . "\n" . 
					"--\n\n";
					
		$data .= "INSERT INTO `" . "#__" . "users` (`id`, `name`, `username`, `email`, `password`, `block`, `sendEmail`, `registerDate`, `lastvisitDate`, `activation`, `params`) VALUES\n";               		
		$i=0;
		$value_max_for_insert = 279;
		$separator = ",";
		if(is_array($result)){	
			// for each user from database make an insert in new databse table	 
			foreach($result as $key=>$value){
				//after 280 rows, reenter insert into...
				if($i == $value_max_for_insert){
					$separator = ";";
					$value_max_for_insert += 279; 
						
					$data .= "('".$value['id']."', '".addslashes($value['name'])."', '".addslashes($value['username'])."', '".addslashes($value['email'])."', '".$value['password']."', '".$value['block']."', '".$value['sendEmail']."', '".$value['registerDate']."', '".$value['lastvisitDate']."', '" .$value['activation']."', '".$value['params']."')".$separator."\n";
					
					if(isset($result[$i+1])){	
						$data .= "INSERT INTO `" . "#__" . "users` (`id`, `name`, `username`, `email`, `password`, `block`, `sendEmail`, `registerDate`, `lastvisitDate`, `activation`, `params`) VALUES\n";
					}	
					$separator = ",";
						
				}
				// if is not 280 or more				   	
				else{     		
					$data .= "('".$value['id']."', '".addslashes($value['name'])."', '".addslashes($value['username'])."', '".addslashes($value['email'])."', '".$value['password']."', '".$value['block']."', '".$value['sendEmail']."', '".$value['registerDate']."', '".$value['lastvisitDate']."', '" .$value['activation']."', '".$value['params']."')".$separator."\n";
				}
				$i++;
			}
		}
		//eliminate last , and replace with ;
		$data = substr($data, 0, strlen($data)-2);
		$data .= ";";		 
		return $data;
	}
	
	
	function getUserUsergroupMap($config){
		$db =& JFactory::getDBO();
		//select all dates from core_acl_groups_aro_map table from database 
		$sql = "SELECT * " .
		        " FROM #__user_usergroup_map";
		$db->setQuery($sql);
		$result = $db->loadAssocList();			  
		$data  = "";
		$data .= "\n\n-- --------------------------------------------------------";
		 		 
		$data .= "\n\n" . "--" . "\n" . 
				  "-- Table structure for table `" . "#__" . "user_usergroup_map`" . "\n" . 
				  "--\n\n";
		 
		$data .= "CREATE TABLE IF NOT EXISTS `" . "#__" . "user_usergroup_map` (" . "\n" .
				  "`user_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'Foreign Key to #__users.id'," . "\n" .
				  "`group_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'Foreign Key to #__usergroups.id'," . "\n" .				  
				  "PRIMARY KEY (`user_id`,`group_id`)" . "\n" .
				") ENGINE=MyISAM DEFAULT CHARSET=utf8;". "\n" .
				
				"--" . "\n" .
				"-- Dumping data for table `"."#__" ."core_acl_groups_aro_map`" . "\n" .
				"--\n\n";
		 
		$data .= "INSERT INTO `" . "#__" . "user_usergroup_map` (`user_id`, `group_id`) VALUES\n";
		$i=0;
		$value_max_for_insert = 279;
		$separator = ",";
		if(is_array($result)){	
			// for each user from database make an insert in new databse table	 
			foreach($result as $key=>$value){
				//after 280 rows, reenter insert into...
				if($i == $value_max_for_insert){
					$separator = ";";
					$value_max_for_insert += 279; 						
					$data .= "(" . $value['user_id'] . ", " . $value['group_id'] . ")" . $separator . "\n";						
					if(isset($result[$i+1])){
						$data .= "INSERT INTO `" . "#__" . "user_usergroup_map` (`user_id`, `group_id`) VALUES\n";
					}
					$separator = ",";						
				}
				// if is not 280 or more				   	
				else{     		
					$data .= "(" . $value['user_id'] . ", " . $value['group_id'] . ")" . $separator . "\n";	
				}
				$i++;		
			}
		}
		//eliminate last , and replace with ;
		$data = substr($data, 0, strlen($data)-2);
		$data .= ";";
		 
		return $data;
	}
	
	function getUserProfile($config){
		$db =& JFactory::getDBO();
		$data  = "";
		$data .= "\n-- --------------------------------------------------------" . "\n";
		$data .= "--" . "\n" . 
				"-- Table structure for table `" . "#__" . "user_profiles`" . "\n" . 
				"--\n\n"; 							  
		$data .= "CREATE TABLE IF NOT EXISTS `" . "#__" . "user_profiles` (" . "\n" .
				"`user_id` int(11) NOT NULL," . "\n" .
				"`profile_key` varchar(100) NOT NULL," . "\n" .				
				"`profile_value` varchar(255) NOT NULL," . "\n" .
				"`ordering` int(11) NOT NULL DEFAULT '0'," . "\n" .				
  				" UNIQUE KEY `idx_user_id_profile_key` (`user_id`,`profile_key`)". "\n" .
				") ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='Simple user profile storage table';" . "\n\n" .
				
				"--" . "\n" .
				"-- Dumping data for table `" . "#__" . "user_profiles`" . "\n" .
				"--" . "\n\n";		  
		
		//select all dates from _core_acl_aro_groups table from database 
		$sql =  "SELECT * " .
				" FROM #__user_profiles";
		$db->setQuery($sql);
		$result = $db->loadAssocList();	 
		
		$data .= "INSERT INTO `" . "#__" . "user_profiles` (`user_id`, `profile_key`, `profile_value`, `ordering`) VALUES\n";               		
		$i=0;
		$value_max_for_insert = 279;
		$separator = ",";
		if(is_array($result)){	
			// for each user from database make an insert in new databse table	 
			foreach($result as $key=>$value){
				//after 280 rows, reenter insert into...
				if($i == $value_max_for_insert){
					$separator = ";";
					$value_max_for_insert += 279; 
						
					$data .= "(".$value['user_id'].", '".addslashes($value['profile_key'])."', '".addslashes($value['profile_value'])."', ".$value['ordering'].")".$separator."\n";
					
					if(isset($result[$i+1])){	
						$data .= "INSERT INTO `" . "#__" . "user_profiles` (`user_id`, `profile_key`, `profile_value`, `ordering`) VALUES\n";
					}	
					$separator = ",";
						
			   }
			   // if is not 280 or more				   	
			   else{     		
				   $data .= "(".$value['user_id'].", '".addslashes($value['profile_key'])."', '".addslashes($value['profile_value'])."', ".$value['ordering'].")".$separator."\n";
			   }
				$i++;		
			 }
		}
		//eliminate last , and replace with ;
		$data = substr($data, 0, strlen($data)-2);
		$data .= ";";		
		return $data;
	}
	
}//end class

?>