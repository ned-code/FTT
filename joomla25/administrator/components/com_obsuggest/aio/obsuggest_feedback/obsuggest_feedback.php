<?php
/**
 * @version		$Id: obsuggest_feedback.php 164 2011-03-12 09:01:56Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

class plgSystemobsuggest_feedback extends JPlugin {
	/**
	 * construct plug-in
	 *
	 * @param unknown_type $subject
	 * @param unknown_type $config
	 * @return plgSystemFeedback
	 */
	function plgSystemobsuggest_feedback(& $subject, $config) {
		parent::__construct($subject, $config);		
	} 
		
	function onAfterInitialise()
	{
	
	}
	
	function onAfterRoute() {
		$option = JRequest::getCmd('option');
		$view	= JRequest::getCmd('view');
		$task	= JRequest::getCmd('task');
		
		global $mainframe;

		if($option == 'com_content' && $view == 'article') {
			//get db instance
			$db = & JFactory::getDBO();
			
			$article_id = JRequest::getVar('id');
			
			$article_id = explode(":", $article_id);	
			
			$query = "
				SELECT * FROM #__foobla_uv_forum_article
				WHERE article_id = " . $article_id[0] . "
			";
			
			$db->setQuery($query);
			
			$row = $db->loadObject();
			
			// if article exists in forum -> show feedback button
			if ($row) {
				if($row->forum_id) {
					$css = '
						<style type="text/css">
							.feedback_button{								
								position:fixed;
								top:40%;
								background:#FFFFFF;
								padding:0px;
								border:1px solid #FCFCFC;
								left:-7px;
								cursor:pointer;
							}
							.feedback_button a{
								font-weight:bold;
								text-decoration:none;
								font-size:16px;
							}
						</style>
					';
					$mainframe->addCustomHeadTag($css);
					
					$img = 'plugins/system/obsuggest_feedback/feedback.png';
					$link = "?option=com_obsuggest&forumId=$row->forum_id";
					$feedback = "";
					$feedback = '<div id="feedback" class="feedback_button" ><a href="'.$link.'"><img src="'.$img.'" border=0 alt="Feedback"></a>';
					$feedback .= "</div>";
					$script = '
						<script>
							window.addEvent("domready", function() {
								var div	  = document.getElementById("content-pane");
								var mydiv = new Element("div"); //create my div tag have class = panel
									mydiv.innerHTML = \''.$feedback.'\';			  //insert table into my div tag (note: my div tag must be empty)																
									mydiv.inject(document.body);							  //Add my div tag into the div tag have id = content-pane																																						
							});
						</script>	
					';
					$mainframe->addCustomHeadTag($script);
					
					$script = '
						<script>
							window.addEvent("domready", function() {
								document.getElementById("feedback").onmousemove=function(){this.style.left="0px"};	
								document.getElementById("feedback").onmouseout=function(){this.style.left="-7px"};																																		
							});
						</script>	
					';
					$mainframe->addCustomHeadTag($script);
				}
			}
		# save the settings
		} else if($option == 'com_content' && ($task == 'save' || $task=='apply')) {
			//get db instance
			$db = JFactory::getDBO();
			
			$forum_id = JRequest::getVar('forum_id');
			$old_forum_id = JRequest::getVar('old_forum_id');
			$article_id = JRequest::getVar('cid');
			$article_id = $article_id[0];
				
			//remove article from forum if exists
			$query = "
				DELETE FROM #__foobla_uv_forum_article
				WHERE forum_id = $old_forum_id
				AND article_id = $article_id
			";
			$db->setQuery($query);
			$db->query();
						
			if($forum_id!=0) {
				//insert article into forum			
				$query = "
					INSERT INTO #__foobla_uv_forum_article
					SET forum_id = $forum_id,
					article_id = $article_id
				";
			} else if($forum_id=='0') {
				//remove article from forum if exists and forum id is null
				$query = "
					DELETE FROM #__foobla_uv_forum_article
					WHERE article_id = $article_id
				";
			}			
			$db->setQuery($query);
			$db->query();
		# embed the slide into the edit form
		} else if ($option == 'com_content' && ($task == 'edit'||$task == 'add')) {
			//add element into form edit article
			$html='<h3 id="forum_id_title" class="title jpane-toggler-down"><span>obSuggest Forum</span></h3>';
			$html.='	<div class="jpane-slider content" style="border-top: medium none; border-bottom: medium none; overflow: hidden; padding-top: 0px; padding-bottom: 0px; height: 0px;">';
			$html.='		<table cellspacing="1" width="100%" class="paramlist admintable">';
			$html.='			<tbody>';
			$html.='				<tr>';
			$html.='					<td class="paramlist_key">';
			$html.='						<span class="editlinktip">';
			$html.='							<label id="forumid-lbl" class="hasTip"  for="forum_id" title="Forum name::Forum name to add this article">Forum name</label>';
			$html.='						</span>';
			$html.='					<td class="paramlist_value">' . $this->_getListForum() . '</td>';
			$html.='				</tr>';
			$html.='			</tbody>';
			$html.='		</table>';
			$html.='	</div>';
			$html.='<input type="hidden" name="old_forum_id" value="'.JRequest::getVar('old_forum_id').'">';
						
			$script = '
				<script>
					window.addEvent("domready", function() {
						var div	  = document.getElementById("content-pane");
						var mydiv = new Element("div",{"class":"panel"}); //create my div tag have class = panel
							mydiv.innerHTML = \''.$html.'\';			  //insert table into my div tag (note: my div tag must be empty)																
							mydiv.inject(div);							  //Add my div tag into the div tag have id = content-pane																																						
					});
				';
			$script.='window.addEvent("domready", function(){ new Accordion($$(".panel h3"),'; 
			$script.='$$(".panel div"), {onActive: function(toggler, i) ';
			$script.='{ toggler.addClass("jpane-toggler-down"); toggler.removeClass("jpane-toggler"); },';
			$script.='onBackground: function(toggler, i) { toggler.addClass("jpane-toggler"); ';
			$script.='toggler.removeClass("jpane-toggler-down"); },duration: 300,opacity: false,alwaysHide: true}); });';
			$script.='window.addEvent("domready", function(){ var JTooltips = new Tips($$(".hasTip"), { maxTitleChars: 50, fixed: false}); });';
			$script.='</script>';
			$mainframe->addCustomHeadTag($script);			
		}		
	}
	/**
	 * get list of forum
	 *
	 * @return unknown
	 */
	function _getListForum()
	{
		$db = JFactory::getDBO();
		
		$article_id = JRequest::getVar('cid');
		$article_id = $article_id[0];
		
		$query = "
			SELECT forum_id
			FROM #__foobla_uv_forum_article
			WHERE article_id = $article_id
		";
		$db->setQuery( $query );
		$row = $db->loadObject();
		
		if($row)
			$forum_id = $row->forum_id;
		else
			$forum_id = 0;
		$query = "
			SELECT id,name
			FROM #__foobla_uv_forum
		";
		$db->setQuery( $query );
		
		JRequest::setVar('old_forum_id', $forum_id);
		
		$forumlist[]		= JHTML::_('select.option',  '0', JText::_( '---Select Forum---' ), 'id', 'name' );
		
		$ret = $db->loadObjectList();
		
		if($ret)
			$forumlist			= array_merge( $forumlist, $ret );

		return JHTML::_('select.genericlist', $forumlist, 'forum_id','','id','name',$forum_id);
	}
}
?>
