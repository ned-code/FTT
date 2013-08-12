<?php
/**
 * @package        JFBConnect
 * @copyright (C) 2009-2012 by Source Coast - All rights reserved
 * @license http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */
// Check to ensure this file is included in Joomla!
defined('_JEXEC') or die('Restricted access');

jimport('joomla.event.plugin');

require_once(JPATH_SITE . DS . 'components' . DS . 'com_jfbconnect' . DS . 'libraries' . DS . 'utilities.php');

define('JFBC_CLASS_NAME', 'plgSystemJFBCSystem');

class plgSystemJFBCSystem extends JPlugin
{
    var $jfbcLibrary;
    var $jfbcCanvas;

    var $tagsToReplace = array(
        'jfbclogin' => '_getJFBCLogin',
        'jfbclike' => '_getJFBCLike',
        'jfbcsend' => '_getJFBCSend',
        'jfbccomments' => '_getJFBCComments',
        'jfbccommentscount' => '_getJFBCCommentsCount',
        'jfbcfan' => '_getJFBCFan',
        'jfbcfeed' => '_getJFBCFeed',
        'jfbcfriends' => '_getJFBCFriends',
        'jfbclivestream' => '_getJFBCLiveStream',
        'jfbcrecommendations' => '_getJFBCRecommendations',
        'jfbcrequest' => '_getJFBCRequest',
        'jfbcsubscribe' => '_getJFBCSubscribe',
        "sctwittershare" => '_getSCTwitterShare',
        "scgoogleplusone" => '_getSCGPlusOne',
        "jlinkedshare" => '_getJLinkedShare'
    );

    var $metadataTagsToStrip = array('JFBC', 'JLinked', 'SCTwitterShare', 'SCGooglePlusOne');

    static $cssIncluded = false;

    function __construct(& $subject, $config)
    {
        jimport('joomla.filesystem.file');
        $libFile = JPATH_ROOT . DS . 'components' . DS . 'com_jfbconnect' . DS . 'libraries' . DS . 'facebook.php';
        if (!JFile::exists($libFile))
            JError::raiseError(0, "File missing: " . $libFile . "<br/>Please re-install JFBConnect or disable the JFBCSystem Plugin");
        require_once($libFile);
        $this->jfbcLibrary = JFBConnectFacebookLibrary::getInstance();

        $app = JFactory::getApplication();
        if (!$app->isAdmin())
        {
            $canvasFile = JPATH_ROOT . DS . 'components' . DS . 'com_jfbconnect' . DS . 'libraries' . DS . 'canvas.php';
            if (!JFile::exists($canvasFile))
                JError::raiseError(0, "File missing: " . $canvasFile . "<br/>Please re-install JFBConnect or disable the JFBCSystem Plugin");
            require_once($canvasFile);
            $this->jfbcCanvas = JFBConnectCanvasLibrary::getInstance();
        }
        parent::__construct($subject, $config);
    }

    function onAfterInitialise()
    {
        $app = JFactory::getApplication();
        if (!$app->isAdmin())
        {
            $this->jfbcCanvas->setupCanvas();
        }
    }

    function onAfterDispatch()
    {
        $app = JFactory::getApplication();
        if (!$app->isAdmin())
        {
            $this->jfbcLibrary->initDocument();

            foreach ($this->metadataTagsToStrip as $metadataTag)
            {
                $this->_replaceTagInMetadata($metadataTag);
            }

            $doc =& JFactory::getDocument();
            if ($doc->getType() == 'html')
            {
                $doc->addCustomTag('<SCTwitterJSPlaceholder />');
                $doc->addCustomTag('<SCGooglePlusOneJSPlaceholder />');
                $doc->addCustomTag('<JLinkedJfbcJSPlaceholder />');
            }
        }
    }

    function onAfterRender()
    {
        $app = JFactory::getApplication();
        if (!$app->isAdmin())
        {
            $configModel = $this->jfbcLibrary->getConfigModel();
            $openGraphEnabled = $configModel->getSetting('social_graph_enabled');
            if ($openGraphEnabled)
                $openGraphNamespace = 'xmlns:og="http://ogp.me/ns#" ';
            else
                $openGraphNamespace = '';


            $body = JResponse::getBody();
            $body = str_replace("<html ", '<html xmlns:fb="http://ogp.me/ns/fb#" ' . $openGraphNamespace, $body);

            $fbApiJs = $this->_getJavascript($this->jfbcLibrary->facebookAppId);

            if (preg_match('/\<body[\s\S]*?\>/i', $body, $matches))
            {
                $newBody = str_replace($matches[0], $matches[0] . $fbApiJs, $body);
                JResponse::setBody($newBody);
            }

            $this->_doTagReplacements();
        }
        return true;
    }

    private function _replaceTagInMetadata($metadataTag)
    {
        $doc = & JFactory::getDocument();
        $description = $doc->getDescription();
        $replace = JFBCSocialUtilities::stripSystemTags($description, $metadataTag);

        if ($replace)
        {
            $description = trim($description);
            $doc->setDescription($description);
        }
    }

    private function _getLocale()
    {
        $fbLocale = $this->jfbcLibrary->getFacebookOverrideLocale();

        // Get the language to use
        if ($fbLocale == '')
        {
            $lang = JFactory::getLanguage();
            $locale = $lang->getTag();
        }
        else
        {
            $locale = $fbLocale;
        }

        $locale = str_replace("-", "_", $locale);
        return $locale;
    }

