<?php
/**
 * @package        JFBConnect
 * @copyright (C) 2009-2012 by Source Coast - All rights reserved
 * @license http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */
// no direct access
defined('_JEXEC') or die('Restricted access');

/**
 * @package Joomla
 * @subpackage Config
 */
class TOOLBAR_JFBConnect
{

    function _DEFAULT()
    {
        JToolBarHelper::title('JFBConnect', 'jfbconnect.png');

        $viewName = JRequest::getVar('view');

        if ($viewName == "Config" || $viewName == "Social" || $viewName == "Profiles" || $viewName == "Canvas")
            JToolBarHelper::apply('apply', 'Apply Changes');

        #JToolBarHelper::preferences('com_JFBConnect', '300');
        #JToolBarHelper::help('screen.JFBConnect');
    }

}