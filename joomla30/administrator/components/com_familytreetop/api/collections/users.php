<?php

class FamilyTreeTopApiCollectionUsers {
    public function create(){
        return array('response'=>'users:create');
    }
    public function read(){
        return array('response'=>'users:read');
    }
    public function update(){
        return array('response'=>'users:update');
    }
    public function destroy(){
        return array('response'=>'users:destroy');
    }

}