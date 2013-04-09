<?php
class FamilyTreeTopGedcomRelationsManager {
    protected $tree_id;
    protected $owner_id;
    protected $list = array();

    public function __construct($tree_id, $gedcom_id){
        $this->tree_id = $tree_id;
        $this->owner_id = $gedcom_id;

        if(!empty($this->tree_id) && !empty($this->owner_id)){
            $db = JFactory::getDbo();
            $sql = "SELECT r.id, r.relation_id, r.gedcom_id, r.target_id, r.json, r.change_time
                    FROM #__familytreetop_relation_links as r, #__familytreetop_tree_links as l, #__familytreetop_trees as t
                    WHERE r.gedcom_id = l.id AND l.tree_id = t.id AND t.id = " . $this->tree_id . " AND r.gedcom_id = " . $this->owner_id;
            $db->setQuery($sql);
            $this->list = $this->sort($db->loadAssocList('target_id'));

            $sql = "SELECT * FROM #__familytreetop_relations WHERE 1";
            $db->setQuery($sql);
            $this->list["_NAMES"] = $db->loadAssocList('id');
        }
    }

    protected function sort($rows){
        $sort = array();
        foreach($rows as $key => $row){
            $el = $row;
            $el['json'] = json_decode($row['json']);
            $sort[$key] = $el;
        }
        return $sort;
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

    public function get($gedcom_id, $target_id){
        $relation = $this->_get($gedcom_id, $target_id);
        if($relation && !isset($this->list[$target_id])){
            $rel = new FamilyTreeTopRelationLinks();
            $rel->relation_id = $relation[0];
            $rel->gedcom_id = $gedcom_id;
            $rel->target_id = $target_id;
            $rel->connection = '';
            $rel->json = (empty($relation[1]))?NULL:json_encode($relation[1]);
            $rel->save();

            $this->list[$target_id] = array(
                'relation_id' => $rel->relation_id,
                'gedcom_id' => $rel->gedcom_id,
                'target_id' => $rel->target_id,
                'connection' => $rel->connection,
                'json' => $rel->json,
                'change_time' => $rel->change_time,
            );
        }
        return $relation;
    }

    public function getList(){
        if($individuals = $this->isRelationsNotExist()){
            foreach($individuals as $ind){
                if(!isset($this->list[$ind['gedcom']])){
                    $this->get($this->owner_id, $ind['gedcom_id']);
                }
            }
        }
        return $this->list;
    }

}