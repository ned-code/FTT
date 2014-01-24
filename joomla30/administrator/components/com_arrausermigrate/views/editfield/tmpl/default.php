<?php 
/**
 * ARRA User Export Import component for Joomla! 1.6
 * @version 1.6.0
 * @author ARRA (joomlarra@gmail.com)
 * @link http://www.joomlarra.com
 * @Copyright (C) 2010 - 2011 joomlarra.com. All Rights Reserved.
 * @license GNU General Public License version 2, see LICENSE.txt or http://www.gnu.org/licenses/gpl-2.0.html
 * PHP code files are distributed under the GPL license. All icons, images, and JavaScript code are NOT GPL (unless specified), and are released under the joomlarra Proprietary License, http://www.joomlarra.com/licenses.html
 *
 * file: default.php
 *
 **** class     
 **** functions
 */

// No direct access
	defined( '_JEXEC' ) or die( 'Restricted access' );
	
	$lang = JFactory::getLanguage();
	$lang->load('plg_user_profile', JPATH_ADMINISTRATOR);
	$field = $this->field_details;	
	
	$name = isset($field["0"]["name"]) ? trim($field["0"]["name"]) : "";
	$type = isset($field["0"]["type"]) ? trim($field["0"]["type"]) : "text";
	$id = isset($field["0"]["id"]) ? trim($field["0"]["id"]) : "";
	$description = isset($field["0"]["id"]) ? JText::_(trim($field["0"]["description"])) : "";	
	$filter = isset($field["0"]["filter"]) ? trim($field["0"]["filter"]) : "";
	$label = isset($field["0"]["id"]) ? JText::_(trim($field["0"]["label"])) : "";
	$message = isset($field["0"]["message"]) ? JText::_(trim($field["0"]["message"])) : "";
	$size = isset($field["0"]["size"]) ? trim($field["0"]["size"]) : "";
	$cols = isset($field["0"]["cols"]) ? trim($field["0"]["cols"]) : "";
	$rows = isset($field["0"]["rows"]) ? trim($field["0"]["rows"]) : "";
	$option = isset($field["0"]["option"]) ? trim($field["0"]["option"]) : "";	
	
	$display_size = "none";
	$display_cols = "none";
	$display_rows = "none";
	$display_option = "none";
	
	if($type == "calendar" || $type == "radio" || $type == "textarea"){		
		$display_size = "none";
	}	
	else{
		$display_size = "table-row";
	}
	
	if($type == "textarea"){
		$display_cols = "table-row";
		$display_rows = "table-row";
	}
	
	if($type == "radio" || $type == "list" || $type == "checkboxes"){
		$display_option = "table-row";
	}
	
	
?>

<form method="post" name="adminForm" id="adminForm">	
	<fieldset class="adminform">
		<legend>
			  <span class="editlinktip hasTip" title="<?php echo JText::_("ARRA_EDIT_PROFILE") . "::" .JText::_("ARRA_TOOLTIP_EDIT_PROFILE"); ?>" >
				   <?php echo JText::_("ARRA_EDIT_PROFILE"); ?>
			  </span>
		</legend>
		<table width="100%">
			<tr>
				<td>
					<table>
						<tr>
							<td><?php echo JText::_("ARRA_FIELD_NAME"); ?></td>
							<td><input disabled="disabled" type="text" style="float: none !important;" value="<?php echo $name; ?>" name="field_name" id="field_name"></td>
						</tr>
						<tr>
							<td><?php echo JText::_("ARRA_FIELD_TYPE"); ?></td>
							<td>
								<input type="text" disabled="disabled" style="float: none !important;" name="type" id="type" value="<?php echo $type; ?>" />
							</td>
						</tr>
						<tr>
							<td><?php echo JText::_("ARRA_FIELD_ID"); ?></td>
							<td><input type="text" style="float: none !important;" value="<?php echo $id; ?>" name="field_id" id="field_id"></td>
						</tr>
						<tr>
							<td><?php echo JText::_("ARRA_FIELD_DESCRIPTION"); ?></td>
							<td><textarea rows="2" name="field_description" style="width: auto !important; float: none !important;"><?php echo $description; ?></textarea></td>
						</tr>
						<tr>
							<td><?php echo JText::_("ARRA_FIELD_FILTER"); ?></td>
							<td>
								<select style="float: none !important;" id="field_filter" name="field_filter">
									<option value="string" <?php if($filter=="text"){echo 'selected="selected"';} ?> >string</option>
									<option value="safehtml" <?php if($filter=="text"){echo 'selected="selected"';} ?> >safehtml</option>
                                    <option value="array" <?php if($filter=="array"){echo 'selected="selected"';} ?> >array</option>
								</select>
							</td>
						</tr>
						<tr>
							<td><?php echo JText::_("ARRA_FIELD_LABEL"); ?></td>
							<td><input type="text" style="float: none !important;" value="<?php echo $label; ?>" name="field_label" id="field_label"></td>
						</tr>
						<tr>
							<td><?php echo JText::_("ARRA_FIELD_MESSAGE"); ?></td>
							<td><input type="text" style="float: none !important;" value="<?php echo $message; ?>" name="field_message" id="field_message"></td>
						</tr>
						<tr style="display:<?php echo $display_size; ?>;">
							<td><?php echo JText::_("ARRA_FIELD_SIZE"); ?></td>
							<td><input type="text" style="float: none !important;" value="<?php echo $size; ?>" size="5" name="field_size" id="field_size"></td>
						</tr>
						<tr style="display:<?php echo $display_cols; ?>;">
							<td><?php echo JText::_("ARRA_FIELD_COLS"); ?></td>
							<td><input type="text" style="float: none !important;" value="<?php echo $cols; ?>" size="5" name="field_cols" id="field_cols"></td>
						</tr>
						<tr style="display:<?php echo $display_rows; ?>;">
							<td><?php echo JText::_("ARRA_FIELD_ROWS"); ?></td>
							<td><input type="text" style="float: none !important;" value="<?php echo $rows; ?>" size="5" name="field_rows" id="field_rows"></td>
						</tr>
						<tr style="display:<?php echo $display_option; ?>;">
							<td><?php echo JText::_("ARRA_FIELD_OPTION"); ?></td>
							<td><textarea rows="2" name="field_options" style="width: auto !important; float: none !important;"><?php echo $option; ?></textarea></td>
						</tr>
					</table>
				</td>
				<td align="right" valign="top">
					<table>
						<tr>
							<td>
								<div id="toolbar" class="toolbar-list">
								<ul>									
									<li id="toolbar-save" class="button">
										<a class="toolbar" onclick="javascript:Joomla.submitbutton('save')" href="#">
										<span class="icon-32-save"></span>
										Save &amp; Close
										</a>
									</li>									
									<li id="toolbar-cancel" class="button">
										<a class="toolbar" onclick="javascript:Joomla.submitbutton('cancel')" href="#">
										<span class="icon-32-cancel">
										</span>
										Cancel
										</a>
									</li>								
								</ul>
								<div class="clr"></div>
								</div>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>			
	</fieldset>	
	
	<input type="hidden" name="option" value="com_arrausermigrate" />
	<input type="hidden" name="task" value="" />
	<input type="hidden" name="for_delete" value="" />
	<input type="hidden" name="controller" value="editfield" />
	<input type="hidden" name="field_type" value="<?php echo $type; ?>" />
</form>
