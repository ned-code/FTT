<?php
defined('_JEXEC') or die;

// Getting params from template
$params = JFactory::getApplication()->getTemplate(true)->params;

$app = JFactory::getApplication();
$doc = JFactory::getDocument();

$doc->addStyleSheet('templates/'.$this->template.'/css/bootstrap.min.css');
$doc->addStyleSheet('templates/'.$this->template.'/css/bootstrap-responsive.min.css');

// Add current user information
$user = JFactory::getUser();
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php echo $this->language; ?>" lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>">
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/holder.js"></script>
    <script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.js"></script>
	<jdoc:include type="head" />
	<!--[if lt IE 9]>
		<script src="<?php echo $this->baseurl ?>/media/jui/js/html5.js"></script>
	<![endif]-->
</head>
<body>
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
                    <div class="span4" style="inline-block">
                        <img class="media-object" data-src="template/familytreetop/js/holder.js/100x100">
                    </div>
                    <div class="span8" style="inline-block">
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
                <li familytreetop="delete"><a href="#">Delete</a></li>
            </ul>
        </div>
    </div>

    <div id="modal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
            <h3 id="modalLabel"></h3>
        </div>
        <div style="max-height: none;" class="modal-body">
            <form action="<?=JRoute::_("index.php?option=com_familytreetop&task.editor.save", false);?>">
                <div class="row-fluid">
                    <div class="span3 text-center">
                        <img class="img-polaroid" data-src="template/familytreetop/js/holder.js/100x100">
                        <div style="text-align: center; overflow: hidden;">
                            <button familytreetop="upload" class="btn btn-mini">Upload</button>
                            <input type="file" name="file" id="file" size="1" style="margin-top: -50px; margin-left:-410px; -moz-opacity: 0; filter: alpha(opacity=0); opacity: 0; font-size: 150px; height: 100px;">
                        </div>
                    </div>
                    <div class="span9">
                        <div class="row-fluid">
                            <div class="span6">
                                <label for="gender"><small>Gender</small></label>
                                <select class="span12" id="gender" name="gender">
                                    <option value="1">Male</option>
                                    <option value="0">Female</option>
                                </select>
                            </div>
                            <div class="span6">
                                <label for="living"><small>Living</small></label>
                                <select class="span12" id="living" name="living">
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                </select>
                            </div>
                        </div>
                        <div class="row-fluid">
                            <div class="span6">
                                <label for="firstName"><small>First Name</small></label>
                                <div class="controls">
                                    <input class="span12" name="first_name" type="text" id="firstName" placeholder="First Name">
                                </div>
                            </div>
                            <div class="span6">
                                <label for="middleName"><small>Middle Name</small></label>
                                <div class="controls">
                                    <input class="span12" name="middle_name" type="text" id="middleName" placeholder="Middle Name">
                                </div>
                            </div>
                        </div>
                        <div class="row-fluid">
                            <div class="span6">
                                <label for="firstName"><small>Last Name</small></label>
                                <div class="controls">
                                    <input class="span12" name="last_name" type="text" id="lastName" placeholder="Last Name">
                                </div>
                            </div>
                            <div class="span6">
                                <label for="knowAs"><small>Know As</small></label>
                                <div class="controls">
                                    <input class="span12" name="know_as" type="text" id="knowAs" placeholder="Know As">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row-fluid">
                    <div class="span12">
                        <p>
                            Birthday:
                        </p>
                    </div>
                </div>
                <div class="row-fluid">
                    <div class="span12">
                        <select class="span2" name="b_day">
                            <option value="0">Day</option>
                        </select>
                        <select class="span4" name="b_month">
                            <option value="0">Month</option>
                        </select>
                        <input class="span4" type="text" name="b_year" placeholder="Year">

                    </div>
                </div>
                <div class="row-fluid">
                    <div class="span12">
                        <input class="span4" type="text" name="b_city"  placeholder="City">
                        <input class="span4" type="text" name="b_state" placeholder="State">
                        <input class="span4" type="text" name="b_country" placeholder="Country">
                    </div>
                </div>

                <div class="row-fluid">
                    <div class="span12">
                        <p>
                            Deathday:
                        </p>
                    </div>
                </div>
                <div class="row-fluid">
                    <div class="span12">
                        <select class="span2" name="d_day">
                            <option value="0">Day</option>
                        </select>
                        <select class="span4" name="d_month">
                            <option value="0">Month</option>
                        </select>
                        <input class="span4" type="text" name="d_year" placeholder="Year">

                    </div>
                </div>
                <div class="row-fluid">
                    <div class="span12">
                        <input class="span4" type="text" name="d_city"  placeholder="City">
                        <input class="span4" type="text" name="d_state" placeholder="State">
                        <input class="span4" type="text" name="d_country" placeholder="Country">
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
            <button familytreetop="submit" class="btn btn-primary">Save changes</button>
        </div>
    </div>

</div>
<jdoc:include type="modules" name="debug" style="none" />
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/jquery-1.9.1.min.js"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/bootstrap.min.js"></script>
<!-- uncompressed files -->
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.usertree.js"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.popovers.js"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.editmenu.js"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.editor.js"></script>
<script>
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
</script>
</body>
</html>
