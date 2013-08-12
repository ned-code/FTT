<?php
/**
 * @version		$Id: default_status.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @license		GNU/GPL, see LICENSE
 */

 // no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>
<form name="adminForm" action="index.php?option=com_obsuggest&controller=idea" method="POST">
<a href="index.php?option=com_obsuggest&controller=idea&sign=status&task=newStatus">New Status</a>
<table width="100%" class="adminlist" cellpadding="0" cellspacing="0">
	<thead>
	<tr>
		<th width="2%"><input type="checkbox" /></th>
		<th><?php echo JText::_("Title")?></th>		
		<th width="3"><?php echo JText::_("Published")?></th>
		<th width="8%"><?php echo JText::_("Category")?></th>				
	</tr>
	</thead>
	<tbody>
<?php
$k = 0;
foreach ($this->status as $status) {	
?>
	<tr style="height: 10px;" class="<?php echo "row$k"; ?>">
		<td><input type="checkbox" /></td>
		<td>
			<div style="font-weight: bolder;color: #0B55C4;"><?php echo $status->title; ?></div>
			<div style="float: left;"><a href="index.php?option=com_obsuggest&controller=idea&sign=status&task=editStatus&status_id=<?php echo $status->id;?>"><?php echo JText::_("Edit")?></a></div>
			<div style="float: left; margin-left: 3px;">| <a href="index.php?option=com_obsuggest&controller=idea&sign=status&task=deleteStatus&status_id=<?php echo $status->id;?>"><?php echo JText::_("Delete")?></a></div>
		</td>		
		<td></td>
		<?php 
			if ($status->parent_id != -1) {
				$parent = $this->getStatusById($status->parent_id);
		?>
			<td><?php echo $parent; ?></td>	
		<?php }?>
	</tr>	
<?php 
	$k = 1- $k;
}
?>
	</tbody>
</table>
</form>