    private function _getJavascript($appId)
    {
        $locale = $this->_getLocale();
        $configModel = $this->jfbcLibrary->getConfigModel();
        // get Event Notification subscriptions
        $subs = "";
        if ($configModel->getSetting('social_notification_comment_enabled'))
            $subs .= "\nFB.Event.subscribe('comment.create', jfbc.social.comment.create);";
        if ($configModel->getSetting('social_notification_like_enabled'))
            $subs .= "\nFB.Event.subscribe('edge.create', jfbc.social.like.create);";
        if ($configModel->getSetting('social_notification_google_analytics'))
            $subs .= "\njfbc.social.googleAnalytics.trackFacebook();";

        $fbsiteurl = JURI::root();
        $channelurl = $fbsiteurl . 'components/com_jfbconnect/assets/jfbcchannel.php';
        if ($this->jfbcCanvas->get('resizeEnabled', false))
            $resizeCode = "window.setTimeout(function() {\n" .
                          "  FB.Canvas.setAutoGrow();\n" .
                          "}, 250);";
        else
            $resizeCode = "";

        if ($this->jfbcCanvas->get('canvasEnabled', false))
            $canvasCode = "jfbc.canvas.checkFrame();";
        else
            $canvasCode = "";

        if ($appId)
            $appIdCode = "appId: '" . $appId . "', ";
        else
            $appIdCode = "";
        $javascript =
                <<<EOT
<div id="fb-root"></div>
<script type="text/javascript">
{$canvasCode}\n
window.fbAsyncInit = function() {
FB.init({{$appIdCode}status: true, cookie: true, xfbml: true, oauth: true, channelUrl: '{$channelurl}'});{$subs}{$resizeCode}
};
(function(d){
     var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
     js = d.createElement('script'); js.id = id; js.async = true;
     js.src = "//connect.facebook.net/{$locale}/all.js";
     d.getElementsByTagName('head')[0].appendChild(js);
   }(document));
</script>
EOT;

        return $javascript;
    }

    private function _doTagReplacements()
    {
        $twitterTagFound = false;
        $googlePlusTagFound = false;
        $jLinkedTagFound = false;

        $isJLinkedEnabled = JFBCSocialUtilities::areJLinkedTagsEnabled();
        
        $tagsFound = false;
        $tagKeys = array_keys($this->tagsToReplace);
        foreach ($tagKeys as $tag)
        {
            $lowercaseTag = strtolower($tag);

            if($lowercaseTag != 'jlinkedshare' || !$isJLinkedEnabled)
            {
                //Tag has passed in values
                $regex = '/\{' . $tag . '\s+(.*?)\}/i';
                $currentTag1Found = $this->_replaceTag($lowercaseTag, $regex);
                $tagsFound = $currentTag1Found || $tagsFound;

                //Tag with no values
                $regex = '/\{' . $tag . '}/i';
                $currentTag2Found = $this->_replaceTag($lowercaseTag, $regex);
                $tagsFound = $currentTag2Found || $tagsFound;
            }

            if($currentTag1Found || $currentTag2Found)
            {
                if($lowercaseTag == 'sctwittershare')
                    $twitterTagFound = true;
                else if($lowercaseTag == 'scgoogleplusone')
                    $googlePlusTagFound = true;
                else if($lowercaseTag == 'jlinkedshare')
                    $jLinkedTagFound = true;
            }
        }

        $regex = '/\{JFBCGraph\s+(.*?)\}/i';
        $placeholder = '<JFBCGraphPlaceholder />';
        $this->_replaceGraphTag('jfbcgraph', $regex, $placeholder);

        $this->_replaceJSPlaceholders($twitterTagFound, $googlePlusTagFound, $jLinkedTagFound);
    }

    private function _replaceJSPlaceholders($twitterTagFound, $googlePlusTagFound, $jLinkedTagFound)
    {
        $uri = JURI::getInstance();
        $scheme = $uri->getScheme();

        //Twitter
        $twitterPlaceholder = '<SCTwitterJSPlaceholder />';
        if($twitterTagFound)
            $twitterJavascript = '<script src="'.$scheme.'://platform.twitter.com/widgets.js"></script>';
        else
            $twitterJavascript = '';

        //GooglePlus
        $googlePlaceholder = '<SCGooglePlusOneJSPlaceholder />';
        if($googlePlusTagFound)
            $googleJavascript = '<script src="'.$scheme.'://apis.google.com/js/plusone.js"></script>';
        else
            $googleJavascript = '';

        //JLinked
        $jLinkedPlaceholder = '<JLinkedJfbcJSPlaceholder />';
        if($jLinkedTagFound)
        {
            $jLinkedJavascript = '<script src="'.$scheme.'://platform.linkedin.com/in.js"></script>';
            if($scheme == 'https')
            {
                $jLinkedJavascript .= '<script type="text/javascript">'.
                    "IN.Event.on(IN,'frameworkLoaded',function(){if(/^https:\/\//i.test(location.href)){IN.ENV.images.sprite='https://www.linkedin.com/scds/common/u/img/sprite/'+IN.ENV.images.sprite.split('/').pop()}});
                    </script>";
            }
        }
        else
            $jLinkedJavascript = '';

        //Replace placeholder with Javascript if needed
        $contents = JResponse::getBody();
        $contents = str_replace($twitterPlaceholder, $twitterJavascript, $contents);
        $contents = str_replace($googlePlaceholder, $googleJavascript, $contents);
        $contents = str_replace($jLinkedPlaceholder, $jLinkedJavascript, $contents);
        JResponse::setBody($contents);
    }

