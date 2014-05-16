<?php

class FamilyTreeTopApiModelIndividual {
    public function create(){
        return array('response'=>'individual:create');
    }
    public function read(){
        return array('response'=>'individual:read');
    }
    public function update(){
        return array('response'=>'individual:update');
    }
    public function destroy(){
        return array('response'=>'individual:destroy');
    }
}
