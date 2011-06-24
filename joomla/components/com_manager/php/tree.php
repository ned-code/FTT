<?php
header('Content-Type: text/xml');
   require 'moduleManager.php';

   include 'config.php';

   $res=mysql_connect($mysql_server,$mysql_user,$mysql_pass);
   mysql_select_db($mysql_db);
   $manager = new moduleManager($res);
   if($_GET['task']=='tree')
    echo $manager->getModulesXmlTree();
    else if($_GET['task']=='module'){
        $module = $manager->getModule($_GET['name']);
	$manager->appendModule($module);
        return $module->render();
   }else
   if($_GET['task']=='custom'){
	echo $manager->getUserModules();
   }
   if($_GET['task']=='system'){
	echo $manager->getSystemModules();
   }
   mysql_close();
?>
