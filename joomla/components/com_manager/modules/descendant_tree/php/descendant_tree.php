<?php

class JMBDescendantTree {
	/*
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
		$tree = $_SESSION['jmb']['tree'];
		$lib = $this->host->getTreeLib($_SESSION['jmb']['tid']);
		$parentTree = $this->host->getParentTree($_SESSION['jmb']['gid'], $lib, 0);
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
	
	public function getPersonInfoJSON($indKey){
		$fmbUser = $this->host->getUserInfo($_SESSION['jmb']['gid']);
		$i = $this->host->getUserInfo($indKey, $this->ownerId);
		$colors = $this->color;
		$path = "";
		return json_encode(array_merge($i, array('colors'=>$colors,'path'=>$path,'fmbUser'=>$fmbUser)));
	}
	*/
	protected $host;
	protected $color;
	protected $owner_id;
	protected $members = array();
	protected $user = "user='true'";
	
	protected function color(){
		$config = $_SESSION['jmb']['config'];
                $color = array();
                foreach($config['color'] as $key => $element){
                	switch($key){
                	    case "female": $color['F'] = $element; break;
                            case "male": $color['M'] = $element;  break;
                            case "location": $color['L'] = $element; break;
                            case "famous_header": $color['famous_header'] = $element; break;
                            case "family_header": $color['family_header'] = $element; break;
                	}
                }
                return $color;
	}
	
	public function __construct(){
		$this->host = new Host('Joomla');
		$this->color = $this->color();
	}
	
	protected function name($object){
		return str_replace('@N.N.', '', implode(' ', array($object['user']['first_name'],$object['user']['last_name']) ) );
	}
	
