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

$builder = new FamilyTreeTopBuilderLibrary();
$cssObject = array();

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
<div class="row">
    <div class="four columns">
        <div id="_header"></div>
    </div>
</div>
<div class="row">
    <div class="four columns">
        <div id="_nav"></div>
    </div>
</div>
<div class="row">
    <div id="_content" class="four columns" role="content">
    </div>
</div>
<footer class="row">
    <div class="four columns">
        <ul class="link-list" style="margin: 0 auto;max-width: 175px;">
            <li><a href="<?php echo $url; ?>index.php/about">About</a></li>
            <li><a href="<?php echo $url; ?>index.php/conditions">Terms</a></li>
            <li><a href="<?php echo $url; ?>index.php/contact">Contact</a></li>
        </ul>
    </div>
</footer>
<script>
    (function(w){
        var setData = function(){
            var data = {
                pageInfo:<?php echo json_encode($info); ?>,
                activeTab:'<?php echo $this->activeTab; ?>',
                usertree:<?php echo json_encode($this->usertree); ?>,
                langString:<?php echo json_encode($this->languageStrings); ?>,
                notifications:<?php echo json_encode($this->notifications); ?>,
                config:<?php echo json_encode($this->config); ?>,
                friends:<?php echo json_encode($this->friends); ?>,
                usermap:<?php echo json_encode($this->usermap); ?>,
                app:<?php echo json_encode($this->app); ?>,
                alias: '<?php echo $alias; ?>',
                baseurl: '<?php echo $url; ?>'
            }

            if(typeof(storage) != "undefined"){
                if(data.usertree){
                    storage.usertree.mobile = data.mobile;
                    storage.usertree.gedcom_id = data.usertree.gedcom_id;
                    storage.usertree.facebook_id = data.usertree.facebook_id;
                    storage.usertree.tree_id = data.usertree.tree_id;
                    storage.usertree.permission = data.usertree.permission;
                    storage.usertree.users = data.usertree.users;
                    storage.usertree.friends = data.friends;
                    storage.usertree.pull = data.usertree.pull;
                }
                storage.notifications = data.notifications;
                storage.settings = data.config;
                storage.langString = data.langString;
                storage.usertree.usermap = data.usermap;

                storage.app = data.app;
                storage.activeTab = data.activeTab;
            }
            return data;
        }

        var data = setData();
        $FamilyTreeTop.global.base = data.baseurl;
        $FamilyTreeTop.global.alias = data.alias;
        $FamilyTreeTop.global.loginType = parseInt(data.usermap.loginType);
        $FamilyTreeTop.fn.mod("RENDER").set("mobile", data.pageInfo);
    })(window)
</script>