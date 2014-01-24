<?php
/**
* @version 1.4.0
* @package RSFirewall! 1.4.0
* @copyright (C) 2009-2013 www.rsjoomla.com
* @license GPL, http://www.gnu.org/licenses/gpl-2.0.html
*/

defined('_JEXEC') or die('Restricted access');

class RSFirewallModelCheck extends JModelLegacy
{
	const DS = DIRECTORY_SEPARATOR;
	const HASHES_DIR = '/components/com_rsfirewall/assets/hashes/';
	const DICTIONARY = '/components/com_rsfirewall/assets/dictionary/passwords.txt';
	const CHUNK_SIZE = 2048;
	
	protected $count = 0;
	protected $folders = array();
	protected $files = array();
	protected $limit = 0;
	
	protected $ignored = array();
	
	public function __construct() {
		parent::__construct();		
	}
	
	public function getDS() {
		return self::DS;
	}
	
	public function getConfig() {
		return RSFirewallConfig::getInstance();
	}
	
	protected function connect($url) {
		$http = JHttpFactory::getHttp();
		try {
			$response = $http->get($url, null, 30);
		} catch (Exception $e) {
			$this->setError($e->getMessage());
			return false;
		}
		
		return $response;
	}
	
	protected function getCurrentJoomlaVersion() {
		static $current = null;
		
		if (is_null($current)) {
			$jversion 	= new JVersion();
			$current	= $jversion->getShortVersion();
			// workaround for DutchJoomla! and other variations
			if (strpos($current, ' ') !== false) {
				$current = reset(explode(' ', $current));
			}
		}
		
		return $current;
	}
	
	protected function _loadPasswords() {
		static $passwords;
		if (is_null($passwords)) {
			jimport('joomla.filesystem.file');
			
			$passwords = array();
			if ($contents = JFile::read(JPATH_ADMINISTRATOR.self::DICTIONARY)) {
				$passwords = $this->explode($contents);
			}
		}
		
		return $passwords;
	}
	
	protected function explode($string) {
		$string = str_replace(array("\r\n", "\r"), "\n", $string);
		return explode("\n", $string);
	}
	
	protected function checkWeakPassword($original) {
		$passwords = $this->_loadPasswords();
		foreach ($passwords as $password) {
			if ($original == $password)
				return $password;
		}
		
		return false;
	}
	
	protected function isWindows() {
		static $result = null;
		if (!is_bool($result)) {
			$result = substr(PHP_OS, 0, 3) == 'WIN';
		}
		return $result;
	}
	
	public function getIsWindows() {
		return $this->isWindows();
	}
	
	public function getIsOldIE() {
		$browser = JBrowser::getInstance();
		return $browser->getBrowser() == 'msie' && $browser->getMajor() < 9;
	}
	
	public function checkJoomlaVersion() {
		$current = $this->getCurrentJoomlaVersion();
		$url 	 = 'http://www.rsjoomla.com/index.php?option=com_rsfirewall_kb&task=version&version=joomla&current='.urlencode($current);
		
		// could not connect
		if (!($response = $this->connect($url))) {
			return false;
		}
		
		// error response code
		if ($response->code != 200) {
			$this->setError(JText::sprintf('COM_RSFIREWALL_HTTP_ERROR_RESPONSE_CODE', $response->code));
			return false;
		}
		
		$latest = $response->body;
		
		return array($current, $latest, version_compare($current, $latest, '>='));
	}
	
	public function checkRSFirewallVersion() {
		$current = $this->getCurrentJoomlaVersion();
		$url 	 = 'http://www.rsjoomla.com/index.php?option=com_rsfirewall_kb&task=version&version=firewall&current='.urlencode($current);
		
		// could not connect
		if (!($response = $this->connect($url))) {
			return false;
		}
		
		// error response code
		if ($response->code != 200) {
			$this->setError(JText::sprintf('COM_RSFIREWALL_HTTP_ERROR_RESPONSE_CODE', $response->code));
			return false;
		}
		
		$version = new RSFirewallVersion();
		$current = $version->revision;
		$latest  = $response->body;
		
		return array($current, $latest, version_compare($current, $latest, '>='));
	}
	
	public function checkSQLPassword() {
		$config = new JConfig();
		if (($password = $this->checkWeakPassword($config->password)) !== false) {
			return $password;
		}
		
		return false;
	}
	
