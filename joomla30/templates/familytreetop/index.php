<?php
defined('_JEXEC') or die;
// Getting params from template
$params = JFactory::getApplication()->getTemplate(true)->params;

$app = JFactory::getApplication();
$doc = JFactory::getDocument();

$doc->addStyleSheet('templates/'.$this->template.'/css/bootstrap.min.css');
$doc->addStyleSheet('templates/'.$this->template.'/css/bootstrap.fix.css');
$doc->addStyleSheet('templates/'.$this->template.'/css/bootstrap-responsive.min.css');
$doc->addStyleSheet('templates/'.$this->template.'/css/bootstrap.icon-large.min.css');
$doc->addStyleSheet('templates/'.$this->template.'/css/bootstrap-scroll-modal.css');
$doc->addStyleSheet('templates/'.$this->template.'/css/jquery.fileupload-ui.css');
$doc->addStyleSheet('templates/'.$this->template.'/css/csstreeview.css');
$doc->addStyleSheet('templates/'.$this->template.'/css/csstreeview.fix.css');
$doc->addStyleSheet('templates/'.$this->template.'/css/tdfriendselector.css');
$doc->addStyleSheet('templates/'.$this->template.'/css/familytreetop.css');

// Add current user information
$user = JFactory::getUser();
// Add familytreetop settings
$settings = FamilyTreeTopSettingsHelper::getInstance()->get();
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php echo $this->language; ?>" lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>">
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <noscript><link rel="stylesheet" href="templates/<?=$this->template;?>/css/jquery.fileupload-ui-noscript.css"></noscript>
    <script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/holder.js"></script>
    <script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/excanvas.js"></script>
    <script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/jit.js"></script>
    <script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.js"></script>
	<jdoc:include type="head" />
	<!--[if lt IE 9]>
		<script src="<?php echo $this->baseurl ?>/media/jui/js/html5.js"></script>
	<![endif]-->
</head>
<body>
<script>
    $FamilyTreeTop.app.config.appId = '<?=$settings->facebook_app_id->value;?>';
    $FamilyTreeTop.app.permissions = '<?=$settings->facebook_permission->value;?>';
    $FamilyTreeTop.app.data = '<?=json_encode(FacebookHelper::getInstance()->data); ?>';

    $FamilyTreeTop.users = '<?=GedcomHelper::getInstance()->getTreeUsers(true, true);?>';

    $FamilyTreeTop.userString = '<?=json_encode(FamilyTreeTopUserHelper::getInstance()->get()); ?>';

    $FamilyTreeTop.template = '<?=$this->template?>';

    $FamilyTreeTop.currenturl = '<?=JUri::current();?>';
    $FamilyTreeTop.rooturl = '<?=substr(JUri::base(), 0, strlen(JUri::base()) - 1);?>';
    $FamilyTreeTop.baseurl = '<?=$this->baseurl;?>';
    $FamilyTreeTop.templateurl = '<?=$this->baseurl;?>/templates/<?=$this->template;?>';

    $FamilyTreeTop.languagesString = '<?=LanguagesHelper::get()?>';
</script>
<div id="fb-root"></div>
<jdoc:include type="modules" name="facebook-sdk" style="none" />
<jdoc:include type="modules" name="navbar" style="none" />
<div class="container">
    <div class="row">
        <div class="span12">
            <jdoc:include type="message" />
            <jdoc:include type="component" />
            <jdoc:include type="modules" name="footer" style="none" />
        </div>
    </div>
