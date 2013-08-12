<?php
/**
 * @version		$Id: default_edit.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>
<script type="text/javascript">
function getIdea(id) {		
	var url = 'index.php?option=com_obsuggest&controller=idea&task=getIdea&id='+id+'&format=raw';		
	var request = new Json.Remote(
		url,{			
		onComplete: function(jsonObj) {				
			document.EditIdea.title.value = jsonObj.idea[0].title;
			document.EditIdea.fulltext.value = jsonObj.idea[0].fulltext;				
		}}).send();
}

function updateIdea() {
	var title = document.EditIdea.title.value;
	var fulltext = document.EditIdea.fulltext.value;
	var id = document.EditIdea.id.value;
	var url = "index.php?option=com_obsuggest&controller=idea&task=updateIdea&id="+id+"&title="+title+"&content="+fulltext;		
	alert('updateIdea');
	sendData(url,'editform');
	refreshIdea(id);
}
</script>
<div id="editform">
<form id="EditIdea" name="EditIdea" action="#" method="POST">
	<table class="addIdea"  cellpadding=0 cellspacing=0>
		<tr>
			<td colspan="2" onclick="closeForm('editform')" class="idea_top">
				:: Edit Form ::
			</td>
		</tr>
		<tr>
			<td>
				<div id="idea_title">
					<p>Title</p>
					<input class="textinput" type="text" name="title"/>
					<br><br>
					<p>Description</p>
					<textarea name="fulltext"></textarea>
					<br><br>
					<input class="button" type="button" onclick="updateIdea();" value="Save"/>
				</div>
			</td>
		</tr>
	</table>
	<input type="hidden" name="id" value="0" />
</form>
</div>
