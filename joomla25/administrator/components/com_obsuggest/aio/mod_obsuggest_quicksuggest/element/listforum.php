<?php
/**
 * @version		$Id: toolbar.obsuggest.php 127 2011-03-08 03:00:29Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );
jimport( 'joomla.html.parameter.element' );

class JElementListForum extends JElement
{
	var   $_name = 'ListForum';
	function fetchElement($name, $value, &$node, $control_name){
		$db 	= &JFactory::getDBO();
		$query 	= "SELECT id,name FROM  #__foobla_uv_forum WHERE published = '1'";
		$db->setQuery($query);
		$result = $db->loadObjectList();

		$slList = "<select name='".$control_name."[slList]'>";
		foreach ($result as $rs) {
			$slList .= "<option value='$rs->id'>$rs->name</option>";
		}
		$slList .= "</select>";

		return $slList;
		$radiolist	= "<div width=\"50px\">";
		foreach ($result as $rs) {
			$radiolist .= "<input type='text' value='$rs->name' readonly='readonly' />";
			$newvalue = $this->_parent->get($rs->name);
			if ($newvalue=='1') {
				$radiolist .= "<input type='radio' value='1' name=\"".$control_name."[$rs->name]\" checked='checked'/> Show";
				$radiolist .= "<input type='radio' value='0' name=\"".$control_name."[$rs->name]\" /> Hide"."<br>";
			} elseif($newvalue=='0') {
				$radiolist .= "<input type='radio' value='1' name=\"".$control_name."[$rs->name]\" /> Show";
				$radiolist .= "<input type='radio' value='0' name=\"".$control_name."[$rs->name]\" checked='checked'/> Hide"."<br>";
			} elseif(!$newvalue) {
				$radiolist .= "<input type='radio' value='1' name=\"".$control_name."[$rs->name]\" /> Show";
				$radiolist .= "<input type='radio' value='0' name=\"".$control_name."[$rs->name]\" checked='checked'/> Hide"."<br>";
			}
		}
		$radiolist .= "</div>";
		return $radiolist;
	}
}
?>
