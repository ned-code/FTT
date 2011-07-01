<?php
# Check to ensure this file is included in Joomla!
defined('_JEXEC') or die( 'Restricted access' );

# Require the com_content helper library
require_once(JPATH_COMPONENT.DS.'controller.php'); 

# include JS and CSS 
$document =& JFactory::getDocument();

$document->addStyleSheet('administrator/components/com_manager/js/jquery-ui.css');
$document->addStyleSheet('components/com_manager/codebase/skins/dhtmlxlayout_dhx_skyblue.css');
$document->addStyleSheet('components/com_manager/codebase/dhtmlxlayout.css');
$document->addStyleSheet('components/com_manager/codebase/dhtmlxtree.css');
$document->addStyleSheet('components/com_manager/js/core.css?111');

$css_code = 'html, body {
	    	width: 100%;
	        margin: 0px;
	       
}
	
	#pages {
		width: 980px;
		position: relative;
	}
';

$document->addStyleDeclaration($css_code);


//dhtmlx Part
$document->addScript('components/com_manager/codebase/dhtmlxcontainer.js');
$document->addScript('components/com_manager/codebase/dhtmlxcommon.js');
$document->addScript('components/com_manager/codebase/dhtmlxlayout.js');
$document->addScript('components/com_manager/codebase/dhtmlxtree.js');
$document->addStyleSheet('administrator/components/com_manager/codebase/dhtmlxtabbar.css');
$document->addScript('administrator/components/com_manager/codebase/dhtmlxtabbar.js');

//jquery Part
$document->addScript('administrator/components/com_manager/js/jquery.min.js');
$document->addScript('administrator/components/com_manager/js/jquery-ui.min.js');
$document->addScript('administrator/components/com_manager/js/jquery.form.js');
$document->addScript('components/com_manager/js/core.js?111');
$document->addScript('administrator/components/com_manager/js/MyBranchesManager.js?111');
$document->addScript('administrator/components/com_manager/js/host.js?111');


//profile editor[mini, full, tooltip]
$document->addStyleSheet('components/com_manager/modules/profile/css/jmb.profile.css?111');
$document->addStyleSheet('components/com_manager/modules/profile/css/jmb.profile.full.css?111');
$document->addStyleSheet('components/com_manager/modules/profile/css/jmb.profile.tooltip.css?111');
$document->addScript('components/com_manager/modules/profile/js/excanvas.js?111');
$document->addScript('components/com_manager/modules/profile/js/jquery.bt.js?111');
$document->addScript('components/com_manager/modules/profile/js/jmb.profile.js?111');
$document->addScript('components/com_manager/modules/profile/js/jmb.profile.full.js?111');
$document->addScript('components/com_manager/modules/profile/js/jmb.profile.tooltip.js?111');

/*
//tipsy tooltip -> member_tooltips module
$document->addStyleSheet('components/com_manager/modules/member_tooltip/css/tipsy.css?111');
$document->addScript('components/com_manager/modules/member_tooltip/js/member_tooltip.js?111');
$document->addScript('components/com_manager/modules/member_tooltip/js/jquery.tipsy.js?111');

//profile -> member_profile module
$document->addScript('components/com_manager/modules/member_profile/js/profile.js?111');
$document->addStyleSheet('components/com_manager/modules/member_profile/css/profile.css?111');
$document->addScript('components/com_manager/modules/member_profile/js/profile.media.js?111');
$document->addScript('components/com_manager/modules/member_profile/js/profile.edit.confirm.js?111');

$document->addStyleSheet('components/com_manager/modules/member_profile/css/profile.media.css?111');
$document->addScript('components/com_manager/modules/member_profile/js/edit.profile.js?111');
$document->addStyleSheet('components/com_manager/modules/member_profile/css/edit.profile.css?111');

$document->addScript('components/com_manager/modules/member_profile/js/profile.media.manager.js?111');
$document->addStyleSheet('components/com_manager/modules/member_profile/css/profile.media.manager.css?111');

$document->addScript('components/com_manager/modules/member_profile/js/jquery.lightbox-0.5.pack.js?111');
$document->addStyleSheet('components/com_manager/modules/member_profile/css/jquery.lightbox-0.5.css');

//profile -> member_profile_edit module
$document->addStyleSheet('components/com_manager/modules/member_profile_edit/css/jquery.datepick.css?111');
$document->addScript('components/com_manager/modules/member_profile_edit/js/jquery.datepick.js?111');
$document->addStyleSheet('components/com_manager/modules/member_profile_edit/css/member.profile.edit.css?111');
$document->addScript('components/com_manager/modules/member_profile_edit/js/atooltip.jquery.js?111');
$document->addScript('components/com_manager/modules/member_profile_edit/js/member.profile.edit.js?111');
*/


# Create the controller
$controller = new JMBController( );

# Perform the Request task
$controller->execute( JRequest::getCmd('task'));

# Redirect if set by the controller
$controller->redirect(); 

$document->addCustomTag( '<script type="text/javascript">jQuery.noConflict();</script>' );

?>