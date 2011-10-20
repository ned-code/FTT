<?php
class JMBFamousFamilyBackend {
	protected $host;
	
	public function __construct(){
		$this->host = new Host('Joomla');

	}
	protected function getTreeKeeper($ind_key){
		$db =& JFactory::getDBO();
		$sql_string = "SELECT keepers.id, keepers.famous_family, keepers.individuals_id, name.first_name, name.middle_name, name.last_name, ind.last_login FROM #__mb_tree_keepers as keepers
				LEFT JOIN #__mb_individuals as ind ON ind.id = keepers.individuals_id
				LEFT JOIN #__mb_names as name ON name.gid = keepers.individuals_id
				WHERE ind.id = ?
				";
		$sql = $this->host->gedcom->sql($sql_string, $ind_key);
		$db->setQuery($sql);
		$rows = $db->loadAssocList();
		if($rows == null) return false;
		return $rows;
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
	
	protected function getTrees(){
		$db =& JFactory::getDBO();
		$sqlString = "SELECT id, name FROM #__mb_tree";
		$sql = $sqlString;
		$db->setQuery($sql);
		$rows = $db->loadAssocList();
		return $rows;
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
		$trees = $this->getTrees();
		return json_encode(array('trees'=>$trees,'families'=>$rows,'sort_families'=>$result,'time'=>$time));
	}
	
	public function createNewFamousFamily(){
		$db =& JFactory::getDBO();
		$tree_id = $_POST['tree_id'];
		$individuals_id = $_POST['individuals_id'];
		$description = (strlen($_POST['description'])!=0)?$_POST['description']:' ';
		$permission = $_POST['permission'];
		
		//get individuals 
		$sqlString = "SELECT id FROM #__mb_individuals WHERE id = ? LIMIT 1";
		$sql = $this->host->gedcom->sql($sqlString, $individuals_id);
		$db->setQuery($sql);
		$rows = $db->loadAssocList();
		if($rows!=null){			
			$sql = $this->host->gedcom->sql('SELECT id, name FROM #__mb_tree WHERE id = ?', $tree_id);
			$db->setQuery($sql);
			$rows = $db->loadAssocList();
			$name = $rows[0]['name'];
			
			$sql = $this->host->gedcom->sql("INSERT INTO #__mb_famous_family (`id`, `name`, `tree_id`, `individuals_id`, `description`, `permission`) VALUES (NULL, ?, ?, ?, ?, ?)", $name, $tree_id, $individuals_id, $description , $permission);
			$db->setQuery($sql);
			$db->query();
			$famous_family_id = $db->insertid();
			
			$family = array('id'=>$famous_family_id,'name'=>$name, 'tree_id'=>$tree_id, 'individuals_id'=>$individuals_id, 'description'=>$description, 'permission'=>$permission, 'keepers'=>false);
			return json_encode(array('message'=>'Tree successfully saved!', 'family'=>$family));
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
	
	public function createTreeKeepers($famous_family){
		$db =& JFactory::getDBO();
		$individuals_id = $_POST['individuals_id'];
		//get individuals 
		$sql_string = "SELECT id FROM #__mb_individuals WHERE id = ? LIMIT 1";
		$sql = $this->host->gedcom->sql($sql_string, $individuals_id);
		$db->setQuery($sql);
		$rows = $db->loadAssocList();
		//check if keeper already added
		$sql_string = "SELECT id FROM #__mb_tree_keepers WHERE individuals_id = ? AND famous_family = ?";
		$sql = $this->host->gedcom->sql($sql_string, $individuals_id, $famous_family);
		$db->setQuery($sql);
		$keeper = $db->loadAssocList();
		if($rows!=null&&$keeper==null){
			$sql = $this->host->gedcom->sql("INSERT INTO #__mb_tree_keepers (`id`,`individuals_id`,`famous_family`) VALUES (NULL, ?, ?)", $individuals_id, $famous_family);
			$db->setQuery($sql);
			$db->query();
			
			$keeper_info = $this->getTreeKeeper($individuals_id);
			$time = date('Y-m-d H:i:s');
			return json_encode(array('message'=>'Keeper of the tree is added successfully.','keeper_info'=>$keeper_info, 'time'=>$time));
		}
		return json_encode(array('message'=>'Error.'));
	}	
	
	public function deleteTreeKeeper($args){
		$args = explode(';', $args);
		$db =& JFactory::getDBO();
		$sql_string = "DELETE FROM #__mb_tree_keepers WHERE individuals_id = ? AND famous_family = ?";
		$sql = $this->host->gedcom->sql($sql_string, $args[0], $args[1]);
		$db->setQuery($sql);
		$db->query();
	}
	
	public function deleteFamousFamily($args){
		$db =& JFactory::getDBO();
		$sql_string = "DELETE FROM #__mb_famous_family WHERE id = ? ";
		$sql = $this->host->gedcom->sql($sql_string, $args);
		$db->setQuery($sql);
		$db->query();
	}
}
?>
