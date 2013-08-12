<?php
/**
 * @version		$Id: config.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

require_once(JPATH_COMPONENT.DS."helper".DS."dbase.php");
final class Config {
	function __construct() {
	}
	public static function getConfig() {
		$query ="
			SELECT *
			FROM `#__foobla_uv_config`
		;";
		return DBase::getObject($query);
	}
	function removeBadChar($str, $arr = array('\''=>'&rsquo;','\\'=>'\\\\','"'=>'&quot;'))
	{
		foreach ($arr as $key=>$val)
		{
			$str = str_replace($key, $val, $str);
		}
		return $str;
	}
	public static function fixBadWord($_strWord) {
		$param = Config::getBadWord();
		foreach ($param as $value) {
			$_strWord = str_replace($value['badword'],$value['fixword'],$_strWord);
		}
		return Config::removeBadChar($_strWord);
	}
	
	public static function getBadWord() {
		$config = Config::getConfig();
		$badword = $config->bad_word;
		$badword .=","; 
		$rs = null;
		$badw = "";
		$fixw = "";
		$i = 0;		
		$ok = 0;
		$j = 0;
		for($i = 0; $i<strlen($badword); $i++) {
			if (substr($badword,$i,1) == "=") {
				$badw = trim($badw);
				if (strlen($badw) > 0) {
					$rs[$j]['badword'] = $badw;
				}
				$ok = 1;
				$badw = "";
				continue;
			}
			if (substr($badword,$i,1) == ",") {
				$fixw = trim($fixw);
				if (strlen($fixw) > 0) {
					$rs[$j]['fixword'] = $fixw;
				}
				$ok = 0;
				$fixw = "";
				$j++;
				continue;
			}
			if ($ok == 0) $badw .= substr($badword,$i,1); 
			if ($ok == 1) $fixw .= substr($badword,$i,1);
		}
		return $rs;
	}
}
?>