<?php
/**
 * @package        JFBConnect
 * @copyright (C) 2009-2012 by Source Coast - All rights reserved
 * @license http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */
// Check to ensure this file is included in Joomla!
defined('_JEXEC') or die('Restricted access');

jimport('joomla.plugin.plugin');
jimport('joomla.application.component.controller');
jimport('joomla.filesystem.file');

require_once(JPATH_SITE . DS . 'components' . DS . 'com_jfbconnect' . DS . 'libraries' . DS . 'utilities.php');

class JFBConnectProfileLibrary extends JPlugin
{

    var $jfbcLibrary;
    var $configModel;
    var $profileName;
    var $settings = array();
    var $_db;
    var $_importEnabled = false; // Can this plugin import previous FB connections
    var $_componentFile = '';
    var $_componentFolder = '';

    function __construct(&$subject, $params)
    {
        require_once(JPATH_SITE . DS . 'components' . DS . 'com_jfbconnect' . DS . 'libraries' . DS . 'facebook.php');
        $this->jfbcLibrary = JFBConnectFacebookLibrary::getInstance();
        $this->configModel = $this->jfbcLibrary->getConfigModel();
        $this->profileName = $params['name'];
        $this->_db = JFactory::getDBO();

        parent::__construct($subject, $params);
    }

    /*     * *
     *
     *  Triggered functions within plugin - These are items that should be called by the dispatcher
     *
     * ** */

    /**
     * Called after registration occurs
     * Good for importing the profile on first registration
     */
    function jfbcProfilesOnRegister($joomlaId, $fbUserId)
    {
        return true;
    }

    /**
     * Get field names and inputs to request additional information from users on registration
     * @return string HTML of form fields to display to user on registration
     */
    function jfbcProfilesOnShowRegisterForm()
    {
        return "";
    }

    /**
     * Profile will add its form validation script. If no custom validation is required,
     * default validation will be performed
     * @return bool
     */
    function jfbcProfilesAddFormValidation()
    {
        return false;
    }

    /**
     * Used for plugins to check any credentials or information as necessary
     * Return true if login should proceed, false if not
     */
    function jfbcProfilesOnAuthenticate($jUserId, $fbUserId)
    {
        $response = new profileResponse();
        $response->status = true;
        return $response;
    }

    /**
     * Triggered after user is successfully logged into the site. Good for importing profile, updating status, etc
     */
    function jfbcProfilesOnLogin()
    {
        return true;
    }

    function jfbcProfilesGetSettings()
    {
        return $this->settings;
    }

    function jfbcProfilesGetPlugins()
    {
        return $this;
    }

    function jfbcProfilesGetRequiredPermissions()
    {
        $fieldMap = $this->configModel->getSetting('profiles_' . $this->profileName . '_field_map');
        $requiredPerms = $this->configModel->getPermissionsForFields($fieldMap);
        return $requiredPerms;
    }

    function jfbcProfilesSendsNewUserEmails()
    {
        return false;
    }

    /*     * *
     *
     * ************ END Triggered functions ************
     *
     * ** */

    /*     * *
     * ************ Direct call functions **************
     */

    function importFBProfile()
    {
        // Determine if we should re-import the profile
        if ($this->jfbcLibrary->initialRegistration || $this->configModel->getSetting('profiles_' . $this->profileName . "_import_always"))
        {
            $app = JFactory::getApplication();
            //Copy over the FB Avatar to CB...
            $this->migrateFBFieldsToProfile();

            if ($this->configModel->getSetting('profiles_' . $this->profileName . "_import_avatar"))
                $this->migrateFBAvatarToProfile();
        }
    }

    function getConfigurationTemplate()
    {
         //SC15
        
            $file = JPATH_SITE . DS . 'plugins' . DS . 'jfbcprofiles' . DS . $this->profileName . DS . $this->profileName . DS . 'tmpl' . DS . 'configuration.php';
         //SC16

        if (!JFile::exists($file))
            return "No configuration is required for this profile plugin";

        $this->profileFields = $this->getProfileFields();
        ob_start();
        include_once($file);
        $config = ob_get_clean();
        return $config;
    }

    function getName()
    {
        return $this->profileName;
    }

    /*     * ***
     * ************* END Direct call functions ********8
     */

    function getJoomlaUserID()
    {
        $userMapModel = new JFBConnectModelUserMap();
        return $userMapModel->getJoomlaUserId($this->jfbcLibrary->getFbUserId());
    }

    function getProfileFields()
    {
        return array();
    }

