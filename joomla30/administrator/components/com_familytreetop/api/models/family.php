<?php

class FamilyTreeTopApiModelFamily {
    public function create(){
        return array('response'=>'user:create');
    }
    public function read(){
        return array('response'=>'user:read');
    }
    public function update(){
        return array('response'=>'user:update');
    }
    public function destroy(){
        return array('response'=>'user:destroy');
    }

}
