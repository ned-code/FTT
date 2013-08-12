<?php
/**
 * @version		$Id: import_add_user.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>
<script>
function btnDeleteAccount_click(id) {
	var ok;
	ok = confirm('<?php echo JText::_('Are you sure')?>?');	
	if (ok) {
		listItemTask(id,'deleteAccount');
		
		return;
	}
}
function btnAddSubdomain_click() {
	var account = document.adminForm.account_subdomain.value;
	account = account.trim();
	if (account == "") {
		return; 
	}
	$('task').value = "addUserVoiceSubdomain";
	$('adminForm').submit();
}
function btnImport_click() {
	$('task').value = "showUserVoiceIdea";
	$('adminForm').submit();
}
</script>
<form name="adminForm" id='adminForm'action="index.php?option=com_obsuggest&controller=exportimport&sign=import" method="POST">
<table border="0" width="100%">
	<tr>
		<td width="50%" valign="top">
			<fieldset>
				<legend><?php echo JText::_('Uservoice Account')?></legend>
				<table class="adminlist">
					<thead>
						<tr>
							<td colspan="5" style="background-color: #FFF">
								<table class="" cellpadding="0" cellspacing="0">
									<tr>
										<td class="key"><?php echo JText::_('Subdomain')?></td>
										<td width="400px">
											<input id="account_subdomain" type="text" name="account_subdomain" onkeydown="" style="width: 100%;" />
										</td>										
									</tr>
                                    <tr>
										<td class="key"><?php echo JText::_('Password')?></td>
										<td width="400px">
											<input id="account_pass" type="text" name="account_pass" onkeydown="" style="width: 100%;" />
										</td>										
									</tr>	
                                    <tr>
                                    	<td></td>
                                    	<td>
                                        	<input type="button" value="<?php echo JText::_('Add subdomain')?>" onclick='btnAddSubdomain_click()' />
                                        </td>
                                    </tr>								
								</table>                                	
							</td>
						</tr>
						<tr>
							<th width="5%">#</th>
							<th width="5%">
								<input type="checkbox" onclick="checkAll(1000);" value="" name="toggle"/>
							</th>
							<th><?php echo JText::_('Subdomain')?></th>
							<th width="3%"><?php echo JText::_('Show')?></th>
							<th width="10%"><?php echo JText::_('Delete')?></th>
						</tr>
					</thead>
					<tbody>					
						<?php 
							$i=0;
							$k=0;
							foreach ($this->output->account as $accout_uservoice) { 								
								$published = JHTML::_('grid.published', $accout_uservoice, $i);
						?>
						<tr class="row<?php echo $k; $k = 1-$k; ?>">
							<td align="center"><?php echo ++$i; ?></td>
							<td align="center">
								<input type="checkbox" onclick="isChecked(this.checked)" name="cid[]" id="cb<?php echo $i-1;?>" value="<?php echo $accout_uservoice->id; ?>"/>
							</td>
							<td><b><?php echo $accout_uservoice->subdomain; ?></b></td>
							<td align="center"><?php echo $published; ?></td>
							<td>
								<input type="button" value="<?php echo JText::_('Delete')?>" onclick="btnDeleteAccount_click('cb<?php echo $i-1;?>')"/>
							</td>
						</tr>
						<?php }?>
					</tbody>
					<tfoot>
						<tr>
							<td colspan="10"></td>						
						</tr>
					</tfoot>
				</table>
			</fieldset>
		</td>
		<td valign="top">
			<fieldset>
				<legend><?php echo JText::_('Uservoice Forums')?></legend>
				<table class="admintable" width="100%">	
					<tr>
						<td colspan="3">
							<table class="adminlist" border="0">
								<thead>
									<tr>
										<th width="5%">#</th>
										<th width="5%">
											<input type="checkbox" onclick="checkAllForum(this)" value="-1" />
										</th>
										<th><?php echo JText::_('Forum')?></th>
										<th width="20%"><?php echo JText::_('Subdomain')?></th>												
									</tr>
								</thead>
								<tfoot>
									<tr>
										<td colspan="7">							
										</td>
									</tr>
								</tfoot>
								<tbody id="list_forum">
								<?php 
									$i = 0;
									$k = 0;					
									if ($this->output->forums != NULL) {
										foreach ($this->output->forums as $key => $forums) {
											if($forums)
											foreach ($forums as $forum) {
								?>
									<tr class="row<?php echo $k; $k = 1 - $k; $i++; ?>">
										<td align="center"><?php echo $i?></td>
										<td align="center">
											<input type="checkbox" name="account_topic[]" onclick="isChecked(this.checked)"value="<?php echo $key;?>_f<?php echo $forum->id; ?>" />
										</td>
										<td><b><?php echo $forum->name; ?></b></td>
										<td align="left"><?php echo $key; ?></td>
									</tr>
								<?php		}
										}
									} 
								?>
								</tbody>
							</table>
						</td>
					</tr>
				</table>
			</fieldset>
		</td>
	</tr>
</table>
<input type="hidden" name="task" id="task" value="" />
<input type="hidden" name="boxchecked" value="" />
</form>
<script>
function checkAllForum(me)
{
	var p = document.getElementById('list_forum');
	var el = p.getElementsByTagName('input');
	//alert(el)
	if(el)
	{
		for(var i = 0; i < el.length ; i++)
		{		
			if(el[i].type == 'checkbox')
			{				
				el[i].checked = me.checked;
				isChecked(el[i].checked);
			}
		}
	}
	else{
		
	}
}
document.getElementById('account_subdomain').onkeydown = function(e)
{
	var keycode;
	if (window.event) keycode = window.event.keyCode;
	else if (e) keycode = e.which;
	if(keycode == 13){
		$('task').value = "addUserVoiceSubdomain";
	}
}
</script>
