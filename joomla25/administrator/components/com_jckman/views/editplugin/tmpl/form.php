<?php defined('_JEXEC') or die('Restricted access'); ?>
			
<?php JHTML::_('behavior.tooltip'); ?>

<?php
	// clean item data
	JFilterOutput::objectHTMLSafe( $this->plugin, ENT_QUOTES, '' );
	
	$row =& $this->plugin;
?>

<?php
	$this->plugin->nameA = '';
	if ( $this->plugin->id ) {
		$row->nameA = '<small><small>[ '. $this->plugin->name .' ]</small></small>';
	}
	$icon_disabled 		= $this->plugin->type 	== 'command' ? ' disabled="disabled"' : '';
?>
<script language="javascript" type="text/javascript">
	Joomla.submitbutton = function(pressbutton) {
		if (pressbutton == "cancelEdit") {
			submitform(pressbutton);
			return;
		}
		// validation
		var form = document.adminForm,
			selectedType;
	
			for (i=0;i< form.toolbars.length;i++){
				if (form.toolbars[i].checked==true){
					selectedType = form.toolbars[i].value;
					break 
				}
			}
			if(selectedType == 'all') enableselections();
			submitform(pressbutton);
		
	}
</script>

<form action="index.php" method="post" name="adminForm" id="adminForm">
<div class="col width-60">
	<fieldset class="adminform" style="height:288px;">
	<legend><?php echo JText::_( 'Details' ); ?></legend>
	<table class="admintable">
		<tr>
			<td width="100" class="key">
				<label for="name">
					<?php echo JText::_( 'Description' ); ?>:
				</label>
			</td>
			<td>
				<input class="text_area" type="text" name="title" id="title" size="35" value="<?php echo $this->plugin->title; ?>" <?php echo (!$this->plugin->title ? 'disabled="disabled"' : '');?> />
			</td>
		</tr>
		<tr>
			<td valign="top" class="key">
				<?php echo JText::_( 'Published' ); ?>:
			</td>
			<td>
				<?php echo $this->lists['published']; ?>
			</td>
		</tr>
		<tr>
			<td valign="top" class="key">
				<label for="folder">
					<?php echo JText::_( 'Type' ); ?>:
				</label>
			</td>
			<td>
				<?php echo $this->plugin->type; ?>
			</td>
		</tr>
		<tr>
			<td valign="top" class="key">
				<label for="file">
					<?php echo JText::_( 'Plugin name' ); ?>:
				</label>
			</td>
			<td>
				<input class="text_area" type="text" name="name" id="name" size="35" value="<?php echo $this->plugin->name; ?>"  disabled="disabled" />
			</td>
			    <tr>
			<td valign="top" class="key">
				<label for="icon">
					<?php echo JText::_( 'Plugin Icon' ); ?>:
				</label>
			</td>
			<td>
                <input class="text_area" type="text" name="icon" id="icon" size="35" value="<?php echo $this->plugin->icon; ?>" />
			</td>
		</tr>
		</tr>
    </table>
	</fieldset>
</div>
<div class="col width-40">
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
	<fieldset class="adminform" style="<?php echo (!$this->plugin->title ? 'visibility:hidden;' : '');?>">
	<legend><?php echo JText::_( 'Toolbars' ); ?></legend>
		<table class="adminform" style="border:0px;">
		<tr>
			<td width="120">
				<?php echo JText::_( 'Toolbars(s)' ); ?>
			</td>
			<td>
			<?php if ($row->pages == 'all') { ?>
				<label for="toolbars-all"><input id="toolbars-all" type="radio" name="toolbars" value="all" onclick="allselections();" checked="checked" /><?php echo JText::_( 'All' ); ?></label>
				<label for="toolbars-none"><input id="toolbars-none" type="radio" name="toolbars" value="none" onclick="disableselections();" /><?php echo JText::_( 'None' ); ?></label>
				<label for="toolbars-select"><input id="toolbars-select" type="radio" name="toolbars" value="select" onclick="enableselections();" /><?php echo JText::_( 'Select From List' ); ?></label>
			<?php } elseif ($row->pages == 'none') { ?>
				<label for="toolbars-all"><input id="toolbars-all" type="radio" name="toolbars" value="all" onclick="allselections();" /><?php echo JText::_( 'All' ); ?></label>
							<label for="toolbars-none"><input id="toolbars-none" type="radio" name="toolbars" value="none" onclick="disableselections();" checked="checked" /><?php echo JText::_( 'None' ); ?></label>
							<label for="toolbars-select"><input id="toolbars-select" type="radio" name="toolbars" value="select" onclick="enableselections();" /><?php echo JText::_( 'Select From List' ); ?></label>
			<?php } else { ?>
			<label for="toolbars-all"><input id="toolbars-all" type="radio" name="toolbars" value="all" onclick="allselections();" /><?php echo JText::_( 'All' ); ?></label>
							<label for="toolbars-none"><input id="toolbars-none" type="radio" name="toolbars" value="none" onclick="disableselections();" /><?php echo JText::_( 'None' ); ?></label>
							<label for="toolbars-select"><input id="toolbars-select" type="radio" name="toolbars" value="select" onclick="enableselections();" checked="checked" /><?php echo JText::_( 'Select From List' ); ?></label>
			<?php } ?>	
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
	</fieldset>
