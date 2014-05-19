<?php

class FamilyTreeTopApiModelRelationName {
    public function create(){
        return array('response'=>'relationName:create');
    }
    public function read(){
        return array('response'=>'relationName:read');
    }
    public function update(){
        return array('response'=>'relationName:update');
    }
    public function destroy(){
        return array('response'=>'relationName:destroy');
    }

}