</div>
<div id="familytreetop-root" style="display:none;">

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
        <div data-familytreetop="SELF"><?=JText::_("TPL_FAMILYTREETOP_SELF");?></div>
        <div data-familytreetop="SPOUSE"><?=JText::_("TPL_FAMILYTREETOP_SPOUSE");?></div>
        <div data-familytreetop="MOTHER"><?=JText::_("TPL_FAMILYTREETOP_MOTHER");?></div>
        <div data-familytreetop="FATHER"><?=JText::_("TPL_FAMILYTREETOP_FATHER");?></div>
        <div data-familytreetop="DAUGHTER"><?=JText::_("TPL_FAMILYTREETOP_DAUGHTER");?></div>
        <div data-familytreetop="SON"><?=JText::_("TPL_FAMILYTREETOP_SON");?></div>
        <div data-familytreetop="SISTER"><?=JText::_("TPL_FAMILYTREETOP_SISTER");?></div>
        <div data-familytreetop="BROTHER"><?=JText::_("TPL_FAMILYTREETOP_BROTHER");?></div>
        <div data-familytreetop="COUSIN"><?=JText::_("TPL_FAMILYTREETOP_COUSIN");?></div>
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

    <div id="popover">
        <div class="row-fluid">
            <div class="span12">
                <div>
                    <div class="span4 familytreetop-avatar">
                        <img class="media-object" data-src="template/familytreetop/js/holder.js/100x100">
                    </div>
                    <div class="span8">
                        <ul class="unstyled">
                            <li data-familytreetop="first_name"><small><strong><?=JText::_("TPL_FAMILYTREETOP_FIRST_NAME");?></strong>: <span></span></small></li>
                            <li data-familytreetop="middle_name"><small><strong><?=JText::_("TPL_FAMILYTREETOP_MIDDLE_NAME");?></strong>: <span></span></small></li>
                            <li data-familytreetop="last_name"><small><strong><?=JText::_("TPL_FAMILYTREETOP_LAST_NAME");?></strong>: <span></span></small></li>
                            <li data-familytreetop="know_as"><small><strong><?=JText::_("TPL_FAMILYTREETOP_KNOW_AS");?></strong>: <span></span></small></li>
                            <li data-familytreetop="relation"><small><strong><?=JText::_("TPL_FAMILYTREETOP_RELATION");?></strong>: <span></span></small></li>
                            <li data-familytreetop="connection"><small><strong><?=JText::_("TPL_FAMILYTREETOP_CONNECTION");?></strong>: <span></span></small></li>
                        </ul>
                    </div>
                </div>
                <div></div>
            </div>
        </div>
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
                <li data-familytreetop-devider="2" class="divider"></li>
                <li familytreetop="sendInvite"><a href="#"><?=JText::_("TPL_FAMILYTREETOP_SEND_INVITE");?></a></li>
            </ul>
        </div>
    </div>

    <div id="modal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
            <h3 id="modalLabel"></h3>
        </div>
        <div class="modal-body">
        </div>
        <div class="modal-footer">
            <button class="btn" data-dismiss="modal" aria-hidden="true"><?=JText::_("TPL_FAMILYTREETOP_MODAL_CLOSE");?></button>
            <button familytreetop="submit" class="btn btn-primary"><?=JText::_("TPL_FAMILYTREETOP_MODAL_SAVE_CHANGES");?></button>
        </div>
    </div>

    <div id="profile" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="profileLabel" aria-hidden="true">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
            <h3 id="profileLabel"></h3>
        </div>
        <div class="modal-body">
            <div data-familytreetop-profile="facebook" class="row-fluid">
                <div class="span12">

                </div>
            </div>
            <div data-familytreetop-profile="about" class="row-fluid">
                <div class="span12">
                    <div class="well">
                        <fieldset>
                            <legend><?=JText::_("TPL_FAMILYTREETOP_ABOUT");?></legend>
                            <div class="row-fluid">
                                <div  data-familytreetop="avatar" class="span2"></div>
                                <div class="span10">
                                    <ul class="unstyled">
                                        <li><small><strong><?=JText::_("TPL_FAMILYTREETOP_FIRST_NAME");?></strong>: <span></span></small></li>
                                        <li><small><strong><?=JText::_("TPL_FAMILYTREETOP_MIDDLE_NAME");?></strong>: <span></span></small></li>
                                        <li><small><strong><?=JText::_("TPL_FAMILYTREETOP_LAST_NAME");?></strong>: <span></span></small></li>
                                        <li><small><strong><?=JText::_("TPL_FAMILYTREETOP_KNOW_AS");?></strong>: <span></span></small></li>
                                    </ul>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                </div>
            </div>
            <div data-familytreetop-profile="relation" class="row-fluid">
                <div class="span12">
                    <div class="well">
                        <fieldset>
                            <legend><?=JText::_("TPL_FAMILYTREETOP_RELATION_MAP");?></legend>
                        </fieldset>
                    </div>
                </div>
            </div>
            <div data-familytreetop-profile="family" class="row-fluid">
                <div class="span12">
                    <div class="well">
                        <fieldset>
                            <legend><?=JText::_("TPL_FAMILYTREETOP_FAMILY");?></legend>
                        </fieldset>
                    </div>
                </div>
            </div>
            <div data-familytreetop-profile="photos" class="row-fluid">
                <div class="span12">
                    <div class="well">
                        <fieldset>
                            <legend><?=JText::_("TPL_FAMILYTREETOP_PHOTOS");?></legend>
                            <ul class="unstyled inline"></ul>
                        </fieldset>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="editorTabs">
        <ul class="nav nav-tabs">
            <li class="active"><a href="#" data-toggle="tab"><?=JText::_("TPL_FAMILYTREETOP_EDITOR_TABS_PROFILE");?></a></li>
            <li><a href="#" data-toggle="tab"><?=JText::_("TPL_FAMILYTREETOP_EDITOR_TABS_UNIONS");?></a></li>
            <li><a href="#" data-toggle="tab"><?=JText::_("TPL_FAMILYTREETOP_EDITOR_TABS_MEDIA");?></a></li>
            <li><a href="#" data-toggle="tab"><?=JText::_("TPL_FAMILYTREETOP_EDITOR_TABS_OPTIONS");?></a></li>
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
            <div class="span6">
                <span class="btn btn-success fileinput-button">
                    <i class="icon-plus icon-white"></i>
                    <span><?=JText::_("TPL_FAMILYTREETOP_EDITOR_TABS_MEDIA_ADD_FILES");?></span>
                    <input type="file" name="files[]" multiple="">
                </span>
                <span class="btn btn-info familytreetop-button set-avatar" style="display: none;">
                    <i class="icon-ok-sign icon-white"></i>
                    <span><?=JText::_("TPL_FAMILYTREETOP_EDITOR_TABS_MEDIA_SET_AVATAR");?></span>
                </span>
                <span class="btn btn-danger familytreetop-button unset-avatar" style="display: none;">
                    <i class="icon-remove-sign icon-white"></i>
                    <span><?=JText::_("TPL_FAMILYTREETOP_EDITOR_TABS_MEDIA_UNSET_AVATAR");?></span>
                </span>
                <span class="btn btn-danger familytreetop-button delete" style="display: none;">
                    <i class="icon-trash icon-white"></i>
                    <span><?=JText::_("TPL_FAMILYTREETOP_EDITOR_TABS_MEDIA_DELETE");?></span>
                </span>
            </div>
            <div class="span6 fileupload-progress fade">
                <div class="progress progress-success progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100">
                    <div class="bar" style="width:0%;"></div>
                </div>
                <div class="progress-extended">&nbsp;</div>
            </div>
        </div>
        <div class="fileupload-loading"></div>
        <br>
        <table role="presentation" class="table table-striped">
            <tbody class="files" data-toggle="modal-gallery" data-target="#modal-gallery"></tbody>
        </table>
    </form>

    <form id="formEditUnions">
        <fieldset>
            <legend><?=JText::_("TPL_FAMILYTREETOP_EDITOR_TABS_UNIONS_UNIONS");?></legend>
            <input style="display:none;" familytreetop="family_id" name="editUnion[family_id]" type="text" class="hidden" />
            <div class="row-fluid">
                <div class="span6">
                    <div familytreetop="sircar" class="well">
                        <fieldset>
                            <legend></legend>
                            <div class="row-fluid">
                                <div class="span6"><img class="img-polaroid" data-src="template/familytreetop/js/holder.js/100x100"></div>
                                <div class="span6"></div>
                            </div>
                        </fieldset>
                    </div>
                </div>
                <div class="span6">
                    <div familytreetop="spouse" class="well">
                        <fieldset>
                            <legend></legend>
                            <div class="row-fluid">
                                <div class="span6"><img class="img-polaroid" data-src="template/familytreetop/js/holder.js/100x100"></div>
                                <div class="span6"></div>
                            </div>
                        </fieldset>
                    </div>
                </div>
            </div>
            <div class="row-fluid">
                <div familytreetop="union-event-date" class="span12">
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
                    <input familytreetop="year" class="span4" type="text" name="editUnion[year]" placeholder="<?=JText::_("TPL_FAMILYTREETOP_YEAR");?>">
                    <input familytreetop="unknown" class="span1" type="checkbox" name="editUnion[unknown]" ><small><?=JText::_("TPL_FAMILYTREETOP_UNKNOWN");?></small>
                </div>
            </div>
            <div familytreetop="union-event-place" class="row-fluid">
                <div class="span12">
                    <input familytreetop="city" class="span4" type="text" name="editUnion[city]"  placeholder="<?=JText::_("TPL_FAMILYTREETOP_CITY");?>">
                    <input familytreetop="state" class="span4" type="text" name="editUnion[state]" placeholder="<?=JText::_("TPL_FAMILYTREETOP_STATE");?>">
                    <input familytreetop="country" class="span4" type="text" name="editUnion[country]" placeholder="<?=JText::_("TPL_FAMILYTREETOP_COUNTRY");?>">
                </div>
            </div>
        </fieldset>
    </form>

    <form id="formEditProfile">
        <div class="row-fluid">
            <div familytreetop="avatar" class="span3 text-center">
                <img class="img-polaroid" data-src="template/familytreetop/js/holder.js/100x100">
            </div>
            <div class="span9">
                <div class="row-fluid">
                    <div familytreetop="gender" class="span6">
                        <label for="editProfile[gender]"><small><?=JText::_("TPL_FAMILYTREETOP_GENDER");?></small></label>
                        <select class="span12" id="editProfile[gender]" name="editProfile[gender]">
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
                <input class="span1" type="checkbox" name="editProfile[b_exist]" ><small><?=JText::_("TPL_FAMILYTREETOP_UNKNOWN");?></small>
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
                <input class="span1" type="checkbox" name="editProfile[d_exist]" ><small><?=JText::_("TPL_FAMILYTREETOP_UNKNOWN");?></small>
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

    <div id="familiesHide">
        <div familytreetop="home" style="position:absolute; top:0; right: 0; cursor: pointer;"><i class="icon-large icon-home"></i></div>
        <div class="parent-box" style="max-width: 160px;">
            <div style="position:relative;">
                <img class="img-polaroid" data-src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/holder.js/150x150">
            </div>
            <div class="text-center"></div>
            <div class="text-center"></div>
        </div>
        <div class="child-box" style="max-width: 110px;">
            <div>
                <img class="img-polaroid" data-src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/holder.js/100x100">
            </div>
            <div class="text-center"></div>
            <div class="text-center"></div>
        </div>
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
                <p><?=JText::_("TPL_FAMILYTREETOP_TDFRIENDSELECTOR_INVITE_TO_APP");?></p>
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
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/jquery-1.9.1.min.js"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/bootstrap.min.js"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/bootstrap-scroll-modal.js"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/tdfriendselector.js"></script>
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
<!-- uncompressed files -->
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.form.js"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.familyline.js"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.tabs.js"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.usertree.js"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.popovers.js"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.friendselector.js"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.editmenu.js"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.editor.js"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.profile.js"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.families.js"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.members.js"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.latest.events.js"></script>
<script>
    if(!$FamilyTreeTop.app.config.appId){
        console.log('Facebook App Id doesn\'t exist');
    } else {
        window.fbAsyncInit = function() {
            // init the FB JS SDK
            FB.init($FamilyTreeTop.app.config);
            FB.getLoginStatus(function(response){
                $FamilyTreeTop.init();
            });
        };
        (function(d, debug){
            var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement('script'); js.id = id; js.async = true;
            js.src = "//connect.facebook.net/en_US/all" + (debug ? "/debug" : "") + ".js";
            ref.parentNode.insertBefore(js, ref);
        }(document, /*debug*/ false));
    }
</script>



</body>
</html>
