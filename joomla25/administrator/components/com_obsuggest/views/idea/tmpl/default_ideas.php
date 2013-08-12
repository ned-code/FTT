<?php
/**
 * @version		$Id: default_ideas.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @license		GNU/GPL, see LICENSE
 */

 // no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

global $mainframe, $option;
?>
<script>
function btnDelete_click() {
	$('task').value="deleteListIdea";
	$('adminForm').submit();
}
function btnAdd_click() {
	$('task').value="add";
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
<form name="adminForm" id="adminForm" action="index.php?option=com_obsuggest&controller=idea" method="POST">
<?php echo $this->loadTemplate('idea_filter');
$lists = $this->ideas->lists;
?>
<table width="100%" class="adminlist" cellpadding="0" cellspacing="0">	
	<thead>
	<tr>
		<th width="3%">
		<?php echo JHTML::_('grid.sort','#', 'p.id', @$lists['order_Dir'], @$lists['order'] ); ?>
		</th>
		<th width="2%"><input type="checkbox" onClick="return myCheckAll(this.checked)" /></th>
		<th>
		<?php echo JHTML::_('grid.sort','TITLE', 'p.title', @$lists['order_Dir'], @$lists['order'] ); ?>
		</th>
		<th width="6%">
		<?php echo JHTML::_('grid.sort','VOTE', 'p.votes', @$lists['order_Dir'], @$lists['order'] ); ?>
		</th>
		<th width="3">
		<?php echo JHTML::_('grid.sort','PUBLISHED', 'p.published', @$lists['order_Dir'], @$lists['order'] ); ?>
		</th>
		<th width="8%">
		<?php echo JHTML::_('grid.sort','RESOURCE', 'p.resource', @$lists['order_Dir'], @$lists['order'] ); ?>
		</th>
		<th width="10%">
		<?php echo JHTML::_('grid.sort','FORUM', 'p.forum_id', @$lists['order_Dir'], @$lists['order'] ); ?>
		</th>
		<th width="8%">
		<?php echo JHTML::_('grid.sort','STATUS', 'p.status_id', @$lists['order_Dir'], @$lists['order'] ); ?>
		</th>			
		<th width="10%">
		<?php echo JHTML::_('grid.sort','CREATED_DATE', 'p.createdate', @$lists['order_Dir'], @$lists['order'] ); ?>
		</th>
		<th><?php echo JHTML::_('grid.sort','By', '', @$lists['order_Dir'], @$lists['order'] ); ?></th>		
	</tr>
	</thead>
	<tbody>
<?php

$k = 0;
$i = $mainframe->getUserStateFromRequest($option.'limitstart','limitstart',0);
foreach ($this->ideas->result as $idea) {
	$published = JHTML::_('grid.published', $idea, $i);
?>
	<tr style="height: 10px;" class="<?php echo "row$k"; ?>">
		<td align="center"><?php echo ++$i; ?></td>
		<td><input type="checkbox" onclick="isChecked(this.checked)" name="cb_idea_id_<?php echo $idea->id; ?>" value="1"/></td>
		<td>
			<div style="font-weight: bolder;color: #0B55C4;"><a href="index.php?option=com_obsuggest&controller=idea&task=view&id=<?php echo $idea->id; ?>&forum_id=<?php echo $idea->forum_id; ?>"><?php echo $idea->title; ?></a></div>
			<div style="float: left;"><b><?php echo $this->countComment($idea->id);?></b> <?php echo JText::_("Comment")?></div>
			<div style="float: left; margin-left: 3px;">| <a href="index.php?option=com_obsuggest&controller=idea&task=edit&id=<?php echo $idea->id; ?>&forum_id=<?php echo $idea->forum_id; ?>"><?php echo JText::_("Edit")?></a></div>
			<div style="float: left; margin-left: 3px;">| <a href="index.php?option=com_obsuggest&controller=idea&task=delete&id=<?php echo $idea->id; ?>&forum_id=<?php echo $idea->forum_id; ?>"><?php echo JText::_("Delete")?></a></div>
		</td>
		<td align="center"><?php echo $idea->votes; ?></td>
		<td align="center"><?php echo $published; ?></td>
		<td align="center"><?php echo $idea->resource; ?></td>
		<td align="center">
			<?php
				foreach ($this->output->forums as $forum) {
					if ($forum->id == $idea->forum_id) {
						echo $forum->name;
						break;
					}
				} 
			?>
		</td>
		<td align="center"><?php echo $this->getStatusById($idea->status_id); ?></td>			
		<td align="center"><?php echo $idea->createdate; ?></td>
		<td><?php echo $this->getUser($idea->user_id); ?></td>		
	</tr>	
<?php 
	$k = 1 - $k;
}
?>
	</tbody>
	<tfoot>
		<tr>
			<td colspan="14" align="center" style="border:0px solid red;margin:0 auto;">
				<?php
					echo $this->pagination->getListFooter();
				?>
				</div>
			</td>
		</tr>
	</tfoot>
</table>
<input type="hidden" name="boxchecked"  value="0" />
<input type="hidden" id="task" name="task" value="" />
<input type="hidden" name="option" value="com_obsuggest" />
<input type="hidden" id="limit_start" name="limit_start" value="" />
<input type="hidden" name="filter_order" value="<?php echo @$lists['order']; ?>" />
<input type="hidden" name="filter_order_Dir" value="<?php echo @$lists['order_Dir']; ?>" />
<?php echo JHTML::_( 'form.token' ); ?>
</form>
