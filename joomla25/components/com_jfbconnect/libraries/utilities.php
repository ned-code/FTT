<?php
/**
 * @package        JFBConnect
 * @copyright (C) 2011-2012 by Source Coast - All rights reserved
 * @license http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */
// Check to ensure this file is included in Joomla!
defined('_JEXEC') or die('Restricted access');

jimport('joomla.filesystem.file');

class JFBCSocialUtilities
{
    static function endswith($string, $test)
    {
        $strlen = strlen($string);
        $testlen = strlen($test);
        if ($testlen > $strlen)
            return false;
        return substr_compare($string, $test, -$testlen) === 0;
    }

    static function startsWith($haystack, $needle)
    {
        $length = strlen($needle);
        return (substr($haystack, 0, $length) === $needle);
    }

    static function trimNBSP($htmlText)
    {
        // turn some HTML with non-breaking spaces into a "normal" string
        $converted = strtr($htmlText, array_flip(get_html_translation_table(HTML_ENTITIES, ENT_QUOTES)));
        $converted = trim($converted," \t\n\r\0\x0B".chr(0xC2).chr(0xA0)); // UTF encodes it as chr(0xC2).chr(0xA0)
        return $converted;
    }

    //Recursively implode and trim an array (of strings/arrays)
    static function r_implode($glue, $pieces)
    {
        foreach($pieces as $r_pieces)
        {
            if(is_array($r_pieces))
            {
                $retVal[] = JFBCSocialUtilities::r_implode($glue, $r_pieces);
            }
            else
            {
                $retVal[] = trim($r_pieces);
            }
        }
        return implode($glue, $retVal);
    }

    static function isJLinkedInstalled()
    {
        $isJLinkedInstalled = false;
        $jLinkedLibraryFile = JPATH_ROOT.DS.'components'.DS.'com_jlinked'.DS.'libraries'.DS.'linkedin.php';
        if (JFile::exists($jLinkedLibraryFile))
        {
            $isJLinkedInstalled = JComponentHelper::isEnabled('com_jlinked');
        }
        return $isJLinkedInstalled;
    }

    static function areJLinkedTagsEnabled()
    {
        $isJLinkedSystemEnabled = JPluginHelper::isEnabled('system', 'jlinkedsystem');
        return JFBCSocialUtilities::isJLinkedInstalled() && $isJLinkedSystemEnabled;
    }

    static function getJLinkedRenderKey()
    {
        $renderKeyString = '';
        
        $libFile = JPATH_ROOT.DS.'components'.DS.'com_jlinked'.DS.'libraries'.DS.'linkedin.php';
        if (!JFile::exists($libFile))
            return $renderKeyString;

        require_once($libFile);
        $jLinkedLibrary = JLinkedApiLibrary::getInstance();
        $renderKey = $jLinkedLibrary->getSocialTagRenderKey();
        if ($renderKey)
            $renderKeyString = " key=" . $renderKey;

        return $renderKeyString;
    }

    static function getExtraShareButtons($url, $dataCount, $showLinkedInButton, $showTwitterButton, $showGooglePlusButton, $renderKeyString)
    {
        if ($dataCount == "box_count")
        {
            $li_dataCount = "top";
            $gp_size = 'tall';
            $gp_annotation = 'bubble';
            $tw_size = 'vertical';
        }
        else if ($dataCount == 'button_count')
        {
            $li_dataCount = "right";
            $gp_size = 'medium';
            $gp_annotation = 'bubble';
            $tw_size = 'horizontal';
        }
        else if ($dataCount == "standard")
        {
            $li_dataCount = 'no_count';
            $gp_size = 'standard';
            $gp_annotation = 'none';
            $tw_size = 'none';
        }

        $extraButtonText = '';

        if($url == '')
            $url = JFBCSocialUtilities::getStrippedUrl();

        if($showLinkedInButton)
        {
            if(JFBCSocialUtilities::isJLinkedInstalled())
            {
                $renderString = JFBCSocialUtilities::getJLinkedRenderKey();
                $extraButtonText .= '{JLinkedShare url='. $url . ' counter=' . $li_dataCount . $renderString . '}';
            }
            else
                $extraButtonText .= '{JLinkedShare url='. $url . ' counter=' . $li_dataCount . $renderKeyString . '}';
        }
        if($showTwitterButton)
        {
            $extraButtonText .= '{SCTwitterShare url='. $url . ' data_count=' . $tw_size . $renderKeyString .'}';
        }
        if($showGooglePlusButton)
        {
            $extraButtonText .= '{SCGooglePlusOne url=' . $url . ' annotation=' . $gp_annotation . ' size=' . $gp_size . $renderKeyString . '}';
        }

        return $extraButtonText;
    }

    static function getStrippedUrl()
    {
        $href = JURI::current();

        $juri = JURI::getInstance();
        // Delete some common, unwanted query params to at least try to get at the canonical URL
        $juri->delVar('fb_comment_id');
        $juri->delVar('tp');
        $juri->delVar('notif_t');
        $juri->delVar('ref');
        $query = $juri->getQuery();

        if ($query)
            $href .= '?' . $query;

        return $href;
    }

    static function stripSystemTags(&$description, $metadataTag)
    {
        $replace = false;

        //Full Match
        if (preg_match_all('/\{' . $metadataTag . '.*?\}/i', $description, $matches, PREG_SET_ORDER))
        {
            $replace = true;
            foreach ($matches as $match)
            {
                $description = str_replace($match, '', $description);
            }
        }
        //Partial Match
        if (preg_match('/\{' . $metadataTag . '+(.*?)/i', $description, $matches))
        {
            $replace = true;
            $trimPoint = strpos($description, '{' . $metadataTag);
            if ($trimPoint == 0)
                $description = '';
            else
                $description = substr($description, 0, $trimPoint);
        }

        return $replace;
    }

    function setNewMappingEnabled()
    {
        $session =& JFactory::getSession();
        $session->set('jfbcCheckNewMapping', true);

        $jfbcLibrary = JFBConnectFacebookLibrary::getInstance();
        $jfbcLibrary->checkNewMapping = true;
    }

    function clearNewMappingEnabled()
    {
        $session =& JFactory::getSession();
        $session->clear('jfbcCheckNewMapping');

        $jfbcLibrary = JFBConnectFacebookLibrary::getInstance();
        $jfbcLibrary->checkNewMapping = false;

    }

    static function getCurrentReturnParameter(&$return, &$menuItemId)
    {
        // setup return url in case they should be redirected back to this page
        $uri = & JURI::getInstance();

        // Save the current page to the session, allowing us to redirect to it on login or logout if configured that way
        $isLoginRegister = JRequest::getCmd('view') == "loginregister";
        $isLoginReturning = JRequest::getCmd('task') == "loginFacebookUser";
        $isLogout = JRequest::getCmd('task') == "logout";

        //NOTE: Not checking option=com_jfbconnect because of system cache plugin
        if(!$isLoginRegister && !$isLoginReturning && !$isLogout)
        {
            $return = $uri->toString(array('path', 'query'));
            if ($return == "")
                $return = 'index.php';
        }

        //Save the current return parameter
        $returnParam = JRequest::getVar('return', '');
        if ($returnParam != "")
        {
            $return = urlencode($returnParam); // Required for certain SEF extensions
            $return = rawurldecode($return);
            $return = base64_decode($return);

            $returnURI = JURI::getInstance($return);
            $menuItemId = $returnURI->getVar('Itemid','');
            $menuItemId = JFilterInput::clean($menuItemId, 'INT');
        }
        else
            $menuItemId = JRequest::getInt('Itemid', 0);
    }
}