<?php
/**
 * @version		$Id: default_forum_import.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

JHTML::_('behavior.mootools');
JHTML::_('behavior.tooltip');
global $mainframe;
$sign = JRequest::getVar('sign','joomlacore');
$tmp = 0;
$task = JRequest::getVar('task','default');
switch ($sign) {
	case 'import':
		$tmp = 2;
		break;
	case 'export' :
		$tmp = 1;
		break;
	default :
		$tmp = 0;
		break;
}
?>
<script>
	window.addEvent('load',function(){	
	document.getElementById('panel_<?php echo $sign;?>').addClass('open');
	<?php if($sign != 'joomlacore'){?>
		document.getElementById('panel_joomlacore').addClass('closed').removeClass('open');
	<?php }	?>
	for(var i = 1; i < document.getElementsByTagName('dd').length; i ++) {
		document.getElementsByTagName('dd')[i].setStyle('display','none');
		if(i == <?php echo $tmp; ?>) {					
			document.getElementsByTagName('dd')[0].setStyle('display','none');
			document.getElementsByTagName('dd')[<?php echo $tmp;?>].setStyle('display','block');
		}
	}	
	
});
</script>
<?php 
$pane =& JPane::getInstance('Tabs');
echo $pane->startPane('myPanel');

	/* joomlacore */
	echo $pane->startPanel(JText::_('From Joomla Core'), "panel_joomlacore");
	?>		
		<?php		
			echo $this->loadTemplate('forum_import_joomla');					
		?>
	<?php	
	echo $pane->endPanel();
	
	echo $pane->startPanel(JText::_('From Export File'), "panel_export");
	?>			
		<?php					
			echo $this->loadTemplate('forum_import_export');
		?>
	<?php	
	echo $pane->endPanel();
	
	echo $pane->startPanel(JText::_('From Import File'), "panel_import");
	?>
		<?php 
			echo $this->loadTemplate('forum_import_import');
		?>
	<?php	
	echo $pane->endPanel();

echo $pane->endPane();
?>

