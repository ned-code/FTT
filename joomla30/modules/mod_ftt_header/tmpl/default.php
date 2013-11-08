<?php
defined('_JEXEC') or die;
$gedcom = GedcomHelper::getInstance();
$user = FamilyTreeTopUserHelper::getInstance()->get();
$ind = $gedcom->individuals->get($user->gedcom_id);
$fatherLineTotal = sizeof($gedcom->individuals->getCountByFamilyLine('is_father_line'));
$motherLineTotal = sizeof($gedcom->individuals->getCountByFamilyLine('is_mother_line'));
?>
<?php
/*
<div class="navbar">
    <div class="navbar-inner">
        <ul id="familyTreeTopTabs" class="nav">
            <!-- BULLETIN BOARD -->
            <li class="visible-desktop active"><a data-familytreetop="bulletin_board" href="#"><?=JText::_('MOD_FAMILYTREETOP_HEADER_BULLETIN_BOARD')?></a></li>
            <li class="hidden-desktop dropdown active">
                <a data-familytreetop="bulletin_board" href="#" class="dropdown-toggle" data-toggle="dropdown"><?=JText::_('MOD_FAMILYTREETOP_HEADER_BULLETIN_BOARD')?><b class="caret"></b></a>
                <ul class="dropdown-menu">
                    <li><a data-familytreetop="bulletin_board/myfamily" href="#"><?=JText::_('MOD_FAMILYTREETOP_HEADER_MY_FAMILY_ON_FACEBOOK')?></a></li>
                    <li><a data-familytreetop="bulletin_board/latest_changes" href="#"><?=JText::_('MOD_FAMILYTREETOP_HEADER_LATEST_CHANGES')?></a></li>
                </ul>
            </li>
            <!-- CALENDAR -->
            <li class="visible-desktop"><a data-familytreetop="calendar" href="#"><?=JText::_('MOD_FAMILYTREETOP_HEADER_CALENDAR')?></a></li>
            <li class="hidden-desktop dropdown">
                <a data-familytreetop="calendar" href="#" class="dropdown-toggle" data-toggle="dropdown"><?=JText::_('MOD_FAMILYTREETOP_HEADER_CALENDAR')?><b class="caret"></b></a>
                <ul class="dropdown-menu">
                    <li><a data-familytreetop="calendar/this_month" href="#"><?=JText::_('MOD_FAMILYTREETOP_HEADER_THIS_MONTH')?></a></li>
                    <li><a data-familytreetop="calendar/latest_events" href="#"><?=JText::_('MOD_FAMILYTREETOP_HEADER_LATEST_EVENTS')?></a></li>
                </ul>
            </li>
            <!-- MEMBERS -->
            <li><a data-familytreetop="members" href="#"><?=JText::_('MOD_FAMILYTREETOP_HEADER_MEMBERS')?></a></li>
            <li><a data-familytreetop="family_tree" href="#"><?=JText::_('MOD_FAMILYTREETOP_HEADER_FAMILY_TREE')?></a></li>
        </ul>
        <?php if($user->famous): ?>
            <div class="pull-right">
                <span><?=$ind->name();?></span>
                <a class="btn" href="<?=JRoute::_("index.php?option=com_familytreetop&task=famous.ext", false);?>" ><?=JText::_('MOD_FAMILYTREETOP_HEADER_EXIT')?></a>
            </div>
        <?php endif;?>
        <ul class="nav pull-right" style="border-left: 1px solid #d4d4d4;border-right: 1px solid #d4d4d4;padding-left: 10px;padding-right: 10px;background: white;">
            <li>
                <div data-familytreetop="familyline" class="btn-group pull-right visible-desktop">
                    <button class="btn"><i familytreetop-line="mother" class="icon-pencil"></i></button>
                    <button class="btn"><i familytreetop-line="mother" class="icon-eye-open"></i></button>
                    <button style="background: none;border: none;" class="btn disabled">
                        <ul class="unstyled inline">
                            <li style="position: relative;top: -3px;"><?=JText::_('MOD_FAMILYTREETOP_FAMILY_LINE_MOTHER')?></li>
                            <li><canvas id="mother_chart" style="height:20px; width: 40px;"></canvas></li>
                        </ul>
                    </button>
                </div>
            </li>
            <li class="divider-vertical"></li>
            <li>
                <div data-familytreetop="familyline" class="btn-group pull-right visible-desktop">
                    <button style="background: none;border: none;" class="btn disabled">
                        <ul class="unstyled inline">
                            <li ><canvas id="father_chart" style="height:20px; width: 40px;"></canvas></li>
                            <li style="position: relative;top: -3px;"><?=JText::_('MOD_FAMILYTREETOP_FAMILY_LINE_FATHER')?></li>
                        </ul>
                    </button>
                    <button class="btn"><i familytreetop-line="father" class="icon-eye-open"></i></button>
                    <button class="btn"><i familytreetop-line="father" class="icon-pencil"></i></button>
                </div>
            </li>
        </ul>
    </div>
</div>
 */