</div>
<?php if ($row->pages == 'all') { ?>
	<script type="text/javascript">allselections();</script>
<?php } elseif ($row->pages == 'none') { ?>
	<script type="text/javascript">disableselections();</script>
<?php } else { ?>
<?php } ?>

<div class="clr"></div>
<div class="width-60">
	<?php echo JHtml::_('sliders.start','plugin-sliders-'.$this->plugin->id); ?>

		<?php echo $this->loadTemplate('options'); ?>

		<div class="clr"></div>

	<?php echo JHtml::_('sliders.end'); ?>
</div>
<div class="col width-40">
	<script type="text/javascript">
					function allgroups() {
						var e = document.getElementById('groups');
							e.disabled = true;
						var i = 0;
						var n = e.options.length;
						for (i = 0; i < n; i++) {
							e.options[i].disabled = true;
							e.options[i].selected = true;
						}
					}
					function disablegroups() {
						var e = document.getElementById('groups');
							e.disabled = true;
						var i = 0;
						var n = e.options.length;
						for (i = 0; i < n; i++) {
							e.options[i].disabled = true;
							e.options[i].selected = false;
						}
					}
					function enablegroups() {
						var e = document.getElementById('groups');
							e.disabled = false;
						var i = 0;
						var n = e.options.length;
						for (i = 0; i < n; i++) {
							e.options[i].disabled = false;
						}
					}
	</script>
	<fieldset class="adminform" style="<?php echo (!$this->plugin->title ? 'visibility:hidden;' : '');?>">
	<legend><?php echo JText::_( 'User Group Access' ); ?></legend>
		<table class="adminform" style="border:0px;">
		<tr>
			<td width="120">
				<?php echo JText::_( 'User Group(s)' ); ?>
			</td>
			<td>
			<?php if ($row->groups == 'all') { ?>
				<label for="group-all"><input id="group-all" type="radio" name="group" value="all" onclick="allgroups();" checked="checked" /><?php echo JText::_( 'All' ); ?></label>
				<label for="group-none"><input id="group-none" type="radio" name="group" value="none" onclick="disablegroups();" /><?php echo JText::_( 'Special' ); ?></label>
				<label for="group-select"><input id="group-select" type="radio" name="group" value="select" onclick="enablegroups();" /><?php echo JText::_( 'Select From List' ); ?></label>
			<?php } elseif ($row->groups == 'special') {  ?>
				<label for="group-all"><input id="group-all" type="radio" name="group" value="all" onclick="allgroups();" /><?php echo JText::_( 'All' ); ?></label>
							<label for="group-none"><input id="group-none" type="radio" name="group" value="none" onclick="disablegroups();" checked="checked" /><?php echo JText::_( 'Special' ); ?></label>
							<label for="group-select"><input id="group-select" type="radio" name="group" value="select" onclick="enablegroups();" /><?php echo JText::_( 'Select From List' ); ?></label>
			<?php } else { ?>
			<label for="group-all"><input id="group-all" type="radio" name="group" value="all" onclick="allgroups();" /><?php echo JText::_( 'All' ); ?></label>
							<label for="group-none"><input id="group-none" type="radio" name="group" value="none" onclick="disablegroups();" /><?php echo JText::_( 'Special' ); ?></label>
							<label for="group-select"><input id="group-select" type="radio" name="group" value="select" onclick="enablegroups();" checked="checked" /><?php echo JText::_( 'Select From List' ); ?></label>
			<?php } ?>	
			</td>
		</tr>
		<tr>
			<td valign="top" class="key">
				<?php echo JText::_( 'User Group Selection' ); ?>:
			</td>
			<td>
				<?php echo $this->lists['groups']; ?>
			</td>
		</tr>
		</table>
	</fieldset>
</div>
<?php if ($row->groups == 'all') { ?>
	<script type="text/javascript">allgroups();</script>
<?php } elseif ($row->groups == 'special') { ?>
	<script type="text/javascript">disablegroups();</script>
<?php } else { ?>
<?php } ?>

<div class="clr"></div>

	<input type="hidden" name="option" value="com_jckman" />
	<input type="hidden" name="id" value="<?php echo $row->id; ?>" />
	<input type="hidden" name="cid[]" value="<?php echo $row->id; ?>" />
  	<input type="hidden" name="controller" value="list" />
	<input type="hidden" name="task" value="" />
	<?php echo JHTML::_( 'form.token' ); ?>
</form>