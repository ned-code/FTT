<?php
/**
* @version 1.4.0
* @package RSFirewall! 1.4.0
* @copyright (C) 2009-2013 www.rsjoomla.com
* @license GPL, http://www.gnu.org/licenses/gpl-2.0.html
*/

defined('_JEXEC') or die('Restricted access');
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8" />
	<title><?php echo JText::_('COM_RSFIREWALL_PROTECTED_AREA'); ?></title>
	<style type="text/css">
		body { font:13.34px helvetica,arial,freesans,clean,sans-serif; background-color:#f7f7f7; }
		#auth { width: 415px; margin: 0 auto; margin-top: 55px; border: 1px solid #E4E4E4; background: #fff; padding: 14px; text-align: center; }
		input { width: 400px; border: 1px solid #D9D9D9; height: 22px; padding: 3px 5px; margin: 0 auto; }
		input:focus, input.focus { border-left: 3px solid #acacac; background-color: #FFFFCC; }
		button { background: #EDEDED; border-right: solid 1px #c7c7c7; border-bottom: solid 1px #c7c7c7; font-size: 14px; padding: 3px; cursor: pointer; }
		#header { background: #e5ecf9; padding: 10px; border:#aac6e8 solid 1px; }
		h1 { font-size: 14px; font-weight: bold; color:#0055b5; margin: 0; text-align: center; text-transform: uppercase; }
		label { text-align: left; display: block; width: 100%; margin-bottom: 3px; }
		#message { text-align: left; padding: 10px; position:relative; margin:10px 0 15px; color:#b50007; border:#e8aaad solid 1px; background:#f9e5e6; }
		#message span { display:block; font-weight:bold; padding:0 0 4px; text-transform: uppercase; }
		.clear { font-size: 1px; height: 1px; line-height: 1px; display: block; clear: both; }
	</style>
	<script type="text/javascript">
	function addEvent(obj, evType, fn) {
		if (obj.addEventListener) {
			obj.addEventListener(evType, fn, false); 
			return true; 
		} else if (obj.attachEvent) {
			var r = obj.attachEvent("on"+evType, fn); 
			return r; 
		} else { 
			return false; 
		}
	}
	addEvent(window, 'load', function() {
		var element = document.getElementsByName('rsf_backend_password')[0];
		addEvent(element, 'focus', function() { this.className = 'focus'; });
		addEvent(element, 'blur', function() { this.className = ''; });
		element.focus();
	});
	</script>
</head>
<body>
<div id="auth">
	<div id="header">
		<h1><?php echo JText::_('COM_RSFIREWALL_PLEASE_LOGIN_TO_CONTINUE'); ?></h1>
	</div>
	<div id="content">
		<?php if ($this->password_sent) { ?>
		<div id="message">
			<span><?php echo JText::_('COM_RSFIREWALL_ERROR'); ?></span>
			<?php echo JText::_('COM_RSFIREWALL_PASSWORD_INCORRECT'); ?>
		</div>
		<?php } ?>
		<form method="post" action="index.php">
			<p>
				<label><?php echo JText::_('COM_RSFIREWALL_PASSWORD'); ?>:</label>
				<input type="password" name="rsf_backend_password" value="" />
			</p>
			<p>
				<button type="submit"><?php echo JText::_('COM_RSFIREWALL_LOGIN'); ?></button>
			</p>
			<span class="clear"></span>
		</form>
	</div>
</div>
</body>
</html>