	public function hasAdminUser() {
		$db 	= $this->getDbo();
		$query 	= $db->getQuery(true);
		
		$query->select($db->quoteName('id'))
			  ->from($db->quoteName('#__users'))
			  ->where($db->quoteName('username').'='.$db->quote('admin'))
			  ->where($db->quoteName('block').'='.$db->quote('0'));
		
		$db->setQuery($query);
		return $db->loadResult();
	}
	
	public function hasFTPPassword() {
		$config = new JConfig();
		return $config->ftp_pass != '';
	}
	
	public function isSEFEnabled() {
		$config = new JConfig();
		return $config->sef > 0;
	}
	
	public function buildConfiguration($overwrite=null) {
		$data = JArrayHelper::fromObject(new JConfig());
		if (is_array($overwrite)) {
			foreach ($overwrite as $key => $value) {
				if (isset($data[$key]))
					$data[$key] = $value;
			}
		}
		$config = new JRegistry('config');
		$config->loadArray($data);
		return $config->toString('PHP', array('class' => 'JConfig', 'closingtag' => false));
	}
	
	public function buildPHPini() {
		$contents = array(
			'register_globals=Off',
			'safe_mode=Off',
			'allow_url_fopen=Off',
			'allow_url_include=Off',
			'disable_functions=show_source, system, shell_exec, passthru, exec, phpinfo, popen, proc_open'
		);
		
		if ($this->compareINI('open_basedir', '')) {
			$paths 		= array();
			$delimiter 	= $this->isWindows() ? ';' : ':';
			
			// add the path to the Joomla! installation
			if (JPATH_SITE) {
				$paths[] = JPATH_SITE;
			}
			// add the path to the Joomla! configuration if it's not in the default location
			if (JPATH_CONFIGURATION && JPATH_CONFIGURATION != JPATH_SITE) {
				$paths[] = JPATH_CONFIGURATION;
			}
			// try to add the path for the server temporary folder
			if ($this->getINI('upload_tmp_dir')) {
				$paths[] = $this->getINI('upload_tmp_dir');
			}
			if ($temp_dir = sys_get_temp_dir()) {
				$paths[] = $temp_dir;
			}
			// try to add the path for the server session folder
			if ($this->getINI('session.save_path')) {
				$paths[] = $this->getINI('upload_tmp_dir');
			}
			$paths[] = $this->getTemporaryFolder();
			$paths[] = $this->getLogFolder();
			
			$contents[] = 'open_basedir='.implode($delimiter, array_unique($paths));
		} else {
			$contents[] = 'open_basedir='.$this->getINI('open_basedir');
		}
		
		return implode("\r\n", $contents);
	}
	
	public function isConfigurationModified() {
		jimport('joomla.filesystem.file');
		
		$contents 		= JFile::read(JPATH_CONFIGURATION.'/configuration.php');
		$configuration 	= $this->buildConfiguration();
		
		if ($contents != $configuration) {
			$contents = explode("\n", $contents);
			$configuration = explode("\n", $configuration);
			$diff  = array_diff($contents, $configuration);
			
			return $diff;
		} else {
			return false;
		}
	}
	
	public function isConfigurationOutside() {
		$root 	= realpath($_SERVER['DOCUMENT_ROOT']);
		$config = realpath(JPATH_CONFIGURATION);
		
		return array($root, $config, strpos($config, $root) === false);
	}
	
	protected function getAdminUsers() {
		$db 	= $this->getDbo();
		$query 	= $db->getQuery(true);
		$query->select($db->quoteName('id'))
			  ->from($db->quoteName('#__usergroups'));
		$db->setQuery($query);
		$groups = $db->loadColumn();
		
		$admin_groups = array();
		foreach ($groups as $group_id) {
			if (JAccess::checkGroup($group_id, 'core.login.admin')) {
				$admin_groups[] = $group_id;
			} elseif (JAccess::checkGroup($group_id, 'core.admin')) {
				$admin_groups[] = $group_id;
			}
		}
		
		$admin_groups = array_unique($admin_groups);
		
		$query->clear();
		$query->select('u.username, u.password')
			  ->from('#__user_usergroup_map m')
			  ->join('right', '#__users u ON (u.id=m.user_id)')
			  ->where('m.group_id IN ('.implode(',', $admin_groups).')')
			  ->order('u.username ASC')
			  ->group('u.id');
		$db->setQuery($query);
		return $db->loadObjectList();
	}
	
