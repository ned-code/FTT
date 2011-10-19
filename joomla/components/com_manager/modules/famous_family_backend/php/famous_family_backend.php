<?php
class JMBFamousFamilyBackend {
	protected $host;
	
	public function __construct(){
		$this->host = new Host('Joomla');

	}
	
	protected function getTreeKeepers(){
		$db =& JFactory::getDBO();
		$sqlString = "SELECT keepers.id, keepers.famous_family, keepers.individuals_id, name.first_name, name.middle_name, name.last_name, ind.last_login FROM #__mb_tree_keepers as keepers
				LEFT JOIN #__mb_individuals as ind ON ind.id = keepers.individuals_id
				LEFT JOIN #__mb_names as name ON name.gid = keepers.individuals_id";
		$sql = $sqlString;
		$db->setQuery($sql);
		$rows = $db->loadAssocList();
		if($rows == null) return array();
		return $this->sortKeepers($rows);
	}
	
	protected function sortKeepers($rows){
		$result = array();
		foreach($rows as $row){
			$result[$row['famous_family']][$row['individuals_id']] = $row;
		}
		return $result;
	}
	
	public function getFamousFamiliesTree(){
		$db =& JFactory::getDBO();
		$sqlString = "SELECT id, name, tree_id, individuals_id, description, permission FROM #__mb_famous_family";
		$sql = $sqlString;
		$db->setQuery($sql);
		$rows = $db->loadAssocList();
		if($rows==null) return json_encode(array('error'=>'Famous families not found...'));
		$keepers = $this->getTreeKeepers();
		$result = array();
		foreach($rows as $row){	
			$result[$row['id']] = $row;
			$result[$row['id']]['keepers'] = (isset($keepers[$row['id']]))?$keepers[$row['id']]:false;
		}
		$time = date('Y-m-d H:i:s');
		return json_encode(array('families'=>$rows,'sort_families'=>$result,'time'=>$time));
	}
	
	public function createNewFamousFamily(){
		$db =& JFactory::getDBO();
		$name = $_POST['name'];
		$individuals_id = $_POST['individuals_id'];
		$description = $_POST['description'];
		$permission = $_POST['permission'];
		
		//get individuals 
		$sqlString = "SELECT id FROM #__mb_individuals WHERE id = ? LIMIT 1";
		$sql = $this->host->gedcom->sql($sqlString, $individuals_id);
		$db->setQuery($sql);
		$rows = $db->loadAssocList();
		if($rows!=null&&strlen($name)!=0){
			$sql = $this->host->gedcom->sql("INSERT INTO #__mb_tree (`id`,name) VALUES (NULL, ?)", $name);
			$db->setQuery($sql);
			$db->query();
			$tree_id = $db->insertid();
			
			$sql = $this->host->gedcom->sql("INSERT INTO #__mb_tree_links (`individuals_id`, `tree_id`, `type`) VALUES (?,?, 'OWNER')", $individuals_id, $tree_id);
			$db->setQuery($sql);
			$db->query();
			
			$sql = $this->host->gedcom->sql("INSERT INTO #__mb_famous_family (`id`, `name`, `tree_id`, `individuals_id`, `description`, `permission`) VALUES (NULL, ?, ?, ?, ?, ?)", $name, $tree_id, $individuals_id, $description , $permission);
			$db->setQuery($sql);
			$db->query();
			return json_encode(array('message'=>'Tree successfully saved!'));
		}
		return json_encode(array('message'=>'Tree save error.'));
	}

	public function save($id){
		$db =& JFactory::getDBO();
		$name = $_POST['name'];
		$individuals_id = $_POST['individuals_id'];
		$description = $_POST['description'];
		$permission = $_POST['permission'];
		
		$sqlString = "UPDATE #__mb_famous_family SET `name` = ?, `individuals_id` = ?, `description` = ?, `permission` = ? WHERE  `id` =?";
		$sql = $this->host->gedcom->sql($sqlString, $name, $individuals_id, $description, $permission, $id);
		$db->setQuery($sql);
		$db->query();
		
		return json_encode(array('message'=>'Tree data saved.'));
	}
	
}
?>
