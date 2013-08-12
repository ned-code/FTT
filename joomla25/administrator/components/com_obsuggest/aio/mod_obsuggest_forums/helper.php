<?php
/**
 * @version		$Id: helper.php 164 2011-03-12 09:01:56Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

class modListUserVoiceHelper
{
	function getListUserVoice(&$params)
	{
		$db = &JFactory::getDBO();		
		$query = "SELECT id,name FROM  #__foobla_uv_forum WHERE published = '1'";
		$db->setQuery($query);
		$result = $db->loadObjectList();
		$std = new stdClass();
		if($result){	
			foreach($result as $rs){
				$check = $params->get($rs->name);
				$name = $rs->name;
				if($check=='1'){
					$id = $rs->id;
					$std->$name= $rs->name;
					$std->$name.= "-".$rs->id;
					//echo $std->name;			
				}
				else $std->$name="";
			}
		}
		//print_r($std);
		return $std;
	}	
}

?>
