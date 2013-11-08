<?php
/********************************************************************
Product		: FlexiContactPlus
Date		: 28 September 2013
Copyright	: Les Arbres Design 2013
Contact		: http://extensions.lesarbresdesign.info
Licence		: GNU General Public License
*********************************************************************/
defined('_JEXEC') or die('Restricted Access');

// date formats for the Joomla date picker

define("FCPJ_DATE_FORMAT_1", "%Y-%m-%d");	// 2009-01-31
define("FCPJ_DATE_FORMAT_2", "%d-%m-%y");	// 31-01-09
define("FCPJ_DATE_FORMAT_3", "%m-%d-%y");	// 01-31-09
define("FCPJ_DATE_FORMAT_4", "%d-%m-%Y");	// 31-01-2009
define("FCPJ_DATE_FORMAT_5", "%m-%d-%Y");	// 01-31-2009
define("FCPJ_DATE_FORMAT_6", "%d.%m.%Y");	// 31.01.2009
define("FCPJ_DATE_FORMAT_7", "%d.%m.%y");	// 31.01.09

// date formats for the Jquery date picker

define("FCPQ_DATE_FORMAT_1", "yy-mm-dd");	// 2009-01-31
define("FCPQ_DATE_FORMAT_2", "dd-mm-y");	// 31-01-09
define("FCPQ_DATE_FORMAT_3", "mm-dd-y");	// 01-31-09
define("FCPQ_DATE_FORMAT_4", "dd-mm-yy");	// 31-01-2009
define("FCPQ_DATE_FORMAT_5", "mm-dd-yy");	// 01-31-2009
define("FCPQ_DATE_FORMAT_6", "dd.mm.yy");	// 31.01.2009
define("FCPQ_DATE_FORMAT_7", "dd.mm.y");	// 31.01.09

// date formats for the Mootools date picker

define("FCPM_DATE_FORMAT_1", "Y-m-d");		// 2009-01-31
define("FCPM_DATE_FORMAT_2", "d-m-y");		// 31-01-09
define("FCPM_DATE_FORMAT_3", "m-d-y");		// 01-31-09
define("FCPM_DATE_FORMAT_4", "d-m-Y");		// 31-01-2009
define("FCPM_DATE_FORMAT_5", "m-d-Y");		// 01-31-2009
define("FCPM_DATE_FORMAT_6", "d.m.Y");		// 31.01.2009
define("FCPM_DATE_FORMAT_7", "d.m.y");		// 31.01.09

if (class_exists("FCP_date_picker"))
	return;

class FCP_date_picker
{
//---------------------------------------------------------------------------------------------
// Make a date picker field for the front end and load whatever Javascript is required
//
static function make_date_field($config_data, $field_id, $date_value)
{
	$date_picker = $config_data->date_picker;
	$date_format = $config_data->date_format;
	$start_day = $config_data->start_day;
	$field_index = intval(substr($field_id,5,3));					// field id's are 'fieldnnn'
	$field_config = &$config_data->all_fields[$field_index];		// point to the field configuration
	$validation_type = $field_config->validation_type;
	
	switch ($date_picker)
		{
		case '010':
			self::load_picker_joomla($date_format, $start_day, $field_id);
			break;
		case '100':
			self::load_picker_jquery($date_format, $start_day, $field_id, 'default', $validation_type);
			break;
		case '101':
			self::load_picker_jquery($date_format, $start_day, $field_id, 'sunny', $validation_type);
			break;
		case '200':
			self::load_picker_moo($date_format, $start_day, $field_id, 'grey', $validation_type);
			break;
		case '201':
			self::load_picker_moo($date_format, $start_day, $field_id, 'gold', $validation_type);
			break;
		case '202':
			self::load_picker_moo($date_format, $start_day, $field_id, 'green', $validation_type);
			break;
		case '203':
			self::load_picker_moo($date_format, $start_day, $field_id, 'blue', $validation_type);
			break;
		case '204':
			self::load_picker_moo($date_format, $start_day, $field_id, 'sunny', $validation_type);
			break;
		}

// The html 5 date picker is invoked by specifying a field type of 'date'
// all other date pickers use a field type of 'text'

	if ($date_picker == '001')
		$html = "\n".'<input type="date" maxlength="10" name="'.$field_id.'" id="'.$field_id.'" value="'.$date_value.'" />';
	else
		$html = "\n".'<input type="text" maxlength="10" name="'.$field_id.'" id="'.$field_id.'" value="'.$date_value.'" />';

	return $html;		
}

//---------------------------------------------------------------------------------------------
// Get the list of date pickers for the back end
//
static function date_picker_list()
{
	$pickers        = array();
	if (LAFC_JVERSION == 150)
		$pickers['0'] = ucfirst(JText::_('NONE'));
	else
		$pickers['0'] = ucfirst(JText::_('JNONE'));
	$pickers['001'] = 'HTML 5';
	$pickers['010'] = 'Joomla';
	$pickers['100'] = 'JQuery (grey)';
	$pickers['101'] = 'JQuery (sunny)';
	$pickers['200'] = 'Mootools (grey)';
	$pickers['201'] = 'Mootools (gold)';
	$pickers['202'] = 'Mootools (green)';
	$pickers['203'] = 'Mootools (blue)';
	$pickers['204'] = 'Mootools (sunny)';
	return $pickers;
}

//---------------------------------------------------------------------------------------------
// Get the list of validation types for the back end
//
static function validation_type_list()
{
	$validation_types = array();
	$validation_types[VALTYPE_ANY]    = JText::_('COM_FLEXICONTACT_VALTYPE_ANY');
	$validation_types[VALTYPE_PAST]   = JText::_('COM_FLEXICONTACT_VALTYPE_PAST');
	$validation_types[VALTYPE_FUTURE] = JText::_('COM_FLEXICONTACT_VALTYPE_FUTURE');
	$validation_types[VALTYPE_GREATER] = JText::_('COM_FLEXICONTACT_VALTYPE_GREATER');
	return $validation_types;
}

//---------------------------------------------------------------------------------------------
// Load the Joomla date picker on the front end
//
static function load_picker_joomla($date_format, $start_day, $field_id)
{
	if (LAFC_JVERSION >= 160)				// from 1.6.3 Mootools is not loaded automatically by behavior.calendar
		JHtml::_('behavior.framework');		// load MooTools

	JHtml::_('behavior.calendar');

	$date_format_string = Constant("FCPJ_DATE_FORMAT_".$date_format);
	$document = JFactory::getDocument();
	$document->addScriptDeclaration('window.addEvent(\'domready\', function() {Calendar.setup({
		inputField     :    "'.$field_id.'",     		// id of the input field
		ifFormat       :    "'.$date_format_string.'",	// format of the input field
		align          :    "Tl",           			// alignment (defaults to "Bl")
		singleClick    :    true,
		firstDay       :    '.$start_day.' });});');
}

