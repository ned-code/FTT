<?php
defined('_JEXEC') or die;

require_once JPATH_COMPONENT.'/controller.php';

class FamilytreetopControllerApi extends FamilytreetopController
{
    public function update(){
        $facebook = FacebookHelper::getInstance()->facebook;
        $facebook_id = $facebook->getUser();
        if($facebook_id == 0){
            echo json_encode(array('success'=>false, 'task'=>'logout'));
        }
        echo json_encode(array('success'=>true));
        exit;
    }

    public function delete(){
        $gedcom = GedcomHelper::getInstance();

        $owner = FamilyTreeTopUserHelper::getInstance()->get();
        $users = $gedcom->getTreeUsers();

        $mass = array();

        foreach($users as $user){
            $mass[$user['gedcom_id']] = $gedcom->relations->getListById($user['gedcom_id']);
        }

        echo '----------------<br>';

        var_dump($mass);

        exit;
    }
}