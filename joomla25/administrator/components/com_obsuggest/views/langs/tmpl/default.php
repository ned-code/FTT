<?php
/**
 * @version		$Id: default.php 341 2011-06-04 09:47:01Z phonglq $
 * @package		oblangs - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

if(isset($this->rwlanguage->data)) {
	$display = $this->rwlanguage->data;
	$pageNav	= $this->rwlanguage->pageNav;
}
$lists		= $this->rwlanguage->lists;
?>
<script type="text/javascript">
function submitbutton(pressbutton){
	submitform(pressbutton);
	return;
}
</script>

<form action ="index.php?option=com_obsuggest" method="POST" name="adminForm" id ="adminForm" >
	<table>
		<tr>
			<td align="left" width="100%">
				<?php echo JText::_( 'Filter' ); ?>:
				<input type="text" name="search" id="search" value="<?php echo $lists['search'];?>" class="text_area" />
				<button onclick="this.form.submit();"><?php echo JText::_( 'Go' ); ?></button>
				<button onclick="document.getElementById('search').value='';this.form.submit();"><?php echo JText::_( 'Reset' ); ?></button>
			</td>
		</tr>
	</table>
	<table class="adminlist">
		<thead>
		<tr>
			<th width="10px">
				<?php echo JText::_( 'Num' ); ?>
			</th>
			<th width="10px">
				<?php echo JText::_( 'CHARACTER_DEFINED' ); ?>
			</th>
			<th width="25px" class="title">
				<?php echo JText::_( 'UPDATE_CHARACTER_LANGUAGE' ); ?>
			</th>
		</tr>
		</thead>
		<?php if(isset($pageNav)) {?>
			<tfoot>
				<tr>
					<td colspan="11">
						<?php echo $pageNav->getListFooter(); ?>
					</td>
				</tr>
			</tfoot>
		<?php } ?>
		<tbody>
		<?php 
			$cid = JRequest::getVar('cid');
			$cid = $cid[0];
		if(isset($display)) {
			for($i=0;$i<count($display);$i++) {
		?>
				<tr>
					<td width="5%">
					<?php 
						echo $pageNav->getRowOffset($i); 
					?>
					</td>
					<td width="5%">
						<input  disabled = "disabled" class ="text_area" type = "text" value = "<?php echo $display[$i]->id; ?>" size="60" />
						<input type="hidden" name = "lang<?php echo $i;?>" value = "<?php echo $display[$i]->id; ?>" />
					</td>
					<td width="25px">
						<input name = "jlord_lang<?php echo $i;?>" class ="text_area" type = "text" value = "<?php echo $display[$i]->value; ?>" size="100" onchange="if(this.name.lastIndexOf('123456') == -1) {this.name=this.name+123456; document.getElementById('add_write').value='jlord';}"/>
					</td>
				</tr>
			<?php
			}
		}
			?>
		</tbody>
	</table>
	<input type="hidden" value="langs" name ="controller" />
<!--	<input type="hidden" value="<?php //echo $this->totalObject; ?>" name ="totalObject" />-->
	<input type="hidden" name ="add_write" id = "add_write" value=""/>
	<input type="hidden" value="<?php echo count($display); ?>" name ="total_data" />
	<input type="hidden" value="" name ="task" />
	<input type="hidden" value="<?php echo JRequest::getVar('redirect_file',''); ?>" name ="redirect_file" />
	<input type="hidden" value="<?php echo $cid;?>" name ="cid[]" />
</form>
