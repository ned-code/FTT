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
<div class="row">
    <div class="twelve columns" role="contnet">
        <div id="_content" class="content">
            <div class="header"></div>
            <div class="main">
                <div id="page"></div>
            </div>
        </div>
    </div>
</div>
<script>
    (function(w){
        var pageInfo = <?php echo json_encode($info); ?>;
        var user = <?php echo json_encode($this->user); ?>;
        var usertree = <?php echo json_encode($this->usertree); ?>;
        var usermap = <?php echo json_encode($this->usermap); ?>;
        var app = <?php echo json_encode($this->app); ?>;
        var langString = <?php echo json_encode($this->languageStrings); ?>;
        var config = <?php echo json_encode($this->config); ?>;
        var alias = '<?php echo $alias; ?>';
        var baseurl = '<?php echo $url; ?>';
        var mobile = '<?php echo $this->mobile; ?>';
        var friends = <?php echo json_encode($this->friends); ?>;

        if('undefined' !== typeof(storage)){
            if("undefined" !== typeof(usertree)){
                storage.usertree.gedcom_id = usertree.gedcom_id;
                storage.usertree.facebook_id = usertree.facebook_id;
                storage.usertree.tree_id = usertree.tree_id;
                storage.usertree.permission = usertree.permission;
                storage.usertree.users = usertree.users;
                storage.usertree.pull = usertree.pull;
            }
            storage.usertree.user = user;
            storage.usertree.mobile = mobile;
            storage.usertree.friends = friends;
            storage.usertree.usermap = usermap;
            storage.app = app;
            storage.langString = langString;
            storage.settings = config;

            $FamilyTreeTop.global.base = baseurl;
            $FamilyTreeTop.global.alias = alias;
            $FamilyTreeTop.global.loginType = parseInt(usermap.loginType);
            $FamilyTreeTop.fn.mod("RENDER").set("desctop", pageInfo);
            $FamilyTreeTop.fn.mod("usertree").set(storage.usertree);
        }
    })(window)
</script>