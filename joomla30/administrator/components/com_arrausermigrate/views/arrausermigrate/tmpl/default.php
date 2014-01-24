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
	$document->addStyleSheet("components/com_arrausermigrate/css/arra_about.css");
	$document->addStyleSheet("components/com_arrausermigrate/css/arra_statistics.css");
	$document->addScript(JURI::base()."components/com_arrausermigrate/includes/js/ajax.js");
?>
<div class="row-fluid adminlist">
<form action="index2.php" method="post" name="adminForm"> 
	<table width="100%">
	    <tr>
		<td width="30%" valign="top" style="padding-top:30px; padding-left:15px;">
				 <!-- image with package with component -->				
				 <a href="http://www.joomlarra.com" title="joomla components" align="center" target="_blank"> <img src="components/com_arrausermigrate/images/logo_arra_user_export.png" alt="ARRA User Export Import" title="ARRA User Export Import" height="168"/> </a>
				 <br/> <br/>				 
				 
				 <img src="components/com_arrausermigrate/images/icons/video.gif" style="vertical-align:top;" alt="video">&nbsp;&nbsp;&nbsp;
				 <a href="http://www.youtube.com/watch?v=_QbNrkXEa5k" target="_blank">Ho to migrate users to J! 3.0</a>				
				
				 <br/> <br/>
				 
				 <img src="components/com_arrausermigrate/images/icons/video.gif" style="vertical-align:top;" alt="video">&nbsp;&nbsp;&nbsp;
				 <a href="http://www.youtube.com/watch?v=TRBd3jsmnAc" target="_blank">How to import Joomla users</a>				
				 
				 <br/> <br/>
				 
				 <img src="components/com_arrausermigrate/images/icons/video.gif" style="vertical-align:top;" alt="video">&nbsp;&nbsp;&nbsp;
				 <a href="http://www.youtube.com/watch?v=LXQCbLA5ue4" target="_blank">How to export Joomla users</a>			
				 
		</td>
		<td width="40%" valign="top" align="center">
		    <table>
			    <tr>
				   <td align="center">
						 <!-- start menu --> 			 
						<a href="index.php?option=com_arrausermigrate&task=export&controller=export">
							<img src="components/com_arrausermigrate/images/icons/export_menu.png"
							alt="Export" align="middle" name="" border="0" title="Arra User Export" />
							<span> <?php echo JText::_('ARRA_USER_EXPORT_MENU'); ?> </span>
						</a>
					</td>
					<td align="center">	
						<a href="index.php?option=com_arrausermigrate&task=import&controller=import">
							<img src="components/com_arrausermigrate/images/icons/import_menu.png"
							alt="Import" align="middle" name="" border="0" title="Arra User Import" />
							<span><?php echo JText::_('ARRA_IMPORT_MENU'); ?></span>
						</a>
					</td>
					<td align="center">	
						<a href="index.php?option=com_arrausermigrate&task=language&controller=language">
							<img src="components/com_arrausermigrate/images/icons/language_menu.png"
							alt="Language" align="middle" name="" border="0" title="Arra User Language"/>
							<span><?php echo JText::_('ARRA_LANGUAGE_MENU'); ?></span>
						</a>
					 </td>	
				</tr>
				<tr>
				    <td colspan="3">
						<p>For any questions please use our forum: <a href="http://www.joomlarra.com/forum" target="_blank">http://www.joomlarra.com/forum</a></p>						
						<p>ARRA User Import Export documentation: <a href="http://www.joomlarra.com/joomla-2.5/3.0-user-migrate-documentation/" title="joomla 3.0 documentation" target="_blank">http://www.joomlarra.com/joomla-2.5/3.0-user-migrate-documentation/</a></p>
						<p>To report bugs use this link: <a href="http://www.joomlarra.com/11-report-bugs/" target="_blank">http://www.joomlarra.com/11-report-bugs/</a></p>
						<p>Feature request link: <a href="http://www.joomlarra.com/12-feature-request/" target="_blank">http://www.joomlarra.com/12-feature-request/</a></p>	
						<p>General Discussions: <a href="http://www.joomlarra.com/13-general-discussions-about-component/" target="_blank">http://www.joomlarra.com/13-general-discussions-about-component/</a></p>	
					</td>
				</tr>
				<tr>
				</tr>								
			</table>	
				 <!-- end menu -->
		</td>
		<td width="30%" valign="top">
				 <!-- start sliders  -->
				 
			<?php
				if(intval(JVERSION) < 3){
					if(!class_exists('JPane')){ 
						include(JPATH_LIBRARIES.DS.'joomla'.DS.'html'.DS.'pane.php');
					}
					jimport( 'joomla.html.pane' );
				}
				else{
					require_once('components/com_arrausermigrate/helpers/panes.php');
				}
				$tabs =& JPane::getInstance('Sliders');
				
				echo $tabs->startPane('Sliders');
				
				echo $tabs->startPanel(JText::_('ARRA_ABOUT'), JText::_('ARRA_ABOUT'));
			?>	
				<div>                     
					<?php echo $this->about; ?>					                   					
			 	</div>
			<?php		   
				echo $tabs->endPanel();	
				// start tab with Users Statistics			
				echo $tabs->startPanel(JText::_('ARRA_STATISTICS'), JText::_('ARRA_STATISTICS'));	
			?>
					<!-- content for Users Statistics tab -->
					<div class="user_statistic">                     
						<?php echo $this->listUsers; ?>										                   					
					</div>							
			<?php   
				echo $tabs->endPanel();					
				echo $tabs->endPane();
			?>
			<!-- stop sliders  -->
		</td>
		</tr>
	</table>
</form>
</div>