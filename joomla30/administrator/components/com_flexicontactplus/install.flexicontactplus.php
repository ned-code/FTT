<?php
/********************************************************************
Product		: FlexicontactPlus
Date		: 01 July 2013
Copyright	: Les Arbres Design 2009-2013
Contact		: http://extensions.lesarbresdesign.info
Licence		: GNU General Public License
*********************************************************************/
defined('_JEXEC') or die('Restricted Access');

// if we get called by an <installfile> xml element, we will enter here, not via the InstallerScript class

$installer = new com_flexicontactplusInstallerScript;
return $installer->fcp_install($this);
	
// if we get called by a <scriptfile> xml element, the installer will call the various functions of the InstallerScript class

class com_flexicontactplusInstallerScript
{
public function __constructor(JAdapterInstance $adapter) { }
public function preflight($route, JAdapterInstance $adapter) { }
public function install(JAdapterInstance $adapter) { }
public function update(JAdapterInstance $adapter) { }
public function uninstall(JAdapterInstance $adapter)
{ 
	echo "<h2>FlexicontactPlus has been uninstalled</h2>";
	echo "<h2>The database tables were NOT deleted</h2>";
}
public function postflight($route, JAdapterInstance $adapter)
{
	$this->fcp_install($adapter);
}

//-------------------------------------------------------------------------------
// The main install function
//
function fcp_install($adapter)
{
	$this->helper = new LA_install;				// instantiate our install helper class
	$this->db = JFactory::getDBO();
	$component_version = $this->helper->get_component_version($adapter);
	if ($component_version === false)
		return false;
		
// delete files from old versions

	@unlink(JPATH_SITE.'/administrator/components/com_flexicontactplus/admin.flexicontactplus.php');
	@unlink(JPATH_SITE.'/administrator/components/com_flexicontactplus/flexicontactplus.xml');
	@unlink(JPATH_SITE.'/components/com_flexicontactplus/views/_confirm/index.html');
	@unlink(JPATH_SITE.'/components/com_flexicontactplus/views/_confirm/view.html.php');
	@rmdir(JPATH_SITE.'/components/com_flexicontactplus/views/_confirm');
	@unlink(JPATH_SITE.'/components/com_flexicontactplus/assets/asterisk.png');
	@unlink(JPATH_SITE.'/components/com_flexicontactplus/assets/fcp_button.png');
	@unlink(JPATH_SITE.'/components/com_flexicontactplus/assets/fcp_button_hover.png');
	@unlink(JPATH_SITE.'/components/com_flexicontactplus/assets/reload_24.png');
	@unlink(JPATH_SITE.'/components/com_flexicontactplus/assets/reload_32.png');
	@unlink(JPATH_SITE.'/components/com_flexicontactplus/assets/js/fcp_front_1.js');
	@unlink(JPATH_SITE.'/components/com_flexicontactplus/assets/js/uncompressed-fcp_front_1.js');
	@unlink(JPATH_SITE.'/components/com_flexicontactplus/assets/js/fcp_front_2.js');
	@unlink(JPATH_SITE.'/components/com_flexicontactplus/assets/js/uncompressed-fcp_front_2.js');
	@unlink(JPATH_SITE.'/components/com_flexicontactplus/assets/js/fcp_front_3.js');
	@unlink(JPATH_SITE.'/components/com_flexicontactplus/assets/js/uncompressed-fcp_front_3.js');
	
// Check that our config table exists

	if (!$this->helper->table_exists('#__flexicontact_plus_config'))
		{
		$table_name = $this->helper->replaceDbPrefix('#__flexicontact_plus_config');
		$query = "CREATE TABLE IF NOT EXISTS `#__flexicontact_plus_config` (
			  `id` int(11) NOT NULL AUTO_INCREMENT,
			  `name` varchar(60) NOT NULL,
			  `published` tinyint(4) NOT NULL DEFAULT '1',
			  `default_config` tinyint(1) NOT NULL DEFAULT '0',
			  `language` varchar(10) NOT NULL,
			  `description` varchar(255) NOT NULL,
			  `config_data` mediumtext NOT NULL,
			  PRIMARY KEY (`id`),
			  KEY `NAME_LANG` (`name`, `language`)
			) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1" ;
		if (!$this->helper->do_sql($query))
			echo 'Failed to create '.$table_name;
		}

