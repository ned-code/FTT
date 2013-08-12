<?php
/**
 * @version		$Id: import_add_file.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>
<form action="index.php?option=com_obsuggest&controller=exportimport&task=addImportFile&sign=import" method="POST" enctype="multipart/form-data">
<fieldset>
<legend><?php echo JText::_('Import File')?></legend>
<table width="100%">
	<tr>
		<td width="50%">							
			<input type="file" name="file_import" size="70px"/> 			
		</td>
		<td>
			<input type="submit" value="<?php echo JText::_('Upload')?>">
		</td>
	</tr>	
</table>
</fieldset>
</form>
