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
            <a class="brand" href="<?=JRoute::_("index.php?option=com_familytreetop&view=index", false); ?>">Family TreeTop</a>
            <div class="nav-collapse collapse">
                <ul class="nav">
                    <li <?=($view=="myfamily")?'class="active"':''; ?> > <a href="<?=JRoute::_("index.php?option=com_familytreetop&view=myfamily", false); ?>">My Family</a></li>
                    <li <?=($view=="famous")?'class="active"':''; ?> ><a href="<?=JRoute::_("index.php?option=com_familytreetop&view=famous", false); ?>">Famous Family</a></li>
                    <li <?=($view=="index")?'class="active"':''; ?> ><a href="<?=JRoute::_("index.php?option=com_familytreetop&view=index", false); ?>">Home</a></li>
                </ul>
            </div>
            <?php if($user->facebook_id != 0 && $ind): ?>
                <ul id="profileUser" class="nav pull-right">
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
        </div>
    </div>
</div>
<script>
    $FamilyTreeTop.bind(function($){
        'use strict';
        $('#profileUser ul.dropdown-menu li a').click(function(){
            var id = $(this).attr('familytreetop');
            var a = $(this);
            console.log(id);
            switch(id){
                case "profile":
                        $FamilyTreeTop.mod('editor').render($FamilyTreeTop.mod('usertree').usermap().gedcom_id);
                        break;

                case "logout":
                        if(FB.getAuthResponse() != null){
                            FB.logout(function(r){
                                window.location = $(a).attr('href');
                            });
                        } else {
                            window.location = $(a).attr('href');
                        }
                    break;

                default: return false;
            }
            return false;
        })
    });
</script>