<?php

class FamilyTreeTopApiModelRelation {
    public function create(){
        return array('response'=>'relation:create');
    }
    public function read(){
        return array('response'=>'relation:read');
    }
    public function update(){
        return array('response'=>'relation:update');
    }
    public function destroy(){
        return array('response'=>'relation:destroy');
    }

}
