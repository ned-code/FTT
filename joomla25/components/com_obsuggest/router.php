<?php
/**
 * @version		$Id: router.php 327 2011-05-16 11:46:54Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );
require_once JPATH_SITE.DS.'components'.DS.'com_obsuggest'.DS.'helper'.DS.'router.php';
function obsuggestBuildRoute(&$query)
{
	$jversion = new JVersion();
	$obIsJ15 = ($jversion->RELEASE == '1.5');
	$segments = array();
	$query['controller'] = isset( $query['controller'] ) ? $query['controller'] : 'default';
	if( isset( $query['idea_id'] ) && !isset( $query['task'] ) ) {
		#TODO: create segment 0
		$forum_id 	= '';
		$forum_name 	= '';

		if ( isset( $query['forumId'] ) ) {
			$forum_id 	= $query['forumId'];
			unset($query['forumId']);
			$forum_name 	= obSuggestHelperRouter::getForumTitle( $query['forumId'], JText::_('Default') );
		} else {
			$forum_obj 	= obSuggestHelperRouter::getForumByIdea( $query['idea_id'] );
			if( $forum_obj ) {
				$forum_id 	= $forum_obj->id;
				$forum_name 	= $forum_obj->name;
			}
		}

		if (!$obIsJ15) { # Joomla 1.6
			$segments[] 	= $forum_id . '-' . JApplication::stringURLSafe( $forum_name );
		} else { # Joomla 1.5
			$segments[] 	= $forum_id . '-' . JFilterOutput::stringURLSafe( $forum_name );
		}		

		#TODO: create segment 1
		$idea_title 	= '';
		$idea_title 	= obSuggestHelperRouter::getIdeaTitle( $query['idea_id'], JText::_('Default') );
		if (!$obIsJ15) { # Joomla 1.6
			$segments[] 	= $query['idea_id'] . '-' . JApplication::stringURLSafe( $idea_title );
		} else { # Joomla 1.5
			$segments[] 	= $query['idea_id'] . '-' . JFilterOutput::stringURLSafe( $idea_title );
		}
		unset($query['idea_id']);
		unset( $query['controller'] );
		return $segments;

	} else if ( !isset( $query['idea_id'] ) && !isset( $query['task'] )){
		#TODO: tao seft url cho tab
		if ( isset($query['forumId']) )
		{
			$forum_name 	= obSuggestHelperRouter::getForumTitle( $query['forumId'] );
			
			if (!$obIsJ15) { # Joomla 1.6
				$segments[] 	= $query['forumId'] ."-".JApplication::stringURLSafe( $forum_name );
			} else { # Joomla 1.5
				$segments[] 	= $query['forumId'] ."-".JFilterOutput::stringURLSafe( $forum_name );
			}
			unset($query['forumId']);
		}

		if(isset($query['tab'])) {
			$segments[]=$query['tab'];
			unset($query['tab']);
		}
		unset( $query['controller'] );
		return $segments;

	}

	return $segments;
}

function obsuggestParseRoute($segments)
{

	$query = array();
	$query['controller']='idea';
	if ( count( $segments ) > 1 ) {
		$j 	= strpos( $segments[0], ":" );
		$i 	= strpos( $segments[1], ":" );
		if ( $i ) {
			$query['controller']='comment';
			$query['idea_id'] = substr( $segments[1], 0, $i );
		} else {
			$query['controller']='default';
			$query['tab'] = $segments[1];
		}
	} elseif( count($segments) <= 1  ) {
		$query['controller']='default';
		$i 	= strpos( $segments[0], ":" );
		if ( $i ) {
			$query['forumId'] = substr( $segments[0], 0, $i );
		}
	}

	return $query;
}