<?php

class FTTUserLibrary {
    private $host;
    private $joomla;

    private $sessionId;
    private $facebookFields;
    private $currentAlias;

    private $name = '';
    private $facebookId = 0;
    private $joomlaId = 0;
    private $gedcomId = 0;
    private $treeId = 0;
    private $permission = 'GUEST';
    private $loginType = 0;
    private $language = 'en-GB';
    private $page = 'home';
    private $gender = 'M';
    private $token = 0;
    private $birthday = '';

    public function __construct(&$host){
        $this->host = $host;
        $this->joomla = JFactory::getUser();
        $this->sessionId = $this->host->jSession->getId();
        $this->facebookId = $this->_getUserId();
        $this->joomlaId = $this->joomla->id;
        $this->currentAlias = $this->_getCurrentAlias();
        $this->facebookFields = $this->_getUserProfileFields($this->facebookId);
        $this->language = $this->host->language->getLanguage($this->facebookFields['locale']);
        $this->name = $this->_getUserName();
        $this->data = $this->_getData();
        $this->_setUserMap();
    }

    protected function _set($param){
        $this->gedcomId = $param['gedcom_id'];
        $this->treeId = $param['tree_id'];
        $this->permission = $param['permission'];
        $this->loginType = $param['login_type'];
        $this->language = $param['language'];
        $this->page = $param['page'];
        $this->token = $param['token'];
    }

    protected function _getData(){
        $userInSystem = $this->_getIndividualsInSystem($this->facebookId);
        $data = array();
        $data['facebook_id'] = $this->facebookId;
        $data['session_id'] = $this->sessionId;
        $data['tree_id'] = ($userInSystem)?$userInSystem['tree_id']:0;
        $data['gedcom_id'] = ($userInSystem)?$userInSystem['gedcom_id']:0;
        $data['user_id'] = $this->joomlaId;
        $data['permission'] = ($userInSystem)?'MEMBER':'GUEST';
        $data['login_type'] = 0;
        $data['page'] = $this->currentAlias;
        $data['language'] = $this->language;
        $data['token'] = $this->_getToken();
        return $data;
    }

    protected function _getToken(){
        if(!$this->facebookId) return 0;
        function _getResult($r){
            if(empty($r)){
                return false;
            } else {
                return $r[0]['belongs'];
            }
        }

        $token = JRequest::getVar('token');
        if(!empty($token)){
            return $token;
        }

        $selectString = "SELECT token FROM #__mb_user_map WHERE user_id = ?";
        $this->host->ajax->setQuery($selectString, $this->joomlaId);
        $result =  $this->host->ajax->loadAssocList();

        if(!empty($result) && $result[0]['token'] != 0){
            return $result[0]['token'];
        }

        $sqlString = "SELECT belongs FROM #__mb_variables WHERE ";
        $byFacebookId = "facebook_id = ?";
        $byEmail = "email = ?";

        $this->host->ajax->setQuery($sqlString.$byFacebookId, $this->facebookId);
        $responseByFacebook = $this->host->ajax->loadAssocList();

        if(!empty($responseByFacebook)){
            return $responseByFacebook[0]['belongs'];
        }

        $this->host->ajax->setQuery($sqlString.$byEmail, $this->facebookFields['email']);
        $responseByEmail = $this->host->ajax->loadAssocList();

        if(!empty($responseByEmail)){
            return $responseByEmail[0]['belongs'];
        }

        return 0;
    }

    protected function _getUserProfileFields($facebookId){
        if(!$facebookId) return false;
        $result = $this->host->jfbConnect->api('/'. $facebookId);
        $this->gender = $result['gender'];
        return $result;
    }

    protected function _getUserId(){
        $id =  $this->host->jfbConnect->getFbUserId();
        if(empty($id)){
            return 0;
        }
        return $id;
    }

    protected function _getCurrentAlias(){
        $menu   = &JSite::getMenu();
        $active   = $menu->getActive();
        return (is_object($active))?$active->alias:false;
    }

