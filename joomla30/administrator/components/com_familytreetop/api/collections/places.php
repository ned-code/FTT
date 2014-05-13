<?php

class FamilyTreeTopApiCollectionPlaces {
    public function create(){
        return array('response'=>'places:create');
    }
    public function read(){
        return array('response'=>'places:read');
    }
    public function update(){
        return array('response'=>'places:update');
    }
    public function destroy(){
        return array('response'=>'places:destroy');
    }


}