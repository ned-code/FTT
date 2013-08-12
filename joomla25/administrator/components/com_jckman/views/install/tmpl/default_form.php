<script language="javascript" type="text/javascript">
<!--
	
	Joomla.submitbutton = function(pressbutton)
	{
		var form = document.adminForm;
		
		for (i=0;i< form.toolbars.length;i++){
				if (form.toolbars[i].checked==true){
					selectedType = form.toolbars[i].value;
					break 
				}
			}
		if(selectedType == 'all') enableselections();
		submitform(pressbutton);	
	}
	Joomla.submitbutton3 = function(pressbutton) {
		var form = document.adminForm;

		// do field validation
		if (form.install_directory.value == ""){
			alert( "<?php echo JText::_( 'Please select a directory', true ); ?>" );
		} else {
			form.installtype.value = 'folder';
			for (i=0;i< form.toolbars.length;i++){
				if (form.toolbars[i].checked==true){
					selectedType = form.toolbars[i].value;
					break 
				}
			}
			if(selectedType == 'all') enableselections();
			form.submit();
		}
	}

	Joomla.submitbutton4 = function(pressbutton) {
		var form = document.adminForm;

		// do field validation
		if (form.install_url.value == "" || form.install_url.value == "http://"){
			alert( "<?php echo JText::_( 'Please enter a URL', true ); ?>" );
		} else {
			form.installtype.value = 'url';
			for (i=0;i< form.toolbars.length;i++){
				if (form.toolbars[i].checked==true){
					selectedType = form.toolbars[i].value;
					break 
				}
			}
		if(selectedType == 'all') enableselections();
			form.submit();
		}
	}
//-->
</script>

<form enctype="multipart/form-data" action="index.php" method="post" name="adminForm" id="adminForm">

	<?php if ($this->ftp) : ?>
		<?php echo $this->loadTemplate('ftp'); ?>
	<?php endif; ?>
	
	
	<div style="float: left; width: 50%; margin-right: 1%;">
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

	<table class="adminform">
	<tr>
		<th colspan="2"><?php echo JText::_( 'Install from URL' ); ?></th>
	</tr>
	<tr>
		<td width="120">
			<label for="install_url"><?php echo JText::_( 'Install URL' ); ?>:</label>
		</td>
		<td>
			<input type="text" id="install_url" name="install_url" class="input_box" size="70" value="http://" />
			<input type="button" class="button" value="<?php echo JText::_( 'Install' ); ?>" onclick="Joomla.submitbutton4()" />
		</td>
	</tr>
	</table>
	</div>
	<div style="float: left; width: 49%;">
		<script type="text/javascript">
					function allselections() {
						var e = document.getElementById('selections');
							e.disabled = true;
						var i = 0;
						var n = e.options.length;
						for (i = 0; i < n; i++) {
							e.options[i].disabled = true;
							e.options[i].selected = true;
						}
					}
					function disableselections() {
						var e = document.getElementById('selections');
							e.disabled = true;
						var i = 0;
						var n = e.options.length;
						for (i = 0; i < n; i++) {
							e.options[i].disabled = true;
							e.options[i].selected = false;
						}
					}
					function enableselections() {
						var e = document.getElementById('selections');
							e.disabled = false;
						var i = 0;
						var n = e.options.length;
						for (i = 0; i < n; i++) {
							e.options[i].disabled = false;
						}
					}
		</script>
	<table class="adminform">
	<tr>
		<th colspan="2"><?php echo JText::_( 'Select toolbar to install plugin' ); ?></th>
	</tr>
	<tr>
		<td width="120">
			<?php echo JText::_( 'Toolbars(s)' ); ?>
		</td>
		<td>
			<label for="toolbars-all"><input id="toolbars-all" type="radio" name="toolbars" value="all" onclick="allselections();" checked="checked" /><?php echo JText::_( 'All' ); ?></label>
			<label for="toolbars-none"><input id="toolbars-none" type="radio" name="toolbars" value="none" onclick="disableselections();" /><?php echo JText::_( 'None' ); ?></label>
			<label for="toolbars-select"><input id="toolbars-select" type="radio" name="toolbars" value="select" onclick="enableselections();" /><?php echo JText::_( 'Select From List' ); ?></label>
		</td>
	</tr>
	<tr>
		<td valign="top" class="key">
			<?php echo JText::_( 'Toolbar Selection' ); ?>:
		</td>
		<td>
			<?php echo $this->lists['selections']; ?>
		</td>
	</tr>
	</table>
</div>	
	<script type="text/javascript">allselections();</script>
	<input type="hidden" name="view" value="install" />
	<input type="hidden" name="type" value="" />
	<input type="hidden" name="installtype" value="upload" />
	<input type="hidden" name="task" value="install.install" />
	<input type="hidden" name="option" value="com_jckman" />
	<input type="hidden" name="controller" value="Install" />
	<?php echo JHTML::_( 'form.token' ); ?>
</form>