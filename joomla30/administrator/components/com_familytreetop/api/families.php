<?php

class FamilyTreeTopApiFamilies {

    public function get(){
        return json_encode(array('response'=>'get'));
    }
    public function post(){
        return json_encode(array('response'=>'post'));
    }
    public function put(){
        return json_encode(array('response'=>'put'));
    }
    public function delete(){
        return json_encode(array('response'=>'delete'));
    }


}