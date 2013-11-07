<?php
/********************************************************************
Product		: FlexicontactPlus
Date		: 23 February 2013
Copyright	: Les Arbres Design 2010-2013
Contact		: http://extensions.lesarbresdesign.info
Licence		: GNU General Public License
*********************************************************************/

defined('_JEXEC') or die('Restricted Access');

class FlexicontactplusViewConfig_Confirm extends JViewLegacy
{
function display($tpl = null)
{
	FCP_Admin::make_title('COM_FLEXICONTACT_CONFIG_CONFIRM_NAME', $this->config_data, $this->config_count);
	JToolBarHelper::apply();
	JToolBarHelper::save();
	JToolBarHelper::cancel();

// setup the key panel

	$keypanel = FCP_Admin::make_key_panel($this->config_data->config_data);

// setup the wysiwg editor

	$editor = JFactory::getEditor();
	
	?>
	<form action="index.php" method="post" name="adminForm" id="adminForm" >
	<input type="hidden" name="option" value="<?php echo LAFC_COMPONENT; ?>" />
	<input type="hidden" name="controller" value="menu" />
	<input type="hidden" name="task" value="" />
	<input type="hidden" name="config_id" value="<?php echo $this->config_data->id; ?>" />
	<input type="hidden" name="config_base_view" value="<?php echo $this->config_base_view; ?>" />
	<input type="hidden" name="view" value="config_confirm" />
	
	<?php 
	echo "\n".'<table><tr><td valign="top">'."\n<table><tr><td>";
	echo JText::_('COM_FLEXICONTACT_LINK');
	echo '</td><td><input type="text" size="60" name="confirm_link" value="'.$this->config_data->config_data->confirm_link.'" /> ';
	echo FCP_Admin::make_info(JText::_('COM_FLEXICONTACT_CONFIRM_LINK_DESC'));
	echo "</td></tr>\n<tr>";
	echo '<td valign="top">'.JText::_('COM_FLEXICONTACT_TEXT');
	echo '</td><td valign="top">'.$editor->display('confirm_text', htmlspecialchars($this->config_data->config_data->confirm_text, ENT_QUOTES),'700','350','60','20',array('pagebreak', 'readmore'));
	echo "\n".'</td></tr></table></td><td valign="top">';
	echo $keypanel;
	echo "\n".'</td></tr></table>';
	?>
	</form>
	<?php 
}

}