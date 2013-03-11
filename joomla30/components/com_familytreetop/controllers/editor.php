<?php
defined('_JEXEC') or die;

require_once JPATH_COMPONENT.'/controller.php';

class FamilytreetopControllerEditor extends FamilytreetopController
{
    public function addParent(){
        $app = JFactory::getApplication();
        $form = $app->input->post->get('editProfile', array(), 'array');
        $gedcom_id = $app->input->post->get('gedcom_id', false);

        $gedcom = GedcomHelper::getInstance();

        $ind = $gedcom->individuals->get($gedcom_id);
        if($ind->isParents()){
            return false;
        }

        $gender = (int)$form['gender'];

        $sircar = $gedcom->individuals->get();
        $sircar->tree_id = $ind->tree_id;
        $sircar->gender = $gender;
        $sircar->first_name = $form['first_name'];
        $sircar->middle_name = $form['middle_name'];
        $sircar->last_name = $form['last_name'];
        $sircar->know_as = $form['know_as'];
        $sircar->creator_id = $ind->gedcom_id;
        $sircar->save();

        $spouse = $gedcom->individuals->get();
        $spouse->tree_id = $ind->tree_id;
        $spouse->gender = ($gender)?0:1;
        $spouse->first_name = "unknown";
        $spouse->creator_id = $ind->gedcom_id;
        $spouse->save();

        $family = $gedcom->families->get();
        $family->tree_id = $ind->tree_id;
        if($gender){
            $family->husb = $sircar->gedcom_id;
            $family->wife = $spouse->gedcom_id;
        } else {
            $family->wife = $sircar->gedcom_id;
            $family->husb = $spouse->gedcom_id;
        }
        $family->save();
        $family->addChild($ind->gedcom_id);

        echo json_encode(array('family' => $family, 'sircar'=>$sircar, 'spouse'=>$spouse));
        exit;
    }

    public function addSibling(){
        $app = JFactory::getApplication();
        $form = $app->input->post->get('editProfile', array(), 'array');
        $gedcom_id = $app->input->post->get('gedcom_id', false);

    }

    public function addSpouse(){
        $app = JFactory::getApplication();
        $form = $app->input->post->get('editProfile', array(), 'array');
        $gedcom_id = $app->input->post->get('gedcom_id', false);

    }

    public function addChild(){
        $app = JFactory::getApplication();
        $form = $app->input->post->get('editProfile', array(), 'array');
        $gedcom_id = $app->input->post->get('gedcom_id', false);
    }

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

        echo json_encode(array('ind'=>$ind, 'form'=>$form));
        exit;
    }

    public function updateUnionsInfo(){}
    public function updateMediasInfo(){}

}
