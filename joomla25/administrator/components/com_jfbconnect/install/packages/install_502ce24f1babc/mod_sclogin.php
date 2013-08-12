<?php

/**
 * @package		JFBConnect/JLinked
 * @copyright (C) 2011-2012 by Source Coast - All rights reserved
 * @license http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

// no direct access
defined('_JEXEC') or die('Restricted access');

jimport('joomla.filesystem.file');

require_once(dirname(__FILE__).DS.'helper.php');
$helper = new modSCLoginHelper($params);

$user =& JFactory::getUser();

$jLoginUrl = $helper->getLoginRedirect('jlogin');

$registerType = $params->get('register_type');
if ($registerType == "jomsocial")
{
    $jspath = JPATH_BASE.DS.'components'.DS.'com_community';
    include_once($jspath.DS.'libraries'.DS.'core.php');
    $registerLink = CRoute::_( 'index.php?option=com_community&view=register');
}
else if ($registerType == "communitybuilder")
{
    $registerLink = JRoute::_("index.php?option=com_comprofiler&task=registers", false);
    $forgotLink = JRoute::_("index.php?option=com_comprofiler&task=lostPassword");
}
else if ($registerType == "virtuemart" && file_exists(JPATH_SITE.DS.'components'.DS.'com_virtuemart'.DS.'virtuemart_parser.php'))
{
    require_once (JPATH_SITE.DS.'components'.DS.'com_virtuemart'.DS.'virtuemart_parser.php');
    global $sess;
    $registerLink = $sess->url( SECUREURL.'index.php?option=com_virtuemart&amp;page=shop.registration' );
}
else 
{
    $registerLink = '';
     //SC15
    
	$registerLink = JRoute::_('index.php?option=com_users&view=registration', false);
     //SC16
}
// common for J!, JomSocial, and Virtuemart

$forgotUsernameLink = '';
$forgotPasswordLink = '';
 //SC15

$forgotUsernameLink = JRoute::_('index.php?option=com_users&view=remind', false);
$forgotPasswordLink = JRoute::_('index.php?option=com_users&view=reset', false);
 //SC16

$document = & JFactory::getDocument();
$document->addStyleSheet('modules/mod_sclogin/css/mod_sclogin.css');

require(JModuleHelper::getLayoutPath('mod_sclogin', $helper->getType()));
?>
