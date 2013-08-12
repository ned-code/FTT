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
?>
				<div class="box-vote">
					<div class="sum" id="sum_vote_<?php echo $idea->id?>" style="text-align:center;">
						<?php echo Number::createNumber($idea->votes); ?>
					</div>
					<div class="uservote" style="text-align:center;">
						<div style="width:55px;height:20px;margin:0 auto;">
							<div style="float:left;width:20px;height:20px;text-align:left;cursor:pointer;" <?php echo ($can_vote)?'onclick="Vote.up(\''.$idea->id.'\')"':''; ?>>
								<?php
								if ($can_vote) { ?>
									<div id="left_number_<?echo $idea->id; ?>" class="pre-number<?php if($user_vote==0) echo " is-min";?>"></div>
								<?php
								} else { ?>
									<div class="pre-number disabled"></div>
								<?php
								} ?>
							</div>
							<div id="user_vote_<?php echo $idea->id; ?>" class="number" style="width:15px;height:20px;overflow:hidden;float:left;">
							<?php
								$str 		= "";
								$vote_value = 0;
								$j			=0;
								$end_vote 	= 0;
								foreach ($listVote as $objVote) {
									if($objVote->vote_value!=$user_vote) {
										$j++;
									} else { 
										$vote_value = $j;
									}
									$end_vote 	= $objVote->vote_value;
									$str 		.= '<span class="num'.$objVote->vote_value.'" >';
									$str 		.= '<input id="vote_value_'.$idea->id."_".$objVote->vote_value.'" type="hidden" value="'.$objVote->vote_value.'">';
									$str 		.= '</span>';
								}
								$str = '<div style="margin-top:-'.($vote_value*20).'px;">' . $str . '</div>';
								echo $str;

							?>
							</div>
							<div style="float:left;width:20px;height:20px;text-align:right;cursor:pointer;" <?php echo ($can_vote)? 'onclick="Vote.down(\''.$idea->id.'\')"' : ''; ?>>
								<?php if ( $can_vote ) { ?>
									<div id="next_number_<?php echo $idea->id; ?>" class="next-number<?php echo ($user_vote==$end_vote)? " is-max":""; ?>"></div>
								<?php } else { ?>
									<div class="next-number disabled"></div>
								<?php } ?>	
							</div>
						</div>
					</div>
				</div>