<?php
/**
 * @version		$Id: forum.php 164 2011-03-12 09:01:56Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @subpackage	able to preview the button from backend
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

class JElementPreview extends JElement
{
	var   $_name = 'preview';
	function fetchElement($name, $value, &$node, $control_name){
		$html = '';
		return $html;
	}
}
?>
