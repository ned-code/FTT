<?php

// Check to ensure this file is within the rest of the framework
defined('JPATH_BASE') or die();

class JCKHTML 
{

	function pluginOptions($id)
	{
		$db =& JFactory::getDBO();
		
				// get a list of the menu items
				
		$query = '';
					
		if($id)
		{		
			$query = 'SELECT p.id, p.title, p.type'
			
			. ' FROM #__jckplugins p'
			. ' LEFT JOIN #__jcktoolbarplugins tp on tp.pluginid = p.id'
			. ' AND tp.toolbarid = '. (int) $id
			. ' WHERE tp.pluginid is null'
			. '	AND p.published = 1'
			. ' ORDER BY p.type, p.id';
		}	
		else
		{
			$query = 'SELECT id, title, type'
			. ' FROM #__jckplugins'
			. ' WHERE published = 1'
			. ' ORDER BY type, id';
		}
		$db->setQuery( $query );
		$plugins = $db->loadObjectList();
		
		// Code that adds menu name to Display of Page(s)

		$items = array();
		$lastType	= null;
		$tmpType	= null;
		foreach ($plugins as $plugin)
		{
			if ($plugin->type != $lastType)
			{
				if ($tmpType) {
					$items[] = JHTML::_('select.option',  '</OPTGROUP>' );
				}
				$items[] = JHTML::_('select.option',  '<OPTGROUP>', $plugin->type );
				$lastType = $plugin->type;
				$tmpType  = $plugin->type;
			}

			$items[] = JHTML::_('select.option',  $plugin->id, $plugin->title );
		}
		if ($lastType !== null) {
			$items[] = JHTML::_('select.option',  '</OPTGROUP>' );
		}

		return $items;
	}

} 
