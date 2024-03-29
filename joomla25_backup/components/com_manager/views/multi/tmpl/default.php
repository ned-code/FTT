<?php defined('_JEXEC') or die('Restricted access');

function prior($pages){
    $result = array($pages[0], $pages[2], $pages[1], $pages[3]);
    return $result;
}

function _getAlias(){
    $menu   = &JSite::getMenu();
    $active   = $menu->getActive();
    if(is_object($active)){
        return $active->alias;
    }
    return false;
}

$alias = _getAlias();

$info = prior($this->pageInfo);
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
    <div class="twelve columns" role="content">
        <div id="_content" class="content">
            <div class="header"></div>
            <div class="main">
                <div id='container'>&nbsp;</div>
            </div>
        </div>
    </div>
</div>
<div class="row">
    <div class="twelve columns">
        <div class="row">
            <div class="one columns"><a href="<?php echo $url; ?>">FamilyTreeTop.com</a></div>
            <div class="ten columns">
                <ul class="link-list right">
                    <li><a href="<?php echo $url; ?>index.php?option=com_manager&task=setLocation&alias=article&p=about">About</a></li>
                    <li><a href="<?php echo $url; ?>index.php?option=com_manager&task=setLocation&alias=article&p=conditions">Terms & Conditions</a></li>
                    <li><a href="<?php echo $url; ?>index.php?option=com_manager&task=setLocation&alias=article&p=privacy">Privacy Policy</a></li>
                    <li><a href="<?php echo $url; ?>index.php?option=com_manager&task=setLocation&alias=article&p=feedback">Provide Feedback</a></li>
                    <li><a href="<?php echo $url; ?>index.php?option=com_manager&task=setLocation&alias=article&p=contact">Contact</a></li>
                    <li><a href="<?php echo $url; ?>index.php?option=com_manager&task=setLocation&alias=article&p=help">Help</a></li>
                </ul>
            </div>
        </div>
    </div>
</div>

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
                baseurl: '<?php echo $url; ?>',
                mobile: '<?php echo $this->mobile; ?>'
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

        if(w != w.top){
            jQuery("#_header").remove();
            jQuery(".footer").remove();
        }

        $FamilyTreeTop.global.base = data.baseurl;
        $FamilyTreeTop.global.alias = data.alias;
        $FamilyTreeTop.global.loginType = parseInt(data.usermap.loginType);
        $FamilyTreeTop.fn.mod("RENDER").set("desctop", data.pageInfo);
        $FamilyTreeTop.fn.mod("usertree").set(storage.usertree);
    })(window)
</script>