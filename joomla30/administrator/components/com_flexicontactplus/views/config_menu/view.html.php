<?php
/********************************************************************
Product		: FlexicontactPlus
Date		: 23 February 2013
Copyright	: Les Arbres Design 2010-2013
Contact		: http://extensions.lesarbresdesign.info
Licence		: GNU General Public License
*********************************************************************/
defined('_JEXEC') or die('Restricted access');

jimport('joomla.html.html');

Class FlexicontactplusViewConfig_Menu extends JViewLegacy
{
function display($tpl = null)
{
	FCP_Admin::make_title('COM_FLEXICONTACT_CONFIGURATION', $this->config_data, $this->config_count);

	if (LAFC_JVERSION != 150)						// Only works for versions greater than 1.5
		{
		if (JFactory::getUser()->authorise('core.admin', 'com_flexicontactplus'))
			JToolBarHelper::preferences('com_flexicontactplus');
		}

// Set up the configuration links

	$config_table = array(
		array(
			'link' => LAFC_COMPONENT_LINK.'&controller=menu&task=display&view=config_general&config_id='.$this->config_data->id.'&config_base_view='.$this->config_base_view,
			'icon' => 'config_general.gif',
			'name' => 'COM_FLEXICONTACT_CONFIG_GENERAL_NAME',
			'desc' => 'COM_FLEXICONTACT_CONFIG_GENERAL_DESC'),
		array(
			'link' => LAFC_COMPONENT_LINK.'&controller=menu&task=display&view=config_template&param1=admin_template&config_id='.$this->config_data->id.'&config_base_view='.$this->config_base_view,
			'icon' => 'config_email_a.gif',
			'name' => 'COM_FLEXICONTACT_CONFIG_ADMIN_EMAIL_NAME',
			'desc' => 'COM_FLEXICONTACT_CONFIG_ADMIN_EMAIL_DESC'),
		array(
			'link' => LAFC_COMPONENT_LINK.'&controller=menu&task=display&view=config_template&param1=user_template&config_id='.$this->config_data->id.'&config_base_view='.$this->config_base_view,
			'icon' => 'config_email_u.gif',
			'name' => 'COM_FLEXICONTACT_CONFIG_USER_EMAIL_NAME',
			'desc' => 'COM_FLEXICONTACT_CONFIG_USER_EMAIL_DESC'),
		array(
			'link' => LAFC_COMPONENT_LINK.'&controller=menu&task=display&view=config_confirm&config_id='.$this->config_data->id.'&config_base_view='.$this->config_base_view,
			'icon' => 'config_text.gif',
			'name' => 'COM_FLEXICONTACT_CONFIG_CONFIRM_NAME',
			'desc' => 'COM_FLEXICONTACT_CONFIG_CONFIRM_DESC'),
		array(
			'link' => LAFC_COMPONENT_LINK.'&controller=menu&task=display&view=config_field_list&config_id='.$this->config_data->id.'&config_base_view='.$this->config_base_view,
			'icon' => 'config_fields.gif',
			'name' => 'COM_FLEXICONTACT_CONFIG_FIELDS_NAME',
			'desc' => 'COM_FLEXICONTACT_CONFIG_FIELDS_DESC'),
		array(
			'link' => LAFC_COMPONENT_LINK.'&controller=menu&task=display&view=config_text&param1=top_text&config_id='.$this->config_data->id.'&config_base_view='.$this->config_base_view,
			'icon' => 'config_text_top.gif',
			'name' => 'COM_FLEXICONTACT_V_TOP_TEXT',
			'desc' => 'COM_FLEXICONTACT_CONFIG_TEXT_DESC'),
		array(
			'link' => LAFC_COMPONENT_LINK.'&controller=menu&task=display&view=config_text&param1=bottom_text&config_id='.$this->config_data->id.'&config_base_view='.$this->config_base_view,
			'icon' => 'config_text_bottom.gif',
			'name' => 'COM_FLEXICONTACT_V_BOTTOM_TEXT',
			'desc' => 'COM_FLEXICONTACT_CONFIG_TEXT_DESC'),
		array(
			'link' => LAFC_COMPONENT_LINK.'&controller=menu&task=display&view=config_captcha&&config_id='.$this->config_data->id.'&config_base_view='.$this->config_base_view,
			'icon' => 'config_captcha.gif',
			'name' => 'COM_FLEXICONTACT_CONFIG_CAPTCHA_NAME',
			'desc' => 'COM_FLEXICONTACT_CONFIG_CAPTCHA_DESC'),
		array(
			'link' => LAFC_COMPONENT_LINK.'&controller=multiconfig&task=config_list&view=config_list&config_id='.$this->config_data->id.'&config_base_view='.$this->config_base_view,
			'icon' => 'config_list.gif',
			'name' => 'COM_FLEXICONTACT_CONFIG_MANAGE',
			'desc' => 'COM_FLEXICONTACT_CONFIG_MANAGE_DESC'),
		);

	// show the list
	?>
	<form action="index.php" method="post" name="adminForm" id="adminForm">
	<input type="hidden" name="option" value="<?php echo LAFC_COMPONENT ?>" />
	<input type="hidden" name="controller" value="menu" />
	<input type="hidden" name="task" value="display" />
	<input type="hidden" name="view" value="config_menu" />
	<input type="hidden" name="config_base_view" value="<?php echo $this->config_base_view; ?>" />
		
	<?php
	if (count($this->config_names) >1)
		$config_name_list = FCP_Common::make_list('config_base_view', $this->config_base_view, $this->config_names, 0, 'onchange="submitform( );"');
	else
		$config_name_list = '';
	?>
					
	<table class="adminlist table table-striped">
	<thead>
		<tr>
			<th width = "5%"></th>
			<th width = "20%" nowrap="nowrap"><?php echo  JText::_('COM_FLEXICONTACT_CONFIG_NAME'); ?></th>
			<th width = "80%" nowrap="nowrap">
				<?php echo  JText::_('COM_FLEXICONTACT_CONFIG_DESC');
					if ($config_name_list != '')
						echo '<span style="float:right">'.JText::_('COM_FLEXICONTACT_CONFIGURATION').': '.$config_name_list.'</span>';
				?>
			</th>
		</tr>
	</thead>

	<?php
	$k = 0;
	foreach ($config_table as $config)
		{
		$link = JRoute::_($config['link']);
		echo 	"<tr class='row$k'>
					<td>".JHTML::_('image', LAFC_ADMIN_ASSETS_URL.$config['icon'],'')."</td>
					<td>".JHTML::link($link, JText::_($config['name']))."</td>
					<td>".JText::_($config['desc'])."</td>
				</tr>";
		$k = 1 - $k;
		}
	?>
	</table>
		</form>
		<?php
	}
}