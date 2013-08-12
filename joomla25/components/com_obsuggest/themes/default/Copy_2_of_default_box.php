<div id="idea_info_<?php echo $this->getIdeaId();?>" class="box-idea">
	<div style="float:left; padding-right:10px;">
		<div class="idea_boxvote">
			<?php echo $this->displayBox("BOXVOTE")?>
		</div>
		<div class="idea_commentcount">
			<?php echo $this->displayBox("COMMENTCOUNT")?>
		</div>
	</div>
	<div style="margin-left: 100px; position: relative;">
		<div style="float:none" class="idea_title">
			<?php echo $this->displayBox("TITLE")?>
		</div>
		<div style="float:right;position: absolute; top:0px; right:0px;" class="idea_currentstatus">
			<?php echo $this->displayBox("CURRENTSTATUS")?>
		</div>
		<div style="float:none" class="idea_content">
			<?php echo $this->displayBox("CONTENT")?>
		</div>
		<div style="clear:both;"></div>
		
	</div>
	<div>
		<div style="float:left" class="idea_username">
			<?php echo $this->displayBox("USERNAME")?>
		</div>
		<div style="float:right" class="idea_datecreated">
			<?php echo $this->displayBox("DATECREATED")?>
		</div>
		<div style="clear:both;"> </div>
	</div>
	<div>
		
		
		<div style="clear:both;"> </div>
	</div>
	<div>
		<div style="float:left" class="idea_response">
			<?php echo $this->displayBox("RESPONSE")?>
		</div>
		<div style="clear:both;"> </div>
	</div>
	<div>
		
		<div style="float:right" class="idea_readmore">
			<?php echo $this->displayBox("READMORE")?>
		</div>
		<div style="clear:both;"> </div>
	</div>
	<div>
		<div style="float:right" class="idea_changestatus">
			<?php echo $this->displayBox("CHANGESTATUS")?>
		</div>
		<div style="float:right" class="idea_actions">
			<?php echo $this->displayBox("ACTIONS")?>
		</div>
		<div style="clear:both;"> </div>
	</div>
</div>
