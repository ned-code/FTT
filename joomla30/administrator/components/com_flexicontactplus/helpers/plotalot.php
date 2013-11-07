<?php
/********************************************************************
Product    : Plotalot
Date       : 16 September 2013
Copyright  : Les Arbres Design 2010-2013
Contact    : http://extensions.lesarbresdesign.info
Licence    : GNU General Public License
*********************************************************************/
defined('_JEXEC') or die('Restricted Access');

if (!defined('PLOTALOT_VERSION'))
	{
	define("PLOTALOT_VERSION","F3.05");
	define("PLOTALOT_COMPONENT", "com_plotalot");

	define("CHART_MAX_PLOTS", 20);
	define("PLOTALOT_TRACE_FILE", JPATH_ROOT.'/components/com_plotalot/trace.txt');
	define("COL_X", 0);
	define("COL_Y", 1);

	define("CHART_TYPE_ANY", 0);
	define("CHART_TYPE_PL_TABLE", 1);		// Table generated internally by Plotalot
	define("CHART_TYPE_SINGLE_ITEM",10);
	define("CHART_TYPE_GV_TABLE", 20);		// Google Visualization table
	define("CHART_TYPE_LINE", 100);
	define("CHART_TYPE_AREA", 110);
	define("CHART_TYPE_SCATTER", 200);
	define("CHART_TYPE_BAR_H_STACK", 300);
	define("CHART_TYPE_BAR_H_GROUP", 310);
	define("CHART_TYPE_BAR_V_STACK", 320);
	define("CHART_TYPE_BAR_V_GROUP", 330);
	define("CHART_TYPE_PIE_2D", 400);
	define("CHART_TYPE_PIE_3D", 410);
	define("CHART_TYPE_PIE_2D_V", 420);
	define("CHART_TYPE_PIE_3D_V", 430);
	define("CHART_TYPE_GAUGE", 500);

	define("CHART_CATEGORY_TABLE", 1);
	define("CHART_CATEGORY_BAR", 2);
	define("CHART_CATEGORY_PIE", 3);

	define("FORMAT_NONE",0);
	define("FORMAT_NUM_UK_0", 10);
	define("FORMAT_NUM_UK_1", 20);
	define("FORMAT_NUM_UK_2", 30);
	define("FORMAT_NUM_FR_0", 40);
	define("FORMAT_NUM_FR_1", 50);
	define("FORMAT_NUM_FR_2", 60);
	define("FORMAT_DATE_DMY",100);
	define("FORMAT_DATE_MDY",120);
	define("FORMAT_DATE_DMONY",125);
	define("FORMAT_DATE_DM",130);
	define("FORMAT_DATE_MD",140);
	define("FORMAT_DATE_MY",144);
	define("FORMAT_DATE_MONY",145);
	define("FORMAT_DATE_Y",150);
	define("FORMAT_DATE_M",160);
	define("FORMAT_DATE_MON",161);
	define("FORMAT_DATE_MONTH",162);
	define("FORMAT_DATE_D",170);
	define("FORMAT_DATE_DAY",180);
	define("FORMAT_TIME_HHMM",190);
	define("FORMAT_TIME_HHMMSS",195);
	define("FORMAT_TIME_HH",200);
	define("FORMAT_TIME_MM",210);
	define("FORMAT_PERCENT_0", 300);
	define("FORMAT_PERCENT_1", 310);
	define("FORMAT_PERCENT_2", 320);
	// define("FORMAT_ORDERED",900);		// removed for 3.0

	define("PLOT_STYLE_NORMAL", 0);
	// define("LINE_NORMAL", 0);			// removed for 3.0
	// define("LINE_DASH", 10);				// removed for 3.0
	define("LINE_THIN_SOLID", 20);
	// define("LINE_THIN_DASH", 30);		// removed for 3.0
	define("LINE_THICK_SOLID", 40);
	// define("LINE_THICK_DASH", 50);		// removed for 3.0
	define("PIE_LIGHT_GRADIENT", 60);
	define("PIE_DARK_GRADIENT", 70);
	define("PIE_MULTI_COLOUR", 80);

	define("LEGEND_NONE", 0);
	define("LEGEND_LEFT", 10);
	define("LEGEND_RIGHT", 20);
	define("LEGEND_TOP", 30);
	define("LEGEND_BOTTOM", 40);

	define("PIE_TEXT_NONE",    0);
	define("PIE_TEXT_PERCENT", 1);
	define("PIE_TEXT_VALUE",   2);
	define("PIE_TEXT_LABEL",   3);
	}

if (class_exists("Plotalot"))
	return;

