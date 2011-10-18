<?php
class JMBFamousFamilyBackend {
	protected $host;
	
	public function __construct(){
		$this->host = new Host('Joomla');

	}
	
	protected function _getUserTreePermission($args){
		$db =& JFactory::getDBO();
		$sqlString = "SELECT type FROM #__mb_tree_links WHERE individuals_id = ? AND tree_id = ? LIMIT 1";
		$sql = $this->host->gedcom->sql($sqlString, $args->Id, $args->TreeId);
		$db->setQuery($sql);
		$rows = $db->loadAssocList();
		return $rows[0]['type'];
	}
	
	protected function _getFamilies(){
		$db =& JFactory::getDBO();
		$sqlString = "SELECT id, name, tree_id, individuals_id, permission FROM #__mb_famous_family";
		$sql = $sqlString;
		$db->setQuery($sql);
		$rows = $db->loadAssocList();
		return $rows;
	}
	
	public function getFamilies(){
		 $families = $this->_getFamilies();
		 $result = array();
		 foreach($families as $family){
		 	 $ind = $this->host->gedcom->individuals->get($family['individuals_id']);
		 	 $count = $this->host->gedcom->individuals->getIndivCount($family['tree_id']);
		 	 $count = sizeof($count);
		 	 $death = $this->host->gedcom->individuals->getDeathIndivCount($family['tree_id']);
		 	 $living = $count - sizeof($death);
		 	 $avatar = $this->host->gedcom->media->getAvatarImage($family['individuals_id']);
		 	 $result[] = array('id'=>$family['id'],'name'=>$family['name'],'tree_id'=>$family['tree_id'],'individ'=>$ind,'descendants'=>$count,'living'=>$living,'avatar'=>$avatar);
		 }
		 $path = JURI::root(true);
		 return json_encode(array('families'=>$result,'path'=>$path));
	}
	
	public function setFamilies($args){
		$args = json_decode($args);
		$permission = $this->_getUserTreePermission($args);
		$_SESSION['jmb']['fid'] = '0';
        	$_SESSION['jmb']['gid'] = $args->Id;
		$_SESSION['jmb']['tid'] = $args->TreeId;
		$_SESSION['jmb']['permission'] = $permission;
		$_SESSION['jmb']['alias'] = 'myfamily';
		$_SESSION['jmb']['login_type'] = 'famous_family';
	}
}
?>
