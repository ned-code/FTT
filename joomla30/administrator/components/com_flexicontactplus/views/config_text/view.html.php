<?php
/********************************************************************
Product		: FlexicontactPlus
Date		: 23 February 2013
Copyright	: Les Arbres Design 2010-2013
Contact		: http://extensions.lesarbresdesign.info
Licence		: GNU General Public License
*********************************************************************/

defined('_JEXEC') or die('Restricted Access');

class FlexicontactplusViewConfig_Text extends JViewLegacy
{
function display($tpl = null)
{
	$text_name = $this->param1;			// param1 is the text name, 'top_text' or 'bottom_text'
	
	if ($text_name == 'top_text')
		FCP_Admin::make_title('COM_FLEXICONTACT_V_TOP_TEXT', $this->config_data, $this->config_count);
	else
		FCP_Admin::make_title('COM_FLEXICONTACT_V_BOTTOM_TEXT', $this->config_data, $this->config_count);

	JToolBarHelper::apply();
	JToolBarHelper::save();
	JToolBarHelper::cancel();
	
// setup the wysiwg editor

	$editor = JFactory::getEditor();
	
	?>
	<form action="index.php" method="post" name="adminForm" id="adminForm" >
	<input type="hidden" name="option" value="<?php echo LAFC_COMPONENT; ?>" />
	<input type="hidden" name="controller" value="menu" />
	<input type="hidden" name="task" value="" />
	<input type="hidden" name="view" value="config_text" />
	<input type="hidden" name="config_id" value="<?php echo $this->config_data->id; ?>" />
	<input type="hidden" name="param1" value="<?php echo $text_name; ?>" />
	<input type="hidden" name="config_base_view" value="<?php echo $this->config_base_view; ?>" />
	
	<?php 
	echo $editor->display($text_name, htmlspecialchars($this->config_data->config_data->$text_name, ENT_QUOTES),'700','350','60','20',array('pagebreak', 'readmore'));
	?>
	</form>
	<?php 
}

}