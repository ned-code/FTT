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
        if(empty($this->event_id) && empty($event_id)) return false;
        if(empty($this->event_id)){
            $this->event_id = $event_id;
        }
        $gedcom = GedcomHelper::getInstance();
        if(empty($this->id)){
            $place = new FamilyTreeTopPlaces();
        } else {
            $place = FamilyTreeTopPlaces::find($this->id);
        }

        $place->event_id = $this->event_id;
        $place->city = $this->city;
        $place->state = $this->state;
        $place->country = $this->country;
        $place->change_time = $this->change_time;
        $place->save();

        $this->id = $place->id;

        $gedcom->places->updateList($place);
    }
}
class FamilyTreeTopGedcomPlacesManager {
    protected $tree_id;
    protected $list;

    public function __contstruct($tree_id){
        $this->tree_id = $tree_id;

        $db = JFactory::getDbo();
        $sql = "SELECT p.*
                FROM #__familytreetop_places as p,
                    #__familytreetop_events as e,
                    #__familytreetop_families as f,
                    #__familytreetop_tree_links as l,
                    #__familytreetop_trees as t

                WHERE p.event_id = e.id
                        AND IF(
                            e.gedcom_id  IS NULL,
                            f.husb = l.id OR f.wife = l.id,
                            e.gedcom_id  = l.id
                        ) AND  l.tree_id = t.id AND t.id = %s

                GROUP BY id";
        $db->setQuery(sprintf($sql, $tree_id));
        $this->list = $db->loadAssocList('id');

    }

    public function get($id = null){
        if(empty($id)){
            return new FamilyTreeTopGedcomPlaceModel();
        }

    }

    public function updateList($place){
        if(empty($place) || empty($place->id)) return false;
        ///	id	event_id	city	state	country	change_time
        $data = array();
        $data['id'] = $place->id;
        $data['event_id'] = $place->event_id;
        $data['city'] = $place->city;
        $data['state' ]= $place->state;
        $data['country'] = $place->country;
        $data['change_time'] = $place->change_time;

        $this->list[$place->id] = $data;
    }

    public function getList(){
        return $this->list;
    }
}