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

/**
require_once(JPATH_COMPONENT.DS."helpers".DS."dbase.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."handy.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."comment.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."idea.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."forum.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."permission.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."theme.php");
*/

class Output extends JObject {
	public $output = null;
	function __construct() {
		parent::__construct();
	}
	
	public function addValue($key, $value) {
		$this->output[$key] = $value;
		return null;
	}
	public function getOutput() {
		return $this->output;
	}
}
?>
