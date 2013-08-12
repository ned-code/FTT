<?php
/**
 * @version		$Id: default_vote_edit.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>
<?php JToolBarHelper::title( JText::_( 'Vote value' ).': <small><small>['.JText::_('Edit').']</small></small>', 'vote.png' );?>
<?php JToolBarHelper::save();?>
<?php JToolBarHelper::cancel();?>
<form name="adminForm" action="index.php?option=com_obsuggest&controller=vote&id=<?php echo $this->output->id; ?>" method="POST">
<table width="100%">
	<tr>
		<td valign="top" width="60%">
			<fieldset class="adminForm">
			<legend><?php echo JText::_('Vote value')?> </legend>
			<table class="admintable">
				<tr>
					<td width="100" align="right" class="key"><?php echo JText::_('Vote value')?>:</td>
					<td>
						<input class="text_area" type="text" name="vote_value" id="vote_value"	size="10" maxlength="5" value="<?php echo $this->output->vote_value;?>"/>
					</td>
				</tr>
				<tr>
					<td class="key"><?php echo JText::_('Published')?></td>
					<td><?php 
						$published[] = JHTML::_('select.option', 0, JText::_('No'),'id','title');
						$published[] = JHTML::_('select.option', 1, JText::_('Yes'),'id','title');
						echo  JHTML::_('select.genericlist',  $published, 'published', 'class="inputbox" size="1"', 'id','title',$this->output->published);
						?></td>
				</tr>
				<tr>
					<td width="100" align="right" class="key"><?php echo JText::_('Note')?>:</td>
					<td>
						<textarea rows="2" cols="35" name="title" id="title"><?php echo $this->output->title;?></textarea>
					</td>
				</tr>
			</table>
			</fieldset>	
		</td>				
	</tr>
</table>
<input type="hidden" name="vote_id" value="<?php echo $this->output->id; ?>" />
<input type="hidden" name="task" value="" />
<input type="hidden" name="tmp" value="update" />
</form>
