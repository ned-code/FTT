<?php
require_once('class.ajax.php');
require_once('class.usertree.php');
require_once('class.image.php');
require_once('class.language.php');
require_once('class.config.php');
require_once('gedcom/core.gedcom.php');
require_once('gramps/core.gramps.php');

//class
class FamilyTreeTopHostLibrary {
    private static $instance = null;

    private $modulesPath;

    public $ajax;

    public $gedcom;
    public $gramps;
    public $usertree;

    public $images;

    private $language;
    private $config;

    public $jfbConnect;
    public $jSession;

    public $jUser;

    private function __construct( $directCall = true ) {
        if ( $directCall ) {
            return false;
        }
        $this->modulesPath = $this->getModulesPath();

        $this->ajax = new JMBAjax();

        $this->gedcom = new Gedcom($this->ajax);
        $this->gramps = new Gramps($this->ajax, $this->gedcom);
        $this->usertree = new JMBUserTree($this->ajax, $this->gedcom);

        $this->images = new JMBImage($this->gedcom);

        $this->language = new JMBHostLanguage($this->ajax);
        $this->config = new JMBHostConfig($this->ajax);

        $this->jSession =& JFactory::getSession();
        $this->jfbConnect = JFBConnectFacebookLibrary::getInstance();

        $this->jUser = JFactory::getUser();
    }

    public function &getInstance() {
        if (null === self::$instance)
        {
            self::$instance = new self( false );
        }

        return self::$instance;
    }

    private function getModulesPath(){
            return JPATH_ROOT."/components/com_manager/modules/";
    }

    public function getBaseUrl(){
        $path = explode(DS, JURI::base());
        foreach($path as $key => $value){
            if($value == 'components') break;
            $base_url_array[] = $value;
        }
        return implode(DS, $base_url_array);
    }

