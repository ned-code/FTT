<?php
/**
 * @version		$Id: default_edit.php 252 2011-03-28 08:29:50Z phonglq $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );
global $obIsJ15; 

?>
<style>
#editform{
	background-color: #fff;
	width: 410px;
	border: 1px solid #135cae;
}
#editform div.idea_top{
	background-color: #5690de;
	height: 25px;
	font-size: 14px;
	color: #fff;
	font-weight: bold;
	text-align:left;
	font-family: Arial;
	line-height:25px;
	width:100%;
}
#editform div.idea_content{
	padding:10px;
}
#idea_title {
	padding:0px;
}
#idea_title p, #idea_title .button{
	color:#0066cc;
	font-size: 12px;
	font-weight:bold;
}
#idea_title .textinput {
	width:100%;
	font-weight:bold;
	font-size: 13px;
	border:1px solid #5690de;
	color:#4c4d4d;
}
#idea_title textarea {
	width: 100%;
	height: 100px;
	color:#4c4d4d;
	font-size: 12px;
	border:1px solid #5690de;
}
#log_res {
	overflow: auto;
}
 
#log_res.ajax-loading {	
	height: 25px;
	background: url(http://demos111.mootools.net/demos/Group/spinner.gif) no-repeat left;
}


</style>

<?php 

$str_new_ajax 		= 'var req = new Ajax(url,{';
$str_ajax_request 	= '}).request();';
$js_mootools_url = JURI::base().'media/system/js/mootools.js';
if ( !$obIsJ15  ) {
	$str_new_ajax 		= "var req = new Request({'url':url,";
	$str_ajax_request 	= '}).send();';
	$js_mootools_url 	= JURI::base().'media/system/js/mootools-core.js';
}
?>
<script type="text/javascript" src="<?php echo $js_mootools_url;?>"></script>
<script>
// ^.^ overwrite function isSuccess in mootools
//XHR.implement({
//	isSuccess: function(status){
//		return (((status >= 200) && (status < 300))||(status==404));
//	}	
//});

function sendData(tgUrl) {	
	var url = tgUrl;	
	
}
function updateComment() {
	var fulltext 	= document.EditComment.fulltext.value;
	var id 			= document.getElementById('comment_id').value;
	var url 		= "index.php?option=com_obsuggest&controller=comment&task=updateComment&format=raw&id=" + id + "&content=" + fulltext;
	if( fulltext == '' ) {
		alert('<?php echo JText::_("Enter your comment before save.")?>');
		return false;
		}
	var log = $('log_res').empty().addClass('ajax-loading');
	<?php echo $str_new_ajax; ?>
		method: 'post',
		onComplete: function(txt){
			log.removeClass('ajax-loading');
			var item = window.parent.document.getElementById("comment_content_"+id)
			if(item)
				item.innerHTML = '<div class="content">'+txt+'</div>';
			window.parent.closeSBox();
		}
	<?php echo $str_ajax_request; ?>
//	}).request();
}

function getList() {
	var controller = window.parent.document.getElementById('controller').value;
	if (controller == 'comment'){
		var idea_id = window.parent.document.getElementById('idea_id').value;
		var url = "index.php?option=com_obsuggest&controller=comment&task=getList&format=raw&idea_id="+idea_id;
		<?php echo $str_new_ajax; ?>
			method: 'post',
			onComplete: function(txt){
				//window.parent.document.getElementById('contentComment').innerHTML = txt;
				//window.parent.document.abc();
			}
		<?php echo $str_ajax_request; ?>
	} else if ( controller == 'activity' ) {
		var url="index.php?option=com_obsuggest&controller=comment&format=raw&task=UdelComment&id=";
		<?php echo $str_new_ajax; ?>
			method: 'post',
			onComplete: function(txt){
				//window.parent.document.getElementById('contentComment').innerHTML = txt;
				//window.parent.document.abc();
				//Pagination2(34, 'Pagination2')
			}
		<?php echo $str_ajax_request; ?>
	}
}
</script>
<div id="editform">
	<form name="EditComment" action="#" method="POST">			
		<div class="idea_top">
			<div style="text-align:center;"><?php echo JText::_("Edit Form")?></div>
		</div>
		<div class="idea_content">
			<div id="idea_title">
				<div><p><?php echo JText::_("Comment")?></p></div>
				<div>
					<textarea name="fulltext"><?php echo $this->comments[0]->comment;?></textarea>
				</div>
				<div>
					<input type="button" onclick="updateComment();" value="<?php echo JText::_("Save")?>"/>															
				</div>
				<div id="log_res">
				</div>
			</div>				
		</div>
		<input type="hidden" id="comment_id" value="<?php echo $this->comments[0]->id;?>" />
	
	</form>
</div>
<script>
/*
var bgColor = window.parent.document.body.getStyle("background-color");
$$('#editform').setStyle("border", "1px solid "+bgColor);
$$('div.idea_top').setStyle("background", bgColor);
$$('div.addIdea').setStyle("border", "1px solid "+bgColor);
$$('#editform p').setStyle("color", bgColor);
$$('#editform input').each(
	function(el){el.setStyle("border", "1px solid "+bgColor);}
	)
$$('#editform textarea').each(
	function(el){el.setStyle("border", "1px solid "+bgColor);}
	)
*/
</script>