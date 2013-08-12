<?php

/**
 * @package        JFBConnect
 * @copyright (C) 2009-2012 by Source Coast - All rights reserved
 * @license http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

// Check to ensure this file is included in Joomla!
defined('_JEXEC') or die('Restricted access');

jimport('joomla.application.component.view');

class JFBConnectViewCanvas extends JView
{
    function display($tpl = null)
    {
        require_once(JPATH_COMPONENT_SITE . DS . 'libraries' . DS . 'facebook.php');
        $model = $this->getModel('config');
        $jfbcLibrary = JFBConnectFacebookLibrary::getInstance();
            
         // SC15
        
            require_once JPATH_ADMINISTRATOR.DS.'components'.DS.'com_templates'.DS.'helpers'.DS.'templates.php';
            JModel::addIncludePath(JPATH_ADMINISTRATOR.DS.'components'.DS.'com_templates'.DS.'models');
            $templatesModel = JModel::getInstance('Styles', 'TemplatesModel');
            $allTemplates = $templatesModel->getItems();
            $templates = array();
            foreach ($allTemplates as $template)
            {
                if ($template->client_id == 0)
                {
                    // Make it the same as J15 so we can use the same selectlist
                    $template->directory = $template->id;
                    $template->name = $template->title;
                    $templates[] = $template;
                }
            }
         // SC16

        // Add the "Don't Override" option to set no special template
        $defaultTemplate = new stdClass();
        $defaultTemplate->directory = -1;
        $defaultTemplate->name = "- No Override. Use Default Template - ";
        array_unshift($templates, $defaultTemplate);

        $canvasProperties = new JObject();
        $appId = $jfbcLibrary->get('facebookAppId', '');
        if ($appId)
        {
            $params = "?fields=canvas_url,secure_canvas_url,page_tab_default_name,page_tab_url,secure_page_tab_url,namespace,website_url,canvas_fluid_height,canvas_fluid_width";
            $appProps = $jfbcLibrary->api($appId.$params, null, FALSE);

            $canvasProperties->setProperties($appProps);
        }

        $canvasTabTemplate = $model->getSetting('canvas_tab_template', -1);
        $canvasCanvasTemplate = $model->getSetting('canvas_canvas_template', -1);

        $this->assignRef('canvasProperties', $canvasProperties);
        $this->assignRef('canvasTabTemplate', $canvasTabTemplate);
        $this->assignRef('canvasCanvasTemplate', $canvasCanvasTemplate);
        $this->assignRef('templates', $templates);
        $this->assignRef('model', $model);
        $this->assignRef('jfbcLibrary', $jfbcLibrary);
        parent::display($tpl);
    }

}
