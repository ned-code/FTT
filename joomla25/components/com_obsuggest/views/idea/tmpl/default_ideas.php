<?php
/**
 * @version		$Id: default_ideas.php 272 2011-03-31 04:12:52Z phonglq $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>
<script type="text/javascript">
//setInterval('autoclose()',5000);
function autoclose() {
	closeForm('voteform');
	closeForm('statusform');
	clickVote_s = 0;
	outVote_s =0;
}
function outVote() { 
	if (clickVote_s == '1')
		outVote_s = 1;
	else outVote_s = 0;
}
function clickVote(){
	clickVote_s = 1;
}
</script>
<div id="search_idea">
	<?php if ($this->search == 1) {?>
	<div>
		<?php //echo $this->loadTemplate('search'); ?>			
	</div>
	<?php } ?>
	<div id="listidea">
	<?php  
	$this->addTemplatePath(JPATH_COMPONENT.DS."themes".DS."default");
	if(count($this->ideas))	
	{
		$current_idea = -1;
		foreach($this->ideas as $idea) {
			$current_idea++;
			$this->assignRef('current_idea',$current_idea);
			echo $this->loadTemplate("box");
		} 
	}
	else 
	{
		global $mainframe, $option;
		if(JRequest::getString("controller")=="comment")
			$mainframe->redirect(JRoute::_("index.php?option=$option"));
	?>
		<div style="margin:0px 1px 0px 1px;text-align:center;border:1px dotted #999999;background:#ffffcc;"><?php echo JText::_("NO_IDEA_FOUND");?></div>
	<?php
	}
	?>	
	</div>
<input type="hidden" id="count_search_idea" value="<?php echo $this->total;?>">
</div>
<div>
	<div class="pagination"><?php if($this->pagination) echo $this->pagination;?></div>
</div>

<input type="hidden" name="totalRecord" id="totalRecord" value="<?php echo count($this->ideas);?>" />

