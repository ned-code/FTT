<?php
/********************************************************************
Product		: Flexicontact Plus
Date		: 19 February 2013
Copyright	: Les Arbres Design 2010-2013
Contact		: http://extensions.lesarbresdesign.info
Licence		: GNU General Public License
*********************************************************************/

defined('_JEXEC') or die('Restricted Access');

require_once JPATH_COMPONENT.'/helpers/flexi_common_helper.php';

// set a constant for the Joomla version

FCP_Common::get_joomla_version();

// Check for ACL access

if (LAFC_JVERSION != 150)						// Only works for versions greater than 1.5
	{
	if (!JFactory::getUser()->authorise('core.manage', 'com_flexicontactplus'))
		{
		return JError::raiseWarning(404, JText::_('JERROR_ALERTNOAUTHOR'));
		}
	}

// Pull in the helper files

require_once JPATH_COMPONENT.'/helpers/flexi_admin_helper.php';
require_once JPATH_COMPONENT.'/helpers/trace_helper.php';

if (file_exists(JPATH_ROOT.'/LA.php'))
	require_once JPATH_ROOT.'/LA.php';

// load our css

$document = JFactory::getDocument();
$document->addStyleSheet(JURI::base().'components/'.LAFC_COMPONENT.'/assets/'.LAFC_COMPONENT.'.css');

// from Joomla 1.6.2 we need to load the Javascript framework

if (LAFC_JVERSION >= 160)
	JHtml::_('behavior.framework');	// load the Joomla Javascript framework

$controller = JRequest::getVar('controller','menu');	// default to the config menu controller
$task = JRequest::getVar('task','display');			// default to the config menu controller

// create an instance of the controller and tell it to execute $task

$classname = 'FlexicontactplusController'.$controller;
require_once JPATH_COMPONENT.'/controllers/'.$controller.'controller.php';

$controller = new $classname();
$controller->execute($task);
$controller->redirect();

