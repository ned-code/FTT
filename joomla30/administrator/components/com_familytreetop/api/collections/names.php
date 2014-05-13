<?php

class FamilyTreeTopApiCollectionNames {
    public function create(){
        return array('response'=>'names:create');
    }
    public function read(){
        return array('response'=>'names:read');
    }
    public function update(){
        return array('response'=>'names:update');
    }
    public function destroy(){
        return array('response'=>'names:destroy');
    }


}