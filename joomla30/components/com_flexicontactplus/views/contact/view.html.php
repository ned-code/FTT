<?php
/********************************************************************
Product		: FlexicontactPlus
Date		: 30 September 2013
Copyright	: Les Arbres Design 2010-2013
Contact		: http://extensions.lesarbresdesign.info
Licence		: GNU General Public License
*********************************************************************/
defined('_JEXEC') or die('Restricted Access');

class FlexicontactplusViewContact extends JViewLegacy
{

// -------------------------------------------------------------------------------
// Draws the contact page - this is called from a menu item
//
function display($tpl = null)
{
	if (FCP_trace::tracing())
		FCP_trace::trace("Config Data:\n------------\n".print_r($this->config_data,true));

	if (LAFC_JVERSION == 150)
		{
		$this->config_data->show_page_heading = $this->menu_params->get('show_page_title', '0');	// Page Display Options
		$this->config_data->page_heading = $this->menu_params->get('page_title', '');				// Page Display Options
		}
	else
		{
		$this->config_data->show_page_heading = $this->menu_params->get('show_page_heading', '0');	// Page Display Options
		$this->config_data->page_heading = $this->menu_params->get('page_heading', '');				// Page Display Options
		}
		
	$this->config_data->page_title = $this->menu_params->get('page_hdr', '');						// Basic Options
	$this->config_data->pageclass_sfx = $this->menu_params->get('pageclass_sfx', '');				// Page Display Options

// the view always puts the whole page in a div of class "fcp_page", plus the page class suffix

	echo "\n".'<div class="fcp_page'.$this->config_data->pageclass_sfx.'">';

// if there is a page heading in Page Display Options, draw it in H1

	if (($this->config_data->show_page_heading) and ($this->config_data->page_heading != ''))
		echo "\n<h1>".$this->config_data->page_heading.'</h1>';
		
// if there is a page title in Basic Options, draw it in H2

	if ($this->config_data->page_title != '')
		echo "\n<h2>".$this->config_data->page_title.'</h2>';
		
// top text

	if (!empty($this->config_data->top_text))
		{
		JPluginHelper::importPlugin('content');
		$top_text = JHtml::_('content.prepare', $this->config_data->top_text);
		echo "\n".'<div id="fcp_top" class="fcp_top">'.$top_text.'</div>';
		}
		
// the form

	if (!isset($this->errors))
		$this->errors = array();
	echo self::draw_page($this->config_data, $this->data, $this->errors);

// bottom text

	if (!empty($this->config_data->bottom_text))
		{
		JPluginHelper::importPlugin('content');
		$bottom_text = JHtml::_('content.prepare', $this->config_data->bottom_text);
		echo "\n".'<div id="fcp_bottom" class="fcp_bottom">'.$bottom_text.'</div>';
		}
	
	echo "\n</div>";
}

// -------------------------------------------------------------------------------
// Draws the input form - this is also called by the plugin
//
static function draw_page($config_data, $data)
{
// load our css

	FCP_Common::load_assets($config_data);

// Are we going to show Captcha or not?

	$user = JFactory::getUser();	
	if ($config_data->show_captcha == 0)
		{
		if ($user->guest)
			$config_data->show_captcha = 1;
		else
			$config_data->show_captcha = 0;
		}
	
// display the input form

	$html  = "\n".'<div id="fcp_wrapper" class="fcp_wrapper">';
	$html .= "\n".'<span id="fcp_err_top"></span>';
	
// start the form - we don't care about the action url because we never submit the form

	$html .= "\n".'<form name="fcp_form" id="fcp_form" class="fcp_form" action="#" method="post" >';
	$html .= "\n".'<input type="hidden" name="config_id" id="config_id" value="'.$config_data->id.'" />';
	$html .= "\n".JHTML::_('form.token');

// display the user defined fields

	$div_open = false;
	$fieldset_open = false;
	foreach ($config_data->all_fields as $field_index => $field)
		{
		$field->id = sprintf('field%03d',$field_index);
		$field->div_id = sprintf('fcp_div%03d',$field_index);
		$field->error_id = sprintf('fcp_err%03d',$field_index);
			
		// if the line div is open and we are about to draw a field that is not a horizontal checkbox, close the div
		
		if ($div_open and ($field->field_type != LAFC_FIELD_CHECKBOX_H))
			{
			$html .= "\n".'</div>';
			$div_open = false;
			}
		
		// fixed texts will leave the line div open
		
		if ($field->field_type == LAFC_FIELD_FIXED_TEXT)
			$div_open = true;

		// is it a fieldset?
		
		if ($field->field_type == LAFC_FIELD_FIELDSET_START)
			{
			if ($fieldset_open)						// if a fieldset was already open
				$html .= "\n".'</fieldset>';		// close it
			$fieldset_open = true;
			}
		if ($field->field_type == LAFC_FIELD_FIELDSET_END)
			$fieldset_open = false;

		$html .= self::draw_field($field, $data, $config_data);
		}

	if ($div_open)
		{
		$html .= "\n".'</div>';
		$div_open = false;
		}

// the "send me a copy" checkbox

	if ($config_data->show_copy == LAFC_COPYME_CHECKBOX)
		{
		$html .= "\n".'<div class="fcp_line fcp_copy_me fcp_checkbox fcp_checkbox_l">';
		$html .= "\n".'<input type="checkbox" class="fcp_lcb" name="show_copy" id="show_copy" value="1" />';
		$html .= "\n".'<label for="show_copy" class="fcp_lcb">'.JText::_('COM_FLEXICONTACT_COPY_ME').'</label>';
		$html .= "\n".'</div>';
		}

// the agreement required checkbox

	$send_button_state = '';
	if ($config_data->agreement_prompt != '')
		{
		$send_button_state = 'disabled="disabled"';
		$onclick = ' onclick="if(this.checked==true){form.fcp_send_button.disabled=false;}else{form.fcp_send_button.disabled=true;}"';
		$checkbox = '<input type="checkbox" class="fcp_lcb" name="agreement_check" id="agreement_check" value="1" '.$onclick.'/>';
		if (($config_data->agreement_name != '') and ($config_data->agreement_link != ''))
			{
			$popup = 'onclick="window.open('."'".$config_data->agreement_link."', 'fcagreement', 'width=640,height=480,scrollbars=1,location=0,menubar=0,resizable=1'); return false;".'"';
			$link_text = $config_data->agreement_prompt.' '.JHTML::link($config_data->agreement_link, $config_data->agreement_name, 'target="_blank" '.$popup);
			}
		else
			$link_text = $config_data->agreement_prompt;
		$html .= "\n".'<div class="fcp_line fcp_agreement fcp_checkbox fcp_checkbox_l">';
		$html .= "\n".$checkbox;
		$html .= "\n".'<label for="agreement_check" class="fcp_lcb">'.$link_text.'</label>';
		$html .= "\n".'</div>';
		}

// the magic word

	if (($config_data->show_captcha == 1) and ($config_data->magic_word != ''))
		{
		$html .= "\n".'<div class="fcp_line fcp_magic">';
		$html .= "\n".'<label><span class="fcp_mandatory">'.$config_data->magic_word_prompt.'</span></label>';
		$html .= "\n".'<input type="text" name="fcp_magic" id="fcp_magic" value="" />';
		$html .= "\n".'<span id="fcp_err_magic"></span>';
		$html .= "\n".'</div>';
		}

// the image captcha

	if (($config_data->show_captcha == 1) and ($config_data->num_images > 0))
		{
		require_once(LAFC_HELPER_PATH.'/flexi_captcha.php');
		$html .= "\n".'<div class="fcp_line fcp_image_outer" id="fcp_image_outer" >';
		$html .= Flexi_captcha::show_image_captcha($config_data);
		$html .= "\n".'</div>';
		}
		
// the SecureImage captcha

	if (($config_data->show_captcha == 1) and ($config_data->secure_captcha > 0))
		{
		require_once(LAFC_HELPER_PATH.'/secure_captcha.php');
		$html .= Secure_captcha::show_secure_captcha($config_data);
		}
		
// reCAPTCHA

	if (($config_data->show_captcha == 1) and ($config_data->recaptcha_theme > 0))
		{
		switch ($config_data->recaptcha_theme)
			{
			case RECAPTCHA_RED: $theme_name = 'red'; break;
			case RECAPTCHA_WHITE: $theme_name = 'white'; break;
			case RECAPTCHA_BLACKGLASS: $theme_name = 'blackglass'; break;
			case RECAPTCHA_CLEAN: $theme_name = 'clean'; break;
			}
		$html .= '<script type="text/javascript">var RecaptchaOptions = {theme:'."'".$theme_name."'".'};</script>';
		require_once(LAFC_HELPER_PATH.'/recaptchalib.php');
		$uri = JURI::getInstance();
		$ssl = (strtolower($uri->getScheme()) == 'https');
		$html .= "\n".'<div class="fcp_line fcp_recaptcha">';
		$html .= "\n".'<label>&nbsp;</label>';
		$html .= "\n".recaptcha_get_html($config_data->recaptcha_public_key, null, $ssl, $config_data->recaptcha_language);
		$html .= "\n".'<span id="fcp_err_recap"></span>';
		$html .= "\n".'</div>';
		}
		
// the send button

	$html .= "\n".'<div class="fcp_line fcp_sendrow">';
	$js = "if (!window.MooTools) alert('".JText::_('COM_FLEXICONTACT_MOOTOOLS_NOT')."');";
	$html .= "\n".'<input type="submit" class="button" id="fcp_send_button" name="fcp_send_button" '.$send_button_state.' 
		value="'.JText::_('COM_FLEXICONTACT_SEND_BUTTON').'" onclick="'.$js.'" />';
	$html .= "\n".'<div id="fcp_spinner" style="display:inline-block"></div>';
	$html .= "\n</div>";	// fcp_sendrow

// if a fieldset is left open at the end of the user defined fields, we close it here

	if ($fieldset_open)
		{
		$html .= "\n".'</fieldset>';
		$fieldset_open = false;
		}
	
	$html .= "\n</form>";	// form
	$html .= "\n".'<div style="clear:both"></div>';
	$html .= "\n</div>";	// fcp_wrapper
	if (FCP_trace::tracing())
		FCP_trace::trace("Generated Html:\n---------------\n".$html);
	return $html;
}

// -------------------------------------------------------------------------------
// draw a user defined field
//
static function draw_field($field, $data, $config_data)
{
	$html = '';
	$div_id = $field->div_id;
	$field_id = $field->id;
	$error_id = $field->error_id;
	
	if (!$field->visible)					// Should only apply to the Subject field
		{
		$html = '';
		return $html;
		}
	
	if (!empty($field->tooltip))
		{
		$title = ' title="'.$field->tooltip.'" ';
		$field_class = ' class="hasTip"';
		}
	else
		{
		$field_class = '';
		$title = '';
		}
		
	switch ($field->field_type)
		{
		case LAFC_FIELD_FROM_ADDRESS:
		case LAFC_FIELD_FROM_NAME:
		case LAFC_FIELD_SUBJECT:
		case LAFC_FIELD_TEXT:
		case LAFC_FIELD_REGEX:
			if ($field->css_class == '')
				$html .= "\n".'<div class="fcp_line fcp_text" id="'.$div_id.'">';
			else
				$html .= "\n".'<div class="fcp_line '.$field->css_class.'" id="'.$div_id.'">';
			$html .= self::draw_label($field);
			$size = self::size($field->width);
			$html .= "\n".'<input type="text" '.$field_class.$size.' name="'.$field_id.'" id="'.$field_id.'" 
				value="'.$data->$field_id.'"'.$title.' />';
			$html .= '<span id="'.$error_id.'"></span>';
			$html .= "\n".'</div>';
			break;
			
		case LAFC_FIELD_TEXT_NUMERIC:
			if ($field->css_class == '')
				$html .= "\n".'<div class="fcp_line fcp_text fcp_numeric" id="'.$div_id.'">';
			else
				$html .= "\n".'<div class="fcp_line '.$field->css_class.'" id="'.$div_id.'">';
			$html .= self::draw_label($field);
			$size = self::size($field->width);
			$html .= "\n".'<input type="text" '.$field_class.$size.' name="'.$field_id.'" id="'.$field_id.'" 
				value="'.$data->$field_id.'" onkeypress="return numbersOnly(event)"'.$title.' />';
			$html .= '<span id="'.$error_id.'"></span>';
			$html .= "\n".'</div>';
			break;
			
		case LAFC_FIELD_TEXTAREA:
			if ($field->css_class == '')
				$html .= "\n".'<div class="fcp_line fcp_textarea" id="'.$div_id.'">';
			else
				$html .= "\n".'<div class="fcp_line '.$field->css_class.'" id="'.$div_id.'">';
			$html .= self::draw_label($field);
			$size = self::size($field->width, 'cols');
			$html .= "\n".'<textarea name="'.$field_id.'" id="'.$field_id.'" '.$field_class.' rows="'.$field->height.'"'.$size.'>'.$data->$field_id.'</textarea>';
			$html .= '<span id="'.$error_id.'"></span>';
			$html .= "\n".'</div>';
			break;
			
		case LAFC_FIELD_LIST:
			if ($field->css_class == '')
				$html .= "\n".'<div class="fcp_line fcp_list" id="'.$div_id.'">';
			else
				$html .= "\n".'<div class="fcp_line '.$field->css_class.'" id="'.$div_id.'">';
			$html .= self::draw_label($field);
			$list_array = FCP_Common::split_list($field->list_list, $field->delimiter);
			$list_html = FCP_Common::make_list($field_id, $data->$field_id, $list_array['LEFT'], 0, $field_class);
			$html .= "\n".$list_html;
			$html .= '<span id="'.$error_id.'"></span>';
			$html .= "\n".'</div>';
			break;
			
		case LAFC_FIELD_RECIPIENT:
			if ($field->css_class == '')
				$html .= "\n".'<div class="fcp_line fcp_list" id="'.$div_id.'">';
			else
				$html .= "\n".'<div class="fcp_line '.$field->css_class.'" id="'.$div_id.'">';
			$html .= self::draw_label($field);
			$list_array = FCP_Common::split_list($field->list_list, ';', $field->delimiter);
			$list_html = FCP_Common::make_list($field_id, $data->$field_id, $list_array['LEFT'], 0, $field_class);
			$html .= "\n".$list_html;
			$html .= '<span id="'.$error_id.'"></span>';
			$html .= "\n".'</div>';
			break;
			
		case LAFC_FIELD_CHECKBOX_L:
			if ($field->css_class == '')
				$html .= "\n".'<div class="fcp_line fcp_checkbox fcp_checkbox_l" id="'.$div_id.'">';
			else
				$html .= "\n".'<div class="fcp_line '.$field->css_class.'" id="'.$div_id.'">';
			if ($data->$field_id)
				$checked = 'checked = "checked"';
			else
				$checked = '';
			$checkbox = '<input type="checkbox" class="fcp_lcb" name="'.$field_id.'" id="'.$field_id.'" value="1" '.$checked.'/>';
			$html .= "\n".$checkbox;
			$html .= self::draw_label($field,'fcp_lcb');
			$html .= '<span id="'.$error_id.'"></span>';
			$html .= "\n".'</div>';
			break;
			
		case LAFC_FIELD_CHECKBOX_R:
			if ($field->css_class == '')
				$html .= "\n".'<div class="fcp_line fcp_checkbox fcp_checkbox_r" id="'.$div_id.'">';
			else
				$html .= "\n".'<div class="fcp_line '.$field->css_class.'" id="'.$div_id.'">';
			$html .= self::draw_label($field);
			if ($data->$field_id)
				$checked = 'checked = "checked"';
			else
				$checked = '';
			$html .= "\n".'<input type="checkbox" '.$field_class.' name="'.$field_id.'" id="'.$field_id.'" value="1" '.$checked.'/>';
			$html .= '<span id="'.$error_id.'"></span>';
			$html .= "\n".'</div>';
			break;
			
		case LAFC_FIELD_CHECKBOX_H:
			if ($field->css_class == '')
				$html .= "\n".'<span class="fcp_checkbox fcp_checkbox_h" id="'.$div_id.'">';
			else
				$html .= "\n".'<span class="fcp_ufield '.$field->css_class.'" id="'.$div_id.'">';
			if ($data->$field_id)
				$checked = 'checked = "checked"';
			else
				$checked = '';
			$checkbox = '<input type="checkbox" '.$field_class.' name="'.$field_id.'" id="'.$field_id.'" value="1" '.$checked.'/>';
			$html .= "\n".$checkbox;
			if ($field->mandatory)
				$html .= "\n".'<span class="fcp_mandatory"><span '.$field_class.'>'.$field->prompt.'</span></span>';
			else
				$html .= "\n".'<span>'.$field->prompt.'</span>';
			$html .= '<span id="'.$error_id.'"></span>';
			$html .= "\n".'</span>';
			break;
			
		case LAFC_FIELD_CHECKBOX_M:
			if ($field->css_class == '')
				$html .= "\n".'<div class="fcp_line fcp_checkbox fcp_checkbox_m" id="'.$div_id.'">';
			else
				$html .= "\n".'<div class="fcp_line '.$field->css_class.'" id="'.$div_id.'">';
			$html .= self::draw_label($field);
			$html .= "\n".'<div class="fcp_checkbox_inner">';
			$list_array = FCP_Common::split_list($field->list_list, $field->delimiter);
			$html .= self::make_checkbox_list($field_id, $list_array['LEFT']);
			$html .= "\n".'</div>';
			$html .= '<span id="'.$error_id.'"></span>';
			$html .= "\n".'</div>';
			break;

		case LAFC_FIELD_FIXED_TEXT:
			if ($field->css_class == '')
				$html .= "\n".'<div class="fcp_line fcp_fixed_text" id="'.$div_id.'">';
			else
				$html .= "\n".'<div class="fcp_line '.$field->css_class.'" id="'.$div_id.'">';
			$html .= self::draw_label($field);
			$html .= "\n".'<span>'.$field->default_value.'</span>';
			// note that we do not end the div
			// because there might be horizontal checkboxes that need to go in it
			break;

		case LAFC_FIELD_DATE:
			require_once(LAFC_HELPER_PATH.'/date_pickers.php');
			if ($field->css_class == '')
				$html .= "\n".'<div class="fcp_line fcp_date" id="'.$div_id.'">';
			else
				$html .= "\n".'<div class="fcp_line '.$field->css_class.'" id="'.$div_id.'">';
			$html .= self::draw_label($field);
			$html .= FCP_date_picker::make_date_field($config_data, $field_id, $data->$field_id);
			$html .= '<span id="'.$error_id.'"></span>';
			$html .= "\n".'</div>';
			break;
			
		case LAFC_FIELD_FIELDSET_START:
			if ($field->prompt == '')
				$legend = '';
			else
				$legend = '<legend>'.$field->prompt.'</legend>';
				
			$size = self::size($field->width);
			if ($field->css_class == '')
				$html .= "\n".'<fieldset class="fcp_fieldset"'.$size.'>'.$legend;
			else
				$html .= "\n".'<fieldset class="fcp_fieldset '.$field->css_class.$size.'">'.$legend;
			break;

		case LAFC_FIELD_FIELDSET_END:
			$html .= "\n".'</fieldset>';
			break;

		case LAFC_FIELD_RADIO_H:
			if ($field->css_class == '')
				$html .= "\n".'<div class="fcp_line fcp_radio" id="'.$div_id.'">';
			else
				$html .= "\n".'<div class="fcp_line '.$field->css_class.'" id="'.$div_id.'">';
			$html .= self::draw_label($field);
			$html .= "\n".'<div class="fcp_radio_h_inner">';
			$list_array = FCP_Common::split_list($field->list_list, ';', $field->delimiter);
			$html .= self::make_radio_list($field_id, $data->$field_id, $list_array['LEFT'], 'fcp_radio_h');
			$html .= "\n".'</div>';
			$html .= '<span id="'.$error_id.'"></span>';
			$html .= "\n".'</div>';
			break;
			
		case LAFC_FIELD_RADIO_V:
			if ($field->css_class == '')
				$html .= "\n".'<div class="fcp_line fcp_radio" id="'.$div_id.'">';
			else
				$html .= "\n".'<div class="fcp_line '.$field->css_class.'" id="'.$div_id.'">';
			$html .= self::draw_label($field);
			$html .= "\n".'<div class="fcp_radio_v_inner">';
			$list_array = FCP_Common::split_list($field->list_list, ';', $field->delimiter);
			$html .= self::make_radio_list($field_id, $data->$field_id, $list_array['LEFT'], 'fcp_radio_v');
			$html .= "\n".'</div>';
			$html .= '<span id="'.$error_id.'"></span>';
			$html .= "\n".'</div>';
			break;

		case LAFC_FIELD_PASSWORD:
			if ($field->css_class == '')
				$html .= "\n".'<div class="fcp_line fcp_password" id="'.$div_id.'">';
			else
				$html .= "\n".'<div class="fcp_line '.$field->css_class.'" id="'.$div_id.'">';
			$html .= self::draw_label($field);
			$size = self::size($field->width);
			$html .= "\n".'<input type="password" '.$field_class.$size.' name="'.$field_id.'" id="'.$field_id.'" 
				value="'.$data->$field_id.'"'.$title.' />';
			$html .= '<span id="'.$error_id.'"></span>';
			$html .= "\n".'</div>';
			break;
		}
		
	return $html;
}

// -------------------------------------------------------------------------------
// draw a field label
//
static function draw_label($field, $extra='')
{
	$prompt = $field->prompt;
	if ($prompt == '')				// if the prompt is an empty string ..
		$prompt = '&nbsp;';			// .. make it a non-breaking space to give it width

	if (($field->field_type == LAFC_FIELD_FIXED_TEXT) 
	or  ($field->field_type == LAFC_FIELD_RADIO_H) 
	or  ($field->field_type == LAFC_FIELD_RADIO_V)
	or  ($field->field_type == LAFC_FIELD_CHECKBOX_M))
		$for_id = '';				// don't create the "for" attribute
	else
		$for_id = ' for="'.$field->id.'"';

	if ($extra == '')
		$class_string = '';
	else
		$class_string = ' class="'.$extra.'"';
	
	if ($field->mandatory)
		return "\n".'<label'.$for_id.$class_string.'><span class="fcp_mandatory">'.$prompt.'</span></label>';
	else
		return "\n".'<label'.$for_id.$class_string.'>'.$prompt.'</label>';
}

//-------------------------------------------------------------------------------
// field widths can be:
//    0 or blank => nothing at all
// just a number => html attribute size="number" or cols="number"
//          99px => style="width:99px !important;"
//          99em => style="width:99em !important;"
//           99% => style="width:99% !important;"
//
static function size($width, $attribute='size')
{
	if (empty($width))
		return '';
	if (strpos($width, 'px'))
		return ' style="width:'.$width.' !important;"';
	if (strpos($width, 'em'))
		return ' style="width:'.$width.' !important;"';
	if (strpos($width, '%'))
		return ' style="width:'.$width.' !important;"';
	return ' '.$attribute.'="'.$width.'"';
}

//-------------------------------------------------------------------------------
// Make a set of radio buttons
// $name          : Field name
// $current_value : Current value
// $list          : Array of ID => value items
// $extra         : Javascript or styling to be added to the <input> and <label> tags
//
static function &make_radio_list($name, $current_value, &$items, $css_class='')
{
	$html = '';
	if ($items == null)
		return '';
	foreach ($items as $key => $value)
		{
		$checked = '';
		if ($current_value == $key)
			$checked = 'checked="checked" ';
		$html .= "\n".'<span class="'.$css_class.'">';
		$html .= "\n".'<input type="radio" name="'.$name.'" id="'.$name.$key.'" value="'.$key.'" '.$checked.'/>';
		$html .= "\n".'<label for="'.$name.$key.'"><span>'.$value.'</span></label>';
		$html .= "\n".'</span>';
		}
	return $html;
}

//-------------------------------------------------------------------------------
// Make a set of checkboxes
// $name          : Field name
// $current_value : Current value
// $list          : Array of ID => value items
// $extra         : Javascript or styling to be added to the <input> and <label> tags
//
static function &make_checkbox_list($name, &$items)
{
	$html = '';
	if ($items == null)
		return '';
	foreach ($items as $key => $value)
		{
		$html .= "\n".'<span class="fcp_checkbox_m">';
		$html .= "\n".'<input type="checkbox" name="'.$name.'" id="'.$name.$key.'" value="1"/>';
		$html .= "\n".'<label for="'.$name.$key.'"><span>'.$value.'</span></label>';
		$html .= "\n".'</span>';
		}
	return $html;
}


}
?>
