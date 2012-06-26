<?php defined('_JEXEC') or die('Restricted access');

// id, layout_type, title;
echo "<div id='container'>&nbsp;</div>";
$controller = new JMBController();

$pages = '';
foreach($this->msg as $obj){
	$pages .= $obj->id.'|';
}
$pages = substr($pages, 0, strlen($pages)-1);
?>
<script>
    var pageInfo = <?php echo json_encode($this->pageInfo); ?>;
    var activeTab = '<?php echo $this->activeTab; ?>';

     if(typeof(storage != "undefined")){
         storage.core.load(pageInfo);
         storage.activeTab = activeTab;
     }
</script>