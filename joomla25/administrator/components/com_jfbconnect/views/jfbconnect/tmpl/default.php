<?php
/**
 * @package		JFBConnect
 * @copyright (C) 2009-2012 by Source Coast - All rights reserved
 * @license http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */
defined('_JEXEC') or die('Restricted access');

jimport('joomla.version');

$configModel = $this->configModel;
$appProperties = $this->appProperties;
$baseDomain = $this->baseDomain;
$baseDomainOk = $this->baseDomainOk;
$clientError = $this->clientError;
$jfbcLibrary = $this->jfbcLibrary;
$usermapModel = $this->usermapModel;
$appStats = $this->appStats;
$versionChecker = $this->versionChecker;
?>

<!--<div style="float: left; padding: 0 20px 0 0"><img src="<?php echo JURI::root() ?>components/com_jfbconnect/images/jfbconn.png" /></div>-->
<div style="margin:0 0 0 10px; padding: 0 10px 10px 10px">
    <h2>Facebook Application</h2>
    <div style="float:left;width:550px">
        <fieldset style="padding:5px">
            <legend>Configuration Information</legend>
            <?php
            if ($clientError == null)
            {
            ?>
                <div>
                    <div style="float:left;width:80px">
                    <?php
                    if ($appProperties['logo_url'] != "")
                    {
                        echo '<img src="' . $appProperties['logo_url'] . '" />';
                    }
                    else
                    {
                        echo "No Application Logo Set";
                    }
                    ?>
                </div>
                <div style="float: left; margin: 0 0 0 20px">
                    <?php
                    if($jfbcLibrary->facebookAppId)
                    { ?>
                        <p style="margin:0 0 5px 0;"><b>Application Name: </b><?php echo $appProperties['application_name']; ?></p>
                    <?php }
                    else
                    { ?>
                        <p style="margin:0 0 5px 0;"><b>Application Name: <span style="color:#FF0000">Application ID not set. Please set it in the Configuration Tab.</span></b></p>
                    <?php } ?>
                    <p style="margin:0 0 5px 0;"><b>Site URL: </b><?php echo $appProperties['connect_url']; ?></p>
                    <p style="margin:0 0 5px 0;"><b>Site Domain(s): </b><?php echo $baseDomain; ?></p>
                    <?php
                    $joomlaUrl = JURI::root();
                    if (!$baseDomainOk)
                    {
                        if ($appProperties['connect_url'] == "" || strpos($joomlaUrl, $appProperties['connect_url']) !== 0)
                        {
                            print "<b style=\"color:#FF1410\">\n";
                            print "<b>WARNING: POSSIBLE MISCONFIGURATION</b><br/>We suggest updating your Site URL to: " . $joomlaUrl . "<br />\n";
                            print "You can do this by visiting: <a target=\"_blank\" href=\"http://www.facebook.com/developers/\">Facebook Developers</a><br />\n";
                            print "Select your application -> Edit Settings.<br/>\n";
                            print "You should configure the Site URL and App Domain.<br />\n";
                            print "</b><br/>";
                        }
                    }
                    ?>
                </div>
            </div>
            <?php
                }
                else
                {
            ?>
                    <center><b style="color:#FF1410">Please check your Facebook Settings in the Configuration Tab</b><br/>
                            			Visit the <a href="http://www.sourcecoast.com/jfbconnect/docs/configuration-guide">JFBConnect Configuration Guide</a> or <a href="http://www.sourcecoast.com/forums?id=2">JFBConnect Support Forum</a> for more information.<br/>
                        <b>Error Message:</b> <?php print $clientError; ?></center>
            <?php
                }
            ?>
            </fieldset>
        </div>
        <div style="float:left; margin-left:15px;width: 300px">
            <fieldset style="padding: 5px;">
                <legend>Statistics</legend>
                <p style="margin:0 0 5px 0;"><b>Total Connected Users:</b> <?php echo $usermapModel->getTotalMappings(); ?></p>
                <p style="margin:0 0 5px 0;"><b>Active Monthly Users:</b> <?php echo $appStats['monthly_active_users']; ?></p>
                <p style="margin:0 0 5px 0;"><b>Active Weekly Users:</b> <?php echo $appStats['weekly_active_users']; ?></p>
                <p style="margin:0 0 5px 0;"><b>Active Daily Users:</b> <?php echo $appStats['daily_active_users']; ?></p>
                <p><a target="_BLANK" href="http://www.facebook.com/insights/?sk=ao_<?php echo $jfbcLibrary->facebookAppId; ?>">Visit Facebook Insights</a> (Facebook login required)</p>
            </fieldset>
        </div>

        <div style="clear:both"></div>
        <div style="float:left">
            <h2>JFBConnect Extension Check</h2>
            <?php
            $app =& JFactory::getApplication();
            $version = new JVersion();
            $versionStr = $version->getShortVersion();
            $length = strlen('1.5.');
            $found15Version = substr($versionStr, 0, $length) === '1.5.';
            
            
            if($found15Version)
                $app->enqueueMessage("Incorrect version of JFBConnect installed for this version of Joomla", "error");
            
            ?>
            <div style="float:left; margin: 0 10px">
                <table><tr><th>Required Extensions</th><th>Installed</th><th>Available</th><th>Status</th></tr>
                <?php
                echo $versionChecker->_showVersionInfoRow('com_jfbconnect', 'component');
                echo $versionChecker->_showVersionInfoRow('mod_sclogin', 'module');
                echo $versionChecker->_showVersionInfoRow('authentication.jfbconnectauth', 'plugin');
                echo $versionChecker->_showVersionInfoRow('system.jfbcsystem', 'plugin');
                echo $versionChecker->_showVersionInfoRow('user.jfbconnectuser', 'plugin');
                ?>
            </table>
        </div>
        <div style="float:left; margin: 0 10px">
            <table><tr><th>Social Extensions</th><th>Installed</th><th>Available</th><th>Status</th></tr>
                <?php
                echo $versionChecker->_showVersionInfoRow('content.jfbccontent', 'plugin');
                echo $versionChecker->_showVersionInfoRow('mod_jfbcfan', 'module');
                echo $versionChecker->_showVersionInfoRow('mod_jfbclike', 'module');
                echo $versionChecker->_showVersionInfoRow('mod_jfbcsend', 'module');
                echo $versionChecker->_showVersionInfoRow('mod_jfbccomments', 'module');
                echo $versionChecker->_showVersionInfoRow('mod_jfbclivestream', 'module');
                echo $versionChecker->_showVersionInfoRow('mod_jfbcrecommendations', 'module');
                echo $versionChecker->_showVersionInfoRow('mod_jfbcfriends', 'module');
                echo $versionChecker->_showVersionInfoRow('mod_jfbcfeed', 'module');
                echo $versionChecker->_showVersionInfoRow('mod_jfbcrequest', 'module');
                echo $versionChecker->_showVersionInfoRow('mod_jfbcsubscribe', 'module');
                ?>
            </table>
        </div>
        <div style="float:left; margin: 0 10px">
            <table><tr><th>Profile Integration</th><th>Installed</th><th>Available</th><th>Status</th></tr>
