<?php

class FTTUserLibrary {
    //global objects
    private $host;
    private $user;
    private $facebookFields;
    private $currentAlias;

    //get variable
    private $sessionId;
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
    private $data = ' ';

    public function __construct(&$host){
        $this->host = $host;
        $this->user = JFactory::getUser();
        $this->sessionId = $this->host->jSession->getId();

        $this->clearCache();
        $this->setUserData();

        $this->checkUserPermission();

        $this->token = $this->getToken();

        $this->process();
    }

    protected function clearCache(){
        $timestamp = date("Y-m-d H:i:s", time() - 3600*24 );
        $sqlString = "DELETE FROM #__mb_user_map WHERE time < ? AND facebook_id = 0 AND user_id = 0";
        $this->host->ajax->setQuery($sqlString, $timestamp);
        $this->host->ajax->query();
    }

    protected function _getIndividualsInSystem($facebook_id){
        $sqlString = "SELECT link.individuals_id as gedcom_id, link.tree_id as tree_id, link.type as permission
                    FROM #__mb_tree_links as link
                    LEFT JOIN #__mb_individuals as ind ON ind.id = link.individuals_id
                    WHERE ind.fid=?";
        $this->host->ajax->setQuery($sqlString, $facebook_id);
        $data = $this->host->ajax->loadAssocList();
        if(empty($data)){
            return false;
        } else {
            return $data[0];
        }
    }

    protected function setUserData(){
        if($this->user->guest) return 0;

        $this->currentAlias = $this->getCurrentAlias();

        $this->name = $this->user->name;
        $this->joomlaId = $this->user->id;
        $this->facebookId = $this->getUserFacebookIdByUserName();
        $this->facebookFields = $this->getFacebookFields();
        $this->gender = $this->getGender();
        $this->language = $this->getLangauge();

        $userInSystem = $this->_getIndividualsInSystem($this->facebookId);

        $this->gedcomId = $this->getGedcomId($userInSystem);
        $this->treeId =  $this->getTreeId($userInSystem);
        $this->permission = $this->getPermission($userInSystem);

        $this->page = $this->currentAlias;

        $this->loginType = 0;
        $this->birthday = '';
        $this->data = ' ';
    }

    protected function getFacebookUserId($fb){
        $id = $fb->getUser(false);
        if($id == 0 || $id == null){
            return 0;
        }
        return $id;
    }

    protected function checkUserPermission(){
        $fb =  $this->host->jfbConnect->getFbClient();
        $id =  $this->getFacebookUserId($fb);
        if($id != 0 && $this->facebookId != 0 && $this->facebookId != $id){
            $this->exitFromJoomla();
            $this->clear();
        }
    }

    protected function exitFromFacebbok(){
        $jfbcLibrary = $this->host->jfbConnect;
        $fbClient = $jfbcLibrary->getFbClient();
        $fbClient->destroySession();
    }

    protected function exitFromJoomla(){
        $app = JFactory::getApplication();
        $app->logout();
    }

    protected function getFacebookFields(){
        return $this->host->jfbConnect->api('/'. $this->facebookId);
    }

    protected function getGender(){
        return $this->facebookFields['gender'];
    }

    protected function getLangauge(){
        $locale = $this->facebookFields['locale'];
        return $this->host->language->getLanguage($locale);
    }

    protected function getUserFacebookIdByUserName(){
        $username = explode('_', $this->user->username);
        return $username[1];
    }

    protected function getCurrentAlias(){
        $menu   = &JSite::getMenu();
        $active   = $menu->getActive();
        if(is_object($active)){
            return $active->alias;
        } else {
            return false;
        }
    }

    protected function getGedcomId($userInSystem){
        if($userInSystem){
            return $userInSystem['gedcom_id'];
        } else {
            return 0;
        }
    }

    protected function getTreeId($userInSystem){
        if($userInSystem){
            return $userInSystem['tree_id'];
        } else {
            return 0;
        }
    }

    protected function getPermission($userInSystem){
        if($userInSystem){
            return $userInSystem['permission'];
        } else {
            return 'GUEST';
        }
    }

