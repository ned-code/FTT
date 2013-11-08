<?php
/**
* @version 1.4.0
* @package RSFirewall! 1.4.0
* @copyright (C) 2009-2013 www.rsjoomla.com
* @license GPL, http://www.gnu.org/licenses/gpl-2.0.html
*/

defined('_JEXEC') or die('Restricted access');

class com_rsfirewallInstallerScript
{
	public function install($parent) {
		require_once JPATH_ADMINISTRATOR.'/components/com_rsfirewall/helpers/config.php';
		
		$user 	= JFactory::getUser();
		$config = RSFirewallConfig::getInstance();
		
		// this is the first time we've installed RSFirewall! so we need to setup an email here
		$config->set('log_emails', $user->get('email'));
	}
	
	public function uninstall($parent) {
		// get a new installer
		$plg_installer = new JInstaller();

		// get the database object
		$db 	= JFactory::getDbo();
		$query 	= $db->getQuery(true);

		$messages = array();
		
		$query->select($db->quoteName('extension_id'))
			  ->from($db->quoteName('#__extensions'))
			  ->where($db->quoteName('element').'='.$db->quote('rsfirewall'))
			  ->where($db->quoteName('folder').'='.$db->quote('system'))
			  ->where($db->quoteName('type').'='.$db->quote('plugin'));
		$db->setQuery($query);
		if ($extension_id = $db->loadResult()) {
			$plg_installer->uninstall('plugin', $extension_id);
		}

		$query->clear();
		$query->select($db->quoteName('extension_id'))
			  ->from($db->quoteName('#__extensions'))
			  ->where($db->quoteName('element').'='.$db->quote('mod_rsfirewall'))
			  ->where($db->quoteName('client_id').'='.$db->quote('1'))
			  ->where($db->quoteName('type').'='.$db->quote('module'));
		$db->setQuery($query);
		if ($extension_id = $db->loadResult()) {
			$plg_installer->uninstall('module', $extension_id);
		}
	}
	
	public function preflight($type, $parent) {
		$app = JFactory::getApplication();
		
		$jversion = new JVersion();
		if (!$jversion->isCompatible('2.5.7')) {
			$app->enqueueMessage('Please upgrade to at least Joomla! 2.5.7 before continuing!', 'error');
			return false;
		}
		
		return true;
	}
	
