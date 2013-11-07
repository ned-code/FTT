// ********************************************************************
// Product      : FlexiContactPlus
// Date         : 19 July 2013
// Copyright    : Les Arbres Design 2012-2013
// Contact      : http://extensions.lesarbresdesign.info
// Licence      : GNU General Public License
// *********************************************************************
//
function fcp_setup()
{

// add an "onchange" event handler to every input field

    var inputs = $$('input');                                       // must use $$ to extend elements for IE
    for (var i = 0; i < inputs.length; i++)
        {
        if (inputs[i].type == 'radio')                              // skip the types we don't need
            continue;
        if (inputs[i].type == 'submit')
            continue;
        if (inputs[i].type == 'hidden')
            continue;
        if (inputs[i].className.indexOf('date') > -1)
            inputs[i].addEvent('blur', fcp_onchange_handler);       // date picker fields don't fire onchange
        else
            inputs[i].addEvent('change', fcp_onchange_handler);     // for all other fields we prefer onchange
        }

// add an "onchange" event handler to every textarea field
        
    var textareas = $$('textarea');
    for (var i = 0; i < textareas.length; i++)
        textareas[i].addEvent('change', fcp_onchange_handler);
    
 // add an "onclick" event handler to the Send button

    fcp_get_element('fcp_send_button').addEvent('click', function(e){fcp_onsubmit_handler(e)});
}