	if (!$this->helper->table_exists('#__flexicontact_plus_config'))
		{
		$table_name = $this->helper->replaceDbPrefix('#__flexicontact_plus_config');
		echo '<font color="red">';
		echo '<h3>Flexicontact Plus '.$component_version.' did NOT install correctly.</h3>';
		echo 'The database table '.$table_name.' does not exist.<br />';
		echo 'Please check your database permissions, then uninstall the component and re-install it.<br />';
		echo '</font>';
		return false;
		}

// check that our log table exists	

	if (!$this->helper->table_exists('#__flexicontact_plus_log'))
		{
		$table_name = $this->helper->replaceDbPrefix('#__flexicontact_plus_log');
		$query = "CREATE TABLE IF NOT EXISTS `#__flexicontact_plus_log` (
			 `id` int(11) NOT NULL AUTO_INCREMENT,
			 `datetime` datetime NOT NULL,
			 `name` varchar(60) NOT NULL DEFAULT '',
			 `email` varchar(60) NOT NULL DEFAULT '',
			 `admin_email` varchar(60) NOT NULL DEFAULT '',
			 `config_name` varchar(60) NOT NULL DEFAULT '',
			 `config_lang` varchar(10) NOT NULL DEFAULT '',
			 `subject` varchar(100) NOT NULL DEFAULT '',
			 `message` text NOT NULL,
			 `status_main` varchar(255) NOT NULL DEFAULT '',
			 `status_copy` varchar(255) NOT NULL DEFAULT '',
			 `ip` varchar(40) NOT NULL DEFAULT '',
			 `browser_id` tinyint(4) NOT NULL DEFAULT '0',
			 `browser_string` varchar(20) NOT NULL DEFAULT '',
			 `imported` tinyint(4) NOT NULL DEFAULT '0',
			 PRIMARY KEY (`id`),
			 KEY `DATETIME` (`datetime`)
			) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;" ;	
		if (!$this->helper->do_sql($query))
			echo 'Failed to create '.$table_name;
		}

	if (!$this->helper->table_exists('#__flexicontact_plus_log'))
		{
		$table_name = $this->helper->replaceDbPrefix('#__flexicontact_plus_log');
		echo '<font color="red">';
		echo '<h3>Flexicontact Plus '.$component_version.' did NOT install correctly.</h3>';
		echo 'The database table '.$table_name.' does not exist.<br />';
		echo 'Please check your database permissions, then uninstall the component and re-install it.<br />';
		echo '</font>';
		return false;
		}

// add new columns

	$this->helper->add_column('#__flexicontact_plus_log', 'admin_email', "VARCHAR(60) NOT NULL DEFAULT '' AFTER `email`");
	$this->helper->add_column('#__flexicontact_plus_log', 'imported', "tinyint(4) NOT NULL DEFAULT '0'");
	$this->helper->add_column('#__flexicontact_plus_log', 'config_name', "VARCHAR(60) NOT NULL DEFAULT '' AFTER `admin_email`");
	$this->helper->add_column('#__flexicontact_plus_log', 'config_lang', "VARCHAR(10) NOT NULL DEFAULT '' AFTER `config_name`");

// Check that the default configuration exists

	if (!self::checkDefaultConfig())
		{
		echo '<h3>Flexicontact Plus detected a problem while installing the default configuration data <br />'
			.'Please copy the error information above and contact support</h3>';
		return false;
		}
		
// map old css files to the new ones

	$this->upgradeCSS();

// we are done

	echo "<h4>Flexicontact Plus version $component_version installed.</h4>";
	return true;
}

