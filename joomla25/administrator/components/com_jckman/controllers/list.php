<?php


// Check to ensure this file is included in Joomla!
defined('_JEXEC') or die();

jimport( 'joomla.application.component.controller' );


class ListController extends JCKController
{
	/**
	 * Custom Constructor
	 */
	function __construct( $default = array())
	{
		parent::__construct( $default );

		$this->registerTask( 'apply', 		'save');
		$this->registerTask( 'unpublish', 	'publish');
		$this->registerTask( 'edit' , 		'display' );
		$this->registerTask( 'add' , 		'display' );
		$this->registerTask( 'orderup'   , 	'order' );
		$this->registerTask( 'orderdown' , 	'order' );

	}

	function display($cachable = false, $urlparams = false )
	{
	
	  switch($this->getTask())
		{
			case 'add'     :
			case 'edit'    :
			{
				JRequest::setVar( 'hidemainmenu', 1 );
				JRequest::setVar( 'layout', 'form' );
				JRequest::setVar( 'view', 'editplugin' );
			}
		}
	
		parent::display($cachable, $urlparams);
	}

			
			
	function save()
	{
		// Check for request forgeries
		JRequest::checkToken() or die( 'Invalid Token' );
		
		$task 	= $this->getTask();
		//update toolbar selections so set args for event
		$id = JRequest::getInt('id');
		
		
		switch ( $task )
		{
			case 'apply':
				$this->setRedirect( 'index.php?option=com_jckman&controller=list&task=edit&cid[]='.$id);
				break;

			default:
				$this->setRedirect('index.php?option=com_jckman&controller=list');
				break;
		}
	}	
	

	function publish( ){
		// Check for request forgeries
		JRequest::checkToken() or die( 'Invalid Token' );

		$this->setRedirect( 'index.php?option=com_jckman&controller=list' );
	}
		
	function cancel( ){
		$this->setRedirect( JRoute::_( 'index.php', false ) );
	}

	function cancelEdit( )
	{
	  // Check for request forgeries
		JRequest::checkToken() or die( 'Invalid Token' );

		$row 	=& JCKHelper::getTable('plugin');
		$row->bind(JRequest::get('post'));
		$row->checkin();

		$this->setRedirect( JRoute::_( 'index.php?option=com_jckman&controller=list', false ) );
	}
	
	function order( )
	{
		// Check for request forgeries
		JRequest::checkToken() or die( 'Invalid Token' );
		$this->setRedirect( 'index.php?option=com_jckman&controller=list' );
	}

	function saveorder( )
	{
		//Check for request forgeries
		JRequest::checkToken() or die( 'Invalid Token' );
		$this->setRedirect( 'index.php?option=com_jckman&controller=List', $msg );
	}
}