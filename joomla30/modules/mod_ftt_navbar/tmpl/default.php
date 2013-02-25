<?php
defined('_JEXEC') or die;
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
        </div>
    </div>
</div>