    protected function _getIndividualsInSystem($facebook_id){
        if(empty($facebook_id)) return false;
        $sqlString = "SELECT link.individuals_id as gedcom_id, link.tree_id as tree_id, link.type as permission
                    FROM #__mb_tree_links as link
                    LEFT JOIN #__mb_individuals as ind ON ind.id = link.individuals_id
                    WHERE ind.fid=?";
        $this->host->ajax->setQuery($sqlString, $facebook_id);
        $data = $this->host->ajax->loadAssocList();
        return (empty($data))?false:$data[0];
    }

    protected function _getSessionMap(){
        $sqlString = "SELECT facebook_id, session_id, user_id, tree_id, gedcom_id, permission, login_type, page, language, token FROM #__mb_user_map WHERE session_id = ?";
        $this->host->ajax->setQuery($sqlString, $this->sessionId);
        $result = $this->host->ajax->loadAssocList();
        if(empty($result)){
            return false;
        }
        return $result[0];
    }

    protected function _getUserMap(){
        if(!$this->joomlaId) return false;
        $sqlString = "SELECT facebook_id, session_id, user_id, tree_id, gedcom_id, permission, login_type, page, language, token FROM #__mb_user_map WHERE user_id = ?";
        $this->host->ajax->setQuery($sqlString, $this->joomlaId);
        $result = $this->host->ajax->loadAssocList();
        if(empty($result)){
            return false;
        }
        return $result[0];
    }

    protected function _getUserName(){
        $facebookFieldName = $this->facebookFields['name'];
        $joomlaName = $this->joomla->name;
        if(!empty($facebookFieldName)){
            return $facebookFieldName;
        }
        if(!empty($joomlaName)){
            return $joomlaName;
        }
        return '';
    }

    protected function _createMap(){
        $data = $this->data;
        $sqlString = "INSERT INTO #__mb_user_map (`facebook_id`,`session_id`,`tree_id`, `gedcom_id`, `user_id`, `permission`, `login_type`, `page`,`language`, `token`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";
        $this->host->ajax->setQuery($sqlString, $data['facebook_id'], $data['session_id'], $data['tree_id'], $data['gedcom_id'], $data['user_id'], $data['permission'], $data['login_type'], $data['page'], $data['language'], $data['token']);
        $this->host->ajax->query();
    }

    protected function _setUserMap(){
        $userMap = $this->_getUserMap();
        $sessionMap = $this->_getSessionMap();
        if($sessionMap || $userMap){
            if($userMap){
                $this->updateSession();
                $this->_set($userMap);
            } else {
                $this->_set($sessionMap);
                if($this->facebookId && !$userMap['facebook_id']){
                    $this->setMapFacebookId($this->facebookId);
                    $this->setJoomlaId($this->joomlaId);
                    $this->set($this->treeId, $this->gedcomId, 0);
                    $this->setPermission($this->permission);
                }
            }
        } else {
            $this->_createMap();
        }
        if($this->token == 0 && strlen($this->data['token']) > 1){
            $this->setToken($this->data['token']);
        }
    }

    public function get(){
       $result = array(
            'jUser' => $this->joomla,
            'facebookFields' => $this->facebookFields,
            'sessionId' => $this->sessionId,
            'name' => $this->name,
            'gender' => $this->gender,
            'facebookId' => $this->facebookId,
            'joomlaId' => $this->joomlaId,
            'gedcomId' => $this->gedcomId,
            'treeId' => $this->treeId,
            'permission' => $this->permission,
            'language' => $this->language,
            'loginType' => $this->loginType,
            'page' => $this->page,
            'guest'=> $this->joomla->guest,
            'token' => $this->token,
            'email' => $this->facebookFields['email']
            //'birthday' => $this->birthday
        );
        return (object)$result;
    }

    public function getJoomlaUser(){
        return $this->joomla;
    }

    public function getFaceebokFields(){

    }

    public function set($tree_id, $gedcom_id, $login_type = 0, $user = false){
        $sqlString = "UPDATE #__mb_user_map SET `tree_id` = ?, `gedcom_id` = ? , `login_type` = ?, `time` = NOW() WHERE ";
        $sqlString .= ($user)?"user_id = ?":"session_id = ?";
        $this->host->ajax->setQuery($sqlString, $tree_id, $gedcom_id, $login_type, ($user)?$this->joomlaId:$this->sessionId);
        $this->host->ajax->query();

        $this->gedcomId = $gedcom_id;
        $this->treeId = $tree_id;
        $this->loginType = $login_type;
    }

