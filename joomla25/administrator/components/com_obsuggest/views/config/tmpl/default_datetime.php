<?php
/**
 * @version		$Id: default_datetime.php 339 2011-06-04 09:46:36Z phonglq $
 * @package		oblangs - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>
<fieldset>
    <legend><?php echo JText::_('DATE').'/'.JText::_('TIME_DISPLAY')?></legend>    	
    <table width="100%">
    	<tr>
        	<td class="key">Value</td>
            <td width="200">
            	<input type="text" style="width:200px;" id="txt_datetime" />                
            </td>
            <td rowspan="2" valign="bottom">
            	<button type="button" id="btn_add_datetime" class="datetime-config">Update</button>
            </td>            
        </tr>
    	<tr>
        	<td class="key"><?php echo JText::_('SHOR_DESCRIPTION')?></td>
			<td width="200"><input type="text" style="width:200px;" id="txt_datetime_desc" /></td>
        </tr>
        <tr>
            <td class="key" valign="top">
                <?php echo JText::_('Censored_words')?>
            </td>
            <td>
            	<div id="contain_datetime_list">
            	<select size="10" style="width:200px;" id="lst_datetime">
				<?php
                    foreach($this->listDatetime as $item){
						if($item->default==1){
                    ?>
                    <option value="<?php echo $item->id;?>" style="font-weight:bold;color:red;" selected="selected"><?php echo $item->description;?></option>
                    <?php
						}else{
					?>
                    <option value="<?php echo $item->id;?>" ><?php echo $item->description;?></option>
                    <?php	
						}
                    }
                ?>
                </select>
            	</div>
            </td>
            <td valign="top" align="left">
                <button type="button" id="btn_remove_datetime" disabled="disabled" class="datetime-config">Remove</button><br />
                <button type="button" id="btn_default_datetime" disabled="disabled" class="datetime-config">Default</button><br />
                <button type="button" id="btn_edit_datetime" disabled="disabled" class="datetime-config">Edit</button><br />
                <button type="button" id="btn_cancel_datetime" disabled="disabled" class="datetime-config">Cancel</button>
            </td>
        </tr>
    </table>
</fieldset>
<script type="text/javascript">
window.addEvent("domready", function(){
	var default_item = $("lst_datetime").value;
	var edit_mode = 0;
	$("btn_add_datetime").addEvent("click", function(){
		var value = $("txt_datetime").value;
		var description = $("txt_datetime_desc").value;
		var url = "index.php?option=com_obsuggest&controller=config&task=addDatetime&value="+value;
		url+="&description="+description+"&format=raw";	
		if(edit_mode==1) url+="&id="+$("lst_datetime").value;
		var req = new Ajax(url,{
			method:'get',			
			onComplete:function(result){
				var list = $("lst_datetime");
				if(edit_mode==0){
					var new_elem = new Element("option");
					new_elem.innerHTML = description;
					new_elem.value = result.trim();
					new_elem.inject($("lst_datetime"));
				}else{
					list.options[list.selectedIndex].innerHTML = description;
				}
				$("btn_cancel_datetime").fireEvent("click");
				edit_mode = 0;
				//$('contain_datetime_list').innerHTML = result;
			}
		}).request();
		
	});
	$("btn_remove_datetime").addEvent("click", function(){
		var url = "index.php?option=com_obsuggest&controller=config&task=removeDatetime&id="+$("lst_datetime").value;
		//alert(url);
		var req = new Ajax(url,{
			method:'get',			
			onComplete:function(result){
				var list = $("lst_datetime");
				list.options[list.selectedIndex].remove();				
			}
		}).request();
	});
	$("btn_default_datetime").addEvent("click", function(){
		var url = "index.php?option=com_obsuggest&controller=config&task=setDefaultDatetime&id="+$("lst_datetime").value;
		var req = new Ajax(url,{
			method:'get',			
			onComplete:function(result){
				var list = $("lst_datetime");
				default_item = list.value;
				for(var i=0; i<list.options.length;i++){
					if(list.options[i].selected) {
						list.options[i].setStyles({"font-weight": "bold", "color": "red"});	
					}else {
						list.options[i].setStyles({"font-weight": "normal", "color": "#000"});
					}		
				}						
			}
		}).request();
	});
	default_item = $("lst_datetime").value;
	function onDatetimeChange(){
		var lst = $("lst_datetime");
		$("btn_edit_datetime").disabled = $("btn_remove_datetime").disabled = $("btn_default_datetime").disabled = (lst.value!=default_item) ? false : true; 
		var url = "index.php?option=com_obsuggest&controller=config&task=getDatetimeInfo&id="+$("lst_datetime").value;
		var req = new Ajax(url,{
			method:'get',			
			onComplete:function(result){
				eval("var obj = "+result);
				$("txt_datetime").value = obj.value;
				$("txt_datetime_desc").value = obj.description;		
			}
		}).request();	
	}
	$("lst_datetime").addEvent("change", onDatetimeChange).fireEvent("click");
	$("btn_edit_datetime").addEvent("click", function(){
		/*var url = "index.php?option=com_obsuggest&controller=config&task=getDatetimeInfo&id="+$("lst_datetime").value;
		var req = new Ajax(url,{
			method:'get',			
			onComplete:function(result){
				eval("var obj = "+result);
				$("txt_datetime").value = obj.value;
				$("txt_datetime_desc").value = obj.description;		
			}
		}).request();		
		*/
		$("btn_edit_datetime").disabled = $("btn_remove_datetime").disabled = $("btn_default_datetime").disabled = $("lst_datetime").disabled = true; 
		$("btn_cancel_datetime").disabled = false;
		edit_mode = 1;
	})
	$("btn_cancel_datetime").addEvent("click", function(){
		$("btn_edit_datetime").disabled = $("btn_remove_datetime").disabled = $("btn_default_datetime").disabled = $("lst_datetime").disabled = false; 
		$("btn_cancel_datetime").disabled = true;
		//$("txt_datetime").value = $("txt_datetime_desc").value = '';		
		edit_mode = 0;
	})
	onDatetimeChange();
})
</script>