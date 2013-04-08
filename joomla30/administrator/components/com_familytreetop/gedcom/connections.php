<?php
class FamilyTreeTopGedcomConnectionsManager {
    protected $tree_id;
    protected $list = array();

    public function __construct($tree_id){
        $this->tree_id = $tree_id;

    }

    public function getList(){
        return array();
    }
}