    function migrateFBFieldsToProfile()
    {
        $fbUserId = $this->jfbcLibrary->getFbUserId();
        $fbFieldMap = $this->configModel->getSetting('profiles_' . $this->profileName . "_field_map");

        $fbFields = array();
        if (is_array($fbFieldMap))
        {
            foreach ($fbFieldMap as $fbField)
            {
                $fbFieldArray = explode('.', $fbField);
                $fbFields[] = $fbFieldArray[0]; // Get the root field to grab from FB
            }
        }
        if (empty($fbFields))
            return;

        $fbFields = array_unique($fbFields);
        $fbProfileFields = $this->jfbcLibrary->getUserProfile($fbUserId, $fbFields);
        if ($fbProfileFields == null)
            return;

        $sql = "";
        foreach ($fbFieldMap as $fieldId => $fbField)
        {
            $parts = explode(".", $fbField);
            $fbData = $fbProfileFields[$parts[0]]; // Get the root field returned from FB for the field we want
            if (count($parts) > 1)
            {
                unset($parts[0]); // Already used this above. Need the selectors only
                foreach ($parts as $part)
                {
                    // First, see if there's an array value we need to choose from
                    $selection = explode(":", $part);
                    if (count($selection) == 2)
                    {   // ex: education.type:College.year (Select array with type:College)
                        foreach ($fbData as $option)
                        {
                            if ($option[$selection[0]] == $selection[1])
                                $fbData = $option;
                        }
                    }
                    else // ex: current_location.name (get the name)
                    {
                        if($fbData != null && array_key_exists($part, $fbData))
                            $fbData = $fbData[$part];
                        else
                            $fbData = null;
                    }
                }
            }

            if ($fbData != null && $fbData != "")
            {
                if (is_array($fbData))
                { // This is a field with multiple, comma separated values
                    // Remove empty values to prevent blah, , blah as output
                    unset($fbData['id']); // Remove id key which is useless to import
                    $fbData = JFBCSocialUtilities::r_implode(', ', $fbData);
                }
                // add custom field handlers here
                switch($fbField)
                {
                    case 'website':
                        $websites = explode("\n", $fbData);
                        if(count($websites) > 0)
                            $fbData = trim($websites[0]);
                        break;
                }

                if ($fbData) // Don't import blank values
                    $sql .= $this->addFieldToDB($fieldId, $fbData);
            }
        }

        $this->_db->setQuery($sql);
        $this->_db->queryBatch();
    }

    function migrateFBAvatarToProfile()
    {
        $userId = $this->getJoomlaUserID();
        jimport('joomla.filesystem.file');
        jimport('joomla.utilities.utility');

        $fbCdnUrl = 'profile.ak.fbcdn.net';

        // Get Avatar URL from FB. Return if it's the default or no-URL returned
        $fbUserId = $this->jfbcLibrary->getFbUserId();
        $avatarUrl = $this->jfbcLibrary->getUserProfilePicUrl($fbUserId);
        if ($avatarUrl == null)
            return false;
        //No avatar ends with .gif
        if (JFBCSocialUtilities::endsWith($avatarUrl, '.gif'))
        {
            $this->setDefaultAvatar($userId);
            return true;
        }

        // Always save with the appropriate extension from whatever is downlaoded
        $ext = substr($avatarUrl, -3);

        $fbImgPath = 'jfbc_' . $fbUserId . 'pic_tmp.' . $ext;
        $baseImgPath = $this->getAvatarPath();

        $path = str_replace('http://' . $fbCdnUrl, '', $avatarUrl);

        $source = '';
        $fp = fsockopen($fbCdnUrl, 80, $errno, $errstr, 30);

        if ($fp)
        {
            $out = "GET $path HTTP/1.1\r\n";
            $out .= "Host: " . $fbCdnUrl . "\r\n";
            $out .= "Connection: Close\r\n\r\n";

            fwrite($fp, $out);

            $body = false;

            while (!feof($fp))
            {
                $return = fgets($fp, 1024);

                if ($body)
                    $source .= $return;

                if ($return == "\r\n")
                    $body = true;
            }
            fclose($fp);
        }
        JFile::write($baseImgPath . DS . $fbImgPath, $source);

        if ($this->updateAvatar($fbImgPath, $userId, $fbUserId))
            return true;
        else
        { # there was a problem adding the avatar, use the default
            $this->setDefaultAvatar($userId);
            return false;
        }
    }

    function addFieldToDB($fieldId, $value)
    {
        return '';
    }

    function getAvatarPath()
    {
        $app = & JFactory::getApplication();
        $tmpPath = $app->getCfg('tmp_path');
        return $tmpPath;
    }

    function setDefaultAvatar($userId)
    {
        return true;
    }

    function updateAvatar($fbAvatar, $userId, $fbUserId)
    {
        return true;
    }

    function canImportConnections()
    {
        return $this->_importEnabled;
    }

    function isComponentInstalled()
    {
        $componentDetected = false;
        jimport('joomla.filesystem.file');
        if ($this->_componentFile != '')
        {
            $componentDetected = JFile::exists($this->_componentFolder . DS . $this->_componentFile);
        }
        else if ($this->_componentFolder != '')
        {
            $componentDetected = JFolder::exists($this->_componentFolder);
        }

        return $componentDetected;
    }

}

if (!class_exists('profileResponse'))
{
    class profileResponse
    {

        var $status;
        var $message;

    }
}