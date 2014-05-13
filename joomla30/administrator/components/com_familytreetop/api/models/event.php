<?php

class FamilyTreeTopApiModelEvent {
    public function create(){
        return array('response'=>'event:create');
    }
    public function read(){
        return array('response'=>'event:read');
    }
    public function update(){
        return array('response'=>'event:update');
    }
    public function destroy(){
        return array('response'=>'event:destroy');
    }

}
