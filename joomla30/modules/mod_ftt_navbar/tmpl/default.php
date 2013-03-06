<?php
defined('_JEXEC') or die;
$user = FamilyTreeTopUserHelper::getInstance()->get();
if(!empty($user->gedcom_id)){
    $ind = GedcomHelper::getInstance()->individuals->get($user->gedcom_id);
} else {
    $ind = false;
}
?>
<div class="navbar navbar-inverse">
    <div class="navbar-inner">
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
                    <li><img src="https://graph.facebook.com/<?=$user->facebook_id;?>/picture?width=40&height=40"/></li>
                    <li class="divider-vertical"></li>
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown"><?=$ind->name();?> <b class="caret"></b></a>
                        <ul class="dropdown-menu">
                            <li><a  familytreetop="profile" href="#">Profile</a></li>
                            <li><a  familytreetop="languages" href="#">Languages</a></li>
                            <li><a  familytreetop="facebook" href="#">Redirect to Facebook</a></li>
                            <li class="divider"></li>
                            <li><a  familytreetop="logout" href="#">Log Out</a></li>
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
            console.log(id);
            switch(id){
                default: return false;
            }
            return false;
        })
    });
</script>