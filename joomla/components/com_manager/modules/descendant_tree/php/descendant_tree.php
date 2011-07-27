<?php

class DescendantTree {
	protected $db;
	protected $host;
	protected $color;
	protected $months = array('Jan'=>1,'Feb'=>2,'Mar'=>3,'Apr'=>4,'May'=>5,'Jun'=>6,'Jul'=>7,'Aug'=>8,'Sep'=>9,'Oct'=>10,'Nov'=>11,'Dec'=>12);
	protected $type = array('Birth'=>'BIRT','Death'=>'DEAT','Married'=>'MARR');

	public function __construct(){
		$this->db =& JFactory::getDBO();
		$this->host = new Host('Joomla');
	}
	
	/**
	*
	*/
	protected function GetFullName($obj){
		$firstName = $obj->FirstName;
		$lastName = $obj->LastName;
		$nick = $obj->Nick;
		return ($nick=='')?$firstName." ".$lastName:$nick." ".$lastName;
	}
	
	/**
	*
	*/
	protected function getNextNode(&$xml, $id){
		 $families = $this->host->gedcom->families->getPersonsFamilies($id,true);
		 $user = "user='true'";
		 if(count($families) == 0){
		 	  $child = $this->host->gedcom->individuals->get($id, true);
		 	  $img = ($child->Gender == "M") ? 'male.gif' : 'female.gif';
		 	  $color = '#'.(($child->Gender=='M')?$this->color['M']:$this->color['F']);
		 	  $flag = ($child->Id == $_SESSION['jmb']['gid'])?$user:"";
		 	  $xml .= "<item id='".$child->Id."' im0='".$img."'  im1='".$img."'  im2='".$img."'>";
		 	  	$xml .= "<itemtext><![CDATA[";
		 	  		$xml .= "<div ".$flag." name='descendant-node' id='".$child->Id."' style='color:".$color.";'>".$this->GetFullName($child)."</div>";
		 	  	$xml .= "]]></itemtext>";
		 	  $xml .= "</item>";	  
		 }
		 elseif(count($families) > 0){
		 	 foreach($families as $family){
		 	 	 $childs = $this->host->gedcom->families->getFamilyChildrenIds($family->Id);
		 	 	 $img = ($family->Sircar->Gender == "M")? "male-family.png" : "fem-family.png" ;
		 	 	 $color_sircar = '#'.(($family->Sircar->Gender=='M')?$this->color['M']:$this->color['F']);
		 	 	 $color_spouse = '#'.(($family->Spouse->Gender=='M')?$this->color['M']:$this->color['F']);
		 	 	 $sircarFlag = ($family->Sircar->Id == $_SESSION['jmb']['gid'])?$user:"";
		 	 	 $spouseFlag = ($family->Spouse->Id == $_SESSION['jmb']['gid'])?$user:"";
		 	 	 if($family->Spouse->Id != null){
		 	 	 	 $xml .= "<item id='".$family->Id."' im0='".$img."'  im1='".$img."'  im2='".$img."'>";
						$xml .= "<itemtext><![CDATA[";
							$xml .= "<table style='display:inline-block;'>";
								$xml .= "<tr>";
									$xml .= "<td><div ".$sircarFlag." name='descendant-node' id='".$family->Sircar->Id."' style='color:".$color_sircar.";'>".$this->GetFullName($family->Sircar)."</div></td>";
									$xml .= "<td><span>&nbsp;+&nbsp;</span></td>";
									$xml .= "<td><div ".$spouseFlag." name='descendant-node' id='".$family->Spouse->Id."' style='color:".$color_spouse.";'>".$this->GetFullName($family->Spouse)."</div></td>";
								$xml .= "</tr>";
							$xml .= "</table>";
						$xml .= "]]></itemtext>";
		 	  	  } else {
		 	  	  	$img = ($family->Sircar->Gender == "M")?'male.gif' : 'female.gif';
		 	  	  	$xml .= "<item id='".$family->Sircar->Id."' im0='".$img."'  im1='".$img."'  im2='".$img."'>";
		 	  	  	$xml .= "<itemtext><![CDATA[";
		 	  		$xml .= "<div ".$sircarFlag." name='descendant-node' id='".$family->Sircar->Id."' style='color:".$color_sircar.";'>".$this->GetFullName($family->Sircar)."</div>";
		 	  		$xml .= "]]></itemtext>"; 
		 	  	  }
		 	  	  foreach($childs as $child){
		 	  		$this->getNextNode($xml, $child['gid']);
		 	  	  }
		 	  	$xml .= "</item>";
		 	 }
		 }	 
	}
	
	/**
	*
	*/
	protected function getTreeItems(&$xml, $index, $render_type){
		$firstParent = $this->host->gedcom->individuals->getFirstParent($index, $render_type, true);
		$xml .= $this->getNextNode($xml, $firstParent);
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
	
	/**
	*
	*/
	public function getTree($render_type){
		$index = $this->host->gedcom->individuals->getIdbyFId($_SESSION['jmb']['fid']);
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
		header("Content-type: text/xml");
		$xml ='<?xml version="1.0" encoding="utf-8"?>';
		$xml .= '<tree id="0">';		
			$xml .= $this->getTreeItems($xml, $index, $render_type);
		$xml .= '</tree>';
		return $xml;
		
	}

	/**
	*
	*/
	public function getPersonInfoJSON($indKey){
		$i = $this->host->getUserInfo($indKey);
		$colors = $this->getColors();
		$path = JURI::root(true);
		return json_encode(array_merge($i, array('colors'=>$colors,'path'=>$path)));
	}
}
?>