    private function _replaceTag($method, $regex)
    {
        $replace = FALSE;
        $contents = JResponse::getBody();
        if (preg_match_all($regex, $contents, $matches, PREG_SET_ORDER))
        {
            $count = count($matches[0]);
            if ($count == 0)
                return true;

            $renderKey = $this->jfbcLibrary->getSocialTagRenderKey();
            $key1 = 'key=' . $renderKey . ' ';
            $key2 = 'key=' . $renderKey;

            foreach ($matches as $match)
            {
                if (isset($match[1]))
                    $val = $match[1];
                else
                    $val = '';

                //Add render key check here
                $renderKeyCheck = strtolower($val);
                $cannotRender = $renderKey != '' && (strpos($renderKeyCheck, $key1) === false) && (JFBCSocialUtilities::endswith($renderKeyCheck, $key2) == false);
                if ($cannotRender)
                    continue;

                if (array_key_exists($method, $this->tagsToReplace))
                {
                    $methodName = $this->tagsToReplace[$method];
                    $newText = call_user_func(array(JFBC_CLASS_NAME, $methodName), $val);
                    $replace = TRUE;

                    if(!self::$cssIncluded)
                    {
                        self::$cssIncluded = true;
                        $newText = '<link rel="stylesheet" href="'.JURI::base().'components/com_jfbconnect/assets/jfbconnect.css" type="text/css" />' . $newText;
                    }
                }
                else
                {
                    $newText = '';
                    $replace = FALSE;
                }

                $contents = str_replace($match[0], $newText, $contents);
            }
            if ($replace)
                JResponse::setBody($contents);
        }

        return $replace;
    }

    private function _splitIntoTagParameters($paramList)
    {
        $params = explode(' ', $paramList);

        $count = count($params);
        for ($i = 0; $i < $count; $i++)
        {
            $params[$i] = str_replace('"', '', $params[$i]);
            if (strpos($params[$i], '=') === false && $i > 0)
            {
                $previousIndex = $this->_findPreviousParameter($params, $i - 1);
                //Combine this with previous entry and space
                $combinedParamValue = $params[$previousIndex] . ' ' . $params[$i];
                $params[$previousIndex] = $combinedParamValue;
                unset($params[$i]);
            }
        }
        return $params;
    }

    private function _findPreviousParameter($params, $i)
    {
        for ($index = $i; $index >= 0; $index--)
        {
            if (isset($params[$index]))
                return $index;
        }
        return 0;
    }

    private function _replaceGraphTag($method, $regex, $placeholder)
    {
        $newGraphTags = array();

        $contents = JResponse::getBody();
        if (preg_match_all($regex, $contents, $matches, PREG_SET_ORDER))
        {
            $count = count($matches[0]);
            if ($count == 0)
                return true;

            $renderKey = $this->jfbcLibrary->getSocialTagRenderKey();
            $key1 = 'key=' . $renderKey . ' ';
            $key2 = 'key=' . $renderKey;

            foreach ($matches as $match)
            {
                $val = $match[1];

                //Add render key check here
                $cannotRender = $renderKey != '' && (strpos($val, $key1) === false) && (JFBCSocialUtilities::endswith($val, $key2) == false);
                if ($cannotRender)
                    continue;

                //Remove render key here
                $val = str_replace($key1, '', $val);
                $val = str_replace($key2, '', $val);

                $newGraphTags[] = $val;
                $contents = str_replace($match[0], '', $contents);
            }
        }

        //Replace Placeholder with new Head tags
        $graphTags = $this->_getJFBCGraphTags($newGraphTags);
        $contents = str_replace($placeholder, $graphTags, $contents);
        JResponse::setBody($contents);
    }

    /*
     * Add Login with Facebook button
     */

    private function _getJFBCLogin($paramList)
    {
        $buttonSize = 'medium';
        $showLogoutButton = '';

        $params = $this->_splitIntoTagParameters($paramList);
        foreach ($params as $param)
        {
            if ($param != null)
            {
                $paramValues = explode('=', $param, 2);
                if (count($paramValues) == 2) //[0] name [1] value
                {
                    $paramValues[0] = strtolower(trim($paramValues[0]));
                    $paramValues[1] = trim($paramValues[1]);

                    switch ($paramValues[0])
                    {
                        case 'size':
                            $buttonSize = $paramValues[1];
                            break;
                        case 'logout':
                            $showLogoutButton = $paramValues[1];
                            break;
                    }
                }
            }
        }

        $user = JFactory::getUser();
        if ($user->guest) // Only show login button if user isn't logged in (no remapping for now)
            $fbLogin = $this->jfbcLibrary->getLoginButton($buttonSize);
        else
        {
            $fbLogin = ""; // return blank for registered users

            if ($showLogoutButton == '1' || $showLogoutButton == 'true')
                $fbLogin = $this->jfbcLibrary->getLogoutButton();
        }

        return $fbLogin;
        return '<div class="jfbclogin">' . $fbLogin . '</div>';
    }

    /*
     * Add Like button social plugin
     */

