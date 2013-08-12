<?php
/**
 * @package        JFBConnect
 * @copyright (C) 2009-2012 by Source Coast - All rights reserved
 * @license http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */
// Check to ensure this file is included in Joomla!
defined('_JEXEC') or die('Restricted access');

jimport('joomla.application.component.view');

class JFBConnectViewJFBConnect extends JView
{

    var $versionChecker;

    function display($tpl = null)
    {
        require_once(JPATH_COMPONENT_SITE . DS . 'libraries' . DS . 'facebook.php');
        require_once(JPATH_COMPONENT_ADMINISTRATOR . DS . 'assets' . DS . 'sourcecoast.php');

        $jfbcLibrary = JFBConnectFacebookLibrary::getInstance();
        $configModel = $this->getModel();
        $usermapModel = $this->getModel('usermap');

        // TODO: In addition to just checking if the key is set, check if the connection to FB also works
        if ($jfbcLibrary->get('facebookAppId', ''))
        {
            $params = array(
                'method' => 'admin.getAppProperties',
                'properties' => array('application_name', 'description', 'connect_url', 'base_domain', 'base_domains', 'logo_url'),
            );
            $appProperties = $jfbcLibrary->rest($params, FALSE);

            $fql = "SELECT monthly_active_users, weekly_active_users, daily_active_users FROM application WHERE app_id=" . $jfbcLibrary->facebookAppId;
            $params = array(
                'method' => 'fql.query',
                'query' => $fql,
            );
            $appStats = $jfbcLibrary->rest($params, FALSE);
            $appStats = $appStats[0];
            $appStats['monthly_active_users'] = isset($appStats['monthly_active_users']) && $appStats['monthly_active_users'] != ""
                    ? $appStats['monthly_active_users'] : "0";
            $appStats['weekly_active_users'] = isset($appStats['weekly_active_users']) && $appStats['weekly_active_users'] != ""
                    ? $appStats['weekly_active_users'] : "0";
            $appStats['daily_active_users'] = isset($appStats['daily_active_users']) && $appStats['daily_active_users'] != ""
                    ? $appStats['daily_active_users'] : "0";


            // Base domain check
            $baseDomainOk = false;
            $joomlaUrl = JURI::root();
            if (count($appProperties['base_domains']) > 0)
            {
                $baseDomain = implode(', ', $appProperties['base_domains']);
                foreach ($appProperties['base_domains'] as $domain)
                {
                    if (strpos($joomlaUrl, $domain) !== false)
                        $baseDomainOk = true;
                }
            }
            else
            {
                $baseDomain = $appProperties['base_domain'];
                if ($baseDomain != "" && (strpos($joomlaUrl, $appProperties['base_domain']) !== false))
                    $baseDomainOk = true;
            }
        }
        else
        {
            $appStats['monthly_active_users'] = "0";
            $appStats['weekly_active_users'] = "0";
            $appStats['daily_active_users'] = "0";
            $baseDomainOk = true;
            $baseDomain = "";
        }

         //SC15
        
            $this->versionChecker = new sourceCoastConnect('jfbconnect_j16', 'components/com_jfbconnect/assets/images/');
         //SC16


        $this->assignRef('configModel', $configModel);
        $this->assignRef('appProperties', $appProperties);
        $this->assignRef('baseDomain', $baseDomain);
        $this->assignRef('baseDomainOk', $baseDomainOk);
        $this->assignRef('clientError', $clientError);
        $this->assignRef('jfbcLibrary', $jfbcLibrary);
        $this->assignRef('usermapModel', $usermapModel);
        $this->assignRef('appStats', $appStats);

        parent::display($tpl);
    }

}