    protected function getToken(){
        $token = JRequest::getVar('token');
        if(!empty($token)){
            return $token;
        }

        if(!$this->joomlaId) return 0;

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

    protected function getSessionMap(){
        $sqlString = "SELECT facebook_id, session_id, user_id, tree_id, gedcom_id, permission, login_type, page, language, token, data FROM #__mb_user_map WHERE session_id = ?";
        $this->host->ajax->setQuery($sqlString, $this->sessionId);
        $result = $this->host->ajax->loadAssocList();
        if(empty($result)){
            return false;
        }
        return $result[0];
    }

    protected function getUserMap(){
        if(!$this->joomlaId) return false;
        $sqlString = "SELECT facebook_id, session_id, user_id, tree_id, gedcom_id, permission, login_type, page, language, token, data FROM #__mb_user_map WHERE user_id = ?";
        $this->host->ajax->setQuery($sqlString, $this->joomlaId);
        $result = $this->host->ajax->loadAssocList();
        if(empty($result)){
            return false;
        }
        return $result[0];
    }

    protected function create(){
        $sqlString = "INSERT INTO #__mb_user_map (`facebook_id`,`session_id`,`tree_id`, `gedcom_id`, `user_id`, `permission`, `login_type`, `page`,`language`, `token`, `data`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";
        $this->host->ajax->setQuery($sqlString, $this->facebookId, $this->sessionId, $this->treeId, $this->gedcomId, $this->joomlaId, $this->permission, $this->loginType, $this->page, $this->language, $this->token, 0);
        $this->host->ajax->query();
    }

    protected function checkToken($data, $user = false){
        if(strlen($this->token) > 1 && strlen($data['token']) == 1){
            $this->setToken($this->token, $user);
        }
    }

    protected function checkUserInSystem($data, $user = false){
        if($this->treeId != 0 && $data['tree_id'] == 0 && $this->joomlaId != 0){
            $this->set($this->treeId, $this->gedcomId, 0, $user);
            $this->setPermission($this->permission, $user);
        }
    }

    protected function checkJoomlaUser($data){
        if($this->joomlaId != 0 && $data['user_id'] == 0){
            $this->setJoomlaId($this->joomlaId);
            $this->setMapFacebookId($this->facebookId);
        }
    }

    protected function checkSession(){
        $selectString = "SELECT session_id FROM #__mb_user_map WHERE session_id = ?";
        $this->host->ajax->setQuery($selectString, $this->sessionId);
        $result = $this->host->ajax->loadAssocList();

        if(!empty($result)){
            $deleteString = "DELETE FROM #__mb_user_map WHERE session_id = ? AND facebook_id = 0 AND user_id = 0";
            $this->host->ajax->setQuery($deleteString, $this->sessionId);
            $this->host->ajax->query();
        }

        $updateString = "UPDATE #__mb_user_map SET `session_id` = ?, `time` = NOW() WHERE user_id = ?";
        $this->host->ajax->setQuery($updateString, $this->sessionId, $this->joomlaId);
        $this->host->ajax->query();
    }

    protected function update($data){
        $this->facebookId = $data['facebook_id'];
        $this->joomlaId = $data['user_id'];
        $this->gedcomId = $data['gedcom_id'];
        $this->treeId = $data['tree_id'];
        $this->permission = $data['permission'];
        $this->loginType = $data['login_type'];
        $this->language = $data['language'];
        $this->page = $data['page'];
        $this->token = $data['token'];
        $this->data = $data['data'];
    }

    protected function process(){
        $session = $this->getSessionMap();
        $user = $this->getUserMap();
        if($user){
            $this->update($user);
            $this->checkUserInSystem($user, true);
            $this->checkToken($user, true);
            $this->checkSession();
        } else {
            if($session){
                $this->update($session);
                $this->checkJoomlaUser($user);
                $this->checkUserInSystem($user);
                $this->checkToken($session);
            } else {
                $this->create();
            }
        }
    }

    public function get(){
        $result = array(
            'jUser' => $this->user,
            'facebookFields' => $this->facebookFields,
            'data' => $this->data,
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
            'guest'=> $this->user->guest,
            'token' => $this->token,
            'email' => $this->facebookFields['email']
        );
        return (object)$result;
    }

    public function getJoomlaUser(){
        return $this->user;
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

    public function clearToken(){
        if(!$this->joomlaId) return false;

        $sqlString = "UPDATE #__mb_user_map SET `token` = '0', `time` = NOW() WHERE user_id = ?";
        $this->host->ajax->setQuery($sqlString, $this->joomlaId);
        $this->host->ajax->query();

        $this->token = 0;
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
        $this->data = ' ';
    }

    public function clear(){
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
        $this->data = ' ';
    }
}




?>