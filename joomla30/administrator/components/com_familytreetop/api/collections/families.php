<?php

class FamilyTreeTopApiCollectionFamilies {
    public function create(){
        return array('response'=>'families:create');
    }
    public function read(){
        return array('response'=>'families:read');
    }
    public function update(){
        return array('response'=>'families:update');
    }
    public function destroy(){
        return array('response'=>'families:destroy');
    }


}