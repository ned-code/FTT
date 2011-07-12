<?php
# Check to ensure this file is included in Joomla!
defined('_JEXEC') or die( 'Restricted access' );

require JPATH_ROOT.'/components/com_manager/php/pageManager.php';
require JPATH_ROOT.'/components/com_manager/php/moduleManager.php';
require JPATH_ROOT.'/components/com_manager/php/host.php';


jimport('joomla.application.component.controller' );

class JMBController extends JController
{	
	/**
	* Method to display the view
	*
	* @access    public
	*/
	function display()
	{
		parent::display();
	}
	
	/**
	*
	*/
        function callMethod(){
            ob_clean();
            $host = new Host('joomla');
            echo $host->callMethod(JRequest::getVar('module'),JRequest::getVar('class'),JRequest::getVar('method'),JRequest::getVar('args'));
            die;
        }
        
        /**
        *
        */
        function callHostMethod(){
            ob_clean();
            $host = new Host('joomla');
            if((JRequest::getVar('module')!=null)){
                $params = array(JRequest::getVar('module'),JRequest::getVar('args'));
            }else
                $params = array(JRequest::getVar('args'));
            echo call_user_func_array(array($host, JRequest::getVar('method')), $params);
            die;
        }
        
        /**
        *
        */
        public function getModule(){	
        	ob_clean();
        	header('Content-Type: text/html');
        	$id = JRequest::getVar('id');
        	$task = JRequest::getVar('f');
        	$manager = new moduleManager($res);
        	if($task == 'module'){
        		$module = $manager->getModule($id);
        		echo $module->render(true);
        	}
        	die;
        }
        
        /**
        *
        */
        public function moduleScript(){
        	ob_clean();
        	header('Content-type: text/javascript');
        	$id = JRequest::getVar('id');
        	$task = JRequest::getVar('f');
        	$manager = new moduleManager($res);
        	if($task=='append'){
        		$module = $manager->getModule($id);
        		echo $manager->appendModule($module);
        	}
        	if($task=='init'){
        		$module = $manager->getModule($id);
        		echo $module->initialize(true);
        	}
        	die;
        }
        
         /**
        *
        */
        public function getModules(){
        	ob_clean();
        	header('Content-Type: text/xml');
        	$task = JRequest::getVar('f');
        	$manager = new moduleManager($res);
        	if(isset($task)){
        		if($task=='modules'){
        			echo $manager->getUserModules();
        		}else if($task=='system'){
        			echo $manager->getSystemModules();
        		}else if($task=='uninstall'){
        			$manager->uninstallModules(JRequest::getVar('id'));
        		}else if($task=='all'){
        			echo $manager->getModulesXml("all");
        		}
        	}else if(isset($_POST)){
        		if(isset($_FILES['browse'])){
        			echo $manager->unpackModule();
        		}else if(isset($_POST["rollback"])){
        			echo $manager->installModule($_POST['title'],$_POST['description'],$_POST['name'],$_POST['javascript'],$_POST['stylesheets'],$_POST['tables'],$_POST['rollback']);
        		}else if(isset($_POST["method"])){
        			$manager->callMethod($_POST["module"],$_POST["method"],$_POST["arguments"]);
        		}
        	}
        	die;
        }
        
        /**
        *
        */
        public function getXML(){
        	ob_clean();
        	header('Content-Type: text/xml');
        	$task = JRequest::getVar('f');     	
        	$manager = new moduleManager($res);
        	if($task =='tree')
        		echo $manager->getModulesXmlTree();
        	else if($task =='module'){
        		$module = $manager->getModule(JRequest::getVar('id'));
        		$manager->appendModule($module);
        		return $module->render();
        	}else if($task =='custom'){
        		echo $manager->getUserModules();
        	}else if($task =='system'){
        		echo $manager->getSystemModules();
        	}else if($task =='pages'){
        		$page = new pageManager();
        		echo $page->getPagesSet(JRequest::getVar('pages'));
        	}else if($task =='append'){
        		$module = $manager->getModule(JRequest::getVar('id'));
        		echo $manager->appendModule($module);
        	}
        	die;
        }
        
        /**
        *
        */
        public function getTpl(){
        	ob_clean();
        	$type = JRequest::getVar('type');
        	//echo file_get_contents(JUri::base());
        	echo file_get_contents(JUri::base()."components/com_manager/tpl/".$type.".tpl");
        	die;
        }
        
	/**
        *
        */
        function loadPage(){
            $page_id = JRequest::getVar('page_id');
            $db =& JFactory::getDBO();
            $sql = "SELECT uid, page_id, json FROM #__mb_modulesgrid WHERE page_id='".$page_id."'";
            $db->setQuery($sql);
            $rows = $db->loadAssocList();
            echo $rows[0]['json'];
            die;
	}
	