	public function checkAdminPasswords() {
		$passwords 	= $this->_loadPasswords();
		$users	   	= $this->getAdminUsers();
		$return 	= array();
		
		foreach ($users as $user) {
			foreach ($passwords as $password) {
				$match = false;
				if (substr($user->password, 0, 4) == '$2y$') {
					// Cracking these passwords is extremely CPU intensive, skip.
					continue 2;
				} elseif (substr($user->password, 0, 8) == '{SHA256}') {
					// Check the password
					$parts	= explode(':', $user->password);
					$crypt	= $parts[0];
					$salt	= @$parts[1];
					$testcrypt = JUserHelper::getCryptedPassword($password, $salt, 'sha256', false);

					if ($user->password == $testcrypt) {
						$match = true;
					}
				} else {
					// Check the password
					$parts	= explode(':', $user->password);
					$crypt	= $parts[0];
					$salt	= @$parts[1];

					$testcrypt = JUserHelper::getCryptedPassword($password, $salt, 'md5-hex', false);

					if ($crypt == $testcrypt) {
						$match = true;
					}
				}
				
				if ($match === true) {
					$found = new stdClass();
					$found->username = $user->username;
					$found->password = $password;
					
					$return[] = $found;
					break;
				}
			}
		}
		
		return $return;
	}
	
	public function getSessionLifetime() {
		$app = JFactory::getApplication();
		return $app->getCfg('lifetime');
	}
	
	public function getTemporaryFolder() {
		$app = JFactory::getApplication();
		return $app->getCfg('tmp_path');
	}
	
	public function getLogFolder() {
		$app = JFactory::getApplication();
		return $app->getCfg('log_path');
	}
	
	public function getServerSoftware() {
		if (preg_match('#IIS/([\d.]*)#', $_SERVER['SERVER_SOFTWARE'])) {
			return 'iis';
		}
		
		return 'apache';
	}
	
	public function getFiles($folder, $recurse=false, $sort=true, $fullpath=true, $ignore=array()) {
		if (!is_dir($folder)) {
			$this->setError("$folder is not a valid folder!");
			return false;
		}
		
		$arr = array();
		
		try {
			$handle = @opendir($folder);
			while (($file = readdir($handle)) !== false) {
				if ($file != '.' && $file != '..' && !in_array($file, $ignore)) {
					$dir = $folder . self::DS . $file;
					if (is_file($dir)) {
						if ($fullpath) {
							$arr[] = $dir;
						} else {
							$arr[] = $file;
						}
					} elseif (is_dir($dir) && $recurse) {
						$arr = array_merge($arr, $this->getFiles($dir, $recurse, $sort, $fullpath, $ignore));
					}
				}
			}
			closedir($handle);
		}
		catch (Exception $e) {
			$this->setError($e->getMessage());
			return false;
		}
		if ($sort) {
			asort($arr);
		}
		return $arr;
	}
	
	public function getFolders($folder, $recurse=false, $sort=true, $fullpath=true) {
		if (!is_dir($folder)) {
			$this->setError(JText::sprintf('COM_RSFIREWALL_FOLDER_IS_NOT_A_VALID_FOLDER', $folder));
			return false;
		}
		
		$arr = array();
		
		try {
			$handle = @opendir($folder);
			if ($handle) {
				while (($file = readdir($handle)) !== false) {
					if ($file != '.' && $file != '..') {
						$dir = $folder . self::DS . $file;
						if (is_dir($dir)) {
							if ($fullpath) {
								$arr[] = $dir;
							} else {
								$arr[] = $file;
							}
							if ($recurse) {
								$arr = array_merge($arr, $this->getFolders($dir, $recurse, $sort, $fullpath));
							}
						}
					}
				}
				closedir($handle);
			} else {
				$this->setError(JText::sprintf('COM_RSFIREWALL_FOLDER_CANNOT_BE_OPENED', $folder));
				return false;
			}
		}
		catch (Exception $e) {
			$this->setError($e->getMessage());
			return false;
		}
		
		if ($sort) {
			asort($arr);
		}
		
		return $arr;
	}
	
	protected function getParent($path) {
		$parts   = explode(self::DS, $path);
		array_pop($parts);
		
		return implode(self::DS, $parts);
	}
	
