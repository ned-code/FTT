<?php noDirectAccess(); ?>
<style>
	.icon-48-angkor
	{
		background: url(./components/com_angkor/assets/images/angkor_48.png) no-repeat;
	}
	.icon-32-translate
	{
		background: url(./components/com_angkor/assets/images/icon-32-joomfish.png) no-repeat;
	}
</style>
<form method="post" action="index.php?option=com_angkor" name="adminForm">
<table class="adminform">
	<tr> 
		<td colspan="2">&nbsp;</td>
	</tr>
	<tr> 
		<td width="15%" align="right"><?php echo JText::_('JOOMLA_EMAIL_TYPE'); ?>:</td>
		<td width="85%"> 
			<select class="inputbox" name="code" onchange="adminForm.submit()">
				<option value=''>----------<?php echo JText::_('SELECT TYPE');?>----------</option>
				<option <?php echo selectOption('SEND_MSG_ACTIVATE',$this->code)?>><?php echo JText::_('SEND_MSG_ACTIVATE_OPTION') ;?></option>
				<option <?php echo selectOption('SEND_MSG',$this->code)?>><?php echo JText::_('SEND_MSG_OPTION');?></option>
				<option <?php echo selectOption('SEND_MSG_ADMIN_ACTIVATE_1',$this->code)?>><?php echo JText::_('SEND_MSG_ADMIN_ACTIVATE_1_OPTION') ;?></option>
				<option <?php echo selectOption('SEND_MSG_ADMIN_ACTIVATE_2',$this->code)?>><?php echo JText::_('SEND_MSG_ADMIN_ACTIVATE_2_OPTION') ;?></option>
				<option <?php echo selectOption('SEND_MSG_ADMIN_ACTIVATE_3',$this->code)?>><?php echo JText::_('SEND_MSG_ADMIN_ACTIVATE_3_OPTION') ;?></option>
				
				<option <?php echo selectOption('SEND_MSG_ADMIN',$this->code)?>><?php echo JText::_('SEND_MSG_ADMIN_OPTION'); ?></option>				
				
				<option <?php echo selectOption('SEND_MSG_TO_CONTACT',$this->code)?>><?php echo JText::_('SEND_MSG_TO_CONTACT_OPTION'); ?></option>
				<option <?php echo selectOption('SEND_COPY_MSG_TO_USER',$this->code)?>><?php echo JText::_('SEND_COPY_MSG_TO_USER_OPTION'); ?></option>
				<option <?php echo selectOption('SEND_COPY_MSG_TO_ADMIN',$this->code)?>><?php echo JText::_('SEND_COPY_MSG_TO_ADMIN_OPTION'); ?></option>
				<option <?php echo selectOption('ADD_NEW_USER',$this->code)?>><?php echo JText::_('ADD_NEW_USER_OPTION'); ?></option>
				<option <?php echo selectOption('USERNAME_REMINDER',$this->code)?>><?php echo JText::_('USERNAME_REMINDER_OPTION'); ?></option>
				<option <?php echo selectOption('PASSWORD_RESET_CONFIRMATION',$this->code)?>><?php echo JText::_('PASSWORD_RESET_CONFIRMATION_OPTION'); ?></option>
			</select>
			<?php echo $this->languages_list;?>
		</td>
	</tr><tr> 
		<td width="15%" align="right"><?php echo JText::_('JOOMLA_SENDER_NAME'); ?>:</td>
		<td width="85%">
			<input type="text" class="inputbox" name="sender_name" value="<?php echo $this->row->sender_name;?>" style="width:500px" size="250"/>
		</td>
	</tr>
	<tr> 
		<td width="15%" align="right"><?php echo JText::_('JOOMLA_SENDER_EMAIL'); ?>:</td>
		<td width="85%">
			<input type="text" class="inputbox" name="sender_email" value="<?php echo $this->row->sender_email;?>" style="width:500px" size="250"/>
		</td>
	</tr>
	<tr> 
		<td width="15%" align="right"><?php echo JText::_('JOOMLA_EMAIL_SUBJECT'); ?>:</td>
		<td width="85%">
			<input type="text" class="inputbox" name="subject" value="<?php echo $this->row->subject;?>" style="width:500px" size="250"/>
		</td>
	</tr>
	<tr> 
		<td width="15%" align="right" valign="top"><?php echo JText::_('JOOMLA_EMAIL_BODY'); ?>:</td>
		<td width="85%"> 
			<?php 
				$editor =JFactory::getEditor();
				echo $editor->display('body', $this->row->body, 800, 300, 90, 30 );				
			?>
		</td>		
	</tr>
	<tr>
		<td></td>
		<td>
			<br />
			<?php
				if($this->code!='')
				{
					if($this->availableFields=='')
						echo JText::_('VM_OTHER_MESSAGE_AVAILABLE_FIELS') . ' : '. JText::_('NO_FIELDS_PARAMETERS_AVAILABLE');
					else
						echo JText::_('VM_OTHER_MESSAGE_AVAILABLE_FIELS') . ' : '. $this->availableFields;
				}
			?>
		</td>
	</tr>
</table>
<input type="hidden" name="task" value="">
<input type="hidden" name="option" value="com_angkor">
</form>
<?php
function selectOption($value,$code)
	{
		if($code==$value)
			return " value='$value' selected=selected";
		else
			return " value='$value'";
	}
?>