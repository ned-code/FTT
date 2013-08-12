<?php
/**
 * @version		$Id: default_forum_stasitic.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>
<table width="100%" border="0" style="border: 1px dashed #BBB; padding-left: 5px;">
	<tr>
		<td>
			<?php 
			if ($this->output->statistic->chart_idea != NULL) {			
				$x = "0";
				$y = "0";
				$i=0;
				foreach ($this->output->statistic->chart as $statistic) {
					if ($statistic->order * 10 <= 100) {
						if ($x != NULL) {
							$x = $x.",".$statistic->order*10;							
							
						} else {
							$x = $statistic->order;							
						}
						
						if ($y != NULL) {
							$y = $y.",".$statistic->vote;							
						} else $y = $statistic->vote;					
						$i++;
					}
				}
				$i=0;
				$chart = null;
				if ($x != NULL) $chart = $x.'|'.$y; 
				 				
				$x_idea = "0";
				$y_idea = "0";
				foreach ($this->output->statistic->chart_idea as $statistic) {					
					if ($statistic->order * 10 <= 100) {
						if ($x_idea != NULL) {
							$x_idea = $x_idea.",".$statistic->order*10;							
							
						} else {
							$x_idea = $statistic->order;							
						}
						
						if ($y_idea != NULL) {
							$y_idea = $y_idea.",".$statistic->idea;							
						} else $y_idea = $statistic->idea;					
						$i++;
					}
				}
				$idea_chart = null;
				if ($x_idea != NULL) $idea_chart = $x_idea.'|'.$y_idea;
				$i=0;				
				$x_comment = "0";
				$y_comment = "0";
				if ($this->output->statistic->chart_comment != NULL) {					
					foreach ($this->output->statistic->chart_comment as $statistic) {
						if ($statistic->order * 10 <= 100) {
							if ($x_comment != NULL) {
								$x_comment = $x_comment.",".$statistic->order*10;							
								
							} else {
								$x_comment = $statistic->order;							
							}
							
							if ($y_comment != NULL) {
								$y_comment = $y_comment.",".$statistic->comment;							
							} else $y_comment = $statistic->comment;					
							$i++;
						}
					}
				}
				$comment_chart = null;
				if ($x_comment != NULL) $comment_chart = $x_comment.'|'.$y_comment;
				
				
			?>
			
			<img src="http://chart.apis.google.com/chart?chs=500x150&cht=lxy&amp;
				chd=t:<?php
					if ($chart != NULL) echo $chart;
					if ($idea_chart != NULL) echo "|".$idea_chart;
					if ($comment_chart != NULL) echo "|".$comment_chart;
				?>&amp;
				&chxt=x,y,r&amp;chxl=0:|day|t|2:|min <?php echo $this->output->statistic->min_vote; ?>|average|m.vote <?php echo $this->output->statistic->max_vote; ?>&chxp=2,0,50,100&chco=50A60A,0000FF,FC8F30&chdl=vote|idea|comment" alt="loadding.."/>
			<?php }?>
		</td>
		<td width="20%" valign="top">
			<table>
				<tr>	
					<td><?php echo JText::_("All Idea")?>: </td>
					<td>
						<b><?php echo $this->output->numIdea; ?></b>
					</td>
				</tr>
				<tr>	
					<td><?php echo JText::_("All Comment")?>:</td>
					<td> <b><?php echo $this->output->numComment; ?></b></td>
				</tr>
				<tr>	
					<td><?php echo JText::_("All Vote")?>:</td>
					<td> <b><?php echo $this->output->numVote; ?></b></td>
				</tr>		
				<tr style="color: #0000FF">
					<td><?php echo JText::_("max Idea")?>:</td>
					<td><b><?php echo $this->output->statistic->max_idea; ?></b></td>
				</tr>	
				<tr>
					<td><?php echo JText::_("min Idea")?>:</td>
					<td><b><?php echo $this->output->statistic->min_idea; ?></b></td>
				</tr>			
				<tr style="color: #FC8F30">
					<td><?php echo JText::_("max Comment")?>:</td>
					<td><b><?php echo $this->output->statistic->max_comment; ?></b></td>
				</tr>	
				<tr>
					<td><?php echo JText::_("min Comment")?>:</td>
					<td><b><?php echo $this->output->statistic->min_comment; ?></b></td>
				</tr>
			</table>
		</td>			
	</tr>
</table>

