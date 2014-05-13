<?php

class FamilyTreeTopApiModelUser {
    public function create(){
        return array('response'=>'family:create');
    }
    public function read(){
        return array('response'=>'family:read');
    }
    public function update(){
        return array('response'=>'family:update');
    }
    public function destroy(){
        return array('response'=>'family:destroy');
    }
}
