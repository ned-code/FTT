<?php

class FamilyTreeTopApiModelDate {
    public function create(){
        $data = FamilyTreeTopApiHelper::getInstance()->getBody();

        $event_id = $data->event_id;
        $start_day = $data->start_day;
        $start_month = $data->start_month;
        $start_year = $data->start_year;

        $d = JFactory::getDate();

        $date = new FamilyTreeTopDates();
        $date->type = 'EVO';
        $date->event_id = $event_id;
        $date->start_day = $start_day;
        $date->start_month = $start_month;
        $date->start_year = $start_year;
        $date->change_time = $d->toSql();
        $date->save();

        return array(
            'id' => $date->id,
            'event_id' => $date->event_id,
            'type' => $date->type,
            'start_day' => $date->start_day,
            'start_month' => $date->start_month,
            'start_year' => $date->start_year,
            'change_time' => $date->change_time
        );
    }
    public function read(){
        return array('response'=>'date:read');
    }
    public function update(){
        return array('response'=>'date:update');
    }
    public function destroy(){
        return array('response'=>'date:destroy');
    }

}
