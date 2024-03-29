<?php
$app = & JFactory::getApplication();
$fttUser = FamilyTreeTopUserHelper::getInstance()->get();
$settings = FamilyTreeTopSettingsHelper::getInstance()->get();
$template = $settings->_template->value;
$script = "?"+time();
?>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/jquery-2.0.3.min.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/underscore-min.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/handlebars-v1.3.0.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/backbone-min.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/backbone-sync.js"></script>
<!-- backbone models -->
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/backbone/models/ChildModel.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/backbone/models/DateModel.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/backbone/models/EventModel.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/backbone/models/FamilyModel.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/backbone/models/IndividualModel.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/backbone/models/MediaModel.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/backbone/models/MemberModel.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/backbone/models/NameModel.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/backbone/models/PlaceModel.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/backbone/models/RelationModel.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/backbone/models/RelationNameModel.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/backbone/models/UserModel.js"></script>
<!-- backbone collections -->
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/backbone/collections/ChildrenCollection.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/backbone/collections/DatesCollection.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/backbone/collections/EventsCollection.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/backbone/collections/FamiliesCollection.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/backbone/collections/IndividualsCollection.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/backbone/collections/MediasCollection.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/backbone/collections/MembersCollection.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/backbone/collections/NamesCollection.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/backbone/collections/PlacesCollection.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/backbone/collections/RelationNamesCollection.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/backbone/collections/RelationsCollection.js"></script>
<!-- plugins -->
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/jquery.panorama.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/spin.min.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/superbrowserupdate.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/bootstrap.min.3.1.1.js"></script>
<!--<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/bootstrap-scroll-modal.js"></script>-->
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/jquery.blueimp-gallery.min.js"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/bootstrap-image-gallery.min.js"></script>
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
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/familytreetop.l10n.js?<?=$script;?>"></script>
<script src="<?php echo $this->baseurl ?>/components/com_familytreetop/js/familytreetop.controller.js?<?=$script;?>"></script>
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

