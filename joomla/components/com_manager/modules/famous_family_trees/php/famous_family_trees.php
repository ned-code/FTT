<?php
class JMBFamousFamily {
	protected $host;
	protected $db;
	
	public function __construct(){
		$this->host = &FamilyTreeTopHostLibrary::getInstance();
		$this->db = new JMBAjax();
	}
	
	protected function _getUserTreePermission($args){
		$sqlString = "SELECT type FROM #__mb_tree_links WHERE individuals_id = ? AND tree_id = ? LIMIT 1";
		$this->db->setQuery($sqlString, $args->Id, $args->TreeId);
		$rows = $this->db->loadAssocList();
		return $rows[0]['type'];
	}
	
	protected function _getFamilies(){
		$sqlString = "SELECT id, name, tree_id, individuals_id, permission FROM #__mb_famous_family";
		$this->db->setQuery($sqlString);
		$rows = $this->db->loadAssocList();
		return $rows;
	}
	
	protected function _getTreeKeepers(){
		$sqlString = "SELECT id, individuals_id, famous_family FROM #__mb_tree_keepers";
		$this->db->setQuery($sqlString);
		$rows = $this->db->loadAssocList();
		$result = array();
		if(!empty($rows)){
			foreach($rows as $row){
				$result[$row['individuals_id']] = $row;
			}
		}	
		return $result;
	}
	
	public function getFamilies(){
		 $families = $this->_getFamilies();
		 $result = array();
		 foreach($families as $family){
		 	 $ind = $this->host->gedcom->individuals->get($family['individuals_id']);
		 	 $count = $this->host->gedcom->individuals->getIndividualsCount($family['tree_id']);
		 	 $living = $this->host->gedcom->individuals->getLivingIndividualsCount($family['tree_id']);
		 	 $avatar = $this->host->gedcom->media->getAvatarImage($family['individuals_id']);
		 	 $result[] = array('id'=>$family['id'],'name'=>$family['name'],'tree_id'=>$family['tree_id'],'individ'=>$ind,'descendants'=>$count,'living'=>$living,'avatar'=>$avatar);
		 }
		 $path = "";
		 return json_encode(array('families'=>$result,'path'=>$path));
	}
	
	public function setFamilies($args){
		$args = json_decode($args);
        $jfbLib = JFBConnectFacebookLibrary::getInstance();
        $facebook_id = $jfbLib->getFbUserId();
        $this->host->setUserMap($facebook_id, $args->TreeId, $args->Id, 1);
        $this->host->setUserAlias($facebook_id, 'myfamily');
		return true;
	}
}
?>
