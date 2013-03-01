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

        $event->place->save($this->id);
        $event->date->save($this->id);

        $gedcom->events->updateList($event);
    }
}

class FamilyTreeTopGedcomEventsManager {
    protected $tree_id;
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
                            f.husb = l.id OR f.wife = l.id,
                            e.gedcom_id  = l.id
                        ) AND  l.tree_id = t.id AND t.id = %s

                GROUP BY id";
            $db->setQuery(sprintf($sql, $tree_id));
            $rows = $db->loadAssocList('id');

            $this->list_by_gedcom_id = $this->sortList('gedcom_id', $rows);
            $this->list_by_family_id = $this->sortList('family_id', $rows);
        }
    }

    protected function sortList($type, $rows){
        if(empty($rows)) return array();
        $result = array();
        foreach($rows as $key => $row){
            if(isset($row[$type])){
                $result[$row[$type]][$key] = $row;
            }
        }
        return $result;
    }

    public function updateList($event){
        if($event->id) return false;
        $data = array();
        $data['id'] = $event->id;
        $data['gedcom_id'] = $event->gedcom_id;
        $data['family_id'] = $event->family_id;
        $data['type'] = $event->type;
        $data['change_time'] = $event->change_time;

        $this->list_by_gedcom_id[$event->gedcom_id] = $data;
        $this->list_by_family_id[$event->family_id] = $data;
    }

    public function get($id = null, $family = false){
        if(empty($id)){
            return new FamilyTreeTopGedcomEventModel();
        }

    }

    public function getList(){
        return array(
            'gedcom_id' => $this->list_by_gedcom_id,
            'family_id' => $this->list_by_gedcom_id
        );
    }

}
