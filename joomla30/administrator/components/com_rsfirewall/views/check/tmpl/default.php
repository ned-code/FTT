<?php
/**
* @version 1.4.0
* @package RSFirewall! 1.4.0
* @copyright (C) 2009-2013 www.rsjoomla.com
* @license GPL, http://www.gnu.org/licenses/gpl-2.0.html
*/

defined('_JEXEC') or die('Restricted access');
JText::script('COM_RSFIREWALL_ERROR_CHECK');
JText::script('COM_RSFIREWALL_ERROR_FIX');
JText::script('COM_RSFIREWALL_CONFIGURATION_LINE');
JText::script('COM_RSFIREWALL_USERNAME');
JText::script('COM_RSFIREWALL_PASSWORD');
JText::script('COM_RSFIREWALL_MORE_FOLDERS');
JText::script('COM_RSFIREWALL_MORE_FILES');
JText::script('COM_RSFIREWALL_RENAME_ADMIN');

JText::script('COM_RSFIREWALL_HASHES_CORRECT');
JText::script('COM_RSFIREWALL_HASHES_INCORRECT');
JText::script('COM_RSFIREWALL_FILE_HAS_BEEN_MODIFIED');
JText::script('COM_RSFIREWALL_FILE_IS_MISSING');

JText::script('COM_RSFIREWALL_FOLDER_PERMISSIONS_INCORRECT');
JText::script('COM_RSFIREWALL_FOLDER_PERMISSIONS_CORRECT');
JText::script('COM_RSFIREWALL_PLEASE_WAIT_WHILE_BUILDING_DIRECTORY_STRUCTURE');
JText::script('COM_RSFIREWALL_FIX_FOLDER_PERMISSIONS_DONE');

JText::script('COM_RSFIREWALL_FILE_PERMISSIONS_INCORRECT');
JText::script('COM_RSFIREWALL_FILE_PERMISSIONS_CORRECT');
JText::script('COM_RSFIREWALL_PLEASE_WAIT_WHILE_BUILDING_FILE_STRUCTURE');
JText::script('COM_RSFIREWALL_FIX_FILE_PERMISSIONS_DONE');

JText::script('COM_RSFIREWALL_ITEMS_LEFT');

JText::script('COM_RSFIREWALL_MALWARE_PLEASE_REVIEW_FILES');
JText::script('COM_RSFIREWALL_NO_MALWARE_FOUND');
?>
<form action="<?php echo JRoute::_('index.php?option=com_rsfirewall&view=check');?>" method="post" name="adminForm" id="adminForm">
<div class="span2">
	<?php echo $this->sidebar; ?>