    private function _getJFBCLike($paramList)
    {
        $url = '';
        $buttonStyle = '';
        $showFaces = '';
        $showSendButton = '';
        $width = '';
        $verbToDisplay = '';
        $font = '';
        $colorScheme = '';

        $params = $this->_splitIntoTagParameters($paramList);
        foreach ($params as $param)
        {
            if ($param != null)
            {
                $paramValues = explode('=', $param, 2);
                if (count($paramValues) == 2) //[0] name [1] value
                {
                    $paramValues[0] = strtolower(trim($paramValues[0]));
                    $paramValues[1] = trim($paramValues[1]);

                    switch ($paramValues[0])
                    {
                        case 'url':
                            $url = $paramValues[1];
                            break;
                        case 'layout':
                            $buttonStyle = $paramValues[1];
                            break;
                        case 'show_faces':
                            $showFaces = strtolower($paramValues[1]);
                            break;
                        case 'show_send_button':
                            $showSendButton = strtolower($paramValues[1]);
                            break;
                        case 'width':
                            $width = $paramValues[1];
                            break;
                        case 'action':
                            $verbToDisplay = $paramValues[1];
                            break;
                        case 'font':
                            $font = $paramValues[1];
                            break;
                        case 'colorscheme':
                            $colorScheme = $paramValues[1];
                            break;
                    }
                }
            }
        }

        if (!$url)
            $url = JFBCSocialUtilities::getStrippedUrl();

        $likeButtonText = '<div class="jfbclike"><fb:like href="' . $url . '"';
        if ($showFaces == "false" || $showFaces == "0")
            $likeButtonText .= ' show_faces="false"';
        else
            $likeButtonText .= ' show_faces="true"';

        if ($showSendButton == "false" || $showSendButton == "0")
            $likeButtonText .= ' send="false"';
        else
            $likeButtonText .= ' send="true"';

        if ($buttonStyle)
            $likeButtonText .= ' layout="' . $buttonStyle . '"';
        if ($width)
            $likeButtonText .= ' width="' . $width . '"';
        if ($verbToDisplay)
            $likeButtonText .= ' action="' . $verbToDisplay . '"';
        if ($font)
            $likeButtonText .= ' font="' . $font . '"';
        if ($colorScheme)
            $likeButtonText .= ' colorscheme="' . $colorScheme . '"';
        $likeButtonText .= '></fb:like></div>';
        return $likeButtonText;
    }

    /*
     * Add Send button social plugin
     */

    private function _getJFBCSend($paramList)
    {
        $url = '';
        $font = '';
        $colorScheme = '';
        $ref = '';

        $params = $this->_splitIntoTagParameters($paramList);
        foreach ($params as $param)
        {
            if ($param != null)
            {
                $paramValues = explode('=', $param, 2);
                if (count($paramValues) == 2) //[0] name [1] value
                {
                    $paramValues[0] = strtolower(trim($paramValues[0]));
                    $paramValues[1] = trim($paramValues[1]);

                    switch ($paramValues[0])
                    {
                        case 'url':
                            $url = $paramValues[1];
                            break;
                        case 'font':
                            $font = $paramValues[1];
                            break;
                        case 'colorscheme':
                            $colorScheme = $paramValues[1];
                            break;
                        case 'ref' :
                            $ref = $paramValues[1];
                            break;
                    }
                }
            }
        }

        if (!$url)
            $url = JFBCSocialUtilities::getStrippedUrl();

        $sendButtonText = '<div class="jfbcsend"><fb:send href="' . $url . '"';

        if ($font)
            $sendButtonText .= ' font="' . $font . '"';
        if ($colorScheme)
            $sendButtonText .= ' colorscheme="' . $colorScheme . '"';
        if ($ref)
            $sendButtonText .= ' ref="' . $ref . '"';
        $sendButtonText .= '></fb:send></div>';
        return $sendButtonText;
    }

    /*
     * Add Comments social plugin
     */

    private function _getJFBCComments($paramList)
    {
        $href = '';
        $xid = ''; //DEPRECATED
        $width = '';
        $numComments = '';
        $colorscheme = '';

        $params = $this->_splitIntoTagParameters($paramList);
        foreach ($params as $param)
        {
            if ($param != null)
            {
                $paramValues = explode('=', $param, 2);
                if (count($paramValues) == 2) //[0] name [1] value
                {
                    $paramValues[0] = strtolower(trim($paramValues[0]));
                    $paramValues[1] = trim($paramValues[1]);

                    switch ($paramValues[0])
                    {
                        case 'href':
                            $href = $paramValues[1];
                            break;
                        case 'width':
                            $width = $paramValues[1];
                            break;
                        case 'num_posts':
                            $numComments = $paramValues[1];
                            break;
                        case 'xid':
                            $xid = $paramValues[1];
                            break;
                        case 'colorscheme':
                            $colorscheme = $paramValues[1];
                            break;
                    }
                }
            }
        }

        $commentString = '<div class="jfbccomments"><fb:comments';

        if ($href)
            $commentString .= ' href="' . $href . '"';
        else if ($xid) //Use deprecated xid to keep old comments: http://developers.facebook.com/blog/post/472
            $commentString .= ' xid="' . $xid . '" migrated="1"';
        else
        {
            $url = JFBCSocialUtilities::getStrippedUrl();
            $commentString .= ' href="' . $url . '"';
        }

        if ($width)
            $commentString .= ' width="' . $width . '"';
        if ($numComments || $numComments == "0")
            $commentString .= ' num_posts="' . $numComments . '"';
        if ($colorscheme)
            $commentString .= ' colorscheme="' . $colorscheme . '"';

        $commentString .= '></fb:comments></div>';
        return $commentString;
    }

    /*
     * Add Comments Count plugin
     */