?>
<div class="navbar">
    <div class="navbar-inner">
        <ul id="familyTreeTopTabs" class="nav">
            <!-- BULLETIN BOARD -->
            <li class="active"><a data-familytreetop="bulletin_board" href="#"><?=JText::_('MOD_FAMILYTREETOP_HEADER_BULLETIN_BOARD')?></a></li>
            <!-- CALENDAR -->
            <li class=""><a data-familytreetop="calendar" href="#"><?=JText::_('MOD_FAMILYTREETOP_HEADER_CALENDAR')?></a></li>
            <!-- MEMBERS -->
            <li><a data-familytreetop="members" href="#"><?=JText::_('MOD_FAMILYTREETOP_HEADER_MEMBERS')?></a></li>
            <li><a data-familytreetop="family_tree" href="#"><?=JText::_('MOD_FAMILYTREETOP_HEADER_FAMILY_TREE')?></a></li>
        </ul>
        <?php if($user->famous): ?>
            <div class="pull-right">
                <span><?=$ind->name();?></span>
                <a class="btn" href="<?=JRoute::_("index.php?option=com_familytreetop&task=famous.ext", false);?>" ><?=JText::_('MOD_FAMILYTREETOP_HEADER_EXIT')?></a>
            </div>
        <?php endif;?>
        <ul class="nav pull-right visible-desktop" style="border-left: 1px solid #d4d4d4;border-right: 1px solid #d4d4d4;padding-left: 10px;padding-right: 10px;background: white;">
            <li>
                <div data-familytreetop="familyline" class="btn-group pull-right">
                    <button familytreetop-tooltip="Highlight people on your mother’s side" class="btn"><i familytreetop-line="mother" class="icon-adjust"></i></button>
                    <button familytreetop-tooltip="Hide people on your mother’s side" class="btn"><i familytreetop-line="mother" class="icon-eye-open"></i></button>
                    <button familytreetop-tooltip="Members on mother side: <?=$motherLineTotal;?>" style="background: none;border: none;" class="btn disabled">
                        <ul class="unstyled inline">
                            <li style="padding:0; position: relative;top: -3px;"><?=JText::_('MOD_FAMILYTREETOP_FAMILY_LINE_MOTHER')?></li>
                            <li style="padding:0;"><canvas id="mother_chart" familytreetop-data="<?=$motherLineTotal;?>" style="height:20px; width: 40px;"></canvas></li>
                        </ul>
                    </button>
                </div>
            </li>
            <li class="divider-vertical"></li>
            <li>
                <div data-familytreetop="familyline" class="btn-group pull-right">
                    <button familytreetop-tooltip="Members on father side: <?=$fatherLineTotal;?>" style="background: none;border: none;" class="btn disabled">
                        <ul class="unstyled inline">
                            <li style="padding:0;" ><canvas id="father_chart" familytreetop-data="<?=$fatherLineTotal;?>"  style="height:20px; width: 40px;"></canvas></li>
                            <li style="padding:0; position: relative;top: -3px;"><?=JText::_('MOD_FAMILYTREETOP_FAMILY_LINE_FATHER')?></li>
                        </ul>
                    </button>
                    <button familytreetop-tooltip="Hide people on your father’s side" class="btn"><i familytreetop-line="father" class="icon-eye-open"></i></button>
                    <button familytreetop-tooltip="Highlight people on your father’s side" class="btn"><i familytreetop-line="father" class="icon-adjust"></i></button>
                </div>
            </li>
        </ul>
    </div>
</div>
<script>
    $FamilyTreeTop.bind(function($){
        var $this = this;
        $this.mod('familyline').init();
    });
</script>
