<?php
/**
 * @version		$Id: default.php 234 2011-03-25 11:15:18Z phonglq $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access

defined( '_JEXEC' ) or die( 'Restricted access' );
global $option;
	JHTML::_('behavior.mootools');
	JHTML::_('behavior.modal');

	JHTML::script('jquery.js','components/'.$option.'/assets/js/');

	$document = & Jfactory::getDocument();
	$document->addStyleSheet(JURI::base() ."components/$option/assets/css/base.css");
	$document->addStyleSheet(JURI::base() ."components/$option/assets/css/styles.css");
	$document->addStyleSheet(JURI::base() ."components/$option/assets/css/status.css");
	$document->addStyleSheet(JURI::base() ."components/$option/assets/css/rating.css");
	$document->addStyleSheet(JURI::base() ."components/$option/assets/css/rounded.css");

	$document->addStyleSheet(JURI::base() ."components/$option/assets/css/pagination.css");

	$document->addStyleSheet(JURI::base() ."components/$option/assets/css/paging.css");
	$document->addScript(JURI::base() ."components/$option/assets/js/default.js");
?>
<script>

var outVote_s 	= 0;
var clickVote_s = 0;
function getUserId(){ return <?php echo $this->user->id?> }
function getConfirmDeleteText(){return "<?php echo JText::_("Are you sure delete?")?>";}
function getRequireCommentText(){return "<?php echo JText::_("Enter the content for comments. Please!")?>";}	

</script>
<?php require_once(JPATH_ADMINISTRATOR.DS."components".DS.$option.DS."helpers".DS."themes.php");?>
<?php
	/*$this->_addPath( 'template', JPATH_COMPONENT.DS.'views'.DS. 'default'.DS.'tmpl' );	
	echo $this->loadTemplate('status');
	echo $this->loadTemplate('vote'); */
	$layouts = Themes::getLayouts('default', 'activity');
?>
<form name="adminForm" action="#" method="POST">
<!--<div id="element-box">
	<div class="t">
		<div class="t">
			<div class="t"></div>
		</div>
	</div>
	<div class="m">-->
<?php 
		foreach ($layouts as $layout){
			echo $this->loadTemplate($layout);
			
		}
?>
<!--</div>
	<div class="b">
		<div class="b">
			<div class="b"></div>
		</div>
	</div>
</div>-->
<input type="hidden" id="controller" value="<?php echo JRequest::getVar('controller');?>" />
<input type="hidden" name="current_tab_selected" id ="current_tab_selected" value="<?php echo JRequest::getVar('controller');?>" />
<input type="hidden" name="forumId_selected" id ="forumId_selected" value="" />
<input type="hidden" id="user_id" value="<?php echo $this->user->id;?>" />
<input type="hidden" name="ideaPerPage" id="ideaPerPage" value="5"/>
</form>
<div style="margin:3px;"></div>
<script type="text/javascript">
jQuery.noConflict();
// in IE7 i do not known why, when i remove this then the tabs does not work
// but i added this tabs are work correct although it do not do anything
// who can tell me why??? ^.^
window.addEvent("domready",
	function(){	
		//clickTab('TOP');
	}	
)
var url = "index.php?option=com_obsuggest&controller=activity&user_id=<?php echo $this->user->id;?>&pagination=1&format=raw";	
</script>