    private function _getJFBCCommentsCount($paramList)
    {
        $href = '';

        $params = $this->_splitIntoTagParameters($paramList);
        foreach ($params as $param)
        {
            if ($param != null)
            {
                $paramValues = explode('=', $param, 2);
                if (count($paramValues) == 2) //[0] name [1] value
                {
                    $paramValues[0] = strtolower(trim($paramValues[0]));
                    $paramValues[1] = trim($paramValues[1]);

                    switch ($paramValues[0])
                    {
                        case 'href':
                            $href = $paramValues[1];
                            break;
                    }
                }
            }
        }

        //Get the Comments Count string
        $tagString = '<fb:comments-count';
        if ($href)
            $tagString .= ' href="' . $href . '"';
        else
        {
            $url = JFBCSocialUtilities::getStrippedUrl();
            $tagString .= ' href="' . $url . '"';
        }
        $tagString .= '></fb:comments-count>';

        $lang = JFactory::getLanguage();
        $lang->load('com_jfbconnect');

        $commentString = '<div class="jfbccomments_count">';
        $commentString .= JText::sprintf('COM_JFBCONNECT_COMMENTS_COUNT', $tagString);
        $commentString .= '</div>';
        return $commentString;
    }

    /*
     * Add Like Box social plugin
     */

    private function _getJFBCFan($paramList)
    {
        $height = '';
        $width = '';
        $colorScheme = '';
        $href = '';
        $showFaces = '';
        $stream = '';
        $header = '';
        $borderColor = '';

        $params = $this->_splitIntoTagParameters($paramList);
        foreach ($params as $param)
        {
            if ($param != null)
            {
                $paramValues = explode('=', $param, 2);
                if (count($paramValues) == 2) //[0] name [1] value
                {
                    $paramValues[0] = strtolower(trim($paramValues[0]));
                    $paramValues[1] = trim($paramValues[1]);

                    switch ($paramValues[0])
                    {
                        case 'height': //Not shown - http://developers.facebook.com/docs/reference/plugins/like-box/
                            $height = $paramValues[1];
                            break;
                        case 'width':
                            $width = $paramValues[1];
                            break;
                        case 'colorscheme':
                            $colorScheme = $paramValues[1];
                            break;
                        case 'href':
                            $href = $paramValues[1];
                            break;
                        case 'show_faces':
                            $showFaces = $paramValues[1];
                            break;
                        case 'stream':
                            $stream = $paramValues[1];
                            break;
                        case 'header':
                            $header = $paramValues[1];
                            break;
                        case 'border_color':
                            $borderColor = $paramValues[1];
                            break;
                    }
                }
            }
        }

        $fanString = '<div class="jfbcfan"><fb:like-box';

        if ($showFaces == "false" || $showFaces == "0")
            $fanString .= ' show_faces="false"';
        else
            $fanString .= ' show_faces="true"';

        if ($header == "false" || $header == "0")
            $fanString .= ' header="false"';
        else
            $fanString .= ' header="true"';

        if ($stream == "false" || $stream == "0")
            $fanString .= ' stream="false"';
        else
            $fanString .= ' stream="true"';


        if ($width)
            $fanString .= ' width="' . $width . '"';
        if ($height)
            $fanString .= ' height="' . $height . '"';
        if ($href)
            $fanString .= ' href="' . $href . '"';
        if ($colorScheme)
            $fanString .= ' colorscheme="' . $colorScheme . '"';
        if ($borderColor)
            $fanString .= ' border_color="' . $borderColor . '"';

        $fanString .= '></fb:like-box></div>';
        return $fanString;
    }

    /*
     * Add Activity Feed social plugin
     */

    private function _getJFBCFeed($paramList)
    {
        $site = '';
        $height = '';
        $width = '';
        $colorScheme = '';
        $font = '';
        $borderColor = '';
        $recommendations = '';
        $header = '';
        $linkTarget = '';

        $params = $this->_splitIntoTagParameters($paramList);
        foreach ($params as $param)
        {
            if ($param != null)
            {
                $paramValues = explode('=', $param, 2);
                if (count($paramValues) == 2) //[0] name [1] value
                {
                    $paramValues[0] = strtolower(trim($paramValues[0]));
                    $paramValues[1] = trim($paramValues[1]);

                    switch ($paramValues[0])
                    {
                        case 'site':
                            $site = $paramValues[1];
                            break;
                        case 'height':
                            $height = $paramValues[1];
                            break;
                        case 'width':
                            $width = $paramValues[1];
                            break;
                        case 'colorscheme':
                            $colorScheme = $paramValues[1];
                            break;
                        case 'font':
                            $font = $paramValues[1];
                            break;
                        case 'border_color':
                            $borderColor = $paramValues[1];
                            break;
                        case 'recommendations':
                            $recommendations = $paramValues[1];
                            break;
                        case 'header':
                            $header = $paramValues[1];
                            break;
                        case 'link_target':
                            $linkTarget = $paramValues[1];
                    }
                }
            }
        }

        $feedString = '<div class="jfbcfeed"><fb:activity';

        if ($recommendations == "false" || $recommendations == "0")
            $feedString .= ' recommendations="false"';
        else
            $feedString .= ' recommendations="true"';

        if ($header == "false" || $header == "0")
            $feedString .= ' header="false"';
        else
            $feedString .= ' header="true"';

        if ($width)
            $feedString .= ' width="' . $width . '"';
        if ($height)
            $feedString .= ' height="' . $height . '"';
        if ($site)
            $feedString .= ' site="' . $site . '"';
        if ($colorScheme)
            $feedString .= ' colorscheme="' . $colorScheme . '"';
        if ($font)
            $feedString .= ' font="' . $font . '"';
        if ($borderColor)
            $feedString .= ' border_color="' . $borderColor . '"';
        if ($linkTarget)
            $feedString .= ' linktarget="' . $linkTarget . '"';

        $feedString .= '></fb:activity></div>';
        return $feedString;
    }

    /*
     * Add Facepile social plugin
     */

