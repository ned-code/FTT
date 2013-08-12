<?php
/**
 * @version		$Id: com_obsuggest.php 358 2011-07-01 10:56:12Z phonglq $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

// ------------------  standard plugin initialize function - don't change ---------------------------
global $sh_LANG;
$sefConfig = & shRouter::shGetConfig();
$shLangName = '';
$shLangIso = '';
$title = array();
$shItemidString = '';
$dosef = shInitializePlugin( $lang, $shLangName, $shLangIso, $option);
if ($dosef == false) return;
// ------------------  standard plugin initialize function - don't change ---------------------------

// ------------------  load language file - adjust as needed ----------------------------------------
//$shLangIso = shLoadPluginLanguage( 'com_obsuggest', $shLangIso, '_PHPSHOP_LIST_ALL_PRODUCTS');
// ------------------  load language file - adjust as needed ----------------------------------------

// db instance
$db = &JFactory::getDBO();
		
$option = isset($option)?@$option : null;
//$controller = isset($controller) ? @$controller : null;
///$view = isset($view) ? @$view : null;
if(!empty($option))
{
	$title[] = "foobla-suggestions";
	shRemoveFromGETVarsList('option');
}
if(!empty($controller))
{
	$title[] = $controller;
	shRemoveFromGETVarsList('controller');
	
	$idea_id = isset($idea_id) ? @$idea_id : null;
	if(!empty($idea_id))
	{
		
		
		$query = "
			SELECT title FROM #__foobla_uv_idea
			WHERE id = $idea_id
		";
		
		$db->setQuery($query);
		
		$result = $db->loadObject();
		$title[] = $idea_id . "-" . (($result->title)?$result->title : "notitle");
		shRemoveFromGETVarsList("idea_id");
	}
	
	
	//$user_id = isset($user_id) ? @$user_id : "23";
	if(!empty($user_id))
	{
		$query = "
			SELECT username FROM #__users
			WHERE id = $user_id
		";
		
		$db->setQuery($query);
		
		$ret = $db->loadObject();
		
		$title[] = $user_id . "-" . (($ret->username)?$ret->username : "notitle");
		shRemoveFromGETVarsList("user_id");
	}		
}
else 
{
	$controller = "default";
	$title[]="default";
}


if(!empty($forumId))
{
	$query = "
			SELECT name FROM #__foobla_uv_forum
			WHERE id = $forumId
		";
		
	$db->setQuery($query);
	
	$ret = $db->loadObject();
	$title[] = $forumId . '-' . ($ret->name ? $ret->name : "notitle");
	shRemoveFromGETVarsList('forumId');
}
if(!empty($forum_id))
{	
	$title[] = $forum_id;
	shRemoveFromGETVarsList('forum_id');
}
if(!empty($view)){	
	shRemoveFromGETVarsList('view');
}
if(!empty($lang)){	
	shRemoveFromGETVarsList('lang');
}
if(!empty($Itemid))	{
	shRemoveFromGETVarsList('Itemid');
}
shRemoveFromGETVarsList('option');
// ------------------  standard plugin finalize function - don't change ---------------------------
if ($dosef){
  $string = shFinalizePlugin( $string, $title, $shAppendString, $shItemidString,
  (isset($limit) ? @$limit : null), (isset($limitstart) ? @$limitstart : null),
  (isset($shLangName) ? @$shLangName : null));
}

// ------------------  standard plugin finalize function - don't change ---------------------------

?>