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

        $gedcom->childrens->save($this->family_id, $this->childrens);

        $gedcom->families->updateList($this);

        return $this;
    }

    public function addChild($gedcom_id){
        GedcomHelper::getInstance()->childrens->create($this->family_id, $gedcom_id);
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
        foreach($rows as $row){
            if(!empty($row['husb'])){
                 $result[$row['husb']][] = $row;
            }
            if(!empty($row['wife'])){
                $result[$row['wife']][] = $row;
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

        $gedcom->childrens = $gedcom->childrens->get($family_id);

        return $family;
    }

    public function getList(){
        return array('family_id'=>$this->list, 'gedcom_id'=>$this->list_by_gedcom_id);
    }

}
