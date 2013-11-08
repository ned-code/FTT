<?php
/********************************************************************
Product		: FlexicontactPlus
Date		: 23 February 2013
Copyright	: Les Arbres Design 2010-2013
Contact		: http://extensions.lesarbresdesign.info
Licence		: GNU General Public License
*********************************************************************/

defined('_JEXEC') or die('Restricted Access');

class FlexicontactplusViewConfig_Template extends JViewLegacy
{
function display($tpl = null)
{
	$template_name = $this->param1;			// param1 is the template name, 'user_template' or 'admin_template'
	if ($template_name == 'user_template')
		FCP_Admin::make_title('COM_FLEXICONTACT_CONFIG_USER_EMAIL_NAME', $this->config_data, $this->config_count);
	else
		FCP_Admin::make_title('COM_FLEXICONTACT_CONFIG_ADMIN_EMAIL_NAME', $this->config_data, $this->config_count);
		
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
	<input type="hidden" name="view" value="config_template" />
	<input type="hidden" name="param1" value="<?php echo $template_name; ?>" />
	<input type="hidden" name="config_id" value="<?php echo $this->config_data->id; ?>" />
	<input type="hidden" name="config_base_view" value="<?php echo $this->config_base_view; ?>" />

	<?php 
	echo "\n".'<table><tr><td valign="top">';
	echo "\n".$editor->display($template_name, htmlspecialchars($this->config_data->config_data->$template_name, ENT_QUOTES),'700','350','60','20',array('pagebreak', 'readmore', 'article', 'image'));
	echo "\n".'</td><td valign="top">';
	echo $keypanel;
	echo "\n".'</td></tr></table>';
	?>
	</form>
	<?php 
}

}