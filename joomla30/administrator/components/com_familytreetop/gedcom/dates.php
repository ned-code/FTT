<?php
class FamilyTreeTopGedcomDateModel {
    public $id = null;
    public $event_id = null;
    public $type = null;
    public $start_day = null;
    public $start_month = null;
    public $start_year = null;
    public $end_day = null;
    public $end_year = null;
    public $change_time = null;

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
            $date = new FamilyTreeTopDates();
        } else {
            $date = FamilyTreeTopDates::find($this->id);
        }
        $date->event_id = $this->event_id;
        $date->start_day = $this->start_day;
        $date->start_month = $this->start_month;
        $date->start_year = $this->start_year;
        $date->end_day = $this->end_day;
        $date->end_month = $this->end_month;
        $date->end_year = $this->end_year;
        $date->change_time = $this->change_time;
        $date->save();

        $this->id = $date->id;

        $gedcom->dates->updateList($date);
    }
}

class FamilyTreeTopGedcomDatesManager {
    protected $tree_id;
    protected $list;

    public function __construct($tree_id){
        $this->tree_id = $tree_id;
        if(!empty($tree_id)){
            $db = JFactory::getDbo();
            $sql = "SELECT d.*
                FROM #__familytreetop_dates as d,
                    #__familytreetop_events as e,
                    #__familytreetop_families as f,
                    #__familytreetop_tree_links as l,
                    #__familytreetop_trees as t

                WHERE d.event_id = e.id
                        AND IF(
                            e.gedcom_id  IS NULL,
                            f.husb = l.id OR f.wife = l.id,
                            e.gedcom_id  = l.id
                        ) AND  l.tree_id = t.id AND t.id = %s

                GROUP BY id";
            $db->setQuery(sprintf($sql, $tree_id));
            $this->list = $db->loadAssocList('id');
        }

    }

    public function get($id = null){
        if(empty($id)){
            return new FamilyTreeTopGedcomDateModel();
        }
    }

    public function updateList($date){
        if(empty($date) || empty($date->id)) return false;
        $data = array();
        $data['id'] = $date->id;
        $data['event_id'] = $date->event_id;
        $data['type'] = $date->type;
        $data['start_day'] = $date->start_day;
        $data['start_month'] = $date->start_month;
        $data['start_year'] = $date->start_year;
        $data['end_day'] = $date->end_day;
        $data['end_month'] = $date->end_month;
        $data['end_year'] = $date->end_year;
        $data['change_time'] = $date->change_time;

        $this->list[$date->id] = $data;
    }

    public function getList(){
        return $this->list;
    }
}