<?php

class FamilyTreeTopApiModelMedia {
    public function create(){
        return array('response'=>'media:create');
    }
    public function read(){
        return array('response'=>'media:read');
    }
    public function update($id){
        $data = FamilyTreeTopApiHelper::getInstance()->getBody();
        if(!$id) return array('success' => 0);

        $media_link = FamilyTreeTopMediaLinks::find_by_media_id($id);
        $media_link->role = $data->role;
        $media_link->save();

        return array(
            'role' => $data->role
        );

    }
    public function destroy(){
        return array('response'=>'media:destroy');
    }

}
