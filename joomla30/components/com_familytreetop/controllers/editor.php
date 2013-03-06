<?php
defined('_JEXEC') or die;

require_once JPATH_COMPONENT.'/controller.php';

class FamilytreetopControllerEditor extends FamilytreetopController
{
    public function updateUserInfo(){
        $app = JFactory::getApplication();

        $form = $app->input->post->get('editProfile', array(), 'array');
        $gedcom_id = $app->input->post->get('gedcom_id', false);

        $gedcom = GedcomHelper::getInstance();

        $ind = $gedcom->individuals->get($gedcom_id);
        $ind->first_name = $form['first_name'];
        $ind->middle_name = $form['middle_name'];
        $ind->last_name = $form['last_name'];
        $ind->know_as = $form['know_as'];
        $ind->gender = $form['gender'];
        $ind->save();

        echo json_encode(array('ind'=>$ind));
        exit;
    }

    public function updateUnionsInfo(){}

    public function updateMediasInfo(){}

}
