<?php
class JMBLatestUpdates {	
	protected $host;
	protected $db;
	
	protected function getNewPhoto($tree_id){
		$sql_string = "SELECT m_link.gid as gedcom_id, media.change as time FROM #__mb_medias AS media
				LEFT JOIN #__mb_media_link AS m_link ON m_link.mid = media.id
				LEFT JOIN #__mb_tree_links as t_link ON t_link.individuals_id = m_link.gid
				WHERE t_link.tree_id = ?
				ORDER BY  media.change DESC";
		$this->db->setQuery($sql_string, $tree_id);
		$rows = $this->db->loadAssocList();
		return ($rows!=null)?$rows:false;	
	}
	protected function getJustRegistered($tree_id){
		$sql_string = "SELECT ind.id as gedcom_id, ind.join_time as time FROM #__mb_individuals as ind
				LEFT JOIN #__mb_tree_links as t_link ON t_link.individuals_id = ind.id
				WHERE t_link.tree_id = ? AND ind.fid != '0'
				ORDER BY ind.join_time DESC";
		$this->db->setQuery($sql_string, $tree_id);
		$rows = $this->db->loadAssocList();
		return ($rows!=null)?$rows:false;
	}
	protected function getProfileChange($tree_id){
		$sql_string = "SELECT ind.id as gedcom_id, ind.change as time FROM #__mb_individuals as ind
				LEFT JOIN #__mb_tree_links as t_link ON t_link.individuals_id = ind.id
				WHERE t_link.tree_id = ?
				ORDER BY  ind.change DESC";
		$this->db->setQuery($sql_string, $tree_id);
		$rows = $this->db->loadAssocList();
		return ($rows!=null)?$rows:false;
	}
	protected function getFamilyMemberAdded($tree_id){
		$sql_string = "SELECT ind.id as gedcom_id, ind.create_time as time FROM #__mb_individuals AS ind
				LEFT JOIN #__mb_tree_links AS t_link ON t_link.individuals_id = ind.id
				WHERE t_link.tree_id = ?
				ORDER BY  ind.create_time DESC";
		$this->db->setQuery($sql_string, $tree_id);
		$rows = $this->db->loadAssocList();
		return ($rows!=null)?$rows:false;
	}
	protected function getFamilyMemberDeleted($tree_id, $gedcom_id){
		$sql_string = "SELECT value FROM #__mb_cash WHERE tree_id = ? AND individuals_id = ? AND type = 'family_deleted'";
		$this->db->setQuery($sql_string, $tree_id, $gedcom_id);
		$rows = $this->db->loadAssocList();
		return ($rows!=null)?$rows[0]:false;
	}
	protected function getColors(){
		$config = $_SESSION['jmb']['config'];
                $color = array();
                foreach($config['color'] as $key => $element){
                	switch($key){
                	    case "female":
                                    $color['F'] = $element;
                            break;
                            
                            case "male":
                                    $color['M'] = $element;
                            break;
                            
                            case "location":
                                    $color['L'] = $element;
                            break;
                            
                    	    case "famous_header":
                    	    	    $color['famous_header'] = $element;
                    	    break;
                    
                    	    case "family_header":
                    	    	    $color['family_header'] = $element;
                    	    break;
                	}
                }
                return $color;
	}
	protected function getUser($data, $usertree){
		if(!$data) return false;
		if(isset($data['value'])){
			return array(null, $data['value']);
		}
		foreach($data as $object){
			if(isset($usertree[$object['gedcom_id']])){
				$user = $this->host->gedcom->individuals->get($object['gedcom_id']);
				return array($user->Id, $user->FirstName.' '.$user->LastName, $user->Gender);
			}
		}
	}
	
	public function __construct(){
		$this->host = new Host('Joomla');
		$this->db = new JMBAjax();
	}
	
	public function get(){
		$tree_id = $_SESSION['jmb']['tid'];
		$gedcom_id = $_SESSION['jmb']['gid'];
		$permission = $_SESSION['jmb']['permission'];
		
		$usertree = $this->host->usertree->load($tree_id, $gedcom_id);
		
		$new_photo = $this->getUser($this->getNewPhoto($tree_id), $usertree);
		$just_registered = $this->getUser($this->getJustRegistered($tree_id), $usertree);
		$profile_change = $this->getUser($this->getProfileChange($tree_id), $usertree);
		$family_added = $this->getUser($this->getFamilyMemberAdded($tree_id), $usertree);
		$family_deleted = $this->getUser($this->getFamilyMemberDeleted($tree_id, $gedcom_id), $usertree);
		
		$lang = $this->host->getLangList('latest_updates');
		$colors = $this->getColors();
		$config = array('alias'=>'myfamily','login_type'=>$_SESSION['jmb']['login_type'],'colors'=>$colors);
		
		return json_encode(array(
			'config'=>$config,
			'language'=>$lang,
			'data'=>array(
				'PHOTO'=>$new_photo,
				'REGISTER'=>$just_registered,
				'PROFILE'=>$profile_change,
				'ADDED'=>$family_added,
				'DELETED'=>$family_deleted
			),
			'usertree'=>$usertree
		));
		
 	}
}
?>
