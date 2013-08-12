<?php
/**
 * @version		$Id: default.php 341 2011-06-04 09:47:01Z phonglq $
 * @package		oblangs - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.html.pane');
require_once( JPATH_COMPONENT.DS.'helpers'.DS.'theme.php');
$image 			 = Theme::dispSubMenuConFig();
$default 		 = $image->default;
$forum			 = $image->forum;
$idea 			 = $image->idea;
$permission 	 = $image->permission;
$export_import 	 = $image->export_import;
$vote  			 = $image->vote;
$upgrade  		 = $image->upgrade;
$langs			 = $image->langs;
$report			= $image->report;
$themes			= $image->themes;

$url 			 = 'components/com_obsuggest/assets/images/icons/';
?>
	<table class="adminform">
	<tr>
		<td width="55%">
			<div id="cpanel">
				<div style="float:left;">
					<div class="icon">
					<a href="index.php?option=com_obsuggest&controller=config">
					<?php echo JHTML::_('image.site','configuration_48.png',$url, NULL, NULL, JText::_('GLOBAL_CONFIGURATION') ); ?>
					<span><?php echo JText::_('GLOBAL_CONFIGURATION'); ?></span>
					</a>
					</div>
				</div>
				<div style="float:left;">
					<div class="icon">
					<a href="<?php echo $forum;?>">
					<?php echo JHTML::_('image.site','forum_48.png',$url, NULL, NULL, JText::_('FORUM_MANAGER') ); ?>
					<span><?php echo JText::_('FORUM_MANAGER'); ?></span>
					</a>
					</div>
				</div>
				<div style="float:left;">
					<div class="icon">
					<a href="<?php echo $idea;?>">
					<?php echo JHTML::_('image.site','idea_48.png',$url, NULL, NULL, JText::_('IDEA_MANAGER') ); ?>
					<span><?php echo JText::_('IDEA_MANAGER'); ?></span>
					</a>
					</div>
				</div>
				<div style="float:left;">
					<div class="icon">
					<a href="<?php echo $permission;?>">
					<?php echo JHTML::_('image.site','permission_48.png',$url, NULL, NULL, JText::_('PERMISSION') ); ?>
					<span><?php echo JText::_('PERMISSION'); ?></span>
					</a>
					</div>
				</div>
				<div style="float:left;">
					<div class="icon">
					<a href="<?php echo $export_import;?>">
					<?php echo JHTML::_('image.site','import_48.png',$url, NULL, NULL, JText::_('EXPORT_SLASH_IMPORT') ); ?>
					<span><?php echo JText::_('EXPORT_SLASH_IMPORT'); ?></span>
					</a>
					</div>
				</div>
				<div style="float:left;">
					<div class="icon">
					<a href="<?php echo $vote;?>">
					<?php echo JHTML::_('image.site','vote_48.png',$url, NULL, NULL, JText::_('VOTE') ); ?>
					<span><?php echo JText::_('VOTE'); ?></span>
					</a>
					</div>
				</div>
				<div style="float:left;">
					<div class="icon">
					<a href="<?php echo $upgrade;?>">
					<?php echo JHTML::_('image.site','support_48.png',$url, NULL, NULL, JText::_('SUPPORT') ); ?>
					<span><?php echo JText::_('SUPPORT'); ?></span>
					</a>
					</div>
				</div>
				<div style="float:left;">
					<div class="icon">
					<a href="<?php echo $langs;?>">
					<?php echo JHTML::_('image.site','langs_48.png',$url, NULL, NULL, JText::_('LANGUAGES') ); ?>
					<span><?php echo JText::_('LANGUAGES'); ?></span>
					</a>
					</div>
				</div>
<!--
				<div style="float:left;">
					<div class="icon">
					<a href="<?php echo $report;?>">
					<?php echo JHTML::_('image.site','report_48.png',$url, NULL, NULL, JText::_('REPORTS') ); ?>
					<span><?php echo JText::_('REPORTS'); ?></span>
					</a>
					</div>
				</div>
-->
				<div style="float:left;">
					<div class="icon">
						<a href="<?php echo $themes;?>">
							<?php echo JHTML::_('image.site','theme_48.png',$url, NULL, NULL, JText::_('THEMES') ); ?>
							<span><?php echo JText::_('THEMES'); ?></span></a>
					</div>
				</div>
			</div>
		</td>
		<td width="45%" valign="top">
		<?php 
			$pane = &JPane::getInstance('sliders', array('allowAllClose' => true));
			echo $pane->startPane("content-pane");
			
			// load Information module
			echo $pane->startPanel(JText::_('FOOBLA_SUGGESTION'), 'cpanel-panel-info');
			echo $this->loadTemplate('info');
			echo $pane->endPanel();
					
			echo $pane->endPane();
							
		?>
		
		</td>
	</tr>
	</table>
	
