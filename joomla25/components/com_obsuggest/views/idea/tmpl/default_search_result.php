<?php
/**
 * @version		$Id: default_search_result.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

if($this->ideas)
{
	$count = 0;
	foreach ($this->ideas as $idea)		
	{
	?>
	<div class="idea-title" onclick="/*javascript:setWordSearch('<?php echo $idea->title?>')*/">
	<?php
		$matches = array();
		preg_match_all('/'.$this->keyword.'/i', $idea->title, $matches);
		
		$matches = $matches[0];
		$replaces = array();
		foreach ($matches as $key=>$val)
		{
			$find[$key] = $val;
			$replaces[$key] = '<span style="color:#FF0000;font-size:11px;">'.$matches[$key]."</span>";
			//$replaces[$key] = "[".$matches[$key]."]";
			break;
		}
	?>
	<a href="index.php?option=com_obsuggest&controller=comment&idea_id=<?php echo $idea->id?>" style="display:block;width:100%;">
		<?php echo str_replace($find, $replaces,$idea->title)?>
	</a>	
	</div>
	<?php 
	}
}
?>