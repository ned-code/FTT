<?php
/**
 * @version		$Id: class.output.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

class Output extends JObject {
	 public $output = null;
	 
	 function __construct() {
	 	parent::__construct();
	 	$this->output = new stdClass();
	 }
	 
	 public function getOutput() {
	 	return $this->output;
	 }
	 public function addProperty($name='name',$value=null) {
	 	$this->output->$name = $value;
	 }
	 
}
?>