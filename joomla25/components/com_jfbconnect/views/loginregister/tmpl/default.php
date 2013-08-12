<?php

/**
 * @package		JFBConnect
 * @copyright (C) 2009-2012 by Source Coast - All rights reserved
 * @license http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

defined('_JEXEC') or die('Restricted access');

JHtml::_('behavior.keepalive');
JHtml::_('behavior.tooltip');

if($this->defaultValidationNeeded)
{
    JHtml::_('behavior.formvalidation');
}

$profileFields = $this->profileFields;
?>

<script type="text/javascript">

        var jfbcUsernameIsAvailable = '<?php echo JText::_('COM_JFBCONNECT_USERNAME_IS_AVAILABLE'); ?>';
        var jfbcUsernameIsInUse = '<?php echo JText::_('COM_JFBCONNECT_USERNAME_IS_IN_USE'); ?>';
        var jfbcEmailIsAvailable = '<?php echo JText::_('COM_JFBCONNECT_EMAIL_IS_AVAILABLE'); ?>';
        var jfbcEmailIsInUse = '<?php echo JText::_('COM_JFBCONNECT_EMAIL_IS_IN_USE'); ?>';
        var jfbcPasswordInvalid = '<?php echo JText::_('COM_JFBCONNECT_PASSWORD_INVALID'); ?>';
        var jfbcPassword2NoMatch = '<?php echo JText::_('COM_JFBCONNECT_PASSWORDS_DO_NOT_MATCH'); ?>';
        var jfbcRoot = '<?php echo JURI::base(); ?>';
</script>

<div id="jfbc_loginregister">

<h1><?php echo JText::_('COM_JFBCONNECT_WELCOME').' '.$this->fbUserProfile['first_name'] ?>!</h1>
<p><?php echo JText::_('COM_JFBCONNECT_THANKS_FOR_SIGNING_IN');?></p>
<div id="jfbc_loginregister_userinfo">
    <div id="jfbc_loginregister_existinguser" style="float:left; width: 45%;">
        <form action="" method="post" name="form">
            <fieldset>
            <legend><?php echo JText::_('COM_JFBCONNECT_EXISTING_USER_REGISTRATION')?></legend>
		<p><?php echo JText::_('COM_JFBCONNECT_EXISTING_USER_INSTRUCTIONS') ?></p>
                <dl>
                    <dt><label><?php echo JText::_('COM_JFBCONNECT_USERNAME') ?> </label></dt><dd><input type="text" class="inputbox" name="username" value="" size="20" /></dd>
                    <dt><label><?php echo JText::_('COM_JFBCONNECT_PASSWORD') ?> </label></dt><dd><input type="password" class="inputbox" name="password" value="" size="20" /></dd>
                </dl>
                </fieldset>
                <input type="submit" class="button" value="<?php echo JText::_('COM_JFBCONNECT_LOGIN'); ?>" />

		<input type="hidden" name="controller" value="loginregister" />
		<input type="hidden" name="view" value="loginregister" />
		<input type="hidden" name="option" value="com_jfbconnect" />
		<input type="hidden" name="task" value="loginMap" />
		<?php echo JHTML::_( 'form.token' ); ?>
        </form>
        <br/>
        <?php echo $this->jLinkedLoginButton; ?>
    </div>
    <div id="jfbc_loginregister_newuser" style="float:left; width: 45%;">

        <?php
         //SC15
        
        ?>

        <form action="" method="post" id="adminForm" style="float:left; width: 45%;" class="form-validate">
<?php foreach ($this->form->getFieldsets() as $fieldset): // Iterate through the form fieldsets and display each one.?>
	<?php $fields = $this->form->getFieldset($fieldset->name);?>
	<?php if (count($fields)) {?>
		<fieldset>
		<?php if (isset($fieldset->label)) {// If the fieldset has a label set, display it as the legend.?>
			<legend><?php echo JText::_($fieldset->label);?></legend>
		<?php } ?>
			<dl>
		<?php foreach($fields as $field):// Iterate through the fields in the set and display them.?>
			<?php if ($field->hidden) {// If the field is hidden, just display the input.?>
				<?php echo $field->input;?>
			<?php } else {?>
				<dt>
				<?php echo $field->label; ?>
				<?php if (!$field->required && (!$field->type == "spacer")) { ?>
					<span class="optional"><?php echo JText::_('COM_USERS_OPTIONAL');?></span>
				<?php } ?>
				</dt>
				<dd><?php echo $field->input;?></dd>
			<?php } ?>
		<?php endforeach;?>
			</dl>
		</fieldset>
	<?php }?>
<?php endforeach;?>

        <?php
         //SC16
        ?>
                <div class="profile-fields">
                <?php
                    foreach ($profileFields as $profileForm)
                        echo $profileForm;
                ?>
                </div>

                <input type="submit" class="button validate" value="<?php echo JText::_('COM_JFBCONNECT_REGISTER')?>" />

		<input type="hidden" name="controller" value="loginregister" />
		<input type="hidden" name="option" value="com_jfbconnect" />
		<input type="hidden" name="view" value="loginregister" />
		<input type="hidden" name="task" value="createNewUser" />
		<?php echo JHTML::_( 'form.token' ); ?>
            </fieldset>
        </form>
    </div>
</div>

<div style="clear:both;"></div>

<?php 
$link = 'http://www.sourcecoast.com/jfbconnect/';
$affiliateID = $this->configModel->getSetting('affiliate_id');
if($affiliateID)
	$link .= '?amigosid='.$affiliateID;

if($this->configModel->getSetting('show_powered_by_link'))
{ ?>
	<div id="powered_by"><?php echo JText::_('COM_JFBCONNECT_POWERED_BY');?> <a target="_blank" href="<?php echo $link;?>" title="Joomla Facebook Integration">JFBConnect</a></div>
<?php } ?>

</div>