<?php
                echo $versionChecker->_showVersionInfoRow('jfbcprofiles.communitybuilder', 'plugin');
                echo $versionChecker->_showVersionInfoRow('jfbcprofiles.jomsocial', 'plugin');
                echo $versionChecker->_showVersionInfoRow('jfbcprofiles.kunena', 'plugin');
                echo $versionChecker->_showVersionInfoRow('jfbcprofiles.k2', 'plugin');

                 //SC15

                echo $versionChecker->_showVersionInfoRow('community.jfbcjsactivity', 'plugin');
?>
            </table>
        </div>
    </div>
    <div style="clear:both"></div>
    <img alt="Installed/Published" src="components/com_jfbconnect/assets/images/icon-16-allow.png" width="10" height="10" /> - Installed & Published |
    <img alt="Installed/Unpublished" src="components/com_jfbconnect/assets/images/icon-16-notice-note.png" width="10" height="10" /> - Not Published |
    <img alt="Not Installed" src="components/com_jfbconnect/assets/images/icon-16-deny.png" width="10" height="10" /> - Not Installed
</div>



<div style="margin:0 0 0 10px; padding: 0 10px 10px 10px">
    <h2>Additional Information and Support</h2>
    <ul>
        <li><a target="_blank" href="http://www.sourcecoast.com/jfbconnect/docs/configuration-guide">JFBConnect Setup Instructions</a></li>
        <li><a target="_blank" href="http://developers.facebook.com/connect.php">Facebook Connect</a></li>
        <li><a target="_blank" href="http://www.facebook.com/developers/">Facebook Developers</a></li>
        <li><a target="_blank" href="http://wiki.developers.facebook.com/">Facebook Developers Wiki</a></li>
        <li><a target="_blank" href="http://developers.facebook.com/policy/">Facebook Platform Policies</a></li>
    </ul>

    <p>For update information, view the <a target="_blank" href="http://www.sourcecoast.com/jfbconnect/docs/changelog">JFBConnect Changelog</a></p>
</div>
<div style="clear: both"></div>

