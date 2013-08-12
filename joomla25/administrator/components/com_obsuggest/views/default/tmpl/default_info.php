<?php
/**
 * @version		$Id: default_info.php 341 2011-06-04 09:47:01Z phonglq $
 * @package		oblangs - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

require_once( JPATH_COMPONENT.DS.'helpers'.DS.'media.php' );
$checkversion	=	&MediaHelper::getVersion();
$version	=	$checkversion['version'];
?>
<div style="padding: 7px 15px 0;">
	<table class="adminform" border="1">
		<tr>
			<td valign="top"><strong>Installed Version</strong></td>
			<td><strong><?php echo $version; ?></strong> (<a href="index.php?option=com_obsuggest&controller=upgrade">check version</a>)</td>
		</tr>
		
		<tr>
			<td valign="top"><strong>Copyright</strong></td>
			<td>Copyright (C) 2007-2012 <a href="http://foobla.com" target="_blank">foobla.com</a>. All rights reserved.</td>
		</tr>
		
		
		<tr>
			<td valign="top"><strong>License</strong></td>
			<td>GNU/GPL</td>
		</tr>
		
		<tr>
			<td valign="top"><strong>Credits</strong></td>
			<td>
				<ul style="margin: 0; padding-left: 15px;">
					<li><strong>Phong Lo</strong> (developer)</li>
					<li><strong>Thong Tran</strong> (the product manager)</li>
				</ul>
			</td>
		</tr>
	</table>
</div>
