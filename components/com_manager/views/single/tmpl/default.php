<?php defined('_JEXEC') or die('Restricted access');

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
        var pageInfo = <?php echo json_encode($this->pageInfo); ?>;
        var usermap = <?php echo json_encode($this->usermap); ?>;
        var app = <?php echo json_encode($this->app); ?>;
        var langString = <?php echo json_encode($this->languageStrings); ?>;
        var config = <?php echo json_encode($this->config); ?>;

        if('undefined' !== typeof(storage)){
            storage.usertree.usermap = usermap;
            storage.app = app;
            storage.langString = langString;
            storage.settings = config;

            //storage.core.load(pages);
            var init = function(info){
                if($FamilyTreeTop.fn.mod("RENDER")){
                    $FamilyTreeTop.fn.mod("RENDER").set("desctop", info);
                } else {
                    setTimeout(function(){
                        init(info);
                    }, 250);
                }
            }
            init(pageInfo);
        }
    })(window)
</script>