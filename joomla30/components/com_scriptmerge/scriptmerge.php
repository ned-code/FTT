<?php
/**
 * Joomla! System plugin - ScriptMerge
 *
 * @author Yireo (info@yireo.com)
 * @copyright Copyright 2013
 * @license GNU Public License
 * @link http://www.yireo.com
 */

// Check to ensure this file is included in Joomla!
defined('_JEXEC') or die( 'Restricted access' );

// Require the helper
require_once JPATH_SITE.'/components/com_scriptmerge/helpers/helper.php';
$helper = new ScriptMergeHelper();

// Test
if (JRequest::getInt('test', 0) == 1) {
    require_once 'test.php';
}

// Send the content-type header
$type = JRequest::getString('type');
if ($type == 'css') {
    header('Content-Type: text/css');
} else {
    header('Content-Type: application/javascript');
}

// Read the files parameter
$files = JRequest::getString('files');
if (!empty($files)) {

    $files = $helper->decodeList($files);
    $buffer = null;
    foreach ($files as $file) {
        if ($type == 'css') {
            if (!preg_match('/\.css$/', $file)) continue;
            $buffer .= $helper->getCssContent($file);
        } else {
            if (!preg_match('/\.js$/', $file)) continue;
            $buffer .= $helper->getJsContent($file);
        }
    }
}
                
// Clean up CSS-code
if($type == 'css') {
    $buffer = ScriptMergeHelper::cleanCssContent($buffer);

// Clean up JS-code
} else {
    $buffer = ScriptMergeHelper::cleanJsContent($buffer);
}

// Construct the expiration time
$expires = (int)($helper->getParams()->get('expiration', 30) * 60);

// Set the expiry in the future
if ($expires > 0) {
    header('Cache-Control: public, max-age='.$expires);
    header('Expires: '.gmdate('D, d M Y H:i:s', time() + $expires));

// Set the expiry in the past
} else {
    header("Cache-Control: no-cache, no-store, must-revalidate");
    header('Expires: '.gmdate('D, d M Y H:i:s', time() - (60 * 60 * 24)));
}

header('Last-Modified: '.gmdate('D, d M Y H:i:s', time()));
header('ETag: '.md5($buffer));

if (function_exists('gzencode') && ScriptMergeHelper::getParams()->get('force_gzip', 0) == 1) {
    header('Content-Encoding: gzip');
    print gzencode($buffer);
} else {
    print $buffer;
}

// Close the application
$application = JFactory::getApplication();
$application->close();
