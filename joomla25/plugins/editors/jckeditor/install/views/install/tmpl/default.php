<?php 

defined('JPATH_BASE') or die;


?>
<script type="text/javascript">
function submitform(pressbutton){
	if (pressbutton) {
		document.adminForm.task.value=pressbutton;
	}
	if (typeof document.adminForm.onsubmit == "function") {
		document.adminForm.onsubmit();
	}
	document.adminForm.submit();
}

var Joomla = {};

Joomla.submitbutton = function(pressbutton) {
	submitform(pressbutton);
}
</script>

<div class="header">
	<div class="innerHeader">
	<img src="images/headerTitle.png" height="48" width="155" />
	</div>
</div>
 <form name="adminForm" action="index.php" method="post">
<div class="container">	
	<div class="mainBody">
		<h3>System Health Check</h3>
		<fieldset class="adminform">
		<legend> Editor File Permissions</legend>
		<table width="100%" border="0" cellpadding="0" cellspacing="0">
		<tr>
			<td><img align="middle" src="images/<?php echo ($this->nonExecutableFilesTotal ? 'warning.png' : 'tick.png'); ?>"/></td>
			<td colspan="2"><?php echo $this->nonExecutableFilesTotal; ?> Files not executable: plugins/editors/jckeditor</td>			
			<td width="20%" align="right"><?php if($this->nonExecutableFilesTotal): ?><a href="javascript: Joomla.submitbutton('changeexecutablepermission')">Change now!</a><?php endif;?></td>
		</tr>
		<tr>
			<td><img align="middle" src="images/<?php echo ($this->incorrectChmodFilesTotal ? 'warning.png' : 'tick.png'); ?>"/></td>
			<td colspan="2"><?php echo $this->incorrectChmodFilesTotal; ?> files with not recommended permissions (<?php echo $this->permission; ?>)</td>			
			<td width="20%" align="right"><?php if($this->incorrectChmodFilesTotal): ?><a href="javascript: Joomla.submitbutton('changefilespermission')">Change now!</a><?php endif;?></td>
		</tr>
		<tr>
			<td><img align="middle" src="images/<?php echo ($this->incorrectChmodFoldersTotal ? 'warning.png' : 'tick.png'); ?>"/></td>
			<td colspan="2"><?php echo $this->incorrectChmodFoldersTotal; ?> folders with not recommended permissions (<?php echo $this->folderPermission; ?>)</td>			
			<td width="20%"align="right"><?php if($this->incorrectChmodFoldersTotal): ?><a href="javascript: Joomla.submitbutton('changefolderspermission')">Change now!</a><?php endif;?></td>
		</tr>
		</table>
		</fieldset>
		<fieldset class="adminform" style="margin-top:10px;">
		<legend>Image Folder Permissions</legend>
		<table width="100%" border="0" cellpadding="0" cellspacing="0">
		<tr>
			<td width="40"><img align="middle" src="images/<?php echo ($this->nonWritableImageFolderTotal ? 'warning.png' : 'tick.png'); ?>"/></td>
			<td colspan="2"><?php echo $this->nonWritableImageFolderTotal; ?> Folders not writable </td>			
			<td width="20%" align="right"><?php if($this->nonWritableImageFolderTotal): ?><a href="javascript: Joomla.submitbutton('changeimagefolderswritablepermission')">Change now!</a><?php endif;?></td>
		</tr>
		</table>
		</fieldset>
	</div>
</div>
<div class="buttons">
<input type="submit" value="Next  >>>" />
</div>	
<input type="hidden" name="task" value="font" />
 </form>