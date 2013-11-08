<?php
/********************************************************************
Product		: Flexicontact Plus
Date		: 23 February 2013
Copyright	: Les Arbres Design 2010-2013
Contact		: http://extensions.lesarbresdesign.info
Licence		: GNU General Public License
*********************************************************************/
defined('_JEXEC') or die('Restricted access');

class FlexicontactplusViewLog_Import extends JViewLegacy
{
function display($tpl = null)
{
	FCP_Admin::make_title('COM_FLEXICONTACT_IMPORT_TITLE');
	JToolBarHelper::cancel();

// show the import screen

	?>
	<form action="index.php" method="post" name="adminForm" id="adminForm">
	<input type="hidden" name="option" value="<?php echo LAFC_COMPONENT ;?>" />
	<input type="hidden" name="task" value="" />
	<input type="hidden" name="controller" value="log" />		
	<?php

// show the information about the rows that will be imported

	echo '<h3>'.JText::sprintf('COM_FLEXICONTACT_IMPORT_ROWS',
		$this->free_log_info->count,$this->free_log_info->date_from,$this->free_log_info->date_to).'</h3>';

// if there are already imported rows in the FlexiContactPlus log, they will be deleted

	if ($this->count_imported_rows > 0)
		echo '<h3 style="color:red">'.JText::sprintf('COM_FLEXICONTACT_IMPORT_WARNING',$this->count_imported_rows).'</h3>';

// display the import button

	echo '<input type="submit" name="submit1" class="big_red_button" value="'.JText::_('COM_FLEXICONTACT_IMPORT').'"
		onclick="this.form.task.value='."'import_confirmed'".';this.form.submit();" />';
	
	echo '</form>';

}
				
			
}

			
