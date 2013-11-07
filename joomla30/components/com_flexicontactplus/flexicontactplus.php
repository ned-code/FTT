<?php
/********************************************************************
Product		: FlexicontactPlus
Date		: 28 February 2013
Copyright	: Les Arbres Design 2010-2013
Contact		: http://extensions.lesarbresdesign.info
Licence		: GNU General Public License
*********************************************************************/
defined('_JEXEC') or die('Restricted Access');

// Pull in the helper file

require_once JPATH_COMPONENT_ADMINISTRATOR.'/helpers/flexi_common_helper.php';

// set a constant for the Joomla version

FCP_Common::get_joomla_version();

if (file_exists(JPATH_ROOT.'/LA.php'))
	require_once JPATH_ROOT.'/LA.php';

if (file_exists(JPATH_ROOT.'/demo_mode.txt'))		// used on our demo site
	define("LAFC_DEMO_MODE", "1");
	
require_once LAFC_HELPER_PATH.'/trace_helper.php';
FCP_trace::trace_entry_point(true);

require_once( JPATH_COMPONENT.'/controller.php' );
$controller = new FlexicontactplusController();

$task = JRequest::getVar('task');
$controller->execute($task);

$controller->redirect();

?>
