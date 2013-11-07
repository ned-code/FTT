<?php
/**
* @version 1.4.0
* @package RSFirewall! 1.4.0
* @copyright (C) 2009-2013 www.rsjoomla.com
* @license GPL, http://www.gnu.org/licenses/gpl-2.0.html
*/

defined('_JEXEC') or die('Restricted access');

class RSFirewallConfig
{
	protected $config;
	protected $types;
	protected $db;
	
	public function __construct() {
		$this->db = JFactory::getDbo();
		$this->load();
	}
	
	public function get($key, $default=false, $explode=false) {
		if (isset($this->config->$key)) {
			return $explode ? $this->explode($this->config->$key) : $this->config->$key;
		}
		
		return $default;
	}
	
	public function getKeys() {
		return array_keys((array) $this->config);
	}
	
	public function getData() {
		return $this->config;
	}
	
	public function reload() {
		$this->load();
	}
	
	protected function load() {
		// reset the values
		$this->config = new stdClass();
		$this->types  = new stdClass();
		
		// need this to be added as well
		$query 	= $this->db->getQuery(true);
		$query->select($this->db->quoteName('path'))
			  ->from('#__rsfirewall_ignored')
			  ->where($this->db->quoteName('type').'='.$this->db->quote('ignore_folder').' OR '.$this->db->quoteName('type').'='.$this->db->quote('ignore_file'));
		$this->db->setQuery($query);
		$this->config->ignore_files_folders = $this->implode($this->db->loadColumn());
		
		$query->clear();
		$query->select($this->db->quoteName('file'))
			  ->from('#__rsfirewall_hashes')
			  ->where($this->db->quoteName('type').'='.$this->db->quote('protect'));
		$this->config->monitor_files = $this->implode($this->db->loadColumn());
		
		// prepare the query
		$query 	= $this->db->getQuery(true);
		$query->select('*')->from('#__rsfirewall_configuration');
		$this->db->setQuery($query);
		
		// run the query
		if ($results = $this->db->loadObjectList()) {
			foreach ($results as $result) {
				if (substr($result->type, 0, 5) == 'array') {
					$result->value = $this->explode($result->value);
				}
				
				$this->types->{$result->name}  = $result->type;
				$this->config->{$result->name} = $result->value;
			}
		}
	}
	
	protected function explode($string) {
		$string = str_replace(array("\r\n", "\r"), "\n", $string);
		return explode("\n", $string);
	}
	
	protected function implode($string) {
		return implode("\n", $string);
	}
	
	protected function convert($key, &$value) {
		if (isset($this->types->$key)) {
			switch ($this->types->$key) {
				case 'int':
					$value = (int) $value;
				break;
				
				case 'array-int':
					if (is_array($value)) {
						JArrayHelper::toInteger($value);
						$value = implode("\n", $value);
					}
				break;
				
				case 'array-text':
					if (is_array($value)) {
						$value = implode("\n", $value);
					}
				break;
			}
		}
	}
	
	public function set($key, $value) {
		if (isset($this->config->$key)) {
			// convert values to appropriate type
			$this->convert($key, $value);
			
			// refresh our value
			$this->config->$key = $value;
			
			// array are converted to strings here
			if (is_array($value)) {
				$value = implode("\n", $value);
			}
			
			// prepare the query
			$query = $this->db->getQuery(true);
			$query->update('#__rsfirewall_configuration')
				  ->set($this->db->quoteName('value').'='.$this->db->quote($value))
				  ->where($this->db->quoteName('name').'='.$this->db->quote($key));
			$this->db->setQuery($query);
			
			// run the query
			return $this->db->execute();
		}
		
		return false;
	}
	
	public static function getInstance() {
		static $inst;
		if (!$inst) {
			$inst = new RSFirewallConfig();
		}
		
		return $inst;
	}
}