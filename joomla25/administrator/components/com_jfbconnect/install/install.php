<?php
/**
 * @package        JFBConnect
 * @copyright (C) 2009-2012 by Source Coast - All rights reserved
 * @license http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */
// no direct access
defined('_JEXEC') or die('Restricted access');

class com_JFBConnectInstallerScript
{
    var $jfbcVersion = "4.1.2"; // Same as the XML version
    var $finalDBVersion = "4.1.0"; // If database updates occur, increment this number

    function preflight($type, $parent)
    {
        return true;
    }

    function install($parent)
    {
        return true;
    }

    function update($parent)
    {
        return true;
    }

    function postflight($type, $parent)
    {
        // Run required updates that may not have happened if user uninstalls and does a fresh install
        $this->updateDatabase();
        $this->installPackages();
    }

    /*
         * $parent is the class calling this method
         * uninstall runs before any other action is taken (file removal or database processing).
         */
    function uninstall($parent)
    {
    }

    // CUSTOM JFBCONNECT FUNCTIONS
    function updateDatabase()
    {
        // If user uninstalled JFBConnect and is re-installing, the tables will exist, but upgrade SQL files won't be called
        // Add SQL calls here as a backup
        $db = JFactory::getDBO();
        $db->debug(0);
        // 4.1.0: Add new access_token column
        $db->setQuery("SELECT value FROM #__jfbconnect_config WHERE `setting` = 'db_version'");
        $dbVersion = $db->loadResult();
        if (!$dbVersion || $dbVersion != "4.1.0") {
            $this->runUpdateSQL('4.1.0');
        }
    }

    function runUpdateSQL($version)
    {
        $buffer = file_get_contents(JPATH_ADMINISTRATOR . '/components/com_jfbconnect/install/sql/updates/' . $version . '.sql');

        // Graceful exit and rollback if read not successful
        if ($buffer === false) {
            JError::raiseWarning(1, JText::_('JLIB_INSTALLER_ERROR_SQL_READBUFFER'));
            return false;
        }

        $db =& JFactory::getDBO();
        $db->setQuery($buffer);
        $db->queryBatch(false);
    }