    public function updateSession(){
        $selectString = "SELECT session_id FROM #__mb_user_map WHERE session_id = ?";
        $this->host->ajax->setQuery($selectString, $this->sessionId);
        $result = $this->host->ajax->loadAssocList();
        if(!empty($result)){
            $deleteString = "DELETE FROM #__mb_user_map WHERE session_id = ? AND facebook_id = 0";
            $this->host->ajax->setQuery($deleteString, $this->sessionId);
            $this->host->ajax->query();
        }

        $updateString = "UPDATE #__mb_user_map SET `session_id` = ?, `time` = NOW() WHERE user_id = ?";
        $this->host->ajax->setQuery($updateString, $this->sessionId, $this->joomlaId);
        $this->host->ajax->query();
    }

    public function setPermission($permission, $user = false){
        $sqlString = "UPDATE #__mb_user_map SET `permission` = ?, `time` = NOW() WHERE ";
        $sqlString .= ($user)?"user_id = ?":"session_id = ?";
        $this->host->ajax->setQuery($sqlString, $permission, ($user)?$this->joomlaId:$this->sessionId);
        $this->host->ajax->query();

        $this->permission = $permission;
    }

    public function setMapFacebookId($facebook_id, $user = false){
        $sqlString = "UPDATE #__mb_user_map SET `facebook_id` = ?, `time` = NOW() WHERE ";
        $sqlString .= ($user)?"user_id = ?":"session_id = ?";
        $this->host->ajax->setQuery($sqlString, $facebook_id, ($user)?$this->joomlaId:$this->sessionId);
        $this->host->ajax->query();

        $this->facebookId = $facebook_id;
    }

    public function setLanguage($language, $user = false){
        $sqlString = "UPDATE #__mb_user_map SET `language` = ?, `time` = NOW() WHERE ";
        $sqlString .= ($user)?"user_id = ?":"session_id = ?";
        $this->host->ajax->setQuery($sqlString, $language, ($user)?$this->joomlaId:$this->sessionId);
        $this->host->ajax->query();

        $this->language = $language;
    }

    public function setAlias($alias, $user = false){
        $sqlString = "UPDATE #__mb_user_map SET `page` = ?, `time` = NOW() WHERE ";
        $sqlString .= ($user)?"user_id = ?":"session_id = ?";
        $this->host->ajax->setQuery($sqlString, $alias, ($user)?$this->joomlaId:$this->sessionId);
        $this->host->ajax->query();

        $this->page = $alias;
    }

    public function setToken($token, $user = false){
        $sqlString = "UPDATE #__mb_user_map SET `token` = ?, `time` = NOW() WHERE ";
        $sqlString .= ($user)?"user_id = ?":"session_id = ?";
        $id = ( $user )? $this->joomlaId : $this->sessionId ;
        $this->host->ajax->setQuery($sqlString, $token, $id);
        $this->host->ajax->query();

        $this->token = $token;
    }

    public function setJoomlaId($id, $user = false){
        $sqlString = "UPDATE #__mb_user_map SET `user_id` = ?, `time` = NOW() WHERE ";
        $sqlString .= ($user)?"user_id = ?":"session_id = ?";
        $this->host->ajax->setQuery($sqlString, $id, ($user)?$this->joomlaId:$this->sessionId);
        $this->host->ajax->query();
    }

    public function delete($facebook_id){
        $this->host->ajax->setQuery("DELETE FROM #__mb_user_map WHERE facebook_id = ? ", $facebook_id);
        $this->host->ajax->query();

        $this->name = '';
        $this->facebookId = 0;
        $this->joomlaId = 0;
        $this->gedcomId = 0;
        $this->treeId = 0;
        $this->permission = 'GUEST';
        $this->loginType = 0;
        $this->language = 'en-GB';
        $this->page = 'home';
        $this->token = 0;
    }
}

?>