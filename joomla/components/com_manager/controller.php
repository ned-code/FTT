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
        
        /*
        protected function get_categories($type){
        	$db =& JFactory::getDBO();
        	switch($type){
        		case "login":
        			$sql = "SELECT p_id as id FROM #__mb_categories WHERE name='login'";
        		break;
        	
        		case "first":
        			$sql = "SELECT p_id as id FROM #__mb_categories WHERE name='first'";
        		break;
        	
        		case "invitation":
        			$sql = "SELECT p_id as id FROM #__mb_categories WHERE name='invitation'";
        		break;	
        	}
        	$db->setQuery($sql);
        	$rows = $db->loadAssocList();
        	return $rows[0]['id'];
        }
        */
        
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

        protected function getCurrentAlias(){
		$menu   = &JSite::getMenu();
		$active   = $menu->getActive();
		return $active->alias;
	}
		
	protected function location($alias){
		header('Location:'.JURI::base().'index.php/'.$alias);
		exit();
	}
	
	protected function invite($fid, $token, $redirect=true){
		$host = new Host('joomla');
        	$db =& JFactory::getDBO();
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
        	}
        	$host->createCashFamilyLine($args[1],$args[0]);
        	if($redirect){
        		$_SESSION['jmb']['alias'] = 'myfamily';
        		$this->location($_SESSION['jmb']['alias']);
        	}
        	exit;
        }
        
        protected function curl_get_file_contents($URL) {
	    $c = curl_init();
	    curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
	    curl_setopt($c, CURLOPT_SSL_VERIFYPEER, false);
	    curl_setopt($c, CURLOPT_URL, $URL);
	    $contents = curl_exec($c);
	    $err  = curl_getinfo($c,CURLINFO_HTTP_CODE);
	    curl_close($c);
	    if ($contents) return $contents;
	    else return FALSE;
	}
        
        protected function facebookAccessTokenExpired($fb){
        	$code = $_REQUEST["code"];
        	if (isset($code)) {
        		$token_url="https://graph.facebook.com/oauth/access_token?client_id=";
        		$token_url .= JMB_FACEBOOK_APPID;
        		$token_url .= "&redirect_uri=";
        		$token_url .= urlencode(JMB_FACEBOOK_URL);
        		$token_url .= "&client_secret=";
        		$token_url .= JMB_FACEBOOK_SECRET;
        		$token_url .= "&code=";
        		$token_url .= $code;
        		$token_url .= "&display=popup";
        		
        		$response = file_get_contents($token_url);
        		$params = null;
        		parse_str($response, $params);
        		$access_token = $params['access_token'];
        	}
        	
        	$graph_url = "https://graph.facebook.com/me?access_token=".$access_token;
        	$response = $this->curl_get_file_contents($graph_url);
        	$decoded_response = json_decode($response);
        	
        	if ($decoded_response->error) {
        		if ($decoded_response->error->type== "OAuthException") {
        			$dialog_url= "https://www.facebook.com/dialog/oauth?client_id".JMB_FACEBOOK_APPID."&redirect_uri=".urlencode(JMB_FACEBOOK_URL);
        			//echo("<script> top.location.href='" . $dialog_url . "'</script>");
        			echo $dialog_url;
        		} else {
        			echo "other error has happened";
        		}
        	} else {
        		 echo("success" . $decoded_response->name);
        		 echo($access_token);
        	}
        
        }
        
        public function jmb($fb){
        	$task = JRequest::getCmd('task');
        	$option = JRequest::getCmd('option');
        	$view = JRequest::getCmd('view');
        	$id = JRequest::getCmd('id');
        	$token = JRequest::getCmd('token');
        	
        	if($option!='com_manager') exit();
        	if(strlen($task)!=0) return;
        	
        	$host = new Host('joomla');
        	$fb_session = $fb->getSession();
        	$user = ($fb_session)?$fb->api('/me'):false;
        	
        	if(strlen($token)!=0){
        		$_SESSION['jmb']['alias'] = 'invitation';
        		$_SESSION['jmb']['token'] = $token;
        	}
        	
        	$current_alias = $this->getCurrentAlias();
        	$alias = (isset($_SESSION['jmb']['alias']))?$_SESSION['jmb']['alias']:'home';
        	if($current_alias != $alias){ 
        		$this->location($alias);
        	} else{    
        		switch($current_alias){
        			case 'home':
        				if(isset($user['id'])){
        					$_SESSION['jmb']['fid'] = $user['id'];
        					$link = $this->check_user_in_system($user['id']);
        					if($link){
        						$_SESSION['jmb']['tid'] = $link['tid'];
        						$_SESSION['jmb']['gid'] = $link['gid'];
        						$_SESSION['jmb']['permission'] = $link['type'];
        					}
        				} else {
        					$_SESSION['jmb']['fid'] = null;
        					$_SESSION['jmb']['alias'] = 'login';
        					$this->location($_SESSION['jmb']['alias']);
        				}
        			break;
        		
        			case 'first-page':
        				if(!isset($user['id'])){
        					$_SESSION['jmb']['alias'] = 'login';	
        					$this->location($_SESSION['jmb']['alias']);
        				} else {
        					$link = $this->check_user_in_system($user['id']);
        					if($link){
        						$_SESSION['jmb']['alias'] = 'myfamily';
        						$this->location($_SESSION['jmb']['alias']);
        					}
        				}
        				
        			break;
        			
        			case 'login':
        				if(isset($user['id'])){
        					$link = $this->check_user_in_system($user['id']);
        					if($link){
        						$_SESSION['jmb']['alias'] = 'myfamily';
        					} else {
        						$_SESSION['jmb']['alias'] = 'home';
        					}       					
        					$this->location($_SESSION['jmb']['alias']);
        				}
        			break;
        			
        			case 'famous-family':
        				$_SESSION['jmb']['login_type'] = 'famous_family';
        				$_SESSION['jmb']['gid'] = null;
					$_SESSION['jmb']['tid'] = null;
					$_SESSION['jmb']['permission'] = null;
        			break;
        			
        			case 'myfamily':
        				if(isset($_SESSION['jmb']['login_type'])&&$_SESSION['jmb']['login_type']=='famous_family'&&$_SESSION['jmb']['tid']!=null){
        					
        				} else {
						if(!isset($user['id'])){
							$_SESSION['jmb']['alias'] = 'login';	
							$this->location($_SESSION['jmb']['alias']);
						}        			
						$link = $this->check_user_in_system($user['id']);
						
						if(!$link&&$current_alias!='first-page'){
							$_SESSION['jmb']['alias'] = 'first-page';
							$this->location($_SESSION['jmb']['alias']);
						}
						
						$_SESSION['jmb']['fid'] = $user['id'];
						$_SESSION['jmb']['gid'] = $link['gid'];
						$_SESSION['jmb']['tid'] = $link['tid'];
						$_SESSION['jmb']['permission'] = $link['type'];
						$_SESSION['jmb']['login_type'] = 'family_tree';
						$this->update_login_time($link['gid']);
						//$host->checkCashFamilyLine($link['tid'], $link['gid']); 
					}
        			break;
        			
        			case 'invitation':
        				if(!isset($user['id'])){
						$_SESSION['jmb']['alias'] = 'login';	
						$this->location($_SESSION['jmb']['alias']);
					} 
        				$this->invite($user['id'], $_SESSION['jmb']['token']);
        			break;
        		}
        	}
        }
        /*
        public function _jmb($fb){
        	$task = JRequest::getCmd('task');
        	$option = JRequest::getCmd('option');
        	$view = JRequest::getCmd('view');
        	$id = JRequest::getCmd('id');
        	$host = new Host('joomla');

        	if($option!='com_manager') exit(); 
        	
        	$session = $fb->getSession();
        	$fid = ($session)?$fb->getUser():null;

        	$invitation_page_id = $this->get_categories('invitation');
        	if($view=='single'&&$id==$invitation_page_id&&!$task){
        		$token = JRequest::getCmd('token');
        		if(!$session){
        			$_SESSION['jmb']['invitation'] = $token;
        			header('Location:'.JURI::base().'index.php/login');
        		} else {
        			$this->invite($fid, $token);
        		}
        	}
        	
        	if(!$session){
        		$login_page_id = $this->get_categories('login');
        		if($id!=$login_page_id&&!$task){
        			header('Location:'.JURI::base().'index.php/login');
        		}
        	} else {
        		if(isset($_SESSION['jmb']['invitation'])){
        			$this->invite($fid, $_SESSION['jmb']['invitation']);
        		}
        		$_SESSION['jmb']['fid'] = $fid;
        		$link = $this->check_user_in_system($fid);
        		if($task) return;        		
        		if(empty($link)){
        			$cat_id = $this->get_categories('first');
        			if($id!=$cat_id&&!$task){
        				header('Location:'.JURI::base().'index.php/first-page');
        			}
        		} else if($view!='multi'){ 
        			header('Location:'.JURI::base().'index.php');
        		} else {
        			$_SESSION['jmb']['gid'] = $link['gid'];
        			$_SESSION['jmb']['tid'] = $link['tid'];
        			$_SESSION['jmb']['permission'] = $link['type'];
        			$this->update_login_time($link['gid']);
        			$host->checkCashFamilyLine($link['tid'], $link['gid']);
        		}
        	}        	
        }
        */
        
        public function setLocation(){
        	$alias = JRequest::getCmd('alias');
        	$_SESSION['jmb']['alias'] = $alias;
        }
        
        public function timeout(){
        	ob_clean();
        	echo isset($_SESSION['jmb']);
        	exit();
        }
}
?>



