<?php

class FamilyTreeTopApiCollectionEvents {
    public function create(){
        return array('response'=>'events:create');
    }
    public function read(){
        return array('response'=>'events:read');
    }
    public function update(){
        return array('response'=>'events:update');
    }
    public function destroy(){
        return array('response'=>'events:destroy');
    }


}