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
	
	protected function solo(&$xml, $id, $lib, $tree){
		if(!isset($tree[$id])) return 0;
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
	
	protected function family(&$xml, $family, $lib, $tree){
		 $sircar_in_tree = ($family->Sircar&&isset($tree[$family->Sircar->Id]));
		 $spouse_in_tree = ($family->Spouse&&isset($tree[$family->Spouse->Id]));
		 if(!$sircar_in_tree&&!$spouse_in_tree){ return 0; }
		 //$childs = $this->host->gedcom->families->getFamilyChildrenIds($family->Id);
		 $childs = $this->host->getChildsByFamKey($family->Id, $lib);
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
		 if(!empty($childs)){
			 foreach($childs as $child){
				 $this->node($xml, $child['gid'], $lib, $tree);
			 }
		 }
		 $xml .= "</item>";
	}

	protected function node(&$xml, $indKey, $lib, $tree){
		 $families = $this->host->gedcom->families->getPersonFamilies($indKey);
		 if(empty($families)){
		 	 $this->solo($xml, $indKey, $lib, $tree);
		 } elseif(sizeof($families)>0){
		 	 foreach($families as $family){
		 	 	 $this->family($xml, $family, $lib, $tree);
		 	 }
		 }
	}
	
	public function getTree($r_type){
		$tree = $this->host->getTree($_SESSION['jmb']['gid'], $_SESSION['jmb']['tid'], $_SESSION['jmb']['permission']);
		$lib = $this->host->getTreeLib($_SESSION['jmb']['tid']);
		$parentTree = $this->getDescendantsCount($r_type, $lib, $tree);
		$key = $this->getDefaultKey($parentTree, $r_type);
		$lang = $this->host->getLangList('descendant_tree');
		ob_clean();
		$xml ='<?xml version="1.0" encoding="utf-8"?>';
		$xml .= '<tree id="0">';
			$xml .=  $this->node($xml, $key, $lib, $tree);
		$xml .= '</tree>';
		
		return json_encode(array('xml'=>$xml,'tree'=>$parentTree, 'key'=>$key, 'lang'=>$lang));		
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
		
	protected function getDefaultKey($parentTree, $r_type){
		$father = $parentTree['parents']['father'];
		$mother = $parentTree['parents']['mother'];
		$node = ($r_type=='father')?$father:$mother;
		if($node){
			$gfather = $node['parents']['father'];
			$gmother = $node['parents']['mother'];
			if($gfather||$gmother){
				$gfather_count = ($gfather)?$gfather['descendants']:0;
				$gmother_count = ($gmother)?$gmother['descendants']:0;
				$grandparent = ($gfather_count>=$gmother_count)?$gfather:$gmother;
				$grandparent_count = $grandparent['descendants'];
				
				$greatgrandparents = $grandparent['parents'];
				$greatgrandfather = $greatgrandparents['father'];
				$greatgrandmother = $greatgrandparents['mother'];
				if($greatgrandfather||$greatgrandmother){
					$greatgrandfather_count = ($greatgrandfather)?$greatgrandfather['descendants']:0;
					$greatgrandmother_count = ($greatgrandmother)?$greatgrandmother['descendants']:0;
					$greatgrandparent = ($greatgrandfather_count>=$greatgrandmother_count)?$greatgrandfather:$greatgrandmother;
					$greatgrandparent_count = $greatgrandparent['descendants'];
					$diff = $greatgrandparent_count - $grandparent_count;
					return ($diff>3)?$greatgrandparent['key']:$grandparent['key'];
				}
				return $grandparent['key'];
			}
			return ($node['key']);
		}
		return $parentTree['key'];
	}
		
	protected function sortByPermission($response, $tree, &$result){
		if($response&&isset($tree[$response['key']])){
			$result = array('key'=>$response['key'], 'descendants'=>$response['descendants'], 'level'=>$response['level'], 'parents'=>array('father'=>false,'mother'=>false));
			if($response['parents']&&isset($response['parents']['father'])&&isset($tree[$response['parents']['father']['key']])){
				$this->sortByPermission($response['parents']['father'], $tree, $result['parents']['father']);
			}
			if($response['parents']&&isset($response['parents']['mother'])&&isset($tree[$response['parents']['mother']['key']])){
				$this->sortByPermission($response['parents']['mother'], $tree, $result['parents']['mother']);
			}
		}
	}
	
	protected function getDescendantsCount($render_type, $lib, $tree){
		$owner_id = $_SESSION['jmb']['gid'];
		$tree_id = $_SESSION['jmb']['tid'];
		
		$parents = $this->host->getParents($owner_id, $lib);		
		$parent = ($render_type=='father')?$parents['husb']:$parents['wife'];
		if($parent!=null){
		 	$response = $this->host->getParentTree($owner_id, $lib, 0);
		 	if($_SESSION['jmb']['permission']=='OWNER') return $response;
			$result = array();
			$this->sortByPermission($response, $tree, $result);
			return $result;
		}
		return false;
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
