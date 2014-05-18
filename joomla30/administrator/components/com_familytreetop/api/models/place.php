<?php

class FamilyTreeTopApiModelPlace {
    public function create(){
        $data = FamilyTreeTopApiHelper::getInstance()->getBody();

        $event_id = $data->event_id;
        $city = $data->city;
        $state = $data->state;
        $country = $data->country;

        $d = JFactory::getDate();

        if(!$event_id) return array();

        $place = new FamilyTreeTopPlaces();
        $place->event_id = $event_id;
        $place->city = $city;
        $place->state = $state;
        $place->country = $country;
        $place->change_time = $d->toSql();
        $place->save();

        return array(
            'id' => $place->id,
            'event_id' => $place->event_id,
            'city' => $place->city,
            'state' => $place->state,
            'country' => $place->country,
            'change_time' => $place->change_time
        );
    }
    public function read(){
        return array('response'=>'place:read');
    }
    public function update($id){
        $data = FamilyTreeTopApiHelper::getInstance()->getBody();

        $city = $data->city;
        $state = $data->state;
        $country = $data->country;

        $d = JFactory::getDate();

        $place = FamilyTreeTopPlaces::find($id);
        $place->city = $city;
        $place->state = $state;
        $place->country = $country;
        $place->change_time = $d->toSql();
        $place->save();

        return array(
            'id' => $place->id,
            'event_id' => $place->event_id,
            'city' => $place->city,
            'state' => $place->state,
            'country' => $place->country,
            'change_time' => $place->change_time
        );
    }
    public function destroy(){
        return array('response'=>'place:destroy');
    }

}