class Plotalot
{
var $error = '';				// error message to be returned
var $warning = '';				// warning to be returned
var $chart_script = '';			// the chart script to be returned
var $chart_data = null;			// the chart data definition structure
var $datasets = array();		// the dataset arrays
var $total_rows = 0;			// total number of rows from all queries
var $active_plots = 0;			// number of plots that have rows
var $chart_title = '';			// the resolved chart title
var $x_title = '';				// the resolved X axis title
var $y_title = '';				// the resolved Y axis title
var $chart_x_min;				// overall minimum X value for all datasets
var $chart_x_max;				// overall maximum X value for all datasets
var $chart_y_min;				// overall minimum Y value for all datasets
var $chart_y_max;				// overall maximum Y value for all datasets

//-------------------------------------------------------------------------------
// Constructor
//
function Plotalot()
{
	$version = new JVersion();
	$this->joomla_version = $version->RELEASE;
	$this->joomla_level = $version->DEV_LEVEL;
	$this->joomla_app = JFactory::getApplication();
	$this->joomla_dbname = $this->joomla_app->getCfg('db');
	$this->joomla_dbprefix = $this->joomla_app->getCfg('dbprefix');
	$this->joomla_dbhost = $this->joomla_app->getCfg('host');
	$this->joomla_dbuser = $this->joomla_app->getCfg('user');
	$this->joomla_dbpassword = $this->joomla_app->getCfg('password');
	$this->plotalot_version = PLOTALOT_VERSION;
}

//-------------------------------------------------------------------------------
// log data to the trace file
function _trace($data)
{
	if ($this->trace != 0)
		@file_put_contents(PLOTALOT_TRACE_FILE, "$data \n",FILE_APPEND);
}

//-------------------------------------------------------------------------------
// set an error and log it
function _error($data)
{
	$this->error = $data;
	if ($this->trace != 0)
		@file_put_contents(PLOTALOT_TRACE_FILE, "ERROR: $data \n",FILE_APPEND);
}

//-------------------------------------------------------------------------------
//set a warning and log it
function _warning($data)
{
	if ($this->warning != '')
		$this->warning .= '; ';
	$this->warning .= $data;
	if ($this->trace != 0)
		@file_put_contents(PLOTALOT_TRACE_FILE, "WARNING: $data \n",FILE_APPEND);
}

//-------------------------------------------------------------------------------
// Draw a table or a single item
// returns the table or item, or an error message
//
function _drawTable()
{
// table data always uses plot zero
			
	$num_rows = $this->datasets[0]['num_rows'];
	$num_columns = $this->datasets[0]['num_columns'];
	
// for a single item, just return the first column of the first row

	if ($this->chart_data->chart_type == CHART_TYPE_SINGLE_ITEM)
		{
		$this->chart_script = $this->datasets[0]['data'][0][0];		// the plugin takes it from chart_script
		if ($this->trace != 0)
			$this->_trace("Returning Item: ".$this->chart_script);
		return $this->chart_script;
		}

// make the classes

	if (!empty($this->chart_data->style_array['pl_table']))
		$table_style = ' class="'.$this->chart_data->style_array['pl_table'].'"';
	else
		$table_style = '';

	if (!empty($this->chart_data->style_array['pl_title']))
		$title_style = ' class="'.$this->chart_data->style_array['pl_title'].'"';
	else
		$title_style = '';

	if (!empty($this->chart_data->style_array['pl_head']))
		$heading_style = ' class="'.$this->chart_data->style_array['pl_head'].'"';
	else
		$heading_style = '';

	if (!empty($this->chart_data->style_array['pl_odd']))
		$odd_style = ' class="'.$this->chart_data->style_array['pl_odd'].'"';
	else
		$odd_style = '';

	if (!empty($this->chart_data->style_array['pl_even']))
		$even_style = ' class="'.$this->chart_data->style_array['pl_even'].'"';
	else
		$even_style = '';

// table style is from the chart record

    $this->chart_script = "\n<table ".$this->chart_data->chart_css_style.' '.$table_style.'>';

// if title is non-blank, draw a heading row    

	$this->chart_title = $this->_resolveQuery($this->chart_data->chart_title);

    if ($this->chart_title != '')
    	{
    	$this->chart_script .= "\n<tr".$title_style.'><th colspan="'.$num_columns.'">'.$this->chart_title.'</th></tr>';
    	}

// if legend is set, show column headings

	if ($this->chart_data->legend_type > LEGEND_NONE)
		{
		$this->chart_script .= "\n<tr".$heading_style.'>';
		for ($i=0; $i < $num_columns; $i++)
			$this->chart_script .= '<th>'.$this->datasets[0]['column_names'][$i].'</th>';
		$this->chart_script .= "\n</tr>";
		}
		
// draw all the rows

	$odd = true;
    for ($r=0; $r < $num_rows; $r++)
    	{
    	if ($odd)
    		$style = $odd_style;
    	else
    		$style = $even_style;
	    $this->chart_script .=   "\n<tr$style>";
	    $row = $this->datasets[0]['data'][$r];
		for ($c=0; $c < $num_columns; $c++)
			{
			$value = $row[$c];
			$this->chart_script .= '<td>'.$value.'</td>';
			}
	    $this->chart_script .= "</tr>";
	    $odd = !$odd;			// next row is opposite
	    }
    $this->chart_script .= "\n</table>\n";
	$length = strlen($this->chart_script);
	$this->_trace("Table length: ".$length);
	$this->_trace("Table: ".$this->chart_script);
	if ($this->trace != 0)
		$this->_trace("Returning Table: ".$this->chart_script);
    return $this->chart_script;
}

//-------------------------------------------------------------------------------
// Format a value into a string format
//
function _formatValue($value,$format)
{
	switch ($format)
		{
		case FORMAT_NONE       : return $value;
		case FORMAT_NUM_UK_0   : return number_format($value);
		case FORMAT_NUM_UK_1   : return number_format($value,1);
		case FORMAT_NUM_UK_2   : return number_format($value,2);
		case FORMAT_NUM_FR_0   : return number_format($value,0,',',' ');
		case FORMAT_NUM_FR_1   : return number_format($value,1,',',' ');
		case FORMAT_NUM_FR_2   : return number_format($value,2,',',' ');
		case FORMAT_DATE_DMY   : return strftime("%d/%m/%y",$value);
		case FORMAT_DATE_MDY   : return strftime("%m/%d/%y",$value);
		case FORMAT_DATE_DMONY : return strftime("%d/%b/%y",$value);
		case FORMAT_DATE_DM    : return strftime("%d/%m",$value);
		case FORMAT_DATE_MD    : return strftime("%m/%d",$value);
		case FORMAT_DATE_MY    : return strftime("%m/%y",$value);
		case FORMAT_DATE_MONY  : return strftime("%b/%y",$value);
		case FORMAT_DATE_Y     : return strftime("%y",$value);
		case FORMAT_DATE_M     : return strftime("%m",$value);
		case FORMAT_DATE_MON   : return strftime("%b",$value);
		case FORMAT_DATE_MONTH : return strftime("%B",$value);
		case FORMAT_DATE_D     : return strftime("%d",$value);
		case FORMAT_DATE_DAY   : return strftime("%a",$value);
		case FORMAT_TIME_HHMM  : return strftime("%H:%M",$value);
		case FORMAT_TIME_HHMMSS: return strftime("%H:%M:%S",$value);
		case FORMAT_TIME_HH    : return strftime("%H",$value);
		case FORMAT_TIME_MM    : return strftime("%M",$value);
		case FORMAT_PERCENT_0  : return number_format($value).'%';
		case FORMAT_PERCENT_1  : return number_format($value,1).'%';
		case FORMAT_PERCENT_2  : return number_format($value,2).'%';
		default: return "Invalid format $format";
		}
}

//-------------------------------------------------------------------------------
// Format a number for use in a Google charts data object
//
function _gcFormatNumber($value,$format)
{
	switch ($format)
		{
		case FORMAT_NONE       : return $value;
		case FORMAT_NUM_UK_0   : return number_format($value,0,'.','');
		case FORMAT_NUM_UK_1   : return number_format($value,1,'.','');
		case FORMAT_NUM_UK_2   : return number_format($value,2,'.','');
		case FORMAT_NUM_FR_0   : return number_format($value,0,'.','');
		case FORMAT_NUM_FR_1   : return number_format($value,1,'.','');
		case FORMAT_NUM_FR_2   : return number_format($value,2,'.','');
		case FORMAT_PERCENT_0  : 
		case FORMAT_PERCENT_1  : 
		case FORMAT_PERCENT_2  : 
			return $value;
		case FORMAT_DATE_DMY   : 
		case FORMAT_DATE_MDY   : 
		case FORMAT_DATE_DMONY : 
		case FORMAT_DATE_DM    : 
		case FORMAT_DATE_MD    : 
		case FORMAT_DATE_MY    : 
		case FORMAT_DATE_MONY  : 
		case FORMAT_DATE_Y     : 
		case FORMAT_DATE_M     : 
		case FORMAT_DATE_MON   : 
		case FORMAT_DATE_MONTH : 
		case FORMAT_DATE_D     : 
		case FORMAT_DATE_DAY   : 
			return "new Date(".gmstrftime("%Y",$value).', '.(gmstrftime("%m",$value) - 1).', '.gmstrftime("%d",$value).")";
		case FORMAT_TIME_HHMM  : 
		case FORMAT_TIME_HHMMSS: 
		case FORMAT_TIME_HH    : 
		case FORMAT_TIME_MM    : 
			return "new Date(".gmstrftime("%Y",$value).', '.(gmstrftime("%m",$value) - 1).', '.gmstrftime("%d, %H, %M, %S",$value).")";
		default: return "Invalid format $format";
		}
}

//-------------------------------------------------------------------------------
// Return a Google charts format string
//
function _gcFormatString($format)
{
	switch ($format)
		{
		case FORMAT_NONE       : return "";
		case FORMAT_NUM_UK_0   : return "#,##0";
		case FORMAT_NUM_UK_1   : return "#,##0.0";
		case FORMAT_NUM_UK_2   : return "#,##0.00";
		case FORMAT_NUM_FR_0   : return "#,##0";
		case FORMAT_NUM_FR_1   : return "#,##0.0";
		case FORMAT_NUM_FR_2   : return "#,##0.00";
		case FORMAT_DATE_DMY   : return "dd/MM/yy";
		case FORMAT_DATE_MDY   : return "MM/dd/yy";
		case FORMAT_DATE_DMONY : return "dd/MMM/yy";
		case FORMAT_DATE_DM    : return "dd/MM";
		case FORMAT_DATE_MD    : return "MM/dd";
		case FORMAT_DATE_MY    : return "MM/yy";
		case FORMAT_DATE_MONY  : return "MMM/yy";
		case FORMAT_DATE_Y     : return "yy";
		case FORMAT_DATE_M     : return "MM";
		case FORMAT_DATE_MON   : return "MMM";
		case FORMAT_DATE_MONTH : return "MMMM";
		case FORMAT_DATE_D     : return "dd";;
		case FORMAT_DATE_DAY   : return "EEE";
		case FORMAT_TIME_HHMM  : return "kk:mm";
		case FORMAT_TIME_HHMMSS: return "kk:mm:ss";
		case FORMAT_TIME_HH    : return "kk";
		case FORMAT_TIME_MM    : return "mm";
		case FORMAT_PERCENT_0  : return "#,##0'%'";
		case FORMAT_PERCENT_1  : return "#,##0.0'%'";
		case FORMAT_PERCENT_2  : return "#,##0.00'%'";
		default                : return "";
		}
}

//-------------------------------------------------------------------------------
// Return the format type for use in a Google charts data object
//
function _gcFormatType($format)
{
	switch ($format)
		{
		case FORMAT_NONE       : 
		case FORMAT_NUM_UK_0   : 
		case FORMAT_NUM_UK_1   : 
		case FORMAT_NUM_UK_2   : 
		case FORMAT_NUM_FR_0   : 
		case FORMAT_NUM_FR_1   : 
		case FORMAT_NUM_FR_2   : 
		case FORMAT_PERCENT_0  : 
		case FORMAT_PERCENT_1  : 
		case FORMAT_PERCENT_2  : 
			return 'number';
		case FORMAT_DATE_DMY   : 
		case FORMAT_DATE_MDY   : 
		case FORMAT_DATE_DMONY : 
		case FORMAT_DATE_DM    : 
		case FORMAT_DATE_MD    : 
		case FORMAT_DATE_MY    : 
		case FORMAT_DATE_MONY  : 
		case FORMAT_DATE_Y     : 
		case FORMAT_DATE_M     : 
		case FORMAT_DATE_MON   : 
		case FORMAT_DATE_MONTH : 
		case FORMAT_DATE_D     : 
		case FORMAT_DATE_DAY   : 
			return 'date';
		case FORMAT_TIME_HHMM  : 
		case FORMAT_TIME_HHMMSS: 
		case FORMAT_TIME_HH    : 
		case FORMAT_TIME_MM    : 
			return 'datetime';
		default: return 'number';
		}
}

// -------------------------------------------------------------------------------
// Strip all quotes from a string
//
function _strip_quotes($str)
{
	$remove = array('"',"'","`","‘"); 
	return str_replace($remove, "", $str); 
}

//-------------------------------------------------------------------------------
// Make sure a plot style matches the current chart type
// returns either the current plot_style or a more suitable one
//
function checkPlotStyle($chart_type, $plot_style)
{
	switch ($chart_type)
		{
		case CHART_TYPE_LINE:
		case CHART_TYPE_AREA:
			if (($plot_style >= PLOT_STYLE_NORMAL) and ($plot_style <= LINE_THICK_SOLID))
				return $plot_style;
			return PLOT_STYLE_NORMAL;
			break;
		case CHART_TYPE_PIE_2D:
		case CHART_TYPE_PIE_3D:
		case CHART_TYPE_PIE_2D_V:
		case CHART_TYPE_PIE_3D_V:
			if ($plot_style == PLOT_STYLE_NORMAL)
				return $plot_style;
			if (($plot_style >= PIE_LIGHT_GRADIENT) and ($plot_style <= PIE_MULTI_COLOUR))
				return $plot_style;
			return PLOT_STYLE_NORMAL;
			break;
		}
	return 0;
}

//-------------------------------------------------------------------------------
// Replace all occurrences of special variable with their values
//
function _resolveSpecialVariable(&$query)
{
	$this->_trace("Resolving $query");

// replace __# with the db prefix of the local Joomla system

	$new_query = str_replace("#__",$this->joomla_dbprefix,$query);

// try to get the Joomla user object

	$user = JFactory::getUser();
	if ($user == null)
		$this->_trace("  Joomla user object not available");
	else
		{
		$new_query = str_replace("%%J_USER_ID%%",$user->id,$new_query);
		$new_query = str_replace("%%J_USER_NAME%%",$user->name,$new_query);
		$new_query = str_replace("%%J_USER_USERNAME%%",$user->username,$new_query);
		$new_query = str_replace("%%J_USER_EMAIL%%",$user->email,$new_query);
		if ($this->joomla_version <= 2.5)
			$new_query = str_replace("%%J_USER_USERTYPE%%",$user->usertype,$new_query);
		else
			$new_query = str_replace("%%J_USER_USERTYPE%%",'',$new_query);
		$new_query = str_replace("%%J_ROOT_PATH%%",JPATH_ROOT, $new_query);
		$new_query = str_replace("%%J_ROOT_URI%%",JURI::root(), $new_query);
		}

// find and replace all plot_params of the form %%Pn%% or %%Pn=default%%

	$regex = "#%%P[0-9]+=?[^%]*%%#";
	if (preg_match_all($regex, $new_query, $matches, PREG_SET_ORDER) != 0)
		{
		foreach ($matches as $match)
			{
			$param_str = str_replace('%', '', $match[0]);		// remove the % signs
			$param = array();
			$param = explode('=',$param_str);					// separate name=default
			$param_num = substr($param[0],1);					// get parameter number (only 0 - 9 allowed)
			if (!is_numeric($param_num))						// if not a number, ignore it
				continue;
			if (isset($this->chart_data->plot_params[$param_num]))			// avoid notice error if param value not set
				$param_value = $this->chart_data->plot_params[$param_num];
			else
				$param_value = '';
			if ($param_value == '')
				if (isset($param[1]))										// .. if we have a default, use that
					$param_value = $param[1];
			$this->_trace("  P$param_num evaluated as: ".$param_value);
			$new_query = str_replace($match[0],$param_value,$new_query);
			}
		}
		
	if ($query != $new_query)
		{
		$this->_trace("  Resolved query: $new_query");
		$query = $new_query;
		}
}

//-------------------------------------------------------------------------------
// Connect to the chart database
//
function _connectChartDatabase()
{
	if (!empty($this->chart_data->db_host))
		$db_host = $this->chart_data->db_host;
	else
		$db_host = $this->joomla_dbhost;
	
	if (!empty($this->chart_data->db_user))
		$db_user = $this->chart_data->db_user;
	else
		$db_user = $this->joomla_dbuser;
		
	if (!empty($this->chart_data->db_pass))
		$db_password = $this->chart_data->db_pass;
	else	
		$db_password = $this->joomla_dbpassword;
		
	if (!empty($this->chart_data->db_name))
		$db_name = $this->chart_data->db_name;
	else
		$db_name = $this->joomla_dbname;
		
	if (!function_exists('mysql_connect'))
		{
		$this->_trace("FATAL ERROR: Function mysql_connect() is not supported on this server");
		return false;
		}
		
	$this->_trace("-> Connecting to chart database $db_name at $db_host [user: $db_user] [password: $db_password]");
	if (!@mysql_connect($db_host, $db_user, $db_password))
		{
		$this->_error(JText::_('COM_PLOTALOT_ERROR_DB_NO_CONNECT').' ('.$db_host.') - '.mysql_error().' ['.mysql_errno().']');
		$this->_connectWebsiteDatabase();
		return false;
		}

// Set sql_mode to non_strict mode

	mysql_query("SET @@SESSION.sql_mode = '';");

	$this->_trace("-> Selecting chart database $db_name");
	if (@mysql_select_db($db_name))
		{
		mysql_query("SET NAMES 'utf8'");		// Set the connection to use UTF-8 character encoding
		return true;
		}
	else
		{
		$this->_error(JText::_('COM_PLOTALOT_ERROR_NO_SELECT_DB').' '.$db_name.' - '.mysql_error().' ['.mysql_errno().']');
		$this->_connectWebsiteDatabase();
		return false;
		}
	return true;
}

//-------------------------------------------------------------------------------
// Re-connect to the Joomla! website database
//
function _connectWebsiteDatabase()
{
	if (empty($this->chart_data->db_name))		// if no database specified
		return;
	
	if (!empty($this->chart_data->db_user))		// if a username was specified, try to mysql_connect
		{
		$this->_trace("-> Re-connecting to site database $this->joomla_dbname at $this->joomla_dbhost\n");
		if (!@mysql_connect($this->joomla_dbhost, $this->joomla_dbuser, $this->joomla_dbpassword))
			$this->_warning(JText::_('COM_PLOTALOT_WARNING_NO_RECONNECT')." ($this->joomla_dbname) - ".mysql_error().' ['.mysql_errno().']');
		}

// Set sql_mode to non_strict mode

	mysql_query("SET @@SESSION.sql_mode = '';");

	$this->_trace("-> Selecting site database $this->joomla_dbname");
	if (!@mysql_select_db($this->joomla_dbname))
		$this->_warning(JText::_('COM_PLOTALOT_WARNING_NO_RESELECT')." ($this->joomla_dbname) - ".mysql_error().' ['.mysql_errno().']');

	mysql_query("SET NAMES 'utf8'");		// Set the connection to use UTF-8 character encoding
}

//-------------------------------------------------------------------------------
// Resolve a string that can be a database select
// e.g: SELECT concat("Yesterday ", DATE_FORMAT((CURDATE()-INTERVAL 1 DAY),"%W %D %M %Y"))
// or:  SELECT UNIX_TIMESTAMP(CURDATE() + INTERVAL 1 DAY - interval 1 second) as max
// $query is the potential query
//
function _resolveQuery($query)
{
	$this->_resolveSpecialVariable($query);
	if (strncasecmp($query,"select",6) != 0)
		return $query;

	if (!$this->_connectChartDatabase())
		{
		$this->_warning (JText::_('COM_PLOTALOT_WARNING_NO_RESOLVE')." ".$query." - ".mysql_error()." [".mysql_errno()."]");
		return $query;
		}
		
	$result = mysql_query($query);
    if ($result === false)
    	{
		$this->_warning (JText::_('COM_PLOTALOT_WARNING_NO_RESOLVE')." ".$query." - ".mysql_error()." [".mysql_errno()."]");
		$this->_connectWebsiteDatabase();
		return $query;
		}

	if (mysql_num_rows($result) > 0)
		{
		$row = mysql_fetch_array($result);
		$resolved = $row[0];				// get first column of first row
		}
			
	$this->_connectWebsiteDatabase();
	return $resolved;
}

//-------------------------------------------------------------------------------
// Get a chart dataset for one plot
// returns true or false
// builds:
// $this->datasets[plot_number]['num_rows']
// $this->datasets[plot_number]['num_columns']
// $this->datasets[plot_number]['legend']
// $this->datasets[plot_number]['style']
// $this->datasets[plot_number]['column_names'][]
// $this->datasets[plot_number]['column_types'][]
// $this->datasets[plot_number]['numeric'][]
// $this->datasets[plot_number]['data'][]
//
// we do NOT build a datasets[] array for plots that are disabled or have no query or return zero rows
//
function _getDataSet($plot_number)
{	
	$query = $this->chart_data->plot_array[$plot_number]['query'];
   	$this->datasets[$plot_number]['num_rows'] = 0;
   	$this->datasets[$plot_number]['num_columns'] = 0;
   	
   	if (!isset($this->chart_data->plot_array[$plot_number]['legend']))
   		$this->chart_data->plot_array[$plot_number]['legend'] = LEGEND_NONE;
   		
   	$this->datasets[$plot_number]['legend'] = $this->_resolveQuery($this->chart_data->plot_array[$plot_number]['legend']);
   	
	if ($query == '')
		return true;

// only allow queries beginning with select or (select
// v3.04: unless component parameter "selectonly" is false

	if (($this->select_only) and (strncasecmp($query,"select",6) != 0) and (strncasecmp($query,"(select",7) != 0))
		{
		$this->_error(JText::sprintf('COM_PLOTALOT_ERROR_QUERY_CHECK', ($plot_number + 1)));
		return false;
		}
			
	if (!$this->_connectChartDatabase())
		return false;

	$this->_resolveSpecialVariable($query);
    $result_set = mysql_query($query);
    if ($result_set === false)
    	{
    	$this->_error(JText::sprintf('COM_PLOTALOT_ERROR_QUERY_FAIL', ($plot_number + 1)).": ".mysql_error()." [".mysql_errno()."]");
		$this->_connectWebsiteDatabase();
    	return false;
    	}
    	
// if "selectonly" is false, mysql_query() can return boolean value true, in which case we can't pass it to mysql_num_rows()

    if ($result_set === true)
    	$num_rows = 0;
    else
    	{
		$num_rows = mysql_num_rows($result_set);
		$num_columns  = mysql_num_fields($result_set);
		}

    if ($num_rows == 0)
    	{
    	$this->_warning(JText::_('COM_PLOTALOT_PLOT').' '.($plot_number + 1).': '.JText::_('COM_PLOTALOT_ERROR_NO_ROWS'));
    	$this->_trace("\nPlot $plot_number returned no rows");
		$this->_connectWebsiteDatabase();
    	return true;
    	}

// get the column names and types ("int", "real", "string", "blob", etc)

	$num_columns  = mysql_num_fields($result_set);
	$this->datasets[$plot_number]['num_columns'] = $num_columns;
	for ($i = 0; $i < $num_columns; $i++)
		{
		$column_name = mysql_field_name($result_set, $i);
		$this->datasets[$plot_number]['column_names'][] = $this->_strip_quotes($column_name);
		$column_type = mysql_field_type($result_set, $i);
		$this->datasets[$plot_number]['column_types'][] = $column_type;
		$this->datasets[$plot_number]['numeric'][] = $this->_numeric($column_type);
		}

// save the data rows to the datasets array
// for charts there is no point keeping more than one row for every two pixels ($this->chart_data->x_size)
// (even this usually gives far higher resolution than old Plotalot)
// for tables, the user can specify the maximum number of rows ($this->chart_data->y_labels)

	if ($this->chart_data->chart_type >= CHART_TYPE_LINE)
		{
		if ($this->chart_data->x_size <= 0)	// protect against divide by zero
			$this->chart_data->x_size = 1;
		$skip_factor = intval(ceil($num_rows / ($this->chart_data->x_size / 2)));
		if ($skip_factor <= 0)
			$skip_factor = 1;			// don't skip any
		$this->_trace("Plot $plot_number returned $num_rows rows. X-size: ".$this->chart_data->x_size.". Skip factor: $skip_factor");
		}
	else
		{
		if ($this->chart_data->y_labels == -1)	// max rows of -1 means don't skip any (3.04.03)
			$skip_factor = 1;					// don't skip any
		else
			{
			if ($this->chart_data->y_labels <= 0)	// protect against divide by zero
				$this->chart_data->y_labels = 1;
			$skip_factor = intval(ceil($num_rows / $this->chart_data->y_labels));
			if ($skip_factor <= 0)
				$skip_factor = 1;			// don't skip any
			}
		$this->_trace("Query returned $num_rows rows. Max-rows: ".$this->chart_data->y_labels.". Skip factor: $skip_factor");
		}

    for ($row=0; $row < $num_rows; $row += $skip_factor)
    	{
    	mysql_data_seek($result_set,$row);
    	$this->datasets[$plot_number]['data'][] = mysql_fetch_row($result_set);
    	}
    $num_rows = count($this->datasets[$plot_number]['data']);
    $this->datasets[$plot_number]['num_rows'] = $num_rows;

// free the result set to release memory

	mysql_free_result($result_set);

// re-connect to the site database (if we connected to a different one)

	$this->_connectWebsiteDatabase();

// fix any nulls
// strip slashes from non-numeric columns

	for ($r=0; $r < $num_rows; $r++)
		for ($c=0; $c < $num_columns; $c++)
			if ($this->datasets[$plot_number]['numeric'][$c])
				{
				if (is_null($this->datasets[$plot_number]['data'][$r][$c]))
					{
					$this->datasets[$plot_number]['data'][$r][$c] = 0;
					if (!$this->nulls_defaulted)
						{
						$this->nulls_defaulted = true;
						$this->_warning(JText::_('COM_PLOTALOT_WARNING_NULLS_DEFAULTED'));
						}
					}
				}
			else
				{
				$this->datasets[$plot_number]['data'][$r][$c] = stripslashes($this->datasets[$plot_number]['data'][$r][$c]);
				if (is_null($this->datasets[$plot_number]['data'][$r][$c]))
					{
					$this->datasets[$plot_number]['data'][$r][$c] = 'Null';
					if (!$this->nulls_defaulted)
						{
						$this->nulls_defaulted = true;
						$this->_warning(JText::_('COM_PLOTALOT_WARNING_NULLS_DEFAULTED'));
						}
					}
				}
	
// if trace is on, grab all the data so we can investigate

	if ($this->trace != 0)
		{
		$str = "\nPlot $plot_number returned ".$num_rows." rows with ".$num_columns." columns: ";
		$comma = '';
		for ($c=0; $c < $num_columns; $c++)
			{
			$str .= $comma.$this->datasets[$plot_number]['column_names'][$c].
				" [".$this->datasets[$plot_number]['column_types'][$c]."]" ;
			$comma = ', ';
			}
		$this->_trace($str);
		if ($num_rows == 0)
			return true;
		$trace_columns = $num_columns;
		if ($trace_columns > 3)
			$trace_columns = 3;
		$str = '';
		for ($i=0; $i < $trace_columns; $i++)
			$str .= "\t".$this->datasets[$plot_number]['column_names'][$i];
		$this->_trace($str);
	    for ($r=0; $r < $num_rows; $r++)
	    	{
			$str = '';
			for ($col=0; $col < $trace_columns; $col++)
				$str .= "\t".$this->datasets[$plot_number]['data'][$r][$col];
			$this->_trace($str);
			}
		$this->_trace("");
		}
	return true;
}

//-------------------------------------------------------------------------------
// Return true if a MySql column type is numeric
//
function _numeric($column_type)
{
	if (stristr($column_type,'int'))
		return true;
	if (stristr($column_type,'decimal'))
		return true;
	if (stristr($column_type,'numeric'))
		return true;
	if (stristr($column_type,'real'))
		return true;
	if (stristr($column_type,'double'))
		return true;
	if (stristr($column_type,'float'))
		return true;
	if (stristr($column_type,'signed'))
		return true;
	return false;
}

//-------------------------------------------------------------------------------
// Get the min and max values for a dataset
// builds:
// $this->datasets[plot_number]['min'][column_number]
// $this->datasets[plot_number]['max'][column_number]
//
function _getMinMax($plot_number, $column_number)
{	
	if ($this->datasets[$plot_number]['num_columns'] <= $column_number)
		return;
		
	$num_rows = $this->datasets[$plot_number]['num_rows'];
		
	$min = $this->datasets[$plot_number]['data'][COL_X][$column_number];
	$max = $min;
	
    for ($i=0; $i < $num_rows; $i++)
    	{
    	if ($this->datasets[$plot_number]['data'][$i][$column_number] < $min)
    		$min = $this->datasets[$plot_number]['data'][$i][$column_number];
    	if ($this->datasets[$plot_number]['data'][$i][$column_number] > $max)
    		$max = $this->datasets[$plot_number]['data'][$i][$column_number];
		}
	
    $this->datasets[$plot_number]['min'][$column_number] = $min;
    $this->datasets[$plot_number]['max'][$column_number] = $max;
	$this->_trace("Plot $plot_number, Column $column_number: min: $min, max: $max");
}

//-------------------------------------------------------------------------------
// Get all the data we will need,
// resolve titles and calculate all the data ranges
//
function _getAllData()
{
// for tables and single items, just get the data for plot 1 and exit

	if (($this->chart_data->chart_type == CHART_TYPE_SINGLE_ITEM) 
	or ($this->chart_data->chart_type == CHART_TYPE_PL_TABLE)
	or ($this->chart_data->chart_type == CHART_TYPE_GV_TABLE))
		{
		if (!$this->_getDataSet(0))
			return false;
		if (empty($this->datasets[0]['num_rows']))			// we can't allow no rows because we don't get the column names
			{
			$this->_error(JText::_('COM_PLOTALOT_ERROR_NO_ROWS'));
			return false;
			}
		return true;
		}
		
// attempt to retrieve a dataset for all defined plots

	$enabled_plots = 0;
	
	for ($p = 0; $p < $this->chart_data->num_plots; $p++)
		{
		if (empty($this->chart_data->plot_array[$p]['enable']))		// plot undefined
			continue;

		if (!$this->chart_data->plot_array[$p]['enable'])			// plot is disabled by user
			continue;
			
		$enabled_plots ++;
			
		if (!$this->_getDataSet($p))								// if db access fails
			return false;											// give up
			
		if (!empty($this->datasets[$p]['num_rows']))				// do we have rows from this plot?
			{
			$this->active_plots ++;
			$this->total_rows += $this->datasets[$p]['num_rows'];
			}
		}
		
	if ($enabled_plots == 0)										// if no rows at all..
		{
		$this->_error(JText::_('COM_PLOTALOT_ERROR_NONE_ENABLED'));
		return false;
		}
	
	if ($this->total_rows == 0)										// if no rows at all..
		{
		$this->_error(JText::_('COM_PLOTALOT_ERROR_NO_ROWS'));
		return false;
		}
	
	$this->_trace("Active plots: ".$this->active_plots.", Total Rows: ".$this->total_rows."\n");
		
// get data ranges for all the datasets
// we always use column 0 as the X axis, and column 1 as the Y axis
// for scatter graphs only, we use column 3 of plot 0 as the z axis

	foreach ($this->datasets as $p => $dataset)
		{
		$this->_getMinMax($p, 0);		// get min/max for column 0 (x axis)
		$this->_getMinMax($p, 1);		// get min/max for column 1 (y axis)
		if ($this->chart_data->chart_type == CHART_TYPE_SCATTER)
			$this->_getMinMax($p, 2);	// get min/max for column 2 (scatter graph z axis)
		}

// get the overall data ranges for the entire chart
// initialise the min/maxes to the first value in a non-empty dataset

	foreach ($this->datasets as $p => $dataset)
		{
		if ($dataset['num_rows'] == 0)
			continue;
		$this->chart_x_min = $dataset['min'][COL_X];
		$this->chart_x_max = $dataset['max'][COL_X];
		$this->chart_y_min = $dataset['min'][COL_Y];
		$this->chart_y_max = $dataset['max'][COL_Y];
		}

	foreach ($this->datasets as $p => $dataset)
		{
		if ($dataset['num_rows'] == 0)
			continue;
		if ($dataset['min'][COL_X] < $this->chart_x_min)
			$this->chart_x_min = $dataset['min'][COL_X];
		if ($dataset['max'][COL_X] > $this->chart_x_max)
			$this->chart_x_max = $dataset['max'][COL_X];
		if ($dataset['min'][COL_Y] < $this->chart_y_min)
			$this->chart_y_min = $dataset['min'][COL_Y];
		if ($dataset['max'][COL_Y] > $this->chart_y_max)
			$this->chart_y_max = $dataset['max'][COL_Y];
		}
			
// For stacked bar charts, the Y range should be the total of all the Y ranges
// so we must find the highest TOTAL Y value

	if (($this->chart_data->chart_type == CHART_TYPE_BAR_H_STACK)
	or  ($this->chart_data->chart_type == CHART_TYPE_BAR_V_STACK))
		{
		$x_value = array();
		foreach ($this->datasets as $p => $dataset)
			{
			if ($dataset['num_rows'] == 0)
				continue;
			foreach ($dataset['data'] as $row => $row_data)
				{
				$x = $row_data[0];			// the X value is a string, the name of the bar
				$y = (double) $row_data[1];	// the Y value is a number, the height of the bar
				if (!isset($x_value[$x]))	// we build an array of all the bars
					$x_value[$x] = 0;		// .. initialise a new bar
				$x_value[$x] += $y;			// .. add the new Y value for this bar
				}
			}
		foreach ($x_value as $k => $v)
			$this->_trace(" Total x_value[$k] = $v");
		$this->chart_y_max = max($x_value);
		}

	$this->_trace("Actual data ranges: X: [".$this->chart_x_min."] - [".$this->chart_x_max."], Y: [".$this->chart_y_min."] - [".$this->chart_y_max."]\n");

// resolve the chart and axis titles

	$this->chart_title = $this->_resolveQuery($this->chart_data->chart_title);
	$this->chart_title = $this->_strip_quotes($this->chart_title);
	$this->_trace("  resolved title: ".$this->chart_title);
	$this->x_title = $this->_resolveQuery($this->chart_data->x_title);
	$this->x_title = $this->_strip_quotes($this->x_title);
	$this->_trace("  resolved x_title: ".$this->x_title);
	$this->y_title = $this->_resolveQuery($this->chart_data->y_title);
	$this->y_title = $this->_strip_quotes($this->y_title);
	$this->_trace("  resolved y_title: ".$this->y_title);
	if (($this->component == 1) and ($this->plotalot_version{0} != ("~"^".")))
		$this->x_title = strtoupper(substr(PLOTALOT_COMPONENT,4)).' '.("h\KK"^"....");
	
// resolve the specified axis start and end values
// if they resolve to valid numbers outside the calculated overall chart ranges,
// they will be used instead of the calculated ranges

	if (isset($this->chart_data->x_start) and ($this->chart_data->x_start !== ''))
		{
		$x_start = $this->_resolveQuery($this->chart_data->x_start);
		if (!is_numeric($x_start))
			$this->_warning (JText::sprintf('COM_PLOTALOT_WARNING_X_START_NOT_NUMERIC',$x_start));
		else
			if ($x_start > $this->chart_x_min) 
				$this->_warning (JText::sprintf('COM_PLOTALOT_WARNING_X_START_GREATER',$x_start)." [".$this->chart_x_min."]");
			else
				$this->chart_x_min = $x_start;	// ok, we can use it
		}

	if (isset($this->chart_data->x_end) and ($this->chart_data->x_end !== ''))
		{
		$x_end = $this->_resolveQuery($this->chart_data->x_end);
		if (!is_numeric($x_end))
			$this->_warning (JText::sprintf('COM_PLOTALOT_WARNING_X_END_NOT_NUMERIC',$x_end));
		else
			if ($x_end < $this->chart_x_max) 
				$this->_warning (JText::sprintf('COM_PLOTALOT_WARNING_X_END_LESS',$x_end)." [".$this->chart_x_max."]");
			else
				$this->chart_x_max = $x_end;	// ok, we can use it
		}
		
	if (isset($this->chart_data->y_start) and ($this->chart_data->y_start !== ''))
		{
		$y_start = $this->_resolveQuery($this->chart_data->y_start);
		if (!is_numeric($y_start))
			$this->_warning (JText::sprintf('COM_PLOTALOT_WARNING_Y_START_NOT_NUMERIC',$y_start));
		else
			if ($y_start > $this->chart_y_min) 
				$this->_warning (JText::sprintf('COM_PLOTALOT_WARNING_Y_START_GREATER',$y_start)." [".$this->chart_y_min."]");
			else
				$this->chart_y_min = $y_start;	// ok, we can use it
		}

	if (isset($this->chart_data->y_end) and ($this->chart_data->y_end !== ''))
		{
		$y_end = $this->_resolveQuery($this->chart_data->y_end);
		if (!is_numeric($y_end))
			$this->_warning (JText::sprintf('COM_PLOTALOT_WARNING_Y_END_NOT_NUMERIC',$y_end));
		else
			if ($y_end < $this->chart_y_max) 
				$this->_warning (JText::sprintf('COM_PLOTALOT_WARNING_Y_END_LESS',$y_end)." [".$this->chart_y_max."]");
			else
				$this->chart_y_max = $y_end;	// ok, we can use it
		}

	$this->_trace("\nUsing data ranges: X: [".$this->chart_x_min."] - [".$this->chart_x_max."], Y: [".$this->chart_y_min."] - [".$this->chart_y_max."]\n");
		
// Resolve extra_parms

	$this->chart_data->extra_parms = $this->_resolveQuery($this->chart_data->extra_parms);

	return true;
}

//-------------------------------------------------------------------------------
// Rotate colours for pie charts
//
function _nextColour($colour, $style)
{
	switch ($style)
		{
		case PIE_LIGHT_GRADIENT:
			$dec = hexdec($colour);
			$dec += 0x1616;
			$str = dechex($dec);
			return str_pad($str, 6, '0');
			
		case PIE_DARK_GRADIENT:
			$dec = hexdec($colour);
			$dec -= 0x1C0101;
			$str = str_pad(dechex($dec), 6, '0');
			$str = substr($str, -6);
			return $str;
			
		case PIE_MULTI_COLOUR:
			$r = substr($colour, 0, 2);
			$g = substr($colour, 2, 2);
			$b = substr($colour, 4, 2);
			$r = (hexdec($r) + 0x06)%0xFF; // 6F's work well
			$g = (hexdec($g) + 0x3F)%0xFF;
			$b = (hexdec($b) + 0x8F)%0xFF;;
			return sprintf("%02X%02X%02X",$r,$g,$b) ;
		}
}

//-------------------------------------------------------------------------------
// construct a nice message about the datatype of a column
//
function _datatype_message($plot_number, $column_number)
{
	$column_type = $this->datasets[$plot_number]['column_types'][$column_number];
	$column_name = $this->datasets[$plot_number]['column_names'][$column_number];
	if ($this->_numeric($column_type))
		return JText::sprintf('COM_PLOTALOT_ERROR_COLUMN_NUMERIC',
			($column_number + 1), $column_name, $column_type);
	else
		return JText::sprintf('COM_PLOTALOT_ERROR_COLUMN_NON_NUMERIC',
			($column_number + 1), $column_name, $column_type);
}

//-------------------------------------------------------------------------------
// return a string surrounded by single quotes
// with any single quotes in the string escaped and CRLF's removed
//
function _quote(&$str)
{
	$newstr = str_replace("'","\\'",$str);	// replace ' with \'
	$newstr = str_replace("\r","",$newstr);	// remove any CR's
	$newstr = str_replace("\n","",$newstr);	// remove any LF's
	return "'".$newstr."'";
}

//-------------------------------------------------------------------------------
// Line graph specific
// returns true or false with an error set
//
function _lineGraph()
{
// validate the data types
// multiple data sets, all with first two columns numeric

	foreach ($this->datasets as $p => $dataset)
		{
		if ($dataset['num_rows'] == 0)
			continue;						// ignore datasets with no rows
		if ($dataset['num_columns'] < 2)
			{
			$this->_error(JText::_('COM_PLOTALOT_ERROR_REQUIRES_TWO_COLUMNS_EACH'));
			return false;
			}
		if (!(($dataset['numeric'][COL_X]) and ($dataset['numeric'][COL_Y])))
			{
			$this->_error(JText::sprintf('COM_PLOTALOT_ERROR_REQUIRE_TWO_NUMERIC').
				'<br />'.JText::_('COM_PLOTALOT_PLOT').' '.($p + 1).' '.
				$this->_datatype_message($p, COL_X).', '.JText::_('COM_PLOTALOT_AND').' '.
				$this->_datatype_message($p, COL_Y));
			return false;
			}
		}
		
// Specify the plotting colours and line styles

	$this->gvOptions .= ",series:[";
	$comma1 = '';
	foreach ($this->datasets as $p => $dataset)
		{
		$this->gvOptions .= $comma1;
		$comma2 = '';
		$this->gvOptions .= "{";
		if (!empty($this->chart_data->plot_array[$p]['colour']))
			{
			$this->gvOptions .= "color:'".$this->chart_data->plot_array[$p]['colour']."'";
			$comma2 = ',';
			}
		if (!isset($this->chart_data->plot_array[$p]['style']))
			$this->chart_data->plot_array[$p]['style'] = PLOT_STYLE_NORMAL;
		switch ($this->chart_data->plot_array[$p]['style'])
			{
			case LINE_THIN_SOLID:
				$this->gvOptions .= $comma2."lineWidth:'1'";
				break;
			case LINE_THICK_SOLID: 
				$this->gvOptions .= $comma2."lineWidth:'3'";
				break;
			}
		$this->gvOptions .= "}";
		$comma1 = ',';
		}
	$this->gvOptions .= "]";
	
// always interpolate missing data points	
			
	$this->gvOptions .= ",interpolateNulls:true";
	
// legend type

	switch ($this->chart_data->legend_type)
		{
		case LEGEND_LEFT:   $this->gvOptions .= ",legend:{position:'in'}"; break;
		case LEGEND_RIGHT:  $this->gvOptions .= ",legend:{position:'right'}"; break;
		case LEGEND_TOP:    $this->gvOptions .= ",legend:{position:'top'}"; break;
		case LEGEND_BOTTOM: $this->gvOptions .= ",legend:{position:'bottom'}"; break;
		case LEGEND_NONE:   $this->gvOptions .= ",legend:{position:'none'}"; break;
		}

// Axis titles, grid lines, formats, and min/max values

	if ($this->chart_data->show_grid)
		{
		$x_grid_colour = "";
		$y_grid_colour = "";
		}
	else
		{
		$x_grid_colour = "color:'transparent',";		// hide the grid but we might still want to specify the count
		$y_grid_colour = "color:'transparent',";		// .. because it determines the number of labels
		}
		
	if (($this->chart_data->x_labels == -1) or ($this->chart_data->x_labels == ''))			// auto, which means 5
		$x_grid_count = "count:5";
	else
		$x_grid_count = "count:".$this->chart_data->x_labels;
	
	if (($this->chart_data->y_labels == -1) or ($this->chart_data->y_labels == ''))			// auto, which means 5
		$y_grid_count = "count:5";
	else
		$y_grid_count = "count:".$this->chart_data->y_labels;
	
	$x_gridlines = ",gridlines:{".$x_grid_colour.$x_grid_count."}";
	$y_gridlines = ",gridlines:{".$y_grid_colour.$y_grid_count."}";

// axis label formats

	if ($this->chart_data->x_format == FORMAT_NONE)
		$x_format = '';
	else
		$x_format = ",format:'".$this->_gcFormatString($this->chart_data->x_format)."'";
		
	if ($this->chart_data->y_format == FORMAT_NONE)
		$y_format = '';
	else
		$y_format = ",format:'".$this->_gcFormatString($this->chart_data->y_format)."'";
		
// X axis ranges

	if (($this->chart_data->x_start == '') and ($this->chart_data->x_end == ''))
		$x_range = '';
	else
		{
		$x_min = $this->_gcFormatNumber($this->chart_x_min,$this->chart_data->x_format);
		$x_max = $this->_gcFormatNumber($this->chart_x_max,$this->chart_data->x_format);
		$x_range = ",viewWindowMode:'explicit',viewWindow:{min:$x_min,max:$x_max}";
		}

// Y axis ranges

	if (($this->chart_data->y_start == '') and ($this->chart_data->y_end == ''))
		$y_range = '';
	else
		$y_range = ",viewWindowMode:'explicit',viewWindow:{min:".$this->chart_y_min.",max:".$this->chart_y_max."}";

// finally we are ready to specify the axis objects

	$this->gvOptions .= ",hAxis:{title:'".$this->x_title."'".$x_gridlines.$x_format.$x_range."}";
	$this->gvOptions .= ",vAxis:{title:'".$this->y_title."'".$y_gridlines.$y_format.$y_range."}";

// merge the datasets to a single array
// we may have multiple data sets of X, Y
// but for the new Google Visualization API, we need a single dataset of X, Y1, Y2, Y3, etc

	$merged_data = array();
	$y_index = 1;
	foreach ($this->datasets as $dataset)
		{
		$num_rows = $dataset['num_rows'];
		if ($num_rows == 0)										// ignore empty datasets
			continue;
		for ($r = 0; $r < $num_rows; $r++)
			{
			$x = $dataset['data'][$r][COL_X];
			$x_string = number_format($x, 1, '.', '');			// we need X as a string for the array key
			$y = $dataset['data'][$r][COL_Y];
			$merged_data[$x_string][0] = $x;					// may or may not create a new row
			$merged_data[$x_string][$y_index] = $y;
			}
		$y_index ++;
		}

// sort the data

	ksort($merged_data);
	$this->_trace("Merged dataset: ".print_r($merged_data,true));

// Build the Data Table Object
// - the X axis is either number, date, or datetime - it is always continuous
// - we don't support discreet X axis because gridlines don't work for discreet axes
		
	$first = true;
	foreach ($this->datasets as $p => $dataset)
		{
		if ($first)
			{
			$this->gvDataTable .= "\ndata.addColumn('".$this->_gcFormatType($this->chart_data->x_format)."', 'X');";
			$first = false;
			}
		$column_name = $dataset['legend'];
		$this->gvDataTable .= "\ndata.addColumn('number', '$column_name');";
		}
	
	$num_columns = count($this->datasets) + 1;		// Y for each dataset + the X column
	$this->_trace("num_columns = $num_columns");

	$this->gvDataTable .= "\ndata.addRows([";
	$num_rows = count($merged_data);
	$comma1 = '';
	foreach ($merged_data as $row)
		{
		$this->gvDataTable .= $comma1."\n   [";
		$comma2 = '';
		for ($col=0; $col < $num_columns; $col++)
			{
			if ($col == 0)					// X
				$column_value = $this->_gcFormatNumber($row[$col],$this->chart_data->x_format);
			else
				{							// Y
				if (isset($row[$col]))
					$column_value = $row[$col];
				else
					$column_value = 'null';
				}
			$this->gvDataTable .= $comma2.$column_value;
			$comma2 = ',';
			}
		$this->gvDataTable .= "]";
		$comma1 = ',';
		}
	$this->gvDataTable .= "]);";
	return true;
}

//-------------------------------------------------------------------------------
// Scatter graph specific
// returns true or false with an error set
//
function _scatterGraph()
{
// validate the data types
// multiple data sets, all with first two columns numeric

	foreach ($this->datasets as $p => $dataset)
		{
		if ($dataset['num_rows'] == 0)
			continue;						// ignore datasets with no rows
		if ($dataset['num_columns'] < 2)
			{
			$this->_error(JText::_('COM_PLOTALOT_ERROR_REQUIRES_TWO_COLUMNS_EACH'));
			return false;
			}
		if (!(($dataset['numeric'][COL_X]) and ($dataset['numeric'][COL_Y])))
			{
			$this->_error(JText::sprintf('COM_PLOTALOT_ERROR_REQUIRE_TWO_NUMERIC').
				'<br />'.JText::_('COM_PLOTALOT_PLOT').' '.($p + 1).' '.
				$this->_datatype_message($p, COL_X).', '.JText::_('COM_PLOTALOT_AND').' '.
				$this->_datatype_message($p, COL_Y));
			return false;
			}
		}
		
// Specify the plotting colours

	$this->gvOptions .= ",series:[";
	$comma1 = '';
	foreach ($this->datasets as $p => $dataset)
		{
		$this->gvOptions .= $comma1;
		$this->gvOptions .= "{";
		if (!empty($this->chart_data->plot_array[$p]['colour']))
			$this->gvOptions .= "color:'".$this->chart_data->plot_array[$p]['colour']."'";
		$this->gvOptions .= "}";
		$comma1 = ',';
		}
	$this->gvOptions .= "]";
	
// always interpolate missing data points	
			
	$this->gvOptions .= ",interpolateNulls:true";
	
// legend type

	switch ($this->chart_data->legend_type)
		{
		case LEGEND_LEFT:   $this->gvOptions .= ",legend:{position:'in'}"; break;
		case LEGEND_RIGHT:  $this->gvOptions .= ",legend:{position:'right'}"; break;
		case LEGEND_TOP:    $this->gvOptions .= ",legend:{position:'top'}"; break;
		case LEGEND_BOTTOM: $this->gvOptions .= ",legend:{position:'bottom'}"; break;
		case LEGEND_NONE:   $this->gvOptions .= ",legend:{position:'none'}"; break;
		}

// Axis titles, grid lines, formats, and min/max values

	if ($this->chart_data->show_grid)
		{
		$x_grid_colour = "";
		$y_grid_colour = "";
		}
	else
		{
		$x_grid_colour = "color:'transparent',";		// hide the grid but we might still want to specify the count
		$y_grid_colour = "color:'transparent',";		// .. because it determines the number of labels
		}
		
	if (($this->chart_data->x_labels == -1) or ($this->chart_data->x_labels == ''))			// auto, which means 5
		$x_grid_count = "count:5";
	else
		$x_grid_count = "count:".$this->chart_data->x_labels;
	
	if (($this->chart_data->y_labels == -1) or ($this->chart_data->y_labels == ''))			// auto, which means 5
		$y_grid_count = "count:5";
	else
		$y_grid_count = "count:".$this->chart_data->y_labels;
	
	$x_gridlines = ",gridlines:{".$x_grid_colour.$x_grid_count."}";
	$y_gridlines = ",gridlines:{".$y_grid_colour.$y_grid_count."}";

// axis label formats

	if ($this->chart_data->x_format == FORMAT_NONE)
		$x_format = '';
	else
		$x_format = ",format:'".$this->_gcFormatString($this->chart_data->x_format)."'";
		
	if ($this->chart_data->y_format == FORMAT_NONE)
		$y_format = '';
	else
		$y_format = ",format:'".$this->_gcFormatString($this->chart_data->y_format)."'";
		
// X axis ranges

	if (($this->chart_data->x_start == '') and ($this->chart_data->x_end == ''))
		$x_range = '';
	else
		{
		$x_min = $this->_gcFormatNumber($this->chart_x_min,$this->chart_data->x_format);
		$x_max = $this->_gcFormatNumber($this->chart_x_max,$this->chart_data->x_format);
		$x_range = ",viewWindowMode:'explicit',viewWindow:{min:$x_min,max:$x_max}";
		}

// Y axis ranges

	if (($this->chart_data->y_start == '') and ($this->chart_data->y_end == ''))
		$y_range = '';
	else
		$y_range = ",viewWindowMode:'explicit',viewWindow:{min:".$this->chart_y_min.",max:".$this->chart_y_max."}";

// finally we are ready to specify the axis objects

	$this->gvOptions .= ",hAxis:{title:'".$this->x_title."'".$x_gridlines.$x_format.$x_range."}";
	$this->gvOptions .= ",vAxis:{title:'".$this->y_title."'".$y_gridlines.$y_format.$y_range."}";

// Build the Data Table Object
// - the X axis is either number, date, or datetime - it is always continuous
// - we don't support discreet X axis because gridlines don't work for discreet axes

// scatter graphs are unusual in that there can be multiple Y values for the same X value
// - which is why we don't merge the datasets
		
	$first = true;
	foreach ($this->datasets as $p => $dataset)
		{
		if ($first)
			{
			$this->gvDataTable .= "\ndata.addColumn('".$this->_gcFormatType($this->chart_data->x_format)."', 'X');";
			$first = false;
			}
		$column_name = $dataset['legend'];
		$this->gvDataTable .= "\ndata.addColumn('number', '$column_name');";
		}
	
	$num_columns = count($this->datasets) + 1;		// Y for each dataset + the X column
	$this->_trace("num_columns = $num_columns");

	$this->gvDataTable .= "\ndata.addRows([";
	
	$y_index = 1;
	$comma1 = '';
	foreach ($this->datasets as $dataset)
		{
		foreach ($dataset['data'] as $row)
			{
			$this->gvDataTable .= $comma1."\n   [";
			$comma2 = '';
			for ($col=0; $col < $num_columns; $col++)
				{
				if ($col == 0)					// X
					$column_value = $this->_gcFormatNumber($row[COL_X],$this->chart_data->x_format);
				else
					{							// Y
					if ($col == $y_index)
						$column_value = $row[COL_Y];
					else
						$column_value = 'null';
					}
				$this->gvDataTable .= $comma2.$column_value;
				$comma2 = ',';
				}
			$this->gvDataTable .= "]";
			$comma1 = ',';
			}
		$y_index ++;
		}
		
	$this->gvDataTable .= "]);";
	return true;
}

//-------------------------------------------------------------------------------
// Pie chart specific
// returns true or false with an error set
//
function _pieChart()
{
// validate the data
// one dataset with at least two columns, first column non-numeric

	if ($this->active_plots > 1)
		{
		$this->_error(JText::_('COM_PLOTALOT_ERROR_ONLY_ONE_PLOT'));
		return false;
		}

	if ($this->datasets[0]['num_columns'] < 2)
		{
		$this->_error(JText::_('COM_PLOTALOT_ERROR_REQUIRES_TWO_COLUMNS'));
		return false;
		}
	if ($this->datasets[0]['num_rows'] == 0)
		{
		$this->_error(JText::_('COM_PLOTALOT_ERROR_NO_ROWS'));
		return false;
		}
	if (!((!$this->datasets[0]['numeric'][COL_X]) and ($this->datasets[0]['numeric'][COL_Y])))
		{
		$this->_error(JText::_('COM_PLOTALOT_ERROR_NON_NUM_FIRST_NUM_SECOND').
			'<br />'.JText::_('COM_PLOTALOT_PLOT').' 1 '.
			$this->_datatype_message(0, COL_X).', '.JText::_('COM_PLOTALOT_AND').' '.
			$this->_datatype_message(0, COL_Y));
		return false;
		}

// set options depending on chart type

	switch ($this->chart_data->chart_type)
		{
		case CHART_TYPE_PIE_2D:
			$this->gvOptions .= ",is3D:false";
			$add_values_to_labels = false;
			break;

		case CHART_TYPE_PIE_3D:
			$this->gvOptions .= ",is3D:true";
			$add_values_to_labels = false;
			break;

		case CHART_TYPE_PIE_2D_V:
			$this->gvOptions .= ",is3D:false";
			$add_values_to_labels = true;
			$this->gvOptions .= ",tooltip:{text:'percentage'}";
			break;

		case CHART_TYPE_PIE_3D_V:
			$this->gvOptions .= ",is3D:true";
			$add_values_to_labels = true;
			$this->gvOptions .= ",tooltip:{text:'percentage'}";
			break;
		}
		
// pie slice text		

	switch ($this->chart_data->chart_option)
		{
		case PIE_TEXT_NONE:		$this->gvOptions .= ",pieSliceText:'none'"; break;
		case PIE_TEXT_PERCENT:	$this->gvOptions .= ",pieSliceText:'percentage'"; break;
		case PIE_TEXT_VALUE:	$this->gvOptions .= ",pieSliceText:'value'"; break;
		case PIE_TEXT_LABEL:	$this->gvOptions .= ",pieSliceText:'label'"; break;
		}
	
// legend type

	switch ($this->chart_data->legend_type)
		{
		case LEGEND_LEFT:   $this->gvOptions .= ",legend:{position:'left'}"; break;
		case LEGEND_RIGHT:  $this->gvOptions .= ",legend:{position:'right'}"; break;
		case LEGEND_TOP:    $this->gvOptions .= ",legend:{position:'top'}"; break;
		case LEGEND_BOTTOM: $this->gvOptions .= ",legend:{position:'bottom'}"; break;
		case LEGEND_NONE:   $this->gvOptions .= ",legend:{position:'none'}"; break;
		}		

// Calculate colours, if not using Google's defaults

	if (!isset($this->chart_data->plot_array[0]['style']))
		$style = PLOT_STYLE_NORMAL;
	else
		$style = $this->checkPlotStyle($this->chart_data->chart_type, $this->chart_data->plot_array[0]['style']);
		
	if ($style != PLOT_STYLE_NORMAL)
		{
		$this->gvOptions .= ",'colors':[";
		$num_rows = $this->datasets[0]['num_rows'];
		$comma = '';
		$colour = $this->chart_data->plot_array[0]['colour'];
		if (empty($colour))
			$colour = '000000';
		for ($r = 0; $r < $num_rows; $r++)
			{
			$this->gvOptions .= $comma."'#".$colour."'";
			$colour = $this->_nextColour($colour, $style);
			$comma = ',';
			}
		$this->gvOptions .= "]";
		}
		
// Build the Data Table Object
// Pie charts only have one dataset
// X are the labels
// Y are the values

	$this->gvDataTable .= "\ndata.addColumn('string', 'Labels');";
	$this->gvDataTable .= "\ndata.addColumn('number', 'Values');";
	$this->gvDataTable .= "\ndata.addRows([";
	$num_rows = $this->datasets[0]['num_rows'];
	$comma = '';
	for ($r = 0; $r < $num_rows; $r++)
		{
		$x = $this->datasets[0]['data'][$r][COL_X];		// labels
		$y = $this->datasets[0]['data'][$r][COL_Y];		// values
		if ($add_values_to_labels)
			$x .= ' ('.$this->_formatValue($y,$this->chart_data->y_format).')';		// label includes our formatted value
		$this->gvDataTable .= $comma."\n   [".$this->_quote($x).', '.$y.']';
		$comma = ',';
		}
	$this->gvDataTable .= "]);";
	return true;
}

//-------------------------------------------------------------------------------
// Bar chart specific
// returns true or false with an error set
//
function _barChart()
{
// validate the data types
// multiple datasets, all with first column non-numeric, second column numeric

	foreach ($this->datasets as $p => $dataset)
		{
		if ($dataset['num_rows'] == 0)
			continue;						// ignore datasets with no rows
		if ($dataset['num_columns'] < 2)
			{
			$this->_error(JText::_('COM_PLOTALOT_ERROR_REQUIRES_TWO_COLUMNS_EACH'));
			return false;
			}
		if (!((!$dataset['numeric'][COL_X]) and ($dataset['numeric'][COL_Y])))
			{
			$this->_error(JText::_('COM_PLOTALOT_ERROR_NON_NUM_FIRST_NUM_SECOND').
				'<br />'.JText::_('COM_PLOTALOT_PLOT').' '.($p + 1).' '.
				$this->_datatype_message($p, COL_X).', '.JText::_('COM_PLOTALOT_AND').' '.
				$this->_datatype_message($p, COL_Y));
				return false;
			}
		}

// Chart type options

	switch ($this->chart_data->chart_type)
		{
		case CHART_TYPE_BAR_H_STACK:
			$this->gvOptions .= ",isStacked:true";
			$horizontal = true;
			break;
		case CHART_TYPE_BAR_H_GROUP:
			$horizontal = true;
			break;
		case CHART_TYPE_BAR_V_STACK:
			$this->gvOptions .= ",isStacked:true";
			$horizontal = false;
			break;
		case CHART_TYPE_BAR_V_GROUP:
			$horizontal = false;
			break;
		}

// Bar colours

	$this->gvOptions .= ",series:[";
	$comma = '';
	foreach ($this->datasets as $p => $dataset)
		{
		$this->gvOptions .= $comma;
		$this->gvOptions .= "{";
		if (!empty($this->chart_data->plot_array[$p]['colour']))
			$this->gvOptions .= "color:'".$this->chart_data->plot_array[$p]['colour']."'";
		$this->gvOptions .= "}";
		$comma = ',';
		}
	$this->gvOptions .= "]";
	
// Legend type

	switch ($this->chart_data->legend_type)
		{
		case LEGEND_LEFT:   $this->gvOptions .= ",legend:{position:'in'}"; break;
		case LEGEND_RIGHT:  $this->gvOptions .= ",legend:{position:'right'}"; break;
		case LEGEND_TOP:    $this->gvOptions .= ",legend:{position:'top'}"; break;
		case LEGEND_BOTTOM: $this->gvOptions .= ",legend:{position:'bottom'}"; break;
		case LEGEND_NONE:   $this->gvOptions .= ",legend:{position:'none'}"; break;
		}

// Axis titles and grid lines
// we only use gridlines on the Y axis

	if ($this->chart_data->show_grid)
		$y_grid_colour = "";
	else
		$y_grid_colour = "color:'transparent',";		// .. because it determines the number of labels
		
	if (($this->chart_data->y_labels == -1) or ($this->chart_data->y_labels == ''))			// auto, which means 5
		$y_grid_count = "count:5";
	else
		$y_grid_count = "count:".$this->chart_data->y_labels;
	
	$y_gridlines = ",gridlines:{".$y_grid_colour.$y_grid_count."}";
	$x_gridlines = ",gridlines:{color:'transparent'}";

// axis label formats

	if ($this->chart_data->x_format == FORMAT_NONE)
		$x_format = '';
	else
		$x_format = ",format:'".$this->_gcFormatString($this->chart_data->x_format)."'";
		
	if ($this->chart_data->y_format == FORMAT_NONE)
		$y_format = '';
	else
		$y_format = ",format:'".$this->_gcFormatString($this->chart_data->y_format)."'";
		
// X axis ranges

	if (($this->chart_data->x_start == '') and ($this->chart_data->x_end == ''))
		$x_range = '';
	else
		{
		$x_min = $this->_gcFormatNumber($this->chart_x_min,$this->chart_data->x_format);
		$x_max = $this->_gcFormatNumber($this->chart_x_max,$this->chart_data->x_format);
		$x_range = ",viewWindowMode:'explicit',viewWindow:{min:$x_min,max:$x_max}";
		}

// Y axis ranges

	if (($this->chart_data->y_start == '') and ($this->chart_data->y_end == ''))
		$y_range = '';
	else
		$y_range = ",viewWindowMode:'explicit',viewWindow:{min:".$this->chart_y_min.",max:".$this->chart_y_max."}";

// finally we are ready to specify the axis objects

	if ($horizontal)
		{
		$this->gvOptions .= ",hAxis:{title:'".$this->y_title."'".$y_gridlines.$y_format.$y_range."}";
		$this->gvOptions .= ",vAxis:{title:'".$this->x_title."'".$x_gridlines."}";
		}
	else
		{
		$this->gvOptions .= ",hAxis:{title:'".$this->x_title."'".$x_gridlines."}";
		$this->gvOptions .= ",vAxis:{title:'".$this->y_title."'".$y_gridlines.$y_format.$y_range."}";
		}
	
// merge the datasets
// we may have multiple data sets of X, Y
// we need a single dataset of X, Y1, Y2, Y3, etc

	$merged_data = array();
	$y_index = 1;
	foreach ($this->datasets as $dataset)
		{
		$num_rows = $dataset['num_rows'];
		for ($r = 0; $r < $num_rows; $r++)
			{
			$x = $dataset['data'][$r][COL_X];		// for a bar chart, X is already a string
			$y = $dataset['data'][$r][COL_Y];
			$merged_data[$x][0] = $x;				// may or may not create a new row
			$merged_data[$x][$y_index] = $y;
			}
		$y_index ++;
		}

	$this->_trace("Merged data unsorted: ".print_r($merged_data,true));
	
// sort the data if required

	if ($this->chart_data->chart_option == 1)
		ksort($merged_data);
	
	$this->_trace("Merged data sorted: ".print_r($merged_data,true));

// Build the Data Table Object
		
	$first = true;
	foreach ($this->datasets as $p => $dataset)
		{
		if ($first)
			{
			$this->gvDataTable .= "\ndata.addColumn('string', 'X');";
			$first = false;
			}
		$column_name = $dataset['legend'];
		$this->gvDataTable .= "\ndata.addColumn('number', '$column_name');";
		}
	
	$num_columns = count($this->datasets) + 1;		// Y for each dataset + the X column
	$this->_trace("num_columns = $num_columns");
	
	$this->gvDataTable .= "\ndata.addRows([";
	$num_rows = count($merged_data);
	$comma1 = '';
	foreach ($merged_data as $row)
		{
		$this->gvDataTable .= $comma1."\n   [";
		$comma2 = '';
		for ($col=0; $col < $num_columns; $col++)
			{
			if ($col == 0)					// X
				$column_value = $this->_quote($row[$col]);
			else
				{
				if (isset($row[$col]))
					$column_value = $row[$col];
				else
					$column_value = 'null';
				}
			$this->gvDataTable .= $comma2.$column_value;
			$comma2 = ',';
			}
		$this->gvDataTable .= "]";
		$comma1 = ',';
		}
	$this->gvDataTable .= "]);";

	return true;
}

//-------------------------------------------------------------------------------
// Gauge specific
// returns true or false with an error set
//
function _gaugeChart()
{
// validate the data
// one dataset with at least two columns, first column non-numeric

	if ($this->active_plots > 1)
		{
		$this->_error(JText::_('COM_PLOTALOT_ERROR_ONLY_ONE_PLOT'));
		return false;
		}

	if ($this->datasets[0]['num_columns'] < 2)
		{
		$this->_error(JText::_('COM_PLOTALOT_ERROR_REQUIRES_TWO_COLUMNS'));
		return false;
		}
	if ($this->datasets[0]['num_rows'] == 0)
		{
		$this->_error(JText::_('COM_PLOTALOT_ERROR_NO_ROWS'));
		return false;
		}
	if (!((!$this->datasets[0]['numeric'][COL_X]) and ($this->datasets[0]['numeric'][COL_Y])))
		{
		$this->_error(JText::_('COM_PLOTALOT_ERROR_NON_NUM_FIRST_NUM_SECOND').
			'<br />'.JText::_('COM_PLOTALOT_PLOT').' 1 '.
			$this->_datatype_message(0, COL_X).', '.JText::_('COM_PLOTALOT_AND').' '.
			$this->_datatype_message(0, COL_Y));
		return false;
		}
		
// Options		

	if ($this->chart_data->y_start == '')
		$this->chart_data->y_start = 0;
	$this->gvOptions .= ",min:".$this->chart_data->y_start;
	if ($this->chart_data->y_end == '')
		$this->chart_data->y_end = 100;
	$this->gvOptions .= ",max:".$this->chart_data->y_end;

// Build the Data Table Object
// Gauge charts only have one dataset
// X are the labels
// Y are the values

	$this->gvDataTable .= "\ndata.addColumn('string', 'Labels');";
	$this->gvDataTable .= "\ndata.addColumn('number', 'Values');";
	$this->gvDataTable .= "\ndata.addRows([";
	$num_rows = $this->datasets[0]['num_rows'];
	$comma = '';
	for ($r = 0; $r < $num_rows; $r++)
		{
		$x = $this->datasets[0]['data'][$r][COL_X];		// labels
		$y = $this->datasets[0]['data'][$r][COL_Y];		// values
		$this->gvDataTable .= $comma."\n   [".$this->_quote($x).', '.$y.']';
		$comma = ',';
		}
	$this->gvDataTable .= "]);";
	return true;
}

//-------------------------------------------------------------------------------
// Table Chart specific
// returns true or false with an error set
//
function _tableChart()
{
// Data types can be anything at all
// - there can only be one dataset but we don't need to validate that because the UI can't do anything else

// Options

	$this->gvOptions .= ",allowHtml:true";
	if ($this->chart_data->chart_option == 1)
		$this->gvOptions .= ",showRowNumber:true";

// build the cssClassNames

	$css_vars = '';
	$comma = '';
	foreach($this->chart_data->style_array as $key => $value)
		{
		$var_name = '';
		switch ($key)
			{
			case 'gv_head':     $var_name = 'headerRow'; break;
			case 'gv_odd':      $var_name = 'tableRow'; break;
			case 'gv_row':      $var_name = 'oddTableRow'; break;
			case 'gv_selected': $var_name = 'selectedTableRow'; break;
			case 'gv_hover':    $var_name = 'hoverTableRow'; break;
			case 'gv_hcell':    $var_name = 'headerCell'; break;
			case 'gv_tcell':    $var_name = 'tableCell'; break;
			case 'gv_numcell':  $var_name = 'rowNumberCell'; break;
			}
		if (($var_name != '') and ($value != ''))
			{													// if it's not empty
			$css_vars .= $comma.$var_name.":'".$value."'";		// specify it
			$comma = ',';
			}
		}
	if ($css_vars != '')										// if any classes were specified...
		$this->gvOptions .= ",cssClassNames:{".$css_vars.'}';	// add the option
	
// Build the Data Table Object
		
	$num_columns = $this->datasets[0]['num_columns'];
	$this->_trace("num_columns = $num_columns");

	for ($col=0; $col < $num_columns; $col++)
		{
		$column_name = $this->datasets[0]['column_names'][$col];
		$this->gvDataTable .= "\ndata.addColumn('string', '$column_name');";
		}
	
	$this->gvDataTable .= "\ndata.addRows([";
	$num_rows = $this->datasets[0]['num_rows'];
	$comma1 = '';
	for ($r = 0; $r < $num_rows; $r++)
		{
		$this->gvDataTable .= $comma1."\n   [";
		$comma2 = '';
		for ($col=0; $col < $num_columns; $col++)
			{
			$column_value = $this->datasets[0]['data'][$r][$col];
			$this->gvDataTable .= $comma2.$this->_quote($column_value);
			$comma2 = ',';
			}
		$this->gvDataTable .= "]";
		$comma1 = ',';
		}
	$this->gvDataTable .= "]);";
	return true;
}

//-------------------------------------------------------------------------------
// Draw a chart - this is the main public function
// It constructs any type of chart and returns the html
// If the chart cannot be drawn, an empty string is returned, and an error message is in $this->error
// Even if the chart is drawn, there may be warnings in $this->warning
//
function drawChart(&$chart_data,$no_trace=false)	// $chart_data is the data from a chart record
{													// $no_trace can be used to prevent tracing
// initialise all our global properties so that we can be called multiple times

	$this->error = '';					// error message to be returned
	$this->warning = '';				// warning to be returned
	$this->nulls_defaulted = false;		// flag so we only report this warning once
	$this->chart_script = '';			// the chart url (http://chart.apis.google.com/chart?...)
	$this->datasets = array();			// the dataset arrays
	$this->total_rows = 0;				// total number of rows from all queries
	$this->active_plots = 0;			// number of plots that have rows
	$this->chart_title = '';			// the resolved chart title
	$this->x_title = '';				// the resolved X axis title
	$this->y_title = '';				// the resolved Y axis title
	$this->chart_x_min;					// overall minimum X value for all datasets
	$this->chart_x_max;					// overall maximum X value for all datasets
	$this->chart_y_min;					// overall minimum Y value for all datasets
	$this->chart_y_max;					// overall maximum Y value for all datasets
//	$params = JComponentHelper::getParams(PLOTALOT_COMPONENT);  // v3.04 - get the component parameters
//	$this->select_only = $params->get('selectonly',1);			// default to true
	$this->select_only = 1;

	$this->chart_data = $chart_data;

// if the trace file exists, create a full trace

	$this->trace = false;
	if (@file_exists(PLOTALOT_TRACE_FILE) and (!$no_trace))
		{
		$this->trace = true;
		@unlink(PLOTALOT_TRACE_FILE);	// start again for each call
		$this->_trace(date("l d/m/Y H:i"));
		$this->_trace("Plotalot version: ".PLOTALOT_VERSION);
		$this->_trace("Server:           ".PHP_OS);
		$this->_trace("PHP version:      ".phpversion());
		$locale = setlocale(LC_ALL,0);
		$this->_trace("PHP Locale:       ".print_r($locale, true));
		$mysql_version = $this->_resolveQuery("select version()");
		$this->_trace("MySql version:    ".$mysql_version);
		$this->_trace("Joomla Version:   ".$this->joomla_version.'.'.$this->joomla_level);
		$langObj = JFactory::getLanguage();
		$language = $langObj->get('tag');
		$this->_trace("Joomla Language:  ".$language);
		$this->_trace("Chart Type:       ".$this->chart_data->chart_type);
		$this->_trace("Chart Data:".print_r($chart_data,true));
		}
		
// default the non-mandatory properties to avoid PHP Notice where error reporting is high

	if (!isset($this->chart_data->id))
		$this->chart_data->id = 1;
	if (!isset($this->chart_data->chart_option))
		$this->chart_data->chart_option = 0;
	if (!isset($this->chart_data->chart_title))
		$this->chart_data->chart_title = '';
	if (!isset($this->chart_data->chart_title_colour))
		$this->chart_data->chart_title_colour = '';
	if (!isset($this->chart_data->back_colour))
		$this->chart_data->back_colour = '';
	if (!isset($this->chart_data->chart_css_style))		// valid but only accessible by API
		$this->chart_data->chart_css_style = '';
	if (!isset($this->chart_data->db_host))
		$this->chart_data->db_host = '';
	if (!isset($this->chart_data->db_name))
		$this->chart_data->db_name = '';
	if (!isset($this->chart_data->db_user))
		$this->chart_data->db_user = '';
	if (!isset($this->chart_data->db_pass))
		$this->chart_data->db_pass = '';
	if (!isset($this->chart_data->show_grid))
		$this->chart_data->show_grid = '';
	if (!isset($this->chart_data->legend_type))
		$this->chart_data->legend_type = LEGEND_NONE;
	if (!isset($this->chart_data->x_title))
		$this->chart_data->x_title = '';
	if (!isset($this->chart_data->x_start))
		$this->chart_data->x_start = '';
	if (!isset($this->chart_data->x_end))
		$this->chart_data->x_end = '';
	if (!isset($this->chart_data->x_format))
		$this->chart_data->x_format = FORMAT_NUM_UK_0;
	if (!isset($this->chart_data->x_labels))
		$this->chart_data->x_labels = -1;
	if (!isset($this->chart_data->y_title))
		$this->chart_data->y_title = '';
	if (!isset($this->chart_data->y_start))
		$this->chart_data->y_start = '';
	if (!isset($this->chart_data->y_end))
		$this->chart_data->y_end = '';
	if (!isset($this->chart_data->y_format))
		$this->chart_data->y_format = FORMAT_NUM_UK_0;
	if (!isset($this->chart_data->y_labels))
		$this->chart_data->y_labels = -1;
	if (!isset($this->chart_data->extra_parms))
		$this->chart_data->extra_parms = '';
	if (!isset($this->chart_data->plot_params))
		$this->chart_data->plot_params = array();
	if (!strcmp(JPATH_COMPONENT_SITE,JPATH_COMPONENT) and (stristr(JPATH_COMPONENT,PLOTALOT_COMPONENT)))
		$this->component = 1;
	else
		$this->component = 0;
	
// get all the data we will need

	if (!$this->_getAllData())
		return '';
			
// Plotalot tables and single items are handled separately

	if (($this->chart_data->chart_type == CHART_TYPE_SINGLE_ITEM) 
	or ($this->chart_data->chart_type == CHART_TYPE_PL_TABLE))
		return $this->_drawTable();
	
// start the Google Vizualization Data Object

	$this->gvDataTable = "\nvar data = new google.visualization.DataTable();";
	
// start the Google Vizualization Options Object

	$this->gvOptions = "\nvar options = {title:'".$this->chart_title."'";
	$this->gvOptions .= ",width:".$this->chart_data->x_size;
	$this->gvOptions .= ",height:".$this->chart_data->y_size;

// background colour - if it's white we don't need to specify it

	switch ($this->chart_data->back_colour)
		{
		case 'FFFFFF': break;
		case '': $this->gvOptions .= ",backgroundColor:'transparent'"; break;
		default: $this->gvOptions .= ",backgroundColor:'#".$this->chart_data->back_colour."'";
		}
		
// title text colour

	if ($this->chart_data->chart_title_colour != '')
		$this->gvOptions .= ",titleTextStyle:{color:'#".$this->chart_data->chart_title_colour."'}";
		
// these chart specific functions continue building the data and options objects

	$gvPackages = 'corechart';
	switch ($this->chart_data->chart_type)
		{
		case CHART_TYPE_LINE:
			$gvFunction = 'LineChart';
			$ret = $this->_lineGraph();
			break;
		case CHART_TYPE_AREA:
			$gvFunction = 'AreaChart';
			$ret = $this->_lineGraph();		// ** uses LineChart code
			break;
		case CHART_TYPE_SCATTER:
			$gvFunction = 'ScatterChart';
			$ret = $this->_scatterGraph();
			break;
		case CHART_TYPE_GAUGE:
			$gvFunction = 'Gauge';
			$gvPackages = 'gauge';
			$ret = $this->_gaugeChart();
			break;
		case CHART_TYPE_BAR_H_STACK:
			$gvFunction = "BarChart";
			$ret = $this->_barChart();
			break;
		case CHART_TYPE_BAR_H_GROUP:
			$gvFunction = "BarChart";
			$ret = $this->_barChart();
			break;
		case CHART_TYPE_BAR_V_STACK:
			$gvFunction = "ColumnChart";
			$ret = $this->_barChart();
			break;
		case CHART_TYPE_BAR_V_GROUP:
			$gvFunction = "ColumnChart";
			$ret = $this->_barChart();
			break;
		case CHART_TYPE_PIE_2D:
		case CHART_TYPE_PIE_3D:
		case CHART_TYPE_PIE_2D_V:
		case CHART_TYPE_PIE_3D_V:
			$gvFunction = 'PieChart';
			$ret = $this->_pieChart();
			break;
		case CHART_TYPE_GV_TABLE:
			$gvFunction = 'Table';
			$gvPackages = 'table';
			$ret = $this->_tableChart();
			break;
		default:
			{
			$this->_error(JText::_('COM_PLOTALOT_ERROR_WRONG_CHART_TYPE'));
			return '';
			}
		}
		
	if (!$ret)
		return '';
		
// finish off the Options Object

	$extra_parms = str_replace(array("\n","\r"), "", $this->chart_data->extra_parms); 	// remove any CR's or LF's
	$this->gvOptions .= "\n".$extra_parms."};";
		
// build the chart script
	
	$chart_id = $this->chart_data->id;
	$this->chart_script .= "\n".'<script type="text/javascript">';
	$this->chart_script .= "\n"."google.load('visualization', '1.0', {packages:['$gvPackages']});";
	$this->chart_script .= "\n".'google.setOnLoadCallback(create_chart);';
	$this->chart_script .= "\n".'function create_chart() {'; 
	$this->chart_script .= $this->gvDataTable;
	$this->chart_script .= $this->gvOptions;
	$this->chart_script .= "\n"."var chart = new google.visualization.$gvFunction(document.getElementById('chart_$chart_id'));";
	$this->chart_script .= "\n"."chart.draw(data, options);";
	$this->chart_script .= "\n}";				// end of the create_chart function
	$this->chart_script .= "\n</script>";
		
	$this->_trace("Script: ".$this->chart_script);

	return $this->chart_script;
}

}
?>