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
            $date->type = "EVO";
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

    public function getPostForm($all = false){
        $app = JFactory::getApplication();
        $length = $app->input->post->get('length', false);
        $forms = array();
        for($i=0 ; $i < $length ; $i ++){
            $form = $app->input->post->get('form'.$i, array(), 'array');
            $parseForm = array();
            foreach($form as $el){
                if(preg_match('/\[(.+?)\]/is',$el['name'], $match)){
                    $name = $match[1];
                } else {
                    $name = $el['name'];
                }
                $value = $el['value'];
                $parseForm[$name] = $value;
            }
            $forms[] = $parseForm;
        }
        return ($all || sizeof($forms) > 1)?$forms:$forms[0];
    }

    public function addParent(){
        $form = $this->getPostForm();
        $gedcom_id = $form['gedcom_id'];

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
        $form = $this->getPostForm();
        $gedcom_id = $form['gedcom_id'];

        $gedcom = GedcomHelper::getInstance();

        $user = $gedcom->individuals->get($gedcom_id);
        $parents = $user->getParents();

        if(!$parents || $user->gedcom_id == null){
            return false;
        }

        $ind = $gedcom->individuals->get();
        $ind->first_name = $form['first_name'];
        $ind->middle_name = $form['middle_name'];
        $ind->last_name = $form['last_name'];
        $ind->know_as = $form['know_as'];
        $ind->gender = $form['gender'];
        $ind->creator_id = $user->gedcom_id;
        $ind->save();

        $this->setEvent($ind, 'birth', $form);
        if((int)$form['living']){
            if($event = $ind->death()){
                $event->remove();
            }
        } else {
            $this->setEvent($ind, 'death', $form);
        }

        $parents['family']->addChild($ind->gedcom_id);

        echo json_encode(array('ind'=>$ind, 'form'=>$form));
        exit;
    }

    public function addSpouse(){
        $form = $this->getPostForm();
        $gedcom_id = $form['gedcom_id'];


    }

    public function addChild(){
        $form = $this->getPostForm();
        $gedcom_id = $form['gedcom_id'];

        $gedcom = GedcomHelper::getInstance();

        $user = $gedcom->individuals->get($gedcom_id);

        $ind = $gedcom->individuals->get();
        $ind->first_name = $form['first_name'];
        $ind->middle_name = $form['middle_name'];
        $ind->last_name = $form['last_name'];
        $ind->know_as = $form['know_as'];
        $ind->gender = $form['gender'];
        $ind->creator_id = $user->gedcom_id;
        $ind->save();

        $this->setEvent($ind, 'birth', $form);
        if((int)$form['living']){
            if($event = $ind->death()){
                $event->remove();
            }
        } else {
            $this->setEvent($ind, 'death', $form);
        }

        $spouse_id = $form['spouse'];

        if($user->gender){
            $husb = $user->gedcom_id;
            $wife = $spouse_id;
        } else {
            $husb = $spouse_id;
            $wife = $user->gedcom_id;
        }

        $family = $gedcom->families->getByPartner($husb, $wife);
        $family->addChild($ind->gedcom_id);

        echo json_encode(array('ind'=>$ind, 'form'=>$form));
        exit;
    }

    public function updateUserInfo(){
        $form = $this->getPostForm();
        $gedcom_id = $form['gedcom_id'];

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

    public function updateUnionsInfo(){
        $forms = $this->getPostForm(true);
        $gedcom = GedcomHelper::getInstance();

        foreach($forms as $form){
            if($form['family_id'] != 0){
                $family = $gedcom->families->get($form['family_id']);
                if(empty($family->id) || ($form['gedcom_id'] != $family->husb && $form['gedcom_id'] != $family->wife) ){
                    continue;
                }
                $marr = $family->marriage();
                if(!empty($marr->id) && $form['unknown'] == "on"){
                    $marr->remove();
                } else {
                    $marr->type = "MARR";
                    $marr->name = "Marriage";
                    $marr->family_id = $form['family_id'];
                    $marr->place->city = $form['city'];
                    $marr->place->state = $form['state'];
                    $marr->place->country = $form['country'];
                    $marr->date->type = "EVO";
                    $marr->date->start_day = $form['day'];
                    $marr->date->start_month = $form['month'];
                    $marr->date->start_year = $form['year'];
                    $marr->save();
                }
            }
        }

        echo json_encode(array('forms'=>$forms));
        exit;
    }

    public function unsetAvatar(){
        echo json_encode(array('success'=>true));
        exit;
    }

    public function setAvatar(){
        echo json_encode(array('success'=>true));
        exit;
    }

    public function deletePhoto(){
        echo json_encode(array('success'=>true));
        exit;
    }

}
