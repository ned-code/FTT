<?php
/**
 * @version		$Id: libs.php 245 2011-03-26 08:17:35Z phonglq $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

class Number
{
	function createNumber($num, $padleft = true)
	{
		if($num<0)
			$num = 0;
		if($padleft)
			$num = substr("000" . $num, -3, 3);
		$len = strlen($num)	;
		//echo (($len+1)*3);
		$ret = '<div class="number" style="width:'.(($len)*15).'px;">';
		for ($i = 0; $i<$len; $i++)		
		{
			$digit = substr($num, $i, 1);
			$ret .= '<span class="num'.$digit.'"></span>' . "\n";
		}
		$ret.="</div>";
		return $ret;
	}
	
	function getShortNumber ( $num )
	{
		if( $num > 1000 ) {
			$num = ( $num / 1000 );
			$num = number_format($num, 1, ',', '');
			return $num.'k';
		}
		else {
			return $num;
		}
	}
}
function redirectIfIsNotInt($value)
{
	$match 		= null;
	preg_match_all('/[^0-9]+/', $value, $match);
	$mainframe 	= &JFactory::getApplication();
	$option 	= 'com_obsuggest';
	if( count( $match[0] ) > 0 ) {
		$mainframe -> redirect ( "index.php?option=$option" );
	}
	
}
?>