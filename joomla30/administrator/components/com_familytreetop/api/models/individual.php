<?php

class FamilyTreeTopApiModelIndividual {
    public function create(){
        return array('response'=>'individual:create');
    }
    public function read(){
        $app = &JFactory::getApplication();
        $id = $app->input->get('id', false);
        if(!$id) return array();
        $ind = FamilyTreeTopIndividuals::find($id);
        return array(
            'id' => $ind->id,
            'gedcom_id' => $ind->gedcom_id,
            'creator_id' => $ind->creator_id,
            'gender' => $ind->gender,
            'family_id' => $ind->family_id
        );
    }
    public function update($id){
        $data = FamilyTreeTopApiHelper::getInstance()->getBody();

        $gender = $data->gender;

        if(!$id) return array('success' => 0);
        $ind = FamilyTreeTopIndividuals::find($id);

        $ind->gender = $gender;

        $ind->save();

        return array(
            'id' => $ind->id,
            'gedcom_id' => $ind->gedcom_id,
            'creator_id' => $ind->creator_id,
            'gender' => $ind->gender,
            'family_id' => $ind->family_id
        );
    }
    public function destroy(){
        return array('response'=>'individual:destroy');
    }
}
