<?php
/**
 * @version		$Id: default.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );
global $mainframe, $option, $obIsJ15;

$option = 'com_obsuggest';
JHTML::_('behavior.mootools');
JHTML::_('behavior.modal');
	
	JHTML::script('jquery.js','components/'.$option.'/assets/js/');
	//JHTML::script('jquery.pagination.js','components/'.$option.'/assets/js/');
	$document = & Jfactory::getDocument();
	$document->addStyleSheet(JURI::base() . "components/$option/assets/css/base.css");
	$document->addStyleSheet(JURI::base() . "components/$option/assets/css/styles.css");
	$document->addStyleSheet(JURI::base() . "components/$option/assets/css/status.css");
	$document->addStyleSheet(JURI::base() . "components/$option/assets/css/rating.css");	
	$document->addStyleSheet(JURI::base() . "components/$option/assets/css/rounded.css");
	$document->addStyleSheet(JURI::base() . "components/$option/assets/css/pagination.css");
	//$document->addStyleSheet( JURI::base() ."components/$option/assets/css/obsuggest.css" );
	$document->addStyleSheet(JURI::base() ."components/$option/assets/css/paging.css");
	if(!$obIsJ15){
		$document->addScript(JURI::base() ."components/$option/assets/js/default16.js");
	} else {
		$document->addScript(JURI::base() ."components/$option/assets/js/default.js");
	}
//	$document->addScript(JURI::base()."components/$option/assets/js/modal.js");
	# TODO set title
	$title = $document -> getTitle();
	$document -> setTitle( $title . ' - ' . $this->forum_info->name . ' - ' . $this -> ideas[0] -> title );
	$document -> setDescription( $this -> ideas[0] -> content );
?>
<h2><?php echo $this->forum_info->name; ?></h2>
<script>
var outVote_s = 0;
var clickVote_s =0;
jQuery.noConflict();
</script>
<?php require_once(JPATH_ADMINISTRATOR.DS."components".DS.$option.DS."helpers".DS."themes.php");?>
<form name="adminForm" action="index.php?option=com_obsuggest&controller=comment" method="POST">
<?php
	$this->_addPath( 'template', JPATH_COMPONENT.DS.'views'.DS. 'default'.DS.'tmpl' );	
	$this->_addPath( 'template', JPATH_COMPONENT.DS.'views'.DS. 'idea'.DS.'tmpl' );

	$layouts = Themes::getLayouts('default', 'comment');

	foreach($layouts as $layout){
		echo $this->loadTemplate($layout); 
	}
?>
<input type="hidden" id="controller" value="<?php echo JRequest::getVar('controller');?>" />
<input type="hidden" name="idea_id" id="idea_id" value="<?php echo $this->idea_id; ?>" />
<input type="hidden" name="current_tab_selected" id ="current_tab_selected" value="<?php echo JRequest::getVar('controller');?>" />
<input type="hidden" name="forum_id" id="forum_id" value="<?php echo $this->forum_id; ?>" />
<input type="hidden" name="forumId_selected"  id = "forumId_selected" value="<?php echo $this->forum_id; ?>" />
<input type="hidden" name="task" value="addComment" />
</form>
<div style="margin:3px;"></div>