</div>
<div class="span10">
	<div id="com-rsfirewall-main-content">
		<div id="com-rsfirewall-grade" style="display: none;">
			<p><strong><?php echo JText::_('COM_RSFIREWALL_GRADE_FINISHED'); ?></strong><br /><?php echo JText::_('COM_RSFIREWALL_GRADE_FINISHED_DESC'); ?></p>
			<input type="text" value="100" readonly="readonly" disabled="disabled" style="height: auto;" />
		</div>
			
		<p id="com-rsfirewall-scan-in-progress" class="com-rsfirewall-hidden"><?php echo JText::_('COM_RSFIREWALL_SCAN_IS_IN_PROGRESS'); ?></p>
		<p><button type="button" class="btn btn-primary" id="com-rsfirewall-start-button" onclick="RSFirewallStartCheck();"><?php echo JText::_('COM_RSFIREWALL_CHECK_SYSTEM'); ?></button></p>
		<div class="com-rsfirewall-content-box">
			<div class="com-rsfirewall-content-box-header">
				<h3><span class="com-rsfirewall-icon-16-joomla"></span><?php echo JText::_('COM_RSFIREWALL_JOOMLA_CONFIGURATION'); ?></h3>
			</div>
			<div id="com-rsfirewall-joomla-configuration" class="com-rsfirewall-content-box-content com-rsfirewall-hidden">
				<div class="com-rsfirewall-progress" id="com-rsfirewall-joomla-configuration-progress"><div class="com-rsfirewall-bar" style="width: 0%;">0%</div></div>
				<table id="com-rsfirewall-joomla-configuration-table">
					<thead>
						<tr>
						   <th><?php echo JText::_('COM_RSFIREWALL_ACTION'); ?></th>
						   <th><?php echo JText::_('COM_RSFIREWALL_RESULT'); ?></th>
						   <th>&nbsp;</th>
						</tr>
					</thead>
					<tbody>
						<tr class="com-rsfirewall-table-row alt-row com-rsfirewall-hidden">
							<td><span><?php echo JText::_('COM_RSFIREWALL_JOOMLA_VERSION_CHECK'); ?></span></td>
							<td class="com-rsfirewall-count"><span></span></td>
							<td nowrap="nowrap" width="1%"><button class="com-rsfirewall-button com-rsfirewall-details-button com-rsfirewall-hidden" type="button"><span class="expand"></span></button></td>
						</tr>
						<tr class="com-rsfirewall-table-row alt-row com-rsfirewall-hidden">
							<td colspan="3"></td>
						</tr>
						<tr class="com-rsfirewall-table-row com-rsfirewall-hidden">
							<td><span><?php echo JText::_('COM_RSFIREWALL_FIREWALL_VERSION_CHECK'); ?></span></td>
							<td class="com-rsfirewall-count"><span></span></td>
							<td nowrap="nowrap" width="1%"><button class="com-rsfirewall-button com-rsfirewall-details-button com-rsfirewall-hidden" type="button"><span class="expand"></span></button></td>
						</tr>
						<tr class="com-rsfirewall-table-row com-rsfirewall-hidden">
							<td colspan="3"></td>
						</tr>
						<tr class="com-rsfirewall-table-row alt-row com-rsfirewall-hidden">
							<td><span><?php echo JText::_('COM_RSFIREWALL_CHECKING_SQL_PASSWORD'); ?></span></td>
							<td class="com-rsfirewall-count"><span></span></td>
							<td nowrap="nowrap" width="1%"><button class="com-rsfirewall-button com-rsfirewall-details-button com-rsfirewall-hidden" type="button"><span class="expand"></span></button></td>
						</tr>
						<tr class="com-rsfirewall-table-row alt-row com-rsfirewall-hidden">
							<td colspan="3"></td>
						</tr>
						<tr class="com-rsfirewall-table-row com-rsfirewall-hidden">
							<td><span><?php echo JText::_('COM_RSFIREWALL_CHECKING_ADMIN_USER'); ?></span></td>
							<td class="com-rsfirewall-count"><span></span></td>
							<td nowrap="nowrap" width="1%"><button class="com-rsfirewall-button com-rsfirewall-details-button com-rsfirewall-hidden" type="button"><span class="expand"></span></button></td>
						</tr>
						<tr class="com-rsfirewall-table-row com-rsfirewall-hidden">
							<td colspan="3"><p><label for="com-rsfirewall-new-username"><?php echo JText::_('COM_RSFIREWALL_NEW_USERNAME'); ?></label> <input onkeyup="RSFirewallChangeAdminUserButtonText();" id="com-rsfirewall-new-username" type="text" name="" value="admin" /> <button type="button" onclick="RSFirewallFix('fixAdminUser', this)" id="com-rsfirewall-rename-admin-button" class="com-rsfirewall-button com-rsfirewall-fix-button"><?php echo JText::sprintf('COM_RSFIREWALL_RENAME_ADMIN', 'admin'); ?></button></p></td>
						</tr>
						<tr class="com-rsfirewall-table-row alt-row com-rsfirewall-hidden">
							<td><span><?php echo JText::_('COM_RSFIREWALL_CHECKING_FTP_PASSWORD'); ?></span></td>
							<td class="com-rsfirewall-count"><span></span></td>
							<td nowrap="nowrap" width="1%"><button class="com-rsfirewall-button com-rsfirewall-details-button com-rsfirewall-hidden" type="button"><span class="expand"></span></button></td>
						</tr>
						<tr class="com-rsfirewall-table-row alt-row com-rsfirewall-hidden">
							<td colspan="3"><p><button type="button" onclick="RSFirewallFix('fixFTPPassword', this)" class="com-rsfirewall-button com-rsfirewall-fix-button"><?php echo JText::_('COM_RSFIREWALL_REMOVE_FTP_PASSWORD'); ?></button></p></td>
						</tr>
						<tr class="com-rsfirewall-table-row com-rsfirewall-hidden">
							<td><span><?php echo JText::_('COM_RSFIREWALL_CHECKING_SEF'); ?></span></td>
							<td class="com-rsfirewall-count"><span></span></td>
							<td nowrap="nowrap" width="1%"><button class="com-rsfirewall-button com-rsfirewall-details-button com-rsfirewall-hidden" type="button"><span class="expand"></span></button></td>
						</tr>
						<tr class="com-rsfirewall-table-row com-rsfirewall-hidden">
							<td colspan="3"><p><button type="button" onclick="RSFirewallFix('fixSEF', this)" class="com-rsfirewall-button com-rsfirewall-fix-button"><?php echo JText::_('COM_RSFIREWALL_ENABLE_SEF'); ?></button></p></td>
						</tr>
						<tr class="com-rsfirewall-table-row alt-row com-rsfirewall-hidden">
							<td><span><?php echo JText::_('COM_RSFIREWALL_CHECKING_CONFIGURATION_INTEGRITY'); ?></span></td>
							<td class="com-rsfirewall-count"><span></span></td>
							<td nowrap="nowrap" width="1%"><button class="com-rsfirewall-button com-rsfirewall-details-button com-rsfirewall-hidden" type="button"><span class="expand"></span></button></td>
						</tr>
						<tr class="com-rsfirewall-table-row alt-row com-rsfirewall-hidden">
							<td colspan="3"><p><button type="button" onclick="RSFirewallFix('fixConfiguration', this)" class="com-rsfirewall-button com-rsfirewall-fix-button"><?php echo JText::_('COM_RSFIREWALL_REBUILD_CONFIGURATION'); ?></button></p><p><?php echo JText::_('COM_RSFIREWALL_CONFIGURATION_DETAILS'); ?></p></td>
						</tr>
						<tr class="com-rsfirewall-table-row com-rsfirewall-hidden">
							<td><span><?php echo JText::_('COM_RSFIREWALL_CHECKING_CONFIGURATION_OUTSIDE'); ?></span></td>
							<td class="com-rsfirewall-count"><span></span></td>
							<td nowrap="nowrap" width="1%"><button class="com-rsfirewall-button com-rsfirewall-details-button com-rsfirewall-hidden" type="button"><span class="expand"></span></button></td>
						</tr>
						<tr class="com-rsfirewall-table-row com-rsfirewall-hidden">
							<td colspan="3"></td>
						</tr>
						<tr class="com-rsfirewall-table-row alt-row com-rsfirewall-hidden">
							<td><span><?php echo JText::_('COM_RSFIREWALL_CHECKING_WEAK_PASSWORDS'); ?></span></td>
							<td class="com-rsfirewall-count"><span></span></td>
							<td nowrap="nowrap" width="1%"><button class="com-rsfirewall-button com-rsfirewall-details-button com-rsfirewall-hidden" type="button"><span class="expand"></span></button></td>
						</tr>
						<tr class="com-rsfirewall-table-row alt-row com-rsfirewall-hidden">
							<td colspan="3"><p><?php echo JText::_('COM_RSFIREWALL_WEAK_PASSWORDS_DETAILS'); ?></p></td>
						</tr>
						<tr class="com-rsfirewall-table-row com-rsfirewall-hidden">
							<td><span><?php echo JText::_('COM_RSFIREWALL_CHECKING_SESSION_LIFETIME'); ?></span></td>
							<td class="com-rsfirewall-count"><span></span></td>
							<td nowrap="nowrap" width="1%"><button class="com-rsfirewall-button com-rsfirewall-details-button com-rsfirewall-hidden" type="button"><span class="expand"></span></button></td>
						</tr>
						<tr class="com-rsfirewall-table-row com-rsfirewall-hidden">
							<td colspan="3"><p><button type="button" onclick="RSFirewallFix('fixSession', this)" class="com-rsfirewall-button com-rsfirewall-fix-button"><?php echo JText::_('COM_RSFIREWALL_DECREASE_SESSION'); ?></button></p></td>
						</tr>
						<tr class="com-rsfirewall-table-row alt-row com-rsfirewall-hidden">
							<td><span><?php echo JText::_('COM_RSFIREWALL_CHECKING_TEMPORARY_FILES'); ?></span></td>
							<td class="com-rsfirewall-count"><span></span></td>
							<td nowrap="nowrap" width="1%"><button class="com-rsfirewall-button com-rsfirewall-details-button com-rsfirewall-hidden" type="button"><span class="expand"></span></button></td>
						</tr>
						<tr class="com-rsfirewall-table-row alt-row com-rsfirewall-hidden">
							<td colspan="3"><p><button type="button" onclick="RSFirewallFix('fixTemporaryFiles', this)" class="com-rsfirewall-button com-rsfirewall-fix-button"><?php echo JText::_('COM_RSFIREWALL_EMPTY_TEMPORARY_FOLDER'); ?></button></p></td>
						</tr>
						<tr class="com-rsfirewall-table-row com-rsfirewall-hidden">
							<td><span><?php echo JText::sprintf('COM_RSFIREWALL_CHECKING_HTACCESS', $this->accessFile); ?></span></td>
							<td class="com-rsfirewall-count"><span></span></td>
							<td nowrap="nowrap" width="1%"><button class="com-rsfirewall-button com-rsfirewall-details-button com-rsfirewall-hidden" type="button"><span class="expand"></span></button></td>
						</tr>
						<tr class="com-rsfirewall-table-row com-rsfirewall-hidden">
							<td colspan="3"><p><button type="button" onclick="RSFirewallFix('fixHtaccess', this)" class="com-rsfirewall-button com-rsfirewall-fix-button"><?php echo JText::sprintf('COM_RSFIREWALL_RENAME_HTACCESS', $this->defaultAccessFile, $this->accessFile); ?></button></p></td>
						</tr>
						<tr class="com-rsfirewall-table-row alt-row com-rsfirewall-hidden">
							<td><span><?php echo JText::_('COM_RSFIREWALL_CHECKING_TEMPORARY_OUTSIDE'); ?></span></td>
							<td class="com-rsfirewall-count"><span></span></td>
							<td nowrap="nowrap" width="1%"><button class="com-rsfirewall-button com-rsfirewall-details-button com-rsfirewall-hidden" type="button"><span class="expand"></span></button></td>
						</tr>
						<tr class="com-rsfirewall-table-row alt-row com-rsfirewall-hidden">
							<td colspan="3"></td>
						</tr>
					</tbody>
				</table>
			</div>
		</div><!-- Joomla! config -->
		<div class="com-rsfirewall-content-box">
			<div class="com-rsfirewall-content-box-header">
				<h3><span class="com-rsfirewall-icon-16-server"></span><?php echo JText::_('COM_RSFIREWALL_SERVER_CONFIGURATION'); ?></h3>
			</div>
			<div id="com-rsfirewall-server-configuration" class="com-rsfirewall-content-box-content com-rsfirewall-hidden">
				<div class="com-rsfirewall-progress" id="com-rsfirewall-server-configuration-progress"><div class="com-rsfirewall-bar" style="width: 0%;">0%</div></div>
				<table id="com-rsfirewall-server-configuration-table">
					<thead>
						<tr>
						   <th><?php echo JText::_('COM_RSFIREWALL_PHP_DIRECTIVE'); ?></th>
						   <th><?php echo JText::_('COM_RSFIREWALL_RESULT'); ?></th>
						</tr>
					</thead>
					<tbody>
						<tr class="com-rsfirewall-table-row alt-row com-rsfirewall-hidden">
							<td width="15%" nowrap="nowrap"><span>register_globals</span></td>
							<td class="com-rsfirewall-count"><span></span></td>
						</tr>
						<tr class="com-rsfirewall-table-row alt-row com-rsfirewall-hidden">
							<td colspan="2"></td>
						</tr>
						<tr class="com-rsfirewall-table-row com-rsfirewall-hidden">
							<td width="15%" nowrap="nowrap"><span>allow_url_fopen</span></td>
							<td class="com-rsfirewall-count"><span></span></td>
						</tr>
						<tr class="com-rsfirewall-table-row com-rsfirewall-hidden">
							<td colspan="2"></td>
						</tr>
						<tr class="com-rsfirewall-table-row alt-row com-rsfirewall-hidden">
							<td width="15%" nowrap="nowrap"><span>allow_url_include</span></td>
							<td class="com-rsfirewall-count"><span></span></td>
						</tr>
						<tr class="com-rsfirewall-table-row alt-row com-rsfirewall-hidden">
							<td colspan="2"></td>
						</tr>
						<tr class="com-rsfirewall-table-row com-rsfirewall-hidden">
							<td width="15%" nowrap="nowrap"><span>open_basedir</span></td>
							<td class="com-rsfirewall-count"><span></span></td>
						</tr>
						<tr class="com-rsfirewall-table-row com-rsfirewall-hidden">
							<td colspan="2"></td>
						</tr>
						<tr class="com-rsfirewall-table-row alt-row com-rsfirewall-hidden">
							<td width="15%" nowrap="nowrap"><span>disable_functions</span></td>
							<td class="com-rsfirewall-count"><span></span></td>
						</tr>
						<tr class="com-rsfirewall-table-row alt-row com-rsfirewall-hidden">
							<td colspan="2"></td>
						</tr>
						<?php if (!$this->isPHP54) { ?>
						<tr class="com-rsfirewall-table-row com-rsfirewall-hidden">
							<td width="15%" nowrap="nowrap"><span>safe_mode</span></td>
							<td class="com-rsfirewall-count"><span></span></td>
						</tr>
						<tr class="com-rsfirewall-table-row com-rsfirewall-hidden">
							<td colspan="2"></td>
						</tr>
						<?php } ?>
						<tr class="com-rsfirewall-table-row com-rsfirewall-hidden" id="com-rsfirewall-server-configuration-fix">
							<td colspan="2">
								<p><button type="button" onclick="RSFirewallFix('fixPHP', this)" class="com-rsfirewall-button com-rsfirewall-fix-button"><?php echo JText::_('COM_RSFIREWALL_FIX_PHP'); ?></button></p>
								<p><small><?php echo JText::_('COM_RSFIREWALL_PHP_ERROR_DESC'); ?></small></p>
								<div id="com-rsfirewall-php-ini-wrapper" class="com-rsfirewall-hidden">
									<p><?php echo JText::_('COM_RSFIREWALL_PHP_INI_INSTRUCTIONS'); ?></p>
									<pre id="com-rsfirewall-php-ini"></pre>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div><!-- Server config -->
		<div class="com-rsfirewall-content-box">
			<div class="com-rsfirewall-content-box-header">
				<h3><span class="com-rsfirewall-icon-16-filescan"></span><?php echo JText::_('COM_RSFIREWALL_SCAN_RESULT'); ?></h3>
			</div>
			<div id="com-rsfirewall-file-scan" class="com-rsfirewall-content-box-content com-rsfirewall-hidden">
				<table id="com-rsfirewall-file-scan-table">
					<thead>
						<tr>
						   <th><?php echo JText::_('COM_RSFIREWALL_ACTION'); ?></th>
						   <th><?php echo JText::_('COM_RSFIREWALL_RESULT'); ?></th>
						   <th>&nbsp;</th>
						</tr>
					</thead>
					<tbody>
						<tr class="com-rsfirewall-table-row alt-row com-rsfirewall-hidden">
							<td width="15%" nowrap="nowrap"><span><?php echo JText::_('COM_RSFIREWALL_SCANNING_JOOMLA_HASHES'); ?></span></td>
							<td class="com-rsfirewall-count"><span></span></td>
							<td nowrap="nowrap" width="1%"><button class="com-rsfirewall-button com-rsfirewall-details-button com-rsfirewall-hidden" type="button"><span class="expand"></span></button></td>
						</tr>
						<tr class="com-rsfirewall-table-row alt-row com-rsfirewall-hidden">
							<td colspan="3">
								<p><button type="button" onclick="RSFirewallFix('fixHashes', this)" class="com-rsfirewall-button com-rsfirewall-fix-button"><?php echo JText::_('COM_RSFIREWALL_ACCEPT_CHANGES'); ?></button></p>
								<p><small><?php echo JText::_('COM_RSFIREWALL_ACCEPT_CHANGES_WARNING'); ?></small></p>
							</td>
						</tr>
						<?php if (!$this->isWindows) { ?>
						<tr class="com-rsfirewall-table-row com-rsfirewall-hidden">
							<td width="15%" nowrap="nowrap"><span><?php echo JText::_('COM_RSFIREWALL_SCANNING_FOLDERS'); ?></span></td>
							<td class="com-rsfirewall-count"><span></span></td>
							<td nowrap="nowrap" width="1%"><button class="com-rsfirewall-button com-rsfirewall-details-button com-rsfirewall-hidden" type="button"><span class="expand"></span></button></td>
						</tr>
						<tr class="com-rsfirewall-table-row com-rsfirewall-hidden">
							<td colspan="3">
								<p><button type="button" onclick="RSFirewallFix('fixFolderPermissions', this)" class="com-rsfirewall-button com-rsfirewall-fix-button"><?php echo JText::_('COM_RSFIREWALL_ATTEMPT_TO_FIX_FOLDER_PERMISSIONS'); ?></button></p>
								<p><small><?php echo JText::_('COM_RSFIREWALL_FIX_FOLDER_PERMISSIONS_WARNING'); ?></small></p>
							</td>
						</tr>
						<tr class="com-rsfirewall-table-row alt-row com-rsfirewall-hidden">
							<td width="15%" nowrap="nowrap"><span><?php echo JText::_('COM_RSFIREWALL_SCANNING_FILES'); ?></span></td>
							<td class="com-rsfirewall-count"><span></span></td>
							<td nowrap="nowrap" width="1%"><button class="com-rsfirewall-button com-rsfirewall-details-button com-rsfirewall-hidden" type="button"><span class="expand"></span></button></td>
						</tr>
						<tr class="com-rsfirewall-table-row alt-row com-rsfirewall-hidden">
							<td colspan="3">
								<p><button type="button" onclick="RSFirewallFix('fixFilePermissions', this)" class="com-rsfirewall-button com-rsfirewall-fix-button"><?php echo JText::_('COM_RSFIREWALL_ATTEMPT_TO_FIX_FILE_PERMISSIONS'); ?></button></p>
								<p><small><?php echo JText::_('COM_RSFIREWALL_FIX_FILE_PERMISSIONS_WARNING'); ?></small></p>
							</td>
						</tr>
						<?php } ?>
						<tr class="com-rsfirewall-table-row com-rsfirewall-hidden">
							<td width="15%" nowrap="nowrap"><span><?php echo JText::_('COM_RSFIREWALL_SCANNING_FILES_FOR_MALWARE'); ?></span></td>
							<td class="com-rsfirewall-count"><span></span></td>
							<td nowrap="nowrap" width="1%"><button class="com-rsfirewall-button com-rsfirewall-details-button com-rsfirewall-hidden" type="button"><span class="expand"></span></button></td>
						</tr>
						<tr class="com-rsfirewall-table-row com-rsfirewall-hidden">
							<td colspan="3"></td>
						</tr>
					</tbody>
				</table>
			</div>
		</div><!-- Scan result -->
	</div>
