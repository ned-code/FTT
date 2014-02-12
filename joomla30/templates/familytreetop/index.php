<?php
defined('_JEXEC') or die;
require_once JPATH_ADMINISTRATOR . DIRECTORY_SEPARATOR . 'components/com_familytreetop/helpers/settings.php';
require_once JPATH_ADMINISTRATOR . DIRECTORY_SEPARATOR . 'components/com_familytreetop/helpers/activerecord.php';
require_once JPATH_ADMINISTRATOR . DIRECTORY_SEPARATOR . 'components/com_familytreetop/helpers/facebook.php';
require_once JPATH_ADMINISTRATOR . DIRECTORY_SEPARATOR . 'components/com_familytreetop/helpers/gedcom.php';
require_once JPATH_ADMINISTRATOR . DIRECTORY_SEPARATOR . 'components/com_familytreetop/helpers/user.php';
require_once JPATH_ADMINISTRATOR . DIRECTORY_SEPARATOR . 'components/com_familytreetop/helpers/upload.php';
require_once JPATH_ADMINISTRATOR . DIRECTORY_SEPARATOR . 'components/com_familytreetop/helpers/languages.php';

ActiverecrdHelper::getInstance();
FamilyTreeTopSettingsHelper::getInstance();
$facebook = FacebookHelper::getInstance()->facebook;

// Getting params from template
$params = JFactory::getApplication()->getTemplate(true)->params;

// Add current user information
$user = JFactory::getUser();
$fttUser = FamilyTreeTopUserHelper::getInstance()->get();
$app = JFactory::getApplication();
$doc = JFactory::getDocument();

$doc->addStyleSheet('templates/'.$this->template.'/css/bootstrap.min.css');
$doc->addStyleSheet('templates/'.$this->template.'/css/bootstrap-responsive.min.css');
$doc->addStyleSheet('templates/'.$this->template.'/css/bootstrap-combined.no-icons.min.css');
$doc->addStyleSheet('templates/'.$this->template.'/css/font-awesome.css');
//$doc->addStyleSheet('templates/'.$this->template.'/css/bootstrap.icon-large.min.css');
$doc->addStyleSheet('templates/'.$this->template.'/css/bootstrap-scroll-modal.css');
$doc->addStyleSheet('templates/'.$this->template.'/css/bootstrap.fix.css');
$doc->addStyleSheet('templates/'.$this->template.'/css/jquery.fileupload-ui.css');
$doc->addStyleSheet('templates/'.$this->template.'/css/csstreeview.css');
$doc->addStyleSheet('templates/'.$this->template.'/css/csstreeview.fix.css');
$doc->addStyleSheet('templates/'.$this->template.'/css/tdfriendselector.css');
$doc->addStyleSheet('templates/'.$this->template.'/css/familytreetop.css');
$doc->addStyleSheet('templates/'.$this->template.'/css/flexicontactplus.fix.css');

// Add familytreetop settings
$settings = FamilyTreeTopSettingsHelper::getInstance()->get();

$data = GedcomHelper::getInstance()->getData();
$json_data = json_encode($data);
$treeUsers = GedcomHelper::getInstance()->getTreeUsers('gedcom_id');
$treeViewUsers = GedcomHelper::getInstance()->sortUsersByView($treeUsers, $data);
//$script = time();
$script = "";
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php echo $this->language; ?>" lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>">
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/css/style.css">
    <noscript><link rel="stylesheet" href="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/css/jquery.fileupload-ui-noscript.css"></noscript>
    <script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/holder.js"></script>
    <script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/excanvas.js"></script>
    <script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.js?<?=$script;?>"></script>
	<jdoc:include type="head" />
	<!--[if lt IE 9]>
		<script src="<?php echo $this->baseurl ?>/media/jui/js/html5.js"></script>
	<![endif]-->
</head>
<body>
<script>
    $FamilyTreeTop.app.config.appId = '<?=$settings->facebook_app_id->value;?>';
    $FamilyTreeTop.app.config.channelUrl = '<?=JURI::base(); ?>templates/<?=$this->template; ?>/channel.html';

    $FamilyTreeTop.app.permissions = '<?=$settings->facebook_permission->value;?>';
    $FamilyTreeTop.app.data = '<?=json_encode(FacebookHelper::getInstance()->data); ?>';

    $FamilyTreeTop.facebookAccessToken = '<?=$facebook->getAccessToken();?>';

    $FamilyTreeTop.users = '<?=$treeViewUsers?>';

    $FamilyTreeTop.userString = '<?=json_encode(FamilyTreeTopUserHelper::getInstance()->get()); ?>';

    $FamilyTreeTop.template = '<?=$this->template?>';

    $FamilyTreeTop.currenturl = '<?=JUri::current();?>';
    $FamilyTreeTop.rooturl = '<?=substr(JUri::base(), 0, strlen(JUri::base()) - 1);?>';
    $FamilyTreeTop.baseurl = '<?=$this->baseurl;?>';
    $FamilyTreeTop.templateurl = '<?=$this->baseurl;?>/templates/<?=$this->template;?>';

    $FamilyTreeTop.languagesString = '<?=FamilyTreeTopLanguagesHelper::get()?>';

    $FamilyTreeTop.dataString = <?=$json_data?>;
</script>
<div id="fb-root"></div>
<div id="wrap">
    <div id="main" class="clearfix">
        <jdoc:include type="modules" name="navbar" style="none" />
        <div class="container">
            <div class="row">
                <div class="span12">
                    <jdoc:include type="message" />
                    <jdoc:include type="component" />
                </div>
            </div>
        </div>
    </div>
</div>
<div id="footer">
    <div class="container" style="text-align: center;">
        <jdoc:include type="modules" name="footer" style="" />
    </div>
