<?php

defined('_JEXEC') or die;
// Getting params from template
$params = JFactory::getApplication()->getTemplate(true)->params;

$app = JFactory::getApplication();
$doc = JFactory::getDocument();

$doc->addStyleSheet('templates/'.$this->template.'/css/bootstrap.min.css');
$doc->addStyleSheet('templates/'.$this->template.'/css/bootstrap.fix.css');
$doc->addStyleSheet('templates/'.$this->template.'/css/bootstrap-responsive.min.css');
$doc->addStyleSheet('templates/'.$this->template.'/css/csstreeview.css');
$doc->addStyleSheet('templates/'.$this->template.'/css/csstreeview.fix.css');

// Add current user information
$user = JFactory::getUser();
// Add familytreetop settings
$settings = FamilyTreeTopSettingsHelper::getInstance()->get();
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php echo $this->language; ?>" lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>">
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
    $FamilyTreeTop.userString = '<?=json_encode(FamilyTreeTopUserHelper::getInstance()->get()); ?>';
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
    <div id="popover">
        <div class="row-fluid">
            <div class="span12">
                <div>
                    <div class="span4">
                        <img class="media-object" data-src="template/familytreetop/js/holder.js/100x100">
                    </div>
                    <div class="span8">
                        <ul class="unstyled">
                            <li><small><strong>First Name</strong>: <span></span></small></li>
                            <li><small><strong>Middle Name</strong>: <span></span></small></li>
                            <li><small><strong>Last Name</strong>: <span></span></small></li>
                            <li><small><strong>Know As</strong>: <span></span></small></li>
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
                <li familytreetop="edit"><a href="#">Edit Profile</a></li>
                <li class="divider"></li>
                <li familytreetop="addParent"><a href="#">Add Parent</a></li>
                <li familytreetop="addSibling"><a href="#">Add Sibling</a></li>
                <li familytreetop="addSpouse"><a href="#">Add Spouse</a></li>
                <li familytreetop="addChild"><a href="#">Add Child</a></li>
                <li class="divider"></li>
                <li familytreetop="delete"><a href="#">Delete</a></li>
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
            <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
            <button familytreetop="submit" class="btn btn-primary">Save changes</button>
        </div>
    </div>

    <div id="editorTabs">
        <ul class="nav nav-tabs">
            <li class="active"><a href="#" data-toggle="tab">Profile</a></li>
            <li><a href="#" data-toggle="tab">Unions</a></li>
            <li><a href="#" data-toggle="tab">Media</a></li>
            <li><a href="#" data-toggle="tab">Options</a></li>
        </ul>
        <div class="tab-content">
            <div class="tab-pane active" id="_1_"></div>
            <div class="tab-pane" id="_2_"></div>
            <div class="tab-pane" id="_3_"></div>
            <div class="tab-pane" id="_4_"></div>
        </div>
    </div>

    <form id="formEditUnions">
        <fieldset>
            <legend>Union</legend>
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
                        <option value="0">Month</option>
                        <option value="1">January</option>
                        <option value="2">February</option>
                        <option value="3">March</option>
                        <option value="4">April</option>
                        <option value="5">May</option>
                        <option value="6">June</option>
                        <option value="7">July</option>
                        <option value="8">August</option>
                        <option value="9">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                    </select>
                    <select familytreetop="days" class="span2" name="editUnion[day]">
                        <option value="0">Day</option>
                    </select>
                    <input familytreetop="year" class="span4" type="text" name="editUnion[year]" placeholder="Year">
                    <input class="span1" type="checkbox" name="editUnion[exist]" ><small>Unknown</small>
                </div>
            </div>
            <div familytreetop="union-event-place" class="row-fluid">
                <div class="span12">
                    <input class="span4" type="text" name="editUnion[city]"  placeholder="City">
                    <input class="span4" type="text" name="editUnion[state]" placeholder="State">
                    <input class="span4" type="text" name="editUnion[country]" placeholder="Country">
                </div>
            </div>
        </fieldset>
    </form>

    <form id="formEditProfile">
        <div class="row-fluid">
            <div familytreetop="avatar" class="span3 text-center">
                <img class="img-polaroid" data-src="template/familytreetop/js/holder.js/100x100">
                <!--
                <div style="text-align: center; overflow: hidden;">
                    <button familytreetop="upload" class="btn btn-mini">Upload</button>
                    <input type="file" name="editProfile[file]" id="editProfile[file]" size="1" style="margin-top: -50px; margin-left:-410px; -moz-opacity: 0; filter: alpha(opacity=0); opacity: 0; font-size: 150px; height: 100px;">
                </div>
                -->
            </div>
            <div class="span9">
                <div class="row-fluid">
                    <div familytreetop="gender" class="span6">
                        <label for="editProfile[gender]"><small>Gender</small></label>
                        <select class="span12" id="editProfile[gender]" name="editProfile[gender]">
                            <option value="1">Male</option>
                            <option value="0">Female</option>
                        </select>
                    </div>
                    <div familytreetop="living" class="span6">
                        <label for="editProfile[living]"><small>Living</small></label>
                        <select class="span12" id="editProfile[living]" name="editProfile[living]">
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                        </select>
                    </div>
                </div>
                <div class="row-fluid">
                    <div familytreetop="firstName" class="span6">
                        <label for="editProfile[firstName]"><small>First Name</small></label>
                        <div class="controls">
                            <input class="span12" name="editProfile[first_name]" type="text" id="editProfile[firstName]" placeholder="First Name">
                        </div>
                    </div>
                    <div familytreetop="middleName" class="span6">
                        <label for="editProfile[middleName]"><small>Middle Name</small></label>
                        <div class="controls">
                            <input class="span12" name="editProfile[middle_name]" type="text" id="editProfile[middleName]" placeholder="Middle Name">
                        </div>
                    </div>
                </div>
                <div class="row-fluid">
                    <div familytreetop="lastName" class="span6">
                        <label for="editProfile[firstName]"><small>Last Name</small></label>
                        <div class="controls">
                            <input class="span12" name="editProfile[last_name]" type="text" id="editProfile[lastName]" placeholder="Last Name">
                        </div>
                    </div>
                    <div familytreetop="knowAs" class="span6">
                        <label for="editProfile[knowAs]"><small>Know As</small></label>
                        <div class="controls">
                            <input class="span12" name="editProfile[know_as]" type="text" id="editProfile[knowAs]" placeholder="Know As">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row-fluid">
            <div familytreetop="birthday" class="span12">
                <p>
                    Birthday:
                </p>
            </div>
        </div>
        <div class="row-fluid">
            <div familytreetop="birthday" class="span12">
                <select familytreetop="months" class="span4" name="editProfile[b_month]">
                    <option value="0">Month</option>
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                </select>
                <select familytreetop="days" class="span2" name="editProfile[b_day]">
                    <option value="0">Day</option>
                </select>
                <input familytreetop="year" class="span4" type="text" name="editProfile[b_year]" placeholder="Year">
                <input class="span1" type="checkbox" name="editProfile[b_exist]" ><small>Unknown</small>
            </div>
        </div>
        <div familytreetop="birthday" class="row-fluid">
            <div class="span12">
                <input class="span4" type="text" name="editProfile[b_city]"  placeholder="City">
                <input class="span4" type="text" name="editProfile[b_state]" placeholder="State">
                <input class="span4" type="text" name="editProfile[b_country]" placeholder="Country">
            </div>
        </div>

        <div class="row-fluid">
            <div familytreetop="deathday" class="span12">
                <p>
                    Deathday:
                </p>
            </div>
        </div>
        <div class="row-fluid">
            <div familytreetop="deathday" class="span12">
                <select familytreetop="months" class="span4" name="editProfile[d_month]">
                    <option value="0">Month</option>
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                </select>
                <select familytreetop="days" class="span2" name="editProfile[d_day]">
                    <option value="0">Day</option>
                </select>
                <input familytreetop="year" class="span4" type="text" name="editProfile[d_year]" placeholder="Year">
                <input class="span1" type="checkbox" name="editProfile[d_exist]" ><small>Unknown</small>
            </div>
        </div>
        <div familytreetop="deathday" class="row-fluid">
            <div class="span12">
                <input class="span4" type="text" name="editProfile[d_city]"  placeholder="City">
                <input class="span4" type="text" name="editProfile[d_state]" placeholder="State">
                <input class="span4" type="text" name="editProfile[d_country]" placeholder="Country">
            </div>
        </div>
    </form>

    <div id="families">
        <div familytreetop="home" style="position:absolute; top:0; right: 0; cursor: pointer;"><i class="icon-home"></i></div>
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
<jdoc:include type="modules" name="debug" style="none" />
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/jquery-1.9.1.min.js"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/bootstrap.min.js"></script>
<!-- uncompressed files -->
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.form.js"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.tabs.js"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.usertree.js"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.popovers.js"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.editmenu.js"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.editor.js"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.families.js"></script>
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
