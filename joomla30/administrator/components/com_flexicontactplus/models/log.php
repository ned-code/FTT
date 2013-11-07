<?php
/********************************************************************
Product		: Flexicontact Plus
Date		: 13 June 2013
Copyright	: Les Arbres Design 2010-2013
Contact		: http://extensions.lesarbresdesign.info
Licence		: GNU General Public License
*********************************************************************/
defined('_JEXEC') or die('Restricted access');

jimport('joomla.html.pagination');

class FlexicontactplusModelLog extends JModelLegacy
{
var $_data;
var $_app = null;
var $_pagination = null;

function __construct()
{
	parent::__construct();
	$this->_app = JFactory::getApplication();
}

function initData()					// initialise data for a new row
{
	$this->_data = new stdClass();
	$this->_data->id = 0;
	$this->_data->datetime = 'NOW()';
	$this->_data->name = '';
	$this->_data->email = '';
	$this->_data->admin_email = '';
	$this->_data->config_name = '';
	$this->_data->config_lang = '';
	$this->_data->subject = '';
	$this->_data->message = '';
	$this->_data->status_main = '';
	$this->_data->status_copy = '';
	$this->_data->ip = '';
	$this->_data->browser_id = 0;
	$this->_data->browser_string = '';
	$this->_data->imported = 0;
 	return $this->_data;
}

//-------------------------------------------------------------------------------
// get an existing row
// return false with an error if we couldn't find it
//
function getOne($id)
{
	$query = "SELECT * FROM `#__flexicontact_plus_log` WHERE `id` = '$id'";

	$this->_db->setQuery($query);
	$this->_data = $this->_db->loadObject();

	if ($this->_data)
		return $this->_data;
	else
		return false;
}

//---------------------------------------------------------------
//
function store($email_data)
{
	// from_email can potentially not be defined
	if (!isset($email_data->from_email))
		$email_data->from_email = '';
		
	// from_name can potentially not be defined
	if (!isset($email_data->from_name))
		$email_data->from_name = '';
		
	$query = 'INSERT INTO `#__flexicontact_plus_log` 
		(`datetime`, `name`, `email`, `admin_email`, `config_name`, `config_lang`,`subject`, `message`, `status_main`, `status_copy`, 
			`ip`, `browser_id`, `browser_string`, `imported`) 
		VALUES
			( NOW(), '.
			$this->_db->Quote($email_data->from_name).','.
			$this->_db->Quote($email_data->from_email).','.
			$this->_db->Quote($email_data->admin_email).','.
			$this->_db->Quote($email_data->config_name).','.
			$this->_db->Quote($email_data->config_lang).','.
			$this->_db->Quote($email_data->subject).','.
			$this->_db->Quote($email_data->other_data).','.
			$this->_db->Quote($email_data->status_main).','.
			$this->_db->Quote($email_data->status_copy).','.
			$this->_db->Quote($email_data->ip).','.
			$this->_db->Quote($email_data->browser_id).','.
			$this->_db->Quote($email_data->browser_string).','.
			'0)';				// set imported to 0

	$this->_db->setQuery($query);
	$this->_db->query();	
	return true;
}

//-------------------------------------------------------------------------------
// Return a pointer to our pagination object
// This should normally be called after getList()
//
function &getPagination()
{
	if ($this->_pagination == Null)
		$this->_pagination = new JPagination(0,0,0);
	return $this->_pagination;
}

//-------------------------------------------------------------------------------
// Get the list of logs for the log list screen
//
function &getList()
{
// get the filter states, order states, and pagination variables

	$filter_date = $this->_app->getUserStateFromRequest(LAFC_COMPONENT.'.filter_date','filter_date',LAFC_LOG_LAST_28_DAYS,'int');
	$filter_config = $this->_app->getUserStateFromRequest(LAFC_COMPONENT.'.filter_config','filter_config','all','string');
	$limit = $this->_app->getUserStateFromRequest('global.list.limit', 'limit', $this->_app->getCfg('list_limit'), 'int');
	$limitstart = $this->_app->getUserStateFromRequest(LAFC_COMPONENT.'.limitstart', 'limitstart', 0, 'int');
	$limitstart = ($limit != 0 ? (floor($limitstart / $limit) * $limit) : 0); // In case limit has been changed
	$filter_order = $this->_app->getUserStateFromRequest(LAFC_COMPONENT.'.filter_order', 'filter_order', 'datetime');
	$filter_order_Dir = $this->_app->getUserStateFromRequest(LAFC_COMPONENT.'.filter_order_Dir', 'filter_order_Dir', 'desc');
	$search = $this->_app->getUserStateFromRequest(LAFC_COMPONENT.'.search','search','','string');
	$search = JString::strtolower($search);

// build the query

	$query_count = "Select count(*) ";
	$query_cols  = "Select id, datetime, name, email, admin_email, subject, SUBSTRING(message,1,60) AS short_message, status_main, status_copy  ";
	$query_from  = "From #__flexicontact_plus_log ";

// where

	$query_where = "Where 1 ";
	if ($search != '')
		{
		if (LAFC_JVERSION < 170)
			$search = $this->_db->Quote('%'.$this->_db->getEscaped($search,true).'%',false);	// Joomla 1.5 and 1.6
		else
			$search = $this->_db->Quote('%'.$this->_db->escape($search,true).'%',false);		// Joomla 1.7 and aboves
		$query_where .= " and lower(name) Like $search
							or lower(email) Like $search
							or lower(subject) Like $search
							or lower(message) Like $search ";
		}
	else
		// Only use filters if NOT searching by name
		{
		if ($filter_config !== 'all')
			$query_where .= " And config_name = '$filter_config' ";
		}


	switch ($filter_date)
		{
		case LAFC_LOG_ALL:
			break;
		case LAFC_LOG_LAST_7_DAYS:
			$query_where .= "and datetime >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)";
			break;
		case LAFC_LOG_LAST_28_DAYS:
			$query_where .= "and datetime >= DATE_SUB(CURRENT_DATE(), INTERVAL 28 DAY)";
			break;
		case LAFC_LOG_LAST_12_MONTHS:
			$query_where .= "and datetime >= DATE_SUB(CURRENT_DATE(), INTERVAL 12 MONTH)";
		}	

// order by

	switch ($filter_order)							// validate column name
		{
		case 'name':
		case 'email':
		case 'subject':
			break;
		default:
			$filter_order = 'datetime';
		}

	if (strcasecmp($filter_order_Dir,'ASC') != 0)	// validate 'asc' or 'desc'
		$filter_order_Dir = 'DESC';

	$query_order = " Order by ".$filter_order.' '.$filter_order_Dir;

// get the total row count

	$count_query = $query_count.$query_from.$query_where;
	$this->_db->setQuery($count_query);
	$total = $this->_db->loadResult();
	
	if ($this->_db->getErrorNum())
		{
		$this->_app->enqueueMessage($this->_db->stderr(), 'error');
		$this->_data = false;
		return $this->_data;
		}

// setup the pagination object

	$this->_pagination = new JPagination($total, $limitstart, $limit);

//now get the data, within the limits required

	$main_query = $query_cols.$query_from.$query_where.$query_order;
	$this->_data = $this->_getList($main_query, $limitstart, $limit);

	if ($this->_db->getErrorNum())
		{
		$this->_app->enqueueMessage($this->_db->stderr(), 'error');
		$this->_data = false;
		return $this->_data;
		}

	return $this->_data;
}

//-------------------------------------------------------------------------------
// delete one log entries
//
function delete($id)
{
	$query = "delete from #__flexicontact_plus_log where id = $id";
	$this->_db->setQuery($query);
	$this->_db->query();
}

//-------------------------------------------------------------------------------
// Return the number of rows in flexicontact_plus_log
//
function count_rows()
{
	$this->_db->setQuery("SELECT COUNT(*) FROM `#__flexicontact_plus_log`");
	return $this->_db->loadResult();
}

//-------------------------------------------------------------------------------
// Return the list of configurations in the flexicontact_plus_log
//
function getConfigArray()
{
	$this->_db->setQuery("SELECT DISTINCT(config_name) FROM `#__flexicontact_plus_log` WHERE `config_name` != '' order by `config_name`");
	$rows = $this->_db->loadObjectList();
	if ($this->_db->getErrorNum())
		{
		$this->_app->enqueueMessage($this->_db->stderr(), 'error');
		return false;
		}

	if (LAFC_JVERSION == 150)
		$configs['all'] = ucfirst(JText::_('ALL'));
	else
		$configs['all'] = ucfirst(JText::_('JALL'));

	foreach ($rows as $row)
		$configs[$row->config_name] = ucfirst($row->config_name);

	return $configs;
	
}

//--------------------------------------------------------------------	
// Get the information for the Sales Graph
//
function &getLogChart(&$title)
{
// get the filter states

	$filter_date = $this->_app->getUserStateFromRequest(LAFC_COMPONENT.'.filter_date','filter_date',LAFC_LOG_ALL,'int');
	if (!in_array($filter_date,array(LAFC_LOG_ALL, LAFC_LOG_LAST_12_MONTHS)))
		$filter_date = LAFC_LOG_ALL;

	switch ($filter_date)
		{
		case LAFC_LOG_ALL:
			$query_where = " ";
			$title = JText::_('COM_FLEXICONTACT_LOG_ALL');
			break;
		case LAFC_LOG_LAST_12_MONTHS:
			$query_where = "WHERE datetime >= DATE_SUB(CURRENT_DATE(), INTERVAL 12 MONTH)";
			$title = JText::_('COM_FLEXICONTACT_LOG_LAST_12_MONTHS');
			break;
		}

// Set up the overall chart information

	require_once JPATH_COMPONENT.'/helpers/plotalot.php';
	$chart_info = new stdclass();
	$chart_info->chart_type = CHART_TYPE_AREA;
	$chart_info->x_size = 1000;
	$chart_info->y_size = 350;
	$chart_info->num_plots = 1;
	$chart_info->legend_type = LEGEND_NONE;
	$chart_info->extra_parms = ",chartArea:{left:'10%',top:20,width:'90%',height:'75%'}";
	$chart_info->x_format = FORMAT_DATE_MONY;
	$chart_info->x_labels = 12;
	$chart_info->y_title = JText::_('COM_FLEXICONTACT_ENQS_PER_DAY');
	$chart_info->plot_array = array();
	$chart_info->plot_array[0]['enable'] = 1;
	$chart_info->plot_array[0]['colour'] = '146295';
	$chart_info->plot_array[0]['style'] = LINE_THICK_SOLID;
	$chart_info->plot_array[0]['legend'] = $chart_info->y_title;

	$query = "SELECT UNIX_TIMESTAMP(DATE_FORMAT(`datetime`,'%Y-%m-01')) AS unixtime, 
		ROUND(COUNT(`id`)
		/ (IF (MONTH(`datetime`) = MONTH(CURRENT_DATE()) AND YEAR(`datetime`) = YEAR(CURRENT_DATE()), 
			DAY(CURRENT_DATE()), DAY(LAST_DAY(`datetime`)))),1) AS avg_per_day
		FROM `#__flexicontact_plus_log`
		$query_where
		GROUP BY year(`datetime`), month(`datetime`) order by year(`datetime`), month(`datetime`)";

	$chart_info->plot_array[0]['query'] = $query;

	$plotalot = new Plotalot;
	$chart = $plotalot->drawChart($chart_info);

// if there was no useful data to chart, better to give a message

	if ($plotalot->datasets[0]['num_rows'] == 0)
		return $plotalot->error;

// a single data point doesn't look good

	if ($plotalot->datasets[0]['num_rows'] == 1)
		{
		$chart = '<h2>'.strftime("%B %Y",$plotalot->datasets[0]['data'][0][0]).'<br />'.$chart_info->y_title.' = '.$plotalot->datasets[0]['data'][0][1].'</h2>';	
		return $chart;
		}

	return $chart;
}

//-------------------------------------------------------------------------------
// Export the Log File as per the current filters
//
function export_csv()
{
	FCP_trace::trace('export_csv()');
	// get the filter states and order states

	$filter_date = $this->_app->getUserStateFromRequest(LAFC_COMPONENT.'.filter_date','filter_date',LAFC_LOG_LAST_28_DAYS,'int');
	$filter_config = $this->_app->getUserStateFromRequest(LAFC_COMPONENT.'.filter_config','filter_config','all','string');
	$filter_order = $this->_app->getUserStateFromRequest(LAFC_COMPONENT.'.filter_order', 'filter_order', 'datetime');
	$filter_order_Dir = $this->_app->getUserStateFromRequest(LAFC_COMPONENT.'.filter_order_Dir', 'filter_order_Dir', 'desc');
	$search = $this->_app->getUserStateFromRequest(LAFC_COMPONENT.'.search','search','','string');
	$search = JString::strtolower($search);

	// build the query

	$query_count = "Select count(*) ";
	$query_cols  = "Select *  ";
	$query_from  = "From #__flexicontact_plus_log ";

	// where

	$query_where = "Where 1 ";
	if ($search != '')
		{
		if (LAFC_JVERSION < 170)
			$search = $this->_db->Quote('%'.$this->_db->getEscaped($search,true).'%',false);	// Joomla 1.5 and 1.6
		else
			$search = $this->_db->Quote('%'.$this->_db->escape($search,true).'%',false);		// Joomla 1.7 and aboves
		$query_where .= " and lower(name) Like $search
							or lower(email) Like $search
							or lower(subject) Like $search
							or lower(message) Like $search ";
		}
	else
		// Only use filters if NOT searching by name
		{
		if ($filter_config !== 'all')
			$query_where .= " And config_name = '$filter_config' ";
		}

	switch ($filter_date)
		{
		case LAFC_LOG_ALL:
			break;
		case LAFC_LOG_LAST_7_DAYS:
			$query_where .= "and datetime >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)";
			break;
		case LAFC_LOG_LAST_28_DAYS:
			$query_where .= "and datetime >= DATE_SUB(CURRENT_DATE(), INTERVAL 28 DAY)";
			break;
		case LAFC_LOG_LAST_12_MONTHS:
			$query_where .= "and datetime >= DATE_SUB(CURRENT_DATE(), INTERVAL 12 MONTH)";
		}	

	// order by

	switch ($filter_order)							// validate column name
		{
		case 'name':
		case 'email':
		case 'subject':
			break;
		default:
			$filter_order = 'datetime';
		}

	if (strcasecmp($filter_order_Dir,'ASC') != 0)	// validate 'asc' or 'desc'
		$filter_order_Dir = 'DESC';

	$query_order = " Order by ".$filter_order.' '.$filter_order_Dir;

	//now get the data, within the limits required

	$main_query = $query_cols.$query_from.$query_where.$query_order;
	$this->_db->setQuery($main_query);
	$log_list = $this->_db->loadObjectList();
	if ($this->_db->getErrorNum())
		{
		$this->_app->enqueueMessage($this->_db->stderr(), 'error');
		return false;
		}
		
	$count = count($log_list);
	$delim = "\t";
	
	// Headings
	
	$output = JText::_('COM_FLEXICONTACT_DATE_TIME').$delim;
	$output .= JText::_('COM_FLEXICONTACT_NAME').$delim;
	$output .= JText::_('COM_FLEXICONTACT_EMAIL').$delim;
	$output .= JText::_('COM_FLEXICONTACT_V_EMAIL_TO').$delim;
	$output .= JText::_('COM_FLEXICONTACT_CONFIG_NAME').$delim;
	$output .= JText::_('COM_FLEXICONTACT_LANGUAGE').$delim;
	$output .= JText::_('COM_FLEXICONTACT_SUBJECT').$delim;
	$output .= JText::_('COM_FLEXICONTACT_MESSAGE').$delim;
	$output .= JText::_('COM_FLEXICONTACT_STATUS').$delim;
	$output .= JText::_('COM_FLEXICONTACT_STATUS_COPY').$delim;
	$output .= JText::_('COM_FLEXICONTACT_IP_ADDRESS').$delim;
	$output .= JText::_('COM_FLEXICONTACT_BROWSER').$delim;
	$output .= JText::_('COM_FLEXICONTACT_BROWSER_ID')."\n";
	
	// Data
	
	for ($i=0; $i < $count; $i++)
		{
		$row = $log_list[$i];
		$output .= '"'.$row->datetime.'"'.$delim;
		$output .= '"'.$row->name.'"'.$delim;
		$output .= '"'.$row->email.'"'.$delim;
		$output .= '"'.$row->admin_email.'"'.$delim;
		$output .= '"'.$row->config_name.'"'.$delim;
		$output .= '"'.$row->config_lang.'"'.$delim;
		$output .= '"'.$row->subject.'"'.$delim;
		$output .= '"'.$row->message.'"'.$delim;
		$output .= '"'.$row->status_main.'"'.$delim;
		$output .= '"'.$row->status_copy.'"'.$delim;
		$output .= '"'.$row->ip.'"'.$delim;
		$output .= '"'.$row->browser_string.'"'.$delim;
		$output .= '"'.$row->browser_id.'"'."\r\n";
		}
		
	// All ready so now save it to the client

	$output_length = strlen($output);
	while (@ob_end_clean());			// clean all output buffers - on some servers it is very important to clean all of them!
	Header("Content-Description: File Transfer");
	Header("Content-Transfer-Encoding: binary\n");
	Header("Content-Type: text/plain; charset=utf-8");
	Header("Content-Disposition: attachment; filename=log.txt");
	header("Content-Length: ".strlen($output));
	header("Content-Range: bytes 0-" .$output_length.'/'.$output_length);
	Header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
	Header("Pragma: no-cache");
	Header("Expires: 0");
	@flush();
	echo $output;
	flush();
	exit;
	

}

}
		
		