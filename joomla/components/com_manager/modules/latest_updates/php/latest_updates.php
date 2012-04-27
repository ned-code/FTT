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
		//vars
		$session = JFactory::getSession();
		$facebook_id = $session->get('facebook_id');
		$gedcom_id = $session->get('gedcom_id');
        	$tree_id = $session->get('tree_id');
        	$permission = $session->get('permission');

		$usertree = $this->host->usertree->load($tree_id, $gedcom_id);
		
		$new_photo = $this->getUser($this->getNewPhoto($tree_id), $usertree);
		$just_registered = $this->getUser($this->getJustRegistered($tree_id), $usertree);
		$profile_change = $this->getUser($this->getProfileChange($tree_id), $usertree);
		$family_added = $this->getUser($this->getFamilyMemberAdded($tree_id), $usertree);
		$family_deleted = $this->getUser($this->getFamilyMemberDeleted($tree_id, $gedcom_id), $usertree);
		
		$lang = $this->host->getLangList('latest_updates');

		return json_encode(array(
			'language'=>$lang,
			'data'=>array(
				'FTT_MOD_LATEST_UPDATES_NEW_PHOTO'=>$new_photo,
				'FTT_MOD_LATEST_UPDATES_JUST_REGISTER'=>$just_registered,
				'FTT_MOD_LATEST_UPDATES_PROFILE_CHANGES'=>$profile_change,
				'FTT_MOD_LATEST_UPDATES_FAMILY_MEMBER_ADDED'=>$family_added,
				'FTT_MOD_LATEST_UPDATES_FAMILY_MEMBER_DELETED'=>$family_deleted
			)
		));
		
 	}
}
?>
