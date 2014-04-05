<?php
defined('_JEXEC') or die;
$settings = FamilyTreeTopSettingsHelper::getInstance()->get();
$template = $settings->_template->value;
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
$navbar_name = ($template == "familytreetop")?"Family TreeTop":"MyNativeRoots";
?>
<div class="navbar-familytreetop">
    <nav class="navbar navbar-inverse familytreetop-nav" role="navigation">
        <div class="container-fluid">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <?php if($template == "familytreetop"): ?>
                    <a style="font-size:24px; color: white;text-shadow: none;" class="navbar-brand" familytreetop-link="familytreetop" href="<?=JRoute::_("index.php?option=com_familytreetop&view=index", false); ?>"><?=$navbar_name;?></i></a>
                <?php else: ?>
                    <a style="font-size:24px; color: white;text-shadow: none;" class="navbar-brand" familytreetop-link="familytreetop" href="<?=JRoute::_("index.php?option=com_familytreetop&view=index", false); ?>"><i class="fa fa-leaf"></i> <?=$navbar_name;?></a>
                <?php endif ?>
            </div>
            <!-- Collect the nav links, forms, and other content for toggling -->
            <?php if($user->facebook_id != 0 && $ind): ?>
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul id="profileUser"  class="nav navbar-nav navbar-right">
                    <li><img style="margin: 4px;" src="https://graph.facebook.com/<?=$user->facebook_id;?>/picture?width=30&height=30"/></li>
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" style="color: white;text-shadow: none;" data-toggle="dropdown"><?=$ind->name();?> <b class="caret"></b></a>
                        <ul class="dropdown-menu">
                            <li><a  familytreetop="profile" href="#"><?=JText::_('MOD_FTT_NAVBAR_PROFILE_PROFILE');?></a></li>
                            <?php if($template == "familytreetop"): ?><li><a  familytreetop="languages" href="#"><?=JText::_('MOD_FTT_NAVBAR_PROFILE_LANGUAGES');?></a></li><?php endif; ?>
                            <li><a  familytreetop="facebook" href="#"><?=JText::_('MOD_FTT_NAVBAR_PROFILE_REDIRECT_TO_FACEBOOK');?></a></li>
                            <li><a  familytreetop="familytreetop" href="#"><?=JText::_('MOD_FTT_NAVBAR_PROFILE_REDIRECT_TO_FAMILYTREETOP');?></a></li>
                            <li class="divider"></li>
                            <li><a  familytreetop="logout" href="<?=JRoute::_("index.php?option=com_familytreetop&task=user.logout", false);?>"><?=JText::_('MOD_FTT_NAVBAR_PROFILE_LOG_OUT');?></a></li>
                        </ul>
                    </li>
                </ul>
            </div><!-- /.navbar-collapse -->
            <?php endif; ?>
        </div><!-- /.container-fluid -->
    </nav>
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
                var langs = $.parseJSON($FamilyTreeTop.languagesString), ul = $('<ul></ul>'), li, prop, box = $('#modal').clone(),prg, prgInt, prgWidth = 0;
                prg = $('<div familytreetop="languages-progressbar" style="visibility: hidden;" class="progress progress-striped active"><div class="bar" style="width: 0%;"></div></div>');
                $(box).find('#modalLabel').text('Languages');
                for(prop in langs){
                    if(!langs.hasOwnProperty(prop)) continue;
                    li = $('<li><a familytreetop-data="'+langs[prop].lang_code+'" href="#">'+langs[prop].title+'</a></li>');
                    $(ul).append(li);
                }
                $(ul).append(prg);

                var div = $('<div class="row-fluid"><div class="span4"></div><div familytreetop-language class="span4"></div><div class="span4"></div></div>')

                $(div).find('[familytreetop-language]').append(ul);
                $(box).find('.modal-body').append(div);
                $(box).find('.modal-footer').remove();
                $(box).modal();

                $(ul).find('li a').click(function(){
                    var local = $(this).attr('familytreetop-data');
                    _tactOn_();
                    $FamilyTreeTop.fn.ajax('languages.setLanguage', {local: local}, function(response){
                        _tactDone_();
                        setTimeout(function(){
                           $(box).modal('hide');
                        }, 1000);
                        window.location.reload();
                    });
                    return false;
                });

                function _tactOn_(){
                    var bar = $(prg).find('.bar');
                    $(prg).css('visibility', 'visible');
                    prgInt = setInterval(function(){
                        prgWidth++;
                        if(prgWidth < 97){
                          $(bar).css('width', prgWidth+'%');
                        }
                    }, 100);
                }
                function _tactDone_(){
                    clearInterval(prgInt);
                    $(prg).find('.bar').css('width', '100%');
                }
            },
            facebook:function(object){
                window.location = $FamilyTreeTop.app.data.link;
            },
            familytreetop:function(object){
                window.top.location = $FamilyTreeTop.rooturl;
            },
            logout: function(object){
                $FamilyTreeTop.fn.logout();
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

        $('[familytreetop-link="familytreetop"]').click(function(){
            if(window != window.top){
                window.top.location.href = $(this).attr('href');
            } else {
                window.location.href = $(this).attr('href');
            }
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