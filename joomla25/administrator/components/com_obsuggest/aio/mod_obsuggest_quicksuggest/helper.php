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

class modListForumHelper
{
	function getListUserVoice(&$params){
		$db = &JFactory::getDBO();		
		$query = "SELECT id,name FROM  #__foobla_uv_forum WHERE `published` = 1";
		$db->setQuery($query);
		$result = $db->loadObjectList();
		$std = new stdClass();
		if ($result) {
			foreach ($result as $rs) {
				$check = $params->get($rs->name);
				$name = $rs->name;
				if ($check=='1') {
					$id = $rs->id;
					$std->$name= $rs->name;
					$std->$name.= "-".$rs->id;
					//echo $std->name;			
				} else {
					$std->$name="";
				}
			}
		}
		//print_r($std);
		return $std;
	}
	
    function getAllForum(&$params)
	{
        if ($params->get('display_list_forum') == 0) {
            $limit = ' AND `id` = '.$params->get('slList');
        } else {
            $limit = '';
        }
		$query = "
			SELECT *
			FROM `#__foobla_uv_forum`
			WHERE `published` = 1
            ".$limit."
			ORDER BY `id` ASC
		";
        $db = &JFactory::getDBO();
        $db->setQuery($query);

		return $db->loadObjectList();
	}
}
?>
