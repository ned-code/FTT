<?php

class FamilyTreeTopGedcomFamilyModel {
    public $id = null;
    public $husb = null;
    public $wife = null;
    public $type = null;
    public $change_time = null;

    public $childrens = array();
    public $events = array();

    public function save(){
        $date = JFactory::getDate();
        if(empty($this->id)){
            $family = new FamilyTreeTopFamilies();
        } else {
            $family = FamilyTreeTopFamilies::find($this->id);
        }
        $family->husb = $this->husb;
        $family->wife = $this->wife;
        $family->type = $this->type;
        $family->change_time = $date->toSql();
        $family->save();

        if(empty($this->id)){
            $this->id = $family->id;
        }

        if(gettype($this->childrens) == "array" && !empty($this->childrens)){
            foreach($this->childrens as $gedcom_id){
                $ch = FamilyTreeTopChildrens::find_by_gedcom_id($gedcom_id);
                if(empty($ch)){
                    $ch = new FamilyTreeTopChildrens();
                    $ch->gedcom_id = $gedcom_id;
                    $ch->family_id = $this->id;
                    $ch->save();
                }
            }
        }

        return $this;
    }

}

class FamilyTreeTopGedcomFamiliesManager {

    public function get($family_id = null){
        if(empty($family_id)){
            return new FamilyTreeTopGedcomFamilyModel();
        }
    }
}
