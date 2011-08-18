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
	/**
	*
	*/
	protected function fbEnabled(){
		$facebook = new Facebook(array(
			'appId'  => JMB_FACEBOOK_APPID,
			'secret' => JMB_FACEBOOK_SECRET,
			'cookie' => JMB_FACEBOOK_COOKIE,
		));
		return $facebook;
	}
	
	/**
	*
	*/
	protected function getCurrentURL(){
		$view = (isset($_REQUEST['view']))?$_REQUEST['view']:'';
		$ids = (isset($_REQUEST['id']))?$_REQUEST['id']:'';
		$type = (isset($_REQUEST['jmb_type']))?$_REQUEST['jmb_type']:'';
		
		$request = "";
		if(!is_array($ids)){
			$request .= "&id=".$ids;
		}
		else{
			for($i=0; $i<sizeof($ids);$i++){
				$request .= "&id[".$i."]=".$ids[$i];
			}
		}
		switch($type){
			case "register":
				$request .= "&jmb_type=register";
			break;
			
			case "body":
				$request .= "&jmb_type=body";
			break;
		}
		return JURI::base()."index.php?option=com_manager&view=".$view.$request;
	}
	
	/**
	*
	*/
	protected function getURL($facebook, $session){
		$db =& JFactory::getDBO();
		if(!$session){
			$sql = "SELECT * FROM #__mb_categories WHERE name='login'";
			$db->setQuery($sql);
			$page_id = $db->loadAssocList();
			$request = "index.php?option=com_manager&view=single&id=".$page_id[0]['p_id'];
		}
		else{
			$fid = $facebook->getUser();
			$_SESSION['jmb']['fid'] = $fid;
			$sql = "SELECT tree_link.tree_id as tid, ind.id as gid FROM #__mb_individuals as ind
			LEFT JOIN #__mb_tree_links as tree_link ON ind.id = tree_link.individuals_id
			WHERE ind.fid = '".$fid."' AND tree_link.type='OWNER'";
			$db->setQuery($sql);
			$s_array = $db->loadAssocList();
			if(sizeof($s_array) > 0){
				$_SESSION['jmb']['gid'] = $s_array[0]['gid'];
				$_SESSION['jmb']['tid'] = $s_array[0]['tid'];
				$sql = "SELECT * FROM #__mb_categories WHERE name='body'";
				$db->setQuery($sql);
				$page_ids = $db->loadAssocList();
				$ids = explode(",", $page_ids[0]['p_id']);
				$request = "index.php?option=com_manager&view=multi";
				for($i=0;$i<sizeof($ids);$i++){
					$request .= "&id[".$i."]=".$ids[$i];
				}
				$request .= "&jmb_type=body";
			}
			else{
				$type = (isset($_REQUEST['jmb_type'])) ? $_REQUEST['jmb_type'] : 'default';
				switch($type){
					case "register":
						$sql = "SELECT * FROM #__mb_categories WHERE name='register'";
						$db->setQuery($sql);
						$page_id = $db->loadAssocList();
						$request = "index.php?option=com_manager&view=single&id=".$page_id[0]['p_id']."&jmb_type=register";		
					break;
					
					default:
						$sql = "SELECT * FROM #__mb_categories WHERE name='first'";
						$db->setQuery($sql);
						$page_id = $db->loadAssocList();
						$request = "index.php?option=com_manager&view=single&id=".$page_id[0]['p_id'];
					break;
				}
			}
		}
		return JURI::base().$request;
	}
	
	/**
	*
	*/
	protected function redirect($url){
		$currentURL = self::getCurrentURL();
		if($url === $currentURL){ return 0; }
		header("Location: ".$url);
	}
	
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
	public function FBEngine(){
		# enabled facebook api
		$facebook = self::fbEnabled();
		# get session
		$session = $facebook->getSession();
		# get redirect url
		$url = self::getURL($facebook, $session);
		# redirect
		self::redirect($url);
		return array('facebook' =>$facebook, 'session'=>$session);
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
