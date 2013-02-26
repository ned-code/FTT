<?php
class FamilyTreeTopGedcomIndividualsModel {
    public $tree_id = null;
    public $gedcom_id = null;
    public $individual_id = null;
    public $joomla_id = null;
    public $creator_id = null;
    public $gender = null;
    public $family_id = null;
    public $first_name = null;
    public $middle_name = null;
    public $last_name = null;
    public $know_as = null;
    public $relation = null;
    public $create_time = null;
    public $change_time = null;

    public $families = array();
    public $events = array();
    public $notes = array();
    public $medias = array();

    public function save(){
        if(empty($this->tree_id)) return false;

        $tree = FamilyTreeTopTrees::find($this->tree_id);
        if(empty($tree)) return false;

        $date = JFactory::getDate();

        if(empty($this->gedcom_id)){
            $link = new FamilyTreeTopTreeLinks();
            $link->tree_id = $this->tree_id;
            $link->save();

            $ind = new FamilyTreeTopIndividuals();
            $ind->gedcom_id = $link->id;
            $ind->create_time = $date->toSql();

            $this->gedcom_id = $link->id;
        } else {
            $ind = FamilyTreeTopIndividuals::find($this->gedcom_id);
        }
        if(empty($this->creator_id)){
            $this->creator_id = $this->gedcom_id;
        }
        $ind->creator_id = $this->creator_id;
        $ind->change_time = $date->toSql();
        $ind->gender = $this->gender;
        $ind->family_id = $this->family_id;
        $ind->save();

        $name = FamilyTreeTopNames::find_by_gedcom_id($this->gedcom_id);
        if(empty($name)){
            $name = new FamilyTreeTopNames();
            $name->gedcom_id = $this->gedcom_id;
        }
        $name->first_name = $this->first_name;
        $name->middle_name = $this->middle_name;
        $name->last_name = $this->last_name;
        $name->know_as = $this->know_as;
        $name->save();

        return $this;
    }

    public function delete(){
        if(empty($this->gedcom_id)) return false;
        $link = FamilyTreeTopTreeLinks::find($this->gedcom_id);
        if(!empty($link)){
            $link->delete();
            return true;
        }
        return false;
    }

}


class FamilyTreeTopGedcomIndividualsManager {

    public function get($gedcom_id = null){
        if(empty($gedcom_id)){
            return new FamilyTreeTopGedcomIndividualsModel();
        }
    }



}
