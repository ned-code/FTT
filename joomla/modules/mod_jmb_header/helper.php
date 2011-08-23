<?php
/**
 * @version		$Id: helper.php 20196 2011-01-09 02:40:25Z ian $
 * @package		Joomla.Site
 * @subpackage	mod_login
 * @copyright	Copyright (C) 2005 - 2011 Open Source Matters, Inc. All rights reserved.
 * @license		GNU General Public License version 2 or later; see LICENSE.txt
 */

// no direct access
defined('_JEXEC') or die;

class modJMBHeaderHelper
{
	/*
	* PROTECTED FUNCTION
	*/	
	/*
	* PUBLIC FUNCTIONS
	*/
	/**
	*
	*/
	public function getUser($user_id){
		return true;
	}

	/**
	*
	*/
	public function getLogin($fid){
		$db =& JFactory::getDBO();
		$sql = "SELECT t_id FROM #__mb_family_tree WHERE f_id='".$fid."' AND type='OWNER'";
		$db->setQuery($sql);
		$result = $db->loadAssocList();
		if(sizeof($result)>0){ 
			return true;
		}
		else {
			return false;
		}
	}
	
	/**
	*
	*/
	public function checkLocation(){
		$r = isset($_SERVER["HTTP_REFERER"])?$_SERVER["HTTP_REFERER"]:null;
		if($r!=null){
			$pUrl = parse_url($r);
			if($pUrl['host']=='apps.facebook.com'){
				return true;
			}
		} 
		return false; 
	}
	
	/**
	*
	*/
	public function getAvatar($user_profile){
		$id = $user_profile['id'];
		return "http://graph.facebook.com/".$id."/picture";
	}
	
}
