<?php
/********************************************************************
Product		: FlexicontactPlus
Date		: 23 February 2013
Copyright	: Les Arbres Design 2010-2013
Contact		: http://extensions.lesarbresdesign.info
Licence		: GNU General Public License
*********************************************************************/

defined('_JEXEC') or die('Restricted Access');

class FlexicontactplusViewConfig_Captcha extends JViewLegacy
{
function display($tpl = null)
{
	FCP_Admin::make_title('COM_FLEXICONTACT_CONFIG_CAPTCHA_NAME', $this->config_data, $this->config_count);
	JToolBarHelper::apply();
	JToolBarHelper::save();
	JToolBarHelper::cancel();

// load the colour picker

	$document = JFactory::getDocument();
	$document->addScript(LAFC_ADMIN_ASSETS_URL.'jscolor.js');

// setup the captcha types

	if (LAFC_JVERSION == 150)
		$none_text = JText::_('NONE');
	else
		$none_text = JText::_('JNONE');
	
	$noise_types = array();
	$noise_types[NOISE_NO]  = JText::_('COM_FLEXICONTACT_NOISE_NO');
	$noise_types[NOISE_1]   = JText::_('COM_FLEXICONTACT_NOISE_MODE').' 1';
	$noise_types[NOISE_2]   = JText::_('COM_FLEXICONTACT_NOISE_MODE').' 2';
	$noise_types[NOISE_3]   = JText::_('COM_FLEXICONTACT_NOISE_MODE').' 3';
	$noise_types[NOISE_4]   = JText::_('COM_FLEXICONTACT_NOISE_MODE').' 4';
	$noise_types[NOISE_5]   = JText::_('COM_FLEXICONTACT_NOISE_MODE').' 5';
	$noise_types[NOISE_RAW] = JText::_('COM_FLEXICONTACT_NOISE_RAW');

	$captcha_types = array();
	$captcha_types[CAPTCHA_NONE] = $none_text;
	$captcha_types[CAPTCHA_WORDS_EASY] = JText::_('COM_FLEXICONTACT_CAPTCHA_WORDS_EASY');
	$captcha_types[CAPTCHA_WORDS_HARD] = JText::_('COM_FLEXICONTACT_CAPTCHA_WORDS_HARD');
	$captcha_types[CAPTCHA_MATHS_EASY] = JText::_('COM_FLEXICONTACT_CAPTCHA_MATHS_EASY');
	$captcha_types[CAPTCHA_MATHS_HARD] = JText::_('COM_FLEXICONTACT_CAPTCHA_MATHS_HARD');

	$recaptcha_themes = array();
	$recaptcha_themes[RECAPTCHA_NONE] = $none_text;
	$recaptcha_themes[RECAPTCHA_RED] = JText::_('COM_FLEXICONTACT_RECAPTCHA_RED');
	$recaptcha_themes[RECAPTCHA_WHITE] = JText::_('COM_FLEXICONTACT_RECAPTCHA_WHITE');
	$recaptcha_themes[RECAPTCHA_BLACKGLASS] = JText::_('COM_FLEXICONTACT_RECAPTCHA_BLACKGLASS');
	$recaptcha_themes[RECAPTCHA_CLEAN] = JText::_('COM_FLEXICONTACT_RECAPTCHA_CLEAN');

	?>
	<form action="index.php" method="post" name="adminForm" id="adminForm" >
	<input type="hidden" name="option" value="<?php echo LAFC_COMPONENT; ?>" />
	<input type="hidden" name="controller" value="menu" />
	<input type="hidden" name="task" value="" />
	<input type="hidden" name="config_id" value="<?php echo $this->config_data->id; ?>" />
	<input type="hidden" name="view" value="config_captcha" />
	<input type="hidden" name="config_base_view" value="<?php echo $this->config_base_view; ?>" />
	<?php
	
// Show Captcha if User Logged In

	echo "\n".'<table class="fc_table">';
	echo "\n<tr>";
		echo '<td colspan="2" class="prompt">'.JText::_('COM_FLEXICONTACT_SHOW_CAPTCHA').'</td>';
		echo '<td>'.FCP_Common::make_radio('show_captcha',$this->config_data->config_data->show_captcha).'</td>';
	echo "\n</tr>";

	echo "\n".'<tr><td colspan="3"><hr /></td></tr>';

// Magic Word

	echo "\n<tr>";
		echo '<td>'.JHTML::_('image', LAFC_ADMIN_ASSETS_URL.'captcha3.gif','', 'style="vertical-align:middle"').'</td>';
		echo '<td class="prompt">'.JText::_('COM_FLEXICONTACT_V_MAGIC_WORD').'</td>';
		echo '<td><input type="text" size="30" name="magic_word" value="'.$this->config_data->config_data->magic_word.'" />';
		echo ' '.FCP_Admin::make_info(JText::_('COM_FLEXICONTACT_V_MAGIC_WORD_DESC')).'</td>';
	echo "\n</tr>";
	echo "\n<tr>";
		echo '<td></td>';
		echo '<td class="prompt">'.JText::_('COM_FLEXICONTACT_MAGIC_WORD_LABEL').'</td>';
		echo '<td><input type="text" size="40" name="magic_word_prompt" value="'.$this->config_data->config_data->magic_word_prompt.'" /></td>';
	echo "\n</tr>";

	echo "\n".'<tr><td colspan="3"><hr /></td></tr>';

// Our Image Captcha

	$noise_type_list = FCP_Common::make_list('noise', $this->config_data->config_data->noise, $noise_types);
	echo "\n<tr>";
		echo '<td>'.JHTML::_('image', LAFC_ADMIN_ASSETS_URL.'captcha2.gif','', 'style="vertical-align:middle"').'</td>';
		echo '<td class="prompt">'.JText::_('COM_FLEXICONTACT_V_CAPTCHA_NUMBER').'</td>';
		echo '<td>';
			echo '<input type="text" size="4" name="num_images" value="'.$this->config_data->config_data->num_images.'" />';
			echo ' '.FCP_Admin::make_info(JText::_('COM_FLEXICONTACT_V_CAPTCHA_DESC'));
			echo '&nbsp;&nbsp;'.JText::_('COM_FLEXICONTACT_V_HEIGHT');
			echo ' <input type="text" size="4" name="image_height" value="'.$this->config_data->config_data->image_height.'" />';
			echo '&nbsp;&nbsp;'.JText::_('COM_FLEXICONTACT_V_WIDTH');
			echo ' <input type="text" size="4" name="image_width" value="'.$this->config_data->config_data->image_width.'" />';
		echo '</td>';
	echo "\n</tr>";
	echo "\n<tr>";
		echo '<td></td>';
		echo '<td class="prompt">'.JText::_('COM_FLEXICONTACT_CONFIG_NOISE').'</td>';
		echo '<td>'.$noise_type_list.'</td>';
	echo "\n</tr>";

	echo "\n".'<tr><td colspan="3"><hr /></td></tr>';

// SecureImage Captcha

	$captcha_type_list = FCP_Common::make_list('secure_captcha', $this->config_data->config_data->secure_captcha, $captcha_types);
	echo "\n<tr>";
		echo '<td>'.JHTML::_('image', LAFC_ADMIN_ASSETS_URL.'captcha1.gif','', 'style="vertical-align:middle"').'</td>';
		echo '<td class="prompt">'.JText::_('COM_FLEXICONTACT_SECURE_CAPTCHA').'</td>';
		echo '<td>';
			echo $captcha_type_list;
			echo '&nbsp;&nbsp;'.JText::_('COM_FLEXICONTACT_V_HEIGHT');
			echo ' <input type="text" size="4" name="captcha_height" value="'.$this->config_data->config_data->captcha_height.'" />';
			echo '&nbsp;&nbsp;'.JText::_('COM_FLEXICONTACT_V_WIDTH');
			echo ' <input type="text" size="4" name="captcha_width" value="'.$this->config_data->config_data->captcha_width.'" />';
		echo '</td>';
	echo "\n</tr>";
	echo "\n<tr>";
		echo '<td></td>';
		echo '<td class="prompt">'.JText::_('COM_FLEXICONTACT_COLOURS').'</td>';
		echo '<td>';
			echo JText::_('COM_FLEXICONTACT_TEXT');
			echo ' <input type="text" class="color {required:false}" size="6" name="captcha_colour_text" value="'.$this->config_data->config_data->captcha_colour_text.'" />';
			echo '&nbsp;&nbsp;'.JText::_('COM_FLEXICONTACT_LINES');
			echo ' <input type="text" class="color {required:false}" size="6" name="captcha_colour_lines" value="'.$this->config_data->config_data->captcha_colour_lines.'" />';
			echo '&nbsp;&nbsp;'.JText::_('COM_FLEXICONTACT_BACKGROUND');
			echo ' <input type="text" class="color {required:false}" size="6" name="captcha_colour_background" value="'.$this->config_data->config_data->captcha_colour_background.'" />';
		echo '</td>';
	echo "\n</tr>";
	echo "\n<tr>";
		echo '<td></td>';
		echo '<td class="prompt">'.JText::_('COM_FLEXICONTACT_SECURE_CAPTCHA_LABEL').'</td>';
		echo '<td><input type="text" size="40" name="secure_captcha_prompt" value="'.$this->config_data->config_data->secure_captcha_prompt.'" /></td>';
	echo "\n</tr>";

	echo "\n".'<tr><td colspan="3"><hr /></td></tr>';

// ReCaptcha

	$recaptcha_theme_list = FCP_Common::make_list('recaptcha_theme', $this->config_data->config_data->recaptcha_theme, $recaptcha_themes);
	echo "\n<tr>";
		echo '<td>'.JHTML::_('image', LAFC_ADMIN_ASSETS_URL.'captcha4.gif','', 'style="vertical-align:middle"').'</td>';
		echo '<td class="prompt">'.JText::_('COM_FLEXICONTACT_RECAPTCHA').'</td>';
		echo '<td>';
			echo $recaptcha_theme_list;
			if (LAFC_JVERSION == 150)
				echo '&nbsp;&nbsp;'.JText::_('LANGUAGE');
			else
				echo '&nbsp;&nbsp;'.JText::_('JFIELD_LANGUAGE_LABEL');
			echo ' <input type="text" size="6" name="recaptcha_language" value="'.$this->config_data->config_data->recaptcha_language.'" />';
		echo '</td>';
	echo "\n</tr>";
	echo "\n<tr>";
		echo '<td></td>';
			echo '<td class="prompt">'.JText::_('COM_FLEXICONTACT_RECAPTCHA_PUBLIC_KEY').'</td>';
			echo '<td><input type="text" size="60" name="recaptcha_public_key" value="'.$this->config_data->config_data->recaptcha_public_key.'" /> ';
			$link = 'https://www.google.com/recaptcha/admin/create';
			echo FCP_Admin::make_info(JText::_('COM_FLEXICONTACT_GET_KEY'),$link).'</td>';
	echo "\n</tr>";
	echo "\n<tr>";
		echo '<td></td>';
			echo '<td class="prompt">'.JText::_('COM_FLEXICONTACT_RECAPTCHA_PRIVATE_KEY').'</td>';
			echo '<td><input type="text" size="60" name="recaptcha_private_key" value="'.$this->config_data->config_data->recaptcha_private_key.'" /></td>';
	echo "\n</tr>";

	echo '</table>';
	echo '</form>';

}


}