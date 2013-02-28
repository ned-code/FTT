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

        $this->setRedirect(JRoute::_("index.php?option=com_familytreetop&view=myfamily",false));
	}
}
