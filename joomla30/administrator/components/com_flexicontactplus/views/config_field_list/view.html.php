<?php
/********************************************************************
Product		: FlexicontactPlus
Date		: 27 September 2013
Copyright	: Les Arbres Design 2010-2013
Contact		: http://extensions.lesarbresdesign.info
Licence		: GNU General Public License
*********************************************************************/

defined('_JEXEC') or die('Restricted Access');

jimport('joomla.html.html');
jimport('joomla.html.pagination');

class FlexicontactplusViewConfig_Field_List extends JViewLegacy
{
function display($tpl = null)
{
	if (LAFC_JVERSION == 150)
		{
		$order_text = ucfirst(JText::_('ORDERING'));
		$id_text = ucfirst(JText::_('ID'));
		$yes_text = ucfirst(JText::_('YES'));
		$no_text = ucfirst(JText::_('NO'));
		}
	else
		{
		$order_text = ucfirst(JText::_('JFIELD_ORDERING_LABEL'));
		$id_text = ucfirst(JText::_('JGLOBAL_FIELD_ID_LABEL'));
		$yes_text = ucfirst(JText::_('JYES'));
		$no_text = ucfirst(JText::_('JNO'));
		}

	FCP_Admin::make_title('COM_FLEXICONTACT_CONFIG_FIELDS_NAME', $this->config_data, $this->config_count);
	JToolBarHelper::custom('add_default_fields', 'default.png', 'default_f2.png', 'COM_FLEXICONTACT_RESTORE_DEFAULT_FIELDS',false);
	$num_fields = count($this->config_data->config_data->all_fields);
	if ($num_fields < LAFC_MAX_FIELDS)
		JToolBarHelper::addNew();
	JToolBarHelper::editList();
	JToolBarHelper::deleteList();
	JToolBarHelper::cancel();

	$field_types = FCP_Admin::make_field_type_list();

	require_once(LAFC_HELPER_PATH.'/date_pickers.php');
	$validation_types = FCP_date_picker::validation_type_list();

	$pagination = new JPagination($num_fields,0,1000);		// we don't actually use pagination but we need this for the ordering tools

// Joomla 3.0 took away the Javascript checkAll() function. Joomla.checkAll() first appeared in 1.7
	
	if (LAFC_JVERSION <= 160)
		$check_all = 'onclick="checkAll('.$num_fields.');"';
	else
		$check_all = 'onclick="Joomla.checkAll(this);"';

// draw the form

	?>
	<form action="index.php" method="post" name="adminForm" id="adminForm" >
	<input type="hidden" name="option" value="<?php echo LAFC_COMPONENT; ?>" />
	<input type="hidden" name="controller" value="field" />
	<input type="hidden" name="task" value="" />
	<input type="hidden" name="config_id" value="<?php echo $this->config_data->id; ?>" />
	<input type="hidden" name="view" value="config_field_list" />
	<input type="hidden" name="boxchecked" value="0" />
	<input type="hidden" name="config_base_view" value="<?php echo $this->config_base_view; ?>" />
	<?php
	echo '<table>';

	echo '<table class="adminlist table table-striped">';
	echo '<thead>';
	echo '      <th width="1">'.$id_text.'</th>';
	echo '      <th width="1"><input type="checkbox" name="toggle" value="" '.$check_all.' /></th>';
	echo '      <th width="1"></th>';
	echo '      <th width="1"></th>';
	echo '      <th width="1" nowrap="nowrap">'.$order_text.' '.JHTML::_('grid.order', $this->config_data->config_data->all_fields).'</th>';
	echo '		<th nowrap="nowrap" width="20%">'.JText::_('COM_FLEXICONTACT_V_PROMPT').'</th>';
	echo '		<th nowrap="nowrap" width="10%" colspan="2">'.JText::_('COM_FLEXICONTACT_FIELD_TYPE').'</th>';
	echo '		<th nowrap="nowrap" width="5%" >'.JText::_('COM_FLEXICONTACT_V_MANDATORY').'</th>';
	echo '		<th nowrap="nowrap" width="5%" >'.JText::_('COM_FLEXICONTACT_V_WIDTH').'</th>';
	echo '		<th nowrap="nowrap" width="5%" >'.JText::_('COM_FLEXICONTACT_V_HEIGHT').'</th>';
	echo '		<th nowrap="nowrap">'.JText::_('COM_FLEXICONTACT_DETAILS').'</th>';
	echo '	</tr>';
	echo '</thead>';

	for ($i=0; $i < $num_fields; $i++) 
		{
		$field = &$this->config_data->config_data->all_fields[$i];

		$field_type_name = $field_types[$field->field_type];
			
		$checked = JHTML::_('grid.id', $i, $i);

		if ($field->mandatory == 1)
			$mandatory = $yes_text;
		else
			$mandatory = $no_text;

		if ($field->visible == 1)
			$visible = $yes_text;
		else
			$visible = $no_text;

		$width = '';
		$height = '';
		$details = '';
		switch ($field->field_type)
			{
			case LAFC_FIELD_FROM_ADDRESS:
				$width = $field->width;
				break;

			case LAFC_FIELD_FROM_NAME:
			case LAFC_FIELD_TEXT:
			case LAFC_FIELD_PASSWORD:
			case LAFC_FIELD_TEXT_NUMERIC:
			case LAFC_FIELD_FIELDSET_START:
				$width = $field->width;
				if ($field->default_value != '')
					$details = JText::_('COM_FLEXICONTACT_DEFAULT').': '.$field->default_value;
				break;

			case LAFC_FIELD_SUBJECT:
				$width = $field->width;
				if ($field->default_value != '')
					$details = JText::_('COM_FLEXICONTACT_DEFAULT').': '.$field->default_value.', '.JText::_('COM_FLEXICONTACT_VISIBLE').': '.$visible;
				else
					$details = JText::_('COM_FLEXICONTACT_VISIBLE').': '.$visible;
				break;

			case LAFC_FIELD_TEXTAREA:
				$width = $field->width;
				$height = $field->height;
				break;

			case LAFC_FIELD_LIST:
				$list_array = FCP_Common::split_list($field->list_list, $field->delimiter);
				$field_id = sprintf('field%03d',$i);
				$list_html = FCP_Common::make_list($field_id, 0, $list_array['LEFT']);
				$details = $list_html;
				break;

			case LAFC_FIELD_FIXED_TEXT:
				$details = $field->default_value;
				break;
				
			case LAFC_FIELD_REGEX:
				$width = $field->width;
				$details = $field->regex;
				if ($field->error_msg != '')
					$details .= ' ['.$field->error_msg.']';
				break;
				
			case LAFC_FIELD_RECIPIENT:
				$list_array = FCP_Common::split_list($field->list_list, ';', $field->delimiter);
				$field_id = sprintf('field%03d',$i);
				$list_html = FCP_Common::make_list($field_id, 0, $list_array['LEFT']);
				$details = $list_html;
				break;
				
			case LAFC_FIELD_RADIO_V:
			case LAFC_FIELD_RADIO_H:
				$list_array = FCP_Common::split_list($field->list_list, ';', $field->delimiter);
				$details = implode(", ",$list_array['RIGHT']);
				break;

			case LAFC_FIELD_CHECKBOX_M:
				$list_array = FCP_Common::split_list($field->list_list, $field->delimiter);
				$details = implode(", ",$list_array['LEFT']);
				break;
				
			case LAFC_FIELD_DATE:
				$details = $validation_types[$field->validation_type];
			}
			
		$image = FCP_Admin::get_icon_image($field->field_type);
		$link = JRoute::_(LAFC_COMPONENT_LINK.'&controller=field&task=edit&config_base_view='.$this->config_base_view.'&config_id='.$this->config_data->id.'&cid[]='.$i);
		$field_id = sprintf('%02d',($i+1));

		echo "\n<tr>";
		echo '  <td>'.JHTML::link($link, $field_id).'</td>';
		echo '  <td align="center">'.$checked.'</td>';
		echo '  <td>'.$pagination->orderUpIcon($i, true).'</td>';
		echo '  <td>'.$pagination->orderDownIcon($i, true).'</td>';
		echo '  <td><input type="text" name="order[]" size="5" value="'.($i+1).'" class="text_area" style="text-align: center" /></td>';
		echo '  <td nowrap="nowrap">'.JHTML::link($link, $field->prompt).'</td>';
		echo '  <td align="center">'.$image.'</td>';
		echo '  <td nowrap="nowrap">'.$field_type_name.'</td>';
		echo '  <td align="center">'.$mandatory.'</td>';
		echo '  <td align="center">'.$width.'</td>';
		echo '  <td align="center">'.$height.'</td>';
		echo '  <td align="left">'.$details.'</td>';
		echo "\n</tr>";
		}
	
	echo '</table></form>';
}


}