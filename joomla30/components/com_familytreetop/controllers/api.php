<?php
defined('_JEXEC') or die;

require_once JPATH_COMPONENT.'/controller.php';

class FamilytreetopControllerApi extends FamilytreetopController
{


    public function user(){
        $api = FamilyTreeTopApiHelper::getInstance();
        echo $api->request('user');
        exit;
    }

    public function family(){
        $api = FamilyTreeTopApiHelper::getInstance();
        echo $api->request('family');
        exit;
    }

    public function users(){
        $api = FamilyTreeTopApiHelper::getInstance();
        echo $api->request('users');
        exit;
    }

    public function families(){
        $api = FamilyTreeTopApiHelper::getInstance();
        echo $api->request('families');
        exit;
    }

    public function update(){
        echo json_encode(array('success'=>true));
        exit;
    }
}
