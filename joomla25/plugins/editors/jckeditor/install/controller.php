<?php

defined('JPATH_BASE') or die;

jimport( 'joomla.utilities.utility' );

class InstallController extends JController
{

	
	private $_overwrite = true;
	
	
	public function __construct( $config = array() )
	{
	
		if(defined('JLEGACY_CMS'))
		{
			$user = & JFactory::getUser();
			if (!$user->authorize('com_installer', 'installer')) {
				echo JError::raiseError( 404, JText::_('ALERTNOTAUTH') );
				exit();
			}
		
		}
		else
		{
			$user = & JFactory::getUser();
			if (!$user->authorise('core.manage', 'com_installer')) {
				echo JError::raiseWarning(404, JText::_('JERROR_ALERTNOAUTHOR'));
				exit();
			}
		}
	
	
		parent::__construct($config);
	}
	
	public function display()
	{
		JRequest::setVar('view','install');
		if(JUtility::isWinOS()) //skip permisson screen
			JRequest::setVar('layout','default2');
		parent::display();
	}
	
	public function font()
	{
		JRequest::setVar('view','install');
		JRequest::setVar('layout','default2');
		parent::display();
	}

	public function folders()
	{
		$model = $this->getModel('font');
		$model->store();
		JRequest::setVar('view','install');
		JRequest::setVar('layout','default3');
		parent::display();
	}

	public function template()
	{
		
		$model = $this->getModel('folders');
		$model->store();
		JRequest::setVar('view','install');
		JRequest::setVar('layout','default4');
		parent::display();
	}
	
	
	public function finish()
	{
		$model = $this->getModel('template');
		$model->store();
		echo '<script type="text/javascript">window.parent.SqueezeBox.close();</script>';
	}
	
		
	public function changeexecutablepermission()
	{
		$model = $this->getModel("install");
		$model->changeExecutablePermission();
		$app = JFactory::getApplication();
		$this->setRedirect('index.php');
	}
	
	public function changefilespermission()
	{
		$model = $this->getModel("install");
		$model->changeFilesPermission();
		$app = JFactory::getApplication();
		$this->setRedirect('index.php');
	
	}
	
	public function changefolderspermission()
	{
		
		$model = $this->getModel("install");
		$model->changeFoldersPermission();
		$app = JFactory::getApplication();
		$this->setRedirect('index.php');
	
	}
	
	public function changeimagefolderswritablepermission()
	{
		
		$model = $this->getModel("install");
		$model->changeImageFoldersWritablePermission();
		$app = JFactory::getApplication();
		$this->setRedirect('index.php');
	}

}