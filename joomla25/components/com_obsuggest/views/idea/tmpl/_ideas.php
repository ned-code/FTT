<?php
/**
 * @version		$Id: _ideas.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>
<table width="100%" border="0" cellpadding="0" cellspacing="0">
	<?php foreach($this->ideas as $idea) { ?>
	<tr>
		<td valign="top" width="15%">			
			<table>
				<tr>
					<td>
						<div style="font-size: 16px;font-weight: bolder;">Score 100</div>
					</td>
				</tr>
				<tr>
					<td>
						<select>
							<option>1</option>
							<option>2</option>
							<option>3</option>
							<option>4</option>
						</select>
					</td>
				</tr>
			</table>
		</td>				
		<td>
			<table>
				<tr>
					<th>
						<div id="title<?php echo $idea->id; ?>" style="float: left; font-size: 18px;"><?php echo $idea->title; ?></div>
						<i>
							<span onclick="clickStatus(<?php echo $idea->id; ?>)" id="status<?php echo $idea->id; ?>" style="float: left;margin-left: 10px;background-color: #D1DCEB; color: #008000;">
								<?php 
									if ($idea->status_id == NULL) echo "Status"; 
									else {
										foreach ($this->status as $status ) {
											if ($status->id == $idea->status_id) {
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
						<label id="idea<?php echo $idea->id; ?>" style="font-size: 13px;"><?php echo $idea->content; ?></label>
					</td>
				</tr>
				<tr>
					<?php if ($idea->response == NULL ) { ?>
					<td id="rps<?php echo $idea->id; ?>">
						<div onclick="addRepose('rps<?php echo $idea->id; ?>')" onmousemove="onmove('rps<?php echo $idea->id; ?>')" onmouseout="onout('rps<?php echo $idea->id; ?>')"><i>Add Response</i></div>
					</td>
					<?php } else { ?>
					<td>
						<div id="rps<?php echo $idea->id; ?>">
							<div onclick="addRepose('rps<?php echo $idea->id; ?>')" onmousemove="onmove('rps<?php echo $idea->id; ?>')" onmouseout="onout('rps<?php echo $idea->id; ?>')"><i><?php echo $idea->response; ?></i></div>
						</div>
					</td>
					<?php } ?>
				</tr>
				<tr>
					<td>
						<span style="float: left;">
							<div style="float:left" id="cm<?php echo $idea->id; ?>" onClick="" onmousemove="onmove('cm<?php echo $idea->id; ?>')" onmouseout="onout('cm<?php echo $idea->id; ?>')"><font color="#076ACD">Comment</font> |</div>							
							<div style="float:left">by <font color="#076ACD">CuongPQ</font> |</div>
							<div style="float:left" id ="del<?php echo $idea->id; ?>" style="float:left" onClick="ondel(<?php echo $idea->id; ?>)" onmousemove="onmove('del<?php echo $idea->id; ?>')" onmouseout="onout('del<?php echo $idea->id; ?>')" ><font color="#076ACD">Delete</font> |</div>
							<div id ="edt<?php echo $idea->id; ?>" style="float:left" onClick="onedit(<?php echo $idea->id; ?>)" onmousemove="onmove('edt<?php echo $idea->id; ?>')" onmouseout="onout('edt<?php echo $idea->id; ?>')"><font color="#076ACD">Edit</font> |</div>
							<div style="float:left" onClick="">Create on <font color="#076ACD"><?php echo $idea->createdate; ?></font></div>
						</span>
					</td>
				</tr>
			</table>
		</td>
	</tr>	
	<?php } ?>
</table>