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
	
	protected function sort($array, $tree, $empty){
		if(empty($array)) { return $empty; }
		$result = array();
		foreach($array as $value){
			if(isset($tree[$value['id']])){
				return $value['id'];
			}
		}
		return $result;
	}
	
	protected function getLanguage(){
		$lang = $this->host->getLangList('quick_facts');
		if(!$lang) return false;
		return $lang;
	}
	
	public function get($type){
		$ownerId = $_SESSION['jmb']['gid'];
		$treeId = $_SESSION['jmb']['tid'];

		switch($_SESSION['jmb']['permission']){
			case 'USER':
			case 'MEMBER':
				$tree = $this->host->getTree($_SESSION['jmb']['gid'], $_SESSION['jmb']['tid'], $_SESSION['jmb']['permission']);
				$count = sizeof($tree);
				$not_living = $this->host->gedcom->individuals->getDeathIndivCount($treeId);
				$youngest = $this->host->gedcom->individuals->getIdYoungestMember($treeId);
				$oldest = $this->host->gedcom->individuals->getIdOldestMember($treeId);
				$earliest = $this->host->gedcom->individuals->getIdEarliestMember($treeId);
				
				$not_living = $this->sort($not_living, $tree, 0);
				$not_living = ($not_living!=0)?sizeof($not_living):0;
				$living = $count - $not_living;
				$youngest = $this->sort($youngest, $tree, null);
				$oldest = $this->sort($oldest, $tree, null);
				foreach($earliest as $value){
					if(isset($tree[$value['id']])&&$value['death']!=null){
						$earliest = $value['id'];
					}
				}
				$earliest = (is_array($earliest))?null:$earliest;
			break;	
			
			case 'OWNER':
				$count = $this->host->gedcom->individuals->getIndivCount($treeId);
				$not_living = $this->host->gedcom->individuals->getDeathIndivCount($treeId);
				$youngest = $this->host->gedcom->individuals->getIdYoungestMember($treeId);
				$oldest = $this->host->gedcom->individuals->getIdOldestMember($treeId);
				$earliest = $this->host->gedcom->individuals->getIdEarliestMember($treeId);
				
				$count = sizeof($count);
				$living = $count - sizeof($not_living);
				$youngest = $youngest[0]['id'];
				$oldest = $oldest[0]['id'];
				$earliest = $earliest[0]['id'];
			break;
		}

		$youngest = ($youngest)?$this->host->getUserInfo($youngest, $ownerId):null;
		$oldest = ($oldest)?$this->host->getUserInfo($oldest, $ownerId):null;
		$earliest = ($earliest)?$this->host->getUserInfo($earliest, $ownerId):null;
		
		$colors = $this->getColors();
		$fmbUser = $this->host->getUserInfo($_SESSION['jmb']['gid']);
		$path = JURI::root(true);
		$lang = $this->getLanguage();
		
		return json_encode(array('lang'=>$lang,'count'=>$count,'living'=>$living,'youngest'=>$youngest,'oldest'=>$oldest,'earliest'=>$earliest,'colors'=>$colors,'fmbUser'=>$fmbUser,'path'=>$path));		
	}
}
?>
