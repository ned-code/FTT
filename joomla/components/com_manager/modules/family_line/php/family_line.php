<?php
class JMBFamilyLine {
	protected $host;
	
	public function __construct(){
		$this->host = new Host('Joomla');
		$this->db = new JMBAjax();
	}

	protected function getCount($rows, $usertree){
		$index = 0;
		foreach($rows as $el){
			if(isset($usertree[$el['member_id']])){
				$index++;
			}
		}
		return $index;
	}
	
	protected function size($tree_id, $gedcom_id){
		$usertree = $this->host->usertree->load($tree_id, $gedcom_id);
		//father side
		$sql_string = "SELECT member_id FROM #__mb_family_line WHERE tid = ? AND gedcom_id = ? AND is_father = 1 OR is_descendant = 1";
		$this->db->setQuery($sql_string, $tree_id, $gedcom_id);
		$rows = $this->db->loadAssocList();
		$father = $this->getCount($rows, $usertree);
		//mother side
		$sql_string = "SELECT member_id FROM #__mb_family_line WHERE tid = ? AND gedcom_id = ? AND is_mother = 1 OR is_descendant = 1";
		$this->db->setQuery($sql_string, $tree_id, $gedcom_id);
		$rows = $this->db->loadAssocList();
		$mother = $this->getCount($rows, $usertree);
		//relatives, all count
		$relatives = $this->host->gedcom->individuals->getRelatives($tree_id);
		$total = isset($_SESSION['jmb']['tree_size'])?$_SESSION['jmb']['tree_size']:sizeof($relatives);
		return array($total, $mother, $father);
	}
	
	public function get(){
		$session = JFactory::getSession();
		$gedcom_id = $session->get('gedcom_id');
		$tree_id = $session->get('tree_id');
		$permission = $session->get('permission');
		$size = $this->size($tree_id, $gedcom_id);
		return json_encode(array('size'=>$size));
	}
}
?>
