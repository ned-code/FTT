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
                        <li><a  familytreetop="profile" href="#"><?=JText::_('MOD_FTT_NAVBAR_PROFILE_PROFILE');?></a></li>
                        <li><a  familytreetop="languages" href="#"><?=JText::_('MOD_FTT_NAVBAR_PROFILE_LANGUAGES');?></a></li>
                        <li><a  familytreetop="facebook" href="#"><?=JText::_('MOD_FTT_NAVBAR_PROFILE_REDIRECT_TO_FACEBOOK');?></a></li>
                        <li><a  familytreetop="familytreetop" href="#">Redirect to FamilyTreeTop</a></li>
                        <li class="divider"></li>
                        <li><a  familytreetop="logout" href="<?=JRoute::_("index.php?option=com_familytreetop&task=user.logout", false);?>"><?=JText::_('MOD_FTT_NAVBAR_PROFILE_LOG_OUT');?></a></li>
                    </ul>
                </li>
            </ul>
            <?php endif; ?>
            <a class="brand" href="<?=JRoute::_("index.php?option=com_familytreetop&view=index", false); ?>">Family TreeTop</a>
            <!--
            <div  id="navProfileUser" class="nav-collapse collapse">
                <ul class="nav">
                    <li <?=($view=="myfamily")?'class="active"':''; ?> > <a href="<?=JRoute::_("index.php?option=com_familytreetop&view=myfamily", false); ?>"><?=JText::_('MOD_FTT_NAVBAR_MENU_MY_FAMILY');?></a></li>
                    <li <?=($view=="famous")?'class="active"':''; ?> ><a href="<?=JRoute::_("index.php?option=com_familytreetop&view=famous", false); ?>"><?=JText::_('MOD_FTT_NAVBAR_MENU_FAMOUS_FAMILY');?></a></li>
                    <li <?=($view=="index")?'class="active"':''; ?> ><a href="<?=JRoute::_("index.php?option=com_familytreetop&view=index", false); ?>"><?=JText::_('MOD_FTT_NAVBAR_MENU_HOME');?></a></li>
                    <li class="visible-phone"><a familytreetop="profile" href="#"><?=JText::_('MOD_FTT_NAVBAR_MENU_PROFILE');?></a></li>
                    <li class="visible-phone"><a familytreetop="about" href="#"><?=JText::_('MOD_FTT_NAVBAR_MENU_ABOUT');?></a></li>
                    <li class="visible-phone"><a familytreetop="help" href="#"><?=JText::_('MOD_FTT_NAVBAR_MENU_HELP');?></a></li>
                    <li class="visible-phone"><a familytreetop="logout" href="#"><?=JText::_('MOD_FTT_NAVBAR_MENU_LOG_OUT');?></a></li>
                </ul>
            </div>
            -->
        </div>
    </div>
</div>
<script>
    $FamilyTreeTop.bind(function($){
        'use strict';
        var $fn = {
            profile: function(object){
                var gedcom_id =  $FamilyTreeTop.mod('usertree').usermap().gedcom_id;
                var user =  $FamilyTreeTop.mod('usertree').user(gedcom_id);
                $FamilyTreeTop.mod('profile').render({
                    target: object,
                    gedcom_id: gedcom_id,
                    object: user
                });
            },
            languages: function(object){
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
            facebook:function(object){
                window.location = $FamilyTreeTop.app.data.link;
            },
            familytreetop:function(object){
                window.top.location = $FamilyTreeTop.rooturl;
            },
            logout: function(object){
                $FamilyTreeTop.fn.ajax('user.logout', null, function(response){
                    if(FB.getAuthResponse() != null){
                        FB.logout(function(r){
                            window.location = response.url;
                        });
                    } else {
                        window.location = response.url;
                    }
                });
            }
        }

        if(window!=window.top){
            $('#profileUser ul.dropdown-menu li a[familytreetop="facebook"]').remove();
        } else {
            $('#profileUser ul.dropdown-menu li a[familytreetop="familytreetop"]').remove();
        }

        $('#profileUser ul.dropdown-menu li a').click(function(){
            var id = $(this).attr('familytreetop');
            var a = $(this);
            switch(id){
                case "profile":
                        $fn.profile(this);
                    break;

                case "languages":
                        $fn.languages(this);
                    break;

                case "facebook":
                        $fn.facebook(this);
                    break;

                case "familytreetop":
                        $fn.familytreetop(this);
                    break;

                case "logout":
                        $fn.logout(this);
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