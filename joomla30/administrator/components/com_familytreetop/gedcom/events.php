<?php
class FamilyTreeTopGedcomEventsManager {
    protected $list;
    protected $tree_id;
    protected $type;

    public function __construct($tree_id = null, $type = null){
        if(empty($tree_id) && empty($type)) return false;
        $this->tree_id = $tree_id;
        $this->type = $type;

        $db = JFactory::getDbo();
        $sql = "SELECT e.*
                FROM #__familytreetop_events as e, #__familytreetop_tree_links as l, #__familytreetop_trees as t
                WHERE e.gedcom_id = l.id AND l.tree_id = t.id AND t.id =" . $tree_id. " GROUP BY id";
        $db->setQuery($sql);
        $rows = $db->loadAssocList();
        $individualEvents = array();

        if(!empty($rows)){
            foreach($rows as $row){
                $individualEvents[$row['gedcom_id']][] = $row;
            }
        }


        $sql = "SELECT e.*
                FROM #__familytreetop_events as e, #__familytreetop_families as f,  #__familytreetop_tree_links as l, #__familytreetop_trees as t
                WHERE e.family_id = f.id AND (f.husb = l.id OR f.wife = l.id) AND l.tree_id = t.id AND t.id =" . $tree_id. " GROUP BY id";
        $db->setQuery($sql);
        $rows = $db->loadAssocList();
        $familyEvents = array();

        if(!empty($rows)){
            foreach($rows as $row){
                $familyEvents[$row['family_id']][] = $row;
            }
        }

        $this->list = array('Individual'=>$individualEvents, 'Family'=>$familyEvents);
    }

    public function get($id){
        $list = $this->list[$this->type];
        if(isset($list[$id])){
            $gedcom = GedcomHelper::getInstance();
            $result = array();
            foreach($list[$id] as $e){
                $event = $gedcom->getEventObject();
                $event->id = $e['id'];
                $event->gedcom_id = $e['gedcom_id'];
                $event->family_id = $e['family_id'];
                $event->type = $e['type'];
                $event->name = $e['name'];
                $event->change_time = $e['change_time'];

                $result[$e['type']][] = $event;
            }
            return $result;
        }
    }

    public function save($id, $data){
        $list = $this->list[$this->type];
        $type = $this->type=="Family"?"family_id":"gedcom_id";
        if(empty($data->id)){
            $event = new FamilyTreeTopEvents();
        } else {
            $event = FamilyTreeTopEvents::find($data->id);
        }
        $date = JFactory::getDate();
        $time = $date->toSql();

        $event->{$type} = $id;
        $event->name = $data->name;
        $event->type = $data->type;
        $event->change_time = $time;
        $event->save();

        $list[$event->{$type}][] = array(
            'id'=>$event->id,
            'gedcom_id' => $event->gedcom_id,
            'family_id' => $event->family_id,
            'name' => $event->name,
            'type' => $event->type,
            'change_time' => $event->change_type
        );

        if($event->id != null){
            if(empty($data->date->id)){
                $date = new FamilyTreeTopDates();
                $date->event_id = $event->id;

            } else {
                $date = FamilyTreeTopDates::find($data->date->id);
            }
            $date->type = $data->date->type;
            $date->start_day = $data->date->start_day;
            $date->start_month = $data->date->start_month;
            $date->start_year = $data->date->start_year;
            $date->end_day = $data->date->end_day;
            $date->end_month = $data->date->end_month;
            $date->end_year = $data->date->end_year;
            $date->change_time = $time;

            $date->save();

            //place
            if(empty($data->place->id)){
                $place = new FamilyTreeTopPlaces();
                $place->event_id = $event->id;
            } else {
                $place = FamilyTreeTopPlaces::find($data->place->id);
            }
            $place->city = $data->place->city;
            $place->state = $data->place->state;
            $place->country = $data->place->country;
            $place->change_time = $time;
            $place->save();
        }

    }
}
