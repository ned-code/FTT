<?php

class FamilyTreeTopApiModelPlace {
    public function create(){
        return array('response'=>'place:create');
    }
    public function read(){
        return array('response'=>'place:read');
    }
    public function update(){
        return array('response'=>'place:update');
    }
    public function destroy(){
        return array('response'=>'place:destroy');
    }

}
