<?php
// no direct access
noDirectAccess();

jimport('joomla.application.component.controller');

class angkorController extends JController
{
	/**
	 * Constructor
	 *
	 * @params	array	Controller configuration array
	 */
	function __construct($config = array())
	{
		parent::__construct($config);

	}

	/**
	 * Displays a view
	 */
	function display( )
	{
		parent::display();
	}
	function save()
	{
		$this->save_mail();		
		$msg=JText::_('SAVE_SUCCESS');
		$app = JFactory::getApplication();
		$app->redirect('index.php?option=com_angkor',$msg); 
	}
	function apply()
	{
		$this->save_mail();		
		$this->display();
	}
	function save_mail()
	{
		$db = JFactory::getDBO();
		$code=JRequest::getString('code');
		$joomlaemails = $this->getModel('angkor');
		$row=$joomlaemails->getnewEmail();
		$emailrow=$joomlaemails->getEmail();
		
		if($emailrow==null)
			$row->id=0;
		else
			$row->id=$emailrow->id;
		
		$row->bind(JRequest::get('post',JREQUEST_ALLOWRAW));
		$row->store();
	}
	function cancel()
	{
		$app = JFactory::getApplication();
		$app->redirect('index.php?option=com_angkor'); 
	}
	
}
