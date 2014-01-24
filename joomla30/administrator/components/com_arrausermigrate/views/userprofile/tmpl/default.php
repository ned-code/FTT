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
	JHTML::_('behavior.calendar');
	JHTML::_('behavior.tooltip');
	JHTML::_('behavior.modal');

    $document =& JFactory::getDocument();
	$document->addStyleSheet("components/com_arrausermigrate/css/arra_admin_layout.css");
	$document->addStyleSheet("components/com_arrausermigrate/css/arra_import_layout.css");
	$document->addScript(JURI::base()."components/com_arrausermigrate/includes/js/validations.js");   
	$number_fields = 35;
?>
<div class="row-fluid adminlist">
<form method="post" name="adminForm" id="adminForm">
<ul class="nav nav-tabs" id="myTab">
	 <li class="active"><a href="#edit" data-toggle="tab"><?php echo JText::_('ARRA_EDIT_FIELDS_PROFILE')?></a>
	 <li><a href="#fields" data-toggle="tab"><?php echo JText::_('ARRA_ADD_FIELDS_PROFILE')?></a>
	 <li><a href="#filter" data-toggle="tab"><?php echo JText::_('ARRA_FILTER_FIELDS_PROFILE')?></a>
</ul>
	<div class="tab-content">
	<?php		
		$fields = $this->fields;
		$lang = JFactory::getLanguage();
		$lang->load('plg_user_profile', JPATH_ADMINISTRATOR);
	?>
	
		<div class="tab-pane active" id="edit">
		<table width="100%">
        	<tr>
            	<td colspan="7" align="left">
                	<input style="background-color:#FFFF00; color:#FF0000;" type="submit" name="recreatefields" value="<?php echo JText::_("ARRA_RECREATE_FIELDS_BUTTON"); ?>" onclick="document.adminForm.task.value='recreatefields'" />
                </td>
            </tr>
			<tr>
				<th width="2%" align="center">#</th>			
				<th width="2%" align="center">
                	<input type="checkbox" onclick="Joomla.checkAll(this)" title="Check All" value="" name="checkall-toggle">
                </th>
				<th align="left"><?php echo JText::_("ARRA_FIELD_NAME"); ?></th>
				<th align="left"><?php echo JText::_("ARRA_FIELD_LABEL"); ?></th>
				<th align="left"><?php echo JText::_("ARRA_FIELD_ID"); ?></th>
				<th align="left"><?php echo JText::_("ARRA_FIELD_TYPE"); ?></th>
				<th align="left"><?php echo JText::_("ARRA_DELETE_FIELD"); ?></th>
			</tr>
			<?php
				if(count($fields) > 0){
					$i = 0;
					foreach($fields as $key=>$value){
			?>
						<tr>
							<td align="center"><?php echo $i+1; ?></td>
							<td align="center"><?php echo JHtml::_('grid.id', $i, $i); ?></td>
							<td><a style="text-decoration:underline;" rel="{handler: 'iframe', size: {x: 850, y: 350}}" class="modal"  href="index.php?option=com_arrausermigrate&controller=editfield&task=editfield&name=<?php echo $value["name"]; ?>&tmpl=component"><?php echo $value["name"]; ?></a></td>
							<td><?php echo JText::_($value["label"]); ?></td>
							<?php
								if(isset($value["id"])){
							?>
								<td><?php echo $value["id"]; ?></td>
							<?php
								}
								else{
									echo '<td></td>';
								}
							?>
							<td><?php echo $value["type"]; ?></td>
							<td align="left"><input type="button" onclick="javascript:deleteField('<?php echo $value["name"]; ?>', '<?php echo $value["type"]; ?>');" name="delete" value="<?php echo JText::_("ARRA_DELETE"); ?>" /></td>
						</tr>
			<?php	
						$i++;		
					}
				}
			?>
		</table>
		</div>
		<div class="tab-pane" id="fields">
			<fieldset class="adminform">
				<legend>
					  <span class="editlinktip hasTip" title="<?php echo JText::_("ARRA_USER_PROFILE") . "::" .JText::_("ARRA_TOOLTIP_USER_PROFILE"); ?>" >
						   <?php echo JText::_("ARRA_USER_PROFILE"); ?>
					  </span>
				</legend>
				
				<table cellpadding="0" cellspacing="0" style="margin:auto;">
					<tr>
						<td align="center" class="td_settings_options" style="text-align:center !important;">
							<?php echo JText::_("ARRA_NUMBER_USER_PROFILE_FIELDS"); ?>
							<select onchange="javascript:setAdditionalColumn(this);" name="number_columns" style="float:none !important;">
							<?php 
								for($i=0; $i<=$number_fields; $i++){
									echo '<option value="'.$i.'">'.$i.'</option>';		
								}
							?>
							</select>
						</td>
					</tr>
					<tr>
						<td>
							<table style="margin:auto;">
								<?php
									for($i=1; $i<=$number_fields; $i++){
								?>
										<tr>
											<td>
												<div id="column<?php echo $i; ?>" style="display:none; background-color:#E9E9E9; border-bottom:1px solid #E9E9E9; border-right:1px solid #E9E9E9; color:#666666; font-weight:bold;">
													<table>
														<tr>
															<td valign="top">
																<span class="editlinktip hasTip" title="<?php echo JText::_("ARRA_FIELD_NAME"); ?>::<?php echo JText::_("ARRA_FIELD_NAME_TOOLTIP"); ?>">
																<?php echo JText::_("ARRA_FIELD_NAME"); ?></span><br /><input type="text" id="field_name_<?php echo $i; ?>" name="field_name_<?php echo $i; ?>" value="" style="float:none !important;" />
															</td>
															<td valign="top">
																<?php echo JText::_("ARRA_FIELD_TYPE")."<br /><br/>".$this->getFieldType($i); ?>
															</td>
															<td valign="top">
																<span class="editlinktip hasTip" title="<?php echo JText::_("ARRA_FIELD_ID"); ?>::<?php echo JText::_("ARRA_FIELD_ID_TOOLTIP"); ?>">
																<?php echo JText::_("ARRA_FIELD_ID"); ?></span><br /><input type="text" id="field_id_<?php echo $i; ?>" name="field_id_<?php echo $i; ?>" value="" style="float:none !important;" />
															</td>
															<td valign="top">
																<?php echo JText::_("ARRA_FIELD_DESCRIPTION"); ?>
																<br/><br/>
																<textarea style="width:auto !important; float:none !important;" name="field_description_<?php echo $i; ?>" rows="2"></textarea>
															</td>
															<td valign="top">
																<span class="editlinktip hasTip" title="<?php echo JText::_("ARRA_FIELD_FILTER"); ?>::<?php echo JText::_("ARRA_FIELD_FILTER_TOOLTIP"); ?>">
																<?php echo JText::_("ARRA_FIELD_FILTER")."</span><br />".$this->getFieldFilter($i); ?>
															</td>
															<td valign="top">
																<span class="editlinktip hasTip" title="<?php echo JText::_("ARRA_FIELD_LABEL"); ?>::<?php echo JText::_("ARRA_FIELD_LABEL_TOOLTIP"); ?>">
																<?php echo JText::_("ARRA_FIELD_LABEL"); ?><br /><br/><input type="text" id="field_label_<?php echo $i; ?>" name="field_label_<?php echo $i; ?>" value="" style="float:none !important;" />														
															</td>
															<td valign="top">
																<?php echo JText::_("ARRA_FIELD_MESSAGE"); ?><br /><br/><input type="text" id="field_message_<?php echo $i; ?>" name="field_message_<?php echo $i; ?>" value="" style="float:none !important;" />														
															</td>
															<td valign="top" id="td_options_<?php echo $i; ?>" style="display:none;">
																<span class="editlinktip hasTip" title="<?php echo JText::_("ARRA_FIELD_OPTION"); ?>::<?php echo JText::_("ARRA_FIELD_OPTION_TOOLTIP"); ?>">
																<?php echo JText::_("ARRA_FIELD_OPTION"); ?></span>
																<br/>
																<textarea style="width:auto !important; float:none !important;" name="field_option_<?php echo $i; ?>" rows="2"></textarea>
															</td>
															<td valign="top" id="td_cols_<?php echo $i; ?>" style="display:none;">
																<?php echo JText::_("ARRA_FIELD_COLS"); ?><br /><br/><input type="text" id="field_cols_<?php echo $i; ?>" name="field_cols_<?php echo $i; ?>" value="" style="float:none !important;" size="5" />														
															</td>
															<td valign="top" id="td_rows_<?php echo $i; ?>" style="display:none;">
																<?php echo JText::_("ARRA_FIELD_ROWS"); ?><br /><br/><input type="text" id="field_rows_<?php echo $i; ?>" name="field_rows_<?php echo $i; ?>" value="" style="float:none !important;" size="5" />														
															</td>
															<td valign="top" id="td_size_<?php echo $i; ?>" style="display:block;">
																<?php echo JText::_("ARRA_FIELD_SIZE"); ?><br /><br/><input type="text" id="field_size_<?php echo $i; ?>" name="field_size_<?php echo $i; ?>" value="" style="float:none !important;" size="5" />														
															</td>
														</tr>
													</table>
												</div>
											</td>
								<?php		
									}
								?>
							</table>
						</td>
					</tr>
				</table>				
			</fieldset>	
		</div>
		<div class="tab-pane" id="filter">
				<fieldset class="adminform">
					<legend>
						  <span class="editlinktip hasTip" title="<?php echo JText::_("ARRA_USER_PROFILE_FILTER") . "::" .JText::_("ARRA_TOOLTIP_USER_PROFILE_FILTER"); ?>" >
							   <?php echo JText::_("ARRA_USER_PROFILE_FILTER"); ?>
						  </span>
					</legend>
						<table>
							<tr>
								<td class="td_settings_2">
									<?php
										echo JText::_("ARRA_SEPARATOR");
									?>
								</td>
								<td>
									<select name="separator">
										<option value=","> , comma</option>
										<option value=";"> ; semicolon</option>
										<option value="|"> | vertical bar</option>
										<option value="."> . dot</option>
									</select>
								</td>
							</tr>
							<tr>
								<td class="td_settings_2" style="height:80px;">
									<?php 
										echo JText::_("ARRA_USER_SELECT_FIELD");
									?>
								</td>
								<td>
									<?php
										echo $this->getFields();
									?>
								</td>
								<td>
									<div id="filter">										
									</div>
									<div id="datefilter" style="display:none;">
										<?php
											echo JHTML::_('calendar', '', 'datefield', 'datefield', "%Y-%m-%d", array('size'=>'25',  'maxlength'=>'19'));
										?>
									</div>
								</td>
								<td id="divsearch" style="display:none;" style="height:80px;">
									<input type="button" name="searchfield" value="<?php echo JText::_("ARRA_SEARCH_BUTTON"); ?>" onclick="javascrip:searchByFilters();" />
								</td>
								<td id="imagewait" style="display:none; text-align: center; width:50%;">
									<img style="float: none !important;" src="<?php echo JURI::root()."administrator/components/com_arrausermigrate/images/icons/pleasewait.gif"; ?>" alt="pleasewait" />
								</td>
							</tr>
						</table>
				</fieldset>
		</div>
	<input type="hidden" name="option" value="com_arrausermigrate" />
	<input type="hidden" name="task" value="" />
	<input type="hidden" name="for_delete_name" value="" />
	<input type="hidden" name="for_delete_type" value="" />
	<input type="hidden" name="controller" value="userprofile" />
	<input type="hidden" name="boxchecked" value="0" />
</div>
</form>
</div>