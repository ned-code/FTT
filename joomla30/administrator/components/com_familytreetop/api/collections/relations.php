<?php

class FamilyTreeTopApiCollectionRelations {
    public function create(){
        return array('response'=>'relations:create');
    }
    public function read(){
        return array('response'=>'relations:read');
    }
    public function update(){
        return array('response'=>'relations:update');
    }
    public function destroy(){
        return array('response'=>'relations:destroy');
    }


}