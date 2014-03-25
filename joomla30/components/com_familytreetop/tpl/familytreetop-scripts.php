<?php
$app = & JFactory::getApplication();
$fttUser = FamilyTreeTopUserHelper::getInstance()->get();
$settings = FamilyTreeTopSettingsHelper::getInstance()->get();
$template = $settings->_template->value;
$script = "";
?>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/jquery-2.0.3.min.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/spin.min.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/superbrowserupdate.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/bootstrap.min.3.1.1.js"></script>
<!--<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/bootstrap-scroll-modal.js"></script>-->
<!--<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/bootstrap-image-gallery.min.js"></script>-->
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/tdfriendselector.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/fabric.all.min.js"></script>
<!-- file upload plugin files -->
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/jquery.ui.widget.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/tmpl.min.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/load-image.min.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/canvas-to-blob.min.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/jquery.iframe-transport.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/jquery.fileupload.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/jquery.fileupload-fp.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/jquery.fileupload-ui.js"></script>
<!--[if gte IE 8]><script src="<?php echo $this->baseurl; ?>/components/com_familytreetop/js/jquery.xdr-transport.js"></script><![endif]-->
<?php if($fttUser->joyride): ?>
    <script src="<?=$this->baseurl;?>/components/com_familytreetop/js/bootstrap-joyride.js"></script>
<?php endif; ?>
<!-- uncompressed files -->
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/familytreetop.trees.js?<?=$script;?>"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/familytreetop.footer.js?<?=$script;?>"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/familytreetop.form.js?<?=$script;?>"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/familytreetop.familyline.js?<?=$script;?>"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/familytreetop.tabs.js?<?=$script;?>"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/familytreetop.usertree.js?<?=$script;?>"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/familytreetop.popovers.js?<?=$script;?>"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/familytreetop.friendselector.js?<?=$script;?>"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/familytreetop.this.month.js?<?=$script;?>"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/familytreetop.editmenu.js?<?=$script;?>"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/familytreetop.editor.js?<?=$script;?>"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/familytreetop.profile.js?<?=$script;?>"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/familytreetop.families.js?<?=$script;?>"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/familytreetop.members.js?<?=$script;?>"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/familytreetop.myfamily.js?<?=$script;?>"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/familytreetop.latest.events.js?<?=$script;?>"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/familytreetop.ie.placeholders.js?<?=$script;?>"></script>
<script>
    if(!$FamilyTreeTop.app.config.appId){
        console.log('Facebook App Id doesn\'t exist');
    } else {
        jQuery(document).ready(function() {
            jQuery.ajaxSetup({ cache: true });
            jQuery.getScript('//connect.facebook.net/en_US/all.js', function(){
                FB.init($FamilyTreeTop.app.config);
                FB.getLoginStatus(function(response){
                    TDFriendSelector.init({debug: false});
                    <?php if($fttUser->joyride): ?>
                    $FamilyTreeTop.joyride = true;
                    <?php endif; ?>
                    $FamilyTreeTop.init();
                }, true);
            });
        });
    }
</script>
