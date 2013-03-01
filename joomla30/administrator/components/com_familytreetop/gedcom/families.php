<?php

class FamilyTreeTopGedcomFamilyModel {
    public $tree_id = null;

    public $id = null;
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
        if(empty($this->id)){
            $family = new FamilyTreeTopFamilies();
        } else {
            $family = FamilyTreeTopFamilies::find($this->id);
            if(empty($family)){
                return false;
            }
        }
        $family->husb = $this->husb;
        $family->wife = $this->wife;
        $family->type = $this->type;
        $family->change_time = $this->change_time;
        $family->save();

        $this->id = $family->id;

        $gedcom->childrens->save($family->childrens);

        $gedcom->families->updateList($this);
    }

}

class FamilyTreeTopGedcomFamiliesManager {
    protected $list = array();
    protected $tree_id;

    public function __construct($tree_id){
        $this->tree_id = $tree_id;
        if(!empty($tree_id)){
            $db = JFactory::getDbo();
            $sql = "SELECT f.*
                FROM #__familytreetop_families as f, #__familytreetop_tree_links as l, #__familytreetop_trees as t
                WHERE (f.husb = l.id OR f.wife = l.id) AND l.tree_id = t.id AND t.id = " . $tree_id. " GROUP BY id";
            $db->setQuery($sql);
            $this->list = $db->loadAssocList('id');
        }

    }

    protected function getObject(){
        return new FamilyTreeTopGedcomFamilyModel($this->tree_id, $this->list);
    }

    public function updateList(&$model){
        if(empty($model->id)) return false;
        $data = array();
        $data['id'] = $model->id;
        $data['husb'] = $model->husb;
        $data['wife'] = $model->wife;
        $data['type'] = $model->type;
        $data['change_time'] = $model->change_time;

        if(!isset($this->list[$model->id])){
            $this->list[$model->id] = $data;
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


}
