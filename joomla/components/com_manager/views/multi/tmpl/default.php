<?php defined('_JEXEC') or die('Restricted access');
//echo '<div id="pages"></div>';
echo "<div id='container'>&nbsp;</div>";
$controller = new JMBController();
$pages = '';
foreach($this->msg as $obj){
	$pages .= $obj->id.'|';
}
$pages = substr($pages, 0, strlen($pages)-1);
$str ='<script>storage.core.load("'.$pages.'");</script>';
echo $str;

?>