</div>
</form>

<script type="text/javascript">
function RSFirewallStartCheck() {
	RSFirewall.$('#com-rsfirewall-start-button').remove();
	RSFirewall.System.Check.unhide('#com-rsfirewall-scan-in-progress').hide().fadeIn('slow');
	
	// Joomla! Configuration Check
	RSFirewall.System.Check.prefix = 'com-rsfirewall-joomla-configuration';
	RSFirewall.System.Check.steps   = [
		'checkJoomlaVersion',
		'checkRSFirewallVersion',
		'checkSQLPassword',
		'checkAdminUser',
		'checkFTPPassword',
		'checkSEFEnabled',
		'checkConfigurationIntegrity',
		'checkConfigurationOutside',
		'checkAdminPasswords',
		'checkSession',
		'checkTemporaryFiles',
		'checkHtaccess',
		'checkTemporaryOutside'
	];
	RSFirewall.System.Check.stopCheck = function() {
		RSFirewall.$('#com-rsfirewall-joomla-configuration-progress').fadeOut('fast', function(){RSFirewall.$(this).remove()});
		RSFirewallServerCheck();
	};
	RSFirewall.System.Check.startCheck();
}

function RSFirewallServerCheck() {
	// Server Configuration Check
	RSFirewall.System.Check.prefix = 'com-rsfirewall-server-configuration';
	RSFirewall.System.Check.steps  = [
		'checkRegisterGlobals',
		'checkAllowURLFopen',
		'checkAllowURLInclude',
		'checkOpenBasedir',
		'checkDisableFunctions'<?php if (!$this->isPHP54) { ?>,
		'checkSafeMode'<?php } ?>
	];
	RSFirewall.System.Check.stopCheck = function() {
		RSFirewall.$('#com-rsfirewall-server-configuration-progress').fadeOut('fast', function(){RSFirewall.$(this).remove()});
		RSFirewallFilesCheck();
	};
	RSFirewall.System.Check.startCheck();
}

