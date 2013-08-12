<?php
/**
 * @version		$Id: default_forum_info.php 204 2011-03-24 03:17:46Z phonglq $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>
<script>
function btnDefault_click() {
	document.adminForm.forum_name.value = "<?php echo $this->output->forum->name ?>"; 
	document.adminForm.forum_description.value = "<?php echo $this->output->forum->description ?>";
	document.adminForm.forum_wellcome_message.value = "<?php echo $this->output->forum->wellcome_message; ?>";
	document.adminForm.forum_prompt.value = "<?php echo $this->output->forum->prompt ?>";
	document.adminForm.forum_example.value = "<?php echo $this->output->forum->example ?>";
}
function obDoSwitch(switcher){
	var el = switcher.getParent().getFirst(".ob_switch");
	if(el.value == 1){
		switcher.setProperty("class","switcher-off");
		el.value = 0;
	}else{
		switcher.setProperty("class","switcher-on");
		el.value = 1;
	}
}

window.addEvent("domready", function() {
	/* Switch buttons */
	$$(".ob_switch").each(function(el){
		el.setStyle("display","none");
		var style = (el.value == 1) ? "on" : "off";
		var switcher = new Element("div",{"class" : "switcher-"+style,"onclick":"obDoSwitch(this)"});
		switcher.injectAfter(el);
	});
});
</script>
<?php
	$task = JRequest::getVar('task');
	$controller = JRequest::getVar('controller');
	if (strcmp($controller,"forum") == 0) {
		if ((strcmp($task,"edit") != 0) && (strcmp($task,"view") != 0)) {
			$this->output->forum->name = ""; 
			$this->output->forum->description = "";
			$this->output->forum->wellcome_message = "";
			$this->output->forum->prompt = "";
			$this->output->forum->example = "";
		}
	}
?>
<fieldset>
<legend><?php echo JText::_("Details")?> </legend>
<table class="admintable" border="0" width="97%">
	<tr>
		<td class="key"><?php echo JText::_("Name")?></td>
		<td><input type="text" style="width: 100%" name="forum_name" value="<?php echo $this->output->forum->name; ?>"/></td>
	</tr>
	<tr>
		<td class="key"><?php echo JText::_("Published")?></td>
		<td>
			<select name="forum_published" class="ob_switch">
				<option value="0"<?php echo ($this->output->forum->published == 1)? '' : ' selected="selected"' ;?>><?php echo JText::_("OBSG_NO")?></option>
				<option value="1"<?php echo ($this->output->forum->published == 1)? ' selected="selected"' : '' ;?>><?php echo JText::_("OBSG_YES")?></option>
			</select>
		</td>
	</tr>
	<tr>
		<td class="key" valign="top"><?php echo JText::_("Description")?></td>
		<td><textarea style="width: 100%" name="forum_description"><?php echo $this->output->forum->description; ?></textarea></td>
	</tr>
	<tr>
		<td class="key" valign="top"><?php echo JText::_("WELLCOME_MESSAGE")?></td>
		<td><textarea style="width: 100%" name="forum_wellcome_message"><?php echo $this->output->forum->wellcome_message; ?></textarea></td>
	</tr>
	<tr>
		<td class="key"><?php echo JText::_("Prompt")?></td>
		<td><input type="text" style="width: 100%" name="forum_prompt" value="<?php echo $this->output->forum->prompt; ?>"/></td>
	</tr>
	<tr>
		<td class="key"><?php echo JText::_("EXAMPLE_TEXT")?></td>
		<td><input type="text" style="width: 100%" name="forum_example" value="<?php echo $this->output->forum->example; ?>"/></td>
	</tr>
	<tr>
		<td class="key"><?php echo JText::_('OBSG_LIMIT_POINT'); ?></td>
		<td>
			
			<select onchange="if(this.value != 0 ) {document.getElementById('input_limitpoint').style.display='block';} else {$('input_limitpoint').value=0;document.getElementById('input_limitpoint').style.display='none';}">
				<option value="0"<?php echo ($this->output->forum->limitpoint)? '' : ' selected="selected"' ; ?>><?php echo JText::_("OBSG_GLOBAL_CONFIG"); ?></option>
				<option value="1"<?php echo ($this->output->forum->limitpoint)? ' selected="selected"' : '' ; ?>><?php echo JText::_("OBSG_CUSTOME"); ?></option>
			</select>
			<div style="clear: both;"></div>
			<?php $style = ($this->output->forum->limitpoint)? '' : 'style="display:none" ' ;?>
			<input <?php echo $style; ?>id="input_limitpoint" type="text" name="forum_limitpoint" value="<?php echo $this->output->forum->limitpoint; ?>">
		</td>
	</tr>
	<?php if ((strcmp($controller,'forum')  == 0) & (strcmp($task,'view') != 0)) {?>
	<tr>
		<td colspan="2">
			<input type="button" name="default" value="<?php echo JText::_("Load_Default")?>" onclick="btnDefault_click()" style="width: 100%;">
		</td>
	</tr>
	<?php }?>
</table>
</fieldset>