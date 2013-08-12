<?php
/**
 * @package        JFBConnect/JLinked
 * @copyright (C) 2011-2012 by Source Coast - All rights reserved
 * @license http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */
defined('_JEXEC') or die('Restricted access');

$userIntro = $params->get('user_intro');
if ($userIntro != '')
{
    echo '<div class="sc_login_desc">' . $userIntro . "</div>";
}

//Show Joomla Login Form
if ($params->get('showLoginForm'))
{
     //SC15
    
    $passwordName = 'password';
    $loginRememberText = JText::_('JGLOBAL_REMEMBER_ME');
     //SC16

    if ($registerType == "communitybuilder")
        $passwordName = 'passwd';
    ?>

<form action="<?php echo JRoute::_('index.php', true, $params->get('usesecure')); ?>" method="post" id="login-form">
    <fieldset class="input">
        <div id="form-login-username">
            <label for="modlgn_username"><?php echo JText::_('MOD_SCLOGIN_USERNAME') ?></label><br/>
            <input id="modlgn_username" type="text" name="username" class="inputbox" alt="username" size="18"/>
        </div>
        <div id="form-login-password">
            <label for="modlgn_passwd"><?php echo JText::_('MOD_SCLOGIN_PASSWORD') ?></label><br/>
            <input id="modlgn_passwd" type="password" name="<?php echo $passwordName; ?>" class="inputbox" size="18"
                   alt="password"/>
        </div>
        <?php if (JPluginHelper::isEnabled('system', 'remember')) { ?>
            <p id="form-login-remember">
                <label for="modlgn_remember"><?php echo $loginRememberText;?></label>
                <input id="modlgn_remember" type="checkbox" name="remember" class="inputbox" value="yes" alt="Remember Me"/>
            </p>
        <?php } ?>
        <input type="submit" name="Submit" class="button" value="<?php echo JText::_('MOD_SCLOGIN_LOGIN') ?>"/>
    </fieldset>

    <?php if ($registerType != "communitybuilder")
    {
         //SC15
        
        echo '<input type="hidden" name="option" value="com_users"/>';
        echo '<input type="hidden" name="task" value="user.login"/>';
         //SC16
        echo '<input type="hidden" name="return" value="'. $jLoginUrl.'"/>';
    }
    else // Use Community Builder's login
    {
        include_once(JPATH_ADMINISTRATOR . '/components/com_comprofiler/plugin.foundation.php');
        global $_CB_framework;
        echo '<input type="hidden" name="option" value="com_comprofiler" />' . "\n";
        echo '<input type="hidden" name="task" value="login" />' . "\n";
        echo '<input type="hidden" name="op2" value="login" />' . "\n";
        echo '<input type="hidden" name="lang" value="' . $_CB_framework->getCfg('lang') . '" />' . "\n";
        echo '<input type="hidden" name="force_session" value="1" />' . "\n"; // makes sure to create joomla 1.0.11+12 session/bugfix
        echo '<input type="hidden" name="return" value="B:'.$jLoginUrl.'"/>';
        echo cbGetSpoofInputTag('login');
    }
    echo JHTML::_('form.token');
    ?>
</form>
<?php
}

//Show Social Login Button(s)
$jfbcLogin = $helper->getJFBConnectLoginButton();
if ($jfbcLogin != "")
    echo $jfbcLogin;

// Alternative FB Login Buttons below. To use:
        // add // to the 3 lines above
        // Remove the // from the line below and update the text or image value as necessary
// Text Link
//echo '<a href="javascript:void(0)" onclick="jfbc.login.login_custom();">LINK TEXT</a>';

// Image Link
//echo '<a href="javascript:void(0)" onclick="jfbc.login.login_custom();"><img src="http://yoursite.com/linktoimage.jpg" /></a>';

// HTML Form Button
//echo '<input type="button" onclick="jfbc.login.login_custom();" value="BUTTON TEXT" />';

$jlinkedLogin = $helper->getJLinkedLoginButton();
if ($jlinkedLogin != "")
    echo $jlinkedLogin;

// Show the register & forgot links
if ($params->get('showRegisterLink') || $params->get('showForgotUsername') || $params->get('showForgotPassword'))
    echo "<ul>";

if ($params->get('showRegisterLink'))
    echo '<li><a href="' . $registerLink . '">' . JText::_('MOD_SCLOGIN_REGISTER_FOR_THIS_SITE') . '</a></li>';

if ($params->get('register_type') == "communitybuilder" && ($params->get('showForgotUsername') || $params->get('showForgotPassword')))
    echo '<li><a href="' . $forgotLink . '">' . JText::_('MOD_SCLOGIN_FORGOT_LOGIN') . '</a></li>';
else
{
    if ($params->get('showForgotUsername'))
        echo '<li><a href="' . $forgotUsernameLink . '">' . JText::_('MOD_SCLOGIN_FORGOT_USERNAME') . '</a></li>';
    if ($params->get('showForgotPassword'))
        echo '<li><a href="' . $forgotPasswordLink . '">' . JText::_('MOD_SCLOGIN_FORGOT_PASSWORD') . '</a></li>';
}
if ($params->get('showRegisterLink') || $params->get('showForgotUsername') || $params->get('showForgotPassword'))
    echo "</ul>";

echo $helper->getPoweredByLink();
?>