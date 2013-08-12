<?php
/**
 * @package		JFBConnect
 * @copyright (C) 2009-2012 by Source Coast - All rights reserved
 * @license http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */
defined('_JEXEC') or die('Restricted access');

jimport('joomla.plugin.plugin');

/**
 * Facebook User Plugin
 */
class plgUserJFBConnectUser extends JPlugin
{
    function plgUserJFBConnectUser(& $subject, $config)
    {
        parent::__construct($subject, $config);
    }

    function onLogoutUser($user, $options = array()) //J15
    {
        $this->onUserLogout($user, $options);
    }

    function onUserLogout($user, $options = array())
    {
        //Make sure we're a valid user first
        if ($user['id'] == 0)
            return true;

        //require_once (JPATH_ROOT.DS.'components'.DS.'com_jfbconnect'.DS.'libraries'.DS.'facebook.php');
        //$fbLib = JFBConnectFacebookHelper::getFbLib(false);
        //if ($fbLib->user){ # There's a FB user attached to this Joomla user
        //	$fbLib->clear_cookie_state();
        //	$fbLib->expire_session();
        //}

        return true;
    }

    function onBeforeDeleteUser($user) //J15
    {
        $this->onUserBeforeDelete($user);
    }

    function onUserBeforeDelete($user)
    {
        require_once (JPATH_ADMINISTRATOR . DS . 'components' . DS . 'com_jfbconnect' . DS . 'models' . DS . 'usermap.php');
        $model = new JFBConnectModelUserMap();
        $model->deleteMappingWithJoomlaId($user['id']);
    }

    public function onLoginUser($user, $options = array()) //J15
    {
        $this->onUserLogin($user, $options);
    }

    public function onUserLogin($user, $options = array())
    {
        $jfbcLibrary = null;
        $jLinkedLibrary = null;

        $app = JFactory::getApplication();
        if ($app->isAdmin())
            return;

        $isJFBConnectNewMappingEnabled = $this->isJFBConnectNewMappingEnabled($jfbcLibrary);
        $isJLinkedNewMappingEnabled = $this->isJLinkedNewMappingEnabled($jLinkedLibrary);

        if($isJFBConnectNewMappingEnabled || ($isJLinkedNewMappingEnabled && $jfbcLibrary->initialRegistration))
        {
            $this->clearJFBConnectNewMapping($jfbcLibrary);

            if ($jfbcLibrary->getFbUserId())
            {
                JLoader::register('TableUserMap', JPATH_ADMINISTRATOR . DS . 'components' . DS . 'com_jfbconnect' . DS . 'tables' . DS . 'usermap.php');
                JLoader::register('JFBConnectModelLoginRegister', JPATH_SITE . DS . 'components' . DS . 'com_jfbconnect' . DS . 'models' . DS . 'loginregister.php' );

                $userMapModel = new JFBConnectModelUserMap();
                $jUser = JUser::getInstance($user['username']);
                if ($userMapModel->mapUser($jfbcLibrary->getFbUserId(), $jUser->id))
                {
                    $app =& JFactory::getApplication();
                    $lang =& JFactory::getLanguage();
                    $lang->load('com_jfbconnect');
                    $app->enqueueMessage(JText::_('COM_JFBCONNECT_MAP_USER_SUCCESS'));

                    $jfbcLibrary->setInitialRegistration();
                }
            }
        }
    }

    public function clearJFBConnectNewMapping($jfbcLibrary)
    {
        require_once JPATH_ROOT . DS . 'components' . DS . 'com_jfbconnect' . DS . 'libraries' . DS . 'utilities.php';
        JFBCSocialUtilities::clearNewMappingEnabled();
    }

    public function isJFBConnectNewMappingEnabled(& $jfbcLibrary)
    {
        $libraryFile = JPATH_ROOT . DS . 'components' . DS . 'com_jfbconnect' . DS . 'libraries' . DS . 'facebook.php';
        if (JFile::exists($libraryFile))
        {
            require_once $libraryFile;

            $jfbcLibrary = JFBConnectFacebookLibrary::getInstance();
            return $jfbcLibrary->checkNewMapping;
        }
        return false;

    }
    public function isJLinkedNewMappingEnabled(& $jLinkedLibrary)
    {
        $libraryFile = JPATH_ROOT . DS . 'components' . DS . 'com_jlinked' . DS . 'libraries' . DS . 'linkedin.php';
        if (JFile::exists($libraryFile))
        {
            require_once $libraryFile;

            $jLinkedLibrary = JLinkedApiLibrary::getInstance();
            return $jLinkedLibrary->initialRegistration;
        }
        return false;
    }

}