    /*
    * ------------------------------------------------------------------------------------------
    */
    public function getSettingsStructure($module){
        $properties = $this->getJsonProperties($module);
        return $properties[0]['structure'];
    }
    public function getSettingsValues($module){
        $properties = $this->getJsonProperties($module);
        return $properties[0]['value'];
    }
    public function setSettingsValues($module, $values){
        $this->saveJsonProperties($module, $values);
    }
    public function callMethod($modulename,$classname, $method, $arguments){
        $args = explode("|", $arguments);
        $modulePath = $this->modulesPath.$modulename."/php/".$modulename.".php";
        if(!file_exists($modulePath)){
            return;
        }
        require_once($modulePath);
        if($classname != null){
            $obj = new $classname;
            return call_user_func_array(array($obj, $method), $args);
        }else
            return call_user_func_array($method, $args);
    }
    public function getAbsoluteRootPath(){
            return JPATH_ROOT;
    }
    public function getAbsoluePath(){
        $jpath_base_explode = explode('/', JPATH_ROOT);
        if(end($jpath_base_explode) == 'administrator'){
            array_pop($jpath_base_explode);
        }
        return implode('/', $jpath_base_explode);
    }
    public function getRootDirectory(){
        return JURI::base(true);
    }
    public function getModuleName($nameOrId){
        $db = new JMBAjax();
        $db->setQuery('SELECT name,id FROM #__mb_modules WHERE (name = "?" OR id="?")', $nameOrId, $nameOrId);
        $rows = $db->loadAssocList();
        if(isset($rows[0]['name']))
            return ($rows[0]['name']);
        else
            return null;
     }
    public function getModuleId($nameOrId){
        $db = new JMBAjax();
        $db->setQuery('SELECT name,id FROM #__mb_modules WHERE (name = "?" OR id="?")', $nameOrId, $nameOrId);
        $rows = $db->loadAssocList();
        if(isset($rows[0]['id']))
            return ($rows[0]['id']);
        else
            return null;
     }
    public function encodeProperties($array){
            $json = '[';
            foreach($array as $property){
                if($property->type != "select" && $property->type != "radio" && $property->type != "checkbox")
                    $json .= '{"type":"'.$property->type.'","name":"'.$property->name.'","value":"'.$property->value.'"},';
                else{
                    if($property->type == "select"){
                        $json .= '{"type":"'.$property->type.'","name":"'.$property->name.'","selected":"'.$property->selected.'"},';
                    }elseif($property->type == "radio"){
                        $json .= '{"type":"'.$property->type.'","name":"'.$property->name.'","value":"'.$property->value.'","checked":"'.$property->checked.'"},';
                    }elseif($property->type == "checkbox"){
                        $json .= '{"type":"'.$property->type.'","name":"'.$property->name.'","checked":"'.$property->checked.'"},';
                    }
                }
            }
            $json = substr($json, 0, strlen($json)-1) . ']';
          
            return $json;
     }
    public function getJsonProperties($modulename){
            $name = $this->getModuleName($modulename);
            if($name == null)
                return null;
            $db = new JMBAjax();
            $db->setQuery('SELECT structure, value
                                FROM #__mb_settings
                                WHERE module_name = "?"
                         ', $name);
            $rows = $db->loadAssocList();
          
            $values = array();
            if($rows != null){
                $values = json_decode($rows[0]['value']);
            }
          
            $db->setQuery('SELECT "title" as name, #__mb_modules.title as value
                                FROM #__mb_modules
                                WHERE name = "?"', $name);
            $title = $db->loadAssocList();
            $ar = array ();

            $titl = new Object();
            $titl->type = "input";
            $titl->name = $title[0]['name'];
            $titl->value = $title[0]['value'];
            $ar[] = $titl;
          
            if(is_array($values))
                $values = array_merge($ar, $values);
            else {
                $values = $ar;
            }
        
            $rows[0]['value'] = $this->encodeProperties($values);
            //var_dump($rows[0]['value']);
            return $rows;
    }
    public function getSiteSettings($tab){
            if($tab == 'color'){
        	$sql = "SELECT name, value FROM #__mb_system_settings WHERE type='color'";
        	$db = new JMBAjax();
        	$db->setQuery($sql);
		$s_array = $db->loadAssocList();
                
		return $s_array;
            }
    }
    public function sendSiteSettings($tab){
            $resp = $this->getSiteSettings($tab);
            if($resp != null)
                $resp = json_encode($resp);
            echo $resp;

    }
    public function saveJsonProperties($modulename, $properties_json){
            $db = new JMBAjax();
            $name = $this->getModuleName($modulename);
            $id = $this->getModuleId($modulename);
            if($name == null)
                return null;

            $properties_array = json_decode($properties_json);
            for($i=0; $i<count($properties_array); $i++){
                if($properties_array[$i]->name == 'title'){
                     $req = 'SELECT title FROM #__mb_modules WHERE name="'.$name.'"';
                     $db->setQuery($req);
                     $title = $db->loadAssocList();
                     $title = $title[0]['title'];
                     $req = 'UPDATE #__mb_modulesgrid SET json=REPLACE(#__mb_modulesgrid.json, "'.$title.'", "'.$properties_array[$i]->value.'")';
                     $db->setQuery($req);
                     echo $req;
                     $db->query();
                     
                     $req = 'UPDATE #__mb_modules SET title="'.$properties_array[$i]->value.'"
                                WHERE name = "'.$name.'"';
                     $db->setQuery($req);
                     $db->query();
                     unset($properties_array[$i]);
                }
            }
            $json = $this->encodeProperties($properties_array);

            $req = "UPDATE #__mb_settings SET value='".$json."'
                WHERE module_name = '".$name."'";

            $db->setQuery($req);
            $db->query();
               
    }
    /*
    * ------------------------------------------------------------------------------------------
    */



	public function getLangList($module_name){
		return $this->language->getLangList($module_name);
	}
	
	public function getLanguages(){
		return $this->language->getLanguages();
	}

    public function getComponentString(){
        return $this->language->getComponentString();
    }


	public function getConfig(){
        return $this->config->getConfig();
	}

    public function getViews($moduleName){
        $path = JPATH_ROOT.DS.'components'.DS.'com_manager'.DS.'modules'.DS.$moduleName.DS.'views'.DS;
        $order = array("\r\n", "\n", "\r");
        $replace = "";
        $views = array();
        if (is_dir($path)) {
            if ($dh = opendir($path)) {
                while (($file = readdir($dh)) !== false) {
                    $filePath = $path.$file;
                    if(is_file($filePath)){
                        $fileName = explode('.', $file);
                        $fileContent = file_get_contents($filePath);
                        $views[$fileName[0]] = preg_replace('| +|', ' ', str_replace($order, $replace, $fileContent));

                    }
                }
                closedir($dh);
            }
        }
        return $views;
    }

    public function deleteJoomlaUser($facebook_id){
        $sql_string = "SELECT * FROM #__jfbconnect_user_map as map WHERE fb_user_id = ?";
        $this->ajax->setQuery($sql_string, $facebook_id);
        $rows = $this->ajax->loadAssocList();

        if(empty($rows)) return false;

        $this->ajax->setQuery('DELETE FROM #__jfbconnect_user_map WHERE fb_user_id = ?', $facebook_id);
        $this->ajax->query();

        $this->ajax->setQuery('DELETE FROM #__users WHERE id = ?', $rows[0]['j_user_id']);
        $this->ajax->query();

        $this->ajax->setQuery('DELETE FROM #__user_usergroup_map WHERE user_id = ?', $rows[0]['j_user_id']);
        $this->ajax->query();

        $this->ajax->setQuery('DELETE FROM #__session WHERE userid = ?', $rows[0]['j_user_id']);
        $this->ajax->query();
        return true;
    }

    public function setAliasLog($alias){
        $user = JFactory::getUser();
        $name = null;
        if(!$user->guest){
            $name = $user->username;
        } else {
            $name = "guest";
        }

        $this->ajax->setQuery('INSERT INTO #__mb_log (`id`,`alias`,`user_id`) VALUES (null, ?, ?)', $alias, $name);
        $this->ajax->query();
    }

    public function getIndividualsInSystem($facebook_id){
        if(empty($facebook_id)) return false;
        $sqlString = "SELECT link.individuals_id as gedcom_id, link.tree_id as tree_id, link.type as permission
                    FROM #__mb_tree_links as link
                    LEFT JOIN #__mb_individuals as ind ON ind.id = link.individuals_id
                    WHERE ind.fid=?";
        $this->ajax->setQuery($sqlString, $facebook_id);
        $data = $this->ajax->loadAssocList();
        return (empty($data))?false:$data[0];
    }

    public function getCurrentAlias(){
        $menu   = &JSite::getMenu();
        $active   = $menu->getActive();
        return (is_object($active))?$active->alias:false;
    }
    public function setUserPermission($permission){
        $sqlString = "UPDATE #__mb_user_map SET `permission` = ?, `time` = NOW() WHERE session_id = ?";
        $this->ajax->setQuery($sqlString, $permission, $this->jSession->getId());
        $this->ajax->query();
    }

    public function setUserMapFacebookId($facebook_id){
        $sqlString = "UPDATE #__mb_user_map SET `facebook_id` = ?, `time` = NOW() WHERE session_id = ?";
        $this->ajax->setQuery($sqlString, $facebook_id, $this->jSession->getId());
        $this->ajax->query();
    }

    public function setUserLanguage($language){
        $sqlString = "UPDATE #__mb_user_map SET `language` = ?, `time` = NOW() WHERE session_id = ?";
        $this->ajax->setQuery($sqlString, $language, $this->jSession->getId());
        $this->ajax->query();
    }

    public function setUserMap($tree_id, $gedcom_id, $login_type = 0){
        $sqlString = "UPDATE #__mb_user_map SET `tree_id` = ?, `gedcom_id` = ? , `login_type` = ?, `time` = NOW() WHERE session_id = ?";
        $this->ajax->setQuery($sqlString, $tree_id, $gedcom_id, $login_type, $this->jSession->getId());
        $this->ajax->query();
    }

    public function setUserAlias($alias){
        $sqlString = "UPDATE #__mb_user_map SET `page` = ?, `time` = NOW() WHERE session_id = ?";
        $this->ajax->setQuery($sqlString, $alias, $this->jSession->getId());
        $this->ajax->query();
    }

    public function deleteUserMap($facebook_id){
        $this->ajax->setQuery("DELETE FROM #__mb_user_map WHERE facebook_id = ? ", $facebook_id);
        $this->ajax->query();
    }

    public function getUserMap(){
        $sessionId = $this->jSession->getId();
        $me = $this->jfbConnect->api('/me');
        $facebookId = $this->jfbConnect->getUserId();
        $jUserId = $this->jUser->id;
        $language = $this->language->getLanguage($me['locale']);

        $sqlString = "SELECT facebook_id, session_id, user_id, tree_id, gedcom_id, permission, login_type, page, language, active FROM #__mb_user_map WHERE session_id = ?";
        $this->ajax->setQuery($sqlString, $sessionId);
        $data = $this->ajax->loadAssocList();

        $indData = $this->getIndividualsInSystem($facebookId);
        $page = $this->getCurrentAlias();

        if(empty($data)){
            $sqlString = "INSERT INTO #__mb_user_map (`facebook_id`,`session_id`,`tree_id`, `gedcom_id`, `user_id`, `permission`, `login_type`, `page`,`language`, `active`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";
            if($indData){
                $this->ajax->setQuery($sqlString, $facebookId, $sessionId, $indData['tree_id'], $indData['gedcom_id'], $jUserId, $indData['permission'], 0, $page, $language, 0);
                $this->ajax->query();
                return array(
                        'me'=> $me,
                        'facebook_id' => $facebookId,
                        'session_id' => $sessionId,
                        'user_id' => $jUserId,
                        'tree_id' => $indData['tree_id'],
                        'gedcom_id' => $indData['gedcom_id'],
                        'permission' => $indData['permission'],
                        'login_type' => 0,
                        'page' => $page,
                        'language' => $language,
                        'active' => NULL
                );
            } else {
                $this->ajax->setQuery($sqlString, $facebookId, $sessionId, 0, 0, $jUserId, 'GUEST', 0, $page, $language, 0);
                $this->ajax->query();
                return array(
                    'me' => $me,
                    'facebook_id' => $facebookId,
                    'session_id' => $sessionId,
                    'user_id' => $jUserId,
                    'tree_id' => 0,
                    'gedcom_id' => 0,
                    'permission' => 'GUEST',
                    'login_type' => 0,
                    'page' => $page,
                    'language' => $language,
                    'active' => NULL
                );
            }
        } else {
            if($facebookId&&$data[0]['facebook_id']==0){
                $this->setUserMapFacebookId($facebookId);
                $this->setUserMap($indData['tree_id'], $indData['gedcom_id'], $indData['permission']);
                return array(
                    'me' => $me,
                    'facebook_id' => $facebookId,
                    'session_id' => $sessionId,
                    'user_id' => $jUserId,
                    'tree_id' => $indData['tree_id'],
                    'gedcom_id' => $indData['gedcom_id'],
                    'permission' => $indData['permission'],
                    'login_type' => 0,
                    'page' => $page,
                    'language' => 'en-GB',
                    'active' => NULL
                );
            } else {
                if($data[0]['permission'] == 'GUEST'&&$data[0]['facebook_id']!=0){
                    $data[0]['language'] = $jUserId;
                    $this->setUserLanguage($jUserId);
                    $this->setUserPermission('MEMBER');
                }
                $data[0]['me'] = $me;
                return $data[0];
            }
        }
    }
}
?>