</div>
<div id="familytreetop-root" style="display:none;">

    <ol id="Joyride">
        <li data-target="#JoyrideStop1" data-placement="right" data-title="<?=JText::_('TPL_FAMILYTREETOP_JOYRIDE_EDIT_PROFILE');?>">
                <img width="307" height="235" src="<?=$this->baseurl;?>/templates/<?=$this->template;?>/img/tip1.png" />
        </li>
    </ol>

    <div class="alert alert-block alert-error fade in" id="error">
        <a class="close" data-dismiss="alert" href="#">&times;</a>
        <h4></h4>
        <p></p>
    </div>

    <div class="alert alert-block alert-success fade in" id="success">
        <a class="close" data-dismiss="alert" href="#">&times;</a>
        <h4></h4>
        <p></p>
    </div>

    <div class="alert alert-block fade in" id="warning">
        <a class="close" data-dismiss="alert" href="#">&times;</a>
        <h4></h4>
        <p></p>
    </div>

    <div id="relations">
        <div data-familytreetop="IN_LAW"><?=JText::_("TPL_FAMILYTREETOP_IN_LAW");?></div>
        <div data-familytreetop="1ST"><?=JText::_("TPL_FAMILYTREETOP_1ST");?></div>
        <div data-familytreetop="2ST"><?=JText::_("TPL_FAMILYTREETOP_2ST");?></div>
        <div data-familytreetop="3ST"><?=JText::_("TPL_FAMILYTREETOP_3ST");?></div>
        <div data-familytreetop="4ST"><?=JText::_("TPL_FAMILYTREETOP_4ST");?></div>
        <div data-familytreetop="5ST"><?=JText::_("TPL_FAMILYTREETOP_5ST");?></div>
        <div data-familytreetop="RELATIVE"><?=JText::_("TPL_FAMILYTREETOP_RELATIVE");?></div>
        <div data-familytreetop="SELF"><?=JText::_("TPL_FAMILYTREETOP_SELF");?></div>
        <div data-familytreetop="SPOUSE"><?=JText::_("TPL_FAMILYTREETOP_SPOUSE");?></div>
        <div data-familytreetop="SPOUSE_FEMALE"><?=JText::_("TPL_FAMILYTREETOP_SPOUSE_FEMALE");?></div>
        <div data-familytreetop="SPOUSE_MALE"><?=JText::_("TPL_FAMILYTREETOP_SPOUSE_MALE");?></div>
        <div data-familytreetop="MOTHER"><?=JText::_("TPL_FAMILYTREETOP_MOTHER");?></div>
        <div data-familytreetop="FATHER"><?=JText::_("TPL_FAMILYTREETOP_FATHER");?></div>
        <div data-familytreetop="DAUGHTER"><?=JText::_("TPL_FAMILYTREETOP_DAUGHTER");?></div>
        <div data-familytreetop="SON"><?=JText::_("TPL_FAMILYTREETOP_SON");?></div>
        <div data-familytreetop="DAUGHTER_IN_LAW"><?=JText::_("TPL_FAMILYTREETOP_DAUGHTER_IN_LAW");?></div>
        <div data-familytreetop="SON_IN_LAW"><?=JText::_("TPL_FAMILYTREETOP_SON_IN_LAW");?></div>
        <div data-familytreetop="SISTER"><?=JText::_("TPL_FAMILYTREETOP_SISTER");?></div>
        <div data-familytreetop="SISTER_IN_LAW"><?=JText::_("TPL_FAMILYTREETOP_SISTER_IN_LAW");?></div>
        <div data-familytreetop="BROTHER"><?=JText::_("TPL_FAMILYTREETOP_BROTHER");?></div>
        <div data-familytreetop="BROTHER_IN_LAW"><?=JText::_("TPL_FAMILYTREETOP_BROTHER_IN_LAW");?></div>
        <div data-familytreetop="COUSIN"><?=JText::_("TPL_FAMILYTREETOP_COUSIN");?></div>
        <div data-familytreetop="COUSIN_FEMALE"><?=JText::_("TPL_FAMILYTREETOP_COUSIN_FEMALE");?></div>
        <div data-familytreetop="COUSIN_MALE"><?=JText::_("TPL_FAMILYTREETOP_COUSIN_MALE");?></div>
        <div data-familytreetop="AUNT"><?=JText::_("TPL_FAMILYTREETOP_AUNT");?></div>
        <div data-familytreetop="UNCLE"><?=JText::_("TPL_FAMILYTREETOP_UNCLE");?></div>
        <div data-familytreetop="NIECE"><?=JText::_("TPL_FAMILYTREETOP_NIECE");?></div>
        <div data-familytreetop="NEPHEW"><?=JText::_("TPL_FAMILYTREETOP_NEPHEW");?></div>
        <div data-familytreetop="GRAND_MOTHER"><?=JText::_("TPL_FAMILYTREETOP_GRAND_MOTHER");?></div>
        <div data-familytreetop="GRAND_FATHER"><?=JText::_("TPL_FAMILYTREETOP_GRAND_FATHER");?></div>
        <div data-familytreetop="GRAND_DAUGHTER"><?=JText::_("TPL_FAMILYTREETOP_GRAND_DAUGHTER");?></div>
        <div data-familytreetop="GRAND_SON"><?=JText::_("TPL_FAMILYTREETOP_GRAND_SON");?></div>
        <div data-familytreetop="GRAND_AUNT"><?=JText::_("TPL_FAMILYTREETOP_GRAND_AUNT");?></div>
        <div data-familytreetop="GRAND_UNCLE"><?=JText::_("TPL_FAMILYTREETOP_GRAND_UNCLE");?></div>
        <div data-familytreetop="GRAND_NIECE"><?=JText::_("TPL_FAMILYTREETOP_GRAND_NIECE");?></div>
        <div data-familytreetop="GRAND_NEPHEW"><?=JText::_("TPL_FAMILYTREETOP_GRAND_NEPHEW");?></div>
        <div data-familytreetop="GREAT_GRAND_MOTHER"><?=JText::_("TPL_FAMILYTREETOP_GREAT_GRAND_MOTHER");?></div>
        <div data-familytreetop="GREAT_GRAND_FATHER"><?=JText::_("TPL_FAMILYTREETOP_GREAT_GRAND_FATHER");?></div>
        <div data-familytreetop="GREAT_GRAND_DAUGHTER"><?=JText::_("TPL_FAMILYTREETOP_GREAT_GRAND_DAUGHTER");?></div>
        <div data-familytreetop="GREAT_GRAND_SON"><?=JText::_("TPL_FAMILYTREETOP_GREAT_GRAND_SON");?></div>
        <div data-familytreetop="GREAT_GRAND_AUNT"><?=JText::_("TPL_FAMILYTREETOP_GREAT_GRAND_AUNT");?></div>
        <div data-familytreetop="GREAT_GRAND_UNCLE"><?=JText::_("TPL_FAMILYTREETOP_GREAT_GRAND_UNCLE");?></div>
        <div data-familytreetop="GREAT_GRAND_NIECE"><?=JText::_("TPL_FAMILYTREETOP_GREAT_GRAND_NIECE");?></div>
        <div data-familytreetop="GREAT_GRAND_NEPHEW"><?=JText::_("TPL_FAMILYTREETOP_GREAT_GRAND_NEPHEW");?></div>
    </div>

    <div id="months">
        <div data-familytreetop="0"><?=JText::_("TPL_FAMILYTREETOP_MONTH");?></div>
        <div data-familytreetop="1"><?=JText::_("TPL_FAMILYTREETOP_JANUARY");?></div>
        <div data-familytreetop="2"><?=JText::_("TPL_FAMILYTREETOP_FEBRUARY");?></div>
        <div data-familytreetop="3"><?=JText::_("TPL_FAMILYTREETOP_MARCH");?></div>
        <div data-familytreetop="4"><?=JText::_("TPL_FAMILYTREETOP_APRIL");?></div>
        <div data-familytreetop="5"><?=JText::_("TPL_FAMILYTREETOP_MAY");?></div>
        <div data-familytreetop="6"><?=JText::_("TPL_FAMILYTREETOP_JUNE");?></div>
        <div data-familytreetop="7"><?=JText::_("TPL_FAMILYTREETOP_JULY");?></div>
        <div data-familytreetop="8"><?=JText::_("TPL_FAMILYTREETOP_AUGUST");?></div>
        <div data-familytreetop="9"><?=JText::_("TPL_FAMILYTREETOP_SEPTEMBER");?></div>
        <div data-familytreetop="10"><?=JText::_("TPL_FAMILYTREETOP_OCTOBER");?></div>
        <div data-familytreetop="11"><?=JText::_("TPL_FAMILYTREETOP_NOVEMBER");?></div>
        <div data-familytreetop="12"><?=JText::_("TPL_FAMILYTREETOP_DECEMBER");?></div>
    </div>


    <div id="popover">
        <div class="row-fluid" style="padding: 9px 14px;">
            <div class="span3 familytreetop-avatar"><img class="media-object" data-src="template/familytreetop/js/holder.js/75x75"></div>
            <div class="span8" familytreetop-name="content">
                <ul class="unstyled" style="font-size:13px;">
                    <li familytreetop-name="birth"><span style="color: #c3c3c3;"><?=JText::_("TPL_FAMILYTREETOP_BORN");?></span>: <span></span></li>
                    <li familytreetop-name="death"><span style="color: #c3c3c3;"><?=JText::_("TPL_FAMILYTREETOP_DIED");?></span>: <span></span></li>
                    <li familytreetop-name="relation"><span style="color: #c3c3c3;"><?=JText::_("TPL_FAMILYTREETOP_RELATION");?></span>: <span></span></li>
                </ul>
            </div>
        </div>
        <div class="row-fluid" familytreetop-name="footer">
            <div class="span12 familytreetop-popover-footer text-center">
                <button familytreetop="facebook" type="button" class="btn" style="display:none;padding:2px 5px;">
                    <i class="icon-2x icon-facebook-sign pull-left" style="margin:0;"></i>
                    <div class="pull-left" style="line-height: 28px; margin-left: 3px; white-space: nowrap;">
                        <?=JText::_('TPL_FAMILYTREETOP_BUTTON_FACEBOOK');?>
                    </div>
                </button>
                <button familytreetop-invite type="button" class="btn btn-primary" style="display:none;padding: 2px 5px">
                    <i class="icon-2x icon-white icon-facebook-sign pull-left" style="margin:0;"></i>
                    <div class="pull-left" style="line-height: 28px; margin-left: 3px; white-space: nowrap;">
                        <?=JText::_('TPL_FAMILYTREETOP_BUTTON_INVITE');?>
                    </div>
                </button>
                <button familytreetop="profile" type="button" class="btn" style="padding: 2px 5px">
                    <i class="icon-user pull-left" style="margin:0;font-size: 24px;line-height: 28px;"></i>
                    <div class="pull-left" style="line-height: 28px; margin-left: 3px; white-space: nowrap;">
                        <?=JText::_('TPL_FAMILYTREETOP_BUTTON_PROFILE');?>
                    </div>
                </button>
            </div>
        </div>
    </div>

    <div class="popover" style="min-width:350px;">
        <div class="arrow"></div>
        <h3 class="popover-title" style="font-weight: bold;"></h3>
        <div class="popover-content" style="padding:0;"></div>
    </div>

    <div id="editMenu">
        <div class="btn-group dropdown">
            <button class="btn  btn-mini" data-toggle="dropdown"><i class="icon-pencil"></i></button>
            <ul class="dropdown-menu">
                <li familytreetop="edit"><a href="#"><?=JText::_("TPL_FAMILYTREETOP_EDIT_PROFILE");?></a></li>
                <li data-familytreetop-devider="1" class="divider"></li>
                <li familytreetop="addParent"><a href="#"><?=JText::_("TPL_FAMILYTREETOP_ADD_PARENT");?></a></li>
                <li familytreetop="addSibling"><a href="#"><?=JText::_("TPL_FAMILYTREETOP_ADD_SIBLING");?></a></li>
                <li familytreetop="addSpouse"><a href="#"><?=JText::_("TPL_FAMILYTREETOP_ADD_SPOUSE");?></a></li>
                <li familytreetop="addChild"><a href="#"><?=JText::_("TPL_FAMILYTREETOP_ADD_CHILD");?></a></li>
                <li familytreetop-devider="delete" data-familytreetop-devider="2" class="divider"></li>
                <li familytreetop="delete"><a href="#">Delete</a></li>
                <li familytreetop="deleteUnion"><a href="#">Delete*</a></li>
                <li familytreetop-devider="sendInvite" data-familytreetop-devider="3" class="divider"></li>
                <li familytreetop="sendInvite"><a href="#"><?=JText::_("TPL_FAMILYTREETOP_SEND_INVITE");?></a></li>
            </ul>
        </div>
    </div>

    <div id="modal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
            <div style="margin-right: 5px; visibility: hidden;" familytreetop="circle-progressbar" class="pull-right"><img src="<?=$this->baseurl?>/templates/<?=$this->template;?>/img/circle_progressbar.gif"></div>
            <h3 id="modalLabel"></h3>
        </div>
        <div class="modal-body">
        </div>
        <div class="modal-footer">
            <button class="btn" data-dismiss="modal" aria-hidden="true"><?=JText::_("TPL_FAMILYTREETOP_MODAL_CLOSE");?></button>
            <button familytreetop="submit" class="btn"><?=JText::_("TPL_FAMILYTREETOP_MODAL_SAVE");?></button>
            <button familytreetop="submit" class="btn btn-primary"><?=JText::_("TPL_FAMILYTREETOP_MODAL_SAVE_AND_CLOSE");?></button>
        </div>
    </div>

    <div id="modal-exist-family-member" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
            <h3 id="modalLabel"><?=JText::_('TPL_FAMILYTREETOP_MODAL_EXIST_FAMILY_MEMBER_TITLE');?></h3>
        </div>
        <div class="modal-body" style="text-align: center;">
            <div class="row-fluid">
                <div class="span12">
                    <?=JText::_('TPL_FAMILYTREETOP_MODAL_EXIST_FAMILY_MEMBER_DESCRIPTION')?>
                </div>
            </div>
            <div class="row-fluid">
                <div class="span12">
                    <select style="margin:10px; min-width:80%;" id="spouses">

                    </select>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn" data-dismiss="modal" aria-hidden="true"><?=JText::_("TPL_FAMILYTREETOP_MODAL_CLOSE");?></button>
            <button familytreetop="submit" class="btn"><?=JText::_("TPL_FAMILYTREETOP_MODAL_SAVE");?></button>
        </div>
    </div>

    <div id="profile" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="profileLabel" aria-hidden="true">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
            <button type="button" familytreetop="edit" class="btn familytreetop-header-button" style="padding: 5px 10px;"><i class="icon-pencil"></i><span style="top: 0;margin-left: 3px;"><?=JText::_('TPL_FAMILYTREETOP_BUTTON_EDIT');?></span></button>
            <button type="button" familytreetop="facebook" class="btn familytreetop-header-button"><i class="icon-2x icon-facebook-sign"></i><span style="margin-left:3px;"><?=JText::_('TPL_FAMILYTREETOP_BUTTON_FACEBOOK');?></span></button>
            <button type="button" familytreetop="invite" class="btn btn-primary familytreetop-header-button"> <i class="icon-2x icon--white icon-facebook-sign"></i><span><?=JText::_('TPL_FAMILYTREETOP_BUTTON_INVITE');?></span></button>
            <h3 id="profileLabel"></h3>
        </div>
        <div class="modal-body">
            <div data-familytreetop-profile="creator" style="position:absolute; top:5px; right:5px;">
                <div style="color: #c3c3c3;"><span><?=JText::_('TPL_FAMILYTREETOP_CREATOR_DESCRIPTION');?></span><span familytreetop="name"></span></div>
            </div>
            <div data-familytreetop-profile="facebook" class="row-fluid">
                <div class="span12">

                </div>
            </div>
            <div data-familytreetop-profile="about" class="row-fluid">
                <div class="span7">
                    <div class="well" familytreetop="module">
                        <fieldset>
                            <legend><?=JText::_("TPL_FAMILYTREETOP_ABOUT");?></legend>
                            <div class="row-fluid" style="padding: 5px;">
                                <div  data-familytreetop="avatar" class="span4"></div>
                                <div class="span8">
                                    <ul class="unstyled" style="font-size:14px;">
                                        <li><strong><?=JText::_("TPL_FAMILYTREETOP_FIRST_NAME");?></strong>: <span></span></li>
                                        <li><strong><?=JText::_("TPL_FAMILYTREETOP_MIDDLE_NAME");?></strong>: <span></span></li>
                                        <li><strong><?=JText::_("TPL_FAMILYTREETOP_LAST_NAME");?></strong>: <span></span></li>
                                        <li><strong><?=JText::_("TPL_FAMILYTREETOP_KNOW_AS");?></strong>: <span></span></li>
                                        <li><strong><?=JText::_("TPL_FAMILYTREETOP_RELATION");?></strong>: <span></span></li>
                                    </ul>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                </div>
            </div>
            <div data-familytreetop-profile="relation" class="row-fluid">
                <div class="span12">
                    <div class="well" familytreetop="module">
                        <fieldset>
                            <legend><?=JText::_("TPL_FAMILYTREETOP_RELATION_MAP");?></legend>
                        </fieldset>
                    </div>
                </div>
            </div>
            <div data-familytreetop-profile="family" class="row-fluid">
                <div class="span12">
                    <div class="well" familytreetop="module">
                        <fieldset>
                            <legend><?=JText::_("TPL_FAMILYTREETOP_FAMILY");?></legend>
                        </fieldset>
                    </div>
                </div>
            </div>
            <div data-familytreetop-profile="photos" class="row-fluid">
                <div class="span12">
                    <div class="well" familytreetop="module">
                        <fieldset>
                            <legend><?=JText::_("TPL_FAMILYTREETOP_PHOTOS");?></legend>
                        </fieldset>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="editorTabs">
        <ul class="nav nav-tabs">
            <li class="active"><a href="#" familytreetop-tab="profile" data-toggle="tab"><?=JText::_("TPL_FAMILYTREETOP_EDITOR_TABS_PROFILE");?></a></li>
            <li><a href="#" familytreetop-tab="unions" data-toggle="tab"><?=JText::_("TPL_FAMILYTREETOP_EDITOR_TABS_UNIONS");?></a></li>
            <li><a href="#" familytreetop-tab="media" data-toggle="tab"><?=JText::_("TPL_FAMILYTREETOP_EDITOR_TABS_MEDIA");?></a></li>
            <li><a href="#" familytreetop-tab="options" data-toggle="tab"><?=JText::_("TPL_FAMILYTREETOP_EDITOR_TABS_OPTIONS");?></a></li>
        </ul>
        <div class="tab-content">
            <div class="tab-pane active" id="_1_"></div>
            <div class="tab-pane" id="_2_"></div>
            <div class="tab-pane" id="_3_"></div>
            <div class="tab-pane" id="_4_"></div>
        </div>
    </div>

    <div id="dataEditMedia" class="row-fluid familytreetop-gallery">
        <div class="span12">
            <ul class="unstyled inline">

            </ul>
        </div>
    </div>

    <form id="formEditMedia" action="<?=JRoute::_("index.php?option=com_familytreetop&task=upload.file", false);?>" method="POST" enctype="multipart/form-data">
        <div class="row-fluid fileupload-buttonbar">
            <div class="row-fluid">
                <div class="span12">
                    <span class="btn btn-success fileinput-button">
                        <i style="display:inline-block;" class="icon-plus icon-white"></i>
                        <span style="display:inline-block;"><?=JText::_("TPL_FAMILYTREETOP_EDITOR_TABS_MEDIA_ADD_FILES");?></span>
                        <input type="file" name="files[]" multiple="">
                    </span>
                    <button class="btn btn-info familytreetop-button set-avatar" style="display:none;">
                        <i class="icon-ok-sign icon-white"></i>
                        <span><?=JText::_("TPL_FAMILYTREETOP_EDITOR_TABS_MEDIA_SET_AVATAR");?></span>
                    </button>
                    <button class="btn btn-danger familytreetop-button unset-avatar" style="display: none;">
                        <i class="icon-remove-sign icon-white"></i>
                        <span><?=JText::_("TPL_FAMILYTREETOP_EDITOR_TABS_MEDIA_UNSET_AVATAR");?></span>
                    </button>
                    <button class="btn btn-danger familytreetop-button delete" style="display: none;">
                        <i class="icon-trash icon-white"></i>
                        <span><?=JText::_("TPL_FAMILYTREETOP_EDITOR_TABS_MEDIA_DELETE");?></span>
                    </button>
                </div>
            </div>
            <div class="row-fluid">
                <div class="span12 fileupload-progress fade">
                    <div class="progress progress-success progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100">
                        <div class="bar" style="width:0%;"></div>
                    </div>
                    <div class="progress-extended">&nbsp;</div>
                </div>
            </div>
        </div>
        <div class="fileupload-loading"></div>
        <br>
        <table role="presentation" class="table table-striped">
            <tbody class="files" data-toggle="modal-gallery" data-target="#modal-gallery"></tbody>
        </table>
    </form>

    <form id="formEditUnions">
        <div class="well" familytreetop="module">
            <fieldset>
                <legend>
                    <div style="height:40px;">
                        <div class="pull-left"><span familytreetop="union-title" style="margin-left:10px;"><?=JText::_("TPL_FAMILYTREETOP_EDITOR_TABS_UNIONS_UNIONS");?></span></div>
                        <div class="pull-right">
                            <div familytreetop="union-button" style="margin-right: 10px;">
                                <button familytreetop="current" style="display:none;" class="btn disabled"><?=JText::_('TPL_FAMILYTREETOP_BUTTON_CURRENT');?></button>
                                <button familytreetop="set-current" style="display:none;" class="btn btn-primary"><?=JText::_('TPL_FAMILYTREETOP_BUTTON_SET_CURRENT');?></button>
                            </div>
                        </div>
                    </div>
                </legend>
                <input style="display:none;" familytreetop="family_id" name="editUnion[family_id]" type="text" class="hidden" />
                <div class="row-fluid">
                    <div class="span6">
                        <div familytreetop="sircar" class="well" style="background: white;margin: 5px;">
                             <div class="row-fluid">
                                <div class="span4" familytreetop="avatar"></div>
                                <div class="span8" style="text-align:left;" familytreetop="data"></div>
                             </div>
                        </div>
                    </div>
                    <div class="span6">
                        <div familytreetop="spouse" class="well" style="background: white;margin: 5px;">
                            <div class="row-fluid">
                                <div class="span4" familytreetop="avatar"></div>
                                <div class="span8" style="text-align:left;" familytreetop="data"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row-fluid">
                    <div familytreetop="union-event-date" class="span12" style="padding-left: 5px;">
                        <select familytreetop="months" class="span4" name="editUnion[month]">
                            <option value="0"><?=JText::_("TPL_FAMILYTREETOP_MONTH");?></option>
                            <option value="1"><?=JText::_("TPL_FAMILYTREETOP_JANUARY");?></option>
                            <option value="2"><?=JText::_("TPL_FAMILYTREETOP_FEBRUARY");?></option>
                            <option value="3"><?=JText::_("TPL_FAMILYTREETOP_MARCH");?></option>
                            <option value="4"><?=JText::_("TPL_FAMILYTREETOP_APRIL");?></option>
                            <option value="5"><?=JText::_("TPL_FAMILYTREETOP_MAY");?></option>
                            <option value="6"><?=JText::_("TPL_FAMILYTREETOP_JUNE");?></option>
                            <option value="7"><?=JText::_("TPL_FAMILYTREETOP_JULY");?></option>
                            <option value="8"><?=JText::_("TPL_FAMILYTREETOP_AUGUST");?></option>
                            <option value="9"><?=JText::_("TPL_FAMILYTREETOP_SEPTEMBER");?></option>
                            <option value="10"><?=JText::_("TPL_FAMILYTREETOP_OCTOBER");?></option>
                            <option value="11"><?=JText::_("TPL_FAMILYTREETOP_NOVEMBER");?></option>
                            <option value="12"><?=JText::_("TPL_FAMILYTREETOP_DECEMBER");?></option>
                        </select>
                        <select familytreetop="days" class="span2" name="editUnion[day]">
                            <option value="0"><?=JText::_("TPL_FAMILYTREETOP_DAY");?></option>
                        </select>
                        <input familytreetop="year" style="max-width: 45px;" class="span4" type="text" maxlength="4" name="editUnion[year]" placeholder="<?=JText::_("TPL_FAMILYTREETOP_YEAR");?>">
                    </div>
                </div>
                <div familytreetop="union-event-place" class="row-fluid">
                    <div class="span12" style="padding-left: 5px;">
                        <input familytreetop="city" class="span4" type="text" name="editUnion[city]"  placeholder="<?=JText::_("TPL_FAMILYTREETOP_CITY");?>">
                        <input familytreetop="state" class="span4" type="text" name="editUnion[state]" placeholder="<?=JText::_("TPL_FAMILYTREETOP_STATE");?>">
                        <input familytreetop="country" class="span4" type="text" name="editUnion[country]" placeholder="<?=JText::_("TPL_FAMILYTREETOP_COUNTRY");?>">
                    </div>
                </div>
            </fieldset>
        </div>
    </form>

    <form id="formEditProfile">
        <div familytreetop="addChildComplexSelect" style="" class="row-fluid">
            <div class="span12">
                <div class="row-fluid">
                    <div class="span2"></div>
                    <div class="span8">
                        <div class="row-fluid">
                            <div class="span5">
                                <label for="editProfile[addParent1]"><?=JText::_('TPL_FAMILYTREETOP_MODAL_EXIST_FAMILY_MEMBER_PARENT_1');?></label>
                                <input familytreetop="parent1" type="text" class="span12" id="editProfile[addParent1]" name="editProfile[addParent1]" >
                            </div>
                            <div class="span1">
                                <div style="padding-top:25px; text-align:center;">
                                    <i class="icon-plus icon-2x"></i>
                                </div>
                            </div>
                            <div class="span6">
                                <label for="editProfile[addParent2]"><?=JText::_('TPL_FAMILYTREETOP_MODAL_EXIST_FAMILY_MEMBER_PARENT_2');?></label>
                                <input familytreetop="parent2" type="text" class="span12" id="editProfile[addParent2]" name="editProfile[addParent2]" value="0" style="display:none;"  hidden >
                                <div class="btn-group dropdown" style="min-width:100%;">
                                    <button familytreetop="menu-title" class="btn span10"><?=JText::_('TPL_FAMILYTREETOP_EDITOR_TABS_PROFILE_ADD_NEW_PERSON');?></button>
                                    <button class="btn dropdown-toggle" data-toggle="dropdown">
                                        <span class="caret"></span>
                                    </button>
                                    <ul style="max-width: 100%;text-align: center;" class="dropdown-menu" role="menu" aria-labelledby="dLabel">
                                        <li familytreetop="other-partners" class="divider"></li>
                                        <li familytreetop="button" familytreetop-data="new" style="cursor:pointer;"><a href="#"><?=JText::_('TPL_FAMILYTREETOP_EDITOR_TABS_PROFILE_ADD_NEW_PERSON');?></a></li>
                                        <li familytreetop="exist-members" class="divider"></li>
                                        <li familytreetop="button" familytreetop-data="exist" style="cursor:pointer;"><a href="#"><?=JText::_('TPL_FAMILYTREETOP_MODAL_EXIST_FAMILY_MEMBER_EXIST');?></a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="span2"></div>
                </div>
                <div class="row-fluid">
                    <div class="span12"><hr></div>
                </div>
            </div>
        </div>
        <div familytreetop="addSpouseComplexButton" class="row-fluid">
            <div class="span12">
                <div class="pull-right">
                    <input id="editProfile[spouse]" name="editProfile[spouse]" type="text" value="0" style="display:none" hidden>
                    <a href="#" style="text-decoration: none;"><?=JText::_('TPL_FAMILYTREETOP_MODAL_EXIST_FAMILY_MEMBER_SPOUSE_BUTTON_TEXT');?></a>
                </div>
            </div>
        </div>
        <div class="row-fluid">
            <div familytreetop="avatar" class="span3 text-center">
            </div>
            <div class="span9">
                <div class="row-fluid">
                    <div familytreetop="gender" class="span6">
                        <label for="editProfile[gender]"><small><?=JText::_("TPL_FAMILYTREETOP_GENDER");?></small></label>
                        <select class="span12" id="editProfile[gender]" name="editProfile[gender]">
                            <option value="default"><?=JText::_('TPL_FAMILYTREETOP_SELECT_GENDER');?></option>
                            <option value="1"><?=JText::_("TPL_FAMILYTREETOP_GENDER_MALE");?></option>
                            <option value="0"><?=JText::_("TPL_FAMILYTREETOP_GENDER_FEMALE");?></option>
                        </select>
                    </div>
                    <div familytreetop="living" class="span6">
                        <label for="editProfile[living]"><small><?=JText::_("TPL_FAMILYTREETOP_LIVING");?></small></label>
                        <select class="span12" id="editProfile[living]" name="editProfile[living]">
                            <option value="1"><?=JText::_("TPL_FAMILYTREETOP_YES");?></option>
                            <option value="0"><?=JText::_("TPL_FAMILYTREETOP_NO");?></option>
                        </select>
                    </div>
                </div>
                <div class="row-fluid">
                    <div familytreetop="firstName" class="span6">
                        <label for="editProfile[firstName]"><small><?=JText::_("TPL_FAMILYTREETOP_FIRST_NAME");?></small></label>
                        <div class="controls">
                            <input class="span12" name="editProfile[first_name]" type="text" id="editProfile[firstName]" placeholder="<?=JText::_("TPL_FAMILYTREETOP_FIRST_NAME");?>">
                        </div>
                    </div>
                    <div familytreetop="middleName" class="span6">
                        <label for="editProfile[middleName]"><small><?=JText::_("TPL_FAMILYTREETOP_MIDDLE_NAME");?></small></label>
                        <div class="controls">
                            <input class="span12" name="editProfile[middle_name]" type="text" id="editProfile[middleName]" placeholder="<?=JText::_("TPL_FAMILYTREETOP_MIDDLE_NAME");?>">
                        </div>
                    </div>
                </div>
                <div class="row-fluid">
                    <div familytreetop="lastName" class="span6">
                        <label for="editProfile[firstName]"><small><?=JText::_("TPL_FAMILYTREETOP_LAST_NAME");?></small></label>
                        <div class="controls">
                            <input class="span12" name="editProfile[last_name]" type="text" id="editProfile[lastName]" placeholder="<?=JText::_("TPL_FAMILYTREETOP_LAST_NAME");?>">
                        </div>
                    </div>
                    <div familytreetop="knowAs" class="span6">
                        <label for="editProfile[knowAs]"><small><?=JText::_("TPL_FAMILYTREETOP_KNOW_AS");?></small></label>
                        <div class="controls">
                            <input class="span12" name="editProfile[know_as]" type="text" id="editProfile[knowAs]" placeholder="<?=JText::_("TPL_FAMILYTREETOP_KNOW_AS");?>">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row-fluid">
            <div familytreetop="birthday" class="span12">
                <p>
                    <?=JText::_("TPL_FAMILYTREETOP_BIRTHDAY");?>:
                </p>
            </div>
        </div>
        <div class="row-fluid">
            <div familytreetop="birthday" class="span12">
                <select familytreetop="months" class="span4" name="editProfile[b_month]">
                    <option value="0"><?=JText::_("TPL_FAMILYTREETOP_MONTH");?></option>
                    <option value="1"><?=JText::_("TPL_FAMILYTREETOP_JANUARY");?></option>
                    <option value="2"><?=JText::_("TPL_FAMILYTREETOP_FEBRUARY");?></option>
                    <option value="3"><?=JText::_("TPL_FAMILYTREETOP_MARCH");?></option>
                    <option value="4"><?=JText::_("TPL_FAMILYTREETOP_APRIL");?></option>
                    <option value="5"><?=JText::_("TPL_FAMILYTREETOP_MAY");?></option>
                    <option value="6"><?=JText::_("TPL_FAMILYTREETOP_JUNE");?></option>
                    <option value="7"><?=JText::_("TPL_FAMILYTREETOP_JULY");?></option>
                    <option value="8"><?=JText::_("TPL_FAMILYTREETOP_AUGUST");?></option>
                    <option value="9"><?=JText::_("TPL_FAMILYTREETOP_SEPTEMBER");?></option>
                    <option value="10"><?=JText::_("TPL_FAMILYTREETOP_OCTOBER");?></option>
                    <option value="11"><?=JText::_("TPL_FAMILYTREETOP_NOVEMBER");?></option>
                    <option value="12"><?=JText::_("TPL_FAMILYTREETOP_DECEMBER");?></option>
                </select>
                <select familytreetop="days" class="span2" name="editProfile[b_day]">
                    <option value="0"><?=JText::_("TPL_FAMILYTREETOP_DAY");?></option>
                </select>
                <input familytreetop="year" class="span4" type="text" name="editProfile[b_year]" placeholder="<?=JText::_("TPL_FAMILYTREETOP_YEAR");?>">
            </div>
        </div>
        <div familytreetop="birthday" class="row-fluid">
            <div class="span12">
                <input class="span4" type="text" name="editProfile[b_city]"  placeholder="<?=JText::_("TPL_FAMILYTREETOP_CITY");?>">
                <input class="span4" type="text" name="editProfile[b_state]" placeholder="<?=JText::_("TPL_FAMILYTREETOP_STATE");?>">
                <input class="span4" type="text" name="editProfile[b_country]" placeholder="<?=JText::_("TPL_FAMILYTREETOP_COUNTRY");?>">
            </div>
        </div>

        <div class="row-fluid">
            <div familytreetop="deathday" class="span12">
                <p>
                    <?=JText::_("TPL_FAMILYTREETOP_DEATHDAY");?>:
                </p>
            </div>
        </div>
        <div class="row-fluid">
            <div familytreetop="deathday" class="span12">
                <select familytreetop="months" class="span4" name="editProfile[d_month]">
                    <option value="0"><?=JText::_("TPL_FAMILYTREETOP_MONTH");?></option>
                    <option value="1"><?=JText::_("TPL_FAMILYTREETOP_JANUARY");?></option>
                    <option value="2"><?=JText::_("TPL_FAMILYTREETOP_FEBRUARY");?></option>
                    <option value="3"><?=JText::_("TPL_FAMILYTREETOP_MARCH");?></option>
                    <option value="4"><?=JText::_("TPL_FAMILYTREETOP_APRIL");?></option>
                    <option value="5"><?=JText::_("TPL_FAMILYTREETOP_MAY");?></option>
                    <option value="6"><?=JText::_("TPL_FAMILYTREETOP_JUNE");?></option>
                    <option value="7"><?=JText::_("TPL_FAMILYTREETOP_JULY");?></option>
                    <option value="8"><?=JText::_("TPL_FAMILYTREETOP_AUGUST");?></option>
                    <option value="9"><?=JText::_("TPL_FAMILYTREETOP_SEPTEMBER");?></option>
                    <option value="10"><?=JText::_("TPL_FAMILYTREETOP_OCTOBER");?></option>
                    <option value="11"><?=JText::_("TPL_FAMILYTREETOP_NOVEMBER");?></option>
                    <option value="12"><?=JText::_("TPL_FAMILYTREETOP_DECEMBER");?></option>
                </select>
                <select familytreetop="days" class="span2" name="editProfile[d_day]">
                    <option value="0"><?=JText::_("TPL_FAMILYTREETOP_DAY");?></option>
                </select>
                <input familytreetop="year" class="span4" type="text" name="editProfile[d_year]" placeholder="<?=JText::_("TPL_FAMILYTREETOP_YEAR");?>">
            </div>
        </div>
        <div familytreetop="deathday" class="row-fluid">
            <div class="span12">
                <input class="span4" type="text" name="editProfile[d_city]"  placeholder="<?=JText::_("TPL_FAMILYTREETOP_CITY");?>">
                <input class="span4" type="text" name="editProfile[d_state]" placeholder="<?=JText::_("TPL_FAMILYTREETOP_STATE");?>">
                <input class="span4" type="text" name="editProfile[d_country]" placeholder="<?=JText::_("TPL_FAMILYTREETOP_COUNTRY");?>">
            </div>
        </div>
    </form>

    <form id="formEditOptions" action="<?=JRoute::_("index.php?option=com_familytreetop&task=upload.file", false);?>" method="POST" enctype="multipart/form-data">
        <div familytreetop="buttons">
            <div class="row-fluid">
                <div class="span4"></div>
                <div class="span4"><button familytreetop-button="delete" type="button" class="btn btn-danger"><?=JText::_('TPL_FAMILYTREETOP_EDITOR_TABS_OPTIONS_DELETE_THIS_PERSON');?></button></div>
                <div class="span4"></div>
            </div>
        </div>
        <div familytreetop="orange-users" style="display:none;">
            <div class="row-fluid">
                <div class="span4"></div>
                <div class="span4">
                    <div class="row-fluid">
                        <div class="span12">
                           <p style="color: #f0ac41;">Warning: The following will happen if you remove yourself from this family tree:</p>
                        </div>
                    </div>
                    <div class="row-fluid">
                        <div class="span12">
                            <ul familytreetop="orange-list"></ul>
                        </div>
                    </div>
                    <div class="row-fluid">
                        <div class="span12">
                            <button familytreetop="orange-confirm" type="button" class="btn">Confirm</button>
                            <button familytreetop="orange-cancel" type="button" class="btn">Cancel</button>
                        </div>
                    </div>

                </div>
                <div class="span4"></div>
            </div>
        </div>
        <div familytreetop="delete-tree" style="display:none;">
            <div class="row-fluid">
                <div class="span4"></div>
                <div class="span4">
                    <button familytreetop-button="delete-tree" type="button" class="btn btn-danger"><?=JText::_('TPL_FAMILYTREETOP_EDITOR_TABS_OPTIONS_DELETE_MY_FAMILY_TREE');?></button>
                </div>
                <div class="span4"></div>
            </div>
        </div>
        <div familytreetop="delete-invalid" style="display:none;">
            <div class="row-fluid">
                <div class="span4"></div>
                <div class="span4" style="text-align: center;">
                    <div>
                        <button familytreetop-button="delete-invalid" type="button" class="btn disabled"><?=JText::_('TPL_FAMILYTREETOP_EDITOR_TABS_OPTIONS_DELETE_THIS_PERSON');?></button>
                    </div>
                    <div>
                        <p style="color:red; font-weight: bold;">
                            <?=JText::_('TPL_FAMILYTREETOP_EDITOR_TABS_OPTIONS_OPTION_AVAILABLE_1');?>
                        </p>
                    </div>
                </div>
                <div class="span4"></div>
            </div>
        </div>
        <div familytreetop="delete-invalid-register" style="display:none;">
            <div class="row-fluid">
                <div class="span4"></div>
                <div class="span4" style="text-align: center;">
                    <div>
                        <button familytreetop-button="delete-invalid" type="button" class="btn disabled"><?=JText::_('TPL_FAMILYTREETOP_EDITOR_TABS_OPTIONS_DELETE_THIS_PERSON');?></button>
                    </div>
                    <div>
                        <p style="color:red; font-weight: bold;">
                             <?=JText::_('TPL_FAMILYTREETOP_EDITOR_TABS_OPTIONS_OPTION_AVAILABLE_2');?>
                        </p>
                    </div>
                </div>
                <div class="span4"></div>
            </div>
        </div>
        <div familytreetop="delete-confirm" style="display:none;">
            <div class="row-fluid" style="text-align: center;">
                <div class="span4"></div>
                <div class="span4">
                    <div><i style="color:red;" class="icon-4x icon-warning-sign"></i></div>
                    <div><?=JText::_('TPL_FAMILYTREETOP_EDITOR_TABS_OPTIONS_YOU_ABOUT_DELETE');?></div>
                    <div><?=JText::_('TPL_FAMILYTREETOP_EDITOR_TABS_OPTIONS_ARE_YOU_SURE');?></div>
                    <div style="margin:10px;">
                        <div familytreetop-button="delete-confirm-delete" class="btn btn-danger"><?=JText::_('TPL_FAMILYTREETOP_BUTTON_DELETE');?></div>
                        <div familytreetop-button="delete-confirm-cancel" class="btn"><?=JText::_('TPL_FAMILYTREETOP_BUTTON_CANCEL');?></div>
                    </div>
                </div>
                <div class="span4"></div>
            </div>
        </div>
        <div familytreetop="delete" style="display:none;">
            <table class="table familytreetop-table-not-border">
                <tr>
                    <td><i style="color:red;" class="icon-4x icon-warning-sign"></i></td>
                    <td><p style="font-weight: bold;"><?=JText::_('TPL_FAMILYTREETOP_EDITOR_TABS_OPTIONS_YOU_ABOUT_UNREGISTERED');?>.</p></td>
                </tr>
                <tr>
                    <td></td>
                    <td>
                        <div><span style="font-weight: bold;"><?=JText::_('TPL_FAMILYTREETOP_EDITOR_TABS_OPTIONS_PLEASE_SELECT_OPTION');?>:</span></div>
                        <div><hr></div>
                    </td>
                </tr>
                <tr class="info">
                    <td class="white">
                        <div>
                            <img src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/images/m_options_unlink.jpg" />
                        </div>
                    </td>
                    <td class="hover">
                        <div familytreetop="option" option="1" style="cursor:pointer;color:blue;font-weight: bold;">
                            <?=JText::_('TPL_FAMILYTREETOP_EDITOR_TABS_OPTIONS_UNREGISTER_MY_PROFILE');?>
                        </div>
                        <div><?=JText::_('TPL_FAMILYTREETOP_EDITOR_TABS_OPTIONS_YOUR_PROFILE_INFO_VISIBLE');?></div>
                    </td>
                </tr>
                <tr class="info">
                    <td class="white">
                        <div>
                            <img src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/images/m_options_remove.jpg" />
                        </div>
                    </td>
                    <td class="hover">
                        <div familytreetop="option" option="2" style="cursor:pointer;color:blue;font-weight: bold;">
                            <?=JText::_('TPL_FAMILYTREETOP_EDITOR_TABS_OPTIONS_UNREGISTER_AND_DELETE');?>
                        </div>
                        <div><?=JText::_('TPL_FAMILYTREETOP_EDITOR_TABS_OPTIONS_YOU_DATA_WILL_BE_DELETE');?></div>
                    </td>
                </tr>
                <tr class="info">
                    <td class="white">
                        <div>
                            <img src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/images/m_options_delete.jpg" />
                        </div>
                    </td>
                    <td class="hover">
                        <div familytreetop="valid">
                           <div familytreetop="option" option="3" style="cursor:pointer;color:blue;font-weight: bold;"><?=JText::_('TPL_FAMILYTREETOP_EDITOR_TABS_OPTIONS_UNREGISTER_AND_REMOVE');?></div>
                            <div>
                                <?=JText::_('TPL_FAMILYTREETOP_EDITOR_TABS_OPTIONS_NEED_TO_DELE_SPOUSE_AND_DESCENANTS');?>.
                            </div>
                        </div>
                        <div familytreetop="invalid" style="display:none;">
                            <div style="color:gray;">
                                <?=JText::_('TPL_FAMILYTREETOP_EDITOR_TABS_OPTIONS_UNREGISTER_AND_REMOVE');?><span style="color:red;">*</span>
                            </div>
                            <div style="color:gray;">
                                <?=JText::_('TPL_FAMILYTREETOP_EDITOR_TABS_OPTIONS_NEED_TO_DELE_SPOUSE_AND_DESCENANTS');?>
                            </div>
                            <div style="color:red;">
                                <?=JText::_('TPL_FAMILYTREETOP_EDITOR_TABS_OPTIONS_YOU_MUST_DELETE');?>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr><td colspan="2" style="text-align: center;"><button familytreetop="cancel" type="button" class="btn btn-inverse"><?=JText::_('TPL_FAMILYTREETOP_BUTTON_CANCEL');?></button></td></tr>
            </table>
        </div>
    </form>

    <div id="familiesHide">
        <div familytreetop="home" style="position: absolute;top: 0;left: 50%; margin-left: -20px; cursor: pointer;">
            <a style="text-decoration: none;" onclick="return false;">
                <span class="icon-stack">
                     <i class="icon-circle icon-stack-base"></i>
                     <i class="icon-home icon-light"></i>
                </span>
            </a>
        </div>
        <div class="multiparent-left-box" style="width: 120px;max-height: 250px;/*overflow: hidden;overflow-y: auto;*/"></div>
        <div class="multiparent-right-box" style="width: 120px;max-height: 250px;/*overflow: hidden;overflow-y: auto;*/"></div>
        <div class="parent-box" style="max-width: 160px;">
            <div familytreetop-avatar-box style="width: 150px;position:relative;">
                <img class="img-polaroid" data-src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/holder.js/150x150">
            </div>
            <div class="text-center"></div>
            <div class="text-center"></div>
        </div>
        <div class="spouse-box" style="max-width: 102px;">
            <div style="position:relative;">
                <img class="img-polaroid" data-src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/holder.js/100x100">
            </div>
            <div class="text-center"></div>
        </div>
        <div class="child-box" style="max-width: 110px;">
            <div style="position:relative;">
                <img class="img-polaroid" data-src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/holder.js/100x100">
            </div>
            <div class="text-center"></div>
            <div class="text-center"></div>
        </div>
    </div>

    <div id="familytreetopFriendSelector">
        <div familytreetop="link"><?=JText::_('TPL_FAMILYTREETOP_TDFRIENDSELECTOR_LINK');?></div>
        <div familytreetop="title"><?=JText::_('TPL_FAMILYTREETOP_TDFRIENDSELECTOR_MESSAGE_TITLE');?></div>
        <div familytreetop="description"><?=JText::_('TPL_FAMILYTREETOP_TDFRIENDSELECTOR_MESSAGE_DESCRIPTION');?></div>
    </div>
