<?php
/**
 * @version		$Id: default.php 444 2012-03-27 03:49:13Z phonglq $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */
defined( '_JEXEC' ) or die( 'Restricted access' );
#echo '<div class="obsuggest-feedback-'.$params->get('button_position').'"><a href="#">'.$params->get('button_label').'</a></div>';
$select_forums = $params->get('select_forums');
?>
<div id="obsuggest-feedback-container">
	<div class="obsuggest-feedback-bottom">
		<a href="<?php echo JRoute::_('index.php?option=com_obsuggest&forumId='.$select_forums);?>" class="obsuggest-feedback-button-bottom"></a>
	</div>
</div>