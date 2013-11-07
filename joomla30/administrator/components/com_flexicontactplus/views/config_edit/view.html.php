<?php
/********************************************************************
Product		: FlexicontactPlus
Date		: 26 September 2013
Copyright	: Les Arbres Design 2010-2013
Contact		: http://extensions.lesarbresdesign.info
Licence		: GNU General Public License
*********************************************************************/

defined('_JEXEC') or die('Restricted Access');

class FlexicontactplusViewConfig_Edit extends JViewLegacy
{
function display($tpl = null)
{
	if ($this->new_flag == 1)
		FCP_Admin::make_title('COM_FLEXICONTACT_NEW_CONFIG');
	else
		FCP_Admin::make_title('COM_FLEXICONTACT_CONFIG_EDIT', $this->config_data, $this->config_count);
		
	JToolBarHelper::apply();
	JToolBarHelper::save();
	JToolBarHelper::cancel();

	$langs = FCP_Admin::make_lang_list();
	$cur_lang = JFactory::getLanguage();
	
	if (LAFC_JVERSION == 150)
		$lang_text = JText::_('LANGUAGE');
	else
		$lang_text = JText::_('JFIELD_LANGUAGE_LABEL');

	?>
	
	<form action="index.php" method="post" name="adminForm" id="adminForm" >
	<input type="hidden" name="option" value="<?php echo LAFC_COMPONENT; ?>" />
	<input type="hidden" name="controller" value="multiconfig" />
	<input type="hidden" name="task" value="add" />
	<input type="hidden" name="view" value="config_edit" />
	<input type="hidden" name="new_flag" value="<?php echo $this->new_flag; ?>" />
	<input type="hidden" name="copy_flag" value="<?php echo $this->copy_flag; ?>" />
	<input type="hidden" name="config_base_view" value="<?php echo $this->config_base_view; ?>" />
	<table class="fc_table">
		
	<?php

// if we are creating a new configuration, show the "base" config selector

	if (($this->new_flag == 1) and ($this->copy_flag == 0))
		{
		echo '<tr><td class="prompt">'.JText::_('COM_FLEXICONTACT_BASE_CONFIG').'</td>';

		if ($this->config_count > 1)
			{
			$config_list = FCP_Common::make_list('config_id', $this->config_data->id, $this->config_names);
			$info = FCP_Admin::make_info(JText::_('COM_FLEXICONTACT_BASE_CONFIG_DESC'));
			echo '<td>'.$config_list.' '.$info.'</td></tr>';
			}
		else
			{
			echo '<input type="hidden" name="config_id" value="0" />';
			echo '<td>'.JText::_('COM_FLEXICONTACT_DEFAULT').'</td></tr>';
			}

		echo '<tr><td colspan="2"><h3>'.JText::_('COM_FLEXICONTACT_NEW_CONFIG').'</h3></td></tr>';
		}
	else
		echo '<input type="hidden" name="config_id" value="'.$this->config_data->id.'" />';	// edit mode
		
// the new configuration name

	echo '<tr><td class="prompt">'.JText::_('COM_FLEXICONTACT_CONFIG_NAME').'</td>';
	if ($this->copy_flag == 1)
		{
		echo '<input type="hidden" name="name" value="'.$this->config_data->name.'" />';
		echo '<td>'.$this->config_data->name.'</td></tr>';
		}
	else
		echo '<td><input type="text" size="40" name="name" value = "'.$this->config_data->name.'" /></td></tr>';

// the new configuration language
		
	echo '<tr><td class="prompt">'.$lang_text.'</td>';
	if (count($langs) > 1)
		{
		$lang_list = FCP_Common::make_list('config_lang', $this->config_data->language , $langs);
		echo '<td>'.$lang_list.'</td></tr>';
		}
	else
		{
		echo '<input type="hidden" name="config_lang" value="'.$cur_lang->getTag().'" />';
		echo '<td>'.$cur_lang->getTag().'</td></tr>';
		}
		
// a description for the new config	

	echo '<tr><td class="prompt">'.JText::_('COM_FLEXICONTACT_CONFIG_DESC').'</td>';
	echo '<td><input type="text" size="120" name="description" value = "'.$this->config_data->description.'" /></td></tr>';
	
	echo '</table>';
	echo '</form>';
}




}