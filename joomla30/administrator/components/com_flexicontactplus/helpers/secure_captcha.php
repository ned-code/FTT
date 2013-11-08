<?php
/********************************************************************
Product		: FlexicontactPlus
Date		: 1 July 2013
Copyright	: Les Arbres Design 2010-2013
Contact		: http://extensions.lesarbresdesign.info
Licence		: GNU General Public License
*********************************************************************/
defined('_JEXEC') or die('Restricted Access');

class Secure_captcha
{

// -------------------------------------------------------------------------------
// Display the secureimage captcha image and reload button
//
static function show_secure_captcha($config_data)
{
// build the captcha information structure and store it in the session

	$captcha_config = new stdClass();
	$captcha_config->captcha_type = $config_data->secure_captcha;
	$captcha_config->image_height = $config_data->captcha_height;
	$captcha_config->image_width = $config_data->captcha_width;
	$captcha_config->image_bg_color = $config_data->captcha_colour_background;
	$captcha_config->text_color = $config_data->captcha_colour_text;
	$captcha_config->line_color = $config_data->captcha_colour_lines;

	$app = JFactory::getApplication();			// save the captcha configuration option to the session
	$app->setUserState(LAFC_COMPONENT."_securimage_config", $captcha_config);

// construct html

	$s_img_src = JURI::root().'index.php?option=com_flexicontactplus&amp;tmpl=component&amp;task=captcha&amp;r='.rand();
	
	$onclick = 'onclick="document.getElementById('."'captcha_img').src = '".$s_img_src."&amp;r=' + Math.random(); return false".'"';
	
	$captcha_img = '<img class="fcp_captcha_img" src="'.$s_img_src.'" id="captcha_img" 
		height="'.$config_data->captcha_height.'" width="'.$config_data->captcha_width.'" alt="" />';
		
	$reload_image = '<span class="fcp_captcha_reload" '.$onclick.'></span>';

	$html  = "\n".'<div class="fcp_line fcp_captcha">';
	$html .= "\n".'<label>'.$config_data->secure_captcha_prompt.'</label>';
	$html .= "\n".'<div class="fcp_captcha_inner">';
	$html .= "\n".'<input type="text" name="fcp_captcha_code" id="fcp_captcha_code" style="width:90px !important;" maxlength="6" />';
	$html .= "\n".$captcha_img;
	$html .= "\n".$reload_image;
	$html .= "\n".'</div>';
	$html .= "\n".'<span id="fcp_err_captcha"></span>';
	$html .= "\n".'</div>';
	return $html;
}

// -------------------------------------------------------------------------------
// Serve the current captcha image to the browser
//
static function show_image()
{
// get the configuration from the session and set the Secureimage parameters

	$app = JFactory::getApplication();
	$captcha_config = $app->getUserState(LAFC_COMPONENT."_securimage_config",'');
	if ($captcha_config == '')
		return;

	require_once(LAFC_HELPER_PATH.'/captcha/securimage.php');
	$s_img = new securimage();

	switch ($captcha_config->captcha_type)
		{
		case CAPTCHA_WORDS_EASY:
			$s_img->captcha_type = Securimage::SI_CAPTCHA_STRING;
			$s_img->num_lines    = 0;
			$s_img->perturbation = 0.75;
			$s_img->noise_level  = 1;
			break;
		case CAPTCHA_WORDS_HARD:
			$s_img->captcha_type = Securimage::SI_CAPTCHA_STRING;
			$s_img->num_lines    = 3;
			$s_img->perturbation = 0.85;
			$s_img->noise_level  = 2;
			break;
		case CAPTCHA_MATHS_EASY:
			$s_img->captcha_type = Securimage::SI_CAPTCHA_MATHEMATIC;
			$s_img->num_lines    = 0;
			$s_img->perturbation = 0.75;
			break;
		case CAPTCHA_MATHS_HARD:
			$s_img->captcha_type = Securimage::SI_CAPTCHA_MATHEMATIC;
			$s_img->num_lines    = 8;
			$s_img->perturbation = 0.85;
			$s_img->noise_level  = 1;
			break;
		}

	$s_img->wordlist_file = 'words.txt';
	$s_img->namespace = LAFC_COMPONENT;
	$s_img->image_height = $captcha_config->image_height;
	$s_img->image_width = $captcha_config->image_width;
	if ($captcha_config->image_bg_color != '')
		$s_img->image_bg_color = new Securimage_Color('#'.$captcha_config->image_bg_color);
	if ($captcha_config->text_color != '')
		$s_img->text_color = new Securimage_Color('#'.$captcha_config->text_color);
	if ($captcha_config->line_color != '')
		$s_img->line_color = new Securimage_Color('#'.$captcha_config->line_color);
	
	$s_img->show();
//	$session->close();
}

// -------------------------------------------------------------------------------
// Check if the user entered the correct code
// returns true for yes
//         false for no
//
static function check($code_entered)
{
	require_once(LAFC_HELPER_PATH.'/captcha/securimage.php');
	$s_img = new securimage();
	$s_img->namespace = LAFC_COMPONENT;
	$ret = $s_img->check($code_entered);
	return $ret;
}

}

?>


