<?php
class JMBDelete {
	protected $host;
	
	public function __construct(){
		$this->host = new Host('Joomla');
		$this->db = & JFactory::getDBO();
	}
	
	public function clear($data){
		foreach($data['individs'] as $indiv){
			if(!empty($indiv))$this->host->gedcom->individuals->delete($indiv);
		}
		foreach($data['families'] as $family){
			if(!empty($family))$this->host->gedcom->families->delete($family);
		}
		$sql = $this->host->gedcom->sql("DELETE FROM #__mb_family_tree WHERE f_id=?", $_SESSION['jmb']['fid']);
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
	
	public function delete(){
		$indKey = $this->host->gedcom->individuals->getIdbyFId($_SESSION['jmb']['fid']);
		$individs = array();
		$this->host->getIndividsArray($indKey, $individs);
		$data = $this->parse($individs);
		$this->clear($data);
	}

}
?>
