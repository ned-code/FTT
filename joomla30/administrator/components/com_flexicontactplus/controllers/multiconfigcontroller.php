<?php
/********************************************************************
Product		: Flexicontact Plus
Date		: 23 February 2013
Copyright	: Les Arbres Design 2010-2013
Contact		: http://extensions.lesarbresdesign.info
Licence		: GNU General Public License
*********************************************************************/
defined('_JEXEC') or die('Restricted Access');

class FlexicontactplusControllerMulticonfig extends JControllerLegacy
{
function __construct()
{
	parent::__construct();
	$this->registerTask('save', 'apply');
	$this->registerTask('copy', 'edit');
}

function display($cachable = false, $urlparams = false)
{
	FCP_Admin::addSubMenu('config');
	$config_base_view = JRequest::getInt('config_base_view', 0);

	$config_model = $this->getModel('config');
	$config_list = $config_model->getList();
	$count_unique = $config_model->countConfig(true);
		
	$view = $this->getView('config_list', 'html');
	$view->assignRef('config_list', $config_list);
	$view->assignRef('count_unique', $count_unique);
	$view->assignRef('config_base_view', $config_base_view);
	$view->display();
}

function add()											// Add  a new configuration
{
	$config_model = $this->getModel('config');
	$config_base_view = JRequest::getInt('config_base_view', 0);
	$config_data  = $config_model->initData();
	$config_names = $config_model->getListNames();
	$config_count = $config_model->countConfig();
	$new_flag = 1;
	$copy_flag = 0;

	$view = $this->getView('config_edit', 'html');
	$view->assignRef('config_data', $config_data);
	$view->assignRef('config_names', $config_names);
	$view->assignRef('new_flag', $new_flag);
	$view->assignRef('copy_flag', $copy_flag);
	$view->assignRef('config_count', $config_count);
	$view->assignRef('config_base_view', $config_base_view);
	$view->display();
}

function edit()											// Edit Configuration Name, Description and Language
{
	$config_base_view = JRequest::getInt('config_base_view', 0);
	$config_model = $this->getModel('config');
	$cids = JRequest::getVar('cid', array(0), '', 'array');
	$config_id = (int) $cids[0];
	$config_data = $config_model->getOneById($config_id);
	$config_count = $config_model->countConfig();
	$new_flag = 0;
	$copy_flag = 0;
	
	$task = JRequest::getVar('task');
	if ($task == 'copy')
		{		
		//Config has already been copied to all languages?
 		if ($this->_allLang($config_data->name))
			{
			$this->setRedirect(LAFC_COMPONENT_LINK."&controller=multiconfig&task=display&config_base_view=$config_base_view", JText::_('COM_FLEXICONTACT_CONFIG_NO_COPY'));
			return;
			}
		else
			{
			$copy_flag = 1;
			$new_flag = 1;
			}
		}
	
	$view = $this->getView('config_edit', 'html');
	$view->assignRef('config_data', $config_data);
	$view->assignRef('config_count', $config_count);
	$view->assignRef('copy_flag', $copy_flag);
	$view->assignRef('new_flag', $new_flag);
	$view->assignRef('config_id', $config_flag);
	$view->assignRef('config_base_view', $config_base_view);
	$view->display();
}

function apply()
{
	$config_base_view = JRequest::getInt('config_base_view', 0);
	$config_id = JRequest::getInt('config_id', 0);		// for a new config, this is the chosen "base config"
	$task = JRequest::getVar('task');					// 'save' or 'apply'

	$config_model = $this->getModel('config');			// for a new config, this is the chosen "base config"
	$config_model->getOneById($config_id);				// Get the current (or new) config
	$config_model->getPostData('config_edit');
	$config_count = $config_model->countConfig();
	
	if ($config_model->_data->new_flag)
		$config_model->_data->id = 0;					// Force a new record to be created
	$stored = $config_model->store('config_edit');		// The view specifies validation in the store function
	
	if ($stored)
		{
		$config_base_view = $config_model->_data->id;			// Get the new config id
		if ($task == 'apply')
			$this->setRedirect(LAFC_COMPONENT_LINK."&controller=multiconfig&task=edit&config_base_view=$config_base_view&cid[]=".$config_model->_data->id, JText::_('COM_FLEXICONTACT_SAVED'));
		else		
			$this->setRedirect(LAFC_COMPONENT_LINK."&controller=multiconfig&task=display&config_base_view=$config_base_view", JText::_('COM_FLEXICONTACT_SAVED'));
		}
	else
		{
		$view = $this->getView('config_edit', 'html');
		$view->assignRef('config_data', $config_model->_data);
		$view->assignRef('config_count', $config_count);
		$view->assignRef('copy_flag', $config_model->_data->copy_flag);
		$view->assignRef('new_flag', $config_model->_data->new_flag);
		$view->assignRef('config_base_view', $config_base_view);

		if ($config_model->_data->new_flag == 1)
			{
			$config_model->_data->id = $config_id;		// restore the user's "base config" selection
			$config_names = $config_model->getListNames();
			$view->assignRef('config_names', $config_names);
			$view->assignRef('new_flag', $config_model->_data->new_flag);
			$view->assignRef('config_base_view', $config_base_view);
			}
		$view->display();
		}
}   

function remove()							// Delete a list of entire configurations
{
	// Do not use config_base_view here since it results in a warning trying to display a config which has just been deleted!
	
	$config_model = $this->getModel('config');
	$config_model->delete_config();
	$this->setRedirect( LAFC_COMPONENT_LINK."&controller=multiconfig&task=display");
}

function publish()
{
	$config_base_view = JRequest::getInt('config_base_view', 0);
	$config_model = $this->getModel('config');
	$config_model->publish_config(1);
	$this->setRedirect( LAFC_COMPONENT_LINK."&controller=multiconfig&task=display&config_base_view=$config_base_view");
}

function unpublish()
{
	$config_base_view = JRequest::getInt('config_base_view', 0);
	$config_model = $this->getModel('config');
	$config_model->publish_config(0);
	$this->setRedirect( LAFC_COMPONENT_LINK."&controller=multiconfig&task=display&config_base_view=$config_base_view");
}

function cancel()
{
	$config_base_view = JRequest::getInt('config_base_view', 0);
	$view_name = JRequest::getVar('view');
	if ($view_name == 'config_edit')
		$this->setRedirect( LAFC_COMPONENT_LINK."&controller=multiconfig&task=display&config_base_view=$config_base_view");
	else
		$this->setRedirect( LAFC_COMPONENT_LINK."&controller=menu&task=display&config_base_view=$config_base_view");
}

// Checks whether all languages have been set up for a given configuration
// Returns true if all have been set up
// Else returns false
function _allLang($name)
{
	$langs = FCP_Admin::make_lang_list();
	$config_model = $this->getModel('config');
	
	foreach ($langs as $key => $value)
		{
		$ret = $config_model->_exists($name, $key);			// Config does not exist in this language
		if (!$ret)
			return false;
		}
	
	return true;
		
}

}
