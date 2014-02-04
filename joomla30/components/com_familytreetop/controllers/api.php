<?php
defined('_JEXEC') or die;

require_once JPATH_COMPONENT.'/controller.php';

class FamilytreetopControllerApi extends FamilytreetopController
{
    public function update(){
        echo json_encode(array('success'=>true));
        exit;
    }
}
