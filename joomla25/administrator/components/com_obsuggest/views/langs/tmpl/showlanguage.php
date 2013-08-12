<?php
/**
 * @version		$Id: showlanguage.php 341 2011-06-04 09:47:01Z phonglq $
 * @package		oblangs - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

global $mainframe, $option, $obIsJ15;
	if(isset($this->res->files)) { 
		$rows 		= $this->res->files;
		$pageNav	= $this->res->pageNav;
	}
	$lists			= $this->res->lists;
	$client			= $this->res->client;
	$filter_langs		= $mainframe->getUserStateFromRequest( $option.'filter_langs',	'filter_langs',	0,				'int' );
	$params = JComponentHelper::getParams('com_languages');
	$langua = $params->get($client->name, 'en-GB');
?>
<SCRIPT language="JavaScript">
function submitform_jlord() {
	var jlord_search = document.getElementById('search1');
	if(jlord_search.value == '') {
		alert("<?php echo JText::_('You_can_enter_a_litle_character_to_search')?>");
		document.adminForm.search1.focus();
		return false;
	}
	document.getElementById('jlord_task').value='search_keyword';
	document.adminForm.submit();
}
</SCRIPT> 
<form action="index.php?option=com_obsuggest" method="post" name="adminForm" id="adminForm">
		<table>
			<tr>
				<td align="left" width="100%">
					<?php echo JText::_( 'Filter' ); ?>:
					<input type="text" name="search1" id="search1" value="<?php echo $lists['search1'];?>" class="text_area" />
					<button onclick="submitform_jlord();"><?php echo JText::_( 'Go' ); ?></button>
					<button onclick="document.getElementById('search1').value='';this.form.getElementById('filter_langs').value='0';this.form.getElementById('filter_dirs').value='0';this.form.getElementById('filter_file').value='*';this.form.submit();"><?php echo JText::_( 'Reset' ); ?></button>
				</td>
				<td nowrap="nowrap">
				<?php
					echo $lists['langs'];
				?>
				</td>				
				<td nowrap="nowrap">
				<?php
					echo $lists['dirlangs'];
				?>
				</td>
				<td nowrap="nowrap">
				<?php
					echo $lists['file_style'];
				?>
				</td>
			</tr>
	</table>
	<table class="adminlist">
		<thead>
		<tr>
			<th width="10px" align="right">
				<?php echo JText::_( 'Num' ); ?>
			</th>
			<th width="10px" align="center">&nbsp;
				
			</th>
			<th width="25px" class="title">
				<?php echo JText::_( 'LANGUAGE_FILE' ); ?>
			</th>			
			<th width="25px" class="title">
				<?php echo JText::_( 'LANGUAGE_LOCATION' ); ?>
			</th>
			<th width="5%">
					<?php echo JText::_( 'Default' ); ?>
			</th>
		</tr>
		</thead>
		<?php if(isset($this->res->pageNav)) { ?>
		<tfoot>
			<tr>
				<td colspan="11">
					<?php echo $pageNav->getListFooter(); ?>
				</td>
			</tr>
		</tfoot>
		<?php }?>
		<?php if(isset($this->res->pageNav)) { ?>
		<tbody>
		<?php
			for($i=0;$i<count($rows);$i++) {
			?>
					<tr>
						<td width="5%">
						<?php echo $pageNav->getRowOffset($i); ?>
						</td>
						<td width="5%">
							<input type="radio" id="cb<?php echo $i;?>" name="cid[]" value="<?php echo $rows[$i]; ?>" onclick="isChecked(this.checked);" />
						</td>
						<td width="25px">
							<?php
								$file_name =substr( $rows[$i], ( strrpos( $rows[$i], DS) + 1 ) ); 
								$link = JFilterOutput::ampReplace('index.php?option='.$option.'&controller=langs&task=getrwlanguage&cid[]='.$rows[$i].'&redirect_file=showlanguage');
							?>
							<a href="<?php echo $link; ?>" ><?php echo $file_name; ?></a>
						</td>
						<td width="25px">
							<?php
								if($filter_langs == 0 || $filter_langs ==2) {
									echo "<b>".JText::_("ADMINISTRATOR")."</b>";
								} else {
									echo "<b>".JText::_("SITE")."</b>";
								}
							?>
						</td>
						<td width="5%" align="center">
						<?php
							if (substr( $rows[$i], ( strrpos( $rows[$i], DS) + 1 ),5 ) == $langua) {	 ?>
								<?php if ($obIsJ15) :?>
								<img src="templates/khepri/images/menu/icon-16-default.png" alt="<?php echo JText::_( 'Default' ); ?>" />
								<?php else: ?>
								<img src="templates/bluestork/images/menu/icon-16-default.png" alt="<?php echo JText::_( 'Default' ); ?>" />
								<?php endif; ?>
								<?php
							} else {
								?>
								&nbsp;
						<?php
							}
						?>
						</td>
					</tr>
			<?php } ?>
		</tbody>
		<?php } ?>
	</table>

	<input type="hidden" name="controller" value="langs" />
	<input type="hidden" id = "jlord_task" name="task" value="showlanguage" />
	<input type="hidden" name="boxchecked" value="0" />
</form>
