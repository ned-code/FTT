<?php
/**
 * @version		$Id: default_new.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>
<script type="text/javascript">
function addIdea(){		
	var title = document.NewIdea.title.value;
	var fulltext = document.NewIdea.fulltext.value;
	var url = "index.php?option=com_obsuggest&controller=idea&task=addIdea&title="+title+"&content="+fulltext;		
	sendData(url,'newform');
	btnBackTopIdeas_click();
}


</script>
<div id="newform">
<form name="NewIdea" action="#" method="POST">
	<table class="addIdea"  cellpadding=0 cellspacing=0>
		<tr>
			<td colspan="2" onclick="closeForm('newform')" class="idea_top">
				:: <?php echo JText::_("NEW_IDEA")?> ::
				<img src="../../images/cancel.png"/>
				<div id="imgclose"></div>
			</td>
		</tr>
		<tr>
			<td>
				<div id="idea_title">
					<p><?php echo JText::_("Title")?></p>
					<input class="textinput" type="text" name="title"/>
					<br><br>
					<p><?php echo JText::_("Description")?></p>
					<textarea name="fulltext"></textarea>
					<br><br>
					<input class="button" type="button" onclick="addIdea()" value="<?php echo JText::_("Save")?>"/>
				</div>
			</td>
		</tr>
	</table>
</form>
</div>
