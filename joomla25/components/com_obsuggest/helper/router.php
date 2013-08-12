<?php
/**
 * @version		$Id: router.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );


class obSuggestHelperRouter{
	public function addItemId( $_url )
	{
		$version = new JVersion();
		$obIsJ15 = ($version->RELEASE=='1.5');
		$component =& JComponentHelper::getComponent( 'com_obsuggest' );

		$menus	= &JApplication::getMenu( 'site', array() );
		$version = new JVersion();
		$sversion = substr($version->getShortVersion(), 0, 3);
		if( !$obIsJ15 ) {
			$comid = 'component_id';
		} else {
			$comid = 'componentid';
		}
		$items	= $menus->getItems( $comid, $component->id, true );
		$d 		= ( strpos($_url,"?") === false ) ? "?" : "&";
		return ($items->id)? $_url . $d."Itemid=".$items->id:$_url;	
	}
	public function getIdeaTitle($id, $default = 'default')
	{
		$db = &JFactory::getDBO();
		
		$query = "
			SELECT title FROM #__foobla_uv_idea 
			WHERE id = $id";
		
		$db->setQuery($query);
		
		$ret = $db->loadObject();
		return $ret ? $ret->title : $default;
	}
	public function getForumTitle($id, $default = 'default')
	{
		$db = &JFactory::getDBO();
		
		$query = "
			SELECT name FROM #__foobla_uv_forum
			WHERE id = $id
		";
		
		$db->setQuery($query);
		
		$ret = $db->loadObject();
		return $ret ? $ret->name : $default;
	}
	public function getUserName($id, $default = 'default')
	{
		$db = &JFactory::getDBO();
		
		$query = "
			SELECT username FROM #__users
			WHERE id = $id
		";
		
		$db->setQuery($query);
		
		$ret = $db->loadObject();
		return $ret ? $ret->username : $default;
	}
	public function getForumByIdea($idea_id)
	{
		//db instance
		$db = &JFactory::getDBO();
		
		$query = "
			SELECT f.id, f.name 
			FROM #__foobla_uv_forum as f, #__foobla_uv_idea as i
			WHERE 	(f.id = i.forum_id)
			AND		(i.id = $idea_id)
		";
		
		$db->setQuery($query);
		
		$ret = $db->loadObject();
		
		return $ret ? $ret : null;
	}
}
?>