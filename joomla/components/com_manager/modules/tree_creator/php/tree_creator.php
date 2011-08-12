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
		$sql = $this->host->gedcom->sql("SELECT value FROM #__mb_variables WHERE belongs=?",$_SESSION['jmb']['fid']);
		$this->db->setQuery($sql);
		$rows = $this->db->loadAssocList();
		if($rows!=null){
			$this->delete($rows[0]['value']);
		}
	}
	public function send($indKey){
		$ind = $this->host->gedcom->individuals->get($indKey, true);
		$ind->FacebookId = $_SESSION['jmb']['fid'];
		$this->host->gedcom->individuals->update($ind);
		$sql = $this->host->gedcom->sql("INSERT INTO #__mb_family_tree (`t_id` ,`f_id` ,`g_id` ,`type`)VALUES (NULL , ?, ?, 'OWNER')",$_SESSION['jmb']['fid'],$indKey);
		$this->db->setQuery($sql);
		$this->db->query();
		$sql = $this->host->gedcom->sql("DELETE FROM #__mb_variables WHERE belongs=?",$_SESSION['jmb']['fid']);
		$this->db->setQuery($sql);
		$this->db->query();
	}
	public function create(){
		$user = json_decode(file_get_contents('https://graph.facebook.com/'.$_SESSION['jmb']['fid']));
		$ind = new Individual();
		$ind->FacebookId = $user->id;
		$ind->FirstName = $user->first_name;
		$ind->LastName =  $user->last_name;
		$ind->Gender = strtoupper($user->gender);
		$ind->Id = $this->host->gedcom->individuals->save($ind); 	
		$sql = $this->host->gedcom->sql("INSERT INTO #__mb_family_tree (`t_id` ,`f_id` ,`g_id` ,`type`)VALUES (NULL , ?, ?, 'OWNER')",$user->id,$ind->Id );
		$this->db->setQuery($sql);
		$this->db->query();
	}
}
?>
