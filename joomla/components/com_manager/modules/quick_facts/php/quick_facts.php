<?php
class JMBQuickFacts {
	protected $host;
	
	public function __construct(){
		$this->host = new Host('Joomla');
	}
	
	protected function getColors(){
		$color = array();
		$p = $this->host->getSiteSettings('color');
		for($i=0;$i<sizeof($p);$i++){
                    switch($p[$i]['name']){	
                            case "female":
                                    $color['F'] = $p[$i]['value'];
                            break;
                            
                            case "male":
                                    $color['M'] = $p[$i]['value'];
                            break;
                            
                            case "location":
                                    $color['L'] = $p[$i]['value'];
                            break;
                    }
                }
                return $color;
	}

	
	public function get($type){
		$ownerId = $_SESSION['jmb']['gid'];
		$treeId = $_SESSION['jmb']['tid'];
		switch($type){
			case 'mother':
			case 'father':
				$count = $this->host->gedcom->individuals->getIndivCountByFamilyLine($treeId, $type[0]);
				$living = $this->host->gedcom->individuals->getLivingIndivCountByFamilyLine($treeId, $type[0], $count);
				$youngest = $this->host->getUserInfo($this->host->gedcom->individuals->getIdYoungestMemberByFamilyLine($treeId, $type[0]), $ownerId);
				$oldest = $this->host->getUserInfo($this->host->gedcom->individuals->getIdOldestMemberByFamilyLine($treeId, $type[0]), $ownerId);
				$earliest = $this->host->getUserInfo($this->host->gedcom->individuals->getIdEarliestMemberByFamilyLine($treeId,$type[0]), $ownerId);
			break;
			
			default:
				$count = $this->host->gedcom->individuals->getIndivCount($treeId);
				$living = $this->host->gedcom->individuals->getLivingIndivCount($treeId, $count);
				$youngest = $this->host->getUserInfo($this->host->gedcom->individuals->getIdYoungestMember($treeId), $ownerId);
				$oldest = $this->host->getUserInfo($this->host->gedcom->individuals->getIdOldestMember($treeId), $ownerId);
				$earliest = $this->host->getUserInfo($this->host->gedcom->individuals->getIdEarliestMember($treeId), $ownerId);
			break;
		}
		
		$colors = $this->getColors();
		$fmbUser = $this->host->getUserInfo($_SESSION['jmb']['gid']);
		$path = JURI::root(true);
		
		return json_encode(array('count'=>$count,'living'=>$living,'youngest'=>$youngest,'oldest'=>$oldest,'earliest'=>$earliest,'colors'=>$colors,'fmbUser'=>$fmbUser,'path'=>$path));		
	}
}
?>
