<?php
/**
 * @version		$Id: _default_comment.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>
<table width="100%" border="0" cellpadding="0" cellspacing="0">		
	<tr>
		<td valign="top" width="15%">			
			<table>
				<tr>
					<td>
						<div style="font-size: 16px;font-weight: bolder;">Score <?php echo $this->idea->votes; ?></div>
					</td>
				</tr>
				<tr>
					<td>
						<select name="vote<?php echo $this->idea->id?>" onchange="lstVote_change(this.options[this.selectedIndex].value,<?php echo $this->idea->id?>)">
							<option value="0">0</option>
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
						</select>
					</td>
				</tr>
			</table>
		</td>				
		<td>
			<table>
				<tr>
					<th>
						<div id="title<?php echo $this->idea->id; ?>" style="float: left; font-size: 18px;"><?php echo $this->idea->title; ?></div>
						<i>
							<span onclick="clickStatus(<?php echo $this->idea->id; ?>)" id="status<?php echo $this->idea->id; ?>" style="float: left;margin-left: 10px;background-color: #D1DCEB; color: #008000;">
								<?php 
									if ($this->idea->status_id == NULL) echo "Status"; 
									else {
										foreach ($this->status as $status ) {
											if ($status->id == $this->idea->status_id) {
												echo $status->title; 	
												break;
											}											
										}
									}
								?>
							</span>
						</i>
					</th>
				</tr>
				<tr>
					<td>
						<label id="idea<?php echo $this->idea->id; ?>" style="font-size: 13px;"><?php echo $this->idea->content; ?></label>
					</td>
				</tr>
				<tr>
					<?php if ($this->idea->response == NULL ) { ?>
					<td id="rps<?php echo $this->idea->id; ?>">
						<div onclick="addRepose('rps<?php echo $this->idea->id; ?>')" onmousemove="onmove('rps<?php echo $this->idea->id; ?>')" onmouseout="onout('rps<?php echo $this->idea->id; ?>')"><i>Add Response</i></div>
					</td>
					<?php } else { ?>
					<td>
						<div id="rps<?php echo $this->idea->id; ?>">
							<div onclick="addRepose('rps<?php echo $this->idea->id; ?>')" onmousemove="onmove('rps<?php echo $this->idea->id; ?>')" onmouseout="onout('rps<?php echo $this->idea->id; ?>')"><i><?php echo $this->idea->response; ?></i></div>
						</div>
					</td>
					<?php } ?>
				</tr>
				<tr>
					<td>
						<span style="float: left;">
							<div style="float:left" id="cm<?php echo $this->idea->id; ?>" onClick="" onmousemove="onmove('cm<?php echo $this->idea->id; ?>')" onmouseout="onout('cm<?php echo $this->idea->id; ?>')">
								<a href="index.php?controller=comment&task=display&idea_id=<?php echo $this->idea->id?>"><font color="#076ACD">Comment</font></a> |
							</div>							
							<div style="float:left">by <font color="#076ACD">CuongPQ</font> |</div>
							<div style="float:left" id ="del<?php echo $this->idea->id; ?>" style="float:left" onClick="ondel(<?php echo $this->idea->id; ?>)" onmousemove="onmove('del<?php echo $this->idea->id; ?>')" onmouseout="onout('del<?php echo $this->idea->id; ?>')" ><font color="#076ACD">Delete</font> |</div>
							<div id ="edt<?php echo $this->idea->id; ?>" style="float:left" onClick="onedit(<?php echo $this->idea->id; ?>)" onmousemove="onmove('edt<?php echo $this->idea->id; ?>')" onmouseout="onout('edt<?php echo $this->idea->id; ?>')"><font color="#076ACD">Edit</font> |</div>
							<div style="float:left" onClick="">Create on <font color="#076ACD"><?php echo $this->idea->createdate; ?></font></div>
						</span>
					</td>
				</tr>
			</table>
		</td>
	</tr>		
</table>