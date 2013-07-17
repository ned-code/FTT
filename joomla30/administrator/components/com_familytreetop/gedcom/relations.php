<?php
class FamilyTreeTopGedcomRelationsManager {
    protected $tree_id;
    protected $owner_id;
    protected $list = array();
    protected $conn = array();

    public function __construct($tree_id, $gedcom_id){
        $this->tree_id = $tree_id;
        $this->owner_id = $gedcom_id;
        $this->conn = GedcomHelper::getInstance()->connections->getList();

        if(!empty($this->tree_id) && !empty($this->owner_id)){
            $this->list = $this->getRelations($this->owner_id);
            $this->list['_NAMES'] = $this->getRelationsName();
        }
    }

    protected function getRelations($gedcom_id){
        $db = JFactory::getDbo();
        $sql = "SELECT r.id, r.relation_id, r.gedcom_id, r.target_id, r.json, r.in_law, r.change_time
                    FROM #__familytreetop_relation_links as r, #__familytreetop_tree_links as l, #__familytreetop_trees as t
                    WHERE r.gedcom_id = l.id AND l.tree_id = t.id AND t.id = " . $this->tree_id . " AND r.gedcom_id = " . $gedcom_id;
        $db->setQuery($sql);
        return $this->sort($db->loadAssocList('target_id'));
    }

    protected function getRelationsName(){
        $db = JFactory::getDbo();
        $sql = "SELECT * FROM #__familytreetop_relations WHERE 1";
        $db->setQuery($sql);
        return $db->loadAssocList('id');
    }

    protected function sort($rows){
        $sort = array();
        foreach($rows as $key => $row){
            $el = $row;
            if(isset($row['connection'])){
                $el['connection'] = json_decode(base64_decode($row['connection']));
            }
            if(isset($el['json'])){
                $el['json'] = json_decode(base64_decode($row['json']));
            }
            $sort[$key] = $el;
        }
        return $sort;
    }

    protected function get_spouses($gedcom_id){
        $spouses = GedcomHelper::getInstance()->families->getSpouses($gedcom_id);
        if(empty($spouses)){
            return array();
        }
        return $spouses;
    }

    protected function get_parents($gedcom_id){
        $parents = GedcomHelper::getInstance()->individuals->getParents($gedcom_id);
        $husb = ($parents['father'])?$parents['father']->gedcom_id:null;
        $wife = ($parents['mother'])?$parents['mother']->gedcom_id:null;
        return array($husb, $wife);
    }

