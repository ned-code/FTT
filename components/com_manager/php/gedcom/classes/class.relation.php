<?php
class JMBRelation {
	private $ajax;
    private $families;
    private $individuals;
    private $ownerId;
    private $spouses;
    private $_FamiliesList;
    private $_ChildrensList;
    private $_IndividualsList;
    private $_Relatives;
    private $_Relations;

    public function __construct(&$ajax, &$families, &$individuals){
        $this->ajax = $ajax;
        $this->families = $families;
        $this->individuals = $individuals;
    }

    protected function get_name($gedcom_id){
        if(isset($this->_IndividualsList[$gedcom_id])){
            $i = $this->_IndividualsList[$gedcom_id];
            if(!empty($i)){
                $pl = $i[0];
                return trim(implode(" ", array($pl["first_name"], $pl["middle_name"], $pl["last_name"])));
            }
        }
        return '';
    }

    protected function get_siblings($gedcom_id){
        $indKey = "I".$gedcom_id;
        $siblings = array();
        if(isset($this->_ChildrensList[$indKey])){
            $families = $this->_ChildrensList[$indKey];
            foreach($families as $family){
                $familyId = $family['family_id'];
                $familyKey = "F".$familyId;
                if(isset($this->_ChildrensList[$familyKey])){
                    $childrens = $this->_ChildrensList[$familyKey];
                    $siblings = array_merge($siblings, $childrens);
                }
            }
        }
        return $siblings;
    }

    protected function get_childrens($gedcom_id){
        $childrens = array();
        $indKey = "I".$gedcom_id;
        if(isset($this->_FamiliesList[$indKey])){
            $families = $this->_FamiliesList[$indKey];
            foreach($families as $family){
                $famKey = "F".$family['family_id'];
                if(isset($this->_ChildrensList[$famKey])){
                    $childs = $this->_ChildrensList[$famKey];
                    foreach($childs as $child){
                        $childrens[] = $child;
                    }
                }
            }
        }
        return $childrens;
    }

	protected function get_parents($gedcom_id){
		$ind_key = 'I'.$gedcom_id;
        $parents = array();
		if(isset($this->_ChildrensList[$ind_key])){
			$families = $this->_ChildrensList[$ind_key];
			foreach($families as $fam){
				$family_id = $fam['family_id'];
				$family_key = 'F'.$family_id;
				if(isset($this->_FamiliesList[$family_key])){
					$family = $this->_FamiliesList[$family_key][0];
					$parents[] = array($family['husb'], $family['wife']);
				}
			}
		}
        return $parents;
	}
	
	protected function get_spouses($gedcom_id){
        $indKey = 'I'.$gedcom_id;
        $indGender = $this->get_gender($gedcom_id);
        $type = ($indGender == "M")?"wife":"husb";
        if(isset($this->_FamiliesList[$indKey])){
            $families = $this->_FamiliesList[$indKey];
            $spouses = array();
            foreach($families as $family){
                $spouses[] = $family[$type];
            }
            return $spouses;
        }

		return null;
	}
	
	protected function set_ancestors($id, &$ancestors, $level = 1){
		if(!$id) return;
		$parents = $this->get_parents($id);
		if(!empty($parents) && $parents[0][0] != null){
			$ancestors[] = array($level, $parents[0][0]);
			$this->set_ancestors($parents[0][0], $ancestors, $level + 1);
		}
		if(!empty($parents)  && $parents[0][1] != null){
			$ancestors[] = array($level, $parents[0][1]);
			$this->set_ancestors($parents[0][1], $ancestors, $level + 1);
		}
	}
	
