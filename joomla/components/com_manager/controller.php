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

    protected function get_invitation_token($session){
        $token = JRequest::getVar('token');
        $c_token = $session->get('clear_token');

        if(!isset($_COOKIE['token'])){
            if(!empty($token)){
                 setcookie('token', $token);
             }
        }
        if($c_token){
            $session->clear('clear_token');
            setcookie('token', false);
            $_COOKIE['token'] = false;
        }
        if(isset($_COOKIE['token']) && $_COOKIE['token']){
            return $_COOKIE['token'];
        }
        return false;
    }

	protected function get_alias($user_data, $user){
		$session = JFactory::getSession();

        $invitation_token = $this->get_invitation_token($session);
        if($user->guest){
            $invitation_token = false;
        }

		$alias = $session->get('alias');
		$login_method = $session->get('login_method');

        switch($alias){
			case "invitation":
                if($user->guest) return 'home';
                if(!$invitation_token) return 'myfamily';
				return "invitation";
			break;
			
			case "home":
                if($invitation_token) return 'invitation';
				return "home";
			break;
			
			case "famous-family":
				return "famous-family";
			break;
		
			case "login":
                if($invitation_token) return "invitation";
				if($user_data) return "myfamily";
				if(!$user->guest&&!$user_data) return "home";
				return "login";
			break;
			
			case "first-page":
                if($invitation_token) return 'invitation';
				if($user->guest) return "login";
                if($user_data) return "myfamily";
				return "first-page";
			break;
			
			case "myfamily":
                if($invitation_token) return 'invitation';
				if(!empty($login_method)&&$login_method=="famous_family") {
					return "myfamily";
				}
				if($user->guest) return "login";
				if(!$user_data) return "first-page";
				return "myfamily";			
			break;

            case "about":
            case "conditions":
            case "privaci":
            case "contact":
            case "feedback":
            case "help":
                return $alias;
            break;
			
			default:
                if($invitation_token) return "invitation";
				if($user->guest) return "login";
				if(!$user_data) return "home";
				return "myfamily";
			break;
		}
	}

	protected function check_location($user_data, $user){
        $session = JFactory::getSession();
        $alias = $this->get_alias($user_data, $user);
        $current_alias = $this->get_current_alias();

        if($alias != $current_alias){
            $this->location($alias);
        } else {
            $session->set('alias', $alias);
            return $alias;
        }
	}

    protected function location($alias){
        //$host = new Host('joomla');
        //$host->setAliasLog($alias);
        $url = 'Location:'.JURI::base().'index.php/'.$alias;
        header($url);
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

        protected function checkFacebookInvation($me){
            $alias = $this->get_current_alias();
            if($alias != 'invitation'){
                $facebook_id = $me['id'];
                $host = new Host('Joomla');

                $sql_string = "SELECT belongs FROM #__mb_variables WHERE facebook_id = ?";
                $host->ajax->setQuery($sql_string, $facebook_id);
                $rows = $host->ajax->loadAssocList();

                if(empty($rows)){
                    return false;
                } else {
                    return $rows[0]['belongs'];
                }
            }
            return false;
        }

        public function jmb(){
        	$task = JRequest::getVar('task');
        	$option = JRequest::getVar('option');
        	$canvas = JRequest::getVar('canvas');

        	if($option!='com_manager') exit();
        	if(strlen($task)!=0) return;

            $session = JFactory::getSession();
            if((bool)$canvas){
                header('Location: https://www.facebook.com/dialog/oauth?client_id='.JMB_FACEBOOK_APPID.'&redirect_uri='.JURI::base().'index.php/myfamily');
                exit;
            }

            $jfb = JFBConnectFacebookLibrary::getInstance();
            $user = JFactory::getUser();
            $me = $jfb->api('me');

            if(!$user->guest){
                $user_name = explode('_', $user->username);
                if($user_name[1] != $me['id']){
                    header('Location: '.JURI::base().'index.php?option=com_jfbconnect&task=logout&return=login');
                    exit;
                }
            }

            $host = new Host('joomla');
            $facebook_id = $jfb->getFbUserId();
        	$user_data = $this->get_user_data($facebook_id);
            $alias = $this->check_location($user_data, $user);

            $token = $this->checkFacebookInvation($me);
            if($token){
                header('Location: '.JURI::base().'index.php/invitation?token='.$token);
                exit;
            }

            switch($alias){
                case 'invitation':
                    $this->set_user_data($user_data);
                    break;

                case 'first-page':
                    $this->clear_user_data();
                    $session->set('facebook_id', $facebook_id);
                    break;

                case 'login':
                case 'home':
                    $this->set_user_data($user_data);
                    break;

                case 'famous-family':
                    $this->set_user_data($user_data);
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
                    break;
            }
        }

        public function setLocation(){
        	$session = JFactory::getSession();
        	$alias = JRequest::getCmd('alias');
        	$session->set('alias', $alias);
        	switch($alias){
        		case 'myfamily':
        			$session->set('login_method', 'myfamily');
        		break;
        	}
        	exit;
        }
        
        public function timeout(){
        	echo 'ping!';
        	exit();
        }

    public function getLanguage(){
        $host = new Host('Joomla');
        $module_name = JRequest::getCmd('module_name');
        echo json_encode($host->getLangList($module_name));
        exit;
    }

    public function loginFacebookUser(){
        $app = JFactory::getApplication();
        $jfbcLibrary = JFBConnectFacebookLibrary::getInstance();
        $fbUserId = $jfbcLibrary->getFbUserId();

        $user = JFactory::getUser();

        if ($user->guest){
            if (!$fbUserId){
                return false;
            }
            require_once (JPATH_ADMINISTRATOR . DS . 'components' . DS . 'com_jfbconnect' . DS . 'models' . DS . 'usermap.php');
            $userMapModel = new JFBConnectModelUserMap();

            $jUserId = $userMapModel->getJoomlaUserId($fbUserId);
            if($jUserId == null){
                $app->redirect(JRoute::_('index.php?option=com_jfbconnect&task=loginFacebookUser&return=myfamily'));
            }
        }
    }
}
?>