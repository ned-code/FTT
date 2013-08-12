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
require_once (dirname(__FILE__).DS.'helper.php');
#require_once (dirname(__FILE__).DS.'elements'.DS.'forum.php');
#$list = modListUserVoiceHelper::getListUserVoice($params);
$document = &JFactory::getDocument();
$document->addStyleSheet(JURI::root().'modules/mod_obsuggest_feedback/assets/obsuggest_feedback.css');
require(JModuleHelper::getLayoutPath('mod_obsuggest_feedback'));
?>