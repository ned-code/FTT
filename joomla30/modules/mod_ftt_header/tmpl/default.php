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
            <li class="visible-desktop active"><a data-familytreetop="bulletin_board" href="#">Bulletin Board</a></li>
            <li class="hidden-desktop dropdown active">
                <a data-familytreetop="bulletin_board" href="#" class="dropdown-toggle" data-toggle="dropdown">Bulletin Board<b class="caret"></b></a>
                <ul class="dropdown-menu">
                    <li><a data-familytreetop="bulletin_board/myfamily" href="#">My Family On FB</a></li>
                    <li><a data-familytreetop="bulletin_board/latest_changes" href="#">Latest Changes</a></li>
                </ul>
            </li>
            <!-- CALENDAR -->
            <li class="visible-desktop"><a data-familytreetop="calendar" href="#">Calendar</a></li>
            <li class="hidden-desktop dropdown">
                <a data-familytreetop="calendar" href="#" class="dropdown-toggle" data-toggle="dropdown">Calendar<b class="caret"></b></a>
                <ul class="dropdown-menu">
                    <li><a data-familytreetop="calendar/this_month" href="#">This Month</a></li>
                    <li><a data-familytreetop="calendar/latest_events" href="#">Latest Events</a></li>
                </ul>
            </li>
            <!-- MEMBERS -->
            <li><a data-familytreetop="members" href="#">Members</a></li>
            <li><a data-familytreetop="family_tree" href="#">Family Tree</a></li>
        </ul>
        <?php if($user->famous): ?>
            <div class="pull-right">
                <span><?=$ind->name();?></span>
                <a class="btn" href="<?=JRoute::_("index.php?option=com_familytreetop&task=famous.ext", false);?>" >Exit</a>
            </div>
        <?php endif;?>
        <div data-familytreetop="familyline" class="btn-group pull-right visible-desktop" style="padding-top: 5px;margin: 0;border-left: 1px solid #d4d4d4;border-right: 1px solid #d4d4d4;padding-left: 10px;padding-right: 10px;background: white;">
            <button class="btn"><i familytreetop-line="mother" class="icon-pencil"></i></button>
            <button class="btn"><i familytreetop-line="mother" class="icon-eye-open"></i></button>
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
            <button class="btn"><i familytreetop-line="father" class="icon-eye-open"></i></button>
            <button class="btn"><i familytreetop-line="father" class="icon-pencil"></i></button>
        </div>
    </div>
</div>
<script>
    $FamilyTreeTop.bind(function($){
        var $this = this;
        $this.mod('familyline').init();
    });
</script>