</div>
<!-- friend selector -->
<div id="TDFriendSelector">
    <div class="TDFriendSelector_dialog">
        <a href="#" id="TDFriendSelector_buttonClose">x</a>
        <div class="TDFriendSelector_form">
            <div class="TDFriendSelector_header">
                <p><?=JText::_("TPL_FAMILYTREETOP_TDFRIENDSELECTOR_SELECT_YOUR_FRIENDS");?></p>
            </div>
            <div class="TDFriendSelector_content">
                <!--<p><?=JText::_("TPL_FAMILYTREETOP_TDFRIENDSELECTOR_INVITE_TO_APP");?></p>-->
                <div class="TDFriendSelector_searchContainer TDFriendSelector_clearfix">
                    <input type="text" placeholder="Search Friend" id="TDFriendSelector_searchField" />
                </div>
                <div class="TDFriendSelector_friendsContainer"></div>
            </div>
            <div class="TDFriendSelector_footer TDFriendSelector_clearfix">
                <a href="#" id="TDFriendSelector_pagePrev" class="TDFriendSelector_disabled"><?=JText::_("TPL_FAMILYTREETOP_TDFRIENDSELECTOR_PREVIOUS");?></a>
                <a href="#" id="TDFriendSelector_pageNext"><?=JText::_("TPL_FAMILYTREETOP_TDFRIENDSELECTOR_NEXT");?></a>
                <div class="TDFriendSelector_pageNumberContainer">
                    <?=JText::_("TPL_FAMILYTREETOP_TDFRIENDSELECTOR_PAGE");?> <span id="TDFriendSelector_pageNumber">1</span> / <span id="TDFriendSelector_pageNumberTotal">1</span>
                </div>
                <a href="#" id="TDFriendSelector_buttonOK"><?=JText::_("TPL_FAMILYTREETOP_TDFRIENDSELECTOR_OK");?></a>
            </div>
        </div>
    </div>
