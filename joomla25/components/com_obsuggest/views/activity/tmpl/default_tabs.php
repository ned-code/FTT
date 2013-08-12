<?php
/**
 * @version		$Id: default_tabs.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

$pane =& JPane::getInstance('Tabs');
echo $pane->startPane('myPanel');		
	echo $pane->startPanel(JText::_('Activity'), "tab_TOP");
?>
<div id="content">
<?php
	$this->_addPath( 'template', JPATH_COMPONENT.DS.'views'.DS. 'idea'.DS.'tmpl' ); 
	echo $this->loadTemplate('ideas'); 
?>	
</div>
<?php 
	echo $pane->endPanel();	
	echo $pane->startPanel(JText::_('Comment'), "tab_HOT");
?>
<div>&nbsp;
	<div id="contentComment" style="border:0px solid red;padding:0px;">
		<?php
			$this->_addPath( 'template', JPATH_COMPONENT.DS.'views'.DS. 'comment'.DS.'tmpl' ); 
			echo $this->loadTemplate('comment_activity'); 
			//echo "asdasda:;";
		?>
	</div>
</div>	
<?php 
	echo $pane->endPanel();	
echo $pane->endPane();	
?>
<div style="clear:both;"></div>