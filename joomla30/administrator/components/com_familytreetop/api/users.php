<?php

class FamilyTreeTopApiUsers {

    public function get(){
        $users = array();
        $user = array(
            'id' => 1,
            'first_name' => 'first_name',
            'last_name' => 'last_name'
        );
        array_push($users, $user);
        return $users;
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