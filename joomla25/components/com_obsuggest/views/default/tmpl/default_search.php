<?php
/**
 * @version		$Id: default_search.php 274 2011-03-31 08:33:15Z phonglq $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );
global $mainframe, $option, $obIsJ15;

$document = JFactory::getDocument();
if(!$obIsJ15){
	$document->addScript(JURI::base() . "components/$option/assets/js/search16.js");
} else {
	$document->addScript(JURI::base() . "components/$option/assets/js/search.js");
}
?>
<div id="searchBox">
	<div id="searchBox_fel">
		<?php echo $this->output->forum->prompt;?>
	</div>
	<div class="box-search">
		<div class="box_search_div_1">
			<input type="text" id="key_search" value='<?php echo $this->getKeySearch();?>' onfocus="this.cache = this.value;this.value=''" onkeyup="this.cache=this.value;" onblur="this.value=this.cache;">
		</div>
		<div class="box_search_div_2">
<!-- 			<input type="button" value="Search" id="button_search"> -->
			<input type="image" src="<?php echo JURI::root().'components/'.$option.'/themes/default/images/search-button.png'; ?>" alt="Search" id="button_search" />
		</div>	
	</div>
	<div class="clear_both"></div>
	<div id="falcon_container">
		<div id="falcon_result">
			<div>
				<div id="idea_result"></div>		
			</div>
			<div id="search_control" class="search-control">
				<a class="down" onclick="Search.down()"></a>
				<a class="up" onclick="Search.up()"></a>
			</div>
			<?php if (($this->output->permission->new_idea_a == 1)) {?>
			<div class="idea-create-new" onclick='document.getElementById("frm_New").href+="&forum_id="+document.getElementById("forumId").value+"&idea_title="+document.getElementById("key_search").value; newForm("frm_New")'>
				<a><?php echo JText::_("CREATE_NEW_IDEA")?></a>	
				<a id="frm_New" href="index.php?option=com_obsuggest&controller=idea&task=dispNewForm&format=raw" rel="{handler: 'iframe',size: {x: 540, y: 400}}">
				</a>
			</div>
			<?php
			}else echo JText::_('<div style="float:left;padding:0px 3px;">YOU_CANNOT_CREATE_NEW_IDEA!</div>');
			?>
			<div class="close-falcon" onclick="Search.displayFalcon(false)" title="Close">Close</div>
		</div>	
	</div>
</div>
<script>
window.addEvent("domready",
	function()
	{
		
		Search.init();
		//Search.startSearch('idea')
	}
)
</script>

<div class="clear_both"></div>