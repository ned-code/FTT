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

    //others
    public $events = array();
    public $medias = array();

    public function __construct($tree_id){
        $this->tree_id = $tree_id;
    }

    public function isParents(){
        $gedcom = GedcomHelper::getInstance();
        $family_id = $gedcom->childrens->getFamilyIdByGedcomId($this->gedcom_id);
        $family = $gedcom->families->get($family_id);
        if(empty($family->husb) && empty($family->wife)){
            return false;
        } else {
            return true;
        }
    }

    public function isChildrens(){
        $gedcom = GedcomHelper::getInstance();
        $family_id = $gedcom->families->getFamilyId($this->gedcom_id);
        $childens = $gedcom->childrens->getChildrens($family_id);
        if($childens){
            return true;
        }
        return false;
    }

    public function isSpouses(){
        $gedcom = GedcomHelper::getInstance();
        $spouses = $gedcom->families->getSpouses($this->gedcom_id);
        if($spouses){
            return true;
        }
        return false;
    }

    public function isCanBeDelete(){
        $isParents = $this->isParents();
        $isChildrens = $this->isChildrens();
        $isSpouses = $this->isSpouses();
        if($isParents && !$isChildrens && !$isSpouses){
            return true;
        } else if(!$isParents && $isChildrens && !$isSpouses){
            return true;
        }
        return false;
    }

    public function relationId(){
        $gedcom = GedcomHelper::getInstance();
        $relationList = $gedcom->relations->getList();
        if(isset($relationList[$this->gedcom_id])){
            return $relationList[$this->gedcom_id]['relation_id'];
        }
        return 0;
    }

    public function name(){
        if(empty($this->id)) return "";
        return $this->first_name . " " . $this->last_name;
    }

    public function birth(){
        return $this->getEventByType("BIRT");
    }

    public function death(){
        return $this->getEventByType("DEAT");
    }

    public function getEventByType($type){
        if(empty($this->events)) return false;
        foreach($this->events as $event){
            if($event->type == $type){
                return $event;
            }
        }
        return false;
    }

    public function delete(){
        $gedcom = GedcomHelper::getInstance();
        return false;
        /*
        if(empty($this->id)) return false;
        $user = FamilyTreeTopIndividuals::find_by_gedcom_id($this->gedcom_id);
        $user->delete();

        if($this->facebook_id != 0){
            $this->unregister();
        }

        $gedcom->individuals->removeFromList($this->gedcom_id);
        */
    }

    public function clear(){
        $gedcom = GedcomHelper::getInstance();
        $date = JFactory::getDate();

        $name = FamilyTreeTopNames::find_by_gedcom_id($this->gedcom_id);
        $name->first_name = "unknown";
        $name->middle_name = "";
        $name->last_name = "";
        $name->know_as = "";
        $name->change_time = $date->toSql();
        $name->save();

        $this->first_name = $name->first_name;
        $this->middle_name = $name->middle_name;
        $this->last_name = $name->last_name;
        $this->know_as = $name->know_as;
        $this->change_time = $name->change_time;

        if(!empty($this->events)){
            foreach($this->events as $event){
                $event->remove();
            }
        }

        $gedcom->individuals->updateList($this);
    }

    public function unregister(){
        $user = FamilyTreeTopUsers::find_by_gedcom_id($this->gedcom_id);
        $user->remove();
    }

    public function save(){
        if(empty($this->tree_id)) return false;
        $date = JFactory::getDate();
        $gedcom = GedcomHelper::getInstance();
        if(empty($this->id)){
            $ind = new FamilyTreeTopIndividuals();

            $link = new FamilyTreeTopTreeLinks();
            $link->tree_id = $this->tree_id;
            $link->type = 0;
            $link->save();

            $this->gedcom_id = $link->id;
            $this->create_time = $date->toSql();
        } else {
            $ind = FamilyTreeTopIndividuals::find($this->id);
            if(empty($ind)){
                return false;
            }
        }
        $ind->gedcom_id = $this->gedcom_id;
        $ind->gender = $this->gender;
        $ind->family_id = $this->family_id;
        $ind->creator_id = $this->creator_id;
        $ind->create_time = $this->create_time;
        $ind->change_time = $date->toSql();
        $ind->save();

        $this->id = $ind->id;

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

        if(!empty($this->events)){
            foreach($this->events as $event){
                $event->save();
            }
        }

        $gedcom->individuals->updateList($this);

        return $this;
    }

    public function getParents(){
        return FamilyTreeTopGedcomIndividualsManager::getParents($this->gedcom_id);
    }

    public function addEvent($event){
        $this->events[] = $event;
    }

    public function toList(){
        if(empty($this->id)) return false;
        $data = array();
        $data['id'] = $this->id;
        $data['gedcom_id'] = $this->gedcom_id;
        $data['creator_id'] = $this->creator_id;
        $data['gender'] = $this->gender;
        $data['family_id'] = $this->family_id;
        $data['create_time'] = $this->create_time;
        $data['change_time'] = $this->change_time;
        $data['first_name'] = $this->first_name;
        $data['middle_name'] = $this->middle_name;
        $data['last_name'] = $this->last_name;
        $data['know_as'] = $this->know_as;
        return $data;
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
            $sql = "SELECT i.id as id, i.gedcom_id, i.creator_id, i.gender, i.family_id, i.create_time,
                    i.change_time, n.first_name, n.middle_name, n.last_name, n.know_as
                FROM #__familytreetop_individuals as i,#__familytreetop_names as n,  #__familytreetop_tree_links as l, #__familytreetop_trees as t
                WHERE l.type = 0 AND i.gedcom_id = l.id AND l.tree_id = t.id AND n.gedcom_id = i.gedcom_id AND t.id = ". $tree_id;
            $db->setQuery($sql);
            $this->list = $db->loadAssocList('gedcom_id');
        }
    }

    protected function getObject($tree_id = null){
        return new FamilyTreeTopGedcomIndividualsModel((empty($tree_id))?$this->tree_id:$tree_id);
    }

    public function updateList(&$model){
        if(empty($model->id)) return false;
        $data = $model->toList();

        if(!isset($this->list[$model->gedcom_id])){
            $this->list[$model->gedcom_id] = $data;
        }
    }

    public function removeFromList($gedcom_id){
        if(isset($this->list[$gedcom_id])){
            unset($this->list[$gedcom_id]);
        }
    }

    public function get($gedcom_id = null){
        $gedcom = GedcomHelper::getInstance();
        if(empty($gedcom_id)){
            return $this->getObject();
        }
        $ind = $this->getObject();
        if(isset($this->list[$gedcom_id])){
            $data = $this->list[$gedcom_id];

            $ind->id = $data['id'];
            $ind->gedcom_id = $data['gedcom_id'];
            $ind->creator_id = $data['creator_id'];
            $ind->gender = $data['gender'];
            $ind->family_id = $data['family_id'];
            $ind->create_time = $data['create_time'];
            $ind->change_time = $data['change_time'];

            $ind->first_name = $data['first_name'];
            $ind->middle_name = $data['middle_name'];
            $ind->last_name = $data['last_name'];
            $ind->know_as = $data['know_as'];
        } else {
            return false;
        }

        $ind->events = $gedcom->events->get($ind->gedcom_id);

        return $ind;
    }

    public function getFromDb($tree_id, $gedcom_id){
        if(empty($tree_id) || empty($gedcom_id)) return false;
        $db = JFactory::getDbo();
        $sql = "SELECT i.id as id, i.gedcom_id, i.creator_id, i.gender, i.family_id, i.create_time,
                    i.change_time, n.first_name, n.middle_name, n.last_name, n.know_as
                FROM #__familytreetop_individuals as i,#__familytreetop_names as n,  #__familytreetop_tree_links as l, #__familytreetop_trees as t
                WHERE l.type = 0 AND i.gedcom_id = l.id AND l.tree_id = t.id AND n.gedcom_id = i.gedcom_id AND t.id = ". $tree_id . " AND l.id=".$gedcom_id;
        $db->setQuery($sql);
        $rows = $db->loadAssocList();

        if(sizeof($rows) == 0){
            return false;
        }

        $ind = $this->getObject($tree_id);
        $ind->id = $rows[0]['id'];
        $ind->gedcom_id = $rows[0]['gedcom_id'];
        $ind->creator_id = $rows[0]['creator_id'];
        $ind->gender = $rows[0]['gender'];
        $ind->family_id = $rows[0]['family_id'];
        $ind->create_time = $rows[0]['create_time'];
        $ind->change_time = $rows[0]['change_time'];

        $ind->first_name = $rows[0]['first_name'];
        $ind->middle_name = $rows[0]['middle_name'];
        $ind->last_name = $rows[0]['last_name'];
        $ind->know_as = $rows[0]['know_as'];

        return $ind;
    }

    public function getParents($gedcom_id){
        $gedcom = GedcomHelper::getInstance();
        $family_id = $gedcom->childrens->getFamilyIdByGedcomId($gedcom_id);
        $family = $gedcom->families->get($family_id);
        return array(
            'family' => $family,
            'father'=>$gedcom->individuals->get($family->husb),
            'mother'=>$gedcom->individuals->get($family->wife)
        );
    }

    public function getGender($gedcom_id){
        if(empty($gedcom_id) || !isset($this->list[$gedcom_id])) return false;
        return $this->list[$gedcom_id]['gender'];
    }

    public function getYoungest(){
        $db = JFactory::getDbo();
        $sql = "SELECT e.*, d.start_year
                    FROM #__familytreetop_tree_links as l, #__familytreetop_trees as t, #__familytreetop_events as e, #__familytreetop_dates as d
                    WHERE t.id = l.tree_id AND l.id = e.gedcom_id AND e.id = d.event_id AND e.type = 'BIRT' AND d.start_year IS NOT NULL AND t.id = ".$this->tree_id."
                      AND e.gedcom_id NOT IN (
                        SELECT e.gedcom_id
                        FROM #__familytreetop_tree_links as l, #__familytreetop_trees as t, #__familytreetop_events as e
                        WHERE t.id = l.tree_id AND l.id = e.gedcom_id AND e.type = 'DEAT' AND t.id = ".$this->tree_id.")
                    ORDER BY d.start_year DESC
                    LIMIT 1";
        $db->setQuery($sql);
        $rows = $db->loadAssocList();

        if(empty($rows)){
            return false;
        } else {
            return $this->get($rows[0]['gedcom_id']);
        }
    }
    public function getOldest(){
        $db = JFactory::getDbo();
        $sql = "SELECT e.*, d.start_year
                    FROM #__familytreetop_tree_links as l, #__familytreetop_trees as t, #__familytreetop_events as e, #__familytreetop_dates as d
                    WHERE t.id = l.tree_id AND l.id = e.gedcom_id AND e.id = d.event_id AND e.type = 'BIRT' AND d.start_year IS NOT NULL AND t.id = ".$this->tree_id."
                      AND e.gedcom_id NOT IN (
                        SELECT e.gedcom_id
                        FROM #__familytreetop_tree_links as l, #__familytreetop_trees as t, #__familytreetop_events as e
                        WHERE t.id = l.tree_id AND l.id = e.gedcom_id AND e.type = 'DEAT' AND t.id = ".$this->tree_id.")
                    ORDER BY d.start_year ASC
                    LIMIT 1";
        $db->setQuery($sql);
        $rows = $db->loadAssocList();

        if(empty($rows)){
            return false;
        } else {
            return $this->get($rows[0]['gedcom_id']);
        }
    }


    public function getLastUpdatedProfile(){
        $db = JFactory::getDbo();
        $sql = "SELECT i.*
                    FROM geicz_familytreetop_individuals as i, geicz_familytreetop_tree_links as l, geicz_familytreetop_trees as t
                    WHERE i.gedcom_id = l.id AND l.tree_id = t.id AND t.id = ".$this->tree_id."
                    ORDER BY i.change_time DESC";

        $db->setQuery($sql);
        $rows = $db->loadAssocList();

        if(empty($rows)){
            return false;
        } else {
            return $this->get($rows[0]['gedcom_id']);
        }
    }

    public function getList(){
        return $this->list;
    }

}