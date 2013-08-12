<?php
/**
 * @version		$Id: default.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

JHTML::_('behavior.tooltip');
?>

<form id="adminForm" action="<?php echo JRoute::_('index.php');?>" name="adminForm" method="post">
<table class="admintable" cellpadding="0" cellspacing="0" width="100%">
	<tr>
		<td>
			<fieldset>
			<legend>Informations about the component</legend>
				<table class="admintable" cellpadding="0" cellspacing="0" width="100%">
					<tr>
						<td width="15%" height="30" class="key">
							<lable class="hasTip" title="<?php echo JText::_( 'Name' );?>::<?php echo "The name of the component"; ?>">
								<?php echo JText::_('name');?>
							</lable>
						</td>
						<td>
							<input type="text" name="name" size="40" maxlength="70" value="<?php echo $this->currentInfo['com_name'];?>"/>
						</td>
					</tr>
					<tr>
						<td width="15%" height="30" class="key">
							<label title="<?php echo JText::_( 'The creationDate of the component' );?>">
								<?php echo JText::_('creationDate');?>
							</label>
						</td>
						<td>
							<input type="text" name="creationdate" size="40" maxlength="70" value="<?php echo $this->currentInfo['creationdate'];?>"/>
						</td>
					</tr>
					<tr>
						<td width="15%" height="30" class="key">
							<label title="<?php echo JText::_( 'The author of the component' );?>">
								<?php echo JText::_('author');?>
							</label>
						</td>
						<td>
							<input type="text" name="author" size="40" maxlength="70" value="<?php echo $this->currentInfo['author'];?>"/>
						</td>
					</tr>
					<tr>
						<td width="15%" height="30" class="key">
							<label title="<?php echo JText::_( 'The authorEmail of the component' );?>">
								<?php echo JText::_('authorEmail');?>
							</label>
						</td>
						<td>
							<input type="text" name="authorEmail" size="40" maxlength="70" value="<?php echo $this->currentInfo['authorEmail'];?>"/>
						</td>
					</tr>
					<tr>
						<td width="15%" height="30" class="key">
							<label title="<?php echo JText::_( 'The authorUrl of the component' );?>">
								<?php echo JText::_('authorUrl');?>
							</label>
						</td>
						<td>
							<input type="text" name="authorUrl" size="40" maxlength="70" value="<?php echo $this->currentInfo['authorUrl'];?>"/>
						</td>
					</tr>
					<tr>
						<td width="15%" height="30" class="key">
							<label title="<?php echo JText::_( 'The copyright of the component' );?>">
								<?php echo JText::_('copyright');?>
							</label>
						</td>
						<td>
							<input type="text" name="copyright" size="40" maxlength="70" value="<?php echo $this->currentInfo['copyright'];?>" />
						</td>
					</tr>
					<tr>
						<td width="15%" height="30" class="key">
							<label title="<?php echo JText::_( 'The license of the component' );?>">
								<?php echo JText::_('license');?>
							</label>
						</td>
						<td>
							<input type="text" name="license" size="40" maxlength="70" value="<?php echo $this->currentInfo['license'];?>" />
						</td>
					</tr>
					<tr>
						<td width="15%" height="30" class="key">
							<label title="<?php echo JText::_( 'The version of the component' );?>">
								<?php echo JText::_('version');?>
							</label>
						</td>
						<td>
							<input type="text" name="version" size="40" maxlength="70" value="<?php echo $this->currentInfo['version'];?>" />
						</td>
					</tr>
					<tr>
						<td  class="key" >
							<label title="<?php echo JText::_( 'The description about the component' );?>">
								<?php echo JText::_('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Description');?>
							</label>
						</td>
					
						<td >					
								<table border="0" cellpadding="0" cellspacing="0" width="100%">
									<tr><td>
										<?php
											$editor =& JFactory::getEditor();
											// parameters : areaname, content, width, height, cols, rows
											echo $editor->display( 'description', $this->currentInfo['description'], '100%', '350', '75', '50' ) ;
										?>
									</td></tr>
								</table>
						
						</td>
					</tr>
				
				
				</table>
			</fieldset>
		</td>
		<td valign="top" width="50%">
			<fieldset class="adminform">
				<legend>Build options</legend>
				<table class="admintable" cellpadding="0" cellspacing="0" width="100%" >
					<tr>
						
						<td width="50%" height="30" class="key">
							<label>
								<?php echo JText::_('Remove foobla maker');?>
							</label>
						</td>
						<td >
							<input type="radio" name="remove_maker"  value="1" />Yes
							<input type="radio" name="remove_maker"  value="0" checked="checked"/>No
						</td>
					</tr>
					<tr>
						<td width="50%" height="30" class="key">
							<label>
								<?php echo JText::_('Get installed language');?>
							</label>
						</td>
						<td >
							<input type="radio" name="getlang"  value="1" checked="checked"/>Yes
							<input type="radio" name="getlang"  value="0"/>No
						</td>
					</tr>
					<tr>
						<td width="50%" height="30" class="key">
							<label>
								<?php echo JText::_('Backup Prefix');?>
							</label>
						</td>
						<td >
							<input type="text" name="backup_prefix" size="40" />
						</td>
					</tr>
					<tr>
						<td width="50%" height="30" class="key">
							<label>
								<?php echo JText::_('Rename Component By');?>
							</label>
						</td>
						<td >
							<input type="text" name="rename_component" size="40" />
						</td>
					</tr>
					<tr>
						<td width="50%" height="30" class="key"> 
						
							<label >
								<?php echo JText::_('Remove backup');?>
							</label>
						
						</td>
						<td >
							<input type="radio" name="remove_bak" value="1" checked="checked"/>Yes
							<input type="radio" name="remove_bak" value="0"/>No
						</td>
					</tr>
					
				</table>
			</fieldset>
		</td>
	</tr>
</table>
<input type="submit" value="Make" />
<input type="hidden" name="option" value="<?php echo $option ?>" />
<input type="hidden" name="controller" value="foobla_maker" />
<input type="hidden" name="task" value="domake" />
</form>
 

