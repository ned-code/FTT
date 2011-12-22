<?php

class JMBDescendantTree {
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
