<?php
/**
 * @version		$Id: default_vote.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

JToolBarHelper::title( JText::_( 'LIST_VALUES_VOTE' ),'vote.png' );?>
<?php JToolBarHelper::addNew('addNew',JText::_('New'));?>
<?php JToolBarHelper::publishList('published', JText::_('Published'));?>
<?php JToolBarHelper::unpublishList('unpublished', JText::_('Unpublished'));?>
<?php JToolBarHelper::deleteList('delete');?>
<form name="adminForm" id="adminForm" action="index.php?option=com_obsuggest&controller=vote" method="POST">
<table class="adminform">
	<tr>
		<td align="left" width="100%">
		</td>
		<td nowrap="nowrap">
			<?php echo $this->lists['state']; ?>
		</td>
	</tr>
</table>

<table width="100%" class="adminlist" cellpadding="0" cellspacing="0">	
	<thead>
		<tr>
			<th width="4%">#</th>
			<th width="4%"><input type="checkbox" name="toggle" value="" onclick="checkAll(<?php echo count( $this->listVotes ); ?>);" /></th>
			<th><?php echo JText::_('Value')?></th>
			<th><?php echo JText::_('Title')?></th>
			<th width="3"><?php echo JText::_('Published')?></th>
			<th width="4%"><?php echo JText::_('ID')?></th>
		</tr>
	</thead>
	<tbody>
	<?php
		$votes = $this->listVotes;
		$k =0;
		if (count($votes)){
			for($i = 0 ; $i < count($votes); $i++){
			$vote = &$votes[$i]; 
			$published 	= JHTML::_('grid.published', $vote, $i);
			$checked 	= JHTML::_('grid.id', $i, $vote->id );
			$link = "index.php?option=com_obsuggest&controller=vote&task=edit&id=".$vote->id;
	?>
		<tr class="<?php echo "row$k";?>">
			<td align="center"><?php echo $i+1;?></td>
			<td align="center"><?php echo $checked;?></td>
			<td><a href="<?php echo $link?>"><?php echo $vote->vote_value;?></a></td>
			<td><?php echo $vote->title;?></td>
			<td align="center"><?php echo $published;?></td>
			<td align="center"><?php echo $vote->id?></td> 
		</tr>
	<?php $k = 1-$k; }}?>
	</tbody>
</table>
<input type="hidden" name="boxchecked"  value="0" />
<?php echo JHTML::_( 'form.token' ); ?>
<input type="hidden" id="task" name="task" value="" />
</form>


