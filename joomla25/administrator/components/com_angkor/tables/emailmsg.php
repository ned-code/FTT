<?php
defined('_JEXEC') or die( 'Restricted access' );

class JTableEmailMSG extends JTable
{
	function __construct( &$_db )
	{
		parent::__construct( '#__nu_emailmsg', 'id', $_db);		
	}	
}
?>
