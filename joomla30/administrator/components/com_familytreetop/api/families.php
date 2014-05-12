<?php

class FamilyTreeTopApiFamilies {

    public function get(){
        $families = array();
        $family = array(
            'id' => 1,
            'husb' => 'husb',
            'wife' => 'wife'
        );
        array_push($families, $family);
        return $families;
    }
    public function post(){
        return array('response'=>'post');
    }
    public function put(){
        return array('response'=>'put');
    }
    public function delete(){
        return array('response'=>'delete');
    }


}