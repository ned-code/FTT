<script language="javascript" type="text/javascript">
<!--
	
	Joomla.submitbutton = function(pressbutton)
	{
		var form = document.adminForm;

		// do field validation
		if (form.install_package.value == ""){
			alert("<?php echo JText::_('Please select a backup package', true); ?>");
		} else {
			form.installtype.value = 'upload';
			form.submit();
		}
		
		
	}
	
	Joomla.submitbutton3 = function(pressbutton) {
		var form = document.adminForm;

		// do field validation
		if (form.install_directory.value == ""){
			alert( "<?php echo JText::_( 'Please select a directory', true ); ?>" );
		} else {
			form.installtype.value = 'folder';
			form.submit();
		}
	}

//-->
</script>

<form enctype="multipart/form-data" action="index.php" method="post" name="adminForm" id="adminForm">

	<?php if ($this->ftp) : ?>
		<?php echo $this->loadTemplate('ftp'); ?>
	<?php endif; ?>
	
	
	<div style="margin-right: 1%;">
	<table class="adminform">
	<tr>
		<th colspan="2"><?php echo JText::_( 'Upload Package File' ); ?></th>
	</tr>
	<tr>
		<td width="120">
			<label for="install_package"><?php echo JText::_( 'Package File' ); ?>:</label>
		</td>
		<td>
			<input class="input_box" id="install_package" name="install_package" type="file" size="57" />
			<input class="button" type="button" value="<?php echo JText::_( 'Upload File' ); ?> &amp; <?php echo JText::_( 'Install' ); ?>" onclick="Joomla.submitbutton()" />
		</td>
	</tr>
	</table>
	<table class="adminform">
	<tr>
		<th colspan="2"><?php echo JText::_( 'Install from directory' ); ?></th>
	</tr>
	<tr>
		<td width="120">
			<label for="install_directory"><?php echo JText::_( 'Install directory' ); ?>:</label>
		</td>
		<td>
			<input type="text" id="install_directory" name="install_directory" class="input_box" size="70" value="<?php echo $this->state->get('install.directory'); ?>" />
			<input type="button" class="button" value="<?php echo JText::_( 'Install' ); ?>" onclick="Joomla.submitbutton3()" />
		</td>
	</tr>
	</table>
	</div>
	<input type="hidden" name="view" value="import" />
	<input type="hidden" name="type" value="" />
	<input type="hidden" name="installtype" value="upload" />
	<input type="hidden" name="task" value="import" />
	<input type="hidden" name="option" value="com_jckman" />
	<input type="hidden" name="controller" value="import" />
	<?php echo JHTML::_( 'form.token' ); ?>
</form>