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
		$parentKey = ($r_type=='father')?$parents['fatherID']:$parents['motherID'];
		if($parentKey!=null){
			$grandParents = $this->host->gedcom->individuals->getParents($parentKey);
			$grandParentKey = ($grandParents['fatherID']!=null)?$grandParents['fatherID']:$grandParents['motherID'];
			if($grandParentKey!=null){
				return $grandParentKey;
			} else {
				return $parentKey;
			}
			
		} else {
			return $indKey;
		}
	}
	
	protected function solo(&$xml, $id){
		$ind = $this->host->gedcom->individuals->get($id);
		$img = ($ind->Gender == "M") ? 'male.gif' : 'female.gif';
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
		 	 $img = ($family->Sircar->Gender == "M")?'male.gif' : 'female.gif';
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
		 if(sizeof($families)==0){
		 	 $this->solo($xml, $indKey);
		 } elseif(sizeof($families)>0){
		 	 foreach($families as $family){
		 	 	 $this->family($xml, $family);
		 	 }
		 }
	}
	
	public function getTree($r_type){
		$firstKey = $this->getFirstParent($r_type);
		ob_clean();
		header("Content-type: text/xml");
		$xml ='<?xml version="1.0" encoding="utf-8"?>';
		$xml .= '<tree id="0">';
			$xml .=  $this->node($xml, $firstKey);
		$xml .= '</tree>';
		return $xml;
	}
	
	public function getPersonInfoJSON($indKey){
		$i = $this->host->getUserInfo($indKey, $this->ownerId);
		$colors = $this->color;
		$path = JURI::root(true);
		return json_encode(array_merge($i, array('colors'=>$colors,'path'=>$path)));
	}
}
?>