    private function _getJFBCFriends($paramList)
    {
        $href = '';
        $width = '';
        $maxRows = '';
        $colorScheme = '';
        $size = '';

        $params = $this->_splitIntoTagParameters($paramList);
        foreach ($params as $param)
        {
            if ($param != null)
            {
                $paramValues = explode('=', $param, 2);
                if (count($paramValues) == 2) //[0] name [1] value
                {
                    $paramValues[0] = strtolower(trim($paramValues[0]));
                    $paramValues[1] = trim($paramValues[1]);

                    switch ($paramValues[0])
                    {
                        case 'href':
                            $href = $paramValues[1];
                            break;
                        case 'width':
                            $width = $paramValues[1];
                            break;
                        case 'max_rows':
                            $maxRows = $paramValues[1];
                            break;
                        case 'colorscheme':
                            $colorScheme = $paramValues[1];
                            break;
                        case 'size':
                            $size = $paramValues[1];
                            break;
                    }
                }
            }
        }

        $friendsString = '<div class="jfbcfriends"><fb:facepile';

        if ($href)
            $friendsString .= ' href="' . $href . '"';
        if ($width)
            $friendsString .= ' width="' . $width . '"';
        if ($maxRows)
            $friendsString .= ' max_rows="' . $maxRows . '"';
        if ($colorScheme)
            $friendsString .= ' colorscheme="' . $colorScheme . '"';
        if ($size)
            $friendsString .= ' size="' . $size . '"';

        $friendsString .= '></fb:facepile></div>';
        return $friendsString;
    }

    /*
     * Add Live Stream social plugin
     */

    private function _getJFBCLiveStream($paramList)
    {
        $appId = '';
        $width = '';
        $height = '';
        $xid = '';
        $viaURL = '';
        $alwaysPostToFriends = '';

        $params = $this->_splitIntoTagParameters($paramList);
        foreach ($params as $param)
        {
            if ($param != null)
            {
                $paramValues = explode('=', $param, 2);
                if (count($paramValues) == 2) //[0] name [1] value
                {
                    $paramValues[0] = strtolower(trim($paramValues[0]));
                    $paramValues[1] = trim($paramValues[1]);

                    switch ($paramValues[0])
                    {
                        case 'event_app_id':
                            $appId = $paramValues[1];
                            break;
                        case 'width':
                            $width = $paramValues[1];
                            break;
                        case 'height':
                            $height = $paramValues[1];
                            break;
                        case 'xid' :
                            $xid = $paramValues[1];
                            break;
                        case 'via_url' :
                            $viaURL = $paramValues[1];
                            break;
                        case 'always_post_to_friends':
                            $alwaysPostToFriends = $paramValues[1];
                            break;
                    }
                }
            }
        }

        $liveStreamString = '<div class="jfbclivestream"><fb:live-stream';

        if ($alwaysPostToFriends == "true" || $alwaysPostToFriends == "1")
            $liveStreamString .= ' always_post_to_friends="true"';
        else
            $liveStreamString .= ' always_post_to_friends="false"';

        if ($appId)
            $liveStreamString .= ' event_app_id="' . $appId . '"';
        if ($width)
            $liveStreamString .= ' width="' . $width . '"';
        if ($height)
            $liveStreamString .= ' height="' . $height . '"';
        if ($xid)
            $liveStreamString .= ' xid="' . $xid . '"';
        if ($viaURL)
            $liveStreamString .= ' via_url="' . $viaURL . '"';

        $liveStreamString .= '></fb:live-stream></div>';
        return $liveStreamString;
    }

    /*
     * Add Recommendations social plugin
     */

    private function _getJFBCRecommendations($paramList)
    {
        $site = '';
        $width = '';
        $height = '';
        $header = '';
        $colorScheme = '';
        $font = '';
        $borderColor = '';
        $linkTarget = '';

        $params = $this->_splitIntoTagParameters($paramList);
        foreach ($params as $param)
        {
            if ($param != null)
            {
                $paramValues = explode('=', $param, 2);
                if (count($paramValues) == 2) //[0] name [1] value
                {
                    $paramValues[0] = strtolower(trim($paramValues[0]));
                    $paramValues[1] = trim($paramValues[1]);

                    switch ($paramValues[0])
                    {
                        case 'site':
                            $site = $paramValues[1];
                            break;
                        case 'width':
                            $width = $paramValues[1];
                            break;
                        case 'height':
                            $height = $paramValues[1];
                            break;
                        case 'colorscheme' :
                            $colorScheme = $paramValues[1];
                            break;
                        case 'header' :
                            $header = $paramValues[1];
                            break;
                        case 'font':
                            $font = $paramValues[1];
                            break;
                        case 'border_color':
                            $borderColor = $paramValues[1];
                            break;
                        case 'link_target':
                            $linkTarget = $paramValues[1];
                            break;
                    }
                }
            }
        }

        $recString = '<div class="jfbcrecommendations"><fb:recommendations';

        if ($header == "false" || $header == "0")
            $recString .= ' header="false"';
        else
            $recString .= ' header="true"';

        if ($site)
            $recString .= ' site="' . $site . '"';
        if ($width)
            $recString .= ' width="' . $width . '"';
        if ($height)
            $recString .= ' height="' . $height . '"';
        if ($colorScheme)
            $recString .= ' colorscheme="' . $colorScheme . '"';
        if ($font)
            $recString .= ' font="' . $font . '"';
        if ($borderColor)
            $recString .= ' border_color="' . $borderColor . '"';
        if ($linkTarget)
            $recString .= ' linktarget="' . $linkTarget . '"';

        $recString .= '></fb:recommendations></div>';
        return $recString;
    }

