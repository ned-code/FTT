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
<?php if(0>1): ?>
<div id="jmb_header_body">
	<table>
		<tr>
			<td><div id="jmb_header_logo">Family Tree Top</div></td>
			<?php if($in_system) : ?>
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
<?php endif; ?>
<div class="jmb_header_body">
	<table>
		<tr>
			<!-- Title -->
			<td><div class="jmb_header_logo">Family Tree Top</div></td>
			<?php if($in_system): ?>
			<!-- Family Line -->
			<td>
				<div class="jmb_header_fam_line">
					<font class="jmb_line_title">Family Line:</font>
					<span id="father" class="jmb_line_left active">My Mother</span>
					<span id="mother" class="jmb_line_right">My Father</span>
				</div>
			</td>
			<!-- Profile Line -->
			<td>
				<div class="jmb_header_settings">	
					<?php if($inIFrame): ?>
						<div class ="embedded">
							<div class="myfamily">My Family</div>
							<div id="<?php echo $user_profile['id']; ?>" class="myprofile">My Profile</div>
						</div>
					<?php else: ?>
						<div class="expanded">
							<table>
								<tr>
									<td>
										<div class="name"><?php echo $user_profile['name']; ?></div>
										<div class="menu">
											<span id="<?php echo $user_profile['id']; ?>" class="myprofile">My Profile</span>
											<span class="myfamily">myFamily</span>
											<span class="logout">Logout</span>
										</div>
									</td>
									<td>
										<div class="avatar"><img src="<?php echo $avatar; ?>" width="50px" height="45px"></div>
									</td>
								</tr>
							</table>
						</div>
					<?php endif; ?>
				</div>
			</td>
			<?php endif; ?>
			<!-- Expand Button -->
			<td>
				<div class="jmb_header_expand">
					<a href="<?php echo $aHref; ?>" target="_top">
						<img src="<?php echo $baseUrl; ?>templates/fmb/images/<?php echo $imgName; ?>?111" width="32px" height="32px">
					</a>
				</div>
			</td>
		</tr>
	</table>
</div>
