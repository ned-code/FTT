<?php
# Check to ensure this file is included in Joomla!
defined('_JEXEC') or die( 'Restricted access' );
define("JMB_FACEBOOK_APPID", "184962764872486");
define("JMB_FACEBOOK_SECRET", "6b69574c9ddd50ce2661b3053cd4dc02");
define("JMB_FACEBOOK_URL",  'http://www.familytreetop.com/');
define("JMB_FACEBOOK_COOKIE",  true);

if(!isset($_SESSION['jmb']['JMB_FACEBOOK_APPID'])){
	$_SESSION['jmb']['JMB_FACEBOOK_APPID'] = JMB_FACEBOOK_APPID;
	$_SESSION['jmb']['JMB_FACEBOOK_SECRET'] = JMB_FACEBOOK_SECRET;
	$_SESSION['jmb']['JMB_FACEBOOK_URL'] = JMB_FACEBOOK_URL;
	$_SESSION['jmb']['JMB_FACEBOOK_COOKIE'] = JMB_FACEBOOK_COOKIE;
}
# Require the com_content helper library
require_once(JPATH_COMPONENT.DS.'controller.php'); 

# Create the controller
$controller = new JMBController( );

# Perform the Request task
$controller->execute(JRequest::getCmd('task'));

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
$document->addStyleSheet('components/com_manager/js/core.css?111');
	
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

//core part
$document->addScript('components/com_manager/js/core.js?111');
$document->addScript('administrator/components/com_manager/js/MyBranchesManager.js?111');
$document->addScript('administrator/components/com_manager/js/host.js?111');

//include library
$document->addStyleSheet('components/com_manager/js/prettyPhoto.css?111');
$document->addStyleSheet('components/com_manager/js/tipsy.css?111');
$document->addScript('components/com_manager/js/excanvas.js?111');
$document->addScript('components/com_manager/js/jit.js?111');
$document->addScript('components/com_manager/js/jquery.bt.js?111');
$document->addScript('components/com_manager/js/jquery.prettyPhoto.js?111');
$document->addScript('components/com_manager/js/jquery.tipsy.js?111');
	
//jmb overlay
$document->addStyleSheet('components/com_manager/modules/overlay/css/jmb.overlay.css?111');
$document->addScript('components/com_manager/modules/overlay/js/jmb.overlay.js?111');
	
//jmb delete tree button
$document->addStyleSheet('components/com_manager/modules/delete/css/jmb.delete.css?111');
$document->addScript('components/com_manager/modules/delete/js/jmb.delete.js?111');
	
################################################################################
//profile editor[mini, full, tooltip]
$document->addStyleSheet('components/com_manager/modules/profile/css/jmb.profile.css?111');
$document->addScript('components/com_manager/modules/profile/js/jmb.profile.js?111');
//alternative tooltip object
$document->addStyleSheet('components/com_manager/modules/tooltip/css/jmb.tooltip.css?111');
$document->addScript('components/com_manager/modules/tooltip/js/jmb.tooltip.js?111');
//media object
$document->addScript('components/com_manager/modules/media/js/jmb.media.js?111');
//invitation object
$document->addStyleSheet('components/com_manager/modules/invitation/css/jmb.invitation.css?111');
$document->addScript('components/com_manager/modules/invitation/js/jmb.invitation.js?111');
###############################################################################

//login\profile in header (login\logout)
$document->addStyleSheet('components/com_manager/modules/login/css/jmb.login.css?111');
$document->addScript('components/com_manager/modules/login/js/jmb.login.js?111');

//language
$document->addStyleSheet('components/com_manager/modules/language/css/jmb.language.css?111');
$document->addScript('components/com_manager/modules/language/js/jmb.language.js?111');

$document->addCustomTag('<script type="text/javascript">jQuery.noConflict();</script>');

?>