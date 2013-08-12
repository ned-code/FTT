<?php
/**
 * @package		SourceCoast Extension Version Tool
 * @copyright (C) 2010-2012 by SourceCoast - All rights reserved
 * @license http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */
defined('_JEXEC') or die('Restricted access');

jimport('joomla.filesystem.file');
jimport('joomla.filesystem.folder');
jimport('joomla.utilities.simplexml');
jimport('joomla.html.parameter.element');

class sourceCoastConnect
{

    var $xmlString;
    var $imagePath;

    function __construct($checkName, $imagePathDir)
    {
        $this->xmlString = $this->_getRemoteXML($checkName);
        $this->imagePath = $imagePathDir;
    }

    function display($extensionName, $installedVersion = null)
    {
        $this->_getExtensionData('joomla', $extensionName);
        if ($installedVersion != null)
            $this->installedVersion = $installedVersion;
        else
            $this->installedVersion = $this->_getJoomlaInstalledVersion($extensionName);

        #if ($tmplFile == null)
        #$tmplFile = dirname(__FILE__).DS.'template.php';

        include_once(dirname(__FILE__) . DS . 'template.php');
    }

    private function _getRemoteXML($checkName)
    {
        // Get the xml file
        $site = 'www.sourcecoast.com';
        $xml = '/versions/' . $checkName . ".xml";
        $contents = '';

        $handle = fsockopen($site, 80, $errno, $errstr, 30);

        if ($handle)
        {
            $out = "GET /$xml HTTP/1.0\r\n";
            $out .= "Host: $site\r\n";
            $out .= "Connection: Close\r\n\r\n";

            fwrite($handle, $out);

            $body = false;

            while (!feof($handle))
            {
                $return = fgets($handle, 1024);
                if ($body)
                    $contents .= $return;

                if ($return == "\r\n")
                    $body = true;
            }
            fclose($handle);
        }
        return $contents;
    }

    /**
     * Returns current version number, support link, and reviews for the passed in extension name. Input 1=cms name, input 2=extension name.
     * @return string (or an xmlrpcresp obj instance if call fails)
     */
    function getExtensionData($extensionName, $extensionType)
    {
        if ($this->xmlString)
        {
            $xml = new SimpleXMLElement($this->xmlString);
            $data = new stdClass();
            $element = & $xml->xpath('/sourcecoast/' . $extensionType . "s/" . $extensionType . '[@system="' . $extensionName . '"]');
            if (count($element) > 0)
            {
                $data->currentVersion = $element[0]->version;
                $data->localVersion = $this->getInstalledVersion($extensionName, $extensionType);
                $data->name = $element[0]->name;
                return $data;
            }
        }

        $data->currentVersion = 'unknown';
        $data->localVersion = $this->getInstalledVersion($extensionName, $extensionType);
        $data->name = $extensionName;

        /* $dependencies = $element[0]->dependencies;

          if (count($dependencies) > 0)
          {
          foreach ($dependencies->dependency as $dependency)
          {
          $dep = new stdClass();
          $dep->name = $dependency->name;
          $dep->version = $dependency->version;
          $data->dependencies[] = $dep;
          }
          } */

        return $data;
    }

    function getInstalledVersion($extensionName, $extensionType)
    {
        $version = "Not Installed";
        $extensionType = $extensionType . "s";
        $xmlDir = "";
        $xmlFile = "";
        if ($extensionType == "components" || $extensionType == "modules")
        {
            if (JFolder::exists(JPATH_ADMINISTRATOR . DS . $extensionType . DS . $extensionName))
            {
                $xmlDir = JPATH_ADMINISTRATOR . DS . $extensionType . DS . $extensionName;
                $xmlFile = str_replace("com_", "", $extensionName) . ".xml";
            }
            else if (JFolder::exists(JPATH_SITE . DS . $extensionType . DS . $extensionName))
            {
                $xmlDir = JPATH_SITE . DS . $extensionType . DS . $extensionName;
                $xmlFile = $extensionName . ".xml";
            }
        }
        else if ($extensionType == "plugins")
        {
            $pluginData = explode(".", $extensionName);

             //SC15
            
            
            if (JFile::exists(JPATH_SITE . DS . 'plugins' . DS . $pluginData[0] . DS . $pluginData[1] . DS . $pluginData[1] . '.xml'))
                $xmlDir = JPATH_SITE . DS . 'plugins' . DS . $pluginData[0] . DS . $pluginData[1];
             //SC16
            
            $xmlFile = $pluginData[1] . ".xml";
        }

        if ($xmlFile == "" || $xmlDir == "")
            return $version;

        $xmlParser = new JSimpleXML();
        if (JFile::exists($xmlDir . DS . $xmlFile))
        {
            if ($xmlParser->loadFile($xmlDir . DS . $xmlFile))
            {
                $versionElement = & $xmlParser->document->version[0];
                if ($versionElement != null)
                    $version = $versionElement->_data;
            }
        }

        return $version;
    }

