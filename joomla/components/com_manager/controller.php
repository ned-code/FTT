<?php
# Check to ensure this file is included in Joomla!
defined('_JEXEC') or die( 'Restricted access' );

//require JPATH_ROOT.'/components/com_manager/php/pageManager.php';
//require JPATH_ROOT.'/components/com_manager/php/moduleManager.php';
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
        
        protected function getFiles($dir){
        	$files = array();
        	if($dh = opendir($dir)) {
        		while (($file = readdir($dh)) !== false) {
        			if($file!='.'&&$file!='..'&&$file!='index.html'){
        				$file_parts = explode('.', $file);
        				$end_file_part = end($file_parts);
        				if($end_file_part=='css'||$end_file_part=='js'){
        					$files[] = $file;
        				}
        			}
        		}
        	}
        	return $files;
        }
        
        protected function getIncludesFiles($module_name, $path){
        	$module_path = $path.DS.$module_name;
        	$css_dir = $module_path.DS.'css';
        	$js_dir = $module_path.DS.'js';
        	$files = array();
        	$files['js'] = $this->getFiles($js_dir);
        	$files['css'] = $this->getFiles($css_dir);
        	return $files;        	
        }
        
        protected function getModuleObjectName($module_name){
        	$name_parts = explode('_', $module_name);
        	$mod_name = 'JMB';
        	foreach($name_parts as $part){
        		$mod_name .= ucfirst(strtolower($part));
        	}
        	$mod_name .= 'Object';
        	return $mod_name;
        }
        
        protected function getModuleContainerId($module_name){
        	$name_parts = explode('_', $module_name);
        	$mod_name = 'JMB';
        	foreach($name_parts as $part){
        		$mod_name .= ucfirst(strtolower($part));
        	}
        	$mod_name .= 'Container';
        	return $mod_name;	
        }
        
        protected function parseModulesGrid($json_string, $path){
        	$db =& JFactory::getDBO();
        	$json_object = json_decode($json_string);
        	
        	//get all modules
        	$sql_string = "SELECT id, name, title, description, is_system FROM #__mb_modules";
        	$db->setQuery($sql_string);
        	$modules_table = $db->loadAssocList();
        	$mod_table = array();
        	foreach($modules_table as $mod){
        		$mod_table[$mod['id']] = $mod;
        	}
        	        	        	
        	$modules = array();
        	foreach($json_object as $td){
        		if(is_object($td)){
        			foreach($td as $div){
        				if(is_object($div)){
        					$mod_name = $mod_table[$div->id]['name'];
        					$mod = array();
        					$mod['info'] = $mod_table[$div->id];
        					$mod['files'] = $this->getIncludesFiles($mod_name, $path);
        					$mod['object_name'] = $this->getModuleObjectName($mod_name);
        					$mod['container_id'] = $this->getModuleContainerId($mod_name);
        					$modules[$div->id] = $mod;
        				}
        			}
        		}
        	}
        	return $modules;
        }
        
        public function getPageInfo(){
        	ob_clean();
        	$db =& JFactory::getDBO();
        	$host = new Host('Joomla');
        	$ids = explode('|', JRequest::getVar('ids'));
        	
        	$jpath_base_explode = explode('/', JPATH_BASE);
        	if(end($jpath_base_explode) == 'administrator'){
        		array_pop($jpath_base_explode); 
        	}
        	$jpath_base = implode('/', $jpath_base_explode);
        	$path = $jpath_base.DS.'components'.DS.'com_manager'.DS.'modules';
        	
        	//get all pages
        	$sql_string = "SELECT content.id, content.layout_type, content.title, grid.json FROM #__mb_content as content LEFT JOIN jos_mb_modulesgrid as grid ON grid.page_id = content.id";
        	$db->setQuery($sql_string);
        	$content_table = $db->loadAssocList();
        	
        	$pages = array();
        	foreach($content_table as $page){
        		foreach($ids as $id){
        			if($page['id'] == $id){
        				$p = array();
        				$p['page_info'] = $page;
        				$p['grid'] = json_decode($page['json']);
        				$p['modules'] = $this->parseModulesGrid($page['json'], $path); 
        				$pages[] = $p;
        			}
        		}
        	}
        	echo json_encode(array('pages'=>$pages));
        	exit;
        }
        
        /**
        *
        */
        public function getModule(){	
        	ob_clean();
        	header('Content-Type: text/html');
        	$id = JRequest::getVar('id');
        	$task = JRequest::getVar('f');
        	$manager = new moduleManager();
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
        	$manager = new moduleManager();
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
        	$manager = new moduleManager();
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
        	$manager = new moduleManager();
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
	
	protected function getImageByMime($mime, $filePath){
		switch($mime){
        		case "jpg":
        		case "jpeg":
        			$img = imagecreatefromjpeg($filePath); 
        		break;
        		
        		case "gif":
        			$img = imagecreatefromgif($filePath); 
        		break;
        		
        		case "png":
        			$img = imagecreatefrompng($filePath); 
        		break;
        	}
        	return $img;
	}
	
	protected function Image($img, $type, $tmpFile=null){
		switch($type){
        		case "jpg":
        		case "jpeg":
        			imagejpeg($img, $tmpFile); 
        		break;
        		
        		case "gif":
        			imagegif($img, $tmpFile); 
        		break;
        		
        		case "png":
        			imagepng($img, $tmpFile); 
        		break;
        	}
	}
        
	/**
        *
        */
        function getResizeImage(){
        	$id = JRequest::getVar('id');
        	$fid = JRequest::getVar('fid');
        	$uid = ($id)?$id:$fid;
        	$defaultWidth = JRequest::getVar('w');
        	$defaultHeight = JRequest::getVar('h');
        	
        	//var
        	$host = new Host('joomla');
        	$path = JPATH_ROOT."/components/com_manager/media/tmp/";
        	
        	//file        	
        	if($id){
        		$f = $host->gedcom->media->get($id);	
        		$filePath = substr(JURI::base(), 0, -1).$f->FilePath;
        	} else {
        		$filePath = 'http://graph.facebook.com/'.$fid.'/picture?type=large';
        	}
        	$size = getimagesize($filePath);
        	$type = explode('/', $size['mime']);
        	$hash = hash_file('md5', $filePath);
        	$tmpFile = $path.$uid.'.'.$hash.'.'.$defaultWidth.'.'.$defaultHeight.'.'.$type[1];
        	
        	if(file_exists($tmpFile)){
        		$img = $this->getImageByMime($type[1], $tmpFile);
        		ob_clean();
        		header("Content-type: image/".$type[1]);
        		$this->Image($img, $type[1]);
        		imagedestroy($img);
        		die;
        	}
        	
        	$src = $this->getImageByMime($type[1], $filePath);
        	$srcWidth = imagesx($src); 
        	$srcHeight = imagesy($src);

        	//get ratio        	
        	if($srcWidth>$defaultWidth&&$srcHeight>$defaultHeight){
        		$ratio = ($srcWidth>=$srcHeight)?$srcHeight/$defaultHeight:$srcWidth/$defaultWidth;
        	} else if($srcWidth>$defaultWidth){
        		$ratio = $srcHeight/$defaultHeight;
        	} else if($srcHeight>$defaultHeight){
        		$ratio = $srcWidth/$defaultWidth;
        	} else {
        		$ratio = ($srcWidth<$srcHeight)?$srcWidth/$defaultWidth:$srcHeight/$defaultHeight;
        	}
        	
        	
        	//create new image
        	$width = round($srcWidth/$ratio);
        	$height = round($srcHeight/$ratio);
        	
        	//$img = imagecreatetruecolor($width,$height);
        	//imagecopyresampled($img, $src, 0, 0, 0, 0, $width, $height, $srcWidth, $srcHeight);
        	
        	$src_x = ($width>$defaultWidth)?round(($width-$defaultWidth)/2):0;
        	$src_y = ($height>$defaultHeight)?round(($height-$defaultHeight)/2):0;

        	$img = imagecreatetruecolor($defaultWidth,$defaultHeight);
        	imagecopyresampled($img, $src, 0, 0, $src_x, $src_y, $width, $height, $srcWidth, $srcHeight);

        	ob_clean();
        	header("Content-type: image/".$type[1]); 
        	$this->Image($img, $type[1], $tmpFile);
        	$this->Image($img, $type[1]);
        	imagedestroy($img);
        	imagedestroy($src); 
        	die();
        }
         
        protected function getCurrentAlias(){
		$menu   = &JSite::getMenu();
		$active   = $menu->getActive();
		return $active->alias;
	}
	
	protected function check_user_in_system($fid){
        	$db =& JFactory::getDBO();
        	$sql = "SELECT link.individuals_id as gid, link.tree_id as tid, link.type FROM #__mb_tree_links as link LEFT JOIN #__mb_individuals as ind ON ind.id = link.individuals_id WHERE ind.fid='".$fid."'";
        	$db->setQuery($sql);
        	$rows = $db->loadAssocList();
        	return ($rows!=null)?$rows[0]:false;
        }

        protected function update_login_time ($gid){
        	$db =& JFactory::getDBO();
        	$mysqldate = date('Y-m-d H:i:s');
        	$sql = "UPDATE #__mb_individuals as ind SET last_login='".$mysqldate."' WHERE ind.id ='".$gid."'";
        	$db->setQuery($sql);
        	$db->query();
        }
	
	protected function get_current_alias(){
		$menu   = &JSite::getMenu();
		$active   = $menu->getActive();
		return $active->alias;
	}
	
	protected function get_logged_user($facebook){      	
        	try{
        		$me = $facebook->api('/me');
        		$user = (isset($me['id']))?$me['id']:false;
        	} catch (FacebookApiException $e) {
        		$user = false;
        	}
        	return $user;
	}
	
	protected function get_alias($logged, $current_alias){
		$alias = (isset($_SESSION['jmb']['alias']))?$_SESSION['jmb']['alias']:'myfamily';
		$link = ($logged)?$this->check_user_in_system($logged):false;
		$famous_family_login = (isset($_SESSION['jmb']['login_type'])&&$_SESSION['jmb']['login_type']=='famous_family');
		if(isset($_SESSION['jmb']['invitation'])){
			$alias = 'invitation';
		}
		switch($alias){
			case 'invitation':
				if(!$logged) return 'login';
				if($logged&&!$link) return 'home';
				return $alias;
			break;
			
			case 'login':
				if($logged&&!$link) return 'first-page';
				if($logged) return 'myfamily';
				return $alias;
			break;
				
			case "first-page":
				if(!$logged) return 'login';
				if($logged&&$link) return 'myfamily';
				return $alias;
			break;
			
			case 'home':
				return $alias;
			break;
			
			case 'famous-family':
				return $alias;
			break;
			
			case 'myfamily':	
				if($famous_family_login) return 'myfamily';
				if(!$logged&&!$link) return 'login';
				if($logged&&!$link) return 'first-page';
				return $alias;
			break;
		}
	}
		
	protected function location($alias){
		header('Location:'.JURI::base().'index.php/'.$alias);
		exit();
	}
	
	protected function invite($fid, $token, $redirect=true){
		$host = new Host('joomla');
        	$this->db = new JMBAjax();
        	
        	$sql = "SELECT value FROM #__mb_variables WHERE belongs='".$token."'";
        	$db->setQuery($sql);
        	$rows = $db->loadAssocList();
        	
        	if($rows==null) header('Location:index.php');
        	$args = explode(',', $rows[0]['value']);
        	
        	$sql = "UPDATE #__mb_tree_links SET `type`='USER' WHERE individuals_id ='".$args[0]."' AND tree_id='".$args[1]."'";
        	$db->setQuery($sql);
        	$db->query();
        	
        	$sql = "UPDATE #__mb_individuals SET `fid`='".$fid."',`change` = NOW() WHERE id='".$args[0]."'";
        	$db->setQuery($sql);
        	$db->query();
        	
        	$sql = "DELETE FROM #__mb_variables WHERE belongs='".$token."'";
        	$db->setQuery($sql);
        	$db->query();
        	
        	if(isset($_SESSION['jmb']['invitation'])){
        		unset($_SESSION['jmb']['invitation']);
        		unset($_SESSION['jmb']['token']);
        	}
        	
        	if($redirect){
        		$_SESSION['jmb']['alias'] = 'myfamily';
        		$this->location($_SESSION['jmb']['alias']);
        	}
        	exit;
        }
        
        public function jmb(){      	
        	$task = JRequest::getCmd('task');
        	$option = JRequest::getCmd('option');
        	$view = JRequest::getCmd('view');
        	$id = JRequest::getCmd('id');
        	$token = JRequest::getCmd('token');
       	
        	if($option!='com_manager') exit();
        	if(strlen($task)!=0) return;
        	
        	$host = new Host('joomla');
        	
        	if(strlen($token)!=0){
        		$_SESSION['jmb']['invitation'] = true;
        		$_SESSION['jmb']['token'] = $token;
        	}
        	
        	//include and init facebook class
        	require_once(JPATH_COMPONENT.DS.'php'.DS.'facebook.php');
        	$facebook = new Facebook(array('appId'=>$_SESSION['jmb']['JMB_FACEBOOK_APPID'],'secret'=>$_SESSION['jmb']['JMB_FACEBOOK_SECRET'],'cookie'=>$_SESSION['jmb']['JMB_FACEBOOK_COOKIE']));

        	//check alias var;
        	$logged = $this->get_logged_user($facebook);
        	$current_alias = $this->get_current_alias();
        	$alias = $this->get_alias($logged, $current_alias);
        	
        	if($current_alias != $alias){ 
        		$_SESSION['jmb']['alias'] = $alias;
        		$this->location($alias);
        	} else{    
        		switch($current_alias){
        			case 'invitation':
        				$this->invite($user['id'], $_SESSION['jmb']['token']);
        			break;
        			
        			case 'first-page':
        			case 'login':
        			case 'home':
        			break;
        			
        			case 'famous-family':
        			break;
        			
        			case 'myfamily':
        				if(isset($_SESSION['jmb']['login_type'])&&$_SESSION['jmb']['login_type']=='famous_family'){
        					$host->gedcom->relation->check($_SESSION['jmb']['tid'], $_SESSION['jmb']['gid']);    
        					$host->usertree->init($_SESSION['jmb']['tid'], $_SESSION['jmb']['gid'], $_SESSION['jmb']['permission']);
        				} else {
						$link = $this->check_user_in_system($logged);
						$_SESSION['jmb']['fid'] = $logged;
						$_SESSION['jmb']['gid'] = $link['gid'];
						$_SESSION['jmb']['tid'] = $link['tid'];
						$_SESSION['jmb']['permission'] = $link['type'];
						$_SESSION['jmb']['login_type'] = 'family_tree';
						$_SESSION['jmb']['config'] = $host->getConfig();
						$host->gedcom->relation->check($link['tid'],$link['gid']);
						$host->usertree->init($link['tid'], $link['gid'], $link['type']);
						$this->update_login_time($link['gid']);
					}
        			break;
        		}
        	}
        }

        public function setLocation(){
        	$alias = JRequest::getCmd('alias');
        	$_SESSION['jmb']['alias'] = $alias;
        	switch($alias){
        		case 'myfamily':
        			$_SESSION['jmb']['login_type'] = 'family_tree';
        		case 'famous-family':
        		case 'home':
        		break;
        	}
        	exit;
        }
        
        public function timeout(){
        	echo 'ping!';
        	exit();
        }
}
?>



