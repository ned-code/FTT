<?php
# Check to ensure this file is included in Joomla!
defined('_JEXEC') or die( 'Restricted access' );

# Require the com_content helper library
require_once(JPATH_COMPONENT.DS.'controller.php'); 

# include JS and CSS 
$document =& JFactory::getDocument();

$document->addStyleSheet('components/com_manager/js/jquery-ui.css');
$document->addStyleSheet('components/com_manager/js/jquery-colorpicker.css');

$document->addStyleSheet('components/com_manager/codebase/skins/dhtmlxlayout_dhx_skyblue.css');
$document->addStyleSheet('components/com_manager/codebase/skins/dhtmlxform_dhx_skyblue.css');
$document->addStyleSheet('components/com_manager/codebase/dhtmlxlayout.css');
$document->addStyleSheet('components/com_manager/codebase/dhtmlxtree.css');
$document->addStyleSheet('components/com_manager/codebase/dhtmlxtabbar.css');

$document->addScript('components/com_manager/codebase/dhtmlxcontainer.js');
$document->addScript('components/com_manager/codebase/dhtmlxcommon.js');
$document->addScript('components/com_manager/codebase/dhtmlxlayout.js');
$document->addScript('components/com_manager/codebase/dhtmlxtree.js');
$document->addScript('components/com_manager/codebase/dhtmlxform.js');
$document->addScript('components/com_manager/codebase/dhtmlxtabbar.js');

/*
$document->addScript('../components/com_manager/modules/member_profile/js/profile.js?111');
$document->addStyleSheet('../components/com_manager/modules/member_profile/css/profile.css?111');
$document->addScript('../components/com_manager/modules/member_profile/js/profile.media.js?111');
$document->addScript('../components/com_manager/modules/member_profile/js/profile.edit.confirm.js?111');

$document->addStyleSheet('../components/com_manager/modules/member_profile/css/profile.media.css?111');
$document->addScript('../components/com_manager/modules/member_profile/js/edit.profile.js?111');
$document->addStyleSheet('../components/com_manager/modules/member_profile/css/edit.profile.css?111');

$document->addScript('../components/com_manager/modules/member_profile/js/profile.media.manager.js?111');
$document->addStyleSheet('../components/com_manager/modules/member_profile/css/profile.media.manager.css?111');

//$document->addScript('../components/com_manager/modules/member_profile/js/jquery.lightbox-0.5.pack.js?111');
$document->addStyleSheet('../components/com_manager/modules/member_profile/css/jquery.lightbox-0.5.css');
*/

$css_code = 'html, body {
	    	width: 100%;
	        height: 100%;
	        margin: 0px;
	       
	}
	
	.dhxLayoutObj {
		width: 900px;
		height: 400px;
		position: relative;
	}

	.content_manager table{
		border:1px solid #000;
	}
	
	.content_manager tr{
		text-align: center;
		vertical-align: middle;
	}
	
	.content_manager td{
		text-align: center;
		vertical-align: middle;
	}
        #container{
            height: 100%;
            margin-bottom:0px;
            margin-top:0px;
        }
';

$document->addStyleDeclaration($css_code);

$document->addScript('components/com_manager/js/MyBranchesManager.js?111');
$document->addScript('components/com_manager/js/host.js?111');
$document->addScript('components/com_manager/js/core.js?111');

# Create the controller

$controller = new ManagerController( );

# Perform the Request task
$controller->execute( JRequest::getCmd('task'));
$user = & JFactory::getUser();
//if (!$user->authorize( 'com_manager', 'manage' )) {
//	$mainframe->redirect( 'index.php', JText::_('ALERTNOTAUTH') );
//}

// Set the table directory
JTable::addIncludePath(JPATH_ADMINISTRATOR.DS.'components'.DS.'com_manager'.DS.'tables');


# Redirect if set by the controller
$controller->redirect(); 
$user = & JFactory::getUser();

JHTML::_('behavior.mootools');

$document = &JFactory::getDocument();
$document->addScript( 'components/com_manager/js/jquery.min.js' );
$document->addScript('components/com_manager/js/jquery-ui.min.js');
$document->addCustomTag( '<script type="text/javascript">jQuery.noConflict();</script>' );
?>
