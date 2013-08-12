<?php
/**
 * @version		$Id: default_search.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>
<div>
	<div class="rsSearch"><?php echo JText::_("Vote for one of these?")?>
	<font style="font-size:8px; color:#bbb;">........ <strong style="font-size:11px"><?php echo JText::_("or")?></strong></font></div>
	<?php if ($this->output->permission->new_idea_a == 1) {?>
	<div class="rsSearch" onclick='document.getElementById("frm_New").href+="&idea_title="+document.getElementById("key_search").value; newForm()' style="cursor:pointer;"><a>........<?php echo JText::_("CREATE_NEW_IDEA")?></a>			
	<!--<a id="frm_New" href="index.php?option=com_obsuggest&controller=idea&task=dispNewForm&format=raw" rel="{handler: 'iframe',size: {x: 540, y: 400}}" style="background-color: #FFF;"></a>-->					 				
	</div>
	<?php }?>
	<div class="rsSearch"><font style="font-size:8px; color:#bbb;">......................</font></div>
	<div class="rsSearch"><a href="#" style="font-weight:bold;" onclick='btnBackTopIdeas_click(<?php echo $this->forum_id;?>)'><?php echo JText::_("Back to Top Ideas")?></a></div>
</div>
<div style="clear:both;"></div>