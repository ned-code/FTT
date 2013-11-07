<?php
/********************************************************************
Product		: Flexicontact Plus
Date		: 3 July 2013
Copyright	: Les Arbres Design 2010-2013
Contact		: http://extensions.lesarbresdesign.info
Licence		: GNU General Public License
*********************************************************************/
defined('_JEXEC') or die('Restricted Access');

class FlexicontactplusControllerMenu extends JControllerLegacy
{
function __construct()
{
	parent::__construct();
	$this->registerTask('save', 'apply');
	$this->registerTask('save_css', 'apply_css');
	$this->registerTask('save_field', 'apply_field');
}

function display($cachable = false, $urlparams = false)
{
	$view_name = JRequest::getVar('view','config_menu');
	$menu = 'config';
	if ($view_name == 'config_css')
		$menu = 'css';
	if ($view_name == 'config_images')
		$menu = 'images';

	if ($menu == 'config')
		FCP_Admin::environment_check();

	FCP_Admin::addSubMenu($menu);

	$param1    = JRequest::getVar('param1','');
	$config_base_view = JRequest::getInt('config_base_view', 0);

	$config_id = $config_base_view;

	$config_model = $this->getModel('config');
	$config_names = $config_model->getListNames();				// Multiple configurations?
	$config_data = $config_model->getOneById($config_id);		// gets the default config if $config_id = 0
	if ($config_data === false)
		$config_data = $config_model->getOneById(0);			// if not found, get the default config
	if ($config_data === false)
		return;
		
	$config_base_view = $config_data->id;						// The model may have switched the config to the default config
	$config_count = $config_model->countConfig();
	$css_file_name = JRequest::getVar('css_file_name', $config_data->config_data->css_file);

	$view = $this->getView($view_name, 'html');
	$view->assignRef('config_id', $config_id);
	$view->assignRef('config_data', $config_data);
	$view->assignRef('param1', $param1);
	$view->assignRef('config_names', $config_names);
	$view->assignRef('config_count', $config_count);
	$view->assignRef('config_base_view', $config_base_view);
	$view->assignRef('css_file_name', $css_file_name);
	
	$view->display();
}

function apply()										// save changes to config
{
	$config_id = JRequest::getInt('config_id', 0);
	$config_base_view = JRequest::getInt('config_base_view', 0);
	$task = JRequest::getVar('task');					// 'save' or 'apply'
	$view_name = JRequest::getVar('view');				// could be one of several

	$param1 = JRequest::getVar('param1','');			// 'user_template', 'admin_template', 'top_text', 'bottom_text', etc
	$config_model = $this->getModel('config');
		
	$config_model->getOneById($config_id);				// Get all the data (DB) for the current configuration
	$config_count = $config_model->countConfig();

	$config_model->getPostData($view_name, $param1);	// Overwrite with edited data

	$stored = $config_model->store($view_name);			// The view specifies validation performed by the store() function
	
	if ($stored)
		{
		if ($task == 'apply')
			$this->setRedirect(LAFC_COMPONENT_LINK."&controller=menu&task=display&view=$view_name&param1=$param1&config_id=$config_id&config_base_view=$config_base_view",JText::_('COM_FLEXICONTACT_SAVED'));
		else
			$this->setRedirect(LAFC_COMPONENT_LINK."&controller=menu&task=display&config_id=$config_id&config_base_view=$config_base_view",JText::_('COM_FLEXICONTACT_SAVED'));
		}
	else
		{
		$view = $this->getView($view_name, 'html');
		$view->assignRef('config_id', $config_id);
		$view->assignRef('config_data', $config_model->_data);
		$view->assignRef('config_count', $config_count);
		$view->assignRef('param1', $param1);
		$view->assignRef('config_names', $config_names);
		$view->assignRef('config_base_view', $config_base_view);
		$view->display();
		}
}   

function cancel()
{
	$config_base_view = JRequest::getInt('config_base_view', 0);
	$config_id = JRequest::getVar('config_id', 0);
	$this->setRedirect(LAFC_COMPONENT_LINK."&controller=menu&task=display&config_id=$config_id&config_base_view=$config_base_view");
}

//--------------------------------------------------------------------------------------------------
// Help
//--------------------------------------------------------------------------------------------------

function help()
{
	FCP_Admin::addSubMenu('help');
	$config_base_view = JRequest::getInt('config_base_view', 0);
	$config_id = JRequest::getInt('config_id', 0);
	$config_model = $this->getModel('config');
	$config_names = $config_model->getListNames();				// Multiple configurations?
	$config_data = $config_model->getOneById($config_id);		// gets the default config if $config_id = 0

	$view = $this->getView('help', 'html');
	$view->assignRef('config_id', $config_id);
	$view->assignRef('config_data', $config_data);
	$view->assignRef('config_names', $config_names);
	$view->assignRef('config_base_view', $config_base_view);
	$view->display();
}
	
//--------------------------------------------------------------------------------------------------
// Images
//--------------------------------------------------------------------------------------------------

function delete_image()
{
	$config_id = JRequest::getInt('config_id', 0);
	$config_base_view = JRequest::getInt('config_base_view', 0);
	$cids = JRequest::getVar('cid', array(0), 'post', 'array');
	$msg = '';
	
	if (file_exists(JPATH_ROOT.'/demo_mode.txt'))		// used on our demo site
		$msg = "Images can not be deleted in demo mode";
	else
		{
		foreach ($cids as $file_name)
			@unlink(LAFC_SITE_IMAGES_PATH.'/'.$file_name);
		}
	$this->setRedirect(LAFC_COMPONENT_LINK."&controller=menu&task=display&view=config_images&config_id=$config_id&config_base_view=$config_base_view", $msg);
}

//--------------------------------------------------------------------------------------------------
// Css
//--------------------------------------------------------------------------------------------------

function apply_css()
{
	$config_id = JRequest::getInt('config_id', 0);
	$config_base_view = JRequest::getInt('config_base_view', 0);
	$task = JRequest::getVar('task');				// 'save_css' or 'apply_css'
	$css_file_name = JRequest::getVar('css_file_name');
	$css_contents = JRequest::getVar('css_contents',"","","",JREQUEST_ALLOWRAW);
	$path = LAFC_SITE_ASSETS_PATH.'/';
	
	if (strlen($css_contents) == 0)
		$this->setRedirect(LAFC_COMPONENT_LINK."&controller=menu&task=display&config_base_view=$config_base_view");

	if (file_exists(JPATH_ROOT.'/demo_mode.txt'))		// used on our demo site
		$msg = "Css file is not saved in demo mode";
	else
		{
		$length_written = file_put_contents ($path.$css_file_name, $css_contents);
		if ($length_written == 0)
			$msg = JText::_('COM_FLEXICONTACT_NOT_SAVED');
		else
			$msg = JText::_('COM_FLEXICONTACT_SAVED');
		}
		
	if ($task == 'apply_css')
		$this->setRedirect(LAFC_COMPONENT_LINK."&controller=menu&task=display&view=config_css&config_id=$config_id&config_base_view=$config_base_view&css_file_name=$css_file_name",$msg);
	else
		$this->setRedirect(LAFC_COMPONENT_LINK."&controller=menu&task=display&config_id=$config_id&config_base_view=$config_base_view",$msg);
}   

function trace_on()
{
	$config_model = $this->getModel('config');
	$config_id = JRequest::getInt('config_id', 0);
	FCP_trace::init_trace($config_model, $config_id);
	$this->setRedirect(LAFC_COMPONENT_LINK.'&controller=menu&task=help');
}

function trace_off()
{
	FCP_trace::delete_trace_file();
	$this->setRedirect(LAFC_COMPONENT_LINK.'&controller=menu&task=help');
}


}
