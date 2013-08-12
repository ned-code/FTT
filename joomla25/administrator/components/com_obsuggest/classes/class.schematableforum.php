<?php
/**
 * @version		$Id: class.schematableforum.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

class SchemaTableForum {
	public $id = 0;
	public $name = '';
	public $description = '';
	public $wellcome_message = '';
	public $prompt = '';
	public $example = '';	
	public $published = 1;
}
?>
