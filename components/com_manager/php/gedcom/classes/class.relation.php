<?php
class JMBRelation {
	private $ajax;
    private $families;
    private $individuals;
    private $ownerId;
    private $_FamiliesList;
    private $_ChildrensList;
    private $_Relatives;

    public function __construct(&$ajax, &$families, &$individuals){
        $this->ajax = $ajax;
        $this->families = $families;
        $this->individuals = $individuals;
    }

    protected function get_childrens($gedcom_id){
        $ind_key = 'I'.$gedcom_id;
        if(isset($this->_FamiliesList[$ind_key])){
            $family_key = 'F'.$this->_FamiliesList[$ind_key][0]['family_id'];
            if(isset($this->_ChildrensList[$family_key])){
                return $this->_ChildrensList[$family_key];
            }
        }
        return null;
    }

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

    protected function _getLongRelation_($relation, $id, $gedcom_id){
        $rel = $this->get_relation($id, $this->ownerId);
        $ind = $this->individuals->get($id);
        return $relation." of your ".$rel.", ".$ind->FirstName;
    }

    protected function _getAncestors_(&$relatives, $owner_id, $ids, $postfix = '', $level = 0){
        $ancestors = array();
        foreach($ids as $id => $value){
            $parents = $this->get_parents(substr($id, 1));
            foreach($parents as $el){
                $index = "I".$el;
                if(!empty($el)&&!isset($relatives[$index]) && $owner_id != $el){
                    $relation = $this->get_relation($el, $owner_id);
                    if(!empty($relation)){
                        $rel = $relation.$postfix;
                        $long_rel = $this->_getLongRelation_($relation, $owner_id, $el);
                        $relatives[$index] = array("rel"=>$rel,"long_rel"=>$long_rel);
                        $ancestors[$index] = $rel;
                    }
                }
            }
        }
        if(!empty($ancestors)){
            $this->_getAncestors_($relatives, $owner_id, $ancestors, $postfix, $level + 1);
            $this->_getSpouses_($ancestors);
        }
    }



    protected function _getDescendants_(&$relatives, $owner_id, $ids, $postfix = '', $level = 0){
        $descendants = array();
        foreach($ids as $id => $value){
            $childrens = $this->get_childrens(substr($id, 1));
            foreach($childrens as $el){
                if(!empty($el)&&!empty($el['gedcom_id'])){
                    $gedcom_id = $el['gedcom_id'];
                    $index = "I".$gedcom_id;
                    if(!isset($relatives[$index]) && $owner_id != $gedcom_id){
                        $relation = $this->get_relation($gedcom_id, $owner_id);
                        if(!empty($relation)){
                            $rel = $relation.$postfix;
                            $long_rel = $this->_getLongRelation_($relation, $owner_id, $id);
                            $relatives[$index] = array("rel"=>$rel,"long_rel"=>$long_rel);
                            $descendants[$index] = $rel;
                        }
                    }
                }
            }
        }
        if(!empty($descendants)){
            $this->_getDescendants_($relatives, $owner_id, $descendants, $postfix, $level + 1);
            $this->_getSpouses_($descendants);
        }
    }

    protected function _getSpouses_(&$relatives){
        foreach($relatives as $id => $value){
            $spouses = $this->get_spouses(substr($id, 1));
            foreach($spouses as $spouse){
                $index = "I".$spouse;
                if(!isset($relatives[$index])){
                    $rel = "spouse";
                    $long_rel = $this->_getLongRelation_($rel, substr($id, 1), $spouse);
                    $relatives[$index] = array("rel"=>$rel,"long_rel"=>$long_rel);
                    $this->_getAncestors_($relatives, $spouse, array($index =>array("rel"=>$rel,"long_rel"=>$long_rel)));
                    $this->_getDescendants_($relatives, $spouse, array($index =>array("rel"=>$rel,"long_rel"=>$long_rel)));
                }
            }
        }
    }

    protected function _getSpouse_(&$relatives, $ids, $postfix, $check = false){
        $result = array();
        foreach($ids as $id){
            $index = "I".$id;
            if(!isset($relatives[$index])){
                $relation = 'spouse'.(($check)?$postfix:'');
                $long_rel = $this->_getLongRelation_($relation, $this->ownerId, $id);
                $relatives[$index] = array("rel"=>$relation,"long_rel"=>$long_rel);
                $srelatives = array();
                $this->_getAncestors_($srelatives, $id, array($index => $relation), $postfix);
                $this->_getDescendants_($srelatives, $id, $srelatives, $postfix);
                $result[] = $srelatives;
            }
        }
        foreach($result as $r){
            $relatives = array_merge($relatives, $r);
        }
        return $relatives;
    }

    protected function _getChildrens_(&$relatives, $owner_id, $level = 0){
        $index = "I".$owner_id;
        $this->_getDescendants_($relatives, $owner_id, array($index => true), "", $level);
    }

    protected function _checkRelatives(&$relatives, $owner_id){
        foreach($this->_Relatives as $rel){
            $id = $rel['individuals_id'];
            $index = "I".$id;
            if(!isset($relatives[$index])){
                $relation = $this->get_relation($id, $owner_id);
                if(!empty($relation)){
                    $long_rel = $this->_getLongRelation_($relation, $owner_id, $id);
                    $relatives[$index] = array("rel"=>$relation,"long_rel"=>$long_rel);
                }
            }
        }
    }

    protected function deleteFromDb($tree_id, $gedcom_id){
        $sql_string = "DELETE FROM #__mb_relations WHERE `tree_id` = ? and `from` = ?";
        $this->ajax->setQuery($sql_string, $tree_id, $gedcom_id);
        $this->ajax->query();
    }

    protected function sendToDb($relatives, $tree_id, $gedcom_id){
        $inserts = array();
        foreach($relatives as $key => $value){
            $inserts[] = array("indKey" => $key, "relations"=>$value);
        }
        $result = array_chunk($inserts, 25, true);
        foreach($result as $res){
            $sql = "INSERT INTO #__mb_relations (`tree_id`, `from`, `to`, `relation`, `long_relation`) VALUES ";
            foreach($res as $el){
                $indKey = substr($el['indKey'],1);
                $relation = $el['relations']['rel'];
                $long_relation = $el['relations']['long_rel'];
                $sql .= "('".$tree_id."','".$gedcom_id."','".$indKey."','".$relation."','".$long_relation."'),";
            }
            $this->ajax->setQuery(substr($sql,0,-1));
            $this->ajax->query();
        }
    }

	public function check($tree_id, $gedcom_id){
        $this->ownerId = $gedcom_id;
        $this->init($tree_id , $gedcom_id);

        $this->deleteFromDb($tree_id, $gedcom_id);

        $relatives = array();
        $relatives["I".$gedcom_id] = array("rel"=>"self", "long_rel"=>"This is you");

        $this->_getSpouse_($relatives, $this->get_spouses($gedcom_id), '-in-Law');
        $this->_getAncestors_($relatives, $gedcom_id, $relatives);
        $this->_getDescendants_($relatives, $gedcom_id, $relatives);
        $this->_getChildrens_($relatives, $gedcom_id);
        $this->_checkRelatives($relatives, $gedcom_id);
        $this->_getSpouses_($relatives);


        $this->sendToDb($relatives, $tree_id, $gedcom_id);
	}
}
?>