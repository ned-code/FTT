<?php
defined('_JEXEC') or die;
$gedcom = GedcomHelper::getInstance();
$user = FamilyTreeTopUserHelper::getInstance()->get();
$ind = $gedcom->individuals->get($user->gedcom_id);
?>
<div class="navbar">
    <div class="navbar-inner">
        <ul id="familyTreeTopTabs" class="nav">
            <!-- BULLETIN BOARD -->
            <li class="visible-desktop active"><a href="#tab1" data-toggle="tab">Bulletin Board</a></li>
            <li class="hidden-desktop dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">Bulletin Board<b class="caret"></b></a>
                <ul class="dropdown-menu">
                    <li><a href="#">My Family On FB</a></li>
                    <li><a href="#">Latest Changes</a></li>
                </ul>
            </li>
            <!-- CALENDAR -->
            <li class="visible-desktop"><a href="#">Calendar</a></li>
            <li class="hidden-desktop dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">Calendar<b class="caret"></b></a>
                <ul class="dropdown-menu">
                    <li><a href="#">This Month</a></li>
                    <li><a href="#">Latest Events</a></li>
                </ul>
            </li>
            <!-- MEMBERS -->
            <li><a href="#">Members</a></li>
            <li><a href="#">Family Tree</a></li>
            <!--
            <li><a href="#tab2" data-toggle="tab">Families</a></li>
            <li><a href="#tab3" data-toggle="tab">Descendants</a></li>
            <li><a href="#tab4" data-toggle="tab">Ancestors</a></li>
            -->
        </ul>
        <?php if($user->famous): ?>
            <div class="pull-right">
                <span><?=$ind->name();?></span>
                <a class="btn" href="<?=JRoute::_("index.php?option=com_familytreetop&task=famous.ext", false);?>" >Exit</a>
            </div>
        <?php endif;?>
        <div data-familytreetop="familyline" class="btn-group pull-right visible-desktop">
            <button class="btn"><i class="icon-pencil"></i></button>
            <button class="btn"><i class="icon-eye-open"></i></button>
            <button style="background: none;border: none;" class="btn disabled">
                <ul class="unstyled inline">
                    <li>Mother</li>
                    <li><canvas id="mother_chart" style="height:20px"></canvas></li>
                </ul>
            </button>
            <button style="background: none;border: none;" class="btn disabled">
                <ul class="unstyled inline">
                    <li><canvas id="father_chart" style="height:20px"></canvas></li>
                    <li>Father</li>
                </ul>
            </button>
            <button class="btn"><i class="icon-eye-open"></i></button>
            <button class="btn"><i class="icon-pencil"></i></button>
        </div>
    </div>
</div>
<script>
    $FamilyTreeTop.bind(function($){
        var $this = this;
        $this.mod('familyline').init();
    });
</script>
