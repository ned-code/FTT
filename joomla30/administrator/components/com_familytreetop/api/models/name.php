<?php

class FamilyTreeTopApiModelName {
    public function create(){
        return array('response'=>'name:create');
    }
    public function read(){
        return array('response'=>'name:read');
    }
    public function update($id){
        $data = FamilyTreeTopApiHelper::getInstance()->getBody();

        $first_name = $data->first_name;
        $middle_name = $data->middle_name;
        $last_name = $data->last_name;
        $know_as = $data->know_as;

        if(!$id) return array('success' => 0);
        $name = FamilyTreeTopNames::find($id);

        $name->first_name = $first_name;
        $name->middle_name = $middle_name;
        $name->last_name = $last_name;
        $name->know_as = $know_as;

        $name->save();
        return array(
            'success' => 1
        );
    }
    public function destroy(){
        return array('response'=>'name:destroy');
    }

}
