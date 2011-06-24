<?php
/**
 * @version		$Id: default.php 20196 2011-01-09 02:40:25Z ian $
 * @package		Joomla.Site
 * @subpackage	mod_login
 * @copyright	Copyright (C) 2005 - 2011 Open Source Matters, Inc. All rights reserved.
 * @license		GNU General Public License version 2 or later; see LICENSE.txt
 */

// no direct access
defined('_JEXEC') or die;
JHtml::_('behavior.keepalive');
?>
<div id="jmb_header_body">
	<table>
		<tr>
			<td><div id="jmb_header_logo">Family Tree Top</div></td>
			<?php if($in_system) : ?>
				<!--<td class="jmb_header_fam_line"><div id="jmb_header_fam_line"><b>Family Line</b>: <span class="jmb_line_left active">My Mother</span><span class="jmb_line_center">My Spouse's Mother</span><span class="jmb_line_right">My Father</span></div></td>-->
				<td class="jmb_header_fam_line"><div id="jmb_header_fam_line"><b>Family Line</b>: <span class="jmb_line_left active" type="mother">My Mother</span><span class="jmb_line_right" type="father">My Father</span></div></td>
				<td><div id="jmb_header_settings"><div>My Family</div><div>My Profile</div></div></td>
			<?php endif; ?>
			<?php if($user_id):?>
				<td class="jmb_header_login"><div id="jmb_header_logout" >&nbsp;</div></td>
			<?php endif; ?>
		</tr>
	</table>
	<div><?php echo $echo; ?></div>
</div>
