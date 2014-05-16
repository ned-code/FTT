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

    public function tpl(){
        $app = & JFactory::getApplication();
        $tpl = $app->input->get('tpl', false);
        if(!$tpl) return "";
        echo file_get_contents(JPATH_BASE . "/components/com_familytreetop/tpl/".$tpl);
        exit;
    }

    public function update(){
        echo json_encode(array('success'=>true));
        exit;
    }
}
