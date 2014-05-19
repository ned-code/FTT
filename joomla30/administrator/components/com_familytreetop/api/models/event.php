<?php

class FamilyTreeTopApiModelEvent {
    public function create(){
        $data = FamilyTreeTopApiHelper::getInstance()->getBody();

        $gedcom_id = $data->gedcom_id;
        $type = $data->type;
        $name = $data->name;

        $date = JFactory::getDate();

        $event = new FamilyTreeTopEvents();
        $event->gedcom_id = $gedcom_id;
        $event->type = $type;
        $event->name = $name;
        $event->change_time = $date->toSql();
        $event->save();

        return array(
            'id' => $event->id,
            'gedcom_id' => $event->gedcom_id,
            'family_id' => $event->family_id,
            'type' => $event->type,
            'name' => $event->name,
            'change_time' => $event->change_time
        );

    }
    public function read(){
        return array('response'=>'event:read');
    }
    public function update($id){
        return array('response'=>'event:update');
    }
    public function destroy($id){
        $event = FamilyTreeTopEvents::find($id);
        $event->delete();
        return array();
    }

}
