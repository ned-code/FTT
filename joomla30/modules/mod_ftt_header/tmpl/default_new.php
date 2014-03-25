<?php
defined('_JEXEC') or die;
$gedcom = GedcomHelper::getInstance();
$user = FamilyTreeTopUserHelper::getInstance()->get();
$ind = $gedcom->individuals->get($user->gedcom_id);
$fatherLineTotal = sizeof($gedcom->individuals->getCountByFamilyLine('is_father_line'));
$motherLineTotal = sizeof($gedcom->individuals->getCountByFamilyLine('is_mother_line'));
?>
<nav class="navbar navbar-default" role="navigation">
    <div class="container-fluid">
        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul id="familyTreeTopTabs" class="nav navbar-nav">
                <!-- BULLETIN BOARD -->
                <li class="active"><a data-familytreetop="bulletin_board" href="#"><?=JText::_('MOD_FAMILYTREETOP_HEADER_BULLETIN_BOARD')?></a></li>
                <!-- CALENDAR -->
                <li><a data-familytreetop="calendar" href="#"><?=JText::_('MOD_FAMILYTREETOP_HEADER_CALENDAR')?></a></li>
                <!-- MEMBERS -->
                <li><a data-familytreetop="members" href="#"><?=JText::_('MOD_FAMILYTREETOP_HEADER_MEMBERS')?></a></li>
                <li><a data-familytreetop="family_tree" href="#"><?=JText::_('MOD_FAMILYTREETOP_HEADER_FAMILY_TREE')?></a></li>
            </ul>
            <ul class="nav navbar-nav pull-right" style="border-left: 1px solid #d4d4d4;border-right: 1px solid #d4d4d4;padding-left: 10px;padding-right: 10px;background: white;">
                <li>
                    <div data-familytreetop="familyline" class="btn-group pull-right">
                        <button type="button" familytreetop-tooltip="Highlight people on your mother’s side" class="btn btn-default"><i familytreetop-line="mother" class="fa fa-adjust"></i></button>
                        <button type="button" familytreetop-tooltip="Hide people on your mother’s side" class="btn btn-default"><i familytreetop-line="mother" class="fa fa-eye"></i></button>
                        <button type="button" familytreetop-tooltip="Members on mother side: <?=$motherLineTotal;?>" style="background: none;border: none;" class="disabled">
                            <ul class="list-unstyled list-inline">
                                <li style="padding:0; position: relative;top: -3px;"><?=JText::_('MOD_FAMILYTREETOP_FAMILY_LINE_MOTHER')?></li>
                                <li style="padding:0;"><canvas id="mother_chart" familytreetop-data="<?=$motherLineTotal;?>" style="height:20px; width: 40px;"></canvas></li>
                            </ul>
                        </button>
                    </div>
                </li>
                <li class="divider-vertical"></li>
                <li>
                    <div data-familytreetop="familyline" class="btn-group pull-right">
                        <button type="button" familytreetop-tooltip="Members on father side: <?=$fatherLineTotal;?>" style="background: none;border: none;" class="btn btn-default disabled">
                            <ul class="list-unstyled list-inline">
                                <li style="padding:0;" ><canvas id="father_chart" familytreetop-data="<?=$fatherLineTotal;?>"  style="height:20px; width: 40px;"></canvas></li>
                                <li style="padding:0; position: relative;top: -3px;"><?=JText::_('MOD_FAMILYTREETOP_FAMILY_LINE_FATHER')?></li>
                            </ul>
                        </button>
                        <button type="button" familytreetop-tooltip="Hide people on your father’s side" class="btn btn-default"><i familytreetop-line="father" class="fa fa-eye"></i></button>
                        <button type="button" familytreetop-tooltip="Highlight people on your father’s side" class="btn btn-default"><i familytreetop-line="father" class="fa fa-adjust"></i></button>
                    </div>
                </li>
            </ul>
        </div><!-- /.navbar-collapse -->
    </div><!-- /.container-fluid -->
</nav>
<script>
    $FamilyTreeTop.bind(function($){
        var $this = this;
        $this.mod('familyline').init();
    });
</script>
