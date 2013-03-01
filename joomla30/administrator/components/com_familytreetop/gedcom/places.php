<?php
class FamilyTreeTopGedcomPlaceModel {
    public $id = null;
    public $event_id = null;
    public $city = null;
    public $state = null;
    public $country = null;

    public function __construct(){
        $date = JFactory::getDate();
        $this->change_time = $date->toSql();
    }

    public function save(){
        if(empty($this->id)){

        }
    }
}
class FamilyTreeTopGedcomPlacesManager {
    protected $tree_id;

    public function __contstruct($tree_id){
        $this->tree_id = $tree_id;

        /*
        $db = JFactory::getDbo();
        $sql = "SELECT e.*
                FROM #__familytreetop_events as e, #__familytreetop_families as f, #__familytreetop_tree_links as l, #__familytreetop_trees as t
                WHERE ( (f.husb = l.id OR f.wife = l.ir)  OR e.gedcom_id = l.id ) AND l.tree_id = t.id AND t.id =" . $tree_id. " GROUP BY id";
        $db->setQuery($sql);
        $rows = $db->loadAssocList();
        */

    }

    public function get(){
        return new FamilyTreeTopGedcomPlaceModel();
    }
}