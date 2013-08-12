<?php
/**
 * @version		$Id: default_database.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>
<style type="text/css">
.warning{
	color:#CC9933;
}
.error{
	color:#ff0000;
}
.repairing{
	background:#999999;
	color:#666666;
}
.repaired{
	background:#00FF00;
	color:#0000FF;
}
.fail{
	color:#000000;
}
</style>
<!--<textarea id="aaa" cols="50" rows="2"></textarea>-->
<script language="javascript" type="text/javascript">

</script>

<?php 
if($this->errorlist->total>0)
{
	JToolBarHelper::customX('repairSelect', 'report', 'report', 'Repair');
?>
<table class="adminform">
	<tr>
		<td align="center" style="color:#ff0000;" colspan="2">
			System has been checked your database and found some error (or warning)!
		</td>		
	</tr>
	<tr>
		<td>
			<div class="error" style="float:left;margin-right:20px;">
				Error found : <?php echo $this->error_c?> error(s)
			</div>
			<div class="warning" style="float:left;margin-right:20px;">
				Warning found : <?php echo $this->warning_c?> warning(s)
			</div>		
		</td>		
		<td align="right">
			<div style="text-align:right;">
			<?php echo JText::_("Display")?>
			<?php echo $this->errorlist->select;?>
			</div>
		</td>
	</tr>
</table>
<table width="100%" class="adminlist" cellpadding="0" cellspacing="0">	
	<thead>
		<tr>
			<th width="4%">#</th>
			<th width="4%"><input id="chkCheckAll" type="checkbox" name="toggle" value="" onclick="checkAllError(this.checked);" /></th>
			<th colspan="2"><?php echo JText::_('Type')?></th>
			<th><?php echo JText::_('Message')?></th>
			<th><?php echo JText::_("Status")?></th>
			<th width="3">Repair</th>
		</tr>
	</thead>
	<tbody>
	<?php
		$index = 0;
		foreach ($this->errorlist->error as $table_field => $error)
		{					
			$table_name = '';
			$field_name = '';
			$dir = '';
			if($error == _FS_DIR_NOT_EXISTS)
			{
				$dir = substr($table_field,5);
				//echo "dddddddddddddddddd";
			}
			else 
			{
				$array = explode("$$$", $table_field);
				$table_name = $array[0];
				$field_name = isset($array[1])?$array[1]:"";
			}
			{
		$rowspan = ($this->errorlist->fix[$table_field])?'rowspan="2"':"";
	?>
		<tr id="row_<?php echo $index?>" class="<?php echo ($error==_FS_TABLE_NOT_EXISTS||$error==_FS_COLUMN_NOT_EXISTS||$error==_FS_DIR_NOT_EXISTS ||$error==_FS_COLUMN_EXCESS)?"error":"warning"?>">
			<td <?php echo $rowspan?> align="right" style="color:#999999;"><?php echo $index+1?></td>
			<td <?php echo $rowspan?> align="center"><input id="checkbox_<?php echo $index?>" type="checkbox"  onclick="isChecked(this.checked);"></td>
			<td <?php echo $rowspan?> align="right" valign="middle" style="border-right:0px solid red;">
				<?php 
				if($error==_FS_TABLE_NOT_EXISTS||$error==_FS_COLUMN_NOT_EXISTS||$error==_FS_COLUMN_EXCESS)
				{
				?>
				<img src="<?php echo "components/com_obsuggest/assets/images/icons/error_icon.png"?>" width="16" height="16">
				</td>
				<td <?php echo $rowspan?>>
				Error
				<?php 
				}
				elseif ($error==_FS_DIR_NOT_EXISTS)
				{
				?>
				<img src="<?php echo "components/com_obsuggest/assets/images/icons/error_icon.png"?>" width="16" height="16">
				</td>
				<td <?php echo $rowspan?>>
				Error
				<?php 
				}
				else 
				{
				?>
				<img src="<?php echo "components/com_obsuggest/assets/images/icons/warning_icon.jpg"?>" width="16" height="16">
				</td>
				<td <?php echo $rowspan?>>
				Warning
				<?php 
				}
				?>
			</td>
			<td align="left">
			<?php 
				if($error==_FS_TABLE_NOT_EXISTS)
				{
					echo "Table [" . $table_name . "] does not exists in database";
				}
				elseif ($error == _FS_COLUMN_NOT_EXISTS)
				{
					echo "Column [" . $field_name . "] does not exists in table [" . $table_name . "]";
				}
				elseif($error == _FS_COLUMN_EXCESS){
					echo "Column [" . $field_name . "] is excess in table [" . $table_name . "]";
				}
				elseif ($error == _FS_DIR_NOT_EXISTS)
				{
					echo "Directory [" . substr($table_field,5) . "] is not exists!";
				}
				elseif ($error == _FS_DIR_NOT_WRITEABLE)
				{
					echo "Directory [" . substr($table_field,5) . "] is not writeable! ";
					echo "Please contact to administrator.";
				}
				else{
					echo "Data type of column [" . $field_name . "] in table [" . $table_name . "] does not match";
				}
			?></td>
			<td id="status_<?php echo $index?>" align="center">Not repair</td>
			<td align="center">
			<?php 
				if($error == _FS_DIR_NOT_EXISTS)
				{
			?>
				<input id="button_<?php echo $index?>" type="button" value="Repair" onclick="repairDir('<?php echo $dir?>','<?php echo $index?>')">
			<?php 	
				}
				elseif($error == _FS_DIR_NOT_WRITEABLE)
				{
					
				}
				else {
			?>
				<input id="button_<?php echo $index?>" type="button" value="Repair" onclick="repair('<?php echo $table_name?>','<?php echo $field_name?>','<?php echo $error?>', '<?php echo $index?>')">
			<?php 	
				}
			?>	
			</td>
		</tr>
		<?if($this->errorlist->fix[$table_field]){?>
		<tr>
			<td colspan="3">
				<table width="100%" style="font-size:10px;background-color:#FFFFCC;" cellpadding="0" cellspacing="0">			
					<tr>
						<td colspan="3" style="">
						<?php 
						if($error == _FS_COLUMN_NOT_EXISTS)
							echo JText::_("Recommend! We found some column with name like. You can rename it if you sure.");
						else if($error == _FS_DIR_NOT_EXISTS)
							echo JText::_("Recommend! We found some folder with name like. You can rename it if you sure.");
						?>
						</td>
					</tr>		
				<?php 			
				//if($this->errorlist->fix[$table_field])
				{
					$index_child=0;
					foreach ($this->errorlist->fix[$table_field] as $key=>$val)
					{
						$index_child++;
					?>
					<tr>
						<td width="30"></td>
						<td width="100"><?php echo $val?></td>
						<td align="left">
						<?php 
							if($error == _FS_DIR_NOT_EXISTS)
							{
						?>
							<input type="button" value="Rename it!" id="button_<?php echo $index?>_child_<?php echo $index_child?>" onclick="repairDir('<?php echo $dir?>','<?php echo $index?>', '<?php echo $val?>')">							
						<?php 	
							}
							elseif($error == _FS_DIR_NOT_WRITEABLE)
							{
							}
							else {
						?>
							<input type="button" value="Rename it!" id="button_<?php echo $index?>_child_<?php echo $index_child?>" onclick="repair('<?php echo $table_name?>','<?php echo $field_name?>','<?php echo $error?>', '<?php echo $index?>','<?php echo $val?>')">							
						<?php 	
							}
						?>	
							
						</td>
					</tr>
					<?php 
					}
				}
				?>
				</table>
			</td>
		</tr>
		<?}?>
	<?php	
			$index++;
			}				
		}
		//print_r($this->errorlist->fix);
	?>
	</tbody>
	<tfoot>
		<td colspan="7">
			<?php echo $this->errorlist->pageNav->getListFooter(); ?>
		</td>
	</tfoot>
</table>
<?php 
}
else 
{
?>
<div style="text-align:center;"><?php echo JText::_("System has been checked your database and no error or warning found!")?></div>
<?php 
}
?>
