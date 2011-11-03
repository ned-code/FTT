<?php
class JMBQuickFacts {
	protected $host;
	
	public function __construct(){
		$this->host = new Host('Joomla');
	}
	
	protected function getColors(){
		$config = $_SESSION['jmb']['config'];
                $color = array();
                foreach($config['color'] as $key => $element){
                	switch($key){
                	    case "female":
                                    $color['F'] = $element;
                            break;
                            
                            case "male":
                                    $color['M'] = $element;
                            break;
                            
                            case "location":
                                    $color['L'] = $element;
                            break;
                            
                    	    case "famous_header":
                    	    	    $color['famous_header'] = $element;
                    	    break;
                    
                    	    case "family_header":
                    	    	    $color['family_header'] = $element;
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
		
		/*
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
		*/
		$owner_id = $_SESSION['jmb']['gid'];
		$tree_id = $_SESSION['jmb']['tid'];
		$permission = $_SESSION['jmb']['permission'];
		$tree = $_SESSION['jmb']['tree'];
		
		$count = $this->host->gedcom->individuals->getIndividualsCount($tree_id, $permission, $tree);
		$living = $this->host->gedcom->individuals->getIndividualsCount($tree_id, $permission, $tree);
		$youngest = $this->host->getUserInfo($this->host->gedcom->individuals->getYoungestId($tree_id, $permission, $tree));
		$oldest = $this->host->getUserInfo($this->host->gedcom->individuals->getOldestId($tree_id, $permission, $tree));
		
		$colors = $this->getColors();
		$fmbUser = $this->host->getUserInfo($owner_id);
		$path = JURI::root(true);
		$lang = $this->getLanguage();
		$config = array('alias'=>'myfamily','login_type'=>$_SESSION['jmb']['login_type'],'colors'=>$colors);
		return json_encode(array('lang'=>$lang,'count'=>$count,'living'=>$living,'youngest'=>$youngest,'oldest'=>$oldest,'earliest'=>null,'config'=>$config,'fmbUser'=>$fmbUser, 'tree'=>$tree,'path'=>$path));		
	}
}
?>
