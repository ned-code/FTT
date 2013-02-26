<?php
defined('_JEXEC') or die;

require_once JPATH_COMPONENT.'/controller.php';

class FamilytreetopControllerCreate extends FamilytreetopController
{
	public function tree()
	{
        JSession::checkToken() or jexit(JText::_('JINVALID_TOKEN'));

        $app = JFactory::getApplication();

        $user = $app->input->post->get('User', array(), 'array');
        $father = $app->input->post->get('Father', array(), 'array');
        $mother = $app->input->post->get('Mother', array(), 'array');


	}
}
