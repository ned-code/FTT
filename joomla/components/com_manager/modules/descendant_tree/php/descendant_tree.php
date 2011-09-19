<?php

class JMBDescendantTree {
	protected $db;
	protected $host;
	protected $color;
	protected $months = array('Jan'=>1,'Feb'=>2,'Mar'=>3,'Apr'=>4,'May'=>5,'Jun'=>6,'Jul'=>7,'Aug'=>8,'Sep'=>9,'Oct'=>10,'Nov'=>11,'Dec'=>12);
	protected $type = array('Birth'=>'BIRT','Death'=>'DEAT','Married'=>'MARR');
	protected $ownerId;
	protected $user = "user='true'";
	
	public function __construct(){
		$this->db =& JFactory::getDBO();
		$this->host = new Host('Joomla');
		$this->ownerId = $_SESSION['jmb']['gid'];
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
                $this->color = $color;
	}
	
	protected function GetFullName($obj){
		$firstName = $obj->FirstName;
		$lastName = $obj->LastName;
		$nick = $obj->Nick;
		return ($nick=='')?$firstName." ".$lastName:$nick." ".$lastName;
	}
	
	protected function getFirstParent($r_type){
		$parents = $this->host->gedcom->individuals->getParents($this->ownerId);
		if(!empty($parents)){
			$parentKey = ($r_type=='father')?$parents['fatherID']:$parents['motherID'];
			if(!empty($parentKey)){
				$grandParents = $this->host->gedcom->individuals->getParents($parentKey);
				$grandParentKey = ($grandParents['fatherID']!=null)?$grandParents['fatherID']:$grandParents['motherID'];
				if($grandParentKey!=null){
					return $grandParentKey;
				} else {
					return $parentKey;
				}
			} 
			return $this->ownerId;
			
		} else {
			return $this->ownerId;
		}
	}
	
	protected function solo(&$xml, $id){
		$ind = $this->host->gedcom->individuals->get($id);
		$img = ($ind->Gender == "M") ? 'male.png' : 'female.png';
		$color = '#';
		$color .= (($ind->Gender=='M')?$this->color['M']:$this->color['F']);
		$flag = ($ind->Id == $this->ownerId)?$this->user:""; 
		$xml .= "<item id='";
			$xml .= $ind->Id;
		 	$xml .= "' im0='";
		 	$xml .= $img;
		 	$xml .= "'  im1='";
		 	$xml .= $img;
		 	$xml .= "'  im2='";
		 	$xml .= $img;
		 	$xml .= "'>";
		 		$xml .= "<itemtext><![CDATA[";
		 	 		$xml .= "<div ";
		 	 			$xml .= $flag;
		 	 			$xml .= " name='descendant-node' id='";
		 	 			$xml .= $ind->Id;
		 	 			$xml .= "' style='color:";
		 	 			$xml .= $color;
		 	 			$xml .= ";'>";
		 	 			$xml .= $this->GetFullName($ind);
		 	 		$xml .= "</div>";
		 	 	$xml .= "]]></itemtext>";
		 	 $xml .= "</item>";
	}
	
	protected function family(&$xml, $family){
		 $childs = $this->host->gedcom->families->getFamilyChildrenIds($family->Id);
		 $img = ($family->Sircar->Gender == "M")? "male-family.png" : "fem-family.png" ;
		 $color_sircar = '#';
		 $color_sircar .=(($family->Sircar&&$family->Sircar->Gender=='M')?$this->color['M']:$this->color['F']);
		 $color_spouse = '#';
		 $color_spouse .=(($family->Spouse&&$family->Spouse->Gender=='M')?$this->color['M']:$this->color['F']);
		 $sircarFlag = ($family->Sircar&&$family->Sircar->Id == $this->ownerId)?$this->user:"";
		 $spouseFlag = ($family->Spouse&&$family->Spouse->Id == $this->ownerId)?$this->user:"";
		 if($family->Spouse&&$family->Spouse->Id != null){
		 	 $xml .= "<item id='";
		 	 	$xml .= $family->Id;
		 	 	$xml .= "' im0='";
		 	 	$xml .= $img;
		 	 	$xml .= "'  im1='";
		 	 	$xml .= $img;
		 	 	$xml .= "'  im2='";
		 	 	$xml .= $img;
		 	 $xml .= "'>";
		 	 $xml .= "<itemtext><![CDATA[";
		 	 $xml .= "<table style='display:inline-block;'>";
		 	 $xml .= "<tr>";
		 	 $xml .= "<td><div ";
		 	 	$xml .= $sircarFlag;
		 	 	$xml .= " name='descendant-node' id='";
		 	 	$xml .= $family->Sircar->Id;
		 	 	$xml .= "' style='color:";
		 	 	$xml .= $color_sircar;
		 	 	$xml .= ";'>";
		 	 	$xml .= $this->GetFullName($family->Sircar);
		 	 $xml .="</div></td>";
		 	 $xml .= "<td><span>&nbsp;+&nbsp;</span></td>";
		 	 $xml .= "<td><div ";
		 	 	$xml .= $spouseFlag;
		 	 	$xml .= " name='descendant-node' id='";
		 	 	$xml .= $family->Spouse->Id;
		 	 	$xml .= "' style='color:";
		 	 	$xml .= $color_spouse;
		 	 	$xml .= ";'>";
		 	 	$xml .= $this->GetFullName($family->Spouse);
		 	 	$xml .= "</div></td>";
		 	 $xml .= "</tr>";
		 	 $xml .= "</table>";
		 	 $xml .= "]]></itemtext>";
		 } else {
		 	 $img = ($family->Sircar->Gender == "M")?'male.png' : 'female.png';
		 	 $xml .= "<item id='";
		 	 	$xml .= $family->Sircar->Id;
		 	 	$xml .= "' im0='";
		 	 	$xml .= $img;
		 	 	$xml .= "'  im1='";
		 	 	$xml .= $img;
		 	 	$xml .= "'  im2='";
		 	 	$xml .= $img;
		 	 $xml .="'>";
		 	 $xml .= "<itemtext><![CDATA[";
		 	 $xml .= "<div ";
		 	 	$xml .= $sircarFlag;
		 	 	$xml .= " name='descendant-node' id='";
		 	 	$xml .= $family->Sircar->Id;
		 	 	$xml .= "' style='color:";
		 	 	$xml .= $color_sircar;
		 	 	$xml .= ";'>";
		 	 	$xml .= $this->GetFullName($family->Sircar);
		 	 	$xml .= "</div>";
		 	 $xml .= "]]></itemtext>"; 
		 }
		 foreach($childs as $child){
		 	 $this->node($xml, $child['gid']);
		 }
		 $xml .= "</item>";
	}

