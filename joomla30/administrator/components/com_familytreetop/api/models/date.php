<?php

class FamilyTreeTopApiModelDate {
    public function create(){
        return array('response'=>'date:create');
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
