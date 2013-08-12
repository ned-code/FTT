<?php
/**
 * @version		$Id: default.php 341 2011-06-04 09:47:01Z phonglq $
 * @package		oblangs - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );
global $option, $obIsJ15;
$option='com_obsuggest';
defined ('_JEXEC') or die('Restricted Access');
jimport('joomla.html.pane');
$isOldVer	= $this->isOldVer;
$upgLnk	= "index.php?option=$option&controller=upgrade&task=";
JHTMLBehavior::modal();
$doc = JFactory::getDocument();
$doc->addStyleSheet(JURI::base() . "components/com_obsuggest/assets/jlord_core.css");
$doc->addScript(JURI::base() . "components/com_obsuggest/assets/jlord_core.js");

?>
<style>
div.current input, div.current textarea, div.current select {
	clear: none;
	float: none;
	margin: 3px 0px 0px 2px;
}
</style>
<script type="text/javascript">
	Joomla.submitbutton = function( pressbutton ){		
		if (pressbutton == 'cancel') {	
			var url = location.pathname+location.search;
			url = url.replace('&controller=upgrade','');	
			document.location = url;
		}
	}
	
</script>
<script type="text/javascript">
var JForm = new Class({
	id: null,
	element: null,
	isShow: false,
	options:{
		width: 400,
		height: 280,
		showComplete: function(){},
		hideComplete: function(){}
	},
	initialize: function(id, options){
		this.setOptions(options);
		this.id = id;
		this.element = $(id);
		this.overlay = new Element("div", {
			'styles': {
				'width': this.options.width+'px',
				'height': this.options.height+'px',
				'opacity': 0.3,
				'position': 'relative',
				'background-color': '#acacac',
				'z-index': 100,
				'top': (-this.options.height)+'px',
				'display': 'none'
			}
		}).inject(this.element);
		this.isShow = false;
	},
	disable: function(v){
		v = (v == true ? 'block' : 'none');
		this.overlay.setStyles({'display': v});
	},
	show: function(){
		if(this.isShow) return;
		var _this = this;
		this.isShow = true;
		this.element.setStyles({'display': 'block'}).
		fx.start({
			'left': (this.position.x-this.options.width/2)+'px',
			'top': (this.position.y-this.options.height/2)+'px',
			'height': this.options.height+'px',
			'width': this.options.width+'px',
			'opacity': 1.0
		}).chain(function(){
			_this.element.getElement("div.content").setStyles({'display': 'block'});
			_this.options.showComplete();
		});	
	},
	hide: function(){
		if(!this.isShow) return;
		var _this = this;
		this.isShow = false;
		_this.element.getElement("div.content").setStyles({'display': 'none'});		
		_this.overlay.setStyles({'display': 'none'});
		this.element.fx.start({
			'left': '0px',//(this.position.x)+'px',
			'top': '0px',//(this.position.y)+'px',
			'height': '0px',
			'width': '0px',
			'opacity': 0.1
		}).chain(function(){
			this.element.setStyles({'display': 'none'});
			_this.options.hideComplete();
		});
	}
});
// implement from Options Object
JForm.implement(new Options);

var jticket = null, jfeedback = null;
window.addEvent("domready", function(){
	jticket		= new JForm('form_quick_ticket', {
					showComplete: function(){
						$('form_quick_ticket').getElement("input.summary").focus();						
					}
				});
	jfeedback 	= new JForm('form_feedback', {
					showComplete: function(){
						$('form_feedback').getElement("input.summary").focus();
							
					}
				});
});

function sendMail(t){
	var url = "index.php?option=com_obsuggest&controller=upgrade&task=sendMail&format=raw";
	
	var subject = '', message = '', element = null, form = null ;
	url += '&t='+t;
		
	switch(t){
		case 'ticket':
			element = $("form_quick_ticket");	
			
			form = jticket;		
			break;
		case 'feedback':
			element = $("form_feedback");	
			
			form = jfeedback;
			break;	
	}
	subject = element.getElement("input.summary");
	message = element.getElement("textarea.description");
	
	if(subject.value == ''){
		alert('<?php echo JText::_('Please input your subject first');?>');
		subject.focus();
		return;
	}
	if(message.value == ''){
		alert('<?php echo JText::_('Please input your subject first');?>');
		message.focus();
		return;
	}
	var msg = message.value;
	while(msg.indexOf("\n")!=-1) msg = msg.replace(/\n/, "[br /]");
	url += "&from=" + element.getElement("input.e-mail").value;
	url += "&s=" 	+ subject.value;
	url += '&m=' 	+ msg;
		
	element.getElement("span.message").innerHTML = '<?php echo JText::_("Sending");?>...';
	element.getElement("button.send").disabled = element.getElement("button.clear").disabled = true;
<?php 
if(!$obIsJ15){ ?>
	new Request.HTML({url: url,
<?php
	$request = '}).send()';
} else {
	$request = '}).request();';
?>
	new Ajax(url, {
<?php 
}
?>
		method: 'get',
		onComplete: function(msg) {	
			//form.disable(false);
			element.getElement("button.send").disabled = element.getElement("button.clear").disabled = false;
			
			if(msg!=1){
				element.getElement("span.message").innerHTML = msg;						
				return;
			}
			if(t == 'ticket'){
//				element.getElement("span.message").innerHTML = '<?php echo JText::_("Thank you! Your ticket has been sent");?>';
				document.getElementById('message_ticket').innerHTML = '<?php echo JText::_("Thank you! Your ticket has been sent");?>';
				subject.value = message.value = '';	
				subject.focus();		
				return;
				if(element.getElement("input.auto-close").checked){
					(function(){
						jticket.hide();
						document.getElementById('message_ticket').innerHTML = '';
						subject.value = '';
						message.value = '';
					}).delay(2000);
				}
			}else if(t == 'feedback'){
//				element.getElement("span.message").innerHTML = '<?php echo JText::_("Thank you! Your feedback has been sent");?>';
				document.getElementById('message_feedback').innerHTML = '<?php echo JText::_("Thank you! Your feedback has been sent");?>';
				subject.value = message.value = '';
				subject.focus();
				return;
				if(element.getElement("input.auto-close").checked){
					(function(){
						jfeedback.hide();
						element.getElement("span.message").innerHTML = '';
						subject.value = '';
						message.value = '';
					}).delay(2000);	
				}	
			}	
			
		}	
	<?php echo $request; ?>
}
window.addEvent("domready", function(){
	
	$('clear_ticket').addEvents({
		click: function(){
			if(!confirm("<?php echo JText::_('Are you sure');?>?")) return;
			var element = $("form_quick_ticket");
			element.getElement("input.summary").value = element.getElement("textarea.description").value = '';
		}
	});
	$('clear_feedback').addEvents({
		click: function(){
			if(!confirm("<?php echo JText::_('Are you sure?');?>")) return;
			var element = $("form_feedback");
			element.getElement("input.summary").value = element.getElement("textarea.description").value = '';
		}
	});	
});
</script>
<div id="someinfo">

</div>
<div class="col width-40" style="float:left;">
	<fieldset class="adminform">
		<legend><?php echo JText::_("Support Information");?> </legend>
		<div style="padding: 10px; min-height: 90px;">
			<p><?php echo JText::_("YOU_ARE_USING_oblangs_BY");?> <a href="http://foobla.com" target="_blank"><span style="color: #ffde00; background: #0099d9; font-weight: bold;">foo</span><span style="color: #0099d9; background: #ffde00; font-weight: bold;">bla</span></a></p>
			<ul>
				<li><?php echo JText::sprintf("For more information, please visit : %s product page",'<a href="http://foobla.com">oblangs</a>');?></li>
				<li>FAQs: <a href="http://foob.la/faqs" target="_blank">http://foob.la/faqs</a></li>
			</ul>
			<!-- temporary hide this section 
			<p style="font-weight: bold;">
				<?php echo JText::_("Want the extension better");?>
				<br />
				<?php echo JText::sprintf("Please consider to support it by %s leaving a review & vote %s on JED", '<a href="http://extensions.joomla.org/extensions/external-contents/news-a-feeds/automatic-articles/11403#action" target="_blank">','</a>');?>.
			</p>
			-->					
		</div>
	</fieldset>
		
	<div style="padding: 0 10px 10px 10px;">
		<?php $pane = JPane::getInstance("Tabs");?>					
		<?php
			echo $pane->startPane("ticket_feedback");
			echo $pane->startPanel("Submit a Support Ticket", "ticket");
			$jp 	= JComponentHelper::getParams('com_obsuggest');
			$db 	= &JFactory::getDBO();
			$email 	= $jp->get('default_email');
			
			$href='index.php?option=com_config&controller=component&component=com_obsuggest&e[]=quick_ticket_email&e[]=feed_back_email';
			if( !$obIsJ15 ){
				$href='index.php?option=com_config&view=component&component=com_obsuggest&path=&tmpl=component&e[]=quick_ticket_email&e[]=feed_back_email';
			}
		?>
				<div id="form_quick_ticket" class="jform obsupport">
					<div style="margin:5px;" class="content">
						<span class="title"><?php echo JText::_("ABOUT_TICKET_SUPPORT_TITLE");?></span><br />
						<p class="obDesc"><?php echo JText::_("SEND_SUPPORT_TICKET_DESC"); ?></p>
						<span class="obTitle"><?php echo JText::_("YOUR_E_MAIL");?> (*)</span>
						<br />
						<input type="text" value="<?php echo $email; ?>" class="e-mail" id="quick_ticket_email" readonly="readonly" />	
						<a href="<?php echo $href; ?>" rel="{handler: 'iframe', size: {x: 700, y: 300}}" class="modal" >
						<?php echo JText::_("CHANGE_DEFAULT_E_MAIL");?>
						</a>
						<br />
						<span class="obTitle"><?php echo JText::_("Subject");?> (*)</span>
						<br />
						<input type="text" value="" class="summary" />		
						<br />
						<span class="obTitle">
							<?php echo JText::_("Content").' (*)';?>
						</span>	 
						<br />
						<textarea rows="10" cols="30" class="description"></textarea><br />
						<input type="checkbox" checked="checked" class="auto-close"  style="display:none;" />
						<?php //echo JText::_("Close this box when ticket has been send");?>
						<div style="text-align:right;">
						<p style="color: red; font-style: italic;"><?php echo JText::_("ABOUT_FORM_NOTICE"); ?></p>
							<span class="message" id="message_ticket"></span>
							<button onclick="sendMail('ticket');" class="send"><?php echo JText::_("Send");?></button>
							<button id="clear_ticket" class="clear"><?php echo JText::_("Clear");?></button>
							<!--<button onclick="jticket.hide();"><?php echo JText::_("Close");?></button>-->
						</div>
					</div>		
				</div>
				<?php
			echo $pane->endPanel();
			echo $pane->startPanel("Tell Us Your Needs", "feedback");
		?>
				<div id="form_feedback" class="jform oblangs">
					<div style="margin:5px;"  class="content">
						<span class="title"><?php echo JText::_("ABOUT_FEEDBACK_TITLE");?></span><br />
						<p class="obDesc"><?php echo JText::_("SEND_FEEDBACK_DESC"); ?></p>
						<span class="obTitle"><?php echo JText::_("YOUR_E_MAIL");?> (*)</span>
						<br />
						<input type="text" value="<?php echo $email ?>" class="e-mail" id="feed_back_email" readonly="readonly" />  
						<a href="index.php?option=com_config&controller=component&component=com_obsuggest&e[]=quick_ticket_email&e[]=feed_back_email" rel="{handler: 'iframe', size: {x: 700, y: 300}}" class="modal" >
						<?php echo JText::_("CHANGE_DEFAULT_E_MAIL");?>
						</a>	  
						<br />
						<span class="obTitle"><?php echo JText::_("Subject");?> (*)</span><br />
						<input type="text" value="" class="summary" />		
						<br />		
						<span class="obTitle">
							<?php echo JText::_("Content");?> (*)
						</span><br />
						<textarea rows="10" cols="30" class="description"></textarea><br />
						<input type="checkbox" checked="checked" name="auto-close" style="display:none;" />
						<?php //echo JText::_("Close this box when Feedback/Suggestion has been send");?>
						<div style="text-align:right;">
						<p style="color: red; font-style: italic;"><?php echo JText::_("ABOUT_FORM_NOTICE"); ?></p>
							<span class="message" id="message_feedback"></span>
							<button onclick="sendMail('feedback');" class="send"><?php echo JText::_("Send");?></button>
							<button id="clear_feedback" class="clear"><?php echo JText::_("Clear");?></button>
							<!--<button onclick="jfeedback.hide();"><?php echo JText::_("Close");?></button>-->
						</div>
					</div>		
				</div>
				<?php	
			echo $pane->endPanel();
		echo $pane->endPane();
		?>
	</div>
</div>	
<div class="col width-60" style="float:left;">
	<fieldset class="adminform">
		<legend>Version</legend>
		<div style="padding: 10px;">
			<p>Current : <b style="color:#444;"><?php echo JRequest::getVar('curVer','');?> 
			<?php
			if ($isOldVer) {
				echo ' <span style="color:red;padding-left:10px;"><blink> [ '.JText::_("YOU_ARE_USING_OUT_OF_DATE_VERSION").'! ] </blink></span></b></p>';
				$lastestVer	= JRequest::getVar('lastestver','');
				echo $lastestVer?'<p>Lastest : <span style="color:#00aa00"><b>'.$lastestVer.'</b></span></p>':'';
			} else {
				if(JRequest::getVar('notCheck',false)){
					$msg	= JText::_('NOT_ELIGIBLE_TO_CHECK_VERSION');
					$tColor	= 'ff4400';
				}else {
					$msg = JText::_('CONGRATS_YOU_ARE_USING_LATEST_VERSION');
					$tColor	= '009900';
				}
				echo '<span style="color:#'.$tColor.';padding-left:10px;"> [ '.$msg.'! ]</span></b></p>';								
			}?>								
		</div>
	</fieldset>
</div>
<div class="col width-60">
<?php if ($isOldVer) { ?>
	<fieldset class="adminform">
	<legend> <?php echo JText::_('Upgrade to Newer Version'); ?> </legend>
		<div style="margin: 20px;">
			Click here to: 
			<a class="hasTip" title="One-Click Upgrade:: Auto get Patch package" href="<?php echo $upgLnk.'doupdate'; ?>">
			<b>UPGRADE NOW!</b></a><span style="color:#f60;font-weight:bold;padding-left: 15px;"> ( recommended )</span>
		</div>
		<div style="margin: 20px;">
			<form method="post" action="<?php echo $upgLnk.'doupdate&act=ugr&type=local'; ?>" enctype="multipart/form-data">
				<span>Patch package:</span><input type="file" name="patchfile"/>
				<input type="submit" value="Upgrade"/> <span style="color:#f60;font-weight:bold;padding-left: 15px;"> ( <?php echo JText::_("Not recommended");?> )</span>
			</form>
		</div>
	</fieldset>
<?php }
$objLogs = $this->logs;	
if($objLogs->resto){ ?>
	<fieldset class="adminform">
	<legend> <?php echo JText::_('Restore'); ?> </legend>
		<div style="margin: 20px;">
			<p><a title="Backup" href="<?php echo $upgLnk.'doupdate&act=rst&rp='.$objLogs->resto; ?>">
			<b><?php echo JText::_("Turn back to previous version");?>!</b></a><span style="color:#f60;font-weight:bold;padding-left: 15px;"> ( <?php echo JText::_("Not recommended");?> )</span></p>
		</div>
	</fieldset>
<?php }
if($objLogs->logs){ ?>
	<fieldset class="adminform">
	<legend> <?php echo JText::_('History Update'); ?> </legend>
		<div style="margin:10px;border:1px solid #ddd;padding:10px; height: 100px;overflow: auto;background:#f8f8f8;">
	<?php
	echo '<ol>';
	foreach ($objLogs->logs as $log){
		$color = substr($log,-7)=='upgrade'?'339933':'cc5500';
		echo '<li><span style="color:#'.$color.'">'.$log.'</span><a href="index.php?option=com_foobla_upgrade&controller=upgrade&rp='.$log.'"> [ Details ... ]</a></li>';
	}
	echo '</ol>'
	?>	
		</div>
	<?php if($this->report){?>
		<div style="margin:10px;border:1px solid #ddd;padding:10px; height: 300px;overflow: auto;background:#f8f8f8;">
			<?php echo $this->report;?>
		</div>
	<?php }?>
	</fieldset>	
<?php }?>
</div>