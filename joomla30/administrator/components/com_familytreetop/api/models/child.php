<?php

class FamilyTreeTopApiModelChild {
    public function create(){
        return array('response'=>'child:create');
    }
    public function read(){
        return array('response'=>'child:read');
    }
    public function update(){
        return array('response'=>'child:update');
    }
    public function destroy(){
        return array('response'=>'child:destroy');
    }

}
