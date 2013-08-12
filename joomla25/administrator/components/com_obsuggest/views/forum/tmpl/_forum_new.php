<form action="index.php?option=com_voice&controller=forum&task=update&id=<?php echo $this->forum->id; ?>" method="POST">
<table class="admintable">
	<tr>
		<td class="key">Name</td>
		<td><input type="text" size="40" name="forum_name" value=""/></td>
	</tr>
	<tr>
		<td class="key" valign="top">Description</td>
		<td><textarea cols="34" name="forum_description"></textarea></td>
	</tr>
	<tr>
		<td class="key" valign="top">Wellcome Message</td>
		<td><textarea cols="34" name="forum_wellcome_message"></textarea></td>
	</tr>
	<tr>
		<td class="key">Prompt</td>
		<td><input type="text" size="40" name="forum_prompt" value=""/></td>
	</tr>
	<tr>
		<td class="key">Example Text</td>
		<td><input type="text" size="40" name="forum_example" value=""/></td>
	</tr>
	<tr>
		<td colspan="2">
			<input type="submit" />
		</td>
	</tr>
</table>
</form>
