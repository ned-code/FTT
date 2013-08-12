<?php
/**
 * @package		JFBConnect
 * @copyright (C) 2009-2012 by Source Coast - All rights reserved
 * @license http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */
// Check to ensure this file is included in Joomla!
defined('_JEXEC') or die('Restricted access');

jimport('joomla.application.component.controller');

class JFBConnectControllerSocial extends JController
{

    function display()
    {
        exit;
    }

    function commentCreate()
    {
        $jfbcLibrary = JFBConnectFacebookLibrary::getInstance();
        $configModel = $jfbcLibrary->getConfigModel();

        // Javascript shouldn't be called, but check to make sure this setting is enabled.
        if (!$configModel->getSetting('social_notification_comment_enabled'))
            exit;

        //$commentId = JRequest::getVar('commentID');
        $href = JRequest::getVar('href');
        // Comment is too unreliable to get immediately (almost never there), so not including it in email for now
        //$comment = $jfbcLibrary->api('/comments/?ids='.urlencode($href));

        $subject = JText::_('COM_JFBCONNECT_NEW_COMMENT_SUBJECT');
        $body = JText::sprintf('COM_JFBCONNECT_NEW_COMMENT_BODY', $this->getPoster(), urldecode($href));
        
        $this->_sendEmail($subject, $body);
        exit;
    }

    function likeCreate()
    {
        $jfbcLibrary = JFBConnectFacebookLibrary::getInstance();
        $configModel = $jfbcLibrary->getConfigModel();

        // Javascript shouldn't be called, but check to make sure this setting is enabled.
        if (!$configModel->getSetting('social_notification_like_enabled'))
            exit;

        //$commentId = JRequest::getVar('commentID');
        $href = JRequest::getVar('href');
        // Comment is too unreliable to get immediately (almost never there), so not including it in email for now
        //$comment = $jfbcLibrary->api('/comments/?ids='.urlencode($href));

        $subject = JText::_('COM_JFBCONNECT_NEW_LIKE_SUBJECT');
        $body = JText::sprintf('COM_JFBCONNECT_NEW_LIKE_BODY', $this->getPoster(), urldecode($href));

        $this->_sendEmail($subject, $body);
        exit;
    }

    function getPoster()
    {
        $user =& JFactory::getUser();
        if ($user->guest)
            return "Guest";
        else
            return $user->get('username');
    }

    function _sendEmail($subject, $body)
    {
        $jfbcLibrary = JFBConnectFacebookLibrary::getInstance();
        $configModel = $jfbcLibrary->getConfigModel();

        $toname = $configModel->getSetting('social_notification_email_address');
        $toname = explode(',', $toname);
        // Don't send emails to no one :)
        if ($toname[0] == "")
            return;

        $app =& JFactory::getApplication();
        $sitename = $app->getCfg( 'sitename' );
        $mailfrom = $app->getCfg( 'mailfrom' );
	    $fromname = $app->getCfg( 'fromname' );
        $subject = $subject." - ".$sitename;

        JUtility::sendMail($mailfrom, $fromname, $toname, $subject, $body);
    }


}
