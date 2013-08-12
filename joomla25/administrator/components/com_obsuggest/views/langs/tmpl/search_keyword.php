<?php
/**
 * @version		$Id: search_keyword.php 341 2011-06-04 09:47:01Z phonglq $
 * @package		oblangs - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

if(isset($this->search_keyword->data)) {
	$display = $this->search_keyword->data;
	$pageNav	= $this->search_keyword->pageNav;
}
$lists			= $this->search_keyword->lists;
$search 		= $mainframe->getUserStateFromRequest( $option.'search1', 			'search1', 			'',				'string' );
?>
<script type="text/javascript">
function submitbutton(pressbutton){
	submitform(pressbutton);
	return;
}
</script>
<form action ="index.php?option=com_obsuggest" method="POST" name="adminForm" id ="adminForm" >
<div>&nbsp;</div>
	<table style="float:right;">
		<tr>
			<td nowrap="nowrap">
			<?php
				echo $lists['langs'];
			?>
			</td>				
			<td nowrap="nowrap">
			<?php
				echo $lists['dirlangs'];
			?>
			</td>
			<td nowrap="nowrap">
			<?php
				echo $lists['file_style'];
			?>
			</td>
		</tr>
	</table>
	<table class="adminlist">
		<thead>
		<tr>
			<th width="10px" align="right">
				<?php echo JText::_( 'Num' ); ?>
			</th>
			<th width="10px" align="">
				<?php echo JText::_( 'CHARACTER_DEFINED' ); ?>
			</th>
			<th width="25px" class="title">
				<?php echo JText::_( 'UPDATE_CHARACTER_LANGUAGE' ); ?>
			</th>			
			<th width="25px" class="title">
				<?php echo JText::_( 'LANGUAGE_FILE' ); ?>
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
						<input name = "jlord_lang<?php echo $i;?>" class ="text_area" type = "text" value = "<?php echo $display[$i]->value; ?>" size="100" onchange="if(this.name.lastIndexOf('123456') == -1) {this.name=this.name+123456; document.getElementById('add_write').value='jlord';}" />
					</td>					
					<td width="25px">
							<?php
								$file_name =substr( $display[$i]->file_name, ( strrpos( $display[$i]->file_name, DS) + 1 ) ); 
								$link = JFilterOutput::ampReplace('index.php?option='.$option.'&controller=langs&task=getrwlanguage&cid[]='.$display[$i]->file_name.'&search='.$search);
							?>
							<a href="<?php echo $link; ?>" ><?php echo $file_name; ?></a>
							<input type="hidden" name= "jlord_lang_file<?php echo $i; ?>" value="<?php echo $display[$i]->file_name; ?>" />
					</td>
				</tr>
			<?php
			}
		}
			?>
		</tbody>
	</table>
	<input type="hidden" value="langs" name ="controller" />
	<input type="hidden" name ="add_write" id = "add_write" value=""/>
	<input type="hidden" value="<?php echo count($display); ?>" name ="total_data" />
	<input type="hidden" value="search_keyword" name ="task" />
</form>
