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
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-familytreetop-navbar-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <?php if($template == "familytreetop"): ?>
                    <a style="font-size:24px; color: white;text-shadow: none;" class="navbar-brand" familytreetop-link="familytreetop" href="<?=JRoute::_("index.php?option=com_familytreetop&view=index", false); ?>"><i class="glyphicon glyphicon-tree-deciduous"></i> <?=$navbar_name;?></i></a>
                <?php else: ?>
                    <a style="font-size:24px; color: white;text-shadow: none;" class="navbar-brand" familytreetop-link="familytreetop" href="<?=JRoute::_("index.php?option=com_familytreetop&view=index", false); ?>"><i class="fa fa-leaf"></i> <?=$navbar_name;?></a>
                <?php endif ?>
            </div>
            <!-- Collect the nav links, forms, and other content for toggling -->
            <?php if($user->facebook_id != 0 && $ind): ?>
            <div class="collapse navbar-collapse" id="bs-familytreetop-navbar-collapse">
                <ul id="mobileMenu" class="nav navbar-nav navbar-right visible-xs">
                    <li ><a href="#" familytreetop="profile" style="color:white;" ><img style="margin: 4px;" src="https://graph.facebook.com/<?=$user->facebook_id;?>/picture?width=30&height=30"/> <?=$ind->name();?></a></li>
                    <li class="familytreetop-divider-vertical" ></li>
                    <li><a data-familytreetop="bulletin_board" style="color:white;" href="#"><?=JText::_('MOD_FAMILYTREETOP_HEADER_BULLETIN_BOARD')?></a></li>
                    <li><a data-familytreetop="calendar" style="color:white;" href="#"><?=JText::_('MOD_FAMILYTREETOP_HEADER_CALENDAR')?></a></li>
                    <li><a data-familytreetop="members" style="color:white;" href="#"><?=JText::_('MOD_FAMILYTREETOP_HEADER_MEMBERS')?></a></li>
                    <li class="familytreetop-divider-vertical"></li>
                    <li><a  familytreetop="facebook" href="#" style="color:white;"><?=JText::_('MOD_FTT_NAVBAR_PROFILE_REDIRECT_TO_FACEBOOK');?></a></li>
                    <li><a  familytreetop="familytreetop" href="#" style="color:white;"><?=JText::_('MOD_FTT_NAVBAR_PROFILE_REDIRECT_TO_FAMILYTREETOP');?></a></li>
                    <li class="familytreetop-divider-vertical"></li>
                    <li><a style="color:white;"  familytreetop="logout" href="<?=JRoute::_("index.php?option=com_familytreetop&task=user.logout", false);?>"><?=JText::_('MOD_FTT_NAVBAR_PROFILE_LOG_OUT');?></a></li>
                </ul>
                <ul id="profileUser"  class="nav navbar-nav navbar-right hidden-xs">
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
            menu : function(obj){
                var id = $(obj).attr('familytreetop');
                switch(id){
                    case "profile":
                        $fn.profile(obj);
                        break;

                    case "languages":
                        $fn.languages(obj);
                        break;

                    case "facebook":
                        $fn.facebook(obj);
                        break;

                    case "familytreetop":
                        $fn.familytreetop(obj);
                        break;

                    case "logout":
                        $fn.logout(obj);
                        break;

                    default: return false;
                }
            },
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
            $('#mobileMenu [familytreetop="facebook"]').parent().remove();
        } else {
            $('#profileUser ul.dropdown-menu li a[familytreetop="familytreetop"]').remove();
            $('#mobileMenu [familytreetop="familytreetop"]').parent().remove();
        }

        $('#mobileMenu a[familytreetop]').click(function(){
            $fn.menu(this);
            $('[data-toggle="collapsed"]').click();
        });
        $('#mobileMenu a[data-familytreetop]').click(function(){
            var data = this.dataset.familytreetop;
            $('#familyTreeTopTabs').find('[data-familytreetop="'+data+'"]').click();
            $('[data-toggle="collapsed"]').click();
        });

        $('#profileUser ul.dropdown-menu li a').click(function(){
            $fn.menu(this);
            return false;
        });

        $('[familytreetop-link="familytreetop"]').click(function(){
            if(window != window.top){
                window.top.location.href = $(this).attr('href');
            } else {
                window.location.href = $(this).attr('href');
            }
        });
    });
</script>