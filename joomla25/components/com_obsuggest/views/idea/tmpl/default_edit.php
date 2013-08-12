<?php
/**
 * @version		$Id: default_edit.php 254 2011-03-28 08:30:48Z phonglq $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>
<style>
#newform .addIdea ,#editform .addIdea{
	background-color: #fff;
	/* width: 400px; */
	border: 1px solid #135cae;
}

#newform .idea_top, #editform .idea_top{
	background-color: #5690de;
	height: 25px;
	font-size: 14px;
	color: #fff;
	font-weight: bold;
	text-align:left;
	padding-left:10px;
	font-family: Arial;
	line-height:25px;
}
#idea_title {
	padding:10px;
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
global $mainframe, $option, $obIsJ15;
$str_new_ajax 		= 'var req = new Ajax(url,{';
$str_ajax_request 	= '}).request();';
$js_mootools_url = JURI::base().'media/system/js/mootools.js';
if ( !$obIsJ15 ) {
	$str_new_ajax 		= "var req = new Request({'url':url,";
	$str_ajax_request 	= '}).send();';
	$js_mootools_url 	= JURI::base().'media/system/js/mootools-core.js';
}
?>
<script type="text/javascript" src="<?php echo $js_mootools_url;?>"></script>
<script type="text/javascript">
// ^.^ overwrite function isSuccess in mootools
//XHR.implement({
//	isSuccess: function(status){
//		return (((status >= 200) && (status < 300))||(status==404));
//	}
//});
function sendData(tgUrl) {	
	var url = tgUrl;	
//	var log = $('log_res').empty().addClass('ajax-loading');
	var log = $('log_res').addClass('ajax-loading');
	
	<?php echo $str_new_ajax; ?>
		method: 'post',
		onComplete: function(txt){
			log.removeClass('ajax-loading');
			try {
				var jsresult;
				eval('jsresult ='+txt+';');
				if(jsresult.error){
					alert(jsresult.msg);
				}
			} catch (e) {
				//tunn added 	
				var title = document.EditIdea.title.value;
				var fulltext = document.EditIdea.fulltext.value;
				var id = document.EditIdea.id.value;
				window.parent.document.getElementById('title'+id).innerHTML = title;
				window.parent.document.getElementById('idea'+id).innerHTML = fulltext;
				window.parent.closeSBox();//clickTab();
			}
		}
	<?php echo $str_ajax_request; ?>
}
function updateIdea() {
	var title = document.EditIdea.title.value;
	var fulltext = document.EditIdea.fulltext.value;
	var id = document.EditIdea.id.value;
	var url = "index.php?option=com_obsuggest&controller=idea&task=updateIdea&id="+id+"&title="+title+"&content="+fulltext;		
	if(title=='') {
		alert('<?php echo JText::_("Enter your idea before save.")?>');
			return false;
		}
	sendData(url);	
}

</script>
<div id="editform">
	<form name="EditIdea" action="#" method="POST">
		<div class="addIdea">
			<div onclick="closeForm('editform')" class="idea_top">
				<div style="margin:0 auto;text-align:center;"><?php echo JText::_("Edit Form")?></div>
			</div>
			<div>
				<div id="idea_title">
					<div><p><?php echo JText::_("Title")?></p></div>
					<div>
						<input class="textinput" type="text" name="title" value="<?php echo $this->idea->title;?>"/>
					</div>
					<div><p><?php echo JText::_("Description")?></p></div>
					<div>
						<textarea name="fulltext"><?php echo $this->idea->content;?></textarea>
					</div>
					<div>
						<div style="float:left;">
							<input type="button" onclick="updateIdea();" value="<?php echo JText::_("Save")?>"/>
						</div>
						<div id="log_res" style="float:left;">
						</div>
					</div>
					<div style="clear:both;"></div>
				</div>
			</div>
		</div>	
		<input type="hidden" name="id" id="id" value="<?php echo $this->idea->id; ?>" />
	</form>
</div>
<script>
/*
var bgColor = window.parent.document.body.getStyle("background-color");
$$('#editform').setStyle("border", "0px solid "+bgColor);
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