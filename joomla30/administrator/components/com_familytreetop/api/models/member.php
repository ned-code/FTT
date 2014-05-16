<?php

class FamilyTreeTopApiModelMember {
    public function create(){
        return array('response'=>'member:create');
    }
    public function read(){
        return array('response'=>'member:read');
    }
    public function update(){
        return array('response'=>'member:update');
    }
    public function destroy(){
        return array('response'=>'member:destroy');
    }
}
