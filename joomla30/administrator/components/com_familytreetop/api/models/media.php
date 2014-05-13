<?php

class FamilyTreeTopApiModelMedia {
    public function create(){
        return array('response'=>'media:create');
    }
    public function read(){
        return array('response'=>'media:read');
    }
    public function update(){
        return array('response'=>'media:update');
    }
    public function destroy(){
        return array('response'=>'media:destroy');
    }

}
