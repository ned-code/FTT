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
	$document->addStyleSheet("components/com_arrausermigrate/css/arra_import_layout.css");
	
	$search = JRequest::getVar("search", "");
	$find_users = array();
	if(trim($search) != ""){
		$find_users = $this->findUsers($search);
	}
?>

<script type="text/javascript">
	Joomla.submitbutton = function(pressbutton){
		if(pressbutton == "delete"){
			if(confirm('<?php echo JText::_("ARRA_SURE_DELETE_USERS"); ?>')){
				submitform(pressbutton);
			}
			else{
				return false;
			}
		}
		else{
			submitform(pressbutton);
		}
	}
</script>
<div class="row-fluid adminlist">
<form action="index.php" method="post" name="adminForm" id="adminForm">
	 <table width="100%" cellpadding=0 cellspacing=0>
		<tr valign="top">
			<td class="td_utf_notice" align="center">
				<img src="<?php echo JUri::base().'components/com_arrausermigrate/images/icons/notice_note.png'; ?>">
			</td>
			<td class="td_utf_notice" style="line-height: 30px;">
				<?php echo JText::_("ARRA_DELETE_USERS_NOTICE"); ?> <a href="http://www.joomlarra.com/joomla-1.7-user-export-import-documentation/delete-joomla-17-users.html" title="delete joomla 1.7 users" target="_blank">>> DOCUMENTATION</a><br />
			</td>
		</tr>
	</table>
    
    <table width="100%">
		<tr>
			<td width="50%" valign="top" style="padding-right:5px;">	
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
								</tr>
							</table>		
						</td>
					</tr>
				</table>
			</td>
			<td valign="top" style="padding-left:5px;">
				<fieldset>
					<legend><?php echo JText::_("ARRA_DELETE_BY_SEARCH_LEGEND"); ?></legend>
				<table>
					<tr>
						<td class="td_class_statistics">
							<?php echo JText::_("ARRA_DELETE_BY_SEARCH"); ?>
						</td>
						<td>
							<input type="text" name="search" value="<?php echo $search; ?>"/>
							<input type="submit" name="searc_button" value="<?php echo JText::_("ARRA_SEARCH_BUTTON"); ?>"/>
						</td>
					</tr>
				</table>	
				<div id="table_find_users">
					<?php
						if(count($find_users) > 0){
					?>
							<table cellpadding="9" cellspacing="0" border="0" class="adminlist" style="margin:2px !important; width:99% !important;">
								<tr>
									<th width="1%" align="center">#</th>			
									<th width="1%" align="center"><input type="checkbox" name="toggle" value="" onclick="checkAll(<?php echo count($find_users); ?>);" /></th>
									<th width="10%" align="left"><?php echo JText::_("ARRA_NAME"); ?></th>
									<th width="5%" align="center"><?php echo JText::_("ARRA_USERNAME"); ?></th>
									<th width="5%" align="center"><?php echo JText::_("ARRA_EMAIL"); ?></th>
								</tr>
								<?php
									$j = 0;
									$k = 1;
									for($i=0; $i<count($find_users); $i++) {						
										$item = $find_users[$i];
								?>
										<tr class="<?php echo "row".$j; ?>">
											<td align="center"><?php echo $k; ?></td>
											<td align="center"><?php echo JHtml::_('grid.id', $i, $item["id"]); ?></td>
											<td align="left"><?php echo $item["name"]; ?></td>		
											<td align="left"><?php echo $item["username"]; ?></td>
											<td align="left"><?php echo $item["email"]; ?></td>
										</tr>
								<?php
										$k ++;
										$j = 1-$j;
									}
								?>
							</table>	
					<?php		
						}
					?>
				</div>
				</fieldset>
				
				<fieldset>
					<legend><?php echo JText::_("ARRA_USERNAME_LIST_LEGEND"); ?></legend>
					<table width="100%">
						<tr>
							<td class="td_class_statistics">
								<?php
									echo JText::_("ARRA_SET_USERNAME_LIST");
								?>
								<textarea name="username_list" rows="18"  wrap="off" style="width:95%;"></textarea>
							</td>
						</tr>
					</table>
				</fieldset>	
			</td>			
		</tr>
	</table>			
	
	<div id="statistic_result" style="display:none;"></div>
	
	<input type="hidden" name="option" value="com_arrausermigrate" />
	<input type="hidden" name="task" value="" />
	<input type="hidden" name="controller" value="delete" />
</form>
</div>