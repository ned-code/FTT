<?php defined('_JEXEC') or die('Restricted access');
function _getAlias(){
    $menu   = &JSite::getMenu();
    $active   = $menu->getActive();
    if(is_object($active)){
        return $active->alias;
    }
    return false;
}

$alias = _getAlias();
$info = $this->pageInfo;
$url = JURI::base();
$path = 'components/com_manager/modules/';

foreach ($info as $page){
    $modules = $page['modules'];
    foreach ($modules as $module){
        $name = $module['info']['name'];
        $files = $module['files'];
        $link = $url . $path . $name;
        foreach($files['css'] as $cssName){
            echo '<link type="text/css" href="'.$path . $name . "/css/" . $cssName.'" rel="stylesheet"></link>';
        }
        foreach($files['js'] as $jsName){
            echo '<script src="'. $link . '/js/' . $jsName .'" type="text/javascript"></script>';
        }
    }
}
?>
<div id="_header"></div>
<div id="_content" class="content">
    <div class="header"></div>
    <div class="main">
        <div id="page"></div>
    </div>
</div>
<script>
    (function(w){
        var pageInfo = <?php echo json_encode($info); ?>;
        var usermap = <?php echo json_encode($this->usermap); ?>;
        var app = <?php echo json_encode($this->app); ?>;
        var langString = <?php echo json_encode($this->languageStrings); ?>;
        var config = <?php echo json_encode($this->config); ?>;
        var alias = '<?php echo $alias; ?>';
        var baseurl = '<?php echo $url; ?>';

        if('undefined' !== typeof(storage)){
            storage.usertree.usermap = usermap;
            storage.app = app;
            storage.langString = langString;
            storage.settings = config;

            $FamilyTreeTop.global.base = baseurl;
            $FamilyTreeTop.global.alias = alias;
            $FamilyTreeTop.global.loginType = parseInt(usermap.loginType);
            $FamilyTreeTop.fn.mod("RENDER").set("desctop", pageInfo);
        }
    })(window)
</script>