<?php
/**
 * @version		$Id: default_items.php 328 2011-05-25 02:50:56Z thongta $
 * @package		oblangs - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

$models = $this->getModel('cpanel');
$rows 	= $models->getLatestItem();
?>

<table class="adminlist">
	<tr>
		<td class="title"><strong><?php echo JText::_('Items'); ?></strong></td>
		<td class="title"><strong><?php echo JText::_('Created'); ?></strong></td>
	</tr>
	<?php
	foreach ($rows as $row){
		?>
		<tr>
			<td>
				<?php $link = JFilterOutput::ampReplace('index.php?option='.$option.'&controller=items&task=edit&cid[]='.$row->id);?>
				<a href="<?php echo $link; ?>"><?php echo $row->title; ?></a>
			</td>
			<td>
				<?php 
				$created = $row->created;
				$created = explode(' ', $created);
				echo $created[0];
				 ?>
			</td>
		</tr>
		<?php
	}
	?>
</table>
