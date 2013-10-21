<?php

class FamilyTreeTopGedcomFamilyModel {
    public $tree_id = null;

    public $id = null;
    public $family_id = null;
    public $husb = null;
    public $wife = null;
    public $type = 'marriage';
    public $change_time = null;
    public $notes = '';

    public $childrens = array();
    public $events = array();

    public function __construct($tree_id){
        $this->tree_id = $tree_id;

        $date = JFactory::getDate();
        $this->change_time = $date->toSql();
    }

    public function save(){
        $gedcom = GedcomHelper::getInstance();
        if(empty($this->family_id)){

            $link = new FamilyTreeTopTreeLinks();
            $link->type = 1;
            $link->tree_id = $this->tree_id;
            $link->save();

            $family = new FamilyTreeTopFamilies();
            $this->family_id = $link->id;
        } else {
            $family = FamilyTreeTopFamilies::find_by_family_id($this->family_id);
            if(empty($family)){
                return false;
            }
        }
        $family->family_id = $this->family_id;
        $family->husb = $this->husb;
        $family->wife = $this->wife;
        $family->type = $this->type;
        $family->change_time = $this->change_time;
        $family->save();

        $this->id = $family->id;

        $gedcom->childrens->save($this->family_id, $this->childrens);

        $gedcom->families->updateList($this);

        return $this;
    }

    public function marriage(){
        $gedcom = GedcomHelper::getInstance();
        if(empty($this->events)) {
            return $gedcom->events->get();
        }
        foreach($this->events as $event){
            if($event->type == "MARR"){
                return $event;
            }
        }
        return $gedcom->events->get();
    }

    public function addChild($gedcom_id){
        $gedcom = GedcomHelper::getInstance();
        if(method_exists($gedcom->childrens, 'create')){
            return $gedcom->childrens->create($this->family_id, $gedcom_id);
        }
        return false;
    }

    public function addEvent(){

    }

    public function delete(){
        if(empty($this->id)) return false;
        $gedcom = GedcomHelper::getInstance();

        $link = FamilyTreeTopTreeLinks::find_by_id_and_type($this->family_id, 1);
        $family = FamilyTreeTopFamilies::find_by_family_id($this->family_id);

        if(!empty($this->events)){
            foreach($this->events as $event){
                $event->remove();
            }
        }
        $family->delete();
        $link->delete();
    }

    public function toList(){
        if(empty($this->id)) return false;
        $data = array();
        $data['id'] = $this->id;
        $data['family_id'] = $this->family_id;
        $data['husb'] = $this->husb;
        $data['wife'] = $this->wife;
        $data['type'] = $this->type;
        $data['change_time'] = $this->change_time;
        return $data;
    }
}

class FamilyTreeTopGedcomFamiliesManager {
    protected $list = array();
    protected $list_by_gedcom_id = array();
    protected $tree_id;

    public function __construct($tree_id){
        $this->tree_id = $tree_id;
        if(!empty($tree_id)){
            $db = JFactory::getDbo();
            $sql = "SELECT f.*
                FROM #__familytreetop_families as f, #__familytreetop_tree_links as l, #__familytreetop_trees as t
                WHERE l.type = 1 AND f.family_id = l.id AND l.tree_id = t.id AND t.id = " . $tree_id. " GROUP BY id";
            $db->setQuery($sql);
            $rows = $db->loadAssocList('family_id');
            $this->list =  $rows;
            $this->list_by_gedcom_id = $this->sortList($rows);
        }

    }

    protected function sortList( $rows){
        if(empty($rows)) return array();
        $result = array();
        foreach($rows as $key => $row){
            if(!empty($row['husb'])){
                 $result[$row['husb']][$key] = $row;
            }
            if(!empty($row['wife'])){
                $result[$row['wife']][$key] = $row;
            }

        }
        return $result;
    }

    protected function getObject(){
        return new FamilyTreeTopGedcomFamilyModel($this->tree_id, $this->list);
    }

    public function updateList(&$model){
        if(empty($model->family_id)) return false;
        $data = $model->toList();

        if(!isset($this->list[$model->family_id])){
            $this->list[$model->family_id] = $data;
            if(!empty($model->husb)){
                $this->list_by_gedcom_id[$model->husb][] = $data;
            }
            if(!empty($model->wife)){
                $this->list_by_gedcom_id[$model->wife][] = $data;
            }
        }
     }

    public function get($family_id = null){
        $gedcom = GedcomHelper::getInstance();
        if(empty($family_id)){
            return $this->getObject();
        }
        $family = $this->getObject();
        if(isset($this->list[$family_id])){
            $data = $this->list[$family_id];
            $family->id = $data['id'];
            $family->family_id = $data['family_id'];
            $family->husb = $data['husb'];
            $family->wife = $data['wife'];
            $family->type = $data['type'];
            $family->change_time = $data['change_time'];
        } else {
            return false;
        }
        $family->childrens = $gedcom->childrens->get($family_id);
        $family->events = $gedcom->events->get($family_id, true);

        return $family;
    }

    public function getSpouses($gedcom_id){
        if(empty($gedcom_id)) return false;
        if(isset($this->list_by_gedcom_id[$gedcom_id])){
            $rows = $this->list_by_gedcom_id[$gedcom_id];
            $result = array();
            foreach($rows as $row){
                $result[] = ($row['husb'] == $gedcom_id)?$row['wife']:$row['husb'];
            }
            return (empty($result))?false:$result;
        }
        return false;
    }

    public function getFamilyId($id){
        if(empty($id)) return false;
        $family = FamilyTreeTopFamilies::find(
            'all',
            array(
                'conditions'=>array(
                    'husb=? OR wife=?',
                    $id,
                    $id
                )
            )
        );
        return (empty($family[0]))?null:$family[0]->family_id;
    }

    public function getByPartner($husb, $wife){
        if(empty($husb) || empty($wife)) return false;
        $family = FamilyTreeTopFamilies::find(
            'all',
            array(
                'conditions'=>array(
                    'husb=? AND wife=?',
                    $husb,
                    $wife
                )
            )
        );
        return $this->get($family[0]->family_id);
    }

    public function getList(){
        return array('family_id'=>$this->list, 'gedcom_id'=>$this->list_by_gedcom_id);
    }

}
