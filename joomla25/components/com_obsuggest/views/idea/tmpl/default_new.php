<?php
/**
 * @version		$Id: default_new.php 253 2011-03-28 08:30:03Z phonglq $
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
	<?php echo $str_new_ajax; ?>
		method: 'post',
		onComplete: function(txt){
			try {
				var jsresult;
				eval('jsresult ='+txt+';');
				if(jsresult.error){
					alert(jsresult.msg);
				}
			} catch (e) {
				window.parent.btnBackTopIdeas_click();
				window.parent.closeSBox();
			}
		}
	<?php echo $str_ajax_request; ?>
}
function addIdea(){			
	var forum_id = window.parent.getForumId();
	var title = document.NewIdea.title.value;
	var fulltext = document.NewIdea.fulltext.value;	
	var url = "index.php?option=com_obsuggest&controller=idea&task=addIdea&title="+title+"&content="+fulltext+"&forum_id="+forum_id;		
	if(title=='') {
		alert('<?php echo JText::_("Enter your idea before save.")?>');
		return false;
		}
	sendData(url);	
}

</script>
<form name="NewIdea" action="#" method="POST">
	<div id="newform">
		<div class="addIdea">
			<div class="idea_top">
				<?php echo JText::_("NEW_IDEA")?>				
			</div>
			<div>
				<div id="idea_title">
					<div>
						<div><p><?php echo JText::_("Title")?></p></div>
						<div><input class="textinput" type="text" name="title" value="<?php echo $this->idea_title?>" /></div>
						<div><p><?php echo JText::_("Description")?></p></div>
						<div><textarea name="fulltext"></textarea></div>
						<div>
							<div style="float:leftl">
								<input type="button" onclick="addIdea()" value="<?php echo JText::_("Save")?>"/>															
							</div>
						</div>
						<div style="clear:both;"></div>
					</div>
				</div>		
			</div>
		</div>	
	</div>
</form>
<script>
/*
var bgColor = window.parent.document.body.getStyle("background-color");
$('newform').setStyle("border", "1px solid "+bgColor);
$$('div.idea_top').setStyle("background", bgColor);
$$('div.addIdea').setStyle("border", "1px solid "+bgColor);
$$('#newform p').getLast().setStyle("color", bgColor);
$$('#newform input').each(
	function(el){el.setStyle("border", "1px solid "+bgColor);}
	)
$$('#newform textarea').each(
	function(el){el.setStyle("border", "1px solid "+bgColor);}
	)
*/
</script>