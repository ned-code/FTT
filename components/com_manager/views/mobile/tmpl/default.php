<?php defined('_JEXEC') or die('Restricted access');

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
            $cssObject[] = $path . $name . "/css/" . $cssName;
        }
        foreach($files['js'] as $jsName){
            echo '<script src="'. $link . '/js/' . $jsName .'" type="text/javascript"></script>';
        }
    }
}

$builder->setCss($cssObject);
$builder->cssCompile("mini2.css");
echo '<link type="text/css" href="'.$url.'components/com_manager/mini/mini2.css" rel="stylesheet"></link>';

?>
<div id="_header"></div>
<div id="_nav"></div>
<div id="_content"></div>
<div id="_footer"></div>
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
                alias: jQuery(document.body).attr("_alias")
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

        var init = function(info){
            if($FamilyTreeTop.fn.mod("RENDER")){
                $FamilyTreeTop.fn.mod("RENDER").set("mobile", info);
            } else {
                setTimeout(function(){
                    init(info);
                }, 250);
            }
        }
        init(data.pageInfo);
    })(window)
</script>