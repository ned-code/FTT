<?php
/**
 * @version		$Id: default_idea_comments.php 231 2011-03-25 11:02:46Z phonglq $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @license		GNU/GPL, see LICENSE
 */

 // no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );
$mainframe 	= &JFactory::getApplication();
$limit_ 	= JRequest::getVar('limit');
global $option;
?>
<table class="adminlist">
	<thead>
		<tr>
			<th width="7%">#</th>
			<th><?php echo JText::_("Comment")?></th>
		</tr>
	</thead>		
	<tbody>		
	<?php
		$i = $mainframe->getUserStateFromRequest($option.'limitstart','limitstart',0);
		//echo $i;
		$k = 0;
		foreach($this->output->comments as $comment) {
			 $i++;
	?>
		<tr class="row<?php echo $k; ?>">
			<td align="center">
				<?php echo $i; ?>
			</td>
			<td>
				<?php echo $comment->comment; ?>
			</td>
		</tr>
	<?php 
		}
	?>		
	</tbody>
	<tfoot>
		<tr>
			<td colspan="2">
			<?php					
					//echo $this->pagination->getListFooter();
					 echo $this->pagination->getListFooter();
				?>
				<?php
					/*jimport('joomla.html.pagination');
					$f = new JPagination(10, 0,5);					
					echo $f->getListFooter(); */
				?>
			</td>
		</tr>
	</tfoot>
</table>
<input type="hidden" value="" name="task" id="task"/>
<input type="hidden" value="<?php echo $this->output->idea->id; ?>" name="id" id="id"/>
<input type="hidden" value="<?php echo $this->output->idea->forum_id; ?>" name="form_id" id="form_id"/>

