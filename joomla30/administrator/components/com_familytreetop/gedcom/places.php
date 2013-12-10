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

    public function save($event_id = null){
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

        $gedcom->places->updateList($this);
    }

    public function toList(){
        if(empty($this->id)) return false;
        $data = array();
        $data['id'] = $this->id;
        $data['event_id'] = $this->event_id;
        $data['city'] = $this->city;
        $data['state' ]= $this->state;
        $data['country'] = $this->country;
        $data['change_time'] = $this->change_time;
        return $data;
    }
}
class FamilyTreeTopGedcomPlacesManager {
    protected $tree_id;
    protected $list;
    protected $cache_list;

    public function __construct($tree_id){
        $this->tree_id = $tree_id;
        if(!empty($tree_id)){
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
                            e.family_id = l.id AND l.type = 1,
                            e.gedcom_id  = l.id AND l.type = 0
                        ) AND  l.tree_id = t.id AND t.id = %s

                GROUP BY id";
            $db->setQuery(sprintf($sql, $tree_id));
            $this->list = $db->loadAssocList('event_id');
        }
    }

    public function get($id = null){
        if(empty($id)){
            return new FamilyTreeTopGedcomPlaceModel();
        }
        if(isset($this->cache_list[$id])){
            $item = $this->cache_list[$id];
            $place = new FamilyTreeTopGedcomPlaceModel();
            $place->id = $item['id'];
            $place->event_id = $item['event_id'];
            $place->city = $item['city'];
            $place->state = $item['state'];
            $place->country = $item['country'];
            return $place;
        }
        return new FamilyTreeTopGedcomPlaceModel();
    }

    public function updateList($place){
        if(empty($place) || empty($place->id)) return false;
        $data = $place->toList();
        $this->list[$place->id] = $data;
        $this->cache_list[$place->id] = $data;
    }

    public function getViewList($eventList){
        $list = $this->list;
        $events = $eventList['all'];
        $result = array();

        foreach($list as $id => $item){
            if(isset($events[$id])){
                $result[$id] = $item;
            }
        }

        $this->cache_list = $result;

        return $result;
    }

    public function getList(){
        return $this->list;
    }
}