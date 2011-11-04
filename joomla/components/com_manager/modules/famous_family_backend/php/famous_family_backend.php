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
	
	protected function getRelatives($row){
		$db =& JFactory::getDBO();
		$sql_string = "SELECT ind.id, name.first_name, name.middle_name, name.last_name FROM #__mb_tree_links as link 
				LEFT JOIN #__mb_individuals as ind ON ind.id = link.individuals_id
				LEFT JOIN #__mb_names as name ON name.gid = ind.id
				WHERE tree_id=?";
		$sql = $this->host->gedcom->sql($sql_string, $row['tree_id']);
		$db->setQuery($sql);
		$rows = $db->loadAssocList();
		return $rows;
	}
	
	protected function getKeeperList(){
		$db =& JFactory::getDBO();
		$sql = "SELECT ind.id, name.first_name, name.middle_name, name.last_name  FROM #__mb_tree_links as links
				LEFT JOIN #__mb_individuals as ind ON ind.id = links.individuals_id
				LEFT JOIN #__mb_names as name ON name.gid = ind.id
				WHERE links.type = 'USER' OR links.type = 'OWNER'";
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
			$result[$row['id']]['relatives'] = $this->getRelatives($row);
			$result[$row['id']]['keepers'] = (isset($keepers[$row['id']]))?$keepers[$row['id']]:false;
		}
		$time = date('Y-m-d H:i:s');
		$keeper_list = $this->getKeeperList();
		return json_encode(array('families'=>$rows,'sort_families'=>$result, 'keeper_list'=>$keeper_list, 'time'=>$time));
	}	
	
	public function setFamousIndivid(){
		$db =& JFactory::getDBO();
		$individuals_id = $_POST['individuals_id'];
		$ind = $this->host->gedcom->individuals->get($individuals_id);
		
		$tree_name = (($ind->FirstName!=null)?$ind->FirstName:'').' '.(($ind->LastName)?$ind->LastName:'').' Tree';
		$tree_id = $ind->TreeId;
		$description = ' ';
		$permission = 2;
		
		//create tree into #__mb_famous_family table;
		$sql_string = "INSERT INTO #__mb_famous_family (`id`, `name`, `tree_id`, `individuals_id`, `description`, `permission`) VALUES (NULL, ?, ?, ?, ?, ?)";
		$sql = $this->host->gedcom->sql($sql_string, $tree_name, $tree_id, $ind->Id, $description, $permission);
		$db->setQuery($sql);
		$db->query();
		$famous_family_id = $db->insertid();
		
		$relatives =  $this->getRelatives(array('tree_id'=>$tree_id));
		return json_encode(array('message'=>'Tree has successfully saved.', 'family'=>array('id'=>$famous_family_id, 'name'=>$tree_name, 'tree_id'=>$tree_id, 'individuals_id'=>$ind->Id, 'description'=>$description, 'permission'=>$permission, 'relatives'=>$relatives)));
		
	}
	
	public function createNewFamousFamily(){
		$db =& JFactory::getDBO();
		$tree_name = $_POST['tree_name'];
		$first_name = $_POST['first_name'];
		$last_name = $_POST['last_name'];
		$know_as = $_POST['know_as'];
		$gender = $_POST['gender'];
		$description = (strlen($_POST['description'])!=0)?$_POST['description']:' ';
		$permission = $_POST['permission'];
		
		if(isset($_FILES['upload'])&&$_FILES['upload']['size']!=0){
			$res = $this->host->gramps->parser->convert($_FILES['upload']['tmp_name']);
			$_SESSION['jmb']['upload'] = array('individuals'=>$res->Individuals, 'families'=>$res->Families);
			return json_encode(array('res'=>$res));
		}
		
		if(strlen($tree_name)<=0) return json_encode(array('error'=>'Invalid tree name.'));
		if(strlen($first_name)<=0) return json_encode(array('error'=>'Invalid FirstName.'));
		
		//create tree into #__mb_tree table;
		$sql_string = "INSERT INTO #__mb_tree (`id`, `name`) VALUES (NULL, ?)";
		$sql = $this->host->gedcom->sql($sql_string, $tree_name);
		$db->setQuery($sql);
		$db->query();
		$tree_id = $db->insertid();
		
		//create user
		$ind = $this->host->gedcom->individuals->create();
		$ind->FacebookId = 0;
		$ind->TreeId = $tree_id;
		$ind->FirstName = $first_name; 
		$ind->LastName = $last_name;
		$ind->Gender = $gender;
		$ind->Nick = $know_as;
		$ind->Id = $this->host->gedcom->individuals->save($ind);
		
		//create tree into #__mb_famous_family table;
		$sql_string = "INSERT INTO #__mb_famous_family (`id`, `name`, `tree_id`, `individuals_id`, `description`, `permission`) VALUES (NULL, ?, ?, ?, ?, ?)";
		$sql = $this->host->gedcom->sql($sql_string, $tree_name, $tree_id, $ind->Id, $description, $permission);
		$db->setQuery($sql);
		$db->query();
		$famous_family_id = $db->insertid();
		
		$rel = array('id'=>$ind->Id, 'first_name'=>$ind->FirstName, 'middle_name'=>$ind->MidleName, 'last_name'=>$ind->LastName);
		
		return json_encode(array('message'=>'Tree has successfully saved.', 'family'=>array('id'=>$famous_family_id, 'name'=>$tree_name, 'tree_id'=>$tree_id, 'individuals_id'=>$ind->Id, 'description'=>$description, 'permission'=>$permission,'relatives'=>array($rel))));	
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
	
	public function deleteFamousFamily($tree_id){
		$db =& JFactory::getDBO();
		$relatives = $this->host->gedcom->individuals->getRelatives($tree_id);
		foreach($relatives as $rel){
			$sql_string = 'DELETE FROM #__mb_individuals WHERE id = ?';
			$sql = $this->host->gedcom->sql($sql_string, $rel['individuals_id']);
			$db->setQuery($sql);
			$db->query();
		}
		$sql_string = "DELETE FROM #__mb_tree WHERE id = ? ";
		$sql = $this->host->gedcom->sql($sql_string, $tree_id);
		$db->setQuery($sql);
		$db->query();
	}
}
?>