	protected function getAdjacentFolder($folder) {
		// one level up
		$parent = $this->getParent($folder);
		$folders = $this->getFolders($parent, false, false, true);
		if ($this->ignored['folders']) {
			// remove ignored folders
			$folders = array_diff($folders, $this->ignored['folders']);
			// renumber indexes
			$folders = array_merge(array(), $folders);
		}
		if ($folders !== false) {
			if (($pos = array_search($folder, $folders)) !== false) {
				if (isset($folders[$pos+1])) {
					return $folders[$pos+1];
				} else {
					if ($parent == JPATH_SITE || $parent == '/') {
						// this means that there are no more folders left in the Joomla! installation
						// so we're done here
						return false;
					}
					
					// up again
					return $this->getAdjacentFolder($parent);
				}
			}
		} else {
			return false;
		}
	}
	
	protected function getAdjacentFolderFiles($folder) {
		if ($folder == JPATH_SITE) {
			return false;
		}
		
		// one level up
		$parent = $this->getParent($folder);
		$folders = $this->getFolders($parent, false, false, true);
		
		if ($this->ignored['folders']) {
			// remove ignored folders
			$folders = array_diff($folders, $this->ignored['folders']);
			// renumber indexes
			$folders = array_merge(array(), $folders);
		}
		if ($folders !== false) {
			if (($pos = array_search($folder, $folders)) !== false) {
				if (isset($folders[$pos+1])) {
					return $folders[$pos+1];
				} else {
					
					if (!$this->addFiles($parent, false)) {
						return false;
					}
					
					if ($parent == JPATH_SITE || $parent == '/') {
						// this means that there are no more folders left in the Joomla! installation
						// so we're done here
						return false;
					}
					
					// up again
					return $this->getAdjacentFolderFiles($parent);
				}
			}
		} else {
			return false;
		}
	}
	
	public function getFoldersLimit($folder) {
		if (!is_dir($folder)) {
			$this->setError(JText::sprintf('COM_RSFIREWALL_FOLDER_IS_NOT_A_VALID_FOLDER', $folder));
			return false;
		}
		
		try {
			$handle = @opendir($folder);
			if ($handle) {
				while (($file = readdir($handle)) !== false) {
					// check the limit
					if (count($this->folders) >= $this->limit) {
						return true;
					}
					$dir = $folder . self::DS . $file;
					if ($file != '.' && $file != '..' && is_dir($dir)) {
						// is it ignored? if so, continue
						if (in_array($dir, $this->ignored['folders'])) {
							continue;
						}
					
						$this->folders[] = $dir;
						$this->getFoldersLimit($dir);
						return true;
					}
				}
				closedir($handle);
				
				// try to find the next folder
				if (($dir = $this->getAdjacentFolder($folder)) !== false) {
					$this->folders[] = $dir;
					$this->getFoldersLimit($dir);
				}
			} else {
				$this->setError(JText::sprintf('COM_RSFIREWALL_FOLDER_CANNOT_BE_OPENED', $folder));
				return false;
			}
		}
		catch (Exception $e) {
			$this->setError($e->getMessage());
			return false;
		}
	}
	
	public function getFilesLimit($startfile) {		
		if (is_file($startfile)) {
			$folder = dirname($startfile);
			$scan_subdirs = false;
		} else {
			$folder = $startfile;
			$scan_subdirs = true;
		}
		
		try {
			$handle = @opendir($folder);
			if ($handle) {
				if ($scan_subdirs) {
					while (($file = readdir($handle)) !== false) {
						$path = $folder . self::DS . $file;
						if ($file != '.' && $file != '..' && is_dir($path)) {
							// is it ignored? if so, continue
							if (in_array($path, $this->ignored['folders'])) {
								continue;
							}
						
							$this->getFilesLimit($path);
							return true;
						}
					}
				}
				closedir($handle);
				
				if (!$this->addFiles($folder, is_file($startfile) ? $startfile : false)) {
					return true;
				}
				
				// done here, try to find the next folder to parse
				if (($dir = $this->getAdjacentFolderFiles($folder)) !== false) {
					$this->getFilesLimit($dir);
				}
			} else {
				$this->setError(JText::sprintf('COM_RSFIREWALL_FOLDER_CANNOT_BE_OPENED', $folder));
				return false;
			}
		}
		catch (Exception $e) {
			$this->setError($e->getMessage());
			return false;
		}
	}
	