    private function _getJFBCRequest($paramList)
    {
        $requestID = '';
        $linkText = '';
        $linkImage = '';

        $params = $this->_splitIntoTagParameters($paramList);
        foreach ($params as $param)
        {
            if ($param != null)
            {
                $paramValues = explode('=', $param, 2);
                if (count($paramValues) == 2) //[0] name [1] value
                {
                    $paramValues[0] = strtolower(trim($paramValues[0]));
                    $paramValues[1] = trim($paramValues[1]);

                    switch ($paramValues[0])
                    {
                        case 'request_id':
                            $requestID = $paramValues[1];
                            break;
                        case 'link_text':
                            $linkText = $paramValues[1];
                            break;
                        case 'link_image':
                            $linkImage = $paramValues[1];
                            break;
                    }
                }
            }
        }
        $tagString = '';
        if ($requestID != '')
        {
            JModel::addIncludePath(JPATH_SITE . DS . 'components' . DS . 'com_jfbconnect' . DS . 'models');
            $requestModel = JModel::getInstance('Request', "JFBConnectModel");
            $request = $requestModel->getData($requestID);

            if ($request && $request->published)
            {
                $linkValue = $linkText;
                if ($linkImage != '')
                    $linkValue = '<img src="' . $linkImage . '" alt="' . $request->title . ' "/>';

                $tagString = '<div class="jfbcrequest">';
                $tagString .= '<a href="javascript:void(0)" onclick="jfbc.request.popup(' . $requestID . '); return false;">' . $linkValue . '</a>';
                $tagString .= '</div>';
                $tagString .=
                        <<<EOT
                        <script type="text/javascript">
    var jfbcRequests = Object.prototype.toString.call(jfbcRequests) == "[object Array]" ? jfbcRequests : [];
    var jfbcRequest = new Object;
    jfbcRequest.title = "{$request->title}";
    jfbcRequest.message = "{$request->message}";
    jfbcRequest.destinationUrl = "{$request->destination_url}";
    jfbcRequest.thanksUrl = "{$request->thanks_url}";
    jfbcRequests[{$requestID}] = jfbcRequest;
</script>
EOT;
            }
        }
        return $tagString;
    }

    private function _getJFBCSubscribe($paramList)
    {
        $href = '';
        $layout = '';
        $showFaces = '';
        $colorScheme = '';
        $font = '';
        $width = '';

        $params = $this->_splitIntoTagParameters($paramList);
        foreach ($params as $param)
        {
            if ($param != null)
            {
                $paramValues = explode('=', $param, 2);
                if (count($paramValues) == 2) //[0] name [1] value
                {
                    $paramValues[0] = strtolower(trim($paramValues[0]));
                    $paramValues[1] = trim($paramValues[1]);

                    switch ($paramValues[0])
                    {
                        case 'href':
                            $href = $paramValues[1];
                            break;
                        case 'layout':
                            $layout = $paramValues[1];
                            break;
                        case 'show_faces':
                            $showFaces = strtolower($paramValues[1]);
                            break;
                        case 'width':
                            $width = $paramValues[1];
                            break;
                        case 'font':
                            $font = $paramValues[1];
                            break;
                        case 'colorscheme':
                            $colorScheme = $paramValues[1];
                            break;
                    }
                }
            }
        }

        $tagText = '<div class="jfbcsubscribe"><fb:subscribe href="' . $href . '"';
        if ($showFaces == "false" || $showFaces == "0")
            $tagText .= ' show_faces="false"';
        else
            $tagText .= ' show_faces="true"';

        if ($layout)
            $tagText .= ' layout="' . $layout . '"';
        if ($width)
            $tagText .= ' width="' . $width . '"';
        if ($font)
            $tagText .= ' font="' . $font . '"';
        if ($colorScheme)
            $tagText .= ' colorscheme="' . $colorScheme . '"';
        $tagText .= '></fb:subscribe></div>';
        return $tagText;
    }

    private function _getSCTwitterShare($paramList)
    {
        $url = '';
        $dataCount = '';

        $params = $this->_splitIntoTagParameters($paramList);
        foreach ($params as $param)
        {
            if ($param != null)
            {
                $paramValues = explode('=', $param, 2);
                if (count($paramValues) == 2) //[0] name [1] value
                {
                    $paramValues[0] = strtolower(trim($paramValues[0]));
                    $paramValues[1] = trim($paramValues[1]);

                    switch ($paramValues[0])
                    {
                        case 'url':
                            $url = $paramValues[1];
                            break;
                        case 'data_count':
                            $dataCount = $paramValues[1];
                            break;
                    }
                }
            }
        }

        if (!$url)
            $url = JFBCSocialUtilities::getStrippedUrl();

        $tagButtonText = '<div class="sc_twittershare">';
        $tagButtonText .= '<a href="http://twitter.com/share" class="twitter-share-button" ';

        if ($url)
            $tagButtonText .= 'data-url="' . $url;
        if ($dataCount == 'horizontal' || $dataCount == 'vertical' || $dataCount == 'none')
            $tagButtonText .= '" data-count="' . $dataCount;

        $tagButtonText .= '">Tweet</a></div>';

        return $tagButtonText;
    }

