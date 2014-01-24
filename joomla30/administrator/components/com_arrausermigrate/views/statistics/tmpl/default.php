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

    $document =& JFactory::getDocument();
   	$document->addStyleSheet("components/com_arrausermigrate/css/arra_admin_layout.css");
	$document->addStyleSheet("components/com_arrausermigrate/css/arra_statistics_layout.css");
	$document->addScript(JURI::base()."components/com_arrausermigrate/includes/js/statistics.js");	
	$document->addScript(JURI::base()."components/com_arrausermigrate/includes/js/GenGraphics.js");
	$document->addScript(JURI::base()."components/com_arrausermigrate/includes/js/graphicImage.js");
	
?>
<div class="row-fluid adminlist">
<form action="index.php" method="post" name="adminForm" id="adminForm">   
    
	<b style="color:#FF6D00;">&nbsp;&nbsp;&nbsp;&nbsp;<?php echo "On the right hand side you will see the details (number and percentage) from the total amount of users." ?></b>
	<table width="100%">
		<tr>
			<td width="50%">	
				<table width="100%">
					<tr>
						<td>
							<fieldset>
								<legend>
							  		<span class="editlinktip hasTip" title="<?php echo JText::_("ARRA_USER_TYPE") . "::" .JText::_("ARRA_TOOLTIP_USERTYPE"); ?>" >
								   	<?php echo JText::_("ARRA_USER_TYPE"); ?>
							  		</span>
								</legend>
								<?php echo $this->getUserType(); ?>
							</fieldset>
						</td>
					</tr>
				</table>
				<table width="100%">
					<tr>			
						<td>
							<fieldset>
								<legend><?php echo JText::_("ARRA_REGISTER_DATE"); ?></legend>
								<?php echo $this->getRegisterDate(); ?>
							</fieldset>
						</td>
					</tr>
					<tr>	
						<td>
							<fieldset>
								<legend><?php echo JText::_("ARRA_VISIT_DATE"); ?></legend>
								<?php echo $this->getLastVisitedDate(); ?>
							</fieldset>
						</td>
					</tr>
					<tr>
						<td>
							<table width="100%">	
								<tr>
									<td width="33%" valign="top">
										<fieldset>
											<legend><?php echo JText::_("ARRA_ACTIVATION"); ?></legend>
											<?php echo $this->getActivatedUsers(); ?>
										</fieldset>
									</td>
									<td width="31%" valign="top">
										<fieldset>
											<legend><?php echo JText::_("ARRA_BLOCK_UNBLOCK_USER"); ?></legend>
											<?php echo $this->getBlockUnblock(); ?>
										</fieldset>
									</td>
									<td width="33%" valign="top">
										<fieldset>
											<legend><?php echo JText::_("ARRA_SEND_EMAIL"); ?></legend>
											<?php echo $this->getSendEmail(); ?>
										</fieldset>
									</td>									
								</tr>
							</table>		
						</td>
					</tr>
				</table>
			</td>
			<td width="100%" valign="top" align="center">				
				<table width="100%" cellpadding="0" cellspacing="0" align="center">
					<tr>
						<td valign="top" align="center" colspan="3">
							<table width="90%">
								<tr>
									<td class="td_class_statistics2"><?php echo JText::_("ARRA_USERS_NUMBER"); ?></td>
									<td class="td_class_statistics2"><?php echo JText::_("ARRA_USERS_PERCENTE"); ?></td>
									<td class="td_class_statistics2"><?php echo JText::_("ARRA_USERS_TOTAL"); ?></td>
								</tr>
								<tr>
									<td class="td_class_statistics2"><div id="users_number"></div></td>
									<td class="td_class_statistics2"><div id="users_percente"></div></td>
									<td class="td_class_statistics2"><?php echo $this->users1; ?></td>	
								</tr>
							</table>
						</td>
					</tr>
					<tr>
						<td width="30%"></td>
						<td align="center">	
							<?php
								$usersCount = $this->countUsers();					
							?>
							<div id="image_diagram">
								<?php									
									foreach($usersCount as $key=>$value){
										echo $this->createDiagram($value["total"]);
									}							
								?>
							</div>							
						</td>
						<td></td>					
					</tr>	
					<tr>
						<td></td>
						<td nowrap="nowrap">
							<div id="text_diagram">
								<?php
									foreach($usersCount as $key=>$value){										
										echo '<div id="text_diagram_element">'.$value["title"]." (".$this->createCalcul($value["total"])."%)"."</div>";
									}
								?>
							</div>
						</td>
						<td></td>
					</tr>
				</table>
			</td>
		</tr>
	</table>			
	
	<div id="statistic_result" style="display:none;"></div>
	
<input type="hidden" name="option" value="com_arrausermigrate" />
<input type="hidden" name="task" value="" />
<input type="hidden" name="controller" value="statistics" />
</form>
</div>