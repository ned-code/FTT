<?php
class JMBRelation {
	protected $db;
	protected $families;
	protected $individuals;
	protected $_FamiliesList;
	protected $_ChildrensList;
	protected $_Relatives;
	
	protected function get_parents($gedcom_id){
		$ind_key = 'I'.$gedcom_id;
		if(isset($this->_ChildrensList[$ind_key])){
			$parents = array();
			$families = $this->_ChildrensList[$ind_key];
			foreach($families as $fam){
				$family_id = $fam['family_id'];
				$family_key = 'F'.$family_id;
				if(isset($this->_FamiliesList[$family_key])){
					$family = $this->_FamiliesList[$family_key][0];
					return array($family['husb'], $family['wife']);
				}
			}
		}
		return null;
	}
	
	protected function get_spouse($gedcom_id){
		$ind_key = 'I'.$gedcom_id;
		if(isset($this->_FamiliesList[$ind_key])){
			$family = $this->_FamiliesList[$ind_key][0];
			return $family['wife'];
		}
		return null;
	}
	
	protected function set_ancestors($id, &$ancestors, $level = 1){
		if(!$id) return;
		$parents = $this->get_parents($id);
		if($parents[0]!=null){
			$ancestors[] = array($level, $parents[0]);
			$this->set_ancestors($parents[0], $ancestors, $level + 1);
		}
		if($parents[1]!=null){
			$ancestors[] = array($level, $parents[1]);
			$this->set_ancestors($parents[1], $ancestors, $level + 1);
		}
	}
	
	protected function get_gender($gedcom_id){
		if(isset($this->_IndividualsList[$gedcom_id])){
			return $this->_IndividualsList[$gedcom_id][0]['gender'];
		}
		return null;
		
		$ind = $this->individuals->get($id);
		return $ind->Gender;
	}
	
	protected function lowest_common_ancestor($a_id, $b_id){
		$a_ancestors = array();
		$b_ancestors = array();
		$a_ancestors[] = array(0, $a_id);
		$b_ancestors[] = array(0, $b_id);
		$this->set_ancestors($a_id, $a_ancestors);
		$this->set_ancestors($b_id, $b_ancestors);
		foreach($a_ancestors as $a_anc){
			foreach($b_ancestors as $b_anc){
				if($a_anc[1] == $b_anc[1]){
					return array($a_anc[1], $a_anc[0], $b_anc[0]);
				}
			}
		}
	}
	
	protected function ordinal_suffix($number){
		if ($number % 100 > 10 && $number %100 < 14) {
			$os = 'th';
		} else if ($number == 0) {
			$os = '';
		} else {
			$last = substr($number, -1, 1);
			switch($last) {
				case "1":
					$os = 'st';
				break;
				case "2":
					$os = 'nd';
				break;
				case "3":
					$os = 'rd';
				break;
				default:
					$os = 'th';
				break;
			}
		}
		return $number.$os;
	}
	
	protected function aggrandize_relationship($rel, $dist, $offset = 0){
		$dist -= $offset;
		switch ($dist) {
			case 1:
				return $rel;
			break;
			case 2:
				return 'grand'.$rel;
			break;
			case 3:
				return 'great grand'.$rel;
			break;
			default:
				return $this->ordinal_suffix($dist - 2).' great grand'.$rel;
			break;
		}
	}
	
	protected function format_plural($count, $singular, $plural){	
		return $count.' '.($count == 1 || $count == -1 ? $singular : $plural);
	}
	
