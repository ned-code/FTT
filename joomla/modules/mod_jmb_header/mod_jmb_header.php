<?php
/**
 * @version		$Id: mod_login.php 20196 2011-01-09 02:40:25Z ian $
 * @package		Joomla.Site
 * @subpackage	mod_login
 * @copyright	Copyright (C) 2005 - 2011 Open Source Matters, Inc. All rights reserved.
 * @license		GNU General Public License version 2 or later; see LICENSE.txt
 */
 
// no direct access
defined('_JEXEC') or die;
define("JMB_FACEBOOK_APPID", "184962764872486");
define("JMB_FACEBOOK_SECRET", "6b69574c9ddd50ce2661b3053cd4dc02");
define("JMB_FACEBOOK_COOKIE",  true);
$_SESSION['jmb']['facebook_appid'] = JMB_FACEBOOK_APPID;
$_SESSION['jmb']['facebook_secret'] = JMB_FACEBOOK_SECRET;
$_SESSION['jmb']['facebook_cookie'] = JMB_FACEBOOK_COOKIE;

// Include the syndicate functions only once
require_once dirname(__FILE__).DS.'helper.php';
require_once dirname(__FILE__).DS.'src'.DS.'facebook.php';

$document = &JFactory::getDocument();

$document->addScript(JUri::root(true).'/modules/mod_jmb_header/js/mod.jmb.header.js?111' );

$fb = modJMBHeaderHelper::FBEngine();
$user_id = $fb['facebook']->getUser();
$session = $fb['session'];
$user_profile = $fb['facebook']->api('/me');
$avatar = modJMBHeaderHelper::getAvatar($user_profile);

$inIFrame = modJMBHeaderHelper::checkLocation();
$in_system = modJMBHeaderHelper::getLogin($user_id);

$aHref = ($inIFrame)?Juri::base():'http://apps.facebook.com/fmybranches/';
$imgName = ($inIFrame)?'to_facebook.gif':'to_fmb.gif';
$baseUrl = JURI::base();

$params->def('greeting', 1);

require JModuleHelper::getLayoutPath('mod_jmb_header', $params->get('layout', 'default'));