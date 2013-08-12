<?php
defined('_JEXEC') or die('Restricted access');
require_once (JPATH_SITE.DS.'components'.DS.'com_obsuggest'.DS.'router.php');
?>
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
