<?php
defined('_JEXEC') or die;

require_once JPATH_COMPONENT.'/controller.php';

class FamilytreetopControllerFamous extends FamilytreetopController
{
    public function init(){
        $app = JFactory::getApplication();

        $gedcom_id = $app->input->get('gedcom_id');
        $tree_id = $app->input->get('tree_id');

        $famous = FamilyTreeTopFamous::find_by_tree_id_and_gedcom_id($gedcom_id, $tree_id);
        if(empty($famous)){
            $this->setRedirect(JRoute::_("index.php?option=com_familytreetop&view=famous", false));
        }

        $session = JFactory::getSession();
        $session->set('tree_id', $tree_id);
        $session->set('gedcom_id', $gedcom_id);
        $session->set('famous', true);

        $this->setRedirect(JRoute::_("index.php?option=com_familytreetop&view=myfamily", false));
        return;
    }

    public function ext(){
        $session = JFactory::getSession();
        if($session->get('famous')){
            $session->set('tree_id', null);
            $session->set('gedcom_id', null);
            $session->set('famous', false);
        }
        $this->setRedirect(JRoute::_("index.php?option=com_familytreetop&view=famous", false));
        return;
    }
}
