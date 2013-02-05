<?php defined('_JEXEC') or die('Restricted access');

function prior($pages){
    $result = array($pages[0], $pages[2], $pages[1], $pages[3]);
    return $result;
}

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
<div id="_content" class="content">
    <div class="header"></div>
    <div class="main">
        <div id='container'>&nbsp;</div>
    </div>
</div>
<div id="_footer" class="footer">
    <div style="margin: 0 auto; max-width: 920px;">
        <div style="float: left; color: black; font-weight: bold;">
            <a href="<?php echo $url; ?>">FamilyTreeTop.com</a>
        </div>
        <div style="float: right;">
            <ul>
                <li><a href="<?php echo $url; ?>index.php/about">About</a></li>
                <li><a href="<?php echo $url; ?>index.php/conditions">Terms & Conditions</a></li>
                <li><a href="<?php echo $url; ?>index.php/privacy">Privacy Policy</a></li>
                <li><a href="<?php echo $url; ?>index.php/feedback">Provide Feedback</a></li>
                <li><a href="<?php echo $url; ?>index.php/contact">Contact</a></li>
                <li><a href="<?php echo $url; ?>index.php/help">Help</a></li>
            </ul>
        </div>
    </div>
</div>
<div class="slide-out-div">
    <a class="handle" href="http://link-for-non-js-users.html">Content</a>
    <div id="jmb_feedback_form">
        <div style="display:none;" class="likes">
            <!-- AddThis Button BEGIN -->
            <script>
                if(window == window.top){
                    (function(w){
                        var head = document.getElementsByTagName("head");
                        var script = document.createElement("script");
                        script.src = "http://s7.addthis.com/js/250/addthis_widget.js#pubid=xa-4f97ad88304db623";
                        script.type="text/javascript";
                        head[0].appendChild(script);
                    })(window)
                }
            </script>
            <div class="addthis_toolbox addthis_default_style addthis_32x32_style">
                <div class="message"></div>
                <div class="facebook"><a class="addthis_button_facebook at300b"></a></div>
                <div class="twitter"><a class="addthis_button_twitter at300b"></a></div>
                <div class="email"><a class="addthis_button_email at300b"></a></div>
            </div>
            <!-- AddThis Button END -->
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

        if(w != w.top){
            jQuery("#_header").remove();
            jQuery(".footer").remove();
            jQuery(".slide-out-div").remove();
        } else {
            if(data.alias == "myfamily"){
                jQuery(".slide-out-div").tabSlideOut({
                    tabHandle: '.handle',
                    pathToTabImage: '../components/com_manager/modules/feedback/images/feedback.gif',
                    imageHeight: '279px',
                    imageWidth: '40px',
                    tabLocation: 'left',
                    speed: 300,
                    action: 'click',
                    topPos: '50px',
                    leftPos: '20px',
                    fixedPosition: false
                });
            }
        }
        $FamilyTreeTop.fn.mod("RENDER").set("desctop", data.pageInfo);
    })(window)
</script>