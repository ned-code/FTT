<?php
# Check to ensure this file is included in Joomla!
defined('_JEXEC') or die( 'Restricted access' );

require JPATH_ROOT.'/components/com_manager/php/host.php';

jimport('joomla.application.component.controller' );

class JMBController extends JController
{	
        /**
        * Method to display the view
        *
        * @access    public
        */
        function display() {
            parent::display();
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

	public function getResizeImage(){
        $host = new Host('Joomla');
        $host->images->getImage(JRequest::getVar('tree_id'),JRequest::getVar('id'), JRequest::getVar('fid'), JRequest::getVar('w'), JRequest::getVar('h'));
        exit;
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

	protected function get_alias($user_data, $facebook_id){
		$session = JFactory::getSession();
		$invitation = $session->get('invitation');
		$alias = $session->get('alias');
		$login_method = $session->get('login_method');

		if(!empty($invitation)){
			return 'invitation';
		}		
		switch($alias){
			case "invitation":
				if(!$facebook_id) return "login";
				return "invitation";
			break;
			
			case "home":
				return "home";
			break;
			
			case "famous-family":
				return "famous-family";
			break;
		
			case "login":
				if($facebook_id&&$user_data) return "myfamily";
				if($facebook_id&&!$user_data) return "first-page";
				return "login";
			break;
			
			case "first-page":
				if(!$facebook_id) return "login";
				return "first-page";
			break;
			
			case "myfamily":
				if(!empty($login_method)&&$login_method=="famous_family") {
					return "myfamily";
				}
				if(!$facebook_id) return "login";
				if(!$user_data) return "first-page";
				return "myfamily";			
			break;
			
			default:
				if(!$facebook_id) return "login";
				if(!$user_data) return "first-page";
				return "myfamily";
			break;
		}
	}
		
	protected function location($alias){
		header('Location:'.JURI::base().'index.php/'.$alias);
		exit();
	}
	
	protected function invite($fid, $token, $redirect=true){
		    $host = new Host('joomla');
        	$session = JFactory::getSession();
        	$app = JFactory::getApplication();
        	
        	$sql = "SELECT value FROM #__mb_variables WHERE belongs=?";
            $host->ajax->setQuery($sql, $token);
        	$rows = $this->db->loadAssocList();

        	if($rows==null) $this->location('home');
        	$args = explode(',', $rows[0]['value']);

        	
        	$sql = "UPDATE #__mb_tree_links SET `type`='USER' WHERE individuals_id =? AND tree_id=?";
            $host->ajax->setQuery($sql, $args[0], $args[1]);
            $host->ajax->query();
        	
        	$sql = "UPDATE #__mb_individuals SET `fid`=?,`change` = NOW(), `join_time`= NOW() WHERE id=?";
            $host->ajax->setQuery($sql, $fid, $args[0]);
            $host->ajax->query();
        	
        	$sql = "DELETE FROM #__mb_variables WHERE belongs=?";
            $host->ajax->setQuery($sql, $token);
            $host->ajax->query();
        	
        	$invitation = $session->get('invitation');
        	if(!empty($invitation)){        		
        		$session->clear('invitation');
        		$session->clear('token');
        	}
        	
        	if($redirect){
        		$session->set('alias', 'myfamily');
        		$this->location('myfamily');
        	}
        	exit;
        }
        
        protected function get_user_data($facebook_id){
        	if($facebook_id){
        		$link = $this->check_user_in_system($facebook_id);
        		return ($link)?array('facebook_id'=>$facebook_id, 'gedcom_id'=>$link['gid'], 'tree_id'=>$link['tid'], 'permission'=>$link['type']):$link;
        	} else {
        		return false;
        	}
        }
        
        protected function set_user_data($user_data){
        	if($user_data){
        		$session = JFactory::getSession();
        		$session->set('gedcom_id', $user_data['gedcom_id']);
        		$session->set('tree_id', $user_data['tree_id']);
        		$session->set('permission', $user_data['permission']);
                $session->set('facebook_id', $user_data['facebook_id']);
        		return true;
        	}
        	return false;
        }
        
        protected function clear_user_data(){
        	$session = JFactory::getSession();
        	$session->clear('gedcom_id');
        	$session->clear('tree_id');
        	$session->clear('permission');
        	$session->clear('facebook_id');
        }
        
        protected function get_facebook_id(){
        	$session = JFactory::getSession();
        	$jfb = JFBConnectFacebookLibrary::getInstance();
        	
        	if($logged = $jfb->getUserId()){
        		return $logged;
        	}
        	if($facebook_id = $session->get('facebook_id')){
        		return $facebook_id;
        	}
        	return false;
        }
                
        public function jmb(){      	
        	$task = JRequest::getVar('task');
        	$option = JRequest::getVar('option');
        	$view = JRequest::getVar('view');
        	$id = JRequest::getVar('id');
        	$token = JRequest::getVar('token');
        	$canvas = JRequest::getVar('canvas');
        	    	
        	if($option!='com_manager') exit();
        	if(strlen($task)!=0) return;
        	
        	$host = new Host('joomla');
        	$app = JFactory::getApplication();
        	$session = JFactory::getSession();
        	$jfb = JFBConnectFacebookLibrary::getInstance();
        	
        	if((bool)$canvas){
        		$session->set('alias', 'myfamily');
        		header('Location: https://www.facebook.com/dialog/oauth?client_id='.JMB_FACEBOOK_APPID.'&redirect_uri='.JURI::base().'index.php/myfamily');
     			exit;
        	}

        	if(strlen($token)!=0){
        		$session->set('invitation', true);
        		$session->set('token', $token);
        	}
        	
        	$facebook_id = $this->get_facebook_id();
        	$user_data = $this->get_user_data($facebook_id);
        	
        	$current_alias = $this->get_current_alias();
        	$alias = $this->get_alias($user_data, $facebook_id);

        	if($current_alias != $alias){ 
        		$this->location($alias);
        	} else{    
        		switch($current_alias){
        			case 'invitation':
        				$this->set_user_data($user_data);
        				$this->invite($facebook_id, $token);
        				$session->set('alias', $current_alias);
        			break;
        			
        			case 'first-page':
        				$this->clear_user_data();
        				$session->set('facebook_id', $facebook_id);
        				$session->set('alias', $current_alias);
        			break;
        				
        			case 'login':
        			case 'home':
        				$this->set_user_data($user_data);
        				$session->set('alias', $current_alias);
        			break;
        			
        			case 'famous-family':
        				$this->set_user_data($user_data);
        				$session->set('alias', $current_alias);
        			break;
        			
        			case 'myfamily':
        				$login_method = $session->get('login_method');
        				if(!empty($login_method)&&$login_method=='famous_family'){
        					$gedcom_id = $session->get('gedcom_id');
        					$tree_id = $session->get('tree_id');
        					$permission = $session->get('permission');
        					
        					$session->set('settings', $host->getConfig());
        					$host->gedcom->relation->check($tree_id, $gedcom_id);    
        					$host->usertree->saveFamilyLine($tree_id, $gedcom_id, $permission);
        					$host->usertree->init($tree_id, $gedcom_id, $permission);
        				} else {        					       					
						$this->set_user_data($user_data);
        					$session->set('settings', $host->getConfig());
        					$session->set('login_method', 'myfamily');
        					$host->gedcom->relation->check($user_data['tree_id'],$user_data['gedcom_id']);
        					$host->usertree->saveFamilyLine($user_data['tree_id'], $user_data['gedcom_id'], $user_data['permission']);
						$host->usertree->init($user_data['tree_id'], $user_data['gedcom_id'], $user_data['permission']);
						$this->update_login_time($user_data['gedcom_id']);
					}
					$session->set('alias', $current_alias);
        			break;
        		}
        	}
        }

        public function notifications(){
            $host = new Host('Joomla');
        	switch(JRequest::getVar('type')){
        		case "request":
        			$id = JRequest::getVar('id');
        			$status = JRequest::getVar('status');
        			if($status == 'accept'){
        				$sql_string = "UPDATE #__mb_notifications SET `status` = ? WHERE `id` = ?";
        				$host->ajax->setQuery($sql_string, 1, $id);
                        $host->ajax->query();
        			} else if($status == 'deny'){
        				$message = preg_replace('/%([0-9a-f]{2})/ie', 'chr(hexdec($1))', (string) JRequest::getVar('message'));
        				$data = json_decode(JRequest::getVar('data'));
        				
        				require_once("Mail.php");
        				$target_name = explode(" ", $data->target->name);
        				$me_name = explode(" ", $data->me->name);
        				#recipient  
        				$to = "<".$data->me->email.">";
        				$from = "<familytreetop@gmail.com>";
		
        				#subject
        				$subject = "Family Treetop invitation.";  
        				
        				$host = "ssl://smtp.gmail.com";
        				$port = "465";
        				$username = "familytreetop@gmail.com";
        				$password = "3d#@technology";

        				#mail body 
                        $mail_body = '<html><head>Family TreeTop invitation.</head><body>';
                        $mail_body .= "<div style='margin:10px;'>Dear ".$data->me->name.",</div>";
                        $mail_body .= "<div style='margin:10px;'>".$data->target->name." has denied your Family TreeTop invitation request.";
                        $mail_body .= " He does not  believe that you are member of his family. If you still think thay you are related to ";
                        $mail_body .= $target_name[0].", you may send him one last message to provide more information.</div>";
                        $mail_body .= "<div style='margin-left:10px;'>".$target_name[0]." Writes:</div>";
                        $mail_body .= "<div style='margin-left:10px;'>".$message."</div>";
                        $mail_body .= '</body></html>';

                        $headers = array ("MIME-Version"=> '1.0', "Content-type" => "text/html; charset=iso-8859-1",'From' => $from,'To' => $to,'Subject' => $subject);

                        $smtp = Mail::factory('smtp',array ('host' => $host,'port' => $port,'auth' => true,'username' => $username,'password' => $password));

                        $mail = $smtp->send($to, $headers, $mail_body);

                        if (PEAR::isError($mail)) {
                            echo json_encode(array('message'=>'Message delivery failed...'));

                        } else {
                            echo json_encode(array('message'=>'Message successfully sent!'));
                        }

                        $sql_string = "UPDATE #__mb_notifications SET `processed` = 1, `status` = ? WHERE `id` = ?";
                        $host->ajax->setQuery($sql_string, 2, $id);
                        $host->ajax->query();
                     }
        		break;
        		
        		case "processed":
        			$facebook_id = JRequest::getVar('facebook_id');
        			$gedcom_id = JRequest::getVar('gedcom_id');
        			$tree_id = JRequest::getVar('tree_id');
        			$request_id = JRequest::getVar('request_id');
        			
        			$sql_string = "UPDATE #__mb_notifications SET `processed` = 1 WHERE `id` = ?";
                    $host->ajax->setQuery($sql_string, $request_id);
                    $host->ajax->query();
        			
        			$sql_string = "UPDATE #__mb_tree_links SET `type` = 'USER' WHERE `individuals_id` = ? AND `tree_id` = ?";
                    $host->ajax->setQuery($sql_string, $gedcom_id, $tree_id);
                    $host->ajax->query();
        			
        			$i = $host->gedcom->individuals->get($gedcom_id);
        			$i->FacebookId = $facebook_id;
        			$host->gedcom->individuals->update($i); 
        		break;
        	}
        	exit;
        }
        
        public function setLocation(){
        	$session = JFactory::getSession();
        	$alias = JRequest::getCmd('alias');
        	$session->set('alias', $alias);
        	switch($alias){
        		case 'myfamily':
        			$session->set('login_method', 'myfamily');
        		break;
        		
        		case 'famous-family':
        			
        		break;
        		
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