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
        $this->_setUserMap();
    }

    protected function _getUserProfileFields($facebookId){
        if(!$facebookId) return false;
        $fields = array(0 => 'first_name', 1 => 'last_name', 2 => 'email', 3 => 'name', 4 =>'locale');
        $result = $this->host->jfbConnect->getUserProfile($facebookId, $fields);
        $result['id'] = $facebookId;
        return $result;
    }

    protected function _getUserId(){
        $id = $this->host->jfbConnect->getUserId();
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

    protected function _getUserMap(){
        $sqlString = "SELECT facebook_id, session_id, user_id, tree_id, gedcom_id, permission, login_type, page, language, active FROM #__mb_user_map WHERE session_id = ?";
        $this->host->ajax->setQuery($sqlString, $this->sessionId);
        $result = $this->host->ajax->loadAssocList();
        if(empty($result)){
            return false;
        }
        return $result[0];
    }

    protected function _set($userMap){
        $this->gedcomId = $userMap['gedcom_id'];
        $this->treeId = $userMap['tree_id'];
        $this->permission = $userMap['permission'];
        $this->loginType = $userMap['login_type'];
        $this->language = $userMap['language'];
        $this->page = $userMap['page'];
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

    protected function _setUserMap(){
        $userMap = $this->_getUserMap();
        $userInSystem = $this->_getIndividualsInSystem($this->facebookId);
        if($userMap){
            if($this->facebookId && !$userMap['facebook_id']){
                $this->facebookFields = $this->_getUserProfileFields($this->facebookId, array('id','email','name','first_name','last_name','gender','locale','link'));
                $this->language = $this->host->language->getLanguage($this->facebookFields['locale']);
                $this->name = $this->_getUserName();
                $this->set($userInSystem['tree_id'], $userInSystem['gedcom_id'], $userInSystem['permission']);
                $this->setMapFacebookId($this->facebookId);
                $this->setLanguage($this->language);
                $this->setPermission($userInSystem['permission']);
                $this->_set(array(
                    'gedcom_id' =>$userInSystem['gedcom_id'],
                    'tree_id' =>$userInSystem['tree_id'],
                    'permission' =>$userInSystem['permission'],
                    'login_type'=>$userMap['login_type'],
                    'language'=>$this->language,
                    'page'=>$userMap['page']
                ));
            } else {
                $this->_set($userMap);
            }
            return true;
        }
        $sqlString = "INSERT INTO #__mb_user_map (`facebook_id`,`session_id`,`tree_id`, `gedcom_id`, `user_id`, `permission`, `login_type`, `page`,`language`, `active`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";
        if($userInSystem){
            $this->host->ajax->setQuery($sqlString, $this->facebookId, $this->sessionId, $userInSystem['tree_id'], $userInSystem['gedcom_id'], $this->joomlaId, $userInSystem['permission'], 0, $this->currentAlias, $this->language, 0);
            $this->host->ajax->query();
            $this->_set(array(
                'gedcom_id' =>$userInSystem['gedcom_id'],
                'tree_id' =>$userInSystem['tree_id'],
                'permission' =>$userInSystem['permission'],
                'login_type'=>0,
                'language'=>$this->language,
                'page'=>$this->currentAlias
            ));
        } else {
            $this->host->ajax->setQuery($sqlString, $this->facebookId, $this->sessionId, 0, 0, $this->joomlaId, 'GUEST', 0, $this->currentAlias, $this->language, 0);
            $this->host->ajax->query();
            $this->_set(array(
                'gedcom_id' =>0,
                'tree_id' =>0,
                'permission' =>'GUEST',
                'login_type'=>0,
                'language'=>$this->language,
                'page'=>$this->currentAlias
            ));
        }
    }

    public function get(){
       $result = array(
            'facebookFields' => $this->facebookFields,
            'sessionId' => $this->sessionId,
            'name' => $this->name,
            'facebookId' => $this->facebookId,
            'joomlaId' => $this->joomlaId,
            'gedcomId' => $this->gedcomId,
            'treeId' => $this->treeId,
            'permission' => $this->permission,
            'language' => $this->language,
            'loginType' => $this->loginType,
            'page' => $this->page,
            'guest'=> $this->joomla->guest
        );
        return (object)$result;
    }

    public function getJoomlaUser(){
        return $this->joomla;
    }

    public function getFaceebokFields(){

    }

    public function set($tree_id, $gedcom_id, $login_type = 0){
        $sqlString = "UPDATE #__mb_user_map SET `tree_id` = ?, `gedcom_id` = ? , `login_type` = ?, `time` = NOW() WHERE session_id = ?";
        $this->host->ajax->setQuery($sqlString, $tree_id, $gedcom_id, $login_type, $this->sessionId);
        $this->host->ajax->query();

        $this->gedcomId = $gedcom_id;
        $this->treeId = $tree_id;
        $this->loginType = $login_type;
    }

    public function setPermission($permission){
        $sqlString = "UPDATE #__mb_user_map SET `permission` = ?, `time` = NOW() WHERE session_id = ?";
        $this->host->ajax->setQuery($sqlString, $permission, $this->sessionId);
        $this->host->ajax->query();

        $this->permission = $permission;
    }

    public function setMapFacebookId($facebook_id){
        $sqlString = "UPDATE #__mb_user_map SET `facebook_id` = ?, `time` = NOW() WHERE session_id = ?";
        $this->host->ajax->setQuery($sqlString, $facebook_id, $this->sessionId);
        $this->host->ajax->query();

        $this->facebookId = $facebook_id;
    }

    public function setLanguage($language){
        $sqlString = "UPDATE #__mb_user_map SET `language` = ?, `time` = NOW() WHERE session_id = ?";
        $this->host->ajax->setQuery($sqlString, $language, $this->sessionId);
        $this->host->ajax->query();

        $this->language = $langauge;
    }

    public function setAlias($alias){
        $sqlString = "UPDATE #__mb_user_map SET `page` = ?, `time` = NOW() WHERE session_id = ?";
        $this->host->ajax->setQuery($sqlString, $alias, $this->sessionId);
        $this->host->ajax->query();

        $this->page = $alias;
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
    }
}

?>