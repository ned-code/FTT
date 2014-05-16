<?php

class FamilyTreeTopApiModelUser {
    public function create(){
        return array('response'=>'user:create');
    }
    public function read(){
        return FamilyTreeTopUserHelper::getInstance()->nget();
    }
    public function update(){
        return array('response'=>'user:update');
    }
    public function destroy(){
        return array('response'=>'user:destroy');
    }
}
