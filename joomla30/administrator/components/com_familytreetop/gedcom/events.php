<?php
class FamilyTreeTopGedcomEventModel {
    public $id = null;
    public $gedcom_id = null;
    public $family_id = null;
    public $type = null;
    public $name = null;
    public $change_time = null;

    public $date = null;
    public $place = null;

    public function __construct(){
        $date = JFactory::getDate();
        $this->change_time = $date->toSql();

        $gedcom = GedcomHelper::getInstance();

        $this->date = $gedcom->dates->get();
        $this->place = $gedcom->places->get();
    }

    public function save(){
        if(empty($this->gedcom_id) && empty($this->family_id)) return false;
        $gedcom = GedcomHelper::getInstance();
        if(empty($this->id)){
            $event = new FamilyTreeTopEvents();
        } else {
            $event = FamilyTreeTopEvents::find($this->id);
        }
        $event->gedcom_id = $this->gedcom_id;
        $event->family_id = $this->family_id;
        $event->name = $this->name;
        $event->type = $this->type;
        $event->change_time = $this->change_time;
        $event->save();

        $this->id = $event->id;

        if(!empty($this->date)){
            $this->date->save($this->id);
        }
        if(!empty($this->place)){
            $this->place->save($this->id);
        }
        $gedcom->events->updateList($event);
    }

    public function remove(){
        if(empty($this->id)) return false;
        $event = FamilyTreeTopEvents::find($this->id);
        $event->delete();
    }

    public function toList(){
        if(empty($this->id)) return false;
        $data = array();
        $data['id'] = $this->id;
        $data['gedcom_id'] = $this->gedcom_id;
        $data['family_id'] = $this->family_id;
        $data['type'] = $this->type;
        $data['change_time'] = $this->change_time;
        return $data;
    }
}

class FamilyTreeTopGedcomEventsManager {
    protected $tree_id;
    protected $list = array();
    protected $list_by_family_id = array();
    protected $list_by_gedcom_id = array();

    public function __construct($tree_id){
        $this->tree_id = $tree_id;
        if(!empty($tree_id)){
            $db = JFactory::getDbo();
            $sql = "SELECT e.*
                FROM #__familytreetop_events as e,
                    #__familytreetop_families as f,
                    #__familytreetop_tree_links as l,
                    #__familytreetop_trees as t

                WHERE IF(
                    e.gedcom_id  IS NULL,
                            f.family_id = l.id AND l.type = 1,
                            e.gedcom_id  = l.id AND l.type = 0
                        ) AND  l.tree_id = t.id AND t.id = %s

                GROUP BY id";
            $db->setQuery(sprintf($sql, $tree_id));
            $rows = $db->loadAssocList('id');

            $this->list = $rows;
            $this->list_by_gedcom_id = $this->sortList('gedcom_id', $rows);
            $this->list_by_family_id = $this->sortList('family_id', $rows);
        }
    }

    protected function sortList($type, $rows){
        if(empty($rows)) return array();
        $result = array();
        foreach($rows as $key => $row){
            if(isset($row[$type]) && $row[$type] != null){
                $result[$row[$type]][$key] = $row;
            }
        }
        return $result;
    }

    public function updateList($event){
        if($event->id) return false;
        $data = $event->toList();
        if($event->gedcom_id != null){
            $this->list_by_gedcom_id[$event->gedcom_id] = $data;
        }
        if($event->family_id != null){
            $this->list_by_family_id[$event->family_id] = $data;
        }
    }

    public function get($id = null, $family = false){
        $gedcom = GedcomHelper::getInstance();
        if(empty($id)){
            return new FamilyTreeTopGedcomEventModel();
        }
        if($family){
            $list = $this->list_by_family_id;
        } else {
            $list = $this->list_by_gedcom_id;
        }
        if(isset($list[$id]) && !empty($list[$id])){
            $data = $list[$id];
            $events = array();
            foreach($data as $el){
                $event = new FamilyTreeTopGedcomEventModel();
                $event->id = $el['id'];
                $event->gedcom_id = $el['gedcom_id'];
                $event->family_id = $el['family_id'];
                $event->type = $el['type'];

                $event->date = $gedcom->dates->get($event->id);
                $event->place = $gedcom->places->get($event->id);

                $events[] = $event;
            }
            return $events;
        }
        return array();
    }

    public function getList(){
        return array(
            'all' => $this->list,
            'gedcom_id' => $this->list_by_gedcom_id,
            'family_id' => $this->list_by_family_id
        );
    }

}
