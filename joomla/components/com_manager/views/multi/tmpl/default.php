<?php defined('_JEXEC') or die('Restricted access');
//echo '<div id="pages"></div>';
echo "<div id='container'>&nbsp;</div>";
$controller = new JMBController();
$pages = '';
foreach($this->msg as $obj){
	$pages .= $obj->id.'|';
}
$pages = substr($pages, 0, strlen($pages)-1);

$session = JFactory::getSession();
$active_tab = $session->get('active_tab');
$str ='<script>storage.core.load("'.$pages.'"); storage.activeTab = "'. $active_tab .'" </script>';
echo $str;

?>