//---------------------------------------------------------------------------------------------
// Load the JQuery date picker on the front end
// - if theme exists in <current_template>/com_rentalotplus use that one
// - if not, use the default one in components/com_rentalotplus
//
static function load_picker_jquery($date_format, $start_day, $field_id, $theme, $validation_type)
{
	static $jquery_loaded;
	$document = JFactory::getDocument();
	$template = JFactory::getApplication()->getTemplate();
	
	if (!isset($jquery_loaded))
		{
		$date_format_string = Constant("FCPQ_DATE_FORMAT_".$date_format);
		$month_names = '["'.JText::_('JANUARY').'","'.JText::_('FEBRUARY').'","'.JText::_('MARCH').'","'.JText::_('APRIL').'","'.JText::_('MAY').'","'.JText::_('JUNE').'","'.JText::_('JULY').'","'.JText::_('AUGUST').'","'.JText::_('SEPTEMBER').'","'.JText::_('OCTOBER').'","'.JText::_('NOVEMBER').'","'.JText::_('DECEMBER').'"]';
		$day_names = '["'.JText::_('SUNDAY').'","'.JText::_('MONDAY').'","'.JText::_('TUESDAY').'","'.JText::_('WEDNESDAY').'","'.JText::_('THURSDAY').'","'.JText::_('FRIDAY').'","'.JText::_('SATURDAY').'"]';
		$month_names_short = '["'.JText::_('JANUARY_SHORT').'","'.JText::_('FEBRUARY_SHORT').'","'.JText::_('MARCH_SHORT').'","'.JText::_('APRIL_SHORT').'","'.JText::_('MAY_SHORT').'","'.JText::_('JUNE_SHORT').'","'.JText::_('JULY_SHORT').'","'.JText::_('AUGUST_SHORT').'","'.JText::_('SEPTEMBER_SHORT').'","'.JText::_('OCTOBER_SHORT').'","'.JText::_('NOVEMBER_SHORT').'","'.JText::_('DECEMBER_SHORT').'"]';
		$day_names_short = '["'.JText::_('SUN').'","'.JText::_('MON').'","'.JText::_('TUE').'","'.JText::_('WED').'","'.JText::_('THU').'","'.JText::_('FRI').'","'.JText::_('SAT').'"]';

		if (function_exists('mb_substr'))	// try to use this if possible for proper substr of non-English characters
			$day_names_min = '["'.mb_substr(JText::_('SUN'),0,2,'UTF-8').'","'.mb_substr(JText::_('MON'),0,2,'UTF-8').'","'.mb_substr(JText::_('TUE'),0,2,'UTF-8').'","'.mb_substr(JText::_('WED'),0,2,'UTF-8').'","'.mb_substr(JText::_('THU'),0,2,'UTF-8').'","'.mb_substr(JText::_('FRI'),0,2,'UTF-8').'","'.mb_substr(JText::_('SAT'),0,2,'UTF-8').'"]';
		else
			$day_names_min = '["'.substr(JText::_('SUN'),0,2).'","'.substr(JText::_('MON'),0,2).'","'.substr(JText::_('TUE'),0,2).'","'.substr(JText::_('WED'),0,2).'","'.substr(JText::_('THU'),0,2).'","'.substr(JText::_('FRI'),0,2).'","'.substr(JText::_('SAT'),0,2).'"]';

		$css_path = 'components/com_flexicontactplus/assets/jquery/themes/'.$theme.'/jquery.ui.all.css';
		$document->addStyleSheet($css_path);

		if (LAFC_JVERSION >= 300)					// Joomla 3.x always loads JQuery 1.8.1 BUT ...
			JHtml::_('bootstrap.framework');		// this makes sure JQuery gets loaded before the other scripts loaded here
		else										// for older versions we need to load it ...
			{
			$document->addScript('//ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js');
			$document->addScript('components/com_flexicontactplus/assets/jquery/jquery-noconflict.js');
			}
		$document->addScript('//ajax.googleapis.com/ajax/libs/jqueryui/1.8.1/jquery-ui.min.js');
		$document->addScript('components/com_flexicontactplus/assets/jquery/ui/jquery.ui.widget.js');
		$document->addScript('components/com_flexicontactplus/assets/jquery/ui/jquery.ui.datepicker.js');
		$js = "\n jQuery(function() {jQuery.datepicker.regional[''] = {
				closeText: 'Done',
				prevText: '".JText::_('JPREV')."',
				nextText: '".JText::_('JNEXT')."',
				currentText: 'Today',
				monthNames: ".$month_names.",
				monthNamesShort: ".$month_names_short.",
				dayNames: ".$day_names.",
				dayNamesShort: ".$day_names_short.",
				dayNamesMin: ".$day_names_min.",
				weekHeader: 'Wk',
				dateFormat: '".$date_format_string."',
				firstDay: ".$start_day.",
				isRTL: false,
				showMonthAfterYear: false,
				yearSuffix: ''};
			jQuery.datepicker.setDefaults(jQuery.datepicker.regional['']);
			});";
		$document->addScriptDeclaration($js);
		$jquery_loaded = true;
		}

