<?php
/**
 * @version		$Id: default_forum.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

global $mainframe, $option, $obIsJ15;
JHTML::_('behavior.mootools');	
JHTML::_('behavior.tooltip');
?>
<script>
function btnNew_click() {
	$('task').value = 'add';
	$('adminForm').submit();
}
function btnDefault_click() {
	$('task').value = 'setDefault';	
	$('adminForm').submit();
}
function btnPublished_click() {
	$('task').value = 'published';	
	$('adminForm').submit();
}
function btnUnPublished_click() {
	$('task').value = 'unpublished';	
	$('adminForm').submit();
}
function myCheckAll(v) {	
	var frm = document.adminForm;
	var n2 = 0;
	for (i = 0; i < frm.length; i++){
        if (frm[i].type == "checkbox") {
              frm[i].checked = v;
              n2++;
        }
    }
    
	if (v) {
		document.adminForm.boxchecked.value = n2;
	} else {
		document.adminForm.boxchecked.value = 0;
	}
	
}
</script>
<form name="adminForm" id="adminForm" action="index.php?option=com_obsuggest&controller=forum" method="POST">
<?php $lists=$this->output->lists;?>
<table width="100%" class="adminlist" cellpadding="0" cellspacing="0">
	<thead>
	<tr>		
		<th width="3%">
		<?php echo JHTML::_('grid.sort','#', 'p.id', @$lists['order_Dir'], @$lists['order'] ); ?>
		</th>
		<th width="3%"> <input type="checkbox" onclick="return myCheckAll(this.checked)"/> </th>
		<th width="30%">
		<?php echo JHTML::_('grid.sort','FORUM_NAME', 'p.name', @$lists['order_Dir'], @$lists['order'] ); ?>
		</th>
		<th width="3%">
		<?php echo JHTML::_('grid.sort','Default', '', @$lists['order_Dir'], @$lists['order'] ); ?>
		</th>
		<th>
		<?php echo JHTML::_('grid.sort','Description', 'p.description', @$lists['order_Dir'], @$lists['order'] ); ?>
		</th>
		<th width="3">
		<?php echo JHTML::_('grid.sort','Published', 'p.published', @$lists['order_Dir'], @$lists['order'] ); ?>
		</th>							
	</tr>
	</thead>
	<tbody>
	<?php 
	
		//$i = 0;
		$i = $mainframe->getUserStateFromRequest($option.'limitstart','limitstart',0);
		$k=0;//$this->output->
		foreach($this->output->forum as $forum) {
			$id = JHTML::_('grid.id', ++$i, $forum->id, null, 'cb_forum_id_');			
			$published = JHTML::_('grid.published', $forum, $i);
	?>
		<tr class="row<?php echo $k;?>">	
			<td align="center"><?php echo $i;?></td>		
			<td align="center"><input type="checkbox" name="cb_forum_id_<?php echo $forum->id; ?>" value="<?php echo $forum->id; ?>" onclick="isChecked(this.checked)"/></td>
			<td>
				<div style="font-weight: bolder;"><a href="index.php?option=com_obsuggest&controller=forum&task=view&id=<?php echo $forum->id; ?>"><?php echo $forum->name; ?></a></div>
				<div style="float: left; padding-right: 3px"><b><?php echo $this->countIdea($forum->id); ?></b> <?php echo JText::_("Ideas")?></div>
				<div style="float: left; padding-right: 3px">|</div>
				<div style="float: left; padding-right: 3px"><a href="index.php?option=com_obsuggest&controller=forum&task=edit&id=<?php echo $forum->id; ?>"><?php echo JText::_("Edit")?></a></div>
				<div style="float: left; padding-right: 3px">|</div>
				<div style="float: left; padding-right: 3px">
					<?if($forum->default == 0){?>
					<a href="index.php?option=com_obsuggest&controller=forum&task=delete&id=<?php echo $forum->id; ?>"><?php echo JText::_("Delete")?></a>
					<?}else{?>
						<?php echo JText::_("Delete")?>
					<?}?>
				</div>					
				<div style="float: left; padding-right: 3px">|</div>
				<div style="float: left; padding-right: 3px"><a href="index.php?option=com_obsuggest&controller=forum&task=import&id=<?php echo $forum->id; ?>"><?php echo JText::_("Import")?></a></div>
			</td>
			<td align="center">
				<?php if ( $forum->default == 1 ) { ?>
				<?php if ($obIsJ15) :?>
				<img src="templates/khepri/images/menu/icon-16-default.png" alt="<?php echo JText::_( 'Default' ); ?>" />
				<?php else: ?>
				<img src="templates/bluestork/images/menu/icon-16-default.png" alt="<?php echo JText::_( 'Default' ); ?>" />
				<?php endif; ?>
				<?php } else { ?>
				&nbsp;
				<?php } ?>
			</td>
			<td><?php echo $forum->description; ?></td>
			<td align="center"><?php echo $published; ?></td>
		</tr>
	<?php 
			$k = 1-$k;
		}
	?>
	</tbody>
	
	<tfoot>
		<tr>
			<td colspan="14">
			<?php					
					 echo $this->pagination->getListFooter();
				?>
				<!-- 
				<input type="button" onclick="btnNew_click()" value="new" >
				<input type="button" onclick="btnDefault_click()" value="default" >
				<input type="button" onclick="btnPublished_click()" value="published" >
				<input type="button" onclick="btnUnPublished_click()" value="unpublished" >
				 -->
			</td>
		</tr>
	</tfoot>
</table>
<input type="hidden" name="task" id="task" value="" />
<input type="hidden" name="boxchecked"  value="0" />
<input type="hidden" name="filter_order" value="<?php echo @$lists['order']; ?>" />
<input type="hidden" name="filter_order_Dir" value="<?php echo @$lists['order_Dir']; ?>" />
<?php echo JHTML::_( 'form.token' ); ?>
</form>