	public function postflight($type, $parent) {
		if ($type == 'uninstall') {
			return true;
		}
		
		require_once JPATH_ADMINISTRATOR.'/components/com_rsfirewall/helpers/config.php';
		
		$source = $parent->getParent()->getPath('source');
		
		// Get a new installer
		$installer = new JInstaller();
		
		$messages = array(
			'plg_rsfirewall' => false,
			'mod_rsfirewall' => false
		);
		
		$db = JFactory::getDbo();

		if ($installer->install($source.'/other/plg_rsfirewall')) {
			$query = $db->getQuery(true);
			$query->update('#__extensions')
				  ->set($db->quoteName('enabled').'='.$db->quote(1))
				  ->set($db->quoteName('ordering').'='.$db->quote('-999'))
				  ->where($db->quoteName('element').'='.$db->quote('rsfirewall'))
				  ->where($db->quoteName('type').'='.$db->quote('plugin'))
				  ->where($db->quoteName('folder').'='.$db->quote('system'));
			$db->setQuery($query);
			$db->execute();
			
			$messages['plg_rsfirewall'] = true;
		}
		
		if ($installer->install($source.'/other/mod_rsfirewall')) {
			$query = $db->getQuery(true);
			$query->select('id')
				  ->from('#__modules')
				  ->where($db->quoteName('module').'='.$db->quote('mod_rsfirewall'))
				  ->where($db->quoteName('client_id').'='.$db->quote(1))
				  ->where($db->quoteName('position').'='.$db->quote(''));
			$db->setQuery($query);
			if ($moduleid = $db->loadResult()) {
				$query->clear();
				$query->update('#__modules')
					  ->set($db->quoteName('published').'='.$db->quote(1))
					  ->set($db->quoteName('position').'='.$db->quote('cpanel'))
					  ->set($db->quoteName('ordering').'='.$db->quote(1))
					  ->where($db->quoteName('id').'='.$db->quote($moduleid));
				$db->setQuery($query);
				$db->execute();
				
				$query->clear();
				$query->insert('#__modules_menu')
					  ->columns(array('moduleid', 'menuid'))
					  ->values("$moduleid, 0");
				$db->setQuery($query);
				$db->execute();
			}
			
			$messages['mod_rsfirewall'] = true;
		}
		
		// show message
		$this->showInstallMessage($messages);
		
		if ($type != 'update') {
			return true;
		}
		
		// update the configuration for R42
		// do we have a #__rsfirewall_lists table?
		$tables = $db->getTableList();
		if (!in_array($db->getPrefix().'rsfirewall_lists', $tables)) {
			$this->runSQL($source, 'lists.sql');
		}
		$query = $db->getQuery(true);
		$query->select('*')
			  ->from('#__rsfirewall_configuration')
			  ->where($db->quoteName('name').' IN ('.$this->quoteImplode(array('blacklist_ips', 'backend_whitelist_ips')).')');
		$db->setQuery($query);
		if ($old_values = $db->loadObjectList()) {
			JTable::addIncludePath(JPATH_ADMINISTRATOR.'/components/com_rsfirewall/tables');
			$date  = JFactory::getDate()->toSql();
			foreach ($old_values as $old_value) {
				$type = $old_value->name == 'blacklist_ips' ? 0 : 1;				
				$ips  = $this->explode($old_value->value);
				
				foreach ($ips as $ip) {
					$row = JTable::getInstance('Lists', 'RSFirewallTable');
					$row->bind(array(
						'ip' => $ip,
						'type' => $type,
						'reason' => 'Imported during R42 update.',
						'date' => $date,
						'published' => 1
					));
					$row->store();
				}
			}
			
			$query->clear();
			$query->delete('#__rsfirewall_configuration')
				  ->where($db->quoteName('name').' IN ('.$this->quoteImplode(array('blacklist_ips', 'backend_whitelist_ips')).')');
			$db->setQuery($query);
			$db->execute();
		}
		
		// update the configuration for R45
		
		// change published column
		$columns = $db->getTableColumns('#__rsfirewall_feeds');
		if (strpos($columns['published'], 'enum') !== false) {
			$db->setQuery("ALTER TABLE ".$db->quoteName('#__rsfirewall_feeds')." CHANGE ".$db->quoteName('published')." ".$db->quoteName('published')." TINYINT(1) NOT NULL");
			$db->execute();
			
			$query = $db->getQuery(true);
			$query->update('#__rsfirewall_feeds')
				  ->set($db->quoteName('published')."=".$db->quote(1));
			$db->setQuery($query);
			$db->execute();
		}
		
		// change date
		$columns = $db->getTableColumns('#__rsfirewall_logs');
		if ($columns['date'] == 'int') {
			$db->setQuery("ALTER TABLE ".$db->quoteName('#__rsfirewall_logs')." CHANGE ".$db->quoteName('date')." ".$db->quoteName('date')." VARCHAR(255) NOT NULL");
			$db->execute();
			
			// convert the date
			$query = $db->getQuery(true);
			$query->update('#__rsfirewall_logs')
				  ->set($db->quoteName('date')."=FROM_UNIXTIME(".$db->quoteName('date').")");
			$db->setQuery($query);
			$db->execute();
			
			// change the column type
			$db->setQuery("ALTER TABLE ".$db->quoteName('#__rsfirewall_logs')." CHANGE ".$db->quoteName('date')." ".$db->quoteName('date')." DATETIME NOT NULL");
			$db->execute();
		}
		
		// userid changed to user_id
		if (isset($columns['userid'])) {
			$db->setQuery("ALTER TABLE ".$db->quoteName('#__rsfirewall_logs')." CHANGE ".$db->quoteName('userid')." ".$db->quoteName('user_id')." INT(11) NOT NULL");
			$db->execute();
		}
		// add referer column
		if (!isset($columns['referer'])) {
			$db->setQuery("ALTER TABLE ".$db->quoteName('#__rsfirewall_logs')." ADD ".$db->quoteName('referer')." TEXT NOT NULL AFTER ".$db->quoteName('page'));
			$db->execute();
		}
		
		// change type column
		$columns = $db->getTableColumns('#__rsfirewall_snapshots');
		if (strpos($columns['type'], 'enum') !== false) {
			$db->setQuery("ALTER TABLE ".$db->quoteName('#__rsfirewall_snapshots')." CHANGE ".$db->quoteName('type')." ".$db->quoteName('type')." VARCHAR(16) NOT NULL");
			$db->execute();
		}
		
		// change date
		$columns = $db->getTableColumns('#__rsfirewall_hashes');
		if ($columns['date'] == 'int') {
			$db->setQuery("ALTER TABLE ".$db->quoteName('#__rsfirewall_hashes')." CHANGE ".$db->quoteName('date')." ".$db->quoteName('date')." VARCHAR(255) NOT NULL");
			$db->execute();
			
			// convert the date
			$query = $db->getQuery(true);
			$query->update('#__rsfirewall_hashes')
				  ->set($db->quoteName('date')."=FROM_UNIXTIME(".$db->quoteName('date').")");
			$db->setQuery($query);
			$db->execute();
			
			// change the column type
			$db->setQuery("ALTER TABLE ".$db->quoteName('#__rsfirewall_hashes')." CHANGE ".$db->quoteName('date')." ".$db->quoteName('date')." DATETIME NOT NULL");
			$db->execute();
		}
		
		$columns = $db->getTableColumns('#__rsfirewall_configuration');
		if (!isset($columns['type'])) {
			$db->setQuery("ALTER TABLE ".$db->quoteName('#__rsfirewall_configuration')." ADD ".$db->quoteName('type')." VARCHAR(16) NOT NULL");
			$db->execute();
			
			// global_register_code has changed to code
			$query = $db->getQuery(true);
			$query->select($db->quoteName('name'))
				  ->from('#__rsfirewall_configuration')
				  ->where($db->quoteName('name').'='.$db->quote('global_register_code'));
			$db->setQuery($query);
			if ($db->loadResult()) {
				$query->clear();
				$query->update('#__rsfirewall_configuration')
					  ->set($db->quoteName('name').'='.$db->quote('code'))
					  ->set($db->quoteName('type').'='.$db->quote('text'))
					  ->where($db->quoteName('name').'='.$db->quote('global_register_code'));
				$db->setQuery($query);
				$db->execute();
			}
			
			$query = $db->getQuery(true);
			$types = array(
				'active_scanner_status' => 'int',
				'blocked_countries' => 'array-text',
				'backend_password_enabled' => 'int',
				'backend_password' => 'text',
				'offset' => 'int',
				'verify_generator' => 'int',
				'verify_emails' => 'int',
				'monitor_core' => 'int',
				'monitor_files' => 'text',
				'verify_agents' => 'array-text',
				'verify_dos' => 'array-text',
				'enable_autoban' => 'int',
				'enable_autoban_login' => 'int',
				'autoban_attempts' => 'int',
				'enable_backend_captcha' => 'int',
				'backend_captcha' => 'int',
				'verify_multiple_exts' => 'int',
				'verify_upload' => 'int',
				'verify_upload_blacklist_exts' => 'text',
				'monitor_users' => 'array-int',
				'log_emails' => 'text',
				'log_alert_level' => 'array-text',
				'log_history' => 'int',
				'log_overview' => 'int',
				'log_hour_limit' => 'int',
				'log_emails_count' => 'int',
				'log_emails_send_after' => 'int',
				'code' => 'text',
				'grade' => 'int'
			);
			foreach ($types as $field => $type) {
				$query->update('#__rsfirewall_configuration')
					  ->set($db->quoteName('type').'='.$db->quote($type))
					  ->where($db->quoteName('name').'='.$db->quote($field));
				$db->setQuery($query);
				$db->execute();
				
				$query->clear();
			}
			
			// add the missing config data
			$this->runSQL($source, 'configuration.data.sql');
		}
		
		// these are no longer needed
		$query = $db->getQuery(true);
		$query->select($db->quoteName('name'))
			  ->from('#__rsfirewall_configuration')
			  ->where($db->quoteName('name').'='.$db->quote('master_password'));
		$db->setQuery($query);
		if ($db->loadResult()) {
			$query->clear();
			
			$query->delete('#__rsfirewall_configuration')
				  ->where($db->quoteName('name').' IN ('.$this->quoteImplode(array('master_password', 'master_password_enabled', 'backend_access_control_enabled', 'backend_access_users', 'backend_access_components')).')');
			$db->setQuery($query);
			$db->execute();
		}
		
		$query = $db->getQuery(true);
		$query->select($db->quoteName('name'))
			  ->from('#__rsfirewall_configuration')
			  ->where($db->quoteName('name').'='.$db->quote('verify_sql_skip'));
		$db->setQuery($query);
		if ($db->loadResult()) {
			$fields = array('verify_sql', 'verify_sql_skip', 'verify_js', 'verify_js_skip', 'verify_php', 'verify_php_skip', 'verify_upload_skip');
			$query = $db->getQuery(true);
			$query->select('*')
				  ->from('#__rsfirewall_configuration')
				  ->where($db->quoteName('name').' IN ('.$this->quoteImplode($fields).')');
			$db->setQuery($query);
			if ($results = $db->loadObjectList('name')) {
				$config = RSFirewallConfig::getInstance();
				$config->reload();
				
				// add the exceptions table
				$this->runSQL($source, 'exceptions.sql');
				
				// verify_sql
				if ($results['verify_sql']->value) {
					$config->set('enable_sql_for', array('get'));
				}
				// verify_js
				if ($results['verify_js']->value) {
					$config->set('enable_js_for', array('get', 'post'));
					$config->set('filter_js', 1);
				}
				// verify_php
				if ($results['verify_php']->value) {
					$config->set('enable_php_for', array('get'));
					$config->set('lfi', 1);
					$config->set('rfi', 1);
				}
				
				$options = array();
				if ($results['verify_sql_skip']->value) {
					$tmp = $this->explode($results['verify_sql_skip']->value);
					foreach ($tmp as $v) {
						$options[$v]['sql'] = 1;
					}
				}
				if ($results['verify_js_skip']->value) {
					$tmp = $this->explode($results['verify_js_skip']->value);
					foreach ($tmp as $v) {
						$options[$v]['js'] = 1;
					}
				}
				if ($results['verify_php_skip']->value) {
					$tmp = $this->explode($results['verify_php_skip']->value);
					foreach ($tmp as $v) {
						$options[$v]['php'] = 1;
					}
				}
				if ($results['verify_upload_skip']->value) {
					$tmp = $this->explode($results['verify_upload_skip']->value);
					foreach ($tmp as $v) {
						$options[$v]['uploads'] = 1;
					}
				}
				if ($options) {
					JTable::addIncludePath(JPATH_ADMINISTRATOR.'/components/com_rsfirewall/tables');
					foreach ($options as $option => $v) {
						$row = JTable::getInstance('Exceptions', 'RSFirewallTable');
						$row->bind(array(
							'type' => 'com',
							'regex' => 0,
							'match' => $option,
							'php' => isset($v['php']) ? 1 : 0,
							'sql' => isset($v['sql']) ? 1 : 0,
							'js' => isset($v['js']) ? 1 : 0,
							'uploads' => isset($v['uploads']) ? 1 : 0,
							'reason' => 'Imported from RSFirewall! update to R45'
						));
						$row->store();
					}
				}
				
				// delete them
				$query = $db->getQuery(true);
				$query->delete('#__rsfirewall_configuration')
					  ->where($db->quoteName('name').' IN ('.$this->quoteImplode($fields).')');
				$db->setQuery($query);
				$db->execute();
			}
		}
		
		// lockdown has changed into disable_installer & disable_new_admin_users
		$query = $db->getQuery(true);
		$query->select('*')
			  ->from('#__rsfirewall_configuration')
			  ->where($db->quoteName('name').'='.$db->quote('lockdown'));
		$db->setQuery($query);
		if ($lockdown = $db->loadObject()) {
			$config = RSFirewallConfig::getInstance();
				
			$config->set('disable_installer', $lockdown->value);
			$config->set('disable_new_admin_users', $lockdown->value);
			
			$query = $db->getQuery(true);
			$query->delete('#__rsfirewall_configuration')
				  ->where($db->quoteName('name').'='.$db->quote('lockdown'));
			$db->setQuery($query);
			$db->execute();
			
			$query->clear();
			$query->delete('#__rsfirewall_snapshots')
				  ->where($db->quoteName('type').'='.$db->quote('lockdown'));
			$db->setQuery($query);
			$db->execute();
		}
		
		// ignore files and folders
		$query = $db->getQuery(true);
		$query->select('*')
			  ->from('#__rsfirewall_ignored')
			  ->where($db->quoteName('type').'='.$db->quote('ignore_files_folders'));
		$db->setQuery($query);
		if ($results = $db->loadObjectList()) {
			$query->clear();
			foreach ($results as $result) {
				if (is_file($result->path)) {
					$result->type = 'ignore_file';
				} elseif (is_dir($result->path)) {
					$result->type = 'ignore_folder';
				}
				
				$query->update('#__rsfirewall_ignored')
					  ->set($db->quoteName('type').'='.$db->quote($result->type))
					  ->where($db->quoteName('path').'='.$db->quote($result->path));
				$query->execute();
				$query->clear();
			}
		}
		
		// remove patterns, add signatures
		if (in_array($db->getPrefix().'rsfirewall_patterns', $tables)) {
			$db->dropTable('#__rsfirewall_patterns');
			
			$this->runSQL($source, 'signatures.sql');
			$this->runSQL($source, 'signatures.data.sql');
		}
		
		// remove monitor_files
		$query = $db->getQuery(true);
		$query->select('*')
			  ->from('#__rsfirewall_configuration')
			  ->where($db->quoteName('name').'='.$db->quote('monitor_files'));
		$db->setQuery($query);
		if ($result = $db->loadObject()) {
			$query = $db->getQuery(true);
			$query->delete('#__rsfirewall_configuration')
				  ->where($db->quoteName('name').'='.$db->quote('monitor_files'));
			$db->setQuery($query);
			$db->execute();
			
			// save new values
			$values = $this->explode($result->value);
			foreach ($values as $value) {
				$value = trim($value);
				if (!file_exists($value) || !is_readable($value)) {
					continue;
				}
				
				JTable::addIncludePath(JPATH_ADMINISTRATOR.'/components/com_rsfirewall/tables');
				$table = JTable::getInstance('Hashes', 'RSFirewallTable');
				$table->bind(array(
					'id'   => null,
					'file' => $value,
					'hash' => md5_file($value),
					'type' => 'protect',
					'flag' => '',
					'date' => JFactory::getDate()->toSql()
				));
				$table->store();
			}
		}
		
		// add hashes
		$this->runSQL($source, 'hashes.data.sql');
		// add signatures
		$this->runSQL($source, 'signatures.data.sql');
		
		// remove duplicates
		// messy, but worth it.
		$query = $db->getQuery(true);
		$query->select('*')
			  ->from('#__rsfirewall_hashes');
		$db->setQuery($query);
		$results = $db->loadObjectList();
		$hashes = array();
		$to_delete = array();
		$version = new JVersion();
		$version = $version->getShortVersion();
		foreach ($results as $result) {
			// not what we are interested in...
			if (strpos($result->type, '.') === false) continue;
			if (version_compare($result->type, $version, '<')) {
				$to_delete[] = $result->id;
				continue;
			}
			
			$hashes[$result->type][] = $result;
		}

		foreach ($hashes as $type => $types) {
			$duplicates = array();
			foreach ($types as $result) {
				$duplicates[$result->file][] = $result->id;
			}
			foreach ($duplicates as $file => $ids) {
				if (count($ids) > 1) {
					// keep the oldest id
					array_shift($ids);
					$to_delete = array_merge($to_delete, $ids);
				}
			}
		}
		
		if ($to_delete) {
			$query = $db->getQuery(true);
			$query->delete('#__rsfirewall_hashes')
				  ->where($db->quoteName('id').' IN ('.$this->quoteImplode($to_delete).')');
			$db->setQuery($query);
			$db->execute();
		}
		
		// admin_users should not be empty...
		require_once JPATH_ADMINISTRATOR.'/components/com_rsfirewall/helpers/users.php';
		// get the current admin users
		$users = RSFirewallUsersHelper::getAdminUsers();
		$admin_users = array();
		foreach ($users as $user) {
			$admin_users[] = $user->id;
		}
		
		$config = RSFirewallConfig::getInstance();
		$config->set('admin_users', $admin_users);
	}
	
