<?php

class FamilyTreeTopApiCollectionDates {

    public function create(){
        return array('response'=>'dates:create');
    }
    public function read(){
        return array('response'=>'dates:read');
    }
    public function update(){
        return array('response'=>'dates:update');
    }
    public function destroy(){
        return array('response'=>'dates:destroy');
    }


}