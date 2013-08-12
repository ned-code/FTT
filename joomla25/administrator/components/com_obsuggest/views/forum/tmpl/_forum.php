This page edit a forum.
<?php 

	$task= JRequest::getVar('task');
?>

<table width="100%">
	<tr>
		<td width="100%" style="border: 1px solid #BBB; font-size: 18px">
			FORUM : <?php echo $this->forum->name; ?> 
		</td>
	</tr>
	<tr>
		<td>
<?php 
$pane =& JPane::getInstance('Tabs');
echo $pane->startPane('myPanel');

	/* joomlacore */
	echo $pane->startPanel('Forum', "panel_forum");
	?>
		This is form manage Ideas.<br />			
		<?php 
			switch ($task) {
				case 'new':
					echo $this->loadTemplate('new');
					break;
				case 'edit':
					echo $this->loadTemplate('edit');
					break;
			} 
		?>
	<?php	
	echo $pane->endPanel();
	
	echo $pane->startPanel('Status', "panel_status");
	?>			
		<?php
			switch ($task) {
				case 'editStatus' :
					//echo $this->loadTemplate('status_edit');
					break;
				case 'newStatus' :
					//echo $this->loadTemplate('status_new');
					break;
				default :
					//echo $this->loadTemplate('status');					
			}			
		?>
	<?php	
	echo $pane->endPanel();
	
	echo $pane->startPanel('Votes', "panel_votes");
	?>
		This is form manage Votes.
	<?php	
	echo $pane->endPanel();

echo $pane->endPane();
?>
		</td>
	</tr>
</table>
