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

class FlexicontactplusViewLog_Chart extends JViewLegacy
{
function display($tpl = null)
{
	FCP_Admin::make_title('COM_FLEXICONTACT_LOG');
	JToolBarHelper::cancel('display');

// get the filter states

	$app = JFactory::getApplication();
	$filter_date = $app->getUserStateFromRequest(LAFC_COMPONENT.'.filter_date','filter_date',LAFC_LOG_ALL,'int');

// make the filter lists

	$date_filters = array(
		LAFC_LOG_ALL            => JText::_('COM_FLEXICONTACT_LOG_ALL'),
		LAFC_LOG_LAST_12_MONTHS => JText::_('COM_FLEXICONTACT_LOG_LAST_12_MONTHS'),
		);

	$lists['date'] = FCP_Common::make_list('filter_date', $filter_date, $date_filters, 0, 'onchange="submitform( );"');					

// show the chart

?>
<form action="index.php" method="get" name="adminForm" id="adminForm">
<input type="hidden" name="option" value="<?php echo LAFC_COMPONENT ?>" />
<input type="hidden" name="task" value="stats" />
<input type="hidden" name="controller" value="log" />
<input type="hidden" name="config_id" value="<?php echo $this->config_id; ?>" />
<input type="hidden" name="config_base_view" value="<?php echo $this->config_base_view; ?>" />

<table>
	<tr>
		<td align="left" width="100%">
		<?php echo '<strong>'.$this->title.'</strong>'; ?>
		</td>
		<td nowrap="nowrap">
			<?php
			echo $lists['date'];
			echo '&nbsp;';
			echo '<button class="fcp_button" onclick="'."
					this.form.getElementById('filter_date').value='".LAFC_LOG_ALL."';
					this.form.submit();".'">'.JText::_('COM_FLEXICONTACT_RESET').'</button>';
			?>
		</td>
	</tr>
</table>
</form>
<?php
	if (strpos($this->data,'script type'))						// is it a script?
		{
		$document = JFactory::getDocument();
		$document->addScript("https://www.google.com/jsapi");	// load the Google jsapi
		$document->addCustomTag($this->data);						// load the chart script
		echo '<div id="chart_1"></div>';						// create an element for the chart to be drawn in
		}
	else
		echo $this->data;
		
	echo '<h3>'.JText::sprintf('COM_FLEXICONTACT_LOG_ROWS',$this->num_rows).'</h3>';
?>
<div align="right"><?php echo JText::_('COM_FLEXICONTACT_POWERED_BY').' '.JHTML::link(PLOTALOT_LINK, "Plotalot", 'target="_blank"');?></div>
<?php
}
}