    protected function set_ancestors($id, &$ancestors, $level = 1){
        if(!$id) return;
        $parents = $this->get_parents($id);
        if(!empty($parents) && $parents[0] != null){
            $ancestors[] = array($level, $parents[0]);
            $this->set_ancestors($parents[0], $ancestors, $level + 1);
        }
        if(!empty($parents)  && $parents[1] != null){
            $ancestors[] = array($level, $parents[1]);
            $this->set_ancestors($parents[1], $ancestors, $level + 1);
        }
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
        if ($number % 100 > 10 && $number % 100 < 14) {
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
        return array("suffix"=>$number.$os);
    }

    protected function aggrandize_relationship($id, $dist, $offset = 0){
        $dist -= $offset;
        switch ($dist) {
            case 1:
                return array($id, array());
                break;
            case 2:
                return array($id + 100, array());
                break;
            case 3:
                return array($id + 200, array());
                break;
            default:
                return array($id + 200, $this->ordinal_suffix($dist - 2));
                break;
        }
    }

    protected function _get($gedcom_id, $target_id){
        $gedcom = GedcomHelper::getInstance();
        if($gedcom_id == $target_id){
            return array(1, array());
        }

        $spouses = $gedcom->families->getSpouses($gedcom_id);
        if($spouses && !empty($spouses)){
            foreach($spouses as $spouse_id){
                if($spouse_id == $target_id){
                    return array(2, array());
                }
            }
        }

        $lca = $this->lowest_common_ancestor($target_id, $gedcom_id);
        if (!$lca) {
            return false;
        }


        $a_level = $lca[1];
        $b_level = $lca[2];

        $gender = $gedcom->individuals->getGender($target_id);

        if($a_level == 0){
            $id = 3 + $gender;
            return $this->aggrandize_relationship($id, $b_level);
        }

        if($b_level == 0){
            $id = $gender + 5;
            return $this->aggrandize_relationship($id, $a_level);
        }

        if($a_level == $b_level){
            switch($a_level){
                case 1:
                    $id = $gender + 7;
                    return array($id, array());

                case 2:
                    return array(9, array());
                    break;

                default:
                    return array(9, $this->ordinal_suffix($a_level - 2));
                    break;
            }
        }

        if($a_level == 1){
            $id = $gender + 10;
            return $this->aggrandize_relationship($id, $b_level, 1);
        }

        if($b_level == 1){
            $id = $gender + 12;
            return $this->aggrandize_relationship($id, $a_level, 1);
        }

        $cous_ord = min($a_level, $b_level) - 1;
        $cous_gen = abs($a_level - $b_level);
        $params = $this->ordinal_suffix($cous_ord);
        $params['removed'] = $cous_gen;
        return array(9, $params);
    }

    protected function isRelationsNotExist(){
        $gedcom = GedcomHelper::getInstance();
        $individuals = $gedcom->individuals->getList();
        if(sizeof($individuals) != sizeof($this->list)){
            return $individuals;
        }
        return false;
    }

    protected function getJSON($relation){
        if(!empty($relation[1])){
            $json = $relation[1];
        } else {
            $json = array();
        }
        return $json;
    }

    protected function sw($id){
        switch($id){
            case 2:	return 0;   //SPOUSE
            case 3:	return 4;   //MOTHER
            case 4:	return 3;   //FATHER
            case 5:	return 6;   //DAUGHTER
            case 6:	return 5;   //SON
            case 7:	return 8;   //SISTER
            case 8:	return 7;   //BROTHER
            case 9:	return 9;   //COUSIN
            case 10: //AUNT
            case 11: //UNCLE
            case 12: //NIECE
            case 13: //NEPHEW
            case 103: //GRAND_MOTHER
            case 104: //GRAND_FATHER
            case 105: //GRAND_DAUGHTER
            case 106: //GRAND_SON
            case 110: //GRAND_AUNT
            case 111: //GRAND_UNCLE
            case 112: //GRAND_NIECE
            case 113: //GRAND_NEPHEW
            case 203: //GREAT_GRAND_MOTHER
            case 204: //GREAT_GRAND_FATHER
            case 205: //GREAT_GRAND_DAUGHTER
            case 206: //GREAT_GRAND_SON
            case 210: //GREAT_GRAND_AUNT
            case 211: //GREAT_GRAND_UNCLE
            case 212: //GREAT_GRAND_NIECE
            case 213: //GREAT_GRAND_NEPHEW
                return 1000;
        }
    }

    public function set($data){
        $rel = new FamilyTreeTopRelationLinks();
        $rel->relation_id = $data['relation_id'];
        $rel->gedcom_id = $data['gedcom_id'];
        $rel->target_id = $data['target_id'];
        $rel->connection = $data['connection'];
        $rel->json = (empty($data['json']))?NULL:base64_encode(json_encode($data['json']));
        $rel->in_law = $data['in_law'];
        $rel->save();
        return array(
            'relation_id' => $data['relation_id'],
            'gedcom_id' => $data['gedcom_id'],
            'target_id' => $data['target_id'],
            'connection' => $data['connection'],
            'json' => $data['json'],
            'in_law' => $data['in_law'],
            'change_time' => $rel->change_time
        );
    }

    public function get($gedcom_id, $target_id){
        $relation = $this->_get($gedcom_id, $target_id);
        if($relation && !isset($this->list[$target_id])){
            $json = $this->getJSON($relation);
            $item = $this->set(array(
                'relation_id' => $relation[0],
                'gedcom_id' => $gedcom_id,
                'target_id' => $target_id,
                'connection' => base64_encode(json_encode($this->conn[$target_id])),
                'json' => $json,
                'in_law' => 0
            ));
            $this->list[$target_id] = $item;

        }
        return $relation;
    }

    public function getInLaw($gedcom_id, $target_id){
        if(!$gedcom_id) return false;
        $relation = $this->_get($gedcom_id, $target_id);
        if($relation){
            $json = $this->getJSON($relation);
            if($relation[0] > 9){
                $relation[0] = 1000;
                $json = array();
            }
            $item = $this->set(array(
                'relation_id' => $relation[0],
                'gedcom_id' => $this->owner_id,
                'target_id' => $target_id,
                'connection' => base64_encode(json_encode($this->conn[$target_id])),
                'json' => $json,
                'in_law' => $gedcom_id
            ));
            $this->list[$target_id] = $item;
        }
        return $relation;
    }

    public function getList(){
        /*
        if($individuals = $this->isRelationsNotExist()){
            $spouses = $this->get_spouses($this->owner_id);
            foreach($individuals as $ind){
                if(!isset($this->list[$ind['gedcom_id']])){
                    if(!$this->get($this->owner_id, $ind['gedcom_id'])){
                        foreach($spouses as $spouse){
                            $this->getInLaw($spouse, $ind['gedcom_id']);
                        }
                        if(!isset($this->list[$ind['gedcom_id']])){
                            $con = $this->conn[$ind['gedcom_id']];
                            if($con){
                                $gedcom_id = false;
                                foreach($con as $index => $key){
                                    if(!isset($this->list[$key])){
                                        if($con[$index - 1] == $gedcom_id){
                                            $rel = $this->list[$gedcom_id];
                                            $relation_id = $this->sw($rel['relation_id']);
                                        } else {
                                            $relation_id = 1000;
                                        }
                                        $item = $this->set(array(
                                            'relation_id' => $relation_id,
                                            'gedcom_id' => $this->owner_id,
                                            'target_id' => $key,
                                            'connection' => base64_encode(json_encode($con)),
                                            'json' => array(),
                                            'in_law' => $gedcom_id
                                        ));
                                        $this->list[$key] = $item;
                                    } else if(!$this->list[$key]['in_law']){
                                        $gedcom_id = $key;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return $this->list;
        */
    }
}