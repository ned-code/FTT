<?php
class JMBRelation {
	protected $individuals;
	
	protected function get_parents($id){
		$parents = $this->individuals->getParents($id);
		$father = $parents['fatherID'];
		$mother = $parents['motherID'];
		return array($father,$mother);
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
	
	protected function get_gender($id){
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

	public function __construct(&$individuals){
		$this->individuals = $individuals;
	}

	public function get_relation($a_id, $b_id){
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
}
?>
