<?php
function render(){
$str = '
<iframe name="iframe-module-installer" id="iframe_module_installer" style="display:none;position:absolute;left:-1000px;width:1px;height:1px" onload="Modules.prototype.onModuleInstalled()"></iframe>
<form enctype="multipart/form-data" target="iframe-module-installer" action="index.php?option=com_manager&task=getModules" method="post" name="module" id="install_module">
	<table>
		<tr>
			<th colspan="2">Upload Package File</th>
		</tr>
		<tr>
			<td width="120">
				<label>Package File:</label>
			</td>
			<td width="350">
				<input type="file" size="57" value="Browse" id="browse" name="browse"/>
			</td>
			<td width="250">
				<input type="submit" value="Upload File &amp; Install" id="install" />
			</td>
		</tr>
		<tr>
			<td colspan="3"> 
				<div id="modules" width="100%" height="300px"></div>
			</td>
		</tr>
		<tr>
			<td></td>
			<td></td>
			<td>
				<input type="button" value="Uninstall" id="uninstall"/>
			</td>
		</tr>
	</table>
</form>';
return $str;
}
?>