// use JQuery's min or max date to enforce dates in the past or future

	switch ($validation_type)
		{
		case VALTYPE_PAST:   $params = '{maxDate:0}'; break;
		case VALTYPE_FUTURE: $params = '{minDate:0}'; break;
		default:             $params = '';
		}

	$js = "\njQuery(function() {jQuery('#".$field_id."').datepicker(".$params.");});";
	
	$document->addScriptDeclaration($js);
}

//---------------------------------------------------------------------------------------------
// Load the Mootools date picker on the front end
// - if theme exists in <current_template>/com_rentalotplus use that one
// - if not, use the default one in components/com_rentalotplus
//
static function load_picker_moo($date_format, $start_day, $field_id, $theme, $validation_type)
{
	$document = JFactory::getDocument();
	$template = JFactory::getApplication()->getTemplate();
	
	$month_names = '["'.JText::_('JANUARY').'","'.JText::_('FEBRUARY').'","'.JText::_('MARCH').'","'.JText::_('APRIL').'","'.JText::_('MAY').'","'.JText::_('JUNE').'","'.JText::_('JULY').'","'.JText::_('AUGUST').'","'.JText::_('SEPTEMBER').'","'.JText::_('OCTOBER').'","'.JText::_('NOVEMBER').'","'.JText::_('DECEMBER').'"]';
	$day_names = '["'.JText::_('SUNDAY').'","'.JText::_('MONDAY').'","'.JText::_('TUESDAY').'","'.JText::_('WEDNESDAY').'","'.JText::_('THURSDAY').'","'.JText::_('FRIDAY').'","'.JText::_('SATURDAY').'"]';
	$date_format_string = Constant("FCPM_DATE_FORMAT_".$date_format);

	$css_path = 'components/com_flexicontactplus/assets/mtcal/themes/'.$theme.'/'.$theme.'.css';
	$document->addStyleSheet($css_path);
	
	switch (LAFC_JVERSION)
		{
		case 150:
			JHtml::_('behavior.mootools');			// load MooTools
			$document->addScript('components/com_flexicontactplus/assets/mtcal/mtcal_1.1.js');
			break;
		case 160:
		case 170:
		case 250:
			JHtml::_('behavior.framework');			// load MooTools before the date picker
			$document->addScript('components/com_flexicontactplus/assets/mtcal/mtcal_1.2.js');
			break;
		default:									// Joomla 3.0 and above
			JHtml::_('behavior.framework');			// load MooTools before the date picker
			$document->addScript('components/com_flexicontactplus/assets/mtcal/mtcal_1.4.js');
			break;
		}

// use the direction parameter to enforce dates in the past or future

	switch ($validation_type)
		{
		case VALTYPE_PAST:   $direction = ', direction:-.5'; break;
		case VALTYPE_FUTURE: $direction = ', direction:.5'; break;
		default:             $direction = '';
		}

	$params = "{ classes:['$theme'], days:$day_names, months:$month_names, tweak:{x: -100, y: 25}, offset:$start_day $direction }";

	$js = "\n window.addEvent('domready', function() { 
			fcp_cal_".$field_id." = new Calendar({ ".$field_id.":'$date_format_string' }, $params); })";

	$document->addScriptDeclaration($js);
}

}