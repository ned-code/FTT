<?php


// Check to ensure this file is included in Joomla!
defined('_JEXEC') or die();

class ToolbarsController extends JCKController
{
	/**
	 * Custom Constructor
	 */
	function __construct( $default = array())
	{
		parent::__construct( $default );

		$this->registerTask( 'apply', 		'save');
		$this->registerTask( 'edit' , 		'display' );
		$this->registerTask( 'add' , 		'display' );
		$this->registerTask( 'remove' , 	'remove' );

	}

	function display($cachable = false, $urlparams = false )
	{
	
		$mainframe = JFactory::getApplication();
		$mainframe->enqueueMessage("Please note the save feature for this functionality has been disabled. If you require full functionailty please upgrade to the professional version.","notice");
		
		switch($this->getTask())
		{
			case 'add'     :
			case 'edit'    :
			{
				JRequest::setVar( 'hidemainmenu', 1 );
				JRequest::setVar( 'layout', 'form' );
				JRequest::setVar( 'view', 'toolbar' );
			}	break;
			case 'preview'	:
			{
				JRequest::setVar( 'view', 'toolbar' );
				JRequest::setVar( 'layout', 'popup' );
			} 
			
		}

		parent::display($cachable, $urlparams);
	}

		/**
	* Compiles information to add or edit a toolbar
	* @param string The current GET/POST option
	* @param integer The unique id of the record to edit
	*/
	function copy()
	{
		// Check for request forgeries
		JRequest::checkToken() or die( 'Invalid Token' );
		$this->setRedirect( 'index.php?option=com_jckman&controller=toolbars');
	}
			
			
	function save()
	{
		
		// Check for request forgeries
		JRequest::checkToken() or die( 'Invalid Token' );
		
		$task 	= $this->getTask();
		$id = JRequest::getInt('id',false);
		
		switch ( $task )
		{
			case 'apply':
				if($id)
					$this->setRedirect( 'index.php?option=com_jckman&controller=toolbars&task=edit&cid[]='.$id);
				else
					$this->setRedirect( 'index.php?option=com_jckman&controller=toolbars&task=edit');	
				break;

			case 'save':
			default:
				$this->setRedirect( 'index.php?option=com_jckman&controller=toolbars');
				break;
		}
		
	}	
	

	function cancelEdit( )
	{
	  // Check for request forgeries
		JRequest::checkToken() or die( 'Invalid Token' );

		$row 	=& JCKHelper::getTable('toolbar');
		$row->bind(JRequest::get('post'));
		$row->checkin();
       	$this->setRedirect( 'index.php?option=com_jckman&controller=toolbars');

	}
		
	function remove()
	{
		// Check for request forgeries
		JRequest::checkToken() or die( 'Invalid Token' );
				
	
		$db		=& JFactory::getDBO();
		$cid  = JRequest::getVar( 'cid', array(0), 'post', 'array' );
		JArrayHelper::toInteger($cid, array(0));

		if (count( $cid ) < 1) {
			JError::raiseError(500, JText::_( 'Select a Toolbar to delete' ) );
		}

		if (empty( $cid )) {
			return JError::raiseWarning( 500, 'No items selected' );
		}

		$cids = implode( ',', $cid );
		
			
		$query = 'SELECT count(1)'
		. ' FROM #__jcktoolbars WHERE id IN ('.$cids.') AND iscore = 1';
		$db->setQuery( $query );
		$total = $db->loadResult();
		if($msg = $db->getErrorMsg())
		{
			return JError::raiseError(500, $msg);
		}
		
		if($total > 0){
			$this->setRedirect( 'index.php?option=com_jckman&controller=toolbars');
			return JError::raiseWarning( 500, 'Core Toolbars cannot to be deleted' );
		}
		$this->setRedirect( 'index.php?option=com_jckman&controller=toolbars');
	}
	
}