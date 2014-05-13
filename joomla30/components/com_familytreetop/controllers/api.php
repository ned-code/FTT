<?php
defined('_JEXEC') or die;

require_once JPATH_COMPONENT.'/controller.php';

class FamilytreetopControllerApi extends FamilytreetopController
{

    // request rest api method
    public function send(){
        $app = & JFactory::getApplication();
        $api = FamilyTreeTopApiHelper::getInstance();
        echo $api->request($app->input->get('class', false), $app->input->get('id', false));
        exit;
    }

    public function update(){
        echo json_encode(array('success'=>true));
        exit;
    }
}
