<?php
include('../../../includes.php');

$app = Jfactory::getApplication('site'); // A necessary step

$user = JFactory::getUser();
$color = JRequest::getVar('color');
$user->setParam('jckuicolor','#'.$color);
$user->save(true);
?>