function RSFirewallFilesCheck() {
	RSFirewall.System.Check.prefix = 'com-rsfirewall-file-scan';
	RSFirewall.System.Check.steps  = [
		'checkCoreFilesIntegrity',
		<?php if (!$this->isWindows) { ?>
		'checkFolderPermissions',
		'checkFilePermissions',
		<?php } ?>
		'checkSignatures'
	];
	RSFirewall.System.Check.stopCheck = function() {
		RSFirewall.$('#com-rsfirewall-scan-in-progress').remove();
		
		RSFirewall.Grade.create();
		RSFirewall.$(window).scrollTop(0);
	};
	RSFirewall.System.Check.startCheck();
}

function RSFirewallChangeAdminUserButtonText() {
	var text 	= RSFirewall.$('#com-rsfirewall-new-username').val();
	var button 	= RSFirewall.$('#com-rsfirewall-rename-admin-button');
	
	button.text(Joomla.JText._('COM_RSFIREWALL_RENAME_ADMIN').replace('%s', text));
}

function RSFirewallFix(step, button) {
	RSFirewall.System.Check.limit = <?php echo $this->offset; ?>;
	
	// disable the checkboxes
	if (step == 'fixFolderPermissions') {
		RSFirewall.$('input[name="folders[]"]').attr('disabled', true);
	} else if (step == 'fixFilePermissions') {
		RSFirewall.$('input[name="files[]"]').attr('disabled', true);
	}
	
	RSFirewall.System.Check.fix(step, button);
}
</script>