    function _showVersionInfoRow($extName, $extType)
    {
        $extData = $this->getExtensionData($extName, $extType);
        echo "<tr>";
        echo "<td>" . $extData->name . "</td>";
        if ($extData->localVersion == "Not Installed")
        {
            echo '<td><span style="color:#999999">' . $extData->localVersion . "</span></td>";
            echo '<td>' . $extData->currentVersion . "</span></td>";
        }
        else if ($extData->localVersion != $extData->currentVersion)
        {
            echo '<td><span style="color:#FF0000"><b>' . $extData->localVersion . "</b></span></td>";
            echo '<td>' . $extData->currentVersion . "</span></td>";
        }
        else
        {
            echo '<td><span style="color:#009900">' . $extData->localVersion . "</span></td>";
            echo "<td>" . $extData->currentVersion . "</span></td>";
        }
        if ($extType == "component")
            echo "<td>" . SourceCoastExtensionHelper::checkComponent($extName, $this->imagePath) . "</td>";
        else if ($extType == "module")
            echo "<td>" . SourceCoastExtensionHelper::checkModule($extName, $this->imagePath) . "</td>";
        else if ($extType == "plugin")
            echo "<td>" . SourceCoastExtensionHelper::checkPlugin($extName, $this->imagePath) . "</td>";


        echo "</tr>";
    }

}

class JElementSourceCoastConnect extends JElement
{

    function fetchElement($name, $value, &$node, $control_name)
    {
        /* include_once(dirname(__FILE__).DS.'cmsmarketconnect.php');
          $CMSMarket = new CMSMarketConnect();
          ob_start();
          $CMSMarket->display($name);
          $output = ob_get_clean();
          return $output; */
    }

}

class SourceCoastExtensionHelper
{

    function checkExtension($path, $query, $imagePath)
    {
        if (!is_dir($path) && !is_file($path))
        {
            $alt = "This extension does not appear to be installed.";
            return '<img title="' . $alt . '" alt="' . $alt . '" src="'.$imagePath.'icon-16-deny.png" width="10" height="10" />';
        }
        else
        {
            $dbo = &JFactory::getDBO();
            $dbo->setQuery($query);
            $instance = $dbo->loadObject();

            if ($instance == null)
            {
                $alt = "This extension is installed but not published.";
                return '<img title="' . $alt . '" alt="' . $alt . '" src="'.$imagePath.'icon-16-notice-note.png" width="10" height="10" />';
            }
            else
            {
                $alt = "This extension is installed and published.";
                return '<img title="' . $alt . '" alt="' . $alt . '" src="'.$imagePath.'icon-16-allow.png" width="10" height="10" />';
            }
        }
    }

    function checkComponent($name, $imagePath)
    {
        //Don't need to perform check since this is called from component code
        $alt = "This extension is installed and published.";
        return '<img title="' . $alt . '" alt="' . $alt . '" src="'.$imagePath.'icon-16-allow.png" width="10" height="10" />';
    }

    function checkModule($name, $imagePath)
    {
        $dbo = &JFactory::getDBO();

        return SourceCoastExtensionHelper::checkExtension(
                JPATH_ROOT . DS . "modules" . DS . $name,
                "SELECT id " .
                "FROM #__modules " .
                "WHERE module = " . $dbo->quote($name) . " " .
                "	AND published = 1",
                $imagePath
        );
    }

    function checkPlugin($name, $imagePath)
    {
        $pluginParts = explode(".", $name);
        $dbo = &JFactory::getDBO();

         //SC15

        
        return SourceCoastExtensionHelper::checkExtension(
                JPATH_ROOT . DS . "plugins" . DS . $pluginParts[0] . DS . $pluginParts[1] . DS . $pluginParts[1] . ".php",
                "SELECT extension_id " .
                "FROM #__extensions " .
                "WHERE folder = " . $dbo->quote($pluginParts[0]) . " " .
                "AND element = " . $dbo->quote($pluginParts[1]) . " " .
                "AND enabled = 1",
                $imagePath
        );
         //SC16
    }
}
