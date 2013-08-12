<?php
/**
 * @version		$Id: default.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );
global $obIsJ15;
$new_ajax = 'var req = new Ajax(url,{';
$ajax_request = '}).request();';
if( !$obIsJ15 ) {
	$new_ajax = "var req = new Request({'url':url,";
	$ajax_request = '}).send();';
}

?>
<script>
var _complete = 0;
var _all = 0;
var _msg = '';
var _btn_all = true;
function repair(t, f, e, r, rename)
{
	
	enableRow(r, false);
	var url = "index.php?option=com_obsuggest&controller=report";
	url += "&task=repairError";
	url += "&format=raw";
	url += "&t=" + t;
	url += "&f=" + f;
	url += "&e=" + e;
	if(typeof(rename)!='undefined')
	{
		url += "&rename=" + rename;
	}
	setStatus(r, 'Repairing');
	<?php echo $new_ajax; ?>
		method: 'post',
		onComplete: function(txt){
			switch(txt.trim())
			{
				case '1':
					setStatus(r, '<?php echo JText::_("Repaired")?>');
					break;
				default:
					_msg += txt + "\n";
					setStatus(r, '<?php echo JText::_("Fail")?>');
					enableRow(r, true);					
					break;
			}
			_complete++;
			if(_complete==_all || _all == 0)
			{
				document.getElementById('chkCheckAll').checked = false;
				if(_msg=='')
					alert("<?php echo JText::_("Repair successfully!")?>");
				else
					alert("<?php echo JText::_("Repair with some error:")?>"+"\n" + _msg)	
					
				document.getElementById('boxchecked').value = _complete = _all = 0;
				_msg = '';										
			}
		}
	<?php echo $ajax_request; ?>
}
function repairDir(d, r, rename)
{
	
	enableRow(r, false);
	var url = "index.php?option=com_obsuggest&controller=report";
	url += "&task=createDir";
	url += "&format=raw";
	url += "&dir=" + d;	
	if(typeof(rename)!='undefined')
	{
		url += "&rename=" + rename;
	}
	setStatus(r, 'Repairing');
	<?php echo $new_ajax; ?>
		method: 'post',
		onComplete: function(txt){
			switch(txt)
			{
				case '1':
					setStatus(r, '<?php echo JText::_("Repaired")?>');					
					break;
				default:
					_msg += txt + "\n";
					setStatus(r, '<?php echo JText::_("Repair Fail!")?>');
					enableRow(r, true);
					break;
			}
			_complete++;
			if(_complete==_all || _all == 0)
			{
				document.getElementById('chkCheckAll').checked = false;	
				if(_msg=='')
					alert("<?php echo JText::_("Repair successfully!")?>");
				else
					alert("<?php echo JText::_("Repair with some error:")?>"+"\n" + _msg)
					
				_msg = '';
				document.getElementById('boxchecked').value = _complete = _all = 0;
			}
		}
	<?php echo $ajax_request; ?>
}
function enableRow(r, e)
{
	var check = document.getElementById('checkbox_' + r)
	check.disabled = !e;
	if(!e)
		check.checked = false;
	document.getElementById('button_' + r).disabled = !e;
	
	for(var i=0;i<1000;i++)
	{
		var child = document.getElementById('button_' + r + '_child_' + i);
		if(child)
			child.disabled = !e;
	}
}
function setStatus(r, m)
{
	var msg = '<?php echo JText::_("Repairing")?>';
	if(typeof(m) != 'undefined')
		msg = m
	var row = document.getElementById('row_' + r);
	document.getElementById('status_' + r).innerHTML = msg;
	row.className = msg.toLowerCase();
}
//overwrite function submitbutton
function submitbutton(btn)
{
	_all = document.getElementById('boxchecked').value;
	_complete = 0;
	_msg = '';	
	for(var i=0;i<<?php echo $this->errorlist->rows?>;i++)
	{
		var checkbox = document.getElementById('checkbox_'+i);
		if(checkbox.checked)
		{
			var el = document.getElementById('button_' + i);
			if(!el)			
				continue;				
			el.click();	
		}	
	}
}
function checkAllError(checked)
{	
	var all = 0;
	for(var i=0;i<<?php echo $this->errorlist->rows?>;i++)
	{
		var checkbox = document.getElementById('checkbox_'+i);
		if(checkbox)
		{
			if(checkbox.disabled==false)
			{
				checkbox.checked = checked;
				all++;
			}
		}	
	}
	document.getElementById('boxchecked').value = _all = all;
}
</script>
<form name="adminForm" id="adminForm" action="index.php?option=com_obsuggest&controller=report" method="POST">
<?php 
echo $this->loadTemplate('database');	 
?>
<input type="hidden" name="boxchecked" id="boxchecked"  value="0" />
<?php echo JHTML::_( 'form.token' ); ?>
<input type="hidden" id="task" name="task" value="" />
</form>
