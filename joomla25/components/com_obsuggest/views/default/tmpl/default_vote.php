<?php
/**
 * @version		$Id: default_vote.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>
<script type="text/javascript">
	//default.js
</script>
<?php require_once(JPATH_COMPONENT.DS."helper".DS."idea.php");?>
<div id="voteform" class="invisible_form">
	<form name="VoteForm" action="#" method="POST">
		<div>
			<div class="howvote">
				<?php echo JText::_("How many votes?")?>
			</div>		
			<div style="height:7px;background-color:#fff;"></div>
			<div class="howvotes" >
			<?php
				$listVotes = Idea::getListVotes();
				if(count($listVotes)) {
					foreach ($listVotes as $valVote) {
			?>
				<a href="javascript:void(0);" onclick="javascript:sendVote(<?php echo $valVote->vote_value;?>);closeForm('voteform');" style="font-weight:bold;"><?php echo $valVote->vote_value;?></a>
			<?php 	}
				}?>							
			</div>
			<div style="height:7px;background-color:#fff;"></div>
		</div>
	</form>
</div>