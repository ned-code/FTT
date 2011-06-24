<?php
class JmbDelete {
	protected $db;
	protected $host;
	
	function __construct(){
		$this->db =& JFactory::getDBO();
		$this->host = new Host('Joomla');
	}
	
	/**
	*
	*/
	protected function setDataLink(&$links, &$individs, $id, $spouse=null, $childs=null, $famId=null){
		if($id == null || $links[$id]) return;
		$parents = $this->host->gedcom->individuals->getParents($id);
				
		$links[$id]['Id'] = $id;
		$links[$id]['Father'] = $parents['fatherID'];
		$links[$id]['Mother'] = $parents['motherID'];
		$links[$id]['Spouse'] = $spouse;
		if($famId == null){ $links[$id]['FamEvents'] = null; }
		else{
			$links[$id]['FamEvents'] = $this->host->gedcom->events->getFamilyEvents($famId);
		}
		if($childs == null){ $links[$id]['Childs'] = null; }
		else{
			foreach($childs as $child){
				$links[$id]['Childs'][] = $child['id'];			
			}
		}
		$children = $this->host->gedcom->families->getFamilyChildrenIds($parents['familyId']);
		$this->setDataLink(&$links, &$individs, $parents['fatherID'], $parents['motherID'], $children, $parents['familyId']);
		$this->setDataLink(&$links, &$individs, $parents['motherID'], $parents['fatherID'], $children, $parents['familyId']);
		$this->setDataIndiv(&$individs, $parents['fatherID']);
		$this->setDataIndiv(&$individs, $parents['motherID']);	
	}
	
	/**
	*
	*/
	protected function setDataIndiv(&$individs, $id){
		if($id == null || $indivs[$id]) return;
		$ind = $this->host->gedcom->individuals->get($id);
		$individs[$id] = $ind;
	}
		
	/**
	*
	*/
	protected function getItemNode(&$links, &$individs, $id){
		$families = $this->host->gedcom->families->getPersonsFamilies($id);
		if(count($families) == 0){
			$this->setDataIndiv(&$individs, $id);
			$this->setDataLink(&$links, &$individs, $id);
		}
		elseif(count($families) >0){
			foreach($families as $family){
				$childs = $this->host->gedcom->families->getFamilyChildrenIds($family->Id);
				foreach($childs as $child){
					$this->getItemNode(&$links, &$individs, $child['id']);
				}
				$this->setDataLink(&$links, &$individs, $family->Sircar->Id, $family->Spouse->Id, $childs, $family->Id);
				$this->setDataLink(&$links, &$individs, $family->Spouse->Id, $family->Sircar->Id, $childs, $family->Id);
				$this->setDataIndiv(&$individs, $family->Sircar->Id);
				$this->setDataIndiv(&$individs, $family->Spouse->Id);
				
			}
		}
	}
	
	/**
	*
	*/
	public function getIndivids(){
		$firstParent = $this->host->gedcom->individuals->getFirstParent($_SESSION['jmb']['gid'], 'father', true);
		$links = array();
		$individs = array();
		$this->getItemNode(&$links, &$individs, $firstParent);
		return $individs;
	}
	
	
	/**
	*
	*/
	public function delete(){
		$individs = $this->getIndivids();
		foreach($individs as $ind){
			$this->host->gedcom->individuals->delete($ind->Id);
		}
		$req = "DELETE FROM #__mb_family_tree  WHERE g_id='".$_SESSION['jmb']['gid']."'";
                $this->db->setQuery($req);
                $this->db->query();
	}
}
?>
