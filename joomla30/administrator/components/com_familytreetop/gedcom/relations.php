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
        $sql = "SELECT r.id, r.relation_id, r.gedcom_id, r.target_id, r.json, r.in_law, r.by_spouse, r.change_time
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

    protected function get_spouses($gedcom_id, $assoc = false){
        $spouses = GedcomHelper::getInstance()->families->getSpouses($gedcom_id);
        if(empty($spouses)){
            return array();
        }
        if($assoc){
            $result = array();
            foreach($spouses as $spouse){
                $result[$spouse] = $spouse;
            }
            return $result;
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
        if(sizeof($individuals) != (sizeof($this->list) - 1) ){
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
    public function set($data){
        $rel = new FamilyTreeTopRelationLinks();
        $rel->relation_id = $data['relation_id'];
        $rel->gedcom_id = $data['gedcom_id'];
        $rel->target_id = $data['target_id'];
        $rel->connection = $data['connection'];
        $rel->json = (empty($data['json']))?NULL:base64_encode(json_encode($data['json']));
        $rel->in_law = $data['in_law'];
        $rel->by_spouse = $data['by_spouse'];
        $rel->save();
        return array(
            'relation_id' => $data['relation_id'],
            'gedcom_id' => $data['gedcom_id'],
            'target_id' => $data['target_id'],
            'connection' => $data['connection'],
            'json' => $data['json'],
            'in_law' => $data['in_law'],
            'by_spouse' => $data['by_spouse'],
            'change_time' => $rel->change_time
        );
    }

    public function get($gedcom_id, $target_id, $in_law = 0, $by_spouse = 0, $cache = false){
        $relation = $this->_get((!$in_law)?$gedcom_id:$in_law, $target_id);
        if($cache){
            if($relation){
                return true;
            }
        } else {
            if($relation && !isset($this->list[$target_id])){
                $json = $this->getJSON($relation);
                $item = $this->set(array(
                    'relation_id' => $relation[0],
                    'gedcom_id' => $gedcom_id,
                    'target_id' => $target_id,
                    'connection' => (isset($this->conn[$target_id]))?base64_encode(json_encode($this->conn[$target_id])):"",
                    'json' => $json,
                    'in_law' => $in_law,
                    'by_spouse' => $by_spouse
                ));
                $this->list[$target_id] = $item;
            }
        }
        return $relation;
    }

    public function getArray($gedcom_id, $target_id){
        $relation = $this->get($gedcom_id, $target_id);
        if($relation && isset($this->list[$target_id])){
            return $this->list[$target_id];
        }
        return false;
    }

    public function getInLawRelation($gedcom_id, $conn = false, $rels = false){
        $c = ($conn)?$conn:$this->conn;
        $r = ($rels)?$rels:$this->list;
        if(isset($c[$gedcom_id])){
            $con = $c[$gedcom_id];
            $ret = false;
            foreach($con as $id){
                if(isset($r[$id]) && $r[$id]['in_law'] == 0){
                    $ret = $id;
                }
            }
            return $ret;
        }
        return false;
    }

    public function getInLawRelationId($gedcom_id){
        $relation = $this->_get($this->owner_id, $gedcom_id);
        switch($relation[0]){
            case 3: return 4; // father in_law
            case 4: return 3; // mother in_law
            case 5: return 6; // son in_law
            case 6: return 5; // daughter in_law
            case 7: return 8; // brother in_law
            case 8: return 7; // sister in_law
            case 9: return 9; // cousin in_law
            case 10: return 11; // uncle in_law
            case 11: return 10; // aunt in_law
            case 12: return 13; // nephew in_law
            case 13: return 12; // niece in_law
            case 105: return 106; // grand son in_law
            case 106: return 105; // grand daughter in_law
            case 110: return 111; // grand uncle in_law
            case 111: return 110; // grand aunt in_law
            case 112: return 113; // grand nephew in_law
            case 113: return 112; // grand niece in_law
            case 205: return 206; // great grand son in_law
            case 206: return 205; // great grand daughter in_law
            case 210: return 211; // great grand uncle in_law
            case 211: return 210; // great grand aunt in_law
            case 212: return 213; // great grand nephew in_law
            case 213: return 212; // great grand niece in_law
            default: return 1000;
        }
    }

    public function getListById($gedcom_id){
        $gedcom = GedcomHelper::getInstance();
        $list = $gedcom->individuals->getList();
        $conn = $gedcom->connections->getListById($gedcom_id);
        $rels = $this->getRelations($gedcom_id);

        $mass = array();
        $unknowns = array();
        foreach($list as $key => $member){
            if($key != "_NAMES"){
                $item = $this->get($gedcom_id, $member['gedcom_id'], 0, 0, true);
                if($item){
                    $mass[$member['gedcom_id']] = $item;
                }
                $unknowns[$member['gedcom_id']] = $member;
            }
        }
        if(sizeof($unknowns) > 0){
            $spouses = $this->get_spouses($gedcom_id, true);
            foreach($unknowns as $item){
                if(!isset($mass[$item['gedcom_id']])){
                    $gedcom_id = $this->getInLawRelation($item['gedcom_id'], $conn, $rels);
                    if(isset($spouses[$gedcom_id])){
                        //
                    } else {
                        $relation = $this->_get($gedcom_id, $item['gedcom_id']);
                        if($relation && $relation[0] == 2){
                            $rel = $this->getInLawRelationId($gedcom_id);
                            if($rel != 1000){
                                $mass[$item['gedcom_id']] = true;
                            }
                        }
                    }
                }
            }
        }
        return $mass;
    }

    public function getFromList($gedcom_id){
        if(isset($this->list[$gedcom_id])){
            return $this->list[$gedcom_id];
        }
        return false;
    }

    public function getList(){
        if($members = $this->isRelationsNotExist()){
            $unknowns = array();
            foreach($members as $key => $member){
                if($key != "_NAMES" && !isset($this->list[$member['gedcom_id']]) && !$this->get($this->owner_id, $member['gedcom_id'])){
                    $unknowns[$member['gedcom_id']] = $member;
                }
            }
            if(sizeof($unknowns) > 0){
                $spouses = $this->get_spouses($this->owner_id, true);
                foreach($unknowns as $item){
                    if(!isset($this->list[$item['gedcom_id']])){
                        $gedcom_id = $this->getInLawRelation($item['gedcom_id']);
                        if(isset($spouses[$gedcom_id])){
                            $this->get($this->owner_id, $item['gedcom_id'], $gedcom_id, 1);
                        } else {
                            $relation = $this->_get($gedcom_id, $item['gedcom_id']);
                            if($relation && $relation[0] == 2){
                                $json = $this->getJSON($relation);
                                $rel = $this->getInLawRelationId($gedcom_id);
                                if($rel != 1000){
                                    $i = $this->set(array(
                                        'relation_id' => $rel,
                                        'gedcom_id' => $this->owner_id,
                                        'target_id' => $item['gedcom_id'],
                                        'connection' => (isset($this->conn[$item['gedcom_id']]))?base64_encode(json_encode($this->conn[$item['gedcom_id']])):"",
                                        'json' => $json,
                                        'in_law' => 1,
                                        'by_spouse' => 0
                                    ));
                                    $this->list[$item['gedcom_id']] = $i;
                                }
                            }
                        }
                    }
                }
            }
        }
        return $this->list;
    }
}