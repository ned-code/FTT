<?php
defined('_JEXEC') or die;

require_once JPATH_COMPONENT.'/controller.php';

class FamilytreetopControllerUpload extends FamilytreetopController
{
    public function file(){
        echo json_encode(array('success'=>true));
        exit;
    }
}
