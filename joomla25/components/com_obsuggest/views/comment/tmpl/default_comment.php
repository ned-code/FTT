<?php
/**
 * @version		$Id: default_comment.php 348 2011-06-09 10:28:44Z phonglq $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );
global $obIsJ15;
?>
<div id="contentComment">
<?php 
$str_new_ajax 		= 'var req = new Ajax(url,{';
$str_ajax_request 	= '}).request();';
if ( !$obIsJ15 ) {
	$str_new_ajax 		= "var req = new Request({'url':url,";
	$str_ajax_request 	= '}).send();';
}
?>
<script type="text/javascript">

	window.addEvent('domready', function() {
<?php
	if(!$obIsJ15 ) {
?>
		SqueezeBox.assign($$('a.edit_modal'), {
			parse: 'rel'
		});
<?php
	} else {
?>
		$$('a.edit_modal').each(function(el) {
			el.addEvent('click', function(e) {
				new Event(e).stop();
				SqueezeBox.fromElement(el);
			});
		});
<?php
	}
?>
	});

	function delComment(id){
		var agree = confirm("<?php echo JText::_("Are you sure delete?")?>");
		var controller = document.getElementById('controller').value;
		
		if (agree){
			 if (controller == 'comment'){
				var idea_id = document.getElementById('idea_id').value;
				var url="index.php?option=com_obsuggest&controller=comment&format=raw&task=delComment&id="+id+"&idea_id="+idea_id;
				<?php echo $str_new_ajax; ?>
					method:'get',
					onComplete:function(result){
						//loadPage('index.php?option=com_obsuggest&controller=activity&format=raw&task=displayComments&user_id='+getUserId()+'&page=1')
						document.getElementById('contentComment').innerHTML = result;
						var el = document.getElementById('comment_count');
						var cur = parseInt(el.innerHTML);
						
						el.innerHTML = (cur>0)?(cur-1) + '':0
					}
				<?php echo $str_ajax_request; ?>
			 } else if (controller == 'activity'){
				//get list comment of userid
				var url = "index.php?option=com_obsuggest&controller=comment&format=raw&task=UdelComment&id="+id;
				<?php echo $str_new_ajax; ?>
						method:'get',
						onComplete:function(result){
							loadPage('index.php?option=com_obsuggest&controller=activity&format=raw&task=displayComments&user_id='+getUserId()+'&page=1')
							//document.getElementById('list_comment').removeChild(document.getElementById('comment_'+id))
							
							var e = document.getElementById('count_comment');
							if(e)
							{
								e.innerHTML = result + '';
							}
							//document.getElementById('contentComment').innerHTML = result;
						}
				<?php echo $str_ajax_request; ?>
			 }
		}
	}
	
	function resetComment() {
		document.getElementById('comment').value = "";
		document.getElementById('comment').focus();
	}
	
	function addComment() {
		var comment  = document.getElementById('comment').value;
		comment = comment.replace(/\n/gi, "[br\/\]");
		//alert(comment);
		if (comment == ""){
			alert("<?php echo JText::_("Enter the content for comments. Please!")?>");
		}else{
			var idea_id  	= document.getElementById('idea_id').value;
			var forum_id 	= document.getElementById('forum_id').value;
			var anonymous 	= (document.getElementById('anonymous').checked)?1:0;
			var url="index.php?option=com_obsuggest&controller=comment&format=raw&task=addComment&idea_id="+idea_id+"&comment="+comment+"&forum_id="+forum_id+"&anonymous="+anonymous;
			<?php echo $str_new_ajax; ?>
				medthod : 'get',
				onComplete : function( result ) {
					try {
						var jsresult;
						eval('jsresult ='+result+';');
						if(jsresult.error){
							alert(jsresult.msg);
						}
					} catch (e) {
						// TODO: handle exception
						document.getElementById('contentComment').innerHTML = result;
						document.getElementById('comment').value = "";
						var el = document.getElementById('comment_count');
						var cur = parseInt(el.innerHTML);
						el.innerHTML=(cur+1);
					<?php
					if(!$obIsJ15 ) { 
					?>
							SqueezeBox.assign($$('a.edit_modal'), {
								parse: 'rel'
							});
					<?php 
					} else { ?>
							$$('a.edit_modal').each( function(el) {
								el.addEvent('click', function(e) {
									new Event(e).stop();
									SqueezeBox.fromElement(el);
								});
							});
					<?php
					} ?>
					}
				}
			<?php echo $str_ajax_request; ?>
		}
	} 	
</script>
<div id="list_comment">
<?php
if (count($this->comments)){
	$k = 0;
	foreach ($this->comments as $comment) {
		$user = $this->getUser($comment->user_id);
		require_once(JPATH_COMPONENT.DS."helper".DS."avatar.php");
		$avatar_src = Avatar::getAvatar($comment->user_id);
		$avatar_img = "<img src=" . $avatar_src . " />";
		$k++;
		$class=($k%2)?'comment-details':'comment-details2';
		#comment-details
?>
<div class="<?php echo $class; ?>" id="comment_<?php echo $comment->id;?>">
	<div class="username">
		<div class="_image"><?php echo $avatar_img;?></div>
		<div class="_name" style="text-align:center;"><?php echo $user->username; ?></div>
	</div>
	<div class="comment" id="comment_content_<?php echo $comment->id?>">
		<div class="content"><?php echo $comment->comment; ?></div>
	</div>	

	<div class="comment_desc_info">
		<span class="createdate">
			<div>
				<?php if (($this->output->permission->delete_comment_a == 1) || (($this->output->permission->delete_comment_o == 1) && ($this->output->user->id == $comment->user_id))) {?>
				<a href="javascript:delComment(<?php echo $comment->id;?>);"><?php echo JText::_("Delete")?></a>&nbsp;|&nbsp;
				<?php }?>
				<?php echo JText::_("Created on")?> <?php echo date($this->datetime_format, strtotime($comment->createdate)); ?></div>							
			<?php if (($this->output->permission->edit_comment_a == 1) || (($this->output->permission->edit_comment_o == 1) && ($this->output->user->id == $comment->user_id))) {?>
	<!-- Change Status -->
			<div class="active" id ="edt<?php echo $comment->id; ?>">
					<a id="edit_modal_<?php echo $comment->id; ?>" class="edit_modal" href="index.php?option=com_obsuggest&controller=comment&task=editComment&id=<?php echo $comment->id;?>&format=raw" rel="{handler: 'iframe',size: {x: 430, y: 280}}"> <?php echo JText::_("Edit")?></a>&nbsp;|&nbsp; 
			</div>
	<!-- Change Status -->
			<?php }?>
		</span>
	</div>
</div>
<div class="comment_separate_line"></div>
<?php }
}?>
</div>
<div>
	<span class="pagination">
		<div id="Pagination3">
		<?php 
		if( count($this->comments) ) 
			echo $this->pageComment;
		else 
		{
		?>
		<div class="comment_separate_line_last">
		<?php 
			echo JText::_("No comment for this idea.");
		?>
		</div>
		<?php 
		}
		?>
		</div>
	</span>
</div>

</div>
