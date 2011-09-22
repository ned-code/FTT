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

	
	public function get(){
		$ownerId = $_SESSION['jmb']['gid'];
		$treeId = $_SESSION['jmb']['tid'];
		$count = $this->host->gedcom->individuals->getIndivCount($treeId);
		$living = $this->host->gedcom->individuals->getLivingIndivCount($treeId, $count);
		$youngest = $this->host->getUserInfo($this->host->gedcom->individuals->getIdYoungestMember($treeId), $ownerId);
		$oldest = $this->host->getUserInfo($this->host->gedcom->individuals->getIdOldestMember($treeId), $ownerId);
		$earliest = $this->host->getUserInfo($this->host->gedcom->individuals->getIdEarliestMember($treeId), $ownerId);
		$colors = $this->getColors();
		$fmbUser = $this->host->getUserInfo($_SESSION['jmb']['gid']);
		$path = JURI::root(true);
		return json_encode(array('count'=>$count,'living'=>$living,'youngest'=>$youngest,'oldest'=>$oldest,'earliest'=>$earliest,'colors'=>$colors,'fmbUser'=>$fmbUser,'path'=>$path));		
	}
}
?>
