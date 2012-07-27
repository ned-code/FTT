<?php defined('_JEXEC') or die('Restricted access');

$pages = $this->msg->id;

?>
<div id="page"></div>

<script>
    (function(w){
        var pages = <?php echo $pages; ?>;
        var usermap = <?php echo json_encode($this->usermap); ?>;
        var app = <?php echo json_encode($this->app); ?>;
        var langString = <?php echo json_encode($this->languageStrings); ?>;
        var config = <?php echo json_encode($this->config); ?>;

        if('undefined' !== typeof(storage)){
            storage.usertree.usermap = usermap;
            storage.app = app;
            storage.langString = langString;
            storage.settings = config;

            storage.core.load(pages);
        }
    })(window)
</script>