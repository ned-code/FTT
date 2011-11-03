<?php
class JMBFamiliesObject{
	public $indKey;
	public $childrens;
	public $spouses;
	public $parents;
	public function __construct($indKey,$childrens,$spouses,$parents){
		$this->indKey = $indKey;
		$this->childrens = $childrens;
		$this->spouses = $spouses;
		$this->parents = $parents;
	}
}

class JMBFamilies {
	protected $db;
	protected $host;
	protected $ownerId;
	protected $objects=array();
	protected $individs=array();
	
	function __construct(){
		$this->db =& JFactory::getDBO();
		$this->host = new Host('Joomla');
	}
	
	/**
	*
	*/
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

	protected function getSpouses($indKey, $tree, $lib){
		$spouses = $this->host->getSpouses($indKey, $lib);		
		$result = array();
		if(!empty($spouses)){
			foreach($spouses as $id){
				if($id!=null&&isset($tree[$id])){
					if(!isset($this->individs[$id])){
						$this->individs[$id] =  $this->host->getUserInfo($id, $this->ownerId);
					}
					$parents = $this->getParents($id, $tree, $lib);
					$result[] = array('indKey'=>$id,'parents'=>$parents);
				}
			}
			return $result;
		}
		return $result;
	}
	
	protected function getChildrens($indKey, $tree, $lib){
		$childrens = $this->host->getChildsByIndKey($indKey, $lib);
		$result = array();
		if(!empty($childrens)){
			foreach($childrens as $child){
				$id = $child['gid'];
				if(isset($tree[$id])){
					if($id!=null&&!isset($this->individs[$id])){
						$this->individs[$id] =  $this->host->getUserInfo($id, $this->ownerId);
					}			
					$childs = $this->host->getChildsByIndKey($id, $lib);
					$_childs = array();
					if(!empty($childs)){
						foreach($childs as $ch){
							if(isset($tree[$ch['gid']])){
								$_childs[] = $ch;
							}
						}
					}
					
					$spouses = $this->host->getSpouses($id,$lib);	
					$_spouses = array();
					if(!empty($spouses)){
						foreach($spouses as $sp){
							if(isset($tree[$sp])){
								$_spouses = $sp;
							}
						}
					}
					$result[] = array('indKey'=>$id,'children'=>$_childs,'spouses'=>$_spouses);
				}
			}
		}
		return $result;
	}
	
	protected function getParents($indKey, $tree, $lib){
		$parents = $this->host->getParents($indKey, $lib);
		if(empty($parents)) return false;
		$husb = ($parents!=null&&$parents['husb']!=null)?$parents['husb']:false;
		$wife = ($parents!=null&&$parents['wife']!=null)?$parents['wife']:false;
		if($husb&&!isset($tree[$husb])){
			$husb = false;
		}
		if($wife&&!isset($tree[$wife])){
			$wife = false;
		}
		return array('father'=>$husb,'mother'=>$wife);
	}
	
	protected function setFamiliesObject($indKey, $tree, $lib){
		if(isset($tree[$indKey])){
			$this->individs[$indKey] =  $this->host->getUserInfo($indKey, $this->ownerId);
			$spouses = $this->getSpouses($indKey, $tree, $lib);
			$childrens = $this->getChildrens($indKey, $tree, $lib);
			$parents = $this->getParents($indKey, $tree, $lib);
			$object = new JMBFamiliesObject($indKey, $childrens, $spouses, $parents);
			$this->objects[$indKey] = $object;
		}
	}
	
	public function getFamiliesObject($indKey){
		$this->ownerId = $_SESSION['jmb']['gid'];
		$tree = $this->host->getTree($_SESSION['jmb']['gid'], $_SESSION['jmb']['tid'], $_SESSION['jmb']['permission']);
		$lib = $this->host->getTreeLib($_SESSION['jmb']['tid']);
		$this->setFamiliesObject($indKey, $tree, $lib);
		return json_encode(array('individs'=>$this->individs,'objects'=>$this->objects));
	}	
	
	public function getFamilies(){
		$this->ownerId = $_SESSION['jmb']['gid'];
		$tree = $_SESSION['jmb']['tree'];
		$lib = $_SESSION['jmb']['lib'];
		$fmbUser = $this->host->getUserInfo($this->ownerId);
		$colors = $this->getColors();
		$path = JURI::root(true);
		$this->setFamiliesObject($this->ownerId, $tree, $lib);
		return json_encode(array('fmbUser'=>$fmbUser,'path'=>$path,'colors'=>$colors,'individs'=>$this->individs,'objects'=>$this->objects));
	}
}
?>
