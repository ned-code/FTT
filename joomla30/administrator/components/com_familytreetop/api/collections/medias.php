<?php

class FamilyTreeTopApiCollectionMedias {
    public function create(){
        return array('response'=>'medias:create');
    }
    public function read(){
        return array('response'=>'medias:read');
    }
    public function update(){
        return array('response'=>'medias:update');
    }
    public function destroy(){
        return array('response'=>'medias:destroy');
    }


}