	protected function addFiles($folder, $skip_until=false) {
		$handle = @opendir($folder);
		if ($handle) {
			$passed = false;
			
			// no more subdirectories here, search for files
			while (($file = readdir($handle)) !== false) {
				$path = $folder . self::DS . $file;
				if ($file != '.' && $file != '..' && is_file($path)) {
					// is it ignored? if so, continue
					if (in_array($path, $this->ignored['files'])) {
						continue;
					}
					
					if ($skip_until !== false) {
						if (!$passed && $path == $skip_until) {
							$passed = true;
							continue;
						}
						
						if (!$passed) {
							continue;
						}
					}
					
					if (count($this->files) >= $this->limit) {
						return false;
					}
					
					$this->files[] = $path;
				}
			}
			closedir($handle);
			
			return true;
		}
	}
	
	public function getAccessFile() {
		static $software;
		if (!$software) {
			$software = $this->getServerSoftware();
		}
		
		switch ($software) {
			case 'apache':
				return '.htaccess';
			break;
			
			case 'iis':
				return 'web.config';
			break;
		}
	}
	
	public function getDefaultAccessFile() {
		static $software;
		if (!$software) {
			$software = $this->getServerSoftware();
		}
		
		switch ($software) {
			case 'apache':
				return 'htaccess.txt';
			break;
			
			case 'iis':
				return 'web.config.txt';
			break;
		}
	}
	
	public function hasHtaccess() {
		$file = $this->getAccessFile();
		if (file_exists(JPATH_SITE.'/'.$file)) {
			return true;
		}
		
		return false;
	}
	
	public function isTemporaryFolderOutside() {
		$root = realpath($_SERVER['DOCUMENT_ROOT']);
		$tmp  = realpath($this->getTemporaryFolder());
		
		return array($root, $tmp, strpos($tmp, $root) === false);
	}
	
	public function getINI($name) {
		return ini_get($name);
	}
	
	public function compareINI($name, $against='1') {
		return $this->getINI($name) == $against;
	}
	
	protected function getHash($version) {
		if (file_exists(JPATH_ADMINISTRATOR.self::HASHES_DIR.$version.'.csv')) {
			return JPATH_ADMINISTRATOR.self::HASHES_DIR.$version.'.csv';
		}
		
		return false;
	}
	
	protected function getMemoryLimitInBytes() {
		$memory_limit = $this->getINI('memory_limit');
		switch (substr($memory_limit, -1)) {
			case 'K':
				$memory_limit = (int) $memory_limit * 1024;
			break;
			
			case 'M':
				$memory_limit = (int) $memory_limit * 1024 * 1024;
			break;
			
			case 'G':
				$memory_limit = (int) $memory_limit * 1024 * 1024 * 1024;
			break;
		}
		return $memory_limit;
	}
	
	protected function getIgnoredHashedFiles() {
		$db 	= $this->getDbo();
		$query 	= $db->getQuery(true);
		
		$query->select($db->quoteName('file'))
			  ->select($db->quoteName('hash'))
			  ->select($db->quoteName('flag'))
			  ->from($db->quoteName('#__rsfirewall_hashes'))
			  ->where($db->quoteName('type').'='.$db->quote('ignore'));
		$db->setQuery($query);
		
		return $db->loadObjectList('file');
	}
	
	protected function _getIgnored() {
		if (empty($this->ignored)) {
			$this->ignored	= array(
				'folders' => array(),
				'files'   => array()
			);
			$db 	= $this->getDbo();
			$query 	= $db->getQuery(true);
		
			$query->select('*')
				  ->from($db->quoteName('#__rsfirewall_ignored'))
				  ->where($db->quoteName('type').'='.$db->quote('ignore_folder').' OR '.$db->quoteName('type').'='.$db->quote('ignore_file'));
			$db->setQuery($query);
			$results = $db->loadObjectList();
			foreach ($results as $result) {
				$this->ignored[$result->type == 'ignore_folder' ? 'folders' : 'files'][] = $result->path;
			}
		}
	}
	
