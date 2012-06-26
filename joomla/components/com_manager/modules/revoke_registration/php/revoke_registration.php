<?php
class JMBRevokeRegistration {
	protected $host;
	
	public function __construct(){
		$this->host = &FamilyTreeTopHostLibrary::getInstance();
	}

    protected function getLinkedUsers(){
        $sql_string = "SELECT i.id as gedcom_id, l.tree_id, n.first_name, n.last_name, n.nick FROM #__mb_individuals as i
                        LEFT JOIN #__mb_names as n ON n.gid = i.id
                        LEFT JOIN #__mb_tree_links as l ON l.individuals_id = i.id
                        WHERE fid != '0'";
        $this->host->ajax->setQuery($sql_string);
        $rows = $this->host->ajax->loadAssocList('gedcom_id');
        $users = array();
        $link = array();
        if($rows != null){
            foreach($rows as $row){
                $el = $row[0];
                $first_name = $el['first_name']!=null?$el['first_name']:'';
                $last_name = $el['last_name']!=null?$el['last_name']:'';
                $username = trim($first_name.' '.$last_name.'(id:'.$el['gedcom_id'].')');
                $users[] = $username;
                $link[$username] = implode(',',array($el['tree_id'],$el['gedcom_id']));
            }
        }
        return array('link'=>$link, 'users'=>$users);
    }

    public function get(){
        $linkedUsers = $this->getLinkedUsers();
        return json_encode($linkedUsers);
    }

    public function unlink($args){
        $link = explode(',', $args);
        $this->host->gedcom->individuals->unlink($link[0], $link[1]);
        $linkedUsers = $this->getLinkedUsers();
        return json_encode($linkedUsers);
    }
}
?>
