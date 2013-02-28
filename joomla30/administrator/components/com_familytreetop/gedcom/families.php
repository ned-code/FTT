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

    protected $childrensManager;
    protected $eventsManager;

    public function __construct($tree_id, &$childrens, &$events){
        $this->tree_id = $tree_id;
        $date = JFactory::getDate();
        $this->change_time = $date->toSql();

        $this->childrensManager = $childrens;
        $this->eventsManager = $events;
    }

    public function save(){
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

        //childrens
        $this->childrensManager->save($this->id, $this->childrens);

    }

    public function addChild($gedcom_id){
        $this->childrensManager->create($this->id, $gedcom_id);
    }

    public function event($data = null){
        if(empty($data)) return false;
        $this->eventsManager->save($this->id, $data);
    }
}

class FamilyTreeTopGedcomFamiliesManager {
    protected $list;
    protected $tree_id;
    protected $chidrens;
    protected $events;

    public function __construct($tree_id){
        $this->tree_id = $tree_id;
        $this->chidrens = new FamilyTreeTopGedcomChildrensManager($tree_id, "Family");
        $this->events = new FamilyTreeTopGedcomEventsManager($tree_id, "Family");

        $db = JFactory::getDbo();
        $sql = "SELECT f.*
                FROM #__familytreetop_families as f, #__familytreetop_tree_links as l, #__familytreetop_trees as t
                WHERE (f.husb = l.id OR f.wife = l.id) AND l.tree_id = t.id AND t.id = " . $tree_id;
        $db->setQuery($sql);
        $this->list = $db->loadAssocList('id');
    }

    protected function getObject(){
        return new FamilyTreeTopGedcomFamilyModel($this->tree_id, $this->chidrens, $this->events);
    }

    public function get($family_id = null){
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

        $family->childrens = $this->chidrens->get($family->id);
        $family->events = $this->events->get($family->id);

        return $family;
    }
}