	protected function getOptionalFolders() {
		return array(
			/* administrator components */
			'administrator/components/com_banners',
			'administrator/components/com_contact',
			'administrator/components/com_finder',
			'administrator/components/com_newsfeeds',
			'administrator/components/com_weblinks',
			
			/* administrator modules */
			'administrator/modules/mod_feed',
			'administrator/modules/mod_latest',
			'administrator/modules/mod_logged',
			'administrator/modules/mod_menu',
			'administrator/modules/mod_popular',
			'administrator/modules/mod_status',
			'administrator/modules/mod_submenu',
			'administrator/modules/mod_title',
			'administrator/modules/mod_multilangstatus',
			'administrator/modules/mod_version',
			
			/* administrator templates */
			'administrator/templates/bluestork',
			'administrator/templates/isis',
			'administrator/templates/hathor',
			
			/* components */
			'components/com_banners',
			'components/com_contact',
			'components/com_finder',
			'components/com_newsfeeds',
			'components/com_weblinks',
			
			'images/sampledata',
			
			/* modules */
			'modules/mod_articles_popular',
			'modules/mod_articles_news',
			'modules/mod_random_image',
			'modules/mod_related_items',
			'modules/mod_search',
			'modules/mod_stats',
			'modules/mod_weblinks',
			'modules/mod_whosonline',
			'modules/mod_wrapper',
			'modules/mod_finder',
			
			/* templates */
			'templates/atomic',
			'templates/beez3',
			'templates/beez5',
			'templates/beez_20',
			'templates/protostar'
		);
	}
	
	public function checkHashes($start=0, $limit) {		
		// version information
		$version = $this->getCurrentJoomlaVersion();
		
		if ($hash_file = $this->getHash($version)) {
			if ($handle = @fopen($hash_file, 'r')) {
				// set pointer to last value
				fseek($handle, $start);
				
				$result				= new stdClass();
				$result->wrong 		= array(); // files with wrong checksums
				$result->missing 	= array(); // files missing
				$result->fstop		= 0; // the pointer (bytes) where the scanning stopped
				$result->size		= filesize($hash_file); // the file size so that we can compute the progress
				
				$ignored_files 		= $this->getIgnoredHashedFiles();
				$ignored_folders 	= $this->getOptionalFolders();
				
				// memory variables
				$memory_limit = $this->getMemoryLimitInBytes();
				$memory_usage = memory_get_usage();
				
				// read data
				while (($data = fgetcsv($handle, self::CHUNK_SIZE, ',')) !== false && $limit > 0) {
					list($file_path, $file_hash) = $data;
					$full_path = JPATH_SITE.'/'.$file_path;
					
					// is it an optional folder, that might have been uninstalled?
					$parts = explode('/', $file_path);
					// this removes the filename
					array_pop($parts);
					// we do this so that subfolders are ignored as well
					while ($parts) {
						$folder = implode('/', $parts);
						if (in_array($folder, $ignored_folders) && !is_dir(JPATH_SITE.'/'.$folder)) {
							continue 2;
						}
						array_pop($parts);
					}
					
					// get the new hash
					if (isset($ignored_files[$file_path])) {
						// if there's an M flag this means the file should be missing
						if ($ignored_files[$file_path]->flag == 'M') {
							// we check if the file is indeed missing...
							if (!is_file($full_path)) {
								// ... and skip the hash checks
								continue;
							} // ... because if it isn't, we need to check it since the administrator might have put it back after he noticed it was missing
						} else {
							// grab the hash from the file found in the database
							$file_hash = $ignored_files[$file_path]->hash;
						}
					}
					
					if (file_exists($full_path)) {
						$file_size = filesize($full_path);
						
						// let's hope the file can be read
						if ($memory_usage + $file_size < $memory_limit) {
							// does this file have a wrong checksum ?
							if (md5_file($full_path) != $file_hash) {
								$result->wrong[] = $file_path;
								
								// refresh this
								$memory_usage = memory_get_usage();
							}
						}
					} else {
						$result->missing[] = $file_path;
						
						// refresh this
						$memory_usage = memory_get_usage();
					}
					
					$limit--;
				}
				
				// get the current pointer
				$result->fstop = ftell($handle);
				// we're done, close
				fclose($handle);
				
				return $result;
			} else {
				$this->setError(JText::sprintf('COM_RSFIREWALL_COULD_NOT_READ_HASH_FILE', $hash_file));
				return false;
			}
		}
		
		$this->setError(JText::sprintf('COM_RSFIREWALL_NO_HASHES_FOUND', $version));
		return false;
	}
	
	public function checkPermissions($path) {
		if (!is_readable($path)) {
			return false;
		}
		
		return substr(decoct(@fileperms($path)),-3);
	}
	
	public function setOffsetLimit($limit) {
		$this->limit = $limit;
	}
	
	public function getFoldersRecursive($folder) {
		// cache the ignored items
		$this->_getIgnored();
		
		$result = $this->getFoldersLimit($folder);
		// something has gone wrong, tell the controller to throw an error message
		if ($result === false) {
			return false;
		}
		
		if ($this->folders) {
			// found folders...
			return $this->folders;
		} else {
			// this most likely means we've reached the end
			return true;
		}
	}
	
