<?php
/**
 * @version		$Id: export_add.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

JHTML::_('behavior.mootools'); 
?>
<?php 
echo $this->loadTemplate('forum');
$pane =& JPane::getInstance('Tabs');
/*
echo $pane->startPane('myPanel');	
	echo $pane->startPanel('Forum', "panel_export");
	?>		
		<?php
			echo $this->loadTemplate('forum');	 
		?>
	<?php	
	echo $pane->endPanel();
	
	echo $pane->startPanel('Idea', "panel_status");
	?>					
		<?php						
			echo $this->loadTemplate('idea');
		?>
	<?php	
	echo $pane->endPanel();	
echo $pane->endPane();
*/
?>