	/**
	*
	*/
	function savePage(){
		$page_id = JRequest::getVar('page_id');
		$json = JRequest::getVar('json');
		$db =& JFactory::getDBO();
		$sql = "SELECT uid FROM #__mb_modulesgrid WHERE page_id ='".$page_id."'";
		$db->setQuery($sql);
		$result = $db->loadResult();
		if($result){
			$sql = "UPDATE `#__mb_modulesgrid` SET `json` = '".$json."' WHERE page_id ='".$page_id."'";
			$db->setQuery($sql);
			$db->query();
		}
		else{
			$sql = "INSERT INTO `#__mb_modulesgrid` (`uid` ,`page_id`,`json`)VALUES (NULL , '".$page_id."', '".$json."');";
			$db->setQuery($sql);
			$db->query();
		}
		die;
	}
        
	/**
        *
        */
        function getResizeImage(){
        	ob_clean();
        	$id = JRequest::getVar('id');
        	//var
        	$defaultWidth = 135;
        	$defaultHeight = 150;
        	$host = new Host('joomla');

        	//file        	
        	$f = $host->gedcom->media->get($id);	
        	$filePath = substr(JURI::base(), 0, -1).$f->FilePath;

        	switch($f->Type){
        		case "jpg":
        			$src = imagecreatefromjpeg($filePath); 
        		break;
        		
        		case "gif":
        			$src = imagecreatefromgif($filePath); 
        		break;
        		
        		case "png":
        			$src = imagecreatefrompng($filePath); 
        		break;
        	}

        	$srcWidth = imagesx($src); 
        	$srcHeight = imagesy($src);

        	//get ratio
        	if($srcWidth>$defaultWidth&&$srcHeight>$defaultHeight){
        		$ratio = ($srcWidth>$srcHeight)?$srcWidth/$defaultWidth:$srcHeight/$defaultHeight;
        	} else if($srcWidth>$defaultWidth){
        		$ratio = $srcWidth/$defaultWidth;
        	} else if($srcHeight>$defaultHeight){
        		$ratio = $srcHeight/$defaultHeight;
        	} else {
        		$ratio = ($srcWidth<$srcHeight)?$srcHeight/$defaultHeight:$srcWidth/$defaultWidth;
        	} 

        	//create new image
        	$width = round($srcWidth/$ratio);
        	$height = round($srcHeight/$ratio);
        	
        	$img = imagecreatetruecolor($width,$height);
        	imagecopyresampled($img, $src, 0, 0, 0, 0, $width, $height, $srcWidth, $srcHeight);
        	
        	$im = imagecreatetruecolor($defaultWidth,$defaultHeight);
        	$black = imagecolorallocate($im, 0, 0, 0);
        	$white = imagecolorallocate($im, 255, 255, 255);
        	imagefill($im, 0, 0, $white);
        	$destX = ($width<$defaultWidth)?($defaultWidth-$width)/2:0;
        	$destY = ($height<$defaultHeight)?($defaultHeight-$height)/2:0;
        	imagecopy($im, $img, $destX, $destY, 0, 0, $width, $height);
        	if($f->Type == 'gif' || $f->Type == 'png'){
        		imagecolortransparent($im, $black);
        	}
        	header("Content-type: image/".$f->Type); 
        	switch($f->Type){
        		case "jpg":
        			imagejpeg($im); 
        		break;
        		
        		case "gif":
        			imagegif($im); 
        		break;
        		
        		case "png":
        			imagepng($im); 
        		break;
        	}
        	imagedestroy($im);
        	imagedestroy($img); 
        	imagedestroy($src); 
        	die();
        }
	
	
        /**
        *
        */
        /*
	* OLD FUNCTION NOT USE
        function getPageLayout(){
            $str = "<script>
                function loadPage(panel, id, layout){
                    var manager = new MyBranchesManager();
                    var path = manager.getLayoutUrl(layout);
                    $.ajax({
                        url: path,
                        type: \"GET\",
                        dataType: \"html\",
                        complete : function (req, err) {

                        $(panel).html(req.responseText);
                        $.ajax({
                            url: 'index.php?option=com_manager&task=loadPage&page_id='+id,
                            type: \"GET\",
                            dataType: \"html\",
                            complete : function (req, err) {
                                var string = jQuery.trim(req.responseText);
                                if(string != \"\"){
                                    var obj = eval( '(' + string + ')' );
                                    var manager = new MyBranchesManager();
                                    manager.renderPage(obj);
                                }
                            }
                        });
                    }
                });
            }";
            return $str;
        }
        
	
	function gedcom(){
		$db =& JFactory::getDBO();
		switch(JRequest::getVar('f')){
			case 'getUserInfo':
				$sql = "SELECT * FROM #__mb_indiv WHERE indkey ='".JRequest::getVar('id')."'";
				$db->setQuery($sql);
				$rows = $db->loadAssocList();
				echo $rows[0]['indkey'].'-'.$rows[0]['surname'].'-'.urldecode($rows[0]['givenname']).'-'.$rows[0]['sex'];
			break;

			case 'parser':
                            $host = new Host(null);
                            $host->gedcom->Import($_FILES['gedcom']['tmp_name']);
			break;
		}

		die;
	}
	*/
}
?>



