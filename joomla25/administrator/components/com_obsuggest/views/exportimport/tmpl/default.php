<?php
/**
 * @version		$Id: default.php 152 2011-03-12 06:19:57Z thongta $
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
$sign = JRequest::getVar('sign','export');
$tmp = 0;
$task = JRequest::getVar('task','default');
switch ($sign) {
	case 'import':
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
	<?php if($sign != 'export'){?>
		document.getElementById('panel_export').addClass('closed').removeClass('open');
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
<form name="adminForm" id="adminForm" action="index.php?option=com_obsuggest&controller=exportimport" method="POST">
<?php 
$pane =& JPane::getInstance('Tabs');
echo $pane->startPane('myPanel');
	/* joomlacore */
	echo $pane->startPanel(JText::_('Export'), "panel_export");
	?>		
		<?php
			echo $this->loadTemplate('export');	 
		?>
	<?php	
	echo $pane->endPanel();
	
	echo $pane->startPanel(JText::_('Import'), "panel_import");
	?>					
		<?php						
			echo $this->loadTemplate('import');
		?>
	<?php	
	echo $pane->endPanel();	
echo $pane->endPane();
?>
<input type="hidden" name='task' value="" />
<input type="hidden" name="boxchecked" value="1" />
</form>
