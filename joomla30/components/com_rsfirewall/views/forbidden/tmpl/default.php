<?php
/**
* @version 1.4.0
* @package RSFirewall! 1.4.0
* @copyright (C) 2009-2013 www.rsjoomla.com
* @license GPL, http://www.gnu.org/licenses/gpl-2.0.html
*/

defined('_JEXEC') or die('Restricted access');
?>
<html>
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8" />
	<title><?php echo JText::_('COM_RSFIREWALL_403_FORBIDDEN'); ?></title>
	<style type="text/css">
	body {
		font-family: Trebuchet MS, "Times New Roman", Times, serif;
		font-size: 13px;
		color: #595959;
	}
	#center-alert {
		padding: 0;
		width: 350px;
		margin: 0 auto;
		text-align: center;
		border: solid 1px #c7c7c7;
	}
	#center-title {
		background: #F53D00;
		overflow: hidden;
		color: #fff;
		font-weight: bold;
	}
	</style>
</head>
<body>
<div id="center-alert">
	<div id="center-title">
		<p><?php echo JText::_('COM_RSFIREWALL_403_FORBIDDEN'); ?></p>
	</div>
	<p><?php echo $this->reason; ?></p>
</div>
</body>
</html>