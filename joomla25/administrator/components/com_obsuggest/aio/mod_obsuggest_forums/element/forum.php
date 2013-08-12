<?php
/**
 * @version		$Id: forum.php 164 2011-03-12 09:01:56Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

class JElementForum extends JElement
{
	var   $_name = 'Forum';
	function fetchElement($name, $value, &$node, $control_name){
		$db = &JFactory::getDBO();
		$query = "SELECT id,name FROM  #__foobla_uv_forum WHERE published = '1'";
		$db->setQuery($query);
		$result = $db->loadObjectList();
		$radiolist= "<div width=\"50px\">";
		foreach ($result as $rs) {
			$radiolist .= "<input type='text' value='$rs->name' readonly='readonly' />";    	
			$newvalue = $this->_parent->get($rs->name);
			if ($newvalue=='1') {
				$radiolist .= "<input type='radio' value='1' name=\"".$control_name."[$rs->name]\" checked='checked'/> Show";
				$radiolist .= "<input type='radio' value='0' name=\"".$control_name."[$rs->name]\" /> Hide"."<br>";
			} else if($newvalue=='0') {
				$radiolist .= "<input type='radio' value='1' name=\"".$control_name."[$rs->name]\" /> Show";
				$radiolist .= "<input type='radio' value='0' name=\"".$control_name."[$rs->name]\" checked='checked'/> Hide"."<br>";
			} else if(!$newvalue) {
				$radiolist .= "<input type='radio' value='1' name=\"".$control_name."[$rs->name]\" /> Show"; 	
				$radiolist .= "<input type='radio' value='0' name=\"".$control_name."[$rs->name]\" checked='checked'/> Hide"."<br>";
			}
		}
		$radiolist .= "</div>";
		return $radiolist;
	}
}
?>
