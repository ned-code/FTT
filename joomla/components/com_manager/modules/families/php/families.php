<?php
class JMBFamiliesObject{
	public $indKey;
	public $childrens;
	public $spouses;
	public function __construct($indKey,$childrens,$spouses){
		$this->indKey = $indKey;
		$this->childrens = $childrens;
		$this->spouses = $spouses;
	}
}

class JMBFamilies {
	/*
	protected $db;
	protected $host;
	
	function __construct(){
		$this->db =& JFactory::getDBO();
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
	
	public function _getFamilies($render_type){
		$id = $this->host->gedcom->individuals->getIdbyFId($_SESSION['jmb']['fid']);
		$fmbUser = $this->host->getUserInfo($id);
		$firstParentId = $this->host->gedcom->individuals->getFirstParent($id, $render_type, true);
		$colors = $this->getColors();
		$path = JURI::root(true);
		$individs = array();
		$this->host->getIndividsArray($id, $individs, $id);
		return json_encode(array('debug'=>array('fid'=>$_SESSION['jmb']['fid'],'id'=>$id),'fmbUser'=>$fmbUser,'firstParent'=>$firstParentId,'individs'=>$individs,'colors'=>$colors,'path'=>$path));
	}
	*/
	/*****************************/
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

	protected function getSpouses($indKey){
		$spouses = $this->host->gedcom->individuals->getSpouses($indKey);
		$result = array();
		foreach($spouses as $id){
			if($id!=null&&!array_key_exists($id, $this->individs)){
				$this->individs[$id] =  $this->host->getUserInfo($id, $this->ownerId);
			}
			$parents = $this->host->gedcom->individuals->getParents($id);
			
		}
		return ($spouses!=null)?$spouses:array();
	}
	
	protected function getChildrens($indKey){
		$childrens = $this->host->gedcom->individuals->getChildsId($indKey);
		$result = array();
		foreach($childrens as $child){
			$id = $child['id'];
			if($id!=null&&!array_key_exists($id, $this->individs)){
				$this->individs[$id] =  $this->host->getUserInfo($id, $this->ownerId);
			}
			$childs = $this->host->gedcom->individuals->getChildsId($id);
			$spouses = $this->host->gedcom->individuals->getSpouses($id);
			$spouses = ($spouses!=null)?$spouses:array();
			$result[] = array('indKey'=>$id,'children'=>$childs,'spouses'=>$spouses);
		}
		return $result;
	}
	
	protected function setFamiliesObject($indKey){
		$this->individs[$indKey] =  $this->host->getUserInfo($indKey, $this->ownerId);
		$spouses = $this->getSpouses($indKey);
		$childrens = $this->getChildrens($indKey);
		$object = new JMBFamiliesObject($indKey, $childrens, $spouses);
		$this->objects[$indKey] = $object;
	}
	
	public function getFamiliesObject($indKey){
		$this->ownerId = $_SESSION['jmb']['gid'];
		$this->setFamiliesObject($indKey);
		return json_encode(array('individs'=>$this->individs,'objects'=>$this->objects));
	}	
	
	public function getFamilies(){
		$this->ownerId = $_SESSION['jmb']['gid'];
		$fmbUser = $this->host->getUserInfo($this->ownerId);
		$colors = $this->getColors();
		$path = JURI::root(true);
		$this->setFamiliesObject($this->ownerId);
		return json_encode(array('fmbUser'=>$fmbUser,'path'=>$path,'colors'=>$colors,'individs'=>$this->individs,'objects'=>$this->objects));
	}
}
?>
