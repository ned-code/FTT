<?php
defined('_JEXEC') or die;

require_once JPATH_COMPONENT.'/controller.php';

class FamilytreetopControllerEditor extends FamilytreetopController
{

    protected function isEntryValid($form, $type){
        $prefix = substr($type, 0, 1). "_";
        if(isset($form[$prefix.'exist']) && $form[$prefix.'exist'] == "on" ) return false;
        return ( $form[$prefix."day"] != 0
            || $form[$prefix."month"] != 0
            || strlen($form[$prefix."year"]) > 0
            || strlen($form[$prefix."city"]) > 0
            || strlen($form[$prefix."state"]) > 0
            || strlen($form[$prefix."country"]) > 0
        );
    }

    protected function setEvent(&$ind, $type, $form){
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

            $event->date = $date;
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

            $event->place = $place;
        }

        $ind->addEvent($event);
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

    protected function sub_arr(&$m, $a){
        foreach($a as $v){
            if(!isset($m[$v])){
                $m[$v] = array();
            }
        }
    }

    protected function getResponse(){
        $arguments = func_get_args();
        $result = array();
        foreach($arguments as $argument){
            foreach($argument as $key => $items){
                foreach($items as $item){
                    if(!isset($result[$key])){
                        $result[$key] = array();
                    }
                    switch($key){
                        case "chi":
                            if(!$item) continue;
                            $this->sub_arr($result[$key], array('all', 'gedcom_id', 'family_id'));

                            $data = array();
                            $data['id'] = $item->id;
                            $data['gedcom_id'] = $item->gedcom_id;
                            $data['family_id'] = $item->family_id;

                            $result[$key]['gedcom_id'][$item->gedcom_id] = $data;
                            $result[$key]['family_id'][$item->family_id] = $data;
                            $result[$key]['all'][$item->id] = $data;
                            break;
                        case "dat":
                        case "pla":
                            if(!empty($item)){
                                foreach($item as $event){
                                    $object = $event->{($key=="dat")?"date":"place"};
                                    if($object != null && $event->id != null){
                                        $result[$key][$event->id] = $object->toList();
                                    }
                                }
                            }
                            break;
                        case "eve":
                            $this->sub_arr($result[$key], array('all', 'gedcom_id', 'family_id'));
                            if(!empty($item)){
                                foreach($item as $event){
                                    $result[$key]['all'][$event->id] = $event->toList();
                                    if($event->family_id != null){
                                        $result[$key]['family_id'][$event->id] = $event->toList();
                                    }
                                    if($event->gedcom_id != null){
                                        $result[$key]['gedcom_id'][$event->id] = $event->toList();
                                    }
                                }
                            }

                            break;
                        case "fam":
                            $this->sub_arr($result[$key], array('gedcom_id', 'family_id'));
                            $el = $item->toList();

                            if($item->husb != null){
                                $result[$key]['gedcom_id'][$item->husb] = array();
                                $result[$key]['gedcom_id'][$item->husb][$item->family_id] = $el;
                            }
                            if($item->wife != null){
                                $result[$key]['gedcom_id'][$item->wife] = array();
                                $result[$key]['gedcom_id'][$item->wife][$item->family_id] = $el;
                            }
                            if($item->family_id){
                                $result[$key]['family_id'][$item->family_id] = $item->toList();
                            }
                            break;
                        case "ind":
                                if($item->gedcom_id != null){
                                    $result[$key][$item->gedcom_id] = $item->toList();
                                }
                            break;
                        case "med":
                        default: break;
                    }
                }
            }
        }
        return json_encode($result);
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

        $this->setEvent($sircar, 'birth', $form);
        if((int)$form['living']){
            if($event = $sircar->death()){
                $event->remove();
            }
        } else {
            $this->setEvent($sircar, 'death', $form);
        }

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
        $child = $family->addChild($ind->gedcom_id);

        echo $this->getResponse(
            array('ind' => array($sircar, $spouse)),
            array('fam' => array($family)),
            array('chi' => array($child)),
            array('eve' => array($sircar->events)),
            array('pla' => array($sircar->events)),
            array('dat' => array($sircar->events))
        );
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

        $child = $parents['family']->addChild($ind->gedcom_id);

        echo $this->getResponse(
            array('ind' => array($ind)),
            array('chi' => array($child)),
            array('eve' => array($ind->events)),
            array('pla' => array($ind->events)),
            array('dat' => array($ind->events))
        );
        exit;
    }

    public function addSpouse(){
        $form = $this->getPostForm();
        $gedcom_id = $form['gedcom_id'];

        $gedcom = GedcomHelper::getInstance();
        $user = $gedcom->individuals->get($gedcom_id);

        $ind = false;
        if($form['autocomplete'] != 0){
            $ind = $gedcom->individuals->get($form['autocomplete']);
        }
        if(!$ind){
            $ind = $gedcom->individuals->get();
            $ind->first_name = $form['first_name'];
            $ind->middle_name = $form['middle_name'];
            $ind->last_name = $form['last_name'];
            $ind->know_as = $form['know_as'];
            $ind->gender = $form['gender'];
            $ind->creator_id = $user->gedcom_id;
            $ind->save();
        }
        $family = $gedcom->families->get();
        $family->tree_id = $ind->tree_id;
        if($user->gender){
            $family->husb = $user->gedcom_id;
            $family->wife = $ind->gedcom_id;
        } else {
            $family->wife = $user->gedcom_id;
            $family->husb = $ind->gedcom_id;
        }
        $family->save();

        echo $this->getResponse(
            array('ind' => array($ind)),
            array('fam' => array($family)),
            array('eve' => array($ind->events)),
            array('pla' => array($ind->events)),
            array('dat' => array($ind->events))
        );
        exit;
    }

