<?php defined('_JEXEC') or die('Restricted access');

// id, layout_type, title;
echo "<div id='container'>&nbsp;</div>";
//$controller = new JMBController();

$pages = '';
foreach($this->msg as $obj){
	$pages .= $obj->id.'|';
}
$pages = substr($pages, 0, strlen($pages)-1);
?>
<script>
    (function(w){
        var pageInfo = <?php echo json_encode($this->pageInfo); ?>;
        var activeTab = '<?php echo $this->activeTab; ?>';
        var usertree = <?php echo json_encode($this->usertree); ?>;
        var langString = <?php echo json_encode($this->languageStrings); ?>;
        var notifications = <?php echo json_encode($this->notifications); ?>;
        var config = <?php echo json_encode($this->config); ?>;
        var friends = <?php echo json_encode($this->friends); ?>;
        var usermap = <?php echo json_encode($this->usermap); ?>;

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

            storage.activeTab = activeTab;
            storage.core.load(pageInfo);
        }
    })(window)
</script>