	protected function get_gender($gedcom_id){
        if(isset($this->_IndividualsList[$gedcom_id])){
			return $this->_IndividualsList[$gedcom_id][0]['gender'];
		}
		return null;
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
				return array($rel, 0);
			break;
			case 2:
				return array('grand'.$rel, 100);
			break;
			case 3:
				return array('great grand'.$rel, 200);
			break;
			default:
				return array($this->ordinal_suffix($dist - 2).' great grand'.$rel, 300);
			break;
		}
	}
	
	protected function format_plural($count, $singular, $plural){	
		return $count.' '.($count == 1 || $count == -1 ? $singular : $plural);
	}

	protected function get_relation($a_id, $b_id){
		if($a_id == $b_id){
			return array('self', 0);
		}

		$spouses = $this->get_spouses($b_id);
		if($spouses!=null){
			foreach($spouses as $spouse){
				if($spouse==$a_id){
					return array('spouse', 1);
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
            $srel = $this->aggrandize_relationship($rel, $b_level);
			return array($srel[0], 2 + $srel[1]);
		}
		
		if($b_level == 0){
			$rel = ($gender=="M")?'son':'daughter';
            $srel = $this->aggrandize_relationship($rel, $a_level);
			return array($srel[0], 3 + $srel[1]);
		}
		
		if($a_level == $b_level){
			switch($a_level){
				case 1:
                    $ret = ($gender=="M")?'brother':'sister';
					return array($ret, 4);
				break;
				
				case 2:
					return array('cousin', 5);
				break;
				
				default:
					return array($this->ordinal_suffix($a_level - 2).' cousin', 5);
				break;
			}
		}
		
		if($a_level == 1){
			$rel = ($gender=="M")?'uncle':'aunt';
            $srel = $this->aggrandize_relationship($rel, $b_level, 1);
			return array($srel[0], 6 + $srel[1]);
		}
		
		if($b_level == 1){
			$rel = ($gender=="M")?'nephew':'niece';
            $srel = $this->aggrandize_relationship($rel, $a_level, 1);
			return array($srel[0], 7 + $srel[1]);
		}
		
		$cous_ord = min($a_level, $b_level) - 1;
		$cous_gen = abs($a_level - $b_level);
		return array($this->ordinal_suffix($cous_ord).' cousin '.$this->format_plural($cous_gen, 'time', 'times').' removed', 5);
		
	}

    protected function deleteFromDb($tree_id, $gedcom_id){
        $sql_string = "DELETE FROM #__mb_relations WHERE `tree_id` = ? and `from` = ?";
        $this->ajax->setQuery($sql_string, $tree_id, $gedcom_id);
        $this->ajax->query();
    }

	protected function init($tree_id, $gedcom_id){
        $this->_FamiliesList = $this->families->getFamiliesList($tree_id);
		$this->_ChildrensList = $this->families->getChildrensList($tree_id);
		$this->_IndividualsList = $this->individuals->getIndividualsList($tree_id, $gedcom_id);
		$this->_Relatives = $this->individuals->getRelatives($tree_id);

        $sql_string = "SELECT rel.to as individuals_id, rel.relation, rel.blood, rel.in_law, rel.connection, rel.time FROM #__mb_relations as rel WHERE rel.tree_id = ? AND rel.from = ?";
        $this->ajax->setQuery($sql_string, $tree_id, $gedcom_id);
        $this->_Relations = $this->ajax->loadAssocList('individuals_id');

        $this->ownerId = $gedcom_id;
        $this->spouses = array();

        $spouses = $this->get_spouses($gedcom_id);
        foreach($spouses as $spouse){
            $this->spouses[$spouse] = true;
        }
	}

    public function get($tree_id, $gedcom_id, $target_id){
        $this->init($tree_id, $gedcom_id);
        $relation =  $this->get_relation($target_id, $gedcom_id);
        return $relation[0];
    }


    public function set($tree_id, $gedcom_id, $target_id){
        return false;
	}
	

    public function set_relation($tree_id, $gedcom_id, $check){
        $this->init($tree_id, $gedcom_id);
        $relations = array();
        $waves = array();
        $this->getRelationsWaves($waves, array("I".$gedcom_id=>null));
        foreach($check as $id){
            $relation = $this->get_relation($id, $gedcom_id);
            $conn = $this->getConnection($id, $waves);
            if($relation){
                $rel = (gettype($relation) == "string")?$relation:$relation[0];
                $relations["I".$id] = array("blood"=>1, "in_law" => 0, "relation"=>$rel, "connection"=>$conn);
            } else {
                $nbrelation = $this->getNotBloodRelation($id, $relations);
                if($nbrelation){
                    $relations["I".$id] = array("blood"=>0, "in_law" => 1, "relation"=>$nbrelation, "connection"=>json_encode($conn));
                } else {
                    $relations["I".$id] = array("blood"=>0, "in_law" => 0, "relation"=>"unknown", "connection"=>"");
                }
            }
        }
        $this->sendToDb($relations, $tree_id, $gedcom_id);
        return true;
    }

    protected function deleteUnknownFromDb($tree_id, $gedcom_id){
        $sql_string = "DELETE FROM #__mb_relations WHERE `tree_id` = ? and `from` = ? and relation = 'unknown' and DATE_ADD(time, INTERVAL 1 HOUR) < NOW()";
        $this->ajax->setQuery($sql_string, $tree_id, $gedcom_id);
        $this->ajax->query();

        $sql_string = "SELECT rel.to as individuals_id, rel.relation, rel.blood, rel.in_law, rel.connection, rel.time FROM #__mb_relations as rel WHERE rel.tree_id = ? AND rel.from = ?";
        $this->ajax->setQuery($sql_string, $tree_id, $gedcom_id);
        $this->_Relations = $this->ajax->loadAssocList('individuals_id');
    }

    protected function deleteRelationsFromDb($tree_id, $gedcom_id){
        $sql_string = "DELETE FROM #__mb_relations WHERE `tree_id` = ? and `from` = ? and DATE_ADD(time, INTERVAL 1 HOUR) < NOW()";
        $this->ajax->setQuery($sql_string, $tree_id, $gedcom_id);
        $this->ajax->query();

        $sql_string = "SELECT rel.to as individuals_id, rel.relation, rel.blood, rel.in_law, rel.connection, rel.time FROM #__mb_relations as rel WHERE rel.tree_id = ? AND rel.from = ?";
        $this->ajax->setQuery($sql_string, $tree_id, $gedcom_id);
        $this->_Relations = $this->ajax->loadAssocList('individuals_id');
    }

    protected function findUnknownUsers(){
        $relations = $this->_Relations;
        $check = array();
        if(sizeof($this->_Relatives) == sizeof($relations)){
            return array();
        } else {
            foreach($this->_Relatives as $rel){
                $id = $rel['individuals_id'];
                if(!isset($relations[$id])){
                    $check[] = $rel;
                }
            }
        }
        return $check;
    }

    protected function sendToDb($relations, $tree_id, $gedcom_id){
        $inserts = array();
        foreach($relations as $key => $value){
            $inserts[] = array("indKey" => $key, "relations"=>$value);
        }
        $result = array_chunk($inserts, 25, true);
        foreach($result as $res){
            $sql = "INSERT INTO #__mb_relations (`tree_id`, `from`, `to`, `blood`, `in_law`,`n_relation`, `relation`, `connection`, `time`) VALUES ";
            foreach($res as $el){
                $indKey = substr($el['indKey'],1);
                $relation = $el['relations']['relation'];
                $connection = $el['relations']['connection'];
                $blood = $el['relations']['blood'];
                $in_law = $el['relations']['in_law'];
                $n_relation = $el['relations']['n_relation'];
                $sql .= "('".$tree_id."','".$gedcom_id."','".$indKey."', '".$blood."', '".$in_law."','".$n_relation."','".$relation."','".$connection."', NOW()),";
            }
            $this->ajax->setQuery(substr($sql,0,-1));
            $this->ajax->query();
        }
    }

    protected function getRelationsWaves(&$waves, $users, $level = 0){
        if(empty($users)) return false;
        $wave = array();
        foreach($users as $key => $value){
            if(isset($waves[$key])) continue;
            $user_id = substr($key, 1);
            $ambit = array();
            //set parents
            $parents = $this->get_parents($user_id);
            if(!empty($parents)){
                foreach($parents as $pair){
                    if($pair[0] != null && $pair[0] != $user_id){
                        $ambit["I".$pair[0]] = array("id"=>$pair[0], "relation"=>"father", "stream"=>4);
                    }
                    if($pair[1] != null && $pair[1] != $user_id){
                        $ambit["I".$pair[1]] = array("id"=>$pair[1], "relation"=>"mother", "stream"=>4);
                    }
                }
            }

            //set childrens
            $childrens = $this->get_childrens($user_id);
            if(!empty($childrens)){
                foreach($childrens as $child){
                    if(isset($child['gedcom_id']) && $user_id == $child['gedcom_id']) continue;
                    $childId = $child['gedcom_id'];
                    $childGender = $this->get_gender($childId);
                    $childRelation = ($childGender == "F")?"daughter":"son";
                    $ambit["I".$childId] = array("id"=>$childId, "relation"=>$childRelation, "stream"=>3);
                }
            }

            //set spouses
            $spouses = $this->get_spouses($user_id);
            if(!empty($spouses)){
                foreach($spouses as $spouse){
                    if($user_id == $spouse) continue;
                    $ambit["I".$spouse] = array("id"=>$spouse, "relation"=>"spouse", "stream"=>2);
                }
            }

            //set siblings
            $siblings = $this->get_siblings($user_id);
            if(!empty($siblings)){
                foreach($siblings as $sibling){
                    if(isset($sibling['gedcom_id']) && $user_id == $sibling['gedcom_id']) continue;
                    $siblId = $sibling['gedcom_id'];
                    $siblGender = $this->get_gender($siblId);
                    $siblRelation = ($siblGender == "F")?"brother":"sister";
                    $ambit["I".$siblId] = array("id"=>$siblId, "relation"=>$siblRelation, "stream"=>1);
                }
            }

            $waves["I".$user_id] = array("level"=>$level, "ambit"=>$ambit);
            if(!isset($waves["W".$level])){
                $waves["W".$level] = array();
            }
            $waves["W".$level]["I".$user_id] = true;

            foreach($ambit as $k => $v){
                $wave[$k] = $v;
            }
        }
        return $this->getRelationsWaves($waves, $wave, $level + 1);
    }

    protected function getConnection($gedcom_id, &$waves){
        $paths = array();
        if(isset($waves["I".$gedcom_id])){
            $object = $waves["I".$gedcom_id];
            $level = $object['level'];
            $lastId = "I".$gedcom_id;
            $paths[] = array("id"=>substr($lastId,1), "level"=>$level, "stream"=>0);
            for($i = $level - 1; $i >= 0 ; $i--){
                $wave = $waves["W".$i];
                $ambit = $waves[$lastId]['ambit'];
                foreach($wave as $id => $flag){
                    foreach($ambit as $k => $v){
                        if($id == $k){
                            $paths[] = array("id"=>substr($k,1), "level"=>$i, "stream"=>$v['stream']);
                            $lastId = $k;
                        }
                    }
                }
            }
        }
        return array_reverse($paths);
    }

    protected function getSpouseInLawRelation($relation){
        preg_match( "/(\W|^)(daughter|son|brother|sister|cousin|uncle|aunt|nephew|niece|granddaughter|grandson)(\W|$)/", $relation, $matches);
        if(sizeof($matches) != 0 && trim($matches[0]) != ""){
            $match = trim($matches[0]);
            switch($match){
                case "daughter":
                    return "son-in-law";
                case "son":
                    return "daughter-in-law";
                case "brother":
                    return "sister-in-law";
                case "sister":
                    return "brother-in-law";
                case "cousin":
                    return "cousin-in-law";
                case "uncle":
                    return "aunt-in-law";
                case "aunt":
                    return "aunt-in-law";
                case "nephew":
                    return "niece-in-law";
                case "niece":
                    return "nephew-in-law";
                case "granddaughter":
                    return "grandson-in-law";
                case "grandson":
                    return "granddaughter-in-law";
                default:
                    return false;
            }
        }
        return false;
    }

    protected function getNotBloodRelation($user_id, $relations){
        $childrens = $this->get_childrens($user_id);
        if(!empty($childrens)){
            foreach($childrens as $child){
                $childId = $child["gedcom_id"];
                if(array_key_exists("I".$childId, $relations) || array_key_exists($childId, $this->_Relations)){
                    if(array_key_exists($childId, $this->spouses) && array_key_exists($user_id, $this->_IndividualsList)){
                        $ind = $this->_IndividualsList[$user_id];
                        $gender = $ind[0]["gender"];
                        return ($gender=="F")?"mother-in-law":"father-in-law";
                    }
                }
            }
        }
        $spouses = $this->get_spouses($user_id);
        if(!empty($spouses)){
            foreach($spouses as $spouse){
                if(array_key_exists("I".$spouse, $relations)){
                    return $this->getSpouseInLawRelation($relations["I".$spouse]["relation"]);
                } else if(array_key_exists($spouse, $this->_Relations)){
                    return $this->getSpouseInLawRelation($this->_Relations[$spouse][0]["relation"]);
                }
            }
        }
        return false;
    }

	public function check($tree_id, $gedcom_id){
        $this->init($tree_id, $gedcom_id);

        $waves = array();
        $this->getRelationsWaves($waves, array("I".$gedcom_id=>null));

        $this->deleteRelationsFromDb($tree_id, $gedcom_id);
        $relatives = $this->findUnknownUsers();

        $relations = array();
        $unknowns = array();
        foreach($relatives as $user){
            $user_id = $user['individuals_id'];
            $relation = $this->get_relation($user_id, $gedcom_id);
            if($relation){
                $conn = $this->getConnection($user_id, $waves);
                $relations["I".$user_id] = array("blood"=>1, "in_law" => 0, "relation"=>$relation[0], "n_relation" => $relation[1], "connection"=>json_encode($conn));
            } else {
                $unknowns[] = $user_id;
            }
        }

        foreach($unknowns as $user_id){
            $relation = $this->getNotBloodRelation($user_id, $relations);
            if($relation){
                $conn = $this->getConnection($user_id, $waves);
                $relations["I".$user_id] = array("blood"=>0, "in_law" => 1, "relation"=>$relation, "connection"=>json_encode($conn));
            } else {
                $relations["I".$user_id] = array("blood"=>0, "in_law" => 0, "relation"=>"unknown", "connection"=>"");
            }
        }
        $this->sendToDb($relations, $tree_id, $gedcom_id);
	}

    public function update($tree_id, $gedcom_id){

    }
}
?>