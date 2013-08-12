<?php
/**
 * @version		$Id: import_add.php 152 2011-03-12 06:19:57Z thongta $
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
$sign = JRequest::getVar('sign','uservoice');
$tmp = 0;
$task = JRequest::getVar('task','default');
switch ($sign) {
	case 'file':
		$tmp = 1;
		break;	
	default :
		$tmp = 0;
		break;
}
?>
<script>
	window.addEvent('load',function(){	
	document.getElementById('panel_<?php echo $sign;?>').className = 'open';//addClass('open');
	<?php if($sign != 'uservoice'){?>
		document.getElementById('panel_uservoice').addClass('closed').removeClass('open');
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
	echo $pane->startPanel(JText::_('Uservoice'), "panel_uservoice");
	?>		
		<?php
			echo $this->loadTemplate('add_user');	 
		?>
	<?php	
	echo $pane->endPanel();
	
	echo $pane->startPanel(JText::_('File'), "panel_file");
	?>					
		<?php						
			echo $this->loadTemplate('add_file');
		?>
	<?php	
	echo $pane->endPanel();	
echo $pane->endPane();
?>


