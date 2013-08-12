<?php 
$listVote 	= Idea::getListVotes();
$rs = null;
if(isset($model)) {
	$rs 	= $model->getUserVoteIdea( $idea->id );
} else {
	$rs 	= $this->getUserVoteIdea( $idea->id );
}

$user_vote 	= (isset($rs->vote)) ? $rs->vote : $rs;
$can_vote 	= ( ($this->output->permission->vote_idea_a == 1) || 
				(($this->output->permission->vote_idea_o == 1) &&
				 ($this->output->user->id == $idea->user_id)) ) ;
$script_display_panel_vote = ( $can_vote ) ? "displayPanelVote('bnt_vote_".$idea->id."'); return false;" : "return false;";
?>
<div class="box-votex">
	<div class="points">
		<div class="sum_vote" id="sum_vote_<?php echo $idea->id?>" style="text-align:center;"><?php echo $idea->votes; ?></div>
	</div>
	<div id="<?php echo 'bnt_vote_'.$idea->id; ?>" class="btn_vote">
		<div id="<?php echo 'bnt_vote_'.$idea->id.'_value'; ?>" onclick="<?php echo $script_display_panel_vote; ?>"><?php echo ($user_vote) ? $user_vote : JText::_("VOTE"); ?></div>
	</div>
	<div id="<?php echo 'panel_bnt_vote_'.$idea->id;; ?>" class="panel_votes" style=" display:none; ">
		<div class="panel_bnt_vote_title"><?php echo JText::_('Vote'); ?></div>
		<div class="panel_bnt_vote_body">
			<div class="votes_remaining_message">You have <span class="votes_remaining_num"><?php echo $this->remainingpoint; ?></span> votes remaining</div>
			<div class="wraper_list_vote_point">
				<ul class="list_vote_point">
				<?php 
					foreach ($listVote as $objVote) { 
						$script = ($can_vote)? 'update_vote_uservoice( '.$idea->id.', '.$objVote->vote_value.'); return false;': 'return false;'; 
				?>
					<li><span class="updatevote" onclick="<?php echo $script; ?>"><?php echo $objVote->vote_value; ?> <?php echo ($objVote->title)? $objVote->title : JText::_('VOTE');?></span></li>
				<?php 
					}?>
				</ul>
			</div>
			<div style="clear:both;"></div>
		</div>
	</div>
</div>