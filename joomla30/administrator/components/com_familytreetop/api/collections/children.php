<?php

class FamilyTreeTopApiCollectionChildren {

    public function create(){
        return array('response'=>'children:create');
    }
    public function read(){
        return array('response'=>'children:read');
    }
    public function update(){
        return array('response'=>'children:update');
    }
    public function destroy(){
        return array('response'=>'children:destroy');
    }


}