    public function addChild(){
        $form = $this->getPostForm();
        $gedcom_id = $form['gedcom_id'];

        $gedcom = GedcomHelper::getInstance();

        $user = $gedcom->individuals->get($gedcom_id);

        $ind = false;
        if($form['autocomplete'] != 0){
            $ind = $gedcom->individuals->get($form['autocomplete']);
        }
        if(!$ind){
            $ind = $gedcom->individuals->get();
            $ind->first_name = $form['first_name'];
            $ind->middle_name = $form['middle_name'];
            $ind->last_name = $form['last_name'];
            $ind->know_as = $form['know_as'];
            $ind->gender = $form['gender'];
            $ind->creator_id = $user->gedcom_id;
            $ind->save();
        }
        $this->setEvent($ind, 'birth', $form);
        if((int)$form['living']){
            if($event = $ind->death()){
                $event->remove();
            }
        } else {
            $this->setEvent($ind, 'death', $form);
        }

        $spouse = false;
        if($form['spouse'] == 0){
            $spouse = $gedcom->individuals->get();
            $spouse->first_name = "unknown";
            $spouses->gender = $user->gender?0:1;
            $spouse->creator_id = $user->gedcom_id;
            $spouse->save();
            $spouse_id = $spouse->gedcom_id;
        } else {
            $spouse_id = $form['spouse'];
        }

        if($user->gender){
            $husb = $user->gedcom_id;
            $wife = $spouse_id;
        } else {
            $husb = $spouse_id;
            $wife = $user->gedcom_id;
        }

        if($spouse){
            $family = $gedcom->families->get();
            $family->tree_id = $user->tree_id;
            $family->husb = $husb;
            $family->wife = $wife;
            $family->save();
        } else {
            $family = $gedcom->families->getByPartner($husb, $wife);
        }

        $child = $family->addChild($ind->gedcom_id);

        $arrInd = array();
        $arrInd[] = $ind;
        if($spouse){
            $arrInd[] = $spouse;
        }

        $fam = array();
        if($spouse){
            $fam[] = $family;
        }

        echo $this->getResponse(
            array('ind' => $arrInd),
            array('chi' => array($child)),
            array('fam' => $fam),
            array('eve' => array($ind->events)),
            array('pla' => array($ind->events)),
            array('dat' => array($ind->events))
        );
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

        echo $this->getResponse(
            array('ind' => array($ind)),
            array('eve' => array($ind->events)),
            array('pla' => array($ind->events)),
            array('dat' => array($ind->events))
        );
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
        $app = JFactory::getApplication();
        $media_id = $app->input->post->get('id', false);
        if(!$media_id){
            echo json_encode(array('success'=>false));
            exit;
        }

        $gedcom = GedcomHelper::getInstance();
        $media = $gedcom->medias->getById($media_id);
        $media->unsetAvatar();

        echo json_encode(array('success'=>true));
        exit;
    }

    public function setAvatar(){
        $app = JFactory::getApplication();
        $media_id = $app->input->post->get('id', false);
        if(!$media_id){
            echo json_encode(array('success'=>false));
            exit;
        }

        $gedcom = GedcomHelper::getInstance();
        $media = $gedcom->medias->getById($media_id);
        $media->setAvatar();

        echo json_encode(array('success'=>true));
        exit;
    }

    public function deletePhoto(){
        $app = JFactory::getApplication();
        $media_id = $app->input->post->get('id', false);
        if(!$media_id){
            echo json_encode(array('success'=>false));
            exit;
        }


        $gedcom = GedcomHelper::getInstance();
        $media = $gedcom->medias->getById($media_id);
        $media->remove();

        echo json_encode(array('success'=>true));
        exit;
    }

    public function setUnion(){
        $app = JFactory::getApplication();
        $gedcom = GedcomHelper::getInstance();

        $gedcom_id = $app->input->post->get('gedcom_id', false);
        $family_id = $app->input->post->get('family_id', false);

        $user = $gedcom->individuals->get($gedcom_id);
        $user->family_id = $family_id;
        $user->save();

        echo json_encode(array('gedcom_id'=>$gedcom_id, 'family_id'=>$family_id));
        exit;
    }

    public function delete(){
        $app = JFactory::getApplication();
        $gedcom = GedcomHelper::getInstance();

        $type = $app->input->post->get('type', false);
        $gedcom_id = $app->input->post->get('gedcom_id', false);

        $user = $gedcom->individuals->get($gedcom_id);

        switch((int)$type){
            case 1:
                $user->unregister();
                break;
            case 2:
                $user->clear();
                break;
            case 3:
                $d = $user->isCanBeDetele();
                if(gettype($d) != "boolean"){
                    $spouse = $gedcom->individuals->get($d);
                    $user->delete();
                    if($spouse){
                        $spouse->delete();
                    }
                } else {
                    $user->delete();
                }
                break;

            case 4:
                $user = $user->deleteTree();
                break;
        }
        echo json_encode(array('user'=>$user));
        exit;
    }

}
