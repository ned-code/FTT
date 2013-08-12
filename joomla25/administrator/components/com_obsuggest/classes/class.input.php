<?php
/**
 * @version		$Id: class.input.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

class Input extends JObject {
	 public $input = null;
	 
	 function __construct() {
	 	parent::__construct();
	 	$this->input = new stdClass();
	 }
	 
	 public function getInput() {
	 	return $this->input;
	 }
	 public function addProperty($name='name',$value=null) {
	 	$this->input->$name = $value;
	 }
	 
	 public function createInput($_input) {
	 	$tables = null;
	 	foreach ($_input as $key => $value) {
	 		$div = strpos($key,'_');	 		
	 		if ($div == false) {
	 			$this->addProperty($key,$value);
	 		} else {
	 			$table = substr($key,0,$div);
	 			$field = substr($key,$div+1);
	 			$ok = 0;
	 			
	 			if ($tables != null) {
		 			foreach ($tables as $k => $v) {
		 				if ($k == $table) {
		 					$v->$field = $value;
		 					$ok = 1;
		 					break;
		 				}
		 			}
	 			}
	 			
	 			if ($ok == 0){
	 				$temp = new stdClass();
	 				$temp->$field = $value;
	 				$tables[$table] = $temp;		
	 			}
	 		}
	 	}
	 	if ($tables != null) {
		 	foreach ($tables as $k => $v) {
		 		$this->addProperty($k,$v);
			 }
	 	}
	 }
	 
}
?>