	protected function get_relation($a_id, $b_id){
		if($a_id == $b_id){
			return 'self';
		}
		
		$spouses = $this->individuals->getSpouses($a_id);
		if($spouses!=null){
			foreach($spouses as $spouse){
				if($spouse==$b_id){
					return 'spouse';
				}
			}
		}
		
		$lca = $this->lowest_common_ancestor($a_id, $b_id);
		if (!$lca) {
			return false;
		}
		
		$a_level = $lca[1];
		$b_level = $lca[2];

		
		$gender = $this->get_gender($a_id);
		
		if($a_level == 0){
			$rel = ($gender=="M")?'father':'mother';	
			return $this->aggrandize_relationship($rel, $b_level);
		}
		
		if($b_level == 0){
			$rel = ($gender=="M")?'son':'daughter';
			return $this->aggrandize_relationship($rel, $a_level);
		}
		
		if($a_level == $b_level){
			switch($a_level){
				case 1:
					return ($gender=="M")?'brother':'sister';
				break;
				
				case 2:
					return 'cousin';
				break;
				
				default:
					return $this->ordinal_suffix($a_level - 2).' cousin';
				break;
			}
		}
		
		if($a_level == 1){
			$rel = ($gender=="M")?'uncle':'aunt';
			return $this->aggrandize_relationship($rel, $b_level, 1);
		}
		
		if($b_level == 1){
			$rel = ($gender=="M")?'nephew':'niece';
			return $this->aggrandize_relationship($rel, $a_level, 1);
		}
		
		$cous_ord = min($a_level, $b_level) - 1;
		$cous_gen = abs($a_level - $b_level);
		return $this->ordinal_suffix($cous_ord).' cousin '.$this->format_plural($cous_gen, 'time', 'times').' removed';
		
	}
	
	protected function init($tree_id, $gedcom_id){
		$this->_FamiliesList = $this->families->getFamiliesList($tree_id);
		$this->_ChildrensList = $this->families->getChildrensList($tree_id);
		$this->_IndividualsList = $this->individuals->getIndividualsList($tree_id, $gedcom_id);
		$this->_Relatives = $this->individuals->getRelatives($tree_id);
	}
	
	public function __construct(&$families, &$individuals){
		$this->db = new JMBAjax();
		$this->families = $families;
		$this->individuals = $individuals;
	}
	
	public function set_relation($tree_id, $gedcom_id, $check){
		$insert = array();
		foreach($check as $rel){
			$relation = $this->get_relation($rel['individuals_id'], $gedcom_id);
			$insert[] = array('member'=>$rel, 'relation'=>($relation)?$relation:'unknown');
		}
		
		$result = array_chunk($insert, 25, true);
		foreach($result as $res){
			$sql = "INSERT INTO #__mb_relations (`tree_id`, `from`, `to`, `relation`) VALUES ";
			foreach($res as $el){
				$sql .= "('".$tree_id."','".$gedcom_id."','".$el['member']['individuals_id']."','".$el['relation']."'),";
			}
			$this->db->setQuery(substr($sql,0,-1));
			$this->db->query();
		}
		return $insert;
	}

	public function set($tree_id, $gedcom_id, $target_id){
		$this->init($tree_id, $gedcom_id);
		$relation =  $this->get_relation($target_id, $gedcom_id);		
		$sql_string = "INSERT INTO #__mb_relations (`tree_id`, `from`, `to`, `relation`) VALUES (?, ?, ?, ?)";
		$this->db->setQuery($sql_string, $tree_id, $gedcom_id, $target_id, ($relation)?$relation:'unknown');
		$this->db->query();
	}
	
	public function get($tree_id, $gedcom_id, $target_id){
		$this->init($tree_id, $gedcom_id);
		$relation =  $this->get_relation($target_id, $gedcom_id);
		return $relation;
	}
	
	public function check($tree_id, $gedcom_id){
		$this->init($tree_id, $gedcom_id);
		$sql_string = "SELECT rel.to as individuals_id, rel.relation FROM jos_mb_relations as rel WHERE rel.tree_id = ? AND rel.from = ?";
		$this->db->setQuery($sql_string, $tree_id, $gedcom_id);
		$relations = $this->db->loadAssocList('individuals_id');
		if($relations==null){
			$check = $this->_Relatives;
		} else {
			if(sizeof($this->_Relatives) == sizeof($relations)){
				return;
			} else {
				$check = array();
				foreach($this->_Relatives as $rel){
					$id = $rel['individuals_id'];
					if(!isset($relations[$id])){
						$check[] = $rel;
					}
				}
			}
		}
		return $this->set_relation($tree_id, $gedcom_id, $check);
	}
}
?>
