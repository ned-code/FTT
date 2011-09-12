<?php
# Check to ensure this file is included in Joomla!
defined('_JEXEC') or die( 'Restricted access' );
define("JMB_FACEBOOK_APPID", "184962764872486");
define("JMB_FACEBOOK_SECRET", "6b69574c9ddd50ce2661b3053cd4dc02");
define("JMB_FACEBOOK_COOKIE",  true);
$_SESSION['jmb']['facebook_appid'] = JMB_FACEBOOK_APPID;
$_SESSION['jmb']['facebook_secret'] = JMB_FACEBOOK_SECRET;
$_SESSION['jmb']['facebook_cookie'] = JMB_FACEBOOK_COOKIE;

# Require the com_content helper library
require_once(JPATH_COMPONENT.DS.'controller.php'); 
require_once(JPATH_COMPONENT.DS.'php'.DS.'facebook.php'); 

$facebook = new Facebook(array('appId'=>JMB_FACEBOOK_APPID,'secret'=>JMB_FACEBOOK_SECRET,'cookie'=>JMB_FACEBOOK_COOKIE));
$session = $facebook->getSession();


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

//jmb overlay
$document->addStyleSheet('components/com_manager/modules/overlay/css/jmb.overlay.css?111');
$document->addScript('components/com_manager/modules/overlay/js/jmb.overlay.js?111');

//jmb delete tree button
$document->addStyleSheet('components/com_manager/modules/delete/css/jmb.delete.css?111');
$document->addScript('components/com_manager/modules/delete/js/jmb.delete.js?111');

//profile editor[mini, full, tooltip]
$document->addStyleSheet('components/com_manager/modules/profile/css/jmb.profile.css?111');
$document->addStyleSheet('components/com_manager/modules/profile/css/jmb.profile.full.css?111');
$document->addStyleSheet('components/com_manager/modules/profile/css/jmb.profile.tooltip.css?111');
$document->addStyleSheet('components/com_manager/modules/profile/css/prettyPhoto.css?111');
$document->addScript('components/com_manager/modules/profile/js/excanvas.js?111');
$document->addScript('components/com_manager/modules/profile/js/jquery.bt.js?111');
$document->addScript('components/com_manager/modules/profile/js/jquery.prettyPhoto.js?111');
$document->addScript('components/com_manager/modules/profile/js/jmb.profile.js?111');
$document->addScript('components/com_manager/modules/profile/js/jmb.profile.full.js?111');
$document->addScript('components/com_manager/modules/profile/js/jmb.profile.tooltip.js?111');

//login\profile in header (login\logout)
$document->addStyleSheet('components/com_manager/modules/login/css/jmb.login.css?111');
$document->addScript('components/com_manager/modules/login/js/jmb.login.js?111');

# Create the controller
$controller = new JMBController( );

# FTT permission get
$controller->jmb($facebook);

# Perform the Request task
$controller->execute( JRequest::getCmd('task'));

# Redirect if set by the controller
$controller->redirect(); 

$document->addCustomTag( '<script type="text/javascript">jQuery.noConflict();</script>');

?>