	protected function runSQL($source, $file) {
		$db = JFactory::getDbo();
		$driver = strtolower($db->name);
		if ($driver == 'mysqli') {
			$driver = 'mysql';
		} elseif ($driver == 'sqlsrv') {
			$driver = 'sqlazure';
		}
		
		$sqlfile = $source.'/admin/sql/'.$driver.'/'.$file;
		
		if (file_exists($sqlfile)) {
			$buffer = file_get_contents($sqlfile);
			if ($buffer !== false) {
				$queries = JInstallerHelper::splitSql($buffer);
				foreach ($queries as $query) {
					$query = trim($query);
					if ($query != '' && $query{0} != '#') {
						$db->setQuery($query);
						if (!$db->execute()) {
							JError::raiseWarning(1, JText::sprintf('JLIB_INSTALLER_ERROR_SQL_ERROR', $db->stderr(true)));
						}
					}
				}
			}
		}
	}
	
	protected function explode($string) {
		$string = str_replace(array("\r\n", "\r"), "\n", $string);
		return explode("\n", $string);
	}
	
	protected function quoteImplode($array) {
		$db = JFactory::getDbo();
		foreach ($array as $k => $v) {
			$array[$k] = $db->quote($v);
		}
		
		return implode(',', $array);
	}
	
	protected function showInstallMessage($messages=array()) {
?>
<style type="text/css">
.version-history {
	margin: 0 0 2em 0;
	padding: 0;
	list-style-type: none;
}
.version-history > li {
	margin: 0 0 0.5em 0;
	padding: 0 0 0 4em;
}
.version-new,
.version-fixed,
.version-upgraded {
	float: left;
	font-size: 0.8em;
	margin-left: -4.9em;
	width: 4.5em;
	color: white;
	text-align: center;
	font-weight: bold;
	text-transform: uppercase;
	-webkit-border-radius: 4px;
	-moz-border-radius: 4px;
	border-radius: 4px;
}

.version-new {
	background: #7dc35b;
}
.version-fixed {
	background: #e9a130;
}
.version-upgraded {
	background: #61b3de;
}

.install-ok {
	background: #7dc35b;
	color: #fff;
	padding: 3px;
}

.install-not-ok {
	background: #E9452F;
	color: #fff;
	padding: 3px;
}

#installer-left {
	float: left;
	width: 230px;
	padding: 5px;
}

#installer-right {
	float: left;
}

