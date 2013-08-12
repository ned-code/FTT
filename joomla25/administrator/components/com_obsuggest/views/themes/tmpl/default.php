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
global $option;
$document = & Jfactory::getDocument();
$document->addStyleSheet(JURI::base() ."components/$option/assets/css/themes.css");
$document->addScript(JURI::base() ."components/$option/assets/js/colordialog.js");
$document->addScript(JURI::base() ."components/$option/assets/js/colorpicker.js");
$document->addScript(JURI::base() ."components/$option/assets/js/themes.js");

$pane = &JPane::getInstance("Tabs");
?>
<form name="adminForm" id="adminForm" action="index.php?option=com_obsuggest&controller=themes" method="POST">
<?php 
echo $pane->startPane("theme");
	echo $pane->startPanel(JText::_("Page_layout"), "page_theme");
	echo $this->loadTemplate("page_layout");
	echo $pane->endPanel();
	
	echo $pane->startPanel(JText::_("Idea_Box"), "box_theme");
	echo $this->loadTemplate("idea_layout");
	echo $pane->endPanel();
echo $pane->endPane();
?>
<input type="hidden" name='block' value="" />
<input type="hidden" name='task' value="" />
</form>
