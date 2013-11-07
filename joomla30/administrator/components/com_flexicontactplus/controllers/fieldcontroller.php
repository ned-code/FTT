<?php
/********************************************************************
Product		: Flexicontact Plus
Date		: 23 February 2013
Copyright	: Les Arbres Design 2010-2013
Contact		: http://extensions.lesarbresdesign.info
Licence		: GNU General Public License
*********************************************************************/
defined('_JEXEC') or die('Restricted Access');

class FlexicontactplusControllerField extends JControllerLegacy
{
function __construct()
{
	parent::__construct();
	$this->registerTask('save', 'apply');
}

function display($cachable = false, $urlparams = false)
{
	FCP_Admin::addSubMenu('config');

	$config_base_view = JRequest::getInt('config_base_view', 0);
	$config_id = JRequest::getInt('config_id', 0);
	$config_model = $this->getModel('config');
	$config_names = $config_model->getListNames();				// Multiple configurations?
	$config_data = $config_model->getOneById($config_id);		// gets the default config if $config_id = 0
	$config_count = $config_model->countConfig();
	
	$view = $this->getView('config_field_list', 'html');
	$view->assignRef('config_id', $config_id);
	$view->assignRef('config_data', $config_data);
	$view->assignRef('param1', $param1);
	$view->assignRef('config_names', $config_names);
	$view->assignRef('config_count', $config_count);
	$view->assignRef('config_base_view', $config_base_view);
	$view->display();
}

function add()
{
	$config_id = JRequest::getInt('config_id', 0);
	$config_base_view = JRequest::getInt('config_base_view', 0);
	$config_model = $this->getModel('config');
	$config_data = $config_model->getOneById($config_id);
	$config_count = $config_model->countConfig();
	$new_flag = 1;
	$field_index = -1;
	
	$view = $this->getView('config_field', 'html');
	$view->assignRef('config_data', $config_data);
	$field = $config_model->initField();
	$view->assignRef('field', $field);
	$view->assignRef('field_index', $field_index);
	$view->assignRef('new_flag', $new_flag);
	$view->assignRef('config_count', $config_count);
	$view->assignRef('config_base_view', $config_base_view);
	$view->display();
}

function edit()
{
	$config_id = JRequest::getInt('config_id', 0);
	$config_base_view = JRequest::getInt('config_base_view', 0);
	$config_model = $this->getModel('config');
	$config_data = $config_model->getOneById($config_id);
	$config_count = $config_model->countConfig();
	$new_flag = 0;
	
	$view = $this->getView('config_field', 'html');
	$view->assignRef('config_data', $config_data);
	$cids = JRequest::getVar('cid', array(0), '', 'array');
	$field_index = (int) $cids[0];
	$view->assignRef('field', $config_data->config_data->all_fields[$field_index]);
	$view->assignRef('field_index', $field_index);
	$view->assignRef('new_flag', $new_flag);
	$view->assignRef('config_count', $config_count);
	$view->assignRef('config_base_view', $config_base_view);
	$view->display();
}

function apply()													// save or apply a new or edited field
{
	$config_base_view = JRequest::getInt('config_base_view', 0);
	$config_id = JRequest::getInt('config_id', 0);
	$config_model = $this->getModel('config');
	$config_model->getOneById($config_id);
	$config_count = $config_model->countConfig();
	$config_model->getPostData('config_field');							// get the field data from the post data
	if ($config_model->store('config_field'))							// store() also does validation
		{
		$task = JRequest::getVar('task');								// 'save_field' or 'apply_field'
		if ($task == 'apply')
			$this->setRedirect(LAFC_COMPONENT_LINK."&controller=field&task=edit&config_base_view=$config_base_view&config_id=$config_id&cid[]=".$config_model->_data->field_index);
		else
			$this->setRedirect(LAFC_COMPONENT_LINK."&controller=field&task=display&config_id=$config_id&config_base_view=$config_base_view");
		}
	else
		{
		$view = $this->getView('config_field', 'html');
		$view->assignRef('config_data', $config_model->_data);
		$view->assignRef('config_count', $config_count);
		$view->assignRef('new_flag', $config_model->_data->new_flag);
		$view->assignRef('field', $config_model->_data->config_data->all_fields[$config_model->_data->field_index]);
		$view->assignRef('field_index', $config_model->_data->field_index);
		$view->assignRef('config_base_view', $config_base_view);
		$view->display();
		}
}

function remove()
{
	$config_base_view = JRequest::getInt('config_base_view', 0);
	$config_id = JRequest::getInt('config_id', 0);
	$cids = JRequest::getVar('cid', array(0), 'post', 'array');
	$config_model = $this->getModel('config');
	$config_model->delete_fields($config_id, $cids);
	$this->setRedirect(LAFC_COMPONENT_LINK."&controller=field&task=display&config_id=$config_id&config_base_view=$config_base_view");
}

function orderup()
{
	$config_base_view = JRequest::getInt('config_base_view', 0);
	$config_id    = JRequest::getInt('config_id', 0);
	$cids         = JRequest::getVar('cid', array(0), 'post', 'array');
	$field_index  = (int) $cids[0];
	$config_model = $this->getModel('config');
	$config_model->move_field($config_id, $field_index, -1);
	$this->setRedirect(LAFC_COMPONENT_LINK."&controller=field&task=display&config_id=$config_id&config_base_view=$config_base_view");
}

function orderdown()
{
	$config_base_view = JRequest::getInt('config_base_view', 0);
	$config_id    = JRequest::getInt('config_id', 0);
	$cids         = JRequest::getVar('cid', array(0), 'post', 'array');
	$field_index  = (int) $cids[0];
	$config_model = $this->getModel('config');
	$config_model->move_field($config_id, $field_index, 1);
	$this->setRedirect(LAFC_COMPONENT_LINK."&controller=field&task=display&config_id=$config_id&config_base_view=$config_base_view");
}

function saveorder()
{
	$config_base_view = JRequest::getInt('config_base_view', 0);
	$config_id    = JRequest::getInt('config_id', 0);
	$order 	      = JRequest::getVar( 'order', array(), 'post', 'array' );
	JArrayHelper::toInteger($order);
	$config_model = $this->getModel('config');
	$config_model->save_field_order($config_id, $order);
	$this->setRedirect(LAFC_COMPONENT_LINK."&controller=field&task=display&config_id=$config_id&config_base_view=$config_base_view");
}

function add_default_fields()
{
	$config_base_view = JRequest::getInt('config_base_view', 0);
	$config_id    = JRequest::getInt('config_id', 0);
	$config_model = $this->getModel('config');
	$config_model->add_default_fields($config_id);
	$this->setRedirect(LAFC_COMPONENT_LINK."&controller=field&task=display&config_id=$config_id&config_base_view=$config_base_view");
}

function cancel()
{
	$config_base_view = JRequest::getInt('config_base_view', 0);
	$config_id = JRequest::getVar('config_id', 0);
	$view_name = JRequest::getVar('view');
	if ($view_name == 'config_field')
		$this->setRedirect(LAFC_COMPONENT_LINK."&controller=field&task=display&config_id=$config_id&config_base_view=$config_base_view");
	else
		$this->setRedirect( LAFC_COMPONENT_LINK."&controller=menu&task=display&config_id=$config_id&config_base_view=$config_base_view");
}


}
