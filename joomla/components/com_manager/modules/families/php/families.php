<?php
class Families {
	protected $db;
	protected $host;
	
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
	
	public function getFamilies($render_type){
		$id = $this->host->gedcom->individuals->getIdbyFId($_SESSION['jmb']['fid']);
		$fmbUser = $this->_getUserInfo($id);
		$firstParentId = $this->host->gedcom->individuals->getFirstParent($id, $render_type, true);
		$colors = $this->getColors();
		$path = JURI::root(true);
		$individs = array();
		$this->_getIndividsArray($id, $individs);
		return json_encode(array('fmbUser'=>$fmbUser,'firstParent'=>$firstParentId,'individs'=>$individs,'colors'=>$colors,'path'=>$path));
	}
	
	protected function _getUserInfo($id){
		$indiv = $this->host->gedcom->individuals->get($id);
		$parents = $this->host->gedcom->individuals->getParents($id);
		$children = $this->host->gedcom->individuals->getChilds($id);
		$families = $this->host->gedcom->families->getPersonsFamilies($id, true);
		$spouses = array();	
		foreach($families as $family){
			$famevent = $this->host->gedcom->events->getFamilyEvents($family->Id);
			$childs = $this->host->gedcom->families->getFamilyChildrenIds($family->Id);
			$spouses[] = array('id'=>$family->Spouse->Id,'indiv'=>$family->Spouse,'children'=>$childs,'event'=>$famevent);
		}
		$notes = $this->host->gedcom->notes->getLinkedNotes($id);
		$sources = $this->host->gedcom->sources->getLinkedSources($id);
		$photos = $this->host->gedcom->media->getMediaByGedId($id);
		$avatar = $this->host->gedcom->media->getAvatarImage($id);

		return array('indiv'=>$indiv,'parents'=>$parents,'spouses'=>$spouses,'children'=>$children,'notes'=>$notes,'sources'=>$sources,'photo'=>$photos,'avatar'=>$avatar);
	}
	
	protected function _getIndividsArray($id, &$individs){
		if($id==NULL) { return; }
		$indiv = $this->host->gedcom->individuals->get($id);
		$parents = $this->host->gedcom->individuals->getParents($id);
		$children = $this->host->gedcom->individuals->getChilds($id);
		$families = $this->host->gedcom->families->getPersonsFamilies($id);
		$spouses = array();	
		foreach($families as $family){
			$famevent = $this->host->gedcom->events->getFamilyEvents($family->Id);
			$childs = $this->host->gedcom->families->getFamilyChildrenIds($family->Id);
			$spouses[] = array('id'=>$family->Spouse->Id,'indiv'=>$family->Spouse,'children'=>$childs,'event'=>$famevent);
		}
		$notes = $this->host->gedcom->notes->getLinkedNotes($id);
		$sources = $this->host->gedcom->sources->getLinkedSources($id);
		$photos = $this->host->gedcom->media->getMediaByGedId($id);
		$avatar = $this->host->gedcom->media->getAvatarImage($id);
		$individs[$id] = array('indiv'=>$indiv,'parents'=>$parents,'spouses'=>$spouses,'children'=>$children,'notes'=>$notes,'sources'=>$sources,'photo'=>$photos,'avatar'=>$avatar);
		
		//Fill the array of families
		foreach($families as $family){
			if(!array_key_exists($family->Spouse->Id, $individs)){
				$this->_getIndividsArray($family->Spouse->Id, $individs);
			}
		}

		//Fill the array of children
		foreach($children as $child){
			if(!array_key_exists($child['id'], $individs)){
				$this->_getIndividsArray($child['id'], $individs);
			}
		}		
		
		//Fill the array of parents
		if($parents != null){
			if($parents['fatherID'] != null && !array_key_exists($parents['fatherID'], $individs)){
				$this->_getIndividsArray($parents['fatherID'], $individs);
			}
			if($parents['motherID'] != null && !array_key_exists($parents['motherID'], $individs)){
				$this->_getIndividsArray($parents['motherID'], $individs);
			}
		}
	}
}
?>
