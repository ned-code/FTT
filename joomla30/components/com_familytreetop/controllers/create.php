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

        $indLink = new FamilyTreeTopTreeLinks();
        $indLink->tree_id = $tree->id;
        $indLink->save();

        $individual = new FamilyTreeTopIndividuals();
        $individual->gedcom_id = $indLink->id;
        $individual->gender = ($userData['gender']=="male")?1:0;
        $individual->family_id = 0;
        $individual->creator_id = $indLink->id;
        $individual->save();

        $indName = new FamilyTreeTopNames();
        $indName->gedcom_id = $individual->gedcom_id;
        $indName->first_name = $userData['firstName'];
        $indName->last_name = $userData['lastName'];
        $indName->save();

        $fatherLink = new FamilyTreeTopTreeLinks();
        $fatherLink->tree_id = $tree->id;
        $fatherLink->save();

        $father = new FamilyTreeTopIndividuals();
        $father->gedcom_id = $fatherLink->id;
        $father->gender = 1;
        $father->creator_id = $individual->gedcom_id;
        $father->save();

        $fatherName = new FamilyTreeTopNames();
        $fatherName->gedcom_id = $father->gedcom_id;
        $fatherName->first_name = $fatherData['firstName'];
        $fatherName->last_name = $fatherData['lastName'];
        $fatherName->save();

        $motherLink = new FamilyTreeTopTreeLinks();
        $motherLink->tree_id = $tree->id;
        $motherLink->save();

        $mother = new FamilyTreeTopIndividuals();
        $mother->gedcom_id = $motherLink->id;
        $mother->gender = 0;
        $mother->creator_id = $individual->gedcom_id;
        $mother->save();

        $motherName = new FamilyTreeTopNames();
        $motherName->gedcom_id = $mother->gedcom_id;
        $motherName->first_name = $motherData['firstName'];
        $motherName->last_name = $motherData['lastName'];
        $motherName->save();

        $family = new FamilyTreeTopFamilies();
        $family->husb = $father->gedcom_id;
        $family->wife = $mother->gedcom_id;
        $family->type = "marriage";
        $family->save();

        $children = new FamilyTreeTopChildrens();
        $children->gedcom_id = $individual->gedcom_id;
        $children->family_id = $family->id;
        $children->save();

        $user = new FamilyTreeTopUsers();
        $user->joomla_id = $jUser->id;
        $user->gedcom_id = $individual->gedcom_id;
        $user->tree_id = $tree->id;
        $user->role = "admin";
        $user->save();


        $this->setRedirect(JRoute::_("index.php?option=com_familytreetop&view=myfamily",false));
	}
}
