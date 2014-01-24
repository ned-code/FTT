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

    JHTML::_('behavior.tooltip');

    $document =& JFactory::getDocument();
    $document->addStyleSheet("components/com_arrausermigrate/css/arra_admin_layout.css");
	$document->addStyleSheet("components/com_arrausermigrate/css/arra_export_layout.css");
	$document->addScript(JURI::base()."components/com_arrausermigrate/includes/js/validations.js");
?>
<div class="row-fluid adminlist">
<form action="index.php" method="post" name="adminForm" id="adminForm"> 
    <table>
	     <tr>	
		    <td valign="top" style="padding-right:5px;">
		 
		 	<table> 
				<tr>		 		 
					<td width="33%" valign="top" align="center">
						<fieldset class="adminform">
						<legend>
							  <span class="editlinktip hasTip" title="<?php echo JText::_("ARRA_SIMPLE_USER_EXPORT") . "::" .JText::_("ARRA_TOOLTIP_SIMPLE_USER_EXPORT"); ?>" >
								   <?php echo JText::_("ARRA_SIMPLE_USER_EXPORT"); ?>
							  </span>
						</legend>				
							 <table>
								<tr>
								   <td valign="top">				   				     
									<?php // first columns name/username/email 
										echo $this->first_columns_export; ?>
								   </td>
								   <td valign="top">
									   <table>
										  <tr>
											 <td valign="top">
												<input type="checkbox" name="split_name">
											 </td>
											 <td valign="top" class="td_export_definitions">
												<span class="editlinktip hasTip" title="<?php echo JText::_("ARRA_SPLIT_NAME") . "::" .JText::_("ARRA_TOOLTIP_SPLIT_NAME"); ?>">
													<?php echo JText::_("ARRA_SPLIT_NAME"); ?>
												</span>	 									    
											 </td>
										  </tr>
										  <tr>
                                             <td valign="top">
												<input type="checkbox" name="remove_header">
											 </td>												
                                             <td class="td_export_definitions">
											    <span class="editlinktip hasTip" title="<?php echo JText::_("ARRA_REMOVE_HEADER") . "::" .JText::_("ARRA_TOOLTIP_ARRA_REMOVE_HEADER"); ?>">
                                                    <?php echo JText::_("ARRA_REMOVE_HEADER"); ?>
                                                </span>
                                             </td>                                             	                                           		
                                           </tr>
										</table> 	 	
								   </td>
								</tr>   		
								<tr>
									<td align="right">
										<input type="submit" name="export" value=" <?php echo JText::_("ARRA_EXPORT_BUTTON"); ?> ">										
									</td>
									<td></td>
								</tr>
							 </table>				 
						</fieldset>
					 </td>
				</tr>
				<tr>
				    <td width="100%" align="center">	
						<fieldset class="adminform">
							 <legend> 
							    <span class="editlinktip hasTip" title=" <?php echo JText::_("ARRA_ADDITIONAL_FIELDS_PROFILE")."::".JText::_("ARRA_TOOLTIP_FIELDS_PROFILE"); ?> " > 
							         <?php  echo JText::_("ARRA_ADDITIONAL_FIELDS_PROFILE"); ?> 
								</span>
							</legend>
							<span style="font-size:14; font-family:Verdana, Arial, Helvetica, sans-serif; font-weight:bold; color:red; margin-left:5px;">
							<?php
								echo JText::_("ARRA_JOOMLA_PROFILE_DETAILS");
							?>
							</span>
							<table width="100%">
								<tr>
									<td width="100%">
										<?php echo $this->user_profile_fields; ?>
									</td>
								</tr>
							</table>
						</fieldset>
					</td> 
				</tr>
			</table>
			
			</td>
		    <td valign="top" style="padding-left:5px;">
			   <table width="100%">
			    <tr>
				   <td>
				   		<table width="100%">
							<tr>
								<td valign="top">
									<fieldset class="adminform">
										 <legend> 
											<span class="editlinktip hasTip" title=" <?php echo JText::_("ARRA_FIELDS_TO_EXPORT")."::".JText::_("ARRA_TOOLTIP_FIELDS_TO_EXPORT"); ?> " > 
												 <?php  echo JText::_("ARRA_FIELDS_TO_EXPORT"); ?> 
											</span>
										</legend>
										 <table>
											<tr>
											   <td width="60%">				   				     
												<?php // second columns password/user type/blocked 
													   echo $this->second_columns_export1; ?>
											   </td>
												<td width="60%" align="right" valign="top">		   				     
												<?php // second columns register date/last visit/activation 
													   echo $this->second_columns_export2; ?>
											   </td>								  
											</tr>											
										</table>				 
									</fieldset>												
								</td>
							</tr>							
						</table>
				   </td>				   				   
					<td  valign="top"> 		
						<fieldset class="adminform">				     							  
							  <legend> 
									<span class="editlinktip hasTip" title="<?php echo JText::_("ARRA_USER_TYPE")."::".JText::_("ARRA_TOOLTIP_USER_TYPE_PANEL"); ?>"> 
										 <?php  echo JText::_("ARRA_USER_TYPE"); ?> 
									</span>							 
							  </legend>  
							  <table >
								 <tr>
								   <td valign="top">
									   <?php // user type 
											 echo $this->user_type; ?>
									</td>	 
								</tr>
							 </table>
						</fieldset>
				    </td>
				</tr>
				</table>
				<fieldset class="adminform">
					  <legend> 
					 	<span class="editlinktip hasTip" title=" <?php echo JText::_("ARRA_EXPORT_FILE_TYPE")."::".JText::_("ARRA_TOOLTIP_EXPORT_FILE_TYPE_PANEL");?>"> 
								 <?php  echo JText::_("ARRA_EXPORT_FILE_TYPE"); ?> 
						 </span>							 
					  </legend> 					
					  <table>
					    <tr>	
							<td colspan="2" align="left">
							   <div id="file_type_id">
							       <table> 
								       <tr>
									       <td class="td_class">
												<span class="editlinktip hasTip" title=" <?php echo JText::_("ARRA_SEPARATOR")."::".JText::_("ARRA_TIP_SEPARATOR") ?> ">
												       <?php echo JText::_("ARRA_SEPARATOR");?>
												</span>
												<span>
													<a style="color:red;" href="#" onclick="javascript:hide_show('separator_div')"><?php echo JText::_("ARRA_SEPARATOR_2_HEADER"); ?></a></span>
							   					<div id="separator_div" style="display:none; color:red;"><?php echo JText::_("ARRA_SEPARATOR_2"); ?></div>
				                          </td>
									      <td valign="top">
										  	<table>
												<tr>
													<td>
								              			<?php  echo $this->separators; ?> 
											  		</td>
												</tr>
											</table>			
								          </td> 
								       </tr>
								   </table>
							   </div>
							   <div id="ordering_export">
							       <table> 
								       <tr>
									       <td class="td_class">
												<span class="editlinktip hasTip" title=" <?php echo JText::_("ARRA_ORDERING")."::".JText::_("ARRA_TIP_ORDERING") ?> ">
												       <?php echo JText::_("ARRA_ORDERING");?>
												</span>						
				                          </td>
									      <td>
								              <?php  echo $this->ordering; ?> 
								          </td> 
								       </tr>
								   </table>
							   </div>
						    </td>
						</tr>
						<tr>
							<td>
							   <?php  echo $this->file_type; ?>
							</td>
						</tr>													 								
					 </table>				 
				</fieldset>
				
				<fieldset class="adminform">
				     <legend>
					      <span class="editlinktip hasTip" title=" <?php echo JText::_("ARRA_EXPORT_USER_TABLE")."::".JText::_("ARRA_TOOLTIP_EXPORT_USER_TABLE"); ?> " >
					          <?php echo JText::_("ARRA_EXPORT_USER_TABLE"); ?> 
						  </span>
					 </legend>                     
						<?php  echo $this->table_file_type; ?>											 
				</fieldset>
				
				<fieldset class="adminform">
				     <legend>
					      <span class="editlinktip hasTip" title=" <?php echo JText::_("ARRA_SEND_TO_EMAIL").":".JText::_("ARRA_TOOLTIP_SEND_TO_EMAIL"); ?> " >
					      <?php  echo JText::_("ARRA_SEND_TO_EMAIL"); ?>
					 </legend>
                     <table cellspacing="5">
					    <?php  echo $this->email_to; ?>
					 </table>				 
				</fieldset>
				
			</td> 
		 </tr>					 	 
	</table>
		  		  
<input type="hidden" name="option" value="com_arrausermigrate" />
<input type="hidden" name="task" value="export_file" />
<input type="hidden" name="controller" value="export" />
</form>
</div>