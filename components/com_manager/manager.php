<?php
# Require the com_content helper library
require_once(JPATH_COMPONENT.DS.'controller.php'); 

# Create the controller
$controller = new JMBController( );

# Perform the Request task
$controller->execute(JRequest::getCmd('task'));

#Autocreate Joomla User
$controller->loginFacebookUser();

# FTT permission get
$controller->jmb();

# Redirect if set by the controller
$controller->redirect(); 

# include JS and CSS 
$document =& JFactory::getDocument();

$document->addStyleSheet('administrator/components/com_manager/js/jquery-ui.css');
$document->addStyleSheet('components/com_manager/codebase/skins/dhtmlxlayout_dhx_skyblue.css');
$document->addStyleSheet('components/com_manager/codebase/dhtmlxlayout.css');
$document->addStyleSheet('components/com_manager/codebase/dhtmlxtree.css');
$document->addStyleSheet('components/com_manager/js/core.css');
	
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
$document->addScript('administrator/components/com_manager/js/jquery.validate.min.js');

//core part
$document->addScript('components/com_manager/js/core.js');
$document->addScript('administrator/components/com_manager/js/MyBranchesManager.js');
$document->addScript('administrator/components/com_manager/js/host.js');

//include library
$document->addStyleSheet('components/com_manager/js/prettyPhoto.css');
$document->addStyleSheet('components/com_manager/js/tipsy.css');
$document->addStyleSheet('components/com_manager/js/scrollbar.css');
$document->addScript('components/com_manager/js/excanvas.js');
$document->addScript('components/com_manager/js/flashcanvas.js');
$document->addScript('components/com_manager/js/jit.js');
$document->addScript('components/com_manager/js/jquery.bt.js');
$document->addScript('components/com_manager/js/jquery.prettyPhoto.js');
$document->addScript('components/com_manager/js/jquery.tipsy.js');
$document->addScript('components/com_manager/js/jquery.scroll.min.js');
	

################################################################################
//jmb overlay
$document->addStyleSheet('components/com_manager/modules/overlay/css/jmb.overlay.css');
$document->addScript('components/com_manager/modules/overlay/js/jmb.overlay.js');
//header
$document->addStyleSheet('components/com_manager/modules/header/css/jmb.header.css');
$document->addScript('components/com_manager/modules/header/js/jmb.header.js');
//profile editor[mini, full, tooltip]
$document->addStyleSheet('components/com_manager/modules/profile/css/jmb.profile.css');
$document->addScript('components/com_manager/modules/profile/js/jmb.profile.js');
//alternative tooltip object
$document->addStyleSheet('components/com_manager/modules/tooltip/css/jmb.tooltip.css');
$document->addScript('components/com_manager/modules/tooltip/js/jmb.tooltip.js');
//media object
$document->addScript('components/com_manager/modules/media/js/jmb.media.js');
//invitation object
$document->addStyleSheet('components/com_manager/modules/invitation/css/jmb.invitation.css');
$document->addScript('components/com_manager/modules/invitation/js/jmb.invitation.js');
//family line object
$document->addStyleSheet('components/com_manager/modules/family_line/css/jmb.family.line.css');
$document->addScript('components/com_manager/modules/family_line/js/jmb.family.line.js');
//login\profile in header (login\logout)
$document->addStyleSheet('components/com_manager/modules/login/css/jmb.login.css');
$document->addScript('components/com_manager/modules/login/js/jmb.login.js');
//progressbar
$document->addStyleSheet('components/com_manager/modules/progressbar/css/jmb.progressbar.css');
$document->addScript('components/com_manager/modules/progressbar/js/jmb.progressbar.js');
//feedback
$document->addStyleSheet('components/com_manager/modules/feedback/css/jmb.feedback.css');
$document->addScript('components/com_manager/modules/feedback/js/jmb.feedback.js');
//notifications
$document->addStyleSheet('components/com_manager/modules/notifications/css/jmb.notifications.css');
$document->addScript('components/com_manager/modules/notifications/js/jmb.notifications.js');
###############################################################################

$document->addCustomTag('<script type="text/javascript">jQuery.noConflict();</script>');

?>