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
$script_display_panel_vote = ( $can_vote ) ? "displayPanelVote('btn_vote_".$idea->id."'); return false;" : "return false;";
?>
<div class="box_vote_blue">
	<div class="sum_vote">
		<span id="sum_vote_<?php echo $idea->id?>"><?php echo Number::getShortNumber($idea->votes); ?></span>
	</div>
	<div class="user_vote">
		<div id="user_vote_<?php echo $idea->id; ?>"><?php echo ($user_vote) ? $user_vote : JText::_("VOTE"); ?></div>
	</div>
	<div class="btn_vote_wrap">
		<div class="btn_vote" id="btn_vote_<?php echo $idea->id; ?>" onclick="<?php echo $script_display_panel_vote; ?>"><?php echo JText::_('VOTE');?></div>
	</div>
	<div class="form_list_vote_point" id="form_list_vote_point">
		<div></div>
	</div>

	<div id="<?php echo 'panel_btn_vote_'.$idea->id;; ?>" class="panel_votes" class="display_none">
		<div class="panel_bnt_vote_title"><?php echo JText::_('Vote'); ?></div>
		<div class="panel_bnt_vote_body">
			<div class="votes_remaining_message">You have <span class="votes_remaining_num"><?php echo $this->remainingpoint; ?></span> votes remaining</div>
			<div class="wraper_list_vote_point">
				<ul class="list_vote_point" id="list_vote_point_<?php echo $idea->id; ?>">
				<?php 
					foreach ($listVote as $objVote) { 
						$script = ($can_vote)? 'update_vote_uservoice( '.$idea->id.', '.$objVote->vote_value.'); return false;': 'return false;';
						$disable_point 	= ( ( $user_vote == $objVote->vote_value ) || ($this->remainingpoint < $objVote->vote_value) ) ? 'disable_point':'';
						$hidden_point 	= ( !$user_vote && !$objVote->vote_value ) ? 'hidden_point':''; 
				?>
					<li id="<?php echo 'list_vote_point_'.$idea->id.'_'.$objVote->vote_value;?>" <?php echo ($disable_point || $hidden_point)?' class="'.$disable_point.' '.$hidden_point.'" ':''; ?>>
						<?php //echo 'remainingpoint: '.$this->remainingpoint.'<br/>Disablepoint: '.$disable_point.'<br/>Hiddenpoint: '.$hidden_point;?>
						<span class="updatevote" onclick="<?php echo $script; ?>"><?php echo $objVote->vote_value; ?> <?php echo ($objVote->title)? $objVote->title : JText::_('VOTE');?></span></li>
				<?php 
					}?>
				</ul>
			</div>
			<div class="clear_both"></div>
		</div>
	</div>
</div>