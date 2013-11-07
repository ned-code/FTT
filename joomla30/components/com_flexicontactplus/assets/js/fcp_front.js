function fcp_setup()
{
var inputs=$$('input');
for(var i=0;i<inputs.length;i++)
{
if(inputs[i].type=='radio')
continue;
if(inputs[i].type=='submit')
continue;
if(inputs[i].type=='hidden')
continue;
if(inputs[i].className.indexOf('date')>-1)
inputs[i].addEvent('blur',fcp_onchange_handler);
else
inputs[i].addEvent('change',fcp_onchange_handler);
}
var textareas=$$('textarea');
for(var i=0;i<textareas.length;i++)
textareas[i].addEvent('change',fcp_onchange_handler);
fcp_get_element('fcp_send_button').addEvent('click',function(e){fcp_onsubmit_handler(e)});
}
function fcp_onchange_handler()
{
var field_value=encodeURIComponent(this.value);
field_value=field_value.replace(/'/g,"%27");
field_value=encodeURIComponent(field_value);
if(this.type=='checkbox')
{
if(this.checked==true)
field_value=1;
else
field_value=0;
}
var request='&task=validate_field&'+this.name+'='+field_value;
fcp_send_request(request);
}
function fcp_onsubmit_handler(e)
{
var moo=MooTools.version;
if(moo.substring(0,3)=='1.1')
new Event(e).stop();
else
e.stop();
fcp_get_element('fcp_send_button').disabled=true;
fcp_get_element('fcp_spinner').empty().addClass('fcp_spinner');
var request='&task=send';
var inputs=document.getElementById('fcp_form').elements;
var group_done='';
for(var i=0;i<inputs.length;i++)
{
var element=inputs[i];
var field_name=element.name;
var field_value=encodeURIComponent(element.value);
field_value=field_value.replace(/'/g,"%27");
field_value=encodeURIComponent(field_value);
if(element.type=='checkbox')
{
field_name=element.id;
if(element.checked==true)
field_value=1;
else
field_value=0;
}
if(element.type=='radio')
{
if(field_name==group_done)
continue;
var buttons=document.getElementsByName(field_name);
for(var j=0;j<buttons.length;j++)
if(buttons[j].checked==true)
field_value=buttons[j].value;
group_done=field_name;
}
request+='&'+field_name+'='+field_value;
}
fcp_send_request(request);
}
function fcp_send_request(request,optional_url)
{
if(arguments.length==2)
var url=optional_url;
else
{
var config_id=document.getElementById('config_id').value;
var url=fcp_config.site_root+'index.php?option=com_flexicontactplus&format=raw&config_id='+config_id+request;
window.fcp_redirect_count=0;
}
var moo=MooTools.version;
if(moo.substring(0,3)=='1.1')
{
new Ajax(url,{
method:'post',
onComplete:function(responseText)
{
fcp_handle_response(responseText);
}
}).request();
}
else
{
new Request({
url:url,
method:'post',
onSuccess:function(responseText)
{
fcp_handle_response(responseText);
}
}).send();
}
}
function fcp_handle_response(responseText)
{
try{var response=eval('('+responseText+')');}
catch(e)
{
if(responseText.indexOf('url=')>-1)
{
window.fcp_redirect_count++;
if(window.fcp_redirect_count>3)
{
alert('Too many redirects');
return;
}
var url=responseText.replace(/^.*url=/i,'');
var url=url.replace(/\".*$/i,'');
fcp_send_request('',url);
return;
}
document.getElementById('fcp_err_top').innerHTML=responseText;
document.getElementById('fcp_send_button').disabled=false;
document.getElementById('fcp_spinner').removeClass('fcp_spinner');
return;
}
if(response.length==0)
return;
var error_count=0;
var len=response.length;
for(var i=0;i<len;++i)
for(var command in response[i])
{
var command_value=response[i][command];
if(command=='button')
{
document.getElementById('fcp_send_button').disabled=false;
document.getElementById('fcp_spinner').removeClass('fcp_spinner');
continue;
}
if(command=='redirect')
{
window.location=command_value;
return;
}
if(command=='reloadcaptcha')
{
if(typeof Recaptcha!='undefined')
Recaptcha.reload();
continue;
}
if(command=='f_error')
{
element=fcp_get_element(command_value);
if(typeof element=='undefined'||element==null)
continue;
element.removeClass('fcp_error_field');
element.addClass(' fcp_error_field');
continue;
}
if(command=='f_valid')
{
element=fcp_get_element(command_value);
if(typeof element=='undefined'||element==null)
continue;
element.removeClass('fcp_error_field');
continue;
}
if(command=='e_error')
{
element=fcp_get_element(command_value);
if(typeof element=='undefined'||element==null)
continue;
element.removeClass('fcp_error_msg');
element.addClass(' fcp_error_msg');
error_count++;
continue;
}
if(command=='e_valid')
{
element=fcp_get_element(command_value);
if(typeof element=='undefined'||element==null)
continue;
element.removeClass('fcp_error_msg');
element.empty().innerHTML='';
continue;
}
if(command=='hide')
{
element=fcp_get_element(command_value);
if(typeof element=='undefined'||element==null)
continue;
element.style.display='none';
continue;
}
element=fcp_get_element(command);
if(typeof element=='undefined'||element==null)
continue;
element.empty().innerHTML=command_value;
}
if(error_count>0)
{
var moo=MooTools.version;
if(moo.substring(0,3)>'1.2')
{
$$('.hasTip').each(function(el)
{
var title=el.get('title');
if(title)
{
var parts=title.split('::',2);
el.store('tip:title',parts[0]);
el.store('tip:text',parts[1]);
}
}
);
}
var JTooltips=new Tips($$('.fcp_error_msg .hasTip'),{maxTitleChars:50,fixed:false});
}
}
function fcp_image_select(pictureID)
{
var images=document.getElementsByTagName('img');
for(var i=0;i<images.length;i++)
if(images[i].className=='fcp_active')
images[i].className='fcp_inactive';
document.getElementById(pictureID).className='fcp_active';
document.fcp_form.picselected.value=pictureID;
}
function fcp_get_element(element_id)
{
var moo=MooTools.version;
if(moo.substring(0,3)<='1.2')
return $(element_id);
else
return document.id(element_id);
}
function numbersOnly(e)
{
var unicode=e.charCode?e.charCode:e.keyCode;
if(unicode!=8)
{
if(unicode<48||unicode>57)
return false;
}
}