<?php defined('_JEXEC') or die('Restricted access');

function prior($pages){
    $result = array($pages[0], $pages[2], $pages[1], $pages[3]);
    return $result;
}

$info = prior($this->pageInfo);
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
            //echo '<link rel="stylesheet" href="'. $link . '/css/' . $cssName .'" type="text/css" />';
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
echo "<div id='container'>&nbsp;</div>";
?>
<script>
    (function(w){
        var pageInfo = <?php echo json_encode($info); ?>;
        var activeTab = '<?php echo $this->activeTab; ?>';
        var usertree = <?php echo json_encode($this->usertree); ?>;
        var langString = <?php echo json_encode($this->languageStrings); ?>;
        var notifications = <?php echo json_encode($this->notifications); ?>;
        var config = <?php echo json_encode($this->config); ?>;
        var friends = <?php echo json_encode($this->friends); ?>;
        var usermap = <?php echo json_encode($this->usermap); ?>;
        var app = <?php echo json_encode($this->app); ?>;

        if(typeof(storage) != "undefined"){
            if(usertree){
                storage.usertree.gedcom_id = usertree.gedcom_id;
                storage.usertree.facebook_id = usertree.facebook_id;
                storage.usertree.tree_id = usertree.tree_id;
                storage.usertree.permission = usertree.permission;
                storage.usertree.users = usertree.users;
                storage.usertree.friends = friends;
                storage.usertree.pull = usertree.pull;
            }
            storage.notifications = notifications;
            storage.settings = config;
            storage.langString = langString;
            storage.usertree.usermap = usermap;

            storage.app = app;
            storage.activeTab = activeTab;
            storage.core.load(pageInfo);
        }
    })(window)
</script>