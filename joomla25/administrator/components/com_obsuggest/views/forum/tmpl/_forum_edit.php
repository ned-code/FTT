<form action="index.php?option=com_foobla_suggestion&controller=forum&task=update&id=<?php echo $this->forum->id; ?>" method="POST">
<table class="admintable">
	<tr>
		<td class="key">Name</td>
		<td><input type="text" size="40" name="forum_name" value="<?php echo $this->forum->name; ?>"/></td>
	</tr>
	<tr>
		<td class="key" valign="top">Description</td>
		<td><textarea cols="34" name="forum_description"><?php echo $this->forum->description; ?></textarea></td>
	</tr>
	<tr>
		<td class="key" valign="top">Wellcome Message</td>
		<td><textarea cols="34" name="forum_wellcome_message"><?php echo $this->forum->wellcome_message; ?></textarea></td>
	</tr>
	<tr>
		<td class="key">Prompt</td>
		<td><input type="text" size="40" name="forum_prompt" value="<?php echo $this->forum->prompt; ?>"/></td>
	</tr>
	<tr>
		<td class="key">Example Text</td>
		<td><input type="text" size="40" name="forum_example" value="<?php echo $this->forum->example; ?>"/></td>
	</tr>
	<tr>
		<td class="key"><?php echo JText::_('OBSG_LIMIT_POINT'); ?></td>
		<td><label><input type="radio" name="radio_limitpoint" /> <?php echo JText::_("OBSG_GLOBAL_CONFIG"); ?></label>
			<label><input type="radio" name="radio_limitpoint" onchange="if(this.selected) {$('input_limitpoint').disabled='disabled';} else {$('input_limitpoint').disabled='disabled';}" /> <?php echo JText::_("OBSG_CUSTOME"); ?></label>
			<br/>
			<input id="input_limitpoint" type="text" name="limitpoint" value="<?php echo $this->forum->limitpoint; ?>">
		</td>
	</tr>
	<tr>
		<td colspan="2">
			<input type="submit" />
		</td>
	</tr>
</table>
</form>
