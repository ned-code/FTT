<?php
class FamilyTreeTopGedcomIndividualsModel {
    public $tree_id = null;
    //individuals table
    public $id = null;
    public $gedcom_id = null;
    public $creator_id = null;
    public $gender = null;
    public $family_id = null;
    public $create_time = null;
    public $change_time = null;
    public $notes = '';

    public $first_name = null;
    public $middle_name = null;
    public $last_name = null;
    public $know_as = null;

    //relation
    public $relation = null;

    //others
    public $events = array();
    public $medias = array();

    public function __construct($tree_id){
        $this->tree_id = $tree_id;

        $date = JFactory::getDate();
        $this->change_time = $date->toSql();
    }

    public function save(){
        if(empty($this->tree_id)) return false;
        $gedcom = GedcomHelper::getInstance();
        if(empty($this->id)){
            $link = new FamilyTreeTopTreeLinks();
            $ind = new FamilyTreeTopIndividuals();

            $link->tree_id = $this->tree_id;
            $link->save();

            $this->gedcom_id = $link->id;
        } else {
            $ind = FamilyTreeTopIndividuals::find($this->id);
            if(empty($ind)){
                return false;
            } else {
                $link = FamilyTreeTopTreeLinks::find_by_gedcom_id($ind->gedcom_id);
                if($link->tree_id != $this->tree_id){
                    return false;
                }
            }
        }
        $ind->gedcom_id = $this->gedcom_id;
        $ind->gender = $this->gender;
        $ind->family_id = $this->family_id;
        $ind->change_time = $this->change_time;
        $ind->save();

        $name = FamilyTreeTopNames::find_by_gedcom_id($this->gedcom_id);
        if(empty($name)){
            $name = new FamilyTreeTopNames();
        }
        $name->gedcom_id = $this->gedcom_id;
        $name->first_name = $this->first_name;
        $name->middle_name = $this->middle_name;
        $name->last_name = $this->last_name;
        $name->know_as = $this->know_as;
        $name->change_time = $ind->change_time;
        $name->save();

        $gedcom->individuals->updateList($this);

        return $this;
    }

    public function name(){
        return $this->first_name . " " . $this->last_name;
    }
}


class FamilyTreeTopGedcomIndividualsManager {
    protected $list = array();
    protected $tree_id;
    protected $events;

    public function __construct($tree_id){
        $this->tree_id = $tree_id;
        if(!empty($tree_id)){
            $db = JFactory::getDbo();
            $sql = "SELECT i.id as individual_id, i.gedcom_id, i.creator_id, i.gender, i.family_id, i.create_time,
                    i.change_time, n.first_name, n.middle_name, n.last_name, n.know_as
                FROM #__familytreetop_individuals as i,#__familytreetop_names as n,  #__familytreetop_tree_links as l, #__familytreetop_trees as t
                WHERE n.gedcom_id = i.gedcom_id AND i.gedcom_id = l.id AND l.tree_id = t.id AND t.id = ". $tree_id;
            $db->setQuery($sql);
            $this->list = $db->loadAssocList('gedcom_id');
        }
    }

    protected function getObject(){
        return new FamilyTreeTopGedcomIndividualsModel($this->tree_id);
    }

    public function updateList(&$model){
        if(empty($model->id)) return false;
        $data['individual_id'] = $model->id;
        $data['gedcom_id'] = $model->gedcom_id;
        $data['creator_id'] = $model->creator_id;
        $data['gender'] = $model->gender;
        $data['family_id'] = $model->family_id;
        $data['create_time'] = $model->create_time;
        $data['change_time'] = $model->change_time;
        $data['first_name'] = $model->first_name;
        $data['middle_name'] = $model->middle_name;
        $data['last_name'] = $model->last_name;
        $data['know_as'] = $model->know_as;

        if(!isset($this->list[$model->gedcom_id])){
            $this->list[$model->gedcom_id] = $data;
        }
    }

    public function get($gedcom_id = null){
        if(empty($gedcom_id)){
            return $this->getObject();
        }
        $ind = $this->getObject();
        if(isset($this->list[$gedcom_id])){
            $data = $this->list[$gedcom_id];

            $ind->id = $data['individual_id'];
            $ind->gedcom_id = $data['gedcom_id'];
            $ind->creator_id = $data['creator_id'];
            $ind->gender = $data['gender'];
            $ind->family_id = $data['family_id'];
            $ind->create_time = $data['create_time'];

            $ind->first_name = $data['first_name'];
            $ind->middle_name = $data['middle_name'];
            $ind->last_name = $data['last_name'];
            $ind->know_as = $data['know_as'];
        } else {
            return false;
        }

        //relation
        //medias
        //events
        return $ind;
    }

    public function getList(){
        return $this->list;
    }

}