	protected function node(&$xml, $indKey){
		 $families = $this->host->gedcom->families->getPersonFamilies($indKey);
		 if(empty($families)){
		 	 $this->solo($xml, $indKey);
		 } elseif(sizeof($families)>0){
		 	 foreach($families as $family){
		 	 	 $this->family($xml, $family);
		 	 }
		 }
	}
	
	public function getTree($r_type){
		$key = $this->getFirstParent($r_type);
		ob_clean();
		$xml ='<?xml version="1.0" encoding="utf-8"?>';
		$xml .= '<tree id="0">';
			$xml .=  $this->node($xml, $key);
		$xml .= '</tree>';
		$selection = $this->getDescendantsCount($r_type);
		return json_encode(array('xml'=>$xml,'selection'=>$selection));		
	}
	
	public function getTreeById($id){
		ob_clean();
		header("Content-type: text/xml");
		$xml ='<?xml version="1.0" encoding="utf-8"?>';
		$xml .= '<tree id="0">';
			$xml .=  $this->node($xml, $id);
		$xml .= '</tree>';
		return $xml;
	}
	
	protected function _getCount_($indKey, &$count){
		$families = $this->host->gedcom->families->getPersonFamilies($indKey);
		if(sizeof($families)>0){
			foreach($families as $family){
				$childs = $this->host->gedcom->families->getFamilyChildrenIds($family->Id);
				$count = $count + sizeof($childs);
				foreach($childs as $child){
					$this->_getCount_($child['gid'], $count);
				}
			}
		}		
		
		
	}
	
	protected function getCount($indKey){
		if($indKey==null) return false;
		$count = 0;
		$this->_getCount_($indKey, $count);
		return $count;
	}
	
	public function getDescendantsCount($r_type){
		$parents = $this->host->gedcom->individuals->getParents($this->ownerId);
		if(!empty($parents)){
			$parentKey = ($r_type=='father')?$parents['fatherID']:$parents['motherID'];
			if($parentKey==null) return array('response'=>'false');
			$grandparents = $this->host->gedcom->individuals->getParents($parentKey);
			if(!empty($grandparents)){
				$gfather_parents = ($grandparents['fatherID']!=null)?$this->host->gedcom->individuals->getParents($grandparents['fatherID']):false;
				$gmother_parents = ($grandparents['motherID']!=null)?$this->host->gedcom->individuals->getParents($grandparents['motherID']):false;
				$response = array();
				$grandparents_key = ($grandparents['motherID']!=null)?$grandparents['motherID']:$grandparents['fatherID'];
				$response['grandparents'] = array('id'=>$grandparents_key,'count'=>$this->getCount($grandparents_key)); 
				$response['greatgrandparents'] = array();
				if(!empty($gfather_parents)){
					$gfather_parents_key = ($gfather_parents['motherID']!=null)?$gfather_parents['motherID']:$gfather_parents['fatherID'];
					$response['greatgrandparents']['father'] = array('id'=>$gfather_parents_key,'count'=>$this->getCount($gfather_parents_key));
				} else { $response['greatgrandparents']['father'] = false; }
				if(!empty($gmother_parents)){
					$gmother_parents_key = ($gmother_parents['motherID']!=null)?$gmother_parents['motherID']:$gmother_parents['fatherID'];
					$response['greatgrandparents']['mother'] = array('id'=>$gmother_parents_key,'count'=>$this->getCount($gmother_parents_key));
				} else { $response['greatgrandparents']['mother'] = false; } 
				return array('response'=>$response);
			}			
			return array('response'=>'false');
		}
		return array('response'=>'false');
	}
	
	public function getPersonInfoJSON($indKey){
		$fmbUser = $this->host->getUserInfo($_SESSION['jmb']['gid']);
		$i = $this->host->getUserInfo($indKey, $this->ownerId);
		$colors = $this->color;
		$path = JURI::root(true);
		return json_encode(array_merge($i, array('colors'=>$colors,'path'=>$path,'fmbUser'=>$fmbUser)));
	}
}
?>