	public function getFilesRecursive($startfile) {
		// cache the ignored items
		$this->_getIgnored();
		
		$this->files = array();
		$result = $this->getFilesLimit($startfile);	
		// something has gone wrong, tell the controller to throw an error message
		if ($result === false) {
			return false;
		}
		
		// found files
		return $this->files;
	}
	
	protected function _loadSignatures() {
		$db 	= $this->getDbo();
		$query 	= $db->getQuery(true);
		
		$query->select('*')
			  ->from($db->quoteName('#__rsfirewall_signatures'));
		
		$db->setQuery($query);
		return $db->loadObjectList();
	}
	
	public function checkSignatures($file) {
		static $signatures;
		if (!is_array($signatures)) {
			jimport('joomla.filesystem.file');
			$signatures = $this->_loadSignatures();
		}
		
		if (!is_readable($file)) {
			$this->setError(JText::sprintf('COM_RSFIREWALL_COULD_NOT_READ_FILE', $file));
			return false;
		}
		
		$contents = JFile::read($file);
		
		foreach ($signatures as $signature) {
			if ($signature->type == 'regex') {
				if (preg_match('#'.$signature->signature.'#', $contents, $match)) {
					
					// this needs special handling to remove false alerts
					if ($signature->reason == 'Suspicious JS inclusion') {
						$exclusions = array(
							'\.facebook\.com',
							'facebook\.net/',
							'www\.intensedebate\.com',
							'intensedebate\.com',
							'static\.klarna\.com',
							'\.fbcdn\.net',
							'addtoany\.com',
							'disqus\.com',
							'twitter\.com',
							'amazon\.com',
							'google\.com',
							'jquery\.com',
							'addthis\.com',
							'widgets\.twimg\.com',
							'\.ohloh\.net',
							'\.googlecode\.com',
							'stumbleupon\.com',
							'www\.stumbleupon\.com',
							'use\.typekit\.com',
							'\.amazonaws\.com',
							'player\.ku6\.com',
							'\.googleapis\.com',
							'\.purlhub\.com',
							'api\.recaptcha\.net',
							'userapi\.com',
							'platform\.linkedin\.com',
							'cdn\.connect\.mail\.ru',
							'getfirebug\.com',
							'js\.stripe\.com',
							'w\.sharethis\.com',
							'www\.jscache\.com',
							'\.netdna-cdn\.com',
							'zor\.livefyre\.com',
							'assets\.pinterest\.com',
							'ext\.nicovideo\.jp',
							'flash\.revver\.com',
							'ws\.sharethis\.com',
							'pagead2\.googlesyndication\.com'
						);
						
						if (preg_match_all('#'.$signature->signature.'#', $contents, $matches)) {
							foreach ($matches[1] as $src) {
								if (!preg_match('#('.implode('|', $exclusions).')#', $src, $match)) {
									return array('match' => $src, 'reason' => $signature->reason);
								}
							}
						}
						
						continue;
					}
					
					return array('match' => $match[0], 'reason' => $signature->reason);
				}
			} elseif ($signature->type == 'filename') {
				if (preg_match('#'.$signature->signature.'#i', basename($file), $match)) {
					return array('match' => $match[0], 'reason' => $signature->reason);
				}
			}
		}
		return false;
	}
	
	public function getLastFile($root) {
		// cache the ignored items
		$this->_getIgnored();
		
		$files = $this->getFiles($root, false, false);
		// must remove ignored files
		if ($this->ignored['files']) {
			// remove ignored files
			$files = array_diff($files, $this->ignored['files']);
			// renumber indexes
			$files = array_merge(array(), $files);
		}
		$last_file = end($files);
		// this shouldn't happen
		if (!$files) {
			$last_file = $root.self::DS.'index.php';
		}
		
		return $last_file;
	}
	
	public function getOffset() {
		return RSFirewallConfig::getInstance()->get('offset');
	}
	
	public function saveGrade() {
		$app	= JFactory::getApplication();
		$input  = $app->input;
		$config = $this->getConfig();
		
		$config->set('grade', $input->get('grade', '', 'int'));
	}
	
	public function getSideBar() {
		require_once JPATH_COMPONENT.'/helpers/toolbar.php';
		
		return RSFirewallToolbarHelper::render();
	}
}