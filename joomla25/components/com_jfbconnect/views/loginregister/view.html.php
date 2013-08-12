<?php
/**
 * @package		JFBConnect
 * @copyright (C) 2009-2012 by Source Coast - All rights reserved
 * @license http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */
// No direct access
defined('_JEXEC') or die('Restricted access');

jimport('joomla.application.component.view');
require_once(JPATH_SITE . DS . 'components' . DS . 'com_jfbconnect' . DS . 'libraries' . DS . 'utilities.php');

class JFBConnectViewLoginRegister extends JView
{

    function display($tpl = null)
    {
        $jfbcLibrary = JFBConnectFacebookLibrary::getInstance();
        $fbUserId = $jfbcLibrary->getFbUserId();
        $fbUserProfile = $jfbcLibrary->_getUserName($fbUserId);
        $configModel = $jfbcLibrary->getConfigModel();

        if ($fbUserId == null)
        {
            $app = JFactory::getApplication();
            $app->redirect('index.php');
        }

        $app = & JFactory::getApplication();
        JPluginHelper::importPlugin('jfbcprofiles');
        $profileFields = $app->triggerEvent('jfbcProfilesOnShowRegisterForm');

         //SC15

        
        $language = JFactory::getLanguage();
        $language->load('com_users');
        JModel::addIncludePath(JPATH_SITE . DS . 'components' . DS . 'com_users' . DS . 'models');
        $userModel = JModel::getInstance('Registration', 'UsersModel');
        $this->data = $userModel->getData();
        JForm::addFormPath(JPATH_SITE . DS . 'components' . DS . 'com_users' . DS . 'models' . DS . 'forms');
        JForm::addFieldPath(JPATH_SITE . DS . 'components' . DS . 'com_users' . DS . 'models' . DS . 'fields');
        $this->form = $userModel->getForm();

        // Setup the fields we can pre-populate
        // To do: Give option to show/hide the name on the form
        $this->form->setValue('name', null, $fbUserProfile['name']);

        $fbEmail = $this->_getDisplayEmail($fbUserProfile['email']);
        $this->form->setValue('email1', null, $fbEmail);
        $this->form->setValue('email2', null, $fbEmail);
        if (!$configModel->getSetting('registration_show_email') && $fbEmail != "")
        {
            $this->form->setFieldAttribute('email1', 'type', 'hidden');
            $this->form->setFieldAttribute('email2', 'type', 'hidden');
        }
         //SC16

        //Check for form validation from each of the plugins
        $areProfilesValidating = $app->triggerEvent('jfbcProfilesAddFormValidation');
        $defaultValidationNeeded = true;
        foreach($areProfilesValidating as $hasDoneValidation)
        {
            if($hasDoneValidation == true)
            {
                $defaultValidationNeeded = false;
                break;
            }
        }

        //Check to see if JLinked is installed
        $jLinkedLoginButton = "";
        if (JFBCSocialUtilities::isJLinkedInstalled())
        {
            require_once(JPATH_ROOT . DS . 'components' . DS . 'com_jlinked' . DS . 'libraries' . DS . 'linkedin.php');
            $jLinkedLibrary =& JLinkedApiLibrary::getInstance();

            $lang = JFactory::getLanguage();
            $lang->load('com_jlinked');
            $loginText = JText::_('COM_JLINKED_LOGIN_USING_LINKEDIN');

            $jLinkedLoginButton = '<link rel="stylesheet" href="components/com_jlinked/assets/jlinked.css" type="text/css" />';
            $jLinkedLoginButton .= '<div class="jLinkedLogin"><a href="'.$jLinkedLibrary->getLoginURL().'"><span class="jlinkedButton"></span><span class="jlinkedLoginButton">'.$loginText.'</span></a></div>';
        }

        $this->assignRef('fbUserId', $fbUserId);
        $this->assignRef('fbUserProfile', $fbUserProfile);
        $this->assignRef('configModel', $configModel);
        $this->assignRef('profileFields', $profileFields);
        $this->assignRef('jLinkedLoginButton', $jLinkedLoginButton);
        $this->assignRef('defaultValidationNeeded', $defaultValidationNeeded);

        parent::display($tpl);
    }

    /**
     * Check passed in email to see if it's already in Joomla
     * If so, return blank, forcing the user to input an email address (and getting validation error if using the same)
     * If not, pre-populate the form with the user's FB address
     * @param string $email Users Facebook email address
     * @return string Email value that will be shown on registration form
     */
    function _getDisplayEmail($email)
    {
        $dbo = JFactory::getDBO();
        $query = "SELECT id FROM #__users WHERE email=" . $dbo->quote($email);
        $dbo->setQuery($query);
        $jEmail = $dbo->loadResult();
        if ($jEmail != null)
            return "";
        else
            return $email;
    }

}
