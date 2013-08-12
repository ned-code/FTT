<?php
/**
 * @version		$Id: obsuggest.php 301 2011-04-04 09:02:09Z phonglq $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined('_JEXEC') or die;

jimport('joomla.plugin.plugin');

require_once JPATH_SITE.'/components/com_obsuggest/helper/router.php';

/**
 * obSuggest Search plugin
 *
 * @package		Joomla
 * @subpackage	Search
 * @since		1.6
 */
class plgSearchObSuggest extends JPlugin
{
	/**
	 * @return array An array of search areas
	 */
	function onContentSearchAreas()
	{
		static $areas = array(
			'obsuggest' => 'PLG_SEARCH_OBSUGGEST_IDEAS');
			return $areas;
	}

	/**
	 * Content Search method
	 * The sql must return the following fields that are used in a common display
	 * routine: href, title, section, created, text, browsernav
	 * @param string Target search string
	 * @param string mathcing option, exact|any|all
	 * @param string ordering option, newest|oldest|popular|alpha|category
	 * @param mixed An array if the search it to be restricted to areas, null if search all
	 */
	function onContentSearch($text, $phrase='', $ordering='', $areas=null)
	{
		$db		= JFactory::getDbo();
		$app	= JFactory::getApplication();
		$user	= JFactory::getUser();
		$groups	= implode(',', $user->getAuthorisedViewLevels());
		$tag = JFactory::getLanguage()->getTag();

		$limit			= $this->params->def('search_limit',		50);
		
		#require_once JPATH_SITE.'/components/com_obsuggest/helpers/route.php';
		#require_once JPATH_SITE.'/administrator/components/com_search/helpers/search.php';
		

		$searchText = $text;
		if (is_array($areas)) {
			if (!array_intersect($areas, array_keys($this->onContentSearchAreas()))) {
				return array();
			}
		}

		$nullDate		= $db->getNullDate();
		$date = JFactory::getDate();
		$now = $date->toMySQL();

		$text = trim($text);
		if ($text == '') {
			return array();
		}

		$wheres = array();
		switch ($phrase) {
			case 'exact':
				$text		= $db->Quote('%'.$db->getEscaped($text, true).'%', false);
				$wheres2	= array();
				$wheres2[]	= 'j.`title` LIKE '.$text;
				$wheres2[]	= 'j.`content` LIKE '.$text;
				$where		= '(' . implode(') OR (', $wheres2) . ')';
				break;

			case 'all':
			case 'any':
			default:
				$words = explode(' ', $text);
				$wheres = array();
				foreach ($words as $word) {
					$word		= $db->Quote('%'.$db->getEscaped($word, true).'%', false);
					$wheres2	= array();
					$wheres2[]	= 'j.`title` LIKE '.$word;
					$wheres2[]	= 'j.`content` LIKE '.$word;
					$wheres[]	= implode(' OR ', $wheres2);
				}
				$where = '(' . implode(($phrase == 'all' ? ') AND (' : ') OR ('), $wheres) . ')';
				break;
		}

		$morder = '';
		
		switch ($ordering) {
			case 'oldest':
				$order = 'j.createdate ASC';
				break;

			case 'popular':
				$order = 'j.votes DESC';
				break;

			case 'alpha':
				$order = 'j.title ASC';
				break;

			case 'category':
				$order = 'jf.`name` ASC, j.`title` ASC';
				$morder = 'j.`title` ASC';
				break;

			case 'newest':
			default:
				$order = 'j.createdate DESC';
				break;
		}

		$rows = array();

		$where = ($where)? ' AND '.$where : '';
		$query = 'SELECT j.`id`,
					j.`title`,
					jf.`name` AS section ,
					j.`content` AS text, 
					j.`user_id`, 
					j.`createdate` AS created, 
					j.`status_id`, 
					j.`forum_id`, 
					j.`votes`, 
					j.`published`, 
					"2" AS `browsernav`
				FROM #__foobla_uv_idea j, #__foobla_uv_forum jf
				WHERE jf.id=j.forum_id'.$where;
		
		$db->setQuery($query, 0, $limit);
		$list = $db->loadObjectList();
		$limit -= count($list);

		if (isset($list))
		{
			foreach($list as $key => $item)
			{
				$list[$key]->href  = JRoute::_(foobla_suggestionsHelperRouter::addItemId('index.php?option=com_obsuggest&controller=comment&idea_id='.$item->id));
			}
		}
		$rows[] = $list;

		$results = array();
		if (count($rows))
		{
			foreach($rows as $row)
			{
				$new_row = array();
				foreach($row AS $key => $article) {
						$new_row[] = $article;
				}
				$results = array_merge($results, (array) $new_row);
			}
		}

		return $results;
	}
}
