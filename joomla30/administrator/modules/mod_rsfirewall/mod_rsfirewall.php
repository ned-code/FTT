<?php
/**
* @version 1.4.0
* @package RSFirewall! 1.4.0
* @copyright (C) 2009-2013 www.rsjoomla.com
* @license GPL, http://www.gnu.org/licenses/gpl-2.0.html
*/

// no direct access
defined('_JEXEC') or die('Restricted access');

require_once JPATH_ADMINISTRATOR.'/components/com_rsfirewall/helpers/config.php';

// J! version
$jversion 	= new JVersion();
$isJ30  	= $jversion->isCompatible('3.0');
// logged in user
$user 		= JFactory::getUser();

if ($isJ30) {
	JModelLegacy::addIncludePath(JPATH_ADMINISTRATOR.'/components/com_rsfirewall/models');
	$model = JModelLegacy::getInstance('RSFirewall', 'RSFirewallModel', array(
		'option' => 'com_rsfirewall',
		'table_path' => JPATH_ADMINISTRATOR.'/components/com_rsfirewall/tables'
	));
} else {
	jimport('joomla.application.component.model');
	JModel::addIncludePath(JPATH_ADMINISTRATOR.'/components/com_rsfirewall/models');
	$model = JModel::getInstance('RSFirewall', 'RSFirewallModel', array(
		'option' => 'com_rsfirewall',
		'table_path' => JPATH_ADMINISTRATOR.'/components/com_rsfirewall/tables'
	));
}

$config = RSFirewallConfig::getInstance();

if ($model && $user->authorise('core.admin', 'com_rsfirewall')) {
	JHtml::_('behavior.framework');
	// load the frontend language
	// this language file contains some event log translations
	// it's usually loaded by the System Plugin, but if it's disabled, we need to load it here
	if (!$model->isPluginEnabled()) {
		$lang = JFactory::getLanguage();
		
		$lang->load('com_rsfirewall', JPATH_SITE, 'en-GB', true);
		$lang->load('com_rsfirewall', JPATH_SITE, $lang->getDefault(), true);
		$lang->load('com_rsfirewall', JPATH_SITE, null, true);
	}

	$doc = JFactory::getDocument();
	$doc->addStyleSheet(JURI::root(true).'/administrator/components/com_rsfirewall/assets/css/com_rsfirewall.css');
	$doc->addStyleSheet(JURI::root(true).'/administrator/modules/mod_rsfirewall/assets/css/mod_rsfirewall.css');

	$doc->addScript(JURI::root(true).'/administrator/components/com_rsfirewall/assets/js/jquery.js');
	$doc->addScript(JURI::root(true).'/administrator/components/com_rsfirewall/assets/js/rsfirewall.js');
	$doc->addScript(JURI::root(true).'/administrator/modules/mod_rsfirewall/assets/js/rsfirewall.js');
	
	$logs = array();
	if ($user->authorise('logs.view', 'com_rsfirewall')) {
		$logs = $model->getLastLogs();
		$logNum = $model->getLogOverviewNum();
	}
	
	$grade = $config->get('grade');
	if (!$grade) {
		$color = '#000';
	}
	elseif ($grade <= 75) {
		$color = '#ED7A53';
	} elseif ($grade <= 90) {
		$color = '#88BBC8';
	} elseif ($grade <= 100) {
		$color = '#9FC569';
	}
	
	require JModuleHelper::getLayoutPath('mod_rsfirewall');
}