<?php
/********************************************************************
Product		: FlexicontactPlus
Date		: 23 February 2013
Copyright	: Les Arbres Design 2010-2013
Contact		: http://extensions.lesarbresdesign.info
Licence		: GNU General Public License
*********************************************************************/

defined('_JEXEC') or die('Restricted Access');

class FlexicontactplusViewLog_List extends JViewLegacy
{
function display($tpl = null)
{
	FCP_Admin::make_title('COM_FLEXICONTACT_LOG');

	JToolBarHelper::deleteList('','delete_log');
	JToolBarHelper::custom('stats', 'chart.png', 'chart.png', JText::_('COM_FLEXICONTACT_STATS'), false);
	if (($this->free_log_info != null) and ($this->free_log_info->count > 0))
		JToolBarHelper::custom('import', 'upload.png', 'upload.png', JText::_('COM_FLEXICONTACT_IMPORT'), false);
	JToolBarHelper::custom('download', 'download.png', 'download.png', JText::_('COM_FLEXICONTACT_DOWNLOAD'), false);
	
// get the order states				

	$app = JFactory::getApplication();
	$filter_order = $app->getUserStateFromRequest(LAFC_COMPONENT.'.filter_order', 'filter_order', 'date_time');
	$filter_order_Dir = $app->getUserStateFromRequest(LAFC_COMPONENT.'.filter_order_Dir', 'filter_order_Dir', 'desc');
	$lists['order_Dir'] = $filter_order_Dir;
	$lists['order'] = $filter_order;
	$search = $app->getUserStateFromRequest(LAFC_COMPONENT.'.search','search','','string');
	$lists['search'] = JString::strtolower($search);

// get the current filters	
		
	$filter_date = $app->getUserStateFromRequest(LAFC_COMPONENT.'.filter_date','filter_date',LAFC_LOG_LAST_28_DAYS,'int');
	$filter_config = $app->getUserStateFromRequest(LAFC_COMPONENT.'.filter_config','filter_config','all','string');

// make the filter lists

	$date_filters = array(
		LAFC_LOG_ALL           => JText::_('COM_FLEXICONTACT_LOG_ALL'),
		LAFC_LOG_LAST_7_DAYS  => JText::_('COM_FLEXICONTACT_LOG_LAST_7_DAYS'),
		LAFC_LOG_LAST_28_DAYS  => JText::_('COM_FLEXICONTACT_LOG_LAST_28_DAYS'),
		LAFC_LOG_LAST_12_MONTHS => JText::_('COM_FLEXICONTACT_LOG_LAST_12_MONTHS')
		);

	$lists['date_filters'] = FCP_Common::make_list('filter_date', $filter_date, $date_filters, 0, 'onchange="this.form.task.value=\'log_list\';submitform( );"');
	$lists['config_filters'] = FCP_Common::make_list('filter_config', $filter_config, $this->config_list, ' ', 'onchange="this.form.task.value=\'log_list\';submitform( );"');
	
// Joomla 3.0 took away the Javascript checkAll() function. Joomla.checkAll() first appeared in 1.7
	
	$numrows = count($this->log_list);
	if (LAFC_JVERSION <= 160)
		$check_all = 'onclick="checkAll('.$numrows.');"';
	else
		$check_all = 'onclick="Joomla.checkAll(this);"';
	
// Show the list

	?>
	<form action="index.php" method="post" name="adminForm" id="adminForm">
	<input type="hidden" name="option" value="<?php echo LAFC_COMPONENT ?>" />
	<input type="hidden" name="controller" value="log" />
	<input type="hidden" name="task" value="log_list" />
	<input type="hidden" name="boxchecked" value="0" />
	<input type="hidden" name="view" value="log_list" />
	<input type="hidden" name="filter_order" value="<?php echo $lists['order']; ?>" />
	<input type="hidden" name="filter_order_Dir" value="<?php echo $lists['order_Dir']; ?>" />
	<input type="hidden" name="config_id" value="<?php echo $this->config_id; ?>" />
	<input type="hidden" name="config_base_view" value="<?php echo $this->config_base_view; ?>" />

	<table>
	<tr>
		<td align="left" width="100%">
			<?php 
			echo ' '.JText::_('COM_FLEXICONTACT_SEARCH').':';
			echo '<input type="text" size="60" name="search" id="search" value="';
			echo $lists['search'];
			echo '" class="text_area" />';
			echo ' <button class="fcp_button" onclick="this.form.task.value=\'log_list\';this.form.submit();">'.JText::_('COM_FLEXICONTACT_GO').'</button>';
			?>
		</td>
		<td nowrap="nowrap">
			<?php
			echo JText::_('COM_FLEXICONTACT_CONFIGURATION').$lists['config_filters'].'&nbsp;';
			echo $lists['date_filters'];
			echo '&nbsp;';
			echo '<button class="fcp_button" onclick="'."
					this.form.filter_date.value='".LAFC_LOG_LAST_28_DAYS."';
					this.form.search.value='';
					this.form.filter_config.value='all';
					this.form.task.value='log_list';
					this.form.submit();".'">'.JText::_('COM_FLEXICONTACT_RESET').'</button>';
			?>
		</td>
	</tr>
	</table>

	<table class="adminlist table table-striped">
	<thead>
	<tr>
		<th width="20"><input type="checkbox" name="toggle" value="" <?php echo $check_all; ?> /></th>
		<th class="title" nowrap="nowrap">
			<?php echo JHTML::_('grid.sort', 'COM_FLEXICONTACT_DATE_TIME', 'datetime', $lists['order_Dir'], $lists['order']); ?></th>
		<th class="title" nowrap="nowrap">
			<?php echo JHTML::_('grid.sort', 'COM_FLEXICONTACT_NAME', 'name', $lists['order_Dir'], $lists['order']); ?></th>
		<th class="title" nowrap="nowrap">
			<?php echo JHTML::_('grid.sort', 'COM_FLEXICONTACT_EMAIL', 'email', $lists['order_Dir'], $lists['order']); ?></th>
		<th class="title" nowrap="nowrap">
			<?php echo JHTML::_('grid.sort', 'COM_FLEXICONTACT_SUBJECT', 'subject', $lists['order_Dir'], $lists['order']); ?></th>
		<th class="title" nowrap="nowrap"><?php echo JText::_('COM_FLEXICONTACT_OTHER_DATA'); ?></th>
		<th class="title" nowrap="nowrap"><?php echo JText::_('COM_FLEXICONTACT_STATUS'); ?></th>
	</tr>
	</thead>

	<tfoot>
	<tr>
		<td colspan="15">
			<?php echo $this->pagination->getListFooter(); ?>
		</td>
	</tr>
	</tfoot>
	
	<tbody>
	<?php
	$k = 0;

	for ($i=0; $i < $numrows; $i++) 
		{
		$row = $this->log_list[$i];
		$link = JRoute::_(LAFC_COMPONENT_LINK.'&controller=log&task=log_detail&config_id='.$this->config_id.'&log_id='.$row->id.'&config_base_view='.$this->config_base_view);
		$checked = JHTML::_('grid.id', $i, $row->id);
		$date = JHTML::link($link, $row->datetime);
		$name = preg_replace('/[^(a-zA-Z \x27)]*/','', $row->name);				// remove all except a-z, A-Z, and '
		$subject = preg_replace('/[^(a-zA-Z1-9 \x27)]*/','', $row->subject);
		$other_data = str_replace('<br />', ' ', $row->short_message);
		$other_data = preg_replace('/[^(a-zA-Z1-9 :\x27)]*/','', $other_data);
		$status_main = $this->_status($row->status_main);
		$status_copy = $this->_status($row->status_copy);

		echo "\n".'<tr class="row'.$k.'">';
		echo "\n ".'<td align="center">'.$checked.'</td>';
		echo "\n ".'<td nowrap="nowrap">'.$date.'</td>';
		echo "\n ".'<td>'.$name.'</td>';
		
		if ($row->email != '')
			{
			$email_link = 'mailto:'.$row->email.'?Subject='.$subject;
			echo "\n ".'<td>'.JHTML::link($email_link, $row->email, 'target="_blank"').'</td>';
			}
		else
			echo "\n ".'<td>'.$row->email.'</td>';
		echo "\n ".'<td>'.$subject.'</td>';
		echo "\n ".'<td>'.$other_data.'</td>';
		echo "\n ".'<td>'.$status_main.' '.$status_copy.'</td>';
		echo "\n".'</tr>';
		$k = 1 - $k;
		}
	?>
	</tbody>
	</table>
	</form>
	<?php
}

function _status($status)
{
	if ($status == '0')		// '0' status means no mail was sent
		return ' ';
	if ($status == '1')		// '1' means email was sent ok
		return '<img src="'.LAFC_ADMIN_ASSETS_URL.'tick.png" border="0" alt="" />';
	return '<img src="'.LAFC_ADMIN_ASSETS_URL.'x.png" border="0" alt="" />';	// anything else was an error
}


}