//-------------------------------------------------------------------------------------
// The "onchange" event handler that gets called when the user changes an input field
// "this" is the html element the user changed
//
function fcp_onchange_handler()
{
    var field_value = encodeURIComponent(this.value);
    field_value = field_value.replace(/'/g, "%27");             // 8.03 - fixes the apostraphe issue introduced by Joomla 2.5.11
    field_value = encodeURIComponent(field_value);              // 8.03.01 - fixes problem with & being decoded after a Joomla 303 redirect
    if (this.type == 'checkbox')
        {
        if (this.checked == true)
            field_value = 1;                                    // checked
        else
            field_value = 0;                                    // not checked
        }
    var request = '&task=validate_field&'+this.name+'='+field_value;
    fcp_send_request(request);
}

//-------------------------------------------------------------------------------------
// The "onclick" event handler that gets called when the user clicks the Send button
// "e" is the MooTools event (we need the cross-browser stop() function)
// Send all input field id's and values to the server
//
function fcp_onsubmit_handler(e)
{
    var moo = MooTools.version;
    if (moo.substring(0,3) == '1.1')
        new Event(e).stop();                                        // this also works in later version
    else
        e.stop();                                                   // this does NOT work in Mootools 1.1
    fcp_get_element('fcp_send_button').disabled=true;
    fcp_get_element('fcp_spinner').empty().addClass('fcp_spinner');               // must use $ to extend element for IE
    var request = '&task=send';
    var inputs = document.getElementById('fcp_form').elements;      // gets inputs and selects
    var group_done = '';
    for (var i = 0; i < inputs.length; i++)
        {
        var element = inputs[i];
        var field_name = element.name;
        var field_value = encodeURIComponent(element.value);
        field_value = field_value.replace(/'/g, "%27");             // 8.03 - fixes the apostraphe issue introduced by Joomla 2.5.11
        field_value = encodeURIComponent(field_value);              // 8.03.01 - fixes problem with & being decoded after a Joomla 303 redirect
        if (element.type == 'checkbox')
            {
            field_name = element.id;                                // use the id for checkboxes
            if (element.checked == true)
                field_value = 1;                                    // checked
            else
                field_value = 0;                                    // not checked
            }
        if (element.type == 'radio')
            {
            if (field_name == group_done)                           // if we have processed this group
                continue;                                           // .. don't do it again
            var buttons = document.getElementsByName(field_name);   // get all the buttons in the group
            for (var j = 0; j < buttons.length; j++)                // and loop through them
                if (buttons[j].checked == true)
                    field_value = buttons[j].value;                 // get the value of the checked button
            group_done = field_name;                                // flag that this group has been processed
            }
        request += '&'+field_name+'='+field_value;
        }
    fcp_send_request(request);
}

//-------------------------------------------------------------------------------------
// Send a request to the server
// if the optional_url is supplied, use it instead of the request parameters
//
function fcp_send_request(request, optional_url)
{
    if (arguments.length == 2)
        var url = optional_url;
    else
        {
        var config_id = document.getElementById('config_id').value;
        var url = fcp_config.site_root+'index.php?option=com_flexicontactplus&format=raw&config_id='+config_id+request;
        window.fcp_redirect_count = 0;
        }
    var moo = MooTools.version;
    if (moo.substring(0,3) == '1.1')
        {                               // for MooTools 1.1 we use an Ajax object
        new Ajax(url, {
            method: 'post',
            onComplete:function(responseText)
                {
                fcp_handle_response(responseText);
                }
            }).request();
        }
    else
        {                               // for MooTools 1.2 and above we use a Request object
        new Request({
            url: url,
            method: 'post',
            onSuccess: function(responseText)
                {
                fcp_handle_response(responseText);
                }
            }).send();
        }
}

//-------------------------------------------------------------------------------------
// Handle a validation response from the server
// - this is a Json message containing a list of element_id's and messages
//   {"field001":"ERROR", "fcp_err001":"Invalid email address"}
//
function fcp_handle_response(responseText)
{
// parse the response string back into an array
// if it's not a Json string output it at the top of the screen
// sometimes we can get a nasty redirect request like this:
//  "<html><head><meta http-equiv="refresh" content="0; url=..." /><meta .../></head><body></body></html>"
//  we handle it but allow a maximum of 3 redirects

    try {var response = eval('('+responseText+')');}
    catch (e) 
        {
        if (responseText.indexOf('url=') > -1)
            {
            window.fcp_redirect_count ++;
            if (window.fcp_redirect_count > 3)
                {
                alert('Too many redirects');                // should never happen...
                return;
                }
            var url = responseText.replace(/^.*url=/i,'');
            var url = url.replace(/\".*$/i,'');
            fcp_send_request('', url);                          // re-issue the request with the redirected url
            return;
            }
        document.getElementById('fcp_err_top').innerHTML = responseText;
        document.getElementById('fcp_send_button').disabled=false;
        document.getElementById('fcp_spinner').removeClass('fcp_spinner');
        return;
        }

    if (response.length == 0)
        return;

// loop through the responses

    var error_count = 0;
    var len = response.length;
    for (var i=0; i<len; ++i)           // [{...},{...},{...}]
    for (var command in response[i])    // {"command":"value","command":"value","element_id":"text"}
        {
        var command_value = response[i][command];
        if (command == 'button')
            {
            document.getElementById('fcp_send_button').disabled=false;
            document.getElementById('fcp_spinner').removeClass('fcp_spinner');
            continue;
            }
            
        if (command == 'redirect')
            {
            window.location = command_value;
            return;
            }
            
        if (command == 'reloadcaptcha')
            {
            if (typeof Recaptcha != 'undefined')
                Recaptcha.reload();
            continue;
            }
            
        if (command == 'f_error')                                                   // add the error class to an input field 
            {
            element = fcp_get_element(command_value);                                             // must use $ to extend element for IE
            if (typeof element == 'undefined' || element == null)
                continue;
            element.removeClass('fcp_error_field');  // in case it's already there
            element.addClass(' fcp_error_field');
            continue;
            }

        if (command == 'f_valid')                                                   // remove the error class from an input field
            {
            element = fcp_get_element(command_value);                                             // must use $ to extend element for IE
            if (typeof element == 'undefined' || element == null)
                continue;
            element.removeClass('fcp_error_field');
            continue;
            }
        
        if (command == 'e_error')                                                   // add the error class to an error message element
            {
            element = fcp_get_element(command_value);                                             // must use $ to extend element for IE
            if (typeof element == 'undefined' || element == null)
                continue;
            element.removeClass('fcp_error_msg');                                   // in case it's already there
            element.addClass(' fcp_error_msg');
            error_count ++;
            continue;
            }
        
        if (command == 'e_valid')                                                   // remove the error class to an error message element
            {
            element = fcp_get_element(command_value);                                             // must use $ to extend element for IE
            if (typeof element == 'undefined' || element == null)
                continue;
            element.removeClass('fcp_error_msg');
            element.empty().innerHTML = '';
            continue;
            }
        
        if (command == 'hide')                                                      // hide an element
            {
            element = fcp_get_element(command_value);                                             // must use $ to extend element for IE
            if (typeof element == 'undefined' || element == null)
                continue;
            element.style.display = 'none';
            continue;
            }
        
        // if it's none of the above, the command is an element id and the value is the content for it
        
            element = fcp_get_element(command);                                                   // must use $ to extend element for IE
            if (typeof element == 'undefined' || element == null)
                continue;
            element.empty().innerHTML = command_value;
        
        }
        
// if there were any errors, re-build the tooltips

    if (error_count > 0)
        {
        var moo = MooTools.version;
        if (moo.substring(0,3) > '1.2')
            {                               // MooTools 1.1 and 1.2 do this internally 
            $$('.hasTip').each(function(el)
                    {
                    var title = el.get('title');
                    if (title) 
                        {
                        var parts = title.split('::', 2);
                        el.store('tip:title', parts[0]);
                        el.store('tip:text', parts[1]);
                        }
                    }
                );
            }
        var JTooltips = new Tips($$('.fcp_error_msg .hasTip'), { maxTitleChars: 50, fixed: false});
        }
}

//-------------------------------------------------------------------------------------
// Highlight images for image captcha
//
function fcp_image_select(pictureID)
{
    var images = document.getElementsByTagName('img');
    for (var i = 0; i < images.length; i++)
        if (images[i].className == 'fcp_active')
            images[i].className = 'fcp_inactive';
    document.getElementById(pictureID).className = 'fcp_active';
    document.fcp_form.picselected.value = pictureID;
}

//-------------------------------------------------------------------------------------
// Get and extend an element
// prior to MooTools 1.2.3 we have no choice, we have to use $()
// with MooTools >= 1.2.3 we can use fcp_get_element() which avoids conficts
//
function fcp_get_element(element_id)
{
    var moo = MooTools.version;
    if (moo.substring(0,3) <= '1.2')
        return $(element_id);
    else
        return document.id(element_id);
}

//-------------------------------------------------------------------------------------
// Only allow numbers to be entered into a field
function numbersOnly(e)
{
    var unicode = e.charCode ? e.charCode : e.keyCode;
    if (unicode != 8)
        {
        if (unicode < 48 || unicode > 57) 
            return false;
        }
}