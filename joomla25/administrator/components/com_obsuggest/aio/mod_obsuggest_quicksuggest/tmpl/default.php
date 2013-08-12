<?php
/**
 * @version		$Id: toolbar.obsuggest.php 127 2011-03-08 03:00:29Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

require_once (JPATH_SITE.DS.'components'.DS.'com_obsuggest'.DS.'router.php');
$version 	= new JVersion();
$obIsJ15 = ($version->RELEASE=='1.5');
$str_new_ajax 		= 'var req = new Ajax(url,{';
$str_ajax_request 	= '}).request();';
if ( !$obIsJ15 ) {
	$str_new_ajax 		= "var req = new Request({'url':url,";
	$str_ajax_request 	= '}).send();';
}
?>
<script type="text/javascript">
<!--
function addSuggestion() {
	//var title = document.getElementById('quick_suggestion_title').value;
   	
	var fulltext = document.getElementById('quick_suggestion_fulltext').value;
    var title = fulltext.substring(30,0);
    title = Trim(title);
    if (title.length < 3) {
        alert("Content of the comments is too short.");
        document.getElementById('quick_suggestion_fulltext').focus();
        return;
    }
	document.getElementById('qd_button').value = "In Progress...";
    if (title.length > 18 ) {
   	 	title = title + "...";
    }
	var id = document.getElementById('quick_suggestion_forum_id').value;
	var url = "index.php?option=com_obsuggest&controller=idea&task=addIdea&forum_id="+id+"&title="+title+"&content="+fulltext;
	<?php echo $str_new_ajax; ?>
		method: 'post',
		onComplete: function(txt){
			document.getElementById('quick_suggestion_button').style.display = 'none';
			document.getElementById('box').style.display = 'block';
			var t=setTimeout("showButton()",4000);
			var log = document.getElementById('box');

//			var fx = new Fx.Styles(log, {
//                duration: 15000,
//                wait: false,
//                transition: Fx.Transitions.Quad.easeOut
//            });

			log.innerHTML = "Thank You";
//            fx.start({
//                'color': ['#c20000', '#ffffff'],
//                'opacity': [1, 0]
//            });

			// clear textarea
			document.getElementById('quick_suggestion_fulltext').value='';
		}
	<?php echo $str_ajax_request; ?>
	
}
function showButton() {
	document.getElementById('qd_button').value = "Suggest Now";
    document.getElementById('quick_suggestion_button').style.display = 'block';
    document.getElementById('box').style.display = 'none';
}
function lTrim(sString){
    while (sString.substring(0,1) == ' ')
    {
    sString = sString.substring(1, sString.length);
    }
    return sString;
}
function rTrim(sString){
    while (sString.substring(sString.length-1, sString.length) == ' ')
    {
    sString = sString.substring(0,sString.length-1);
    }
    return sString;
}
function Trim(sString)
{
    sString = lTrim(sString);
    return rTrim(sString);
}
//-->
</script>

<!--
<ul class="<?php echo $params->get('moduleclass_sfx'); ?>">
	<?php foreach($list as $lists){?>
		<?php
			if($lists){
		?>
		<li class="<?php echo $params->get('moduleclass_sfx'); ?>">
		<?php $lst = explode('-',$lists);?>
		<a class="<?php echo $params->get('moduleclass_sfx'); ?>" href="<?php echo JRoute::_('index.php?option=com_obsuggest&forumId='.$lst[1]);?>">
		<?php echo $lst[0];?>
		</a>
		</li>
	<?php }
	}?>
</ul>
-->
<div class="<?php echo $params->get('moduleclass_sfx'); ?>">
    <div>
        <?php echo $params->get('think'); ?>
    </div>
    <div <?php echo count($listForum) == 1 ? 'style="display:none"':'' ?>>
        <div style="float:right;">
        <?php
            if (count($listForum)) {
                foreach ($listForum as $obj){
                    $listsF[]  = JHTML::_("select.option", $obj->id, $obj->name, "id", "name");
                }
            }
            $forum_id = $params->get('slList');
            $listsFSlct = JHTML::_('select.genericlist',  $listsF, 'quick_suggestion_forum_id', 'class="inputbox" size="1"', 'id', 'name', $forum_id);

            echo $listsFSlct;

        ?>
        </div>
    </div>
    <!--
    <input type="text" id="quick_suggestion_title" style="width: 100%;" value="" />
    -->
    <div>
        <textarea rows="4" cols="29" id="quick_suggestion_fulltext" style="width: 95%;" class="inputbox"></textarea>
    </div>
    <div id="quick_suggestion_button">
        <input type="button" id="qd_button" value="Suggest Now" onclick="addSuggestion();"/>
		<div style="float: right; line-height: 30px;"><a href="index.php?option=com_obsuggest&Itemid=70" class="hasTip" title="Suggestions::View All Suggested Ideas">Suggested Ideas</a></div>
    </div>
    <div id="box" align="left" style="float:left;display: none;"></div>
	
    <div style="clear: both;"></div>
</div>

