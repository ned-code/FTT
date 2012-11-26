<?php
class JMBRelation {
	private $ajax;
    private $families;
    private $individuals;
    private $ownerId;
    private $_FamiliesList;
    private $_ChildrensList;
    private $_IndividualsList;
    private $_Relatives;

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

		$spouses = $this->get_spouses($b_id);
		if($spouses!=null){
			foreach($spouses as $spouse){
				if($spouse==$a_id){
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

    protected function deleteFromDb($tree_id, $gedcom_id){
        $sql_string = "DELETE FROM #__mb_relations WHERE `tree_id` = ? and `from` = ?";
        $this->ajax->setQuery($sql_string, $tree_id, $gedcom_id);
        $this->ajax->query();
    }

    protected function deleteUnknownFromDb($tree_id, $gedcom_id){
        $sql_string = "DELETE FROM #__mb_relations WHERE `tree_id` = ? and `from` = ? and relation = 'unknown'";
        $this->ajax->setQuery($sql_string, $tree_id, $gedcom_id);
        $this->ajax->query();
    }

    protected function findUnknownUsers($tree_id, $gedcom_id){
        $sql_string = "SELECT rel.to as individuals_id, rel.relation FROM #__mb_relations as rel WHERE rel.tree_id = ? AND rel.from = ?";
        $this->ajax->setQuery($sql_string, $tree_id, $gedcom_id);
        $relations = $this->ajax->loadAssocList('individuals_id');
        $check = array();
        if($relations==null){
            $check = $this->_Relatives;
        } else {
            if(sizeof($this->_Relatives) == sizeof($relations)){
                return $check;
            } else {
                foreach($this->_Relatives as $rel){
                    $id = $rel['individuals_id'];
                    if(!isset($relations[$id])){
                        $check[] = $rel;
                    }
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
            $sql = "INSERT INTO #__mb_relations (`tree_id`, `from`, `to`, `blood`, `relation`, `long_relation`) VALUES ";
            foreach($res as $el){
                $indKey = substr($el['indKey'],1);
                $relation = $el['relations']['relation'];
                $long_relation = $el['relations']['long_relation'];
                $blood = $el['relations']['blood'];
                $sql .= "('".$tree_id."','".$gedcom_id."','".$indKey."', '".$blood."','".$relation."','".$long_relation."'),";
            }
            $this->ajax->setQuery(substr($sql,0,-1));
            $this->ajax->query();
        }
    }

    protected function getRelationsWaves(&$waves, $users, &$relatives, $level = 0){
        if(empty($users)) return false;
        $wave = array();
        $ret = array();
        foreach($users as $key => $value){
            if(isset($waves[$key])) continue;
            $user_id = substr($key, 1);
            $ambit = array();
            //set parents
            $parents = $this->get_parents($user_id);
            if(!empty($parents)){
                foreach($parents as $pair){
                    if($pair[0] != null && $pair[0] != $user_id){
                        $ambit["I".$pair[0]] = array("id"=>$pair[0], "relation"=>"father");
                    }
                    if($pair[1] != null && $pair[1] != $user_id){
                        $ambit["I".$pair[1]] = array("id"=>$pair[1], "relation"=>"mother");
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
                    $ambit["I".$childId] = array("id"=>$childId, "relation"=>$childRelation);
                }
            }

            //set spouses
            $spouses = $this->get_spouses($user_id);
            if(!empty($spouses)){
                foreach($spouses as $spouse){
                    if($user_id == $spouse) continue;
                    $ambit["I".$spouse] = array("id"=>$spouse, "relation"=>"spouse");
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
                    $ambit["I".$siblId] = array("id"=>$siblId, "relation"=>$siblRelation);
                }
            }

            $waves["I".$user_id] = array("level"=>$level, "ambit"=>$ambit);
            if(!isset($waves["W".$level])){
                $waves["W".$level] = array();
            }
            $waves["W".$level]["I".$user_id] = true;
            if(array_key_exists("I".$user_id, $relatives)){
                $ret[] = array("id"=>$user_id, "level"=>$level);
            }
            foreach($ambit as $k => $v){
                $wave[$k] = $v;
            }
        }
        if(!empty($ret)) return $ret;
        return $this->getRelationsWaves($waves, $wave, $relatives, $level + 1);
    }

    protected function getMatch($waves, $i, $lastId){
        $wave = $waves["W".$i];
        foreach($wave as $index => $v){
            $object = $waves[$index];
            $ambit = $object['ambit'];
            foreach($ambit as $key => $el){
                if($key == $lastId){
                    return $index;
                }
            }
        }
    }

    protected function getPath($el, $waves){
        $result = array();
        $lastId = "I".$el['id'];
        $length = $el['level'] - 1;
        $result[] = $lastId;
        for($i = $length; $i >= 0 ; $i--){
            $result[] = $this->getMatch($waves, $i, $lastId);
            $lastId = end($result);
        }
        asort($result);
        return $result;
    }

    protected function getParsePath($p1, $p2){
        $l1 = $this->lowest_common_ancestor($p1[0], $this->ownerId);
        $l2 = $this->lowest_common_ancestor($p2[0], $this->ownerId);
        if($l1[0] > $l2[0]){
            return $p1;
        } else {
            return $p2;
        }
    }

    protected function getShortPath($paths){
        $shortIndex = 9999;
        $shortPath = array();
        foreach($paths as $path){
            if($shortIndex > sizeof($path)){
                $shortPath = $path;
                $shortIndex = sizeof($path);
            } else if($shortIndex == sizeof($path)){
                $parsePath = $this->getParsePath($shortPath,$path);
                $shortIndex = sizeof($parsePath);
                $shortPath = $parsePath;
            }
        }
        return $shortPath;
    }

    protected function getRelationLongName($res, $waves, &$relations){
        $paths = array();
        foreach($res as $el){
            $paths[] = $this->getPath($el, $waves);
        }
        $path = $this->getShortPath($paths);
        $name = "";
        $relation = "";
        for($i = 0 ; $i < sizeof($path) - 1; $i++){
            $index = $path[$i];
            $next = $path[$i+1];
            $object = $waves[$index];
            $ambit = $object["ambit"];
            $name .= $ambit[$next]["relation"]." ";
            if($i == 0){
                $relation = $ambit[$next]["relation"];
            }
        }
        $name .= "of your ".$relations[$path[0]]["relation"];
        $name .= ", ".$this->get_name(substr($path[0],1));
        return array($relation, $name);
    }

    protected function findRelations($user_id, &$relations, &$un){
        $waves = array();
        $res = $this->getRelationsWaves($waves, array("I".$user_id=>null), $relations);
        if($res){
            $name = $this->getRelationLongName($res, $waves, $relations);
            $un["I".$user_id] = array("blood"=>0, "relation"=>$name[0], "long_relation"=>$name[1] );
        } else {
            $un["I".$user_id] = array("blood"=>0, "relation"=>"unknown", "long_relation"=>"unknown" );
        }
    }
	
	protected function init($tree_id, $gedcom_id){
		$this->_FamiliesList = $this->families->getFamiliesList($tree_id);
		$this->_ChildrensList = $this->families->getChildrensList($tree_id);
		$this->_IndividualsList = $this->individuals->getIndividualsList($tree_id, $gedcom_id);
		$this->_Relatives = $this->individuals->getRelatives($tree_id);
	}

	public function set($tree_id, $gedcom_id, $target_id){
		$this->init($tree_id, $gedcom_id);
        $sql_string = "DELETE FROM #__mb_relations WHERE tree_id = ? AND `from` = ? AND `to` = ?";
        $this->ajax->setQuery($sql_string, $tree_id, $gedcom_id, $target_id);
        $this->ajax->query();
		$relation =  $this->get_relation($target_id, $gedcom_id);		
		$sql_string = "INSERT INTO #__mb_relations (`tree_id`, `from`, `to`, `relation`) VALUES (?, ?, ?, ?)";
		$this->ajax->setQuery($sql_string, $tree_id, $gedcom_id, $target_id, ($relation)?$relation:'unknown');
		$this->ajax->query();
	}
	
	public function get($tree_id, $gedcom_id, $target_id){
		$this->init($tree_id, $gedcom_id);
		$relation =  $this->get_relation($target_id, $gedcom_id);
		return $relation;
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
            $this->ajax->setQuery(substr($sql,0,-1));
            $this->ajax->query();
        }
        return $insert;
    }

	public function check($tree_id, $gedcom_id){
        $this->ownerId = $gedcom_id;
        $this->init($tree_id, $gedcom_id);

        $this->deleteUnknownFromDb($tree_id, $gedcom_id);
        $relatives = $this->findUnknownUsers($tree_id, $gedcom_id);

        $relations = array();
        $unknowns = array();
        foreach($relatives as $user){
            $user_id = $user['individuals_id'];
            $relation = $this->get_relation($user_id, $gedcom_id);
            if($relation){
                $relations["I".$user_id] = array("blood"=>1,"relation"=>$relation, "long_relation"=>"");
            } else {
                $unknowns[] = $user_id;
            }
        }

        $un = array();
        foreach($unknowns as $user_id){
            $this->findRelations($user_id, $relations, $un);
        }
        foreach($un as $k => $v){
            $relations[$k] = $v;
        }
        $this->sendToDb($relations, $tree_id, $gedcom_id);
	}

    public function update($tree_id, $gedcom_id){
        $this->ownerId = $gedcom_id;
        $this->init($tree_id, $gedcom_id);

        $this->deleteFromDb($tree_id, $gedcom_id);
        $relatives = $this->_Relatives;

        $relations = array();
        $unknowns = array();
        foreach($relatives as $user){
            $user_id = $user['individuals_id'];
            $relation = $this->get_relation($user_id, $gedcom_id);
            if($relation){
                $relations["I".$user_id] = array("blood"=>1,"relation"=>$relation, "long_relation"=>"");
            } else {
                $unknowns[] = $user_id;
            }
        }

        $un = array();
        foreach($unknowns as $user_id){
            $this->findRelations($user_id, $relations, $un);
        }
        foreach($un as $k => $v){
            $relations[$k] = $v;
        }
        $this->sendToDb($relations, $tree_id, $gedcom_id);
    }
}
?>