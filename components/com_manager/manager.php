<?php
# Require the com_content helper library
require_once(JPATH_COMPONENT . DS . 'controller.php');
require_once(JPATH_COMPONENT . DS . 'php' . DS . 'class.builder.php');

# Create the controller
$controller = new JMBController();

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
$builder = new FamilyTreeTopBuilderLibrary();

$builder->setCss(array(
    'components/com_manager/js/jquery-ui-1.8.23.custom.css',
    'components/com_manager/codebase/skins/dhtmlxlayout_dhx_skyblue.css',
    'components/com_manager/codebase/dhtmlxlayout.css',
    'components/com_manager/codebase/dhtmlxtree.css',
    'components/com_manager/js/core.css',
    'components/com_manager/codebase/dhtmlxtabbar.css',
    'components/com_manager/js/prettyPhoto.css',
    'components/com_manager/js/tipsy.css',
    'components/com_manager/js/scrollbar.css',
    'components/com_manager/js/animatedborder.css',
    'components/com_manager/js/tdfriendselector.css',
    'components/com_manager/modules/overlay/css/jmb.overlay.css',
    'components/com_manager/modules/header/css/jmb.header.css',
    'components/com_manager/modules/profile/css/jmb.profile.css',
    'components/com_manager/modules/profile_editor/css/ftt.profile_editor.css',
    'components/com_manager/modules/tooltip/css/jmb.tooltip.css',
    'components/com_manager/modules/invitation/css/jmb.invitation.css',
    'components/com_manager/modules/family_line/css/jmb.family.line.css',
    'components/com_manager/modules/login/css/jmb.login.css',
    'components/com_manager/modules/progressbar/css/jmb.progressbar.css',
    'components/com_manager/modules/feedback/css/jmb.feedback.css',
    'components/com_manager/modules/notifications/css/jmb.notifications.css'
));
$builder->cssCompile("mini.css");

$builder->setJs(array(
    'components/com_manager/js/excanvas.js',
    'components/com_manager/codebase/dhtmlxcontainer.js',
    'components/com_manager/codebase/dhtmlxcommon.js',
    'components/com_manager/codebase/dhtmlxlayout.js',
    'components/com_manager/codebase/dhtmlxtree.js',
    'components/com_manager/codebase/dhtmlxtabbar.js',
    'components/com_manager/js/jquery-1.8.1.min.js',
    'components/com_manager/js/jquery-ui-1.8.23.custom.min.js',
    'components/com_manager/js/jquery.form.js',
    'components/com_manager/js/jquery.validate.min.js',
    'components/com_manager/js/async.js',
    'components/com_manager/js/jit.js',
    'components/com_manager/js/jquery.bt.js',
    'components/com_manager/js/jquery.prettyPhoto.js',
    'components/com_manager/js/jquery.tipsy.js',
    'components/com_manager/js/jquery.scroll.js',
    'components/com_manager/js/jquery.ui.touch-punch.min.js',
    'components/com_manager/js/jquery.animatedborder.js',
    'components/com_manager/js/tdfriendselector.js',
    'components/com_manager/js/jquery.tabSlideOut.v1.3.js',
    'components/com_manager/modules/overlay/js/jmb.overlay.js',
    'components/com_manager/modules/header/js/jmb.header.js',
    'components/com_manager/modules/profile/js/jmb.profile.js',
    'components/com_manager/modules/tooltip/js/jmb.tooltip.js',
    'components/com_manager/modules/media/js/jmb.media.js',
    'components/com_manager/modules/invitation/js/jmb.invitation.js',
    'components/com_manager/modules/family_line/js/jmb.family.line.js',
    'components/com_manager/modules/login/js/jmb.login.js',
    'components/com_manager/modules/progressbar/js/jmb.progressbar.js',
    'components/com_manager/modules/feedback/js/jmb.feedback.js',
    'components/com_manager/modules/notifications/js/jmb.notifications.js'
));
$jsPath = $builder->jsCompile("mini.js");

$document->addStyleSheet('components/com_manager/mini/mini.css');
$document->addScript('components/com_manager/mini/mini.js');
$document->addScript('components/com_manager/js/core.js');

$document->addStyleSheet();
$document->addScript('components/com_manager/modules/profile_editor/js/ftt.profile_editor.js');

$document->addCustomTag('<script type="text/javascript">jQuery.noConflict();</script>');

?>