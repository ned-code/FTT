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

    public function checkUser(){
        $sql_string = "SELECT i.id, i.fid as facebook_id, u.email
                        FROM #__mb_individuals AS i
                        LEFT JOIN #__jfbconnect_user_map AS map ON map.fb_user_id = i.fid
                        LEFT JOIN #__users AS u ON u.id = map.j_user_id
                        WHERE i.fid !=0";
        $this->host->ajax->setQuery($sql_string);
        $rows = $this->host->ajax->loadAssocList();
        if(!empty($rows)){
            foreach($rows as $row){
                if($row['facebook_id'] != null && $row['facebook_id'] == $this->user->facebookId){
                    $individual = $this->host->gedcom->individuals->get($row['id']);
                    return json_encode(array('success'=>true, 'user'=>$individual));
                }
            }
        }
        if($this->user->token){
            $sql_string = "SELECT s_gedcom_id FROM #__mb_variables WHERE belongs = ?";
            $this->host->ajax->setQuery($sql_string, $this->user->token);
            $rows = $this->host->ajax->loadAssocList();
            if(!empty($rows)){
                $i = $this->host->gedcom->individuals->get($rows[0]['s_gedcom_id']);
                $name = ($i->FirstName != null)?$i->FirstName:'';
                $name .= ' ';
                $name .= ($i->LastName != null)?$i->LastName:'';
                $name = trim($name);
                return json_encode(array('success'=>false, 'sender'=>$name));
            }
        }
        $this->host->user->setToken(0);
        $this->host->user->setAlias($this->user->facebookId, 'first-page');
        return json_encode(array('success'=>false, 'sender'=>false));
    }

    public function accept(){
        return $this->invite($this->user->facebookId, $this->user->token);
    }

    public function deny(){
        $sql_string = "DELETE FROM #__mb_variables WHERE belongs = ?";
        $this->host->ajax->setQuery($sql_string, $this->user->token);
        $this->host->ajax->query();

        $this->host->user->setToken(0);
        $this->host->user->setAlias($this->user->facebookId, 'first-page');
        return json_encode(array('success'=>true));
    }

}
?>