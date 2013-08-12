<?php
/**
 * @version		$Id: default_status.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>
<script type="text/javascript">
	//default.js
</script>
<style type="text/css">

</style>
<div id="statusform" class="invisible_form">
	<form name="StatusForm" action="#" method="POST">
		<div class="frame">
		<?php 	$tt=1;
			foreach($this->status as $status) {
				if ($status->parent_id == -1) { 
		?>
			<div>
				<div class="parentid" id="stt<?php echo $status->id; ?>"><?php echo $status->title; ?></div>
			</div>					
			<?php 
				foreach($this->status as $stt) {
					if ($stt->parent_id == $status->id) { $tt++; 
			?>
				<div>
					<div class="child" style="cursor:pointer;" id="stt<?php echo $stt->id; ?>" 
					onclick="updateIdeaStatus(<?php echo $stt->id.",".$tt;?>)" 
					onmousemove="this.style.background='#ccc'" 
					onmouseout="this.style.background='#fff';">
					<?php echo $stt->title; ?>
					</div>
				</div>						
		<?php 
						} 
					} 
				} 
			} 
		?>				
		</div>	
	</form>	
</div>
