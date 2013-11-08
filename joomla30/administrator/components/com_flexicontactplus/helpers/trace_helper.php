<?php
/********************************************************************
Product		: FlexicontactPlus
Date		: 16 August 2013
Copyright	: Les Arbres Design 2013
Contact		: http://extensions.lesarbresdesign.info
Licence		: GNU General Public License
*********************************************************************/
defined('_JEXEC') or die('Restricted Access');

define("LAFC_TRACE_FILE_NAME", 'trace.txt');
define("LAFC_TRACE_FILE_PATH", JPATH_ROOT.'/components/com_flexicontactplus/trace.txt');
define("LAFC_TRACE_FILE_URL", JURI::root().'components/'.LAFC_COMPONENT.'/trace.txt');
define("LAFC_MAX_TRACE_SIZE", 1000000);	// about 1Mb
define("LAFC_MAX_TRACE_AGE",   21600);		// maximum trace file age in seconds (6 hours)
define("LAFC_UTF8_HEADER",     "\xEF\xBB\xBF");	// UTF8 file header

if (class_exists("FCP_trace"))
	return;

class FCP_trace
{

//-------------------------------------------------------------------------------
// Write an entry to the trace file
// Tracing is ON if the trace file exists
// if $no_time is true, the date time is not added
//
static function trace($data)
{
	if (@!file_exists(LAFC_TRACE_FILE_PATH))
		return;
	if (filesize(LAFC_TRACE_FILE_PATH) > LAFC_MAX_TRACE_SIZE)
		{
		@unlink(LAFC_TRACE_FILE_PATH);
		@file_put_contents(LAFC_TRACE_FILE_PATH, LAFC_UTF8_HEADER.date("d/m/y H:i").' New trace file created'."\n");
		}
	@file_put_contents(LAFC_TRACE_FILE_PATH, $data."\n",FILE_APPEND);
}

//-------------------------------------------------------------------------------
// Start a new trace file
//
static function init_trace($config_model, $config_id)
{
	self::delete_trace_file();
	@file_put_contents(LAFC_TRACE_FILE_PATH, LAFC_UTF8_HEADER.date("d/m/y H:i").' Tracing Initialised'."\n");
	
	$locale = setlocale(LC_ALL,0);
	$locale_string = print_r($locale, true);
	$langObj = JFactory::getLanguage();
	$language = $langObj->get('tag');
	$php_version = phpversion();
	$version = new JVersion();
	$joomla_version = $version->RELEASE;
	$joomla_level = $version->DEV_LEVEL;
	$app = JFactory::getApplication();
	$session_lifetime = $app->getCfg('lifetime');		// session lifetime in seconds
	$live_site = $app->getCfg('live_site');	
	$caching = $app->getCfg('caching');	

	self::trace(LAFC_COMPONENT_NAME.' version '.self::getComponentVersion());
	self::trace('FCP Plugin       : '.self::getPluginStatus());
	self::trace("PHP version      : ".$php_version);
	self::trace("PHP Locale       : ".$locale_string);
	self::trace("Server           : ".PHP_OS);
	self::trace("Joomla Version   : ".$joomla_version.".".$joomla_level);
	self::trace("Joomla Language  : ".$language);
	self::trace("Session Lifetime : ".$session_lifetime.' minutes');
	self::trace("JURI::root()     : ".JURI::root());
	self::trace("Config live_site : ".$live_site);
	self::trace("Config caching   : ".$caching);
	jimport('joomla.plugin.plugin');
	if (JPluginHelper::isEnabled('system', 'cache'))
		self::trace("Sys Cache Plugin : Enabled");
	else
		self::trace("Sys Cache Plugin : Not enabled");
	if ((function_exists('get_magic_quotes_gpc')) and (get_magic_quotes_gpc()))
		self::trace("Magic Quotes     : ON");
	
	self::trace("Installed languages:");
	$language_list = FCP_Admin::make_lang_list();
	foreach ($language_list as $tag => $name)
		self::trace("   $tag => $name");

	$config_list = $config_model->getList();
	$num_configs = count($config_list);
	self::trace("There are $num_configs configuration(s)");
	foreach ($config_list as $config)
		if ($config->default_config)
			self::trace('   '.$config->name.' ('.$config->language.') ** DEFAULT **');
		else
			self::trace('   '.$config->name.' ('.$config->language.')');

//	$config_data = $config_model->getOneById($config_id);
//	$config_text = print_r($config_data,true);
//	self::trace("The current back-end configuration is $config_id: ".$config_data->name." [".$config_data->language."]:");
//	self::trace($config_text);
//	self::trace(str_repeat('=',80));
	self::trace('**********  End of header  **********');
//	self::trace(str_repeat('=',80));
}

//-------------------------------------------------------------------------------
// Trace an entry point
// Tracing is ON if the trace file exists
//
static function trace_entry_point($front=false)
{
	if (@!file_exists(LAFC_TRACE_FILE_PATH))
		return;
		
// if the trace file is more than 6 hours old, delete it, which will switch tracing off
//  - we don't want trace to be left on accidentally

	$filetime = @filectime(LAFC_TRACE_FILE_PATH);
	if (time() > ($filetime + LAFC_MAX_TRACE_AGE))
		{
		self::delete_trace_file();
		return;
		}
		
	$date_time = date("d/m/y H:i").' ';	
	
	if ($front)
		self::trace("\n".$date_time.'================================ [Front Entry Point] ================================');
	else
		self::trace("\n".$date_time.'================================ [Admin Entry Point] ================================');
		
	if ($front)
		{
		if (isset($_SERVER["REMOTE_ADDR"]))
			$ip_address = '('.$_SERVER["REMOTE_ADDR"].')';
		else
			$ip_address = '';

		if (isset($_SERVER["HTTP_USER_AGENT"]))
			$user_agent = $_SERVER["HTTP_USER_AGENT"];
		else
			$user_agent = '';

		if (isset($_SERVER["HTTP_REFERER"]))
			$referer = $_SERVER["HTTP_REFERER"];
		else
			$referer = '';
			
		$method = $_SERVER['REQUEST_METHOD'];

		self::trace("$method from $ip_address $user_agent");
		if ($referer != '')
			self::trace('Referer: '.$referer, true);
		}

	$post_data = JRequest::get('post');
	$get_data = JRequest::get('get');

	if (!empty($post_data))
		self::trace("Post data: ".print_r($post_data,true));
	if (!empty($get_data))
		self::trace("Get data: ".print_r($get_data,true));
}

//-------------------------------------------------------------------------------
// Delete the trace file
//
static function delete_trace_file()
{
	if (@file_exists(LAFC_TRACE_FILE_PATH))
		@unlink(LAFC_TRACE_FILE_PATH);
}

//-------------------------------------------------------------------------------
// Return true if tracing is currently active
//
static function tracing()
{
	if (@file_exists(LAFC_TRACE_FILE_PATH))
		return true;
	else
		return false;
}

//-------------------------------------------------------------------------------
// Make the html for the help and support page
// The controller must contain the trace_on() and trace_off() functions
//
static function make_trace_controls($controller)
{
	$html = '<div>';
	$html .= 'Diagnostic Trace Mode: ';
	$html .= '<img src="'.LAFC_ADMIN_ASSETS_URL.'info-16.png" border="0" alt="" title="Create a trace file to send to support. Please remember to switch off after use." />';
    $onclick = ' onclick="document.adminForm.controller.value=\''.$controller.'\'; document.adminForm.task.value=\'trace_on\'; document.adminForm.submit();"';
    $html .= ' <button class="fcp_button"'.$onclick.'>On</button>';
	$onclick = ' onclick="document.adminForm.controller.value=\''.$controller.'\'; document.adminForm.task.value=\'trace_off\'; document.adminForm.submit();"';
    $html .= ' <button class="fcp_button"'.$onclick.'>Off</button>';

	if (file_exists(LAFC_TRACE_FILE_PATH))
		$html .= ' <a href="'.LAFC_TRACE_FILE_URL.'" target="_blank"> Trace File</a>';
	else
		$html .= 'Tracing is currently OFF';

	$html .= '</div>';
	return $html;
}

//-------------------------------------------------------------------------------
// Get the component version from the component manifest XML file
//
static function getComponentVersion()
{
	if (file_exists(JPATH_COMPONENT_ADMINISTRATOR.'/joomla16.xml'))
		$xml_file = 'joomla16.xml';
	else
		$xml_file = 'joomla15.xml';
	$xml_array = JApplicationHelper::parseXMLInstallFile(JPATH_COMPONENT_ADMINISTRATOR.'/'.$xml_file);
	return $xml_array['version'];
}

//-------------------------------------------------------------------------------
// Get the plugin status
//
static function getPluginStatus()
{
	if (LAFC_JVERSION == 150)
		$plugin_path = '/plugins/content/flexicontactplus.xml';
	else
		$plugin_path = '/plugins/content/flexicontactplus/flexicontactplus.xml';

	if (!file_exists(JPATH_ROOT.$plugin_path))
		return 'Not installed';
		
	$xml_array = JApplicationHelper::parseXMLInstallFile(JPATH_ROOT.$plugin_path);
	$version = $xml_array['version'];
		
	if (JPluginHelper::isEnabled('content', 'flexicontactplus'))
		return 'Version '.$version.' installed and enabled';
		
	return 'Version '.$version.' installed but disabled';
}


}