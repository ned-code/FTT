<?php
class JMBInvitateClass {
	protected $host;
    protected $user;
	
	public function __construct(){
		$this->host = &FamilyTreeTopHostLibrary::getInstance();
        $this->user = $this->host->user->get();
	}

    protected function invite($facebook_id, $token){
        if(!$token){
            return false;
        }

        $sql = "SELECT value FROM #__mb_variables WHERE belongs=?";
        $this->host->ajax->setQuery($sql, $token);
        $rows = $this->host->ajax->loadAssocList();

        if($rows==null) return false;
        $args = explode(',', $rows[0]['value']);

        $sql = "UPDATE #__mb_individuals SET `fid`=?,`change` = NOW(), `join_time`= NOW(), `creator` = ?  WHERE id=?";
        $this->host->ajax->setQuery($sql, $facebook_id, $args[0], $args[0]);
        $this->host->ajax->query();

        $sql = "DELETE FROM #__mb_variables WHERE belongs=?";
        $this->host->ajax->setQuery($sql, $token);
        $this->host->ajax->query();

        $this->host->user->set($args[1], $args[0], 0);
        $this->host->user->setPermission('USER');
        $this->host->user->setAlias('myfamily');
        $this->host->user->setToken(0);
        return true;
        exit;
    }

    protected function _getSenderEmail($user){
        $sqlString = "SELECT id, name, email FROM #__users WHERE username = ?";
        $this->host->ajax->setQuery($sqlString, 'fb_'. $user->FacebookId);
        return $this->host->ajax->loadAssocList();
    }

    public function checkUser(){
        $sql_string = "SELECT i.id, i.fid as facebook_id, u.email
                        FROM #__mb_individuals AS i
                        LEFT JOIN #__jfbconnect_user_map AS map ON map.fb_user_id = i.fid
                        LEFT JOIN #__users AS u ON u.id = map.j_user_id
                        WHERE i.fid !=0";
        $this->host->ajax->setQuery($sql_string);
        $rows = $this->host->ajax->loadAssocList();

        $language = $this->host->getLangList('invitate');

        if(!empty($rows)){
            foreach($rows as $row){
                if($row['facebook_id'] != null && $row['facebook_id'] == $this->user->facebookId){
                    $individual = $this->host->gedcom->individuals->get($row['id']);
                    return json_encode(array('success'=>true, 'user'=>$individual, 'msg'=>$language));
                }
            }
        }
        if($this->user->token){
            $sql_string = "SELECT s_gedcom_id, value FROM #__mb_variables WHERE belongs = ?";
            $this->host->ajax->setQuery($sql_string, $this->user->token);
            $rows = $this->host->ajax->loadAssocList();
            if(!empty($rows)){
                $opt = explode(',', $rows[0]['value']);
                $user = $this->host->gedcom->individuals->get($rows[0]['s_gedcom_id']);
                $family = $this->host->usertree->getUser($user->TreeId, $user->Id, $user->Id);
                $data = array(
                    'from' => $rows[0]['s_gedcom_id'],
                    'to' => $opt[0],
                    'relation' => $this->host->gedcom->relation->get($opt[1], $opt[0], $rows[0]['s_gedcom_id']),
                    'sender_data' => $this->_getSenderEmail($user)
                );
                return json_encode(array('success'=>false, 'sender'=>$user, 'family'=>$family, 'data' => $data, 'msg'=>$language));
            }
        }
        $this->host->user->setToken(0);
        $this->host->user->setAlias($this->user->facebookId, 'first-page');

        return json_encode(array('success'=>false, 'sender'=>false, 'msg'=>$language));
    }

    public function accept(){
        $facebookId = $this->user->facebookId;
        $token = $this->user->token;
        return $this->invite($facebookId, $token);
    }

    public function deny(){
        $sql_string = "DELETE FROM #__mb_variables WHERE belongs = ?";
        $this->host->ajax->setQuery($sql_string, $this->user->token);
        $this->host->ajax->query();

        $this->host->user->setToken(0);
        $this->host->user->setAlias($this->user->facebookId, 'first-page');
        return json_encode(array('success'=>true));
    }

    public function get(){

    }
}
?>