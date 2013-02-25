<?php
class JMBDelete {
	protected $host;
	
	public function __construct(){
		$this->host = &FamilyTreeTopHostLibrary::getInstance();
		$this->db = & JFactory::getDBO();
	}
	
	public function clear($treeId, $individuals, $families){
		foreach($individuals as $ind){
			if(!empty($ind))$this->host->gedcom->individuals->delete($ind['individuals_id']);
		}
		foreach($families as $fam){
			if(!empty($fam))$this->host->gedcom->families->delete($fam);
		}
		
		$sql = $this->host->gedcom->sql("DELETE FROM #__mb_tree WHERE id=?", $treeId);
		$this->db->setQuery($sql);
		$this->db->query();
	}
	
	protected function parse($datas){
		$individs = array();
		$families = array();
		foreach($datas as $data){
			foreach($data['families'] as $family){
				if(!array_key_exists($family->Id, $families)){
					$families[$family->Id] = $family->Id;
				}
			}
			if(!array_key_exists($data['indiv']->Id, $individs)){
				$individs[$data['indiv']->Id] = $data['indiv']->Id;
			}
		}
		return array('individs'=>$individs,'families'=>$families);
	}
	
	protected function getFamilies($rows){
		$families = array();
		foreach($rows as $row){
			$families[] = $this->host->gedcom->individuals->getFamilyId($row['individuals_id'], 'FAMS');
		}
		return $families;		
	}
	
	public function delete(){
		$treeId = $this->host->gedcom->individuals->getTreeIdbyFid($_SESSION['jmb']['fid']);
		$relatives = $this->host->gedcom->individuals->getRelatives($treeId);
		$families = $this->getFamilies($relatives);
		$this->clear($treeId, $relatives,$families);
	}

}
?>