</div>
<!-- The template to display files available for upload -->
<script id="template-upload" type="text/x-tmpl">
    {% for (var i=0, file; file=o.files[i]; i++) { %}
    <tr class="template-upload fade">
        <td class="preview"><span class="fade"></span></td>
        <td class="name"><span>{%=file.name%}</span></td>
        <td class="size"><span>{%=o.formatFileSize(file.size)%}</span></td>
        {% if (file.error) { %}
        <td class="error" colspan="2"><span class="label label-important">Error</span> {%=file.error%}</td>
        {% } else if (o.files.valid && !i) { %}
        <td>
            <div class="progress progress-success progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="bar" style="width:0%;"></div></div>
        </td>
        <td>{% if (!o.options.autoUpload) { %}
            <button class="btn btn-primary start">
                <i class="icon-upload icon-white"></i>
                <span>Start</span>
            </button>
            {% } %}</td>
        {% } else { %}
        <td colspan="2"></td>
        {% } %}
        <td>{% if (!i) { %}
            <button class="btn btn-warning cancel">
                <i class="icon-ban-circle icon-white"></i>
                <span>Cancel</span>
            </button>
            {% } %}</td>
    </tr>
    {% } %}
</script>
<!-- The template to display files available for download -->
<script id="template-download" type="text/x-tmpl">
    {% for (var i=0, file; file=o.files[i]; i++) { %}
    <tr class="template-download fade">
        {% if (file.error) { %}
        <td></td>
        <td class="name"><span>{%=file.name%}</span></td>
        <td class="size"><span>{%=o.formatFileSize(file.size)%}</span></td>
        <td class="error" colspan="2"><span class="label label-important">Error</span> {%=file.error%}</td>
        {% } else { %}

        <td class="preview">{% if (file.thumbnail_url) { %}
            <a href="#{%=file.url%}" title="{%=file.name%}" data-gallery="gallery" download="{%=file.name%}"><img src="#{%=file.thumbnail_url%}"></a>
            {% } %}</td>
        <td class="name">
            <a href="#{%=file.url%}" title="{%=file.name%}" data-gallery="{%=file.thumbnail_url&&'gallery'%}" download="{%=file.name%}">{%=file.original_name%}</a>
        </td>
        <td class="size"><span>{%=o.formatFileSize(file.size)%}</span></td>
        <td colspan="2"></td>
        {% } %}
        <td>
            <button class="btn btn-danger delete" data-type="{%=file.delete_type%}" data-url="{%=file.delete_url%}"{% if (file.delete_with_credentials) { %} data-xhr-fields='{"withCredentials":true}'{% } %}>
            <i class="icon-trash icon-white"></i>
            <span>Delete</span>
            </button>
            <input type="checkbox" name="delete" value="1" class="toggle">
        </td>
    </tr>
    {% } %}
