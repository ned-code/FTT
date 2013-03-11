<?php
defined('_JEXEC') or die;

require_once JPATH_COMPONENT.'/controller.php';

class FamilytreetopControllerEditor extends FamilytreetopController
{

    protected function isEntryValid($form, $type){
        $prefix = substr($type, 0, 1). "_";
        if($form[$prefix.'exist'] == "on") return false;
        return ( $form[$prefix."day"] != 0
            || $form[$prefix."month"] != 0
            || strlen($form[$prefix."year"]) > 0
            || strlen($form[$prefix."city"]) > 0
            || strlen($form[$prefix."state"]) > 0
            || strlen($form[$prefix."country"]) > 0
        );
    }

    protected function setEvent($ind, $type, $form){
        $data = $this->isEntryValid($form, $type);
        $prefix = substr($type, 0, 1). "_";
        $event = $ind->{$type}();

        if(empty($event) && !$data) return false;

        if(!empty($event) && !$data){
            $event->remove();
            return;
        }

        if(empty($event) && $data) {
            $event = GedcomHelper::getInstance()->events->get();
            $event->gedcom_id = $ind->gedcom_id;
        }

        $event->name = ($type == 'birth')?"Birthday":"Deathday";
        $event->type = ($type == 'birth')?"BIRT":"DEAT";
        $event->save();

        if($form[$prefix."day"] != 0
            || $form[$prefix."month"] != 0
            || strlen($form[$prefix."year"]) > 0){
            if(empty($event->date->id)){
                $event->date->event_id = $event->id;
            }

            $date = $event->date;
            $date->start_day = ($form[$prefix."day"] != 0)?$form[$prefix."day"]:null;
            $date->start_month = ($form[$prefix."month"] != 0)?$form[$prefix."month"]:null;
            $date->start_year = (strlen($form[$prefix."year"]) > 0)?$form[$prefix."year"]:null;
            $date->save();
        }

        if(strlen($form[$prefix."city"]) > 0
            || strlen($form[$prefix."state"]) > 0
            || strlen($form[$prefix."country"]) > 0){
            if(empty($event->place->id)){
                $event->place->event_id = $event->id;
            }
            $place = $event->place;
            $place->city = (strlen($form[$prefix."city"]) > 0)?$form[$prefix."city"]:null;
            $place->state = (strlen($form[$prefix."state"]) > 0)?$form[$prefix."state"]:null;
            $place->country = (strlen($form[$prefix."country"]) > 0)?$form[$prefix."country"]:null;
            $place->save();
        }

    }

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

        $this->setEvent($ind, 'birth', $form);
        if((int)$form['living']){
            if($event = $ind->death()){
                $event->remove();
            }
        } else {
            $this->setEvent($ind, 'death', $form);
        }

        echo json_encode(array('ind'=>$ind, 'form'=>$form));
        exit;
    }

    public function updateUnionsInfo(){}
    public function updateMediasInfo(){}

}
