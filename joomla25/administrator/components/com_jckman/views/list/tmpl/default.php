<?php defined('_JEXEC') or die('Restricted access'); ?>
<?php JHTML::_('behavior.tooltip');


	define('JCK_COMPONENT_VIEW', JCK_COMPONENT. '/views/list');
	

	//load style sheet
	$document = JFactory::getDocument();
	$document->addStyleSheet( JCK_COMPONENT . '/css/icons.css', 'text/css' );
	$document->addStyleSheet( JCK_COMPONENT_VIEW . '/css/plugins.css', 'text/css' );

 ?>
<form action="index.php" method="post" name="adminForm">
<table>
	<tr>
		<td align="left" width="100%">
			<?php echo JText::_( 'Filter' ); ?>:
			<input type="text" name="search" id="search" value="<?php echo $this->lists['search'];?>" class="text_area" onChange="document.adminForm.submit();" />
			<button onClick="this.form.submit();"><?php echo JText::_( 'Go' ); ?></button>
			<button onClick="document.getElementById('search').value='';this.form.submit();"><?php echo JText::_( 'Reset' ); ?></button>
		</td>
		<td nowrap="nowrap">
			<?php
			//echo $this->lists['type'];
			echo $this->lists['state'];
			?>
		</td>
	</tr>
</table>

<table class="adminlist">
<thead>
	<tr>
		<th width="20">
			<?php echo JText::_( 'Num' ); ?>
		</th>
		<th width="20">
			<input type="checkbox" name="toggle" value="" onClick="checkAll(<?php echo count( $this->items );?>);" />
		</th>
		<th class="title">
			<?php echo JHTML::_('grid.sort',   'Title', 'p.title', @$this->lists['order_Dir'], @$this->lists['order'] ); ?>
		</th>
		<th nowrap="nowrap" width="5%">
			<?php echo JHTML::_('grid.sort',   'Published', 'p.published', @$this->lists['order_Dir'], @$this->lists['order'] ); ?>
		</th>
		<th nowrap="nowrap"  width="10%" class="title">
			<?php echo JHTML::_('grid.sort',   'Name', 'p.name', @$this->lists['order_Dir'], @$this->lists['order'] ); ?>
		</th>
		<th nowrap="nowrap"  width="10%" class="title">
			<?php echo JHTML::_('grid.sort',   'Icon', 'p.icon', @$this->lists['order_Dir'], @$this->lists['order'] ); ?>
		</th>
    <th nowrap="nowrap"  width="1%" class="title">
			<?php echo JHTML::_('grid.sort',   'ID', 'p.id', @$this->lists['order_Dir'], @$this->lists['order'] ); ?>
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
	$rows =& $this->items;
	for ($i=0, $n=count( $rows ); $i < $n; $i++) {
	$row 	= $rows[$i];

	$link = JRoute::_( 'index.php?option=com_jckman&controller=list&task=edit&cid[]='. $row->id );

	$checked 	= @ JHTML::_('grid.checkedout',   $row, $i );
	$published 	= JHTML::_('grid.published', $row, $i );

	$ordering = ($this->lists['order'] == 'p.type');
?>
	<tr class="<?php echo "row$k"; ?>">
		<td align="right">
			<?php echo $this->pagination->getRowOffset( $i ); ?>
		</td>
		<td>
			<?php echo $checked; ?>
		</td>
		<td>
			<?php
			if (  @JTable::isCheckedOut($this->user->get ('id'), $row->checked_out ) || !$row->editable ) {
				echo $row->title;
			} else {	
			?>
				<span class="editlinktip hasTip" title="<?php echo JText::_( 'Edit Plugin' );?>::<?php echo $row->title; ?>">
				<a href="<?php echo $link; ?>">
					<?php echo ($row->title ? $row->title : $row->name); ?></a></span>
			<?php } ?>
		</td>
		<td align="center">
			<?php echo $published;?>
		</td>
		<td align="center">
			<?php echo $row->name;?>
		</td>
        <td align="center">
			<?php 
			
			if( $row->icon && is_numeric($row->icon))
			{
            	echo '<img  src="'. JCK_COMPONENT_VIEW .'/images/spacer.gif" alt="' . $row->name .'" class="cke_icon"  style="background-position:0px ' . $row->icon  .'px;"/>';	
            }
     		elseif($row->icon)
			{
				echo '<img src="../plugins/editors/jckeditor/plugins/' . $row->name .'/'.$row->icon.'" alt="'. $row->name .'" />';	
			}
			else
			{
				echo $row->name;
			}
			?>
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
	<input type="hidden" name="type" value="list" />
    <input type="hidden" name="controller" value="list" />
	<input type="hidden" name="boxchecked" value="0" />
	<input type="hidden" name="filter_order" value="<?php echo $this->lists['order']; ?>" />
	<input type="hidden" name="filter_order_Dir" value="<?php echo $this->lists['order_Dir']; ?>" />
	<?php echo JHTML::_( 'form.token' ); ?>
</form>