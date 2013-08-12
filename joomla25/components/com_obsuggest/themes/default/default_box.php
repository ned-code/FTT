<div id="idea_info_<?php echo $idea->id;?>" class="box-idea">
		<div class="idea_col_left">
			<!-- IDEA BOXVOTE -->
			<?php echo $this->displayBox("BOXVOTE"); ?>
			<!-- END: IDEA BOXVOTE -->
		</div>
		<div class="idea_col_right">
			<div class="idea_col_right_fe">
				<!-- title -->
				<?php echo $this->displayBox("TITLE"); ?>
				<!-- end: title -->
				<!-- change status -->
				<?php echo $this->displayBox("CHANGESTATUS"); ?>
				<!-- end: change status -->
			</div>
			<!-- idea content -->
			<div class="idea_content">
				<?php echo $this->displayBox("CONTENT"); ?>
			</div>
			<!-- end: idea content -->
			
			<div class="idea_readmore">
				<?php echo $this->displayBox("READMORE"); ?>
			</div>
		</div> 
		<div class="clear_both"></div>
		<!-- <div style="clear: both;"> -->
			<!-- COMMENT -->
			<div class="idea_comment_count">
				<?php echo $this->displayBox("COMMENTCOUNT"); ?>
			</div>
			<div class="idea_info_bar">
				<!-- created date -->
				<div class="idea_datecreated">
				<?php echo $this->displayBox("DATECREATED"); ?>
				</div>
				<!-- end: created date -->
				<!-- author -->
				<div class="ideas_username createdby">&nbsp;<?php 
					echo $this->displayBox("USERNAME"); ?>
				</div>
				<!-- end: author -->
				<!-- actions -->
				<div class="idea_actions">
					<?php echo $this->displayBox("ACTIONS"); ?>
				</div>
				<!-- end: actions -->
			</div>
		<!-- </div> -->
		<div class="comments_n_idea_info_bar">
		
		</div>

		<div>
			<div class="idea_boxvote">

			</div>

			<div class="clear_both"> </div>
		</div>

		<div>
			<div class="idea_response">
				<?php echo $this->displayBox("RESPONSE"); ?>
			</div>
			<div class="clear_both"> </div>
		</div>
		<div>
			<div class="clear_both"> </div>
		</div>
	</div>