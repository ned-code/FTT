<?php
/**
 * @version		$Id: default_header.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>
<div>	
	<div class="user">
		<div style="float:left;width:50%;">
			<ul style="float:left;">
				<li><?php echo JText::_("Avatar")?></li>
			</ul>
			<ul style="float:left;">
				<li><div style="font-size:18px;"><b><?php echo $this->user->username;?></b></div></li>
				<li><h4><b></b></h4></li>
			</ul>
		</div>
		<div  style="float:left;">
			<div class="ratingBox" style="text-align:center;">
				<div id="count_idea" style="text-align:center;"><?php echo $this->sumideas;?></div><label><?php echo JText::_("ideas")?></label>
			</div>
			<div class="ratingBox" style="text-align:center;">
				<div style="text-align:center;" id="count_comment"><?php echo $this->sumcomments;?></div><label><?php echo JText::_("comments")?></label>
			</div>
		</div>
	</div>
	<div style="clear:both;"></div>
</div>