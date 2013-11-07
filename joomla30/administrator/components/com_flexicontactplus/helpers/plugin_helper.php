<?php
/********************************************************************
Product		: FlexicontactPlus
Date		: 15 August 2013
Copyright	: Les Arbres Design 2009-2013
Contact		: http://extensions.lesarbresdesign.info
Licence		: GNU General Public License
*********************************************************************/
defined('_JEXEC') or die('Restricted access');
jimport('joomla.plugin.plugin');

class LAFC_article_plugin_helper
{

//-------------------------------------------------------------------------------
// This is the main code of the article plugin
// Keeping it outside the actual plugin means it isn't parsed for every article
// and means we can update plugin functionality without changing the actual plugin
//
function article_plugin(&$plugin_object, $context, &$article, &$article_params)
{
// we should never run in the back end

	$app = JFactory::getApplication();
	if ($app->isAdmin())
		return;

// Create an array ($matches) of {flexicontactplus} tags in the article
// It can be {flexicontactplus} or {flexicontactplus configname}
// We currently only process the first match
// $match[0] contains the entire {flexicontactplus ...} tag to be replaced
// $match[1] contains the call parameter(s) - the configname

	$regex = "#{flexicontactplus*(.*?)}#s";
	if (preg_match_all($regex, $article->text, $matches, PREG_SET_ORDER) == 0)
		return;
	
// load the dependency files - the plugin has already checked that the component is installed

	require_once JPATH_ADMINISTRATOR.'/components/com_flexicontactplus/helpers/flexi_common_helper.php';
	require_once JPATH_ADMINISTRATOR.'/components/com_flexicontactplus/helpers/trace_helper.php';
	require_once JPATH_ADMINISTRATOR.'/components/com_flexicontactplus/models/config.php';
	require_once JPATH_SITE.'/components/com_flexicontactplus/models/data.php';
	require_once JPATH_SITE.'/components/com_flexicontactplus/views/contact/view.html.php';

// set a constant for the Joomla version

	FCP_Common::get_joomla_version();
	
// Load the FlexiContactPlus component front-end language file

	$plugin_object->loadLanguage('com_flexicontactplus',JPATH_SITE);

// Load the component models we need

	$this->config_model = new FlexicontactplusModelConfig;			
	$this->data_model = new FlexicontactplusModelData;

// save the article_title and url_path in case the %V_PAGE_TITLE% or %V_URL_PATH% variables are used later
// if we are in a module, there is no article title

	if (isset($article->title))
		$article_title = strip_tags($article->title);
	else
		$article_title = '';
	$app->setUserState(LAFC_COMPONENT."_page_title", $article_title);

	$uri = JURI::getInstance();
	$url_path = ltrim($uri->getPath(),'/\\');
	$app->setUserState(LAFC_COMPONENT."_url_path", $url_path) ;

	FCP_trace::trace(" Article Title [$article_title] Url_path [$url_path]");

// Iterate through the {flexicontactplus} tags
//
// $match[0] contains the entire {flexicontactplus} tag to be replaced
// $match[1] contains just the parameters
// the call could be: {flexicontactplus}
//                or: {flexicontactplus config_name}
//                or: {flexicontactplus config_name modal=xxx,yyy,"Link Text"}
//                or  {flexicontactplus modal=xxx,yyy,"Link Text"}
//
// we do not allow multiple embedded contact forms, but we do allow multiple modal forms

	$form_count = 0;
	foreach ($matches as $match)
		{
		$html = '';
		if (strpos($match[1],'modal'))
			$html = $this->display_modal($match[1]);
		else
			{
			if ($form_count == 0)
				$html = $this->display_embedded($match[1]);
			$form_count ++;
			}
		
// merge our html into the article

		$article->text = str_replace($match[0], $html, $article->text);
		}	
}

// -------------------------------------------------------------------------------
// Generate a modal link
//
function display_modal($params)
{
	$modal_param = strstr($params,'modal');
	$modal_x_size = substr($modal_param,6,3);
	$modal_y_size = substr($modal_param,10,3);
	$modal_text = substr($modal_param,14);
	FCP_Common::strip_quotes($modal_text, false);		// Remove quotes from the start and end of the string
	
	if (($modal_param{9} != ',') or ($modal_param{13} != ',') 
	or  (!FCP_Common::is_posint($modal_x_size, false)) or (!FCP_Common::is_posint($modal_y_size, false)) )
		return "{flexicontactplus: Invalid modal parameter: $modal_param}";

	$pos_modal = strpos($params,'modal');
	$config_name = substr_replace($params,'',$pos_modal);		// what's left is just the config name
	$config_name = trim($config_name);

// load Joomla's modal window support

	JHtml::_('behavior.modal');
	$html = '';
	if (strlen($modal_text) == 0)		// if there is no link text that's all we do on this call
		return '';

// class="modal" invokes the modal lightbox - see media/system/js/modal.js for more options

	$link = "index.php?option=".LAFC_COMPONENT."&view=contact&tmpl=component&config_name=".$config_name;
	$html = '<a class="modal" href="'.$link.'" rel="{handler: \'iframe\', size: {x: '.$modal_x_size.', y: '.$modal_y_size.'}}">'.$modal_text.'</a>';
	FCP_trace::trace("Plugin drawing modal link: ".$html);
	
	return $html;
}

// -------------------------------------------------------------------------------
// Generate an embedded form
//
function display_embedded($config_name)
{
// get the specified configuration

	$config_name = trim($config_name);
	$config_name = htmlspecialchars_decode($config_name, ENT_QUOTES);		// convert html entities to characters
	FCP_Common::strip_quotes($config_name);									// remove all quotes
	jimport('joomla.application.component.model');
	$config_data = $this->config_model->getConfigData($config_name);
	if ($config_data === false)
		{
		JPlugin::loadLanguage();								// load the plugin's own language file
		$html = JText::_('PLG_CONTENT_FLEXICONTACTPLUS_NO_CONFIG');
		FCP_trace::trace("PLUGIN: No config data");
		return $html;
		}

	$this->data_model->init_data($config_data);

	$html = FlexicontactplusViewContact::draw_page($config_data, $this->data_model->data);
	
	return $html;
}


}