    function installPackages()
    {
        // Get current version number
        ?>

    <table>
        <tr>
            <td width="100px"><img
                    src="<?php print JURI::root(); ?>/administrator/components/com_jfbconnect/assets/images/jfbconn.png"
                    width="100px"></td>
            <td><h2>JFBConnect v<?php echo $this->jfbcVersion; ?></h2></td>
        </tr>
    </table>
    <h3>Installing...</h3>

    <?php
        jimport('joomla.installer.helper');
        jimport('joomla.installer.adapters.plugin');
        $installer = new JInstaller();
        $installer->setOverwrite(true);

        //set the filenames
        $plg_auth = JPATH_ADMINISTRATOR . DS . 'components' . DS . 'com_jfbconnect' . DS . 'install' . DS . 'packages' . DS . 'plg_authentication_jfbconnectauth_j1.6_v4.1.2.zip';
        $plg_user = JPATH_ADMINISTRATOR . DS . 'components' . DS . 'com_jfbconnect' . DS . 'install' . DS . 'packages' . DS . 'plg_user_jfbconnectuser_j1.6_v4.1.2.zip';
        $plg_system = JPATH_ADMINISTRATOR . DS . 'components' . DS . 'com_jfbconnect' . DS . 'install' . DS . 'packages' . DS . 'plg_system_jfbcsystem_j1.6_v4.1.2.zip';
        $plg_content = JPATH_ADMINISTRATOR . DS . 'components' . DS . 'com_jfbconnect' . DS . 'install' . DS . 'packages' . DS . 'plg_content_jfbccontent_j1.6_v4.1.2.zip';
        $mod_sclogin = JPATH_ADMINISTRATOR . DS . 'components' . DS . 'com_jfbconnect' . DS . 'install' . DS . 'packages' . DS . 'mod_sclogin_j1.6_v1.0.2.zip';

        # Install the JFBCConnect authorization plugin
        $package = JInstallerHelper::unpack($plg_auth);
        if ($installer->install($package['dir'])) {
            ?>
        <table bgcolor="#E0FFE0" width="100%">
            <tr style="height:30px">
                <td width="50px"><img
                        src="<?php print JURI::root(); ?>/administrator/components/com_jfbconnect/assets/images/icon-16-allow.png"
                        height="20px" width="20px"></td>
                <td><font size="2"><b>JFBConnect Facebook Authentication Plugin successfully installed.</b></font></td>
            </tr>
        </table>
        <?php
        } else {
            ?>
        <table bgcolor="#FFD0D0" width="100%">
            <tr style="height:30px">
                <td width="50px"><img
                        src="<?php print JURI::root(); ?>/administrator/components/com_jfbconnect/assets/images/icon-16-deny.png"
                        height="20px" width="20px"></td>
                <td><font size="2"><b>ERROR: Could not install the JFBConnect Facebook Authentication Plugin. Please
                    install manually.</b></font></td>
            </tr>
        </table>
        <?php
        }

        # Install the JFBCConnect user plugin
        $package = JInstallerHelper::unpack($plg_user);
        if ($installer->install($package['dir'])) {
            ?>
        <table bgcolor="#E0FFE0" width="100%">
            <tr style="height:30px">
                <td width="50px"><img
                        src="<?php print JURI::root(); ?>/administrator/components/com_jfbconnect/assets/images/icon-16-allow.png"
                        height="20px" width="20px"></td>
                <td><font size="2"><b>JFBConnect Facebook User Plugin successfully installed.</b></font></td>
            </tr>
        </table>
        <?php
        } else {
            ?>
        <table bgcolor="#FFD0D0" width="100%">
            <tr style="height:30px">
                <td width="50px"><img
                        src="<?php print JURI::root(); ?>/administrator/components/com_jfbconnect/assets/images/icon-16-deny.png"
                        height="20px" width="20px"></td>
                <td><font size="2"><b>ERROR: Could not install the JFBConnect Facebook User Plugin. Please install
                    manually.</b></font></td>
            </tr>
        </table>
        <?php
        }

        # Install the JFBCConnect system plugin
        $package = JInstallerHelper::unpack($plg_system);
        if ($installer->install($package['dir'])) {
            ?>
        <table bgcolor="#E0FFE0" width="100%">
            <tr style="height:30px">
                <td width="50px"><img
                        src="<?php print JURI::root(); ?>/administrator/components/com_jfbconnect/assets/images/icon-16-allow.png"
                        height="20px" width="20px"></td>
                <td><font size="2"><b>JFBConnect Facebook System Plugin successfully installed.</b></font></td>
            </tr>
        </table>
        <?php
        } else {
            ?>
        <table bgcolor="#FFD0D0" width="100%">
            <tr style="height:30px">
                <td width="50px"><img
                        src="<?php print JURI::root(); ?>/administrator/components/com_jfbconnect/assets/images/icon-16-deny.png"
                        height="20px" width="20px"></td>
                <td><font size="2"><b>ERROR: Could not install the JFBConnect Facebook System Plugin. Please install
                    manually.</b></font></td>
            </tr>
        </table>
        <?php
        }

        # Install the JFBCConnect content plugin
        $package = JInstallerHelper::unpack($plg_content);
        if ($installer->install($package['dir'])) {
            ?>
        <table bgcolor="#E0FFE0" width="100%">
            <tr style="height:30px">
                <td width="50px"><img
                        src="<?php print JURI::root(); ?>/administrator/components/com_jfbconnect/assets/images/icon-16-allow.png"
                        height="20px" width="20px"></td>
                <td><font size="2"><b>JFBConnect Facebook Content Plugin - Easily add Comments & Likes to your
                    articles.</b></font></td>
            </tr>
        </table>
        <?php
        } else {
            ?>
        <table bgcolor="#FFD0D0" width="100%">
            <tr style="height:30px">
                <td width="50px"><img
                        src="<?php print JURI::root(); ?>/administrator/components/com_jfbconnect/assets/images/icon-16-deny.png"
                        height="20px" width="20px"></td>
                <td><font size="2"><b>ERROR: Could not install the JFBConnect Facebook Content Plugin. Please install
                    manually.</b></font></td>
            </tr>
        </table>
        <?php
        }

        # Install the JFBCLogin module
        $package = JInstallerHelper::unpack($mod_sclogin);
        if ($installer->install($package['dir'])) {
            ?>
        <table bgcolor="#E0FFE0" width="100%">
            <tr style="height:30px">
                <td width="50px"><img
                        src="<?php print JURI::root(); ?>/administrator/components/com_jfbconnect/assets/images/icon-16-allow.png"
                        height="20px" width="20px"></td>
                <td><font size="2"><b>SC Login Module successfully installed.</b></font>
                </td>
            </tr>
        </table>
        <?php
        } else {
            ?>
        <table bgcolor="#FFD0D0" width="100%">
            <tr style="height:30px">
                <td width="50px"><img
                        src="<?php print JURI::root(); ?>/administrator/components/com_jfbconnect/assets/images/icon-16-deny.png"
                        height="20px" width="20px"></td>
                <td><font size="2"><b>ERROR: Could not install the SC Login Module. Please install manually.</b></font>
                </td>
            </tr>
        </table>
        <?php
        }

        #Uninstall the old JFBCLogin module
        $db = JFactory::getDBO();
        $db->setQuery("SELECT id, published from #__modules WHERE module='mod_jfbclogin';");
        $jfbcLoginModule = $db->loadObject();

        if ($jfbcLoginModule && $jfbcLoginModule->id && $jfbcLoginModule->published) {
            ?>
        <table bgcolor="#FFCC00" width="100%">
            <tr style="height:30px">
                <td width="50px"><img
                        src="<?php print JURI::root(); ?>/administrator/components/com_jfbconnect/assets/images/icon-16-deny.png"
                        height="20px" width="20px"></td>
                <td><font size="2"><b>NOTICE: JFBCLogin module has been detected from a previous installation. Please
                    use the newly installed SCLogin module instead.</b></font></td>
            </tr>
        </table>
        <?php
        }
        ?>

    <p>Now, configure the JFBConnect component to operate how you want it to, and ensure that your Facebook Application,
        API and secret keys are valid.</p>
    <p>Once setup correctly, enable the JFBConnect Authentication, JFBConnect User and JFBCSystem plugins and configure
        the Login module to suit your needs.</p>

    <?php
    }

}