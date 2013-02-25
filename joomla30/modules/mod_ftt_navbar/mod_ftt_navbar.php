<?php
/**
 * @package     Joomla.Site
 * @subpackage  mod_login
 *
 * @copyright   Copyright (C) 2005 - 2013 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

// Include the login functions only once
require_once __DIR__ . '/helper.php';

$helper = new modFttNavbarHelper();


$layout = $params->get('layout', 'default');
$view = $helper->getView();

require JModuleHelper::getLayoutPath('mod_ftt_navbar', $layout);
