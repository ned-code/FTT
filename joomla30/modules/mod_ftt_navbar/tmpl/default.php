<?php
defined('_JEXEC') or die;
$session = JFactory::getSession();
$user = FamilyTreeTopUserHelper::getInstance()->get();
$gedcom = GedcomHelper::getInstance();
if($session->get('famous')){
    $ind = $gedcom->individuals->getFromDb($user->tree_id, $user->gedcom_id);
} else if(!empty($user->gedcom_id)){
    $ind = $gedcom->individuals->get($user->gedcom_id);
} else {
    $ind = false;
}
?>
<div class="navbar navbar-inverse">
    <div style="border-radius: 0;" class="navbar-inner">
        <div class="container">
            <button type="button" class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <?php if($user->facebook_id != 0 && $ind): ?>
            <ul id="profileUser" class="nav pull-right hidden-phone">
                <li><img style="margin: 4px;" src="https://graph.facebook.com/<?=$user->facebook_id;?>/picture?width=30&height=30"/></li>
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown"><?=$ind->name();?> <b class="caret"></b></a>
                    <ul class="dropdown-menu">
                        <li><a  familytreetop="profile" href="#">Profile</a></li>
                        <li><a  familytreetop="languages" href="#">Languages</a></li>
                        <li><a  familytreetop="facebook" href="#">Redirect to Facebook</a></li>
                        <li class="divider"></li>
                        <li><a  familytreetop="logout" href="<?=JRoute::_("index.php?option=com_familytreetop&task=user.logout", false);?>">Log Out</a></li>
                    </ul>
                </li>
            </ul>
            <?php endif; ?>
            <a class="brand" href="<?=JRoute::_("index.php?option=com_familytreetop&view=index", false); ?>">Family TreeTop</a>
            <div  id="navProfileUser" class="nav-collapse collapse">
                <ul class="nav">
                    <li <?=($view=="myfamily")?'class="active"':''; ?> > <a href="<?=JRoute::_("index.php?option=com_familytreetop&view=myfamily", false); ?>">My Family</a></li>
                    <li <?=($view=="famous")?'class="active"':''; ?> ><a href="<?=JRoute::_("index.php?option=com_familytreetop&view=famous", false); ?>">Famous Family</a></li>
                    <li <?=($view=="index")?'class="active"':''; ?> ><a href="<?=JRoute::_("index.php?option=com_familytreetop&view=index", false); ?>">Home</a></li>
                    <li class="visible-phone"><a familytreetop="profile" href="#">Profile</a></li>
                    <li class="visible-phone"><a familytreetop="about" href="#">About</a></li>
                    <li class="visible-phone"><a familytreetop="help" href="#">Help</a></li>
                    <li class="visible-phone"><a familytreetop="logout" href="#">Logout</a></li>
                </ul>
            </div>
        </div>
    </div>
</div>
<script>
    $FamilyTreeTop.bind(function($){
        'use strict';
        var $fn = {
            profile: function(){
                $FamilyTreeTop.mod('editor').render($FamilyTreeTop.mod('usertree').usermap().gedcom_id);
            },
            languages: function(){
                var langs = $.parseJSON($FamilyTreeTop.languagesString), ul = $('<ul></ul>'), li, prop, box = $('#modal').clone();
                $(box).find('#modalLabel').text('Languages');
                for(prop in langs){
                    if(!langs.hasOwnProperty(prop)) continue;
                    li = $('<li><a familytreetop-data="'+langs[prop].lang_code+'" href="#">'+langs[prop].title+'</a></li>');
                    $(ul).append(li);
                }
                $(box).find('.modal-body').append(ul);
                $(box).modal();

                $(ul).find('li a').click(function(){
                    var local = $(this).attr('familytreetop-data');
                    $FamilyTreeTop.fn.ajax('languages.setLanguage', {local: local}, function(response){
                        console.log(response);
                        $(box).modal('hide');
                        window.location.reload();
                    });
                    return false;
                });
            },
            logout: function(){
                if(FB.getAuthResponse() != null){
                    FB.logout(function(r){
                        window.location = $(a).attr('href');
                    });
                } else {
                    window.location = $(a).attr('href');
                }
            }
        }

        $('#profileUser ul.dropdown-menu li a').click(function(){
            var id = $(this).attr('familytreetop');
            var a = $(this);
            switch(id){
                case "profile":
                        $fn.profile();
                    break;

                case "languages":
                        $fn.languages();
                    break;

                case "logout":
                        $fn.logout();
                    break;

                default: return false;
            }
            return false;
        });

        $('#navProfileUser ul.nav li a').click(function(){
            var id = $(this).attr('familytreetop');
            var a = $(this);
            switch(id){
                case "profile":
                    $fn.profile();
                    break;

                case "logout":
                    $fn.logout();
                    break;
            }
        });
    });
</script>