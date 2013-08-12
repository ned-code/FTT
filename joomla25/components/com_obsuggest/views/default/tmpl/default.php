<?php
/**
 * @version		$Id: default.php 293 2011-04-02 02:46:07Z phonglq $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );
global $option, $obIsJ15;

JHTML::_( 'behavior.modal' );

$document = & JFactory::getDocument();

#$document->addScript(JURI::base() ."components/$option/assets/js/jquery.js");
$document->addStyleSheet(JURI::base() ."components/$option/assets/css/base.css");	
$document->addStyleSheet(JURI::base() ."components/$option/assets/css/styles.css");
$document->addStyleSheet(JURI::base() ."components/$option/assets/css/status.css");
$document->addStyleSheet(JURI::base() ."components/$option/assets/css/rating.css");
$document->addStyleSheet(JURI::base() ."components/$option/assets/css/suggest.css");
$document->addStyleSheet(JURI::base() ."components/$option/assets/css/rounded.css");
$document->addStyleSheet(JURI::base() ."components/$option/assets/css/paging.css");

if( !$obIsJ15 ) {
	$document->addScript(JURI::base() ."components/$option/assets/js/default16.js");
} else {
	$document->addScript(JURI::base() ."components/$option/assets/js/default.js");
}

require_once(JPATH_COMPONENT.DS."helper".DS."forum.php");
require_once(JPATH_ADMINISTRATOR.DS."components".DS.$option.DS."helpers".DS."themes.php");

#TODO: set title
$document = &JFactory::getDocument();
$title = $document->getTitle();
$document->setTitle( $title . ' - ' . $this->output->forum->name );

#TODO: set description
$desc 		= 	$this->output->forum->wellcome_message;
$desc 		.= 	' '.$this->output->forum->description;
$document->setDescription( urlencode( $desc ) );
?>
<form name="adminForm" action="#"  method="POST" id="adminForm" onsubmit="return false;">
<h2><?php echo $this->output->forum->name; ?></h2>
<input type="hidden" name="forumId_selected" id ="forumId_selected" value="<?php echo $this->output->forum->id;?>" />
<input type="hidden" name="ideaPerPage" id="ideaPerPage" value="<?php echo Forum::getIdeaPerPage($this->output->forum->id);?>"/>
<?php 
$layouts = Themes::getLayouts();
foreach($layouts as $layout){
	echo $this->loadTemplate(str_replace("default_", "", $layout));
}
?>
<input type="hidden" name="task" value="" />
<input type="hidden" name="current_tab_selected" id ="current_tab_selected" value="" />
</form>
<div style="margin:3px;"></div>
<script type="text/javascript">
	//jQuery.noConflict();
	
	window.addEvent("domready",
		function(){
			clickTab('TOP');
		}
	)
	
	function getForumId()
	{
		return <?php echo $this->output->forum->id;?>;
	}
</script>