</script>
<!-- friend selector end -->
<jdoc:include type="modules" name="debug" style="none" />
<!--<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/jquery-1.9.1.min.js"></script>-->
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/jquery-2.0.3.min.js"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/spin.min.js"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/superbrowserupdate.js"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/bootstrap.min.js"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/bootstrap-scroll-modal.js"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/tdfriendselector.js"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/fabric.all.min.js"></script>
<!-- file upload plugin files -->
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/jquery.ui.widget.js"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/tmpl.min.js"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/load-image.min.js"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/canvas-to-blob.min.js"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/jquery.iframe-transport.js"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/jquery.fileupload.js"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/jquery.fileupload-fp.js"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/jquery.fileupload-ui.js"></script>
<!--[if gte IE 8]><script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/jquery.xdr-transport.js"></script><![endif]-->
<?php if($fttUser->joyride): ?>
    <script src="<?=$this->baseurl;?>/templates/<?=$this->template;?>/js/bootstrap-joyride.js"></script>
<?php endif; ?>
<!-- uncompressed files -->
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.trees.js?<?=$script;?>"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.footer.js?<?=$script;?>"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.form.js?<?=$script;?>"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.familyline.js?<?=$script;?>"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.tabs.js?<?=$script;?>"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.usertree.js?<?=$script;?>"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.popovers.js?<?=$script;?>"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.friendselector.js?<?=$script;?>"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.this.month.js?<?=$script;?>"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.editmenu.js?<?=$script;?>"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.editor.js?<?=$script;?>"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.profile.js?<?=$script;?>"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.families.js?<?=$script;?>"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.members.js?<?=$script;?>"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.myfamily.js?<?=$script;?>"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.latest.events.js?<?=$script;?>"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.ie.placeholders.js?<?=$script;?>"></script>
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
</body>
</html>
