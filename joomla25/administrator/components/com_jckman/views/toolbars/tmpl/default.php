<?php defined('_JEXEC') or die('Restricted access'); ?>
<?php JHTML::_('behavior.tooltip'); 

 define('JCK_COMPONENT_VIEW', JCK_COMPONENT. '/views/toolbar');
$rows =& $this->items;
?>
<form action="index.php" method="post" name="adminForm" id="adminForm">
<table>
	<tr>
		<td align="left" width="100%">
			<?php echo JText::_( 'Filter' ); ?>:
			<input type="text" name="search" id="search" value="<?php echo $this->lists['search'];?>" class="text_area" onChange="document.adminForm.submit();" />
			<button onClick="this.form.submit();"><?php echo JText::_( 'Go' ); ?></button>
			<button onClick="document.getElementById('search').value='';this.form.submit();"><?php echo JText::_( 'Reset' ); ?></button>
		</td>
	</tr>
</table>

<table class="adminlist">
<thead>
	<tr>
		<th width="20">
			<?php echo JText::_( 'Num' ); ?>
		</th>
		<th width="23">
			<input type="checkbox" name="toggle" value="" onClick="checkAll(<?php echo count( $rows );?>);" />
		</th>
		<th class="title">
			<?php echo JHTML::_('grid.sort',   'Title', 't.title', @$this->lists['order_Dir'], @$this->lists['order'] ); ?>
		</th>
		<th nowrap="nowrap"  width="10%" class="title">
			<?php echo JHTML::_('grid.sort',   'Name', 't.name', @$this->lists['order_Dir'], @$this->lists['order'] ); ?>
		</th>
        <th nowrap="nowrap"  width="1%" class="title">
			<?php echo JHTML::_('grid.sort',   'ID', 't.id', @$this->lists['order_Dir'], @$this->lists['order'] ); ?>
		</th>
	</tr>
</thead>
<tfoot>
	<tr>
		<td colspan="12">
			<?php echo $this->pagination->getListFooter(); ?>
		</td>
	</tr>
</tfoot>
<tbody>
<?php
	$k = 0;
	
	for ($i=0, $n=count( $rows ); $i < $n; $i++) {
	$row 	= $rows[$i];

	$link = JRoute::_( 'index.php?option=com_jckman&controller=toolbars&task=edit&cid[]='. $row->id );

	$checked 	=@ JHTML::_('grid.checkedout',   $row, $i );
  	$ordering = ($this->lists['order'] == 't.id');
?>
	<tr class="<?php echo "row$k"; ?>">
		<td align="center">
			<?php echo $this->pagination->getRowOffset( $i ); ?>
		</td>
		<td>
			<?php echo $checked; ?>
		</td>
		<td>
			<?php
			if (@  JTable::isCheckedOut($this->user->get ('id'), $row->checked_out )) {
				echo $row->title;
			} else {	
			?>
				<span class="editlinktip hasTip" title="<?php echo JText::_( 'Edit Plugin' );?>::<?php echo $row->title; ?>">
				<a href="<?php echo $link; ?>">
					<?php echo $row->title; ?></a></span>
			<?php } ?>
		</td>
		<td nowrap="nowrap">
			<?php echo $row->name;?>
		</td>
  	<td align="center">
			<?php echo $row->id;?>
		</td>
	</tr>
	<?php
		$k = 1 - $k;
	}
	?>
</tbody>
</table>
	<input type="hidden" name="option" value="com_jckman" />
	<input type="hidden" name="task" value="" />
	<input type="hidden" name="type" value="" />
    <input type="hidden" name="controller" value="toolbars" />
	<input type="hidden" name="boxchecked" value="0" />
	<input type="hidden" name="filter_order" value="<?php echo $this->lists['order']; ?>" />
	<input type="hidden" name="filter_order_Dir" value="<?php echo $this->lists['order_Dir']; ?>" />
	<?php echo JHTML::_( 'form.token' ); ?>
</form>