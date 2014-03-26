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

            <ul class="nav navbar-nav pull-right" familytreetop-module="family_line">
                <li>
                    <div class="btn-group">
                        <button familytreetop-tooltip="Highlight people on your mother’s side"  type="button" class="btn btn-default"><i familytreetop-line="mother" class="fa fa-adjust"></i></button>
                        <button familytreetop-tooltip="Hide people on your mother’s side" class="btn btn-default" type="button" class="btn btn-default"><i familytreetop-line="mother" class="fa fa-eye"></i></button>
                        <button familytreetop-tooltip="Members on mother side: <?=$motherLineTotal;?>" type="button" class="btn btn-default" disabled="disabled">
                            <?=JText::_('MOD_FAMILYTREETOP_FAMILY_LINE_MOTHER')?>
                            <canvas id="mother_chart" style="width:40px;height:20px;position: relative;top: 5px;" familytreetop-data="<?=$motherLineTotal;?>"></canvas>
                        </button>
                    </div>
                </li>
                <li class="familytreetop-vertical-divider">&nbsp;</li>
                <li>
                    <div class="btn-group">
                        <button familytreetop-tooltip="Members on father side: <?=$fatherLineTotal;?>" type="button" class="btn btn-default" disabled="disabled">
                            <canvas id="father_chart" style="width:40px;height:20px;position: relative;top: 5px;" familytreetop-data="<?=$fatherLineTotal;?>"></canvas>
                            <?=JText::_('MOD_FAMILYTREETOP_FAMILY_LINE_FATHER')?>
                        </button>
                        <button familytreetop-tooltip="Hide people on your father’s side"  type="button" class="btn btn-default"><i familytreetop-line="father" class="fa fa-eye"></i></button>
                        <button familytreetop-tooltip="Highlight people on your father’s side" type="button" class="btn btn-default"><i familytreetop-line="father" class="fa fa-adjust"></i></button>
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
