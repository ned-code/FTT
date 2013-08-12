<?php
/**
 * @version		$Id: mod_obsuggest_forums.php 164 2011-03-12 09:01:56Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

// Include the syndicate functions only once
$forum_id = &JRequest::get('forum_id');
$idea_id = &JRequest::get('idea_id');
$forum_helper_path 	= JPATH_SITE.DS.'components'.DS.'com_obsuggest'.DS.'helper'.DS.'forum.php';
if(JFile::exists($forum_helper_path)){
	require_once $forum_helper_path;
}
if( !$forum_id && $idea_id ) {
	$forum = Forum::getForumByIdeaId( $idea_id );
	$forum_id =$forum->id;
}

$user = &JFactory::getUser();
$user_id = $user->id;
$remaining_vote = Forum::getRemainingPoint($forum_id, $user_id);

//$list 				= modListUserVoiceHelper::getListUserVoice($params);
//require(JModuleHelper::getLayoutPath('mod_obsuggest_forums'));
?>
<div>
<span class="votes_remaining_num"><?php echo $remaining_vote?></span><?php echo JText::_('OBSG_VOTES_LEFT').'!';?>
</div>