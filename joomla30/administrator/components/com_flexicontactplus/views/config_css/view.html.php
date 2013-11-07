<?php
/********************************************************************
Product		: FlexicontactPlus
Date		: 01 March 2013
Copyright	: Les Arbres Design 2010-2013
Contact		: http://extensions.lesarbresdesign.info
Licence		: GNU General Public License
*********************************************************************/

defined('_JEXEC') or die('Restricted Access');

class FlexicontactplusViewConfig_Css extends JViewLegacy
{
function display($tpl = null)
{
	FCP_Admin::make_title('COM_FLEXICONTACT_CONFIG_CSS_NAME');
	JToolBarHelper::apply('apply_css');
	JToolBarHelper::save('save_css');
	JToolBarHelper::cancel();
		
	$css_files = FCP_Admin::get_css_list();
	// No CSS files?
	if ($css_files == false)
		{
		$app = JFactory::getApplication();
		$app->redirect(LAFC_COMPONENT_LINK.'&task=display&config_base_view='.$this->config_base_view,
			JText::sprintf('COM_FLEXICONTACT_NO_CSS', LAFC_SITE_ASSETS_PATH), 'error');
		return;
		}
		
	$fail = false;
	$path = LAFC_SITE_ASSETS_PATH.'/';
	$css = $this->css_file_name;		// set the css name to be used by the view. Assume that the specified one is ok
	
	// Check current CSS file
	if (!file_exists($path.$css)) 
		{
		$app = JFactory::getApplication();
		$app->enqueueMessage(JText::_('COM_FLEXICONTACT_CSS_MISSING').' ('.$path.$css.')', 'error');
		FCP_trace::trace("Config_CSS View: ".$path.$css." missing");
		$fail = true;
		}
	else
		{
		if (!is_readable($path.$css)) 
			{ 
			$app = JFactory::getApplication();
			$app->enqueueMessage(JText::_('COM_FLEXICONTACT_CSS_NOT_READABLE').' ('.$path.$css.')', 'error');
			FCP_trace::trace("Config_CSS View: ".$path.$css." not readable");
			$fail = true;
			}

		if (!is_writable($path.$css)) 
			{ 
			$app = JFactory::getApplication();
			$app->enqueueMessage(JText::_('COM_FLEXICONTACT_CSS_NOT_WRITEABLE').' ('.$path.$css.')', 'error'); 
			FCP_trace::trace("Config_CSS View: ".$path.$css." not writeable");
			$fail = true;
			}
		}
		
	// Do we have a problem with the selected CSS file? If so, try the default
	if ($fail)
		{
		if ($css !== LAFC_FRONT_CSS_NAME)				// No point doing this if the config css file was the default!
			{
			$fail = false;
			$css = LAFC_FRONT_CSS_NAME;
			FCP_trace::trace("-------------------->: Attempting to use default CSS file");
			if (!file_exists($path.$css)) 
				{ 
				FCP_trace::trace("-------------------->: ".$path.$css." missing");
				$fail = true;
				}
			else
				{
				if (!is_readable($path.$css)) 
					{ 
					FCP_trace::trace("-------------------->: ".$path.$css." not readable");
					$fail = true;
					}

				if (!is_writable($path.$css)) 
					{ 
					FCP_trace::trace("-------------------->: ".$path.$css." not writeable");
					$fail = true;
					}
				}
			}
		}
		
	// If we still have a problem, find the first valid css file in the files list
	if ($fail)
		{
		foreach($css_files as $key => $value)
			{
			$css = $key;
			$fail = false;
			
			if (!file_exists($path.$css))
				$fail = true;
			if ((!$fail) and (!is_readable($path.$css))) 
				$fail = true;
			if ((!$fail) and (!is_writable($path.$css)))
				$fail = true;	
				
			if (!$fail)			// Found a functioning css file
				break;
			}
		}

	// Still got a problem?
	if ($fail)
		{
		$app = JFactory::getApplication();
		$app->redirect(LAFC_COMPONENT_LINK.'&task=display&config_base_view='.$this->config_base_view,
			JText::sprintf('COM_FLEXICONTACT_NO_VALID_CSS', LAFC_SITE_ASSETS_PATH), 'error');
		return;
		}

	$css_contents = @file_get_contents($path.$css);
	
	?>
	<form action="index.php" method="post" name="adminForm" id="adminForm" >
	<input type="hidden" name="option" value="<?php echo LAFC_COMPONENT; ?>" />
	<input type="hidden" name="controller" value="menu" />
	<input type="hidden" name="task" value="" />
	<input type="hidden" name="view" value="config_css" />
	<input type="hidden" name="config_id" value="<?php echo $this->config_id; ?>" />
	<input type="hidden" name="config_base_view" value="<?php echo $this->config_base_view; ?>" />
	
	<?php 
	echo '<table>';
	echo '<tr><td>'.FCP_Common::make_list('css_file_name', $css, $css_files, 0, 'onchange="submitform( );"').'</td></tr>';
	echo '<tr><td class="css_file_path">'.JText::_('COM_FLEXICONTACT_CSS_FILE'),': ('.$path.$css.')';
	echo '<tr><td>';
	echo '<textarea name="css_contents" rows="25" cols="125" style="width:auto;">'.$css_contents .'</textarea>';
	echo '</td><td valign="top">';
	echo FCP_Admin::make_info('www.w3schools.com/css','http://www.w3schools.com/css/default.asp');
	echo '</td></tr></table>';
	?>
	</form>
	<?php 
}

}