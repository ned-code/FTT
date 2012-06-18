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
		$session = JFactory::getSession();
		$settings = $session->get('settings');
		$this->color = $settings['colors'];
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
        $gender = $user['gender'] != null ? $user['gender'] : 'M';
		$color = $this->color[$gender];
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
		 	 			$xml .= ";cursor:pointer;'>";
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
		
		$img = ($spouse['user']['gender'] != null && $spouse['user']['gender'] == "M"  )?"male-family.png":"fem-family.png" ;
		if($spouse){
			$spouse_color = $this->color[$spouse['user']['gender']];
			$spouse_flag = ($spouse['user']['gedcom_id'] == $this->owner_id)?$this->user:"";
			$this->members[$spouse['user']['gedcom_id']] = $spouse;
		}
        $sircar_gender = $sircar['user']['gender'] != null ? $sircar['user']['gender'] : 'M';
		$sircar_color = $this->color[$sircar_gender];
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
		 	 	$xml .= ";cursor:pointer;'>";
		 	 	$xml .= $this->name($sircar);
		 	 $xml .="</div></td>";
		 	 $xml .= "<td><span>&nbsp;+&nbsp;</span></td>";
		 	 $xml .= "<td><div ";
		 	 	$xml .= $spouse_flag;
		 	 	$xml .= " name='descendant-node' id='";
		 	 	$xml .= $spouse['user']['gedcom_id'];
		 	 	$xml .= "' style='color:#";
		 	 	$xml .= $spouse_color;
		 	 	$xml .= ";cursor:pointer;'>";
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
		 		$xml .= ";cursor:pointer;'>";
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
					return $this->getFirstParent($parents[$key]['gedcom_id'], $usertree, 'mother', $level + 1);
				}
			}
			return $id;
		}		
	}
	protected function getDescendantsCount($id, $usertree){
		if(!isset($usertree[$id])) return 0;
		$count = 0;
		$object = $usertree[$id];
		if(!empty($object['families'])){
			foreach($object['families'] as $family){
				if($family!='length'){
					$count += sizeof($family['childrens']);
					if(!empty($family['childrens'])){
						foreach($family['childrens'] as $child){
							$count += $this->getDescendantsCount($child['gedcom_id'], $usertree);	
						}
					}
				}
			}
		}
		return $count;
	}
	protected function getDescendantsTree($id, $usertree, $level=0){
		if(!isset($usertree[$id])||$level==4) return false;
		$object = $usertree[$id];
		$parents = $this->getParents($object);
		$tree = array('id'=>$id, 'level'=>$level, 'object'=>$object, 'count'=>$this->getDescendantsCount($id, $usertree), 'parents'=>array());
		if(!empty($parents)){
			foreach($parents as $el){
				if($el!=null){
					$tree['parents'][$el['relation']] = $this->getDescendantsTree($el['gedcom_id'], $usertree, $level + 1);
				}
			}
		}
		return $tree;
	}
	public function getTree($render){
		$session = JFactory::getSession();
		$owner_id = $session->get('gedcom_id');
        $tree_id = $session->get('tree_id');
        $permission = $session->get('permission');

        $this->host->usertree->init($tree_id, $owner_id, $permission);
		$usertree = $this->host->usertree->load($tree_id, $owner_id);

		$this->owner_id = $owner_id;

        $language = $this->host->getLangList('descendant_tree');
		
		$key = $this->getFirstParent($owner_id, $usertree, $render);
		$tree = $this->getDescendantsTree($owner_id, $usertree);
		
		$xml = $this->xml($key, $usertree);
				
		return json_encode(array('xml'=>$xml, 'tree'=>$tree, 'key'=>$key, 'language'=>$language));
	}
	public function getTreeById($id){
		$session = JFactory::getSession();
		$owner_id = $session->get('gedcom_id');
        $tree_id = $session->get('tree_id');
        $permission = $session->get('permission');

        $this->host->usertree->init($tree_id, $owner_id, $permission);
		$usertree = $this->host->usertree->load($tree_id, $owner_id);
		
		$this->owner_id = $owner_id;
		
		$xml = $this->xml($id, $usertree);
		return json_encode(array('xml'=>$xml));
	}
}
?>
