<?php
/**
 * @version		$Id: default.php 340 2011-06-04 09:46:43Z phonglq $
 * @package		oblangs - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

$boolean_array = array (
	JHTML::_('select.option', '0', JText::_('OBRSS_SETTINGS_HIDE')),
	JHTML::_('select.option', '1', JText::_('OBRSS_SETTINGS_SHOW'))
);
?>
<script type="text/javascript">
function btnAddSubdomain_click() {
	var account = document.adminForm.account_subdomain.value;
	account = account.trim();
	if (account == "") {
		return; 
	}
	$('task').value = "addUserVoiceSubdomain";
	$('adminForm').submit();
}
function obDoSwitch(switcher){
	var el = switcher.getParent().getFirst(".ob_switch");
	if(el.value == 1){
		switcher.setProperty("class","switcher-off");
		el.value = 0;
	}else{
		switcher.setProperty("class","switcher-on");
		el.value = 1;
	}
}

window.addEvent("domready", function() {
	/* Switch buttons */
	$$(".ob_switch").each(function(el){
		el.setStyle("display","none");
		var style = (el.value == 1) ? "on" : "off";
		var switcher = new Element("div",{"class" : "switcher-"+style,"onclick":"obDoSwitch(this)"});
		switcher.injectAfter(el);
	});
});
</script>
<form name="adminForm" id="adminForm" action="index.php?option=com_obsuggest&controller=config" method="POST">
	<table class="admintable" width="100%">
		<tr>					
			<td width="50%" valign="top">
				<?php 
					$this->_addPath( 'template', JPATH_COMPONENT.DS.'views'.DS. 'forum'.DS.'tmpl' ); 
					echo $this->loadTemplate('forum_info'); 
				?>
				<fieldset>
					<legend><?php echo JText::_('Avatar'); ?></legend>
					<table class="admintable">
						<tr>
							<td class="key"><?php echo JText::_("Avatar"); ?></td>
							<td>
							<?php
								$avatar = isset($this->gconfig['avatar']->value) ? $this->gconfig['avatar']->value : 'gravatar'; ?>
								<select name="gconfig[avatar]">
									<option value="gravatar"<?php echo ( $avatar == 'gravatar' ) ?' selected="selected"' : '';?>><?php echo JText::_('Gravatar'); ?></option>
									<option value="com_comprofiler"<?php echo ( $avatar == 'com_comprofiler' ) ?' selected="selected"' : '';?>><?php echo JText::_('COMMUNITY_BUILDER'); ?></option>
									<option value="com_kunena"<?php echo ( $avatar == 'com_kunena' ) ?' selected="selected"' : '';?>><?php echo JText::_('KUNENA_FORUM'); ?></option>
									<option value="com_community"<?php echo ( $avatar == 'com_community' ) ?' selected="selected"' : '';?>><?php echo JText::_('JOMSOCIAL'); ?></option>
									<option value="com_alphauserpoints"<?php echo ($avatar == 'com_alphauserpoints') ?' selected="selected"' : '';?>><?php echo JText::_('AlphaUserPoints'); ?></option>
								</select>
							</td>
						</tr>
					</table>
				</fieldset>
				<fieldset>
					<legend><?php echo JText::_('Vote_Box'); ?></legend>
					<table class="admintable">
						<tr>
							<td class="key"><?php echo JText::_("Vote_Box"); ?></td>
							<td>
							<?php
								$layouts = JFolder::files(JPATH_COMPONENT_SITE.DS.'vote_boxs','.php');
								$vote_layout = isset($this->gconfig['votebox']->value) ? $this->gconfig['votebox']->value : 'default.php';
							?>
								<select name="gconfig[votebox]">
								<?php
								if( count($layouts) ) {
									foreach ($layouts as $layout) {
										$selected = ( $layout == $vote_layout ) ?' selected="selected"' : '';
										echo '<option value="'. $layout . '" ' . $selected . '>' . substr( $layout, 0, -4 ) . '</option>'; 
									}
								}
								?>
								</select>
							</td>
						</tr>
						<tr>
							<td class="key"><?php echo JText::_("OBSG_LIMIT_POINT_FOR_EACH_FORUM"); ?></td>
							<td><?php 
								$maxpoint = ( isset( $this->gconfig['limitpoint']->value ) ) ? $this->gconfig['limitpoint']->value : '10';
							?><input name="gconfig[limitpoint]" value="<?php echo $maxpoint; ?>"/></td>
						</tr>
					</table>
				</fieldset>
			</td>
			<td width="50%" valign="top">
				<table width="100%" class="admintable">
					<tr>
						<td valign="top">
							<fieldset>
								<legend><?php echo JText::_('Show_Forum_List_Box')?></legend>
								<table class="admintable" width="97%">
									<tr>
										<td class="key"><?php echo JText::_('Forum_List_Box')?></td>
										<td>
											<?php echo JHTML::_('select.genericlist', $boolean_array, 'config_listbox', 'class="inputbox ob_switch"', 'value', 'text', $this->output->config->listbox); ?>
										</td>
									</tr>
								</table>
							</fieldset>
						</td>
					</tr>
					<tr>
						<td valign="top">
							<fieldset>
								<legend><?php echo JText::_('Bad_Word')?></legend>
								<table class="admintable" width="97%">
									<tr>
										<td class="key" valign="top"><?php echo JText::_("CENSORED_WORDS")?>
										</td>
										<td>
											<textarea style="width: 100%" name="config_bad_word"><?php echo $this->output->config->bad_word; ?></textarea>
										</td>
									</tr>
								</table>
							</fieldset>
						</td>
					</tr>	
	                <tr>
	                	<td>
	                    <?php echo $this->loadTemplate("datetime"); ?>
	                    </td>
	                </tr>			
				</table>
			</td>
		</tr>	
	</table>
<input type="hidden" name="boxchecked"  value="0" />
<?php echo JHTML::_( 'form.token' ); ?>
<input type='hidden' name="task" id="task" value="">
</form>
