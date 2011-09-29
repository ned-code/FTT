<?php
class TreeCreator {
	protected $host;
	
	public function __construct(){
		$this->host = new Host('Joomla');
		$this->db = & JFactory::getDBO();

	}

	public function delete($args){
		$args = explode(';',$args);
		$individs = explode(',',$args[0]);
		$families = explode(',',$args[1]);
		foreach($individs as $indiv){
			$this->host->gedcom->individuals->delete($indiv);
		}
		foreach($families as $family){
			$this->host->gedcom->families->delete($family);
		}
		$sql = $this->host->gedcom->sql("DELETE FROM #__mb_variables WHERE belongs=?", $_SESSION['jmb']['fid']);
		$this->db->setQuery($sql);
		$this->db->query();
	}
	
	public function parse($array){
		$arr = array();
		foreach($array as $object){
			$arr[] = $object->Id;
		}
		return implode(',', $arr);
	}
	
	public function tmp($res){
		$sql = $this->host->gedcom->sql("DELETE FROM #__mb_variables WHERE belongs=?", $_SESSION['jmb']['fid']);
		$this->db->setQuery($sql);
		$this->db->query();
		$indivs = $this->parse($res->Individuals);
		$families = implode(',', $res->Families);
		$result = $indivs.';'.$families;
		$sql = $this->host->gedcom->sql("INSERT INTO #__mb_variables (`id` ,`belongs` ,`value`)VALUES (NULL , ?, ?)", $_SESSION['jmb']['fid'], $result);
		$this->db->setQuery($sql);
		$this->db->query();
	}
	public function upload($indKey){
		if($_FILES['upload']['size']!=0){
			$res = $this->host->gramps->parser->convert($_FILES['upload']['tmp_name']);
			$this->tmp($res);
			return json_encode(array('res'=>$res));
		}
		return false;
	}
	
	public function cancel(){
		$fid =$_SESSION['jmb']['fid'];
		$sql = $this->host->gedcom->sql("SELECT value FROM #__mb_variables WHERE belongs=?",$fid);
		$this->db->setQuery($sql);
		$rows = $this->db->loadAssocList();
		if($rows!=null){
			$this->delete($rows[0]['value']);
		}
	}
	
	public function addOwnerLink($treeId, $indKey){
		$sql = $this->host->gedcom->sql("DELETE FROM #__mb_tree_links WHERE individuals_id=?",$indKey);
		$this->db->setQuery($sql);
		$this->db->query();
		$sql = $this->host->gedcom->sql("INSERT INTO #__mb_tree_links (`individuals_id` ,`tree_id`, `type`)VALUES (?, ?, 'OWNER')", $indKey, $treeId);
		$this->db->setQuery($sql);
		$this->db->query();
		$_SESSION['jmb']['tid'] = $treeId;
		$_SESSION['jmb']['gid'] = $indKey;		
	}
	
	public function createLogs($tree_id){
		$sql = "INSERT INTO #__mb_updates (`type`,`tree_id`) VALUES 
		('new_photo', ".$tree_id."),
		('just_registered', ".$tree_id."),
		('profile_change', ".$tree_id."),
		('family_member_added', ".$tree_id."),
		('family_member_deleted', ".$tree_id.")";
		$this->db->setQuery($sql);
		$this->db->query();
	}
	
	public function send($indKey){
		$fid = $_SESSION['jmb']['fid'];
		$ind = $this->host->gedcom->individuals->get($indKey, true);
		$ind->FacebookId = $fid;
		$this->host->gedcom->individuals->update($ind);
		
		$sql = $this->host->gedcom->sql("INSERT INTO #__mb_tree (`id` ,`name`)VALUES (NULL, ?)",$ind->FirstName.' '.$ind->LastName.' Tree');
		$this->db->setQuery($sql);
		$this->db->query();
		$id = $this->db->insertid();
		$this->createLogs($id);

		$sql = "SELECT value FROM #__mb_variables WHERE belongs='".$fid."'";
		$this->db->setQuery($sql);
		$rows = $this->db->loadAssocList();
		$value = explode(';', $rows[0]['value']);
		$individs = explode(',', $value[0]);
		foreach($individs as $indiv){
			if(!empty($indiv)){
				$sql = $this->host->gedcom->sql("INSERT INTO #__mb_tree_links (`individuals_id` ,`tree_id`, `type`)VALUES (?, ?, 'MEMBER')", $indiv, $id);
				$this->db->setQuery($sql);
				$this->db->query();
			}
		}	
		
		$this->addOwnerLink($id, $ind->Id);
		$this->host->createCashFamilyLine($id,$ind->Id);
		
		$sql = $this->host->gedcom->sql("DELETE FROM #__mb_variables WHERE belongs=?",$_SESSION['jmb']['fid']);
		$this->db->setQuery($sql);
		$this->db->query();
	}
	public function create(){
		$user = json_decode(file_get_contents('https://graph.facebook.com/'.$_SESSION['jmb']['fid']));
		$sql = $this->host->gedcom->sql("INSERT INTO #__mb_tree (`id` ,`name`)VALUES (NULL, ?)",$user->first_name.' '.$user->last_name.' Tree');
		$this->db->setQuery($sql);
		$this->db->query();
		$id = $this->db->insertid();
		$this->createLogs($id);
		$ind = new Individual();
		$ind->FacebookId = $user->id;
		$ind->FirstName = $user->first_name;
		$ind->LastName =  $user->last_name;
		$ind->TreeId = $id;
		$ind->Gender = strtoupper($user->gender);
		$ind->Id = $this->host->gedcom->individuals->save($ind); 		
		$this->addOwnerLink($id, $ind->Id);
	}
}
?>
