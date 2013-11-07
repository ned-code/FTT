<?php
/********************************************************************
Product		: Flexicontact Plus
Date		: 28 February 2013
Copyright	: Les Arbres Design 2010-2013
Contact		: http://extensions.lesarbresdesign.info
Licence		: GNU General Public License
*********************************************************************/
defined('_JEXEC') or die('Restricted Access');

class FlexicontactplusControllerLog extends JControllerLegacy
{
function __construct()
{
	parent::__construct();
}

function display($cachable = false, $urlparams = false)
{
	FCP_Admin::addSubMenu('log');
	$config_base_view = JRequest::getInt('config_base_view', 0);
	$config_id = JRequest::getInt('config_id', 0);
	$log_model = $this->getModel('log');
	$log_list = $log_model->getList();
	$config_list = $log_model->getConfigArray();
	$pagination = $log_model->getPagination();
	$import_model = $this->getModel('import');
	$free_log_info = $import_model->free_log_info();

	$view = $this->getView('log_list', 'html');
	$view->assignRef('log_list', $log_list);
	$view->assignRef('pagination',	$pagination);
	$view->assignRef('config_id', $config_id);
	$view->assignRef('config_base_view', $config_base_view);
	$view->assignRef('free_log_info', $free_log_info);
	$view->assignRef('config_list', $config_list);
	$view->display();
}

function log_detail()
{
	FCP_Admin::addSubMenu('log');
	$config_base_view = JRequest::getInt('config_base_view', 0);
	$config_id = JRequest::getInt('config_id', 0);
	$log_id = JRequest::getVar('log_id');
	$log_model = $this->getModel('log');
	$log_data = $log_model->getOne($log_id);

	$view = $this->getView('log_detail', 'html');
	$view->assignRef('log_data', $log_data);
	$view->assignRef('config_id', $config_id);
	$view->assignRef('config_base_view', $config_base_view);
	$view->display();
}

function delete_log()
{
	$log_model = $this->getModel('log');
	$config_base_view = JRequest::getInt('config_base_view', 0);
	$config_id = JRequest::getInt('config_id', 0);
	$cids = JRequest::getVar('cid', array(0), 'post', 'array');
	foreach ($cids as $log_id)
		$log_model->delete($log_id);
	$this->setRedirect(LAFC_COMPONENT_LINK."&controller=log&task=display&config_id=".$config_id."&config_base_view=".$config_base_view);
}

function stats()
{
	FCP_Admin::addSubMenu('log');
	$config_base_view = JRequest::getInt('config_base_view', 0);
	$config_id = JRequest::getInt('config_id', 0);
	$log_model = $this->getModel('log');
	$title = '';
	$chart_data = $log_model->getLogChart($title);
	$num_rows = $log_model->count_rows();
	$view = $this->getView('log_chart', 'html');
	$view->assignRef('config_id', $config_id);
	$view->assignRef('config_base_view', $config_base_view);
	$view->assignRef('title', $title);
	$view->assignRef('data', $chart_data);
	$view->assignRef('num_rows', $num_rows);
	$view->display();
}

function import()
{
	FCP_Admin::addSubMenu('log');
	$config_base_view = JRequest::getInt('config_base_view', 0);
	$config_id = JRequest::getInt('config_id', 0);
	$import_model = $this->getModel('import');
	$free_log_info = $import_model->free_log_info();
	$count_imported_rows = $import_model->count_imported_rows();

	$view = $this->getView('log_import', 'html');
	$view->assignRef('config_id', $config_id);
	$view->assignRef('config_base_view', $config_base_view);
	$view->assignRef('free_log_info', $free_log_info);
	$view->assignRef('count_imported_rows', $count_imported_rows);
	$view->display();
}

function import_confirmed()
{
	$import_model = $this->getModel('import');
	$return_message = '';
	$ret = $import_model->import($return_message);
	$app = JFactory::getApplication();
	if ($ret)
		$app->enqueueMessage($return_message, 'message');
	else
		$app->enqueueMessage($return_message, 'error');
	$this->display();
}

function download()
{
	$config_base_view = JRequest::getInt('config_base_view', 0);
	$config_id = JRequest::getInt('config_id', 0);
	$log_model = $this->getModel('log');
	$ret = $log_model->export_csv();
	return;				// we cannot send a page now because we just sent a file

}

} // end of Class
