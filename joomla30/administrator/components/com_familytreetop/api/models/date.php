<?php

class FamilyTreeTopApiModelDate {
    public function create(){
        $data = FamilyTreeTopApiHelper::getInstance()->getBody();

        $event_id = (int)$data->event_id;
        $start_day = (int)$data->start_day;
        $start_month = (int)$data->start_month;
        $start_year = (int)$data->start_year;

        if(!$event_id) return array();

        $d = &JFactory::getDate();


        $date = new FamilyTreeTopDates();
        $date->type = 'EVO';
        $date->event_id = $event_id;
        $date->start_day = $start_day;
        $date->start_month = $start_month;
        $date->start_year = $start_year;
        $date->change_time = $d->toSql();
        $date->save();

        return array(
            'id' => (int)$date->id,
            'event_id' => (int)$date->event_id,
            'type' => $date->type,
            'start_day' => (int)$date->start_day,
            'start_month' => (int)$date->start_month,
            'start_year' => (int)$date->start_year,
            'change_time' => (int)$date->change_time->date
        );
    }
    public function read(){
        return array('response'=>'date:read');
    }
    public function update($id){
        $data = FamilyTreeTopApiHelper::getInstance()->getBody();

        $event_id = (int)$data->event_id;
        $start_day = (int)$data->start_day;
        $start_month = (int)$data->start_month;
        $start_year = (int)$data->start_year;

        if(!$event_id) return array();

        $d = &JFactory::getDate();

        $date = FamilyTreeTopDates::find($id);
        $date->start_day = $start_day;
        $date->start_month = $start_month;
        $date->start_year = $start_year;
        $date->change_time = $d->toSql();
        $date->save();

        return array(
            'id' => (int)$date->id,
            'event_id' => (int)$date->event_id,
            'type' => $date->type,
            'start_day' => (int)$date->start_day,
            'start_month' => (int)$date->start_month,
            'start_year' => (int)$date->start_year,
            'change_time' => (int)$date->change_time->date
        );
    }

    public function destroy(){
        return array('response'=>'date:destroy');
    }

}