.com-rsfirewall-button {
	display: inline-block;
	background: #459300 url(components/com_rsfirewall/assets/images/bg-button-green.gif) top left repeat-x !important;
	border: 1px solid #459300 !important;
	padding: 2px;
	color: #fff !important;
	cursor: pointer;
	margin: 0;
	-webkit-border-radius: 5px;
     -moz-border-radius: 5px;
          border-radius: 5px;
}
</style>
	<div id="installer-left">
		<img src="components/com_rsfirewall/assets/images/rsfirewall-box.jpg" alt="RSFirewall! Box" />
	</div>
	<div id="installer-right">
		<p>System Plugin ...
			<?php if ($messages['plg_rsfirewall']) { ?>
			<b class="install-ok">Installed</b>
			<?php } else { ?>
			<b class="install-not-ok">Error installing!</b>
			<?php } ?>
		</p>
		<p>RSFirewall! Control Panel Module ...
			<?php if ($messages['mod_rsfirewall']) { ?>
			<b class="install-ok">Installed</b>
			<?php } else { ?>
			<b class="install-not-ok">Error installing!</b>
			<?php } ?>
		</p>
		<ul class="version-history">
			<li><span class="version-new">New</span> Hashes for Joomla! 2.5.14</li>
			<li><span class="version-new">New</span> Hashes for Joomla! 3.1.5</li>
		</ul>
		<a class="com-rsfirewall-button" href="index.php?option=com_rsfirewall">Start using RSFirewall!</a>
		<a class="com-rsfirewall-button" href="http://www.rsjoomla.com/customer-support/documentations/48-rsfirewall-user-guide.html" target="_blank">Read the RSFirewall! User Guide</a>
		<a class="com-rsfirewall-button" href="http://www.rsjoomla.com/customer-support/tickets.html" target="_blank">Get Support!</a>
	</div>
	<div style="clear: both;"></div>
		<?php
	}
}