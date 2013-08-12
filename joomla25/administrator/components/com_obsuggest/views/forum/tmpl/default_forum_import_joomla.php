<?php
/**
 * @version		$Id: default_forum_import_joomla.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

JHTML::_('behavior.mootools');	
$section_id = JRequest::getVar('section_id','');
$cat_id = JRequest::getVar('cat_id','');

	foreach ($this->output->output['sections'] as $section) {
		if ($section_id == ''){
			$section_id = $section->id;
		}
		$sections[] = JHTML::_('select.option',$section->id,$section->title) ;
	}

if (isset($this->output->output['categorys'])) {		
	foreach ($this->output->output['categorys'] as $category) {
		if ($category->id != 0) {			 
			$categorys[] = JHTML::_('select.option',$category->section_id." ".$category->id,$category->title) ;
		}
		else {
			$categorys[] = JHTML::_('select.Optgroup',$category->title) ;
		}
	}
}	
else {
	$section->id="";
	$section->title='';
	$category->title='';
	$sections[] = JHTML::_('select.option',$section->id,$section->title) ;
	$categorys[] = JHTML::_('select.Optgroup',$category->title) ;
}
	
?>
<script>
window.addEvent('domready', function () {
		$('sectionoptions').addEvent('change', function () {
			var elm_section = $('sectionoptions');
			var section_id = elm_section.options[elm_section.selectedIndex].value;
			$('section_id').value = section_id; 
			$('cat_id').value = "";	
			$('task').value= "import";
			$('adminForm').submit();		
		})
		$('catoptions').addEvent('change', function () {
			var elm_section = $('sectionoptions');
			var section_id = elm_section.options[elm_section.selectedIndex].value;
			
			var elm_cat = $('catoptions');
			var cat_id = elm_cat.options[elm_cat.selectedIndex].value;

			temp = cat_id.split(" ");
						
			$('section_id').value = temp[0];			
			$('cat_id').value = temp[1]; 	
					
			$('task').value= "import";			
			$('adminForm').submit();	
		})
})
	
function btnImport_click() {
	$('task').value= "importJoomlaCore";			
	$('adminForm').submit();	
}
</script>
<form name="adminForm" id="adminForm" action="index.php?option=com_obsuggest&controller=forum&id=<?php echo $this->output->id; ?>&sign=joomlacore" method="POST">
<table class="admintable" width="100%">	
	<tbody>
		<tr>
			<td width="30%" valign="top">
				<table>
					<tr>
						<td class="key"><?php echo JText::_("Section")?></td>
						<td>
						<?php 
							echo JHTML::_('select.genericlist', $sections, 'sectionoptions','style="width: 170px"', 'value', 'text', $section_id);
						?>
						</td>
					</tr>
					<tr>
						<td class="key" valign="top"><?php echo JText::_("Category")?></td>
						<td>
						<?php 
							echo JHTML::_('select.genericlist', $categorys, 'catoptions','size="10" style="width: 170px"', 'value', 'text', $section_id." ".$cat_id);							 							
						?>
						</td>
					</tr>
					<tr>
						<td colspan="2">
							<input type="button" style="width: 100%" onclick="btnImport_click()" value="<?php echo JText::_("Import idea")?>" />
						</td>
					</tr>
				</table>
			</td>
			<td valign="top">
			
				<?php echo $this->loadTemplate('forum_import_ideas'); ?>
			</td>
		</tr>		
	</tbody>	
	<tfoot>
		<tr>
			<td colspan="2">
				
			</td>
		</tr>
	</tfoot>
</table>
<input type="hidden" name="section_id" id="section_id" value="<?php echo $section_id?>" />
<input type="hidden" name="cat_id" id="cat_id" value="<?php echo $cat_id; ?>" />
<input type="hidden" name="task" id="task" value="" />
</form>

