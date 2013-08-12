<?php
//--------------------------------------------
//NO DIRECT ACCESS
//--------------------------------------------
function noDirectAccess()
{
	defined( '_JEXEC' ) or die( 'Restricted access' );
}
//--------------------------------------------
noDirectAccess();

// Require the base controller
require_once (JPATH_COMPONENT.DS.'controller.php');

JTable::addIncludePath(JPATH_COMPONENT.DS.'tables');

// Create the controller
$controller	= new AngkorController( );

// Perform the Request task
$controller->execute( JRequest::getCmd('task'));
$controller->redirect();
?>