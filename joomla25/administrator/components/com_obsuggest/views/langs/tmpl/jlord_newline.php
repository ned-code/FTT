<?php
/**
 * @version		$Id: jlord_newline.php 341 2011-06-04 09:47:01Z phonglq $
 * @package		oblangs - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>
<script type="text/javascript">
function submitbutton(pressbutton){
	if(pressbutton=='insert_newline') {
		if(document.getElementById('jlord_character_defined').value == '') {
			alert('<?php echo JText::_('You can enter into least a character')?>');
			document.getElementById('jlord_character_defined').focus();
			return false;
		} else if(document.getElementById('jlord_character_update').value == '') {
			alert('<?php echo JText::_('You can enter into least a character')?>');
			document.getElementById('jlord_character_update').focus();
			return false;
		} else {
			submitform(pressbutton);
			return;
		}
	} else {
		submitform(pressbutton);
		return;
	}
}

</script>
<?php 
	$cid = JRequest::getVar('cid');
	$cid = $cid[0];
?>
<form action ="index.php?option=com_obsuggest" method="POST" name="adminForm" id ="adminForm" >
	<table class="adminform">
		<tr>
			<td>
				<label for="title">
					<?php echo JText::_("Comment")?>:				
				</label>
			</td>
			<td>
				<input type="text" value="" maxlength="255" size="40" id="jlord_comment" name="jlord_comment" class="inputbox"/>
			</td>
		</tr>		
		<tr>
			<td>
				<label for="title">
					<?php echo JText::_("Character defined")?>:				
				</label>
			</td>
			<td>
				<input type="text" value="" maxlength="255" size="40" id="jlord_character_defined" name="jlord_character_defined" class="inputbox"/>
			</td>
		</tr>		
		<tr>
			<td>
				<label for="title">
					<?php echo JText::_("Update Character Language")?>:				
				</label>
			</td>
			<td>
				<input type="text" value="" maxlength="255" size="40" id="jlord_character_update" name="jlord_character_update" class="inputbox"/>
			</td>
		</tr>
	</table>
	<input type="hidden" value="langs" name ="controller" />
	<input type="hidden" value="" name ="task" />
	<input type="hidden" value="<?php echo $cid;?>" name ="cid[]" />
</form>