//-------------------------------------------------------------------------------
// Migrate any old css file names to their new equivalents
//
function upgradeCSS()
{
	$css_map = array(
		'com_fcp.css' => 'fcp.css',
		'com_fcp_black_gold.css' => 'fcp_black_gold.css',
		'com_fcp_grey_black.css' => 'fcp_grey_black.css',
		'com_fcp_holiday.css' => 'fcp_holiday.css',
		'com_fcp_large.css' => 'fcp_large.css',
		'com_fcp_responsive.css' => 'fcp_simple.css',
		'com_fcp_responsive_black_gold.css' => 'fcp_black_gold.css',
		'com_fcp_rl_grey.css' => 'fcp_rl_grey.css',
		'com_fcp_silver.css' => 'fcp_silver.css',
		'com_fcp_simple.css' => 'fcp_simple.css',
		'com_fcp_simple_2.css' => 'fcp_simple_2.css',
		'com_fcp_small_1.css' => 'fcp_small_1.css',
		'com_fcp_small_2.css' => 'fcp_small_2.css');

	$site_assets_path = JPATH_ROOT.'/components/com_flexicontactplus/assets';
		
// we only want to do any of this if any of the old css files exist in the assets directory

	$old_files_exist = false;
	foreach ($css_map as $old_css_name => $new_css_name)
		if (file_exists($site_assets_path.'/'.$old_css_name))
			$old_files_exist = true;
	if (!$old_files_exist)
		return;
		
	$query = "SELECT * from `#__flexicontact_plus_config`;";
	$this->db->setQuery($query);
	$rows = $this->db->loadObjectList();
	if ($this->db->getErrorNum())
		{
		echo $this->db->stderr();
		return;
		}
	$css_changed = false;
	foreach ($rows as $row) 
		{
		$config_data = unserialize($row->config_data);
		if (isset($config_data->css_file))					// does this config have a css filename?
			{
			$old_css_name = $config_data->css_file;
			if (isset($css_map[$old_css_name]))				// do we have a mapping for it?
				{
				$new_css_name = $css_map[$old_css_name];
				echo '['.$row->name.' config] '.$old_css_name.' -> '.$new_css_name.'<br />';
				$config_data->css_file = $new_css_name;
				$serialized_config_data = serialize($config_data);
				$query = "UPDATE `#__flexicontact_plus_config` SET 
							`config_data` = ".$this->db->Quote($serialized_config_data)."
							WHERE `id` = ".$row->id;
				$this->db->setQuery($query);
				$this->db->query();
				if ($this->db->getErrorNum())
					{
					echo $this->db->stderr();
					return;
					}
				$css_changed = true;
				}
			}
		}
		
	@mkdir($site_assets_path.'/old_css_files');
	foreach ($css_map as $old_css_name => $new_css_name)
		@rename($site_assets_path.'/'.$old_css_name,$site_assets_path.'/old_css_files/'.$old_css_name);

	if ($css_changed)
		echo '<br /><strong>Some CSS files were upgraded. Your old CSS files are stored in '.$site_assets_path.'/old_css_files</strong>';
}

//-------------------------------------------------------------------------------
// Make sure that the default configuration exists
//
static function checkDefaultConfig()
{
	$db = JFactory::getDBO();

// Do we have a default configuration already?

	$db->setQuery("SELECT COUNT(*) FROM `#__flexicontact_plus_config` WHERE `default_config`=1");
	$count = $db->loadResult();
	if ($count == 0)
		{
		$ret =  self::makeDefaultConfig();
		return $ret;
		}
		
// Make sure there is no more than one default config
// (can happen when importing configs from other databases)

	$query = "SELECT * FROM `#__flexicontact_plus_config` WHERE `default_config` = 1 ORDER BY `id`";
	$db->setQuery($query);
	$rows = $db->loadObjectList();
	if ($db->getErrorNum())
		{
		echo $db->stderr();
		return false;
		}
	if (count($rows) == 1)
		return true;
		
// if more than one, change all except the first one to non-default

	$first_default_id = $rows[0]->id;
	$query = "UPDATE `#__flexicontact_plus_config` SET `default_config` = 0 WHERE `id` != ".$first_default_id;
	$db->setQuery($query);
	$db->query();
	if ($db->getErrorNum())
		{
		echo $db->stderr();
		return false;
		}

	return true;
}

