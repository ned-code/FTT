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
        	$host = &FamilyTreeTopHostLibrary::getInstance();
        	$ids = explode('|', JRequest::getVar('ids'));
        	
        	$jpath_base_explode = explode('/', JPATH_BASE);
        	if(end($jpath_base_explode) == 'administrator'){
        		array_pop($jpath_base_explode); 
        	}
        	$jpath_base = implode('/', $jpath_base_explode);
        	$path = $jpath_base.DS.'components'.DS.'com_manager'.DS.'modules';
        	
        	//get all pages
        	$sql_string = "SELECT content.id, content.layout_type, content.title, grid.json FROM #__mb_content as content LEFT JOIN #__mb_modulesgrid as grid ON grid.page_id = content.id";
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
        $host = &FamilyTreeTopHostLibrary::getInstance();
        $host->images->getImage(JRequest::getVar('tree_id'),JRequest::getVar('id'), JRequest::getVar('fid'), JRequest::getVar('w'), JRequest::getVar('h'));
        exit;
    }

    /*
    protected function checkFacebookInvation($user){
        if(!$user->facebookId) return false;
        $host = &FamilyTreeTopHostLibrary::getInstance();
        $alias = $host->getCurrentAlias();
        if($alias != 'invitation'){
            $sql_string = "SELECT belongs FROM #__mb_variables WHERE facebook_id = ?";
            $host->ajax->setQuery($sql_string, $user->facebookId);
            $rows = $host->ajax->loadAssocList();

            if(empty($rows)){
                return false;
            } else {
                return $rows[0]['belongs'];
            }
        }
        return false;
    }

    protected function checkMailInvitataion($user){
        if($user->email) return false;
        $host = &FamilyTreeTopHostLibrary::getInstance();
        $alias = $host->getCurrentAlias();
        if($alias != 'invitation'){
            $sql_string = "SELECT belongs FROM #__mb_variables WHERE email = ?";
            $host->ajax->setQuery($sql_string, $user->email);
            $rows = $host->ajax->loadAssocList();

            if(empty($rows)){
                return false;
            } else {
                return $rows[0]['belongs'];
            }

        }
        return false;
    }

    protected  function checkToken(){
        $token = JRequest::getVar('token');
        return (empty($token))?false:$token;
    }

    */


    protected function getInvitationToken($user){
        function _isInvitation($d){
            $p = explode('?', $d);
            $s = explode('=', $p[1]);
            return $s[0] == 'token';
        }
        $token = JRequest::getVar('token');
        if(!empty($token)){
            return $token;
        }

        if($user->token){
            return $user->token;
        }

        if(strlen($user->data) > 1 && _isInvitation($user->data)){
            return $user->data;
        }
        return false;
    }

	protected function get_alias($user){
        $invitation_token = $this->getInvitationToken($user);
        switch($user->page){
			case "invitation":
                if($user->guest) return 'login';
                if(!$invitation_token &&  $user->treeId != 0) return "myfamily";
                if(!$invitation_token && $user->treeId == 0) return "first-page";
				return "invitation";
			break;
			
			case "home":
                if($invitation_token && !$user->guest) return 'invitation';
				return "home";
			break;
			
			case "famous-family":
                if($invitation_token && !$user->guest) return 'invitation';
				return "famous-family";
			break;
		
			case "login":
                if($invitation_token && !$user->guest) return "invitation";
                if($user->treeId != 0) return "myfamily";
                if(!$user->guest && $user->facebookId != 0) return "first-page";
                if(!$user->guest && $user->treeId == 0) return "home";
				return "login";
			break;
			
			case "first-page":
                if($invitation_token && !$user->guest) return 'invitation';
                if($user->treeId!=0) return "myfamily";
                if($user->guest && !$user->facebookId) return "login";
                return "first-page";
			break;
			
			case "myfamily":
                if($invitation_token && !$user->guest) return 'invitation';
                if($user->guest && $user->loginType != 1) return "login";
                if($user->facebookId == 0 && $user->loginType != 1) return "login";
                if($user->treeId==0) return "first-page";
                return "myfamily";
			break;

            case "about":
            case "conditions":
            case "privaci":
            case "contact":
            case "feedback":
            case "help":
                return $user->page;
            break;
			
			default:
                if($invitation_token && !$user->guest) return "invitation";
                if($user->treeId==0)return "home";
                if($user->guest && !$user->facebookId) return "login";
                return "myfamily";
			break;
		}
	}

    protected function checkUri(){
        $menus = &JSite::getMenu();
        $menu= $menus->getActive();
        $alias = $menu->alias;
        if($alias == 'invitation') return $alias;
        $qry = explode('?', $menu->link);
        $uri = explode('?', $_SERVER['REQUEST_URI']);
        if(sizeof($uri) > 1){
            if($uri[1] == $qry[1]){
                return $alias;
            }
        } else {
            $parts = explode(DS, $uri[0]);
            $last = array_pop($parts);
            if($alias == $last){
                return $alias;
            }
        }
        return false;
    }

	protected function check_location($user){
        $host = &FamilyTreeTopHostLibrary::getInstance();
        $alias = $this->get_alias($user);
        if($current = $this->checkUri()){
            if($current == $alias){
                $host->user->setAlias($alias);
                return true;
            }
        }
        $this->location($alias);
        return false;
	}

    protected function location($alias){
        $url = 'Location:'.JURI::base().'index.php/'.$alias;
        header($url);
        exit;
    }



    protected function checkPermission($user){
        $host = &FamilyTreeTopHostLibrary::getInstance();
        $username = $user->jUser->username;
        $facebookId = $user->facebookId;

        if(!$user->guest){
            if($facebookId != null && $facebookId != 0 && $username != null){
                $name = explode('_', $username);
                if($name[1] != $facebookId){
                    header('Location: '.$host->getBaseUrl().'index.php?option=com_jfbconnect&task=logout&return=login');
                    exit;
                }
            }
        }
        return true;
    }
        public function jmb(){
        	$task = JRequest::getVar('task');
        	$option = JRequest::getVar('option');
        	$canvas = JRequest::getVar('canvas');

        	if($option!='com_manager') exit();

            $host = &FamilyTreeTopHostLibrary::getInstance();
            $user = $host->user->get();

        	if(strlen($task)!=0) return;
            if((bool)$canvas){
                header('Location: https://www.facebook.com/dialog/oauth?client_id='.$host->jfbConnect->facebookAppId.'&redirect_uri='.JURI::base().'index.php/myfamily');
                exit;
            }

            $this->checkPermission($user);
            $this->check_location($user);
        }

        public function setLocation(){
            $host = &FamilyTreeTopHostLibrary::getInstance();
            $jfbLib = JFBConnectFacebookLibrary::getInstance();
            $facebook_id = $jfbLib->getFbUserId();
        	$alias = JRequest::getCmd('alias');
        	switch($alias){
        		case 'myfamily':
                    $host->user->setAlias('myfamily');
                    $data = $host->getIndividualsInSystem($facebook_id);
                    if($data){
                        $host->user->set($data['tree_id'], $data['gedcom_id'], 0);
                        $user = $host->user->get();
                        if(strlen($user->token) > 1){
                            $host->user->clearToken();
                        }
                    } else {
                        $host->user->set(0, 0, 0);
                    }
        		break;

                default:
                    $data = $host->getIndividualsInSystem($facebook_id);
                    $user = $host->user->get();
                    $host->user->setAlias($alias);
                    if($data && $alias != 'invitation' && $user->treeId != 0 && strlen($user->token) > 1){
                        $host->user->clearToken();
                    }
                break;
        	}
        	exit;
        }

        public function clearFamousData(){
            $this->clear_user_data();
        }

        public function timeout(){
        	echo 'ping!';
        	exit();
        }

    public function getLanguage(){
        $host = &FamilyTreeTopHostLibrary::getInstance();
        $module_name = JRequest::getCmd('module_name');
        echo json_encode($host->getLangList($module_name));
        exit;
    }

    public function loginFacebookUser(){
        return false;
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
                $url = 'Location:'.JURI::base().'index.php?option=com_jfbconnect&task=loginFacebookUser&return=myfamily';
                header($url);
            }
        }
    }
}
?>