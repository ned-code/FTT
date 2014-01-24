<?php

/**
 * @version    $version 3.0 Peter Bui  $
 * @copyright    Copyright (C) 2012 PB Web Development. All rights reserved.
 * @license    GNU/GPL, see LICENSE.php
 * Updated    27th October 2013
 *
 * Twitter: @astroboysoup
 * Blog: http://pbwebdev.com/blog/
 * Email: peter@pbwebdev.com.au
 *
 * Joomla! is free software. This version may have been modified pursuant
 * to the GNU General Public License, and as distributed it includes or
 * is derivative of works licensed under the GNU General Public License or
 * other free or open source software licenses.
 * See COPYRIGHT.php for copyright notices and details.
 */
// no direct access
defined('_JEXEC') or die('Restricted access');

jimport('joomla.plugin.plugin');

class plgSystemGoogleAnalyticsPro extends JPlugin {

    function plgGoogleAnalyticsPro(&$subject, $config) {
        parent::__construct($subject, $config);
        $this->_plugin = JPluginHelper::getPlugin('system', 'GoogleAnalyticsPro');
        $this->_params = new JParameter($this->_plugin->params);
    }

    function onAfterRender() {
        // Initialise variables
        $trackerCode = $this->params->get('code', '');
        $position = $this->params->get('position', '');
        $enhanced = $this->params->get('enhanced', '');
        $ipTracking = $this->params->get('ipTracking', '');
        $multiSub = $this->params->get('multiSub', '');
        $multiTop = $this->params->get('multiTop', '');
        $remarketing = $this->params->get('remarketing', '');
        $verify = $this->params->get('verify', '');
        $verifyOutput = '<meta name="google-site-verification" content="' . $verify . '" />';
        $sampleRate = $this->params->get('sampleRate', '');
        $setCookieTimeout = $this->params->get('setCookieTimeout', '');
        $siteSpeedSampleRate = $this->params->get('siteSpeedSampleRate', '');
        $visitorCookieTimeout = $this->params->get('visitorCookieTimeout', '');

        $app = JFactory::getApplication();

        // skip if admin page
        if ($app->isAdmin()) {
            return;
        }

        //getting body code and storing as buffer
        $buffer = JResponse::getBody();

        //embed Google Analytics code
        $javascript = "<script type=\"text/javascript\">
 var _gaq = _gaq || [];
 ";

        if ($enhanced) {
            $javascript .= "var pluginUrl =
    '//www.google-analytics.com/plugins/ga/inpage_linkid.js';
 _gaq.push(['_require', 'inpage_linkid', pluginUrl]);\n";
        }
        $javascript .= " _gaq.push(['_setAccount', '" . $trackerCode . "']);
        ";
        if ($ipTracking) {
            $javascript .= " _gaq.push(['_gat._anonymizeIp']);\n";
        }
        if ($multiSub || $multiTop) {
            $javascript .= " _gaq.push(['_setDomainName', '" . $_SERVER['SERVER_NAME'] . "']);\n";
        }
        if ($multiTop) {
            $javascript .= " _gaq.push(['_setAllowLinker', true]);\n";
        }
        if ($sampleRate) {
            $javascript .= " _gaq.push(['_setSampleRate', '" . $sampleRate . "']);\n";
        }
        if ($setCookieTimeout) {
            $javascript .= " _gaq.push(['_setSessionCookieTimeout', '" . $setCookieTimeout . "']);\n";
        }
        if ($siteSpeedSampleRate) {
            $javascript .= " _gaq.push(['_setSiteSpeedSampleRate', '" . $siteSpeedSampleRate . "']);\n";
        }
        if ($visitorCookieTimeout) {
            $javascript .= " _gaq.push(['_setVisitorCookieTimeout', '" . $visitorCookieTimeout . "']);\n";
        }
        if ($remarketing) {
            $remarketingOutput = " ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';\n";
        } else {
            $remarketingOutput = " ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';\n";
        }

        $javascript .= "_gaq.push(['_trackPageview']);

 (function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;\n"
. $remarketingOutput .
 " var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
 })();
</script>
<!-- Google Analytics Pro Plugin by PB Web Development -->";

        if ($position) {
            // adding the Google Analytics code in the header before the ending </body> tag and then replacing the buffer
            $buffer = preg_replace("/<\/body>/",  "\n\n" . $javascript . "\n</body>", $buffer);
            $buffer = preg_replace("/<\/head>/", "\n\n" . $verifyOutput  . "\n</head>", $buffer);

        } else {
            // adding the Google Analytics code in the header before the ending </head> tag and then replacing the buffer
            $buffer = preg_replace("/<\/head>/", "\n\n" . $verifyOutput . "\n" . $javascript . "\n</head>", $buffer);
        }
        //output the buffer
        JResponse::setBody($buffer);

        return true;
    }

}

?>