//-------------------------------------------------------------------------------
// Create the default configuration
//
static function makeDefaultConfig()
{
	$app = JFactory::getApplication();
	$db = JFactory::getDBO();
	
	$default = new stdClass();
	$default->published = 1;
	$default->default_config = 1;
	$default->name = 'Default';
	$default->language = 'en-GB';
	$default->description = 'Default Configuration';
	$default->config_data = new stdClass();
		$default->config_data->email_html = 1;
		$default->config_data->num_images = 0;
		$default->config_data->email_to = $app->getCfg('mailfrom');
		$default->config_data->all_fields = array();
			$default->config_data->all_fields[0] = new stdClass();
				$default->config_data->all_fields[0]->field_type = 2;
				$default->config_data->all_fields[0]->prompt = 'Your name';
				$default->config_data->all_fields[0]->width = '';
				$default->config_data->all_fields[0]->height = 4;
				$default->config_data->all_fields[0]->list_list = '';
				$default->config_data->all_fields[0]->mandatory = 1;
				$default->config_data->all_fields[0]->visible = 1;
				$default->config_data->all_fields[0]->default_value = '';
			$default->config_data->all_fields[1] = new stdClass();
				$default->config_data->all_fields[1]->field_type = 1;
				$default->config_data->all_fields[1]->prompt = 'Your E-mail address';
				$default->config_data->all_fields[1]->width = '';
				$default->config_data->all_fields[1]->height = 4;
				$default->config_data->all_fields[1]->list_list = '';
				$default->config_data->all_fields[1]->mandatory = 1;
				$default->config_data->all_fields[1]->visible = 1;
				$default->config_data->all_fields[1]->default_value = '';
			$default->config_data->all_fields[2] = new stdClass();
				$default->config_data->all_fields[2]->field_type = 3;
				$default->config_data->all_fields[2]->prompt = 'Subject';
				$default->config_data->all_fields[2]->width = '';
				$default->config_data->all_fields[2]->height = 4;
				$default->config_data->all_fields[2]->list_list = '';
				$default->config_data->all_fields[2]->mandatory = 1;
				$default->config_data->all_fields[2]->visible = 1;
				$default->config_data->all_fields[2]->default_value = '';
			$default->config_data->all_fields[3] = new stdClass();
				$default->config_data->all_fields[3]->field_type = 6;
				$default->config_data->all_fields[3]->prompt = 'Message';
				$default->config_data->all_fields[3]->width = '';
				$default->config_data->all_fields[3]->height = 5;
				$default->config_data->all_fields[3]->list_list = '';
				$default->config_data->all_fields[3]->mandatory = 0;
				$default->config_data->all_fields[3]->visible = 1;
				$default->config_data->all_fields[3]->default_value = '';
		$default->config_data->confirm_text = '<p>Your message has been sent</p>';
		$default->config_data->user_template = '<p>%V_ALL_DATA%</p>';
		$default->config_data->admin_template = '<p>From %V_FROM_NAME% at %V_FROM_EMAIL%</p><p>%V_OTHER_DATA%</p>';
		
	$serialized_config_data = serialize($default->config_data);
	
	$query = "INSERT INTO `#__flexicontact_plus_config`	(`published`, `default_config`, `name`, `language`, `description`, `config_data`) VALUES (".
		$default->published.','.
		$default->default_config.','.
		$db->Quote($default->name).','.
		$db->Quote($default->language).','.
		$db->Quote($default->description).','.
		$db->Quote($serialized_config_data).')';

	$db->setQuery($query);
	
	$db->query();
	if ($db->getErrorNum())
		{
		echo $db->stderr();
		return false;
		}
	return true;

}
} // end of class definition

		
//********************************************************************************
//
// The following helper class is common to all our installers.
// Nothing in this class is specific to any particular component.
//
//********************************************************************************