	protected function solo(&$xml, $user_id, $usertree){
		if(!isset($usertree[$user_id])) return 0;
		$object = $usertree[$user_id];
		$this->members[$user_id] = $object;
		$user = $object['user'];
		$img = ($user['gender'] == "M") ? 'male.png' : 'female.png';
		$color = $this->color[$user['gender']];
		$flag = ($user['gedcom_id'] == $this->owner_id)?$this->user:""; 
		$xml .= "<item id='";
			$xml .= $user['gedcom_id'];
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
		 	 			$xml .= $user['gedcom_id'];
		 	 			$xml .= "' style='color:#";
		 	 			$xml .= $color;
		 	 			$xml .= ";'>";
		 	 			$xml .= $this->name($object);
		 	 		$xml .= "</div>";
		 	 	$xml .= "]]></itemtext>";
		 	 $xml .= "</item>";
	}
	protected function family(&$xml, $user_id, $family, $usertree){
		$sircar = $usertree[$user_id];
		$this->members[$user_id] = $sircar;
		
		$spouse = ($family['spouse']!=null&&isset($usertree[$family['spouse']]))?$usertree[$family['spouse']]:false;
		$childrens = $family['childrens'];
		
		$img = ($spouse['user']['gender'] == "M" )?"male-family.png":"fem-family.png" ;
		if($spouse){
			$spouse_color = $this->color[$spouse['user']['gender']];
			$spouse_flag = ($spouse['user']['gedcom_id'] == $this->owner_id)?$this->user:"";
			$this->members[$spouse['user']['gedcom_id']] = $spouse;
		}
		$sircar_color = $this->color[$sircar['user']['gender']];
		$sircar_flag = ($user_id == $this->owner_id)?$this->user:"";
		
		if($spouse){
			$xml .= "<item id='";
		 	 	$xml .= $family['id'];
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
		 	 	$xml .= $sircar_flag;
		 	 	$xml .= " name='descendant-node' id='";
		 	 	$xml .= $sircar['user']['gedcom_id'];
		 	 	$xml .= "' style='color:#";
		 	 	$xml .= $sircar_color;
		 	 	$xml .= ";'>";
		 	 	$xml .= $this->name($sircar);
		 	 $xml .="</div></td>";
		 	 $xml .= "<td><span>&nbsp;+&nbsp;</span></td>";
		 	 $xml .= "<td><div ";
		 	 	$xml .= $spouse_flag;
		 	 	$xml .= " name='descendant-node' id='";
		 	 	$xml .= $spouse['user']['gedcom_id'];
		 	 	$xml .= "' style='color:#";
		 	 	$xml .= $spouse_color;
		 	 	$xml .= ";'>";
		 	 	$xml .= $this->name($spouse);
		 	 	$xml .= "</div></td>";
		 	 $xml .= "</tr>";
		 	 $xml .= "</table>";
		 	 $xml .= "]]></itemtext>";
		} else {
			$img = ($sircar['user']['gender'] == "M")?'male.png' : 'female.png';
		 	$xml .= "<item id='";
		 		$xml .= $sircar['user']['gedcom_id'];
		 		$xml .= "' im0='";
		 		$xml .= $img;
		 		$xml .= "'  im1='";
		 		$xml .= $img;
		 		$xml .= "'  im2='";
		 		$xml .= $img;
		 	$xml .="'>";
		 	$xml .= "<itemtext><![CDATA[";
		 	$xml .= "<div ";
		 		$xml .= $sircar_flag;
		 		$xml .= " name='descendant-node' id='";
		 		$xml .= $sircar['user']['gedcom_id'];
		 		$xml .= "' style='color:#";
		 		$xml .= $sircar_color;
		 		$xml .= ";'>";
		 		$xml .= $this->name($sircar);
		 		$xml .= "</div>";
		 	$xml .= "]]></itemtext>";	
		}
		
		if(!empty($childrens)){
			foreach($childrens as $child){
				$this->node($xml, $child['gedcom_id'], $usertree);
			}
		}
		
		$xml .= "</item>";
	}
	protected function node(&$xml, $id, $usertree){
		if(isset($usertree[$id])){
			$object = $usertree[$id];
			if($object['families']['length']==0){
				$this->solo($xml, $id, $usertree);	
			} else {
				$families = $object['families'];
				foreach($families as $key => $family){
					if($key!='length'){
						$this->family($xml, $id, $family, $usertree);
					}
				}
			}
		
		}
	}
	protected function xml($id, $usertree){
		$xml ='<?xml version="1.0" encoding="utf-8"?>';
		$xml .= '<tree id="0">';
			$this->node($xml, $id, $usertree);
		$xml .= '</tree>';
		return $xml;
	}
	protected function getParents($object){
		$parents = $object['parents'];
		if($parents!=null){
			foreach($parents as $key => $value){
				if($key!='length'){
					return array($value['mother'], $value['father']);
				}
			}
		}
		return null;
	}
	protected function getFirstParent($id, $usertree, $render, $level=1){
		if($level == 3){
			return $id;
		}
		if(isset($usertree[$id])){
			$object = $usertree[$id];
			$parents = $this->getParents($object);
			if($parents!=null){
				$key = ($render=='mother')?0:1;
				if($parents[$key]!=null){
					//return $parents[$key]['gedcom_id'];
					return $this->getFirstParent($parents[$key]['gedcom_id'], $usertree, 'mother', $level + 1);
				}
			}
			return $id;
		}		
	}
	public function getTree($render){
		$owner_id = $_SESSION['jmb']['gid'];
		$tree_id = $_SESSION['jmb']['tid'];
		$usertree = $this->host->usertree->load($tree_id, $owner_id);
		
		$this->owner_id = $owner_id;
	
		$lang = $this->host->getLangList('descendant_tree');
		$key = $this->getFirstParent($owner_id, $usertree, $render);;
		$tree = false;
		$xml = $this->xml($key, $usertree);
				
		return json_encode(array('xml'=>$xml,'tree'=>$tree,'members'=>$usertree, 'key'=>$key, 'lang'=>$lang));
	}
}
?>
