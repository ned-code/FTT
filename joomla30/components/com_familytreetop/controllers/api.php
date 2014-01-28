<?php
defined('_JEXEC') or die;

require_once JPATH_COMPONENT.'/controller.php';

class FamilytreetopControllerApi extends FamilytreetopController
{
    public function update(){
        echo json_encode(array('success'=>true));
        exit;
    }

    public function gen(){
        //echo JUserHelper::hashPassword('!QA2ws#ED');
        $salt		= JUserHelper::genRandomPassword(32);
        $crypt = JUserHelper::getCryptedPassword('!QA2ws#ED', $salt, 'md5-hex');

        echo $salt;
        echo "<br>";
        echo $crypt;
        exit;
    }

}