    private function _getSCGPlusOne($paramList)
    {
        $url = '';
        $annotation = '';
        $size = '';

        $params = $this->_splitIntoTagParameters($paramList);
        foreach ($params as $param)
        {
            if ($param != null)
            {
                $paramValues = explode('=', $param, 2);
                if (count($paramValues) == 2) //[0] name [1] value
                {
                    $paramValues[0] = strtolower(trim($paramValues[0]));
                    $paramValues[1] = trim($paramValues[1]);

                    switch ($paramValues[0])
                    {
                        case 'url':
                            $url = $paramValues[1];
                            break;
                        case 'annotation':
                            $annotation = $paramValues[1];
                            break;
                        case 'size':
                            $size = $paramValues[1];
                            break;
                    }
                }
            }
        }

        if (!$url)
            $url = JFBCSocialUtilities::getStrippedUrl();

        $tagButtonText = '<div class="sc_gplusone"><g:plusone';
        if ($size)
            $tagButtonText .= ' size="' . $size;
        if ($annotation)
            $tagButtonText .= '" annotation="' . $annotation;
        if ($url)
            $tagButtonText .= '" href="' . $url;
        $tagButtonText .= '"></g:plusone></div>';

        return $tagButtonText;
    }

    private function _getJLinkedShare($paramList)
    {
        $url = '';
        $countMode = '';

        $params = $this->_splitIntoTagParameters($paramList);
        foreach ($params as $param)
        {
            if($param != null)
            {
                $paramValues = explode('=', $param, 2);
                if (count($paramValues) == 2) //[0] name [1] value
                {
                    $paramValues[0] = strtolower(trim($paramValues[0]));
                    $paramValues[1] = trim($paramValues[1]);

                    switch ($paramValues[0])
                    {
                        case 'url':
                            $url = $paramValues[1];
                            break;
                        case 'counter':
                            $countMode = $paramValues[1];
                            break;
                    }
                }
            }
        }

        if (!$url)
            $url = JFBCSocialUtilities::getStrippedUrl();

        $tagButtonText = '<div class="jlinkedShare">';
        $tagButtonText .= '<script type="IN/Share"';

        if($url)
            $tagButtonText .= ' data-url="' . $url . '"';
        if($countMode && ($countMode == 'top' || $countMode == 'right'))
            $tagButtonText .= ' data-counter="' . $countMode . '"';

        $tagButtonText .= '></script></div>';

        return $tagButtonText;
    }

    private function _getJFBCGraphTags($graphFieldArray)
    {
        $headerGraphString = '';
        $carriageReturn = chr(13);
        $configModel = $this->jfbcLibrary->getConfigModel();
        $socialGraphEnabled = $configModel->getSetting('social_graph_enabled');

        if ($socialGraphEnabled == '1')
        {
            //Handle {JFBCGraph} tags first. They have priority
            foreach ($graphFieldArray as $graphField)
            {
                $headerGraphString .= $this->_getJFBCGraphProperty($graphField, $headerGraphString);
            }

            //Default list of carriage-returned fields that are each key=value format
            $socialGraphFields = $configModel->getSetting('social_graph_fields');
            $fields = explode($carriageReturn, $socialGraphFields);
            foreach ($fields as $graphField)
            {
                $headerGraphString .= $this->_getJFBCGraphProperty($graphField, $headerGraphString);
            }

            //Check to see that description, url and title are added. If not, then
            //generate appropriate values from current page
            $doc = & JFactory::getDocument();
            if (strpos($headerGraphString, 'og:url') === false)
            {
                $url = JFBCSocialUtilities::getStrippedUrl();
                $headerGraphString .= '<meta property="og:url" content="' . $url . '"/>' . $carriageReturn;
            }
            if (strpos($headerGraphString, 'og:title') === false)
            {
                $title = $doc->getTitle();
                $title = str_replace('"', "'", $title);
                $headerGraphString .= '<meta property="og:title" content="' . $title . '"/>' . $carriageReturn;
            }
            if (strpos($headerGraphString, 'og:description') === false)
            {
                $desc = $doc->getDescription();
                $desc = str_replace('"', "'", $desc);
                $headerGraphString .= '<meta property="og:description" content="' . $desc . '"/>' . $carriageReturn;
            }
            if (strpos($headerGraphString, 'og:type') === false)
            {
                $isHomePage = $this->isHomepage();
                if ($isHomePage)
                    $type = "website";
                else
                    $type = "article";
                $headerGraphString .= '<meta property="og:type" content="' . $type . '" />' . $carriageReturn;
            }
            if (strpos($headerGraphString, 'fb:app_id') === false)
            {
                //Add in App ID
                $appId = $configModel->getSetting('facebook_app_id', '');
                if ($appId)
                    $headerGraphString .= '<meta property="fb:app_id" content="' . $appId . '"/>' . $carriageReturn;
            }
            if (strpos($headerGraphString, 'og:locale') === false)
            {
                $locale = $this->_getLocale();
                $headerGraphString .= '<meta property="og:locale" content="' . $locale . '" />' . $carriageReturn;
            }
        }

        return $headerGraphString;
    }

    /*
     * Expecting a field=value string
     */

    private function _getJFBCGraphProperty($graphField, $headerGraphString)
    {
        $carriageReturn = chr(13);

        $keyValue = explode('=', $graphField, 2);
        if (count($keyValue) == 2)
        {
            $graphName = strtolower(trim($keyValue[0]));
            $graphValue = trim($keyValue[1]);

            if (strpos($graphName, ':') === false)
            {
                if ($graphName == 'admins' || $graphName == 'app_id')
                    $graphName = 'fb:' . $graphName;
                else
                    $graphName = 'og:' . $graphName;
            }

            if (strpos($headerGraphString, $graphName) === false || $graphName == 'og:image')
                return '<meta property="' . $graphName . '" content="' . $graphValue . '"/>' . $carriageReturn;
            else
                return '';
        }
    }

    function isHomepage()
    {
        $menu = & JSite::getMenu();
        return ($menu->getActive() == $menu->getDefault());
    }
}

