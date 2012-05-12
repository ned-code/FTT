<?php
class JMBInvitateClass {
	protected $host;
	
	public function __construct(){
		$this->host = new Host('Joomla');
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

        $sql = "UPDATE #__mb_tree_links SET `type`='USER' WHERE individuals_id =? AND tree_id=?";
        $this->host->ajax->setQuery($sql, $args[0], $args[1]);
        $this->host->ajax->query();

        $sql = "UPDATE #__mb_individuals SET `fid`=?,`change` = NOW(), `join_time`= NOW(), `creator` = ?  WHERE id=?";
        $this->host->ajax->setQuery($sql, $facebook_id, $args[0], $args[0]);
        $this->host->ajax->query();

        $sql = "DELETE FROM #__mb_variables WHERE belongs=?";
        $this->host->ajax->setQuery($sql, $token);
        $this->host->ajax->query();

        $session->set('alias', 'myfamily');
        $session->set('clear_token', true);
        return true;
        exit;
    }

    public function checkUser($facebook_id){
        $sql_string = "SELECT i.id, i.fid, u.email
                        FROM #__mb_individuals AS i
                        LEFT JOIN #__jfbconnect_user_map AS map ON map.fb_user_id = i.fid
                        LEFT JOIN #__users AS u ON u.id = map.j_user_id
                        WHERE i.fid !=0";
        $this->host->ajax->setQuery($sql_string);
        $rows = $this->host->ajax->loadAssocList();
        if(!empty($rows)){
            foreach($rows as $row){
                if($row['fid'] != null && $row['fid'] == $facebook_id){
                    $individual = $this->host->gedcom->individuals->get($row['id']);
                    return json_encode(array('success'=>true, 'user'=>$individual));
                }
            }
        }
        return json_encode(array('success'=>false));
    }

    public function accept($args){
        $opt = json_decode($args);
        return $this->invite($opt->object->id, $opt->token);
    }

}
?>