<?php 

defined('JPATH_BASE') or die;


?>
<script src="../jscolor/jscolor.js" type="text/javascript"></script>
<script src="js/combobox.js" type="text/javascript"></script>
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
<form name="adminForm" id="adminForm" action="index.php" method="post">
<div class="container">	
	<div class="mainBody">
		<h3>Setup</h3>
		<fieldset class="adminform">
		<legend>Editing Area</legend>
		<table width="100%" border="0" cellpadding="0" cellspacing="0">
		<tr>
			<td><img align="middle" src="images/font.png"/></td>
			<td>Select font-family to be used in the editing area</td>			
			<td align="right" class="last"><?php echo $this->fontFamilyList;?></td>
		</tr>
		<tr>
			<td><img align="middle" src="images/paint.png"/></td>
			<td>Select font-color to be used in the editing area</td>			
			<td align="right" class="last"><input type="text" value="<?php echo $this->defaultFontColor; ?>" id="name" name="ftcolor" class="color box"/></td>
		</tr>
		<tr>
			<td><img align="middle" src="images/paint.png"/></td>
			<td>Select font-size to be used in the editing area</td>			
			<td align="right" class="last"><?php echo $this->fontSizeList;?></td>
		</tr>
		<tr>
			<td><img align="middle" src="images/paint.png"/></td>
			<td>Select background-color to be used in the editing area</td>			
			<td  align="right" class="last"><input type="text" value="<?php echo $this->defaultBackgroundColor; ?>"  id="name" name="bgcolor" class="color box"/></td>
		</tr>
		</table>
		</fieldset>
	</div>
</div>
<?php if(!JUtility::isWinOS()) : ?>
<div class="buttons left">
<button onclick="document.adminForm.task.value='';document.adminForm.submit();"><<< Prev</button>
</div>
<?php endif; ?>
<div class="buttons">
  <input type="submit" value="Next  >>>" />
</div>
<input type="hidden" name="task" value="folders" />	
 </form>