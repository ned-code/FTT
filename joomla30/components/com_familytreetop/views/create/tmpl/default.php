<?php
defined('_JEXEC') or die;
$tpl_path = JPATH_BASE . DIRECTORY_SEPARATOR . 'components/com_familytreetop/tpl/';
?>
<?php include($tpl_path . "familytreetop-header-init.php"); ?>
<div class="row">
    <div id="" class="span12">
        <?php
            $articleId = 6;

            $db = JFactory::getDbo();

            $sql = "SELECT * FROM #__content WHERE id = ".intval($articleId);
            $db->setQuery($sql);
            $fullArticle = $db->loadAssocList('id');
            $text = $fullArticle[$articleId]['introtext'];

            if(!strlen(trim($text))) $text = "";

            //echo $text;
        ?>
    </div>
</div>
<div class="row">
    <div class="span12 center">
        <div class="well text-center">
            <a href="<?=JRoute::_("index.php?option=com_familytreetop&view=create&layout=form", false) ?>" class="btn btn-large btn-primary">Continue</a>
            <a href="<?=JRoute::_("index.php?option=com_familytreetop&view=login", false) ?>" class="btn btn-large">Cancel</a>
        </div>
    </div>
</div>
<?php include($tpl_path . "familytreetop-root.php"); ?>
<?php include($tpl_path . "familytreetop-scripts.php"); ?>