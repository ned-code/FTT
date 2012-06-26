<?php
class JMBInvitateClass {
	protected $host;
    protected $jfg;
	
	public function __construct(){
		$this->host = &FamilyTreeTopHostLibrary::getInstance();
        $this->jfb = JFBConnectFacebookLibrary::getInstance();
	}

    protected function invite($facebook_id, $token){
        $session = JFactory::getSession();

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

        $session->set('clear_token', true);
        $this->host->setUserAlias($facebook_id, 'myfamily');
        return true;
        exit;
    }

    public function checkUser($args){
        $opt = json_decode($args);
        $sql_string = "SELECT i.id, i.fid, u.email
                        FROM #__mb_individuals AS i
                        LEFT JOIN #__jfbconnect_user_map AS map ON map.fb_user_id = i.fid
                        LEFT JOIN #__users AS u ON u.id = map.j_user_id
                        WHERE i.fid !=0";
        $this->host->ajax->setQuery($sql_string);
        $rows = $this->host->ajax->loadAssocList();
        if(!empty($rows)){
            foreach($rows as $row){
                if($row['fid'] != null && $row['fid'] == $opt->id){
                    $individual = $this->host->gedcom->individuals->get($row['id']);
                    return json_encode(array('success'=>true, 'user'=>$individual));
                }
            }
        }

        $sql_string = "SELECT s_gedcom_id FROM #__mb_variables WHERE belongs = ?";
        $this->host->ajax->setQuery($sql_string, $opt->token);
        $rows = $this->host->ajax->loadAssocList();
        $name = false;
        if($rows != null){
            $i = $this->host->gedcom->individuals->get($rows[0]['s_gedcom_id']);
            $name = ($i->FirstName != null)?$i->FirstName:'';
            $name .= ' ';
            $name .= ($i->LastName != null)?$i->LastName:'';
            $name = trim($name);
        } else {
            $session = JFactory::getSession();
            $session->set('clear_token', true);
            $facebook_id = $this->jfb->getFbUserId();
            $this->host->setUserAlias($facebook_id, 'myfamily');
        }
        return json_encode(array('success'=>false, 'sender'=>$name));
    }

    public function accept($args){
        $opt = json_decode($args);
        return $this->invite($opt->object->id, $opt->token);
    }

    public function deny($args){
        $opt = json_decode($args);
        $sql_string = "DELETE FROM #__mb_variables WHERE belongs = ?";
        $this->host->ajax->setQuery($sql_string, $opt->token);
        $this->host->ajax->query();

        $session = JFactory::getSession();
        $session->set('clear_token', true);
        $facebook_id = $this->jfb->getFbUserId();
        $this->host->setUserAlias($facebook_id, 'first-page');
        return json_encode(array('success'=>true));
    }

}
?>