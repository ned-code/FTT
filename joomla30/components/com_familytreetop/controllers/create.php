<?php
defined('_JEXEC') or die;

require_once JPATH_COMPONENT.'/controller.php';

class FamilytreetopControllerCreate extends FamilytreetopController
{

    protected function validateArray($data){
        if(empty($data)) return false;
        foreach($data as $key => $el){
            if(empty($el)) return false;
        }
        return true;
    }

	public function tree()
	{
        JSession::checkToken() or jexit(JText::_('JINVALID_TOKEN'));

        $app = JFactory::getApplication();
        $jUser = JFactory::getUser();
        $gedcom = GedcomHelper::getInstance();
        $object = FamilyTreeTopUserHelper::getInstance()->get();

        $userData = $app->input->post->get('User', array(), 'array');
        $fatherData = $app->input->post->get('Father', array(), 'array');
        $motherData = $app->input->post->get('Mother', array(), 'array');

        if(!$this->validateArray($userData)) {
            $this->setRedirect(JRoute::_("index.php?option=com_familytreetop&view=create&layout=form&error=1" ,false));
        } else if(!$this->validateArray($fatherData)){
            $this->setRedirect(JRoute::_("index.php?option=com_familytreetop&view=create&layout=form&error=2" , false));
        } else if($this->validateArray($motherData)){
            $this->setRedirect(JRoute::_("index.php?option=com_familytreetop&view=create&layout=form&error=3" , false));
        }

        $tree = new FamilyTreeTopTrees();
        $tree->save();

        $ind = $gedcom->individuals->get();
        $ind->tree_id = $tree->id;
        $ind->first_name = $userData['firstName'];
        $ind->last_name = $userData['lastName'];
        $ind->gender = ($userData['gender']=="male")?1:0;
        $ind->save();

        $birthday = explode('/', $object->birthday);
        $event = $gedcom->events->get();
        $event->gedcom_id = $ind->gedcom_id;
        $event->name = "Birthday";
        $event->type = "BIRT";
        $event->save();

        $date = $event->date;
        $date->type = "EVO";
        $date->start_day = (isset($birthday[1]))?$birthday[1]:null;
        $date->start_month = (isset($birthday[0]))?$birthday[0]:null;
        $date->start_year = (isset($birthday[2]))?$birthday[2]:null;
        $date->save();

        $event->date = $date;
        $ind->addEvent($event);

        $father = $gedcom->individuals->get();
        $father->tree_id = $tree->id;
        $father->gender = 1;
        $father->first_name = $fatherData['firstName'];
        $father->last_name = $fatherData['lastName'];
        $father->creator_id = $ind->gedcom_id;
        $father->is_father_line = 1;
        $father->save();

        $mother = $gedcom->individuals->get();
        $mother->tree_id = $tree->id;
        $mother->gender = 0;
        $mother->first_name = $motherData['firstName'];
        $mother->last_name = $motherData['lastName'];
        $mother->creator_id = $ind->gedcom_id;
        $mother->is_mother_line = 1;
        $mother->save();

        $family = $gedcom->families->get();
        $family->tree_id = $tree->id;
        $family->wife = $mother->gedcom_id;
        $family->husb = $father->gedcom_id;
        $family->save();
        $family->addChild($ind->gedcom_id);

        $account = FamilyTreeTopAccounts::find_by_joomla_id($jUser->id);

        $user = new FamilyTreeTopUsers();
        $user->account_id = $account->id;
        $user->gedcom_id = $ind->gedcom_id;
        $user->tree_id = $tree->id;
        $user->role = "admin";
        $user->joyride = 1;
        $user->save();

        $account->current = $user->id;
        $account->facebook_id = $object->facebook_id;
        $account->save();

        $this->setRedirect(JRoute::_("index.php?option=com_familytreetop&view=myfamily",false));
	}
}
