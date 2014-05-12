<?php

class FamilyTreeTopApiUser {

    public function get(){
        return array(
            'id' => 1,
            'first_name' => 'first_name',
            'last_name' => 'last_name'
        );
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
