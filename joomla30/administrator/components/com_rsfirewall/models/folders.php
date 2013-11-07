<?php
/**
* @version 1.4.0
* @package RSFirewall! 1.4.0
* @copyright (C) 2009-2013 www.rsjoomla.com
* @license GPL, http://www.gnu.org/licenses/gpl-2.0.html
*/

defined('_JEXEC') or die('Restricted access');

class RSFirewallModelFolders extends JModelLegacy
{
	const DS = DIRECTORY_SEPARATOR;
	protected $path;
	protected $input;

	public function __construct() {		
		$this->path  = JPATH_SITE;
		$this->input = RSInput::create();
		if (is_dir($this->input->get('folder', '', 'none'))) {
			$this->path = $this->input->get('folder', '', 'none');
		}
		
		parent::__construct();
	}
	
	public function getDS() {
		return self::DS;
	}
	
	public function getPath() {
		return $this->path;
	}
	
	public function getPrevious() {
		$path = $this->getPath();
		$path = explode(self::DS, $path);
		array_pop($path);
		
		return implode(self::DS, $path);
	}
	
	public function getName() {
		return $this->input->get('name', '', 'none');
	}
	
	public function getFolders() {
		$checkModel = $this->getInstance('Check', 'RSFirewallModel');
		$path		= $this->getPath();
		
		return $checkModel->getFolders($this->path, false, true, false);
	}
	
	public function getFiles() {
		$checkModel = $this->getInstance('Check', 'RSFirewallModel');
		$path		= $this->getPath();
		
		return $checkModel->getFiles($this->path, false, true, false);
	}
	
	public function getElements() {
		$path 		= $this->getPath();
		$elements 	= explode(self::DS, $path);
		$navigation_path = '';
		foreach ($elements as $i => $element) {
			$navigation_path .= $element;
			$newelement = new stdClass();
			$newelement->name = $element;
			$newelement->fullpath = $navigation_path;
			$elements[$i] = (object) array(
				'name' => $element,
				'fullpath' => $navigation_path
			);
			$navigation_path .= self::DS;
		}
		
		return $elements;
	}
	
	public function getAllowFolders() {
		return $this->input->get('allowfolders', 0, 'int');
	}
	
	public function getAllowFiles() {
		return $this->input->get('allowfiles', 0, 'int');
	}
}