class LA_install
{
//-------------------------------------------------------------------------------
// Constructor
//
function LA_install()
{
	$this->db = JFactory::getDBO();
	$version = new JVersion();
	$this->joomla_version = $version->RELEASE;

// check the PHP version

	$php_version = phpversion();
	if ($php_version{0} < 5)
		echo "<h2>Warning: You are running an old version of PHP ($php_version) This extension requires at least version 5.0.</h2>";

// check the MySql version

	$this->db->setQuery("SELECT version()");
	$mysql_version = $this->db->loadResult();
	if ($mysql_version{0} < 5)
		echo "<h2>Warning: You are running an old version of MySql ($mysql_version) This extension requires at least version 5.0.</h2>";
}

//-------------------------------------------------------------------------------
// Check the Joomla version and get the component version from the component manifest xml file
//
function get_component_version($adapter)
{
	switch ($this->joomla_version)
		{
		case '1.0':
			echo '<h3>'."Cannot run on this version of Joomla ($joomla_version)".'</h3>';
			return false;
		case '1.5':
			$component_version = $adapter->manifest->version[0]->_data;
			break;
		case '1.6':
		case '1.7':
		case '2.5':
		case '3.0':
		case '3.1':
			$component_version = $adapter->get('manifest')->version;
			break;
		default:
			$component_version = $adapter->get('manifest')->version;
			$component_name = $adapter->get('manifest')->name;
			echo "<h3>Warning: This version of $component_name has not been tested on this version of Joomla ($this->joomla_version).</h3>";
			echo "<h3>Some functions may not work properly.</h3>";
			break;
		}
		
	return $component_version;
}

//-------------------------------------------------------------------------------
// Check whether a table exists in the database. Returns TRUE if exists, FALSE if it doesn't
//
function table_exists($table)
{
	$tables = $this->db->getTableList();
	$table = $this->replaceDbPrefix($table);
	if (self::in_arrayi($table,$tables))
		return true;
	else
		return false;
}

//-------------------------------------------------------------------------------
// Check whether a column exists in a table. Returns TRUE if exists, FALSE if it doesn't
//
function column_exists($table, $column)
{
	if ($this->joomla_version < 3.0)
		{
		$result = $this->db->getTableFields($table);
		$fields = &$result[$table];
		}
	else
		{
		$result = $this->db->getTableColumns($table);
		$fields = &$result;
		}
	if ($fields === null)
		return false;
	if (array_key_exists($column,$fields))
		return true;
	else
		return false;
}

//-------------------------------------------------------------------------------
// Add a column if it doesn't exist (the table must exist)
//
function add_column($table, $column, $details)
{
	if ($this->column_exists($table, $column))
		return true;
	$query = 'ALTER TABLE `'.$table.'` ADD `'.$column.'` '.$details;
	$this->db->setQuery($query);
	$this->db->query();
	if ($this->db->getErrorNum())
		{
		echo $this->db->stderr();
		return false;
		}
	return true;
}

//-------------------------------------------------------------------------------
// Change a column if it exists 
//
function change_column($table, $column, $details)
{
	if (!$this->column_exists($table, $column))
		return;
	$query = 'ALTER IGNORE TABLE `'.$table.'` CHANGE `'.$column.'` '.$details;
	$this->db->setQuery($query);
	$this->db->query();
	if ($this->db->getErrorNum())
		{
		echo $this->db->stderr();
		return false;
		}
}

//-------------------------------------------------------------------------------
// Miscellaneous SQL
//
function do_sql($query)
{
   	$this->db->setQuery($query);
   	$this->db->query();
   	if ($this->db->getErrorNum())
      	{
      	echo $this->db->stderr();
      	return false;
      	}
    return true;
}

//-------------------------------------------------------------------------------
// Miscellaneous SQL, ignoring errors
//
function do_sql_ignore($query)
{
	try
		{
		$this->db->setQuery($query);
		$this->db->query();
		}
 	catch (Exception $e)
		{
		}
 }

//-------------------------------------------------------------------------------
// Joomla 1.7 took away replacePrefix() for some unknown reason
//
function replaceDbPrefix($sql)
{
	$app = JFactory::getApplication();
	$dbprefix = $app->getCfg('dbprefix');
	return str_replace('#__',$dbprefix,$sql);
}

//-------------------------------------------------------------------------------
// Case insensitive in_array()
//
static function in_arrayi($needle, $haystack)
{
    return in_array(strtolower($needle), array_map('strtolower', $haystack));
}

//-------------------------------------------------------------------------------
// Used for debugging
//
static function trace($data)
{
	@file_put_contents(JPATH_ROOT.'/trace.txt', $data."\n",FILE_APPEND);
}


} // end of class definition


?>
